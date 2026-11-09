import { Building2, Calendar } from "lucide-react";
import { experiences } from "@/data/experience";
import { RichText } from "@/components/ui/RichText";
import { Tag } from "@/components/ui/Tag";
import { Timeline, TimelineItem } from "@/components/ui/Timeline";

/** experiences — parcours professionnel en timeline. */
export function ExperienceApp() {
  return (
    <div className="space-y-5 p-5">
      <h2 className="font-pixel text-xl">Expériences professionnelles</h2>
      <Timeline>
        {experiences.map((xp, index) => (
          <TimelineItem key={xp.id} current={index === 0}>
            <article className="space-y-2">
              <header className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-pixel text-lg leading-tight">{xp.role}</h3>
                  <Tag color="bubblegum">{xp.contract}</Tag>
                </div>
                <p className="flex items-center gap-1.5 text-sm font-semibold text-fg-muted">
                  <Building2 className="size-4 shrink-0" aria-hidden />
                  {xp.company} · {xp.place}
                </p>
                <p className="font-pixel flex items-center gap-1.5 text-xs text-fg-muted">
                  <Calendar className="size-3.5 shrink-0" aria-hidden />
                  {xp.start} → {xp.end}
                </p>
              </header>
              <ul className="list-['✦_'] space-y-1 pl-4 text-sm leading-relaxed text-fg-muted marker:text-bubblegum-500">
                {xp.highlights.map((item) => (
                  <li key={item}>
                    <RichText text={item} />
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {xp.stack.map((tech) => (
                  <Tag key={tech} color="lavender">{tech}</Tag>
                ))}
              </div>
            </article>
          </TimelineItem>
        ))}
      </Timeline>
    </div>
  );
}
