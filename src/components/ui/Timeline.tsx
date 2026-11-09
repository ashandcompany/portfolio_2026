import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Liste verticale reliée par une ligne pointillée. */
export function Timeline({ children }: { children: ReactNode }) {
  // Grand écart entre les items, petit écart à l'intérieur : chaque étape se lit comme un bloc.
  return <ol className="relative space-y-8 border-l-2 border-dashed border-window-border pl-6">{children}</ol>;
}

interface TimelineItemProps {
  /** Point coloré (en cours = rose signature). */
  current?: boolean;
  children: ReactNode;
}

export function TimelineItem({ current, children }: TimelineItemProps) {
  return (
    <li className="relative">
      <span
        aria-hidden
        className={cn(
          "absolute top-0 -left-[33px] size-4 rotate-45 border-2 border-control-border",
          current ? "bg-signature" : "bg-lavender-200",
        )}
      />
      {children}
    </li>
  );
}
