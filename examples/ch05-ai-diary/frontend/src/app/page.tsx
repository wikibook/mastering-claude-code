'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import DiaryCard from '@/components/DiaryCard';
import { api, Diary } from '@/lib/api';
import { staggerContainer } from '@/lib/animations';

export default function Home() {
  const { data: session, status } = useSession();
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'authenticated') {
      loadDiaries();
    } else if (status === 'unauthenticated') {
      setLoading(false);
    }
  }, [status]);

  const loadDiaries = async () => {
    try {
      const data = await api.getDiaries();
      setDiaries(data);
    } catch (error) {
      console.error('Failed to load diaries:', error);
    } finally {
      setLoading(false);
    }
  };

  // 로그인하지 않은 사용자를 위한 랜딩 페이지
  if (status === 'unauthenticated') {
    return (
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center py-20"
        >
          {/* Floating Decorations */}
          <div className="relative">
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-10 left-1/4 text-6xl opacity-20"
            >
              ✦
            </motion.div>
            <motion.div
              animate={{ y: [10, -10, 10] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-5 right-1/4 text-4xl opacity-20"
            >
              ❋
            </motion.div>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="font-display text-5xl md:text-6xl font-bold text-midnight mb-6"
          >
            마음을 적으면,
            <br />
            <span className="bg-gradient-to-r from-lavender-deep to-rose-gold bg-clip-text text-transparent">
              AI가 위로해드려요
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="font-body text-xl text-ink-light max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            오늘 하루 어떠셨나요? 당신의 이야기를 들려주세요.
            <br />
            AI가 당신의 감정을 이해하고, 따뜻한 응원의 메시지를 전해드릴게요.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/api/auth/signin" className="btn-primary text-lg px-8 py-4">
              시작하기
            </Link>
          </motion.div>

          {/* Features */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="grid md:grid-cols-3 gap-8 mt-24"
          >
            {[
              {
                icon: '📝',
                title: '자유로운 일기 작성',
                description: '형식에 얽매이지 않고 자유롭게 오늘의 이야기를 적어보세요.',
              },
              {
                icon: '🤖',
                title: 'AI 감정 분석',
                description: '당신의 글에서 감정을 섬세하게 읽어내고 공감해드려요.',
              },
              {
                icon: '💝',
                title: '따뜻한 응원',
                description: '힘든 날엔 위로를, 좋은 날엔 축하를 전해드립니다.',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1, duration: 0.6 }}
                className="p-6 rounded-2xl bg-cream/50 border border-cloud"
              >
                <span className="text-4xl mb-4 block">{feature.icon}</span>
                <h3 className="font-display text-xl font-semibold text-midnight mb-2">
                  {feature.title}
                </h3>
                <p className="font-body text-ink-light">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // 로딩 상태
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center py-20">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="text-4xl"
          >
            ✦
          </motion.div>
        </div>
      </div>
    );
  }

  // 로그인한 사용자의 일기 목록
  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-12"
      >
        <h1 className="font-display text-4xl font-bold text-midnight mb-2">
          {session?.user?.name}님의 일기장
        </h1>
        <p className="font-body text-ink-light">
          {diaries.length > 0
            ? `${diaries.length}개의 소중한 기록이 있어요`
            : '아직 작성한 일기가 없어요. 첫 일기를 써볼까요?'}
        </p>
      </motion.div>

      {diaries.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-center py-16"
        >
          <div className="text-6xl mb-6">📖</div>
          <h2 className="font-display text-2xl text-midnight mb-4">
            첫 번째 일기를 작성해보세요
          </h2>
          <p className="font-body text-ink-light mb-8">
            오늘 하루는 어떠셨나요?
          </p>
          <Link href="/write" className="btn-primary">
            일기 쓰러 가기
          </Link>
        </motion.div>
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="grid gap-6"
        >
          {diaries.map((diary, index) => (
            <DiaryCard key={diary.id} diary={diary} index={index} />
          ))}
        </motion.div>
      )}
    </div>
  );
}
