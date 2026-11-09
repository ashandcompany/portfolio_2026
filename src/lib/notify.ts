import { toast, type ExternalToast } from "sonner";
import { playSound } from "./sounds";

/** Notification Emma OS : toast Sonner + petit son (si les sons sont activés). */
export function notify(title: string, options?: ExternalToast) {
  playSound("notify");
  return toast(title, options);
}
