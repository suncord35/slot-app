"use client";

import { useCallback, useMemo, useSyncExternalStore, type SetStateAction } from "react";

/**
 * 入力内容をスマホ内（localStorage）に自動保存する仕組み。
 * 画面が消えたり再読み込みしても、続きから入力できる。
 * 保存先は機種ごとに分かれる（キー: "slot-app:機種名"）。
 */

const PREFIX = "slot-app:";

export function storageKey(slug: string) {
  return `${PREFIX}${slug}`;
}

type Saved<T> = { data: T; savedAt: number };

const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  listeners.add(callback);
  window.addEventListener("storage", callback);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", callback);
  };
}

function notify() {
  listeners.forEach((listener) => listener());
}

function readRaw(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function parse<T>(raw: string | null): Saved<T> | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Saved<T>;
  } catch {
    return null;
  }
}

/** 保存されている日時（なければ null）。機種選択画面の「途中のデータあり」に使う */
export function useSavedAt(slug: string): number | null {
  const key = storageKey(slug);
  const raw = useSyncExternalStore(
    subscribe,
    () => readRaw(key),
    () => null,
  );
  return parse(raw)?.savedAt ?? null;
}

/**
 * 保存される state。使い方は useState とほぼ同じで、
 * update(項目名) で各入力欄用の setter が取り出せる。
 */
export function useSavedState<T extends Record<string, unknown>>(slug: string, initial: T) {
  const key = storageKey(slug);
  const raw = useSyncExternalStore(
    subscribe,
    () => readRaw(key),
    () => null,
  );

  const state = useMemo<T>(() => {
    const saved = parse<T>(raw);
    return saved ? { ...initial, ...saved.data } : initial;
  }, [raw, initial]);

  const setState = useCallback(
    (action: SetStateAction<T>) => {
      const current = parse<T>(readRaw(key));
      const prev = current ? { ...initial, ...current.data } : initial;
      const next = typeof action === "function" ? (action as (p: T) => T)(prev) : action;
      try {
        window.localStorage.setItem(key, JSON.stringify({ data: next, savedAt: Date.now() } satisfies Saved<T>));
      } catch {
        // 保存できない環境（容量不足など）でも、画面の操作は止めない
      }
      notify();
    },
    [key, initial],
  );

  /** 項目ごとの setter（CounterInput などにそのまま渡せる） */
  const update = useCallback(
    <K extends keyof T>(field: K) =>
      (action: SetStateAction<T[K]>) =>
        setState((prev) => ({
          ...prev,
          [field]: typeof action === "function" ? (action as (p: T[K]) => T[K])(prev[field]) : action,
        })),
    [setState],
  );

  /** 入力内容を消して最初の状態に戻す */
  const reset = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
    } catch {
      // 何もしない
    }
    notify();
  }, [key]);

  return { state, setState, update, reset };
}
