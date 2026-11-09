/**
 * Informations personnelles affichées dans About Me, Contact, CV et le menu démarrer.
 * Les valeurs marquées TODO sont des placeholders à remplacer.
 * Dans les textes, **gras** est rendu en gras (voir components/ui/RichText).
 */
export const profile = {
  firstName: "Emma",
  lastName: "Roizot",
  fullName: "Emma Roizot",
  initials: "ER",
  /** Rôle court (menu démarrer, en-têtes). */
  role: "Développeuse Fullstack",
  /** Titre long (CV). */
  headline: "Développeuse web fullstack",
  photo: "/profile_picture.jpg",
  location: "Rouen",
  status: "En alternance chez Renault Group",
  availability: "À la recherche d'un poste de développeuse web",
  bio: [
    "Étudiante en Mastère \"Manager de l'ingénierie numérique\" à la **Normandie Web School** et actuellement en **alternance chez Renault Group** comme pilote de mission digitale / full stack.",
    "Je recherche aujourd'hui un **poste de développeuse web** pour mettre mes compétences fullstack au service de projets concrets, et continuer à progresser en **ingénierie logicielle**.",
  ],
  email: "emma.roizot@orange.fr",
  /** Non affiché publiquement par défaut (voir ContactApp). */
  phone: "+33 7 83 10 62 30",
  showPhone: false,
  links: {
    linkedin: "https://www.linkedin.com/in/emma-roizot/",
    github: "https://github.com/ashandcompany",
  },
  /** Chemin du CV PDF dans /public (le bouton se désactive si le fichier est absent). */
  cvPdf: "/cv-emma-roizot.pdf", // TODO: déposer le PDF dans public/
  certifications: [{ name: "OPQUAST Expert", detail: "Qualité et bonnes pratiques du web" }],
  languages: [
    { name: "Français", level: "Langue maternelle" },
    { name: "Anglais", level: "C1 (avancé)" },
    { name: "Espagnol", level: "A2" },
  ],
  interests: ["Illustration", "Lecture", "Jeux vidéo"],
} as const;
