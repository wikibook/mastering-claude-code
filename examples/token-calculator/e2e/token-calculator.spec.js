/**
 * Token Calculator E2E Tests
 *
 * Playwright MCP를 사용한 E2E 테스트
 * - 메인 화면 로딩 확인
 * - 토큰 계산 기능 확인
 */

const BASE_URL = 'http://localhost:5173';

/**
 * E2E 테스트 시나리오
 *
 * 이 파일은 Playwright MCP를 통해 수동으로 실행되는 테스트 시나리오를 문서화합니다.
 *
 * 테스트 1: 메인 화면 로딩 확인
 * ================================
 * 1. http://localhost:5173 으로 이동
 * 2. 페이지 타이틀이 "Token Calculator"인지 확인
 * 3. 다음 UI 요소들이 표시되는지 확인:
 *    - 헤더: "TokenCalculator" 제목
 *    - 모델 선택 버튼: GPT-5, Sonnet 4.5, Opus 4.5, Gemini 3.0
 *    - 통계 표시: 토큰 수, 공백 포함, 공백 제외, 바이트
 *    - 텍스트 입력 영역
 *    - 복사/초기화 버튼
 *    - 푸터
 *
 * 테스트 2: 토큰 계산 기능 확인
 * ================================
 *
 * 2-1. 영문 텍스트 토큰 계산
 *   - 입력: "Hello World"
 *   - 기대 결과 (GPT-5):
 *     - 토큰 수: 2
 *     - 공백 포함: 11
 *     - 공백 제외: 10
 *     - 바이트: 11 B
 *
 * 2-2. 한글 텍스트 토큰 계산
 *   - 입력: "안녕하세요 세계"
 *   - 기대 결과 (GPT-5):
 *     - 토큰 수: 3 이상 (한글은 더 많은 토큰 소모)
 *     - 공백 포함: 8
 *     - 공백 제외: 7
 *     - 바이트: 22 B (한글 3바이트 * 7 + 공백 1바이트)
 *
 * 2-3. 모델 변경 시 토큰 수 변화
 *   - GPT-5 -> Sonnet 4.5 변경 시 토큰 수가 약간 감소 (95% 적용)
 *   - GPT-5 -> Gemini 3.0 변경 시 한글 텍스트는 토큰 수 약간 증가
 *
 * 2-4. 초기화 기능
 *   - 초기화 버튼 클릭 시 모든 값이 0으로 리셋
 */

export const testScenarios = {
  mainScreen: {
    name: '메인 화면 로딩 확인',
    steps: [
      { action: 'navigate', url: BASE_URL },
      { action: 'verify', element: 'title', expected: 'Token Calculator' },
      { action: 'verify', element: 'heading', expected: 'TokenCalculator' },
      { action: 'verify', element: 'button', expected: ['GPT-5', 'Sonnet 4.5', 'Opus 4.5', 'Gemini 3.0'] },
      { action: 'verify', element: 'stats', expected: ['토큰 수', '공백 포함', '공백 제외', '바이트'] },
      { action: 'verify', element: 'textbox', expected: '토큰을 계산할 텍스트를 입력하세요...' },
      { action: 'verify', element: 'button', expected: ['복사', '초기화'] },
    ],
  },

  tokenCalculation: {
    name: '토큰 계산 기능 확인',
    cases: [
      {
        name: '영문 텍스트 (GPT-5)',
        input: 'Hello World',
        model: 'GPT-5',
        expected: {
          tokenCount: 2,
          charCount: 11,
          charCountNoSpace: 10,
          byteSize: 11,
        },
      },
      {
        name: '한글 텍스트 (GPT-5)',
        input: '안녕하세요 세계',
        model: 'GPT-5',
        expected: {
          tokenCount: 3, // 한글은 더 많은 토큰
          charCount: 8,
          charCountNoSpace: 7,
          byteSize: 22, // UTF-8: 한글 3바이트 * 7자 + 공백 1바이트
        },
      },
      {
        name: '모델 변경 - Claude (Sonnet 4.5)',
        input: 'Hello World',
        model: 'Sonnet 4.5',
        expected: {
          tokenCount: 2, // GPT의 95% = 1.9 -> 반올림 2
          charCount: 11,
          charCountNoSpace: 10,
          byteSize: 11,
        },
      },
    ],
  },

  clearFunction: {
    name: '초기화 기능 확인',
    steps: [
      { action: 'type', text: 'Test text' },
      { action: 'verify', element: 'stats', notEqual: 0 },
      { action: 'click', element: '초기화' },
      { action: 'verify', element: 'stats', expected: { tokenCount: 0, charCount: 0 } },
    ],
  },
};

/**
 * Playwright MCP 명령어 예시
 *
 * 1. 페이지 이동:
 *    mcp__playwright__browser_navigate({ url: 'http://localhost:5173' })
 *
 * 2. 스냅샷 확인:
 *    mcp__playwright__browser_snapshot()
 *
 * 3. 텍스트 입력:
 *    mcp__playwright__browser_type({ ref: 'textbox_ref', text: 'Hello World' })
 *
 * 4. 버튼 클릭:
 *    mcp__playwright__browser_click({ ref: 'button_ref' })
 *
 * 5. 스크린샷:
 *    mcp__playwright__browser_take_screenshot({ type: 'png' })
 */
