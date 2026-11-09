"use client";

import { WindowManager } from "@/components/window/WindowManager";
import { APP_LIST } from "@/data/apps";
import { DesktopIcon } from "./DesktopIcon";
import { Taskbar } from "./Taskbar";
import { Wallpaper } from "./Wallpaper";

/** Bureau d'Emma OS : fond, icônes, fenêtres et barre des tâches. */
export function Desktop() {
  return (
    <main className="relative flex h-full flex-col">
      <Wallpaper />

      {/* Zone du bureau (les fenêtres restent dans ce cadre, au-dessus de la barre des tâches) */}
      {/* `isolate` : les z-index des fenêtres restent confinés à cette zone */}
      <div className="relative isolate min-h-0 flex-1">
        <div className="absolute inset-y-0 left-0 flex flex-col flex-wrap content-start gap-2 p-3">
          {APP_LIST.filter((app) => app.id !== "welcome").map((app) => (
            <DesktopIcon key={app.id} app={app} />
          ))}
        </div>
        <WindowManager />
      </div>

      <Taskbar />
    </main>
  );
}
