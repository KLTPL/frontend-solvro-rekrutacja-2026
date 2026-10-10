"use client";

import { ArrowRightIcon } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { categoryLabel } from "@/features/cocktails/labels";
import type { Cocktail } from "@/features/cocktails/types";

import { FloatingGarnishes } from "./floating-garnishes";

const CYCLE_MS = 4500;

// Where a card sits depending on its place in the rotation.
const slots = [
  { x: "-56%", rotate: -9, scale: 0.8, opacity: 1, zIndex: 1 },
  { x: "0%", rotate: 0, scale: 1, opacity: 1, zIndex: 3 },
  { x: "56%", rotate: 9, scale: 0.8, opacity: 1, zIndex: 2 },
];
const hiddenSlot = { x: "0%", rotate: 0, scale: 0.6, opacity: 0, zIndex: 0 };

// Shared by the centre link and the side buttons, so they look the same.
const cardClassName =
  "relative block h-full w-full cursor-pointer overflow-hidden rounded-t-full rounded-b-3xl border-[6px] border-card bg-card shadow-2xl shadow-primary/20 focus-visible:ring-4 focus-visible:ring-ring/60 focus-visible:outline-none";

/**
 * The hero's main animation: three arch-framed cocktails that rise in on
 * load and then slowly rotate like a carousel, with garnishes floating
 * around them. Pauses on hover, off-screen and with reduced motion.
 * The centre card opens its cocktail, a side card is brought to the front.
 */
export function HeroShowcase({ cocktails }: { cocktails: Cocktail[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef);
  const reduceMotion = useReducedMotion();
  const [offset, setOffset] = useState(0);
  // Set once the carousel first moves, so returning to offset 0 later does
  // not replay the entrance.
  const [hasMoved, setHasMoved] = useState(false);
  // Bumped by a manual pick to restart the timer for a full cycle.
  const [manualPicks, setManualPicks] = useState(0);
  const [hovered, setHovered] = useState(false);
  const featuredLinkRef = useRef<HTMLAnchorElement>(null);
  const focusFeaturedRef = useRef(false);

  const isRotating = inView && !hovered && !reduceMotion;
  useEffect(() => {
    if (!isRotating) return;
    const interval = setInterval(() => {
      setOffset((current) => current + 1);
      setHasMoved(true);
    }, CYCLE_MS);
    return () => clearInterval(interval);
  }, [isRotating, manualPicks]);

  // A picked side card turns into the centre link – keep focus on it.
  useEffect(() => {
    if (!focusFeaturedRef.current) return;
    focusFeaturedRef.current = false;
    featuredLinkRef.current?.focus({ preventScroll: true });
  }, [offset]);

  if (cocktails.length < slots.length) return null;

  const count = cocktails.length;
  const featured = cocktails[(((offset + 1) % count) + count) % count];

  function bringToFront(by: number) {
    setOffset((current) => current + by);
    setHasMoved(true);
    setManualPicks((current) => current + 1);
    focusFeaturedRef.current = true;
  }

  return (
    <div
      ref={containerRef}
      className="relative mx-auto w-full max-w-md"
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      {/* Soft colour wash behind the glasses. */}
      <div
        aria-hidden
        className="absolute inset-[8%] -z-10 rounded-full bg-[conic-gradient(from_90deg,var(--blush),var(--banana),var(--blush))] opacity-70 blur-3xl motion-safe:animate-[spin_24s_linear_infinite] dark:opacity-40"
      />

      <div className="relative aspect-[5/4]">
        {cocktails.map((cocktail, index) => {
          const position = (((index - offset) % count) + count) % count;
          const slot = slots[position] ?? hiddenSlot;
          const image = cocktail.imageUrl && (
            <Image
              src={cocktail.imageUrl}
              alt=""
              fill
              sizes="(min-width: 1024px) 240px, 50vw"
              preload={position === 1}
              className="rounded-t-full rounded-b-[1.1rem] object-cover"
            />
          );
          return (
            <motion.div
              key={cocktail.id}
              initial={{ ...slot, y: 120, opacity: 0 }}
              animate={{ ...slot, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 90,
                damping: 18,
                // Cards rise in one after another on the first render only.
                delay: hasMoved ? 0 : 0.15 + position * 0.12,
              }}
              style={{ zIndex: slot.zIndex }}
              className="absolute inset-x-[22%] top-0 bottom-[6%]"
              // Cards waiting off-stage can be neither seen nor reached.
              inert={position >= slots.length}
            >
              {position === 1 ? (
                <Link
                  ref={featuredLinkRef}
                  href={`/cocktails/${cocktail.id}`}
                  scroll={false}
                  aria-label={cocktail.name}
                  className={cardClassName}
                >
                  {image}
                </Link>
              ) : (
                <button
                  type="button"
                  // The left card rotates right into the centre, the right
                  // one (and the hidden ones, never clickable) to the left.
                  onClick={() => bringToFront(position === 0 ? -1 : 1)}
                  aria-label={`Pokaż: ${cocktail.name}`}
                  className={cardClassName}
                >
                  {image}
                </button>
              )}
            </motion.div>
          );
        })}
        <FloatingGarnishes />
      </div>

      <div className="relative z-10 mt-2 flex justify-center">
        <Link
          href={`/cocktails/${featured.id}`}
          scroll={false}
          className="group flex items-center gap-3 rounded-full border border-border bg-card/90 py-2 pr-3 pl-5 shadow-lg backdrop-blur transition-colors hover:border-primary/40 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          {/* Fixed width, so the pill does not jump as names change. */}
          <span className="relative h-11 w-44 overflow-hidden text-left sm:w-52">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={featured.id}
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "-100%", opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="flex flex-col"
              >
                <span className="truncate font-heading text-lg leading-tight font-semibold">
                  {featured.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {categoryLabel(featured.category)}
                </span>
              </motion.span>
            </AnimatePresence>
          </span>
          <span className="grid size-8 place-items-center rounded-full bg-primary text-primary-foreground transition-transform group-hover:translate-x-0.5">
            <ArrowRightIcon aria-hidden className="size-4" />
            <span className="sr-only">Zobacz przepis</span>
          </span>
        </Link>
      </div>
    </div>
  );
}
