# 밑바닥부터 따라하면서 배우는 클로드 코드 완전 정복

<p align="center">
  <img src="cover.jpg" alt="책 표지" width="320">
</p>

> 바이브 코딩 입문자부터 풀스택 개발자까지, 모두를 위한 클로드 코드(Claude Code) 완전 활용법

이 저장소는 **《밑바닥부터 따라하면서 배우는 클로드 코드 완전 정복》**(엄태효 지음, 위키북스)의 **예제 코드**와 **온라인 정보 공유**를 위한 공간입니다.

---

## 📖 책 소개

클로드 코드(Claude Code)는 Anthropic이 만든 터미널 기반 AI 코딩 도구입니다. 이 책은 클로드 코드를 처음 접하는 입문자부터 실무에서 활용하려는 풀스택 개발자까지, 단계별로 따라 하며 익힐 수 있도록 구성되어 있습니다.

- **대상 독자**: 바이브 코딩 입문자, 클로드 코드를 실무에 적용하려는 개발자
- **저자**: 엄태효
- **출판사**: 위키북스 (생성형 AI 프로그래밍 시리즈 _031)

## 📢 최신 정보

클로드 코드와 Claude 모델은 책 출간 이후에도 계속 업데이트됩니다. 본문을 보완하는 최신 정보를 [`updates/`](updates/) 폴더에 정리하고 있습니다.

| 날짜 | 제목 | 관련 장 |
|------|------|---------|
| 2026-06 | [코딩 성능 비교: SWE-bench](updates/2026-06-coding-benchmark-swe-bench.md) | 2·4장 |
| 2026-05 | [Claude Opus 4.8 업데이트](updates/2026-05-claude-opus-4-8.md) | 2·4·5장 |

## 🗂️ 예제 코드

예제 코드는 [`examples/`](examples/) 폴더에 프로젝트별로 정리되어 있습니다.

| 장 | 프로젝트 | 설명 | 주요 기술 |
|----|----------|------|-----------|
| 3장 | [ch03-first-vibe](examples/ch03-first-vibe/) | 바이브 코딩 첫걸음 — 정적 웹 페이지 | HTML |
| 3장 | [ch03-second-vibe](examples/ch03-second-vibe/) | 바이브 코딩 실습 — 인터랙티브 웹 페이지 | HTML, CSS, JavaScript |
| 4장 | [ch04-token-calculator](examples/ch04-token-calculator/) | 토큰 계산기 앱 — MCP·테스트·플러그인·스킬 활용 | React, Vite, Jest, Playwright |
| 5장 | [ch05-ai-diary](examples/ch05-ai-diary/) | AI가 위로하는 일기장 풀스택 서비스 | Next.js, NestJS, Prisma, Supabase |

> 각 프로젝트 폴더의 `README.md` / `CLAUDE.md`에서 자세한 설명과 실행 방법을 확인할 수 있습니다.

### 환경 변수 안내

`ai-diary` 등 일부 예제는 실행에 환경 변수(API 키, DB 접속 정보 등)가 필요합니다.
보안을 위해 실제 `.env` 파일은 저장소에 포함하지 않았으며, 대신 `.env.example` 템플릿을 제공합니다.
이를 복사해 본인의 값으로 채워 사용하세요.

```bash
cp examples/ch05-ai-diary/backend/.env.example examples/ch05-ai-diary/backend/.env
```

## 🗂️ 저장소 구성

```
mastering-claude-code/
├── README.md          # 저장소 안내 (현재 문서)
├── cover.jpg          # 책 표지 이미지
├── .gitignore
└── examples/          # 장별 예제 코드
    ├── ch03-first-vibe/
    ├── ch03-second-vibe/
    ├── ch04-token-calculator/
    └── ch05-ai-diary/
```

## 🚀 시작하기

### 1. 클로드 코드 설치

공식 권장 방식은 **네이티브 설치**입니다.

**macOS · Linux · WSL**

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

**Windows (PowerShell)**

```powershell
irm https://claude.ai/install.ps1 | iex
```

> 네이티브 설치는 백그라운드에서 자동 업데이트됩니다. Homebrew(`brew install --cask claude-code`), WinGet, npm 등 다른 방법은 [공식 문서](https://code.claude.com/docs/en/setup)를 참고하세요. 터미널보다 GUI를 선호하면 [데스크톱 앱](https://code.claude.com/docs/en/desktop-quickstart)도 있습니다.

설치 후 프로젝트 폴더에서 실행합니다. 처음 실행하면 로그인/인증 절차가 안내됩니다.

```bash
claude
```

문제가 있으면 `claude doctor`로 설치·설정을 진단할 수 있습니다. 자세한 사용법은 책 본문과 [공식 문서](https://code.claude.com/docs)를 참고하세요.

> ℹ️ 클로드 코드 사용에는 Claude Pro/Max/Team/Enterprise 또는 Console 계정이 필요합니다(무료 플랜 제외). 자세한 내용은 [인증 문서](https://code.claude.com/docs/en/authentication)를 참고하세요.

> 💡 자주 쓰는 명령어·단축키는 [치트시트](updates/cheatsheet.md)에 정리되어 있습니다.

### 2. 예제 코드 내려받기

```bash
git clone https://github.com/wikibook/mastering-claude-code.git
cd mastering-claude-code
```

각 예제 실행 방법은 해당 폴더의 `README.md`를 참고하세요.

## 💬 문의 · FAQ · 정오표

- **막히는 부분이 있나요?** 먼저 [자주 묻는 질문(FAQ)](FAQ.md)을 확인해보세요.
- **책에서 오류를 발견했나요?** [정오표(errata)](errata.md)를 확인하고, 없는 내용이면 [Issues](https://github.com/wikibook/mastering-claude-code/issues)에 제보해주세요.
- 그 외 문의도 [Issues](https://github.com/wikibook/mastering-claude-code/issues)에 남겨주세요.

## 📄 라이선스

이 저장소의 예제 코드는 학습 목적으로 자유롭게 사용할 수 있습니다. 자세한 내용은 [LICENSE](LICENSE)와 책 본문을 참고하세요.

---

<p align="center">
  위키북스 · 생성형 AI 프로그래밍 _031
</p>
