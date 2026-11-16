import type { MachineTheme } from "@/lib/types";

/**
 * L 東京喰種 の設定判別データ
 * 出典：1撃・P-town・p-gabu・chonborista（2026/11 確認。3サイト以上で一致した値を採用）
 */

/** 判別対象の設定（下の確率データはすべてこの並び順） */
export const TOKYOGHOUL_SETTINGS = [1, 2, 3, 4, 5, 6] as const;

export const tokyoghoulTheme: MachineTheme = {
  accent: "#7C5CD6",
  accentActive: "#6546BD",
  sub: "#D8CCFF",
};

/** AT初当り確率（分母） */
const AT = [394.4, 380.5, 357.0, 325.9, 291.2, 261.3];
/** エピソードボーナス確率（分母） */
const EPISODE = [6620.2, 5879.7, 5114.5, 4062.5, 3166.7, 2639.5];
/** CZ間・AT間 100G以内のCZ以上当選率（%） */
const WITHIN_100 = [19.58, 21.04, 23.15, 26.37, 31.96, 36.01];

/** 理論値の分母（1/xx の xx）。設定1〜6の順 */
export const tokyoghoulRates = {
  /**
   * エピソードボーナス以外のAT初当り（= AT初当り − エピソードボーナス）。
   * エピソードボーナスは別の要素として数えるので、二重に数えないように引いておく。
   */
  atExceptEpisode: AT.map((at, i) => 1 / (1 / at - 1 / EPISODE[i])),
  /** エピソードボーナス */
  episode: EPISODE,
  /** CZ「大喰いの利世」 */
  rize: [2079.1, 1906.5, 1722.8, 1478.9, 1226.6, 1074.9],
  /** 100G以内の当選（区間あたり） */
  within100: WITHIN_100.map((p) => 100 / p),
};

/** 表示用：CZ合算の理論値（計算には使わない） */
export const TOKYOGHOUL_CZ_RANGE = "1/262.6〜1/203.7";

/** 確定・否定スイッチ（ONにすると denies の設定が消える） */
export type TokyoghoulFlag = { id: string; label: string; hint: string; denies: readonly number[] };

const ABOVE = (min: number) => TOKYOGHOUL_SETTINGS.filter((s) => s < min);

export const tokyoghoulFlagGroups: { title: string; flags: TokyoghoulFlag[] }[] = [
  {
    title: "AT終了画面",
    flags: [
      { id: "endRize", label: "神代利世", hint: "1否定", denies: [1] },
      { id: "endKaneki", label: "金木＆董香", hint: "4以上", denies: ABOVE(4) },
      { id: "endAll", label: "あんていく全員集合", hint: "6濃厚", denies: ABOVE(6) },
    ],
  },
  {
    title: "ナミちゃんトロフィー",
    flags: [
      { id: "trophyCopper", label: "銅", hint: "2以上", denies: ABOVE(2) },
      { id: "trophySilver", label: "銀", hint: "3以上", denies: ABOVE(3) },
      { id: "trophyGold", label: "金", hint: "4以上", denies: ABOVE(4) },
      { id: "trophyGhoul", label: "喰種柄", hint: "5以上", denies: ABOVE(5) },
      { id: "trophyRainbow", label: "虹", hint: "6濃厚", denies: ABOVE(6) },
    ],
  },
  {
    title: "CZ終了時のエンドカード",
    flags: [
      { id: "czSuzuya", label: "鈴屋什造", hint: "偶数濃厚", denies: [1, 3, 5] },
      { id: "czFukurou", label: "梟", hint: "4以上", denies: ABOVE(4) },
      { id: "czArima", label: "有馬貴将", hint: "6濃厚", denies: ABOVE(6) },
    ],
  },
  {
    title: "月山の招待状（通常時50Gごと）",
    flags: [
      { id: "invDeny1", label: "不思議な香りだ…", hint: "1否定", denies: [1] },
      { id: "invDeny2", label: "活字中毒らしいね", hint: "2否定", denies: [2] },
      { id: "invDeny3", label: "本は良いよね…", hint: "3否定", denies: [3] },
      { id: "invDeny4", label: "僕としたことが…", hint: "4否定", denies: [4] },
      { id: "invGold", label: "存分に楽しもう…（金）", hint: "4以上", denies: ABOVE(4) },
      { id: "invRainbow", label: "特別な夜…（虹）", hint: "6濃厚", denies: ABOVE(6) },
    ],
  },
  {
    title: "エンディング中のカード",
    flags: [
      { id: "edCopperSuzuya", label: "銅 鈴屋什造", hint: "1否定", denies: [1] },
      { id: "edCopperTakatsuki", label: "銅 高槻泉", hint: "2否定", denies: [2] },
      { id: "edCopperFukurou", label: "銅 梟", hint: "3否定", denies: [3] },
      { id: "edCopperEto", label: "銅 エト", hint: "4否定", denies: [4] },
      { id: "edSilver", label: "銀 金木研", hint: "3以上", denies: ABOVE(3) },
      { id: "edGoldRize", label: "金 神代利世", hint: "4以上", denies: ABOVE(4) },
      { id: "edGoldOwl", label: "金 隻眼の梟", hint: "5以上", denies: ABOVE(5) },
      { id: "edRainbow", label: "虹 有馬貴将", hint: "6濃厚", denies: ABOVE(6) },
    ],
  },
  {
    title: "AT中の獲得枚数表示",
    flags: [
      { id: "over456", label: "456 OVER", hint: "4以上", denies: ABOVE(4) },
      { id: "over666", label: "666 OVER", hint: "6濃厚", denies: ABOVE(6) },
      { id: "over993", label: "1000-7 OVER", hint: "6濃厚", denies: ABOVE(6) },
    ],
  },
];
