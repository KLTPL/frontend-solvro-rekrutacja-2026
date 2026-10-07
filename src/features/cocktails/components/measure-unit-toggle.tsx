"use client";

import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useHydrated } from "@/hooks/use-hydrated";

import type { MeasureUnit } from "../measure";

/** Millilitres by default – that is what most people in Poland measure with. */
const measureUnitAtom = atomWithStorage<MeasureUnit>(
  "barownik-measure-unit",
  "ml",
);

/** The stored unit, or the default until hydration is over. */
export function useMeasureUnit() {
  const [unit, setUnit] = useAtom(measureUnitAtom);
  return [useHydrated() ? unit : "ml", setUnit] as const;
}

const itemClassName =
  "rounded-full! px-3 data-[state=on]:bg-blush data-[state=on]:text-blush-foreground";

export function MeasureUnitToggle() {
  const [unit, setUnit] = useMeasureUnit();

  return (
    <ToggleGroup
      type="single"
      size="sm"
      spacing={1}
      value={unit}
      onValueChange={(value) => {
        if (value) setUnit(value as MeasureUnit);
      }}
      aria-label="Jednostka miary"
      className="rounded-full border border-input p-0.5"
    >
      <ToggleGroupItem value="ml" className={itemClassName}>
        ml
      </ToggleGroupItem>
      <ToggleGroupItem value="oz" className={itemClassName}>
        oz
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
