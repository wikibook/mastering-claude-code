import type { Metadata } from 'next';
import './globals.css';
import AuthProvider from '@/components/AuthProvider';
import Header from '@/components/Header';

export const metadata: Metadata = {
  title: '마음 일기 - AI가 위로하는 나만의 일기장',
  description: '일기를 작성하면 AI가 당신의 감정을 분석하고 따뜻한 위로와 응원의 메시지를 전해드립니다.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Noto+Serif+KR:wght@300;400;500&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-ethereal texture-noise min-h-screen">
        <AuthProvider>
          <Header />
          <main className="pt-24 pb-12 px-6">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
