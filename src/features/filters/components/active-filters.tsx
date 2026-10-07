"use client";

import { XIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { Button } from "@/components/ui/button";
import { alcoholLabel, categoryLabel } from "@/features/cocktails/labels";

import { useCocktailFilters } from "../use-cocktail-filters";
import { useSelectedIngredients } from "../use-selected-ingredients";

interface Chip {
  key: string;
  label: string;
  onRemove: () => unknown;
}

/** Removable chips summarising every active filter. */
export function ActiveFilters() {
  const { params, setParams, resetFilters } = useCocktailFilters();
  const ingredients = useSelectedIngredients();

  const chips: Chip[] = [];
  if (params.q) {
    chips.push({
      key: "q",
      label: `„${params.q}”`,
      onRemove: () => setParams({ q: null }),
    });
  }
  if (params.category) {
    chips.push({
      key: "category",
      label: categoryLabel(params.category),
      onRemove: () => setParams({ category: null }),
    });
  }
  if (params.glass) {
    chips.push({
      key: "glass",
      label: params.glass,
      onRemove: () => setParams({ glass: null }),
    });
  }
  if (params.alcoholic !== null) {
    chips.push({
      key: "alcoholic",
      label: alcoholLabel(params.alcoholic),
      onRemove: () => setParams({ alcoholic: null }),
    });
  }
  for (const { id, name } of ingredients) {
    chips.push({
      key: `ingredient-${id}`,
      label: name ?? "Składnik…",
      onRemove: () =>
        setParams({
          ingredients: params.ingredients.filter((current) => current !== id),
        }),
    });
  }

  if (chips.length === 0) return null;

  return (
    <div
      className="flex flex-wrap items-center gap-2"
      aria-label="Aktywne filtry"
    >
      <AnimatePresence initial={false} mode="popLayout">
        {chips.map((chip) => (
          <motion.span
            key={chip.key}
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 500, damping: 35 }}
            className="inline-flex h-8 items-center gap-1 rounded-full bg-banana pr-1 pl-3 text-sm font-medium text-banana-foreground"
          >
            {chip.label}
            <button
              type="button"
              onClick={chip.onRemove}
              aria-label={`Usuń filtr: ${chip.label}`}
              className="grid size-6 place-items-center rounded-full transition-colors hover:bg-banana-foreground/10 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              <XIcon aria-hidden className="size-3.5" />
            </button>
          </motion.span>
        ))}
      </AnimatePresence>
      <Button
        variant="ghost"
        size="sm"
        className="rounded-full text-muted-foreground"
        onClick={() => resetFilters()}
      >
        Wyczyść wszystko
      </Button>
    </div>
  );
}
