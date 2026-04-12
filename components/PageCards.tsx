import Link from 'next/link'

type PageCard = {
  id: number
  title: string
  slug: string
  excerpt: string | null
  cover_url: string | null
}

export default function PageCards({ pages }: { pages: PageCard[] }) {
  if (pages.length === 0) return null

  return (
    <section className="mx-auto max-w-[768px] px-4 py-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        {pages.map((page) => (
          <Link
            key={page.id}
            href={`/posts/${encodeURIComponent(page.slug)}`}
            className="group flex flex-col overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-100 transition hover:-translate-y-1 hover:shadow-md"
          >
            {/* サムネイル 16:9 */}
            <div className="aspect-video w-full overflow-hidden bg-gray-100">
              {page.cover_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={page.cover_url}
                  alt={page.title}
                  className="h-full w-full object-cover transition group-hover:scale-105"
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-emerald-50 to-emerald-100" />
              )}
            </div>
            {/* テキスト */}
            <div className="flex flex-col gap-1 p-4">
              <h2 className="font-semibold text-gray-800 line-clamp-2 leading-snug">
                {page.title}
              </h2>
              {page.excerpt && (
                <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                  {page.excerpt}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
