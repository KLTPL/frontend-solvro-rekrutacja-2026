"use client";

import { ActiveFilters } from "./active-filters";
import {
  AlcoholToggle,
  CategorySelect,
  GlassSelect,
  SortSelect,
} from "./filter-controls";
import { FiltersSheet } from "./filters-sheet";
import { IngredientCombobox } from "./ingredient-combobox";
import { SearchInput } from "./search-input";

export function FiltersBar() {
  // A fragment on purpose: the sticky search row must be a direct child of
  // the catalogue section, so it stays pinned through the whole list.
  return (
    <>
      <div className="sticky top-16 z-30 -mx-4 mb-3 flex gap-2 bg-background/80 px-4 py-2 backdrop-blur-lg sm:-mx-6 sm:px-6">
        <div className="min-w-0 flex-1">
          <SearchInput />
        </div>
        <FiltersSheet className="lg:hidden" />
        <SortSelect className="hidden h-11! lg:flex" />
      </div>

      <div className="mb-3 hidden flex-wrap gap-2 lg:flex">
        <AlcoholToggle />
        <CategorySelect className="min-w-48" />
        <GlassSelect className="min-w-48" />
        <IngredientCombobox className="min-w-48" />
      </div>

      <ActiveFilters />
    </>
  );
}
