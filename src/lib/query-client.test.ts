import { describe, expect, it } from "vitest";

import { ApiError } from "./api-client";
import { shouldRetry } from "./query-client";

describe("shouldRetry", () => {
  it("does not retry a 404", () => {
    expect(shouldRetry(0, new ApiError(404, "Not found"))).toBe(false);
  });

  it("retries other errors up to three times", () => {
    const error = new ApiError(500, "Server error");
    expect(shouldRetry(0, error)).toBe(true);
    expect(shouldRetry(2, error)).toBe(true);
    expect(shouldRetry(3, error)).toBe(false);
    expect(shouldRetry(0, new TypeError("Failed to fetch"))).toBe(true);
  });
});
