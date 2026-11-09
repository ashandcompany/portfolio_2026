import { ArrowLeft, Download, ExternalLink, Mail, MapPin } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/BrandIcons";
import { RichText } from "@/components/ui/RichText";
import { education } from "@/data/education";
import { experiences } from "@/data/experience";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { skillCategories } from "@/data/skills";
import { isPlaceholder } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Version simple",
  description: `${profile.fullName}, ${profile.headline.toLowerCase()} : parcours, projets et compétences sur une seule page.`,
};

/**
 * Version simple du portfolio : une page de texte linéaire, sans bureau ni fenêtres.
 * Pour les recruteurs pressés, les lecteurs d'écran et l'impression.
 */
export default function SimpleCvPage() {
  const shownProjects = projects.filter((p) => !p.placeholder);
  const links = [
    { href: `mailto:${profile.email}`, label: profile.email, icon: <Mail className="size-4" aria-hidden /> },
    !isPlaceholder(profile.links.linkedin) && {
      href: profile.links.linkedin,
      label: "LinkedIn",
      icon: <LinkedinIcon className="size-4" aria-hidden />,
    },
    !isPlaceholder(profile.links.github) && {
      href: profile.links.github,
      label: "GitHub",
      icon: <GithubIcon className="size-4" aria-hidden />,
    },
  ].filter(Boolean) as { href: string; label: string; icon: ReactNode }[];

  return (
    <div className="h-full overflow-y-auto bg-window text-fg print:h-auto print:overflow-visible">
      <main className="mx-auto max-w-3xl space-y-10 px-4 py-8 sm:px-8 sm:py-12">
        <nav className="flex flex-wrap items-center justify-between gap-3 text-sm print:hidden">
          <Link href="/" className="font-pixel flex items-center gap-1.5 text-fg-muted hover:text-fg hover:underline">
            <ArrowLeft className="size-4" aria-hidden />
            Version bureau ✨
          </Link>
          {!isPlaceholder(profile.cvPdf) && (
            <a
              href={profile.cvPdf}
              download="CV-Emma-Roizot.pdf"
              className="font-pixel flex items-center gap-1.5 rounded-control border-2 border-control-border bg-accent px-3 py-1 text-accent-fg shadow-bevel hover:bg-accent-hover"
            >
              <Download className="size-4" aria-hidden />
              CV en PDF
            </a>
          )}
        </nav>

        <header className="space-y-3 border-b-2 border-bubblegum-300 pb-6">
          <h1 className="font-pixel text-4xl leading-tight">{profile.fullName}</h1>
          <p className="text-lg font-bold text-fg-muted">{profile.headline}</p>
          <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-fg-muted">
            <span className="flex items-center gap-1">
              <MapPin className="size-4" aria-hidden />
              {profile.location}
            </span>
            <span>{profile.status}</span>
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-1 text-sm">
            {links.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="flex items-center gap-1.5 underline-offset-2 hover:underline">
                  {link.icon}
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="space-y-2 pt-2 leading-relaxed text-fg-muted">
            {profile.bio.map((paragraph) => (
              <p key={paragraph}>
                <RichText text={paragraph} />
              </p>
            ))}
          </div>
        </header>

        <Section title="Expérience">
          {experiences.map((xp) => (
            <article key={xp.id} className="space-y-1.5">
              <h3 className="font-bold">
                {xp.role} · {xp.company}
              </h3>
              <p className="text-sm text-fg-muted">
                {xp.contract} · {xp.place} · {xp.start} – {xp.end}
              </p>
              <ul className="list-disc space-y-0.5 pl-5 text-fg-muted">
                {xp.highlights.map((h) => (
                  <li key={h}>
                    <RichText text={h} />
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </Section>

        <Section title="Projets">
          {shownProjects.map((project) => {
            const github = project.links?.github;
            const demo = project.links?.demo;
            return (
              <article key={project.id} className="space-y-1.5">
                <h3 className="font-bold">
                  {project.title}{" "}
                  <span className="font-normal text-fg-muted">
                    · {project.context} · {project.year}
                  </span>
                </h3>
                <p className="text-fg-muted">{project.summary}</p>
                <p className="text-sm text-fg-muted">
                  <span className="font-semibold text-fg">Stack :</span> {project.stack.join(", ")}
                </p>
                {(!isPlaceholder(github) || !isPlaceholder(demo)) && (
                  <p className="flex flex-wrap gap-4 text-sm">
                    {!isPlaceholder(github) && <ExternalTextLink href={github}>Code sur GitHub</ExternalTextLink>}
                    {!isPlaceholder(demo) && <ExternalTextLink href={demo}>Démo</ExternalTextLink>}
                  </p>
                )}
              </article>
            );
          })}
        </Section>

        <Section title="Compétences">
          <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
            {skillCategories.map((category) => (
              <div key={category.id}>
                <dt className="font-bold">{category.title}</dt>
                <dd className="text-fg-muted">
                  {category.skills.map((s) => (s.detail ? `${s.name} (${s.detail})` : s.name)).join(" · ")}
                </dd>
              </div>
            ))}
          </dl>
        </Section>

        <Section title="Formation">
          {education.map((item) => (
            <article key={item.id} className="space-y-1">
              <h3 className="font-bold">
                {item.degree} · {item.school}
              </h3>
              <p className="text-sm text-fg-muted">
                {item.place} · {item.start} – {item.end}
                {item.current && " (en cours)"}
              </p>
              <p className="text-sm text-fg-muted">{item.topics.join(" · ")}</p>
            </article>
          ))}
        </Section>

        <Section title="En plus">
          <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-3">
            <div>
              <dt className="font-bold">Langues</dt>
              {profile.languages.map((lang) => (
                <dd key={lang.name} className="text-fg-muted">
                  {lang.name} : {lang.level}
                </dd>
              ))}
            </div>
            <div>
              <dt className="font-bold">Certification</dt>
              {profile.certifications.map((cert) => (
                <dd key={cert.name} className="text-fg-muted">
                  {cert.name} ({cert.detail})
                </dd>
              ))}
            </div>
            <div>
              <dt className="font-bold">Centres d&apos;intérêt</dt>
              <dd className="text-fg-muted">{profile.interests.join(", ")}</dd>
            </div>
          </dl>
        </Section>

        <footer className="font-pixel border-t-2 border-dashed border-window-border pt-6 text-center text-sm text-fg-muted print:hidden">
          <Link href="/" className="hover:text-fg hover:underline">
            Retourner sur Emma OS, la version bureau interactive ✨
          </Link>
        </footer>
      </main>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  const id = `section-${title.normalize("NFD").replace(/[^a-zA-Z]+/g, "-").toLowerCase()}`;
  return (
    <section className="space-y-4" aria-labelledby={id}>
      <h2
        id={id}
        className="font-pixel inline-block rounded-control bg-bubblegum-200 px-2 py-0.5 text-sm tracking-[0.2em] text-on-pastel uppercase"
      >
        {title}
      </h2>
      <div className="space-y-5">{children}</div>
    </section>
  );
}

function ExternalTextLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-1 underline underline-offset-2 hover:text-bubblegum-500"
    >
      {children}
      <ExternalLink className="size-3.5" aria-hidden />
      <span className="sr-only">(nouvel onglet)</span>
    </a>
  );
}
