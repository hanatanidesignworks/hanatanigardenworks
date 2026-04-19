import ContactForm from '@/components/ContactForm';

const DARK_GREEN = '#2D5016';

export default function ContactSection() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-16">
      <div
        className="flex flex-col overflow-hidden rounded sm:flex-row"
        style={{ border: '1px solid #E5E5E5' }}
      >

        {/* 左カラム：お試しセット紹介 */}
        <div
          className="flex flex-col justify-between gap-8 p-10 sm:w-1/2"
          style={{
            backgroundColor: '#F8F6F3',
            borderLeft: `4px solid ${DARK_GREEN}`,
          }}
        >
          <div>
            {/* 1. 「初回限定」バッジ */}
            <span
              className="inline-block mb-3 rounded px-2 py-0.5 text-xs font-medium text-white tracking-widest"
              style={{ backgroundColor: DARK_GREEN }}
            >
              初回限定
            </span>

            {/* 3. 見出し：semibold に変更 */}
            <h2
              className="text-2xl font-semibold"
              style={{ color: DARK_GREEN }}
            >
              庭リセット体験
            </h2>

            {/* 2. チェックリスト：チェックをダークグリーン、文字を#333 */}
            <ul className="mt-6 space-y-3">
              {[
                '適期樹種の軽剪定',
                '除草・清掃',
                '土の状態確認',
                '今後の管理アドバイス',
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm font-light" style={{ color: '#333' }}>
                  <span
                    className="flex h-4 w-4 shrink-0 items-center justify-center text-xs font-medium"
                    style={{ color: DARK_GREEN }}
                  >
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            {/* 4. 詳細情報：ラベルをダークグリーン細字、値を濃いグレーやや太字 */}
            <div
              className="mt-7 rounded p-4 text-sm space-y-2"
              style={{ backgroundColor: '#F0EEEB' }}
            >
              {[
                { label: '対象目安', value: '20㎡前後' },
                { label: '作業時間', value: '約2時間' },
                { label: '参考価格', value: '5,000円（税込）' },
              ].map(({ label, value }) => (
                <p key={label} className="flex gap-3">
                  <span className="w-20 shrink-0 font-light text-xs" style={{ color: DARK_GREEN }}>
                    {label}
                  </span>
                  <span className="font-medium text-gray-700">{value}</span>
                </p>
              ))}
            </div>

            {/* 注意書き */}
            <div className="mt-4 space-y-1 text-xs font-light text-gray-500">
              <p>※年間管理をご契約の場合、初回管理費用はご契約金額に充当いたします</p>
              <p>※対応件数に限りがあります</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* 返金保証バッジ */}
            <div
              className="inline-flex items-center gap-2 rounded px-3 py-1.5 text-xs font-light"
              style={{ border: `1px solid ${DARK_GREEN}`, color: DARK_GREEN }}
            >
              <span>🛡</span>
              初回作業は全額返金保証付き
            </div>

            {/* CTAボタン */}
            <div>
              <a
                href="https://lp.hanatanigardenworks.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded px-6 py-2.5 text-sm font-light text-white transition-opacity hover:opacity-80"
                style={{ backgroundColor: DARK_GREEN }}
              >
                サービスの詳細を見る →
              </a>
            </div>
          </div>
        </div>

        {/* 5. 左右カラムの境界線 */}
        <div className="hidden sm:block w-px shrink-0" style={{ backgroundColor: '#E5E5E5' }} />

        {/* 右カラム：お問い合わせフォーム */}
        <div className="bg-white sm:w-1/2">
          <ContactForm />
        </div>

      </div>
    </section>
  );
}
