import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Hiérarchie typographique commune à toutes les apps (du plus au moins important) :
 *   1. Titre de page  — police pixel, 2xl
 *   2. Titre d'item   — police pixel, lg
 *   3. Texte courant  — police du corps, sm, couleur atténuée (le **gras** ressort en couleur pleine)
 *   4. Sur-titre      — petites capitales espacées (dates, contexte, catégorie)
 * La police pixel est réservée aux titres et aux boutons : elle signale « ceci est un titre ».
 */

/** Sur-titre : petite ligne de contexte au-dessus d'un titre (dates, type, catégorie). */
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn("text-xs font-bold tracking-wider text-fg-muted uppercase", className)}>{children}</p>
  );
}

interface PageHeaderProps {
  title: ReactNode;
  eyebrow?: ReactNode;
  /** Une phrase qui dit ce qu'on trouve sur la page. */
  lead?: ReactNode;
  className?: string;
}

/** En-tête d'une app : sur-titre, titre principal, phrase d'introduction. */
export function PageHeader({ title, eyebrow, lead, className }: PageHeaderProps) {
  return (
    <header className={cn("space-y-1", className)}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="font-pixel text-2xl leading-tight">{title}</h2>
      {lead && <p className="text-sm text-fg-muted">{lead}</p>}
    </header>
  );
}
