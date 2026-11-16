"use client";

import { useState } from "react";

export type FlagItem = { id: string; label: string; hint: string };

/**
 * 確定・否定スイッチを2列に並べたもの（項目が多い機種向け）。
 * ONにすると赤く光る（ハナビの ConfirmToggle と同じ演出）。
 */
export function FlagGrid({
  items,
  values,
  onToggle,
}: {
  items: FlagItem[];
  values: Record<string, boolean>;
  onToggle: (id: string, next: boolean) => void;
}) {
  const [animatingId, setAnimatingId] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-2 gap-2">
      {items.map((item) => {
        const on = Boolean(values[item.id]);
        return (
          <button
            key={item.id}
            type="button"
            aria-pressed={on}
            onClick={() => {
              onToggle(item.id, !on);
              if (!on) {
                setAnimatingId(item.id);
                window.setTimeout(() => setAnimatingId(null), 600);
              }
            }}
            className={`confirm-box flex min-h-14 flex-col items-start justify-center rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-left ${on ? "confirm-box--checked" : ""} ${animatingId === item.id ? "confirm-box--animate-in" : ""}`}
          >
            <span className="text-sm font-bold text-white">{item.label}</span>
            <span className={`text-[11px] font-bold ${on ? "text-red-200" : "text-white/50"}`}>
              {on ? `ON・${item.hint}` : item.hint}
            </span>
          </button>
        );
      })}
    </div>
  );
}
