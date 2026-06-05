'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Diary } from '@/lib/api';

interface DiaryCardProps {
  diary: Diary;
  index: number;
}

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

const moodColors: Record<string, string> = {
  happy: 'bg-mood-happy',
  sad: 'bg-mood-sad',
  angry: 'bg-mood-angry',
  peaceful: 'bg-mood-peaceful',
  anxious: 'bg-mood-anxious',
  tired: 'bg-mood-tired',
  excited: 'bg-mood-happy',
  grateful: 'bg-mood-peaceful',
  lonely: 'bg-mood-sad',
  hopeful: 'bg-lavender',
};

export default function DiaryCard({ diary, index }: DiaryCardProps) {
  const formattedDate = new Date(diary.createdAt).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  });

  const mood = diary.mood?.toLowerCase() || 'peaceful';
  const emoji = moodEmoji[mood] || '📝';
  const moodColor = moodColors[mood] || 'bg-lavender';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <Link href={`/diary/${diary.id}`}>
        <article className="diary-card p-6 cursor-pointer">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full ${moodColor} flex items-center justify-center text-xl animate-pulse-glow`}
              >
                {emoji}
              </div>
              <div>
                <h3 className="font-display text-xl font-semibold text-midnight card-title transition-transform duration-300">
                  {diary.title}
                </h3>
                <p className="text-sm text-ink-muted font-body">{formattedDate}</p>
              </div>
            </div>
          </div>

          <p className="text-ink-light font-body leading-relaxed line-clamp-3 mb-4">
            {diary.content}
          </p>

          {diary.aiResponse && (
            <div className="mt-4 pt-4 border-t border-cloud">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-rose-gold-deep font-accent italic">
                  AI의 따뜻한 한마디
                </span>
              </div>
              <p className="text-sm text-ink-light font-accent italic line-clamp-2">
                "{diary.aiResponse}"
              </p>
            </div>
          )}
        </article>
      </Link>
    </motion.div>
  );
}
