import Image from 'next/image'
import Link from 'next/link'

type LatestPost = {
  slug: string
  title: string
}

type Props = {
  latestPost?: LatestPost | null
}

export default function FirstView({ latestPost }: Props) {
  return (
    <div className="relative w-full" style={{ height: '70vh' }}>
      {/* 背景画像 */}
      <Image
        src="/hero.png"
        alt="ハナタニガーデンワークス ヒーロー画像"
        fill
        priority
        className="object-cover object-center"
      />

      {/* オーバーレイ */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: 'rgba(0,0,0,0.35)' }}
      />

      {/* テキスト */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-4 text-center text-white">
        <p
          className="text-sm font-light tracking-[0.25em]"
          style={{ textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}
        >
          ハナタニガーデンワークス
        </p>

        <h1
          className="text-3xl font-semibold md:text-4xl"
          style={{ textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}
        >
          庭のコンシェルジュ
        </h1>

        <p
          className="text-sm font-light my-2"
          style={{ textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}
        >
          ― 庭師、仕事を取りに行く。―
        </p>

        <a
          href="https://lp.hanatanigardenworks.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 rounded-full bg-white px-6 py-2 text-sm font-medium text-emerald-900 transition hover:bg-emerald-900 hover:text-white"
        >
          サービスを見る →
        </a>
      </div>

      {/* 最新記事バナー */}
      {latestPost && (
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
        >
          <Link
            href={`/posts/${latestPost.slug}`}
            className="mx-auto flex max-w-[768px] items-center gap-3 px-4 py-3 text-white transition hover:brightness-110"
          >
            <span className="shrink-0 rounded border border-emerald-400 px-2 py-0.5 text-xs font-medium text-emerald-300">
              最新記事
            </span>
            <span className="min-w-0 flex-1 truncate text-sm">
              {latestPost.title}
            </span>
            <span className="shrink-0 text-sm text-gray-300">→</span>
          </Link>
        </div>
      )}
    </div>
  )
}
