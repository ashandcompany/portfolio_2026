"use client";

import { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";
import { WindowManager } from "@/components/window/WindowManager";
import { DESKTOP_APPS, type AppId } from "@/data/apps";
import { useSettingsStore } from "@/stores/settings-store";
import { DesktopIcon } from "./DesktopIcon";
import { Taskbar } from "./Taskbar";
import { Wallpaper } from "./Wallpaper";

const WELCOME_TOAST_KEY = "emma-os:welcomed";

/** Bureau d'Emma OS : fond, icônes, fenêtres, barre des tâches et notifications. */
export function Desktop() {
  const [selectedIcon, setSelectedIcon] = useState<AppId | null>(null);

  useEffect(() => {
    useSettingsStore.persist.rehydrate();

    // Notification de bienvenue, une fois par session.
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
      900,
    );
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="relative flex h-full flex-col">
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
        <WindowManager />
      </div>

      <Taskbar />

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
