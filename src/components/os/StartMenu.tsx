"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Power, Search, Settings } from "lucide-react";
import { useEffect, useRef, useState, type RefObject } from "react";
import { searchApps } from "@/data/apps";
import { profile } from "@/data/profile";
import { cn } from "@/lib/utils";
import { AppIcon } from "@/components/ui/AppIcon";
import { Avatar } from "@/components/ui/Avatar";
import { useDesktopStore } from "@/stores/desktop-store";

interface StartMenuProps {
  /** Bouton Start : un clic dessus ne doit pas compter comme « clic extérieur ». */
  anchorRef: RefObject<HTMLButtonElement | null>;
}

/** Menu démarrer : profil, recherche d'applications et liste des apps. */
export function StartMenu({ anchorRef }: StartMenuProps) {
  const isOpen = useDesktopStore((s) => s.startMenuOpen);
  const reduceMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="start-menu"
          initial={{ opacity: 0, y: 16, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.97 }}
          transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 500, damping: 36 }}
          style={{ transformOrigin: "0% 100%" }}
          className="absolute bottom-full left-2 mb-2 w-[min(20rem,calc(100vw-1rem))]"
        >
          <StartMenuPanel anchorRef={anchorRef} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function StartMenuPanel({ anchorRef }: StartMenuProps) {
  const open = useDesktopStore((s) => s.open);
  const setStartMenuOpen = useDesktopStore((s) => s.setStartMenuOpen);
  const showSystemError = useDesktopStore((s) => s.showSystemError);
  const [query, setQuery] = useState("");
  const panelRef = useRef<HTMLDivElement>(null);
  const results = searchApps(query);

  // Fermeture au clic extérieur et avec Échap.
  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (panelRef.current?.contains(target) || anchorRef.current?.contains(target)) return;
      setStartMenuOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault(); // Échap ferme le menu, pas la fenêtre active derrière
        setStartMenuOpen(false);
        anchorRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [anchorRef, setStartMenuOpen]);

  return (
    <div
      ref={panelRef}
      id="start-menu"
      role="dialog"
      aria-label="Menu démarrer"
      className="flex max-h-[min(32rem,calc(100dvh-5rem))] flex-col overflow-hidden rounded-window border-2 border-window-border bg-window text-fg shadow-window"
    >
      {/* Profil */}
      <div className="title-stripes flex items-center gap-3 border-b-2 border-window-border bg-titlebar-active p-3">
        <Avatar />
        <div className="min-w-0">
          <p className="font-pixel text-lg leading-tight">{profile.fullName}</p>
          <p className="truncate text-xs text-fg-muted">{profile.role}</p>
          <p className="font-pixel flex items-center gap-1 text-xs text-fg-muted">
            <span className="size-2 rounded-full bg-success ring-1 ring-plum-500" aria-hidden />
            Online
          </p>
        </div>
      </div>

      {/* Recherche */}
      <form
        className="p-2"
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          if (results[0]) open(results[0].id);
        }}
      >
        <label className="flex h-9 items-center gap-2 rounded-control border-2 border-control-border bg-surface px-2 focus-within:border-bubblegum-500 focus-within:bg-input">
          <Search className="size-4 shrink-0 text-fg-muted" aria-hidden />
          <input
            autoFocus
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher une app…"
            aria-label="Rechercher une application"
            className="w-full bg-transparent text-sm outline-none placeholder:text-fg-muted"
          />
        </label>
      </form>

      {/* Applications */}
      <ul className="min-h-0 flex-1 overflow-y-auto px-2 pb-2" aria-label="Applications">
        {results.map((app, index) => {
          return (
            <li key={app.id}>
              <button
                type="button"
                onClick={() => open(app.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-control px-2 py-1.5 text-left hover:bg-surface-hover focus-visible:bg-surface-hover",
                  query && index === 0 && "bg-surface-hover",
                )}
              >
                <AppIcon app={app} className="size-6" strokeWidth={1.5} />
                <span className="min-w-0">
                  <span className="font-pixel block text-sm leading-tight">{app.title}</span>
                  <span className="block truncate text-xs text-fg-muted">{app.description}</span>
                </span>
              </button>
            </li>
          );
        })}
        {results.length === 0 && (
          <li className="px-2 py-6 text-center text-sm text-fg-muted">
            Aucune app trouvée pour « {query} » 🔍
          </li>
        )}
      </ul>

      {/* Pied */}
      <div className="flex justify-between border-t-2 border-window-border bg-titlebar p-2">
        <button
          type="button"
          onClick={() => open("settings")}
          className="font-pixel flex items-center gap-1.5 rounded-control px-2 py-1 text-sm text-fg-muted hover:bg-surface-hover hover:text-fg"
        >
          <Settings className="size-4" aria-hidden />
          Paramètres
        </button>
        <button
          type="button"
          onClick={() =>
            showSystemError({
              title: "Erreur système",
              message:
                "Emma OS ne peut pas s'éteindre : il reste trop de projets à te montrer. Réessaie après avoir lu mon CV ✨",
            })
          }
          className="font-pixel flex items-center gap-1.5 rounded-control px-2 py-1 text-sm text-fg-muted hover:bg-surface-hover hover:text-fg"
        >
          <Power className="size-4" aria-hidden />
          Éteindre
        </button>
      </div>
    </div>
  );
}
