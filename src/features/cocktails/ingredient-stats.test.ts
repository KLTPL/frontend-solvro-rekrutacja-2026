import { describe, expect, it } from "vitest";

import {
  matchesIngredient,
  summarizeUsedIngredients,
} from "./ingredient-stats";
import type { CocktailIngredient } from "./types";

function ingredient(id: number, name: string): CocktailIngredient {
  return {
    id,
    name,
    description: null,
    alcohol: true,
    type: null,
    percentage: null,
    imageUrl: null,
    measure: null,
  };
}

describe("summarizeUsedIngredients", () => {
  it("counts cocktails per ingredient and sorts by popularity, then name", () => {
    const gin = ingredient(1, "Gin");
    const lime = ingredient(2, "Lime");
    const amaretto = ingredient(3, "Amaretto");

    const result = summarizeUsedIngredients([
      { ingredients: [gin, lime] },
      { ingredients: [gin] },
      { ingredients: [lime, amaretto, gin] },
    ]);

    expect(result.map((i) => [i.name, i.cocktailCount])).toEqual([
      ["Gin", 3],
      ["Lime", 2],
      ["Amaretto", 1],
    ]);
  });

  it("counts an ingredient listed twice in one recipe only once", () => {
    const sugar = ingredient(5, "Sugar");

    const [entry] = summarizeUsedIngredients([{ ingredients: [sugar, sugar] }]);

    expect(entry.cocktailCount).toBe(1);
  });
});

describe("matchesIngredient", () => {
  it("ignores case, surrounding spaces and diacritics", () => {
    expect(matchesIngredient("Crème de cacao", "  CREME ")).toBe(true);
    expect(matchesIngredient("Lime juice", "lime")).toBe(true);
    expect(matchesIngredient("Gin", "rum")).toBe(false);
  });
});
