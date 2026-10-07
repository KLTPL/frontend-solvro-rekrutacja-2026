import { MartiniIcon } from "lucide-react";
import Link from "next/link";

import { RandomCocktailButton } from "@/features/cocktails/components/random-cocktail-button";
import { ThemeToggle } from "@/features/theme/theme-toggle";

import { NavLinks } from "./nav-links";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/75 backdrop-blur-lg supports-backdrop-filter:bg-background/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-2 px-4 sm:gap-3 sm:px-6">
        <Link
          href="/"
          className="group flex items-center gap-2 rounded-full pr-2 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          <span className="grid size-9 place-items-center rounded-full bg-primary text-primary-foreground transition-transform duration-300 group-hover:-rotate-12">
            <MartiniIcon className="size-5" aria-hidden />
          </span>
          <span className="font-heading text-xl font-semibold tracking-tight sm:text-2xl">
            Barownik
          </span>
        </Link>

        <nav
          aria-label="Główna nawigacja"
          className="ml-auto flex items-center gap-1"
        >
          <NavLinks />
          <RandomCocktailButton compact size="default" className="h-9 px-3" />
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
