"use client";

import { HeartIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

import { cn } from "@/lib/utils";

import { useFavorites } from "./use-favorites";

interface FavoriteButtonProps {
  cocktailId: number;
  cocktailName: string;
  /** `icon` sits on top of a photo, `labeled` is a regular pill button. */
  variant?: "icon" | "labeled";
  className?: string;
}

export function FavoriteButton({
  cocktailId,
  cocktailName,
  variant = "icon",
  className,
}: FavoriteButtonProps) {
  const { isFavorite, toggle } = useFavorites();
  const active = isFavorite(cocktailId);
  // Animate only real clicks, not favourites appearing once storage loads.
  const [interacted, setInteracted] = useState(false);
  const label = active
    ? `Usuń z ulubionych: ${cocktailName}`
    : `Dodaj do ulubionych: ${cocktailName}`;

  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={variant === "icon" ? label : undefined}
      title={label}
      onClick={() => {
        setInteracted(true);
        toggle(cocktailId);
      }}
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center gap-2 rounded-full font-medium transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
        variant === "icon"
          ? "size-10 bg-background/80 text-foreground shadow-sm backdrop-blur-md hover:bg-background"
          : "h-8 border border-border px-3.5 text-sm hover:bg-muted",
        active && variant === "labeled" && "border-primary/40 bg-primary/10",
        className,
      )}
    >
      <span className="relative grid place-items-center">
        <motion.span
          key={String(active)}
          initial={interacted ? { scale: active ? 0.4 : 1 } : false}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 14 }}
          className="flex"
        >
          <HeartIcon
            aria-hidden
            className={cn(
              "size-4.5 transition-colors",
              active && "fill-primary text-primary",
            )}
          />
        </motion.span>
        {/* A single soft ring when a cocktail is added – no confetti. */}
        <AnimatePresence>
          {interacted && active && (
            <motion.span
              key="ring"
              aria-hidden
              initial={{ scale: 0.6, opacity: 0.7 }}
              animate={{ scale: 2.2, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="pointer-events-none absolute inset-0 rounded-full border-2 border-primary"
            />
          )}
        </AnimatePresence>
      </span>
      {variant === "labeled" && (active ? "W ulubionych" : "Do ulubionych")}
    </button>
  );
}
