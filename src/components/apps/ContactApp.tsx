"use client";

import { Check, Copy, MapPin, Phone, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { profile } from "@/data/profile";
import { isPlaceholder } from "@/lib/utils";
import { GithubIcon, LinkedinIcon } from "@/components/ui/BrandIcons";
import { PixelButton, PixelLink } from "@/components/ui/PixelButton";
import { SectionTitle } from "@/components/ui/SectionTitle";

/** contact.mail — coordonnées façon client mail. */
export function ContactApp() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      toast.success("Adresse copiée ✨", { description: profile.email });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Impossible de copier", { description: `Mon adresse : ${profile.email}` });
    }
  };

  const socials = [
    { label: "LinkedIn", href: profile.links.linkedin, icon: LinkedinIcon },
    { label: "GitHub", href: profile.links.github, icon: GithubIcon },
  ].filter((s) => !isPlaceholder(s.href));

  const mailto = `mailto:${profile.email}?subject=${encodeURIComponent("Contact depuis ton portfolio")}`;

  return (
    <div className="@container space-y-5 p-5">
      {/* En-tête façon nouveau message */}
      <div className="overflow-hidden rounded-window border-2 border-window-border bg-card text-sm">
        <dl className="grid grid-cols-[auto_1fr] items-center gap-x-3 border-b-2 border-window-border bg-titlebar px-3">
          <dt className="font-pixel py-2 text-xs whitespace-nowrap text-fg-muted">À</dt>
          <dd className="flex min-w-0 items-center gap-2 py-1.5">
            <span className="min-w-0 flex-1 truncate font-semibold">{profile.email}</span>
            <PixelButton
              size="icon"
              onClick={copyEmail}
              aria-label="Copier l'adresse e-mail"
              title="Copier l'adresse"
            >
              {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
            </PixelButton>
          </dd>
          <dt className="font-pixel border-t border-window-border py-2 text-xs whitespace-nowrap text-fg-muted">
            Objet
          </dt>
          <dd className="min-w-0 truncate border-t border-window-border py-2 font-semibold">
            Un poste pour Emma ?
          </dd>
        </dl>
        <p className="px-3 py-3 leading-relaxed text-fg-muted">
          Bonjour ! Je suis à la recherche d&apos;un poste de développeuse web. Une opportunité,
          une question ou simplement envie d&apos;échanger ? Écris-moi, je réponds vite 💌
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <PixelLink href={mailto} variant="primary">
          <Send className="size-4" aria-hidden />
          Écrire un mail
        </PixelLink>
        <PixelButton onClick={copyEmail}>
          <Copy className="size-4" aria-hidden />
          Copier l&apos;adresse
        </PixelButton>
      </div>

      <section className="space-y-2">
        <SectionTitle>Ailleurs</SectionTitle>
        <ul className="space-y-1.5 text-sm">
          {socials.map(({ label, href, icon: Icon }) => (
            <li key={label}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-semibold hover:text-bubblegum-500 hover:underline"
              >
                <Icon className="size-4" />
                {label}
              </a>
            </li>
          ))}
          <li className="flex items-center gap-2 text-fg-muted">
            <MapPin className="size-4" aria-hidden />
            {profile.location}
          </li>
          {profile.showPhone && (
            <li className="flex items-center gap-2 text-fg-muted">
              <Phone className="size-4" aria-hidden />
              {profile.phone}
            </li>
          )}
        </ul>
      </section>
    </div>
  );
}
