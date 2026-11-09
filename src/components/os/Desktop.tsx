"use client";

import Link from "next/link";
import { type ReactNode, useEffect, useState } from "react";
import { Toaster } from "sonner";
import { MobileShell } from "@/components/mobile/MobileShell";
import { WindowManager } from "@/components/window/WindowManager";
import { DESKTOP_APPS, type AppId } from "@/data/apps";
import { useIsMobile } from "@/hooks/useIsMobile";
import { notify } from "@/lib/notify";
import { cn } from "@/lib/utils";
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
  const bootDone = useDesktopStore((s) => s.bootDone);
  const isMobile = useIsMobile();

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
    const onPhone = window.matchMedia("(max-width: 767.98px)").matches;
    const timer = setTimeout(
      () =>
        notify("Bienvenue sur Emma OS ✨", {
          description: onPhone
            ? "Touche une app pour découvrir mon parcours."
            : "Double-clique sur une icône ou ouvre le menu Start pour explorer.",
        }),
      700,
    );
    return () => clearTimeout(timer);
  }, [bootDone]);

  return (
    <main className="relative flex h-full flex-col">
      {/* Premier élément au clavier : accès direct à la version texte (lecteurs d'écran, recruteurs pressés). */}
      <Link
        href="/cv"
        className="font-pixel sr-only z-[110] rounded-control bg-signature px-3 py-1.5 text-on-pastel shadow-pixel focus:not-sr-only focus:absolute focus:top-2 focus:left-2"
      >
        Aller à la version simple du portfolio
      </Link>
      <ThemeSync />
      <SoundEffects />
      <Wallpaper />

      {/*
        Bureau (≥ 768px) ou téléphone (< 768px). Avant l'hydratation, on ne connaît pas
        la taille de l'écran : les deux sont rendus et le CSS masque le mauvais (pas de flash).
      */}
      {isMobile !== true && (
        <div className={cn("flex min-h-0 flex-1 flex-col", isMobile === null && "max-md:hidden")}>
          <DesktopShell githubWidget={githubWidget} />
        </div>
      )}
      {isMobile !== false && (
        <div className={cn("flex min-h-0 flex-1 flex-col", isMobile === null && "md:hidden")}>
          <MobileShell />
        </div>
      )}

      <SystemErrorDialog />
      <BootScreen />

      <Toaster
        position="bottom-right"
        offset={{ bottom: 56, right: 12 }}
        mobileOffset={{ bottom: 16 }}
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

/** Version bureau : icônes, widgets, fenêtres flottantes et barre des tâches. */
function DesktopShell({ githubWidget }: { githubWidget?: ReactNode }) {
  const [selectedIcon, setSelectedIcon] = useState<AppId | null>(null);

  return (
    <>
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
    </>
  );
}
