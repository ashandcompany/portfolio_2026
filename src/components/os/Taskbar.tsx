"use client";

import { Sparkles } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import { APPS, type AppId } from "@/data/apps";
import { cn } from "@/lib/utils";
import { useDesktopStore } from "@/stores/desktop-store";

/**
 * Barre des tâches — version lot 2 : bouton Start (inactif) et fenêtres ouvertes.
 * Menu démarrer, horloge et zone système arrivent au lot 3.
 */
export function Taskbar() {
  const openIds = useDesktopStore(
    useShallow((s) =>
      Object.values(s.windows)
        .filter((w) => w?.isOpen)
        .map((w) => w!.id as AppId),
    ),
  );
  const activeId = useDesktopStore((s) => s.activeId);
  const minimizedIds = useDesktopStore(
    useShallow((s) =>
      Object.values(s.windows)
        .filter((w) => w?.isOpen && w.isMinimized)
        .map((w) => w!.id as AppId),
    ),
  );
  const toggleFromTaskbar = useDesktopStore((s) => s.toggleFromTaskbar);

  return (
    <footer className="relative flex h-11 shrink-0 items-center gap-2 bg-taskbar px-2 text-taskbar-fg">
      <button
        type="button"
        className="font-pixel flex h-8 items-center gap-1.5 rounded-control bg-signature px-3 text-fg shadow-bevel hover:bg-signature-hover"
      >
        <Sparkles className="size-4" aria-hidden />
        Start
      </button>

      <nav aria-label="Fenêtres ouvertes" className="flex min-w-0 flex-1 items-center gap-1.5 overflow-x-auto">
        {openIds.map((id) => {
          const app = APPS[id];
          const Icon = app.icon;
          const isActive = activeId === id;
          const isMinimized = minimizedIds.includes(id);
          return (
            <button
              key={id}
              type="button"
              onClick={() => toggleFromTaskbar(id)}
              aria-pressed={isActive}
              title={isMinimized ? `Restaurer ${app.title}` : app.title}
              className={cn(
                "font-pixel flex h-8 max-w-44 shrink-0 items-center gap-1.5 rounded-control border-b-2 px-3 text-sm transition-colors",
                isActive
                  ? "border-signature bg-taskbar-hover"
                  : "border-transparent hover:bg-taskbar-hover/60",
                isMinimized && "opacity-60",
              )}
            >
              <Icon className={cn("size-3.5 shrink-0", app.iconClassName)} aria-hidden />
              <span className="truncate">{app.fileName}</span>
            </button>
          );
        })}
      </nav>
    </footer>
  );
}
