import { cn } from "@/lib/utils";

/** Générateur pseudo-aléatoire déterministe : mêmes étoiles côté serveur et client. */
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const STAR_COLORS = ["#ffffff", "#fdd0e4", "#ddd0fb", "#fff1c2"];

const stars = (() => {
  const rand = seeded(2026);
  return Array.from({ length: 46 }, (_, i) => ({
    id: i,
    top: rand() * 92,
    left: rand() * 100,
    size: 2 + Math.floor(rand() * 3), // taille du « pixel » (2 à 4px)
    delay: rand() * 3,
    color: STAR_COLORS[Math.floor(rand() * STAR_COLORS.length)],
  }));
})();

/** Étoile pixel en croix (5x5 pixels). */
function PixelStar({ px, color }: { px: number; color: string }) {
  return (
    <svg
      width={px * 5}
      height={px * 5}
      viewBox="0 0 5 5"
      shapeRendering="crispEdges"
      aria-hidden
      className="pixelated"
    >
      <path fill={color} d="M2 0h1v2h2v1H3v2H2V3H0V2h2z" />
    </svg>
  );
}

/** Nuage pixel (grille 16x7). */
function PixelCloud({ className, scale = 6 }: { className?: string; scale?: number }) {
  return (
    <svg
      width={16 * scale}
      height={7 * scale}
      viewBox="0 0 16 7"
      shapeRendering="crispEdges"
      aria-hidden
      className={cn("pixelated wallpaper-cloud", className)}
    >
      <path
        fill="#ffffff"
        fillOpacity="0.85"
        d="M5 0h4v1h1v1h2v1h2v1h1v1h1v2H0V5h1V4h1V2h2V1h1z"
      />
      <path fill="#fdd0e4" fillOpacity="0.7" d="M1 5h14v1H1z" />
    </svg>
  );
}

/** Fond d'écran du bureau : dégradé pastel, étoiles scintillantes et nuages pixel. */
export function Wallpaper({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        // `.wallpaper` : dégradé choisi via data-wallpaper / data-theme (globals.css)
        "wallpaper pointer-events-none absolute inset-0 overflow-hidden transition-[background] duration-500",
        className,
      )}
    >
      {/* Grille de pixels très légère pour l'ambiance rétro */}
      <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(#4b3566_1px,transparent_1px),linear-gradient(90deg,#4b3566_1px,transparent_1px)] [background-size:8px_8px]" />

      <PixelCloud className="absolute top-[12%] left-0 animate-drift" scale={7} />
      <PixelCloud
        className="absolute top-[38%] left-0 animate-drift [animation-delay:-25s] [animation-duration:80s]"
        scale={5}
      />
      <PixelCloud
        className="absolute top-[68%] left-0 animate-drift [animation-delay:-50s] [animation-duration:95s]"
        scale={9}
      />

      {stars.map((star) => (
        <span
          key={star.id}
          className="absolute animate-twinkle"
          style={{
            top: `${star.top}%`,
            left: `${star.left}%`,
            animationDelay: `${star.delay}s`,
          }}
        >
          <PixelStar px={star.size} color={star.color} />
        </span>
      ))}
    </div>
  );
}
