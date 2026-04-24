"use client";

import { Fragment, useState } from "react";
import { Download, ArrowUpDown, ChevronDown, ChevronUp, Check, Loader2, Star, TrendingDown } from "lucide-react";
import { NegotiationStatusBadge } from "./negotiation-status";

interface NegotiationRow {
  hotelId: string;
  hotelName: string;
  starRating: number;
  rating: number | null;
  originalPrice: number | null;
  negotiatedPrice: number | null;
  discountPercent: number | null;
  status: string;
  transcript: { speaker: string; text: string }[] | null;
  durationMs: number | null;
  offerRoomType: string;
  offerBoardType: string;
}

interface ResultsTableProps {
  tripId: string;
  negotiations: NegotiationRow[];
}

type SortKey = "savings" | "price" | "name" | "rating";

export function ResultsTable({ tripId, negotiations }: ResultsTableProps) {
  const [sortBy, setSortBy] = useState<SortKey>("savings");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [approving, setApproving] = useState<string | null>(null);
  const [approved, setApproved] = useState<string | null>(null);

  const sorted = [...negotiations].sort((a, b) => {
    switch (sortBy) {
      case "savings":
        return (b.discountPercent ?? 0) - (a.discountPercent ?? 0);
      case "price":
        return (a.negotiatedPrice ?? a.originalPrice ?? 0) - (b.negotiatedPrice ?? b.originalPrice ?? 0);
      case "name":
        return a.hotelName.localeCompare(b.hotelName);
      case "rating":
        return (b.rating ?? 0) - (a.rating ?? 0);
      default:
        return 0;
    }
  });

  const successful = negotiations.filter((n) => n.status === "completed");
  const totalSavings = successful.reduce((sum, n) => {
    if (!n.originalPrice || !n.negotiatedPrice) return sum;
    return sum + (n.originalPrice - n.negotiatedPrice);
  }, 0);

  const approve = async (hotelId: string, price: number) => {
    setApproving(hotelId);
    try {
      await fetch("/api/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tripId, hotelId, finalPrice: price }),
      });
      setApproved(hotelId);
    } finally {
      setApproving(null);
    }
  };

  const exportCSV = () => {
    const header = "Hotel,Stars,Rating,Original Price,Negotiated Price,Savings %,Status\n";
    const rows = negotiations
      .map(
        (n) =>
          `"${n.hotelName}",${n.starRating},${n.rating ?? "N/A"},${n.originalPrice ?? "N/A"},${n.negotiatedPrice ?? "N/A"},${n.discountPercent ?? 0}%,${n.status}`
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `negotiation-results-${tripId}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      {successful.length > 0 && (
        <div className="mb-4 rounded-lg bg-success/10 p-4">
          <div className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-success" />
            <span className="font-medium text-success">
              Negotiated ${totalSavings.toFixed(2)} in total savings across {successful.length} hotel(s)
            </span>
          </div>
        </div>
      )}

      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortKey)}
            className="rounded-md border px-2 py-1 text-xs focus:border-primary focus:outline-none"
          >
            <option value="savings">Sort by savings</option>
            <option value="price">Sort by price</option>
            <option value="name">Sort by name</option>
            <option value="rating">Sort by rating</option>
          </select>
        </div>
        <button
          onClick={exportCSV}
          className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1 text-xs font-medium hover:bg-muted"
        >
          <Download className="h-3.5 w-3.5" />
          Export CSV
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-medium">Hotel</th>
              <th className="px-4 py-3 text-left font-medium">Original</th>
              <th className="px-4 py-3 text-left font-medium">Negotiated</th>
              <th className="px-4 py-3 text-left font-medium">Savings</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-left font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((n) => (
              <Fragment key={n.hotelId}>
                <tr className="border-b hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <div className="font-medium">{n.hotelName}</div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      {Array.from({ length: n.starRating }).map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-warning text-warning" />
                      ))}
                      {n.rating && <span className="ml-1">{n.rating}</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono">
                    {n.originalPrice ? `$${n.originalPrice.toFixed(2)}` : "—"}
                  </td>
                  <td className="px-4 py-3 font-mono font-medium">
                    {n.status === "completed" && n.negotiatedPrice ? (
                      <span className="text-success">${n.negotiatedPrice.toFixed(2)}</span>
                    ) : n.originalPrice ? (
                      `$${n.originalPrice.toFixed(2)}`
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {n.discountPercent ? (
                      <span className="font-medium text-success">-{n.discountPercent}%</span>
                    ) : (
                      <span className="text-muted-foreground">0%</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <NegotiationStatusBadge status={n.status as "pending" | "calling" | "completed" | "failed" | "no_answer"} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {n.status === "completed" && (
                        <button
                          onClick={() => approve(n.hotelId, n.negotiatedPrice ?? n.originalPrice ?? 0)}
                          disabled={!!approved || !!approving}
                          className={`inline-flex items-center gap-1 rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                            approved === n.hotelId
                              ? "bg-success text-white"
                              : "bg-primary text-primary-foreground hover:bg-primary/90"
                          } disabled:opacity-50`}
                        >
                          {approving === n.hotelId ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : approved === n.hotelId ? (
                            <Check className="h-3 w-3" />
                          ) : (
                            <Check className="h-3 w-3" />
                          )}
                          {approved === n.hotelId ? "Approved" : "Approve"}
                        </button>
                      )}
                      {n.transcript && (
                        <button
                          onClick={() => setExpanded(expanded === n.hotelId ? null : n.hotelId)}
                          className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs hover:bg-muted"
                        >
                          {expanded === n.hotelId ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                          Transcript
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
                {expanded === n.hotelId && n.transcript && (
                  <tr>
                    <td colSpan={6} className="bg-muted/30 px-4 py-3">
                      <div className="mx-auto max-w-2xl space-y-2">
                        <div className="text-xs font-medium text-muted-foreground mb-2">Call Transcript ({Math.round((n.durationMs ?? 0) / 1000)}s)</div>
                        {n.transcript.map((entry, i) => (
                          <div
                            key={i}
                            className={`rounded-md px-3 py-2 text-sm ${
                              entry.speaker === "agent"
                                ? "ml-4 bg-primary/10 text-primary"
                                : "mr-4 bg-muted"
                            }`}
                          >
                            <span className="text-xs font-medium block mb-0.5 opacity-70">
                              {entry.speaker === "agent" ? "AI Agent" : "Hotel"}
                            </span>
                            {entry.text}
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {approved && (
        <div className="mt-4 rounded-lg border-2 border-success bg-success/5 p-4 text-center">
          <Check className="mx-auto h-8 w-8 text-success" />
          <h3 className="mt-2 text-lg font-semibold">Booking Approved!</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Your selection has been saved. In a production version, the agent would now complete the booking.
          </p>
        </div>
      )}
    </div>
  );
}
