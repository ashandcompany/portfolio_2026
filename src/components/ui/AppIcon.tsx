import type { AppMeta } from "@/data/apps";
import { cn } from "@/lib/utils";

interface AppIconProps {
  app: AppMeta;
  /** Classes de taille (ex. "size-10"). */
  className?: string;
  strokeWidth?: number;
}

/**
 * Icône d'app bicolore : un calque rempli (sans contour) sous un calque de contours.
 * Nécessaire car certaines icônes Lucide dessinent la forme englobante en dernier
 * (ex. Mail, SquareCode) : remplie, elle masquerait les traits intérieurs.
 */
export function AppIcon({ app, className, strokeWidth = 2 }: AppIconProps) {
  const Icon = app.icon;
  return (
    <span aria-hidden className={cn("relative inline-flex shrink-0", className)}>
      <Icon className={cn("size-full", app.iconClassName)} stroke="none" />
      <Icon
        className={cn("absolute inset-0 size-full", app.iconClassName, "fill-none")}
        strokeWidth={strokeWidth}
      />
    </span>
  );
}
