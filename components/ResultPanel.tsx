import type { JudgeResult } from "@/lib/judge";

/** 実測確率の一覧に出す1行 */
export type RateLine = {
  label: string;
  /** 実測確率（分母）。null の行は表示しない */
  rate: string | null;
  /** 確率の後ろに付ける補足（例: "(160G)"） */
  suffix?: string;
  /** 確率ではなく、この文字をそのまま表示する（例: 女性 12 / 男性 8） */
  text?: string;
};

/** 判定結果（もっとも可能性が高い設定・設定推測配分・実測確率） */
export function ResultPanel({ judge, rateLines }: { judge: JudgeResult; rateLines: RateLine[] }) {
  const { results, closest, contradiction } = judge;
  const visibleLines = rateLines.filter((line) => line.rate || line.text);

  return (
    <div className="mt-6 border-t border-white/20 pt-4">
      {contradiction && (
        <div className="bg-red-600 text-white rounded-lg p-4 mb-4 text-center font-bold">
          確定要素の組み合わせが矛盾しています。スイッチを見直してください。
        </div>
      )}
      {closest && (
        <div className="rounded-lg border-2 border-[var(--accent)] bg-black/30 p-4 mb-4 text-center">
          <p className="text-sm font-medium text-white/80">現在もっとも可能性が高いのは</p>
          <p className="mt-1 text-3xl font-black text-[var(--sub)]">設定 {closest.setting}</p>
        </div>
      )}

      {/* 各設定の期待度（％） */}
      <h3 className="font-bold mb-2 text-white">設定推測配分</h3>
      <div className="grid grid-cols-2 gap-2 mb-6">
        {results.map((item) => {
          const isTop = closest?.setting === item.setting;
          return (
            <div
              key={item.setting}
              className={`rounded-lg border p-3 text-center ${isTop ? "border-[var(--accent)] bg-white/10" : "border-white/10 bg-black/30"}`}
            >
              <span className="block text-xs font-bold text-white/60">設定 {item.setting}</span>
              <span className={`text-xl font-bold ${isTop ? "text-[var(--sub)]" : "text-white"}`}>{item.probability}%</span>
            </div>
          );
        })}
      </div>

      {/* 実測確率の一覧表示 */}
      {visibleLines.length > 0 && (
        <>
          <h3 className="font-bold mb-2 text-white">現在の実測確率</h3>
          <div className="rounded-lg border border-white/10 bg-black/30 p-4 space-y-1 text-sm font-semibold text-white/90">
            {visibleLines.map((line) => (
              <p key={line.label}>
                {line.label}：{line.text ?? (line.rate === "∞" ? "0回" : `1/${line.rate}`)}
                {line.suffix ? ` ${line.suffix}` : ""}
              </p>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
