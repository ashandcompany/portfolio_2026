"use client";

import { ArrowLeft, ChevronRight, ExternalLink, FolderHeart, ImageIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { projects, type Project } from "@/data/projects";
import type { SkillColor } from "@/data/skills";
import { cn, isPlaceholder } from "@/lib/utils";
import { GithubIcon } from "@/components/ui/BrandIcons";
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
    <ul className="grid gap-4 p-4 @md:grid-cols-2 @3xl:grid-cols-3">
      {projects.map((project) => (
        <li key={project.id}>
          <button
            type="button"
            onClick={() => onOpen(project.id)}
            className="group flex h-full w-full flex-col overflow-hidden rounded-window border-2 border-window-border bg-card text-left shadow-pixel-sm transition-transform hover:-translate-y-0.5 hover:shadow-pixel"
          >
            <ProjectThumb project={project} className="h-24" />
            <div className="flex flex-1 flex-col gap-1.5 p-3">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-pixel leading-tight">{project.title}</h3>
                {project.placeholder ? (
                  <Tag color="warning" className="shrink-0">à compléter</Tag>
                ) : (
                  <span className="font-pixel shrink-0 text-xs text-fg-muted">{project.year}</span>
                )}
              </div>
              <p className="text-sm text-fg-muted">{project.summary}</p>
              <div className="mt-auto flex flex-wrap gap-1 pt-1">
                {project.stack.slice(0, 3).map((tech) => (
                  <Tag key={tech} color={project.color}>{tech}</Tag>
                ))}
                {project.stack.length > 3 && <Tag color={project.color}>+{project.stack.length - 3}</Tag>}
              </div>
            </div>
          </button>
        </li>
      ))}
    </ul>
  );
}

function ProjectDetail({ project }: { project: Project }) {
  const github = project.links?.github;
  const demo = project.links?.demo;

  return (
    <article className="space-y-4 p-4">
      <ProjectThumb project={project} className="h-40 rounded-window border-2 @md:h-56" />

      <header className="space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="font-pixel text-2xl leading-tight">{project.title}</h2>
          {project.placeholder && <Tag color="warning">à compléter</Tag>}
        </div>
        <p className="font-pixel text-sm text-fg-muted">
          {project.context} · {project.year}
        </p>
      </header>

      <div className="space-y-2 leading-relaxed text-fg-muted">
        {project.description.map((paragraph) => (
          <p key={paragraph}>
            <RichText text={paragraph} />
          </p>
        ))}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {project.stack.map((tech) => (
          <Tag key={tech} color={project.color}>{tech}</Tag>
        ))}
      </div>

      {(!isPlaceholder(github) || !isPlaceholder(demo)) && (
        <div className="flex flex-wrap gap-2 border-t-2 border-dashed border-window-border pt-4">
          {!isPlaceholder(github) && (
            <PixelLink href={github}>
              <GithubIcon className="size-4" />
              Code source
            </PixelLink>
          )}
          {!isPlaceholder(demo) && (
            <PixelLink href={demo} variant="primary">
              <ExternalLink className="size-4" aria-hidden />
              Voir le projet
            </PixelLink>
          )}
        </div>
      )}
    </article>
  );
}
