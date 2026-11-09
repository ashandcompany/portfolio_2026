import {
  BriefcaseBusiness,
  FileText,
  FolderHeart,
  GraduationCap,
  Heart,
  Mail,
  Settings,
  SquareCode,
  Trash2,
  UserRound,
  type LucideIcon,
} from "lucide-react";

/**
 * Registre des applications d'Emma OS (métadonnées uniquement).
 * Le composant de chaque app est associé dans `components/apps/index.tsx`,
 * ce qui évite que le store dépende des composants React.
 * Ajouter une app = une entrée ici + son composant.
 */
export type AppId =
  | "welcome"
  | "about"
  | "projects"
  | "experience"
  | "education"
  | "skills"
  | "cv"
  | "contact"
  | "settings"
  | "trash";

export interface Size {
  width: number;
  height: number;
}

export interface AppMeta {
  id: AppId;
  title: string;
  /** Nom de « fichier » affiché dans la barre de titre (ex. about_me.txt). */
  fileName: string;
  /** Courte description affichée dans le menu démarrer. */
  description: string;
  /** Mots-clés supplémentaires pour la recherche du menu démarrer. */
  keywords: string[];
  icon: LucideIcon;
  /** Classe Tailwind pour colorer l'icône (fill + stroke). */
  iconClassName: string;
  /** Affichée en icône sur le bureau. */
  onDesktop: boolean;
  /** Taille idéale sur un écran de PC ; réduite automatiquement si l'écran est plus petit. */
  defaultSize: Size;
  minSize: Size;
}

export const APPS: Record<AppId, AppMeta> = {
  welcome: {
    id: "welcome",
    title: "Bienvenue",
    fileName: "bienvenue.exe",
    description: "Le point de départ",
    keywords: ["accueil", "welcome", "home"],
    icon: Heart,
    iconClassName: "fill-bubblegum-300 text-plum-700",
    onDesktop: false,
    defaultSize: { width: 500, height: 380 },
    minSize: { width: 300, height: 220 },
  },
  about: {
    id: "about",
    title: "About Me",
    fileName: "about_me.txt",
    description: "Qui je suis",
    keywords: ["à propos", "présentation", "profil", "bio"],
    icon: UserRound,
    iconClassName: "fill-lavender-300 text-plum-700",
    onDesktop: true,
    defaultSize: { width: 720, height: 640 },
    minSize: { width: 320, height: 240 },
  },
  projects: {
    id: "projects",
    title: "Projects",
    fileName: "projets",
    description: "Mes réalisations",
    keywords: ["projets", "réalisations", "portfolio", "github"],
    icon: FolderHeart,
    iconClassName: "fill-folder text-plum-700",
    onDesktop: true,
    defaultSize: { width: 920, height: 660 },
    minSize: { width: 360, height: 260 },
  },
  experience: {
    id: "experience",
    title: "Experience",
    fileName: "experiences",
    description: "Mon parcours pro",
    keywords: ["expériences", "travail", "stage", "alternance", "emploi"],
    icon: BriefcaseBusiness,
    iconClassName: "fill-bubblegum-200 text-plum-700",
    onDesktop: true,
    defaultSize: { width: 760, height: 640 },
    minSize: { width: 340, height: 260 },
  },
  education: {
    id: "education",
    title: "Education",
    fileName: "formation",
    description: "Diplômes et formations",
    keywords: ["formation", "école", "diplôme", "études"],
    icon: GraduationCap,
    iconClassName: "fill-sky-pastel-300 text-plum-700",
    onDesktop: true,
    defaultSize: { width: 760, height: 640 },
    minSize: { width: 340, height: 260 },
  },
  skills: {
    id: "skills",
    title: "Skills",
    fileName: "skills.exe",
    description: "Ma stack technique",
    keywords: ["compétences", "technos", "stack", "langages"],
    icon: SquareCode,
    iconClassName: "fill-mint-300 text-plum-700",
    onDesktop: true,
    defaultSize: { width: 780, height: 620 },
    minSize: { width: 320, height: 260 },
  },
  cv: {
    id: "cv",
    title: "My CV",
    fileName: "cv_emma.pdf",
    description: "Mon CV en PDF",
    keywords: ["cv", "resume", "curriculum", "pdf", "télécharger"],
    icon: FileText,
    iconClassName: "fill-cream text-plum-700",
    onDesktop: true,
    defaultSize: { width: 860, height: 760 },
    minSize: { width: 340, height: 300 },
  },
  contact: {
    id: "contact",
    title: "Contact",
    fileName: "contact.mail",
    description: "M'écrire",
    keywords: ["email", "mail", "linkedin", "contacter", "message"],
    icon: Mail,
    iconClassName: "fill-butter-200 text-plum-700",
    onDesktop: true,
    defaultSize: { width: 620, height: 540 },
    minSize: { width: 320, height: 260 },
  },
  settings: {
    id: "settings",
    title: "Paramètres",
    fileName: "parametres.cpl",
    description: "Thème, fond d'écran, sons",
    keywords: ["settings", "réglages", "thème", "sombre", "dark", "fond d'écran", "wallpaper", "son"],
    icon: Settings,
    iconClassName: "fill-lavender-200 text-plum-700",
    onDesktop: false,
    defaultSize: { width: 560, height: 640 },
    minSize: { width: 320, height: 300 },
  },
  trash: {
    id: "trash",
    title: "Corbeille",
    fileName: "corbeille",
    description: "Ne regarde pas dedans…",
    keywords: ["trash", "poubelle", "bugs"],
    icon: Trash2,
    iconClassName: "fill-lavender-200 text-plum-700",
    onDesktop: true,
    defaultSize: { width: 480, height: 360 },
    minSize: { width: 300, height: 220 },
  },
};

export const APP_LIST: AppMeta[] = Object.values(APPS);
export const DESKTOP_APPS: AppMeta[] = APP_LIST.filter((app) => app.onDesktop);

/** Recherche insensible à la casse et aux accents (titre, fichier, description, mots-clés). */
export function searchApps(query: string): AppMeta[] {
  const normalize = (s: string) =>
    s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
  const q = normalize(query);
  if (!q) return APP_LIST;
  return APP_LIST.filter((app) =>
    [app.title, app.fileName, app.description, ...app.keywords].some((field) =>
      normalize(field).includes(q),
    ),
  );
}
