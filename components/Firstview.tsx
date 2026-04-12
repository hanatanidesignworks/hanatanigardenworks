import Image from 'next/image'

export default function FirstView() {
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
    </div>
  )
}
