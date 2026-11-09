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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${pixelify.variable} ${nunito.variable} h-full antialiased`}>
      <body className="h-full overflow-hidden">{children}</body>
    </html>
  );
}
