import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "default" | "primary" | "signature" | "danger" | "ghost";
type Size = "sm" | "md" | "icon";

export interface PixelButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variants: Record<Variant, string> = {
  default:
    "bg-surface text-fg border-control-border shadow-bevel hover:bg-surface-hover active:shadow-bevel-pressed",
  primary:
    "bg-accent text-accent-fg border-control-border shadow-bevel hover:bg-accent-hover active:shadow-bevel-pressed",
  signature:
    "bg-signature text-fg border-control-border shadow-bevel hover:bg-signature-hover active:shadow-bevel-pressed",
  danger:
    "bg-danger text-white border-plum-700 shadow-bevel hover:brightness-110 active:shadow-bevel-pressed",
  ghost: "bg-transparent text-fg border-transparent hover:bg-surface-hover",
};

const sizes: Record<Size, string> = {
  sm: "h-7 px-2.5 text-sm",
  md: "h-9 px-4 text-base",
  icon: "size-6 p-0",
};

/** Bouton rétro adouci : police pixel, relief léger, petit arrondi. */
export function PixelButton({
  variant = "default",
  size = "md",
  className,
  type = "button",
  ...props
}: PixelButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "font-pixel inline-flex select-none items-center justify-center gap-1.5 rounded-control border-2",
        "transition-colors active:translate-y-px disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}
