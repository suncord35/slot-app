"use client";

import { useState } from "react";
import { CollapsibleSection } from "@/components/CollapsibleSection";
import { ConfirmToggle } from "@/components/ConfirmToggle";
import { CounterInput } from "@/components/CounterInput";
import { HybridInput } from "@/components/HybridInput";
import { BackToList } from "@/components/BackToList";
import { ResultPanel } from "@/components/ResultPanel";
import { calculateRate, judgeSettings, type CountElement } from "@/lib/judge";
import { themeStyle } from "@/lib/theme";
import {
  BB_GAMES_PER_BIG,
  HANABI_SETTINGS,
  HG_GAMES_PER_BIG,
  RB_MISS_DENIES,
  hanabiRates,
  hanabiTheme,
} from "./data";

export function HanabiScreen() {
  // --- 各種State ---
  const [games, setGames] = useState("");
  const [bbCount, setBbCount] = useState("");
  const [rbCount, setRbCount] = useState("");
  const [bellACount, setBellACount] = useState("");
  const [bellBCount, setBellBCount] = useState("");
  const [iceACount, setIceACount] = useState("");
  const [cherryA1Count, setCherryA1Count] = useState("");
  const [cherryA2Count, setCherryA2Count] = useState("");
  const [cherryBCount, setCherryBCount] = useState("");
  const [hgMissCount, setHgMissCount] = useState("");

  // BIG中
  const [bbGamesAdjust, setBbGamesAdjust] = useState(0); // BB中ゲーム数の補正（目押しミス分）
  const [bbBellACount, setBbBellACount] = useState("");
  const [bbBellBCount, setBbBellBCount] = useState("");
  const [bbChanceCount, setBbChanceCount] = useState("");

  // 確定フラグ（REG中ハズレ）
  const [hasRbMiss, setHasRbMiss] = useState(false);

  // BB中の総ゲーム数 = BIG回数 × 29G ＋ 補正
  const bbGamesAuto = Number(bbCount) > 0 ? Number(bbCount) * BB_GAMES_PER_BIG : 0;
  const bbGamesNum = Math.max(0, bbGamesAuto + bbGamesAdjust);

  // 花火GAMEのゲーム数（BIG回数 × 20G）
  const calculatedHgGames = Number(bbCount) > 0 ? Number(bbCount) * HG_GAMES_PER_BIG : 0;

  // --- 実測確率 ---
  const totalGamesNum = Number(games);
  const bbRate = calculateRate(totalGamesNum, bbCount);
  const rbRate = calculateRate(totalGamesNum, rbCount);
  const bellARate = calculateRate(totalGamesNum, bellACount);
  const bellBRate = calculateRate(totalGamesNum, bellBCount);
  const iceARate = calculateRate(totalGamesNum, iceACount);
  const cherryA1Rate = calculateRate(totalGamesNum, cherryA1Count);
  const cherryA2Rate = calculateRate(totalGamesNum, cherryA2Count);
  const cherryBRate = calculateRate(totalGamesNum, cherryBCount);
  const hgMissRate = calculateRate(calculatedHgGames, hgMissCount);

  const bbBellARate = calculateRate(bbGamesNum, bbBellACount);
  const bbBellBRate = calculateRate(bbGamesNum, bbBellBCount);
  const bbChanceRate = calculateRate(bbGamesNum, bbChanceCount);

  // --- 総合判定 ---
  const elements: CountElement[] = [
    { games: totalGamesNum, count: bbCount, rates: hanabiRates.bb },
    { games: totalGamesNum, count: rbCount, rates: hanabiRates.rb },
    { games: totalGamesNum, count: bellACount, rates: hanabiRates.bellA },
    { games: totalGamesNum, count: bellBCount, rates: hanabiRates.bellB },
    { games: totalGamesNum, count: iceACount, rates: hanabiRates.iceA },
    { games: totalGamesNum, count: cherryA1Count, rates: hanabiRates.cherryA1 },
    { games: totalGamesNum, count: cherryA2Count, rates: hanabiRates.cherryA2 },
    { games: totalGamesNum, count: cherryBCount, rates: hanabiRates.cherryB },
    { games: calculatedHgGames, count: hgMissCount, rates: hanabiRates.hgMiss },
    { games: bbGamesNum, count: bbBellACount, rates: hanabiRates.bbBellA },
    { games: bbGamesNum, count: bbBellBCount, rates: hanabiRates.bbBellB },
    { games: bbGamesNum, count: bbChanceCount, rates: hanabiRates.bbChance },
  ];

  const judge = judgeSettings({
    settings: HANABI_SETTINGS,
    elements,
    deniedSettings: hasRbMiss ? RB_MISS_DENIES : [],
  });

  const hasAnyInput = judge.usedElements > 0 || hasRbMiss;

  return (
    <main className="min-h-screen bg-neutral-100 p-6" style={themeStyle(hanabiTheme)}>
      <div className="max-w-md mx-auto bg-blue-950 text-white rounded-xl shadow p-6">
        <BackToList />
        <h1 className="text-white font-bold mb-6 text-center">
          <span className="block text-3xl">スマスロ ハナビ</span>
          <span className="block text-2xl mt-1 text-[var(--sub)]">設定判別ツール</span>
        </h1>

        {/* 総ゲーム数入力 */}
        <div className="mb-6">
          <label className="block mb-2 font-bold text-white">総ゲーム数</label>
          <input
            type="number"
            value={games}
            onChange={(e) => setGames(e.target.value)}
            className="w-full border rounded-lg p-3 text-2xl font-bold"
            placeholder="0"
          />
        </div>

        {/* ▼ ボーナス回数 */}
        <div className="space-y-2 border-t pt-4">
          <h2 className="font-bold text-lg text-white mb-2">▼ ボーナス回数</h2>
          <CounterInput label="BIG回数" value={bbCount} setValue={setBbCount} labelClassName="text-white" />
          <CounterInput label="REG回数" value={rbCount} setValue={setRbCount} labelClassName="text-white" />
        </div>

        {/* ▼ 通常時 小役回数 */}
        <CollapsibleSection title="通常時 小役回数">
          <CounterInput label="風鈴A" value={bellACount} setValue={setBellACount} labelClassName="text-white" />
          <CounterInput label="風鈴B" value={bellBCount} setValue={setBellBCount} labelClassName="text-white" />
          <CounterInput label="氷A" value={iceACount} setValue={setIceACount} labelClassName="text-white" />
          <CounterInput label="チェリーA1" value={cherryA1Count} setValue={setCherryA1Count} labelClassName="text-white" />
          <CounterInput label="チェリーA2" value={cherryA2Count} setValue={setCherryA2Count} labelClassName="text-white" />
          <CounterInput label="チェリーB" value={cherryBCount} setValue={setCherryBCount} labelClassName="text-white" />
        </CollapsibleSection>

        {/* ▼ BIG中 小役回数 */}
        <CollapsibleSection title="BIG中 小役回数">
          <div className="bg-slate-950/40 p-4 rounded-lg border border-white/10">
            <HybridInput
              label="BB中 総ゲーム数"
              autoValue={bbGamesAuto}
              adjust={bbGamesAdjust}
              setAdjust={setBbGamesAdjust}
              autoLabel={`BIG回数×${BB_GAMES_PER_BIG}G`}
              note="※目押しをミスしてゲーム数が増えた時だけ ＋ で足してください。BIGが増えても足した分は残ります。"
            />
            <CounterInput label="斜め風鈴 (風鈴B)" value={bbBellBCount} setValue={setBbBellBCount} labelClassName="text-white" />
            <CounterInput label="平行風鈴 (風鈴A)" value={bbBellACount} setValue={setBbBellACount} labelClassName="text-white" />
            <CounterInput label="バラケ目" value={bbChanceCount} setValue={setBbChanceCount} labelClassName="text-white" />
          </div>
        </CollapsibleSection>

        {/* REG中のハズレ */}
        <CollapsibleSection title="REG中のハズレ">
          <ConfirmToggle
            title="REG中にハズレを引いた"
            note="※1回でも出現すれば設定5・6が確定します"
            checked={hasRbMiss}
            onChange={setHasRbMiss}
          />
        </CollapsibleSection>

        {/* RT（花火GAME） */}
        <CollapsibleSection title="RT（花火GAME）">
          <div className="bg-slate-950/40 p-4 rounded-lg border border-white/10">
            <div className="flex justify-between items-center mb-3 text-sm text-white font-semibold">
              <span>花火GAME算出手数：</span>
              <span className="text-base text-white font-bold">{calculatedHgGames} ゲーム</span>
            </div>
            <p className="text-xs text-taupe-50 mb-3">※BIG回数から自動的に「×20G」で計算しています</p>
            <CounterInput label="ハズレ回数" value={hgMissCount} setValue={setHgMissCount} labelClassName="text-white" />
          </div>
        </CollapsibleSection>

        {/* 判定結果の表示 */}
        {hasAnyInput && (
          <ResultPanel
            judge={judge}
            rateLines={[
              { label: "BIG", rate: bbRate },
              { label: "REG", rate: rbRate },
              { label: "風鈴A", rate: bellARate },
              { label: "風鈴B", rate: bellBRate },
              { label: "氷A", rate: iceARate },
              { label: "チェリーA1", rate: cherryA1Rate },
              { label: "チェリーA2", rate: cherryA2Rate },
              { label: "チェリーB", rate: cherryBRate },
              { label: "HGハズレ", rate: hgMissRate, suffix: `(${calculatedHgGames}G)` },
              { label: "BB中 平行風鈴", rate: bbBellARate, suffix: `(${bbGamesNum}G)` },
              { label: "BB中 斜め風鈴", rate: bbBellBRate, suffix: `(${bbGamesNum}G)` },
              { label: "BB中 バラケ目", rate: bbChanceRate, suffix: `(${bbGamesNum}G)` },
            ]}
          />
        )}
      </div>
    </main>
  );
}
