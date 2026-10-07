import { describe, expect, it } from "vitest";

import { pluralize } from "./pluralize";

const forms: [string, string, string] = ["koktajl", "koktajle", "koktajli"];

describe("pluralize", () => {
  it.each([
    [0, "0 koktajli"],
    [1, "1 koktajl"],
    [2, "2 koktajle"],
    [4, "4 koktajle"],
    [5, "5 koktajli"],
    [12, "12 koktajli"],
    [22, "22 koktajle"],
    [220, "220 koktajli"],
  ])("formats %i", (count, expected) => {
    expect(pluralize(count, forms)).toBe(expected);
  });
});
