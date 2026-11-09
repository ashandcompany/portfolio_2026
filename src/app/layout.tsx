import type { Metadata, Viewport } from "next";
import { Nunito, Pixelify_Sans } from "next/font/google";
import "./globals.css";

const pixelify = Pixelify_Sans({
  variable: "--font-pixelify",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Emma OS — Portfolio de développeuse Fullstack",
  description:
    "Bienvenue sur Emma OS : un portfolio en forme de bureau d'ordinateur pastel. Projets, expériences, formation et contact.",
};

export const viewport: Viewport = {
  themeColor: "#c9b6f2",
};

/**
 * Exécuté avant le premier affichage : applique le thème, le fond d'écran et
 * l'état « démarrage déjà vu » sauvegardés, pour éviter tout flash.
 * Clés : voir stores/settings-store.ts (SETTINGS_STORAGE_KEY, BOOT_SEEN_KEY).
 */
const bootstrapScript = `(function(){try{
var d=document.documentElement,ls=window.localStorage;
var s=(JSON.parse(ls.getItem("emma-os:settings")||"{}").state)||{};
var t=s.theme||"light";
if(t==="system")t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";
d.dataset.theme=t;
d.dataset.wallpaper=s.wallpaper||"auto";
if(ls.getItem("emma-os:boot-seen"))d.dataset.booted="";
}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`${pixelify.variable} ${nunito.variable} h-full antialiased`}
      // Les attributs data-* sont posés par le script avant l'hydratation.
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootstrapScript }} />
      </head>
      <body className="h-full overflow-hidden">{children}</body>
    </html>
  );
}
