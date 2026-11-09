"use client";

import { Download, FileText, Mail, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { education } from "@/data/education";
import { experiences } from "@/data/experience";
import { profile } from "@/data/profile";
import { skillCategories } from "@/data/skills";
import { isPlaceholder } from "@/lib/utils";
import { Avatar } from "@/components/ui/Avatar";
import { LinkedinIcon } from "@/components/ui/BrandIcons";
import { PixelLink } from "@/components/ui/PixelButton";
import { RichText } from "@/components/ui/RichText";

/** cv_emma.pdf — visionneuse de CV (version HTML) + téléchargement du PDF. */
export function CvApp() {
  const pdfAvailable = usePdfAvailable(profile.cvPdf);

  return (
    <div className="@container flex min-h-full flex-col">
      {/* Barre d'outils */}
      <div className="flex items-center gap-2 border-b-2 border-window-border bg-surface px-3 py-1.5">
        <FileText className="size-4 shrink-0 text-fg-muted" aria-hidden />
        <span className="font-pixel min-w-0 flex-1 truncate text-xs text-fg-muted">
          cv_emma.pdf · 1 page
        </span>
        <PixelLink
          size="sm"
          variant="primary"
          href={pdfAvailable ? profile.cvPdf : undefined}
          download={pdfAvailable ? "CV-Emma-Roizot.pdf" : undefined}
          aria-disabled={!pdfAvailable}
          title={pdfAvailable ? "Télécharger le CV en PDF" : "PDF bientôt disponible"}
        >
          <Download className="size-3.5" aria-hidden />
          {pdfAvailable ? "Télécharger" : "PDF bientôt"}
        </PixelLink>
      </div>

      {/* « Page » du document */}
      <div className="flex-1 bg-surface p-3 @md:p-6">
        <article className="mx-auto max-w-3xl space-y-5 rounded-control bg-window p-5 text-sm shadow-pixel @md:p-8">
          <header className="flex flex-col gap-4 border-b-2 border-bubblegum-300 pb-4 @sm:flex-row @sm:items-center">
            <Avatar size="lg" />
            <div className="space-y-1">
              <h2 className="font-pixel text-2xl leading-tight text-bubblegum-500">
                {profile.lastName.toUpperCase()} {profile.firstName}
              </h2>
              <p className="text-xs font-bold tracking-wider text-fg-muted uppercase">{profile.headline}</p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1 text-xs text-fg-muted">
                <span className="flex items-center gap-1">
                  <Mail className="size-3.5" aria-hidden />
                  {profile.email}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="size-3.5" aria-hidden />
                  {profile.location}
                </span>
                {!isPlaceholder(profile.links.linkedin) && (
                  <span className="flex items-center gap-1">
                    <LinkedinIcon className="size-3.5" />
                    {profile.fullName}
                  </span>
                )}
              </div>
            </div>
          </header>

          <p className="leading-relaxed text-fg-muted">
            <RichText text={profile.bio.join(" ")} />
          </p>

          <div className="grid gap-6 @lg:grid-cols-[1fr_1.4fr]">
            <div className="space-y-5">
              <CvSection title="Compétences">
                <div className="space-y-3">
                  {skillCategories.map((category) => (
                    <div key={category.id}>
                      <p className="text-xs font-bold uppercase">{category.title}</p>
                      <ul className="list-disc pl-4 text-fg-muted">
                        {category.skills.map((skill) => (
                          <li key={skill.name}>
                            <span className="font-semibold text-fg">{skill.name}</span>
                            {skill.detail && ` (${skill.detail})`}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </CvSection>
              <CvSection title="Certification">
                {profile.certifications.map((cert) => (
                  <p key={cert.name} className="text-fg-muted">
                    <span className="font-semibold text-fg">{cert.name}</span>, {cert.detail}
                  </p>
                ))}
              </CvSection>
              <CvSection title="Centres d'intérêt">
                <ul className="list-disc pl-4 text-fg-muted">
                  {profile.interests.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
              </CvSection>
            </div>

            <div className="space-y-5">
              <CvSection title="Expérience">
                {experiences.map((xp) => (
                  <div key={xp.id} className="space-y-1">
                    <p className="font-bold uppercase">
                      {xp.contract} : {xp.role}
                    </p>
                    <p className="text-fg-muted italic">
                      {xp.company}, {xp.place}
                    </p>
                    <p className="text-xs text-fg-muted uppercase">
                      {xp.start} – {xp.end}
                    </p>
                    <ul className="list-disc pl-4 text-fg-muted">
                      {xp.highlights.map((h) => (
                        <li key={h}>
                          <RichText text={h} />
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </CvSection>
              <CvSection title="Formation">
                <div className="space-y-3">
                  {education.map((item) => (
                    <div key={item.id} className="space-y-1">
                      <p className="font-bold uppercase">{item.school}</p>
                      <p className="text-fg-muted italic">{item.degree}</p>
                      <p className="text-xs text-fg-muted uppercase">
                        {item.start} – {item.end}
                      </p>
                      <ul className="list-disc pl-4 text-fg-muted">
                        {item.topics.map((t) => (
                          <li key={t}>{t}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </CvSection>
              <CvSection title="Langues">
                <ul className="text-fg-muted">
                  {profile.languages.map((lang) => (
                    <li key={lang.name}>
                      <span className="font-semibold text-fg">{lang.name}</span> : {lang.level}
                    </li>
                  ))}
                </ul>
              </CvSection>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}

function CvSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-2">
      <h3 className="font-pixel rounded-control bg-bubblegum-200 px-2 py-0.5 text-on-pastel text-sm tracking-[0.2em] uppercase">
        {title}
      </h3>
      {children}
    </section>
  );
}

/** Vérifie que le PDF existe dans /public avant d'activer le bouton de téléchargement. */
function usePdfAvailable(path: string) {
  const [available, setAvailable] = useState(false);
  useEffect(() => {
    if (isPlaceholder(path)) return;
    let cancelled = false;
    fetch(path, { method: "HEAD" })
      .then((res) => {
        if (!cancelled) setAvailable(res.ok && (res.headers.get("content-type") ?? "").includes("pdf"));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [path]);
  return available;
}
