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
    id: "heros-sos",
    title: "Heros-SOS",
    summary: "Plateforme qui met en relation citoyens et super-héros pour signaler et gérer les incidents causés par des super-vilains.",
    description: [
      "Application web à **trois rôles** : les citoyens signalent des incidents (même **hors ligne**, synchronisés au retour du réseau), les héros les prennent en charge, collaborent et votent leur issue, et les modérateurs valident les héros et gèrent un **back-office** complet.",
      "Côté front, **Next.js 16** et **React 19** avec carte interactive **Leaflet** et mises à jour en temps réel (**SSE**). Côté back, une **API REST en Go** conçue à partir d'un contrat **OpenAPI**, avec **PostgreSQL**, **RabbitMQ** pour l'envoi de mails et **Caddy** en reverse proxy, le tout orchestré avec **Docker Compose**.",
      "Sécurité soignée : **double authentification TOTP**, hachage argon2id, protection CSRF, limitation de débit et chiffrement des données personnelles. Le projet est testé avec **Vitest** et **Playwright**, et intégré en continu avec **GitHub Actions**.",
    ],
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Go", "PostgreSQL", "RabbitMQ", "Docker", "Leaflet", "Playwright"],
    year: "2026",
    context: "Projet d'équipe", // TODO: préciser (projet d'école ? ) et ton rôle dans l'équipe
    color: "bubblegum",
    links: { github: "https://github.com/ashandcompany/heros-sos" },
  },
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
