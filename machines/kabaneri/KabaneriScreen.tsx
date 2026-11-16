"use client";

import { useState } from "react";
import { BackToList } from "@/components/BackToList";
import { CollapsibleSection } from "@/components/CollapsibleSection";
import { CounterInput } from "@/components/CounterInput";
import { FlagGrid } from "@/components/FlagGrid";
import { ResetButton } from "@/components/ResetButton";
import { ResultPanel } from "@/components/ResultPanel";
import { calculateRate, judgeSettings, type CountElement } from "@/lib/judge";
import { useSavedState } from "@/lib/storage";
import { themeStyle } from "@/lib/theme";
import { KABANERI_SETTINGS, kabaneriFlagGroups, kabaneriRates, kabaneriTheme } from "./data";

type BonusType = "episode" | "surugaST" | "suruga";

/** ボーナス履歴の1件 */
type HistoryItem = {
  /** 当選時の液晶ゲーム数 */
  inputGames: number;
  /** 実際に消化した通常時ゲーム数（駿城スルー後の引き継ぎ分を差し引いた値） */
  actualGames: number;
  type: BonusType;
};

const BONUS_LABEL: Record<BonusType, string> = {
  episode: "エピ",
  surugaST: "駿城→突破",
  suruga: "駿城→スルー",
};

/** 入力項目の初期値（この内容がスマホ内に自動保存される） */
const INITIAL = {
  games: "", // 総ゲーム数（AT中も含む。下段ベルの分母）
  bellCount: "",
  history: [] as HistoryItem[],
  currentGames: "", // 今の液晶ゲーム数（最後の当たりからのハマり）
  femaleCount: "",
  maleCount: "",
  cycle3Arrive: "",
  cycle3Win: "",
  flags: {} as Record<string, boolean>,
};

/** 前回が駿城スルーなら、液晶ゲーム数は引き継がれているので差し引く */
function actualFrom(history: HistoryItem[], displayed: number): number | null {
  const last = history[history.length - 1];
  if (last && last.type === "suruga") {
    return displayed > last.inputGames ? displayed - last.inputGames : null;
  }
  return displayed;
}

export function KabaneriScreen() {
  const { state: v, setState, update, reset } = useSavedState("kabaneri", INITIAL);
  const [inputGames, setInputGames] = useState("");
  const [inputError, setInputError] = useState("");

  // --- ボーナス履歴 ---
  const addHistory = (type: BonusType) => {
    const displayed = Number(inputGames);
    if (!inputGames || displayed <= 0) {
      setInputError("当選時の液晶ゲーム数を入れてから押してください。");
      return;
    }
    const actual = actualFrom(v.history, displayed);
    if (actual === null) {
      setInputError("前回の駿城ボーナス（スルー）の時より大きい液晶ゲーム数を入れてください。");
      return;
    }
    setState((prev) => ({
      ...prev,
      history: [...prev.history, { inputGames: displayed, actualGames: actual, type }],
      currentGames: "",
    }));
    setInputGames("");
    setInputError("");
  };

  const popHistory = () => setState((prev) => ({ ...prev, history: prev.history.slice(0, -1) }));

  // 今のハマり（最後の当たりから、まだ当たっていないゲーム数）も通常時ゲーム数に足す
  const currentNum = Number(v.currentGames);
  const currentActual = v.currentGames !== "" && currentNum > 0 ? (actualFrom(v.history, currentNum) ?? 0) : 0;

  const historyGames = v.history.reduce((sum, item) => sum + item.actualGames, 0);
  const normalGames = historyGames + currentActual;
  const bonusCount = v.history.length;
  const stCount = v.history.filter((item) => item.type !== "suruga").length;

  // --- 判定に使う要素 ---
  const charaTotal = Number(v.femaleCount || 0) + Number(v.maleCount || 0);
  const charaEntered = v.femaleCount !== "" || v.maleCount !== "";

  const elements = {
    bonus: { games: normalGames, count: bonusCount > 0 || currentActual > 0 ? String(bonusCount) : "", rates: kabaneriRates.bonus },
    st: { games: bonusCount, count: String(stCount), rates: kabaneriRates.stPerBonus },
    bell: { games: Number(v.games), count: v.bellCount, rates: kabaneriRates.bell },
    chara: { games: charaTotal, count: charaEntered ? String(Number(v.femaleCount || 0)) : "", rates: kabaneriRates.charaFemale },
    cycle3: { games: Number(v.cycle3Arrive), count: v.cycle3Win, rates: kabaneriRates.cycle3Win },
  } satisfies Record<string, CountElement>;

  const deniedSettings = kabaneriFlagGroups
    .flatMap((group) => group.flags)
    .filter((flag) => v.flags[flag.id])
    .flatMap((flag) => flag.denies);

  const judge = judgeSettings({
    settings: KABANERI_SETTINGS,
    elements: Object.values(elements),
    deniedSettings,
  });

  const flagsOn = Object.values(v.flags).filter(Boolean).length;
  const hasAnyInput = judge.usedElements > 0 || flagsOn > 0;

  const bonusRate = bonusCount > 0 ? (normalGames / bonusCount).toFixed(1) : null;
  const stRate = stCount > 0 ? (normalGames / stCount).toFixed(1) : null;
  const bellRate = calculateRate(Number(v.games), v.bellCount);

  return (
    <main className="min-h-screen bg-slate-950 p-3 sm:p-6" style={themeStyle(kabaneriTheme)}>
      <div className="max-w-md mx-auto bg-zinc-900 text-white rounded-xl shadow p-5">
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
          <span className="block text-3xl">スマスロ カバネリ</span>
          <span className="block text-sm mt-1 text-white/70">海門(うなと)決戦</span>
          <span className="block text-2xl mt-1 text-[var(--sub)]">設定判別ツール</span>
        </h1>

        {/* ▼ ボーナス履歴 */}
        <section className="rounded-lg border border-white/10 bg-black/30 p-4 mb-2">
          <h2 className="font-bold text-lg text-white mb-1">▼ ボーナス履歴</h2>
          <p className="text-[11px] text-white/60 mb-3">当選した時の「液晶ゲーム数」を入れて、当たりの種類を押してください</p>
          <input
            type="number"
            inputMode="numeric"
            value={inputGames}
            onChange={(e) => setInputGames(e.target.value)}
            className="w-full rounded-lg border border-white/20 bg-black/30 p-3 text-center text-2xl font-bold text-white placeholder:text-white/30 mb-3"
            placeholder="例: 250"
          />
          <div className="grid gap-2">
            <button
              type="button"
              onClick={() => addHistory("episode")}
              className="min-h-12 rounded-lg bg-[var(--accent)] font-bold text-slate-950 active:bg-[var(--accent-active)]"
            >
              エピソードボーナス（ST直行）
            </button>
            <button
              type="button"
              onClick={() => addHistory("surugaST")}
              className="min-h-12 rounded-lg border-2 border-[var(--accent)] font-bold text-[var(--accent)] active:bg-white/10"
            >
              駿城 ➔ 突破成功
            </button>
            <button
              type="button"
              onClick={() => addHistory("suruga")}
              className="min-h-12 rounded-lg border-2 border-white/30 font-bold text-white/80 active:bg-white/10"
            >
              駿城 ➔ スルー
            </button>
          </div>
          {inputError && <p className="mt-2 text-sm font-bold text-red-300">{inputError}</p>}

          {v.history.length > 0 && (
            <div className="mt-4">
              <div className="flex flex-wrap gap-1.5">
                {v.history.map((item, index) => (
                  <span
                    key={index}
                    className={`rounded-full px-2 py-1 text-xs font-bold ${item.type === "suruga" ? "bg-white/10 text-white/70" : "bg-[var(--accent)]/20 text-[var(--accent)]"}`}
                  >
                    {index + 1}. {item.inputGames}G {BONUS_LABEL[item.type]}
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
            <p className="text-[11px] text-white/60 mt-1">
              ※最後の当たりから今までのハマり分。入れると初当り確率がより正確になります（次の当たりを登録すると自動で空になります）
            </p>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 rounded-lg bg-black/30 p-3 text-sm">
            <p>
              通常時合計：<span className="font-bold">{normalGames}</span>G
            </p>
            <p>
              ボーナス：<span className="font-bold">{bonusCount}</span>回
            </p>
            <p>
              初当り：<span className="font-bold text-[var(--sub)]">{bonusRate ? `1/${bonusRate}` : "-"}</span>
            </p>
            <p>
              ST：<span className="font-bold text-[var(--sub)]">{stRate ? `1/${stRate}` : "-"}</span>
            </p>
          </div>
        </section>

        {/* ▼ 下段ベル */}
        <CollapsibleSection title="下段ベル" defaultOpen>
          <div className="mb-4">
            <label className="block mb-2 font-bold text-white">総ゲーム数（AT中も含む）</label>
            <input
              type="number"
              inputMode="numeric"
              value={v.games}
              onChange={(e) => update("games")(e.target.value)}
              className="w-full rounded-lg border border-white/20 bg-black/30 p-3 text-2xl font-bold text-white placeholder:text-white/30"
              placeholder="0"
            />
            <p className="text-[11px] text-white/60 mt-1">※下段ベルはAT中も出るので、データカウンターの総回転数を入れてください</p>
          </div>
          <CounterInput label="下段ベル回数" value={v.bellCount} setValue={update("bellCount")} />
        </CollapsibleSection>

        {/* ▼ キャラ紹介 */}
        <CollapsibleSection title="キャラ紹介（カバネリボーナス中）">
          <p className="text-[11px] text-white/60">※女性が多いと偶数設定、男性が多いと設定3・5寄り。美馬は下の「確定・否定」でONにしてください</p>
          <CounterInput label="女性キャラ（無名・菖蒲・鰍＆侑那）" value={v.femaleCount} setValue={update("femaleCount")} />
          <CounterInput label="男性キャラ（生駒・来栖・景之）" value={v.maleCount} setValue={update("maleCount")} />
        </CollapsibleSection>

        {/* ▼ 周期（任意） */}
        <CollapsibleSection title="3周期目のボーナス当選（任意）">
          <p className="text-[11px] text-white/60">※数えなくても大丈夫です。空欄なら計算に入りません</p>
          <CounterInput label="3周期目に到達した回数" value={v.cycle3Arrive} setValue={update("cycle3Arrive")} />
          <CounterInput label="そのうちボーナスに当選した回数" value={v.cycle3Win} setValue={update("cycle3Win")} />
        </CollapsibleSection>

        {/* ▼ 確定・否定 */}
        <CollapsibleSection title={`確定・否定演出（出たらON）${flagsOn > 0 ? `：${flagsOn}件ON` : ""}`}>
          <div className="space-y-4">
            {kabaneriFlagGroups.map((group) => (
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
              { label: "初当り", rate: bonusRate, suffix: `(${normalGames}G)` },
              { label: "ST", rate: stRate },
              { label: "下段ベル", rate: bellRate },
              {
                label: "キャラ紹介",
                rate: null,
                text: charaEntered && charaTotal > 0 ? `女性 ${v.femaleCount || 0} / 男性 ${v.maleCount || 0}（女性 ${((Number(v.femaleCount || 0) / charaTotal) * 100).toFixed(0)}%）` : undefined,
              },
              {
                label: "3周期目の当選",
                rate: null,
                text: Number(v.cycle3Arrive) > 0 && v.cycle3Win !== "" ? `${v.cycle3Win} / ${v.cycle3Arrive} 回（${((Number(v.cycle3Win) / Number(v.cycle3Arrive)) * 100).toFixed(0)}%）` : undefined,
              },
            ]}
          />
        )}

        <p className="mt-6 text-center text-[11px] text-white/50">入力内容はこのスマホ内に自動で保存されます</p>
      </div>
    </main>
  );
}
