import { FolderHeart, Heart, UserRound, type LucideIcon } from "lucide-react";

/**
 * Registre des applications d'Emma OS (métadonnées uniquement).
 * Le composant de chaque app est associé dans `components/apps/index.tsx`,
 * ce qui évite que le store dépende des composants React.
 */
export type AppId = "welcome" | "about" | "projects";

export interface Size {
  width: number;
  height: number;
}

export interface AppMeta {
  id: AppId;
  title: string;
  /** Nom de « fichier » affiché dans la barre de titre (ex. about_me.txt). */
  fileName: string;
  icon: LucideIcon;
  /** Classe Tailwind pour colorer l'icône (fill + stroke). */
  iconClassName: string;
  defaultSize: Size;
  minSize: Size;
}

export const APPS: Record<AppId, AppMeta> = {
  welcome: {
    id: "welcome",
    title: "Bienvenue",
    fileName: "bienvenue.exe",
    icon: Heart,
    iconClassName: "fill-bubblegum-300 text-plum-700",
    defaultSize: { width: 440, height: 340 },
    minSize: { width: 300, height: 220 },
  },
  about: {
    id: "about",
    title: "About Me",
    fileName: "about_me.txt",
    icon: UserRound,
    iconClassName: "fill-lavender-200 text-plum-700",
    defaultSize: { width: 520, height: 400 },
    minSize: { width: 320, height: 240 },
  },
  projects: {
    id: "projects",
    title: "Projects",
    fileName: "projets",
    icon: FolderHeart,
    iconClassName: "fill-folder text-plum-700",
    defaultSize: { width: 640, height: 440 },
    minSize: { width: 360, height: 260 },
  },
};

export const APP_LIST: AppMeta[] = Object.values(APPS);
