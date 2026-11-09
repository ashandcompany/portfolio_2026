import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Fusionne des classes Tailwind en résolvant les conflits. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Vrai si la valeur est absente ou encore un placeholder « TODO » (lien masqué dans l'UI). */
export function isPlaceholder(value?: string | null): value is undefined | null {
  return !value || value.includes("TODO");
}
