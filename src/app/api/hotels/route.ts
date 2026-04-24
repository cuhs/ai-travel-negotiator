import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getMockHotels } from "@/lib/mock-data";

export async function POST(request: Request) {
  const { tripId } = await request.json();

  const trip = await prisma.trip.findUnique({ where: { id: tripId } });
  if (!trip) return NextResponse.json({ error: "Trip not found" }, { status: 404 });

  await prisma.hotel.deleteMany({ where: { tripId } });

  const mockHotels = getMockHotels(trip.cityCode, trip.checkIn, trip.checkOut, trip.guests, trip.rooms);

  const filtered = trip.starRating ? mockHotels.filter((h) => h.starRating >= (trip.starRating ?? 0)) : mockHotels;

  for (const hotel of filtered) {
    const dbHotel = await prisma.hotel.create({
      data: {
        tripId,
        name: hotel.name,
        address: hotel.address,
        city: hotel.city,
        lat: hotel.lat,
        lng: hotel.lng,
        phone: hotel.phone,
        rating: hotel.rating,
        starRating: hotel.starRating,
        photoUrl: hotel.photoUrl,
        description: hotel.description,
        amenities: hotel.amenities.join(", "),
      },
    });

    for (const offer of hotel.offers) {
      if (offer.pricePerNight >= trip.budgetMin && offer.pricePerNight <= trip.budgetMax) {
        await prisma.hotelOffer.create({
          data: {
            hotelId: dbHotel.id,
            roomType: offer.roomType,
            boardType: offer.boardType,
            pricePerNight: offer.pricePerNight,
            totalPrice: offer.totalPrice,
            currency: offer.currency,
            cancellationPolicy: offer.cancellationPolicy,
            provider: offer.provider,
          },
        });
      }
    }

    const hasOffers = await prisma.hotelOffer.count({ where: { hotelId: dbHotel.id } });
    if (hasOffers === 0) {
      await prisma.hotel.delete({ where: { id: dbHotel.id } });
    }
  }

  await prisma.trip.update({
    where: { id: tripId },
    data: { status: "searching" },
  });

  const result = await prisma.trip.findUnique({
    where: { id: tripId },
    include: {
      hotels: {
        include: { offers: true },
      },
    },
  });

  return NextResponse.json(result);
}
