/**
 * 機種検索用の文字そろえ。
 * 全角・半角、大文字・小文字、カタカナ・ひらがな、空白の違いを無視して比べられるようにする。
 */
export function normalizeForSearch(text: string): string {
  return text
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[ァ-ヶ]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0x60))
    .replace(/[\s・\-ー]/g, "");
}

/** 検索語が、名前か別名のどれかに含まれていれば true（検索語が空なら常に true） */
export function matchesSearch(query: string, name: string, keywords: readonly string[]): boolean {
  const q = normalizeForSearch(query);
  if (q === "") return true;
  return [name, ...keywords].some((word) => normalizeForSearch(word).includes(q));
}
