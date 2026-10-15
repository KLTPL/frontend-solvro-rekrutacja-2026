import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";

import {
  fetchCocktail,
  fetchCocktails,
  fetchCocktailsByIds,
  fetchFilterOptions,
} from "./api";
import type { Cocktail, CocktailFilters } from "./types";

export const cocktailKeys = {
  all: ["cocktails"] as const,
  list: (filters: CocktailFilters) =>
    [...cocktailKeys.all, "list", filters] as const,
  detail: (id: number) => [...cocktailKeys.all, "detail", id] as const,
  byIds: (ids: number[]) => [...cocktailKeys.all, "by-ids", ids] as const,
  filterOptions: () => [...cocktailKeys.all, "filter-options"] as const,
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

// The catalogue practically never changes – fetch the choices once per session.
export const filterOptionsQuery = queryOptions({
  queryKey: cocktailKeys.filterOptions(),
  queryFn: ({ signal }) => fetchFilterOptions(signal),
  staleTime: Infinity,
});
