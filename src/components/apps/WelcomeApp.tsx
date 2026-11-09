"use client";

import { Keyboard, Mail, MousePointerClick, Move } from "lucide-react";
import Link from "next/link";
import { APPS, type AppId } from "@/data/apps";
import { experiences } from "@/data/experience";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { skillCategories } from "@/data/skills";
import { AppIcon } from "@/components/ui/AppIcon";
import { Avatar } from "@/components/ui/Avatar";
import { Eyebrow } from "@/components/ui/PageHeader";
import { PixelButton } from "@/components/ui/PixelButton";
import { useDesktopStore } from "@/stores/desktop-store";

const projectCount = projects.filter((p) => !p.placeholder).length;
const skillCount = skillCategories.reduce((sum, c) => sum + c.skills.length, 0);
const plural = (n: number, word: string) => `${n} ${word}${n > 1 ? "s" : ""}`;

/** Raccourcis « par où commencer », avec un aperçu concret de ce qu'on y trouve. */
const SHORTCUTS: { id: AppId; hint: string }[] = [
  { id: "projects", hint: plural(projectCount, "projet") + " à explorer" },
  { id: "experience", hint: experiences[0] ? `${experiences[0].company}, ${experiences[0].contract.toLowerCase()}` : "Mon parcours pro" },
  { id: "skills", hint: plural(skillCount, "compétence") + " par domaine" },
  { id: "cv", hint: "Mon CV, à lire ou télécharger" },
];

const TIPS = [
  { icon: MousePointerClick, text: "Double-clique sur une icône du bureau pour ouvrir une app" },
  { icon: Move, text: "Glisse les fenêtres par leur barre de titre, agrandis-les par le coin" },
  { icon: Keyboard, text: "Tab pour naviguer, Échap pour fermer la fenêtre active" },
];

/**
 * bienvenue.exe — premier écran : qui je suis, par où commencer, comment ça marche.
 * Ordre d'importance : présentation → raccourcis → mode d'emploi → contact.
 */
export function WelcomeApp() {
  const open = useDesktopStore((s) => s.open);

  return (
    <div className="@container space-y-6 p-5">
      {/* 1. Présentation */}
      <header className="flex items-center gap-4">
        <Avatar size="lg" className="hidden @xs:flex" />
        <div className="space-y-1">
          <Eyebrow>Bienvenue sur Emma OS ✦</Eyebrow>
          <h1 className="font-pixel text-3xl leading-tight">Bonjour, moi c&apos;est {profile.firstName} !</h1>
          <p className="font-bold">{profile.role}</p>
          <p className="flex items-center gap-1.5 text-sm text-fg-muted">
            <span className="size-2 shrink-0 rounded-full bg-success ring-1 ring-plum-500" aria-hidden />
            {profile.availability}
          </p>
        </div>
      </header>

      <p className="leading-relaxed text-fg-muted">
        Ce portfolio est un petit bureau d&apos;ordinateur : chaque icône est une partie de mon
        parcours. Installe-toi, ouvre ce qui t&apos;intéresse ✨
      </p>

      {/* 2. Par où commencer */}
      <section className="space-y-2">
        <Eyebrow>Par où commencer ?</Eyebrow>
        <ul className="grid gap-2 @md:grid-cols-2">
          {SHORTCUTS.map(({ id, hint }) => {
            const app = APPS[id];
            return (
              <li key={id}>
                <button
                  type="button"
                  onClick={() => open(id)}
                  className="group flex w-full items-center gap-3 rounded-window border-2 border-window-border bg-card p-2.5 text-left shadow-pixel-sm transition-transform hover:-translate-y-0.5 hover:shadow-pixel"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-control bg-surface">
                    <AppIcon app={app} className="size-7" strokeWidth={1.5} />
                  </span>
                  <span className="min-w-0">
                    <span className="font-pixel block leading-tight">{app.title}</span>
                    <span className="block truncate text-xs text-fg-muted">{hint}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      {/* 3. Mode d'emploi, discret */}
      <section className="space-y-2 rounded-window bg-surface p-3">
        <Eyebrow>Mode d&apos;emploi</Eyebrow>
        <ul className="space-y-1.5 text-sm text-fg-muted">
          {TIPS.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-start gap-2">
              <Icon className="mt-0.5 size-4 shrink-0 text-bubblegum-500" aria-hidden />
              {text}
            </li>
          ))}
        </ul>
      </section>

      {/* 4. Actions */}
      <div className="flex flex-wrap items-center justify-end gap-2">
        <Link
          href="/cv"
          className="mr-auto text-xs text-fg-muted underline underline-offset-2 hover:text-fg"
        >
          Pressé·e ? Version simple →
        </Link>
        <PixelButton onClick={() => open("about")}>À propos</PixelButton>
        <PixelButton variant="primary" onClick={() => open("contact")}>
          <Mail className="size-4" aria-hidden />
          Me contacter
        </PixelButton>
      </div>
    </div>
  );
}
