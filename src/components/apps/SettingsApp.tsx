"use client";

import { Check, LayoutGrid, Monitor, Moon, Play, Sun, Volume2, VolumeX } from "lucide-react";
import type { ReactNode } from "react";
import { toast } from "sonner";
import { REPLAY_BOOT_EVENT } from "@/components/os/BootScreen";
import { PixelButton } from "@/components/ui/PixelButton";
import { playSound } from "@/lib/sounds";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { cn } from "@/lib/utils";
import { useDesktopStore } from "@/stores/desktop-store";
import {
  useSettingsStore,
  type ThemeChoice,
  type WallpaperChoice,
} from "@/stores/settings-store";

const THEMES: { id: ThemeChoice; label: string; hint: string; icon: typeof Sun }[] = [
  { id: "light", label: "Strawberry Milk", hint: "Clair", icon: Sun },
  { id: "dark", label: "Blueberry Night", hint: "Sombre", icon: Moon },
  { id: "system", label: "Système", hint: "Suit ton appareil", icon: Monitor },
];

const WALLPAPERS: { id: WallpaperChoice; label: string; preview: string }[] = [
  { id: "auto", label: "Auto", preview: "linear-gradient(135deg, #c9b6f2 0 50%, #241a3d 50% 100%)" },
  { id: "pastel", label: "Ciel pastel", preview: "var(--wp-pastel)" },
  { id: "night", label: "Nuit étoilée", preview: "var(--wp-night)" },
  { id: "sunset", label: "Coucher de soleil", preview: "var(--wp-sunset)" },
];

/** parametres.cpl — thème, fond d'écran, sons et outils système. */
export function SettingsApp() {
  const theme = useSettingsStore((s) => s.theme);
  const setTheme = useSettingsStore((s) => s.setTheme);
  const wallpaper = useSettingsStore((s) => s.wallpaper);
  const setWallpaper = useSettingsStore((s) => s.setWallpaper);
  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const toggleSound = useSettingsStore((s) => s.toggleSound);
  const resetLayout = useDesktopStore((s) => s.resetLayout);

  return (
    <div className="@container space-y-6 p-5">
      <section className="space-y-3">
        <SectionTitle>Thème</SectionTitle>
        <div role="radiogroup" aria-label="Thème" className="grid gap-2 @sm:grid-cols-3">
          {THEMES.map(({ id, label, hint, icon: Icon }) => (
            <OptionCard key={id} checked={theme === id} onSelect={() => setTheme(id)}>
              <Icon className="size-5 text-bubblegum-500" aria-hidden />
              <span className="font-pixel text-sm leading-tight">{label}</span>
              <span className="text-xs text-fg-muted">{hint}</span>
            </OptionCard>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <SectionTitle>Fond d&apos;écran</SectionTitle>
        <div role="radiogroup" aria-label="Fond d'écran" className="grid grid-cols-2 gap-2 @sm:grid-cols-4">
          {WALLPAPERS.map(({ id, label, preview }) => (
            <OptionCard key={id} checked={wallpaper === id} onSelect={() => setWallpaper(id)}>
              <span
                aria-hidden
                className="h-12 w-full rounded-control border-2 border-window-border"
                style={{ background: preview }}
              />
              <span className="font-pixel text-xs leading-tight">{label}</span>
            </OptionCard>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <SectionTitle>Sons</SectionTitle>
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-fg-muted">
            Petits sons d&apos;interface (clics, ouverture de fenêtres).
          </p>
          <PixelButton
            size="sm"
            onClick={() => {
              // Petit « ding » de confirmation à l'activation.
              if (!soundEnabled) playSound("enable", { force: true });
              toggleSound();
            }}
            aria-pressed={soundEnabled}
          >
            {soundEnabled ? <Volume2 className="size-4" aria-hidden /> : <VolumeX className="size-4" aria-hidden />}
            {soundEnabled ? "Activés" : "Coupés"}
          </PixelButton>
        </div>
      </section>

      <section className="space-y-3">
        <SectionTitle>Système</SectionTitle>
        <div className="flex flex-wrap gap-2">
          <PixelButton size="sm" onClick={() => window.dispatchEvent(new Event(REPLAY_BOOT_EVENT))}>
            <Play className="size-4" aria-hidden />
            Rejouer le démarrage
          </PixelButton>
          <PixelButton
            size="sm"
            onClick={() => {
              resetLayout();
              toast("Bureau rangé ✨", { description: "Les fenêtres ont retrouvé leur place." });
            }}
          >
            <LayoutGrid className="size-4" aria-hidden />
            Réinitialiser les fenêtres
          </PixelButton>
        </div>
      </section>

      <p className="font-pixel border-t-2 border-dashed border-window-border pt-4 text-center text-xs text-fg-muted">
        Emma OS · version 2026 · fait main avec Next.js, Tailwind, Motion et Zustand ♥
      </p>
    </div>
  );
}

function OptionCard({
  checked,
  onSelect,
  children,
}: {
  checked: boolean;
  onSelect: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={checked}
      onClick={onSelect}
      className={cn(
        "relative flex flex-col items-center gap-1.5 rounded-window border-2 p-3 text-center transition-colors",
        checked
          ? "border-bubblegum-500 bg-surface-hover shadow-pixel-sm"
          : "border-window-border bg-card hover:bg-surface",
      )}
    >
      {checked && (
        <span className="absolute top-1 right-1 flex size-4 items-center justify-center rounded-full bg-bubblegum-500 text-white">
          <Check className="size-3" strokeWidth={3} aria-hidden />
        </span>
      )}
      {children}
    </button>
  );
}
