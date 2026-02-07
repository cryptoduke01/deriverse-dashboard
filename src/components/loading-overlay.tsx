"use client";

import { motion } from "framer-motion";
import { Loader } from "./loader";

interface LoadingOverlayProps {
  message?: string;
}

export function LoadingOverlay({ message = "Loading trade history" }: LoadingOverlayProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-40 flex items-center justify-center bg-canvas/60 backdrop-blur-md"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex flex-col items-center gap-4">
        <Loader size="lg" />
        <p className="text-sm font-medium text-fg-muted">{message}</p>
      </div>
    </motion.div>
  );
}
