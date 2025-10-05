export function slugify(s: string) {
    return s
        .toLowerCase()
        .trim()
        .replace(/[ぁ-んァ-ヶｦ-ﾟ一-龠々ー]/g, (c) => c) // 日本語はそのままでもOK（必要ならローマ字化を検討）
        .replace(/\s+/g, '-')       // 空白 → ハイフン
        .replace(/[^\w\-一-龠ぁ-んァ-ヶー]/g, '') // 記号を除去（和文は保持）
        .replace(/\-+/g, '-');
}