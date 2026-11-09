import { experiences } from "@/data/experience";
import { Eyebrow, PageHeader } from "@/components/ui/PageHeader";
import { RichText } from "@/components/ui/RichText";
import { Tag } from "@/components/ui/Tag";
import { Timeline, TimelineItem } from "@/components/ui/Timeline";

/** experiences — parcours professionnel en timeline. */
export function ExperienceApp() {
  return (
    <div className="space-y-6 p-5">
      <PageHeader
        eyebrow="Parcours pro"
        title="Expériences"
        lead="Ce que j'ai construit en entreprise, du plus récent au plus ancien."
      />
      <Timeline>
        {experiences.map((xp, index) => (
          <TimelineItem key={xp.id} current={index === 0}>
            <article className="space-y-3">
              {/* Ordre de lecture : quand → quoi → où */}
              <header className="space-y-1">
                <Eyebrow>
                  {xp.contract} · {xp.start} → {xp.end}
                </Eyebrow>
                <h3 className="font-pixel text-lg leading-tight">{xp.role}</h3>
                <p className="text-sm">
                  <span className="font-bold">{xp.company}</span>
                  <span className="text-fg-muted"> · {xp.place}</span>
                </p>
              </header>
              <ul className="list-['✦_'] space-y-1 pl-4 text-sm leading-relaxed text-fg-muted marker:text-bubblegum-500">
                {xp.highlights.map((item) => (
                  <li key={item}>
                    <RichText text={item} />
                  </li>
                ))}
              </ul>
              <ul className="flex flex-wrap gap-1.5" aria-label="Technologies">
                {xp.stack.map((tech) => (
                  <li key={tech}>
                    <Tag tone="soft" color="lavender">{tech}</Tag>
                  </li>
                ))}
              </ul>
            </article>
          </TimelineItem>
        ))}
      </Timeline>
    </div>
  );
}
