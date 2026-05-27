import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateMockNegotiationPackage } from "@/lib/mock-data";
import { parseNegotiationBrief } from "@/lib/negotiation-brief";
import { format } from "date-fns";
import type { NegotiationBrief } from "@/types";

export async function POST(request: Request) {
  const { tripId, hotelIds, brief: briefBody } = await request.json();

  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    include: {
      hotels: {
        where: { id: { in: hotelIds } },
        include: { offers: true },
      },
    },
  });

  if (!trip) return NextResponse.json({ error: "Trip not found" }, { status: 404 });

  const brief: NegotiationBrief | null =
    briefBody ?? parseNegotiationBrief(trip.negotiationBrief);

  if (!brief?.userConsentAt) {
    return NextResponse.json(
      { error: "Negotiation brief with user consent is required" },
      { status: 400 }
    );
  }

  await prisma.trip.update({
    where: { id: tripId },
    data: {
      status: "negotiating",
      negotiationBrief: JSON.stringify(brief),
    },
  });

  await prisma.negotiationCall.deleteMany({
    where: { tripId, hotelId: { in: hotelIds } },
  });

  const results = [];

  for (const hotel of trip.hotels) {
    const cheapestOffer = hotel.offers.reduce(
      (min, o) => (o.pricePerNight < min.pricePerNight ? o : min),
      hotel.offers[0]
    );

    if (!cheapestOffer) continue;

    const checkInStr = format(trip.checkIn, "MMM d, yyyy");
    const checkOutStr = format(trip.checkOut, "MMM d, yyyy");

    const { success, result } = generateMockNegotiationPackage(
      cheapestOffer.pricePerNight,
      hotel.name,
      checkInStr,
      checkOutStr,
      trip.guests,
      trip.rooms,
      brief
    );

    const status = success
      ? "completed"
      : result.durationMs < 15000
        ? "no_answer"
        : "failed";

    const call = await prisma.negotiationCall.create({
      data: {
        hotelId: hotel.id,
        tripId,
        callId: result.callId,
        status,
        originalPrice: result.originalPrice,
        negotiatedPrice: result.negotiatedPrice,
        discountPercent: result.discountPercent,
        securedPerks: JSON.stringify(result.securedPerks),
        packageSummary: JSON.stringify(result.packageSummary),
        totalPerkValue: result.totalPerkValue,
        durationMs: result.durationMs,
        notes: success ? "Value-add package secured" : status === "no_answer" ? "No answer" : "No perks available",
        completedAt: new Date(),
      },
    });

    results.push({
      hotelName: hotel.name,
      callId: call.callId,
      success,
      originalPrice: result.originalPrice,
      negotiatedPrice: result.negotiatedPrice,
      totalPerkValue: result.totalPerkValue,
      securedPerks: result.securedPerks,
      durationMs: result.durationMs,
    });
  }

  const completedTrips = await prisma.trip.findUnique({
    where: { id: tripId },
    include: {
      hotels: {
        include: {
          offers: true,
          negotiations: true,
        },
      },
      negotiations: true,
    },
  });

  return NextResponse.json({ results, trip: completedTrips });
}
