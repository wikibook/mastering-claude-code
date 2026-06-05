import { Hash, Type, HardDrive, Sparkles } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useMounted } from '../../hooks/useMounted.jsx';

// Animated counter component with rolling effect
function AnimatedNumber({ value, className }) {
  const [displayValue, setDisplayValue] = useState(value);
  const [isAnimating, setIsAnimating] = useState(false);
  const prevValue = useRef(value);

  useEffect(() => {
    if (prevValue.current !== value) {
      setIsAnimating(true);

      // Animate the number change
      const duration = 400;
      const startValue = prevValue.current;
      const endValue = value;
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function (ease-out cubic)
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(startValue + (endValue - startValue) * eased);

        setDisplayValue(current);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setIsAnimating(false);
          prevValue.current = value;
        }
      };

      requestAnimationFrame(animate);
    }
  }, [value]);

  return (
    <span className={`${className} ${isAnimating ? 'animate-number-roll' : ''}`}>
      {displayValue.toLocaleString()}
    </span>
  );
}

export default function TokenDisplay({ tokenCount, charCount, charCountNoSpace, byteSize }) {
  const mounted = useMounted();

  const stats = [
    {
      label: '토큰 수',
      value: tokenCount,
      icon: Sparkles,
      highlight: true,
      delay: 1,
      gradient: 'from-cyan-500 to-fuchsia-500',
      glowClass: 'glow-cyan',
    },
    {
      label: '공백 포함',
      value: charCount,
      icon: Type,
      delay: 2,
    },
    {
      label: '공백 제외',
      value: charCountNoSpace,
      icon: Type,
      delay: 3,
    },
    {
      label: '바이트',
      value: byteSize,
      suffix: ' B',
      icon: HardDrive,
      delay: 4,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`
            group relative p-4 md:p-5 rounded-2xl overflow-hidden
            transition-all duration-300 ease-out
            hover-lift cursor-default
            ${mounted ? `animate-stagger-${stat.delay}` : 'opacity-0'}
            ${stat.highlight
              ? `bg-gradient-to-br ${stat.gradient} ${stat.glowClass}`
              : 'bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/50 dark:border-cyan-500/20 hover:border-cyan-500/40'
            }
          `}
        >
          {/* Shimmer effect on hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 shimmer pointer-events-none"></div>

          {/* Icon and label */}
          <div className="flex items-center gap-2 mb-3">
            <stat.icon
              className={`w-4 h-4 transition-transform duration-300 group-hover:scale-110 ${
                stat.highlight
                  ? 'text-white/80'
                  : 'text-slate-400 dark:text-cyan-400/60'
              }`}
            />
            <span
              className={`font-body text-xs font-medium tracking-wide ${
                stat.highlight
                  ? 'text-white/80'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              {stat.label}
            </span>
          </div>

          {/* Animated value */}
          <div className="relative">
            <AnimatedNumber
              value={stat.value}
              className={`
                font-mono text-2xl md:text-3xl font-bold tracking-tight
                transition-all duration-300
                ${stat.highlight
                  ? 'text-white text-glow-cyan'
                  : 'text-slate-800 dark:text-slate-100'
                }
              `}
            />
            {stat.suffix && (
              <span
                className={`
                  font-mono text-lg font-medium ml-0.5
                  ${stat.highlight
                    ? 'text-white/70'
                    : 'text-slate-500 dark:text-slate-400'
                  }
                `}
              >
                {stat.suffix}
              </span>
            )}
          </div>

          {/* Decorative corner accent for highlighted card */}
          {stat.highlight && (
            <>
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-fuchsia-400/20 rounded-full blur-xl translate-y-1/2 -translate-x-1/2"></div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
