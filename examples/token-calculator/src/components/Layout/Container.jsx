export default function Container({ children }) {
  return (
    <div className="min-h-screen relative overflow-hidden transition-colors duration-500 bg-gradient-to-br from-slate-50 via-slate-100 to-cyan-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Animated gradient orbs - background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Cyan orb */}
        <div
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-20 dark:opacity-10 blur-3xl animate-float"
          style={{
            background: 'radial-gradient(circle, rgba(0,255,242,0.4) 0%, transparent 70%)',
            animationDelay: '0s',
            animationDuration: '8s',
          }}
        ></div>

        {/* Magenta orb */}
        <div
          className="absolute top-1/2 -left-40 w-80 h-80 rounded-full opacity-15 dark:opacity-10 blur-3xl animate-float"
          style={{
            background: 'radial-gradient(circle, rgba(255,0,255,0.3) 0%, transparent 70%)',
            animationDelay: '2s',
            animationDuration: '10s',
          }}
        ></div>

        {/* Bottom accent orb */}
        <div
          className="absolute -bottom-20 right-1/3 w-64 h-64 rounded-full opacity-20 dark:opacity-10 blur-3xl animate-float"
          style={{
            background: 'radial-gradient(circle, rgba(16,185,129,0.3) 0%, transparent 70%)',
            animationDelay: '4s',
            animationDuration: '12s',
          }}
        ></div>
      </div>

      {/* Grid pattern overlay (dark mode only) */}
      <div className="fixed inset-0 grid-bg opacity-0 dark:opacity-100 pointer-events-none transition-opacity duration-500"></div>

      {/* Scanline effect (subtle, dark mode only) */}
      <div className="hidden dark:block scanline-overlay"></div>

      {/* Noise texture overlay */}
      <div className="noise-overlay"></div>

      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto p-4 md:p-8">
        {children}
      </div>
    </div>
  );
}
