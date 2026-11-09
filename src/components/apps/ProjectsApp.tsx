"use client";

import { ArrowLeft, ChevronRight, ExternalLink, FolderHeart, ImageIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { projects, type Project } from "@/data/projects";
import type { SkillColor } from "@/data/skills";
import { cn, isPlaceholder } from "@/lib/utils";
import { GithubIcon } from "@/components/ui/BrandIcons";
import { Eyebrow, PageHeader } from "@/components/ui/PageHeader";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { PixelButton, PixelLink } from "@/components/ui/PixelButton";
import { RichText } from "@/components/ui/RichText";
import { Tag } from "@/components/ui/Tag";

const thumbBg: Record<SkillColor, string> = {
  lavender: "bg-lavender-200",
  bubblegum: "bg-bubblegum-200",
  sky: "bg-sky-pastel-200",
  mint: "bg-mint-200",
  butter: "bg-butter-200",
};

/** projets — explorateur de fichiers : grille de projets puis fiche détaillée. */
export function ProjectsApp() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = projects.find((p) => p.id === selectedId) ?? null;

  return (
    <div className="@container flex min-h-full flex-col">
      {/* Barre d'adresse */}
      <div className="flex items-center gap-2 border-b-2 border-window-border bg-surface px-2 py-1.5">
        <PixelButton
          size="icon"
          aria-label="Retour à la liste des projets"
          disabled={!selected}
          onClick={() => setSelectedId(null)}
        >
          <ArrowLeft className="size-3.5" />
        </PixelButton>
        <nav
          aria-label="Chemin"
          className="font-pixel flex min-w-0 flex-1 items-center gap-1 rounded-control border-2 border-window-border bg-input px-2 py-0.5 text-xs text-fg-muted"
        >
          <FolderHeart className="size-3.5 shrink-0 fill-folder text-plum-700" aria-hidden />
          <button type="button" className="hover:text-fg hover:underline" onClick={() => setSelectedId(null)}>
            C:/Emma/projets
          </button>
          {selected && (
            <>
              <ChevronRight className="size-3 shrink-0" aria-hidden />
              <span className="truncate text-fg">{selected.id}</span>
            </>
          )}
        </nav>
        <span className="font-pixel hidden text-xs text-fg-muted @sm:inline">
          {projects.length} éléments
        </span>
      </div>

      {selected ? <ProjectDetail project={selected} /> : <ProjectGrid onOpen={setSelectedId} />}
    </div>
  );
}

function ProjectThumb({ project, className }: { project: Project; className?: string }) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden border-b-2 border-window-border",
        thumbBg[project.color],
        className,
      )}
    >
      {project.image ? (
        <Image src={project.image} alt={`Capture de ${project.title}`} fill className="object-cover object-left-top" sizes="(max-width: 768px) 100vw, 400px" />
      ) : (
        <ImageIcon className="size-8 text-plum-500/60" aria-hidden />
      )}
    </div>
  );
}

function ProjectGrid({ onOpen }: { onOpen: (id: string) => void }) {
  return (
    <div className="space-y-4 p-4">
      <PageHeader
        eyebrow="Réalisations"
        title="Projets"
        lead="Clique sur un projet pour voir le détail, la stack et le code."
      />
      <ul className="grid gap-4 @md:grid-cols-2 @3xl:grid-cols-3">
        {projects.map((project) => (
          <li key={project.id}>
            <button
              type="button"
              onClick={() => onOpen(project.id)}
              className={cn(
                "group flex h-full w-full flex-col overflow-hidden rounded-window border-2 border-window-border bg-card text-left shadow-pixel-sm transition-transform hover:-translate-y-0.5 hover:shadow-pixel",
                // Projet à compléter : en retrait, pour ne pas concurrencer les vrais projets.
                project.placeholder && "border-dashed opacity-70 shadow-none",
              )}
            >
              <ProjectThumb project={project} className="h-28" />
              <div className="flex flex-1 flex-col gap-1 p-3">
                <Eyebrow>
                  {project.placeholder ? "à compléter" : `${project.context} · ${project.year}`}
                </Eyebrow>
                <h3 className="font-pixel text-lg leading-tight">{project.title}</h3>
                <p className="text-sm text-fg-muted">{project.summary}</p>
                <div className="mt-auto flex flex-wrap gap-1 pt-2">
                  {project.stack.slice(0, 3).map((tech) => (
                    <Tag key={tech} tone="soft" color={project.color}>{tech}</Tag>
                  ))}
                  {project.stack.length > 3 && (
                    <Tag tone="soft" color={project.color}>+{project.stack.length - 3}</Tag>
                  )}
                </div>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ProjectDetail({ project }: { project: Project }) {
  const github = project.links?.github;
  const demo = project.links?.demo;

  const hasLinks = !isPlaceholder(github) || !isPlaceholder(demo);

  return (
    <article className="space-y-6 p-4">
      <ProjectThumb project={project} className="h-40 rounded-window border-2 @md:h-56" />

      {/* L'essentiel d'abord : contexte, titre, résumé et liens, regroupés */}
      <header className="space-y-3">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <Eyebrow>
              {project.context} · {project.year}
            </Eyebrow>
            {project.placeholder && <Tag color="warning">à compléter</Tag>}
          </div>
          <h2 className="font-pixel text-2xl leading-tight">{project.title}</h2>
          <p className="font-semibold">{project.summary}</p>
        </div>
        {hasLinks && (
          <div className="flex flex-wrap gap-2">
            {!isPlaceholder(demo) && (
              <PixelLink href={demo} variant="primary">
                <ExternalLink className="size-4" aria-hidden />
                Voir le projet
              </PixelLink>
            )}
            {!isPlaceholder(github) && (
              <PixelLink href={github} variant={isPlaceholder(demo) ? "primary" : "default"}>
                <GithubIcon className="size-4" />
                Code source
              </PixelLink>
            )}
          </div>
        )}
      </header>

      {/* Le détail ensuite, pour qui veut creuser */}
      <section className="space-y-2">
        <SectionTitle>Le projet</SectionTitle>
        <div className="space-y-2 text-sm leading-relaxed text-fg-muted">
          {project.description.map((paragraph) => (
            <p key={paragraph}>
              <RichText text={paragraph} />
            </p>
          ))}
        </div>
      </section>

      <section className="space-y-2">
        <SectionTitle>Stack</SectionTitle>
        <ul className="flex flex-wrap gap-1.5">
          {project.stack.map((tech) => (
            <li key={tech}>
              <Tag tone="soft" color={project.color}>{tech}</Tag>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
