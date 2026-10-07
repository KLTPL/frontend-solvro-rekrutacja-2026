import { GlassWaterIcon } from "lucide-react";
import Link from "next/link";

import { StateMessage } from "@/components/state-message";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="mx-auto grid w-full max-w-6xl flex-1 place-items-center px-4 py-16 sm:px-6">
      <StateMessage
        className="w-full max-w-lg"
        icon={<GlassWaterIcon />}
        title="Pusta szklanka"
        description="Nie znaleźliśmy tej strony ani koktajlu. Może wybierzesz coś z katalogu?"
        action={
          <Button asChild className="rounded-full px-4">
            <Link href="/">Wróć do katalogu</Link>
          </Button>
        }
      />
    </main>
  );
}
