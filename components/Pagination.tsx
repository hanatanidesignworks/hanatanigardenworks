import Link from 'next/link'

type Props = {
  currentPage: number
  totalPages: number
  basePath: string
}

function pageHref(basePath: string, page: number) {
  return page === 1 ? basePath : `${basePath}?page=${page}`
}

function buildPageNumbers(current: number, total: number): (number | '...')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  const pages: (number | '...')[] = [1]

  const left = Math.max(2, current - 1)
  const right = Math.min(total - 1, current + 1)

  if (left > 2) pages.push('...')
  for (let i = left; i <= right; i++) pages.push(i)
  if (right < total - 1) pages.push('...')

  pages.push(total)
  return pages
}

export default function Pagination({ currentPage, totalPages, basePath }: Props) {
  if (totalPages <= 1) return null

  const pages = buildPageNumbers(currentPage, totalPages)

  return (
    <nav
      className="mt-10 flex items-center justify-center gap-1 flex-wrap"
      aria-label="ページネーション"
    >
      {currentPage > 1 && (
        <Link
          href={pageHref(basePath, currentPage - 1)}
          className="rounded-full border px-4 py-2 text-sm text-gray-600 transition hover:border-emerald-600 hover:text-emerald-700"
        >
          ← 前のページ
        </Link>
      )}

      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`ellipsis-${i}`} className="px-2 text-gray-400 select-none">
            ...
          </span>
        ) : (
          <Link
            key={p}
            href={pageHref(basePath, p)}
            className={`min-w-[2.5rem] rounded-full border px-3 py-2 text-center text-sm transition ${
              p === currentPage
                ? 'border-emerald-600 bg-emerald-600 text-white'
                : 'border-gray-200 text-gray-600 hover:border-emerald-600 hover:text-emerald-700'
            }`}
            aria-current={p === currentPage ? 'page' : undefined}
          >
            {p}
          </Link>
        )
      )}

      {currentPage < totalPages && (
        <Link
          href={pageHref(basePath, currentPage + 1)}
          className="rounded-full border px-4 py-2 text-sm text-gray-600 transition hover:border-emerald-600 hover:text-emerald-700"
        >
          次のページ →
        </Link>
      )}
    </nav>
  )
}
