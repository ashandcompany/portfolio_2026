import Image from "next/image";
import { profile } from "@/data/profile";
import { cn } from "@/lib/utils";

const sizes = {
  sm: { box: "size-11 text-lg", px: 44 },
  lg: { box: "size-24 text-4xl", px: 96 },
} as const;

/** Photo de profil, ou initiales pixel tant qu'aucune photo n'est renseignée. */
export function Avatar({ size = "sm", className }: { size?: keyof typeof sizes; className?: string }) {
  const { box, px } = sizes[size];
  return (
    <div
      className={cn(
        "font-pixel flex shrink-0 items-center justify-center overflow-hidden rounded-window border-2 border-control-border bg-signature text-fg shadow-pixel-sm",
        box,
        className,
      )}
    >
      {profile.photo ? (
        <Image src={profile.photo} alt={profile.fullName} width={px * 2} height={px * 2} className="size-full object-cover" />
      ) : (
        <span aria-hidden>{profile.firstName[0]}</span>
      )}
    </div>
  );
}
