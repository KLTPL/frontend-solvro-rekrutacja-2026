import type { Metadata } from "next";

import { FavoritesView } from "@/features/favorites/favorites-view";

export const metadata: Metadata = {
  title: "Ulubione",
  description: "Twoje ulubione koktajle zapisane w tej przeglądarce.",
};

export default function FavoritesPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="mb-2 text-4xl font-semibold tracking-tight sm:text-5xl">
        Ulubione
      </h1>
      <p className="mb-8 max-w-prose text-muted-foreground">
        Koktajle, do których chcesz wrócić.
      </p>
      <FavoritesView />
    </main>
  );
}
