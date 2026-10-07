import type { InfiniteData, QueryClient } from "@tanstack/react-query";

import { cocktailKeys } from "./queries";
import type { Cocktail, CocktailDetails, Paginated } from "./types";

/**
 * Finds a cocktail that is already on screen in one of the cached lists, so
 * the details view can show its photo and name before the full record loads.
 */
export function findCachedCocktail(
  queryClient: QueryClient,
  id: number,
): Cocktail | undefined {
  const lists = queryClient.getQueriesData<InfiniteData<Paginated<Cocktail>>>({
    queryKey: [...cocktailKeys.all, "list"],
  });
  for (const [, data] of lists) {
    for (const page of data?.pages ?? []) {
      const match = page.data.find((cocktail) => cocktail.id === id);
      if (match) return match;
    }
  }

  const byIds = queryClient.getQueriesData<Cocktail[]>({
    queryKey: [...cocktailKeys.all, "by-ids"],
  });
  for (const [, data] of byIds) {
    const match = data?.find((cocktail) => cocktail.id === id);
    if (match) return match;
  }

  return undefined;
}

/** Placeholder details built from a list entry – ingredients are not known yet. */
export function cachedDetailsPlaceholder(
  queryClient: QueryClient,
  id: number,
): CocktailDetails | undefined {
  const cocktail = findCachedCocktail(queryClient, id);
  return cocktail && { ...cocktail, ingredients: [] };
}
