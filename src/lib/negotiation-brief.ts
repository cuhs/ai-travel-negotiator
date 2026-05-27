import type { ApprovedArgumentId, ConversationalStyle, NegotiationBrief, NegotiationPriority } from "@/types";

export const NEGOTIATION_PRIORITIES: {
  id: NegotiationPriority;
  label: string;
  description: string;
}[] = [
  {
    id: "amenities",
    label: "Amenities & upgrades",
    description: "Complimentary breakfast, parking, WiFi upgrades, or room category improvements.",
  },
  {
    id: "flexible_terms",
    label: "Flexible terms",
    description: "Late check-out, early check-in, or more lenient cancellation windows.",
  },
  {
    id: "property_credits",
    label: "Property credits",
    description: "Resort credits, dining vouchers, or spa allowances you can use on-site.",
  },
  {
    id: "rate_adjustment",
    label: "Modest rate adjustment",
    description: "Optional — ask for a small rate reduction only if you're comfortable with it.",
  },
];

export const DESIRED_AMENITIES: { id: string; label: string; estimatedValue: number }[] = [
  { id: "breakfast", label: "Complimentary breakfast", estimatedValue: 25 },
  { id: "parking", label: "Complimentary parking", estimatedValue: 35 },
  { id: "late_checkout", label: "Late check-out (2pm+)", estimatedValue: 40 },
  { id: "early_checkin", label: "Early check-in", estimatedValue: 30 },
  { id: "resort_credit", label: "Resort or dining credit", estimatedValue: 75 },
  { id: "room_upgrade", label: "Room category upgrade", estimatedValue: 60 },
  { id: "wifi_premium", label: "Premium WiFi", estimatedValue: 15 },
  { id: "spa_access", label: "Spa or pool access", estimatedValue: 45 },
];

export const LEVERAGE_SUGGESTIONS: string[] = [
  "Multi-night stay",
  "Flexible on exact room type",
  "Celebrating a special occasion",
  "First visit to this property",
  "Traveling for business — need a quiet workspace",
  "Open to off-peak check-in times",
];

export const APPROVED_ARGUMENTS: {
  id: ApprovedArgumentId;
  label: string;
  description: string;
  defaultOn: boolean;
}[] = [
  {
    id: "mention_dates",
    label: "Share travel dates",
    description: "Tell the hotel your check-in and check-out dates.",
    defaultOn: true,
  },
  {
    id: "mention_stay_length",
    label: "Mention length of stay",
    description: "Note how many nights and rooms you're booking.",
    defaultOn: true,
  },
  {
    id: "mention_occasion",
    label: "Mention special occasion",
    description: "Only if you added one in your leverage points.",
    defaultOn: false,
  },
  {
    id: "ask_amenity_bundle",
    label: "Ask about complimentary amenity bundles",
    description: "Request value-add perks hotels often grant at no extra cost.",
    defaultOn: true,
  },
  {
    id: "ask_flexible_checkin",
    label: "Ask about flexible check-in/out",
    description: "Request late check-out or early arrival when available.",
    defaultOn: true,
  },
  {
    id: "ask_property_credit",
    label: "Ask about property credits",
    description: "Inquire about dining, spa, or resort credits.",
    defaultOn: true,
  },
  {
    id: "reference_budget",
    label: "Reference your stated budget",
    description: "Mention the price range you're working within.",
    defaultOn: false,
  },
  {
    id: "request_modest_rate",
    label: "Request a modest rate adjustment",
    description: "Only used if you selected rate adjustment as a priority.",
    defaultOn: false,
  },
];

export const CONVERSATIONAL_STYLES: { id: ConversationalStyle; label: string; description: string }[] = [
  {
    id: "professional",
    label: "Professional",
    description: "Courteous and business-like. Best for upscale or business properties.",
  },
  {
    id: "friendly",
    label: "Friendly",
    description: "Warm and conversational while staying truthful and respectful.",
  },
  {
    id: "direct",
    label: "Direct",
    description: "Clear and concise — states your requests without extra framing.",
  },
];

export function defaultNegotiationBrief(): NegotiationBrief {
  return {
    priorities: ["amenities", "flexible_terms", "property_credits"],
    desiredAmenities: ["breakfast", "late_checkout", "parking"],
    leveragePoints: [],
    conversationalStyle: "professional",
    approvedArguments: APPROVED_ARGUMENTS.filter((a) => a.defaultOn).map((a) => a.id),
    userConsentAt: "",
  };
}

export function buildBriefPreview(brief: NegotiationBrief, trip: {
  checkIn: string;
  checkOut: string;
  guests: number;
  rooms: number;
  budgetMin: number;
  budgetMax: number;
}): string[] {
  const lines: string[] = [];
  const style = CONVERSATIONAL_STYLES.find((s) => s.id === brief.conversationalStyle)?.label ?? "Professional";

  lines.push(`Tone: ${style} — no exaggerated claims or impersonation.`);

  if (brief.approvedArguments.includes("mention_dates")) {
    lines.push(`Share travel dates: ${trip.checkIn} to ${trip.checkOut}.`);
  }
  if (brief.approvedArguments.includes("mention_stay_length")) {
    lines.push(`Mention party size: ${trip.guests} guest(s), ${trip.rooms} room(s).`);
  }
  if (brief.approvedArguments.includes("mention_occasion") && brief.leveragePoints.some((p) => p.toLowerCase().includes("occasion"))) {
    lines.push("Mention your special occasion (as you provided).");
  }
  if (brief.leveragePoints.length > 0) {
    lines.push(`Your leverage points: ${brief.leveragePoints.join("; ")}.`);
  }
  if (brief.priorities.includes("amenities") && brief.desiredAmenities.length > 0) {
    const labels = brief.desiredAmenities
      .map((id) => DESIRED_AMENITIES.find((a) => a.id === id)?.label)
      .filter(Boolean);
    lines.push(`Request amenities: ${labels.join(", ")}.`);
  }
  if (brief.priorities.includes("flexible_terms")) {
    lines.push("Ask about flexible check-in/out or cancellation terms.");
  }
  if (brief.priorities.includes("property_credits") && brief.approvedArguments.includes("ask_property_credit")) {
    lines.push("Inquire about property or dining credits.");
  }
  if (brief.priorities.includes("rate_adjustment") && brief.approvedArguments.includes("request_modest_rate")) {
    lines.push(`Optionally reference budget ($${trip.budgetMin}–$${trip.budgetMax}/night) for a modest adjustment.`);
  }
  if (brief.customNotes?.trim()) {
    lines.push(`Additional notes: ${brief.customNotes.trim()}`);
  }

  lines.push("Will NOT claim loyalty status, fake affiliations, or anything you did not provide.");

  return lines;
}

export function parseNegotiationBrief(raw: string | null | undefined): NegotiationBrief | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as NegotiationBrief;
  } catch {
    return null;
  }
}
