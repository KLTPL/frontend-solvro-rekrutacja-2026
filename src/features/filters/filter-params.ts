import {
  createLoader,
  parseAsArrayOf,
  parseAsBoolean,
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
  type inferParserType,
} from "nuqs/server";

import { sortOptions, type CocktailFilters } from "@/features/cocktails/types";

/** URL search params backing the catalogue filters – shared by server and client. */
export const filterParsers = {
  q: parseAsString.withDefault(""),
  category: parseAsString,
  glass: parseAsString,
  alcoholic: parseAsBoolean,
  ingredients: parseAsArrayOf(parseAsInteger).withDefault([]),
  sort: parseAsStringLiteral(sortOptions).withDefault("+name"),
};

export type FilterParams = inferParserType<typeof filterParsers>;

export const loadFilterParams = createLoader(filterParsers);

export function toCocktailFilters(params: FilterParams): CocktailFilters {
  return {
    search: params.q,
    category: params.category,
    glass: params.glass,
    alcoholic: params.alcoholic,
    ingredientIds: params.ingredients,
    sort: params.sort,
  };
}
