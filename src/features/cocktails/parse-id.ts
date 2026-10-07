/** Route params arrive as strings – anything that is not a positive integer is not a cocktail. */
export function parseCocktailId(raw: string): number | null {
  if (!/^\d+$/.test(raw)) return null;
  const id = Number(raw);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}
