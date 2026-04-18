import Header from '@/components/Header';
import FirstView from '@/components/Firstview';
import Hero from '@/components/Hero';
import PageCards from '@/components/PageCards';
import { supabase } from '@/lib/supabaseClient';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';
import Link from 'next/link';

export const revalidate = 30;

export default async function Home() {
  const [{ data: pages, error: pagesError }, { data: blogPosts, error: blogError }] =
    await Promise.all([
      supabase
        .from('articles')
        .select('id, title, slug, excerpt, cover_url')
        .eq('published', true)
        .eq('post_type', 'page')
        .order('display_order', { ascending: true }),
      supabase
        .from('articles')
        .select('id, title, slug, excerpt, cover_url, tags, created_at')
        .eq('published', true)
        .eq('post_type', 'blog')
        .order('created_at', { ascending: false })
        .limit(5),
    ]);

  if (pagesError || blogError) {
    return <div>データ取得エラー: {String(pagesError?.message ?? blogError?.message)}</div>;
  }

  return (
    <main>
      <Header />
      <FirstView latestPost={blogPosts?.[0] ?? null} />
      <PageCards pages={pages ?? []} />
      <section className="mx-auto max-w-[768px] px-4">
        <h2 className="mb-2 text-lg font-semibold text-gray-700">最新の投稿</h2>
        <Hero posts={blogPosts ?? []} />
        <div className="mt-8 text-center">
          <Link
            href="/posts"
            className="inline-block rounded-full border border-gray-300 px-6 py-2 text-sm text-gray-600 transition hover:border-emerald-600 hover:text-emerald-700"
          >
            記事一覧をもっと見る →
          </Link>
        </div>
      </section>
      <ContactForm />
      <Footer />
    </main>
  );
}
