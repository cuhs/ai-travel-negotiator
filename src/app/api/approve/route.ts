import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const { tripId, hotelId, finalPrice } = await request.json();

  const existing = await prisma.tripDecision.findUnique({ where: { tripId } });
  if (existing) {
    const updated = await prisma.tripDecision.update({
      where: { tripId },
      data: { hotelId, finalPrice, status: "approved" },
    });
    await prisma.trip.update({ where: { id: tripId }, data: { status: "completed" } });
    return NextResponse.json(updated);
  }

  const decision = await prisma.tripDecision.create({
    data: {
      tripId,
      hotelId,
      finalPrice,
      status: "approved",
    },
  });

  await prisma.trip.update({ where: { id: tripId }, data: { status: "completed" } });

  return NextResponse.json(decision);
}
