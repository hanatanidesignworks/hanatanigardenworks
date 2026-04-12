-- articles テーブルに post_type と display_order を追加
ALTER TABLE articles
  ADD COLUMN IF NOT EXISTS post_type text NOT NULL DEFAULT 'blog',
  ADD COLUMN IF NOT EXISTS display_order integer NOT NULL DEFAULT 0;

-- 既存レコードはすべて 'blog' として扱う
UPDATE articles SET post_type = 'blog' WHERE post_type IS NULL;
