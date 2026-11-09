"use client";

import { Bug, FileCode, FileText, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PixelButton } from "@/components/ui/PixelButton";

interface TrashItem {
  name: string;
  size: string;
  kind: "code" | "text";
}

const INITIAL_ITEMS: TrashItem[] = [
  { name: "bug_final_FINAL_v3.js", size: "404 Ko", kind: "code" },
  { name: "code_spaghetti.php", size: "1,2 Mo", kind: "code" },
  { name: "point_virgule_manquant.ts", size: "1 octet", kind: "code" },
  { name: "console_log_ici.js", size: "2 Ko", kind: "code" },
  { name: "mes_doutes_avant_la_demo.txt", size: "12 Ko", kind: "text" },
  { name: "nuit_blanche_debug.log", size: "7,8 Mo", kind: "text" },
];

const STUBBORN_BUG: TrashItem = { name: "bug_qui_revient_toujours.js", size: "1 Ko", kind: "code" };

/** corbeille — easter egg : on vide, un bug revient toujours. */
export function TrashApp() {
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [confirming, setConfirming] = useState(false);
  const [emptiedAt, setEmptiedAt] = useState<number | null>(null);

  // Après avoir vidé la corbeille… un bug revient.
  useEffect(() => {
    if (emptiedAt === null) return;
    const timer = setTimeout(() => {
      setItems([STUBBORN_BUG]);
      toast("🐛 Un bug est revenu", { description: "Comme d'habitude. On ne gagne jamais vraiment." });
    }, 1800);
    return () => clearTimeout(timer);
  }, [emptiedAt]);

  const empty = () => {
    setConfirming(false);
    setItems([]);
    setEmptiedAt(Date.now());
  };

  return (
    <div className="flex min-h-full flex-col">
      <div className="flex items-center justify-between gap-2 border-b-2 border-window-border bg-surface px-3 py-1.5">
        <span className="font-pixel text-xs text-fg-muted">
          {items.length} élément{items.length > 1 ? "s" : ""}
        </span>
        <PixelButton size="sm" disabled={items.length === 0} onClick={() => setConfirming(true)}>
          <Trash2 className="size-3.5" aria-hidden />
          Vider la corbeille
        </PixelButton>
      </div>

      {confirming ? (
        <div role="alertdialog" aria-labelledby="trash-confirm" className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
          <Bug className="size-10 text-bubblegum-500" aria-hidden />
          <p id="trash-confirm" className="font-pixel text-sm">
            Es-tu sûr·e de vouloir supprimer définitivement tous les bugs ?
          </p>
          <div className="flex gap-2">
            <PixelButton size="sm" onClick={() => setConfirming(false)}>Non</PixelButton>
            <PixelButton size="sm" variant="danger" onClick={empty}>Oui, adieu</PixelButton>
          </div>
        </div>
      ) : items.length === 0 ? (
        <p className="font-pixel flex flex-1 items-center justify-center p-6 text-sm text-fg-muted">
          La corbeille est vide… pour l&apos;instant.
        </p>
      ) : (
        <ul className="divide-y divide-dashed divide-window-border p-2">
          {items.map((item) => {
            const Icon = item.kind === "code" ? FileCode : FileText;
            return (
              <li key={item.name} className="flex items-center gap-3 px-2 py-1.5 text-sm">
                <Icon className="size-5 shrink-0 text-fg-muted" aria-hidden />
                <span className="min-w-0 flex-1 truncate">{item.name}</span>
                <span className="font-pixel shrink-0 text-xs text-fg-muted">{item.size}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
