"use client";

import React, { useMemo, useState, useCallback, useEffect } from "react";
import { Trade } from "@/lib/types";
import { formatUsd } from "@/lib/utils";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { MessageSquare } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ANNOTATION_STORAGE_KEY = "deriverse-trade-annotations";

function loadAnnotationsFromStorage(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(ANNOTATION_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveAnnotations(annotations: Record<string, string>) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(ANNOTATION_STORAGE_KEY, JSON.stringify(annotations));
  } catch {}
}

interface TradeHistoryTableProps {
  trades: Trade[];
  className?: string;
}

export function TradeHistoryTable({ trades, className }: TradeHistoryTableProps) {
  const [annotations, setAnnotations] = useState<Record<string, string>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  useEffect(() => {
    setAnnotations(loadAnnotationsFromStorage());
  }, []);

  const updateAnnotation = useCallback((tradeId: string, value: string) => {
    setAnnotations((prev) => {
      const next = { ...prev };
      if (value.trim()) next[tradeId] = value.trim();
      else delete next[tradeId];
      saveAnnotations(next);
      return next;
    });
    setEditingId(null);
    setEditValue("");
  }, []);

  const startEdit = useCallback((t: Trade) => {
    setEditingId(t.id);
    setEditValue(annotations[t.id] ?? "");
  }, [annotations]);

  const tradesWithAnnotation = useMemo(() => {
    return trades.map((t) => ({ ...t, annotation: annotations[t.id] ?? t.annotation }));
  }, [trades, annotations]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-xs font-medium text-fg-muted">Transaction History</h3>
        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[13px] transition-colors hover:bg-white/[0.08] focus-within:border-teal/40 focus-within:ring-1 focus-within:ring-teal/20">
          <Select>
            <SelectTrigger className="w-full min-w-[80px] border-0 bg-transparent px-0 py-0 h-auto text-fg shadow-none focus:ring-0 [&>svg]:text-fg-muted">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent className="border-white/10 bg-surface-elevated text-fg">
              <SelectItem value="all" className="text-fg focus:bg-white/10">All</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="overflow-hidden rounded-card bg-gradient-to-b from-white/[0.04] to-surface-elevated/95 shadow-card backdrop-blur-sm">
        <div className="overflow-x-auto max-h-[420px] overflow-y-auto overscroll-contain scroll-smooth">
          <table className="w-full border-collapse text-[13px]">
            <thead className="sticky top-0 z-20 isolate bg-surface-elevated shadow-[0_1px_0_0_rgba(255,255,255,0.05)]">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-medium text-fg-muted">Time</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-fg-muted">Symbol</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-fg-muted">Quote</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-fg-muted">Side</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-fg-muted">Type</th>
                <th className="px-3 py-3 text-right text-xs font-medium text-fg-muted">Qty</th>
                <th className="px-3 py-3 text-right text-xs font-medium text-fg-muted">Price</th>
                <th className="px-3 py-3 text-right text-xs font-medium text-fg-muted">Notional</th>
                <th className="px-3 py-3 text-right text-xs font-medium text-fg-muted">PnL</th>
                <th className="px-3 py-3 text-right text-xs font-medium text-fg-muted">Fee</th>
                <th className="px-3 py-3 text-center text-xs font-medium text-fg-muted w-10">Note</th>
              </tr>
            </thead>
            <tbody>
              {tradesWithAnnotation.map((t) => (
                <React.Fragment key={t.id}>
                  <tr
                    className={cn(
                      "group border-b border-white/5 transition-colors hover:bg-surface-overlay/40",
                      (annotations[t.id] || t.annotation) && "bg-surface-overlay/30"
                    )}
                  >
                    <td className="px-3 py-2.5 text-fg-muted whitespace-nowrap">
                      {format(t.closedAt, "MMM d, HH:mm")}
                    </td>
                    <td className="px-3 py-2.5 font-medium text-fg">{t.symbol}</td>
                    <td className="px-3 py-2.5 text-fg-muted">
                      {t.quoteCurrency ?? (t.symbol.includes("USDC") ? "USDC" : t.symbol.includes("PERP") ? "USDC" : "—")}
                    </td>
                    <td className="px-3 py-2.5">
                      <span
                        className={cn(
                          t.side === "long" || t.side === "buy" ? "text-teal" : "text-accent-red"
                        )}
                      >
                        {t.side}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-fg-muted capitalize">{t.orderType}</td>
                    <td className="px-3 py-2.5 text-right tabular-nums text-fg-muted">{t.quantity.toFixed(4)}</td>
                    <td className="px-3 py-2.5 text-right tabular-nums text-fg-muted">{formatUsd(t.price)}</td>
                    <td className="px-3 py-2.5 text-right tabular-nums text-fg-muted">{formatUsd(t.notional)}</td>
                    <td
                      className={cn(
                        "px-3 py-2.5 text-right text-[13px] font-semibold tabular-nums",
                        t.pnl >= 0 ? "text-teal" : "text-accent-red"
                      )}
                    >
                      {t.pnl >= 0 ? "+" : ""}
                      {formatUsd(t.pnl)}
                    </td>
                    <td className="px-3 py-2.5 text-right text-fg-subtle">{formatUsd(t.fee)}</td>
                    <td className="px-3 py-2.5 text-center">
                      <button
                        type="button"
                        onClick={() => (editingId === t.id ? updateAnnotation(t.id, editValue) : startEdit(t))}
                        className={cn(
                          "rounded-lg p-1.5 transition-colors hover:bg-surface-overlay",
                          (annotations[t.id] || t.annotation) ? "text-teal" : "text-fg-subtle hover:text-fg-muted"
                        )}
                        title="Add or edit annotation"
                      >
                        <MessageSquare className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                  {editingId === t.id && (
                    <tr className="border-b border-white/5 bg-surface-overlay/40">
                      <td colSpan={11} className="px-3 py-2">
                        <div className="flex flex-wrap gap-2">
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") updateAnnotation(t.id, editValue);
                              if (e.key === "Escape") setEditingId(null);
                            }}
                            placeholder="Annotation..."
                            className="flex-1 min-w-[140px] rounded-xl border-0 bg-surface-overlay/80 px-2.5 py-1.5 text-xs text-fg placeholder:text-fg-muted focus:ring-1 focus:ring-teal/30"
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={() => updateAnnotation(t.id, editValue)}
                            className="rounded-xl bg-teal px-3 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-90"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingId(null)}
                            className="rounded-xl border-0 bg-surface-overlay/80 px-3 py-1.5 text-xs text-fg-muted transition-colors hover:bg-surface-overlay"
                          >
                            Cancel
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                  {(annotations[t.id] || t.annotation) && editingId !== t.id && (
                    <tr className="border-b border-white/5 bg-surface-overlay/30">
                      <td colSpan={11} className="px-3 py-1.5 text-[11px] text-fg-muted">
                        <span className="text-teal">Note:</span> {annotations[t.id] || t.annotation}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
