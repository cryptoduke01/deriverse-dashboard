"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const WalletMultiButton = dynamic(
  () =>
    import("@solana/wallet-adapter-react-ui").then((mod) => mod.WalletMultiButton),
  { ssr: false }
);

export function WalletButton() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div
        className="h-9 w-[120px] animate-pulse rounded-xl bg-surface-elevated"
        aria-hidden
      />
    );
  }
  return (
    <WalletMultiButton className="!min-h-9 !h-9 !min-w-[7rem] !rounded-xl !border-0 !bg-surface-elevated !px-4 !py-2 !text-xs !font-medium !text-fg hover:!bg-surface-overlay" />
  );
}
