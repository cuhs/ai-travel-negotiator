"use client";

import { Fragment, useState } from "react";
import { Download, ArrowUpDown, ChevronDown, ChevronUp, Check, Loader2, Gift, Sparkles } from "lucide-react";
import { NegotiationStatusBadge } from "./negotiation-status";
import type { SecuredPerk } from "@/types";

interface NegotiationRow {
  hotelId: string;
  hotelName: string;
  starRating: number;
  rating: number | null;
  originalPrice: number | null;
  negotiatedPrice: number | null;
  discountPercent: number | null;
  status: string;
  securedPerks: SecuredPerk[];
  packageSummary: string[] | null;
  totalPerkValue: number | null;
  durationMs: number | null;
  offerRoomType: string;
  offerBoardType: string;
}

interface ResultsTableProps {
  tripId: string;
  negotiations: NegotiationRow[];
}

type SortKey = "value" | "price" | "name";

const PERK_CATEGORY_LABELS: Record<SecuredPerk["category"], string> = {
  amenity: "Amenity",
  credit: "Credit",
  flexible_term: "Flexible term",
  rate: "Rate",
};

export function ResultsTable({ tripId, negotiations }: ResultsTableProps) {
  const [sortBy, setSortBy] = useState<SortKey>("value");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [approving, setApproving] = useState<string | null>(null);
  const [approved, setApproved] = useState<string | null>(null);

  const sorted = [...negotiations].sort((a, b) => {
    switch (sortBy) {
      case "value":
        return (b.totalPerkValue ?? 0) - (a.totalPerkValue ?? 0);
      case "price":
        return (a.negotiatedPrice ?? a.originalPrice ?? 0) - (b.negotiatedPrice ?? b.originalPrice ?? 0);
      case "name":
        return a.hotelName.localeCompare(b.hotelName);
      default:
        return 0;
    }
  });

  const successful = negotiations.filter((n) => n.status === "completed");
  const totalValue = successful.reduce((sum, n) => sum + (n.totalPerkValue ?? 0), 0);

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
    const header = "Hotel,Original Price,Final Price,Perk Value,Perks Secured,Status\n";
    const rows = negotiations
      .map((n) => {
        const perks = n.securedPerks.map((p) => p.label).join("; ");
        return `"${n.hotelName}",${n.originalPrice ?? "N/A"},${n.negotiatedPrice ?? "N/A"},${n.totalPerkValue ?? 0},"${perks}",${n.status}`;
      })
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `negotiation-packages-${tripId}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      {successful.length > 0 && (
        <div className="mb-4 rounded-lg bg-success/10 p-4">
          <div className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-success" />
            <span className="font-medium text-success">
              Secured ~${totalValue.toFixed(0)} in total value-adds across {successful.length} hotel(s)
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
            <option value="value">Sort by total value</option>
            <option value="price">Sort by price</option>
            <option value="name">Sort by name</option>
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
              <th className="px-4 py-3 text-left font-medium">Listed rate</th>
              <th className="px-4 py-3 text-left font-medium">Package value</th>
              <th className="px-4 py-3 text-left font-medium">Perks secured</th>
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
                    <div className="text-xs text-muted-foreground">
                      {n.offerRoomType} · {n.offerBoardType}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono">
                    {n.originalPrice ? `$${n.originalPrice.toFixed(2)}/nt` : "—"}
                    {n.discountPercent ? (
                      <div className="text-xs text-success">→ ${n.negotiatedPrice?.toFixed(2)}/nt</div>
                    ) : null}
                  </td>
                  <td className="px-4 py-3">
                    {n.totalPerkValue ? (
                      <span className="font-medium text-success">~${n.totalPerkValue.toFixed(0)}</span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {n.securedPerks.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {n.securedPerks.slice(0, 2).map((p) => (
                          <span key={p.id} className="rounded-full bg-accent px-2 py-0.5 text-xs">
                            {p.label}
                          </span>
                        ))}
                        {n.securedPerks.length > 2 && (
                          <span className="text-xs text-muted-foreground">+{n.securedPerks.length - 2} more</span>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-xs">None</span>
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
                          ) : (
                            <Check className="h-3 w-3" />
                          )}
                          {approved === n.hotelId ? "Approved" : "Approve package"}
                        </button>
                      )}
                      {n.packageSummary && (
                        <button
                          onClick={() => setExpanded(expanded === n.hotelId ? null : n.hotelId)}
                          className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs hover:bg-muted"
                        >
                          {expanded === n.hotelId ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                          Summary
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
                {expanded === n.hotelId && (
                  <tr>
                    <td colSpan={6} className="bg-muted/30 px-4 py-4">
                      <div className="mx-auto max-w-2xl space-y-4">
                        <div>
                          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-2">
                            <Sparkles className="h-3.5 w-3.5" />
                            Negotiation summary ({Math.round((n.durationMs ?? 0) / 1000)}s)
                          </div>
                          <ul className="space-y-1.5">
                            {(n.packageSummary ?? []).map((line, i) => (
                              <li key={i} className="text-sm text-muted-foreground">
                                · {line}
                              </li>
                            ))}
                          </ul>
                        </div>
                        {n.securedPerks.length > 0 && (
                          <div>
                            <div className="text-xs font-medium text-muted-foreground mb-2">Secured perks</div>
                            <div className="space-y-2">
                              {n.securedPerks.map((perk) => (
                                <div key={perk.id} className="rounded-md border bg-background px-3 py-2">
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">{perk.label}</span>
                                    <span className="text-xs text-muted-foreground">
                                      {PERK_CATEGORY_LABELS[perk.category]} · ~${perk.estimatedValue}
                                    </span>
                                  </div>
                                  <p className="mt-0.5 text-xs text-muted-foreground">{perk.description}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
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
          <h3 className="mt-2 text-lg font-semibold">Package approved!</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Your selection has been saved. You&apos;ll check in knowing exactly what was agreed — no surprises at the
            front desk.
          </p>
        </div>
      )}
    </div>
  );
}
