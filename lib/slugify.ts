export function slugify(s: string): string {
    const ascii = s
        .toLowerCase()
        .trim()
        .replace(/[^\x00-\x7F]/g, '')  // 日本語など非ASCII文字を除去
        .replace(/[^a-z0-9\s-]/g, '')  // 英数字・スペース・ハイフン以外を除去
        .replace(/\s+/g, '-')           // スペース → ハイフン
        .replace(/-+/g, '-')            // 連続ハイフンを統合
        .replace(/^-|-$/g, '');         // 先頭末尾のハイフンを除去

    if (ascii.length >= 2) return ascii;

    // タイトルが日本語のみの場合は日付ベースのスラッグを返す（手動で変更推奨）
    const d = new Date();
    return `post-${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
}