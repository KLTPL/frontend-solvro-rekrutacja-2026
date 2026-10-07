import { describe, expect, it } from "vitest";

import { formatMeasure } from "./measure";

describe("formatMeasure", () => {
  it("returns null for missing or blank measures", () => {
    expect(formatMeasure(null, "ml")).toBeNull();
    expect(formatMeasure("   ", "oz")).toBeNull();
  });

  it("only trims the value when ounces are requested", () => {
    expect(formatMeasure("1 1/2 oz ", "oz")).toBe("1 1/2 oz");
  });

  it.each([
    ["1 oz ", "30 ml"],
    ["1/2 oz ", "15 ml"],
    ["1 1/2 oz ", "45 ml"],
    ["1 2/3 oz ", "50 ml"],
    ["1/3 oz ", "10 ml"],
    ["1/4 oz", "8 ml"],
    ["2-3 oz ", "60–90 ml"],
    ["4.5 cL", "45 ml"],
    ["2 1/2 oz Blended ", "75 ml Blended"],
    ["1/2 oz white ", "15 ml white"],
  ])("converts %j to %j", (input, expected) => {
    expect(formatMeasure(input, "ml")).toBe(expected);
  });

  it.each(["dash", "2 dashes", "Juice of 1/2 ", "2 or 3 ", "1 tsp ", "1 cube"])(
    "leaves non-volume measure %j untouched",
    (input) => {
      expect(formatMeasure(input, "ml")).toBe(input.trim());
    },
  );
});
