"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { AnalyticsSummary } from "@/lib/types";
import { formatUsd, formatPercent } from "@/lib/utils";

interface FeeBreakdownProps {
  summary: AnalyticsSummary;
  className?: string;
}

export function FeeBreakdown({ summary, className }: FeeBreakdownProps) {
  const { feeComposition, cumulativeFees } = summary;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-xs font-medium text-fg-muted">Fee Composition & Cumulative</h3>
        <Link href="#" className="text-xs font-medium text-teal transition-opacity hover:opacity-90">
          View details
        </Link>
      </div>
      <div className="rounded-card bg-gradient-to-b from-white/[0.04] to-surface-elevated/95 p-4 shadow-card backdrop-blur-sm">
        <div className="mb-3 flex items-baseline justify-between">
          <span className="text-xs text-fg-muted">Cumulative fees</span>
          <span className="text-value font-semibold tabular-nums text-fg">{formatUsd(cumulativeFees)}</span>
        </div>
        <div className="space-y-2">
          {feeComposition.map((item) => (
            <div key={item.type} className="flex items-center justify-between text-xs">
              <span className="text-fg-muted">{item.type}</span>
              <div className="flex items-center gap-2">
                <span className="font-medium tabular-nums text-fg">{formatUsd(item.amount)}</span>
                <span className="text-fg-subtle">({formatPercent(item.percent)})</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
