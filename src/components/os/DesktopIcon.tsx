"use client";

import type { AppMeta } from "@/data/apps";
import { cn } from "@/lib/utils";
import { useDesktopStore } from "@/stores/desktop-store";

/** Icône du bureau : double-clic (ou Entrée) pour ouvrir l'application. */
export function DesktopIcon({ app }: { app: AppMeta }) {
  const open = useDesktopStore((s) => s.open);
  const Icon = app.icon;

  return (
    <button
      type="button"
      onDoubleClick={() => open(app.id)}
      onKeyDown={(e) => {
        if (e.key === "Enter") open(app.id);
      }}
      aria-label={`Ouvrir ${app.title}`}
      className={cn(
        "group flex w-20 flex-col items-center gap-1 rounded-control p-1.5 outline-none",
        "focus-visible:bg-lavender-200/70 hover:bg-white/30",
      )}
    >
      <span className="flex size-12 items-center justify-center rounded-control transition-transform group-hover:-translate-y-0.5">
        <Icon className={cn("size-10 drop-shadow-[2px_2px_0_rgb(75_53_102/0.25)]", app.iconClassName)} strokeWidth={1.5} />
      </span>
      <span className="font-pixel rounded-sm px-1 text-center text-xs leading-tight text-fg group-focus-visible:bg-accent">
        {app.title}
      </span>
    </button>
  );
}
