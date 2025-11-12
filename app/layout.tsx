import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "八尾市の庭木剪定・伐採・草刈り｜写真見積りOK｜ハナタニガーデンワークス",
  description: "八尾市の庭師。シンボルツリー剪定・伐採・草刈り。LINE・DMで写真送るだけ見積りOK。Before→After多数、最短即日対応のハナタニガーデンワークス。",
  keywords: [
    "八尾市",
    "庭師",
    "造園",
    "庭木",
    "剪定",
    "伐採",
    "草刈り",
    "シンボルツリー",
    "庭木手入れ",
    "ハナタニガーデンワークス"
  ],
  openGraph: {
    title: "ハナタニガーデンワークス｜八尾市の庭木剪定・伐採・草刈り",
    description: "八尾市を中心に庭木剪定・伐採・草刈りを行うハナタニガーデンワークス。写真を送るだけ見積もりOK。シンボルツリーのお手入れもお任せください。",
    url: "https://hanatanigardenworks.com",
    siteName: "ハナタニガーデンワークス",
    locale: "ja_JP",
    type: "website",
  },
  alternates: {
    canonical: "https://hanatanigardenworks.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Audiowide&family=Hachi+Maru+Pop&family=Kaisei+Decol:wght@400;700&family=M+PLUS+1:wght@100..900&family=M+PLUS+Rounded+1c&family=Noto+Sans+JP:wght@100..900&family=Noto+Serif+JP:wght@200..900&family=Shippori+Mincho&family=Zen+Maru+Gothic&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
