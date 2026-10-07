# Barownik — cocktail browser

An app for browsing, searching and saving cocktails from the [Solvro Cocktails API](https://cocktails.solvro.pl). Built as a recruitment task for the Solvro science club. The interface is in Polish.

## Features

- **Catalogue** of all cocktails with infinite scrolling (plus a "Pokaż więcej" / "Show more" button as a keyboard-friendly fallback).
- **Search** by name (debounced, `/` shortcut) and **filters**: alcoholic / non-alcoholic, category, glass type and ingredients, plus sorting (A–Z, Z–A, newest). Filters live in the URL, so a filtered view can be shared and the back button works.
- **Ingredient filter** suggests only ingredients that actually appear in at least one cocktail (about 160 of the ~550 in the API), ranked by popularity with a cocktail count next to each.
- **Cocktail details**: clicking a card opens them in a modal over the list. The photo and name show up instantly from the list cache and the ingredients load a moment later. Opening the link directly or refreshing shows a full, prerendered page.
  - **ml ↔ oz** toggle (the API uses ounces; the converter handles fractions, ranges and cL),
  - ingredient info in a popover (type, ABV, description),
  - a "have it at home" checklist,
  - step-by-step instructions and a copy-link button.
- **Favourites** stored in `localStorage` (synced across tabs), with a counter in the navigation and a dedicated `/favorites` page.
- **Random cocktail** ("Losuj koktajl"): picks a recipe and opens it in the modal with all details already loaded.
- **Light and dark mode** (no flash on load), responsive layout, filters in a bottom sheet on phones and respect for `prefers-reduced-motion`.

## Stack

|              |                                                                 |
| ------------ | --------------------------------------------------------------- |
| Framework    | Next.js 16 (App Router, Cache Components, Partial Prerendering) |
| Language     | TypeScript                                                      |
| Server state | TanStack Query                                                  |
| Client state | Jotai (favourites, measure unit), nuqs (filters in the URL)     |
| UI           | shadcn/ui (Radix), Tailwind CSS v4, lucide-react                |
| Animation    | motion                                                          |
| Testing      | Vitest + Testing Library                                        |

## Design decisions

- **One main page plus real routes.** Instead of a landing page with subpages, the hero is followed directly by the catalogue. Details have their own URL (`/cocktails/[id]`) and are shown in a modal via _intercepting routes_, so browsing never loses the scroll position or the filters.
- **Rendering.** All 220 cocktail pages are prerendered at build time. On the home page the static shell (hero, header) is sent immediately, while the list, filtered by the URL, is rendered on the server and streamed in. The data is passed into the TanStack Query cache (`HydrationBoundary`), so the client does not fetch it again.
- **Caching.** Server-side API calls are wrapped in `"use cache"` with `cacheLife`. The list of used ingredients is computed on the server from ~1 MB of data and served as a static `/api/ingredients` endpoint.
- **Hydration and `localStorage`.** Values from the browser (favourites, measure unit) are rendered only after hydration (`useHydrated`). Suspense boundaries hydrate independently, so a header hydrated earlier could otherwise fill the store before the list hydrates and cause a mismatch with the server HTML.
- **Colours.** A cream background, powder pink surfaces, raspberry for actions, banana yellow for accents and plum instead of black for text. Pastels are used only as backgrounds, so text on them always has sufficient contrast.
- **Animation.** One main animation in the hero (a carousel of arch-framed photos with ingredient cut-outs from the API floating around them). Everything else is micro-interactions: the heart button, the favourites counter, cards moving into place when filters change and the rolling hero caption.

## Notes on the API

- `name` behaves like SQL `ILIKE`, so substring search needs `%term%`.
- `sort` requires a direction prefix (`+name`); a bare `name` is silently ignored.
- `ingredientId[]` combines ingredients with **OR**, which is why the UI labels the filter "contains any of".
- There is no endpoint for a random cocktail, so it is picked via `perPage=1&page=<random>`.
- `/cocktails/{id}` with a non-numeric id returns a 500, so ids are validated in the app.
- Cocktail photos have a `.png` extension but are actually JPEGs; only ingredient images are transparent PNGs.

## Getting started

Requires Node.js 20.9+ and pnpm.

```bash
pnpm install
pnpm dev
```

The app runs at <http://localhost:3000>.

### Scripts

| Command                     | Description                         |
| --------------------------- | ----------------------------------- |
| `pnpm dev`                  | development server                  |
| `pnpm build` / `pnpm start` | production build and server         |
| `pnpm lint`                 | ESLint (with TanStack Query rules)  |
| `pnpm typecheck`            | route type generation + `tsc`       |
| `pnpm test`                 | unit tests (Vitest)                 |
| `pnpm format`               | Prettier (with Tailwind class sort) |

## Project structure

```
src/
  app/                 routes (home, /cocktails/[id], @modal, /favorites, /api/ingredients)
  components/          layout and shared components, ui/ = shadcn
  features/
    cocktails/         API, queries, types, logic (measures, steps) and cocktail components
    filters/           URL parsers (nuqs) and filter controls
    favorites/         favourites store and views
    hero/              hero section and its animations
    theme/             theme toggle
  hooks/, lib/         small utilities (API client, QueryClient, Polish plural forms)
```
