"use client";

import { useState } from "react";
import {
  Shield,
  Sparkles,
  MessageSquare,
  CheckCircle2,
  Plus,
  X,
  AlertCircle,
} from "lucide-react";
import type { ApprovedArgumentId, NegotiationBrief, NegotiationPriority } from "@/types";
import {
  NEGOTIATION_PRIORITIES,
  DESIRED_AMENITIES,
  LEVERAGE_SUGGESTIONS,
  APPROVED_ARGUMENTS,
  CONVERSATIONAL_STYLES,
  buildBriefPreview,
  defaultNegotiationBrief,
} from "@/lib/negotiation-brief";

interface NegotiationBriefFormProps {
  trip: {
    checkIn: string;
    checkOut: string;
    guests: number;
    rooms: number;
    budgetMin: number;
    budgetMax: number;
  };
  hotelCount: number;
  initialBrief?: NegotiationBrief | null;
  onBack: () => void;
  onLaunch: (brief: NegotiationBrief) => void;
  launching?: boolean;
}

export function NegotiationBriefForm({
  trip,
  hotelCount,
  initialBrief,
  onBack,
  onLaunch,
  launching = false,
}: NegotiationBriefFormProps) {
  const [brief, setBrief] = useState<NegotiationBrief>(initialBrief ?? defaultNegotiationBrief());
  const [customLeverage, setCustomLeverage] = useState("");
  const [consent, setConsent] = useState(!!initialBrief?.userConsentAt);

  const togglePriority = (id: NegotiationPriority) => {
    setBrief((prev) => ({
      ...prev,
      priorities: prev.priorities.includes(id)
        ? prev.priorities.filter((p) => p !== id)
        : [...prev.priorities, id],
    }));
  };

  const toggleAmenity = (id: string) => {
    setBrief((prev) => ({
      ...prev,
      desiredAmenities: prev.desiredAmenities.includes(id)
        ? prev.desiredAmenities.filter((a) => a !== id)
        : [...prev.desiredAmenities, id],
    }));
  };

  const toggleArgument = (id: ApprovedArgumentId) => {
    setBrief((prev) => ({
      ...prev,
      approvedArguments: prev.approvedArguments.includes(id)
        ? prev.approvedArguments.filter((a) => a !== id)
        : [...prev.approvedArguments, id],
    }));
  };

  const addLeverage = (point: string) => {
    const trimmed = point.trim();
    if (!trimmed || brief.leveragePoints.includes(trimmed)) return;
    setBrief((prev) => ({ ...prev, leveragePoints: [...prev.leveragePoints, trimmed] }));
    setCustomLeverage("");
  };

  const removeLeverage = (point: string) => {
    setBrief((prev) => ({
      ...prev,
      leveragePoints: prev.leveragePoints.filter((p) => p !== point),
    }));
  };

  const preview = buildBriefPreview(brief, trip);
  const canLaunch =
    consent &&
    brief.priorities.length > 0 &&
    brief.approvedArguments.length > 0 &&
    (brief.priorities.includes("amenities") ? brief.desiredAmenities.length > 0 : true);

  const handleLaunch = () => {
    if (!canLaunch) return;
    onLaunch({ ...brief, userConsentAt: new Date().toISOString() });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
        <div className="flex items-start gap-3">
          <Shield className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <div>
            <h3 className="font-semibold">You shape the negotiation</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Configure what to ask for, which truthful leverage points to use, and exactly which talking points
              the co-pilot may raise. Nothing is sent without your explicit consent.
            </p>
          </div>
        </div>
      </div>

      <section className="rounded-lg border p-5">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <h3 className="font-semibold">What to negotiate for</h3>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Focus on mutual value-adds hotels grant easily — not just base rate cuts.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {NEGOTIATION_PRIORITIES.map((priority) => (
            <button
              key={priority.id}
              type="button"
              onClick={() => togglePriority(priority.id)}
              className={`rounded-lg border p-3 text-left transition-colors ${
                brief.priorities.includes(priority.id)
                  ? "border-primary bg-accent"
                  : "hover:border-primary/50"
              }`}
            >
              <div className="font-medium text-sm">{priority.label}</div>
              <div className="mt-1 text-xs text-muted-foreground">{priority.description}</div>
            </button>
          ))}
        </div>
      </section>

      {brief.priorities.includes("amenities") && (
        <section className="rounded-lg border p-5">
          <h3 className="font-semibold">Desired amenities</h3>
          <p className="mt-1 text-sm text-muted-foreground">Select perks you&apos;d like included.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {DESIRED_AMENITIES.map((amenity) => (
              <button
                key={amenity.id}
                type="button"
                onClick={() => toggleAmenity(amenity.id)}
                className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                  brief.desiredAmenities.includes(amenity.id)
                    ? "border-primary bg-primary text-primary-foreground"
                    : "hover:border-primary/50"
                }`}
              >
                {amenity.label}
              </button>
            ))}
          </div>
        </section>
      )}

      <section className="rounded-lg border p-5">
        <h3 className="font-semibold">Your leverage points</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Only truthful facts you&apos;re comfortable sharing. The co-pilot will never invent loyalty status or
          affiliations.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {LEVERAGE_SUGGESTIONS.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => addLeverage(suggestion)}
              disabled={brief.leveragePoints.includes(suggestion)}
              className="rounded-full border px-3 py-1 text-xs hover:border-primary disabled:opacity-40"
            >
              + {suggestion}
            </button>
          ))}
        </div>
        <div className="mt-3 flex gap-2">
          <input
            type="text"
            value={customLeverage}
            onChange={(e) => setCustomLeverage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addLeverage(customLeverage)}
            placeholder="Add your own (e.g., Anniversary trip)"
            className="flex-1 rounded-lg border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <button
            type="button"
            onClick={() => addLeverage(customLeverage)}
            className="inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-sm hover:bg-muted"
          >
            <Plus className="h-4 w-4" />
            Add
          </button>
        </div>
        {brief.leveragePoints.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {brief.leveragePoints.map((point) => (
              <span
                key={point}
                className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-sm"
              >
                {point}
                <button type="button" onClick={() => removeLeverage(point)} className="hover:text-destructive">
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-lg border p-5">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-primary" />
          <h3 className="font-semibold">Conversational style</h3>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {CONVERSATIONAL_STYLES.map((style) => (
            <button
              key={style.id}
              type="button"
              onClick={() => setBrief((prev) => ({ ...prev, conversationalStyle: style.id }))}
              className={`rounded-lg border p-3 text-left transition-colors ${
                brief.conversationalStyle === style.id ? "border-primary bg-accent" : "hover:border-primary/50"
              }`}
            >
              <div className="font-medium text-sm">{style.label}</div>
              <div className="mt-1 text-xs text-muted-foreground">{style.description}</div>
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-lg border p-5">
        <h3 className="font-semibold">Approved talking points</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Toggle each argument the co-pilot is allowed to use on your behalf.
        </p>
        <div className="mt-4 space-y-2">
          {APPROVED_ARGUMENTS.map((arg) => {
            const disabled =
              arg.id === "request_modest_rate" && !brief.priorities.includes("rate_adjustment");
            return (
              <label
                key={arg.id}
                className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors ${
                  disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-muted/50"
                } ${brief.approvedArguments.includes(arg.id) ? "border-primary/50 bg-accent/50" : ""}`}
              >
                <input
                  type="checkbox"
                  checked={brief.approvedArguments.includes(arg.id)}
                  disabled={disabled}
                  onChange={() => toggleArgument(arg.id)}
                  className="mt-0.5 accent-primary"
                />
                <div>
                  <div className="text-sm font-medium">{arg.label}</div>
                  <div className="text-xs text-muted-foreground">{arg.description}</div>
                </div>
              </label>
            );
          })}
        </div>
      </section>

      <section className="rounded-lg border p-5">
        <label className="block text-sm font-medium">Additional notes for the co-pilot</label>
        <textarea
          value={brief.customNotes ?? ""}
          onChange={(e) => setBrief((prev) => ({ ...prev, customNotes: e.target.value }))}
          placeholder="Optional context — accessibility needs, quiet room preference, etc."
          rows={2}
          className="mt-2 w-full rounded-lg border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </section>

      <section className="rounded-lg border-2 border-dashed border-primary/30 bg-muted/30 p-5">
        <h3 className="font-semibold">Brief preview</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          This is what will be communicated — review before launching.
        </p>
        <ul className="mt-4 space-y-2">
          {preview.map((line, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              {line}
            </li>
          ))}
        </ul>
      </section>

      <label className="flex cursor-pointer items-start gap-3 rounded-lg border-2 border-primary/40 bg-primary/5 p-4">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-1 accent-primary"
        />
        <div>
          <div className="font-medium">I consent to this negotiation brief</div>
          <div className="mt-1 text-sm text-muted-foreground">
            I authorize the co-pilot to contact {hotelCount} hotel(s) using only the parameters above. I understand
            no false claims will be made on my behalf.
          </div>
        </div>
      </label>

      {!canLaunch && consent && (
        <div className="flex items-center gap-2 text-sm text-warning">
          <AlertCircle className="h-4 w-4" />
          Select at least one priority, one approved talking point, and amenities if negotiating for perks.
        </div>
      )}

      <div className="flex justify-between pt-2">
        <button
          type="button"
          onClick={onBack}
          className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted"
        >
          Back to hotels
        </button>
        <button
          type="button"
          onClick={handleLaunch}
          disabled={!canLaunch || launching}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {launching ? "Contacting hotels..." : `Launch with my brief (${hotelCount})`}
        </button>
      </div>
    </div>
  );
}
