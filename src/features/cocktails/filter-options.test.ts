import { describe, expect, it } from "vitest";

import {
  countValues,
  matchesSearch,
  summarizeFilterOptions,
} from "./filter-options";

describe("countValues", () => {
  it("counts each value and sorts by popularity, then name", () => {
    expect(
      countValues(["Shot", "Cocktail", "Shot", "Cocoa", "Cocktail", "Shot"]),
    ).toEqual([
      { value: "Shot", cocktailCount: 3 },
      { value: "Cocktail", cocktailCount: 2 },
      { value: "Cocoa", cocktailCount: 1 },
    ]);
  });
});

describe("summarizeFilterOptions", () => {
  it("collects categories and glasses used by the cocktails", () => {
    const result = summarizeFilterOptions([
      { ingredients: [], category: "Cocktail", glass: "Highball glass" },
      { ingredients: [], category: "Cocktail", glass: "Coupe Glass" },
    ]);

    expect(result.categories).toEqual([
      { value: "Cocktail", cocktailCount: 2 },
    ]);
    expect(result.glasses.map((glass) => glass.value)).toEqual([
      "Coupe Glass",
      "Highball glass",
    ]);
  });
});

describe("matchesSearch", () => {
  it("ignores case, surrounding spaces and diacritics", () => {
    expect(matchesSearch("Crème de cacao", "  CREME ")).toBe(true);
    expect(matchesSearch("Lime juice", "lime")).toBe(true);
    expect(matchesSearch("Gin", "rum")).toBe(false);
  });
});
