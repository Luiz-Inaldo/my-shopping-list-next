"use client";

import { cn } from "@/lib/utils";
import React from "react";

interface SmoothTapeEffectProps {
  className?: string;
}

/**
 * Reusable tape effect (adhesive tape) for card decorations.
 * Based on the design found in ActivePurchases/List.tsx
 */
export function SmoothTapeEffect({ className }: SmoothTapeEffectProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute -top-2.5 left-1/2 h-[18px] w-14 -translate-x-1/2 -rotate-2 border-x border-sketch-accent/20 bg-sketch-accent-lt/55 z-10",
        className
      )}
      aria-hidden
    />
  );
}
