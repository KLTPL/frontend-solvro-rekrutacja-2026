"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * `false` on the server and while a component hydrates, `true` afterwards.
 *
 * Values from browser storage must not be rendered before this flips:
 * Suspense boundaries hydrate independently, so a store filled by an early
 * boundary (e.g. the header) would otherwise mismatch the server HTML of a
 * boundary that hydrates later (e.g. the streamed catalogue).
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
