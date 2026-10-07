"use client";

import { HeartIcon, MartiniIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

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
  const pathname = usePathname();

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
                "relative flex h-9 items-center gap-2 rounded-full px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none [&_svg]:size-4",
                active && "bg-secondary text-foreground",
              )}
            >
              {item.icon}
              <span className="sr-only sm:not-sr-only">{item.label}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
