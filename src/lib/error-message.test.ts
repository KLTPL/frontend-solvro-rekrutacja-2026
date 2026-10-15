import { describe, expect, it } from "vitest";

import { ApiError } from "./api-client";
import { userErrorMessage } from "./error-message";

describe("userErrorMessage", () => {
  it("explains a network failure", () => {
    expect(userErrorMessage(new TypeError("Failed to fetch"))).toMatch(
      /Brak połączenia/,
    );
  });

  it("explains rate limiting", () => {
    expect(userErrorMessage(new ApiError(429, "Too many requests"))).toMatch(
      /Za dużo zapytań/,
    );
  });

  it.each([500, 502, 503])("explains a server error (%i)", (status) => {
    expect(userErrorMessage(new ApiError(status, "Server error"))).toMatch(
      /chwilowo nie odpowiada/,
    );
  });

  it("falls back to a generic message without leaking details", () => {
    const message = userErrorMessage(new ApiError(400, "Request to /x failed"));
    expect(message).toMatch(/Coś poszło nie tak/);
    expect(message).not.toMatch(/Request/);
  });
});
