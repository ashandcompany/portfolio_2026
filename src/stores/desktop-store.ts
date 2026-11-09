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
  /** Fenêtres du premier lancement : Bienvenue + Projets, côte à côte si l'écran le permet. */
  openStartup: () => void;
  /** Ferme toutes les fenêtres, oublie la disposition et rouvre celles du lancement. */
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

/** Position de repli tant que la taille du bureau n'est pas connue. */
const CASCADE_START: Point = { x: 96, y: 40 };
const MARGIN = 8;
/** Largeur réservée aux icônes du bureau (à gauche) pour la disposition de lancement. */
const ICON_COLUMN_WIDTH = 112;
const STARTUP_GAP = 16;
/** En dessous, Projets n'affiche plus qu'une colonne de cartes : on préfère la cascade. */
const STARTUP_MIN_PROJECTS_WIDTH = 600;

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

/**
 * Taille du bureau. Normalement mesurée par le WindowManager ; si elle manque encore
 * (store recréé par un rechargement à chaud en dev, ouverture avant la 1re mesure…),
 * on la lit directement dans le DOM plutôt que de placer les fenêtres « à l'aveugle ».
 */
function currentViewport(viewport: Size): Size {
  if (viewport.width && viewport.height) return viewport;
  if (typeof document === "undefined") return viewport;
  const el = document.querySelector<HTMLElement>("[data-desktop-viewport]");
  return el ? { width: el.clientWidth, height: el.clientHeight } : viewport;
}

/** Pas de la grille de positions testées par `findFreeSpot` (px). */
const PLACEMENT_STEP = 24;

/** Largeur occupée par les widgets en haut à droite (w-56 + marge), visibles dès le breakpoint lg. */
const WIDGETS_COLUMN_WIDTH = 240;
const WIDGETS_MIN_VIEWPORT = 1024;

/** Place réservée à droite pour les widgets, s'ils sont affichés. */
function widgetsReserve(vw: number) {
  return vw >= WIDGETS_MIN_VIEWPORT ? WIDGETS_COLUMN_WIDTH : 0;
}

/**
 * Plage des x possibles pour une fenêtre de largeur `width` : entre les icônes (à gauche)
 * et les widgets (à droite) si elle y tient, sinon on s'autorise à les recouvrir.
 */
function horizontalRange(width: number, vw: number) {
  const strictMax = vw - width - MARGIN - widgetsReserve(vw);
  if (strictMax >= ICON_COLUMN_WIDTH) return { minX: ICON_COLUMN_WIDTH, maxX: strictMax };
  const maxX = Math.max(vw - width - MARGIN, MARGIN);
  return { minX: maxX >= ICON_COLUMN_WIDTH ? ICON_COLUMN_WIDTH : MARGIN, maxX };
}

/**
 * Position d'une nouvelle fenêtre : l'endroit du bureau où elle recouvre le moins
 * les fenêtres visibles ; à recouvrement égal, le plus proche du centre.
 * On évite la colonne d'icônes à gauche quand la place le permet.
 */
function findFreeSpot(size: Size, windows: DesktopState["windows"], viewport: Size): Point {
  const { width: vw, height: vh } = viewport;
  if (!vw || !vh) return CASCADE_START;

  const obstacles = Object.values(windows)
    .filter((w): w is WindowState => !!w?.isOpen && !w.isMinimized)
    .map((w) =>
      w.isMaximized ? { x: 0, y: 0, width: vw, height: vh } : { ...w.position, ...w.size },
    );

  const { minX, maxX } = horizontalRange(size.width, vw);
  const maxY = Math.max(vh - size.height - MARGIN, MARGIN);
  const center = { x: (minX + maxX) / 2, y: (vh - size.height) / 2 };

  // Positions testées : une grille régulière, plus les bords (sinon on rate les coins).
  const xs = [...steps(minX, maxX), maxX];
  const ys = [...steps(MARGIN, maxY), maxY];

  let best: Point = { x: Math.round(Math.max(minX, Math.min(center.x, maxX))), y: MARGIN };
  let bestScore = Infinity;
  for (const x of xs) {
    for (const y of ys) {
      let overlap = 0;
      for (const o of obstacles) {
        const w = Math.min(x + size.width, o.x + o.width) - Math.max(x, o.x);
        const h = Math.min(y + size.height, o.y + o.height) - Math.max(y, o.y);
        if (w > 0 && h > 0) overlap += w * h;
      }
      // Recouvrement en px² : il prime toujours sur la distance au centre (en px).
      const score = overlap + Math.hypot(x - center.x, y - center.y);
      if (score < bestScore) {
        bestScore = score;
        best = { x, y };
      }
    }
  }
  return best;
}

function* steps(from: number, to: number) {
  for (let v = from; v <= to; v += PLACEMENT_STEP) yield v;
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
            // Nouvelle ouverture : taille mémorisée si elle a déjà été ouverte (ajustée à
            // l'écran), puis placée là où elle recouvre le moins les fenêtres visibles.
            const viewport = currentViewport(state.viewport);
            const fitted = fitWindow(
              {
                id,
                isOpen: true,
                isMinimized: false,
                isMaximized: false,
                zIndex: z,
                size: existing?.size ?? APPS[id].defaultSize,
                position: CASCADE_START,
              },
              viewport,
            );
            const position = findFreeSpot(fitted.size, state.windows, viewport);
            return {
              viewport,
              startMenuOpen: false,
              topZ: z,
              activeId: id,
              windows: { ...state.windows, [id]: { ...fitted, position } },
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

        openStartup: () => {
          // Projets d'abord, Bienvenue ensuite : elle est au premier plan et active.
          get().open("projects");
          get().open("welcome");

          const { windows, viewport, updatePosition } = get();
          const welcome = windows.welcome;
          const projects = windows.projects;
          if (!welcome || !projects) return;

          // Côte à côte, centrées entre les icônes (gauche) et les widgets (droite).
          // Projets peut rétrécir (jusqu'à STARTUP_MIN_PROJECTS_WIDTH) pour tenir ; si les
          // widgets prennent trop de place, on accepte de les recouvrir.
          // Sinon (petit écran), on garde les positions choisies par findFreeSpot.
          const fits = (reserve: number) => {
            const available = viewport.width - ICON_COLUMN_WIDTH - MARGIN - reserve;
            const width = Math.min(projects.size.width, available - welcome.size.width - STARTUP_GAP);
            return width >= STARTUP_MIN_PROJECTS_WIDTH ? { available, width } : null;
          };
          const layout = fits(widgetsReserve(viewport.width)) ?? fits(0);
          if (!layout) return;
          const { available, width: projectsWidth } = layout;
          const total = welcome.size.width + STARTUP_GAP + projectsWidth;
          const x = ICON_COLUMN_WIDTH + Math.round((available - total) / 2);
          const tallest = Math.max(welcome.size.height, projects.size.height);
          const y = Math.max(MARGIN, Math.round((viewport.height - tallest) / 2));
          updatePosition("welcome", { x, y });
          get().updateBounds(
            "projects",
            { x: x + welcome.size.width + STARTUP_GAP, y },
            { width: projectsWidth, height: projects.size.height },
          );
        },

        resetLayout: () => {
          set({ windows: {}, activeId: null, topZ: 10, startMenuOpen: false });
          get().openStartup();
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
      // v2 : fenêtres plus grandes par défaut → on oublie les anciennes tailles/positions mémorisées.
      version: 2,
      migrate: (persisted, version) =>
        version < 2 ? { windows: {}, topZ: 10 } : (persisted as Pick<DesktopState, "windows" | "topZ">),
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
