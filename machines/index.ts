import type { MachineEntry } from "@/lib/types";
import { HanabiScreen } from "./hanabi/HanabiScreen";
import { hanabiTheme } from "./hanabi/data";

/**
 * 機種一覧。新機種はここに1件足す（トップの並び順もこの順番）。
 */
export const machines: MachineEntry[] = [
  {
    slug: "hanabi",
    name: "スマスロ ハナビ",
    theme: hanabiTheme,
    Screen: HanabiScreen,
  },
];

export function findMachine(slug: string): MachineEntry | undefined {
  return machines.find((machine) => machine.slug === slug);
}
