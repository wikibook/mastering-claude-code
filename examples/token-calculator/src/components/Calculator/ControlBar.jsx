import { Copy, Trash2, Check, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useMounted } from '../../hooks/useMounted.jsx';

export default function ControlBar({ text, onClear }) {
  const [copied, setCopied] = useState(false);
  const [clearAnimation, setClearAnimation] = useState(false);
  const mounted = useMounted();

  const handleCopy = async () => {
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('복사 실패:', err);
    }
  };

  const handleClear = () => {
    setClearAnimation(true);
    setTimeout(() => {
      onClear();
      setClearAnimation(false);
    }, 200);
  };

  return (
    <div className={`flex gap-3 ${mounted ? 'animate-stagger-5' : 'opacity-0'}`}>
      {/* Copy button */}
      <button
        onClick={handleCopy}
        disabled={!text}
        className={`
          group relative flex items-center gap-2.5 px-5 py-2.5 rounded-xl
          font-mono text-sm font-medium
          transition-all duration-300 ease-out
          btn-ripple overflow-hidden
          ${copied
            ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)]'
            : text
              ? 'bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-cyan-500/20 text-slate-700 dark:text-slate-300 hover:border-cyan-500/50 hover:scale-105 active:scale-95'
              : 'bg-slate-100 dark:bg-slate-800/50 text-slate-400 dark:text-slate-600 cursor-not-allowed opacity-60'
          }
        `}
      >
        <span className="relative z-10 flex items-center gap-2">
          {copied ? (
            <>
              <Check className="w-4 h-4 animate-bounce" />
              <span>복사됨!</span>
              <Sparkles className="w-3 h-3 animate-pulse" />
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 transition-transform group-hover:scale-110 group-hover:-rotate-6" />
              <span>복사</span>
            </>
          )}
        </span>

        {/* Success ripple effect */}
        {copied && (
          <span className="absolute inset-0 bg-white/20 animate-ping rounded-xl"></span>
        )}
      </button>

      {/* Clear button */}
      <button
        onClick={handleClear}
        disabled={!text}
        className={`
          group relative flex items-center gap-2.5 px-5 py-2.5 rounded-xl
          font-mono text-sm font-medium
          transition-all duration-300 ease-out
          btn-ripple overflow-hidden
          ${clearAnimation
            ? 'scale-95 bg-red-500/20 border-red-500/50'
            : text
              ? 'bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 hover:border-red-500/50 hover:bg-red-500/5 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 hover:scale-105 active:scale-95'
              : 'bg-slate-100 dark:bg-slate-800/50 text-slate-400 dark:text-slate-600 cursor-not-allowed opacity-60'
          }
        `}
      >
        <span className="relative z-10 flex items-center gap-2">
          <Trash2
            className={`w-4 h-4 transition-all duration-300
              ${clearAnimation ? 'rotate-12 scale-110' : 'group-hover:scale-110 group-hover:rotate-12'}
            `}
          />
          <span>초기화</span>
        </span>
      </button>

      {/* Keyboard shortcut hints */}
      {text && (
        <div className="hidden md:flex items-center gap-4 ml-auto">
          <kbd className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-xs font-mono text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700">
            ⌘C
          </kbd>
          <span className="text-xs text-slate-400 dark:text-slate-500">복사</span>
        </div>
      )}
    </div>
  );
}
