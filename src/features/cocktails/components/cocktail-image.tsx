import { MartiniIcon } from "lucide-react";
import Image from "next/image";

import { cn } from "@/lib/utils";

interface CocktailImageProps {
  src: string | null;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}

/** Square cocktail photo with a soft placeholder while it loads (or if it is missing). */
export function CocktailImage({
  src,
  alt,
  sizes,
  priority,
  className,
}: CocktailImageProps) {
  return (
    <div
      className={cn(
        "relative aspect-square overflow-hidden bg-linear-to-br from-blush to-banana/60",
        className,
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          preload={priority}
          className="object-cover"
        />
      ) : (
        <MartiniIcon
          aria-hidden
          className="absolute inset-0 m-auto size-1/3 text-blush-foreground/40"
        />
      )}
    </div>
  );
}
