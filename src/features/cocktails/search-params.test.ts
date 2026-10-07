import { describe, expect, it } from "vitest";

import {
  buildCocktailSearchParams,
  countActiveFilters,
  defaultFilters,
} from "./search-params";

describe("buildCocktailSearchParams", () => {
  it("sends only pagination and sorting for default filters", () => {
    const params = buildCocktailSearchParams(defaultFilters, 3, 12);

    expect(params.toString()).toBe("page=3&perPage=12&sort=name");
  });

  it("wraps the search term in ILIKE wildcards", () => {
    const params = buildCocktailSearchParams(
      { ...defaultFilters, search: "  mar " },
      1,
    );

    expect(params.get("name")).toBe("%mar%");
  });

  it("maps every filter to the matching API parameter", () => {
    const params = buildCocktailSearchParams(
      {
        search: "",
        category: "Cocktail",
        glass: "Highball glass",
        alcoholic: false,
        ingredientIds: [1, 2],
        sort: "-createdAt",
      },
      1,
    );

    expect(params.get("category")).toBe("Cocktail");
    expect(params.get("glass")).toBe("Highball glass");
    expect(params.get("alcoholic")).toBe("false");
    expect(params.getAll("ingredientId[]")).toEqual(["1", "2"]);
    expect(params.get("sort")).toBe("-createdAt");
  });
});

describe("countActiveFilters", () => {
  it("ignores sorting and blank search", () => {
    expect(
      countActiveFilters({ ...defaultFilters, search: " ", sort: "-name" }),
    ).toBe(0);
  });

  it("counts each selected ingredient separately", () => {
    expect(
      countActiveFilters({
        ...defaultFilters,
        alcoholic: true,
        ingredientIds: [1, 2, 3],
      }),
    ).toBe(4);
  });
});
