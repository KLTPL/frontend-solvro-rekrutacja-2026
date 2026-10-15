"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronDownIcon } from "lucide-react";
import { useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  matchesSearch,
  type FilterOptions,
} from "@/features/cocktails/filter-options";
import { filterOptionsQuery } from "@/features/cocktails/queries";
import { cn } from "@/lib/utils";

export interface FilterComboboxOption {
  value: string;
  label: string;
  /** Photo or icon shown in the round badge before the label. */
  thumbnail: ReactNode;
  cocktailCount: number;
}

interface FilterComboboxProps {
  /** Text on the trigger – the current choice, or the filter's name. */
  label: string;
  /** Accessible name of the trigger, including the current choice. */
  triggerLabel: string;
  searchLabel: string;
  emptyText: string;
  heading?: string;
  /** Picks this filter's choices out of the shared filter options. */
  getOptions: (data: FilterOptions) => FilterComboboxOption[];
  selected: readonly string[];
  onToggle: (value: string) => void;
  /** Single choice – picking an option closes the list. */
  closeOnSelect?: boolean;
  /** Height of sticky bars above the trigger – the list hides once it slides under them. */
  stickyOffset?: number;
  className?: string;
}

/** Searchable picker shared by the ingredient, category and glass filters. */
export function FilterCombobox({
  label,
  triggerLabel,
  searchLabel,
  emptyText,
  heading,
  getOptions,
  selected,
  onToggle,
  closeOnSelect = false,
  stickyOffset = 0,
  className,
}: FilterComboboxProps) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const { data, isPending } = useQuery({
    ...filterOptionsQuery,
    enabled: open,
  });
  const options = data ? getOptions(data) : [];
  const results = search
    ? options.filter((option) => matchesSearch(option.label, search))
    : options;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label={triggerLabel}
          // Warm the cache on hover so the list is ready when it opens.
          onPointerEnter={() =>
            void queryClient.prefetchQuery(filterOptionsQuery)
          }
          className={cn(
            "h-10 justify-between rounded-full bg-card px-4 font-normal shadow-xs",
            selected.length > 0 && "border-primary/50",
            className,
          )}
        >
          <span className="truncate">{label}</span>
          <ChevronDownIcon aria-hidden className="text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      {/* The page keeps scrolling under a non-modal popover – without this the
          list would stay pinned over the header after the trigger has left. */}
      <PopoverContent
        className="w-72 p-0"
        align="start"
        hideWhenDetached
        collisionPadding={{ top: stickyOffset }}
      >
        <Command shouldFilter={false}>
          <CommandInput
            value={search}
            onValueChange={setSearch}
            placeholder={`${searchLabel}…`}
            aria-label={searchLabel}
          />
          <CommandList aria-busy={isPending}>
            <CommandEmpty>{isPending ? "Ładowanie…" : emptyText}</CommandEmpty>
            {results.length > 0 && (
              <CommandGroup heading={heading}>
                {results.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    data-checked={selected.includes(option.value)}
                    onSelect={() => {
                      onToggle(option.value);
                      if (closeOnSelect) setOpen(false);
                    }}
                  >
                    <span className="grid size-6 shrink-0 place-items-center overflow-hidden rounded-full bg-blush/50 text-blush-foreground [&_svg]:size-3.5">
                      {option.thumbnail}
                    </span>
                    <span className="flex-1 truncate">{option.label}</span>
                    <span className="text-xs text-muted-foreground tabular-nums">
                      <span className="sr-only">, liczba koktajli: </span>
                      {option.cocktailCount}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
