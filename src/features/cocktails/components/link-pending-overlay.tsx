"use client";

import { useLinkStatus } from "next/link";

import { cn } from "@/lib/utils";

/**
 * Subtle shimmer over a card while its details are loading – opening the
 * modal needs a short server round-trip the first time.
 */
export function LinkPendingOverlay() {
  const { pending } = useLinkStatus();

  return (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 rounded-3xl bg-linear-to-r from-transparent via-primary/15 to-transparent bg-size-[200%_100%] opacity-0 transition-opacity",
        pending &&
          "opacity-100 motion-safe:animate-[shimmer_1.2s_linear_infinite]",
      )}
    />
  );
}
