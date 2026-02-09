"use client";

import { useMemo, useState, useEffect } from "react";
import { parseISO } from "date-fns";
import { motion } from "framer-motion";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { Filters, type FilterState } from "@/components/filters";
import { KpiCards } from "@/components/kpi-cards";
import { PnLDrawdownChart } from "@/components/charts/pnl-drawdown-chart";
import { SessionChart } from "@/components/charts/session-chart";
import { TimeOfDayChart } from "@/components/charts/time-of-day-chart";
import { FeeBreakdown } from "@/components/fee-breakdown";
import { OrderTypeTable } from "@/components/order-type-table";
import { TradeHistoryTable } from "@/components/trade-history-table";
import { LoadingOverlay } from "@/components/loading-overlay";
import { Footer } from "@/components/footer";
import { useWallet } from "@solana/wallet-adapter-react";
import { useDeriverseTrades } from "@/hooks/use-deriverse-trades";
import { computeAnalytics } from "@/lib/analytics";
import { useMediaQuery } from "@/hooks/use-media-query";

const DEFAULT_FILTERS: FilterState = {
  symbol: "All",
  dateFrom: "",
  dateTo: "",
  timeRange: "All",
};

const sectionTransition = { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] };

export default function DashboardPage() {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isLg = useMediaQuery("(min-width: 1024px)");
  const sidebarVisible = isLg || sidebarOpen;
  const { publicKey } = useWallet();
  const { trades: rawTrades, loading: tradesLoading, error: tradesError, isLive, showingDemo } = useDeriverseTrades();

  const symbolOptions = useMemo(() => {
    const symbols = [...new Set(rawTrades.map((t) => t.symbol))].sort();
    console.log(`[Deriverse] Symbol options:`, symbols);
    return ["All", ...symbols];
  }, [rawTrades]);
  
  // Debug: log raw trades
  useEffect(() => {
    if (rawTrades.length > 0 && rawTrades[0].txSignature) {
      console.log(`[Deriverse] Page received ${rawTrades.length} raw trades:`, {
        firstTrade: {
          id: rawTrades[0].id,
          symbol: rawTrades[0].symbol,
          closedAt: rawTrades[0].closedAt,
          txSignature: rawTrades[0].txSignature
        },
        isLive,
        showingDemo,
        filters
      });
    }
  }, [rawTrades, isLive, showingDemo, filters]);

  const { trades, summary } = useMemo(() => {
    let list = rawTrades;
    const symbolFilter = filters.symbol === "All" ? undefined : filters.symbol;
    const dateFrom = filters.dateFrom ? parseISO(filters.dateFrom) : undefined;
    const dateTo = filters.dateTo ? parseISO(filters.dateTo) : undefined;
    if (dateTo) dateTo.setHours(23, 59, 59, 999);
    
    // Apply time range filter if no custom dates and timeRange is not "All"
    let effectiveDateFrom = dateFrom;
    if (!dateFrom && !dateTo && filters.timeRange && filters.timeRange !== "All") {
      const now = new Date();
      if (filters.timeRange === "24H") {
        effectiveDateFrom = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      } else if (filters.timeRange === "7D") {
        effectiveDateFrom = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      } else if (filters.timeRange === "30D") {
        effectiveDateFrom = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      } else if (filters.timeRange === "YTD") {
        effectiveDateFrom = new Date(now.getFullYear(), 0, 1);
      }
    }
    
    const summary = computeAnalytics(list, { symbolFilter, dateFrom: effectiveDateFrom, dateTo });
    if (symbolFilter || effectiveDateFrom || dateTo) {
      const beforeFilter = list.length;
      list = list.filter((t) => {
        if (symbolFilter && t.symbol !== symbolFilter) return false;
        if (effectiveDateFrom && t.closedAt < effectiveDateFrom) return false;
        if (dateTo && t.closedAt > dateTo) return false;
        return true;
      });
      console.log(`[Deriverse] Filtered ${beforeFilter} → ${list.length} trades (symbol: ${symbolFilter || "All"}, dateFrom: ${effectiveDateFrom?.toISOString() || "none"}, dateTo: ${dateTo?.toISOString() || "none"})`);
    }
    return { trades: list, summary };
  }, [rawTrades, filters]);

  return (
    <div className="flex min-h-screen">
      <Sidebar
        open={sidebarVisible}
        onClose={isLg ? undefined : () => setSidebarOpen(false)}
      />
      <div className="flex min-h-screen flex-1 flex-col min-w-0 lg:pl-[260px]">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-6 sm:px-6 lg:py-8">
          {tradesLoading && publicKey && (
            <LoadingOverlay message="Loading trade history" />
          )}
          {tradesError && !tradesLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-4 flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-fg-muted"
            >
              {tradesError}
            </motion.div>
          )}
          {isLive && !tradesLoading && (
            <p className="mb-2 text-center text-xs text-teal">Live data from connected wallet</p>
          )}
          {!publicKey && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 flex flex-col items-center justify-center gap-1 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-center"
            >
              <p className="text-sm font-medium text-amber-200">This is mock data.</p>
              <p className="text-xs text-fg-muted">Connect your wallet to see your live trading history.</p>
            </motion.div>
          )}
          {publicKey && !tradesLoading && !isLive && (showingDemo || tradesError) && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 flex flex-col items-center justify-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-center"
            >
              <p className="text-sm font-medium text-amber-200">No trades found for this wallet.</p>
              <p className="text-xs text-fg-muted">
                Make a trade on Deriverse testnet to see your data:{" "}
                <a
                  href="https://alpha.deriverse.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal underline hover:no-underline"
                >
                  alpha.deriverse.io
                </a>
              </p>
            </motion.div>
          )}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="mb-6 flex flex-wrap items-center justify-between gap-4"
          >
            {!isLive && !tradesLoading && (
              <span
                className="rounded-full border border-amber-500/40 bg-amber-500/15 px-3 py-1 text-xs font-medium text-amber-200"
                title="Connect wallet and trade on Deriverse testnet for live data"
              >
                Demo data
              </span>
            )}
            <Filters value={filters} onChange={setFilters} symbolOptions={symbolOptions} />
          </motion.div>

          <motion.section
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={sectionTransition}
            className="mb-8"
            id="analytics"
          >
            <KpiCards summary={summary} />
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={sectionTransition}
            className="mb-8 grid gap-5 lg:grid-cols-2"
          >
            <div className="rounded-card bg-gradient-to-b from-white/[0.04] to-surface-elevated/95 p-4 shadow-card backdrop-blur-sm">
              <PnLDrawdownChart data={summary.dailyPnL} />
            </div>
            <div className="rounded-card bg-gradient-to-b from-white/[0.04] to-surface-elevated/95 p-4 shadow-card backdrop-blur-sm">
              <SessionChart data={summary.sessionPerformance} />
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={sectionTransition}
            className="mb-8"
          >
            <div className="rounded-card bg-gradient-to-b from-white/[0.04] to-surface-elevated/95 p-4 shadow-card backdrop-blur-sm">
              <TimeOfDayChart data={summary.timeOfDayPerformance} />
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={sectionTransition}
            className="mb-8 grid gap-5 lg:grid-cols-2"
          >
            <FeeBreakdown summary={summary} />
            <OrderTypeTable summary={summary} />
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={sectionTransition}
            className="mb-10"
            id="transactions"
          >
            <TradeHistoryTable trades={trades} />
          </motion.section>
        </main>
        <Footer />
      </div>
    </div>
  );
}
