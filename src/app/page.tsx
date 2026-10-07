import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { connection } from "next/server";
import { Suspense } from "react";

import { CocktailCatalog } from "@/features/cocktails/components/cocktail-catalog";
import { CocktailGridSkeleton } from "@/features/cocktails/components/cocktail-grid";
import {
  categoriesOptions,
  cocktailsInfiniteOptions,
  glassesOptions,
} from "@/features/cocktails/queries";
import {
  getCategories,
  getCocktailsPage,
  getGlasses,
} from "@/features/cocktails/server";
import {
  loadFilterParams,
  toCocktailFilters,
} from "@/features/filters/filter-params";
import { getQueryClient } from "@/lib/query-client";

export default function HomePage({ searchParams }: PageProps<"/">) {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 sm:px-6">
      <section
        id="katalog"
        aria-labelledby="catalog-heading"
        className="scroll-mt-20 py-10"
      >
        <h2
          id="catalog-heading"
          className="mb-6 text-3xl font-semibold tracking-tight sm:text-4xl"
        >
          Katalog
        </h2>
        <Suspense fallback={<CocktailGridSkeleton />}>
          <CatalogWithData searchParams={searchParams} />
        </Suspense>
      </section>
    </main>
  );
}

/**
 * Reads the filters from the URL and seeds the query cache with the first
 * page, so the list is server-rendered and hydrates without a refetch.
 */
async function CatalogWithData({
  searchParams,
}: Pick<PageProps<"/">, "searchParams">) {
  const filters = toCocktailFilters(await loadFilterParams(searchParams));
  // The query cache timestamps entries with Date.now(), so this part has to
  // run per request rather than during prerendering.
  await connection();
  const queryClient = getQueryClient();

  await Promise.all([
    queryClient.prefetchInfiniteQuery({
      ...cocktailsInfiniteOptions(filters),
      queryFn: ({ pageParam }) => getCocktailsPage(filters, pageParam),
    }),
    queryClient.prefetchQuery({ ...categoriesOptions, queryFn: getCategories }),
    queryClient.prefetchQuery({ ...glassesOptions, queryFn: getGlasses }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CocktailCatalog />
    </HydrationBoundary>
  );
}
