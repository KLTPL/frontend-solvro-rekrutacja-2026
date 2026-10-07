"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import Image from "next/image";
import { useEffect } from "react";

const IMAGE_BASE = "https://cocktails.solvro.pl/images/ingredients";

// Cut-out ingredient photos from the API, placed around the glasses.
// `depth` controls how strongly each one follows the pointer.
const garnishes = [
  {
    name: "strawberries",
    className: "top-[4%] left-[2%] w-[22%]",
    depth: 18,
    rotate: -12,
  },
  {
    name: "banana",
    className: "top-[44%] -right-[6%] w-[26%]",
    depth: 26,
    rotate: 14,
  },
  {
    name: "mint",
    className: "bottom-[2%] left-[6%] w-[18%]",
    depth: 12,
    rotate: 8,
  },
  {
    name: "cherry",
    className: "top-[0%] right-[10%] w-[14%]",
    depth: 8,
    rotate: 6,
  },
] as const;

export function FloatingGarnishes() {
  const reduceMotion = useReducedMotion();
  // Pointer position relative to the viewport centre, in the range -0.5..0.5.
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { stiffness: 60, damping: 20 });
  const smoothY = useSpring(pointerY, { stiffness: 60, damping: 20 });

  useEffect(() => {
    if (reduceMotion) return;
    function onPointerMove(event: PointerEvent) {
      pointerX.set(event.clientX / window.innerWidth - 0.5);
      pointerY.set(event.clientY / window.innerHeight - 0.5);
    }
    window.addEventListener("pointermove", onPointerMove);
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, [pointerX, pointerY, reduceMotion]);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-10">
      {garnishes.map((garnish, index) => (
        <Garnish
          key={garnish.name}
          {...garnish}
          index={index}
          pointerX={smoothX}
          pointerY={smoothY}
        />
      ))}
    </div>
  );
}

function Garnish({
  name,
  className,
  depth,
  rotate,
  index,
  pointerX,
  pointerY,
}: (typeof garnishes)[number] & {
  index: number;
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
}) {
  const x = useTransform(pointerX, (value) => value * depth * 2);
  const y = useTransform(pointerY, (value) => value * depth * 2);

  return (
    <motion.div
      className={`absolute aspect-square ${className}`}
      style={{ x, y }}
      initial={{ opacity: 0, scale: 0.4, rotate: rotate - 30 }}
      animate={{ opacity: 1, scale: 1, rotate }}
      transition={{
        type: "spring",
        stiffness: 120,
        damping: 12,
        delay: 0.6 + index * 0.1,
      }}
    >
      {/* Gentle idle bobbing, each garnish on its own rhythm. */}
      <motion.div
        className="relative size-full"
        animate={{ y: [0, -8, 0] }}
        transition={{
          duration: 4 + index * 0.7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: index * 0.4,
        }}
      >
        <Image
          src={`${IMAGE_BASE}/${name}.png`}
          alt=""
          fill
          sizes="120px"
          className="object-contain drop-shadow-xl"
        />
      </motion.div>
    </motion.div>
  );
}
