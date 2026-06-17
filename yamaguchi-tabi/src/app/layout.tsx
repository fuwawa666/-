import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '山口の旅を選ぶ | 豊かな旅設計アプリ',
  description: '豊かな旅 ＝ 帰った後の日常に残り続ける旅。山口県の体験をスワイプして、あなただけの旅を設計する。',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&family=Noto+Serif+JP:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-cream antialiased">
        {children}
      </body>
    </html>
  );
}
