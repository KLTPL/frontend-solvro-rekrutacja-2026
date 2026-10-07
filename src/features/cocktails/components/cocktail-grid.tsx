"use client";

import { AnimatePresence, motion } from "motion/react";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

import type { Cocktail } from "../types";
import { CocktailCard } from "./cocktail-card";

const gridClassName =
  "grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4";

const ABOVE_THE_FOLD = 8;
const STAGGER_GROUP = 12;

export function CocktailGrid({
  cocktails,
  className,
}: {
  cocktails: Cocktail[];
  className?: string;
}) {
  return (
    <ul className={cn(gridClassName, className)}>
      <AnimatePresence mode="popLayout" initial={false}>
        {cocktails.map((cocktail, index) => (
          <motion.li
            key={cocktail.id}
            layout="position"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 30,
              // Newly appended cards cascade in, a few at a time.
              delay: (index % STAGGER_GROUP) * 0.03,
            }}
          >
            <CocktailCard
              cocktail={cocktail}
              priority={index < ABOVE_THE_FOLD}
            />
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
}

export function CocktailGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <ul className={gridClassName} aria-hidden>
      {Array.from({ length: count }, (_, index) => (
        <li
          key={index}
          className="rounded-3xl border border-border/70 bg-card p-2"
        >
          <Skeleton className="aspect-square rounded-2xl" />
          <div className="space-y-2 px-2 pt-3 pb-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </li>
      ))}
    </ul>
  );
}
