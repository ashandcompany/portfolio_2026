"use client";

import { useRef } from "react";
import type { AppMeta } from "@/data/apps";
import { cn } from "@/lib/utils";
import { AppIcon } from "@/components/ui/AppIcon";
import { useDesktopStore } from "@/stores/desktop-store";

interface DesktopIconProps {
  app: AppMeta;
  selected: boolean;
  onSelect: () => void;
}

/**
 * Icône du bureau.
 * Souris : clic = sélection, double-clic = ouverture. Tactile : un tap ouvre.
 * Clavier : Tab pour naviguer, Entrée ou Espace pour ouvrir.
 */
export function DesktopIcon({ app, selected, onSelect }: DesktopIconProps) {
  const open = useDesktopStore((s) => s.open);
  const pointerType = useRef<string>("mouse");

  return (
    <button
      type="button"
      data-desktop-icon
      onPointerDown={(e) => {
        pointerType.current = e.pointerType;
        onSelect();
      }}
      onClick={(e) => {
        // e.detail === 0 : activation clavier (Entrée / Espace).
        if (pointerType.current === "touch" || e.detail === 0) open(app.id);
      }}
      onDoubleClick={() => open(app.id)}
      onFocus={onSelect}
      aria-label={`Ouvrir ${app.title}`}
      className="group flex w-20 flex-col items-center gap-1 rounded-control p-1.5 outline-none focus-visible:outline-2 focus-visible:outline-dashed focus-visible:outline-bubblegum-500"
    >
      <span
        className={cn(
          "flex size-12 items-center justify-center rounded-control transition-[transform,background-color] group-hover:-translate-y-0.5",
          selected ? "bg-lavender-300/60" : "group-hover:bg-white/30",
        )}
      >
        <AppIcon
          app={app}
          className="size-10 drop-shadow-[2px_2px_0_rgb(75_53_102/0.25)]"
          strokeWidth={1.5}
        />
      </span>
      <span
        className={cn(
          "font-pixel rounded-sm px-1 py-px text-center text-xs leading-tight",
          // Pastille semi-opaque : lisible quel que soit le fond d'écran choisi.
          selected ? "bg-accent text-accent-fg" : "bg-window/70 text-fg backdrop-blur-[2px]",
        )}
      >
        {app.title}
      </span>
    </button>
  );
}
