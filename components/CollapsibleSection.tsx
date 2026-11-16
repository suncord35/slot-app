"use client";

import { useState, type ReactNode } from "react";

/** 入力項目をカテゴリごとにまとめる開閉式のセクション */
export function CollapsibleSection({
  title,
  defaultOpen = false,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const panelId = `panel-${title.replace(/\s/g, "-")}`;

  return (
    <section className="border-t pt-4 mt-4">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="flex w-full items-center justify-between gap-3 rounded-lg px-1 py-2 text-left font-bold text-lg text-white hover:bg-white/10 active:bg-white/15"
      >
        <span>{title}</span>
        <span
          className={`text-sm text-[var(--accent)] transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          aria-hidden="true"
        >
          ▼
        </span>
      </button>

      {isOpen && (
        <div id={panelId} className="pt-2 space-y-2">
          {children}
        </div>
      )}
    </section>
  );
}
