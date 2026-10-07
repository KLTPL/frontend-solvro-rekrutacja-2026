const pluralRules = new Intl.PluralRules("pl-PL");

/**
 * Polish plural forms, e.g. `pluralize(5, ["koktajl", "koktajle", "koktajli"])`
 * → "5 koktajli".
 */
export function pluralize(
  count: number,
  [one, few, many]: [one: string, few: string, many: string],
): string {
  const rule = pluralRules.select(count);
  const word = rule === "one" ? one : rule === "few" ? few : many;
  return `${count} ${word}`;
}
