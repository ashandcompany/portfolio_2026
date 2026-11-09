"use client";

import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useSyncExternalStore } from "react";

/** Horloge partagée : un seul intervalle, notifié à chaque changement de minute. */
const listeners = new Set<() => void>();
let timer: ReturnType<typeof setTimeout> | undefined;
let now = 0;

function tick() {
  now = Date.now();
  listeners.forEach((l) => l());
  // Prochain déclenchement aligné sur le début de la minute suivante.
  timer = setTimeout(tick, 60_000 - (now % 60_000) + 50);
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (listeners.size === 1) tick();
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) clearTimeout(timer);
  };
}

const getSnapshot = () => now;
// Pas d'heure côté serveur : évite un écart d'hydratation.
const getServerSnapshot = () => 0;

export function Clock() {
  const timestamp = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  if (!timestamp) return <span className="w-12" aria-hidden />;

  const date = new Date(timestamp);
  return (
    <time
      dateTime={date.toISOString()}
      title={format(date, "EEEE d MMMM yyyy", { locale: fr })}
      className="font-pixel flex flex-col items-end leading-none"
    >
      <span className="text-sm">{format(date, "HH:mm")}</span>
      <span className="hidden text-[10px] opacity-75 sm:block">
        {format(date, "EEE d MMM", { locale: fr })}
      </span>
    </time>
  );
}
