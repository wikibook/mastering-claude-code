import { getEncoding } from 'js-tiktoken';

/**
 * @typedef {'gpt-5' | 'sonnet-4.5' | 'opus-4.5' | 'gemini-3.0' | 'llama-4' | 'grok'} ModelType
 */

/**
 * @typedef {Object} TokenStats
 * @property {number} tokenCount - 토큰 수
 * @property {number} charCount - 문자 수 (공백 포함)
 * @property {number} charCountNoSpace - 문자 수 (공백 제외)
 * @property {number} byteSize - 바이트 크기
 */

// OpenAI GPT 계열용 인코딩 (o200k_base - 최신 모델용)
/** @type {import('js-tiktoken').Tiktoken | null} */
let gptEncoder = null;

/**
 * 인코더 초기화 (지연 로딩)
 * @returns {import('js-tiktoken').Tiktoken}
 */
const getGptEncoder = () => {
  if (!gptEncoder) {
    gptEncoder = getEncoding('o200k_base');
  }
  return gptEncoder;
};

/**
 * OpenAI GPT 계열 토큰 계산
 * @param {string} text - 분석할 텍스트
 * @returns {number} 토큰 수
 */
export const countGptTokens = (text) => {
  if (!text) return 0;
  try {
    const encoder = getGptEncoder();
    return encoder.encode(text).length;
  } catch (error) {
    console.error('GPT 토큰 계산 오류:', error);
    return estimateTokens(text);
  }
};

/**
 * Claude 계열 토큰 추정 (Anthropic 공식 토크나이저가 없으므로 추정)
 * Claude는 GPT와 유사한 BPE 방식을 사용하지만, 약간의 차이가 있음
 * @param {string} text - 분석할 텍스트
 * @returns {number} 토큰 수
 */
export const countClaudeTokens = (text) => {
  if (!text) return 0;

  // Claude의 토큰화는 GPT와 유사하지만 약간 더 효율적인 경향
  // 한글의 경우 약 1.5~2 글자당 1토큰 정도로 추정
  const gptTokens = countGptTokens(text);

  // Claude는 GPT 대비 약 5-10% 적은 토큰을 사용하는 경향
  return Math.round(gptTokens * 0.95);
};

/**
 * Llama 계열 토큰 추정 (Meta의 BPE 기반)
 * Llama는 GPT와 유사한 BPE 방식을 사용하지만 약간 더 효율적
 * @param {string} text - 분석할 텍스트
 * @returns {number} 토큰 수
 */
export const countLlamaTokens = (text) => {
  if (!text) return 0;

  const gptTokens = countGptTokens(text);

  // Llama는 GPT 대비 약 3% 적은 토큰을 사용하는 경향
  return Math.round(gptTokens * 0.97);
};

/**
 * Grok 계열 토큰 추정 (xAI의 BPE 기반)
 * Grok은 GPT와 매우 유사한 BPE 토크나이저 사용
 * @param {string} text - 분석할 텍스트
 * @returns {number} 토큰 수
 */
export const countGrokTokens = (text) => {
  if (!text) return 0;

  const gptTokens = countGptTokens(text);

  // Grok은 GPT 대비 약 2% 적은 토큰을 사용하는 경향
  return Math.round(gptTokens * 0.98);
};

// Gemini 계열 토큰 추정 (SentencePiece 기반)
// Google의 경우 SentencePiece를 사용하며, 한글 처리가 다소 다름
export const countGeminiTokens = (text) => {
  if (!text) return 0;

  // Gemini는 SentencePiece 기반으로 한글 처리가 GPT와 다름
  // 일반적으로 한글에서 GPT보다 토큰이 더 많이 소모됨
  const gptTokens = countGptTokens(text);

  // 한글 비율에 따라 조정
  const koreanRatio = getKoreanRatio(text);
  const adjustmentFactor = 1 + (koreanRatio * 0.1); // 한글 비율이 높을수록 토큰 증가

  return Math.round(gptTokens * adjustmentFactor);
};

// 한글 비율 계산
const getKoreanRatio = (text) => {
  if (!text) return 0;
  const koreanChars = text.match(/[가-힣]/g) || [];
  return koreanChars.length / text.length;
};

// 폴백용 토큰 추정 (인코더 실패 시)
const estimateTokens = (text) => {
  if (!text) return 0;

  // 영문: 약 4글자당 1토큰
  // 한글: 약 1.5글자당 1토큰
  const koreanChars = (text.match(/[가-힣]/g) || []).length;
  const otherChars = text.length - koreanChars;

  return Math.ceil(koreanChars / 1.5 + otherChars / 4);
};

/**
 * 모델별 토큰 계산 함수 매핑
 * @param {string} text - 분석할 텍스트
 * @param {ModelType} model - AI 모델 타입
 * @returns {number} 토큰 수
 */
export const countTokens = (text, model) => {
  switch (model) {
    case 'gpt-5':
      return countGptTokens(text);
    case 'sonnet-4.5':
    case 'opus-4.5':
      return countClaudeTokens(text);
    case 'gemini-3.0':
      return countGeminiTokens(text);
    case 'llama-4':
      return countLlamaTokens(text);
    case 'grok':
      return countGrokTokens(text);
    default:
      return countGptTokens(text);
  }
};

// 글자 수 계산 (공백 포함)
export const countCharacters = (text) => {
  return text ? text.length : 0;
};

// 글자 수 계산 (공백 제외)
export const countCharactersNoSpace = (text) => {
  return text ? text.replace(/\s/g, '').length : 0;
};

// 바이트 크기 계산 (UTF-8 기준)
export const countBytes = (text) => {
  return new TextEncoder().encode(text).length;
};
