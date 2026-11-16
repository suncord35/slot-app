import type { CSSProperties } from "react";
import type { MachineTheme } from "./types";

/**
 * 機種のテーマカラーを CSS 変数として渡す。
 * 共通部品は var(--accent) などを参照するので、機種ごとに色が切り替わる。
 */
export function themeStyle(theme: MachineTheme): CSSProperties {
  return {
    "--accent": theme.accent,
    "--accent-active": theme.accentActive,
    "--sub": theme.sub,
  } as CSSProperties;
}
