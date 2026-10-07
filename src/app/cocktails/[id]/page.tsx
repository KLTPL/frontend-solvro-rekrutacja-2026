import { ArrowLeftIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { CocktailDetails } from "@/features/cocktails/components/cocktail-details";
import { CocktailDetailsSkeleton } from "@/features/cocktails/components/cocktail-details-skeleton";
import { parseCocktailId } from "@/features/cocktails/parse-id";
import { getAllCocktailIds, getCocktail } from "@/features/cocktails/server";
import { isNotFoundError } from "@/lib/api-client";

// The whole catalogue is small enough to prerender every cocktail page.
export async function generateStaticParams() {
  const ids = await getAllCocktailIds();
  return ids.map((id) => ({ id: String(id) }));
}

async function loadCocktail(rawId: string) {
  const id = parseCocktailId(rawId);
  if (id === null) notFound();

  try {
    return await getCocktail(id);
  } catch (error) {
    if (isNotFoundError(error)) notFound();
    throw error;
  }
}

export async function generateMetadata({
  params,
}: PageProps<"/cocktails/[id]">): Promise<Metadata> {
  const cocktail = await loadCocktail((await params).id);
  const description = cocktail.instructions.slice(0, 160);

  return {
    title: cocktail.name,
    description,
    openGraph: {
      title: cocktail.name,
      description,
      images: cocktail.imageUrl ? [cocktail.imageUrl] : undefined,
    },
  };
}

export default function CocktailPage({ params }: PageProps<"/cocktails/[id]">) {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <Link
        href="/#katalog"
        className="mb-6 inline-flex items-center gap-2 rounded-full text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
      >
        <ArrowLeftIcon aria-hidden className="size-4" />
        Wróć do katalogu
      </Link>
      {/* The shell above renders instantly on navigation, the cocktail streams in. */}
      <Suspense fallback={<CocktailDetailsSkeleton />}>
        <CocktailContent params={params} />
      </Suspense>
    </main>
  );
}

async function CocktailContent({
  params,
}: Pick<PageProps<"/cocktails/[id]">, "params">) {
  const cocktail = await loadCocktail((await params).id);
  return <CocktailDetails cocktail={cocktail} />;
}
