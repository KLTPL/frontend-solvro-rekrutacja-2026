export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "barownik-theme";

/**
 * Runs before first paint (inlined in <head>) so the page never flashes
 * the wrong theme. Falls back to the OS preference when nothing is stored.
 */
export const themeInitScript = `(() => {
  let stored = null;
  try {
    stored = localStorage.getItem("${THEME_STORAGE_KEY}");
  } catch {
    // Storage can be blocked (privacy settings) – the OS preference is used instead.
  }
  const dark = stored ? stored === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
  document.documentElement.classList.toggle("dark", dark);
})();`;

export function readTheme(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export function applyTheme(theme: Theme) {
  const update = () => {
    const root = document.documentElement;
    // Elements with their own colour transitions would lag behind the
    // background – switch every colour in the same frame instead.
    root.classList.add("theme-switching");
    root.classList.toggle("dark", theme === "dark");
    void root.offsetHeight; // Apply the new colours while transitions are off.
    root.classList.remove("theme-switching");
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  };

  // Cross-fade the whole page rather than jumping between light and dark.
  if ("startViewTransition" in document) document.startViewTransition(update);
  else update();
}
