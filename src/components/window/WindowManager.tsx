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
      // Première visite : on ouvre la fenêtre de bienvenue.
      if (Object.keys(store.getState().windows).length === 0) store.getState().open("welcome");
    });

    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="pointer-events-none absolute inset-0 overflow-hidden">
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
