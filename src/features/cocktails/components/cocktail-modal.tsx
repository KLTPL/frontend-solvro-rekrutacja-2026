"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CircleAlertIcon, GlassWaterIcon, RotateCcwIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { StateMessage } from "@/components/state-message";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { isNotFoundError } from "@/lib/api-client";

import { cachedDetailsPlaceholder } from "../cache-lookup";
import { parseCocktailId } from "../parse-id";
import { cocktailDetailsOptions } from "../queries";
import { CocktailDetails } from "./cocktail-details";
import { CocktailDetailsSkeleton } from "./cocktail-details-skeleton";

/**
 * Cocktail details opened on top of the list (intercepted route).
 * A direct visit or a refresh renders the full page instead.
 */
export function CocktailModal() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = parseCocktailId(params.id);
  // Closing plays the exit animation first and leaves the route only once it
  // has finished – navigating right away would hide the modal in one frame.
  const [open, setOpen] = useState(true);
  // Next keeps a closed modal mounted but hidden and reveals it again when
  // the same cocktail is reopened, so it has to be open by then.
  useEffect(() => () => setOpen(true), []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        aria-describedby={undefined}
        onAnimationEnd={(event) => {
          if (!open && event.target === event.currentTarget) router.back();
        }}
        // The same size for every cocktail, so nothing moves once the
        // ingredients replace their skeleton; longer recipes scroll inside.
        // The scrollbar's space is reserved up front, so it does not narrow
        // the photo when a long recipe needs it.
        className="h-[calc(100dvh-2rem)] [scrollbar-gutter:stable_both-edges] overflow-y-auto rounded-3xl p-5 sm:max-w-5xl sm:p-8 md:h-[min(48rem,calc(100dvh-2rem))]"
      >
        {id === null ? <CocktailNotFound /> : <ModalBody id={id} />}
      </DialogContent>
    </Dialog>
  );
}

function ModalBody({ id }: { id: number }) {
  const queryClient = useQueryClient();
  const query = useQuery({
    ...cocktailDetailsOptions(id),
    // Show the photo and name from the list right away; ingredients follow.
    placeholderData: () => cachedDetailsPlaceholder(queryClient, id),
  });

  if (query.isError) {
    if (isNotFoundError(query.error)) return <CocktailNotFound />;
    return (
      <>
        <DialogTitle className="sr-only">Błąd ładowania</DialogTitle>
        <StateMessage
          icon={<CircleAlertIcon />}
          title="Nie udało się pobrać koktajlu"
          className="justify-center"
          description={query.error.message}
          action={
            <Button
              onClick={() => query.refetch()}
              className="rounded-full px-4"
            >
              <RotateCcwIcon data-icon="inline-start" />
              Spróbuj ponownie
            </Button>
          }
        />
      </>
    );
  }

  if (!query.data) {
    return (
      <>
        <DialogTitle className="sr-only">Ładowanie koktajlu</DialogTitle>
        <CocktailDetailsSkeleton />
      </>
    );
  }

  return (
    <CocktailDetails
      cocktail={query.data}
      isLoadingIngredients={query.isPlaceholderData}
      titleAs={DialogTitle}
    />
  );
}

function CocktailNotFound() {
  return (
    <>
      <DialogTitle className="sr-only">Nie znaleziono koktajlu</DialogTitle>
      <StateMessage
        icon={<GlassWaterIcon />}
        title="Pusta szklanka"
        // Fills the fixed-size modal, so the message sits in its middle.
        className="justify-center"
        description="Ten koktajl nie istnieje albo został usunięty."
      />
    </>
  );
}
