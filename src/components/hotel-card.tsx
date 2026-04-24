"use client";

import { useState } from "react";
import { Star, MapPin, Phone, ChevronDown, ChevronUp } from "lucide-react";

interface HotelCardProps {
  hotel: {
    id: string;
    name: string;
    address: string;
    city: string;
    rating: number | null;
    starRating: number;
    photoUrl: string | null;
    description: string | null;
    amenities: string | null;
    phone: string;
    offers: {
      id: string;
      roomType: string;
      boardType: string;
      pricePerNight: number;
      totalPrice: number;
      currency: string;
      cancellationPolicy: string | null;
    }[];
  };
  selected: boolean;
  onToggle: (id: string) => void;
}

export function HotelCard({ hotel, selected, onToggle }: HotelCardProps) {
  const [expanded, setExpanded] = useState(false);
  const cheapest = hotel.offers.reduce((min, o) => (o.pricePerNight < min ? o.pricePerNight : min), Infinity);

  return (
    <div
      className={`rounded-lg border transition-all ${
        selected ? "border-primary ring-2 ring-primary/20" : "hover:border-primary/50"
      }`}
    >
      <div className="p-4">
        <div className="flex gap-4">
          <div className="h-24 w-32 flex-shrink-0 rounded-md bg-muted flex items-center justify-center text-xs text-muted-foreground">
            {hotel.starRating}★ Hotel
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold leading-tight">{hotel.name}</h3>
                <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />
                  {hotel.address}
                </div>
                <div className="mt-0.5 flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-3.5 w-3.5" />
                  {hotel.phone}
                </div>
              </div>
              <div className="text-right">
                {cheapest !== Infinity && (
                  <>
                    <div className="text-lg font-bold text-primary">${cheapest.toFixed(0)}</div>
                    <div className="text-xs text-muted-foreground">per night</div>
                  </>
                )}
              </div>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: hotel.starRating }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-warning text-warning" />
                ))}
              </div>
              {hotel.rating && (
                <span className="text-sm font-medium">{hotel.rating}</span>
              )}
              <span className="text-xs text-muted-foreground">· {hotel.offers.length} offers</span>
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={selected}
              onChange={() => onToggle(hotel.id)}
              className="rounded border-border accent-primary"
            />
            Select for negotiation
          </label>
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            {expanded ? "Hide" : "Show"} offers
            {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>
        </div>

        {expanded && (
          <div className="mt-3 space-y-2 border-t pt-3">
            {hotel.offers.map((offer) => (
              <div key={offer.id} className="flex items-center justify-between rounded-md bg-muted/50 px-3 py-2 text-sm">
                <div>
                  <span className="font-medium">{offer.roomType}</span>
                  <span className="text-muted-foreground"> · {offer.boardType}</span>
                </div>
                <div className="text-right">
                  <div className="font-medium">${offer.pricePerNight.toFixed(2)}/night</div>
                  <div className="text-xs text-muted-foreground">${offer.totalPrice.toFixed(2)} total</div>
                </div>
              </div>
            ))}
            {hotel.description && (
              <p className="text-xs text-muted-foreground mt-2">{hotel.description}</p>
            )}
            {hotel.amenities && (
              <div className="flex flex-wrap gap-1 mt-1">
                {hotel.amenities.split(", ").map((a) => (
                  <span key={a} className="rounded-full bg-muted px-2 py-0.5 text-xs">{a}</span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
