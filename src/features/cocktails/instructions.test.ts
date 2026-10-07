import { describe, expect, it } from "vitest";

import { splitInstructions } from "./instructions";

describe("splitInstructions", () => {
  it("splits sentences into separate steps", () => {
    expect(
      splitInstructions("Stir into glass over ice, garnish and serve. Enjoy!"),
    ).toEqual(["Stir into glass over ice, garnish and serve.", "Enjoy!"]);
  });

  it("keeps abbreviations followed by lowercase text in one step", () => {
    expect(splitInstructions("Add approx. 2 oz of gin. Stir.")).toEqual([
      "Add approx. 2 oz of gin.",
      "Stir.",
    ]);
  });

  it("ignores surrounding and repeated whitespace", () => {
    expect(splitInstructions("  Shake well.\r\n\r\nStrain.  ")).toEqual([
      "Shake well.",
      "Strain.",
    ]);
  });

  it("returns an empty list for empty instructions", () => {
    expect(splitInstructions("   ")).toEqual([]);
  });
});
