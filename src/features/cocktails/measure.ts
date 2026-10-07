export type MeasureUnit = "oz" | "ml";

const ML_PER_OZ = 30;
const ML_PER_CL = 10;

// "1", "1.5", "1/2" or a mixed number such as "1 1/2".
const QUANTITY = String.raw`\d+\s+\d+\/\d+|\d+\/\d+|\d+(?:[.,]\d+)?`;
const MEASURE_PATTERN = new RegExp(
  String.raw`^(${QUANTITY})(?:\s*-\s*(${QUANTITY}))?\s*(oz|cl)\b(.*)$`,
  "i",
);

function parseQuantity(raw: string): number {
  return raw
    .trim()
    .split(/\s+/)
    .reduce((sum, part) => {
      if (!part.includes("/")) return sum + Number(part.replace(",", "."));
      const [numerator, denominator] = part.split("/").map(Number);
      return sum + numerator / denominator;
    }, 0);
}

function roundMl(ml: number): number {
  // Bartender-friendly numbers: 5 ml steps for anything above a splash.
  return ml >= 10 ? Math.round(ml / 5) * 5 : Math.round(ml);
}

/**
 * Normalises a free-form measure from the API and optionally converts
 * ounces / centilitres to millilitres. Anything that is not a plain
 * volume ("dash", "Juice of 1/2", "2 or 3") is returned unchanged.
 */
export function formatMeasure(
  measure: string | null,
  unit: MeasureUnit,
): string | null {
  const trimmed = measure?.trim();
  if (!trimmed) return null;
  if (unit === "oz") return trimmed;

  const match = MEASURE_PATTERN.exec(trimmed);
  if (!match) return trimmed;

  const [, from, to, sourceUnit, rest] = match;
  const factor = sourceUnit.toLowerCase() === "oz" ? ML_PER_OZ : ML_PER_CL;
  const amount = [from, to]
    .filter((value): value is string => Boolean(value))
    .map((value) => roundMl(parseQuantity(value) * factor))
    .join("–");

  return `${amount} ml${rest.trimEnd()}`;
}
