"use client";

import { useState } from "react";
import { BackToList } from "@/components/BackToList";
import { CollapsibleSection } from "@/components/CollapsibleSection";
import { CounterInput } from "@/components/CounterInput";
import { FlagGrid } from "@/components/FlagGrid";
import { ResetButton } from "@/components/ResetButton";
import { ResultPanel } from "@/components/ResultPanel";
import { judgeSettings, type CountElement } from "@/lib/judge";
import { useSavedState } from "@/lib/storage";
import { themeStyle } from "@/lib/theme";
import {
  MHSUNBREAK_BZ_RANGE,
  MHSUNBREAK_SETTINGS,
  mhsunbreakFlagGroups,
  mhsunbreakRates,
  mhsunbreakTheme,
} from "./data";

/** 入力項目の初期値（この内容がスマホ内に自動保存される） */
const INITIAL = {
  atHistory: [] as number[], // AT当選時の液晶ゲーム数（ATに当たると0に戻る）
  currentGames: "", // 今の液晶ゲーム数
  fukubikiCount: "",
  bzCount: "",
  endWeakCount: "",
  endStrongCount: "",
  flags: {} as Record<string, boolean>,
};

export function MhsunbreakScreen() {
  const { state: v, setState, update, reset } = useSavedState("mhsunbreak", INITIAL);
  const [inputGames, setInputGames] = useState("");
  const [inputError, setInputError] = useState("");

  const addAt = () => {
    const games = Number(inputGames);
    if (!inputGames || games <= 0) {
      setInputError("ATに当選した時の液晶ゲーム数を入れてから押してください。");
      return;
    }
    // ATに当たると液晶は0に戻るので、今のゲーム数も空に戻す
    setState((prev) => ({ ...prev, atHistory: [...prev.atHistory, games], currentGames: "" }));
    setInputGames("");
    setInputError("");
  };

  const popAt = () => setState((prev) => ({ ...prev, atHistory: prev.atHistory.slice(0, -1) }));

  const atCount = v.atHistory.length;
  const currentNum = Math.max(0, Number(v.currentGames) || 0);
  const normalGames = v.atHistory.reduce((sum, g) => sum + g, 0) + currentNum;
  const hasGames = normalGames > 0;

  // --- 判定に使う要素 ---
  const weak = Number(v.endWeakCount || 0);
  const endEntered = v.endWeakCount !== "" || v.endStrongCount !== "";
  const endTooMany = endEntered && weak + Number(v.endStrongCount || 0) > atCount;

  const elements = {
    at: { games: normalGames, count: hasGames ? String(atCount) : "", rates: mhsunbreakRates.at },
    fukubiki: { games: normalGames, count: v.fukubikiCount, rates: mhsunbreakRates.fukubiki },
    endWeak: { games: atCount, count: endEntered ? String(weak) : "", rates: mhsunbreakRates.endWeak },
    endStrong: {
      games: atCount - weak,
      count: endEntered ? String(Number(v.endStrongCount || 0)) : "",
      rates: mhsunbreakRates.endStrongExceptWeak,
    },
  } satisfies Record<string, CountElement>;

  const deniedSettings = mhsunbreakFlagGroups
    .flatMap((group) => group.flags)
    .filter((flag) => v.flags[flag.id])
    .flatMap((flag) => flag.denies);

  const judge = judgeSettings({
    settings: MHSUNBREAK_SETTINGS,
    elements: Object.values(elements),
    deniedSettings,
  });

  const flagsOn = Object.values(v.flags).filter(Boolean).length;
  const hasAnyInput = judge.usedElements > 0 || flagsOn > 0;

  const per = (count: number) => (hasGames && count > 0 ? (normalGames / count).toFixed(1) : null);

  return (
    <main className="min-h-screen bg-slate-950 p-3 sm:p-6" style={themeStyle(mhsunbreakTheme)}>
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
          <span className="block text-2xl">モンスターハンターライズ</span>
          <span className="block text-2xl">サンブレイク</span>
          <span className="block text-2xl mt-1 text-[var(--sub)]">設定判別ツール</span>
        </h1>

        {/* ▼ AT当選履歴 */}
        <section className="rounded-lg border border-white/10 bg-black/30 p-4 mb-2">
          <h2 className="font-bold text-lg text-white mb-1">▼ ATの当選履歴</h2>
          <p className="text-[11px] text-white/60 mb-3">ATに当選した時の「液晶ゲーム数」を入れて、ボタンを押してください</p>
          <div className="flex items-center gap-2">
            <input
              type="number"
              inputMode="numeric"
              value={inputGames}
              onChange={(e) => setInputGames(e.target.value)}
              className="min-w-0 flex-1 rounded-lg border border-white/20 bg-black/30 p-3 text-center text-2xl font-bold text-white placeholder:text-white/30"
              placeholder="例: 320"
            />
            <button
              type="button"
              onClick={addAt}
              className="min-h-14 shrink-0 rounded-lg bg-[var(--accent)] px-4 font-bold text-white active:bg-[var(--accent-active)]"
            >
              AT当選
            </button>
          </div>
          {inputError && <p className="mt-2 text-sm font-bold text-red-300">{inputError}</p>}

          {atCount > 0 && (
            <div className="mt-4">
              <div className="flex flex-wrap gap-1.5">
                {v.atHistory.map((games, index) => (
                  <span key={index} className="rounded-full bg-[var(--accent)]/30 px-2 py-1 text-xs font-bold text-[var(--sub)]">
                    {index + 1}. {games}G
                  </span>
                ))}
              </div>
              <button type="button" onClick={popAt} className="mt-2 min-h-11 w-full text-right text-xs text-white/60 underline">
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
              通常時合計：<span className="font-bold">{normalGames}</span>G
            </p>
            <p>
              AT：<span className="font-bold">{atCount}</span>回
            </p>
            <p className="col-span-2">
              AT初当り：<span className="font-bold text-[var(--sub)]">{per(atCount) ? `1/${per(atCount)}` : "-"}</span>
            </p>
          </div>
        </section>

        {/* ▼ CZ */}
        <CollapsibleSection title="CZの回数" defaultOpen>
          <CounterInput label="アイルー福引" value={v.fukubikiCount} setValue={update("fukubikiCount")} />
          <CounterInput label="ブレイクゾーン（参考・計算には不使用）" value={v.bzCount} setValue={update("bzCount")} />
          <p className="text-[11px] text-white/60">※アイルー福引は高設定ほど出やすく、設定1と6で約2.3倍の差があります</p>
        </CollapsibleSection>

        {/* ▼ AT終了画面（高設定示唆） */}
        <CollapsibleSection title="AT終了画面の高設定示唆">
          <p className="text-[11px] text-white/60">※オトモアイルーがいる画面を数えてください。分母はATの回数（履歴から自動）です</p>
          <CounterInput label="フィオレーネ＆オトモアイルー（弱）" value={v.endWeakCount} setValue={update("endWeakCount")} />
          <CounterInput label="チッチェ＆オトモアイルー＆ガルク（強）" value={v.endStrongCount} setValue={update("endStrongCount")} />
          {endTooMany && (
            <p className="text-sm font-bold text-red-300">
              終了画面の回数がATの回数（{atCount}回）より多くなっています。ATの履歴を先に入れてください。
            </p>
          )}
        </CollapsibleSection>

        {/* ▼ 確定・否定 */}
        <CollapsibleSection title={`確定・否定演出（出たらON）${flagsOn > 0 ? `：${flagsOn}件ON` : ""}`}>
          <div className="space-y-4">
            {mhsunbreakFlagGroups.map((group) => (
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
              { label: "AT初当り", rate: per(atCount), suffix: `(${normalGames}G)` },
              { label: "アイルー福引", rate: v.fukubikiCount !== "" && hasGames ? (per(Number(v.fukubikiCount)) ?? "∞") : null },
              {
                label: "終了画面の高設定示唆",
                rate: null,
                text: endEntered && atCount > 0 ? `弱 ${weak}回 / 強 ${Number(v.endStrongCount || 0)}回（AT ${atCount}回中）` : undefined,
              },
              {
                label: "ブレイクゾーン（参考）",
                rate: per(Number(v.bzCount)),
                suffix: `理論値 ${MHSUNBREAK_BZ_RANGE}`,
              },
            ]}
          />
        )}

        <p className="mt-6 text-center text-[11px] text-white/50">入力内容はこのスマホ内に自動で保存されます</p>
      </div>
    </main>
  );
}
