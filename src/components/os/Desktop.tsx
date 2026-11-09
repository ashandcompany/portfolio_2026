"use client";

import { type ReactNode, useEffect, useState } from "react";
import { toast, Toaster } from "sonner";
import { WindowManager } from "@/components/window/WindowManager";
import { DESKTOP_APPS, type AppId } from "@/data/apps";
import { useDesktopStore } from "@/stores/desktop-store";
import { BootScreen } from "./BootScreen";
import { DesktopIcon } from "./DesktopIcon";
import { DesktopWidgets } from "./DesktopWidgets";
import { SoundEffects } from "./SoundEffects";
import { SystemErrorDialog } from "./SystemErrorDialog";
import { Taskbar } from "./Taskbar";
import { ThemeSync } from "./ThemeSync";
import { Wallpaper } from "./Wallpaper";

const WELCOME_TOAST_KEY = "emma-os:welcomed";

/**
 * Bureau d'Emma OS : fond, icônes, widgets, fenêtres, barre des tâches et notifications.
 * `githubWidget` : composant serveur (contributions GitHub) passé depuis la page.
 */
export function Desktop({ githubWidget }: { githubWidget?: ReactNode }) {
  const [selectedIcon, setSelectedIcon] = useState<AppId | null>(null);
  const bootDone = useDesktopStore((s) => s.bootDone);

  // Notification de bienvenue, une fois par session, après l'écran de démarrage.
  useEffect(() => {
    if (!bootDone) return;
    let alreadyWelcomed = false;
    try {
      alreadyWelcomed = sessionStorage.getItem(WELCOME_TOAST_KEY) === "1";
      sessionStorage.setItem(WELCOME_TOAST_KEY, "1");
    } catch {
      // stockage indisponible (navigation privée…) : on affiche quand même
    }
    if (alreadyWelcomed) return;
    const timer = setTimeout(
      () =>
        toast("Bienvenue sur Emma OS ✨", {
          description: "Double-clique sur une icône ou ouvre le menu Start pour explorer.",
        }),
      700,
    );
    return () => clearTimeout(timer);
  }, [bootDone]);

  return (
    <main className="relative flex h-full flex-col">
      <ThemeSync />
      <SoundEffects />
      <Wallpaper />

      {/* Zone du bureau ; `isolate` confine les z-index des fenêtres à cette zone. */}
      <div
        className="relative isolate min-h-0 flex-1"
        onPointerDown={(e) => {
          // Clic sur le fond du bureau : on désélectionne l'icône.
          if (!(e.target as HTMLElement).closest("[data-desktop-icon]")) setSelectedIcon(null);
        }}
      >
        <nav
          aria-label="Bureau"
          className="absolute inset-y-0 left-0 flex flex-col flex-wrap content-start gap-1 p-3"
        >
          {DESKTOP_APPS.map((app) => (
            <DesktopIcon
              key={app.id}
              app={app}
              selected={selectedIcon === app.id}
              onSelect={() => setSelectedIcon(app.id)}
            />
          ))}
        </nav>
        <DesktopWidgets github={githubWidget} />
        <WindowManager />
      </div>

      <Taskbar />
      <SystemErrorDialog />
      <BootScreen />

      <Toaster
        position="bottom-right"
        offset={{ bottom: 56, right: 12 }}
        mobileOffset={{ bottom: 56 }}
        duration={5000}
        toastOptions={{
          unstyled: true,
          classNames: {
            toast:
              "flex w-[var(--width)] items-start gap-3 rounded-window border-2 border-window-border bg-window p-3 text-fg shadow-window",
            title: "font-pixel text-sm",
            description: "text-xs text-fg-muted mt-0.5",
            icon: "mt-0.5",
            success: "border-success",
            error: "border-danger",
            warning: "border-warning",
            info: "border-info",
          },
        }}
      />
    </main>
  );
}
