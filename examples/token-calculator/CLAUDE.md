# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A React-based web application that calculates token counts for AI model prompts in real-time. Supports multiple AI models (GPT, Claude, Gemini) with different tokenization strategies. The app uses `js-tiktoken` for GPT token calculation and provides estimations for Claude and Gemini models. All processing happens client-side for privacy.

## Commands

### Development
```bash
npm run dev          # Start Vite dev server with hot reload
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Testing
```bash
npm test                              # Run all tests with Jest
npm test -- <file-name>               # Run specific test file
npm test -- --watch                   # Run tests in watch mode
npm test -- --coverage                # Run tests with coverage report
npm test -- --verbose                 # Run tests with verbose output
node --experimental-vm-modules node_modules/jest/bin/jest.js  # Full test command
```

Note: Tests require the `--experimental-vm-modules` flag because the project uses ES modules (`"type": "module"` in package.json).

## Architecture

### Component Structure

```
App (src/App.jsx)
├── Container (Layout wrapper)
├── Header (Title + theme toggle)
├── main
│   ├── ModelSelector (AI model selection buttons)
│   ├── TokenDisplay (Shows token/character/byte counts)
│   ├── InputArea (Textarea for prompt input)
│   └── ControlBar (Copy/Clear buttons)
└── Footer
```

### State Management

The app uses React hooks for state management:
- **App.jsx**: Top-level state container
  - `text`: User input text
  - `selectedModel`: Currently selected AI model (gpt-5, sonnet-4.5, opus-4.5, gemini-3.0)
  - `darkMode`: Theme preference (synced with localStorage and system preferences)
  - `stats`: Memoized calculation results (tokenCount, charCount, charCountNoSpace, byteSize)

State flows down through props; callbacks flow up for user interactions.

### Tokenization Logic

Located in [src/utils/tokenizer.js](src/utils/tokenizer.js):

- **GPT models**: Use `js-tiktoken` library with `o200k_base` encoding (lazy-loaded for performance)
- **Claude models**: Estimated as ~95% of GPT token count (Claude tends to be 5-10% more efficient)
- **Gemini models**: Estimated with adjustment for Korean text (SentencePiece tokenization differs from BPE)

Korean text handling: The code recognizes that Korean characters consume more tokens. It calculates Korean character ratio and applies model-specific adjustments.

### Testing Setup

- **Framework**: Jest with jsdom environment
- **Testing Library**: React Testing Library
- **Transform**: Babel (via babel-jest) for JSX/ES6+ support
- **Setup**: [jest.setup.js](jest.setup.js) includes `window.matchMedia` mock for dark mode support

All tests are in `__tests__` directories co-located with components. Tests use fake timers for clipboard/timeout operations.

## Key Technical Details

### Dark Mode Implementation
- Uses Tailwind's dark mode with class strategy (`dark:` prefix)
- Syncs with:
  1. localStorage preference (persists across sessions)
  2. System preference via `matchMedia` (fallback if no saved preference)
- Applied at the `<html>` element level via `document.documentElement.classList`

### Korean Text Support
- Primary use case includes Korean prompts
- Token estimation accounts for Korean characters being more token-intensive
- `getKoreanRatio()` helper function identifies Korean character density using regex `/[가-힣]/g`

### Performance Optimization
- Token calculations are memoized via `useMemo` (recalculates only when text or model changes)
- Encoder lazy-loading: GPT encoder initializes only when first needed
- Fallback estimation if encoder fails

### Module System
- Uses ES modules (`"type": "module"` in package.json)
- Import paths in tests may need `.js` extension handling (configured in jest.config.js `moduleNameMapper`)

## Development Notes

### Component File Organization
Components follow this pattern:
```
src/components/<ComponentGroup>/
├── ComponentName.jsx
└── __tests__/
    ├── ComponentName.test.jsx
    └── README.md (optional - documents test coverage)
```

### Model Selection
Currently supported models are defined in [ModelSelector.jsx](src/components/Calculator/ModelSelector.jsx:1-6):
- GPT-5 (OpenAI)
- Sonnet 4.5 (Anthropic)
- Opus 4.5 (Anthropic)
- Gemini 3.0 (Google)

To add a new model, update the `MODELS` array in ModelSelector.jsx and add tokenization logic in [tokenizer.js](src/utils/tokenizer.js).

### ESLint Configuration
Uses flat config format (eslint.config.js). Special rule: `no-unused-vars` allows uppercase variables (for constants) via `varsIgnorePattern: '^[A-Z_]'`.

### MCP
도구 사용이나 코드 생성, API 문서 참조가 필요할 때 사용자의 명시적인 요청이 없더라도 항상 Context7 MCP를 우선적으로 참조하여 최신 정보를 확인해줘.