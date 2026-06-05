'use client';

import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { api, Diary } from '@/lib/api';

const moodEmoji: Record<string, string> = {
  happy: '😊',
  sad: '😢',
  angry: '😠',
  peaceful: '😌',
  anxious: '😰',
  tired: '😴',
  excited: '🤩',
  grateful: '🙏',
  lonely: '🥺',
  hopeful: '✨',
};

const moodLabels: Record<string, string> = {
  happy: '행복함',
  sad: '슬픔',
  angry: '화남',
  peaceful: '평화로움',
  anxious: '불안함',
  tired: '피곤함',
  excited: '설렘',
  grateful: '감사함',
  lonely: '외로움',
  hopeful: '희망참',
};

export default function DiaryDetailPage() {
  const { id } = useParams();
  const { status } = useSession();
  const router = useRouter();
  const [diary, setDiary] = useState<Diary | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/api/auth/signin');
    } else if (status === 'authenticated' && id) {
      loadDiary();
    }
  }, [status, id, router]);

  const loadDiary = async () => {
    try {
      const data = await api.getDiary(id as string);
      setDiary(data);
    } catch (error) {
      console.error('Failed to load diary:', error);
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('정말 이 일기를 삭제하시겠습니까?')) return;

    setDeleting(true);
    try {
      await api.deleteDiary(id as string);
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Failed to delete diary:', error);
      alert('삭제 중 오류가 발생했습니다.');
    } finally {
      setDeleting(false);
    }
  };

  if (loading || status === 'loading') {
    return (
      <div className="max-w-2xl mx-auto">
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

  if (!diary) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <p className="text-ink-light">일기를 찾을 수 없습니다.</p>
        <Link href="/" className="btn-primary mt-4 inline-block">
          목록으로 돌아가기
        </Link>
      </div>
    );
  }

  const moodKey = diary.mood?.toLowerCase() || 'peaceful';
  const emoji = moodEmoji[moodKey] || '💭';
  const moodLabel = moodLabels[moodKey] || diary.mood;

  const formattedDate = new Date(diary.createdAt).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  return (
    <div className="max-w-2xl mx-auto">
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-ink-light hover:text-ink transition-colors font-body"
        >
          <span>←</span>
          <span>목록으로</span>
        </Link>
      </motion.div>

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-lavender-mist flex items-center justify-center text-2xl animate-pulse-glow">
            {emoji}
          </div>
          <div>
            <span className="text-sm text-ink-muted font-body">{formattedDate}</span>
            <div className="text-sm text-rose-gold-deep font-accent">
              오늘의 감정: {moodLabel}
            </div>
          </div>
        </div>
        <h1 className="font-display text-4xl font-bold text-midnight">
          {diary.title}
        </h1>
      </motion.header>

      {/* Content */}
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="prose prose-lg max-w-none mb-12"
      >
        <div className="bg-cream/50 rounded-2xl p-8 border border-cloud">
          <p className="font-body text-ink leading-relaxed whitespace-pre-wrap">
            {diary.content}
          </p>
        </div>
      </motion.article>

      {/* AI Response */}
      {diary.aiResponse && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mb-12"
        >
          <div className="bg-gradient-to-br from-lavender-mist to-rose-gold-light/30 rounded-2xl p-8 relative overflow-hidden">
            <div className="absolute top-4 left-4 text-4xl opacity-10">❝</div>
            <div className="absolute bottom-4 right-4 text-4xl opacity-10">❞</div>

            <div className="relative z-10">
              <h3 className="font-display text-lg text-rose-gold-deep mb-4">
                AI의 따뜻한 메시지
              </h3>
              <p className="font-accent text-xl text-ink leading-relaxed italic">
                {diary.aiResponse}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="flex justify-between items-center pt-8 border-t border-cloud"
      >
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="text-red-400 hover:text-red-500 transition-colors font-body text-sm disabled:opacity-50"
        >
          {deleting ? '삭제 중...' : '이 일기 삭제하기'}
        </button>
        <Link href="/write" className="btn-primary">
          새 일기 쓰기
        </Link>
      </motion.div>
    </div>
  );
}
