import { describe, expect, it } from "vitest";

import { projectMomentum, rubberband } from "./gesture";

describe("projectMomentum", () => {
  it("does not move a resting element", () => {
    expect(projectMomentum(0)).toBe(0);
  });

  it("carries a flick about half its velocity further", () => {
    expect(projectMomentum(1000)).toBeCloseTo(499);
  });

  it("projects in the direction of the flick", () => {
    expect(projectMomentum(-1000)).toBeCloseTo(-499);
  });

  it("stops sooner with a lower deceleration rate", () => {
    expect(projectMomentum(1000, 0.99)).toBeCloseTo(99);
  });
});

describe("rubberband", () => {
  it("does not move without an overshoot", () => {
    expect(rubberband(0, 400)).toBe(0);
  });

  it("starts by following the pointer at the given rate", () => {
    expect(rubberband(1, 400)).toBeCloseTo(0.55, 2);
  });

  it("resists more the further it is pulled", () => {
    const first = rubberband(100, 400);
    const second = rubberband(200, 400) - first;
    expect(second).toBeLessThan(first);
  });

  it("never moves further than the dimension", () => {
    expect(rubberband(100_000, 400)).toBeLessThan(400);
  });

  it("keeps the direction of the overshoot", () => {
    expect(rubberband(-100, 400)).toBeCloseTo(-rubberband(100, 400));
  });
});
