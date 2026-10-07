"use client";

import { useAtom } from "jotai";
import { useCallback } from "react";

import { useHydrated } from "@/hooks/use-hydrated";

import { favoriteIdsAtom, toggleFavoriteId } from "./favorites-store";

const EMPTY: number[] = [];

export function useFavorites() {
  const [storedIds, setStoredIds] = useAtom(favoriteIdsAtom);
  const hydrated = useHydrated();
  const ids = (hydrated && storedIds) || EMPTY;

  const toggle = useCallback(
    (id: number) =>
      setStoredIds((current) => toggleFavoriteId(current ?? [], id)),
    [setStoredIds],
  );

  return {
    ids,
    isLoaded: hydrated && storedIds !== null,
    isFavorite: (id: number) => ids.includes(id),
    toggle,
  };
}
