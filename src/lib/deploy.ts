/**
 * Informations sur le déploiement courant, injectées au build par next.config.ts.
 * - production : site en ligne (branche main)
 * - preview    : déploiement Vercel d'une autre branche ou d'une pull request
 * - development: machine locale (npm run dev / npm run start)
 */
export type DeployEnv = "production" | "preview" | "development";

export const deployEnv = (process.env.NEXT_PUBLIC_DEPLOY_ENV ?? "development") as DeployEnv;
export const deployBranch = process.env.NEXT_PUBLIC_DEPLOY_BRANCH ?? "";
export const deployCommit = process.env.NEXT_PUBLIC_DEPLOY_COMMIT ?? "";
export const isProductionDeploy = deployEnv === "production";
