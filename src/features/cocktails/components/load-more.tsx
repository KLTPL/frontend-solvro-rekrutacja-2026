"use client";

import { useEffect, useEffectEvent, useRef } from "react";

import { Button } from "@/components/ui/button";

interface LoadMoreProps {
  onLoadMore: () => void;
  isLoading: boolean;
}

/**
 * Loads the next page as soon as the sentinel approaches the viewport.
 * The button stays as an explicit fallback for keyboard users.
 */
export function LoadMore({ onLoadMore, isLoading }: LoadMoreProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const loadMore = useEffectEvent(onLoadMore);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || isLoading) return;

    // Re-created after every load, so a sentinel that is still in view
    // (e.g. on a very tall screen) immediately triggers the next page.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) loadMore();
      },
      { rootMargin: "600px 0px" },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [isLoading]);

  return (
    <div ref={sentinelRef} className="flex justify-center pt-8">
      <Button
        variant="outline"
        size="lg"
        className="rounded-full px-5"
        onClick={onLoadMore}
        disabled={isLoading}
      >
        {isLoading ? "Ładowanie…" : "Pokaż więcej"}
      </Button>
    </div>
  );
}
