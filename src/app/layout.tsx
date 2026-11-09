import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { Nunito, Pixelify_Sans } from "next/font/google";
import { profile } from "@/data/profile";
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

const siteTitle = `${profile.fullName} · ${profile.role}`;
const siteDescription =
  "Portfolio d'Emma Roizot, développeuse web fullstack, en forme de bureau d'ordinateur pastel : projets, expériences, formation et contact.";

/** Icônes : favicon.ico, icon.svg et apple-icon.png dans ce dossier (pixel art « E »). */
export const metadata: Metadata = {
  // Le nom en premier : c'est ce qu'on lit dans un onglet étroit.
  title: { default: siteTitle, template: `%s · ${profile.fullName}` },
  description: siteDescription,
  applicationName: "Emma OS",
  authors: [{ name: profile.fullName, url: profile.links.linkedin }],
  appleWebApp: { title: "Emma OS" },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Emma OS",
    title: siteTitle,
    description: siteDescription,
  },
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
      <body className="h-full overflow-hidden">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
