"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { TimeOfDayBucket } from "@/lib/types";
import { formatUsd } from "@/lib/utils";

interface TimeOfDayChartProps {
  data: TimeOfDayBucket[];
  className?: string;
}

export function TimeOfDayChart({ data, className }: TimeOfDayChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4 }}
      className={className}
    >
      <h3 className="mb-3 text-xs font-medium text-fg-muted">
        Performance by Hour (UTC)
      </h3>
      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="label" tick={{ fill: "var(--fg-muted)", fontSize: 10 }} interval={2} />
            <YAxis tick={{ fill: "var(--fg-muted)", fontSize: 11 }} tickFormatter={(v) => formatUsd(v)} />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--surface-elevated)",
                border: "1px solid var(--border)",
                borderRadius: "12px",
                boxShadow: "var(--shadow-lg)",
              }}
              formatter={(value: number) => [formatUsd(value), "PnL"]}
              labelFormatter={(l) => l}
            />
            <Bar dataKey="pnl" fill="var(--chart-pnl)" radius={[6, 6, 0, 0]} name="PnL" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
