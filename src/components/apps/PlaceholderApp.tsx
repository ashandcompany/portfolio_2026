import { Construction } from "lucide-react";

/** Contenu temporaire, remplacé par les vraies apps au lot 4. */
export function PlaceholderApp({ title }: { title: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
      <Construction className="size-10 text-fg-muted" aria-hidden />
      <p className="font-pixel text-lg">{title}</p>
      <p className="text-sm text-fg-muted">Cette application arrive bientôt…</p>
    </div>
  );
}
