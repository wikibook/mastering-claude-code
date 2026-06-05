# Product Requirements Document: 프롬프트 토큰 계산기

## 1. 개요 (Overview)

### 1.1 목적
사용자가 입력한 프롬프트 텍스트의 토큰 수를 실시간으로 계산하여 표시하는 웹 애플리케이션을 개발한다.

### 1.2 목표
- 한글과 영문 텍스트에 대한 정확한 토큰 계산 제공
- 직관적이고 사용하기 쉬운 UI/UX
- 실시간 토큰 계산 및 피드백

## 2. 기술 스택 (Tech Stack)

### 2.1 프론트엔드
- **React**: UI 컴포넌트 개발
- **Tailwind CSS**: 스타일링
- **JavaScript/TypeScript**: 프로그래밍 언어

### 2.2 토큰 계산 라이브러리
- **tiktoken** 또는 유사 라이브러리: GPT 모델의 토큰 계산
- OpenAI의 토크나이저를 기반으로 한글 및 영문 지원

## 3. 기능 요구사항 (Functional Requirements)

### 3.1 핵심 기능

#### 3.1.1 텍스트 입력 영역
- 사용자가 프롬프트를 입력할 수 있는 대형 텍스트 영역 (textarea)
- 다중 행 입력 지원
- 한글, 영문, 특수문자, 이모지 등 모든 문자 입력 가능

#### 3.1.2 실시간 토큰 계산
- 텍스트 입력 시 실시간으로 토큰 수 계산
- 한글과 영문 각각의 토큰 계산 특성 반영
- 계산 결과 즉시 표시

#### 3.1.3 결과 표시
- **토큰 수**: 계산된 총 토큰 수
- **문자 수**: 입력된 총 문자 수 (공백 포함/제외 옵션)
- **단어 수**: 단어 개수 (영문 기준)

#### 3.1.4 추가 정보
- 예상 비용 계산 (선택사항)
- 모델별 토큰 제한 표시 (예: GPT-4: 8K, 32K, 128K)
- 현재 입력 대비 모델 제한 비율 표시

### 3.2 부가 기능

#### 3.2.1 텍스트 조작
- 텍스트 지우기 (Clear) 버튼
- 클립보드에서 붙여넣기 지원
- 샘플 텍스트 로드 기능

#### 3.2.2 설정
- 모델 선택 (GPT-3.5, GPT-4, Claude 등)
- 다크모드/라이트모드 토글

## 4. 컴포넌트 구조 (Component Architecture)

### 4.1 컴포넌트 계층

```
App
├── Header
│   ├── Logo
│   └── ThemeToggle
├── Main
│   ├── InputSection
│   │   ├── TextArea
│   │   └── ActionButtons
│   │       ├── ClearButton
│   │       └── SampleButton
│   ├── ResultSection
│   │   ├── TokenCounter
│   │   ├── CharacterCounter
│   │   └── WordCounter
│   └── InfoSection
│       ├── ModelSelector
│       └── LimitIndicator
└── Footer
```

### 4.2 주요 컴포넌트 설명

#### 4.2.1 `App.jsx`
- 최상위 컴포넌트
- 전역 상태 관리 (입력 텍스트, 선택된 모델 등)
- 다크모드 상태 관리

#### 4.2.2 `Header.jsx`
- 애플리케이션 제목 및 로고
- 테마 토글 버튼

#### 4.2.3 `TextArea.jsx`
- 텍스트 입력 영역
- 입력 이벤트 핸들링
- Props: `value`, `onChange`, `placeholder`

#### 4.2.4 `ActionButtons.jsx`
- 텍스트 조작 버튼 그룹
- Clear, Sample 버튼 포함

#### 4.2.5 `ResultSection.jsx`
- 계산 결과 표시 컴포넌트
- TokenCounter, CharacterCounter, WordCounter 포함

#### 4.2.6 `TokenCounter.jsx`
- 토큰 수 표시
- Props: `tokenCount`
- 시각적 강조 효과

#### 4.2.7 `ModelSelector.jsx`
- AI 모델 선택 드롭다운
- 모델별 토크나이저 변경
- Props: `selectedModel`, `onModelChange`

#### 4.2.8 `LimitIndicator.jsx`
- 모델별 토큰 제한 대비 현재 사용량 표시
- 프로그레스 바 형태
- Props: `currentTokens`, `maxTokens`

## 5. UI/UX 요구사항

### 5.1 레이아웃
- **반응형 디자인**: 모바일, 태블릿, 데스크톱 모든 화면 크기 지원
- **중앙 정렬 레이아웃**: 주요 콘텐츠 중앙 배치
- **카드 형태**: 각 섹션을 카드 UI로 구분

### 5.2 색상 및 테마
- **라이트 모드**: 밝은 배경, 어두운 텍스트
- **다크 모드**: 어두운 배경, 밝은 텍스트
- **강조 색상**: 토큰 수 등 중요 정보는 강조 색상 사용 (예: 파란색, 녹색)

### 5.3 타이포그래피
- **명확한 폰트**: 가독성 높은 폰트 사용
- **한글 지원**: 한글 폰트 최적화
- **계층 구조**: 제목, 본문, 결과 값 간 명확한 크기 차이

### 5.4 애니메이션 및 피드백
- **실시간 업데이트**: 토큰 수가 변경될 때 부드러운 전환 효과
- **버튼 호버 효과**: 인터랙티브 요소에 시각적 피드백
- **로딩 상태**: 계산 중일 때 로딩 인디케이터 표시 (필요시)

## 6. 기술적 고려사항

### 6.1 토큰 계산
- **정확성**: OpenAI의 공식 토크나이저와 동일한 결과 보장
- **성능**: 대용량 텍스트 입력 시에도 빠른 계산
- **디바운싱**: 입력 중 과도한 계산 방지를 위한 디바운싱 적용

### 6.2 한글 처리
- **UTF-8 인코딩**: 한글 문자의 정확한 처리
- **토큰 계산 특성**: 한글은 영문보다 토큰 수가 많이 소비되는 특성 반영

### 6.3 브라우저 호환성
- 최신 브라우저 지원 (Chrome, Firefox, Safari, Edge)
- ES6+ 기능 사용

### 6.4 상태 관리
- React Hooks (useState, useEffect, useMemo 등) 활용
- 필요시 Context API 사용

## 7. 데이터 요구사항

### 7.1 입력 데이터
- **텍스트**: 사용자 입력 프롬프트 (문자열)
- **모델 선택**: 선택된 AI 모델 (문자열)

### 7.2 출력 데이터
- **토큰 수**: 정수형 (number)
- **문자 수**: 정수형 (number)
- **단어 수**: 정수형 (number)

## 8. 성능 요구사항

### 8.1 반응 속도
- 텍스트 입력 후 500ms 이내 토큰 계산 완료
- UI 렌더링 60fps 유지

### 8.2 확장성
- 최대 100,000자까지의 텍스트 입력 처리 가능

## 9. 보안 및 프라이버시

### 9.1 데이터 처리
- **클라이언트 사이드 처리**: 모든 토큰 계산은 브라우저에서 수행
- **데이터 전송 없음**: 사용자 입력 텍스트는 서버로 전송되지 않음
- **로컬 처리**: 개인정보 보호 보장

## 10. 향후 개선 계획

### 10.1 Phase 2
- 여러 모델 간 토큰 수 비교 기능
- 텍스트 히스토리 저장 (로컬 스토리지)
- 파일 업로드 기능 (.txt, .md 등)

### 10.2 Phase 3
- API 키 연동으로 실제 API 비용 계산
- 다국어 지원 (일본어, 중국어 등)
- 토큰 분포 시각화 (어떤 부분이 토큰을 많이 사용하는지)

## 11. 성공 지표 (Success Metrics)

- **정확성**: OpenAI 공식 토크나이저 대비 99% 이상 일치율
- **사용성**: 사용자가 3초 이내에 기능 파악 가능
- **성능**: 10,000자 텍스트 입력 시 1초 이내 계산 완료

## 12. 제약사항 및 가정

### 12.1 제약사항
- 인터넷 연결 필요 (초기 라이브러리 로드)
- 최신 브라우저 필요 (IE 미지원)

### 12.2 가정
- 사용자는 토큰의 개념을 이해하고 있음
- 주요 사용 케이스는 GPT 모델용 프롬프트 작성

## 13. 프로젝트 구조

```
token-calculator/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── TextArea.jsx
│   │   ├── ActionButtons.jsx
│   │   ├── ResultSection.jsx
│   │   ├── TokenCounter.jsx
│   │   ├── CharacterCounter.jsx
│   │   ├── WordCounter.jsx
│   │   ├── ModelSelector.jsx
│   │   └── LimitIndicator.jsx
│   ├── utils/
│   │   └── tokenizer.js
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

## 14. 참고 자료

- [OpenAI Tokenizer](https://platform.openai.com/tokenizer)
- [tiktoken GitHub](https://github.com/openai/tiktoken)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com)
