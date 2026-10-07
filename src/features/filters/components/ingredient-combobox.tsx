"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronDownIcon, SproutIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  matchesIngredient,
  type UsedIngredient,
} from "@/features/cocktails/ingredient-stats";
import { usedIngredientsOptions } from "@/features/cocktails/queries";
import { cn } from "@/lib/utils";

import { useCocktailFilters } from "../use-cocktail-filters";
import { useSelectedIngredients } from "../use-selected-ingredients";

export function IngredientCombobox({ className }: { className?: string }) {
  const { params, setParams } = useCocktailFilters();
  const selected = useSelectedIngredients();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const { data: ingredients = [], isPending } = useQuery({
    ...usedIngredientsOptions,
    enabled: open,
  });
  const results = search
    ? ingredients.filter((ingredient) =>
        matchesIngredient(ingredient.name, search),
      )
    : ingredients;

  function toggle(id: number) {
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
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label={
            selected.length
              ? `Składniki, wybrane: ${selected.length}`
              : "Składniki"
          }
          // Warm the cache on hover so the list is ready when it opens.
          onPointerEnter={() =>
            void queryClient.prefetchQuery(usedIngredientsOptions)
          }
          className={cn(
            "h-10 justify-between rounded-full bg-card px-4 font-normal shadow-xs",
            selected.length > 0 && "border-primary/50",
            className,
          )}
        >
          <span className="truncate">{label}</span>
          <ChevronDownIcon aria-hidden className="text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            value={search}
            onValueChange={setSearch}
            placeholder="Szukaj składnika…"
          />
          <CommandList aria-busy={isPending}>
            <CommandEmpty>
              {isPending ? "Ładowanie składników…" : "Brak takiego składnika"}
            </CommandEmpty>
            {results.length > 0 && (
              <CommandGroup heading="Koktajl zawiera którykolwiek z">
                {results.map((ingredient) => (
                  <IngredientOption
                    key={ingredient.id}
                    ingredient={ingredient}
                    checked={params.ingredients.includes(ingredient.id)}
                    onToggle={() => toggle(ingredient.id)}
                  />
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function IngredientOption({
  ingredient,
  checked,
  onToggle,
}: {
  ingredient: UsedIngredient;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <CommandItem
      value={String(ingredient.id)}
      data-checked={checked}
      onSelect={onToggle}
    >
      <span className="grid size-6 shrink-0 place-items-center overflow-hidden rounded-full bg-blush/50">
        {ingredient.imageUrl ? (
          <Image
            src={ingredient.imageUrl}
            alt=""
            width={24}
            height={24}
            className="size-5 object-contain"
          />
        ) : (
          <SproutIcon aria-hidden className="size-3" />
        )}
      </span>
      <span className="flex-1 truncate">{ingredient.name}</span>
      <span
        className="text-xs text-muted-foreground tabular-nums"
        aria-label={`w ${ingredient.cocktailCount} koktajlach`}
      >
        {ingredient.cocktailCount}
      </span>
    </CommandItem>
  );
}
