import { cacheLife } from "next/cache";

import {
  fetchAllCocktailIds,
  fetchCocktail,
  fetchCocktails,
  fetchCocktailsByIds,
  fetchAllCocktailsWithIngredients,
} from "./api";
import { summarizeFilterOptions } from "./filter-options";
import type { CocktailFilters } from "./types";

/*
 * Server-side, cached counterparts of the API fetchers. They are used to
 * prerender pages and to seed the TanStack Query cache before hydration.
 * The cocktail catalogue changes rarely, so hours-long lifetimes are fine.
 */

export async function getCocktailsPage(filters: CocktailFilters, page: number) {
  "use cache";
  cacheLife("hours");
  return fetchCocktails(filters, page);
}

export async function getCocktail(id: number) {
  "use cache";
  cacheLife("hours");
  return fetchCocktail(id);
}

export async function getAllCocktailIds() {
  "use cache";
  cacheLife("hours");
  return fetchAllCocktailIds();
}

/** ~1 MB of raw data reduced to a few small lists – computed once and cached. */
export async function getFilterOptions() {
  "use cache";
  cacheLife("days");
  return summarizeFilterOptions(await fetchAllCocktailsWithIngredients());
}

// Hand-picked for the hero: photos that match the pink-and-banana palette.
const FEATURED_COCKTAIL_IDS = [11064, 12316, 11938, 11936, 11000, 12322];

export async function getFeaturedCocktails() {
  "use cache";
  cacheLife("days");
  const cocktails = await fetchCocktailsByIds(FEATURED_COCKTAIL_IDS);
  const byId = new Map(cocktails.map((cocktail) => [cocktail.id, cocktail]));
  return FEATURED_COCKTAIL_IDS.flatMap((id) => byId.get(id) ?? []);
}
