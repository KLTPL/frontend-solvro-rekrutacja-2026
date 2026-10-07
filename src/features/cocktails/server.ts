import { cacheLife } from "next/cache";

import {
  fetchAllCocktailIds,
  fetchCategories,
  fetchCocktail,
  fetchCocktails,
  fetchCocktailsByIds,
  fetchAllCocktailsWithIngredients,
  fetchGlasses,
} from "./api";
import { summarizeUsedIngredients } from "./ingredient-stats";
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

export async function getCategories() {
  "use cache";
  cacheLife("days");
  return fetchCategories();
}

export async function getGlasses() {
  "use cache";
  cacheLife("days");
  return fetchGlasses();
}

/** ~1 MB of raw data reduced to a small list – computed once and cached. */
export async function getUsedIngredients() {
  "use cache";
  cacheLife("days");
  return summarizeUsedIngredients(await fetchAllCocktailsWithIngredients());
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
