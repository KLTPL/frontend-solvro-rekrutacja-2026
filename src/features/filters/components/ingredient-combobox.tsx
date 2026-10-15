"use client";

import { SproutIcon } from "lucide-react";
import Image from "next/image";

import type { FilterOptions } from "@/features/cocktails/filter-options";

import { useCocktailFilters } from "../use-cocktail-filters";
import { useSelectedIngredients } from "../use-selected-ingredients";
import { FilterCombobox } from "./filter-combobox";

function ingredientOptions({ ingredients }: FilterOptions) {
  return ingredients.map((ingredient) => ({
    value: String(ingredient.id),
    label: ingredient.name,
    cocktailCount: ingredient.cocktailCount,
    thumbnail: ingredient.imageUrl ? (
      <Image
        src={ingredient.imageUrl}
        alt=""
        width={24}
        height={24}
        className="size-5 object-contain"
      />
    ) : (
      <SproutIcon aria-hidden />
    ),
  }));
}

export function IngredientCombobox({
  className,
  stickyOffset,
}: {
  className?: string;
  stickyOffset?: number;
}) {
  const { params, setParams } = useCocktailFilters();
  const selected = useSelectedIngredients();

  function toggle(value: string) {
    const id = Number(value);
    const ids = params.ingredients.includes(id)
      ? params.ingredients.filter((current) => current !== id)
      : [...params.ingredients, id];
    void setParams({ ingredients: ids });
  }

  const label =
    selected.length === 0
      ? "Składniki"
      : selected.length === 1
        ? (selected[0].name ?? "1 składnik")
        : `Składniki: ${selected.length}`;

  return (
    <FilterCombobox
      label={label}
      triggerLabel={
        selected.length ? `Składniki, wybrane: ${selected.length}` : "Składniki"
      }
      searchLabel="Szukaj składnika"
      emptyText="Brak takiego składnika"
      heading="Koktajl zawiera którykolwiek z"
      getOptions={ingredientOptions}
      selected={params.ingredients.map(String)}
      onToggle={toggle}
      stickyOffset={stickyOffset}
      className={className}
    />
  );
}
