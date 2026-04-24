"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Calendar, MapPin, ArrowRight, Trash2, Loader2 } from "lucide-react";
import { format } from "date-fns";

interface Trip {
  id: string;
  destination: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  status: string;
  budgetMin: number;
  budgetMax: number;
  hotels: { id: string }[];
  decision: { status: string } | null;
  createdAt: string;
}

export default function DashboardPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/trips")
      .then((r) => r.json())
      .then((data) => {
        setTrips(data);
        setLoading(false);
      });
  }, []);

  const deleteTrip = async (id: string) => {
    await fetch(`/api/trips/${id}`, { method: "DELETE" });
    setTrips((prev) => prev.filter((t) => t.id !== id));
  };

  const statusColors: Record<string, string> = {
    draft: "bg-muted text-muted-foreground",
    searching: "bg-accent text-accent-foreground",
    negotiating: "bg-warning/10 text-warning",
    completed: "bg-success/10 text-success",
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Your Trips</h1>
          <p className="mt-1 text-muted-foreground">Manage your travel plans and negotiations</p>
        </div>
        <Link
          href="/trip/new"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          New Trip
        </Link>
      </div>

      {trips.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed p-12 text-center">
          <MapPin className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No trips yet</h3>
          <p className="mt-1 text-muted-foreground">Create your first trip and let AI find the best hotel deals.</p>
          <Link
            href="/trip/new"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Plan a Trip
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {trips.map((trip) => (
            <div key={trip.id} className="group rounded-lg border p-4 transition-all hover:border-primary/50 hover:shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{trip.destination}</h3>
                  <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    {format(new Date(trip.checkIn), "MMM d")} — {format(new Date(trip.checkOut), "MMM d, yyyy")}
                  </div>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[trip.status] || statusColors.draft}`}>
                  {trip.status}
                </span>
              </div>
              <div className="mt-3 text-sm text-muted-foreground">
                {trip.guests} guest(s) · ${trip.budgetMin}–${trip.budgetMax}/night · {trip.hotels.length} hotels
              </div>
              <div className="mt-4 flex items-center justify-between">
                <Link
                  href={`/trip/${trip.id}`}
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  View details
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <button
                  onClick={() => deleteTrip(trip.id)}
                  className="text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
