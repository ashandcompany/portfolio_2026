"use client";

import { useEffect } from "react";
import { resolveTheme, useSettingsStore } from "@/stores/settings-store";

/**
 * Restaure les réglages sauvegardés et reflète thème + fond d'écran sur <html>
 * (data-theme / data-wallpaper), là où le CSS les lit.
 * Le script du layout pose déjà ces attributs avant l'affichage : on ne les
 * réécrit qu'après la réhydratation, pour éviter tout flash de thème.
 */
export function ThemeSync() {
  useEffect(() => {
    const store = useSettingsStore;
    const root = document.documentElement;
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const apply = () => {
      const { theme, wallpaper } = store.getState();
      root.dataset.theme = resolveTheme(theme);
      root.dataset.wallpaper = wallpaper;
    };

    store.persist.rehydrate();
    apply();
    const unsubscribe = store.subscribe(apply);
    media.addEventListener("change", apply); // suit l'OS quand le thème est « system »
    return () => {
      unsubscribe();
      media.removeEventListener("change", apply);
    };
  }, []);

  return null;
}
