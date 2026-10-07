"use client";

import { useQueryStates } from "nuqs";
import { useCallback, useMemo } from "react";

import { countActiveFilters } from "@/features/cocktails/search-params";

import { filterParsers, toCocktailFilters } from "./filter-params";

export function useCocktailFilters() {
  const [params, setParams] = useQueryStates(filterParsers, {
    // Filtering happens on the client through TanStack Query,
    // so the server does not need to re-render on every change.
    shallow: true,
    history: "replace",
    scroll: false,
  });

  const filters = useMemo(() => toCocktailFilters(params), [params]);

  /** Clears every filter but keeps the chosen sort order. */
  const resetFilters = useCallback(
    () =>
      setParams({
        q: null,
        category: null,
        glass: null,
        alcoholic: null,
        ingredients: null,
      }),
    [setParams],
  );

  return {
    params,
    filters,
    setParams,
    resetFilters,
    activeCount: countActiveFilters(filters),
  };
}
