import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "default" | "primary" | "signature" | "danger" | "ghost";
type Size = "sm" | "md" | "icon";

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

interface StyleProps {
  variant?: Variant;
  size?: Size;
}

/** Classes du bouton rétro adouci (réutilisables sur un lien). */
export function pixelButtonClasses({ variant = "default", size = "md" }: StyleProps = {}) {
  return cn(
    "font-pixel inline-flex select-none items-center justify-center gap-1.5 rounded-control border-2 whitespace-nowrap",
    "transition-colors active:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50",
    variants[variant],
    sizes[size],
  );
}

export interface PixelButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, StyleProps {}

/** Bouton rétro adouci : police pixel, relief léger, petit arrondi. */
export function PixelButton({ variant, size, className, type = "button", ...props }: PixelButtonProps) {
  return <button type={type} className={cn(pixelButtonClasses({ variant, size }), className)} {...props} />;
}

export interface PixelLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement>, StyleProps {}

/** Lien avec l'apparence d'un PixelButton. Les liens externes s'ouvrent dans un nouvel onglet. */
export function PixelLink({ variant, size, className, href, ...props }: PixelLinkProps) {
  const external = href?.startsWith("http");
  return (
    <a
      href={href}
      className={cn(pixelButtonClasses({ variant, size }), className)}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...props}
    />
  );
}
