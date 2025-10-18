import { supabase } from '@/lib/supabaseClient';
import { notFound } from 'next/navigation';
import { renderMarkdown } from '@/lib/markdown';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

type Article = {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content_md: string;
  cover_url: string | null;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
};

export const revalidate = 60;

export async function generateStaticParams() {
    const { data } = await supabase
        .from('articles')
        .select('slug')
        .eq('published', true);
    return (data ?? []).map((p) => ({ slug: p.slug}));
}

export async function generateMetadata({ params, }: { params: Promise<{ slug: string }> }) {
    const { slug: raw } = await params;
    const slug = decodeURIComponent(raw).normalize('NFC');

    const { data, error } = await supabase
    .from('articles')
    .select('title, excerpt')
    .eq('slug', slug)
    .eq('published', true)
    .maybeSingle();
    return {
        title: data?.title ?? '記事',
        description: data?.excerpt?.trim() ?? 'ブログ記事',
    };
}

export default async function PostDetail({ params, }: { params: Promise<{ slug: string }> }) {
    const { slug: raw } = await params;
    const slug = decodeURIComponent(raw).normalize('NFC').trim();
    const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .eq(`published`, true)
    .single();

   if (error || !data) notFound();

      /*
      if (error || !data) {
        return (
          <pre className='max-w-3xl mx-auto p-4 text-sm'>
            {JSON.stringify({ raw, slug, error, data}, null, 2)}
          </pre>
        );
      }
      */

    const post: Article = data as Article;
    const html = renderMarkdown(post.content_md);

    return (
    <>
    <Header />
    <main className="pb-16 flex-1">
      {/* ヒーロー（カバー画像 + タイトル） */}
      <section className="relative w-full overflow-hidden flex justify-center">
        {/* 背景 */}
        <div className="relative h-36 md:h-30 w-[375px] md:w-[768px]">
          {post.cover_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.cover_url}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-blue-800 via-blue-700 to-blue-900" />
          )}
          {/* オーバーレイ */}
          <div className="absolute inset-0 bg-black/40" />
          {/* タイトル */}
          <div className="absolute bottom-0 w-full p-6 md:p-8">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white drop-shadow">
              {post.title}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-zinc-200/90">
              {/*<time className="rounded-full border border-white/30 px-3 py-1 backdrop-blur">
                {date}
              </time>*/}
              {post.tags?.slice(0, 4).map((t) => (
                <Link
                  key={t}
                  href={`/tags/${encodeURIComponent(t)}`}
                  className="rounded-full bg-white/15 px-3 py-1 backdrop-blur hover:bg-white/25 transition"
                >
                  #{t}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 本文 */}
      <article className="mx-auto mt-10 max-w-3xl px-4">
        <div
          className="prose prose-zinc max-w-none leading-relaxed md:prose-lg prose-headings:font-semibold prose-a:underline hover:prose-a:opacity-80"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </article>

      {/* フッター導線 */}
      <div className="mx-auto mt-10 flex max-w-3xl items-center justify-between px-4">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition
                     hover:-translate-y-0.5 hover:shadow-md"
        >
          <span className="inline-block transition group-hover:-translate-x-0.5">←</span>
          一覧に戻る
        </Link>

        {/* 次にOG画像などを予定してる場合のプレースホルダ */}
        <div className="text-xs text-zinc-500">更新: {new Date(post.updated_at).toLocaleDateString('ja-JP')}</div>
      </div>
    </main>
    <Footer />
    </>
  );
}