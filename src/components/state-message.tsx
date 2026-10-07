import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface StateMessageProps {
  icon: ReactNode;
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}

/** Centered message used for empty results and recoverable errors. */
export function StateMessage({
  icon,
  title,
  description,
  action,
  className,
}: StateMessageProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 rounded-3xl border border-dashed border-border px-6 py-14 text-center",
        className,
      )}
    >
      <span className="grid size-14 place-items-center rounded-full bg-secondary text-primary [&_svg]:size-6">
        {icon}
      </span>
      <h3 className="text-xl font-semibold">{title}</h3>
      {description && (
        <p className="max-w-sm text-sm text-pretty text-muted-foreground">
          {description}
        </p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
