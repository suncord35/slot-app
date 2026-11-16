import type { MachineTheme } from "@/lib/types";

/**
 * スマスロ モンスターハンターライズ：サンブレイク の設定判別データ
 * 出典（2026/11 確認）
 * - AT初当り：1撃・なないろ・アルテマで一致
 * - アイルー福引・ブレイクゾーン：1撃・P-town で一致
 * - AT終了画面の出現率（%）：P-town のみ（他サイトは未掲載。新しい解析が出たら見直す）
 * - 確定・否定演出：1撃・P-town・なないろで一致
 */

/** 判別対象の設定（下の確率データはすべてこの並び順） */
export const MHSUNBREAK_SETTINGS = [1, 2, 3, 4, 5, 6] as const;

export const mhsunbreakTheme: MachineTheme = {
  accent: "#2FA36B",
  accentActive: "#258556",
  sub: "#F2D27A",
};

/** AT終了画面：フィオレーネ＆オトモアイルー（高設定示唆・弱）の出現率（%） */
const END_WEAK = [5.0, 5.0, 5.0, 10.0, 10.0, 10.0];
/** AT終了画面：チッチェ＆オトモアイルー＆ガルク（高設定示唆・強）の出現率（%） */
const END_STRONG = [0.5, 1.0, 2.0, 3.3, 3.9, 5.0];

/** 理論値の分母（1/xx の xx）。設定1〜6の順 */
export const mhsunbreakRates = {
  /** AT初当り（通常時ゲーム数あたり） */
  at: [349.9, 337.0, 319.8, 283.6, 264.0, 242.3],
  /** アイルー福引（通常時ゲーム数あたり） */
  fukubiki: [2290.1, 2090.4, 1821.1, 1472.5, 1219.3, 976.4],
  /** AT終了画面「高設定示唆・弱」（AT終了回数あたり） */
  endWeak: END_WEAK.map((p) => 100 / p),
  /**
   * AT終了画面「高設定示唆・強」。
   * 「弱」が出た回は「強」になりえないので、分母を「AT終了回数 − 弱の回数」にして計算する。
   */
  endStrongExceptWeak: END_STRONG.map((p, i) => (100 - END_WEAK[i]) / p),
};

/** 表示用：ブレイクゾーンの理論値（計算には使わない） */
export const MHSUNBREAK_BZ_RANGE = "1/111.4〜1/95.8";

/** 確定・否定スイッチ（ONにすると denies の設定が消える） */
export type MhsunbreakFlag = { id: string; label: string; hint: string; denies: readonly number[] };

const ABOVE = (min: number) => MHSUNBREAK_SETTINGS.filter((s) => s < min);

export const mhsunbreakFlagGroups: { title: string; flags: MhsunbreakFlag[] }[] = [
  {
    title: "AT終了画面",
    flags: [
      { id: "endDeny2", label: "フィオレーネ＆ロンディーネ", hint: "2否定", denies: [2] },
      { id: "endDeny3", label: "ジェイ＆アルロー＆ガレアス", hint: "3否定", denies: [3] },
      { id: "endHinoe", label: "ヒノエ＆ミノト", hint: "2以上", denies: ABOVE(2) },
      { id: "endAll", label: "全員集合", hint: "5以上", denies: ABOVE(5) },
      { id: "endLion", label: "エンタライオン", hint: "6濃厚", denies: ABOVE(6) },
    ],
  },
  {
    title: "エンタトロフィー",
    flags: [
      { id: "trophyCopper", label: "銅", hint: "2以上", denies: ABOVE(2) },
      { id: "trophySilver", label: "銀", hint: "3以上", denies: ABOVE(3) },
      { id: "trophyGold", label: "金", hint: "4以上", denies: ABOVE(4) },
      { id: "trophyMomiji", label: "紅葉柄", hint: "5以上", denies: ABOVE(5) },
      { id: "trophyRainbow", label: "虹", hint: "6濃厚", denies: ABOVE(6) },
    ],
  },
  {
    title: "エンディング中のスタンプ",
    flags: [
      { id: "stampCopper", label: "銅スタンプ", hint: "2以上", denies: ABOVE(2) },
      { id: "stampSilver", label: "銀スタンプ", hint: "3以上", denies: ABOVE(3) },
      { id: "stampGold", label: "金スタンプ", hint: "4以上", denies: ABOVE(4) },
      { id: "stampMomiji", label: "紅葉柄スタンプ", hint: "5以上", denies: ABOVE(5) },
      { id: "stampRainbow", label: "虹スタンプ", hint: "6濃厚", denies: ABOVE(6) },
    ],
  },
  {
    title: "AT中の獲得枚数表示",
    flags: [
      { id: "over222", label: "222枚 OVER", hint: "2以上", denies: ABOVE(2) },
      { id: "over246", label: "246枚 OVER", hint: "偶数濃厚", denies: [1, 3, 5] },
      { id: "over456", label: "456枚 OVER", hint: "4以上", denies: ABOVE(4) },
      { id: "over555", label: "555枚 OVER", hint: "5以上", denies: ABOVE(5) },
      { id: "over666", label: "666枚 OVER", hint: "6濃厚", denies: ABOVE(6) },
    ],
  },
  {
    title: "盟勇クエスト",
    flags: [{ id: "lionCutin", label: "エンタライオンのカットイン", hint: "6濃厚", denies: ABOVE(6) }],
  },
];
