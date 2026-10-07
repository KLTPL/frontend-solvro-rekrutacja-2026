"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { CircleAlertIcon, HeartIcon, RotateCcwIcon } from "lucide-react";
import Link from "next/link";

import { StateMessage } from "@/components/state-message";
import { Button } from "@/components/ui/button";
import {
  CocktailGrid,
  CocktailGridSkeleton,
} from "@/features/cocktails/components/cocktail-grid";
import { cocktailsByIdsOptions } from "@/features/cocktails/queries";
import { pluralize } from "@/lib/pluralize";

import { useFavorites } from "./use-favorites";

export function FavoritesView() {
  const { ids, isLoaded } = useFavorites();
  // Sorted, so the cache key does not depend on the order of favouriting.
  const sortedIds = [...ids].sort((a, b) => a - b);
  const { data, isPending, isError, error, refetch } = useQuery({
    ...cocktailsByIdsOptions(sortedIds),
    enabled: isLoaded,
    // Removing a favourite should not flash a skeleton while the list refetches.
    placeholderData: keepPreviousData,
  });

  if (!isLoaded || (ids.length > 0 && isPending)) {
    return <CocktailGridSkeleton count={4} />;
  }

  if (ids.length === 0) {
    return (
      <StateMessage
        icon={<HeartIcon />}
        title="Jeszcze nic tu nie ma"
        description="Kliknij serduszko przy koktajlu, a trafi tutaj. Ulubione zapisują się w tej przeglądarce."
        action={
          <Button asChild className="rounded-full px-4">
            <Link href="/#katalog">Przeglądaj katalog</Link>
          </Button>
        }
      />
    );
  }

  if (isError) {
    return (
      <StateMessage
        icon={<CircleAlertIcon />}
        title="Nie udało się pobrać ulubionych"
        description={error.message}
        action={
          <Button onClick={() => refetch()} className="rounded-full px-4">
            <RotateCcwIcon data-icon="inline-start" />
            Spróbuj ponownie
          </Button>
        }
      />
    );
  }

  // Newest favourites first; ones just removed disappear right away.
  const byId = new Map(data?.map((cocktail) => [cocktail.id, cocktail]));
  const cocktails = ids.flatMap((id) => byId.get(id) ?? []);

  return (
    <>
      <p className="mb-4 text-sm text-muted-foreground" aria-live="polite">
        {pluralize(ids.length, ["koktajl", "koktajle", "koktajli"])}
      </p>
      <CocktailGrid cocktails={cocktails} />
    </>
  );
}
