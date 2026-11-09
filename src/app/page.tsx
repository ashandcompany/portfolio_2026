import { Folder, Heart, Minus, Sparkles, Square, Volume2, X } from "lucide-react";
import { Wallpaper } from "@/components/os/Wallpaper";
import { PixelButton } from "@/components/ui/PixelButton";
import { PixelPanel } from "@/components/ui/PixelPanel";
import { Tag } from "@/components/ui/Tag";

/**
 * Lot 1 — page de démonstration du design system.
 * Sera remplacée par le bureau (Desktop + WindowManager + Taskbar) au lot 3.
 */
export default function Home() {
  return (
    <main className="relative flex h-full flex-col">
      <Wallpaper />

      <div className="relative flex flex-1 items-center justify-center gap-6 p-4">
        {/* Fenêtre inactive en arrière-plan */}
        <PixelPanel
          className="absolute hidden w-64 -translate-x-56 -translate-y-24 md:flex"
          title="projets"
          icon={<Folder className="size-4 fill-folder text-plum-700" />}
          active={false}
        >
          <div className="flex gap-4">
            {["Web", "API", "Fun"].map((name) => (
              <div key={name} className="flex flex-col items-center gap-1">
                <Folder className="size-10 fill-folder text-plum-700" strokeWidth={1.5} />
                <span className="font-pixel text-xs text-fg-muted">{name}</span>
              </div>
            ))}
          </div>
        </PixelPanel>

        {/* Fenêtre active */}
        <PixelPanel
          className="relative w-full max-w-md animate-float"
          title="bienvenue.exe"
          icon={<Heart className="size-4 fill-bubblegum-400 text-plum-700" />}
          actions={
            <>
              <PixelButton size="icon" aria-label="Réduire">
                <Minus className="size-3.5" />
              </PixelButton>
              <PixelButton size="icon" aria-label="Agrandir">
                <Square className="size-3" />
              </PixelButton>
              <PixelButton size="icon" variant="signature" aria-label="Fermer">
                <X className="size-3.5" />
              </PixelButton>
            </>
          }
          bodyClassName="space-y-4"
        >
          <h1 className="font-pixel flex items-center gap-2 text-3xl">
            Emma OS
            <Sparkles className="size-6 text-bubblegum-500" aria-hidden />
          </h1>
          <p className="leading-relaxed text-fg-muted">
            Bonjour ! Je suis Emma, développeuse Fullstack. Mon bureau est en cours
            d&apos;installation… reviens bientôt pour explorer mes projets ✨
          </p>

          <div className="flex flex-wrap gap-2">
            <Tag color="lavender">Next.js</Tag>
            <Tag color="bubblegum">React</Tag>
            <Tag color="sky">TypeScript</Tag>
            <Tag color="mint">Node.js</Tag>
            <Tag color="butter">Tailwind</Tag>
          </div>

          <div className="flex flex-wrap gap-2">
            <Tag color="success">succès</Tag>
            <Tag color="warning">attention</Tag>
            <Tag color="danger">erreur</Tag>
            <Tag color="info">info</Tag>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <PixelButton>Annuler</PixelButton>
            <PixelButton variant="primary">Démarrer</PixelButton>
          </div>
        </PixelPanel>
      </div>

      {/* Aperçu de la barre des tâches (version complète au lot 3) */}
      <footer className="relative flex h-11 shrink-0 items-center gap-2 bg-taskbar px-2 text-taskbar-fg">
        <button
          type="button"
          className="font-pixel flex h-8 items-center gap-1.5 rounded-control bg-signature px-3 text-fg shadow-bevel hover:bg-signature-hover"
        >
          <Sparkles className="size-4" aria-hidden />
          Start
        </button>
        <span className="font-pixel flex h-8 items-center gap-1.5 rounded-control bg-taskbar-hover px-3 text-sm">
          <Heart className="size-3.5 fill-bubblegum-300 text-bubblegum-300" aria-hidden />
          bienvenue.exe
        </span>
        <div className="font-pixel ml-auto flex items-center gap-3 px-2 text-sm">
          <Volume2 className="size-4" aria-label="Son" />
          <span>13:49</span>
        </div>
      </footer>
    </main>
  );
}
