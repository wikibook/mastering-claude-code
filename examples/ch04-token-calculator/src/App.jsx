import { useState, useEffect, useMemo } from 'react';
import Container from './components/Layout/Container';
import Header from './components/Header/Header';
import ModelSelector from './components/Calculator/ModelSelector';
import TokenDisplay from './components/Calculator/TokenDisplay';
import InputArea from './components/Calculator/InputArea';
import ControlBar from './components/Calculator/ControlBar';
import Footer from './components/Footer/Footer';
import { countTokens, countCharacters, countCharactersNoSpace, countBytes } from './utils/tokenizer';

/** @typedef {import('./utils/tokenizer').ModelType} ModelType */

function App() {
  const [text, setText] = useState('');
  /** @type {[ModelType, React.Dispatch<React.SetStateAction<ModelType>>]} */
  const [selectedModel, setSelectedModel] = useState(/** @type {ModelType} */ ('gpt-5'));
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('darkMode');
      if (saved !== null) {
        return JSON.parse(saved);
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // 다크 모드 적용
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  // 시스템 테마 변경 감지
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      const saved = localStorage.getItem('darkMode');
      if (saved === null) {
        setDarkMode(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // 토큰 및 통계 계산 (메모이제이션)
  const stats = useMemo(() => ({
    tokenCount: countTokens(text, selectedModel),
    charCount: countCharacters(text),
    charCountNoSpace: countCharactersNoSpace(text),
    byteSize: countBytes(text),
  }), [text, selectedModel]);

  const handleToggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const handleClear = () => {
    setText('');
  };

  return (
    <Container>
      <Header darkMode={darkMode} onToggleTheme={handleToggleTheme} />

      <main className="relative bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-3xl shadow-2xl shadow-slate-200/50 dark:shadow-black/30 p-6 md:p-8 border border-slate-200/50 dark:border-cyan-500/10 overflow-hidden">
        {/* Decorative corner accents */}
        <div className="absolute top-0 left-0 w-20 h-20 border-l-2 border-t-2 border-cyan-500/20 dark:border-cyan-400/20 rounded-tl-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-20 h-20 border-r-2 border-b-2 border-fuchsia-500/20 dark:border-fuchsia-400/20 rounded-br-3xl pointer-events-none"></div>

        <ModelSelector
          selectedModel={selectedModel}
          onModelChange={setSelectedModel}
        />

        <TokenDisplay
          tokenCount={stats.tokenCount}
          charCount={stats.charCount}
          charCountNoSpace={stats.charCountNoSpace}
          byteSize={stats.byteSize}
        />

        <InputArea text={text} onTextChange={setText} />

        <ControlBar text={text} onClear={handleClear} />
      </main>

      <Footer />
    </Container>
  );
}

export default App;
