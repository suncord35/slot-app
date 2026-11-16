import type { MachineTheme } from "@/lib/types";

/**
 * ジャグラーシリーズの設定判別データ（画面は JugglerScreen.tsx を全機種で共用）
 * 新しいジャグラーを足すときは、ここに1件足して machines/index.ts に登録するだけ。
 *
 * 出典（2026/11 確認）
 * - BIG・REG：1撃・P-WORLD で一致した公表値
 * - ぶどう：公表値がないため推定値（P-town 掲載のガリぞう調べ）
 */

export type JugglerDefinition = {
  slug: string;
  name: string;
  theme: MachineTheme;
  /** 理論値の分母。設定1〜6の順 */
  rates: { bb: number[]; rb: number[]; grape: number[] };
  /** ぶどうの数値についての注意書き */
  grapeNote: string;
};

export const JUGGLER_SETTINGS = [1, 2, 3, 4, 5, 6] as const;

export const neoImJuggler: JugglerDefinition = {
  slug: "neo-im-juggler",
  name: "ネオアイムジャグラーEX",
  theme: { accent: "#D9488F", accentActive: "#BF3A7B", sub: "#FFD54A" },
  rates: {
    bb: [273.1, 269.7, 269.7, 259.0, 259.0, 255.0],
    rb: [439.8, 399.6, 331.0, 315.1, 255.0, 255.0],
    grape: [6.02, 6.02, 6.02, 6.02, 6.02, 5.78],
  },
  grapeNote: "ぶどうは公表値がないため推定値です。設定1〜5はほぼ同じで、設定6だけ出やすくなります。",
};

export const myJuggler6: JugglerDefinition = {
  slug: "my-juggler6",
  name: "マイジャグラーⅥ",
  theme: { accent: "#2F7DE1", accentActive: "#2567BD", sub: "#FFD54A" },
  rates: {
    bb: [273.1, 270.8, 266.4, 254.0, 240.1, 229.1],
    rb: [409.6, 385.5, 336.1, 290.0, 268.6, 229.1],
    grape: [5.9, 5.85, 5.8, 5.78, 5.76, 5.66],
  },
  grapeNote: "ぶどうは前作（マイジャグラーV）の値をもとにした推定値です。Ⅵの設定別の値が出たら更新します。",
};
