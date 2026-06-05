import { useState } from 'react';
import { Terminal, FileText } from 'lucide-react';
import { useMounted } from '../../hooks/useMounted.jsx';

export default function InputArea({ text, onTextChange }) {
  const mounted = useMounted();
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`mb-4 ${mounted ? 'animate-stagger-4' : 'opacity-0'}`}>
      {/* Label with terminal styling */}
      <label className="flex items-center gap-2 font-body text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">
        <FileText className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
        <span>프롬프트 입력</span>
        {isFocused && (
          <span className="ml-auto font-mono text-xs text-cyan-500 dark:text-cyan-400 animate-pulse">
            입력 중...
          </span>
        )}
      </label>

      {/* Textarea container with terminal-like styling */}
      <div
        className={`
          relative rounded-2xl overflow-hidden
          transition-all duration-300 ease-out
          ${isFocused
            ? 'glow-cyan ring-2 ring-cyan-500/50 dark:ring-cyan-400/50'
            : 'ring-1 ring-slate-200 dark:ring-slate-700'
          }
        `}
      >
        {/* Terminal header bar */}
        <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700/50">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-400/80 hover:bg-red-500 transition-colors cursor-pointer"></span>
            <span className="w-3 h-3 rounded-full bg-yellow-400/80 hover:bg-yellow-500 transition-colors cursor-pointer"></span>
            <span className="w-3 h-3 rounded-full bg-green-400/80 hover:bg-green-500 transition-colors cursor-pointer"></span>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <span className="font-mono text-xs text-slate-400 dark:text-slate-500">
              prompt.txt
            </span>
          </div>
          <Terminal className="w-4 h-4 text-slate-400 dark:text-slate-500" />
        </div>

        {/* Textarea with line numbers feel */}
        <div className="relative">
          {/* Line number gutter decoration */}
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-slate-50 dark:bg-slate-900/50 border-r border-slate-200 dark:border-slate-700/30 pointer-events-none">
            <div className="p-4 font-mono text-xs text-slate-300 dark:text-slate-600 leading-6">
              {text.split('\n').slice(0, 20).map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
              {!text && <div>1</div>}
            </div>
          </div>

          <textarea
            value={text}
            onChange={(e) => onTextChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="토큰을 계산할 텍스트를 입력하세요..."
            className={`
              w-full h-64 pl-16 pr-4 py-4
              font-mono text-sm leading-6
              bg-white dark:bg-slate-900
              text-slate-800 dark:text-slate-200
              placeholder-slate-400 dark:placeholder-slate-600
              outline-none resize-none
              custom-scrollbar
              transition-colors duration-300
            `}
          />

          {/* Cursor glow effect when focused */}
          {isFocused && (
            <div className="absolute bottom-4 right-4 pointer-events-none">
              <span className="inline-block w-0.5 h-5 bg-cyan-500 dark:bg-cyan-400 animate-pulse"></span>
            </div>
          )}
        </div>

        {/* Bottom status bar */}
        <div className="flex items-center justify-between px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700/50">
          <span className="font-mono text-xs text-slate-400 dark:text-slate-500">
            UTF-8
          </span>
          <span className="font-mono text-xs text-slate-400 dark:text-slate-500">
            {text.split('\n').length} lines
          </span>
        </div>
      </div>
    </div>
  );
}
