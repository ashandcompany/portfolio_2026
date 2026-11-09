import type { ComponentType } from "react";
import type { AppId } from "@/data/apps";
import { PlaceholderApp } from "./PlaceholderApp";
import { WelcomeApp } from "./WelcomeApp";

/** Association app → composant affiché dans sa fenêtre. */
export const APP_COMPONENTS: Record<AppId, ComponentType> = {
  welcome: WelcomeApp,
  about: () => <PlaceholderApp title="About Me" />,
  projects: () => <PlaceholderApp title="Projects" />,
};
