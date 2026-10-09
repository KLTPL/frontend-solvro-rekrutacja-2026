"use client";

import { HeartIcon, MartiniIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, type ReactNode } from "react";

import { useFavorites } from "@/features/favorites/use-favorites";
import { cn } from "@/lib/utils";

interface NavItem {
  href: "/" | "/favorites";
  label: string;
  icon: ReactNode;
}

const items: NavItem[] = [
  { href: "/", label: "Katalog", icon: <MartiniIcon aria-hidden /> },
  { href: "/favorites", label: "Ulubione", icon: <HeartIcon aria-hidden /> },
];

export function NavLinks() {
  return (
    // The current path is only known at request time – until then the links
    // render without the active state, keeping the header in the static shell.
    <Suspense fallback={<NavLinkList pathname={null} />}>
      <ActiveNavLinks />
    </Suspense>
  );
}

function ActiveNavLinks() {
  return <NavLinkList pathname={usePathname()} />;
}

function NavLinkList({ pathname }: { pathname: string | null }) {
  return (
    <ul className="flex items-center gap-1">
      {items.map((item) => {
        const active = pathname === item.href;
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative flex h-9 items-center gap-2 rounded-full px-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none sm:px-3 [&_svg]:size-4",
                active && "bg-secondary text-foreground",
              )}
            >
              {item.icon}
              <span className="sr-only sm:not-sr-only">{item.label}</span>
              {item.href === "/favorites" && <FavoritesCount />}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function FavoritesCount() {
  const { ids } = useFavorites();
  const count = ids.length;

  return (
    <AnimatePresence initial={false}>
      {count > 0 && (
        <motion.span
          key="badge"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          className="grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-xs font-semibold text-primary-foreground tabular-nums"
        >
          <span className="sr-only">, liczba: </span>
          {/* Re-keyed on every change, so the number bumps when it changes. */}
          <motion.span
            key={count}
            initial={{ scale: 1.6 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 600, damping: 26 }}
          >
            {count}
          </motion.span>
        </motion.span>
      )}
    </AnimatePresence>
  );
}
