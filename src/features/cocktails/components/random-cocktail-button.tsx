"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ShuffleIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition, type ComponentProps } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { fetchRandomCocktail } from "../api";
import { cocktailDetailsOptions } from "../queries";

interface RandomCocktailButtonProps extends Pick<
  ComponentProps<typeof Button>,
  "variant" | "size" | "className"
> {
  /** Hide the text on small screens (used in the header). */
  compact?: boolean;
}

export function RandomCocktailButton({
  compact = false,
  variant = "banana",
  size = "lg",
  className,
}: RandomCocktailButtonProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  // Opening the modal needs its own server round trip after the draw.
  const [isNavigating, startTransition] = useTransition();

  const { mutate, isPending, isError } = useMutation({
    mutationFn: async () => {
      const cocktail = await fetchRandomCocktail();
      // Load the details before navigating, so the modal opens complete.
      await queryClient.prefetchQuery(cocktailDetailsOptions(cocktail.id));
      return cocktail;
    },
    onSuccess: (cocktail) =>
      startTransition(() =>
        router.push(`/cocktails/${cocktail.id}`, { scroll: false }),
      ),
  });
  // Busy until the modal is open, so a second click cannot draw again.
  const isBusy = isPending || isNavigating;

  return (
    <Button
      variant={variant}
      size={size}
      onClick={() => mutate()}
      disabled={isBusy}
      aria-label={compact ? "Wylosuj koktajl" : undefined}
      title="Wylosuj koktajl"
      className={cn("rounded-full", className)}
    >
      <ShuffleIcon
        data-icon="inline-start"
        aria-hidden
        className={cn(
          "transition-transform duration-500",
          isBusy && "motion-safe:animate-spin",
        )}
      />
      <span className={cn(compact && "sr-only sm:not-sr-only")}>
        {isBusy ? "Losuję…" : isError ? "Spróbuj ponownie" : "Losuj koktajl"}
      </span>
    </Button>
  );
}
