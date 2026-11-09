"use client";

import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarHeart } from "lucide-react";
import { PixelPanel } from "@/components/ui/PixelPanel";
import { cn } from "@/lib/utils";
import { useNow } from "./Clock";

const WEEKDAYS = ["L", "M", "M", "J", "V", "S", "D"];

/** Petits widgets décoratifs en haut à droite du bureau (grands écrans uniquement). */
export function DesktopWidgets() {
  return (
    <aside
      aria-label="Widgets"
      className="absolute top-4 right-4 hidden w-56 flex-col items-end gap-4 lg:flex"
    >
      <CalendarWidget />
      <StickyNote />
    </aside>
  );
}

function CalendarWidget() {
  const now = useNow();
  if (!now) return <div className="h-52 w-full" aria-hidden />;

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(now), { weekStartsOn: 1 }),
    end: endOfWeek(endOfMonth(now), { weekStartsOn: 1 }),
  });

  return (
    <PixelPanel
      className="w-full"
      title={format(now, "MMMM yyyy", { locale: fr })}
      icon={<CalendarHeart className="size-4 text-bubblegum-500" aria-hidden />}
      active={false}
      bodyClassName="p-2"
    >
      <div className="grid grid-cols-7 gap-0.5 text-center">
        {WEEKDAYS.map((d, i) => (
          <span key={i} className="font-pixel text-[10px] text-fg-muted">
            {d}
          </span>
        ))}
        {days.map((day) => {
          const today = isSameDay(day, now);
          return (
            <span
              key={day.toISOString()}
              aria-current={today ? "date" : undefined}
              className={cn(
                "font-pixel rounded-sm py-0.5 text-[11px]",
                !isSameMonth(day, now) && "text-fg-subtle",
                today && "bg-signature text-on-pastel shadow-pixel-sm",
              )}
            >
              {format(day, "d")}
            </span>
          );
        })}
      </div>
    </PixelPanel>
  );
}

function StickyNote() {
  return (
    <div className="w-48 rotate-2 rounded-sm border-2 border-plum-700/30 bg-butter-200 p-3 text-on-pastel shadow-pixel">
      <p className="font-pixel mb-1.5 text-sm">À faire ✦</p>
      <ul className="space-y-1 text-xs">
        <li>☑ coder un portfolio cozy</li>
        <li>☐ trouver un super poste de dev</li>
        <li>☐ boire de l&apos;eau</li>
        <li>☐ faire une pause de temps en temps</li>
      </ul>
    </div>
  );
}
