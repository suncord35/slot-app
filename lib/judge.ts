/**
 * 設定判別の計算（全機種共通）
 *
 * 考え方：
 *   各設定について「この台がその設定だったら、今回の結果（n ゲーム中 k 回）が
 *   どれくらい起こりやすいか」を要素ごとに計算し、すべて掛け合わせる。
 *   それを全設定の合計で割ったものを「設定推測配分（%）」とする。
 *   （二項分布の尤度。各設定の事前の重みは均等）
 *
 * この方法だと、
 *   - 回したゲーム数が多いほど結果がはっきりする
 *   - 「0回」も判断材料になる
 *   - 全設定で同じ確率の要素は、自然に結果へ影響しない
 */

/** 表示用の実測確率（分母）。未入力なら null、0回なら "∞" */
export function calculateRate(totalGames: number, count: string): string | null {
  return totalGames > 0 && count !== ""
    ? Number(count) === 0
      ? "∞"
      : (totalGames / Number(count)).toFixed(1)
    : null;
}

/** 判定に使う1要素（回数で数える要素） */
export type CountElement = {
  /** 分母になるゲーム数 */
  games: number;
  /** 出現回数。空文字なら未入力として計算から外す */
  count: string;
  /** 理論値の分母（1/xx の xx）。機種の settings と同じ並び順で書く */
  rates: readonly number[];
};

export type SettingResult = {
  setting: number;
  /** 設定推測配分（%）。小数1桁の文字列 */
  probability: string;
};

export type JudgeResult = {
  results: SettingResult[];
  /** もっとも可能性が高い設定（判定材料がなければ null） */
  closest: SettingResult | null;
  /** 判定に使えた要素の数 */
  usedElements: number;
  /** 否定条件で全設定が消えてしまった（入力の矛盾） */
  contradiction: boolean;
};

/** その要素が計算に使えるか（ゲーム数があり、回数が入力済みで、回数 ≦ ゲーム数） */
export function isUsable(element: CountElement): boolean {
  const k = Number(element.count);
  return element.games > 0 && element.count !== "" && Number.isFinite(k) && k >= 0 && k <= element.games;
}

export function judgeSettings({
  settings,
  elements,
  deniedSettings = [],
}: {
  settings: readonly number[];
  elements: readonly CountElement[];
  /** 確定要素などで否定された設定（配分を 0% にする） */
  deniedSettings?: readonly number[];
}): JudgeResult {
  const usable = elements.filter(isUsable);

  // 各設定の対数尤度（掛け算だと数が小さくなりすぎるので、対数にして足し算する）
  const logLikelihoods = settings.map((setting, index) => {
    if (deniedSettings.includes(setting)) return -Infinity;
    return usable.reduce((sum, element) => {
      const n = element.games;
      const k = Number(element.count);
      const p = 1 / element.rates[index];
      return sum + k * Math.log(p) + (n - k) * Math.log(1 - p);
    }, 0);
  });

  const max = Math.max(...logLikelihoods);
  const contradiction = max === -Infinity;
  const weights = logLikelihoods.map((l) => (contradiction ? 0 : Math.exp(l - max)));
  const total = weights.reduce((a, b) => a + b, 0);

  const results = settings.map((setting, index) => ({
    setting,
    probability: total > 0 ? ((weights[index] / total) * 100).toFixed(1) : "0.0",
  }));

  const hasMaterial = !contradiction && (usable.length > 0 || deniedSettings.length > 0);
  const closest = hasMaterial
    ? results.reduce((prev, current) => (Number(current.probability) > Number(prev.probability) ? current : prev))
    : null;

  return { results, closest, usedElements: usable.length, contradiction };
}
