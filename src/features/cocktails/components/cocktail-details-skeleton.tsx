import { Skeleton } from "@/components/ui/skeleton";

import { IngredientListSkeleton } from "./ingredient-list";

export function CocktailDetailsSkeleton() {
  return (
    <div
      aria-hidden
      className="grid gap-6 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] md:gap-10"
    >
      <Skeleton className="aspect-square rounded-3xl" />
      <div>
        <div className="flex gap-2">
          <Skeleton className="h-5 w-24 rounded-full" />
          <Skeleton className="h-5 w-28 rounded-full" />
        </div>
        <Skeleton className="mt-4 h-12 w-2/3" />
        <Skeleton className="mt-5 h-8 w-32 rounded-full" />
        <Skeleton className="mt-8 mb-2 h-7 w-36" />
        <IngredientListSkeleton />
      </div>
    </div>
  );
}
