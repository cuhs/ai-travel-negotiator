import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const trips = await prisma.trip.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      hotels: {
        include: {
          offers: true,
          negotiations: true,
        },
      },
      decision: true,
    },
  });
  return NextResponse.json(trips);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { destination, cityCode, checkIn, checkOut, guests, rooms, budgetMin, budgetMax, currency, starRating, notes } = body;

    const trip = await prisma.trip.create({
      data: {
        destination,
        cityCode,
        checkIn: new Date(checkIn),
        checkOut: new Date(checkOut),
        guests: guests ?? 1,
        rooms: rooms ?? 1,
        budgetMin: budgetMin ?? 0,
        budgetMax: budgetMax ?? 9999,
        currency: currency ?? "USD",
        starRating,
        notes,
        status: "draft",
      },
    });

    return NextResponse.json(trip);
  } catch (error: unknown) {
    console.error("POST /api/trips error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
