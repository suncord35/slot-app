"use client";

import type { Dispatch, SetStateAction } from "react";

/**
 * 自動計算した値を初期値にして、ズレた時だけ手で直せる入力欄
 * （例：BB中 総ゲーム数 = BIG回数 × 29G）
 */
export function HybridInput({
  label,
  value,
  setValue,
  note,
}: {
  label: string;
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  /** 入力欄の下に出す説明 */
  note?: string;
}) {
  return (
    <div className="mb-3">
      <label className="block text-sm font-bold text-white mb-1">{label}</label>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setValue((prev) => String(Math.max(0, Number(prev || 0) - 1)))}
          className="w-12 h-12 shrink-0 rounded-lg border border-[var(--accent)] text-2xl font-bold bg-white text-[var(--accent)] active:bg-neutral-100"
          aria-label={`${label}を1減らす`}
        >
          −
        </button>
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="min-w-0 flex-1 border rounded-lg p-2 text-center text-xl font-bold"
          placeholder="0"
        />
        <button
          type="button"
          onClick={() => setValue((prev) => String(Number(prev || 0) + 1))}
          className="w-12 h-12 shrink-0 rounded-lg bg-[var(--accent)] text-white text-2xl font-bold active:bg-[var(--accent-active)]"
          aria-label={`${label}を1増やす`}
        >
          ＋
        </button>
      </div>
      {note && <p className="text-[11px] text-taupe-50 mt-1">{note}</p>}
    </div>
  );
}
