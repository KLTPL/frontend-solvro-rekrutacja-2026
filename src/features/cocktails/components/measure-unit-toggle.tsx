"use client";

import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

import type { MeasureUnit } from "../measure";

/** Millilitres by default – that is what most people in Poland measure with. */
export const measureUnitAtom = atomWithStorage<MeasureUnit>(
  "barek-measure-unit",
  "ml",
);

export function MeasureUnitToggle() {
  const [unit, setUnit] = useAtom(measureUnitAtom);

  return (
    <ToggleGroup
      type="single"
      size="sm"
      variant="outline"
      value={unit}
      onValueChange={(value) => {
        if (value) setUnit(value as MeasureUnit);
      }}
      aria-label="Jednostka miary"
    >
      <ToggleGroupItem value="ml" className="px-3">
        ml
      </ToggleGroupItem>
      <ToggleGroupItem value="oz" className="px-3">
        oz
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
