import { Code2, Heart } from 'lucide-react';
import { useMounted } from '../../hooks/useMounted.jsx';

export default function Footer() {
  const mounted = useMounted();

  return (
    <footer
      className={`
        mt-10 pt-6 border-t border-slate-200/50 dark:border-slate-800/50
        ${mounted ? 'animate-stagger-5' : 'opacity-0'}
      `}
    >
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Main text */}
        <p className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 font-body">
          <Code2 className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
          <span>LLM Token Calculator</span>
          <span className="hidden md:inline text-slate-300 dark:text-slate-600">—</span>
          <span className="hidden md:inline">최신 AI 모델의 토큰 수를 실시간으로 계산</span>
        </p>

        {/* Made with love badge */}
        <p className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 font-mono">
          <span>Made with</span>
          <Heart className="w-3 h-3 text-red-400 animate-pulse" fill="currentColor" />
          <span>for developers</span>
        </p>
      </div>

      {/* Decorative line */}
      <div className="mt-4 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent"></div>
    </footer>
  );
}
