import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";

import {
  fetchCategories,
  fetchCocktail,
  fetchCocktails,
  fetchCocktailsByIds,
  fetchGlasses,
  fetchUsedIngredients,
} from "./api";
import type { Cocktail, CocktailFilters } from "./types";

export const cocktailKeys = {
  all: ["cocktails"] as const,
  list: (filters: CocktailFilters) =>
    [...cocktailKeys.all, "list", filters] as const,
  detail: (id: number) => [...cocktailKeys.all, "detail", id] as const,
  byIds: (ids: number[]) => [...cocktailKeys.all, "by-ids", ids] as const,
  categories: () => [...cocktailKeys.all, "categories"] as const,
  glasses: () => [...cocktailKeys.all, "glasses"] as const,
  usedIngredients: () => [...cocktailKeys.all, "used-ingredients"] as const,
};

export function cocktailsInfiniteOptions(filters: CocktailFilters) {
  return infiniteQueryOptions({
    queryKey: cocktailKeys.list(filters),
    queryFn: ({ pageParam, signal }) =>
      fetchCocktails(filters, pageParam, signal),
    initialPageParam: 1,
    getNextPageParam: ({ meta }) =>
      meta.currentPage < meta.lastPage ? meta.currentPage + 1 : undefined,
  });
}

export function cocktailDetailsOptions(id: number) {
  return queryOptions({
    queryKey: cocktailKeys.detail(id),
    queryFn: ({ signal }) => fetchCocktail(id, signal),
  });
}

export function cocktailsByIdsOptions(ids: number[]) {
  return queryOptions({
    queryKey: cocktailKeys.byIds(ids),
    queryFn: ({ signal }): Promise<Cocktail[]> =>
      ids.length ? fetchCocktailsByIds(ids, signal) : Promise.resolve([]),
  });
}

// Dictionaries practically never change – fetch them once per session.
export const categoriesOptions = queryOptions({
  queryKey: cocktailKeys.categories(),
  queryFn: ({ signal }) => fetchCategories(signal),
  staleTime: Infinity,
});

export const glassesOptions = queryOptions({
  queryKey: cocktailKeys.glasses(),
  queryFn: ({ signal }) => fetchGlasses(signal),
  staleTime: Infinity,
});

export const usedIngredientsOptions = queryOptions({
  queryKey: cocktailKeys.usedIngredients(),
  queryFn: ({ signal }) => fetchUsedIngredients(signal),
  staleTime: Infinity,
});
