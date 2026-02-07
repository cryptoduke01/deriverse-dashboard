"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutGrid,
  PieChart,
  LineChart,
  History,
  Shield,
  User,
  Settings,
  Code2,
  Building2,
  Users,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const MAIN_NAV = [
  { href: "/", label: "Dashboard", icon: LayoutGrid },
  { href: "#portfolio", label: "Portfolio", icon: PieChart },
  { href: "#analytics", label: "Trading & Market Analytics", icon: LineChart },
  { href: "#transactions", label: "Transactions", icon: History },
  { href: "#security", label: "Security & Compliance", icon: Shield },
];

const SECONDARY_NAV = [
  { href: "#api", label: "API & Developer Access", icon: Code2 },
  { href: "#enterprise", label: "Enterprise Admin", icon: Building2 },
];

const FOOTER_NAV = [
  { href: "#profile", label: "Profile", icon: User },
  { href: "#settings", label: "Settings", icon: Settings },
  { href: "#community", label: "Community & Governance", icon: Users },
];

function NavSection({
  items,
  className,
}: {
  items: { href: string; label: string; icon: React.ComponentType<{ className?: string }> }[];
  className?: string;
}) {
  const pathname = usePathname();
  return (
    <nav className={cn("flex flex-col gap-0.5", className)}>
      {items.map(({ href, label, icon: Icon }) => {
        const isActive = href === "/" ? pathname === "/" : pathname?.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-colors",
              isActive
                ? "bg-teal/15 text-teal"
                : "text-fg-muted hover:bg-surface-overlay hover:text-fg"
            )}
          >
            <Icon className="h-[18px] w-[18px] shrink-0 text-current" />
            <span className="truncate">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
}

export function Sidebar({ open = true, onClose }: SidebarProps) {
  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 lg:hidden"
            onClick={onClose}
            aria-hidden
          />
        )}
      </AnimatePresence>
      <motion.aside
        initial={false}
        animate={{ x: open ? 0 : -280 }}
        transition={{ type: "tween", duration: 0.2 }}
        className={cn(
          "fixed left-0 top-0 z-50 flex h-screen w-[260px] flex-col bg-surface/90 backdrop-blur-xl",
          "lg:translate-x-0",
          !open && "shadow-xl"
        )}
      >
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-fg-muted hover:bg-surface-overlay hover:text-fg lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        )}
        {/* Logo - no border */}
        <div className="flex h-14 shrink-0 items-center gap-2 px-5 bg-gradient-to-b from-white/[0.03] to-transparent">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-teal/30 to-teal/10 text-teal">
            <span className="text-sm font-semibold">D</span>
          </div>
          <span className="text-lg font-semibold tracking-tight text-fg">Deriverse</span>
        </div>

        <div className="flex flex-1 flex-col overflow-y-auto py-3">
          <div className="px-2">
            <NavSection items={MAIN_NAV} />
          </div>

          <div className="my-2 h-px shrink-0 bg-white/5" role="separator" />

          <div className="px-2">
            <NavSection items={SECONDARY_NAV} />
          </div>

          <div className="my-2 h-px shrink-0 bg-white/5" role="separator" />

          <div className="mt-auto px-2 pb-4">
            <NavSection items={FOOTER_NAV} />
          </div>
        </div>
      </motion.aside>
    </>
  );
}
