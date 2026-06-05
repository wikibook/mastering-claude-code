'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface AIResponseProps {
  response: string;
  mood: string | null;
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

export default function AIResponse({ response, mood }: AIResponseProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  const moodKey = mood?.toLowerCase() || 'peaceful';
  const emoji = moodEmoji[moodKey] || '💭';
  const moodLabel = moodLabels[moodKey] || mood;

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < response.length) {
        setDisplayedText(response.slice(0, index + 1));
        index++;
      } else {
        setIsComplete(true);
        clearInterval(interval);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [response]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="max-w-2xl mx-auto text-center"
    >
      {/* Mood Indicator */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        className="mb-8"
      >
        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-lavender-mist border border-lavender">
          <span className="text-3xl animate-pulse-glow rounded-full">{emoji}</span>
          <span className="font-body text-ink">
            오늘의 감정: <strong className="text-midnight">{moodLabel}</strong>
          </span>
        </div>
      </motion.div>

      {/* AI Message Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="bg-gradient-to-br from-cream to-mist rounded-2xl p-8 shadow-lg border border-cloud relative overflow-hidden"
      >
        {/* Decorative Elements */}
        <div className="absolute top-4 left-4 text-4xl opacity-10">❝</div>
        <div className="absolute bottom-4 right-4 text-4xl opacity-10">❞</div>

        <div className="relative z-10">
          <h3 className="font-display text-xl text-rose-gold-deep mb-6">
            AI의 따뜻한 메시지
          </h3>

          <p className="font-accent text-xl text-ink leading-relaxed italic">
            {displayedText}
            {!isComplete && (
              <span className="inline-block w-0.5 h-5 bg-rose-gold ml-1 animate-pulse" />
            )}
          </p>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isComplete ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        className="mt-8 flex justify-center gap-4"
      >
        <Link
          href="/"
          className="px-6 py-3 rounded-lg border border-lavender text-ink hover:bg-lavender-mist transition-colors font-body"
        >
          일기 목록으로
        </Link>
        <Link href="/write" className="btn-primary">
          새 일기 쓰기
        </Link>
      </motion.div>

      {/* Auto redirect notice */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: isComplete ? 1 : 0 }}
        className="mt-6 text-sm text-ink-muted font-body"
      >
        잠시 후 자동으로 목록 페이지로 이동합니다...
      </motion.p>
    </motion.div>
  );
}
