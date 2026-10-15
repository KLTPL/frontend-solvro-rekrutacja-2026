import { describe, expect, it } from "vitest";

import {
  insertFavoriteId,
  sanitizeFavoriteIds,
  toggleFavoriteId,
} from "./favorites-store";

describe("toggleFavoriteId", () => {
  it("adds new favourites to the front", () => {
    expect(toggleFavoriteId([1, 2], 3)).toEqual([3, 1, 2]);
  });

  it("removes an existing favourite", () => {
    expect(toggleFavoriteId([3, 1, 2], 1)).toEqual([3, 2]);
  });
});

describe("insertFavoriteId", () => {
  it("restores a favourite at its previous position", () => {
    expect(insertFavoriteId([3, 2], 1, 1)).toEqual([3, 1, 2]);
  });

  it("appends when the position is past the end", () => {
    expect(insertFavoriteId([3], 1, 5)).toEqual([3, 1]);
  });

  it("leaves the list alone when the favourite is already there", () => {
    const ids = [3, 1, 2];
    expect(insertFavoriteId(ids, 1, 0)).toBe(ids);
  });
});

describe("sanitizeFavoriteIds", () => {
  it("keeps valid ids in order", () => {
    expect(sanitizeFavoriteIds([11003, 12654])).toEqual([11003, 12654]);
  });

  it.each([null, undefined, "11003", { id: 1 }])(
    "turns malformed storage %j into an empty list",
    (value) => {
      expect(sanitizeFavoriteIds(value)).toEqual([]);
    },
  );

  it("drops entries that are not positive integers", () => {
    expect(sanitizeFavoriteIds([1, "2", -3, 4.5, null, 6])).toEqual([1, 6]);
  });
});
