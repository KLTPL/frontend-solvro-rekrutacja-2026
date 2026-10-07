"use client";

import { CircleAlertIcon, RotateCcwIcon } from "lucide-react";
import { useEffect } from "react";

import { StateMessage } from "@/components/state-message";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    // No error reporting service here – keep the stack trace in the console.
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto grid w-full max-w-6xl flex-1 place-items-center px-4 py-16 sm:px-6">
      <StateMessage
        className="w-full max-w-lg"
        icon={<CircleAlertIcon />}
        title="Coś się rozlało"
        description="Nie udało się wczytać tej strony. Najczęściej pomaga ponowna próba."
        action={
          <Button onClick={() => retry()} className="rounded-full px-4">
            <RotateCcwIcon data-icon="inline-start" />
            Spróbuj ponownie
          </Button>
        }
      />
    </main>
  );
}
