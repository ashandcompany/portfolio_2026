"use client";

import { Sparkles } from "lucide-react";
import { profile } from "@/data/profile";
import { PixelButton } from "@/components/ui/PixelButton";
import { Tag } from "@/components/ui/Tag";
import { useDesktopStore } from "@/stores/desktop-store";

export function WelcomeApp() {
  const open = useDesktopStore((s) => s.open);

  return (
    <div className="space-y-4 p-5">
      <h1 className="font-pixel flex items-center gap-2 text-3xl">
        Emma OS
        <Sparkles className="size-6 text-bubblegum-500" aria-hidden />
      </h1>
      <p className="leading-relaxed text-fg-muted">
        Bonjour ! Je suis <strong className="text-fg">{profile.firstName}</strong>,{" "}
        {profile.role.toLowerCase()} en alternance chez Ampère (Renault). Bienvenue sur mon bureau :
        double-clique sur les icônes pour découvrir mon parcours ✨
      </p>
      <div className="flex flex-wrap gap-2">
        <Tag color="lavender">React / Next.js</Tag>
        <Tag color="bubblegum">TypeScript</Tag>
        <Tag color="sky">PHP</Tag>
        <Tag color="mint">Docker</Tag>
        <Tag color="butter">MySQL</Tag>
      </div>
      <div className="flex flex-wrap justify-end gap-2 pt-2">
        <PixelButton onClick={() => open("about")}>À propos</PixelButton>
        <PixelButton variant="primary" onClick={() => open("projects")}>
          Voir mes projets
        </PixelButton>
      </div>
    </div>
  );
}
