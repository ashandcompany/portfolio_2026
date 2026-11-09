"use client";

import { Moon, Sparkles, Sun, Volume2, VolumeX } from "lucide-react";
import { useRef, useSyncExternalStore } from "react";
import { useShallow } from "zustand/react/shallow";
import { APPS, type AppId } from "@/data/apps";
import { cn } from "@/lib/utils";
import { AppIcon } from "@/components/ui/AppIcon";
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
          "font-pixel flex h-8 shrink-0 items-center gap-1.5 rounded-control px-3 text-on-pastel transition-colors",
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
        <ThemeToggle />
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
            <AppIcon app={app} className="size-3.5" />
            <span className="hidden truncate sm:inline">{app.fileName}</span>
          </button>
        );
      })}
    </nav>
  );
}

/** Bascule rapide clair ↔ sombre (le choix « système » se fait dans les Paramètres). */
function ThemeToggle() {
  const setTheme = useSettingsStore((s) => s.setTheme);
  // Thème réellement affiché (lu sur <html>) : gère aussi le choix « système ».
  const isDark = useSyncExternalStore(
    subscribeTheme,
    () => document.documentElement.dataset.theme === "dark",
    () => false,
  );

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Passer au thème clair" : "Passer au thème sombre"}
      title={isDark ? "Strawberry Milk (clair)" : "Blueberry Night (sombre)"}
      className="flex size-8 items-center justify-center rounded-control hover:bg-taskbar-hover"
    >
      {isDark ? <Sun className="size-4" aria-hidden /> : <Moon className="size-4" aria-hidden />}
    </button>
  );
}

/** Notifie quand l'attribut data-theme de <html> change. */
function subscribeTheme(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
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
