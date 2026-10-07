import { LeafIcon } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { FavoriteButton } from "@/features/favorites/favorite-button";

import { categoryLabel } from "../labels";
import type { Cocktail } from "../types";
import { CocktailImage } from "./cocktail-image";

interface CocktailCardProps {
  cocktail: Cocktail;
  /** Preload the image – used for cards visible above the fold. */
  priority?: boolean;
}

export function CocktailCard({ cocktail, priority }: CocktailCardProps) {
  return (
    <article className="group relative h-full rounded-3xl border border-border/70 bg-card p-2 shadow-xs transition-[translate,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10 has-focus-visible:ring-3 has-focus-visible:ring-ring/50">
      <div className="relative overflow-hidden rounded-2xl">
        <CocktailImage
          src={cocktail.imageUrl}
          alt=""
          priority={priority}
          sizes="(min-width: 1024px) 270px, (min-width: 640px) 33vw, 50vw"
          className="transition-transform duration-500 ease-out group-hover:scale-105"
        />
        <FavoriteButton
          cocktailId={cocktail.id}
          cocktailName={cocktail.name}
          // Above the card-wide link overlay.
          className="absolute top-2 right-2 z-10"
        />
        {!cocktail.alcoholic && (
          <Badge className="absolute bottom-2 left-2 bg-banana text-banana-foreground shadow-sm">
            <LeafIcon aria-hidden />
            Bez alkoholu
          </Badge>
        )}
      </div>

      <div className="px-2 pt-3 pb-2">
        <h3 className="text-lg leading-tight font-semibold text-balance">
          <Link
            href={`/cocktails/${cocktail.id}`}
            className="outline-none after:absolute after:inset-0 after:rounded-3xl"
          >
            {cocktail.name}
          </Link>
        </h3>
        <p className="mt-1 truncate text-sm text-muted-foreground">
          {categoryLabel(cocktail.category)} · {cocktail.glass}
        </p>
      </div>
    </article>
  );
}
