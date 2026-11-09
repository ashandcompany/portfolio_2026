"use client";

import { Sparkles } from "lucide-react";
import Link from "next/link";
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
        {profile.role.toLowerCase()} en alternance chez Renault Group. Bienvenue sur mon bureau :
        double-clique sur les icônes pour découvrir mon parcours ✨
      </p>
      <div className="flex flex-wrap gap-2">
        <Tag tone="soft" color="lavender">React / Next.js</Tag>
        <Tag tone="soft" color="bubblegum">TypeScript</Tag>
        <Tag tone="soft" color="sky">PHP</Tag>
        <Tag tone="soft" color="mint">Docker</Tag>
        <Tag tone="soft" color="butter">MySQL</Tag>
      </div>
      <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
        <Link
          href="/cv"
          className="mr-auto text-xs text-fg-muted underline underline-offset-2 hover:text-fg"
        >
          Pressé·e ? Version simple →
        </Link>
        <PixelButton onClick={() => open("about")}>À propos</PixelButton>
        <PixelButton variant="primary" onClick={() => open("projects")}>
          Voir mes projets
        </PixelButton>
      </div>
    </div>
  );
}
