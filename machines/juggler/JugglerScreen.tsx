"use client";

import { BackToList } from "@/components/BackToList";
import { CollapsibleSection } from "@/components/CollapsibleSection";
import { CounterInput } from "@/components/CounterInput";
import { ResetButton } from "@/components/ResetButton";
import { ResultPanel } from "@/components/ResultPanel";
import { calculateRate, judgeSettings, type CountElement } from "@/lib/judge";
import { useSavedState } from "@/lib/storage";
import { themeStyle } from "@/lib/theme";
import { JUGGLER_SETTINGS, myJuggler6, neoImJuggler, type JugglerDefinition } from "./data";

/** 入力項目の初期値（この内容がスマホ内に自動保存される） */
const INITIAL = {
  games: "",
  bbCount: "",
  rbCount: "",
  grapeCount: "",
};

/** ジャグラーシリーズ共通の画面。機種ごとの数値と色だけを受け取る */
function JugglerScreen({ machine }: { machine: JugglerDefinition }) {
  const { state: v, update, reset } = useSavedState(machine.slug, INITIAL);

  const gamesNum = Number(v.games);
  const elements = {
    bb: { games: gamesNum, count: v.bbCount, rates: machine.rates.bb },
    rb: { games: gamesNum, count: v.rbCount, rates: machine.rates.rb },
    grape: { games: gamesNum, count: v.grapeCount, rates: machine.rates.grape },
  } satisfies Record<string, CountElement>;

  const judge = judgeSettings({ settings: JUGGLER_SETTINGS, elements: Object.values(elements) });
  const hasAnyInput = judge.usedElements > 0;

  const bonusTotal = Number(v.bbCount || 0) + Number(v.rbCount || 0);
  const totalRate = gamesNum > 0 && bonusTotal > 0 ? (gamesNum / bonusTotal).toFixed(1) : null;
  const grapeRate =
    gamesNum > 0 && Number(v.grapeCount) > 0 ? (gamesNum / Number(v.grapeCount)).toFixed(2) : null;

  return (
    <main className="min-h-screen bg-slate-950 p-3 sm:p-6" style={themeStyle(machine.theme)}>
      <div className="max-w-md mx-auto bg-neutral-900 text-white rounded-xl shadow p-5">
        <div className="flex items-center justify-between gap-2 mb-2">
          <BackToList />
          <ResetButton onReset={reset} />
        </div>
        <h1 className="text-white font-bold mb-6 text-center">
          <span className="block text-3xl">{machine.name}</span>
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
          <p className="text-[11px] text-white/60 mt-1">※データカウンターの総回転数を入れてください</p>
        </div>

        {/* ▼ ボーナス回数 */}
        <div className="space-y-2 border-t border-white/20 pt-4">
          <h2 className="font-bold text-lg text-white mb-2">▼ ボーナス回数</h2>
          <CounterInput label="BIG回数" value={v.bbCount} setValue={update("bbCount")} />
          <CounterInput label="REG回数" value={v.rbCount} setValue={update("rbCount")} />
        </div>

        {/* ▼ ぶどう（任意） */}
        <CollapsibleSection title="ぶどう（任意）">
          <p className="text-[11px] text-white/60">
            ※数えなくても大丈夫です。空欄なら計算に入りません。数える時は、自分で打った分の総ゲーム数と合わせてください
          </p>
          <CounterInput label="ぶどう回数" value={v.grapeCount} setValue={update("grapeCount")} />
          <p className="text-[11px] text-[var(--sub)]">{machine.grapeNote}</p>
        </CollapsibleSection>

        {/* 判定結果の表示 */}
        {hasAnyInput && (
          <ResultPanel
            judge={judge}
            rateLines={[
              { label: "BIG", rate: calculateRate(gamesNum, v.bbCount) },
              { label: "REG", rate: calculateRate(gamesNum, v.rbCount) },
              { label: "ボーナス合算", rate: totalRate },
              { label: "ぶどう", rate: grapeRate },
            ]}
          />
        )}

        <p className="mt-6 text-center text-[11px] text-white/50">入力内容はこのスマホ内に自動で保存されます</p>
      </div>
    </main>
  );
}

export function NeoImJugglerScreen() {
  return <JugglerScreen machine={neoImJuggler} />;
}

export function MyJuggler6Screen() {
  return <JugglerScreen machine={myJuggler6} />;
}
