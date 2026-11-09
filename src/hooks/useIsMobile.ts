"use client";

import { useSyncExternalStore } from "react";

/** En dessous de cette largeur, le bureau devient un « écran de téléphone » (= breakpoint md de Tailwind). */
const MOBILE_QUERY = "(max-width: 767.98px)";

function subscribe(callback: () => void) {
  const media = window.matchMedia(MOBILE_QUERY);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}

/**
 * Vrai sur petit écran, faux sinon, et `null` côté serveur / avant l'hydratation
 * (la page est pré-rendue : on ne connaît pas encore la taille de l'écran).
 */
export function useIsMobile(): boolean | null {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(MOBILE_QUERY).matches,
    () => null,
  );
}
