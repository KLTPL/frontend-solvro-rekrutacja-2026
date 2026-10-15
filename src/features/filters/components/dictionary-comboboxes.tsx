"use client";

import type { LucideIcon } from "lucide-react";

import type {
  CountedValue,
  FilterOptions,
} from "@/features/cocktails/filter-options";
import { categoryLabel } from "@/features/cocktails/labels";

import { useCocktailFilters } from "../use-cocktail-filters";
import { FilterCombobox } from "./filter-combobox";
import { categoryIcon, glassIcon } from "./filter-icons";

function toOptions(
  values: CountedValue[],
  format: (value: string) => string,
  icon: (value: string) => LucideIcon,
) {
  return values.map(({ value, cocktailCount }) => {
    const Icon = icon(value);
    return {
      value,
      label: format(value),
      cocktailCount,
      thumbnail: <Icon aria-hidden />,
    };
  });
}

const categoryOptions = ({ categories }: FilterOptions) =>
  toOptions(categories, categoryLabel, categoryIcon);

const glassOptions = ({ glasses }: FilterOptions) =>
  toOptions(glasses, (glass) => glass, glassIcon);

interface DictionaryComboboxProps {
  className?: string;
  stickyOffset?: number;
}

export function CategoryCombobox(props: DictionaryComboboxProps) {
  const { params, setParams } = useCocktailFilters();
  const { category } = params;
  const label = category ? categoryLabel(category) : null;

  return (
    <FilterCombobox
      label={label ?? "Kategoria"}
      triggerLabel={label ? `Kategoria: ${label}` : "Kategoria"}
      searchLabel="Szukaj kategorii"
      emptyText="Brak takiej kategorii"
      getOptions={categoryOptions}
      selected={category ? [category] : []}
      // Picking the current category again clears it.
      onToggle={(value) =>
        void setParams({ category: value === category ? null : value })
      }
      closeOnSelect
      {...props}
    />
  );
}

export function GlassCombobox(props: DictionaryComboboxProps) {
  const { params, setParams } = useCocktailFilters();
  const { glass } = params;

  return (
    <FilterCombobox
      label={glass ?? "Rodzaj szkła"}
      triggerLabel={glass ? `Rodzaj szkła: ${glass}` : "Rodzaj szkła"}
      searchLabel="Szukaj szkła"
      emptyText="Brak takiego szkła"
      getOptions={glassOptions}
      selected={glass ? [glass] : []}
      onToggle={(value) =>
        void setParams({ glass: value === glass ? null : value })
      }
      closeOnSelect
      {...props}
    />
  );
}
