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

/** 機種一覧（machines/index.ts）に登録する1機種分の情報 */
export type MachineEntry = {
  /** URL に使う名前（例: "hanabi" → /hanabi） */
  slug: string;
  /** 表示名（例: "スマスロ ハナビ"） */
  name: string;
  /** 判別対象の設定（例: [1, 2, 5, 6]）。機種選択画面に表示する */
  settings: readonly number[];
  theme: MachineTheme;
  /** 機種ページの画面本体 */
  Screen: ComponentType;
};
