"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Rnd } from "react-rnd";
import { APPS, type AppId } from "@/data/apps";
import { cn } from "@/lib/utils";
import { AppIcon } from "@/components/ui/AppIcon";
import { useDesktopStore } from "@/stores/desktop-store";
import { TitleBar } from "@/components/ui/TitleBar";
import { WindowControls } from "./WindowControls";

interface WindowProps {
  id: AppId;
  children: ReactNode;
}

/** Durée de la transition de taille lors d'un agrandissement / restauration. */
const BOUNDS_TRANSITION_MS = 220;

/**
 * Fenêtre d'application : déplaçable et redimensionnable (react-rnd),
 * animée à l'ouverture, la réduction et la fermeture (Motion).
 */
export function Window({ id, children }: WindowProps) {
  const win = useDesktopStore((s) => s.windows[id]);
  const isActive = useDesktopStore((s) => s.activeId === id);
  const focus = useDesktopStore((s) => s.focus);
  const close = useDesktopStore((s) => s.close);
  const minimize = useDesktopStore((s) => s.minimize);
  const toggleMaximize = useDesktopStore((s) => s.toggleMaximize);
  const updatePosition = useDesktopStore((s) => s.updatePosition);
  const updateBounds = useDesktopStore((s) => s.updateBounds);

  const reduceMotion = useReducedMotion();
  // Transition CSS de taille/position active uniquement pendant agrandir/restaurer
  // (sinon elle ralentirait le déplacement à la souris).
  const [animateBounds, setAnimateBounds] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  if (!win) return null;

  const app = APPS[id];
  const { isMaximized, isMinimized } = win;

  const handleToggleMaximize = () => {
    if (!reduceMotion) {
      setAnimateBounds(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setAnimateBounds(false), BOUNDS_TRANSITION_MS);
    }
    toggleMaximize(id);
  };

  return (
    <Rnd
      className={cn(
        "pointer-events-auto",
        animateBounds && "transition-[transform,width,height] duration-200 ease-out",
      )}
      style={{ zIndex: win.zIndex }}
      position={isMaximized ? { x: 0, y: 0 } : win.position}
      size={isMaximized ? { width: "100%", height: "100%" } : win.size}
      minWidth={app.minSize.width}
      minHeight={app.minSize.height}
      bounds="parent"
      dragHandleClassName="window-drag-handle"
      cancel=".window-no-drag"
      disableDragging={isMaximized || isMinimized}
      enableResizing={!isMaximized && !isMinimized}
      onMouseDown={() => focus(id)}
      onDragStop={(_, d) => updatePosition(id, { x: d.x, y: d.y })}
      onResizeStop={(_, __, ref, ___, position) =>
        updateBounds(id, position, { width: ref.offsetWidth, height: ref.offsetHeight })
      }
    >
      <motion.section
        role="dialog"
        aria-label={app.title}
        aria-hidden={isMinimized || undefined}
        inert={isMinimized}
        onFocusCapture={() => focus(id)}
        initial={{ opacity: 0, scale: 0.9, y: 16 }}
        animate={
          isMinimized
            ? { opacity: 0, scale: 0.5, y: 320 }
            : { opacity: 1, scale: 1, y: 0 }
        }
        exit={{ opacity: 0, scale: 0.9, y: 16 }}
        transition={
          reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 460, damping: 34, mass: 0.8 }
        }
        style={{ transformOrigin: "50% 100%" }}
        className={cn(
          "relative flex h-full flex-col overflow-hidden border-2 border-window-border bg-window text-fg",
          isMaximized ? "rounded-none" : "rounded-window",
          isActive ? "shadow-window" : "shadow-pixel",
          isMinimized && "pointer-events-none",
        )}
      >
        <TitleBar
          className={cn("window-drag-handle", !isMaximized && "cursor-grab active:cursor-grabbing")}
          title={app.fileName}
          icon={<AppIcon app={app} className="size-4" />}
          active={isActive}
          onDoubleClick={handleToggleMaximize}
          actions={
            <WindowControls
              title={app.title}
              isMaximized={isMaximized}
              onMinimize={() => minimize(id)}
              onToggleMaximize={handleToggleMaximize}
              onClose={() => close(id)}
            />
          }
        />

        <div className="min-h-0 flex-1 overflow-auto">{children}</div>

        {/* Poignée de redimensionnement décorative (coin bas-droit) */}
        {!isMaximized && (
          <span
            aria-hidden
            className="pointer-events-none absolute right-0.5 bottom-0.5 size-3 opacity-60 [background-image:radial-gradient(var(--color-plum-400)_1px,transparent_1.5px)] [background-size:4px_4px] [clip-path:polygon(100%_0,100%_100%,0_100%)]"
          />
        )}
      </motion.section>
    </Rnd>
  );
}
