export type SkillColor = "lavender" | "bubblegum" | "sky" | "mint" | "butter";

export interface Skill {
  name: string;
  /** Précision entre parenthèses (frameworks, usage…). */
  detail?: string;
}

export interface SkillCategory {
  id: string;
  title: string;
  color: SkillColor;
  skills: Skill[];
}

export const skillCategories: SkillCategory[] = [
  {
    id: "dev",
    title: "Développement",
    color: "lavender",
    skills: [
      { name: "JavaScript / TypeScript", detail: "React, Next.js" },
      { name: "PHP", detail: "CodeIgniter" },
      { name: "HTML / CSS", detail: "Bootstrap, Tailwind" },
      { name: "API REST" },
    ],
  },
  {
    id: "data",
    title: "Data & bases de données",
    color: "sky",
    skills: [{ name: "MySQL" }, { name: "Modélisation et gestion de données" }],
  },
  {
    id: "devops",
    title: "DevOps & outils",
    color: "mint",
    skills: [
      { name: "Docker" },
      { name: "Git / GitHub" },
      { name: "Python", detail: "scripts, automatisation" },
    ],
  },
  {
    id: "automation",
    title: "Automatisation & outils métiers",
    color: "butter",
    skills: [
      { name: "Automatisation et outils métiers" },
      { name: "Automatisation des processus", detail: "notions" },
    ],
  },
  {
    id: "design",
    title: "UX/UI & création",
    color: "bubblegum",
    skills: [{ name: "Figma", detail: "wireframes, maquettes" }, { name: "Suite Adobe" }],
  },
];
