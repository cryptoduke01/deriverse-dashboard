"use client";

import { motion } from "framer-motion";
import { AnalyticsSummary } from "@/lib/types";
import { formatUsd, formatUsdCompact, formatPercent, formatDuration } from "@/lib/utils";
import { cn } from "@/lib/utils";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.025, delayChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 6 },
  show: { opacity: 1, y: 0 },
};

interface KpiCardsProps {
  summary: AnalyticsSummary;
  className?: string;
}

/* Card: label → value → sub-label. Value has min-w-0 to prevent overflow. */
const cardBase =
  "rounded-card bg-gradient-to-b from-white/[0.04] to-surface-elevated/95 p-4 shadow-card backdrop-blur-sm transition-all duration-300 ease-out hover:shadow-card-hover min-w-0";

export function KpiCards({ summary, className }: KpiCardsProps) {
  const pnlPositive = summary.totalPnL >= 0;
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4", className)}
    >
      {/* Tier 1 – Hero: Total PnL only (largest on the board) */}
      <motion.div variants={item} className={cardBase}>
        <p className="text-xs font-medium text-fg-muted">Total PnL</p>
        <p
          className={cn(
            "mt-1.5 min-w-0 overflow-hidden text-ellipsis text-3xl font-bold tabular-nums leading-tight",
            pnlPositive ? "text-teal" : "text-accent-red"
          )}
          title={formatUsd(summary.totalPnL)}
        >
          {pnlPositive ? "+" : ""}
          {Math.abs(summary.totalPnL) >= 1e6 ? formatUsdCompact(summary.totalPnL) : formatUsd(summary.totalPnL)}
        </p>
      </motion.div>

      {/* Tier 2 – Primary: Volume, Win Rate, Max Drawdown */}
      <motion.div variants={item} className={cardBase}>
        <p className="text-xs font-medium text-fg-muted">Trading Volume</p>
        <p className="mt-1.5 min-w-0 overflow-hidden text-ellipsis text-xl font-semibold tabular-nums leading-tight text-fg" title={formatUsd(summary.totalVolume)}>
          {summary.totalVolume >= 1e6 ? formatUsdCompact(summary.totalVolume) : formatUsd(summary.totalVolume)}
        </p>
      </motion.div>

      <motion.div variants={item} className={cardBase}>
        <p className="text-xs font-medium text-fg-muted">Total Fees</p>
        <p className="mt-1.5 text-base font-semibold tabular-nums text-fg">{formatUsd(summary.totalFees)}</p>
      </motion.div>

      <motion.div variants={item} className={cardBase}>
        <p className="text-xs font-medium text-fg-muted">Win Rate</p>
        <p className="mt-1.5 text-xl font-semibold tabular-nums leading-tight text-fg">
          {formatPercent(summary.winRate)}
        </p>
        <p className="mt-0.5 text-[11px] text-fg-muted">({summary.winCount}/{summary.tradeCount})</p>
      </motion.div>

      <motion.div variants={item} className={cardBase}>
        <p className="text-xs font-medium text-fg-muted">Avg Duration</p>
        <p className="mt-1.5 text-base font-semibold tabular-nums text-fg">{formatDuration(summary.avgTradeDurationMinutes)}</p>
      </motion.div>

      <motion.div variants={item} className={cardBase}>
        <p className="text-xs font-medium text-fg-muted">Long / Short</p>
        <p className="mt-1.5 text-base font-semibold tabular-nums text-fg">{summary.longShortRatio.toFixed(2)}</p>
        <p className="mt-1 text-[11px] text-fg-subtle">Notional basis</p>
      </motion.div>

      <motion.div variants={item} className={cardBase}>
        <p className="text-xs font-medium text-fg-muted">Largest Gain</p>
        <p className="mt-1.5 text-base font-semibold tabular-nums text-teal">{formatUsd(summary.largestGain)}</p>
      </motion.div>

      <motion.div variants={item} className={cardBase}>
        <p className="text-xs font-medium text-fg-muted">Largest Loss</p>
        <p className="mt-1.5 text-base font-semibold tabular-nums text-accent-red">{formatUsd(summary.largestLoss)}</p>
      </motion.div>

      <motion.div variants={item} className={cardBase}>
        <p className="text-xs font-medium text-fg-muted">Avg Win</p>
        <p className="mt-1.5 text-base font-semibold tabular-nums text-teal">{formatUsd(summary.avgWin)}</p>
      </motion.div>

      <motion.div variants={item} className={cardBase}>
        <p className="text-xs font-medium text-fg-muted">Avg Loss</p>
        <p className="mt-1.5 text-base font-semibold tabular-nums text-accent-red">{formatUsd(summary.avgLoss)}</p>
      </motion.div>

      <motion.div variants={item} className={cn(cardBase, "sm:col-span-2")}>
        <p className="text-xs font-medium text-fg-muted">Max Drawdown</p>
        <p className="mt-1.5 text-xl font-semibold tabular-nums text-accent-red">{formatUsd(summary.maxDrawdown)}</p>
        <p className="mt-1 text-[11px] text-fg-subtle">{summary.maxDrawdownPercent.toFixed(1)}% of peak</p>
      </motion.div>
    </motion.div>
  );
}
