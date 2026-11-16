import type { MachineTheme } from "@/lib/types";

/** スマスロ ハナビの設定判別データ */

/** 判別対象の設定（下の確率データはすべてこの並び順） */
export const HANABI_SETTINGS = [1, 2, 5, 6] as const;

export const hanabiTheme: MachineTheme = {
  accent: "#FF6F00",
  accentActive: "#E56500",
  sub: "#FFD700",
};

/** 理論値の分母（設定1・2・5・6の順） */
export const hanabiRates = {
  // 通常時・ボーナス
  bb: [297.9, 292.6, 284.9, 273.1],
  rb: [394.8, 358.1, 313.6, 282.5],
  bellA: [15.3, 14.9, 14.5, 14.1],
  bellB: [15.3, 15.6, 15.3, 15.1],
  iceA: [52.9, 53.5, 49.6, 50.8],
  cherryA1: [99.4, 99.4, 99.3, 99.3],
  cherryA2: [21.0, 19.3, 20.6, 19.9],
  cherryB: [282.5, 281.3, 276.5, 274.2],
  // 花火GAME（RT）中のハズレ
  hgMiss: [13.4, 12.4, 10.1, 9.5],
  // BIG中
  bbBellA: [1.1, 1.13, 1.1, 1.13],
  bbBellB: [11.0, 9.0, 11.0, 9.0],
  bbChance: [16384.0, 16384.0, 16384.0, 655.4],
} as const;

/** BIG 1回あたりの花火GAME（RT）ゲーム数 */
export const HG_GAMES_PER_BIG = 20;

/** BIG 1回あたりのBB中ゲーム数（ノーミス時） */
export const BB_GAMES_PER_BIG = 29;

/** REG中ハズレが出たときに否定される設定 */
export const RB_MISS_DENIES = [1, 2] as const;
