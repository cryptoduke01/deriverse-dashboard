"use client";

import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { AnalyticsSummary } from "@/lib/types";
import { formatUsd } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface OrderTypeTableProps {
  summary: AnalyticsSummary;
  className?: string;
}

export function OrderTypeTable({ summary, className }: OrderTypeTableProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      <h3 className="mb-3 text-xs font-medium text-fg-muted">Order Type Performance</h3>
      <div className="overflow-hidden rounded-card bg-gradient-to-b from-white/[0.04] to-surface-elevated/95 shadow-card backdrop-blur-sm">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-white/5 bg-surface-overlay/50">
              <th className="px-3 py-2.5 text-left text-xs font-medium text-fg-muted">Order Type</th>
              <th className="px-3 py-2.5 text-right text-xs font-medium text-fg-muted">PnL</th>
              <th className="px-3 py-2.5 text-right text-xs font-medium text-fg-muted">Trades</th>
              <th className="px-3 py-2.5 text-right text-xs font-medium text-fg-muted">Volume</th>
              <th className="w-6 px-1 py-2.5" aria-hidden />
            </tr>
          </thead>
          <tbody>
            {summary.byOrderType.map((row) => (
              <tr
                key={row.orderType}
                className="group border-b border-white/5 transition-colors hover:bg-surface-overlay/40"
              >
                <td className="px-3 py-2 font-medium capitalize text-fg">{row.orderType}</td>
                <td
                  className={cn(
                    "px-3 py-2 text-right font-medium tabular-nums",
                    row.pnl >= 0 ? "text-teal" : "text-accent-red"
                  )}
                >
                  {row.pnl >= 0 ? "+" : ""}
                  {formatUsd(row.pnl)}
                </td>
                <td className="px-3 py-2 text-right text-fg-muted">{row.trades}</td>
                <td className="px-3 py-2 text-right tabular-nums text-fg-muted">{formatUsd(row.volume)}</td>
                <td className="px-1 py-2">
                  <span className="inline-flex text-fg-subtle opacity-0 transition-opacity group-hover:opacity-100">
                    <ChevronRight className="h-3.5 w-3.5" />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
