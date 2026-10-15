import {
  defaultShouldDehydrateQuery,
  isServer,
  MutationCache,
  QueryCache,
  QueryClient,
} from "@tanstack/react-query";

import { isNotFoundError } from "./api-client";

const MAX_RETRIES = 3;

/** A missing cocktail will not appear on a retry – only transient errors are retried. */
export function shouldRetry(failureCount: number, error: unknown): boolean {
  return !isNotFoundError(error) && failureCount < MAX_RETRIES;
}

function makeQueryClient() {
  return new QueryClient({
    // The UI shows a friendly message – keep the real error in the console.
    queryCache: new QueryCache({ onError: (error) => console.error(error) }),
    mutationCache: new MutationCache({
      onError: (error) => console.error(error),
    }),
    defaultOptions: {
      queries: {
        // Data from the server is fresh enough not to refetch right after hydration.
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: shouldRetry,
      },
      dehydrate: {
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === "pending",
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

/** A fresh client per server request, a single shared one in the browser. */
export function getQueryClient() {
  if (isServer) return makeQueryClient();
  browserQueryClient ??= makeQueryClient();
  return browserQueryClient;
}
