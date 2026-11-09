import { skillCategories, type SkillColor } from "@/data/skills";
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
    <div className="@container space-y-5 p-5">
      {/* Petit écran de « chargement » décoratif */}
      <div className="space-y-1.5">
        <p className="font-pixel text-sm text-fg-muted">
          &gt; chargement de {total} compétences… <span className="text-fg">OK ✦</span>
        </p>
        <div aria-hidden className="flex h-4 gap-0.5 rounded-control border-2 border-control-border bg-surface p-0.5">
          {Array.from({ length: 20 }, (_, i) => (
            <span key={i} className={cn("flex-1", i % 2 ? "bg-bubblegum-300" : "bg-lavender-400")} />
          ))}
        </div>
      </div>

      <div className="grid gap-4 @md:grid-cols-2">
        {skillCategories.map((category) => (
          <section
            key={category.id}
            className="overflow-hidden rounded-window border-2 border-window-border bg-white/60 shadow-pixel-sm"
          >
            <h3
              className={cn(
                "font-pixel title-stripes border-b-2 border-window-border px-3 py-1.5 text-sm",
                headerBg[category.color],
              )}
            >
              {category.title}
            </h3>
            <ul className="space-y-1.5 p-3 text-sm">
              {category.skills.map((skill) => (
                <li key={skill.name} className="flex gap-2">
                  <span aria-hidden className="text-bubblegum-500">✦</span>
                  <span>
                    <span className="font-semibold">{skill.name}</span>
                    {skill.detail && <span className="text-fg-muted"> ({skill.detail})</span>}
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
