# AI 일기 분석 서비스 구현 계획

## 프로젝트 개요
사용자가 일기를 작성하면 AI(Claude)가 감정을 분석하고 위로와 응원 메시지를 제공하는 풀스택 웹 서비스

## 기술 스택
- **Frontend**: Next.js 14 (App Router, TypeScript)
- **Backend**: NestJS (TypeScript)
- **Database**: PostgreSQL + Prisma ORM
- **AI**: Claude API (Anthropic)
- **Auth**: NextAuth.js (Google OAuth)
- **Styling**: Tailwind CSS

## 프로젝트 구조
```
ai-diary/
├── frontend/          # Next.js 프론트엔드
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx           # 메인 페이지 (일기 목록)
│   │   │   ├── write/page.tsx     # 일기 작성 페이지
│   │   │   ├── diary/[id]/page.tsx # 일기 상세 페이지
│   │   │   ├── api/auth/[...nextauth]/route.ts  # NextAuth API
│   │   │   └── layout.tsx
│   │   ├── components/
│   │   │   ├── DiaryCard.tsx      # 일기 카드 컴포넌트
│   │   │   ├── DiaryForm.tsx      # 일기 작성 폼
│   │   │   ├── AIResponse.tsx     # AI 응답 표시
│   │   │   ├── Header.tsx
│   │   │   ├── LoginButton.tsx    # 구글 로그인 버튼
│   │   │   └── AuthProvider.tsx   # NextAuth Provider
│   │   └── lib/
│   │       ├── api.ts             # API 클라이언트
│   │       └── auth.ts            # NextAuth 설정
│   └── package.json
│
├── backend/           # NestJS 백엔드
│   ├── src/
│   │   ├── main.ts
│   │   ├── app.module.ts
│   │   ├── diary/
│   │   │   ├── diary.controller.ts
│   │   │   ├── diary.service.ts
│   │   │   ├── diary.module.ts
│   │   │   └── dto/
│   │   ├── ai/
│   │   │   ├── ai.service.ts      # Claude API 연동
│   │   │   └── ai.module.ts
│   │   └── prisma/
│   │       ├── prisma.service.ts
│   │       └── prisma.module.ts
│   ├── prisma/
│   │   └── schema.prisma
│   └── package.json
│
└── README.md
```

## 데이터베이스 스키마
```prisma
model User {
  id            String    @id @default(uuid())
  email         String    @unique
  name          String?
  image         String?
  diaries       Diary[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model Diary {
  id          String   @id @default(uuid())
  title       String
  content     String
  mood        String?          // AI가 분석한 감정
  aiResponse  String?          // AI 위로/응원 메시지
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### PostgreSQL 테이블 생성 쿼리
```sql
-- UUID 확장 활성화
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User 테이블 생성
CREATE TABLE "User" (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email       VARCHAR(255) NOT NULL UNIQUE,
    name        VARCHAR(255),
    image       TEXT,
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Diary 테이블 생성
CREATE TABLE "Diary" (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title       VARCHAR(255) NOT NULL,
    content     TEXT NOT NULL,
    mood        VARCHAR(50),
    ai_response TEXT,
    user_id     UUID NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스 생성
CREATE INDEX idx_diary_user_id ON "Diary"(user_id);
CREATE INDEX idx_diary_created_at ON "Diary"(created_at DESC);
CREATE INDEX idx_user_email ON "User"(email);

-- updated_at 자동 갱신 트리거 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- User 테이블 트리거
CREATE TRIGGER update_user_updated_at
    BEFORE UPDATE ON "User"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Diary 테이블 트리거
CREATE TRIGGER update_diary_updated_at
    BEFORE UPDATE ON "Diary"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

## API 엔드포인트
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/diaries | 일기 목록 조회 |
| GET | /api/diaries/:id | 일기 상세 조회 |
| POST | /api/diaries | 일기 작성 + AI 분석 |
| DELETE | /api/diaries/:id | 일기 삭제 |

## 구현 단계

### 1단계: 프로젝트 초기 설정
- [ ] Next.js 프론트엔드 프로젝트 생성
- [ ] NestJS 백엔드 프로젝트 생성
- [ ] PostgreSQL + Prisma 설정
- [ ] 환경 변수 설정 (.env)

### 2단계: 인증 구현
- [ ] NextAuth.js 설정 (Google OAuth Provider)
- [ ] 백엔드 JWT 검증 미들웨어
- [ ] 로그인/로그아웃 UI

### 3단계: 백엔드 구현
- [ ] Prisma 스키마 정의 및 마이그레이션
- [ ] User 및 Diary CRUD API 구현
- [ ] Claude API 연동 서비스 구현
- [ ] 일기 작성 시 AI 분석 로직 통합

### 4단계: 프론트엔드 구현
- [ ] 레이아웃 및 공통 컴포넌트
- [ ] 일기 목록 페이지
- [ ] 일기 작성 페이지 (폼 + AI 응답 표시)
- [ ] 일기 상세 페이지

### 5단계: 통합 및 테스트
- [ ] 프론트엔드-백엔드 연동
- [ ] 전체 플로우 테스트

## AI 분석 프롬프트 설계
Claude API에 전달할 시스템 프롬프트:
```
당신은 따뜻하고 공감 능력이 뛰어난 AI 상담사입니다.
사용자의 일기를 읽고 다음을 수행해주세요:
1. 일기에서 느껴지는 주요 감정을 파악하세요
2. 사용자의 감정에 공감하는 따뜻한 메시지를 작성하세요
3. 상황에 맞는 위로나 응원의 말을 전해주세요
4. 필요하다면 긍정적인 관점이나 조언을 제안하세요

응답은 친근하고 따뜻한 톤으로, 200-300자 내외로 작성해주세요.
```

## 검증 방법
1. 백엔드 서버 실행 (`npm run start:dev`)
2. 프론트엔드 서버 실행 (`npm run dev`)
3. 브라우저에서 http://localhost:3000 접속
4. 일기 작성 → AI 분석 응답 확인
5. 일기 목록 및 상세 페이지 확인

## 필요한 환경 변수
```env
# Backend (.env)
DATABASE_URL="postgresql://user:password@localhost:5432/ai_diary"
ANTHROPIC_API_KEY="your-claude-api-key"

# Frontend (.env.local)
NEXT_PUBLIC_API_URL="http://localhost:4000"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

---

## 프론트엔드 디자인 시스템

### 디자인 컨셉: "Ethereal Sanctuary" (몽환적 안식처)
일기라는 개인적이고 내밀한 공간의 특성을 살려, 사용자가 마음을 열고 자신의 이야기를 풀어놓을 수 있는 **치유적이고 몽환적인 분위기**를 연출합니다.

**핵심 키워드**: 몽환적, 부드러움, 치유, 고요함, 개인적 공간

---

### 타이포그래피 시스템

#### Display Font (제목용)
**Playfair Display** - 우아하고 감성적인 세리프체
- 일기 제목, 헤딩에 사용
- Weight: 400 (Regular), 600 (SemiBold), 700 (Bold)
- 특징: 클래식하면서도 현대적, 감성적인 무드 전달

```css
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&display=swap');
```

#### Body Font (본문용)
**Noto Serif KR** - 한글 가독성과 우아함의 조화
- 일기 본문, 일반 텍스트에 사용
- Weight: 300 (Light), 400 (Regular), 500 (Medium)
- 특징: 한글 최적화, 세리프의 고급스러움

```css
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@300;400;500&display=swap');
```

#### Accent Font (강조용)
**Cormorant Garamond** - 필기체 느낌의 우아한 세리프
- AI 응답, 특별한 메시지에 사용
- Weight: 300 (Light), 400 (Regular), 500 (Medium Italic)
- 특징: 손글씨 같은 따뜻함, 개인적인 느낌

```css
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,500&display=swap');
```

#### Tailwind 폰트 설정
```javascript
// tailwind.config.js
fontFamily: {
  'display': ['Playfair Display', 'serif'],
  'body': ['Noto Serif KR', 'serif'],
  'accent': ['Cormorant Garamond', 'serif'],
}
```

---

### 컬러 시스템

#### 메인 팔레트: "Twilight Mist" (황혼의 안개)
```css
:root {
  /* Primary - 깊은 자정 블루 */
  --midnight: #1a1a2e;
  --midnight-soft: #16213e;

  /* Secondary - 몽환적 라벤더 */
  --lavender: #e8d5f2;
  --lavender-mist: #f3e8ff;
  --lavender-deep: #c9b1d4;

  /* Accent - 로즈 골드 */
  --rose-gold: #e8b4b8;
  --rose-gold-light: #ffd5d8;
  --rose-gold-deep: #d4a5a5;

  /* Background - 크림과 안개 */
  --cream: #fefdfb;
  --mist: #f8f6f4;
  --cloud: #eee9e5;

  /* Text */
  --ink: #2d2d2d;
  --ink-light: #6b6b6b;
  --ink-muted: #9a9a9a;

  /* Mood Colors (감정별 컬러) */
  --mood-happy: #ffd93d;
  --mood-sad: #6c8ebf;
  --mood-angry: #e57373;
  --mood-peaceful: #81c784;
  --mood-anxious: #ba68c8;
  --mood-tired: #90a4ae;
}
```

#### 다크 모드 팔레트
```css
[data-theme="dark"] {
  --midnight: #0f0f1a;
  --midnight-soft: #1a1a2e;
  --lavender: #3d3d5c;
  --cream: #1e1e2e;
  --mist: #252535;
  --ink: #e8e8e8;
  --ink-light: #b0b0b0;
}
```

---

### 스테거(Staggered) 애니메이션 시스템

#### 페이지 진입 애니메이션
```css
/* 기본 fade-up 애니메이션 */
@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* 스테거 딜레이 클래스 */
.stagger-1 { animation-delay: 0ms; }
.stagger-2 { animation-delay: 80ms; }
.stagger-3 { animation-delay: 160ms; }
.stagger-4 { animation-delay: 240ms; }
.stagger-5 { animation-delay: 320ms; }
.stagger-6 { animation-delay: 400ms; }

/* 애니메이션 적용 */
.animate-fade-up {
  animation: fadeUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  opacity: 0;
}

.animate-scale-in {
  animation: scaleIn 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  opacity: 0;
}
```

#### React 컴포넌트용 스테거 훅
```typescript
// hooks/useStaggerAnimation.ts
export const useStaggerAnimation = (itemCount: number, baseDelay = 80) => {
  return Array.from({ length: itemCount }, (_, i) => ({
    style: {
      animationDelay: `${i * baseDelay}ms`,
    },
    className: 'animate-fade-up',
  }));
};
```

#### 일기 카드 목록 스테거 예시
```tsx
// 일기 목록에서 카드들이 순차적으로 나타남
{diaries.map((diary, index) => (
  <DiaryCard
    key={diary.id}
    className="animate-fade-up"
    style={{ animationDelay: `${index * 80}ms` }}
  />
))}
```

---

### 마이크로 인터랙션

#### 1. 버튼 인터랙션
```css
.btn-primary {
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}

.btn-primary::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.btn-primary:hover::before {
  width: 300px;
  height: 300px;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(232, 180, 184, 0.3);
}

.btn-primary:active {
  transform: translateY(0);
}
```

#### 2. 카드 호버 효과
```css
.diary-card {
  transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
  background: var(--cream);
  border: 1px solid transparent;
}

.diary-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow:
    0 20px 40px rgba(26, 26, 46, 0.1),
    0 0 0 1px var(--lavender);
  border-color: var(--lavender-deep);
}

/* 카드 내부 요소 호버 시 미세 움직임 */
.diary-card:hover .card-title {
  transform: translateX(4px);
}

.diary-card:hover .card-date {
  opacity: 1;
  transform: translateY(0);
}
```

#### 3. 입력 필드 포커스 효과
```css
.input-field {
  border: 2px solid var(--cloud);
  transition: all 0.3s ease;
  background: var(--cream);
}

.input-field:focus {
  border-color: var(--lavender-deep);
  box-shadow:
    0 0 0 4px var(--lavender-mist),
    0 4px 20px rgba(200, 177, 212, 0.2);
  outline: none;
}

/* 라벨 플로팅 효과 */
.input-label {
  transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}

.input-field:focus + .input-label,
.input-field:not(:placeholder-shown) + .input-label {
  transform: translateY(-24px) scale(0.85);
  color: var(--lavender-deep);
}
```

#### 4. AI 응답 타이핑 효과
```css
@keyframes typewriter {
  from { width: 0; }
  to { width: 100%; }
}

@keyframes blink {
  50% { border-color: transparent; }
}

.ai-response {
  overflow: hidden;
  white-space: nowrap;
  border-right: 2px solid var(--rose-gold);
  animation:
    typewriter 2s steps(40) forwards,
    blink 0.8s step-end infinite;
}

/* 또는 글자 단위 fade-in */
@keyframes letterFade {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.ai-letter {
  display: inline-block;
  opacity: 0;
  animation: letterFade 0.3s forwards;
}
```

#### 5. 감정 이모지 펄스 효과
```css
@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(232, 180, 184, 0.4);
  }
  50% {
    box-shadow: 0 0 0 15px rgba(232, 180, 184, 0);
  }
}

.mood-indicator {
  animation: pulse-glow 2s infinite;
  border-radius: 50%;
}
```

#### 6. 페이지 전환 효과
```css
@keyframes pageSlideIn {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes pageSlideOut {
  from {
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(-20px);
  }
}

.page-enter {
  animation: pageSlideIn 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

.page-exit {
  animation: pageSlideOut 0.3s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}
```

---

### 배경 및 시각 효과

#### 그라디언트 메쉬 배경
```css
.bg-ethereal {
  background:
    radial-gradient(ellipse at 20% 80%, var(--lavender-mist) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 20%, var(--rose-gold-light) 0%, transparent 40%),
    radial-gradient(ellipse at 50% 50%, var(--cream) 0%, var(--mist) 100%);
  background-attachment: fixed;
}
```

#### 노이즈 텍스처 오버레이
```css
.texture-noise::after {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.03;
  pointer-events: none;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
}
```

#### 플로팅 장식 요소
```css
@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
}

.floating-decoration {
  position: absolute;
  opacity: 0.1;
  animation: float 6s ease-in-out infinite;
}

.floating-decoration:nth-child(2) { animation-delay: -2s; }
.floating-decoration:nth-child(3) { animation-delay: -4s; }
```

---

### Motion 라이브러리 (Framer Motion) 설정

```typescript
// lib/animations.ts
export const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

export const fadeUpItem = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export const scaleInItem = {
  hidden: { opacity: 0, scale: 0.95 },
  show: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export const pageTransition = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
  transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
};
```

#### 사용 예시
```tsx
import { motion } from 'framer-motion';
import { staggerContainer, fadeUpItem } from '@/lib/animations';

export function DiaryList({ diaries }) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="grid gap-6"
    >
      {diaries.map((diary) => (
        <motion.div key={diary.id} variants={fadeUpItem}>
          <DiaryCard diary={diary} />
        </motion.div>
      ))}
    </motion.div>
  );
}
```

---

### 컴포넌트별 디자인 가이드

| 컴포넌트 | 폰트 | 애니메이션 | 특수 효과 |
|---------|------|-----------|----------|
| Header | Display (Playfair) | fadeUp, stagger | 그라디언트 언더라인 |
| DiaryCard | Body (Noto Serif KR) | scaleIn, hover lift | 호버 시 글로우 |
| DiaryForm | Body (Noto Serif KR) | fadeUp | 포커스 글로우, 플로팅 라벨 |
| AIResponse | Accent (Cormorant) | typewriter/letterFade | 펄스 글로우 |
| LoginButton | Display (Playfair) | scaleIn | 리플 이펙트 |
| MoodIndicator | - | pulse-glow | 감정별 컬러 |

---

### 추가 패키지 의존성
```json
{
  "dependencies": {
    "framer-motion": "^11.0.0"
  }
}
```
