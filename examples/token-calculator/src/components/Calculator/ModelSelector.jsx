import { Cpu, Bot, Brain, Zap, Flame, Sparkles } from 'lucide-react';
import { useMounted } from '../../hooks/useMounted.jsx';

const MODELS = [
  { id: 'gpt-5', name: 'GPT-5', provider: 'OpenAI', icon: Zap, color: 'emerald' },
  { id: 'sonnet-4.5', name: 'Sonnet 4.5', provider: 'Anthropic', icon: Bot, color: 'orange' },
  { id: 'opus-4.5', name: 'Opus 4.5', provider: 'Anthropic', icon: Brain, color: 'fuchsia' },
  { id: 'gemini-3.0', name: 'Gemini 3.0', provider: 'Google', icon: Cpu, color: 'blue' },
  { id: 'llama-4', name: 'Llama 4', provider: 'Meta', icon: Flame, color: 'purple' },
  { id: 'grok', name: 'Grok', provider: 'xAI', icon: Sparkles, color: 'rose' },
];

const colorClasses = {
  emerald: {
    active: 'from-emerald-500 to-teal-600 shadow-emerald-500/30',
    hover: 'hover:border-emerald-500/50 hover:bg-emerald-500/5',
    text: 'text-emerald-400',
    glow: 'shadow-[0_0_20px_rgba(16,185,129,0.4)]',
  },
  orange: {
    active: 'from-orange-500 to-amber-600 shadow-orange-500/30',
    hover: 'hover:border-orange-500/50 hover:bg-orange-500/5',
    text: 'text-orange-400',
    glow: 'shadow-[0_0_20px_rgba(249,115,22,0.4)]',
  },
  fuchsia: {
    active: 'from-fuchsia-500 to-purple-600 shadow-fuchsia-500/30',
    hover: 'hover:border-fuchsia-500/50 hover:bg-fuchsia-500/5',
    text: 'text-fuchsia-400',
    glow: 'shadow-[0_0_20px_rgba(217,70,239,0.4)]',
  },
  blue: {
    active: 'from-blue-500 to-indigo-600 shadow-blue-500/30',
    hover: 'hover:border-blue-500/50 hover:bg-blue-500/5',
    text: 'text-blue-400',
    glow: 'shadow-[0_0_20px_rgba(59,130,246,0.4)]',
  },
  purple: {
    active: 'from-purple-500 to-violet-600 shadow-purple-500/30',
    hover: 'hover:border-purple-500/50 hover:bg-purple-500/5',
    text: 'text-purple-400',
    glow: 'shadow-[0_0_20px_rgba(168,85,247,0.4)]',
  },
  rose: {
    active: 'from-rose-500 to-pink-600 shadow-rose-500/30',
    hover: 'hover:border-rose-500/50 hover:bg-rose-500/5',
    text: 'text-rose-400',
    glow: 'shadow-[0_0_20px_rgba(244,63,94,0.4)]',
  },
};

export default function ModelSelector({ selectedModel, onModelChange }) {
  const mounted = useMounted();

  return (
    <div className={`mb-6 ${mounted ? 'animate-stagger-3' : 'opacity-0'}`}>
      <label className="flex items-center gap-2 font-body text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">
        <span className="font-mono text-cyan-500 dark:text-cyan-400">$</span>
        <span>모델 선택</span>
      </label>

      <div className="flex flex-wrap gap-2 md:gap-3">
        {MODELS.map((model, index) => {
          const isSelected = selectedModel === model.id;
          const colors = colorClasses[model.color];
          const Icon = model.icon;

          return (
            <button
              key={model.id}
              onClick={() => onModelChange(model.id)}
              style={{ animationDelay: `${0.4 + index * 0.05}s` }}
              className={`
                group relative flex items-center gap-2 px-4 py-2.5 rounded-xl
                font-mono text-sm font-medium
                transition-all duration-300 ease-out
                ${mounted ? 'animate-slide-right' : 'opacity-0'}
                ${isSelected
                  ? `bg-gradient-to-r ${colors.active} text-white ${colors.glow}`
                  : `bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm
                     border border-slate-200/60 dark:border-slate-700/60
                     text-slate-600 dark:text-slate-300
                     ${colors.hover}
                     hover:scale-105 active:scale-95`
                }
              `}
            >
              {/* Icon */}
              <Icon
                className={`w-4 h-4 transition-all duration-300
                  ${isSelected
                    ? 'text-white/90'
                    : `${colors.text} group-hover:scale-110`
                  }
                `}
              />

              {/* Model name */}
              <span className="relative">
                {model.name}
                {isSelected && (
                  <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-white/40"></span>
                )}
              </span>

              {/* Active indicator dot */}
              {isSelected && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white rounded-full animate-pulse shadow-lg"></span>
              )}

              {/* Hover glow effect */}
              {!isSelected && (
                <div className={`
                  absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100
                  transition-opacity duration-300 pointer-events-none
                  bg-gradient-to-r ${colors.active} blur-xl -z-10
                `} style={{ opacity: 0.15 }}></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
