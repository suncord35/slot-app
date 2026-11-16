import type { JudgeResult } from "@/lib/judge";

/** 実測確率の一覧に出す1行 */
export type RateLine = {
  label: string;
  /** 実測確率（分母）。null の行は表示しない */
  rate: string | null;
  /** 確率の後ろに付ける補足（例: "(160G)"） */
  suffix?: string;
};

/** 判定結果（もっとも近い設定・設定推測配分・実測確率） */
export function ResultPanel({ judge, rateLines }: { judge: JudgeResult; rateLines: RateLine[] }) {
  const { results, closest, contradiction } = judge;

  return (
    <div className="mt-6 border-t pt-4">
      {contradiction && (
        <div className="bg-red-600 text-white rounded-lg p-4 mb-4 text-center font-bold">
          確定要素の組み合わせが矛盾しています。スイッチを見直してください。
        </div>
      )}
      {closest && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 text-center">
          <p className="text-sm text-blue-900 font-medium">現在もっとも近いのは</p>
          <p className="text-3xl font-black text-blue-900 mt-1">設定 {closest.setting}</p>
        </div>
      )}

      {/* 各設定の期待度（％） */}
      <h3 className="font-bold mb-2 text-white">設定推測配分</h3>
      <div className="grid grid-cols-2 gap-2 mb-6">
        {results.map((item) => (
          <div key={item.setting} className="bg-neutral-50 border rounded-lg p-3 text-center">
            <span className="block text-xs text-neutral-500 font-bold">設定 {item.setting}</span>
            <span className="text-xl font-bold text-neutral-800">{item.probability}%</span>
          </div>
        ))}
      </div>

      {/* 実測確率の一覧表示 */}
      <h3 className="font-bold mb-2 text-white">現在の実測確率</h3>
      <div className="bg-gray-100 rounded-lg p-4 space-y-1 text-sm font-semibold text-neutral-700">
        {rateLines.map(
          (line) =>
            line.rate && (
              <p key={line.label}>
                {line.label}：{line.rate === "∞" ? "0回" : `1/${line.rate}`}
                {line.suffix ? ` ${line.suffix}` : ""}
              </p>
            ),
        )}
      </div>
    </div>
  );
}
