import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Titre de section façon onglet pixel. */
export function SectionTitle({ children, icon, className }: { children: ReactNode; icon?: ReactNode; className?: string }) {
  return (
    <h3
      className={cn(
        "font-pixel flex items-center gap-2 border-b-2 border-dashed border-window-border pb-1 text-sm tracking-wider text-fg-muted uppercase",
        className,
      )}
    >
      {icon}
      {children}
    </h3>
  );
}
