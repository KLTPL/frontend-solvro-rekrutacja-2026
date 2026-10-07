# Barownik — przeglądarka koktajli

Aplikacja do przeglądania, wyszukiwania i zapisywania koktajli z [Solvro Cocktails API](https://cocktails.solvro.pl). Zadanie rekrutacyjne do KN Solvro.

## Funkcje

- **Katalog** wszystkich koktajli z nieskończonym przewijaniem (z przyciskiem „Pokaż więcej” jako alternatywą dla klawiatury).
- **Wyszukiwanie** po nazwie (debounce, skrót `/`) i **filtry**: z alkoholem / bez, kategoria, rodzaj szkła, składniki. Do tego sortowanie (A–Z, Z–A, najnowsze). Stan filtrów żyje w URL-u, więc link z filtrami da się wysłać, a przycisk „wstecz” działa.
- **Filtr składników** podpowiada tylko te składniki, które faktycznie występują w jakimś koktajlu (ok. 160 z ~550 w API), posortowane według popularności i z liczbą koktajli.
- **Szczegóły koktajlu**: kliknięcie w kartę otwiera je w modalu nad listą (zdjęcie i nazwa pojawiają się od razu z cache listy, składniki dociągają się chwilę później). Wejście z linku lub odświeżenie strony pokazuje pełną, prerenderowaną stronę.
  - przełącznik **ml ↔ oz** (API podaje uncje; konwersja obsługuje ułamki, zakresy i cL),
  - opis składnika w popoverze (typ, % alkoholu, opis),
  - lista „mam w barku” do odhaczania,
  - instrukcja podzielona na kroki, kopiowanie linku.
- **Ulubione** zapisane w `localStorage` (synchronizowane między kartami), licznik w nawigacji i osobna strona `/favorites`.
- **Losuj koktajl**: losuje przepis i otwiera go w modalu z kompletem danych.
- **Tryb jasny i ciemny** (bez mignięcia przy ładowaniu), responsywny układ, panel filtrów na telefonie, respektowanie `prefers-reduced-motion`.

## Stack

|              |                                                                 |
| ------------ | --------------------------------------------------------------- |
| Framework    | Next.js 16 (App Router, Cache Components, Partial Prerendering) |
| Język        | TypeScript                                                      |
| Stan serwera | TanStack Query                                                  |
| Stan klienta | Jotai (ulubione, jednostka miary), nuqs (filtry w URL)          |
| UI           | shadcn/ui (Radix), Tailwind CSS v4, lucide-react                |
| Animacje     | motion                                                          |
| Testy        | Vitest + Testing Library                                        |

## Decyzje projektowe

- **Jedna strona główna + prawdziwe trasy.** Zamiast landing page z podstronami: hero, a pod nim od razu katalog. Szczegóły mają własny URL (`/cocktails/[id]`) i są wyświetlane jako modal dzięki _intercepting routes_, więc przeglądanie listy nie gubi przewinięcia ani filtrów.
- **Renderowanie.** Wszystkie 220 stron koktajli jest prerenderowanych przy buildzie. Na stronie głównej statyczna powłoka (hero, nagłówek) idzie od razu, a lista z filtrami z URL-a jest renderowana na serwerze i strumieniowana. Dane trafiają do cache TanStack Query (`HydrationBoundary`), więc klient nie pobiera ich drugi raz.
- **Cache.** Zapytania do API po stronie serwera są opakowane w `"use cache"` z `cacheLife`. Listę używanych składników liczy serwer z ~1 MB danych i udostępnia jako statyczny endpoint `/api/ingredients`.
- **Hydracja i `localStorage`.** Wartości z przeglądarki (ulubione, jednostka) są renderowane dopiero po hydracji (`useHydrated`). Granice Suspense hydratują się niezależnie, więc wcześniej zhydratowany nagłówek mógłby wypełnić store, zanim zrobi to lista, i spowodować niezgodność z HTML-em z serwera.
- **Kolory.** Kremowe tło, pudrowy róż jako powierzchnie, malinowy kolor akcji, bananowy żółty do akcentów i śliwkowy zamiast czarnego tekstu. Pastele służą wyłącznie jako tła, tekst na nich zawsze ma odpowiedni kontrast.
- **Animacje.** Jedna główna w hero (karuzela łuków ze zdjęciami i unoszące się składniki z API). Reszta to mikrointerakcje: serduszko, licznik ulubionych, przesuwanie kart przy zmianie filtrów i podpis w hero.

## Co zauważyłem w API

- `name` działa jak SQL `ILIKE`, więc wyszukiwanie po fragmencie wymaga `%fraza%`.
- `sort` wymaga prefiksu kierunku (`+name`). Samo `name` jest po cichu ignorowane.
- `ingredientId[]` łączy składniki przez **OR**, dlatego UI opisuje to jako „zawiera którykolwiek z”.
- Brak endpointu do losowania, więc losowanie odbywa się przez `perPage=1&page=<losowa>`.
- `/cocktails/{id}` z nienumerycznym id zwraca 500, dlatego id jest walidowane po stronie aplikacji.
- Zdjęcia koktajli mają rozszerzenie `.png`, ale są JPEG-ami. Przezroczyste PNG mają tylko składniki.

## Uruchomienie

Wymagany Node.js 20.9+ i pnpm.

```bash
pnpm install
pnpm dev
```

Aplikacja działa pod adresem <http://localhost:3000>.

### Skrypty

| Komenda                     | Opis                                   |
| --------------------------- | -------------------------------------- |
| `pnpm dev`                  | serwer deweloperski                    |
| `pnpm build` / `pnpm start` | build i serwer produkcyjny             |
| `pnpm lint`                 | ESLint (z regułami TanStack Query)     |
| `pnpm typecheck`            | generowanie typów tras + `tsc`         |
| `pnpm test`                 | testy jednostkowe (Vitest)             |
| `pnpm format`               | Prettier (z sortowaniem klas Tailwind) |

## Struktura

```
src/
  app/                 trasy (strona główna, /cocktails/[id], @modal, /favorites, /api/ingredients)
  components/          layout i komponenty współdzielone, ui/ = shadcn
  features/
    cocktails/         API, zapytania, typy, logika (miary, kroki) i komponenty koktajli
    filters/           parsery URL (nuqs) i kontrolki filtrów
    favorites/         store ulubionych i widoki
    hero/              sekcja hero i jej animacje
    theme/             przełącznik motywu
  hooks/, lib/         drobne narzędzia (klient API, QueryClient, odmiana liczebników)
```
