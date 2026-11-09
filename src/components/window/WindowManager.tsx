"use client";

import { AnimatePresence } from "motion/react";
import { useEffect, useRef } from "react";
import { useShallow } from "zustand/react/shallow";
import { APP_COMPONENTS } from "@/components/apps";
import type { AppId } from "@/data/apps";
import { useDesktopStore } from "@/stores/desktop-store";
import { Window } from "./Window";

/**
 * Rend les fenêtres ouvertes dans la zone du bureau, restaure la disposition
 * sauvegardée et garde les fenêtres dans l'écran quand il est redimensionné.
 */
export function WindowManager() {
  const containerRef = useRef<HTMLDivElement>(null);
  const openIds = useDesktopStore(
    useShallow((s) =>
      Object.values(s.windows)
        .filter((w) => w?.isOpen)
        .map((w) => w!.id as AppId),
    ),
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const store = useDesktopStore;

    const measure = () =>
      store.getState().setViewport({ width: el.clientWidth, height: el.clientHeight });

    // 1. Restaurer la disposition sauvegardée, 2. l'ajuster à l'écran actuel.
    Promise.resolve(store.persist.rehydrate()).then(() => {
      measure();
      // Première visite : fenêtres de lancement (Bienvenue + Projets).
      if (Object.keys(store.getState().windows).length === 0) store.getState().openStartup();
    });

    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useWindowKeyboard();

  return (
    <div ref={containerRef} data-desktop-viewport className="pointer-events-none absolute inset-0 overflow-hidden">
      <AnimatePresence>
        {openIds.map((id) => {
          const App = APP_COMPONENTS[id];
          return (
            <Window key={id} id={id}>
              <App />
            </Window>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

/**
 * Clavier : Échap ferme la fenêtre active (sauf dans un champ de saisie, ou quand
 * le menu démarrer / une boîte de dialogue la gère déjà).
 * Après une fermeture, le focus passe à la fenêtre suivante, sinon à l'icône de l'app.
 */
function useWindowKeyboard() {
  useEffect(() => {
    const store = useDesktopStore;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || e.defaultPrevented) return;
      const { bootDone, startMenuOpen, systemError, activeId, windows, close } = store.getState();
      if (!bootDone || startMenuOpen || systemError || !activeId) return;
      if (!windows[activeId]?.isOpen || windows[activeId]?.isMinimized) return;
      if ((e.target as HTMLElement).closest?.("input, textarea, select, [contenteditable='true']")) return;
      e.preventDefault();
      close(activeId);
    };

    const unsubscribe = store.subscribe((state, prev) => {
      for (const id of Object.keys(prev.windows) as AppId[]) {
        if (!prev.windows[id]?.isOpen || state.windows[id]?.isOpen) continue;
        // La fenêtre fermée reste un instant dans le DOM (animation de sortie) :
        // on ne déplace le focus que s'il y était, ou s'il est perdu.
        const focused = document.activeElement;
        const closing = document.querySelector(`[data-window-id="${id}"]`);
        if (focused && focused !== document.body && !closing?.contains(focused)) continue;
        const target =
          (state.activeId && document.querySelector<HTMLElement>(`[data-window-id="${state.activeId}"]`)) ||
          document.querySelector<HTMLElement>(`[data-desktop-icon][data-app-id="${id}"]`);
        target?.focus({ preventScroll: true });
      }
    });

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      unsubscribe();
    };
  }, []);
}
