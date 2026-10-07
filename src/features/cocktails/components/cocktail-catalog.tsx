"use client";

import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import { CircleAlertIcon, GlassWaterIcon, RotateCcwIcon } from "lucide-react";

import { StateMessage } from "@/components/state-message";
import { Button } from "@/components/ui/button";
import { FiltersBar } from "@/features/filters/components/filters-bar";
import { useCocktailFilters } from "@/features/filters/use-cocktail-filters";
import { pluralize } from "@/lib/pluralize";
import { cn } from "@/lib/utils";

import { cocktailsInfiniteOptions } from "../queries";
import { CocktailGrid, CocktailGridSkeleton } from "./cocktail-grid";
import { LoadMore } from "./load-more";

export function CocktailCatalog() {
  return (
    <>
      <FiltersBar />
      <CatalogResults />
    </>
  );
}

function CatalogResults() {
  const { filters, activeCount, resetFilters } = useCocktailFilters();
  const {
    data,
    error,
    isPending,
    isError,
    isPlaceholderData,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    refetch,
  } = useInfiniteQuery({
    ...cocktailsInfiniteOptions(filters),
    // Keep the current results on screen while a new filter combination loads,
    // so cards can animate into place instead of flashing a skeleton.
    placeholderData: keepPreviousData,
  });

  if (isPending) return <CocktailGridSkeleton />;

  if (isError) {
    return (
      <StateMessage
        icon={<CircleAlertIcon />}
        title="Nie udało się pobrać koktajli"
        description={error.message}
        action={
          <Button onClick={() => refetch()} className="rounded-full px-4">
            <RotateCcwIcon data-icon="inline-start" />
            Spróbuj ponownie
          </Button>
        }
      />
    );
  }

  const cocktails = data.pages.flatMap((page) => page.data);
  const total = data.pages[0]?.meta.total ?? 0;

  if (total === 0) {
    return (
      <StateMessage
        icon={<GlassWaterIcon />}
        title="Nic tu nie nalano"
        description="Żaden koktajl nie pasuje do wybranych filtrów. Spróbuj poluzować kryteria."
        action={
          activeCount > 0 && (
            <Button
              onClick={() => resetFilters()}
              className="rounded-full px-4"
            >
              Wyczyść filtry
            </Button>
          )
        }
      />
    );
  }

  return (
    <div
      aria-busy={isPlaceholderData}
      className={cn(
        "transition-opacity duration-300",
        isPlaceholderData && "opacity-60",
      )}
    >
      <p className="mt-4 mb-4 text-sm text-muted-foreground" aria-live="polite">
        {activeCount > 0 && "Znaleziono: "}
        {pluralize(total, ["koktajl", "koktajle", "koktajli"])}
      </p>

      <CocktailGrid cocktails={cocktails} />

      {hasNextPage && (
        <LoadMore
          isLoading={isFetchingNextPage}
          onLoadMore={() => {
            if (!isFetchingNextPage) void fetchNextPage();
          }}
        />
      )}
    </div>
  );
}
