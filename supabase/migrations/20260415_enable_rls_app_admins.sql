-- app_admins テーブルの RLS 有効化とポリシー設定
--
-- テーブル用途：管理者ユーザーを管理するテーブル
-- 設計方針：
--   - 認証済みユーザーは自分自身のレコードのみ参照可
--   - 書き込み（INSERT / UPDATE / DELETE）はクライアントから不可
--     （サービスロールまたはダッシュボードで直接操作）

-- 1. RLS を有効化
ALTER TABLE public.app_admins ENABLE ROW LEVEL SECURITY;

-- 2. SELECT ポリシー：自分自身のレコードのみ参照可
CREATE POLICY "admins_select_own"
  ON public.app_admins
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- 注意：INSERT / UPDATE / DELETE ポリシーを定義しないことで、
-- anon・authenticated ロールからの書き込みをすべて拒否する。
-- 管理者の追加・削除は Supabase ダッシュボードまたはサービスロールで行うこと。
