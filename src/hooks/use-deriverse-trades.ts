"use client";

import { useState, useEffect, useCallback } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { fetchTradesForWallet } from "@/lib/deriverse-trades";
import { MOCK_TRADES } from "@/lib/mock-data";
import type { Trade } from "@/lib/types";

export interface UseDeriverseTradesResult {
  trades: Trade[];
  loading: boolean;
  error: string | null;
  isLive: boolean;
  showingDemo: boolean;
  refetch: () => Promise<void>;
}

export function useDeriverseTrades(): UseDeriverseTradesResult {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [trades, setTrades] = useState<Trade[]>(MOCK_TRADES);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!publicKey || !connection) {
      setTrades(MOCK_TRADES);
      setLoading(false);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      console.log(`[Deriverse] Fetching trades for wallet: ${publicKey.toBase58()}`);
      const list = await fetchTradesForWallet(connection, publicKey.toBase58());
      console.log(`[Deriverse] Fetched ${list.length} trades`);
      console.log(`[Deriverse] Sample trade:`, list.length > 0 ? {
        id: list[0].id,
        symbol: list[0].symbol,
        txSignature: list[0].txSignature,
        pnl: list[0].pnl,
        closedAt: list[0].closedAt
      } : null);
      setTrades(list.length > 0 ? list : MOCK_TRADES);
      if (list.length === 0) {
        const errorMsg = "No Deriverse trades found. Make a trade on Deriverse testnet or check console for details.";
        console.warn(`[Deriverse] ${errorMsg}`);
        setError(errorMsg);
      } else {
        setError(null);
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : "RPC limit or error — showing demo data.";
      console.error(`[Deriverse] Error fetching trades:`, e);
      setError(message);
      setTrades(MOCK_TRADES);
    } finally {
      setLoading(false);
    }
  }, [connection, publicKey]);

  useEffect(() => {
    if (!publicKey || !connection) {
      setTrades(MOCK_TRADES);
      setLoading(false);
      setError(null);
      return;
    }
    const t = setTimeout(() => fetch(), 1500);
    return () => clearTimeout(t);
  }, [publicKey?.toBase58(), connection, fetch]);

  const isLive = !!publicKey && !loading && trades.length > 0 && trades.some((t) => t.txSignature != null);
  const showingDemo = !!publicKey && !loading && !isLive && trades.length > 0;
  
  // Debug logging
  useEffect(() => {
    if (publicKey) {
      console.log(`[Deriverse] Hook state:`, {
        tradesCount: trades.length,
        loading,
        isLive,
        showingDemo,
        hasTxSignature: trades.some((t) => t.txSignature != null),
        sampleTrade: trades[0] ? { id: trades[0].id, symbol: trades[0].symbol, txSig: trades[0].txSignature } : null
      });
    }
  }, [publicKey, trades, loading, isLive, showingDemo]);

  return {
    trades,
    loading,
    error,
    isLive,
    showingDemo,
    refetch: fetch,
  };
}
