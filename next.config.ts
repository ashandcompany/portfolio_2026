import type { NextConfig } from "next";

/**
 * Environnement de déploiement, fourni par Vercel au build :
 * "production" (branche main), "preview" (autres branches / PR) ou absent en local.
 */
const deployEnv = process.env.VERCEL_ENV ?? "development";
const isProduction = deployEnv === "production";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },

  // Infos de déploiement figées dans le bundle, pour le badge PREVIEW (voir src/lib/deploy.ts).
  env: {
    NEXT_PUBLIC_DEPLOY_ENV: deployEnv,
    NEXT_PUBLIC_DEPLOY_BRANCH: process.env.VERCEL_GIT_COMMIT_REF ?? "",
    NEXT_PUBLIC_DEPLOY_COMMIT: (process.env.VERCEL_GIT_COMMIT_SHA ?? "").slice(0, 7),
  },

  // Hors production, on interdit l'indexation : Vercel ne le fait pas pour un
  // domaine personnalisé rattaché à une branche (ex. staging.mon-domaine.fr).
  async headers() {
    if (isProduction) return [];
    return [
      {
        source: "/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default nextConfig;
