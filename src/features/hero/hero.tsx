import { ArrowDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { RandomCocktailButton } from "@/features/cocktails/components/random-cocktail-button";
import { getFeaturedCocktails } from "@/features/cocktails/server";

import { HeroShowcase } from "./hero-showcase";

export async function Hero() {
  const featured = await getFeaturedCocktails();

  return (
    <section
      aria-labelledby="hero-heading"
      // The rotated side cards may poke out on narrow screens – never scroll sideways.
      className="mx-auto grid w-full max-w-6xl items-center gap-10 overflow-x-clip px-4 pt-10 pb-6 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:pt-16"
    >
      <div className="max-w-xl motion-safe:animate-in motion-safe:duration-700 motion-safe:fade-in motion-safe:slide-in-from-bottom-4">
        <p className="mb-5 inline-flex items-center gap-2 rounded-full bg-banana px-3 py-1 text-sm font-medium text-banana-foreground">
          Ponad 200 przepisów w jednym barku
        </p>
        <h1
          id="hero-heading"
          className="text-5xl leading-[0.95] font-semibold tracking-tight text-balance sm:text-6xl lg:text-7xl"
        >
          Co dziś <em className="text-primary">nalewamy</em>?
        </h1>
        <p className="mt-6 max-w-md text-lg text-pretty text-muted-foreground">
          Szukaj po nazwie, filtruj po tym, co masz w&nbsp;barku, sprawdzaj
          proporcje w&nbsp;mililitrach i&nbsp;zapisuj ulubione na później.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild size="lg" className="h-11 rounded-full px-5">
            <a href="#katalog">
              <ArrowDownIcon data-icon="inline-start" aria-hidden />
              Przeglądaj katalog
            </a>
          </Button>
          <RandomCocktailButton className="h-11 px-5" />
        </div>
      </div>

      <HeroShowcase cocktails={featured} />
    </section>
  );
}
