import {
  summarizeUsedIngredients,
  type UsedIngredient,
} from "./ingredient-stats";
import type { CocktailDetails } from "./types";

export interface CountedValue {
  value: string;
  /** Number of cocktails with this value. */
  cocktailCount: number;
}

/** Everything the filter pickers offer, each with the number of matching cocktails. */
export interface FilterOptions {
  ingredients: UsedIngredient[];
  categories: CountedValue[];
  glasses: CountedValue[];
}

/** Occurrences of each value, most common first, then alphabetically. */
export function countValues(values: string[]): CountedValue[] {
  const counts = new Map<string, number>();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);

  return [...counts]
    .map(([value, cocktailCount]) => ({ value, cocktailCount }))
    .sort(
      (a, b) =>
        b.cocktailCount - a.cocktailCount ||
        a.value.localeCompare(b.value, "en"),
    );
}

/**
 * Like the ingredients, categories and glasses are taken from the cocktails
 * themselves – picking any of them never leads to an empty result on its own.
 */
export function summarizeFilterOptions(
  cocktails: Pick<CocktailDetails, "ingredients" | "category" | "glass">[],
): FilterOptions {
  return {
    ingredients: summarizeUsedIngredients(cocktails),
    categories: countValues(cocktails.map((cocktail) => cocktail.category)),
    glasses: countValues(cocktails.map((cocktail) => cocktail.glass)),
  };
}

/** Case- and accent-insensitive substring match used by the filter pickers. */
export function matchesSearch(text: string, query: string): boolean {
  const normalize = (value: string) =>
    value
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .toLowerCase()
      .trim();
  return normalize(text).includes(normalize(query));
}
