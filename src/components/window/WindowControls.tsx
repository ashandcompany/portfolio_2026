import { Copy, Minus, Square, X } from "lucide-react";
import { PixelButton } from "@/components/ui/PixelButton";

interface WindowControlsProps {
  title: string;
  isMaximized: boolean;
  onMinimize: () => void;
  onToggleMaximize: () => void;
  onClose: () => void;
}

/** Boutons réduire / agrandir / fermer d'une fenêtre. */
export function WindowControls({
  title,
  isMaximized,
  onMinimize,
  onToggleMaximize,
  onClose,
}: WindowControlsProps) {
  return (
    // `window-no-drag` : un clic sur ces boutons ne déclenche pas le déplacement.
    <div className="window-no-drag flex items-center gap-1" onDoubleClick={(e) => e.stopPropagation()}>
      <PixelButton size="icon" aria-label={`Réduire ${title}`} title="Réduire" onClick={onMinimize}>
        <Minus className="size-3.5" />
      </PixelButton>
      <PixelButton
        size="icon"
        aria-label={`${isMaximized ? "Restaurer" : "Agrandir"} ${title}`}
        title={isMaximized ? "Restaurer" : "Agrandir"}
        onClick={onToggleMaximize}
      >
        {isMaximized ? <Copy className="size-3" /> : <Square className="size-3" />}
      </PixelButton>
      <PixelButton
        size="icon"
        variant="signature"
        aria-label={`Fermer ${title}`}
        title="Fermer"
        onClick={onClose}
      >
        <X className="size-3.5" />
      </PixelButton>
    </div>
  );
}
