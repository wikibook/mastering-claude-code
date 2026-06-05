# Claude Opus 4.8 업데이트 (2026년 5월)

> **요약:** 2026년 5월 28일, Anthropic이 Claude Opus 4.8을 공개했습니다. 클로드 코드 관점에서 가장 중요한 변화는 **동적 워크플로(Dynamic Workflows)** 연구 프리뷰, **effort(노력 수준) 제어**, 그리고 더 저렴해진 **Fast 모드**입니다. 이 문서는 책 출간 이후의 변경 사항을 보충합니다.

- **관련 장:** 2장(클로드 코드 기초), 4장(고급 활용법), 5장(풀스택 워크플로)
- **작성일:** 2026-06-06
- **모델 ID:** `claude-opus-4-8`

---

## 1. 한눈에 보기

| 항목 | 내용 |
|------|------|
| 출시일 | 2026년 5월 28일 |
| 모델 ID | `claude-opus-4-8` |
| 컨텍스트 윈도 | 1M 토큰 (장문 추가 요금 없음) |
| 가격(표준) | 입력 $5 / 출력 $25 (100만 토큰당) — Opus 4.7과 동일 |
| Fast 모드 가격 | 입력 $10 / 출력 $50 (이전 세대 대비 약 3배 저렴, 속도 2.5배) |

가격이 Opus 4.7과 같으면서 코딩·에이전트·추론·지식 작업 전반의 성능이 향상되었습니다. 특히 코드 결함을 놓치는 비율이 Opus 4.7 대비 약 1/4로 줄었습니다.

---

## 2. 클로드 코드 관련 핵심 변화

### 2.1 동적 워크플로 (Dynamic Workflows) — 연구 프리뷰

하나의 오케스트레이터 세션이 **수백 개의 병렬 서브에이전트**를 생성하고, 각 서브에이전트가 독립된 컨텍스트 윈도에서 작업한 뒤 결과를 하나로 취합하는 기능입니다. 결과를 보고하기 전에 출력을 검증하는 단계가 포함됩니다.

- **언제 쓰나:** 수십만 줄 규모의 코드베이스 마이그레이션, 대규모 감사, 광범위한 일괄 수정처럼 단일 컨텍스트로는 담기 어려운 작업.
- **책 4장(고급 활용법)의 서브에이전트/병렬 작업 내용을 확장하는 기능**으로 보면 됩니다.

> 연구 프리뷰 단계이므로 동작과 사용법이 바뀔 수 있습니다. 최신 정보는 공식 문서를 확인하세요.

### 2.2 effort(노력 수준) 제어

claude.ai와 Cowork에 effort 슬라이더가 추가되었습니다. 높게 설정하면 더 자주 깊게 사고해 응답 품질이 올라가고, 낮게 설정하면 속도가 빨라지고 사용량(rate limit)을 아낍니다.

- API에서는 `output_config: { effort: "low" | "medium" | "high" | "xhigh" | "max" }`로 제어합니다.
- 코딩·에이전트 작업에는 `high` 또는 `xhigh`가 권장됩니다(`xhigh`는 클로드 코드의 기본값).
- Opus 4.8에서는 무작정 `xhigh`/`max`로 올리기보다 `high`를 기본으로 두고 작업별로 조정하는 편이 좋습니다.

### 2.3 Fast 모드가 더 저렴해짐

Opus 4.8의 Fast 모드는 약 2.5배 빠른 속도로 동작하며, 이전 세대 대비 약 3배 저렴해졌습니다(입력 $10 / 출력 $50). 클로드 코드에서는 `/fast` 명령으로 토글할 수 있습니다.

---

## 3. API 사용자를 위한 변경 사항

책의 예제 중 Anthropic API를 직접 호출하는 부분(예: 5장 `ai-diary`의 백엔드)을 Opus 4.8로 올릴 때 참고하세요.

### 3.1 모델 ID

```diff
- claude-opus-4-7   (또는 이전 모델)
+ claude-opus-4-8
```

### 3.2 thinking은 adaptive만 지원

Opus 4.8/4.7에서는 고정 토큰 예산 방식(`thinking: {type: "enabled", budget_tokens: N}`)이 **제거**되어 400 오류가 납니다. 적응형 사고를 사용하세요.

```diff
- thinking: { type: "enabled", budget_tokens: 8000 }
+ thinking: { type: "adaptive" }
```

`temperature`, `top_p`, `top_k` 같은 샘플링 파라미터도 Opus 4.8/4.7에서는 제거되어 400 오류가 납니다. 동작은 프롬프트로 유도하세요.

### 3.3 대화 중간 system 메시지 (신규)

Messages API가 `messages` 배열 안에 `{ "role": "system", ... }` 항목을 받도록 확장되었습니다. 작업 도중 지시를 갱신할 때 **프롬프트 캐시를 깨뜨리지 않고** 적용할 수 있습니다. (베타 헤더: `mid-conversation-system-2026-04-07`)

### 3.4 프롬프트 캐싱 최소 길이 인하

Opus 4.8의 캐시 가능한 최소 프롬프트 길이가 **1,024 토큰**으로 낮아졌습니다(이전 세대는 더 길었음). 짧은 프롬프트도 코드 변경 없이 캐시 대상이 될 수 있습니다.

> Opus 4.7 → 4.8 이전은 대부분 **모델 ID 교체 + 프롬프트 재조정**으로 끝납니다. 새로운 필수 코드 변경(브레이킹 체인지)은 없습니다.

---

## 4. 책 내용과의 연결

| 책 위치 | 보충 포인트 |
|---------|-------------|
| 2장 클로드 코드 기초 | 모델이 Opus 4.8로 갱신됨. `/fast`, effort 개념 추가 |
| 4장 고급 활용법 | 동적 워크플로(대규모 병렬 서브에이전트)로 서브에이전트 활용 확장 |
| 5장 풀스택 워크플로 | `ai-diary` 백엔드의 `ANTHROPIC_API_KEY` 호출 시 모델 ID를 `claude-opus-4-8`로 |

---

## 출처

- [Introducing Claude Opus 4.8 — Anthropic](https://www.anthropic.com/news/claude-opus-4-8)
- [What's new in Claude Opus 4.8 — Claude API Docs](https://platform.claude.com/docs/en/about-claude/models/whats-new-claude-4-8)
- [Claude Opus 4.8 is generally available for GitHub Copilot — GitHub Changelog](https://github.blog/changelog/2026-05-28-claude-opus-4-8-is-generally-available-for-github-copilot/)

> 이 문서는 책 출간 이후의 최신 정보를 정리한 보충 자료입니다. 기능은 계속 업데이트될 수 있으니, 정확한 최신 내용은 [Anthropic 공식 문서](https://docs.claude.com/)를 확인하세요.
