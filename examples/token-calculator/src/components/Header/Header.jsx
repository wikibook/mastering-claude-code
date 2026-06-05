import { Moon, Sun, Terminal } from 'lucide-react';
import { useMounted } from '../../hooks/useMounted.jsx';

export default function Header({ darkMode, onToggleTheme }) {
  const mounted = useMounted();

  return (
    <header className="flex items-center justify-between mb-10">
      <div className="flex items-center gap-4">
        {/* Terminal Icon with glow */}
        <div
          className={`
            p-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-fuchsia-500/20
            border border-cyan-500/30 dark:border-cyan-400/30
            ${mounted ? 'animate-stagger-1' : 'opacity-0'}
            ${darkMode ? 'glow-cyan' : ''}
          `}
        >
          <Terminal
            className={`w-6 h-6 ${darkMode ? 'text-cyan-400 animate-float' : 'text-cyan-600'}`}
          />
        </div>

        <div>
          {/* Title with staggered letter animation */}
          <h1
            className={`
              font-display text-3xl md:text-4xl font-bold tracking-tight
              ${mounted ? 'animate-stagger-2' : 'opacity-0'}
            `}
          >
            <span className={`
              ${darkMode
                ? 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-cyan-400 text-glow-cyan'
                : 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-fuchsia-600 to-cyan-600'
              }
            `}>
              Token
            </span>
            <span className={`
              ml-2
              ${darkMode ? 'text-slate-100' : 'text-slate-800'}
            `}>
              Calculator
            </span>
          </h1>

          {/* Subtitle with typing effect feel */}
          <p
            className={`
              font-mono text-sm mt-1.5 tracking-wide
              ${darkMode ? 'text-cyan-400/70' : 'text-cyan-600/70'}
              ${mounted ? 'animate-stagger-3' : 'opacity-0'}
            `}
          >
            <span className="opacity-60">{'>'}</span> LLM 토큰 계산기
            <span className={`inline-block w-2 h-4 ml-1 ${darkMode ? 'bg-cyan-400' : 'bg-cyan-600'} animate-pulse`}></span>
          </p>
        </div>
      </div>

      {/* Theme toggle with rotation animation */}
      <button
        onClick={onToggleTheme}
        className={`
          group relative p-3 rounded-xl
          bg-gradient-to-br from-slate-100 to-slate-200
          dark:from-slate-800 dark:to-slate-900
          border border-slate-200 dark:border-cyan-500/30
          hover:scale-110 active:scale-95
          transition-all duration-300 ease-out
          ${darkMode ? 'hover:glow-cyan' : 'hover:shadow-lg'}
          ${mounted ? 'animate-stagger-2' : 'opacity-0'}
        `}
        aria-label="테마 전환"
      >
        <div className="relative">
          {darkMode ? (
            <Sun
              className="w-5 h-5 text-amber-400 transition-transform duration-500 group-hover:rotate-180"
            />
          ) : (
            <Moon
              className="w-5 h-5 text-slate-600 transition-transform duration-500 group-hover:-rotate-12"
            />
          )}
        </div>

        {/* Hover ring effect */}
        <div className={`
          absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100
          transition-opacity duration-300
          ${darkMode
            ? 'ring-2 ring-cyan-400/50'
            : 'ring-2 ring-slate-300'
          }
        `}></div>
      </button>
    </header>
  );
}
