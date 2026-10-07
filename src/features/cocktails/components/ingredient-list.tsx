"use client";

import { CheckIcon, InfoIcon, SproutIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

import { formatMeasure } from "../measure";
import type { CocktailIngredient } from "../types";
import { useMeasureUnit } from "./measure-unit-toggle";

export function IngredientList({
  ingredients,
}: {
  ingredients: CocktailIngredient[];
}) {
  const [unit] = useMeasureUnit();
  // A tiny "shopping list": tick off what you already have at home.
  const [checked, setChecked] = useState<ReadonlySet<number>>(new Set());

  function toggle(id: number) {
    setChecked((current) => {
      const next = new Set(current);
      if (!next.delete(id)) next.add(id);
      return next;
    });
  }

  return (
    <ul className="divide-y divide-border/70">
      {ingredients.map((ingredient, index) => {
        const isChecked = checked.has(ingredient.id);
        const measure = formatMeasure(ingredient.measure, unit);
        return (
          <li
            key={`${ingredient.id}-${index}`}
            className="flex items-center gap-3 py-2.5"
          >
            <button
              type="button"
              role="checkbox"
              aria-checked={isChecked}
              aria-label={`Mam: ${ingredient.name}`}
              onClick={() => toggle(ingredient.id)}
              className={cn(
                "grid size-6 shrink-0 place-items-center rounded-full border-2 border-input transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
                isChecked &&
                  "border-primary bg-primary text-primary-foreground",
              )}
            >
              <CheckIcon
                aria-hidden
                className={cn(
                  "size-3.5 scale-50 opacity-0 transition-[scale,opacity]",
                  isChecked && "scale-100 opacity-100",
                )}
              />
            </button>

            <IngredientThumb ingredient={ingredient} />

            <div
              className={cn(
                "min-w-0 flex-1 transition-opacity",
                isChecked && "opacity-50",
              )}
            >
              <IngredientInfo ingredient={ingredient} />
            </div>

            {measure && (
              <span className="shrink-0 rounded-full bg-secondary px-2.5 py-0.5 text-sm font-medium tabular-nums">
                {measure}
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}

function IngredientThumb({ ingredient }: { ingredient: CocktailIngredient }) {
  return (
    <span className="relative grid size-10 shrink-0 place-items-center overflow-hidden rounded-full bg-blush/50">
      {ingredient.imageUrl ? (
        <Image
          src={ingredient.imageUrl}
          alt=""
          width={40}
          height={40}
          className="size-8 object-contain"
        />
      ) : (
        <SproutIcon aria-hidden className="size-4 text-blush-foreground/60" />
      )}
    </span>
  );
}

function IngredientInfo({ ingredient }: { ingredient: CocktailIngredient }) {
  const details = [
    ingredient.type,
    ingredient.percentage !== null && `${ingredient.percentage}% alk.`,
    !ingredient.alcohol && "bez alkoholu",
  ].filter(Boolean);

  if (!ingredient.description && details.length === 0) {
    return <span className="font-medium">{ingredient.name}</span>;
  }

  return (
    <Popover>
      <PopoverTrigger className="group/info inline-flex items-center gap-1.5 rounded-md text-left font-medium underline decoration-border decoration-dotted underline-offset-4 hover:decoration-primary focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none">
        {ingredient.name}
        <InfoIcon
          aria-hidden
          className="size-3.5 text-muted-foreground group-hover/info:text-primary"
        />
      </PopoverTrigger>
      <PopoverContent className="w-80" align="start">
        <p className="font-heading text-lg font-semibold">{ingredient.name}</p>
        {details.length > 0 && (
          <p className="text-xs tracking-wide text-muted-foreground uppercase">
            {details.join(" · ")}
          </p>
        )}
        {ingredient.description && (
          <p className="mt-2 line-clamp-6 text-sm text-pretty">
            {ingredient.description}
          </p>
        )}
      </PopoverContent>
    </Popover>
  );
}

export function IngredientListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <ul className="divide-y divide-border/70" aria-hidden>
      {Array.from({ length: count }, (_, index) => (
        <li key={index} className="flex items-center gap-3 py-2.5">
          <Skeleton className="size-6 rounded-full" />
          <Skeleton className="size-10 rounded-full" />
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-6 w-14 rounded-full" />
        </li>
      ))}
    </ul>
  );
}
