"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useSyncExternalStore } from "react";

import { Button } from "@/components/ui/button";

import { applyTheme, readTheme, type Theme } from "./theme";

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributeFilter: ["class"] });
  return () => observer.disconnect();
}

function useTheme(): Theme | null {
  // The server cannot know the theme – render a neutral placeholder there.
  return useSyncExternalStore(subscribe, readTheme, () => null);
}

export function ThemeToggle() {
  const theme = useTheme();
  const next: Theme = theme === "dark" ? "light" : "dark";
  const label = next === "dark" ? "Włącz tryb ciemny" : "Włącz tryb jasny";

  return (
    <Button
      variant="ghost"
      size="icon-lg"
      aria-label={label}
      title={label}
      onClick={() => applyTheme(next)}
      className="relative overflow-hidden rounded-full"
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {theme && (
          <motion.span
            key={theme}
            initial={{ y: 16, rotate: -45, opacity: 0 }}
            animate={{ y: 0, rotate: 0, opacity: 1 }}
            exit={{ y: -16, rotate: 45, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            className="flex"
          >
            {theme === "dark" ? <MoonIcon /> : <SunIcon />}
          </motion.span>
        )}
      </AnimatePresence>
    </Button>
  );
}
