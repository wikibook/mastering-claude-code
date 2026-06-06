# 코딩 성능 비교: SWE-bench (2026년 6월 기준)

> **요약:** 모델을 고를 때 "어느 모델이 코딩을 더 잘하나"는 핵심 질문입니다. 이 문서는 코딩 능력을 측정하는 대표 벤치마크인 **SWE-bench**를 기준으로 주요 모델의 최신 성능을 정리합니다. 클로드 코드는 어떤 Claude 모델로도 동작하므로, 작업 성격에 맞는 모델 선택에 참고하세요.

- **관련 장:** 2장(클로드 코드 기초), 4장(고급 활용법)
- **작성일:** 2026-06-06
- **데이터 기준:** 2026년 6월

---

## 1. SWE-bench란?

SWE-bench는 **실제 GitHub 이슈를 모델이 코드로 해결**하게 하고, 그 패치가 테스트를 통과하는지로 채점하는 벤치마크입니다. 단순 코드 생성이 아니라 "버그 리포트를 읽고 → 코드베이스를 탐색하고 → 수정하고 → 테스트를 통과"시키는, 클로드 코드가 하는 작업과 가장 비슷한 평가입니다.

주요 변형:

| 변형 | 특징 |
|------|------|
| **SWE-bench Verified** | 사람이 검증한 500개 문제. 가장 널리 인용되는 표준 지표 |
| **SWE-bench Pro** | 더 어렵고 까다로운 문제 세트 |
| SWE-bench Lite / Multilingual / Multimodal | 경량·다국어·멀티모달 변형 |

> 점수(resolved %)는 "전체 문제 중 올바르게 해결한 비율"입니다. 높을수록 좋습니다.

---

## 2. SWE-bench Verified 최신 순위 (주요 모델)

| 모델 | 제공사 | Verified 점수 |
|------|--------|--------------:|
| Claude Opus 4.8 | Anthropic | **88.6%** |
| Claude Opus 4.7 | Anthropic | 87.6% |
| Gemini 3.1 Pro | Google | 80.6% |
| Claude Opus 4.5 | Anthropic | 80.9% |
| GPT-5.2 | OpenAI | 80.0% |
| Claude Sonnet 4.6 | Anthropic | 79.6% |
| Gemini 3 Flash | Google | 78.0% |
| GPT-5.1 | OpenAI | 76.3% |
| Gemini 3 Pro | Google | 76.2% |
| GPT-5 | OpenAI | 74.9% |

- **Claude Opus 4.8**이 일반 공개 모델 중 가장 높은 88.6%를 기록했습니다.
- **Claude Sonnet 4.6**은 79.6%로, 속도·비용 대비 성능이 좋아 일상적인 코딩 작업에 균형이 좋습니다.

> 리더보드 최상단에는 연구 프리뷰(예: Claude Mythos Preview, 93.9%)도 등장하지만, 일반 사용 가능한 정식 모델 위주로 정리했습니다.

---

## 3. Opus 4.8의 코딩 성능 향상

- **SWE-bench Verified:** 87.6% (4.7) → **88.6%** (4.8)
- **SWE-bench Pro(더 어려운 세트):** 64.3% (4.7) → **69.2%** (4.8) — 약 4.9%p 향상

표준 세트에서는 소폭 향상이지만, 더 어려운 SWE-bench Pro에서 의미 있는 개선을 보였습니다. 또한 코드 결함을 놓치는 비율이 4.7 대비 약 1/4로 줄어, 코드 리뷰·디버깅 품질이 함께 좋아졌습니다.

---

## 4. 클로드 코드에서 모델 선택 가이드

| 상황 | 추천 |
|------|------|
| 가장 어렵고 긴 작업 (대규모 리팩터, 복잡한 버그) | Opus 4.8, effort `high`~`xhigh` |
| 일상적인 코딩·빠른 반복 | Sonnet 4.6 |
| 단순·속도 중심 작업 | Haiku 4.5 |

- **effort 설정**도 결과에 큰 영향을 줍니다. 코딩·에이전트 작업에는 `xhigh`가 권장되며, 클로드 코드의 기본값입니다. 자세한 내용은 [Claude Opus 4.8 업데이트](2026-05-claude-opus-4-8.md)를 참고하세요.
- 벤치마크 점수는 평가 조건(effort, 스캐폴딩 등)에 따라 달라질 수 있으니 **상대 비교의 참고치**로 보세요.

---

## 출처

- [SWE-bench 공식 사이트](https://www.swebench.com/)
- [SWE-bench Verified Leaderboard — llm-stats](https://llm-stats.com/benchmarks/swe-bench-verified)
- [Claude Opus 4.8 Benchmarks Explained — Vellum](https://www.vellum.ai/blog/claude-opus-4-8-benchmarks-explained)
- [Introducing Claude Opus 4.8 — Anthropic](https://www.anthropic.com/news/claude-opus-4-8)

> 벤치마크 순위와 점수는 새 모델 출시에 따라 계속 바뀝니다. 최신 수치는 위 출처를 직접 확인하세요.
