/**
 * Core types for Deriverse trading analytics.
 * Aligned with @deriverse/kit and on-chain structures where applicable.
 */

export type OrderType = "limit" | "market" | "stop" | "stop_limit";

export type Side = "long" | "short" | "buy" | "sell";

export interface Trade {
  id: string;
  /** Instrument / symbol (e.g. SOL-USDC, BTC-PERP) */
  symbol: string;
  /** Quote currency for amounts (e.g. USDC). When set, PnL/fees/notional are in this currency. */
  quoteCurrency?: string;
  side: Side;
  /** For perps: long/short; for spot: buy/sell */
  orderType: OrderType;
  quantity: number;
  price: number;
  /** Notional = quantity * price */
  notional: number;
  /** Realized PnL in quote currency (USDC) */
  pnl: number;
  fee: number;
  feeCurrency: "asset" | "quote";
  /** Open time (order placed or position opened) */
  openedAt: Date;
  /** Close time (fill or position closed) */
  closedAt: Date;
  /** Duration in seconds */
  durationSeconds: number;
  /** Win: pnl > 0 */
  isWin: boolean;
  /** Optional user annotation */
  annotation?: string;
  /** Tx signature or internal id */
  txSignature?: string;
}

export interface FeeRecord {
  tradeId: string;
  amount: number;
  currency: "asset" | "quote";
  type: "taker" | "maker" | "protocol";
  symbol: string;
  timestamp: Date;
}

export interface DailyPnL {
  date: string; // YYYY-MM-DD
  pnl: number;
  cumulativePnL: number;
  drawdown: number;
  trades: number;
}

export interface SessionBucket {
  session: "asian" | "london" | "ny" | "other";
  pnl: number;
  trades: number;
  volume: number;
}

export interface TimeOfDayBucket {
  hour: number; // 0-23 UTC
  label: string;
  pnl: number;
  trades: number;
}

export interface SymbolStats {
  symbol: string;
  pnl: number;
  volume: number;
  fees: number;
  trades: number;
  winRate: number;
  avgWin: number;
  avgLoss: number;
  largestWin: number;
  largestLoss: number;
}

export interface AnalyticsSummary {
  totalPnL: number;
  totalVolume: number;
  totalFees: number;
  tradeCount: number;
  winCount: number;
  lossCount: number;
  winRate: number;
  avgTradeDurationMinutes: number;
  longShortRatio: number; // long notional / short notional
  largestGain: number;
  largestLoss: number;
  avgWin: number;
  avgLoss: number;
  maxDrawdown: number;
  maxDrawdownPercent: number;
  bySymbol: SymbolStats[];
  byOrderType: { orderType: OrderType; pnl: number; trades: number; volume: number }[];
  feeComposition: { type: string; amount: number; percent: number }[];
  cumulativeFees: number;
  dailyPnL: DailyPnL[];
  sessionPerformance: SessionBucket[];
  timeOfDayPerformance: TimeOfDayBucket[];
}
