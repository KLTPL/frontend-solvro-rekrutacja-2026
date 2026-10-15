import { apiFetch } from "@/lib/api-client";

import type { FilterOptions } from "./filter-options";
import { buildCocktailSearchParams } from "./search-params";
import type {
  Cocktail,
  CocktailDetails,
  CocktailFilters,
  Paginated,
} from "./types";

type Signal = AbortSignal | undefined;

export function fetchCocktails(
  filters: CocktailFilters,
  page: number,
  signal?: Signal,
) {
  return apiFetch<Paginated<Cocktail>>(
    "/cocktails",
    buildCocktailSearchParams(filters, page),
    { signal },
  );
}

export async function fetchCocktail(id: number, signal?: Signal) {
  const { data } = await apiFetch<{ data: CocktailDetails }>(
    `/cocktails/${id}`,
    undefined,
    { signal },
  );
  return data;
}

export async function fetchCocktailsByIds(ids: number[], signal?: Signal) {
  const params = new URLSearchParams({ perPage: String(ids.length) });
  for (const id of ids) params.append("id[]", String(id));
  const { data } = await apiFetch<Paginated<Cocktail>>("/cocktails", params, {
    signal,
  });
  return data;
}

/** The API has no "random" endpoint – pick a random page of size 1 instead. */
export async function fetchRandomCocktail(signal?: Signal) {
  const { meta } = await apiFetch<Paginated<Cocktail>>(
    "/cocktails",
    new URLSearchParams({ perPage: "1" }),
    { signal },
  );
  const page = 1 + Math.floor(Math.random() * meta.total);
  const { data } = await apiFetch<Paginated<Cocktail>>(
    "/cocktails",
    new URLSearchParams({ perPage: "1", page: String(page) }),
    { signal },
  );
  return data[0];
}

export async function fetchAllCocktailsWithIngredients() {
  const { data } = await apiFetch<Paginated<CocktailDetails>>(
    "/cocktails",
    new URLSearchParams({ perPage: "1000", ingredients: "true" }),
  );
  return data;
}

export async function fetchAllCocktailIds() {
  const { data } = await apiFetch<Paginated<Cocktail>>(
    "/cocktails",
    new URLSearchParams({ perPage: "1000" }),
  );
  return data.map((cocktail) => cocktail.id);
}

/** Served by our own route handler (see `app/api/filter-options/route.ts`). */
export async function fetchFilterOptions(signal?: Signal) {
  const response = await fetch("/api/filter-options", { signal });
  if (!response.ok) {
    throw new Error(`Failed to load filter options (${response.status})`);
  }
  return (await response.json()) as FilterOptions;
}
