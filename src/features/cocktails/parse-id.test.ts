import { describe, expect, it } from "vitest";

import { parseCocktailId } from "./parse-id";

describe("parseCocktailId", () => {
  it("accepts positive integers", () => {
    expect(parseCocktailId("11003")).toBe(11003);
  });

  it.each(["abc", "", "0", "-1", "1.5", "1e3", " 12", "99999999999999999999"])(
    "rejects %j",
    (raw) => {
      expect(parseCocktailId(raw)).toBeNull();
    },
  );
});
