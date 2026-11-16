import type { MachineEntry } from "@/lib/types";
import { HanabiScreen } from "./hanabi/HanabiScreen";
import { HANABI_SETTINGS, hanabiTheme } from "./hanabi/data";
import { KabaneriScreen } from "./kabaneri/KabaneriScreen";
import { KABANERI_SETTINGS, kabaneriTheme } from "./kabaneri/data";

/**
 * 機種一覧。新機種はここに1件足す（トップの並び順もこの順番）。
 */
export const machines: MachineEntry[] = [
  {
    slug: "hanabi",
    name: "スマスロ ハナビ",
    settings: HANABI_SETTINGS,
    theme: hanabiTheme,
    Screen: HanabiScreen,
  },
  {
    slug: "kabaneri",
    name: "スマスロ カバネリ 海門決戦",
    settings: KABANERI_SETTINGS,
    theme: kabaneriTheme,
    Screen: KabaneriScreen,
  },
];

export function findMachine(slug: string): MachineEntry | undefined {
  return machines.find((machine) => machine.slug === slug);
}
