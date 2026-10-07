import type { CocktailFilters } from "./types";

export const COCKTAILS_PER_PAGE = 24;

export const defaultFilters: CocktailFilters = {
  search: "",
  category: null,
  glass: null,
  alcoholic: null,
  ingredientIds: [],
  sort: "name",
};

/** Translates UI filters into the query string understood by the cocktails API. */
export function buildCocktailSearchParams(
  filters: CocktailFilters,
  page: number,
  perPage = COCKTAILS_PER_PAGE,
): URLSearchParams {
  const params = new URLSearchParams({
    page: String(page),
    perPage: String(perPage),
    sort: filters.sort,
  });

  const search = filters.search.trim();
  // The API matches `name` with SQL ILIKE, so a substring search needs wildcards.
  if (search) params.set("name", `%${search}%`);
  if (filters.category) params.set("category", filters.category);
  if (filters.glass) params.set("glass", filters.glass);
  if (filters.alcoholic !== null) {
    params.set("alcoholic", String(filters.alcoholic));
  }
  for (const id of filters.ingredientIds) {
    params.append("ingredientId[]", String(id));
  }

  return params;
}

export function countActiveFilters(filters: CocktailFilters): number {
  return (
    Number(Boolean(filters.search.trim())) +
    Number(filters.category !== null) +
    Number(filters.glass !== null) +
    Number(filters.alcoholic !== null) +
    filters.ingredientIds.length
  );
}
