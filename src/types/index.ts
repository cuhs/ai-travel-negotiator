export type TripStatus = "draft" | "searching" | "negotiating" | "completed";
export type NegotiationStatus = "pending" | "calling" | "completed" | "failed" | "no_answer";
export type DecisionStatus = "pending" | "approved" | "rejected";

export interface MockCity {
  name: string;
  code: string;
  country: string;
  lat: number;
  lng: number;
  priceRange: [number, number];
}

export interface NegotiationResult {
  callId: string;
  success: boolean;
  originalPrice: number;
  negotiatedPrice: number;
  discountPercent: number;
  transcript: TranscriptEntry[];
  durationMs: number;
}

export interface TranscriptEntry {
  speaker: "agent" | "hotel";
  text: string;
}
