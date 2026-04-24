import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateMockNegotiation } from "@/lib/mock-data";
import { format } from "date-fns";

export async function POST(request: Request) {
  const { tripId, hotelIds } = await request.json();

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

  await prisma.trip.update({
    where: { id: tripId },
    data: { status: "negotiating" },
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

    const { success, result } = generateMockNegotiation(
      cheapestOffer.pricePerNight,
      hotel.name,
      checkInStr,
      checkOutStr,
      trip.guests,
      trip.rooms
    );

    const call = await prisma.negotiationCall.create({
      data: {
        hotelId: hotel.id,
        tripId,
        callId: result.callId,
        status: success ? "completed" : result.durationMs < 15000 ? "no_answer" : "failed",
        originalPrice: result.originalPrice,
        negotiatedPrice: result.negotiatedPrice,
        discountPercent: result.discountPercent,
        transcript: JSON.stringify(result.transcript),
        durationMs: result.durationMs,
        notes: success ? "Negotiation successful" : result.durationMs < 15000 ? "No answer" : "Hotel declined to negotiate",
        completedAt: new Date(),
      },
    });

    results.push({
      hotelName: hotel.name,
      callId: call.callId,
      success,
      originalPrice: result.originalPrice,
      negotiatedPrice: result.negotiatedPrice,
      discountPercent: result.discountPercent,
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
