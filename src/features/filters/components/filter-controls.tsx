"use client";

import { ArrowUpDownIcon } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { CocktailSort } from "@/features/cocktails/types";
import { cn } from "@/lib/utils";

import { useCocktailFilters } from "../use-cocktail-filters";

const triggerClassName = "h-10! rounded-full bg-card px-4 shadow-xs";

const alcoholOptions = [
  { value: "any", label: "Wszystkie" },
  { value: "yes", label: "Z alkoholem" },
  { value: "no", label: "Bez alkoholu" },
] as const;

export function AlcoholToggle({ className }: { className?: string }) {
  const { params, setParams } = useCocktailFilters();
  const value =
    params.alcoholic === null ? "any" : params.alcoholic ? "yes" : "no";

  return (
    <ToggleGroup
      type="single"
      spacing={1}
      value={value}
      onValueChange={(next) => {
        if (!next) return;
        void setParams({
          alcoholic: next === "any" ? null : next === "yes",
        });
      }}
      aria-label="Zawartość alkoholu"
      className={cn(
        "h-10 rounded-full border border-input bg-card p-1 shadow-xs",
        className,
      )}
    >
      {alcoholOptions.map((option) => (
        <ToggleGroupItem
          key={option.value}
          value={option.value}
          className="h-full flex-1 rounded-full! px-4 data-[state=on]:bg-blush data-[state=on]:text-blush-foreground"
        >
          {option.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}

const sortLabels: Record<CocktailSort, string> = {
  "+name": "Nazwa A–Z",
  "-name": "Nazwa Z–A",
  "-createdAt": "Najnowsze",
};

export function SortSelect({ className }: { className?: string }) {
  const { params, setParams } = useCocktailFilters();

  return (
    <Select
      value={params.sort}
      onValueChange={(sort) => setParams({ sort: sort as CocktailSort })}
    >
      <SelectTrigger
        aria-label="Sortowanie"
        className={cn(
          triggerClassName,
          "*:data-[slot=select-value]:flex-1",
          className,
        )}
      >
        <ArrowUpDownIcon aria-hidden className="text-muted-foreground" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent position="popper" align="end">
        {Object.entries(sortLabels).map(([value, label]) => (
          <SelectItem key={value} value={value}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
