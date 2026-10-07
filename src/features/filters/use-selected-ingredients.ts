"use client";

import { useQuery } from "@tanstack/react-query";

import { usedIngredientsOptions } from "@/features/cocktails/queries";

import { useCocktailFilters } from "./use-cocktail-filters";

/** Names for the ingredient ids stored in the URL (needed for chips and labels). */
export function useSelectedIngredients() {
  const { params } = useCocktailFilters();
  const { data } = useQuery({
    ...usedIngredientsOptions,
    enabled: params.ingredients.length > 0,
  });

  return params.ingredients.map((id) => ({
    id,
    name: data?.find((ingredient) => ingredient.id === id)?.name ?? null,
  }));
}
