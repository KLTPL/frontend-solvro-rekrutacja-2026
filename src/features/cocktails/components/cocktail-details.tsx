"use client";

import { GlassWaterIcon, LeafIcon, WineIcon } from "lucide-react";
import type { ElementType } from "react";

import { Badge } from "@/components/ui/badge";
import { FavoriteButton } from "@/features/favorites/favorite-button";

import { splitInstructions } from "../instructions";
import { alcoholLabel, categoryLabel } from "../labels";
import type { CocktailDetails as CocktailDetailsData } from "../types";
import { CocktailImage } from "./cocktail-image";
import { CopyLinkButton } from "./copy-link-button";
import { IngredientList, IngredientListSkeleton } from "./ingredient-list";
import { MeasureUnitToggle } from "./measure-unit-toggle";

interface CocktailDetailsProps {
  cocktail: CocktailDetailsData;
  /** Ingredients are still loading – the rest comes from the list cache. */
  isLoadingIngredients?: boolean;
  /** Heading element – `h1` on the page, the dialog title inside the modal. */
  titleAs?: ElementType;
}

export function CocktailDetails({
  cocktail,
  isLoadingIngredients = false,
  titleAs: Title = "h1",
}: CocktailDetailsProps) {
  const steps = splitInstructions(cocktail.instructions);

  return (
    <article className="grid gap-6 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] md:gap-10">
      <div className="relative self-start md:sticky md:top-6">
        <CocktailImage
          src={cocktail.imageUrl}
          alt={cocktail.name}
          sizes="(min-width: 1024px) 460px, (min-width: 768px) 45vw, 100vw"
          priority
          className="rounded-3xl shadow-xl shadow-primary/10"
        />
      </div>

      <div className="min-w-0">
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">
            <WineIcon aria-hidden />
            {categoryLabel(cocktail.category)}
          </Badge>
          <Badge variant="outline">
            <GlassWaterIcon aria-hidden />
            {cocktail.glass}
          </Badge>
          <Badge
            variant={cocktail.alcoholic ? "outline" : "default"}
            className={
              cocktail.alcoholic
                ? undefined
                : "bg-banana text-banana-foreground"
            }
          >
            {!cocktail.alcoholic && <LeafIcon aria-hidden />}
            {alcoholLabel(cocktail.alcoholic)}
          </Badge>
        </div>

        <Title className="mt-4 font-heading text-4xl leading-none font-semibold tracking-tight text-balance sm:text-5xl">
          {cocktail.name}
        </Title>

        <div className="mt-5 flex flex-wrap gap-2">
          <FavoriteButton
            variant="labeled"
            cocktailId={cocktail.id}
            cocktailName={cocktail.name}
          />
          <CopyLinkButton path={`/cocktails/${cocktail.id}`} />
        </div>

        <section aria-labelledby="ingredients-heading" className="mt-8">
          <div className="mb-2 flex items-center justify-between gap-4">
            <h2 id="ingredients-heading" className="text-2xl font-semibold">
              Składniki
            </h2>
            <MeasureUnitToggle />
          </div>
          {isLoadingIngredients ? (
            <IngredientListSkeleton />
          ) : (
            <IngredientList ingredients={cocktail.ingredients} />
          )}
        </section>

        {steps.length > 0 && (
          <section aria-labelledby="steps-heading" className="mt-8">
            <h2 id="steps-heading" className="mb-4 text-2xl font-semibold">
              Przygotowanie
            </h2>
            <ol className="space-y-4">
              {steps.map((step, index) => (
                <li key={index} className="flex gap-4">
                  <span
                    aria-hidden
                    className="grid size-8 shrink-0 place-items-center rounded-full bg-banana font-heading font-semibold text-banana-foreground"
                  >
                    {index + 1}
                  </span>
                  <p className="pt-1 text-pretty">{step}</p>
                </li>
              ))}
            </ol>
          </section>
        )}
      </div>
    </article>
  );
}
