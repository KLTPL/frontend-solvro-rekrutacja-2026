"use client";

import { GlassWaterIcon, LeafIcon, WineIcon } from "lucide-react";
import {
  type ElementType,
  type RefObject,
  useEffect,
  useRef,
  useState,
} from "react";

import { Badge } from "@/components/ui/badge";
import { FavoriteButton } from "@/features/favorites/favorite-button";
import { cn } from "@/lib/utils";

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
  const titleRef = useRef<HTMLHeadingElement>(null);
  const titleHidden = useScrolledPast(titleRef);

  return (
    <article className="grid gap-6 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] md:gap-10">
      {/* In the modal the offset would push the photo below its skeleton –
          the scroll area's padding already keeps it off the edge there. */}
      <div className="relative self-start md:sticky md:top-6 md:in-data-[slot=dialog-content]:top-0">
        <CocktailImage
          src={cocktail.imageUrl}
          alt={cocktail.name}
          sizes="(min-width: 1024px) 460px, (min-width: 768px) 45vw, 100vw"
          priority
          className="rounded-3xl shadow-xl shadow-primary/10"
        />
      </div>

      <div className="min-w-0">
        <CompactBar cocktail={cocktail} visible={titleHidden} />

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

        {/* Pinned to the top of the modal on desktop, so the name and the
            actions stay at hand while the recipe scrolls under them. */}
        <div className="relative py-4 md:in-data-[slot=dialog-content]:sticky md:in-data-[slot=dialog-content]:-top-8 md:in-data-[slot=dialog-content]:z-10 md:in-data-[slot=dialog-content]:-mr-8 md:in-data-[slot=dialog-content]:pr-8">
          <PinnedSurface className="hidden md:in-data-[slot=dialog-content]:block" />
          {/* Room for the modal's close button in the corner. */}
          <Title
            ref={titleRef}
            className="font-heading text-4xl leading-none font-semibold tracking-tight text-balance sm:text-5xl md:in-data-[slot=dialog-content]:pr-10"
          >
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
        </div>

        <section aria-labelledby="ingredients-heading" className="mt-4">
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

/**
 * A slim bar with the name and the actions that slides in on phones once the
 * large title has scrolled away – a full pinned header would take too much
 * of the small screen. Only shown inside the modal.
 */
function CompactBar({
  cocktail,
  visible,
}: {
  cocktail: CocktailDetailsData;
  visible: boolean;
}) {
  return (
    // Takes no space, so the column below starts where it always did.
    <div className="sticky -top-5 z-10 hidden h-0 max-md:in-data-[slot=dialog-content]:block sm:-top-8">
      <div
        inert={!visible}
        data-visible={visible}
        className="absolute -inset-x-5 top-0 flex h-11 items-center gap-2 pr-11 pl-5 opacity-0 transition-[opacity,translate] duration-200 not-data-[visible=true]:-translate-y-2 data-[visible=true]:opacity-100 sm:-inset-x-8 sm:pl-8"
      >
        <PinnedSurface />
        {/* The dialog is already named after the cocktail. */}
        <p
          aria-hidden
          className="min-w-0 flex-1 truncate font-heading text-lg font-semibold"
        >
          {cocktail.name}
        </p>
        <FavoriteButton
          cocktailId={cocktail.id}
          cocktailName={cocktail.name}
          className="size-8 border border-border bg-background shadow-none backdrop-blur-none hover:bg-muted"
        />
        <CopyLinkButton variant="icon" path={`/cocktails/${cocktail.id}`} />
      </div>
    </div>
  );
}

/**
 * Translucent, blurred backdrop of a pinned bar that fades out at its bottom
 * edge, so the content scrolling under it softly disappears instead of being
 * cut off by a line.
 */
function PinnedSurface({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-x-0 top-0 -bottom-4 -z-10 bg-popover/80 mask-b-from-[calc(100%-1rem)] backdrop-blur-xl",
        className,
      )}
    />
  );
}

/** Whether the element has scrolled out of view past the top edge. */
function useScrolledPast(ref: RefObject<HTMLElement | null>) {
  const [scrolledPast, setScrolledPast] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      // Out of view and above the middle means it left through the top,
      // not that it has yet to scroll in from below.
      const viewportHeight = entry.rootBounds?.height ?? window.innerHeight;
      setScrolledPast(
        !entry.isIntersecting &&
          entry.boundingClientRect.top < viewportHeight / 2,
      );
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);

  return scrolledPast;
}
