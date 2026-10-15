import { ApiError } from "./api-client";

/**
 * A short, user-facing explanation of a failed request with a next step.
 * The original error is logged by the query client (see `query-client.ts`).
 */
export function userErrorMessage(error: unknown): string {
  // `fetch` rejects with a TypeError when the request never reaches the server.
  if (error instanceof TypeError) {
    return "Brak połączenia z serwerem. Sprawdź internet i spróbuj ponownie.";
  }
  if (error instanceof ApiError && error.status === 429) {
    return "Za dużo zapytań naraz. Odczekaj chwilę i spróbuj ponownie.";
  }
  if (error instanceof ApiError && error.status >= 500) {
    return "Serwer z koktajlami chwilowo nie odpowiada. Spróbuj ponownie za chwilę.";
  }
  return "Coś poszło nie tak przy pobieraniu danych. Spróbuj ponownie.";
}
