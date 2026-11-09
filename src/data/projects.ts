import type { SkillColor } from "./skills";

export interface Project {
  id: string;
  title: string;
  /** Une phrase pour la vignette. */
  summary: string;
  /** Description détaillée ; **gras** autorisé. */
  description: string[];
  stack: string[];
  year: string;
  context: string;
  color: SkillColor;
  /** Capture d'écran dans /public (ex. "/projects/emma-os.png"). */
  image?: string;
  links?: { github?: string; demo?: string };
  /** Projet d'exemple à remplacer : affiche un badge « à compléter ». */
  placeholder?: boolean;
}

export const projects: Project[] = [
  {
    id: "emma-os",
    title: "Emma OS",
    summary: "Ce portfolio : un bureau d'ordinateur pastel et interactif.",
    description: [
      "Portfolio pensé comme un **système d'exploitation fictif** : fenêtres déplaçables et redimensionnables, barre des tâches, menu démarrer avec recherche, notifications.",
      "État du bureau géré avec **Zustand** (z-index, réduction, agrandissement) et **sauvegardé** dans le navigateur ; animations avec **Motion**.",
    ],
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Motion", "Zustand"],
    year: "2026",
    context: "Projet personnel",
    color: "lavender",
    links: { github: "https://github.com/TODO" }, // TODO: lien du dépôt
  },
  {
    id: "projet-2",
    title: "Projet à venir",
    summary: "TODO — résumé du projet en une phrase.",
    description: [
      "TODO — contexte du projet, problème résolu et ton rôle.",
      "TODO — résultat ou fonctionnalité dont tu es fière.",
    ],
    stack: ["TODO"],
    year: "TODO",
    context: "TODO (projet d'école, alternance, perso…)",
    color: "bubblegum",
    placeholder: true,
  },
  {
    id: "projet-3",
    title: "Projet à venir",
    summary: "TODO — résumé du projet en une phrase.",
    description: ["TODO — description du projet."],
    stack: ["TODO"],
    year: "TODO",
    context: "TODO",
    color: "sky",
    placeholder: true,
  },
];
