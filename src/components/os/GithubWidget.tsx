import { addDays, format, parseISO, startOfWeek } from "date-fns";
import { fr } from "date-fns/locale";
import { PixelPanel } from "@/components/ui/PixelPanel";
import { GithubIcon } from "@/components/ui/BrandIcons";
import { profile } from "@/data/profile";
import { getContributionCalendar, type ContributionDay } from "@/lib/github";
import { cn } from "@/lib/utils";

/** Nombre de semaines affichées : ce qui tient dans la largeur des widgets (w-56). */
const WEEKS = 17;

/** Couleur des cases par intensité, dans la palette bubblegum (signature du site). */
const LEVEL_CLASSES: Record<ContributionDay["level"], string> = {
  0: "bg-surface-hover",
  1: "bg-bubblegum-200",
  2: "bg-bubblegum-300",
  3: "bg-bubblegum-400",
  4: "bg-bubblegum-500",
};

const githubUsername = new URL(profile.links.github).pathname.split("/").filter(Boolean)[0] ?? "";

/**
 * Widget « contributions GitHub » : les petits carrés colorés des derniers mois.
 * Composant serveur — les données sont récupérées et mises en cache côté serveur (voir lib/github).
 */
export async function GithubWidget() {
  const calendar = await getContributionCalendar(githubUsername);
  if (!calendar || calendar.days.length === 0) return null;

  const byDate = new Map(calendar.days.map((d) => [d.date, d]));
  const lastDay = parseISO(calendar.days[calendar.days.length - 1].date);
  // Colonnes = semaines du lundi au dimanche, la dernière contenant le jour le plus récent.
  const firstMonday = addDays(startOfWeek(lastDay, { weekStartsOn: 1 }), -7 * (WEEKS - 1));
  const cells = Array.from({ length: WEEKS * 7 }, (_, i) => {
    const date = addDays(firstMonday, i);
    if (date > lastDay) return null; // jours à venir de la semaine en cours
    const key = format(date, "yyyy-MM-dd");
    return { date, day: byDate.get(key) ?? { date: key, count: 0, level: 0 as const } };
  });
  const shownTotal = cells.reduce((sum, c) => sum + (c?.day.count ?? 0), 0);

  return (
    <PixelPanel
      className="w-full"
      title="Contributions"
      icon={<GithubIcon className="size-4" aria-hidden />}
      active={false}
      bodyClassName="p-2"
    >
      <div
        role="img"
        aria-label={`${shownTotal} contributions GitHub sur les ${WEEKS} dernières semaines`}
        className="grid grid-flow-col grid-rows-7 gap-0.5"
      >
        {cells.map((cell, i) =>
          cell ? (
            <span
              key={cell.day.date}
              title={`${cell.day.count} contribution${cell.day.count > 1 ? "s" : ""} le ${format(cell.date, "d MMM yyyy", { locale: fr })}`}
              className={cn("size-2.5 rounded-[2px]", LEVEL_CLASSES[cell.day.level])}
            />
          ) : (
            <span key={`empty-${i}`} className="size-2.5" aria-hidden />
          ),
        )}
      </div>

      <div className="mt-2 flex items-center justify-between gap-2 text-[10px] text-fg-muted">
        <a
          href={profile.links.github}
          target="_blank"
          rel="noopener noreferrer"
          className="font-pixel hover:text-fg hover:underline"
        >
          {calendar.total} sur 12 mois
        </a>
        <span className="flex items-center gap-0.5" aria-hidden>
          <span className="mr-0.5">−</span>
          {([0, 1, 2, 3, 4] as const).map((level) => (
            <span key={level} className={cn("size-2 rounded-[2px]", LEVEL_CLASSES[level])} />
          ))}
          <span className="ml-0.5">+</span>
        </span>
      </div>
    </PixelPanel>
  );
}
