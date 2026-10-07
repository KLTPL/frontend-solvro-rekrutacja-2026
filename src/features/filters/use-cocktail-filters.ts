"use client";

import { useQueryStates } from "nuqs";
import { useMemo } from "react";

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

  return { params, filters, setParams };
}
