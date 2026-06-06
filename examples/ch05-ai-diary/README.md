# ch05-ai-diary — AI가 위로하는 일기장

**관련 장:** 5장 (AI 에이전트 기반의 풀스택 개발 워크플로)

사용자가 일기를 작성하면 Claude AI가 감정을 분석하고 위로·응원 메시지를 제공하는 **풀스택 웹 서비스**입니다. 클로드 코드로 프런트엔드부터 백엔드, 데이터베이스, 배포까지 이어지는 워크플로를 실습합니다.

## 무엇을 배우나요

- 클로드 코드로 풀스택 프로젝트를 설계하고 구현하는 흐름
- 프런트엔드 ↔ 백엔드 ↔ DB ↔ AI API 연동
- 환경 변수·인증·배포 설정

## 기술 스택

- **프런트엔드**: Next.js (App Router), React, TypeScript, Tailwind CSS, Framer Motion
- **백엔드**: NestJS, TypeScript, Prisma ORM
- **데이터베이스**: PostgreSQL (Supabase)
- **AI**: Anthropic Claude API
- **인증**: NextAuth.js (Google OAuth)

## 구성

```
ch05-ai-diary/
├── frontend/        # Next.js 앱
├── backend/         # NestJS API 서버
├── documents/       # 설계 문서 (plan.md)
├── CLAUDE.md        # 프로젝트 가이드
└── .mcp.json        # MCP 서버 설정 (키는 플레이스홀더)
```

## 시작하기

### 1. 환경 변수 설정

백엔드 실행에는 DB 접속 정보와 Anthropic API 키가 필요합니다. 템플릿을 복사해 본인 값으로 채우세요.

```bash
cp backend/.env.example backend/.env
# backend/.env 를 열어 DATABASE_URL, ANTHROPIC_API_KEY 등을 입력
```

> ⚠️ `.env` 파일에는 실제 비밀이 들어가며 저장소에 커밋하지 마세요. (`.gitignore`로 제외되어 있습니다.)
>
> 프런트엔드도 Google OAuth 등을 사용하려면 `frontend/.env.local`이 필요합니다. 자세한 키는 `CLAUDE.md`를 참고하세요.

### 2. 의존성 설치

```bash
npm install
cd frontend && npm install && cd ..
cd backend && npm install && cd ..
```

### 3. 데이터베이스 준비

```bash
npm run db:generate
npm run db:migrate
```

### 4. 개발 서버 실행

```bash
npm run dev          # 프런트엔드 + 백엔드 동시 실행
```

> 책 5장의 풀스택 워크플로를 따라가며 단계별로 이 프로젝트를 완성합니다. 모델 ID 등 최신 변경 사항은 저장소 루트의 [`updates/`](../../updates/) 폴더도 확인하세요.
