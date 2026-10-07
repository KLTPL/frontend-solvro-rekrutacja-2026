"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Provider as JotaiProvider } from "jotai";
import { MotionConfig } from "motion/react";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import type { ReactNode } from "react";

import { TooltipProvider } from "@/components/ui/tooltip";
import { getQueryClient } from "@/lib/query-client";

export function Providers({ children }: { children: ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <JotaiProvider>
        <NuqsAdapter>
          {/* Honour the OS "reduce motion" setting for every motion component. */}
          <MotionConfig reducedMotion="user">
            <TooltipProvider delayDuration={300}>{children}</TooltipProvider>
          </MotionConfig>
        </NuqsAdapter>
      </JotaiProvider>
      <ReactQueryDevtools buttonPosition="bottom-left" />
    </QueryClientProvider>
  );
}
