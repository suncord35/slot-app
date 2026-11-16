import type { ComponentType } from "react";

/** 機種ごとのテーマカラー */
export type MachineTheme = {
  /** ＋ボタン・開閉矢印などのメイン色 */
  accent: string;
  /** ＋ボタンを押している間の色 */
  accentActive: string;
  /** サブタイトルなどの差し色 */
  sub: string;
};

/** 機種の種類（normal: ノーマル機 / at: AT機） */
export type MachineCategory = "normal" | "at";

/** 機種一覧（machines/index.ts）に登録する1機種分の情報 */
export type MachineEntry = {
  /** URL に使う名前（例: "hanabi" → /hanabi） */
  slug: string;
  /** 表示名（例: "スマスロ ハナビ"） */
  name: string;
  /** 機種の種類。機種選択画面のグループ分けに使う */
  category: MachineCategory;
  /** 検索用の別名（ひらがな・略称など）。例: ["はなび", "花火"] */
  keywords: readonly string[];
  /** 判別対象の設定（例: [1, 2, 5, 6]）。機種選択画面に表示する */
  settings: readonly number[];
  theme: MachineTheme;
  /** 機種ページの画面本体 */
  Screen: ComponentType;
};
