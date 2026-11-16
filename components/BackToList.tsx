import Link from "next/link";

/** 機種ページの左上に出す「← 機種一覧」ボタン */
export function BackToList() {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-1 -ml-2 -mt-2 mb-2 min-h-11 px-2 rounded-lg text-sm font-bold text-white/80 hover:bg-white/10 active:bg-white/15"
    >
      <span aria-hidden="true">←</span>
      機種一覧
    </Link>
  );
}
