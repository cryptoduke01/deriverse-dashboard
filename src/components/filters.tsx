"use client";

import { useCallback } from "react";
import { format, parseISO } from "date-fns";
import { motion } from "framer-motion";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const DEFAULT_SYMBOLS = ["All", "SOL-USDC", "BTC-PERP", "ETH-PERP", "SOL-PERP", "mSOL-USDC"];
const TIME_RANGES = ["24H", "7D", "30D", "YTD"] as const;

export interface FilterState {
  symbol: string;
  dateFrom: string;
  dateTo: string;
  timeRange: string;
}

interface FiltersProps {
  value: FilterState;
  onChange: (f: FilterState) => void;
  /** When provided (e.g. from live trades), symbol dropdown shows "All" + these; otherwise uses default list */
  symbolOptions?: string[];
  className?: string;
}

const filterWrap =
  "flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[13px] text-fg transition-colors hover:bg-white/[0.08] focus-within:border-teal/40 focus-within:ring-1 focus-within:ring-teal/20";

function parseDateSafe(s: string, fallback: Date): Date {
  if (!s) return fallback;
  try {
    return parseISO(s);
  } catch {
    return fallback;
  }
}

export function Filters({ value, onChange, symbolOptions, className }: FiltersProps) {
  const symbols = symbolOptions && symbolOptions.length > 0 ? symbolOptions : DEFAULT_SYMBOLS;
  const setSymbol = useCallback((symbol: string) => onChange({ ...value, symbol }), [value, onChange]);
  const setDateFrom = useCallback((dateFrom: string) => onChange({ ...value, dateFrom }), [value, onChange]);
  const setDateTo = useCallback((dateTo: string) => onChange({ ...value, dateTo }), [value, onChange]);
  const setTimeRange = useCallback((timeRange: string) => onChange({ ...value, timeRange }), [value, onChange]);

  const today = new Date();
  const todayStr = format(today, "yyyy-MM-dd");
  const defaultFrom = format(new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), "yyyy-MM-dd");

  const fromDate = parseDateSafe(value.dateFrom || defaultFrom, new Date(defaultFrom));
  const toDate = parseDateSafe(value.dateTo || todayStr, today);

  return (
    <motion.div
      initial={{ opacity: 0, x: 8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn("flex flex-wrap items-center gap-3", className)}
    >
      {/* Time range pills */}
      <div className="flex rounded-xl bg-white/5 p-0.5 ring-1 ring-white/5">
        {TIME_RANGES.map((range) => (
          <button
            key={range}
            type="button"
            onClick={() => setTimeRange(range)}
            className={cn(
              "rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200",
              value.timeRange === range
                ? "bg-white/10 text-fg shadow-sm"
                : "text-fg-muted hover:text-fg"
            )}
          >
            {range}
          </button>
        ))}
      </div>

      {/* Symbol – Shadcn Select */}
      <div className={filterWrap}>
        <span className="shrink-0 text-xs text-fg-muted">Symbol</span>
        <Select value={value.symbol} onValueChange={setSymbol}>
          <SelectTrigger
            className={cn(
              "min-w-[100px] border-0 bg-transparent px-0 shadow-none focus:ring-0 h-auto py-0",
              "text-fg [&>svg]:text-fg-muted"
            )}
          >
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent className="border-white/10 bg-surface-elevated text-fg">
            {symbols.map((s) => (
              <SelectItem key={s} value={s} className="text-fg focus:bg-white/10 focus:text-fg">
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* From date – Shadcn Popover + Calendar */}
      <div className={cn(filterWrap, "min-w-[140px]")}>
        <CalendarIcon className="h-3.5 w-3.5 shrink-0 text-fg-muted" aria-hidden />
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "h-auto w-full justify-start gap-2 border-0 bg-transparent p-0 font-normal text-fg hover:bg-transparent"
              )}
            >
              {format(fromDate, "dd/MM/yyyy")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto border-white/10 bg-surface-elevated p-0" align="start">
            <Calendar
              mode="single"
              selected={fromDate}
              onSelect={(d) => d && setDateFrom(format(d, "yyyy-MM-dd"))}
              disabled={(d) => d > today}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* To date – Shadcn Popover + Calendar */}
      <div className={cn(filterWrap, "min-w-[140px]")}>
        <CalendarIcon className="h-3.5 w-3.5 shrink-0 text-fg-muted" aria-hidden />
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "h-auto w-full justify-start gap-2 border-0 bg-transparent p-0 font-normal text-fg hover:bg-transparent"
              )}
            >
              {format(toDate, "dd/MM/yyyy")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto border-white/10 bg-surface-elevated p-0" align="start">
            <Calendar
              mode="single"
              selected={toDate}
              onSelect={(d) => d && setDateTo(format(d, "yyyy-MM-dd"))}
              disabled={(d) => d > today}
            />
          </PopoverContent>
        </Popover>
      </div>
    </motion.div>
  );
}
