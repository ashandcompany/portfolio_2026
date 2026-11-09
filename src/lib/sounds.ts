import { useSettingsStore } from "@/stores/settings-store";

/**
 * Sons d'interface façon chiptune, synthétisés avec Web Audio : aucun fichier à charger.
 * Ne joue rien tant que les sons sont coupés dans les Paramètres (réglage par défaut).
 * Le navigateur n'autorise l'audio qu'après une interaction (clic, touche) : avant ça,
 * les sons sont simplement ignorés.
 */
export type SoundName = "open" | "close" | "minimize" | "maximize" | "click" | "error" | "boot" | "enable";

interface Note {
  /** Fréquence de départ (Hz). */
  freq: number;
  /** Fréquence d'arrivée, pour un glissando. */
  to?: number;
  /** Début, en secondes après le déclenchement. */
  at?: number;
  /** Durée en secondes. */
  dur: number;
  type?: OscillatorType;
  /** Volume relatif (0–1). */
  gain?: number;
}

const SOUNDS: Record<SoundName, Note[]> = {
  open: [
    { freq: 523, dur: 0.06 },
    { freq: 784, at: 0.06, dur: 0.09 },
  ],
  close: [
    { freq: 784, dur: 0.06 },
    { freq: 523, at: 0.06, dur: 0.09 },
  ],
  minimize: [{ freq: 660, to: 330, dur: 0.12, type: "triangle" }],
  maximize: [{ freq: 330, to: 660, dur: 0.12, type: "triangle" }],
  click: [{ freq: 1200, dur: 0.03, gain: 0.6 }],
  error: [
    { freq: 196, dur: 0.12, type: "sawtooth", gain: 0.7 },
    { freq: 185, at: 0.15, dur: 0.18, type: "sawtooth", gain: 0.7 },
  ],
  boot: [
    { freq: 523, dur: 0.1, type: "triangle" },
    { freq: 659, at: 0.1, dur: 0.1, type: "triangle" },
    { freq: 784, at: 0.2, dur: 0.1, type: "triangle" },
    { freq: 1047, at: 0.3, dur: 0.3, type: "triangle" },
  ],
  enable: [
    { freq: 659, dur: 0.07, type: "triangle" },
    { freq: 988, at: 0.07, dur: 0.14, type: "triangle" },
  ],
};

/** Volume général, volontairement discret. */
const MASTER_GAIN = 0.06;

let context: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === "undefined" || !("AudioContext" in window)) return null;
  context ??= new AudioContext();
  return context;
}

/** Joue un son d'interface si les sons sont activés. `force` ignore le réglage (aperçu). */
export function playSound(name: SoundName, { force = false }: { force?: boolean } = {}) {
  if (!force && !useSettingsStore.getState().soundEnabled) return;
  // Pas encore d'interaction : le navigateur bloquerait l'audio (et le signalerait en console).
  if (typeof navigator !== "undefined" && navigator.userActivation?.hasBeenActive === false) return;
  const ctx = getContext();
  if (!ctx) return;
  // Sans interaction préalable, resume() échoue : on ignore silencieusement.
  if (ctx.state === "suspended") ctx.resume().catch(() => {});

  const now = ctx.currentTime;
  for (const note of SOUNDS[name]) {
    const start = now + (note.at ?? 0);
    const end = start + note.dur;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = note.type ?? "square";
    osc.frequency.setValueAtTime(note.freq, start);
    if (note.to) osc.frequency.exponentialRampToValueAtTime(note.to, end);

    // Petite enveloppe pour éviter les « clics » au début et à la fin.
    const peak = MASTER_GAIN * (note.gain ?? 1);
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(peak, start + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, end);

    osc.connect(gain).connect(ctx.destination);
    osc.start(start);
    osc.stop(end + 0.02);
  }
}
