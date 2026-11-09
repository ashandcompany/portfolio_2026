import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Color =
  | "lavender"
  | "bubblegum"
  | "sky"
  | "mint"
  | "butter"
  | "success"
  | "warning"
  | "danger"
  | "info";

export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  color?: Color;
  /**
   * « solid » (défaut) : étiquette pixel en relief, pour un statut qui doit se voir (en cours, à compléter…).
   * « soft » : pastille discrète, pour les listes (technos, sujets) qui ne doivent pas concurrencer les titres.
   */
  tone?: "solid" | "soft";
}

const colors: Record<Color, string> = {
  lavender: "bg-lavender-200 text-on-pastel",
  bubblegum: "bg-bubblegum-200 text-on-pastel",
  sky: "bg-sky-pastel-200 text-on-pastel",
  mint: "bg-mint-200 text-on-pastel",
  butter: "bg-butter-200 text-on-pastel",
  success: "bg-success text-on-pastel",
  warning: "bg-warning text-on-pastel",
  danger: "bg-danger text-white",
  info: "bg-info text-on-pastel",
};

/** Petite étiquette pixel (technos d'un projet, statut…). */
export function Tag({ color = "lavender", tone = "solid", className, ...props }: TagProps) {
  return (
    <span
      className={cn(
        tone === "solid"
          ? "font-pixel inline-flex items-center gap-1 rounded-control border-2 border-control-border px-1.5 py-px text-xs shadow-pixel-sm"
          : "inline-flex items-center gap-1 rounded-control px-1.5 py-0.5 text-xs font-semibold",
        colors[color],
        className,
      )}
      {...props}
    />
  );
}
