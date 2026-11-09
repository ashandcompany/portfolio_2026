"use client";

import { BookOpen, Gamepad2, MapPin, Palette, Sparkles } from "lucide-react";
import { profile } from "@/data/profile";
import { Avatar } from "@/components/ui/Avatar";
import { Eyebrow } from "@/components/ui/PageHeader";
import { PixelButton } from "@/components/ui/PixelButton";
import { RichText } from "@/components/ui/RichText";
import { Tag } from "@/components/ui/Tag";
import { useDesktopStore } from "@/stores/desktop-store";

const interestIcons: Record<string, typeof Palette> = {
  Illustration: Palette,
  Lecture: BookOpen,
  "Jeux vidéo": Gamepad2,
};

/**
 * about_me.txt — présentation façon bloc-notes.
 * Ordre d'importance : qui je suis → ce que je cherche → mon histoire → le reste → actions.
 */
export function AboutApp() {
  const open = useDesktopStore((s) => s.open);

  return (
    <div className="@container flex min-h-full flex-col">
      {/* Fausse barre de menus de bloc-notes */}
      <div aria-hidden className="font-pixel flex gap-4 border-b border-window-border bg-surface px-3 py-1 text-xs text-fg-muted">
        <span>Fichier</span>
        <span>Édition</span>
        <span>Format</span>
        <span>Affichage</span>
        <span>?</span>
      </div>

      <div className="space-y-6 p-5">
        {/* 1. Qui je suis */}
        <header className="flex flex-col items-start gap-4 @sm:flex-row @sm:items-center">
          <Avatar size="lg" />
          <div className="space-y-1">
            <Eyebrow className="flex items-center gap-1">
              <MapPin className="size-3.5" aria-hidden />
              {profile.location}
            </Eyebrow>
            <h2 className="font-pixel text-3xl leading-tight">{profile.fullName}</h2>
            <p className="font-bold">{profile.headline}</p>
          </div>
        </header>

        {/* 2. Ce que je cherche : l'info clé pour un recruteur, mise en avant */}
        <div className="flex items-start gap-3 rounded-window border-2 border-success bg-success/20 p-3">
          <span className="mt-1.5 size-2.5 shrink-0 rounded-full bg-success ring-2 ring-plum-500/40" aria-hidden />
          <div className="space-y-0.5">
            <p className="font-bold">{profile.availability}</p>
            <p className="text-sm text-fg-muted">{profile.status}</p>
          </div>
        </div>

        {/* 3. Mon histoire */}
        <div className="space-y-3 leading-relaxed text-fg-muted">
          {profile.bio.map((paragraph) => (
            <p key={paragraph}>
              <RichText text={paragraph} />
            </p>
          ))}
        </div>

        {/* 4. Le reste : faits courts, regroupés et plus discrets */}
        <dl className="grid gap-4 rounded-window bg-surface p-4 text-sm @md:grid-cols-3">
          <div className="space-y-1">
            <dt>
              <Eyebrow>Langues</Eyebrow>
            </dt>
            {profile.languages.map((lang) => (
              <dd key={lang.name}>
                <span className="font-bold">{lang.name}</span>
                <span className="text-fg-muted"> · {lang.level}</span>
              </dd>
            ))}
          </div>
          <div className="space-y-1">
            <dt>
              <Eyebrow>Certification</Eyebrow>
            </dt>
            {profile.certifications.map((cert) => (
              <dd key={cert.name}>
                <span className="font-bold">{cert.name}</span>
                <span className="block text-fg-muted">{cert.detail}</span>
              </dd>
            ))}
          </div>
          <div className="space-y-1.5">
            <dt>
              <Eyebrow>Centres d&apos;intérêt</Eyebrow>
            </dt>
            <dd className="flex flex-wrap gap-1.5">
              {profile.interests.map((interest) => {
                const Icon = interestIcons[interest] ?? Sparkles;
                return (
                  <Tag key={interest} tone="soft" color="lavender">
                    <Icon className="size-3" aria-hidden />
                    {interest}
                  </Tag>
                );
              })}
            </dd>
          </div>
        </dl>

        {/* 5. Actions */}
        <div className="flex flex-wrap justify-end gap-2">
          <PixelButton onClick={() => open("cv")}>Voir mon CV</PixelButton>
          <PixelButton variant="primary" onClick={() => open("contact")}>
            Me contacter
          </PixelButton>
        </div>
      </div>
    </div>
  );
}
