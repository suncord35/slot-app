/** 東京喰種のボーナス履歴の計算（画面と切り離して、テストしやすくしている） */

export type HitType = "remFail" | "remAT" | "rizeFail" | "rizeAT" | "episode";

export type HistoryItem = {
  /** 当選時の液晶ゲーム数（ATに当たるまで 0 に戻らない） */
  inputGames: number;
  /** 前回の当選（CZ・AT）からのゲーム数 */
  interval: number;
  type: HitType;
};

/** ATに当たって液晶ゲーム数が 0 に戻る種類か */
export const resetsCounter = (type: HitType) => type === "remAT" || type === "rizeAT" || type === "episode";

/**
 * 液晶ゲーム数から「前回の当選からのゲーム数」を出す。
 * 前回がCZ失敗なら液晶は続きから数えているので、差を取る。入力が前回以下なら null。
 */
export function intervalFrom(history: HistoryItem[], displayed: number): number | null {
  const last = history[history.length - 1];
  if (last && !resetsCounter(last.type)) {
    return displayed > last.inputGames ? displayed - last.inputGames : null;
  }
  return displayed;
}

export function summarize(history: HistoryItem[], currentDisplayed: number) {
  const currentInterval = currentDisplayed > 0 ? (intervalFrom(history, currentDisplayed) ?? 0) : 0;
  const normalGames = history.reduce((sum, item) => sum + item.interval, 0) + currentInterval;

  const count = (types: HitType[]) => history.filter((item) => types.includes(item.type)).length;

  // 100G以内の当選：当選ごとの区間を1回と数える。今のハマりが100Gを超えていれば「外れ1回」として足す
  const within100Hits = history.filter((item) => item.interval <= 100).length;
  const within100Trials = history.length + (currentInterval > 100 ? 1 : 0);

  return {
    normalGames,
    currentInterval,
    czCount: count(["remFail", "remAT", "rizeFail", "rizeAT"]),
    rizeCount: count(["rizeFail", "rizeAT"]),
    atViaCzCount: count(["remAT", "rizeAT"]),
    episodeCount: count(["episode"]),
    atCount: count(["remAT", "rizeAT", "episode"]),
    within100Hits,
    within100Trials,
  };
}
