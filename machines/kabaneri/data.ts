import type { MachineTheme } from "@/lib/types";

/**
 * スマスロ 甲鉄城のカバネリ 海門(うなと)決戦 の設定判別データ
 * 出典：1撃・なないろ・P-town・パチセブン（2026/11 確認。3サイト以上で一致した値のみ採用）
 */

/** 判別対象の設定（下の確率データはすべてこの並び順） */
export const KABANERI_SETTINGS = [1, 2, 3, 4, 5, 6] as const;

export const kabaneriTheme: MachineTheme = {
  accent: "#2BB3C0",
  accentActive: "#1E8E99",
  sub: "#E0C068",
};

/** ボーナス初当り確率（分母） */
const BONUS = [254.2, 242.3, 239.6, 214.0, 203.2, 195.1];
/** ST確率（分母） */
const ST = [422.5, 405.9, 398.7, 357.2, 332.6, 318.5];

/** キャラ紹介（カバネリボーナス中）の女性・男性の割合（0〜4000G の値。美馬の分は除いて比率にする） */
const CHARA_FEMALE = [50.0, 57.5, 41.5, 58.5, 39.9, 60.0];
const CHARA_MALE = [50.0, 42.5, 58.5, 41.4, 60.0, 39.85];

/** 3周期到達時のボーナス当選率（%） */
const CYCLE3_WIN = [18.4, 23.8, 21.1, 28.5, 32.4, 37.1];

/** 理論値の分母（1/xx の xx）。設定1〜6の順 */
export const kabaneriRates = {
  /** 通常時ゲーム数あたりのボーナス初当り */
  bonus: BONUS,
  /**
   * ボーナス1回あたりのST突入（= ST確率 ÷ 初当り確率）。
   * 初当りとSTを別々に数えると同じ情報を二重に使うため、この形で計算する。
   */
  stPerBonus: ST.map((st, i) => st / BONUS[i]),
  /** 下段ベル（総ゲーム数あたり。AT中も含む） */
  bell: [121.1, 114.4, 112.8, 106.2, 104.2, 99.1],
  /** キャラ紹介のうち女性キャラが出る割合 */
  charaFemale: CHARA_FEMALE.map((f, i) => (f + CHARA_MALE[i]) / f),
  /** 3周期到達時のボーナス当選 */
  cycle3Win: CYCLE3_WIN.map((p) => 100 / p),
};

/** 確定・否定スイッチ（ONにすると denies の設定が消える） */
export type KabaneriFlag = { id: string; label: string; hint: string; denies: readonly number[] };

const ABOVE = (min: number) => KABANERI_SETTINGS.filter((s) => s < min);

export const kabaneriFlagGroups: { title: string; flags: KabaneriFlag[] }[] = [
  {
    title: "おみくじ",
    flags: [
      { id: "shokichi", label: "小吉", hint: "2以上", denies: ABOVE(2) },
      { id: "chukichi", label: "中吉", hint: "4以上", denies: ABOVE(4) },
      { id: "daikichi", label: "大吉", hint: "6濃厚", denies: ABOVE(6) },
    ],
  },
  {
    title: "アイテムくじ",
    flags: [
      { id: "katana", label: "来栖の刀", hint: "2・3否定", denies: [2, 3] },
      { id: "kendama", label: "無名のけん玉", hint: "1・3否定", denies: [1, 3] },
    ],
  },
  {
    title: "カバネリボーナス中",
    flags: [
      { id: "mumeiVoice", label: "無名特殊ボイス", hint: "2以上", denies: ABOVE(2) },
      { id: "noVoice", label: "ボイス非発生", hint: "5以上", denies: ABOVE(5) },
      { id: "mima", label: "キャラ紹介 美馬", hint: "4以上", denies: ABOVE(4) },
    ],
  },
  {
    title: "ST終了時",
    flags: [
      { id: "mizugi", label: "水着画面", hint: "6濃厚", denies: ABOVE(6) },
      { id: "trophyCopper", label: "銅トロフィー", hint: "2以上", denies: ABOVE(2) },
      { id: "trophySilver", label: "銀トロフィー", hint: "3以上", denies: ABOVE(3) },
      { id: "trophyGold", label: "金トロフィー", hint: "4以上", denies: ABOVE(4) },
      { id: "trophyKirin", label: "キリン柄トロフィー", hint: "5以上", denies: ABOVE(5) },
      { id: "trophyRainbow", label: "虹トロフィー", hint: "6濃厚", denies: ABOVE(6) },
    ],
  },
  {
    title: "カバネリアタック中",
    flags: [
      { id: "plus44", label: "+44 上乗せ", hint: "4以上", denies: ABOVE(4) },
      { id: "plus55", label: "+55 上乗せ", hint: "5以上", denies: ABOVE(5) },
      { id: "plus66", label: "+66 上乗せ", hint: "6濃厚", denies: ABOVE(6) },
      { id: "plus77", label: "+77 上乗せ", hint: "6濃厚", denies: ABOVE(6) },
      { id: "over456", label: "456OVER 表示", hint: "4以上", denies: ABOVE(4) },
      { id: "over666", label: "666OVER 表示", hint: "6濃厚", denies: ABOVE(6) },
    ],
  },
];
