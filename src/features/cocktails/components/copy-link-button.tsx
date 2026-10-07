"use client";

import { CheckIcon, LinkIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

export function CopyLinkButton({ path }: { path: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timeout = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timeout);
  }, [copied]);

  async function copy() {
    await navigator.clipboard.writeText(
      new URL(path, window.location.origin).toString(),
    );
    setCopied(true);
  }

  return (
    <Button
      variant="outline"
      className="rounded-full px-3.5"
      onClick={copy}
      aria-live="polite"
    >
      {copied ? (
        <CheckIcon data-icon="inline-start" />
      ) : (
        <LinkIcon data-icon="inline-start" />
      )}
      {copied ? "Skopiowano" : "Kopiuj link"}
    </Button>
  );
}
