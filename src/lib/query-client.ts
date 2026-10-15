import {
  defaultShouldDehydrateQuery,
  isServer,
  MutationCache,
  QueryCache,
  QueryClient,
} from "@tanstack/react-query";

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
