"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { HotelGrid } from "@/components/hotel-grid";
import { ResultsTable } from "@/components/results-table";
import { Phone, Loader2, Calendar, MapPin, Users, DollarSign } from "lucide-react";
import { format } from "date-fns";

interface TripData {
  id: string;
  destination: string;
  cityCode: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  rooms: number;
  budgetMin: number;
  budgetMax: number;
  currency: string;
  starRating: number | null;
  notes: string | null;
  status: string;
  hotels: {
    id: string;
    name: string;
    negotiations: {
      id: string;
      status: string;
      originalPrice: number | null;
      negotiatedPrice: number | null;
      discountPercent: number | null;
      transcript: string | null;
      durationMs: number | null;
    }[];
    offers: {
      id: string;
      roomType: string;
      boardType: string;
      pricePerNight: number;
    }[];
  }[];
  decision: { id: string; hotelId: string; status: string } | null;
}

export default function TripDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [trip, setTrip] = useState<TripData | null>(null);
  const [selectedHotels, setSelectedHotels] = useState<string[]>([]);
  const [negotiating, setNegotiating] = useState(false);
  const [negotiationResults, setNegotiationResults] = useState<TripData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/trips/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setTrip(data);
        setLoading(false);
      });
  }, [id]);

  const startNegotiation = async () => {
    if (selectedHotels.length === 0) return;
    setNegotiating(true);
    try {
      const res = await fetch("/api/negotiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tripId: id, hotelIds: selectedHotels }),
      });
      const data = await res.json();
      setNegotiationResults(data.trip);
    } finally {
      setNegotiating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="py-20 text-center">
        <p className="text-lg font-medium">Trip not found</p>
        <button onClick={() => router.push("/dashboard")} className="mt-4 text-primary hover:underline">
          Back to dashboard
        </button>
      </div>
    );
  }

  const hasNegotiations = negotiationResults
    ? negotiationResults.hotels.some((h) => h.negotiations.length > 0)
    : trip.hotels.some((h) => h.negotiations.length > 0);

  const nights = Math.max(
    1,
    Math.round((new Date(trip.checkOut).getTime() - new Date(trip.checkIn).getTime()) / (1000 * 60 * 60 * 24))
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{trip.destination}</h1>
        <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {format(new Date(trip.checkIn), "MMM d")} — {format(new Date(trip.checkOut), "MMM d, yyyy")} ({nights} nights)
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {trip.guests} guest(s), {trip.rooms} room(s)
          </span>
          <span className="flex items-center gap-1">
            <DollarSign className="h-4 w-4" />
            ${trip.budgetMin} — ${trip.budgetMax}/night
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {trip.destination}
          </span>
        </div>
      </div>

      {!hasNegotiations ? (
        <div>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Available Hotels</h2>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">
                {selectedHotels.length} selected
              </span>
              <button
                onClick={startNegotiation}
                disabled={selectedHotels.length === 0 || negotiating}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {negotiating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Negotiating...
                  </>
                ) : (
                  <>
                    <Phone className="h-4 w-4" />
                    Negotiate ({selectedHotels.length})
                  </>
                )}
              </button>
            </div>
          </div>
          <HotelGrid tripId={id} onSelectionChange={setSelectedHotels} />
        </div>
      ) : (
        <div>
          <div className="mb-6">
            <h2 className="text-xl font-semibold">Negotiation Results</h2>
            <p className="text-sm text-muted-foreground">
              Review the negotiated prices and approve the best option for your trip.
            </p>
          </div>
          <ResultsTable
            tripId={id}
            negotiations={(negotiationResults || trip).hotels
              .filter((h) => h.negotiations.length > 0)
              .map((h) => {
                const neg = h.negotiations[0];
                return {
                  hotelId: h.id,
                  hotelName: h.name,
                  starRating: h.offers[0] ? 0 : 0,
                  rating: null,
                  originalPrice: neg.originalPrice,
                  negotiatedPrice: neg.negotiatedPrice,
                  discountPercent: neg.discountPercent,
                  status: neg.status,
                  transcript: neg.transcript ? JSON.parse(neg.transcript) : null,
                  durationMs: neg.durationMs,
                  offerRoomType: h.offers[0]?.roomType ?? "",
                  offerBoardType: h.offers[0]?.boardType ?? "",
                };
              })}
          />
        </div>
      )}
    </div>
  );
}
