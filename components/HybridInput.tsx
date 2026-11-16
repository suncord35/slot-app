"use client";

import type { Dispatch, SetStateAction } from "react";

/**
 * 自動計算した値に、ズレた分だけ「補正」を足せる入力欄
 * （例：BB中 総ゲーム数 = BIG回数 × 29G ＋ 目押しミス分）
 *
 * 補正分は自動値とは別に持つので、あとで BIG 回数が増えても手直しした分は消えない。
 */
export function HybridInput({
  label,
  autoValue,
  adjust,
  setAdjust,
  autoLabel,
  note,
}: {
  label: string;
  /** 自動計算した値 */
  autoValue: number;
  /** 補正（手で足し引きした分） */
  adjust: number;
  setAdjust: Dispatch<SetStateAction<number>>;
  /** 自動値の説明（例: "BIG回数×29G"） */
  autoLabel: string;
  note?: string;
}) {
  const total = autoValue + adjust;
  const isEmpty = autoValue === 0 && adjust === 0;

  return (
    <div className="mb-3">
      <label className="block text-sm font-bold text-white mb-1">{label}</label>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setAdjust((prev) => Math.max(-autoValue, prev - 1))}
          className="w-12 h-12 shrink-0 rounded-lg border border-[var(--accent)] text-2xl font-bold bg-white text-[var(--accent)] active:bg-neutral-100"
          aria-label={`${label}を1減らす`}
        >
          −
        </button>
        <input
          type="number"
          inputMode="numeric"
          value={isEmpty ? "" : String(total)}
          onChange={(e) => {
            const typed = e.target.value === "" ? 0 : Math.max(0, Number(e.target.value) || 0);
            setAdjust(typed - autoValue);
          }}
          className="min-w-0 flex-1 rounded-lg border border-white/20 bg-black/30 p-2 text-center text-xl font-bold text-white placeholder:text-white/30"
          placeholder="0"
        />
        <button
          type="button"
          onClick={() => setAdjust((prev) => prev + 1)}
          className="w-12 h-12 shrink-0 rounded-lg bg-[var(--accent)] text-white text-2xl font-bold active:bg-[var(--accent-active)]"
          aria-label={`${label}を1増やす`}
        >
          ＋
        </button>
      </div>
      <div className="mt-1 flex items-center justify-between gap-2 text-[11px] text-taupe-50">
        <span>
          自動 {autoValue}G（{autoLabel}）
          {adjust !== 0 && (
            <span className="font-bold text-[var(--sub)]">
              {" "}
              ＋ 補正 {adjust > 0 ? "+" : ""}
              {adjust}G
            </span>
          )}
        </span>
        {adjust !== 0 && (
          <button
            type="button"
            onClick={() => setAdjust(0)}
            className="shrink-0 rounded px-2 py-1 font-bold text-white/80 underline active:bg-white/10"
          >
            補正を消す
          </button>
        )}
      </div>
      {note && <p className="text-[11px] text-taupe-50 mt-1">{note}</p>}
    </div>
  );
}
