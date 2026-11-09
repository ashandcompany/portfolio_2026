"use client";

import { ChevronLeft, FileText, Power, Sparkles } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useCallback, useEffect, useRef } from "react";
import { APP_COMPONENTS } from "@/components/apps";
import { Clock } from "@/components/os/Clock";
import { SoundToggle, ThemeToggle } from "@/components/os/Taskbar";
import { AppIcon } from "@/components/ui/AppIcon";
import { Avatar } from "@/components/ui/Avatar";
import { APP_LIST, APPS, type AppId } from "@/data/apps";
import { profile } from "@/data/profile";
import { useDesktopStore } from "@/stores/desktop-store";

/** Apps de l'écran d'accueil (la bienvenue est remplacée par la carte de profil). */
const HOME_APPS = APP_LIST.filter((app) => app.id !== "welcome");

/** Marqueur posé dans l'historique quand une app est ouverte (bouton retour du téléphone). */
const HISTORY_KEY = "emmaOsApp";

/**
 * Version téléphone d'Emma OS (< 768px) : barre d'état, grille d'apps,
 * une app à la fois en plein écran avec bouton retour. Pas de fenêtres flottantes.
 * Partage le store du bureau : les boutons des apps qui appellent `open()` marchent tels quels.
 */
export function MobileShell() {
  const current = useDesktopStore((s) => {
    const win = s.activeId ? s.windows[s.activeId] : undefined;
    return win?.isOpen && !win.isMinimized ? win.id : null;
  });

  // Retour à l'accueil : ferme toutes les « fenêtres ».
  const goHome = useCallback(() => {
    const { windows, close } = useDesktopStore.getState();
    for (const win of Object.values(windows)) if (win?.isOpen) close(win.id);
  }, []);

  // Bouton retour du téléphone / navigateur : une app ouverte = une entrée d'historique.
  const hadApp = useRef(false);
  useEffect(() => {
    if (current && !hadApp.current) window.history.pushState({ [HISTORY_KEY]: true }, "");
    hadApp.current = current !== null;
  }, [current]);

  useEffect(() => {
    window.addEventListener("popstate", goHome);
    return () => window.removeEventListener("popstate", goHome);
  }, [goHome]);

  const back = useCallback(() => {
    if (window.history.state?.[HISTORY_KEY]) window.history.back(); // → popstate → goHome
    else goHome();
  }, [goHome]);

  // Échap (clavier de tablette) = retour.
  useEffect(() => {
    if (!current) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || e.defaultPrevented || useDesktopStore.getState().systemError) return;
      e.preventDefault();
      back();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [current, back]);

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <StatusBar />
      {current ? <MobileAppView key={current} id={current} onBack={back} /> : <MobileHome />}
    </div>
  );
}

function StatusBar() {
  return (
    <header className="flex h-11 shrink-0 items-center justify-between gap-2 bg-taskbar px-3 text-taskbar-fg">
      <span className="font-pixel flex items-center gap-1.5 text-sm">
        <Sparkles className="size-4 text-bubblegum-300" aria-hidden />
        Emma OS
      </span>
      <div className="flex items-center gap-1">
        <ThemeToggle />
        <SoundToggle />
        <div className="pl-1.5">
          <Clock />
        </div>
      </div>
    </header>
  );
}

function MobileHome() {
  const open = useDesktopStore((s) => s.open);
  const showSystemError = useDesktopStore((s) => s.showSystemError);

  return (
    <nav aria-label="Applications" className="min-h-0 flex-1 overflow-y-auto px-4 py-5">
      <div className="mx-auto max-w-md space-y-6">
        {/* Carte de profil (remplace la fenêtre de bienvenue) */}
        <div className="flex items-center gap-3 rounded-window border-2 border-window-border bg-window/90 p-3 text-fg shadow-pixel backdrop-blur-sm">
          <Avatar />
          <div className="min-w-0">
            <h1 className="font-pixel text-lg leading-tight">{profile.fullName}</h1>
            <p className="truncate text-xs text-fg-muted">{profile.role}</p>
            <p className="text-xs text-fg-muted">Touche une app pour explorer ✨</p>
          </div>
        </div>

        <ul className="grid grid-cols-4 gap-x-2 gap-y-4">
          {HOME_APPS.map((app) => (
            <li key={app.id}>
              <button
                type="button"
                onClick={() => open(app.id)}
                className="flex w-full flex-col items-center gap-1 rounded-control p-1"
              >
                <span className="flex size-14 items-center justify-center rounded-window border-2 border-window-border bg-window/80 shadow-pixel-sm backdrop-blur-sm">
                  <AppIcon app={app} className="size-8" strokeWidth={1.5} />
                </span>
                <span className="font-pixel w-full truncate rounded-sm bg-window/70 px-0.5 text-center text-[11px] leading-tight text-fg">
                  {app.title}
                </span>
              </button>
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap justify-center gap-2">
          <Link
            href="/cv"
            className="font-pixel flex items-center gap-1.5 rounded-control border-2 border-control-border bg-surface px-3 py-1.5 text-sm text-fg shadow-bevel"
          >
            <FileText className="size-4" aria-hidden />
            Version simple
          </Link>
          <button
            type="button"
            onClick={() =>
              showSystemError({
                title: "Erreur système",
                message:
                  "Emma OS ne peut pas s'éteindre : il reste trop de projets à te montrer. Réessaie après avoir lu mon CV ✨",
              })
            }
            className="font-pixel flex items-center gap-1.5 rounded-control border-2 border-control-border bg-surface px-3 py-1.5 text-sm text-fg shadow-bevel"
          >
            <Power className="size-4" aria-hidden />
            Éteindre
          </button>
        </div>
      </div>
    </nav>
  );
}

function MobileAppView({ id, onBack }: { id: AppId; onBack: () => void }) {
  const app = APPS[id];
  const App = APP_COMPONENTS[id];
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  // Le lecteur d'écran et le clavier arrivent directement dans l'app ouverte.
  useEffect(() => ref.current?.focus({ preventScroll: true }), []);

  return (
    <motion.section
      ref={ref}
      tabIndex={-1}
      aria-labelledby={`mobile-app-${id}`}
      initial={reduceMotion ? false : { opacity: 0, x: 32 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: "spring", stiffness: 460, damping: 38 }}
      className="flex min-h-0 flex-1 flex-col bg-window text-fg outline-none"
    >
      <div className="title-stripes flex h-11 shrink-0 items-center gap-2 border-b-2 border-window-border bg-titlebar-active px-2">
        <button
          type="button"
          onClick={onBack}
          className="font-pixel flex h-8 items-center gap-0.5 rounded-control pr-2 pl-1 text-sm hover:bg-surface-hover"
        >
          <ChevronLeft className="size-5" aria-hidden />
          Retour
        </button>
        <AppIcon app={app} className="size-4 shrink-0" />
        <h2 id={`mobile-app-${id}`} className="font-pixel min-w-0 truncate text-sm">
          {app.title}
        </h2>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">
        <App />
      </div>
    </motion.section>
  );
}
