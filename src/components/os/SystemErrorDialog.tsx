"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import { PixelButton } from "@/components/ui/PixelButton";
import { TitleBar } from "@/components/ui/TitleBar";
import { useDesktopStore } from "@/stores/desktop-store";

/** Fausse boîte « erreur système » rétro (easter egg). Tous les boutons la ferment. */
export function SystemErrorDialog() {
  const error = useDesktopStore((s) => s.systemError);
  const hide = useDesktopStore((s) => s.hideSystemError);
  const reduceMotion = useReducedMotion();
  const okRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!error) return;
    okRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && hide();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [error, hide]);

  return (
    <AnimatePresence>
      {error && (
        <motion.div
          key="system-error"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-plum-900/20 p-4"
          onPointerDown={(e) => e.target === e.currentTarget && hide()}
        >
          <motion.div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="system-error-title"
            aria-describedby="system-error-message"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={
              reduceMotion
                ? { scale: 1, opacity: 1 }
                : { scale: 1, opacity: 1, x: [0, -8, 8, -6, 6, -3, 0] }
            }
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.45 }}
            className="w-full max-w-sm overflow-hidden rounded-window border-2 border-window-border bg-window text-fg shadow-window"
          >
            <TitleBar
              title={<span id="system-error-title">{error.title}</span>}
              actions={
                <PixelButton size="icon" variant="signature" aria-label="Fermer" onClick={hide}>
                  <X className="size-3.5" />
                </PixelButton>
              }
            />
            <div className="flex items-start gap-3 p-4">
              <span
                aria-hidden
                className="flex size-9 shrink-0 items-center justify-center rounded-full border-2 border-plum-700 bg-danger text-white shadow-pixel-sm"
              >
                <X className="size-5" strokeWidth={3} />
              </span>
              <p id="system-error-message" className="pt-1 text-sm leading-relaxed">
                {error.message}
              </p>
            </div>
            <div className="flex justify-end gap-2 px-4 pb-4">
              <PixelButton size="sm" onClick={hide}>Annuler</PixelButton>
              <PixelButton size="sm" variant="primary" ref={okRef} onClick={hide}>
                OK
              </PixelButton>
              <PixelButton size="sm" onClick={hide}>Ignorer</PixelButton>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
