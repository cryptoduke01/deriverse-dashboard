/**
 * Mock trading data for dashboard development and demo.
 * Replace with real @deriverse/kit + chain indexing in production.
 */

import {
  Trade,
  OrderType,
  Side,
  DailyPnL,
  SessionBucket,
  TimeOfDayBucket,
} from "./types";
import { addDays, subDays, addHours } from "date-fns";

const SYMBOLS = ["SOL-USDC", "BTC-PERP", "ETH-PERP", "SOL-PERP", "mSOL-USDC"];

const ORDER_TYPES: OrderType[] = ["limit", "market", "stop", "stop_limit"];

function randomIn(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateTrades(count: number): Trade[] {
  const trades: Trade[] = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const closedAt = subDays(now, Math.floor(Math.random() * 60));
    const durationSeconds = Math.floor(randomIn(60, 86400 * 3)); // 1 min to 3 days
    const openedAt = new Date(closedAt.getTime() - durationSeconds * 1000);
    const side = pick<Side>(["long", "short", "buy", "sell"]);
    const quantity = randomIn(0.1, 10);
    const price = randomIn(20, 2000);
    const notional = quantity * price;
    const feeRate = 0.0005;
    const fee = notional * feeRate;
    const pnl = (Math.random() - 0.45) * notional * 0.02; // Slight edge to wins
    const isWin = pnl > 0;
    const id = `tx-${closedAt.getTime()}-${i}`;

    const symbol = pick(SYMBOLS);
    trades.push({
      id,
      symbol,
      quoteCurrency: "USDC",
      side,
      orderType: pick(ORDER_TYPES),
      quantity,
      price,
      notional,
      pnl,
      fee,
      feeCurrency: "quote",
      openedAt,
      closedAt,
      durationSeconds,
      isWin,
      txSignature: `${id.slice(0, 8)}...${id.slice(-8)}`,
      ...(Math.random() > 0.85 ? { annotation: "Review setup" } : {}),
    });
  }

  return trades.sort((a, b) => b.closedAt.getTime() - a.closedAt.getTime());
}

export const MOCK_TRADES = generateTrades(180);

/** Build daily PnL and drawdown from sorted trades (newest first). */
export function buildDailyPnL(trades: Trade[]): DailyPnL[] {
  const byDate = new Map<string, { pnl: number; trades: number }>();
  for (const t of trades) {
    const d = t.closedAt.toISOString().slice(0, 10);
    const cur = byDate.get(d) ?? { pnl: 0, trades: 0 };
    cur.pnl += t.pnl;
    cur.trades += 1;
    byDate.set(d, cur);
  }
  const dates = Array.from(byDate.keys()).sort();
  let cum = 0;
  let peak = 0;
  const result: DailyPnL[] = [];
  for (const date of dates) {
    const { pnl, trades } = byDate.get(date)!;
    cum += pnl;
    peak = Math.max(peak, cum);
    const drawdown = peak - cum;
    result.push({
      date,
      pnl,
      cumulativePnL: cum,
      drawdown,
      trades,
    });
  }
  return result.reverse();
}

/** Session buckets (UTC): Asian 00-08, London 08-16, NY 13-21, other rest. */
export function buildSessionPerformance(trades: Trade[]): SessionBucket[] {
  const buckets: Record<string, { pnl: number; trades: number; volume: number }> = {
    asian: { pnl: 0, trades: 0, volume: 0 },
    london: { pnl: 0, trades: 0, volume: 0 },
    ny: { pnl: 0, trades: 0, volume: 0 },
    other: { pnl: 0, trades: 0, volume: 0 },
  };
  for (const t of trades) {
    const h = t.closedAt.getUTCHours();
    let session: keyof typeof buckets = "other";
    if (h >= 0 && h < 8) session = "asian";
    else if (h >= 8 && h < 13) session = "london";
    else if (h >= 13 && h < 21) session = "ny";
    buckets[session].pnl += t.pnl;
    buckets[session].trades += 1;
    buckets[session].volume += t.notional;
  }
  return [
    { session: "asian", ...buckets.asian },
    { session: "london", ...buckets.london },
    { session: "ny", ...buckets.ny },
    { session: "other", ...buckets.other },
  ];
}

export function buildTimeOfDayPerformance(trades: Trade[]): TimeOfDayBucket[] {
  const byHour = Array.from({ length: 24 }, (_, hour) => ({
    hour,
    label: `${hour.toString().padStart(2, "0")}:00`,
    pnl: 0,
    trades: 0,
  }));
  for (const t of trades) {
    const h = t.closedAt.getUTCHours();
    byHour[h].pnl += t.pnl;
    byHour[h].trades += 1;
  }
  return byHour;
}
