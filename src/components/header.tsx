"use client";

import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { Menu, Sun, Moon } from "lucide-react";
import { WalletButton } from "./wallet-button";
import { useEffect, useState } from "react";

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between gap-4 border-b border-white/5 bg-surface/70 px-4 backdrop-blur-xl sm:px-6">
      <div className="flex min-w-0 items-center gap-4">
        <button
          type="button"
          onClick={onMenuClick}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-fg-muted transition-colors hover:bg-white/5 hover:text-fg lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="truncate text-base font-semibold text-fg sm:text-lg">Trading Analytics</h1>
      </div>
      <div className="flex shrink-0 items-center gap-4 pr-1">
        {mounted && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            type="button"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex h-9 w-9 min-w-[2.25rem] items-center justify-center rounded-xl text-fg-muted transition-colors hover:bg-white/5 hover:text-fg"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </motion.button>
        )}
        <div className="min-w-0">
          <WalletButton />
        </div>
      </div>
    </header>
  );
}
