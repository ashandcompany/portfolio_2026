import type { ComponentType } from "react";
import type { AppId } from "@/data/apps";
import { AboutApp } from "./AboutApp";
import { ContactApp } from "./ContactApp";
import { CvApp } from "./CvApp";
import { EducationApp } from "./EducationApp";
import { ExperienceApp } from "./ExperienceApp";
import { ProjectsApp } from "./ProjectsApp";
import { SettingsApp } from "./SettingsApp";
import { SkillsApp } from "./SkillsApp";
import { TrashApp } from "./TrashApp";
import { WelcomeApp } from "./WelcomeApp";

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
  settings: SettingsApp,
  trash: TrashApp,
};
