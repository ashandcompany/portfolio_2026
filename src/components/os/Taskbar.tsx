"use client";

import { Sparkles, Volume2, VolumeX } from "lucide-react";
import { useRef } from "react";
import { useShallow } from "zustand/react/shallow";
import { APPS, type AppId } from "@/data/apps";
import { cn } from "@/lib/utils";
import { useDesktopStore } from "@/stores/desktop-store";
import { useSettingsStore } from "@/stores/settings-store";
import { Clock } from "./Clock";
import { StartMenu } from "./StartMenu";

/** Barre des tâches : bouton Start, fenêtres ouvertes, zone système (son, heure). */
export function Taskbar() {
  const startRef = useRef<HTMLButtonElement>(null);
  const startMenuOpen = useDesktopStore((s) => s.startMenuOpen);
  const setStartMenuOpen = useDesktopStore((s) => s.setStartMenuOpen);

  return (
    <footer className="relative flex h-11 shrink-0 items-center gap-2 bg-taskbar px-2 text-taskbar-fg">
      <StartMenu anchorRef={startRef} />

      <button
        ref={startRef}
        type="button"
        onClick={() => setStartMenuOpen(!startMenuOpen)}
        aria-expanded={startMenuOpen}
        aria-controls="start-menu"
        aria-haspopup="dialog"
        className={cn(
          "font-pixel flex h-8 shrink-0 items-center gap-1.5 rounded-control px-3 text-fg transition-colors",
          startMenuOpen
            ? "bg-signature-hover shadow-bevel-pressed"
            : "bg-signature shadow-bevel hover:bg-signature-hover",
        )}
      >
        <Sparkles className="size-4" aria-hidden />
        Start
      </button>

      <TaskbarWindows />

      <div className="flex shrink-0 items-center gap-1 border-l-2 border-taskbar-hover pl-2">
        <SoundToggle />
        <div className="px-1.5">
          <Clock />
        </div>
      </div>
    </footer>
  );
}

function TaskbarWindows() {
  const openWindows = useDesktopStore(
    useShallow((s) =>
      Object.values(s.windows)
        .filter((w) => w?.isOpen)
        .map((w) => `${w!.id}:${w!.isMinimized ? 1 : 0}`),
    ),
  );
  const activeId = useDesktopStore((s) => s.activeId);
  const toggleFromTaskbar = useDesktopStore((s) => s.toggleFromTaskbar);

  return (
    <nav aria-label="Fenêtres ouvertes" className="flex min-w-0 flex-1 items-center gap-1.5 overflow-x-auto">
      {openWindows.map((entry) => {
        const [id, minimized] = entry.split(":") as [AppId, string];
        const app = APPS[id];
        const Icon = app.icon;
        const isActive = activeId === id;
        const isMinimized = minimized === "1";
        return (
          <button
            key={id}
            type="button"
            onClick={() => toggleFromTaskbar(id)}
            aria-pressed={isActive}
            title={isMinimized ? `Restaurer ${app.title}` : app.title}
            className={cn(
              "font-pixel flex h-8 max-w-44 shrink-0 items-center gap-1.5 rounded-control border-b-2 px-2.5 text-sm transition-colors",
              isActive ? "border-signature bg-taskbar-hover" : "border-transparent hover:bg-taskbar-hover/60",
              isMinimized && "opacity-60",
            )}
          >
            <Icon className={cn("size-3.5 shrink-0", app.iconClassName)} aria-hidden />
            <span className="hidden truncate sm:inline">{app.fileName}</span>
          </button>
        );
      })}
    </nav>
  );
}

function SoundToggle() {
  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const toggleSound = useSettingsStore((s) => s.toggleSound);
  const Icon = soundEnabled ? Volume2 : VolumeX;

  return (
    <button
      type="button"
      onClick={toggleSound}
      aria-pressed={soundEnabled}
      aria-label={soundEnabled ? "Couper les sons" : "Activer les sons"}
      title={soundEnabled ? "Couper les sons" : "Activer les sons"}
      className="flex size-8 items-center justify-center rounded-control hover:bg-taskbar-hover"
    >
      <Icon className="size-4" aria-hidden />
    </button>
  );
}
