"use client";

import { useState } from "react";

/**
 * 確定要素（設定否定フラグ）のスイッチ。
 * ONにすると赤く光る演出が入る。否定する設定の処理は呼び出し側（機種画面）で行う。
 */
export function ConfirmToggle({
  title,
  note,
  checked,
  onChange,
}: {
  title: string;
  note?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  const [animating, setAnimating] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const next = event.target.checked;
    onChange(next);
    if (next) {
      setAnimating(true);
      window.setTimeout(() => setAnimating(false), 600);
    }
  };

  return (
    <label
      className={`confirm-box flex items-center gap-3 border p-4 rounded-lg cursor-pointer select-none bg-slate-950/40 border-white/10 ${checked ? "confirm-box--checked" : ""} ${animating ? "confirm-box--animate-in" : ""}`}
    >
      <input type="checkbox" checked={checked} onChange={handleChange} className="w-6 h-6 rounded accent-[#E53935]" />
      <div className="flex flex-col">
        <span className="text-sm font-bold text-white">{title}</span>
        {note && <span className="text-[11px] text-taupe-50 font-medium">{note}</span>}
      </div>
    </label>
  );
}
