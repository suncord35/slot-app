"use client";

import { BackToList } from "@/components/BackToList";
import { CollapsibleSection } from "@/components/CollapsibleSection";
import { ConfirmToggle } from "@/components/ConfirmToggle";
import { CounterInput } from "@/components/CounterInput";
import { HybridInput } from "@/components/HybridInput";
import { ResetButton } from "@/components/ResetButton";
import { ResultPanel } from "@/components/ResultPanel";
import { calculateRate, judgeSettings, type CountElement } from "@/lib/judge";
import { useSavedState } from "@/lib/storage";
import { themeStyle } from "@/lib/theme";
import {
  BB_GAMES_PER_BIG,
  HANABI_SETTINGS,
  HG_GAMES_PER_BIG,
  RB_MISS_DENIES,
  hanabiRates,
  hanabiTheme,
} from "./data";

/** 入力項目の初期値（この内容がスマホ内に自動保存される） */
const INITIAL = {
  games: "",
  bbCount: "",
  rbCount: "",
  bellACount: "",
  bellBCount: "",
  iceACount: "",
  cherryA1Count: "",
  cherryA2Count: "",
  cherryBCount: "",
  hgMissCount: "",
  // BIG中
  bbGamesAdjust: 0, // BB中ゲーム数の補正（目押しミス分）
  bbBellACount: "",
  bbBellBCount: "",
  bbChanceCount: "",
  // 確定フラグ
  hasRbMiss: false,
};

export function HanabiScreen() {
  const { state: v, update, reset } = useSavedState("hanabi", INITIAL);

  // BB中の総ゲーム数 = BIG回数 × 29G ＋ 補正
  const bbGamesAuto = Number(v.bbCount) > 0 ? Number(v.bbCount) * BB_GAMES_PER_BIG : 0;
  const bbGamesNum = Math.max(0, bbGamesAuto + v.bbGamesAdjust);

  // 花火GAMEのゲーム数（BIG回数 × 20G）
  const calculatedHgGames = Number(v.bbCount) > 0 ? Number(v.bbCount) * HG_GAMES_PER_BIG : 0;

  // --- 判定に使う要素（分母のゲーム数・回数・理論値） ---
  const totalGamesNum = Number(v.games);
  const elements = {
    bb: { games: totalGamesNum, count: v.bbCount, rates: hanabiRates.bb },
    rb: { games: totalGamesNum, count: v.rbCount, rates: hanabiRates.rb },
    bellA: { games: totalGamesNum, count: v.bellACount, rates: hanabiRates.bellA },
    bellB: { games: totalGamesNum, count: v.bellBCount, rates: hanabiRates.bellB },
    iceA: { games: totalGamesNum, count: v.iceACount, rates: hanabiRates.iceA },
    cherryA1: { games: totalGamesNum, count: v.cherryA1Count, rates: hanabiRates.cherryA1 },
    cherryA2: { games: totalGamesNum, count: v.cherryA2Count, rates: hanabiRates.cherryA2 },
    cherryB: { games: totalGamesNum, count: v.cherryBCount, rates: hanabiRates.cherryB },
    hgMiss: { games: calculatedHgGames, count: v.hgMissCount, rates: hanabiRates.hgMiss },
    bbBellA: { games: bbGamesNum, count: v.bbBellACount, rates: hanabiRates.bbBellA },
    bbBellB: { games: bbGamesNum, count: v.bbBellBCount, rates: hanabiRates.bbBellB },
    bbChance: { games: bbGamesNum, count: v.bbChanceCount, rates: hanabiRates.bbChance },
  } satisfies Record<string, CountElement>;

  const rate = (element: CountElement) => calculateRate(element.games, element.count);

  // --- 総合判定 ---
  const judge = judgeSettings({
    settings: HANABI_SETTINGS,
    elements: Object.values(elements),
    deniedSettings: v.hasRbMiss ? RB_MISS_DENIES : [],
  });

  const hasAnyInput = judge.usedElements > 0 || v.hasRbMiss;

  return (
    <main className="min-h-screen bg-slate-950 p-3 sm:p-6" style={themeStyle(hanabiTheme)}>
      <div className="max-w-md mx-auto bg-blue-950 text-white rounded-xl shadow p-5">
        <div className="flex items-center justify-between gap-2 mb-2">
          <BackToList />
          <ResetButton onReset={reset} />
        </div>
        <h1 className="text-white font-bold mb-6 text-center">
          <span className="block text-3xl">スマスロ ハナビ</span>
          <span className="block text-2xl mt-1 text-[var(--sub)]">設定判別ツール</span>
        </h1>

        {/* 総ゲーム数入力 */}
        <div className="mb-6">
          <label className="block mb-2 font-bold text-white">総ゲーム数</label>
          <input
            type="number"
            inputMode="numeric"
            value={v.games}
            onChange={(e) => update("games")(e.target.value)}
            className="w-full rounded-lg border border-white/20 bg-black/30 p-3 text-2xl font-bold text-white placeholder:text-white/30"
            placeholder="0"
          />
        </div>

        {/* ▼ ボーナス回数 */}
        <div className="space-y-2 border-t border-white/20 pt-4">
          <h2 className="font-bold text-lg text-white mb-2">▼ ボーナス回数</h2>
          <CounterInput label="BIG回数" value={v.bbCount} setValue={update("bbCount")} />
          <CounterInput label="REG回数" value={v.rbCount} setValue={update("rbCount")} />
        </div>

        {/* ▼ 通常時 小役回数 */}
        <CollapsibleSection title="通常時 小役回数">
          <CounterInput label="風鈴A" value={v.bellACount} setValue={update("bellACount")} />
          <CounterInput label="風鈴B" value={v.bellBCount} setValue={update("bellBCount")} />
          <CounterInput label="氷A" value={v.iceACount} setValue={update("iceACount")} />
          <CounterInput label="チェリーA1" value={v.cherryA1Count} setValue={update("cherryA1Count")} />
          <CounterInput label="チェリーA2" value={v.cherryA2Count} setValue={update("cherryA2Count")} />
          <CounterInput label="チェリーB" value={v.cherryBCount} setValue={update("cherryBCount")} />
        </CollapsibleSection>

        {/* ▼ BIG中 小役回数 */}
        <CollapsibleSection title="BIG中 小役回数">
          <div className="bg-black/30 p-4 rounded-lg border border-white/10">
            <HybridInput
              label="BB中 総ゲーム数"
              autoValue={bbGamesAuto}
              adjust={v.bbGamesAdjust}
              setAdjust={update("bbGamesAdjust")}
              autoLabel={`BIG回数×${BB_GAMES_PER_BIG}G`}
              note="※目押しをミスしてゲーム数が増えた時だけ ＋ で足してください。BIGが増えても足した分は残ります。"
            />
            <CounterInput label="斜め風鈴 (風鈴B)" value={v.bbBellBCount} setValue={update("bbBellBCount")} />
            <CounterInput label="平行風鈴 (風鈴A)" value={v.bbBellACount} setValue={update("bbBellACount")} />
            <CounterInput label="バラケ目" value={v.bbChanceCount} setValue={update("bbChanceCount")} />
          </div>
        </CollapsibleSection>

        {/* REG中のハズレ */}
        <CollapsibleSection title="REG中のハズレ">
          <ConfirmToggle
            title="REG中にハズレを引いた"
            note="※1回でも出現すれば設定5・6が確定します"
            checked={v.hasRbMiss}
            onChange={update("hasRbMiss")}
          />
        </CollapsibleSection>

        {/* RT（花火GAME） */}
        <CollapsibleSection title="RT（花火GAME）">
          <div className="bg-black/30 p-4 rounded-lg border border-white/10">
            <div className="flex justify-between items-center mb-3 text-sm text-white font-semibold">
              <span>花火GAME算出手数：</span>
              <span className="text-base text-white font-bold">{calculatedHgGames} ゲーム</span>
            </div>
            <p className="text-xs text-taupe-50 mb-3">※BIG回数から自動的に「×{HG_GAMES_PER_BIG}G」で計算しています</p>
            <CounterInput label="ハズレ回数" value={v.hgMissCount} setValue={update("hgMissCount")} />
          </div>
        </CollapsibleSection>

        {/* 判定結果の表示 */}
        {hasAnyInput && (
          <ResultPanel
            judge={judge}
            rateLines={[
              { label: "BIG", rate: rate(elements.bb) },
              { label: "REG", rate: rate(elements.rb) },
              { label: "風鈴A", rate: rate(elements.bellA) },
              { label: "風鈴B", rate: rate(elements.bellB) },
              { label: "氷A", rate: rate(elements.iceA) },
              { label: "チェリーA1", rate: rate(elements.cherryA1) },
              { label: "チェリーA2", rate: rate(elements.cherryA2) },
              { label: "チェリーB", rate: rate(elements.cherryB) },
              { label: "HGハズレ", rate: rate(elements.hgMiss), suffix: `(${calculatedHgGames}G)` },
              { label: "BB中 平行風鈴", rate: rate(elements.bbBellA), suffix: `(${bbGamesNum}G)` },
              { label: "BB中 斜め風鈴", rate: rate(elements.bbBellB), suffix: `(${bbGamesNum}G)` },
              { label: "BB中 バラケ目", rate: rate(elements.bbChance), suffix: `(${bbGamesNum}G)` },
            ]}
          />
        )}

        <p className="mt-6 text-center text-[11px] text-white/50">入力内容はこのスマホ内に自動で保存されます</p>
      </div>
    </main>
  );
}
