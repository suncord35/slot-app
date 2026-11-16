"use client";

import type { Dispatch, SetStateAction } from "react";

/** 小役などの回数カウンター（− / 数値 / ＋）。色は機種テーマ（--accent）に従う */
export function CounterInput({
  label,
  value,
  setValue,
  labelClassName = "text-neutral-700",
}: {
  label: string;
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  labelClassName?: string;
}) {
  return (
    <div className="mb-4">
      <label className={`block mb-2 font-bold ${labelClassName}`}>{label}</label>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setValue((prev) => String(Math.max(0, Number(prev || 0) - 1)))}
          className="w-12 h-12 rounded-lg border border-[var(--accent)] text-2xl font-bold bg-white text-[var(--accent)] active:bg-neutral-100"
        >
          −
        </button>
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-32 border rounded-lg p-3 text-center text-2xl font-bold"
          placeholder="0"
        />
        <button
          type="button"
          onClick={() => setValue((prev) => String(Number(prev || 0) + 1))}
          className="w-12 h-12 rounded-lg bg-[var(--accent)] text-white text-2xl font-bold active:bg-[var(--accent-active)]"
        >
          ＋
        </button>
      </div>
    </div>
  );
}
