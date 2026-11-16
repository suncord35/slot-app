"use client";

import { useSavedAt } from "@/lib/storage";

/** 機種選択画面のカードに出す「途中のデータあり」の印 */
export function SavedBadge({ slug }: { slug: string }) {
  const savedAt = useSavedAt(slug);
  if (!savedAt) return null;

  const date = new Date(savedAt);
  const label = `${date.getMonth() + 1}/${date.getDate()} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;

  return (
    <span className="mt-2 inline-flex w-fit items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-xs font-bold text-white/90">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
      途中のデータあり（{label}）
    </span>
  );
}
