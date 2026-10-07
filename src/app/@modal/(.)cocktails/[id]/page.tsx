import { Suspense } from "react";

import { CocktailModal } from "@/features/cocktails/components/cocktail-modal";

export default function InterceptedCocktailPage() {
  return (
    // The modal reads the cocktail id from the URL, which is only known at
    // request time – nothing is rendered for it in the prerendered shell.
    <Suspense fallback={null}>
      <CocktailModal />
    </Suspense>
  );
}
