import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface SettingsState {
  /** Sons d'interface (branchés au lot 6). Coupés par défaut. */
  soundEnabled: boolean;
  toggleSound: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      soundEnabled: false,
      toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),
    }),
    {
      name: "emma-os:settings",
      version: 1,
      storage: createJSONStorage(() => window.localStorage),
      skipHydration: true,
      partialize: (s) => ({ soundEnabled: s.soundEnabled }),
    },
  ),
);
