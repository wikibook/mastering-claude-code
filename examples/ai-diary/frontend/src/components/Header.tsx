'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function Header() {
  const { data: session, status } = useSession();

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-cream/80 border-b border-cloud"
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="group flex items-center gap-3">
          <motion.div
            whileHover={{ rotate: 10 }}
            className="w-10 h-10 rounded-full bg-gradient-to-br from-lavender to-rose-gold flex items-center justify-center"
          >
            <span className="text-white text-lg">✦</span>
          </motion.div>
          <div>
            <h1 className="font-display text-2xl font-semibold text-midnight tracking-tight">
              마음 일기
            </h1>
            <div className="h-0.5 w-0 group-hover:w-full bg-gradient-to-r from-lavender-deep to-rose-gold transition-all duration-300" />
          </div>
        </Link>

        <nav className="flex items-center gap-6">
          {status === 'loading' ? (
            <div className="w-8 h-8 rounded-full bg-cloud animate-pulse" />
          ) : session ? (
            <>
              <Link
                href="/write"
                className="btn-primary text-sm"
              >
                새 일기 쓰기
              </Link>
              <div className="flex items-center gap-3">
                {session.user?.image && (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || '사용자'}
                    width={36}
                    height={36}
                    className="rounded-full border-2 border-lavender"
                  />
                )}
                <button
                  onClick={() => signOut()}
                  className="text-sm text-ink-light hover:text-ink transition-colors font-body"
                >
                  로그아웃
                </button>
              </div>
            </>
          ) : (
            <button
              onClick={() => signIn('google')}
              className="btn-primary flex items-center gap-2 text-sm"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google로 시작하기
            </button>
          )}
        </nav>
      </div>
    </motion.header>
  );
}
