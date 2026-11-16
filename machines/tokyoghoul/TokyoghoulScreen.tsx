"use client";

import { useState } from "react";
import { BackToList } from "@/components/BackToList";
import { CollapsibleSection } from "@/components/CollapsibleSection";
import { FlagGrid } from "@/components/FlagGrid";
import { ResetButton } from "@/components/ResetButton";
import { ResultPanel } from "@/components/ResultPanel";
import { judgeSettings, type CountElement } from "@/lib/judge";
import { useSavedState } from "@/lib/storage";
import { themeStyle } from "@/lib/theme";
import {
  TOKYOGHOUL_CZ_RANGE,
  TOKYOGHOUL_SETTINGS,
  tokyoghoulFlagGroups,
  tokyoghoulRates,
  tokyoghoulTheme,
} from "./data";
import { intervalFrom, resetsCounter, summarize, type HistoryItem, type HitType } from "./logic";

const HIT_LABEL: Record<HitType, string> = {
  remFail: "レミニ✕",
  remAT: "レミニ→AT",
  rizeFail: "利世✕",
  rizeAT: "利世→AT",
  episode: "エピボ",
};

/** 入力項目の初期値（この内容がスマホ内に自動保存される） */
const INITIAL = {
  history: [] as HistoryItem[],
  currentGames: "", // 今の液晶ゲーム数
  flags: {} as Record<string, boolean>,
};

export function TokyoghoulScreen() {
  const { state: v, setState, update, reset } = useSavedState("tokyoghoul", INITIAL);
  const [inputGames, setInputGames] = useState("");
  const [inputError, setInputError] = useState("");

  const addHistory = (type: HitType) => {
    const displayed = Number(inputGames);
    if (!inputGames || displayed <= 0) {
      setInputError("当選した時の液晶ゲーム数を入れてから押してください。");
      return;
    }
    const interval = intervalFrom(v.history, displayed);
    if (interval === null) {
      setInputError("前回のCZ（失敗）の時より大きい液晶ゲーム数を入れてください。");
      return;
    }
    setState((prev) => ({
      ...prev,
      history: [...prev.history, { inputGames: displayed, interval, type }],
      // ATに当たると液晶は0に戻るので、今のゲーム数も空に戻す
      currentGames: resetsCounter(type) ? "" : prev.currentGames,
    }));
    setInputGames("");
    setInputError("");
  };

  const popHistory = () => setState((prev) => ({ ...prev, history: prev.history.slice(0, -1) }));

  const s = summarize(v.history, Number(v.currentGames));
  const hasGames = s.normalGames > 0;

  // --- 判定に使う要素 ---
  const elements = {
    at: { games: s.normalGames, count: hasGames ? String(s.atViaCzCount) : "", rates: tokyoghoulRates.atExceptEpisode },
    episode: { games: s.normalGames, count: hasGames ? String(s.episodeCount) : "", rates: tokyoghoulRates.episode },
    rize: { games: s.normalGames, count: hasGames ? String(s.rizeCount) : "", rates: tokyoghoulRates.rize },
    within100: { games: s.within100Trials, count: String(s.within100Hits), rates: tokyoghoulRates.within100 },
  } satisfies Record<string, CountElement>;

  const deniedSettings = tokyoghoulFlagGroups
    .flatMap((group) => group.flags)
    .filter((flag) => v.flags[flag.id])
    .flatMap((flag) => flag.denies);

  const judge = judgeSettings({
    settings: TOKYOGHOUL_SETTINGS,
    elements: Object.values(elements),
    deniedSettings,
  });

  const flagsOn = Object.values(v.flags).filter(Boolean).length;
  const hasAnyInput = judge.usedElements > 0 || flagsOn > 0;

  const per = (count: number) => (count > 0 ? (s.normalGames / count).toFixed(1) : null);
  const atRate = per(s.atCount);
  const czRate = per(s.czCount);

  const hitButton = "min-h-12 rounded-lg font-bold";

  return (
    <main className="min-h-screen bg-slate-950 p-3 sm:p-6" style={themeStyle(tokyoghoulTheme)}>
      <div className="max-w-md mx-auto bg-neutral-900 text-white rounded-xl shadow p-5">
        <div className="flex items-center justify-between gap-2 mb-2">
          <BackToList />
          <ResetButton
            onReset={() => {
              reset();
              setInputGames("");
              setInputError("");
            }}
          />
        </div>
        <h1 className="text-white font-bold mb-6 text-center">
          <span className="block text-3xl">L 東京喰種</span>
          <span className="block text-2xl mt-1 text-[var(--sub)]">設定判別ツール</span>
        </h1>

        {/* ▼ 当選履歴 */}
        <section className="rounded-lg border border-white/10 bg-black/30 p-4 mb-2">
          <h2 className="font-bold text-lg text-white mb-1">▼ CZ・AT の当選履歴</h2>
          <p className="text-[11px] text-white/60 mb-3">
            当選した時の「液晶ゲーム数」を入れて、種類を押してください。CZ失敗の後は液晶の数字をそのまま（続きの数字で）入れればOKです
          </p>
          <input
            type="number"
            inputMode="numeric"
            value={inputGames}
            onChange={(e) => setInputGames(e.target.value)}
            className="w-full rounded-lg border border-white/20 bg-black/30 p-3 text-center text-2xl font-bold text-white placeholder:text-white/30 mb-3"
            placeholder="例: 180"
          />
          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={() => addHistory("remAT")} className={`${hitButton} bg-[var(--accent)] text-white active:bg-[var(--accent-active)]`}>
              レミニセンス
              <span className="block text-xs">成功（AT）</span>
            </button>
            <button type="button" onClick={() => addHistory("remFail")} className={`${hitButton} border-2 border-white/30 text-white/80 active:bg-white/10`}>
              レミニセンス
              <span className="block text-xs">失敗</span>
            </button>
            <button type="button" onClick={() => addHistory("rizeAT")} className={`${hitButton} bg-[var(--accent)] text-white active:bg-[var(--accent-active)]`}>
              大喰いの利世
              <span className="block text-xs">成功（AT）</span>
            </button>
            <button type="button" onClick={() => addHistory("rizeFail")} className={`${hitButton} border-2 border-white/30 text-white/80 active:bg-white/10`}>
              大喰いの利世
              <span className="block text-xs">失敗</span>
            </button>
            <button type="button" onClick={() => addHistory("episode")} className={`${hitButton} col-span-2 border-2 border-[var(--accent)] text-[var(--sub)] active:bg-white/10`}>
              エピソードボーナス
            </button>
          </div>
          {inputError && <p className="mt-2 text-sm font-bold text-red-300">{inputError}</p>}

          {v.history.length > 0 && (
            <div className="mt-4">
              <div className="flex flex-wrap gap-1.5">
                {v.history.map((item, index) => (
                  <span
                    key={index}
                    className={`rounded-full px-2 py-1 text-xs font-bold ${resetsCounter(item.type) ? "bg-[var(--accent)]/30 text-[var(--sub)]" : "bg-white/10 text-white/70"}`}
                  >
                    {index + 1}. {item.inputGames}G {HIT_LABEL[item.type]}
                  </span>
                ))}
              </div>
              <button type="button" onClick={popHistory} className="mt-2 min-h-11 w-full text-right text-xs text-white/60 underline">
                直前の入力を消す
              </button>
            </div>
          )}

          <div className="mt-4 border-t border-white/10 pt-3">
            <label className="block text-sm font-bold text-white mb-1">今の液晶ゲーム数（任意）</label>
            <input
              type="number"
              inputMode="numeric"
              value={v.currentGames}
              onChange={(e) => update("currentGames")(e.target.value)}
              className="w-full rounded-lg border border-white/20 bg-black/30 p-2 text-center text-xl font-bold text-white placeholder:text-white/30"
              placeholder="0"
            />
            <p className="text-[11px] text-white/60 mt-1">※当たっていないハマり分も計算に入ります。ヤメる前に入れると、より正確になります</p>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 rounded-lg bg-black/30 p-3 text-sm">
            <p>
              通常時合計：<span className="font-bold">{s.normalGames}</span>G
            </p>
            <p>
              AT：<span className="font-bold">{s.atCount}</span>回 / CZ：<span className="font-bold">{s.czCount}</span>回
            </p>
            <p>
              AT初当り：<span className="font-bold text-[var(--sub)]">{atRate ? `1/${atRate}` : "-"}</span>
            </p>
            <p>
              100G以内：
              <span className="font-bold text-[var(--sub)]">
                {s.within100Trials > 0 ? `${s.within100Hits}/${s.within100Trials}回` : "-"}
              </span>
            </p>
          </div>
          <p className="text-[11px] text-white/60 mt-2">
            ※「100G以内」は、前回のCZ・ATから100G以内に当選した回数です（自動で数えます）。朝イチの1回目は、設定変更の有無でズレることがあります
          </p>
        </section>

        {/* ▼ 確定・否定 */}
        <CollapsibleSection title={`確定・否定演出（出たらON）${flagsOn > 0 ? `：${flagsOn}件ON` : ""}`}>
          <div className="space-y-4">
            {tokyoghoulFlagGroups.map((group) => (
              <div key={group.title}>
                <h3 className="mb-2 text-sm font-bold text-white/80">{group.title}</h3>
                <FlagGrid
                  items={group.flags}
                  values={v.flags}
                  onToggle={(id, next) => setState((prev) => ({ ...prev, flags: { ...prev.flags, [id]: next } }))}
                />
              </div>
            ))}
          </div>
        </CollapsibleSection>

        {/* 判定結果の表示 */}
        {hasAnyInput && (
          <ResultPanel
            judge={judge}
            rateLines={[
              { label: "AT初当り", rate: atRate, suffix: `(${s.normalGames}G)` },
              {
                label: "100G以内の当選",
                rate: null,
                text: s.within100Trials > 0 ? `${s.within100Hits} / ${s.within100Trials} 回（${((s.within100Hits / s.within100Trials) * 100).toFixed(0)}%）` : undefined,
              },
              { label: "大喰いの利世", rate: per(s.rizeCount) },
              { label: "エピソードボーナス", rate: per(s.episodeCount) },
              { label: "CZ合算（参考・計算には不使用）", rate: czRate, suffix: `理論値 ${TOKYOGHOUL_CZ_RANGE}` },
            ]}
          />
        )}

        <p className="mt-6 text-center text-[11px] text-white/50">入力内容はこのスマホ内に自動で保存されます</p>
      </div>
    </main>
  );
}
