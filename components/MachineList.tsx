"use client";

import Link from "next/link";
import { useState } from "react";
import { SavedBadge } from "@/components/SavedBadge";
import { matchesSearch } from "@/lib/search";
import type { MachineCategory } from "@/lib/types";
import { machines } from "@/machines";

/** グループの見出しと並び順 */
const CATEGORIES: { id: MachineCategory; title: string }[] = [
  { id: "normal", title: "ノーマル機（Aタイプ）" },
  { id: "at", title: "AT機" },
];

/** 機種選択画面の本体：検索欄と、種類ごとの機種カード */
export function MachineList() {
  const [query, setQuery] = useState("");
  const hits = machines.filter((machine) => matchesSearch(query, machine.name, machine.keywords));

  return (
    <div>
      <div className="relative mb-6">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="機種名で検索（例：じゃぐらー）"
          aria-label="機種名で検索"
          className="w-full rounded-xl border border-white/20 bg-black/30 py-3 pl-4 pr-12 text-base font-bold text-white placeholder:font-normal placeholder:text-white/40"
        />
        {query !== "" && (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="検索語を消す"
            className="absolute right-1 top-1/2 h-11 w-11 -translate-y-1/2 rounded-lg text-xl text-white/70 active:bg-white/10"
          >
            ×
          </button>
        )}
      </div>

      {hits.length === 0 && (
        <p className="rounded-xl border border-white/10 bg-black/30 p-4 text-center text-sm text-white/70">
          「{query}」に合う機種は見つかりませんでした
        </p>
      )}

      {CATEGORIES.map((category) => {
        const list = hits.filter((machine) => machine.category === category.id);
        if (list.length === 0) return null;
        return (
          <section key={category.id} className="mb-8">
            <h2 className="mb-3 text-sm font-bold text-white/60">
              {category.title}
              <span className="ml-2 font-normal">{list.length}機種</span>
            </h2>
            <ul className="space-y-3">
              {list.map((machine) => (
                <li key={machine.slug}>
                  <Link
                    href={`/${machine.slug}`}
                    className="flex min-h-20 items-center justify-between gap-3 rounded-xl border-2 bg-black/30 px-5 py-4 transition-colors hover:bg-white/5 active:bg-white/10"
                    style={{ borderColor: machine.theme.accent }}
                  >
                    <span className="flex flex-col">
                      <span className="text-xl font-bold">{machine.name}</span>
                      <span className="mt-1 text-sm font-semibold" style={{ color: machine.theme.sub }}>
                        設定 {machine.settings.join("・")} を判別
                      </span>
                      <SavedBadge slug={machine.slug} />
                    </span>
                    <span className="text-3xl font-bold" style={{ color: machine.theme.accent }} aria-hidden="true">
                      ›
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
