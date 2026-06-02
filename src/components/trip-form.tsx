"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, MapPin, Calendar, Users, DollarSign, Star, CheckCircle } from "lucide-react";
import type { ActivityCategoryId, MockCity } from "@/types";

const STEPS = [
  { id: "destination", title: "Where to?", icon: MapPin },
  { id: "dates", title: "When?", icon: Calendar },
  { id: "guests", title: "Who's going?", icon: Users },
  { id: "budget", title: "Trip budget", icon: DollarSign },
  { id: "preferences", title: "Concierge style", icon: Star },
  { id: "review", title: "Review", icon: CheckCircle },
];

const ACTIVITY_CATEGORY_OPTIONS: { id: ActivityCategoryId; label: string; description: string }[] = [
  { id: "active", label: "Active", description: "Movement, outdoors, sports, or hands-on experiences." },
  { id: "relaxed", label: "Relaxed", description: "Low-pressure plans, downtime, wellness, and scenic pacing." },
  { id: "social", label: "Social", description: "Crowds, events, nightlife, and places with a lively scene." },
  { id: "private_group", label: "Private group", description: "Experiences that keep your party together." },
  { id: "solo_friendly", label: "Solo-friendly", description: "Easy to enjoy independently without a group." },
  { id: "food_nightlife", label: "Food & nightlife", description: "Restaurants, bars, tastings, and evening plans." },
  { id: "culture_sights", label: "Culture & sights", description: "Museums, landmarks, tours, and local history." },
];

const MIN_BUDGET = 0;
const MAX_BUDGET = 1000;
const BUDGET_STEP = 10;

function clampBudget(value: number) {
  return Math.min(MAX_BUDGET, Math.max(MIN_BUDGET, value));
}

export function TripForm() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [cities, setCities] = useState<MockCity[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    destination: "",
    cityCode: "",
    checkIn: "",
    checkOut: "",
    guests: 2,
    rooms: 1,
    budgetMin: 50,
    budgetMax: 500,
    currency: "USD",
    starRating: 0,
    notes: "",
    activityBrief: {
      categories: [] as ActivityCategoryId[],
      request: "",
    },
  });

  useEffect(() => {
    fetch("/api/cities")
      .then((r) => r.json())
      .then(setCities);
  }, []);

  const update = (field: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateBudgetMin = (value: number) => {
    setForm((prev) => ({
      ...prev,
      budgetMin: Math.min(clampBudget(value), prev.budgetMax - BUDGET_STEP),
    }));
  };

  const updateBudgetMax = (value: number) => {
    setForm((prev) => ({
      ...prev,
      budgetMax: Math.max(clampBudget(value), prev.budgetMin + BUDGET_STEP),
    }));
  };

  const toggleActivityCategory = (category: ActivityCategoryId) => {
    setForm((prev) => {
      const categories = prev.activityBrief.categories.includes(category)
        ? prev.activityBrief.categories.filter((item) => item !== category)
        : [...prev.activityBrief.categories, category];
      return {
        ...prev,
        activityBrief: {
          ...prev.activityBrief,
          categories,
        },
      };
    });
  };

  const updateActivityRequest = (request: string) => {
    setForm((prev) => ({
      ...prev,
      activityBrief: {
        ...prev.activityBrief,
        request,
      },
    }));
  };

  const selectCity = (city: MockCity) => {
    setForm((prev) => ({
      ...prev,
      destination: `${city.name}, ${city.country}`,
      cityCode: city.code,
      budgetMin: city.priceRange[0],
      budgetMax: city.priceRange[1],
    }));
    setStep(1);
  };

  const canProceed = () => {
    switch (step) {
      case 0:
        return !!form.cityCode;
      case 1:
        return !!form.checkIn && !!form.checkOut;
      case 2:
        return form.guests >= 1 && form.rooms >= 1;
      case 3:
        return form.budgetMax > form.budgetMin;
      case 4:
        return true;
      case 5:
        return true;
      default:
        return false;
    }
  };

  const submit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          activityBrief: {
            ...form.activityBrief,
            createdAt: new Date().toISOString(),
          },
        }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`API error ${res.status}: ${text || "empty response"}`);
      }
      const trip = await res.json();
      router.push(`/trip/${trip.id}`);
    } catch (err) {
      console.error("Submit failed:", err);
      alert("Failed to create trip. Check the console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {STEPS.map((s, i) => (
            <button
              key={s.id}
              onClick={() => i < step && setStep(i)}
              className={`flex flex-col items-center gap-1 ${i <= step ? "text-primary" : "text-muted-foreground"} transition-colors`}
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium ${
                  i < step
                    ? "bg-primary text-primary-foreground"
                    : i === step
                    ? "border-2 border-primary text-primary"
                    : "border border-border text-muted-foreground"
                }`}
              >
                {i < step ? <CheckCircle className="h-4 w-4" /> : i + 1}
              </div>
              <span className="hidden text-xs sm:block">{s.title}</span>
            </button>
          ))}
        </div>
        <div className="mt-2 h-1 rounded-full bg-muted">
          <div
            className="h-1 rounded-full bg-primary transition-all"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="rounded-lg border bg-background p-6 sm:p-8">
        {step === 0 && (
          <div>
            <h2 className="text-2xl font-bold">Where are you headed?</h2>
            <p className="mt-1 text-muted-foreground">Select your destination city</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {cities.map((city) => (
                <button
                  key={city.code}
                  onClick={() => selectCity(city)}
                  className={`rounded-lg border p-4 text-left transition-all hover:border-primary hover:shadow-sm ${
                    form.cityCode === city.code ? "border-primary bg-accent" : ""
                  }`}
                >
                  <div className="font-medium">{city.name}</div>
                  <div className="text-sm text-muted-foreground">{city.country}</div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    ${city.priceRange[0]} — ${city.priceRange[1]}/night
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <h2 className="text-2xl font-bold">When are you traveling?</h2>
            <p className="mt-1 text-muted-foreground">Select your check-in and check-out dates</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium">Check-in</label>
                <input
                  type="date"
                  value={form.checkIn}
                  onChange={(e) => update("checkIn", e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Check-out</label>
                <input
                  type="date"
                  value={form.checkOut}
                  onChange={(e) => update("checkOut", e.target.value)}
                  min={form.checkIn || new Date().toISOString().split("T")[0]}
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
            {form.checkIn && form.checkOut && (
              <div className="mt-4 rounded-lg bg-accent p-3 text-sm text-accent-foreground">
                {Math.max(
                  1,
                  Math.round(
                    (new Date(form.checkOut).getTime() - new Date(form.checkIn).getTime()) / (1000 * 60 * 60 * 24)
                  )
                )}{" "}
                night(s) stay
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-2xl font-bold">Who&apos;s traveling?</h2>
            <p className="mt-1 text-muted-foreground">How many guests and rooms?</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium">Number of guests</label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={form.guests}
                  onChange={(e) => update("guests", parseInt(e.target.value) || 1)}
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Number of rooms</label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={form.rooms}
                  onChange={(e) => update("rooms", parseInt(e.target.value) || 1)}
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-2xl font-bold">What&apos;s your trip budget?</h2>
            <p className="mt-1 text-muted-foreground">Set the nightly lodging range your concierge should work within</p>
            <div className="mt-6 space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Minimum: <span className="text-primary">${form.budgetMin}</span>/night
                </label>
                <input
                  type="range"
                  min={MIN_BUDGET}
                  max={Math.max(MIN_BUDGET, form.budgetMax - BUDGET_STEP)}
                  step={BUDGET_STEP}
                  value={form.budgetMin}
                  onChange={(e) => updateBudgetMin(parseInt(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Maximum: <span className="text-primary">${form.budgetMax}</span>/night
                </label>
                <input
                  type="range"
                  min={Math.min(MAX_BUDGET, form.budgetMin + BUDGET_STEP)}
                  max={MAX_BUDGET}
                  step={BUDGET_STEP}
                  value={form.budgetMax}
                  onChange={(e) => updateBudgetMax(parseInt(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>
              <div className="rounded-lg bg-accent p-3 text-sm text-accent-foreground">
                Looking for stays between ${form.budgetMin} and ${form.budgetMax} per night
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h2 className="text-2xl font-bold">What do you want to do?</h2>
            <p className="mt-1 text-muted-foreground">Optional — give the concierge direction for stays, activities, and local plans</p>
            <div className="mt-6 space-y-5">
              <div>
                <label className="mb-1.5 block text-sm font-medium">Preferred stay quality</label>
                <div className="flex gap-2">
                  {[0, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => update("starRating", rating)}
                      className={`rounded-lg border px-4 py-2 text-sm transition-colors ${
                        form.starRating === rating ? "border-primary bg-accent text-primary" : "hover:border-primary"
                      }`}
                    >
                      {rating === 0 ? "Any" : `${rating}★+`}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Activity style</label>
                <div className="grid gap-3 sm:grid-cols-2">
                  {ACTIVITY_CATEGORY_OPTIONS.map((category) => (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => toggleActivityCategory(category.id)}
                      className={`rounded-lg border p-3 text-left transition-colors ${
                        form.activityBrief.categories.includes(category.id)
                          ? "border-primary bg-accent text-primary"
                          : "hover:border-primary"
                      }`}
                    >
                      <div className="text-sm font-medium">{category.label}</div>
                      <div className="mt-1 text-xs text-muted-foreground">{category.description}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">What should the concierge look for?</label>
                <textarea
                  value={form.activityBrief.request}
                  onChange={(e) => updateActivityRequest(e.target.value)}
                  placeholder="e.g., Find a private food tour, relaxed outdoor activities, and one memorable local event."
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  rows={3}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Additional concierge notes</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => update("notes", e.target.value)}
                  placeholder="e.g., Accessibility needs, preferred pace, group constraints, must-dos, or anything to avoid."
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  rows={3}
                />
              </div>
            </div>
          </div>
        )}

        {step === 5 && (
          <div>
            <h2 className="text-2xl font-bold">Review your trip</h2>
            <p className="mt-1 text-muted-foreground">Confirm the details below</p>
            <div className="mt-6 space-y-3">
              {[
                { label: "Destination", value: form.destination },
                { label: "Check-in", value: form.checkIn },
                { label: "Check-out", value: form.checkOut },
                {
                  label: "Guests",
                  value: `${form.guests} guest(s), ${form.rooms} room(s)`,
                },
                { label: "Budget", value: `$${form.budgetMin} — $${form.budgetMax}/night` },
                {
                  label: "Stay quality",
                  value: form.starRating ? `${form.starRating}★+ preferred` : "Any",
                },
                {
                  label: "Activity style",
                  value:
                    form.activityBrief.categories.length > 0
                      ? form.activityBrief.categories
                          .map((id) => ACTIVITY_CATEGORY_OPTIONS.find((category) => category.id === id)?.label ?? id)
                          .join(", ")
                      : "Not specified",
                },
                {
                  label: "Activity request",
                  value: form.activityBrief.request || "Not specified",
                },
                { label: "Notes", value: form.notes || "None" },
              ].map((item) => (
                <div key={item.label} className="grid gap-2 border-b pb-2 sm:grid-cols-[160px_1fr]">
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                  <span className="text-sm font-medium sm:text-right">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-between">
          <button
            onClick={() => setStep(Math.max(0, step - 1))}
            className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted ${
              step === 0 ? "invisible" : ""
            }`}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          {step < STEPS.length - 1 ? (
            <button
              onClick={() => canProceed() && setStep(step + 1)}
              disabled={!canProceed()}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={submit}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Trip Plan"}
              {!loading && <CheckCircle className="h-4 w-4" />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
