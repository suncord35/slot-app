"use client";

import { useState } from "react";

/** 入力リセット。誤タップ防止のため、2回目のタップで実行する */
export function ResetButton({ onReset }: { onReset: () => void }) {
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="min-h-11 rounded-lg border border-white/20 px-3 text-sm font-bold text-white/80 active:bg-white/10"
      >
        リセット
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-bold text-red-300">全部消しますか？</span>
      <button
        type="button"
        onClick={() => {
          onReset();
          setConfirming(false);
        }}
        className="min-h-11 rounded-lg bg-red-600 px-3 text-sm font-bold text-white active:bg-red-700"
      >
        消す
      </button>
      <button
        type="button"
        onClick={() => setConfirming(false)}
        className="min-h-11 rounded-lg border border-white/20 px-3 text-sm font-bold text-white/80 active:bg-white/10"
      >
        やめる
      </button>
    </div>
  );
}
