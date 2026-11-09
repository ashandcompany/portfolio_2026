import { Award, Languages } from "lucide-react";
import { education } from "@/data/education";
import { profile } from "@/data/profile";
import { Eyebrow, PageHeader } from "@/components/ui/PageHeader";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Tag } from "@/components/ui/Tag";
import { Timeline, TimelineItem } from "@/components/ui/Timeline";

/** formation — diplômes, puis (secondaire) certification et langues. */
export function EducationApp() {
  return (
    <div className="@container space-y-8 p-5">
      <PageHeader
        eyebrow="Diplômes"
        title="Formation"
        lead="Mes diplômes, du plus récent au plus ancien."
      />
      <Timeline>
        {education.map((item) => (
          <TimelineItem key={item.id} current={item.current}>
            <article className="space-y-3">
              {/* Ordre de lecture : quand → quel diplôme → où */}
              <header className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Eyebrow>
                    {item.start} → {item.end}
                  </Eyebrow>
                  {item.current && <Tag color="success">en cours</Tag>}
                </div>
                <h3 className="font-pixel text-lg leading-tight">{item.degree}</h3>
                <p className="text-sm">
                  <span className="font-bold">{item.school}</span>
                  <span className="text-fg-muted"> · {item.place}</span>
                </p>
              </header>
              <ul className="flex flex-wrap gap-1.5" aria-label="Matières principales">
                {item.topics.map((topic) => (
                  <li key={topic}>
                    <Tag tone="soft" color="sky">{topic}</Tag>
                  </li>
                ))}
              </ul>
            </article>
          </TimelineItem>
        ))}
      </Timeline>

      {/* Infos secondaires : regroupées dans un bloc plus discret, séparé de la timeline */}
      <div className="grid gap-5 rounded-window bg-surface p-4 @md:grid-cols-2">
        <section className="space-y-2">
          <SectionTitle icon={<Award className="size-4" aria-hidden />}>Certification</SectionTitle>
          {profile.certifications.map((cert) => (
            <p key={cert.name} className="text-sm">
              <span className="font-bold">{cert.name}</span>
              <span className="text-fg-muted"> · {cert.detail}</span>
            </p>
          ))}
        </section>
        <section className="space-y-2">
          <SectionTitle icon={<Languages className="size-4" aria-hidden />}>Langues</SectionTitle>
          <ul className="space-y-1 text-sm">
            {profile.languages.map((lang) => (
              <li key={lang.name}>
                <span className="font-bold">{lang.name}</span>
                <span className="text-fg-muted"> · {lang.level}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
