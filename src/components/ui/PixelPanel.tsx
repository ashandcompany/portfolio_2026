import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface PixelPanelProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** Titre affiché dans la barre ; sans titre, le panneau n'a pas de barre. */
  title?: ReactNode;
  icon?: ReactNode;
  /** Fenêtre au premier plan : barre de titre plus marquée. */
  active?: boolean;
  /** Contenu à droite de la barre de titre (ex. boutons de fenêtre). */
  actions?: ReactNode;
  bodyClassName?: string;
}

/** Cadre de fenêtre « pixel cozy » : surface crème, bordure lavande, barre de titre rayée. */
export function PixelPanel({
  title,
  icon,
  active = true,
  actions,
  className,
  bodyClassName,
  children,
  ...props
}: PixelPanelProps) {
  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-window border-2 border-window-border bg-window text-fg shadow-window",
        className,
      )}
      {...props}
    >
      {title !== undefined && (
        <div
          className={cn(
            "title-stripes flex h-8 shrink-0 items-center gap-2 border-b-2 border-window-border px-2",
            active ? "bg-titlebar-active" : "bg-titlebar",
          )}
        >
          {icon && <span className="flex size-4 items-center justify-center">{icon}</span>}
          <span
            className={cn(
              "font-pixel truncate text-sm font-semibold",
              active ? "text-fg" : "text-fg-muted",
            )}
          >
            {title}
          </span>
          {actions && <div className="ml-auto flex items-center gap-1">{actions}</div>}
        </div>
      )}
      <div className={cn("flex-1 p-4", bodyClassName)}>{children}</div>
    </div>
  );
}
