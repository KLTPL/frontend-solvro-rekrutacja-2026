export interface Cocktail {
  id: number;
  name: string;
  category: string;
  glass: string;
  instructions: string;
  imageUrl: string | null;
  alcoholic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Ingredient {
  id: number;
  name: string;
  description: string | null;
  alcohol: boolean;
  type: string | null;
  percentage: number | null;
  imageUrl: string | null;
}

export interface CocktailIngredient extends Ingredient {
  /** Free-form measure as entered in the source data, e.g. "1 1/2 oz ", "dash", "4.5 cL". */
  measure: string | null;
}

export interface CocktailDetails extends Cocktail {
  ingredients: CocktailIngredient[];
}

export interface PaginationMeta {
  total: number;
  perPage: number;
  currentPage: number;
  lastPage: number;
  firstPage: number;
}

export interface Paginated<T> {
  meta: PaginationMeta;
  data: T[];
}

// The API expects an explicit direction prefix – a bare "name" is silently ignored.
export const sortOptions = ["+name", "-name", "-createdAt"] as const;
export type CocktailSort = (typeof sortOptions)[number];

export interface CocktailFilters {
  search: string;
  category: string | null;
  glass: string | null;
  /** `null` means "any". */
  alcoholic: boolean | null;
  /** Cocktails containing at least one of these ingredients. */
  ingredientIds: number[];
  sort: CocktailSort;
}
