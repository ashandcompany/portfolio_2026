"use client";

import { Award, BookOpen, Briefcase, Gamepad2, Languages, MapPin, Palette, Sparkles } from "lucide-react";
import { profile } from "@/data/profile";
import { Avatar } from "@/components/ui/Avatar";
import { PixelButton } from "@/components/ui/PixelButton";
import { RichText } from "@/components/ui/RichText";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Tag } from "@/components/ui/Tag";
import { useDesktopStore } from "@/stores/desktop-store";

const interestIcons: Record<string, typeof Palette> = {
  Illustration: Palette,
  Lecture: BookOpen,
  "Jeux vidéo": Gamepad2,
};

/** about_me.txt — présentation façon bloc-notes. */
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
        <header className="flex flex-col items-start gap-4 @sm:flex-row @sm:items-center">
          <Avatar size="lg" />
          <div className="space-y-1.5">
            <h2 className="font-pixel text-2xl leading-tight">{profile.fullName}</h2>
            <p className="text-sm font-semibold text-fg-muted">{profile.headline}</p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              <Tag color="bubblegum">
                <Sparkles className="size-3" aria-hidden />
                {profile.role}
              </Tag>
              <Tag color="sky">
                <MapPin className="size-3" aria-hidden />
                {profile.location}
              </Tag>
            </div>
          </div>
        </header>

        <div className="space-y-3 leading-relaxed text-fg-muted">
          {profile.bio.map((paragraph) => (
            <p key={paragraph}>
              <RichText text={paragraph} />
            </p>
          ))}
        </div>

        <div className="grid gap-5 @md:grid-cols-2">
          <section className="space-y-2">
            <SectionTitle icon={<Briefcase className="size-4" aria-hidden />}>En ce moment</SectionTitle>
            <ul className="space-y-1 text-sm">
              <li>{profile.status}</li>
              <li className="flex items-center gap-1.5 font-semibold">
                <span className="size-2 shrink-0 rounded-full bg-success ring-1 ring-plum-500" aria-hidden />
                {profile.availability}
              </li>
            </ul>
          </section>

          <section className="space-y-2">
            <SectionTitle icon={<Languages className="size-4" aria-hidden />}>Langues</SectionTitle>
            <ul className="space-y-1 text-sm">
              {profile.languages.map((lang) => (
                <li key={lang.name}>
                  <span className="font-semibold">{lang.name}</span>
                  <span className="text-fg-muted"> · {lang.level}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="space-y-2">
            <SectionTitle icon={<Award className="size-4" aria-hidden />}>Certification</SectionTitle>
            <ul className="space-y-1 text-sm">
              {profile.certifications.map((cert) => (
                <li key={cert.name}>
                  <span className="font-semibold">{cert.name}</span>
                  <span className="text-fg-muted"> · {cert.detail}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="space-y-2">
            <SectionTitle icon={<Palette className="size-4" aria-hidden />}>Centres d&apos;intérêt</SectionTitle>
            <ul className="flex flex-wrap gap-1.5">
              {profile.interests.map((interest) => {
                const Icon = interestIcons[interest] ?? Sparkles;
                return (
                  <li key={interest}>
                    <Tag color="lavender">
                      <Icon className="size-3" aria-hidden />
                      {interest}
                    </Tag>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>

        <div className="flex flex-wrap justify-end gap-2 border-t-2 border-dashed border-window-border pt-4">
          <PixelButton onClick={() => open("cv")}>Voir mon CV</PixelButton>
          <PixelButton variant="primary" onClick={() => open("contact")}>
            Me contacter
          </PixelButton>
        </div>
      </div>
    </div>
  );
}
