export interface Experience {
  id: string;
  role: string;
  company: string;
  place: string;
  contract: string;
  start: string;
  end: string;
  /** Points clés ; **gras** autorisé. */
  highlights: string[];
  stack: string[];
}

export const experiences: Experience[] = [
  {
    id: "renault",
    role: "Pilote de mission digitale / Full Stack",
    company: "Renault Group",
    place: "Usine de Cléon",
    contract: "Alternance",
    start: "Septembre 2024",
    end: "Novembre 2026",
    highlights: [
      "**Développement** et **maintenance** d'applications internes",
      "Participation à la **digitalisation** des processus",
      "**Mise en place de solutions techniques** (API, bases de données, interfaces)",
      "Utilisation de **Docker** pour la conteneurisation",
      "**Analyse des besoins** avec les équipes métiers",
      "**Amélioration continue** des outils existants",
    ],
    stack: ["API REST", "Bases de données", "Docker", "Applications internes"],
  },
];
