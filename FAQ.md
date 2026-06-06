# 자주 묻는 질문 (FAQ) & 트러블슈팅

책을 따라 하다 막히는 부분을 모았습니다. 여기에 없는 문제는 [Issues](https://github.com/wikibook/mastering-claude-code/issues)에 남겨주세요.

---

## 설치 / 시작

### Q. 클로드 코드는 어떻게 설치하나요?

Node.js(LTS 권장)가 설치된 상태에서 다음을 실행합니다.

```bash
npm install -g @anthropic-ai/claude-code
```

설치 후 프로젝트 폴더에서 `claude`를 실행하면 시작됩니다. 설치·설정에 문제가 있으면 `claude doctor`로 진단할 수 있습니다.

### Q. `command not found: claude` 가 나옵니다.

전역 설치된 npm 패키지 경로가 PATH에 없을 때 발생합니다.

- `npm config get prefix`로 전역 경로를 확인하고, 그 아래 `bin` 디렉터리가 PATH에 포함됐는지 확인하세요.
- 또는 `npx @anthropic-ai/claude-code`로 실행해볼 수 있습니다.

### Q. 로그인/인증은 어떻게 하나요?

처음 `claude`를 실행하면 인증 절차가 안내됩니다. 안내에 따라 브라우저 로그인 또는 API 키 설정을 진행하세요. 자세한 방법은 [공식 문서](https://code.claude.com/docs)를 참고하세요.

---

## 예제 실행

### Q. 예제를 어떻게 받나요?

```bash
git clone https://github.com/wikibook/mastering-claude-code.git
cd mastering-claude-code/examples/ch04-token-calculator
npm install
npm run dev
```

각 예제 폴더의 `README.md`에 실행 방법이 정리되어 있습니다.

### Q. `ai-diary`(5장) 실행 시 환경 변수 오류가 납니다.

`ai-diary`는 DB 접속 정보와 Anthropic API 키가 필요합니다. 템플릿을 복사해 본인 값으로 채우세요.

```bash
cp examples/ch05-ai-diary/backend/.env.example examples/ch05-ai-diary/backend/.env
```

> 실제 `.env` 파일은 저장소에 포함되어 있지 않습니다(보안). `.env.example`을 참고해 직접 만들어야 합니다.

### Q. `sec-check.skill` 파일이 깨져 보입니다.

`.skill` 파일은 압축(zip) 형식이라 GitHub/에디터에서 내용이 바로 보이지 않습니다. 정상입니다. 내려받아 클로드 코드에 설치해 사용하세요. 자세한 내용은 [ch04 README](examples/ch04-token-calculator/README.md)를 참고하세요.

---

## 사용 중 자주 만나는 문제

### Q. Claude가 파일을 수정하려 할 때마다 확인을 물어봐서 번거롭습니다.

권한 모드 때문입니다. `Shift+Tab`으로 **acceptEdits** 모드로 바꾸면 작업 폴더 내 수정은 자동 승인됩니다. 권한 개념은 [치트시트](updates/cheatsheet.md#권한-모드-permission-mode)를 참고하세요.

### Q. 대화가 길어져서 컨텍스트가 가득 찼습니다.

- `/compact` — 지금까지 대화를 요약해 공간을 확보합니다.
- `/clear` — 새 대화를 시작합니다(필요하면 `/resume`으로 복구).
- `/context` — 현재 컨텍스트 사용량을 확인합니다.

### Q. 어떤 모델을 써야 하나요?

작업 성격에 따라 다릅니다. 어려운 작업은 Opus, 일상 작업은 Sonnet, 단순·빠른 작업은 Haiku가 일반적입니다. 자세한 비교는 [코딩 성능 비교 문서](updates/2026-06-coding-benchmark-swe-bench.md)를 참고하세요.

### Q. MCP 서버가 연결되지 않습니다.

- `/mcp`로 연결 상태와 인증을 확인하세요.
- `.mcp.json`의 서버 정의와 인증 정보(키/토큰)가 올바른지 확인하세요.
- API 키가 들어가는 부분은 예제에서 플레이스홀더(`YOUR_..._KEY`)로 되어 있으니 본인 값으로 교체해야 합니다.

---

## 그 외

### Q. 클로드 코드 최신 변경 사항은 어디서 보나요?

이 저장소의 [`updates/`](updates/) 폴더에 책 출간 이후 정보를 정리하고 있습니다. 공식 변경 사항은 [공식 문서](https://code.claude.com/docs)를 확인하세요.

### Q. 책 내용에 오류를 발견했어요.

[정오표(errata)](errata.md)를 확인하고, 없는 내용이면 [Issues](https://github.com/wikibook/mastering-claude-code/issues)로 제보해주세요.
