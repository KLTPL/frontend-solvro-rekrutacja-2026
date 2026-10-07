"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ShuffleIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import type { ComponentProps } from "react";

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

  const { mutate, isPending, isError } = useMutation({
    mutationFn: async () => {
      const cocktail = await fetchRandomCocktail();
      // Load the details before navigating, so the modal opens complete.
      await queryClient.prefetchQuery(cocktailDetailsOptions(cocktail.id));
      return cocktail;
    },
    onSuccess: (cocktail) =>
      router.push(`/cocktails/${cocktail.id}`, { scroll: false }),
  });

  return (
    <Button
      variant={variant}
      size={size}
      onClick={() => mutate()}
      disabled={isPending}
      aria-label={compact ? "Wylosuj koktajl" : undefined}
      title="Wylosuj koktajl"
      className={cn("rounded-full", className)}
    >
      <ShuffleIcon
        data-icon="inline-start"
        aria-hidden
        className={cn(
          "transition-transform duration-500",
          isPending && "motion-safe:animate-spin",
        )}
      />
      <span className={cn(compact && "sr-only sm:not-sr-only")}>
        {isPending ? "Losuję…" : isError ? "Spróbuj ponownie" : "Losuj koktajl"}
      </span>
    </Button>
  );
}
