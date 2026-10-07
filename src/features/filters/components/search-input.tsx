"use client";

import { SearchIcon, XIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Kbd } from "@/components/ui/kbd";

import { useCocktailFilters } from "../use-cocktail-filters";

const SEARCH_DEBOUNCE_MS = 300;

export function SearchInput() {
  const { params, setParams } = useCocktailFilters();
  const inputRef = useRef<HTMLInputElement>(null);

  // Typing is instant locally; the URL (and the query) follow after a pause.
  const [value, setValue] = useState(params.q);
  const [syncedQuery, setSyncedQuery] = useState(params.q);
  const pendingCommit = useRef<ReturnType<typeof setTimeout>>(undefined);

  // The URL changed from the outside (e.g. "clear filters") – adopt it.
  if (params.q !== syncedQuery) {
    setSyncedQuery(params.q);
    setValue(params.q);
  }

  function commit(query: string) {
    clearTimeout(pendingCommit.current);
    setSyncedQuery(query);
    void setParams({ q: query });
  }

  function change(query: string, { immediate = false } = {}) {
    setValue(query);
    clearTimeout(pendingCommit.current);
    if (immediate) commit(query);
    else
      pendingCommit.current = setTimeout(
        () => commit(query),
        SEARCH_DEBOUNCE_MS,
      );
  }

  useEffect(() => () => clearTimeout(pendingCommit.current), []);

  // "/" focuses the search from anywhere, like on GitHub or YouTube.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement;
      const isTyping =
        target.isContentEditable ||
        ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);
      if (event.key === "/" && !isTyping) {
        event.preventDefault();
        inputRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <InputGroup className="h-11 rounded-full bg-card px-1 shadow-xs">
      <InputGroupAddon className="pl-2.5">
        <SearchIcon aria-hidden />
      </InputGroupAddon>
      <InputGroupInput
        ref={inputRef}
        type="search"
        value={value}
        onChange={(event) => change(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Escape") change("", { immediate: true });
        }}
        placeholder="Szukaj koktajlu, np. Mojito"
        aria-label="Szukaj koktajlu po nazwie"
        className="text-base [&::-webkit-search-cancel-button]:hidden"
      />
      <InputGroupAddon align="inline-end" className="pr-1.5">
        {value ? (
          <InputGroupButton
            size="icon-xs"
            className="rounded-full"
            aria-label="Wyczyść wyszukiwanie"
            onClick={() => {
              change("", { immediate: true });
              inputRef.current?.focus();
            }}
          >
            <XIcon />
          </InputGroupButton>
        ) : (
          <Kbd className="hidden sm:inline-flex" aria-hidden>
            /
          </Kbd>
        )}
      </InputGroupAddon>
    </InputGroup>
  );
}
