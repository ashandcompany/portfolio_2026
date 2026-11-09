import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { APPS, type AppId, type Size } from "@/data/apps";

export interface Point {
  x: number;
  y: number;
}

export interface WindowState {
  id: AppId;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position: Point;
  size: Size;
}

interface DesktopState {
  windows: Partial<Record<AppId, WindowState>>;
  activeId: AppId | null;
  /** z-index le plus élevé attribué (incrémenté à chaque mise au premier plan). */
  topZ: number;
  /** Taille de la zone du bureau (hors barre des tâches), mise à jour par le WindowManager. */
  viewport: Size;
  /** Menu démarrer ouvert (non sauvegardé). */
  startMenuOpen: boolean;

  setStartMenuOpen: (open: boolean) => void;
  /** Ouvre une app (ou la remet au premier plan) et ferme le menu démarrer. */
  open: (id: AppId) => void;
  close: (id: AppId) => void;
  minimize: (id: AppId) => void;
  toggleMaximize: (id: AppId) => void;
  focus: (id: AppId) => void;
  /** Comportement d'un bouton de la barre des tâches : réduit si active, sinon met au premier plan. */
  toggleFromTaskbar: (id: AppId) => void;
  updatePosition: (id: AppId, position: Point) => void;
  updateBounds: (id: AppId, position: Point, size: Size) => void;
  setViewport: (viewport: Size) => void;
  /** Ferme toutes les fenêtres, oublie la disposition et rouvre la bienvenue. */
  resetLayout: () => void;

  /** Écran de démarrage terminé (non sauvegardé). */
  bootDone: boolean;
  setBootDone: (done: boolean) => void;

  /** Fausse boîte de dialogue « erreur système » (easter egg). */
  systemError: SystemError | null;
  showSystemError: (error: SystemError) => void;
  hideSystemError: () => void;
}

export interface SystemError {
  title: string;
  message: string;
}

const CASCADE_START: Point = { x: 96, y: 40 };
const CASCADE_STEP = 32;
const MARGIN = 8;

/** Garde une fenêtre dans le bureau (taille réduite si l'écran est trop petit). */
function fitWindow(win: WindowState, viewport: Size): WindowState {
  if (viewport.width === 0 || viewport.height === 0) return win;
  const { minSize } = APPS[win.id];
  const width = Math.max(
    Math.min(win.size.width, viewport.width - MARGIN * 2),
    Math.min(minSize.width, viewport.width),
  );
  const height = Math.max(
    Math.min(win.size.height, viewport.height - MARGIN * 2),
    Math.min(minSize.height, viewport.height),
  );
  const x = Math.min(Math.max(win.position.x, 0), Math.max(viewport.width - width, 0));
  const y = Math.min(Math.max(win.position.y, 0), Math.max(viewport.height - height, 0));
  return { ...win, size: { width, height }, position: { x, y } };
}

/** Fenêtre ouverte, non réduite, la plus haute — hors `excludeId`. */
function topmostVisible(
  windows: DesktopState["windows"],
  excludeId?: AppId,
): AppId | null {
  let best: WindowState | null = null;
  for (const win of Object.values(windows)) {
    if (!win || win.id === excludeId || !win.isOpen || win.isMinimized) continue;
    if (!best || win.zIndex > best.zIndex) best = win;
  }
  return best?.id ?? null;
}

export const useDesktopStore = create<DesktopState>()(
  persist(
    (set, get) => {
      const patch = (id: AppId, changes: Partial<WindowState>) =>
        set((state) => {
          const win = state.windows[id];
          if (!win) return state;
          return { windows: { ...state.windows, [id]: { ...win, ...changes } } };
        });

      return {
        windows: {},
        activeId: null,
        topZ: 10,
        viewport: { width: 0, height: 0 },
        startMenuOpen: false,

        setStartMenuOpen: (startMenuOpen) => set({ startMenuOpen }),

        open: (id) =>
          set((state) => {
            const z = state.topZ + 1;
            const existing = state.windows[id];
            if (existing?.isOpen) {
              return {
                startMenuOpen: false,
                topZ: z,
                activeId: id,
                windows: { ...state.windows, [id]: { ...existing, isMinimized: false, zIndex: z } },
              };
            }
            // Nouvelle ouverture : cascade selon le nombre de fenêtres déjà ouvertes,
            // en réutilisant la taille mémorisée si la fenêtre a déjà été ouverte.
            const openCount = Object.values(state.windows).filter((w) => w?.isOpen).length;
            const offset = (openCount % 6) * CASCADE_STEP;
            const base: WindowState = {
              id,
              isOpen: true,
              isMinimized: false,
              isMaximized: false,
              zIndex: z,
              size: existing?.size ?? APPS[id].defaultSize,
              position: { x: CASCADE_START.x + offset, y: CASCADE_START.y + offset },
            };
            return {
              startMenuOpen: false,
              topZ: z,
              activeId: id,
              windows: { ...state.windows, [id]: fitWindow(base, state.viewport) },
            };
          }),

        close: (id) => {
          patch(id, { isOpen: false, isMinimized: false, isMaximized: false });
          if (get().activeId === id) set({ activeId: topmostVisible(get().windows) });
        },

        minimize: (id) => {
          patch(id, { isMinimized: true });
          if (get().activeId === id) set({ activeId: topmostVisible(get().windows, id) });
        },

        toggleMaximize: (id) => {
          const win = get().windows[id];
          if (!win) return;
          patch(id, { isMaximized: !win.isMaximized });
          get().focus(id);
        },

        focus: (id) =>
          set((state) => {
            const win = state.windows[id];
            if (!win) return state;
            if (state.activeId === id && win.zIndex === state.topZ && !win.isMinimized) {
              return state; // déjà au premier plan : pas de re-render inutile
            }
            const z = state.topZ + 1;
            return {
              topZ: z,
              activeId: id,
              windows: { ...state.windows, [id]: { ...win, isMinimized: false, zIndex: z } },
            };
          }),

        toggleFromTaskbar: (id) => {
          const { activeId, windows } = get();
          const win = windows[id];
          if (!win?.isOpen) return get().open(id);
          if (activeId === id && !win.isMinimized) get().minimize(id);
          else get().focus(id);
        },

        updatePosition: (id, position) => patch(id, { position }),

        updateBounds: (id, position, size) => patch(id, { position, size }),

        setViewport: (viewport) =>
          set((state) => {
            const windows: DesktopState["windows"] = {};
            for (const [key, win] of Object.entries(state.windows)) {
              if (win) windows[key as AppId] = fitWindow(win, viewport);
            }
            return { viewport, windows };
          }),

        resetLayout: () => {
          set({ windows: {}, activeId: null, topZ: 10, startMenuOpen: false });
          get().open("welcome");
        },

        bootDone: false,
        setBootDone: (bootDone) => set({ bootDone }),

        systemError: null,
        showSystemError: (systemError) => set({ systemError, startMenuOpen: false }),
        hideSystemError: () => set({ systemError: null }),
      };
    },
    {
      name: "emma-os:desktop",
      version: 1,
      // `window.localStorage` lève une erreur côté serveur → persistance désactivée là-bas.
      storage: createJSONStorage(() => window.localStorage),
      // Réhydratation manuelle côté client (évite les écarts d'hydratation SSR).
      skipHydration: true,
      // On mémorise la disposition, pas l'état transitoire.
      partialize: (state) => ({ windows: state.windows, topZ: state.topZ }),
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        // Retirer les apps qui n'existent plus dans le registre.
        const windows: DesktopState["windows"] = {};
        for (const [key, win] of Object.entries(state.windows)) {
          if (win && key in APPS) windows[key as AppId] = win;
        }
        useDesktopStore.setState({ windows, activeId: topmostVisible(windows) });
      },
    },
  ),
);
