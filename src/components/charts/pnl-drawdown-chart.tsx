"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { motion } from "framer-motion";
import { DailyPnL } from "@/lib/types";
import { formatUsd } from "@/lib/utils";
import { format, parseISO } from "date-fns";

interface PnLDrawdownChartProps {
  data: DailyPnL[];
  className?: string;
}

export function PnLDrawdownChart({ data, className }: PnLDrawdownChartProps) {
  const chartData = [...data].reverse().map((d) => ({
    ...d,
    dateLabel: format(parseISO(d.date), "MMM d"),
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4 }}
      className={className}
    >
      <h3 className="mb-3 text-xs font-medium text-fg-muted">
        Historical PnL & Drawdown
      </h3>
      <div className="h-[240px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
            <defs>
              <linearGradient id="pnlGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--chart-pnl)" stopOpacity={0.4} />
                <stop offset="100%" stopColor="var(--chart-pnl)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="ddGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--chart-dd)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="var(--chart-dd)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="dateLabel" tick={{ fill: "var(--fg-muted)", fontSize: 11 }} />
            <YAxis
              yAxisId="pnl"
              tick={{ fill: "var(--fg-muted)", fontSize: 11 }}
              tickFormatter={(v) => formatUsd(v)}
            />
            <YAxis
              yAxisId="drawdown"
              orientation="right"
              tick={{ fill: "var(--fg-muted)", fontSize: 11 }}
              tickFormatter={(v) => formatUsd(v)}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--surface-elevated)",
                border: "1px solid var(--border)",
                borderRadius: "12px",
                boxShadow: "var(--shadow-lg)",
              }}
              labelStyle={{ color: "var(--fg)" }}
              formatter={(value: number, name: string) => [formatUsd(value), name]}
              labelFormatter={(label) => label}
            />
            <ReferenceLine yAxisId="pnl" y={0} stroke="var(--fg-subtle)" strokeDasharray="2 2" />
            <Area
              yAxisId="pnl"
              type="monotone"
              dataKey="cumulativePnL"
              name="Cumulative PnL"
              stroke="var(--chart-pnl)"
              fill="url(#pnlGrad)"
              strokeWidth={2}
            />
            <Area
              yAxisId="drawdown"
              type="monotone"
              dataKey="drawdown"
              name="Drawdown"
              stroke="var(--chart-dd)"
              fill="url(#ddGrad)"
              strokeWidth={1.5}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
