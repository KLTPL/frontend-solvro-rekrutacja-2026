"use client";

import type { ComponentProps, CSSProperties } from "react";
import { Toaster as Sonner } from "sonner";

/**
 * Sonner styled with the app's colour tokens, so it follows the `.dark` class
 * without a `theme` prop. Sonner's own CSS is not layered and beats Tailwind
 * utilities – the overrides below need `!`.
 */
export function Toaster(props: ComponentProps<typeof Sonner>) {
  return (
    <Sonner
      position="bottom-center"
      containerAriaLabel="Powiadomienia"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius-2xl)",
          fontFamily: "var(--font-sans)",
        } as CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "gap-3! shadow-lg!",
          actionButton:
            "h-8! rounded-full! bg-primary! px-3.5! text-sm! text-primary-foreground! hover:bg-primary/80! focus-visible:ring-3! focus-visible:ring-ring/50!",
        },
      }}
      {...props}
    />
  );
}
