import type { ComponentType } from "react";
import type { AppId } from "@/data/apps";
import { AboutApp } from "./AboutApp";
import { ContactApp } from "./ContactApp";
import { CvApp } from "./CvApp";
import { EducationApp } from "./EducationApp";
import { ExperienceApp } from "./ExperienceApp";
import { PlaceholderApp } from "./PlaceholderApp";
import { ProjectsApp } from "./ProjectsApp";
import { SkillsApp } from "./SkillsApp";
import { WelcomeApp } from "./WelcomeApp";

function TrashApp() {
  return <PlaceholderApp title="Corbeille" />; // easter egg au lot 5
}

/** Association app → composant affiché dans sa fenêtre. */
export const APP_COMPONENTS: Record<AppId, ComponentType> = {
  welcome: WelcomeApp,
  about: AboutApp,
  projects: ProjectsApp,
  experience: ExperienceApp,
  education: EducationApp,
  skills: SkillsApp,
  cv: CvApp,
  contact: ContactApp,
  trash: TrashApp,
};
