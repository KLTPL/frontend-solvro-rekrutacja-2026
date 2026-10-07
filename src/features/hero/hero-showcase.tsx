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

/**
 * The hero's main animation: three arch-framed cocktails that rise in on
 * load and then slowly rotate like a carousel, with garnishes floating
 * around them. Pauses on hover, off-screen and with reduced motion.
 */
export function HeroShowcase({ cocktails }: { cocktails: Cocktail[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef);
  const reduceMotion = useReducedMotion();
  const [offset, setOffset] = useState(0);
  const [hovered, setHovered] = useState(false);

  const isRotating = inView && !hovered && !reduceMotion;
  useEffect(() => {
    if (!isRotating) return;
    const interval = setInterval(
      () => setOffset((current) => current + 1),
      CYCLE_MS,
    );
    return () => clearInterval(interval);
  }, [isRotating]);

  if (cocktails.length < slots.length) return null;

  const featured = cocktails[(offset + 1) % cocktails.length];

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
          const count = cocktails.length;
          const position = (((index - offset) % count) + count) % count;
          const slot = slots[position] ?? hiddenSlot;
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
                delay: offset === 0 ? 0.15 + position * 0.12 : 0,
              }}
              style={{ zIndex: slot.zIndex }}
              className="absolute inset-x-[22%] top-0 bottom-[6%]"
              aria-hidden={position !== 1}
            >
              <div className="relative h-full overflow-hidden rounded-t-full rounded-b-3xl border-[6px] border-card bg-card shadow-2xl shadow-primary/20">
                {cocktail.imageUrl && (
                  <Image
                    src={cocktail.imageUrl}
                    alt={position === 1 ? cocktail.name : ""}
                    fill
                    sizes="(min-width: 1024px) 240px, 50vw"
                    preload={position === 1}
                    className="rounded-t-full rounded-b-[1.1rem] object-cover"
                  />
                )}
              </div>
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
