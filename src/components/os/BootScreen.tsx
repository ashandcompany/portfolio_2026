"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Sparkles } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { skillCategories } from "@/data/skills";
import { useDesktopStore } from "@/stores/desktop-store";
import { BOOT_SEEN_KEY } from "@/stores/settings-store";

const SKILL_COUNT = skillCategories.reduce((sum, c) => sum + c.skills.length, 0);

const LOG_LINES = [
  "Initialisation du noyau cozy…",
  "Chargement des pixels pastel",
  "Montage de C:/Emma/projets",
  `Vérification des compétences : ${SKILL_COUNT} trouvées`,
  "Préparation d'un thé à la fraise",
  "Arrosage des plantes virtuelles",
  "Démarrage de l'interface",
];

const STEP_MS = 340;
const END_DELAY_MS = 450;

/** Événement pour rejouer le démarrage depuis les Paramètres. */
export const REPLAY_BOOT_EVENT = "emma-os:replay-boot";

/**
 * Écran de démarrage façon BIOS cozy. Affiché à la première visite seulement
 * (puis masqué d'office par le script du layout), passable à tout moment.
 */
export function BootScreen() {
  const setBootDone = useDesktopStore((s) => s.setBootDone);
  const reduceMotion = useReducedMotion();
  // "pending" : rendu serveur / avant décision ; "running" : animation ; "done" : retiré.
  const [phase, setPhase] = useState<"pending" | "running" | "done">("pending");
  const [step, setStep] = useState(0);

  const finish = useCallback(() => {
    try {
      localStorage.setItem(BOOT_SEEN_KEY, "1");
    } catch {
      // stockage indisponible : le démarrage sera simplement rejoué
    }
    setPhase("done");
    setBootDone(true);
  }, [setBootDone]);

  // Décision initiale : démarrage déjà vu → on passe directement au bureau.
  useEffect(() => {
    const seen = document.documentElement.hasAttribute("data-booted");
    const timer = setTimeout(() => {
      if (seen) {
        setPhase("done");
        setBootDone(true);
      } else {
        setPhase("running");
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [setBootDone]);

  // Rejouer depuis les Paramètres.
  useEffect(() => {
    const replay = () => {
      document.documentElement.removeAttribute("data-booted");
      setStep(0);
      setPhase("running");
    };
    window.addEventListener(REPLAY_BOOT_EVENT, replay);
    return () => window.removeEventListener(REPLAY_BOOT_EVENT, replay);
  }, []);

  // Déroulé des lignes de log.
  useEffect(() => {
    if (phase !== "running") return;
    if (step >= LOG_LINES.length) {
      const timer = setTimeout(finish, END_DELAY_MS);
      return () => clearTimeout(timer);
    }
    const timer = setTimeout(() => setStep((s) => s + 1), reduceMotion ? 60 : STEP_MS);
    return () => clearTimeout(timer);
  }, [phase, step, finish, reduceMotion]);

  // Passer avec Échap, Entrée ou Espace.
  useEffect(() => {
    if (phase !== "running") return;
    const onKey = (e: KeyboardEvent) => {
      if (["Escape", "Enter", " "].includes(e.key)) {
        e.preventDefault();
        finish();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, finish]);

  const progress = Math.round((Math.min(step, LOG_LINES.length) / LOG_LINES.length) * 100);

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          key="boot"
          id="boot-screen"
          role="status"
          aria-live="polite"
          aria-label="Démarrage d'Emma OS"
          exit={{ opacity: 0, scale: 1.03 }}
          transition={{ duration: reduceMotion ? 0 : 0.45, ease: "easeOut" }}
          onClick={phase === "running" ? finish : undefined}
          className="fixed inset-0 z-[100] flex cursor-pointer items-center justify-center bg-[#1d1530] p-6 text-lavender-100"
        >
          <div className="w-full max-w-md space-y-6">
            <div className="flex items-center gap-3">
              <motion.span
                animate={reduceMotion ? undefined : { rotate: [0, 15, -15, 0], scale: [1, 1.15, 1] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                className="flex"
              >
                <Sparkles className="size-9 text-bubblegum-300" aria-hidden />
              </motion.span>
              <div>
                <p className="font-pixel text-4xl leading-none">Emma OS</p>
                <p className="font-pixel text-xs text-lavender-300">version 2026 · édition cozy</p>
              </div>
            </div>

            <ul className="font-pixel min-h-44 space-y-1 text-sm">
              {LOG_LINES.slice(0, step).map((line) => (
                <li key={line} className="flex gap-2">
                  <span className="text-mint-300">[ OK ]</span>
                  <span className="text-lavender-200">{line}</span>
                </li>
              ))}
              {phase === "running" && step < LOG_LINES.length && (
                <li aria-hidden className="animate-pulse text-lavender-300">▌</li>
              )}
            </ul>

            <div
              className="flex h-5 gap-0.5 rounded-control border-2 border-lavender-400 p-0.5"
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Progression du démarrage"
            >
              {Array.from({ length: 24 }, (_, i) => (
                <span
                  key={i}
                  className={i < (progress / 100) * 24 ? "flex-1 bg-bubblegum-300" : "flex-1 bg-transparent"}
                />
              ))}
            </div>

            <div className="flex items-center justify-between text-xs text-lavender-300">
              <span className="font-pixel">{progress}%</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  finish();
                }}
                className="font-pixel rounded-control border-2 border-lavender-400 px-2 py-0.5 text-lavender-100 hover:bg-lavender-400/20"
              >
                Passer ▸
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
