import { Award, Calendar, Languages, School } from "lucide-react";
import { education } from "@/data/education";
import { profile } from "@/data/profile";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Tag } from "@/components/ui/Tag";
import { Timeline, TimelineItem } from "@/components/ui/Timeline";

/** formation — diplômes, certification et langues. */
export function EducationApp() {
  return (
    <div className="@container space-y-6 p-5">
      <h2 className="font-pixel text-xl">Formation</h2>
      <Timeline>
        {education.map((item) => (
          <TimelineItem key={item.id} current={item.current}>
            <article className="space-y-2">
              <header className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-pixel text-lg leading-tight">{item.school}</h3>
                  {item.current && <Tag color="success">en cours</Tag>}
                </div>
                <p className="flex items-center gap-1.5 text-sm font-semibold text-fg-muted">
                  <School className="size-4 shrink-0" aria-hidden />
                  {item.degree}
                </p>
                <p className="font-pixel flex items-center gap-1.5 text-xs text-fg-muted">
                  <Calendar className="size-3.5 shrink-0" aria-hidden />
                  {item.start} → {item.end}
                </p>
              </header>
              <div className="flex flex-wrap gap-1.5">
                {item.topics.map((topic) => (
                  <Tag key={topic} color="sky">{topic}</Tag>
                ))}
              </div>
            </article>
          </TimelineItem>
        ))}
      </Timeline>

      <div className="grid gap-5 @md:grid-cols-2">
        <section className="space-y-2">
          <SectionTitle icon={<Award className="size-4" aria-hidden />}>Certification</SectionTitle>
          {profile.certifications.map((cert) => (
            <p key={cert.name} className="text-sm">
              <span className="font-semibold">{cert.name}</span>
              <span className="text-fg-muted"> · {cert.detail}</span>
            </p>
          ))}
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
      </div>
    </div>
  );
}
