import { atomWithStorage, createJSONStorage } from "jotai/utils";

/**
 * `null` until the browser storage has been read (the server and the first
 * client render cannot know the favourites), then the stored ids – newest
 * first. Telling "not loaded yet" apart from "empty" avoids flashing the
 * empty state on the favourites page.
 */
type FavoriteIds = number[] | null;

const jsonStorage = createJSONStorage<FavoriteIds>(() => localStorage);

export function sanitizeFavoriteIds(value: unknown): number[] {
  return Array.isArray(value)
    ? value.filter((id): id is number => Number.isSafeInteger(id) && id > 0)
    : [];
}

export const favoriteIdsAtom = atomWithStorage<FavoriteIds>(
  "barownik-favorites",
  null,
  {
    ...jsonStorage,
    // Missing or malformed data becomes an empty list, never `null`.
    getItem: (key, initialValue) =>
      sanitizeFavoriteIds(jsonStorage.getItem(key, initialValue)),
  },
);

export function toggleFavoriteId(ids: number[], id: number): number[] {
  return ids.includes(id)
    ? ids.filter((current) => current !== id)
    : [id, ...ids];
}
