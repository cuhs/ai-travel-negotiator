"use client";

import { TrendingDown, TrendingUp, Minus, PhoneOff, Loader2 } from "lucide-react";

type Status = "pending" | "calling" | "completed" | "failed" | "no_answer";

interface NegotiationStatusProps {
  status: Status;
  hotelName: string;
  originalPrice?: number;
  negotiatedPrice?: number;
  discountPercent?: number;
}

export function NegotiationStatusBadge({ status }: { status: Status }) {
  switch (status) {
    case "pending":
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
          <Loader2 className="h-3 w-3" /> Pending
        </span>
      );
    case "calling":
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-xs text-accent-foreground animate-pulse">
          <Loader2 className="h-3 w-3 animate-spin" /> Calling...
        </span>
      );
    case "completed":
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-xs text-success">
          <TrendingDown className="h-3 w-3" /> Negotiated
        </span>
      );
    case "failed":
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-xs text-destructive">
          <TrendingUp className="h-3 w-3" /> No discount
        </span>
      );
    case "no_answer":
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-warning/10 px-2 py-0.5 text-xs text-warning">
          <PhoneOff className="h-3 w-3" /> No answer
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs">
          <Minus className="h-3 w-3" /> {status}
        </span>
      );
  }
}

export function NegotiationStatusCard({ status, hotelName, originalPrice, negotiatedPrice, discountPercent }: NegotiationStatusProps) {
  return (
    <div className="rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-medium">{hotelName}</div>
          <NegotiationStatusBadge status={status} />
        </div>
        {status === "completed" && negotiatedPrice && originalPrice && (
          <div className="text-right">
            <div className="text-sm line-through text-muted-foreground">${originalPrice.toFixed(2)}</div>
            <div className="text-lg font-bold text-success">${negotiatedPrice.toFixed(2)}</div>
            {discountPercent && (
              <div className="text-xs text-success font-medium">-{discountPercent}%</div>
            )}
          </div>
        )}
        {(status === "failed" || status === "no_answer") && originalPrice && (
          <div className="text-right">
            <div className="text-lg font-bold">${originalPrice.toFixed(2)}</div>
            <div className="text-xs text-muted-foreground">No change</div>
          </div>
        )}
      </div>
    </div>
  );
}
