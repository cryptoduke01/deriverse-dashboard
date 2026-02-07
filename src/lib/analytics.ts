/**
 * Analytics computations: PnL, win rate, drawdown, fees, long/short, etc.
 */

import {
  Trade,
  AnalyticsSummary,
  SymbolStats,
  OrderType,
  DailyPnL,
  SessionBucket,
  TimeOfDayBucket,
} from "./types";
import { buildDailyPnL, buildSessionPerformance, buildTimeOfDayPerformance } from "./mock-data";

export function computeAnalytics(
  trades: Trade[],
  options: { symbolFilter?: string; dateFrom?: Date; dateTo?: Date } = {}
): AnalyticsSummary {
  let filtered = trades;

  if (options.symbolFilter) {
    filtered = filtered.filter((t) => t.symbol === options.symbolFilter);
  }
  if (options.dateFrom) {
    filtered = filtered.filter((t) => t.closedAt >= options.dateFrom!);
  }
  if (options.dateTo) {
    filtered = filtered.filter((t) => t.closedAt <= options.dateTo!);
  }

  const totalPnL = filtered.reduce((s, t) => s + t.pnl, 0);
  const totalVolume = filtered.reduce((s, t) => s + t.notional, 0);
  const totalFees = filtered.reduce((s, t) => s + t.fee, 0);
  const tradeCount = filtered.length;
  const wins = filtered.filter((t) => t.pnl > 0);
  const losses = filtered.filter((t) => t.pnl <= 0);
  const winCount = wins.length;
  const lossCount = losses.length;
  const winRate = tradeCount ? (winCount / tradeCount) * 100 : 0;
  const totalDurationMinutes = filtered.reduce((s, t) => s + t.durationSeconds / 60, 0);
  const avgTradeDurationMinutes = tradeCount ? totalDurationMinutes / tradeCount : 0;

  const longNotional = filtered
    .filter((t) => t.side === "long" || t.side === "buy")
    .reduce((s, t) => s + t.notional, 0);
  const shortNotional = filtered
    .filter((t) => t.side === "short" || t.side === "sell")
    .reduce((s, t) => s + t.notional, 0);
  const longShortRatio = shortNotional ? longNotional / shortNotional : longNotional || 1;

  const gains = wins.map((t) => t.pnl);
  const lossAmounts = losses.map((t) => t.pnl);
  const largestGain = gains.length ? Math.max(...gains) : 0;
  const largestLoss = lossAmounts.length ? Math.min(...lossAmounts) : 0;
  const avgWin = wins.length ? wins.reduce((s, t) => s + t.pnl, 0) / wins.length : 0;
  const avgLoss = losses.length ? losses.reduce((s, t) => s + t.pnl, 0) / losses.length : 0;

  const dailyPnL = buildDailyPnL(filtered);
  const maxDrawdown = dailyPnL.length
    ? Math.max(...dailyPnL.map((d) => d.drawdown))
    : 0;
  const peakCumulative = dailyPnL.length
    ? Math.max(...dailyPnL.map((d) => d.cumulativePnL), 0)
    : 0;
  const maxDrawdownPercent = peakCumulative ? (maxDrawdown / peakCumulative) * 100 : 0;

  const bySymbol = computeBySymbol(filtered);
  const byOrderType = computeByOrderType(filtered);
  const feeComposition = computeFeeComposition(filtered);
  const cumulativeFees = totalFees;
  const sessionPerformance = buildSessionPerformance(filtered);
  const timeOfDayPerformance = buildTimeOfDayPerformance(filtered);

  return {
    totalPnL,
    totalVolume,
    totalFees,
    tradeCount,
    winCount,
    lossCount,
    winRate,
    avgTradeDurationMinutes,
    longShortRatio,
    largestGain,
    largestLoss,
    avgWin,
    avgLoss,
    maxDrawdown,
    maxDrawdownPercent,
    bySymbol,
    byOrderType,
    feeComposition,
    cumulativeFees,
    dailyPnL,
    sessionPerformance,
    timeOfDayPerformance,
  };
}

function computeBySymbol(trades: Trade[]): SymbolStats[] {
  const bySym = new Map<string, Trade[]>();
  for (const t of trades) {
    const list = bySym.get(t.symbol) ?? [];
    list.push(t);
    bySym.set(t.symbol, list);
  }
  return Array.from(bySym.entries()).map(([symbol, list]) => {
    const pnl = list.reduce((s, t) => s + t.pnl, 0);
    const volume = list.reduce((s, t) => s + t.notional, 0);
    const fees = list.reduce((s, t) => s + t.fee, 0);
    const wins = list.filter((t) => t.pnl > 0);
    const losses = list.filter((t) => t.pnl <= 0);
    const winRate = list.length ? (wins.length / list.length) * 100 : 0;
    const avgWin = wins.length ? wins.reduce((s, t) => s + t.pnl, 0) / wins.length : 0;
    const avgLoss = losses.length ? losses.reduce((s, t) => s + t.pnl, 0) / losses.length : 0;
    const gains = wins.map((t) => t.pnl);
    const lossAmounts = losses.map((t) => t.pnl);
    return {
      symbol,
      pnl,
      volume,
      fees,
      trades: list.length,
      winRate,
      avgWin,
      avgLoss,
      largestWin: gains.length ? Math.max(...gains) : 0,
      largestLoss: lossAmounts.length ? Math.min(...lossAmounts) : 0,
    };
  });
}

function computeByOrderType(trades: Trade[]): { orderType: OrderType; pnl: number; trades: number; volume: number }[] {
  const byType = new Map<OrderType, Trade[]>();
  for (const t of trades) {
    const list = byType.get(t.orderType) ?? [];
    list.push(t);
    byType.set(t.orderType, list);
  }
  return Array.from(byType.entries()).map(([orderType, list]) => ({
    orderType,
    pnl: list.reduce((s, t) => s + t.pnl, 0),
    trades: list.length,
    volume: list.reduce((s, t) => s + t.notional, 0),
  }));
}

function computeFeeComposition(trades: Trade[]): { type: string; amount: number; percent: number }[] {
  const total = trades.reduce((s, t) => s + t.fee, 0);
  if (!total) return [];
  const taker = trades.reduce((s, t) => s + t.fee * 0.75, 0);
  const protocol = total - taker;
  return [
    { type: "Taker (to pool)", amount: taker, percent: (taker / total) * 100 },
    { type: "Protocol", amount: protocol, percent: (protocol / total) * 100 },
  ];
}
