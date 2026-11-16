import type { MachineEntry } from "@/lib/types";
import { HanabiScreen } from "./hanabi/HanabiScreen";
import { HANABI_SETTINGS, hanabiTheme } from "./hanabi/data";
import { KabaneriScreen } from "./kabaneri/KabaneriScreen";
import { KABANERI_SETTINGS, kabaneriTheme } from "./kabaneri/data";
import { TokyoghoulScreen } from "./tokyoghoul/TokyoghoulScreen";
import { TOKYOGHOUL_SETTINGS, tokyoghoulTheme } from "./tokyoghoul/data";
import { MhsunbreakScreen } from "./mhsunbreak/MhsunbreakScreen";
import { MHSUNBREAK_SETTINGS, mhsunbreakTheme } from "./mhsunbreak/data";
import { MyJuggler6Screen, NeoImJugglerScreen } from "./juggler/JugglerScreen";
import { JUGGLER_SETTINGS, myJuggler6, neoImJuggler } from "./juggler/data";

/**
 * 機種一覧。新機種はここに1件足す（トップの並び順もこの順番）。
 */
export const machines: MachineEntry[] = [
  {
    slug: "hanabi",
    name: "スマスロ ハナビ",
    category: "normal",
    keywords: ["はなび", "花火", "hanabi", "アクロス"],
    settings: HANABI_SETTINGS,
    theme: hanabiTheme,
    Screen: HanabiScreen,
  },
  {
    slug: "kabaneri",
    name: "スマスロ カバネリ 海門決戦",
    category: "at",
    keywords: ["かばねり", "甲鉄城", "うなと", "kabaneri", "サミー"],
    settings: KABANERI_SETTINGS,
    theme: kabaneriTheme,
    Screen: KabaneriScreen,
  },
  {
    slug: "tokyoghoul",
    name: "L 東京喰種",
    category: "at",
    keywords: ["とうきょうぐーる", "グール", "ぐーる", "tokyo ghoul"],
    settings: TOKYOGHOUL_SETTINGS,
    theme: tokyoghoulTheme,
    Screen: TokyoghoulScreen,
  },
  {
    slug: "mhsunbreak",
    name: "モンハン ライズ：サンブレイク",
    category: "at",
    keywords: ["もんはん", "モンスターハンター", "さんぶれいく", "サンブレ", "ライズ", "mh", "monster hunter"],
    settings: MHSUNBREAK_SETTINGS,
    theme: mhsunbreakTheme,
    Screen: MhsunbreakScreen,
  },
  {
    slug: neoImJuggler.slug,
    name: neoImJuggler.name,
    category: "normal",
    keywords: ["じゃぐらー", "あいむ", "ねおあいむ", "アイジャグ", "juggler"],
    settings: JUGGLER_SETTINGS,
    theme: neoImJuggler.theme,
    Screen: NeoImJugglerScreen,
  },
  {
    slug: myJuggler6.slug,
    name: myJuggler6.name,
    category: "normal",
    keywords: ["じゃぐらー", "まいじゃぐ", "マイジャグ", "マイジャグ6", "マイジャグラー6", "juggler"],
    settings: JUGGLER_SETTINGS,
    theme: myJuggler6.theme,
    Screen: MyJuggler6Screen,
  },
];

export function findMachine(slug: string): MachineEntry | undefined {
  return machines.find((machine) => machine.slug === slug);
}
