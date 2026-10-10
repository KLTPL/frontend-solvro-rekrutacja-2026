"use client";

import { CheckIcon, LinkIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

interface CopyLinkButtonProps {
  path: string;
  /** `icon` fits compact bars, `labeled` is a regular pill button. */
  variant?: "icon" | "labeled";
}

export function CopyLinkButton({
  path,
  variant = "labeled",
}: CopyLinkButtonProps) {
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

  const label = copied ? "Skopiowano" : "Kopiuj link";

  if (variant === "icon") {
    return (
      <Button
        variant="outline"
        size="icon"
        className="rounded-full"
        onClick={copy}
        aria-label={label}
        title={label}
      >
        {copied ? <CheckIcon aria-hidden /> : <LinkIcon aria-hidden />}
      </Button>
    );
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
      {label}
    </Button>
  );
}
