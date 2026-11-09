import { GitBranch } from "lucide-react";
import { deployBranch, deployCommit, deployEnv, isProductionDeploy } from "@/lib/deploy";

/**
 * Pastille affichée dans la barre des tâches hors production :
 * « PREVIEW » sur un déploiement Vercel de test, « LOCAL » sur ta machine.
 * Invisible sur le site en ligne.
 */
export function DeployBadge() {
  if (isProductionDeploy) return null;

  const isPreview = deployEnv === "preview";
  const label = isPreview ? "PREVIEW" : "LOCAL";
  const details = [deployBranch && `branche ${deployBranch}`, deployCommit && `commit ${deployCommit}`]
    .filter(Boolean)
    .join(" · ");

  return (
    <span
      title={isPreview ? `Déploiement de test${details ? ` (${details})` : ""}` : "Version locale"}
      className="font-pixel flex h-6 shrink-0 items-center gap-1 rounded-control border-2 border-warning bg-warning px-1.5 text-xs text-on-pastel"
    >
      {label}
      {isPreview && deployBranch && (
        <span className="hidden max-w-32 items-center gap-0.5 truncate sm:flex">
          <GitBranch className="size-3 shrink-0" aria-hidden />
          <span className="truncate">{deployBranch}</span>
        </span>
      )}
    </span>
  );
}
