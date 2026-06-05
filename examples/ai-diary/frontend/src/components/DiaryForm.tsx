'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import AIResponse from './AIResponse';

export default function DiaryForm() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [mood, setMood] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const diary = await api.createDiary({ title, content });
      setAiResponse(diary.aiResponse);
      setMood(diary.mood);

      // 3초 후 목록 페이지로 이동
      setTimeout(() => {
        router.push('/');
        router.refresh();
      }, 5000);
    } catch (err) {
      setError('일기 저장 중 오류가 발생했습니다. 다시 시도해주세요.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (aiResponse) {
    return <AIResponse response={aiResponse} mood={mood} />;
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="max-w-2xl mx-auto"
    >
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <label className="block text-sm font-body text-ink-light mb-2">
            오늘의 제목
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="오늘 하루를 한 문장으로 표현해보세요"
            className="input-field text-lg font-display"
            required
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <label className="block text-sm font-body text-ink-light mb-2">
            오늘의 이야기
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="오늘 있었던 일, 느꼈던 감정, 떠오르는 생각들을 자유롭게 적어보세요. AI가 당신의 이야기를 읽고 따뜻한 응원의 메시지를 전해드릴게요."
            rows={12}
            className="input-field resize-none leading-relaxed"
            required
          />
        </motion.div>

        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-500 text-sm font-body"
          >
            {error}
          </motion.p>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex justify-end gap-4"
        >
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 text-ink-light hover:text-ink transition-colors font-body"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !title.trim() || !content.trim()}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  ✦
                </motion.span>
                AI가 읽고 있어요...
              </>
            ) : (
              <>
                <span>✦</span>
                일기 저장하기
              </>
            )}
          </button>
        </motion.div>
      </div>
    </motion.form>
  );
}
