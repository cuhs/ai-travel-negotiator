"use client";

import { useState, useEffect } from "react";
import { HotelCard } from "./hotel-card";
import { Search, ArrowUpDown, Loader2 } from "lucide-react";

interface Hotel {
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
}

interface HotelGridProps {
  tripId: string;
  onSelectionChange: (ids: string[]) => void;
}

type SortKey = "price" | "rating" | "stars";

export function HotelGrid({ tripId, onSelectionChange }: HotelGridProps) {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortKey>("price");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      const res = await fetch("/api/hotels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tripId }),
      });
      const data = await res.json();
      if (!cancelled) {
        setHotels(data.hotels || []);
        setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [tripId]);

  const toggle = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
    onSelectionChange(Array.from(next));
  };

  const selectAll = () => {
    if (selected.size === hotels.length) {
      setSelected(new Set());
      onSelectionChange([]);
    } else {
      const all = new Set(hotels.map((h) => h.id));
      setSelected(all);
      onSelectionChange(Array.from(all));
    }
  };

  const sorted = [...hotels].sort((a, b) => {
    switch (sortBy) {
      case "price": {
        const aMin = a.offers.length ? Math.min(...a.offers.map((o) => o.pricePerNight)) : Infinity;
        const bMin = b.offers.length ? Math.min(...b.offers.map((o) => o.pricePerNight)) : Infinity;
        return aMin - bMin;
      }
      case "rating":
        return (b.rating ?? 0) - (a.rating ?? 0);
      case "stars":
        return b.starRating - a.starRating;
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Searching hotels...</p>
      </div>
    );
  }

  if (hotels.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-lg font-medium">No hotels found</p>
        <p className="mt-1 text-muted-foreground">Try adjusting your budget or star rating preferences.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">{hotels.length} hotels found</span>
          <button
            onClick={selectAll}
            className="text-xs text-primary hover:underline"
          >
            {selected.size === hotels.length ? "Deselect all" : "Select all"}
          </button>
        </div>
        <div className="flex items-center gap-2">
          <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortKey)}
            className="rounded-md border px-2 py-1 text-xs focus:border-primary focus:outline-none"
          >
            <option value="price">Sort by price</option>
            <option value="rating">Sort by rating</option>
            <option value="stars">Sort by stars</option>
          </select>
        </div>
      </div>
      <div className="space-y-3">
        {sorted.map((hotel) => (
          <HotelCard
            key={hotel.id}
            hotel={hotel}
            selected={selected.has(hotel.id)}
            onToggle={toggle}
          />
        ))}
      </div>
    </div>
  );
}
