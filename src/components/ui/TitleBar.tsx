import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface TitleBarProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  title: ReactNode;
  icon?: ReactNode;
  /** Fenêtre au premier plan : barre plus marquée. */
  active?: boolean;
  /** Contenu à droite (ex. boutons réduire / agrandir / fermer). */
  actions?: ReactNode;
}

/** Barre de titre rayée façon fenêtre rétro. */
export function TitleBar({ title, icon, active = true, actions, className, ...props }: TitleBarProps) {
  return (
    <div
      className={cn(
        "title-stripes flex h-8 shrink-0 select-none items-center gap-2 border-b-2 border-window-border px-2 transition-colors",
        active ? "bg-titlebar-active" : "bg-titlebar",
        className,
      )}
      {...props}
    >
      {icon && <span className="flex size-4 shrink-0 items-center justify-center">{icon}</span>}
      <span
        className={cn(
          "font-pixel truncate text-sm font-semibold",
          active ? "text-fg" : "text-fg-muted",
        )}
      >
        {title}
      </span>
      {actions && <div className="ml-auto flex shrink-0 items-center gap-1">{actions}</div>}
    </div>
  );
}
