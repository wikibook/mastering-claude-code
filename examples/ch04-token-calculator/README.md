# ch04-token-calculator — 토큰 계산기 앱

**관련 장:** 4장 (클로드 코드 고급 활용법)

여러 AI 모델(GPT·Claude·Gemini)의 프롬프트 토큰 수를 실시간으로 계산하는 React 앱입니다. 이 예제로 클로드 코드의 **고급 기능**(MCP, 테스트 작성, 플러그인, 커스텀 스킬)을 실습합니다.

## 무엇을 배우나요

- MCP(Model Context Protocol) 서버 연동
- Jest·React Testing Library·Playwright(e2e) 기반 테스트 작성
- 커스텀 플러그인과 스킬 제작

## 커스텀 스킬: `sec-check.skill`

`sec-check.skill`은 책에서 직접 만들어 보는 **커스텀 스킬**입니다. 프로젝트의 보안 취약점을 점검합니다.

- 하드코딩된 시크릿(API 키, 비밀번호, 토큰, AWS 키, 개인키, DB 접속 정보) 검색
- OWASP Top 10 취약점(인젝션, 인증, 보안 설정 오류 등) 점검
- `.env` 파일이 `.gitignore`에 포함됐는지 확인
- `/sec-check`, "보안 점검", "security audit" 요청 시 트리거

> `.skill` 파일은 압축(zip) 형식이라 GitHub에서 내용이 바로 보이지 않습니다. 내려받아 클로드 코드에 설치해 사용하세요. 제작 과정은 책 4장을 참고하세요.

## 실행 방법

```bash
npm install
npm run dev          # 개발 서버 (http://localhost:5173)
npm test             # 테스트 실행
npm run build        # 프로덕션 빌드
```

자세한 아키텍처와 명령어는 [CLAUDE.md](CLAUDE.md)를, 테스트 구성은 [TESTING_SETUP.md](TESTING_SETUP.md)를 참고하세요.

---

## React + Vite (템플릿 안내)

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
