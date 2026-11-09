import { skillCategories, type SkillColor } from "@/data/skills";
import { PageHeader } from "@/components/ui/PageHeader";
import { cn } from "@/lib/utils";

const headerBg: Record<SkillColor, string> = {
  lavender: "bg-lavender-200",
  bubblegum: "bg-bubblegum-200",
  sky: "bg-sky-pastel-200",
  mint: "bg-mint-200",
  butter: "bg-butter-200",
};

const total = skillCategories.reduce((sum, c) => sum + c.skills.length, 0);

/** skills.exe — compétences par catégorie. */
export function SkillsApp() {
  return (
    <div className="@container space-y-6 p-5">
      <PageHeader
        // Clin d'œil « programme qui se charge », à sa place : en sur-titre discret.
        eyebrow={<span className="font-pixel tracking-normal normal-case">&gt; {total} compétences chargées ✦</span>}
        title="Compétences"
        lead="Ma stack, regroupée par domaine."
      />

      <div className="grid gap-4 @md:grid-cols-2">
        {skillCategories.map((category) => (
          <section
            key={category.id}
            className="overflow-hidden rounded-window border-2 border-window-border bg-card shadow-pixel-sm"
          >
            <h3
              className={cn(
                "font-pixel title-stripes border-b-2 text-on-pastel border-window-border px-3 py-1.5",
                headerBg[category.color],
              )}
            >
              {category.title}
            </h3>
            {/* Nom en couleur pleine, précision atténuée : pas de gras partout */}
            <ul className="space-y-1.5 p-3 text-sm">
              {category.skills.map((skill) => (
                <li key={skill.name} className="flex gap-2">
                  <span aria-hidden className="text-bubblegum-500">✦</span>
                  <span>
                    {skill.name}
                    {skill.detail && <span className="text-fg-muted"> · {skill.detail}</span>}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
