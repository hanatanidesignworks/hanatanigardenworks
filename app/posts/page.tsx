import type { Metadata } from 'next'
import { supabase } from '@/lib/supabaseClient'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Hero from '@/components/Hero'
import Pagination from '@/components/Pagination'

export const revalidate = 60

const PER_PAGE = 10
const SITE_NAME = 'ハナタニガーデンワークス'
const BASE_PATH = '/posts'

type SearchParams = { page?: string }

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}): Promise<Metadata> {
  const { page: pageParam } = await searchParams
  const page = Math.max(1, parseInt(pageParam ?? '1', 10))
  const siteUrl = 'https://www.hanatanigardenworks.com'

  const title =
    page === 1
      ? `記事一覧 | ${SITE_NAME}`
      : `記事一覧（${page}ページ目）| ${SITE_NAME}`

  const canonical = page === 1 ? `${siteUrl}${BASE_PATH}` : `${siteUrl}${BASE_PATH}?page=${page}`

  return {
    title,
    alternates: { canonical },
  }
}

export default async function PostsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const { page: pageParam } = await searchParams
  const page = Math.max(1, parseInt(pageParam ?? '1', 10))
  const from = (page - 1) * PER_PAGE
  const to = from + PER_PAGE - 1

  const [{ count }, { data: posts, error }] = await Promise.all([
    supabase
      .from('articles')
      .select('*', { count: 'exact', head: true })
      .eq('published', true)
      .eq('post_type', 'blog'),
    supabase
      .from('articles')
      .select('id, title, slug, excerpt, cover_url, tags, created_at')
      .eq('published', true)
      .eq('post_type', 'blog')
      .order('created_at', { ascending: false })
      .range(from, to),
  ])

  if (error) {
    return <div className="p-8 text-center text-red-600">データ取得エラー: {error.message}</div>
  }

  const totalPages = Math.ceil((count ?? 0) / PER_PAGE)

  return (
    <>
      <Header />
      <main className="flex-1 pb-16">
        <div className="mx-auto max-w-[768px] px-4 pt-10">
          <h1 className="mb-6 text-2xl font-semibold text-gray-800">記事一覧</h1>
          {posts && posts.length > 0 ? (
            <Hero posts={posts} />
          ) : (
            <p className="text-gray-500">記事がありません。</p>
          )}
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            basePath={BASE_PATH}
          />
        </div>
      </main>
      <Footer />
    </>
  )
}
