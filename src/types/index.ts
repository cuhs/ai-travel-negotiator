export type TripStatus = "draft" | "searching" | "negotiating" | "completed";
export type NegotiationStatus = "pending" | "calling" | "completed" | "failed" | "no_answer";
export type DecisionStatus = "pending" | "approved" | "rejected";

export type NegotiationPriority = "amenities" | "flexible_terms" | "property_credits" | "rate_adjustment";
export type ConversationalStyle = "professional" | "friendly" | "direct";
export type ApprovedArgumentId =
  | "mention_dates"
  | "mention_stay_length"
  | "mention_occasion"
  | "ask_amenity_bundle"
  | "ask_flexible_checkin"
  | "ask_property_credit"
  | "reference_budget"
  | "request_modest_rate";

export interface MockCity {
  name: string;
  code: string;
  country: string;
  lat: number;
  lng: number;
  priceRange: [number, number];
}

export interface NegotiationBrief {
  priorities: NegotiationPriority[];
  desiredAmenities: string[];
  leveragePoints: string[];
  conversationalStyle: ConversationalStyle;
  approvedArguments: ApprovedArgumentId[];
  customNotes?: string;
  userConsentAt: string;
}

export interface SecuredPerk {
  id: string;
  label: string;
  description: string;
  estimatedValue: number;
  category: "amenity" | "credit" | "flexible_term" | "rate";
}

export interface NegotiationPackageResult {
  callId: string;
  originalPrice: number;
  negotiatedPrice: number;
  discountPercent: number;
  securedPerks: SecuredPerk[];
  packageSummary: string[];
  totalPerkValue: number;
  durationMs: number;
}
