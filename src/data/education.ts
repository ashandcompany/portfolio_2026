export interface Education {
  id: string;
  school: string;
  degree: string;
  place: string;
  start: string;
  end: string;
  current?: boolean;
  topics: string[];
}

export const education: Education[] = [
  {
    id: "nws",
    school: "Normandie Web School",
    degree: "Mastère « Manager de l'ingénierie numérique »",
    place: "Rouen", // TODO: vérifier la ville du campus
    start: "Septembre 2025",
    end: "Août 2027",
    current: true,
    topics: ["DevOps & cloud", "Data & automatisation", "Gestion de projets numériques", "Architecture des systèmes"],
  },
  {
    id: "iut-rouen",
    school: "IUT de Rouen",
    degree: "BUT Métiers du Multimédia et de l'Internet (MMI)",
    place: "Rouen",
    start: "Septembre 2022",
    end: "Février 2025",
    topics: ["Développement web", "UX/UI design", "Communication digitale", "Audiovisuel"],
  },
];
