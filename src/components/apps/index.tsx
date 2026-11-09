import type { ComponentType } from "react";
import type { AppId } from "@/data/apps";
import { PlaceholderApp } from "./PlaceholderApp";
import { WelcomeApp } from "./WelcomeApp";

const placeholder = (title: string) => {
  const Placeholder = () => <PlaceholderApp title={title} />;
  Placeholder.displayName = `Placeholder(${title})`;
  return Placeholder;
};

/** Association app → composant affiché dans sa fenêtre (vraies apps au lot 4). */
export const APP_COMPONENTS: Record<AppId, ComponentType> = {
  welcome: WelcomeApp,
  about: placeholder("About Me"),
  projects: placeholder("Projects"),
  experience: placeholder("Experience"),
  education: placeholder("Education"),
  skills: placeholder("Skills"),
  cv: placeholder("My CV"),
  contact: placeholder("Contact"),
  trash: placeholder("Corbeille"),
};
