import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type ThemeChoice = "light" | "dark" | "system";
export type WallpaperChoice = "auto" | "pastel" | "night" | "sunset";

/** Clé localStorage des réglages — lue aussi par le script anti-flash du layout. */
export const SETTINGS_STORAGE_KEY = "emma-os:settings";
/** Présente quand l'écran de démarrage a déjà été vu (lue aussi par le layout). */
export const BOOT_SEEN_KEY = "emma-os:boot-seen";

interface SettingsState {
  theme: ThemeChoice;
  wallpaper: WallpaperChoice;
  /** Sons d'interface (branchés au lot 6). Coupés par défaut. */
  soundEnabled: boolean;
  setTheme: (theme: ThemeChoice) => void;
  setWallpaper: (wallpaper: WallpaperChoice) => void;
  toggleSound: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: "light",
      wallpaper: "auto",
      soundEnabled: false,
      setTheme: (theme) => set({ theme }),
      setWallpaper: (wallpaper) => set({ wallpaper }),
      toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),
    }),
    {
      name: SETTINGS_STORAGE_KEY,
      version: 1,
      storage: createJSONStorage(() => window.localStorage),
      skipHydration: true,
      partialize: (s) => ({ theme: s.theme, wallpaper: s.wallpaper, soundEnabled: s.soundEnabled }),
    },
  ),
);

/** Thème réellement affiché (résout « system » avec la préférence de l'OS). */
export function resolveTheme(theme: ThemeChoice): "light" | "dark" {
  if (theme !== "system") return theme;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
