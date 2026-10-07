import type { CocktailDetails } from "./types";

export interface UsedIngredient {
  id: number;
  name: string;
  imageUrl: string | null;
  /** Number of cocktails containing the ingredient. */
  cocktailCount: number;
}

/**
 * The API lists ~550 ingredients, but only a fraction of them appear in any
 * cocktail. Offering only the used ones (most popular first) means picking
 * an ingredient filter never leads to an empty result on its own.
 */
export function summarizeUsedIngredients(
  cocktails: Pick<CocktailDetails, "ingredients">[],
): UsedIngredient[] {
  const byId = new Map<number, UsedIngredient>();

  for (const { ingredients } of cocktails) {
    // The same ingredient can be listed twice in one recipe – count it once.
    const unique = new Map(ingredients.map((i) => [i.id, i]));
    for (const ingredient of unique.values()) {
      const entry = byId.get(ingredient.id);
      if (entry) {
        entry.cocktailCount += 1;
      } else {
        byId.set(ingredient.id, {
          id: ingredient.id,
          name: ingredient.name,
          imageUrl: ingredient.imageUrl,
          cocktailCount: 1,
        });
      }
    }
  }

  return [...byId.values()].sort(
    (a, b) =>
      b.cocktailCount - a.cocktailCount || a.name.localeCompare(b.name, "en"),
  );
}

/** Case- and accent-insensitive substring match used by the ingredient picker. */
export function matchesIngredient(name: string, query: string): boolean {
  const normalize = (value: string) =>
    value
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .toLowerCase()
      .trim();
  return normalize(name).includes(normalize(query));
}
