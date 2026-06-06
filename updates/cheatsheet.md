# 클로드 코드 치트시트

> 클로드 코드(Claude Code) CLI에서 자주 쓰는 명령어·단축키·설정 파일을 한 장으로 정리했습니다. 입문자가 가장 많이 쓰는 것 위주로 추렸습니다.

- **관련 장:** 2장(클로드 코드 기초), 4장(고급 활용법)
- **기준:** 2026년 6월 (버전에 따라 일부 다를 수 있음)

---

## 자주 쓰는 슬래시 명령어

세션 안에서 `/`를 입력하면 명령어 목록이 뜹니다.

| 명령어 | 설명 |
|--------|------|
| `/help` | 사용 가능한 명령어 표시 |
| `/init` | 프로젝트용 `CLAUDE.md` 자동 생성 |
| `/clear` | 새 대화 시작 (컨텍스트 초기화) |
| `/model` | 사용할 모델 변경 |
| `/config` | 설정 화면 열기 (테마·모델 등) |
| `/permissions` | 도구 권한 규칙 관리 |
| `/context` | 현재 컨텍스트 사용량 보기 |
| `/compact` | 대화를 요약해 컨텍스트 확보 |
| `/memory` | `CLAUDE.md` 메모리 편집 |
| `/mcp` | MCP 서버 연결·인증 관리 |
| `/diff` | 미커밋 변경사항 보기 |
| `/resume` | 이전 대화 재개 |
| `/doctor` | 설치·설정 진단 |

---

## 입력 중 특수 키

| 입력 | 동작 |
|------|------|
| `/` | 슬래시 명령어 보기 |
| `@` | 파일 경로 자동완성 (파일 첨부) |
| `!` | 셸 모드 — Claude를 거치지 않고 명령어 직접 실행 |

---

## 주요 단축키

| 단축키 | 동작 |
|--------|------|
| `Esc` | Claude 응답 중단 |
| `Ctrl+C` | 실행 중단 / 입력 비우기 |
| `Ctrl+D` | 클로드 코드 종료 |
| `Shift+Tab` | 권한 모드 순환 (default → acceptEdits → plan …) |
| `Ctrl+R` | 명령어 히스토리 검색 |
| `↑` / `↓` | 이전·다음 명령어 |
| `\` + `Enter` | 여러 줄 입력 (모든 터미널) |
| `Ctrl+V` / `Cmd+V` | 클립보드 이미지 붙여넣기 |

> macOS에서 `Option` 단축키를 쓰려면 터미널 설정에서 "Use Option as Meta Key"를 켜세요.

---

## 자주 쓰는 실행 명령

```bash
claude                      # 대화형 세션 시작
claude "버그 좀 고쳐줘"     # 초기 프롬프트와 함께 시작
claude -c                   # 최근 대화 이어서 재개
claude --model sonnet       # 특정 모델로 시작
claude -p "작업"            # 비대화형(한 번 실행 후 종료)
claude --version            # 버전 확인
claude update               # 최신 버전으로 업데이트
```

---

## 권한 모드 (Permission Mode)

`Shift+Tab`으로 전환합니다. Claude가 파일 수정·명령 실행 시 확인을 어떻게 받을지 결정합니다.

| 모드 | 동작 |
|------|------|
| **default** | 도구를 처음 쓸 때마다 확인 (기본·권장) |
| **acceptEdits** | 작업 폴더 내 파일 수정은 자동 승인 |
| **plan** | 파일 수정 없이 읽기·탐색만 (안전) |
| **bypassPermissions** | 모든 확인 건너뜀 (격리 환경에서만 권장) |

---

## 주요 설정 파일

| 파일 | 역할 | 커밋? |
|------|------|------|
| `CLAUDE.md` | 프로젝트 컨텍스트·규칙을 Claude에게 전달 | ✅ |
| `.claude/settings.json` | 권한·모델·훅 등 프로젝트 설정 | ✅ |
| `.claude/settings.local.json` | 개인용 설정 (개인 권한 등) | ❌ (.gitignore) |
| `.mcp.json` | 팀이 공유할 MCP 서버 정의 | ✅ |

> 이 책의 예제들도 `CLAUDE.md`·`.mcp.json`을 활용합니다. [`examples/`](../examples/) 폴더에서 실제 사용 예를 확인하세요.

---

## 출처

- [Claude Code CLI 레퍼런스](https://code.claude.com/docs/en/cli-reference)
- [명령어 참조](https://code.claude.com/docs/en/commands)
- [인터랙티브 모드](https://code.claude.com/docs/en/interactive-mode)
- [설정](https://code.claude.com/docs/en/settings)

> 명령어와 단축키는 버전에 따라 바뀔 수 있습니다. 최신 내용은 [공식 문서](https://code.claude.com/docs)를 확인하세요.
