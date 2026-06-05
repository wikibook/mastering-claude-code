# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AI 일기 분석 서비스 - 사용자가 일기를 작성하면 Claude AI가 감정을 분석하고 위로/응원 메시지를 제공하는 풀스택 웹 서비스

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, Framer Motion
- **Backend**: NestJS 11, TypeScript, Prisma ORM
- **Database**: PostgreSQL (Supabase)
- **AI**: Anthropic Claude API (claude-sonnet-4-20250514)
- **Auth**: NextAuth.js (Google OAuth)

## Commands

### Root (runs both frontend & backend)
```bash
npm run dev              # Start both servers concurrently
npm run build            # Build both projects
```

### Frontend (port 3000)
```bash
cd frontend
npm run dev              # Development server
npm run build            # Production build
npm run lint             # ESLint
```

### Backend (port 4000)
```bash
cd backend
npm run start:dev        # Development with watch mode
npm run build            # Production build
npm run lint             # ESLint with auto-fix
npm run test             # Jest unit tests
npm run test:watch       # Jest watch mode
npm run test:e2e         # End-to-end tests
```

### Database (Prisma)
```bash
npm run db:migrate       # Run migrations
npm run db:generate      # Generate Prisma client
npm run db:studio        # Open Prisma Studio
```

## Architecture

### Monorepo Structure
```
ai-diary/
├── frontend/          # Next.js App Router
│   └── src/
│       ├── app/       # Pages (/, /write, /diary/[id])
│       ├── components/# React components
│       └── lib/       # API client, auth config, animations
└── backend/           # NestJS
    ├── src/
    │   ├── diary/     # Diary CRUD + AI analysis
    │   ├── user/      # User management
    │   ├── ai/        # Claude API integration
    │   └── prisma/    # Database service
    └── prisma/        # Schema & migrations
```

### Data Flow
1. User writes diary → Frontend calls `POST /api/diaries`
2. Backend receives diary → `DiaryService` calls `AiService.analyzeDiary()`
3. `AiService` sends content to Claude API → receives mood + response
4. Backend saves diary with AI analysis → returns to frontend

### Key Modules
- **AiService** (`backend/src/ai/ai.service.ts`): Claude API integration with structured JSON response parsing
- **DiaryService**: CRUD operations with automatic AI analysis on create
- **api.ts** (`frontend/src/lib/api.ts`): Typed API client with session-based auth

## Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://...
ANTHROPIC_API_KEY=sk-ant-...
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

## Design System

Uses "Ethereal Sanctuary" design concept with:
- **Fonts**: Playfair Display (headings), Noto Serif KR (body), Cormorant Garamond (AI responses)
- **Colors**: Midnight blue (#1a1a2e), Lavender (#e8d5f2), Rose gold (#e8b4b8)
- **Mood colors**: happy(yellow), sad(blue), angry(red), peaceful(green), anxious(purple), tired(gray)
- **Animations**: Staggered fade-up, scale-in, typewriter effect for AI responses
