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
export function Tag({ color = "lavender", className, ...props }: TagProps) {
  return (
    <span
      className={cn(
        "font-pixel inline-flex items-center gap-1 rounded-control border-2 border-control-border px-1.5 py-px text-xs shadow-pixel-sm",
        colors[color],
        className,
      )}
      {...props}
    />
  );
}
