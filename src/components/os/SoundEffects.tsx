"use client";

import { useEffect } from "react";
import type { AppId } from "@/data/apps";
import { playSound, type SoundName } from "@/lib/sounds";
import { useDesktopStore } from "@/stores/desktop-store";

/**
 * Écoute le bureau et joue le son correspondant à chaque action
 * (ouverture, fermeture, réduction de fenêtre, menu démarrer, erreur, démarrage).
 * Un seul son par changement d'état, pour éviter la cacophonie (ex. « Réinitialiser les fenêtres »).
 */
export function SoundEffects() {
  useEffect(
    () =>
      useDesktopStore.subscribe((state, prev) => {
        if (state.bootDone && !prev.bootDone) return playSound("boot");
        // Avant la fin du démarrage, les changements viennent de la restauration de la session.
        if (!prev.bootDone) return;

        const sound = pickSound(state, prev);
        if (sound) playSound(sound);
      }),
    [],
  );

  return null;
}

type DesktopState = ReturnType<typeof useDesktopStore.getState>;

function pickSound(state: DesktopState, prev: DesktopState): SoundName | null {
  if (state.systemError && !prev.systemError) return "error";

  let opened = false;
  let closed = false;
  let minimized = false;
  let maximizeChanged = false;
  const ids = new Set([...Object.keys(state.windows), ...Object.keys(prev.windows)] as AppId[]);
  for (const id of ids) {
    const win = state.windows[id];
    const before = prev.windows[id];
    // Une fenêtre absente (disposition réinitialisée) compte comme fermée.
    if (win?.isOpen && !before?.isOpen) opened = true;
    else if (!win?.isOpen && before?.isOpen) closed = true;
    else if (win && before) {
      if (win.isMinimized && !before.isMinimized) minimized = true;
      else if (!win.isMinimized && before.isMinimized) opened = true; // restaurée
      if (win.isMaximized !== before.isMaximized) maximizeChanged = true;
    }
  }

  if (opened) return "open";
  if (closed) return "close";
  if (minimized) return "minimize";
  if (maximizeChanged) return "maximize";
  if (state.startMenuOpen !== prev.startMenuOpen) return "click";
  return null;
}
