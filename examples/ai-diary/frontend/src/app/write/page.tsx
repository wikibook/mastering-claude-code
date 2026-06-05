'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import DiaryForm from '@/components/DiaryForm';

export default function WritePage() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/api/auth/signin');
    }
  }, [status, router]);

  if (status === 'loading') {
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

  if (status === 'unauthenticated') {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-10 text-center"
      >
        <h1 className="font-display text-4xl font-bold text-midnight mb-4">
          오늘의 일기
        </h1>
        <p className="font-body text-ink-light">
          오늘 하루를 기록하고, AI의 따뜻한 응원을 받아보세요
        </p>
      </motion.div>

      <DiaryForm />
    </div>
  );
}
