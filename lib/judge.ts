/**
 * 設定判別の計算（全機種共通）
 * ※手順1では、これまでのハナビの計算方法をそのまま移しています。
 */

/** 実測確率（分母）を返す。未入力なら null、0回なら "∞" */
export function calculateRate(totalGames: number, count: string): string | null {
  return totalGames > 0 && count !== ""
    ? Number(count) === 0
      ? "∞"
      : (totalGames / Number(count)).toFixed(1)
    : null;
}

/** 判定に使う1要素 */
export type RateElement = {
  /** 実測確率（calculateRate の結果） */
  actualRate: string | null;
  /** 理論値の分母。機種の settings と同じ並び順で書く */
  rates: readonly number[];
};

export type SettingResult = {
  setting: number;
  totalScore: number;
  /** 設定推測配分（%）。小数1桁の文字列 */
  probability: string;
};

export type JudgeResult = {
  results: SettingResult[];
  /** もっとも近い設定 */
  closest: SettingResult | null;
  /** 全設定のスコア合計（0 なら判定材料なし） */
  combinedTotal: number;
};

export function judgeSettings({
  settings,
  elements,
  deniedSettings = [],
}: {
  settings: readonly number[];
  elements: readonly RateElement[];
  /** 確定要素などで否定された設定（スコアを 0 にする） */
  deniedSettings?: readonly number[];
}): JudgeResult {
  const scored = settings.map((setting, index) => {
    if (deniedSettings.includes(setting)) {
      return { setting, totalScore: 0 };
    }
    const totalScore = elements.reduce((sum, element) => {
      const { actualRate } = element;
      if (!actualRate || actualRate === "∞") return sum;
      const difference = Math.abs(Number(actualRate) - element.rates[index]);
      return sum + 1 / (difference + 0.0001);
    }, 0);
    return { setting, totalScore };
  });

  const combinedTotal = scored.reduce((sum, item) => sum + item.totalScore, 0);

  const results = scored.map((item) => ({
    ...item,
    probability: combinedTotal > 0 ? ((item.totalScore / combinedTotal) * 100).toFixed(1) : "0.0",
  }));

  const closest =
    results.length > 0
      ? results.reduce((prev, current) => (Number(prev.probability) > Number(current.probability) ? prev : current))
      : null;

  return { results, closest, combinedTotal };
}
