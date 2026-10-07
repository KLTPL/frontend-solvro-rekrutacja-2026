"use client";

import { useAtom } from "jotai";
import { useCallback } from "react";

import { favoriteIdsAtom, toggleFavoriteId } from "./favorites-store";

const EMPTY: number[] = [];

export function useFavorites() {
  const [storedIds, setStoredIds] = useAtom(favoriteIdsAtom);
  const ids = storedIds ?? EMPTY;

  const toggle = useCallback(
    (id: number) =>
      setStoredIds((current) => toggleFavoriteId(current ?? [], id)),
    [setStoredIds],
  );

  return {
    ids,
    isLoaded: storedIds !== null,
    isFavorite: (id: number) => ids.includes(id),
    toggle,
  };
}
