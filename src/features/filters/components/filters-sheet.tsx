"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { SlidersHorizontalIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cocktailsInfiniteOptions } from "@/features/cocktails/queries";
import { pluralize } from "@/lib/pluralize";
import { cn } from "@/lib/utils";

import { useCocktailFilters } from "../use-cocktail-filters";
import {
  AlcoholToggle,
  CategorySelect,
  GlassSelect,
  SortSelect,
} from "./filter-controls";
import { IngredientCombobox } from "./ingredient-combobox";

/** Filters in a bottom sheet for small screens. */
export function FiltersSheet({ className }: { className?: string }) {
  const { filters, activeCount, resetFilters } = useCocktailFilters();
  // Shares the cache entry with the catalogue – no extra request.
  const { data, isFetching } = useInfiniteQuery(
    cocktailsInfiniteOptions(filters),
  );
  const total = data?.pages[0]?.meta.total;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "relative h-11 rounded-full bg-card px-4 shadow-xs",
            className,
          )}
        >
          <SlidersHorizontalIcon data-icon="inline-start" />
          Filtry
          {activeCount > 0 && (
            <span className="grid size-5 place-items-center rounded-full bg-primary text-xs text-primary-foreground tabular-nums">
              {activeCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent
        side="bottom"
        aria-describedby={undefined}
        className="max-h-[85dvh] overflow-y-auto rounded-t-3xl"
      >
        <SheetHeader>
          <SheetTitle className="text-2xl font-semibold">Filtry</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-3 px-4">
          <AlcoholToggle className="w-full" />
          <CategorySelect className="w-full" />
          <GlassSelect className="w-full" />
          <IngredientCombobox className="w-full" />
          <SortSelect className="w-full" />
        </div>
        <SheetFooter className="flex-row">
          <Button
            variant="ghost"
            className="h-11 rounded-full px-4"
            disabled={activeCount === 0}
            onClick={() => resetFilters()}
          >
            Wyczyść
          </Button>
          <SheetClose asChild>
            <Button className="h-11 flex-1 rounded-full">
              {total === undefined || isFetching
                ? "Pokaż wyniki"
                : `Pokaż ${pluralize(total, ["koktajl", "koktajle", "koktajli"])}`}
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
