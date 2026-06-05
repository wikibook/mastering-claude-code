import { describe, test, expect, beforeEach, jest } from '@jest/globals';

// =============================================================================
// Mock Setup
// =============================================================================

const mockEncode = jest.fn();
const mockEncoder = { encode: mockEncode };
const mockGetEncoding = jest.fn(() => mockEncoder);

jest.unstable_mockModule('js-tiktoken', () => ({
  getEncoding: mockGetEncoding,
}));

const {
  countGptTokens,
  countClaudeTokens,
  countGeminiTokens,
  countLlamaTokens,
  countGrokTokens,
  countTokens,
  countCharacters,
  countCharactersNoSpace,
  countBytes,
} = await import('../tokenizer.js');

// =============================================================================
// Test Helpers
// =============================================================================

/**
 * 모킹된 인코더가 특정 토큰 수를 반환하도록 설정
 * @param {number} tokenCount - 반환할 토큰 수
 */
const mockTokenCount = (tokenCount) => {
  mockEncode.mockReturnValue(new Array(tokenCount).fill(1));
};

/**
 * 모킹된 인코더가 특정 토큰 배열을 반환하도록 설정
 * @param {number[]} tokens - 반환할 토큰 배열
 */
const mockTokens = (tokens) => {
  mockEncode.mockReturnValue(tokens);
};

/**
 * 모킹된 인코더가 에러를 던지도록 설정
 */
const mockEncoderError = () => {
  mockEncode.mockImplementation(() => {
    throw new Error('Encoding failed');
  });
};

// =============================================================================
// Test Constants
// =============================================================================

const TEST_DATA = {
  // 기본 텍스트
  english: 'Hello world',
  korean: '안녕하세요',
  koreanWithSpace: '안녕하세요 세계',
  mixed: 'Hello 안녕하세요',

  // 다국어
  japanese: 'こんにちは',
  chinese: '你好世界',
  arabic: 'مرحبا',
  russian: 'Привет',
  thai: 'สวัสดี',
  multilingual: 'Hello 안녕 こんにちは 你好',

  // 특수문자
  punctuation: '.,;:!?@#$%^&*()[]{}',
  mathSymbols: '∑∏∫∂√∞±×÷≠≤≥',
  currency: '$€£¥₩₿',
  arrows: '←→↑↓⇐⇒⇑⇓',
  zeroWidth: 'a\u200Bb\u200Cc',

  // 이모지
  singleEmoji: '😀',
  multipleEmoji: '😀🎉🚀💻',
  emojiWithText: 'Hello 👋 World',
  familyEmoji: '👨‍👩‍👧‍👦',

  // 공백
  spaces: '   ',
  mixedWhitespace: 'a b\tc\nd\re',
  nonBreakingSpace: 'hello\u00A0world',
  consecutiveWhitespace: 'a   \t\t\n\n   b',
  onlyWhitespace: '   \t\n\r  ',

  // 코드
  codeSnippet: 'function hello() { return "world"; }',
  htmlTags: '<div class="test">Hello</div>',
  json: '{"name": "test", "value": 123}',
  escapeSequence: 'Line1\\nLine2\\tTabbed',

  // 경계값
  longText: 'A'.repeat(10000),
  numbers: '0123456789',
  singleSpace: ' ',
  newline: '\n',
  surrogatePair: '𝄞',
};

// =============================================================================
// Tests
// =============================================================================

describe('tokenizer.js', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockEncode.mockClear();
    mockGetEncoding.mockClear();
  });

  // ===========================================================================
  // countGptTokens
  // ===========================================================================

  describe('countGptTokens', () => {
    describe('Success cases', () => {
      test('should count tokens for simple English text', () => {
        // Arrange
        const text = TEST_DATA.english;
        mockTokens([1, 2, 3, 4, 5]);

        // Act
        const result = countGptTokens(text);

        // Assert
        expect(result).toBe(5);
        expect(mockEncode).toHaveBeenCalledWith(text);
      });

      test('should count tokens for Korean text', () => {
        // Arrange
        const text = TEST_DATA.koreanWithSpace;
        mockTokenCount(8);

        // Act
        const result = countGptTokens(text);

        // Assert
        expect(result).toBe(8);
        expect(mockEncode).toHaveBeenCalledWith(text);
      });

      test('should count tokens for mixed English and Korean text', () => {
        // Arrange
        const text = TEST_DATA.mixed;
        mockTokenCount(6);

        // Act
        const result = countGptTokens(text);

        // Assert
        expect(result).toBe(6);
      });

      test('should count tokens for text with special characters', () => {
        // Arrange
        const text = 'Hello! @#$% 12345';
        mockTokenCount(10);

        // Act
        const result = countGptTokens(text);

        // Assert
        expect(result).toBe(10);
      });
    });

    describe('Edge cases', () => {
      test('should return 0 for empty string', () => {
        // Act
        const result = countGptTokens('');

        // Assert
        expect(result).toBe(0);
        expect(mockEncode).not.toHaveBeenCalled();
      });

      test('should return 0 for null', () => {
        // Act
        const result = countGptTokens(null);

        // Assert
        expect(result).toBe(0);
        expect(mockEncode).not.toHaveBeenCalled();
      });

      test('should return 0 for undefined', () => {
        // Act
        const result = countGptTokens(undefined);

        // Assert
        expect(result).toBe(0);
        expect(mockEncode).not.toHaveBeenCalled();
      });
    });

    describe('Error handling', () => {
      test('should use fallback estimation when encoder throws error', () => {
        // Arrange
        const text = 'Hello world test';
        mockEncoderError();
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

        // Act
        const result = countGptTokens(text);

        // Assert
        expect(result).toBeGreaterThan(0);
        expect(consoleErrorSpy).toHaveBeenCalled();

        // Cleanup
        consoleErrorSpy.mockRestore();
      });

      test('should handle Korean text with fallback estimation', () => {
        // Arrange
        const text = TEST_DATA.korean;
        mockEncoderError();
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

        // Act
        const result = countGptTokens(text);

        // Assert - Korean: ~1.5 chars per token, so 5 chars / 1.5 = ~3-4 tokens
        expect(result).toBeGreaterThan(0);
        expect(result).toBeLessThanOrEqual(10);

        // Cleanup
        consoleErrorSpy.mockRestore();
      });
    });
  });

  // ===========================================================================
  // countClaudeTokens
  // ===========================================================================

  describe('countClaudeTokens', () => {
    describe('Success cases', () => {
      test('should return 95% of GPT tokens for English text', () => {
        // Arrange
        const text = TEST_DATA.english;
        mockTokenCount(100);

        // Act
        const result = countClaudeTokens(text);

        // Assert
        expect(result).toBe(95); // 100 * 0.95
      });

      test('should return 95% of GPT tokens for Korean text', () => {
        // Arrange
        const text = TEST_DATA.koreanWithSpace;
        mockTokenCount(80);

        // Act
        const result = countClaudeTokens(text);

        // Assert
        expect(result).toBe(76); // 80 * 0.95
      });

      test('should round correctly for odd token counts', () => {
        // Arrange
        const text = 'Test';
        mockTokenCount(101);

        // Act
        const result = countClaudeTokens(text);

        // Assert
        expect(result).toBe(96); // 101 * 0.95 = 95.95 → rounds to 96
      });

      test('should handle large text', () => {
        // Arrange
        const text = TEST_DATA.longText;
        mockTokenCount(500);

        // Act
        const result = countClaudeTokens(text);

        // Assert
        expect(result).toBe(475); // 500 * 0.95
      });
    });

    describe('Edge cases', () => {
      test('should return 0 for empty string', () => {
        expect(countClaudeTokens('')).toBe(0);
      });

      test('should return 0 for null', () => {
        expect(countClaudeTokens(null)).toBe(0);
      });

      test('should return 0 for undefined', () => {
        expect(countClaudeTokens(undefined)).toBe(0);
      });

      test('should handle single character', () => {
        // Arrange
        mockTokens([1]);

        // Act
        const result = countClaudeTokens('A');

        // Assert
        expect(result).toBe(1); // 1 * 0.95 = 0.95 → rounds to 1
      });
    });
  });

  // ===========================================================================
  // countLlamaTokens
  // ===========================================================================

  describe('countLlamaTokens', () => {
    describe('Success cases', () => {
      test('should return 97% of GPT tokens for English text', () => {
        // Arrange
        const text = TEST_DATA.english;
        mockTokenCount(100);

        // Act
        const result = countLlamaTokens(text);

        // Assert
        expect(result).toBe(97); // 100 * 0.97
      });

      test('should return 97% of GPT tokens for Korean text', () => {
        // Arrange
        const text = TEST_DATA.koreanWithSpace;
        mockTokenCount(80);

        // Act
        const result = countLlamaTokens(text);

        // Assert
        expect(result).toBe(78); // 80 * 0.97 = 77.6 → rounds to 78
      });

      test('should round correctly for odd token counts', () => {
        // Arrange
        const text = 'Test';
        mockTokenCount(101);

        // Act
        const result = countLlamaTokens(text);

        // Assert
        expect(result).toBe(98); // 101 * 0.97 = 97.97 → rounds to 98
      });

      test('should handle large text', () => {
        // Arrange
        const text = TEST_DATA.longText;
        mockTokenCount(500);

        // Act
        const result = countLlamaTokens(text);

        // Assert
        expect(result).toBe(485); // 500 * 0.97
      });
    });

    describe('Edge cases', () => {
      test('should return 0 for empty string', () => {
        expect(countLlamaTokens('')).toBe(0);
      });

      test('should return 0 for null', () => {
        expect(countLlamaTokens(null)).toBe(0);
      });

      test('should return 0 for undefined', () => {
        expect(countLlamaTokens(undefined)).toBe(0);
      });

      test('should handle single character', () => {
        // Arrange
        mockTokens([1]);

        // Act
        const result = countLlamaTokens('A');

        // Assert
        expect(result).toBe(1); // 1 * 0.97 = 0.97 → rounds to 1
      });
    });
  });

  // ===========================================================================
  // countGrokTokens
  // ===========================================================================

  describe('countGrokTokens', () => {
    describe('Success cases', () => {
      test('should return 98% of GPT tokens for English text', () => {
        // Arrange
        const text = TEST_DATA.english;
        mockTokenCount(100);

        // Act
        const result = countGrokTokens(text);

        // Assert
        expect(result).toBe(98); // 100 * 0.98
      });

      test('should return 98% of GPT tokens for Korean text', () => {
        // Arrange
        const text = TEST_DATA.koreanWithSpace;
        mockTokenCount(80);

        // Act
        const result = countGrokTokens(text);

        // Assert
        expect(result).toBe(78); // 80 * 0.98 = 78.4 → rounds to 78
      });

      test('should round correctly for odd token counts', () => {
        // Arrange
        const text = 'Test';
        mockTokenCount(101);

        // Act
        const result = countGrokTokens(text);

        // Assert
        expect(result).toBe(99); // 101 * 0.98 = 98.98 → rounds to 99
      });

      test('should handle large text', () => {
        // Arrange
        const text = TEST_DATA.longText;
        mockTokenCount(500);

        // Act
        const result = countGrokTokens(text);

        // Assert
        expect(result).toBe(490); // 500 * 0.98
      });
    });

    describe('Edge cases', () => {
      test('should return 0 for empty string', () => {
        expect(countGrokTokens('')).toBe(0);
      });

      test('should return 0 for null', () => {
        expect(countGrokTokens(null)).toBe(0);
      });

      test('should return 0 for undefined', () => {
        expect(countGrokTokens(undefined)).toBe(0);
      });

      test('should handle single character', () => {
        // Arrange
        mockTokens([1]);

        // Act
        const result = countGrokTokens('A');

        // Assert
        expect(result).toBe(1); // 1 * 0.98 = 0.98 → rounds to 1
      });
    });
  });

  // ===========================================================================
  // countGeminiTokens
  // ===========================================================================

  describe('countGeminiTokens', () => {
    describe('Success cases', () => {
      test('should not adjust for pure English text', () => {
        // Arrange
        const text = TEST_DATA.english;
        mockTokenCount(100);

        // Act
        const result = countGeminiTokens(text);

        // Assert - No Korean, adjustment factor = 1.0
        expect(result).toBe(100);
      });

      test('should increase tokens for pure Korean text', () => {
        // Arrange
        const text = TEST_DATA.korean;
        mockTokenCount(100);

        // Act
        const result = countGeminiTokens(text);

        // Assert - 100% Korean, adjustment = 1 + (1 * 0.1) = 1.1
        expect(result).toBe(110);
      });

      test('should adjust based on Korean ratio for mixed text', () => {
        // Arrange
        const text = 'Hello안녕'; // 5 English + 2 Korean = 7 chars
        mockTokenCount(100);

        // Act
        const result = countGeminiTokens(text);

        // Assert - Korean ratio = 2/7 ≈ 0.286
        expect(result).toBeGreaterThan(100);
        expect(result).toBeLessThanOrEqual(110);
      });

      test('should handle 50% Korean text', () => {
        // Arrange
        const text = 'Hello안녕하세요'; // 5 English + 5 Korean
        mockTokenCount(100);

        // Act
        const result = countGeminiTokens(text);

        // Assert - Korean ratio = 0.5, adjustment = 1.05
        expect(result).toBe(105);
      });
    });

    describe('Edge cases', () => {
      test('should return 0 for empty string', () => {
        expect(countGeminiTokens('')).toBe(0);
      });

      test('should return 0 for null', () => {
        expect(countGeminiTokens(null)).toBe(0);
      });

      test('should return 0 for undefined', () => {
        expect(countGeminiTokens(undefined)).toBe(0);
      });

      test('should handle special characters (no adjustment)', () => {
        // Arrange
        const text = '!@#$%^&*()';
        mockTokenCount(10);

        // Act
        const result = countGeminiTokens(text);

        // Assert
        expect(result).toBe(10);
      });
    });
  });

  // ===========================================================================
  // countTokens (Model Router)
  // ===========================================================================

  describe('countTokens', () => {
    describe('Model routing', () => {
      test('should use countGptTokens for gpt-5', () => {
        // Arrange
        mockTokens([1, 2, 3]);

        // Act
        const result = countTokens('Hello', 'gpt-5');

        // Assert
        expect(result).toBe(3);
      });

      test('should use countClaudeTokens for sonnet-4.5', () => {
        // Arrange
        mockTokenCount(100);

        // Act
        const result = countTokens('Hello', 'sonnet-4.5');

        // Assert
        expect(result).toBe(95);
      });

      test('should use countClaudeTokens for opus-4.5', () => {
        // Arrange
        mockTokenCount(100);

        // Act
        const result = countTokens('Hello', 'opus-4.5');

        // Assert
        expect(result).toBe(95);
      });

      test('should use countGeminiTokens for gemini-3.0', () => {
        // Arrange
        mockTokenCount(100);

        // Act
        const result = countTokens(TEST_DATA.korean, 'gemini-3.0');

        // Assert
        expect(result).toBe(110); // 100% Korean
      });

      test('should use countLlamaTokens for llama-4', () => {
        // Arrange
        mockTokenCount(100);

        // Act
        const result = countTokens('Hello', 'llama-4');

        // Assert
        expect(result).toBe(97); // 100 * 0.97
      });

      test('should use countGrokTokens for grok', () => {
        // Arrange
        mockTokenCount(100);

        // Act
        const result = countTokens('Hello', 'grok');

        // Assert
        expect(result).toBe(98); // 100 * 0.98
      });

      test('should default to countGptTokens for unknown model', () => {
        // Arrange
        mockTokens([1, 2, 3, 4]);

        // Act
        const result = countTokens('Hello', 'unknown-model');

        // Assert
        expect(result).toBe(4);
      });

      test('should default to countGptTokens when no model specified', () => {
        // Arrange
        mockTokens([1, 2, 3, 4, 5]);

        // Act
        const result = countTokens('Hello');

        // Assert
        expect(result).toBe(5);
      });
    });

    describe('Edge cases', () => {
      test('should handle empty string with any model', () => {
        expect(countTokens('', 'gpt-5')).toBe(0);
        expect(countTokens('', 'sonnet-4.5')).toBe(0);
        expect(countTokens('', 'gemini-3.0')).toBe(0);
        expect(countTokens('', 'llama-4')).toBe(0);
        expect(countTokens('', 'grok')).toBe(0);
      });

      test('should handle null with any model', () => {
        expect(countTokens(null, 'gpt-5')).toBe(0);
        expect(countTokens(null, 'sonnet-4.5')).toBe(0);
        expect(countTokens(null, 'gemini-3.0')).toBe(0);
        expect(countTokens(null, 'llama-4')).toBe(0);
        expect(countTokens(null, 'grok')).toBe(0);
      });

      test('should handle undefined with any model', () => {
        expect(countTokens(undefined, 'gpt-5')).toBe(0);
        expect(countTokens(undefined, 'sonnet-4.5')).toBe(0);
        expect(countTokens(undefined, 'gemini-3.0')).toBe(0);
        expect(countTokens(undefined, 'llama-4')).toBe(0);
        expect(countTokens(undefined, 'grok')).toBe(0);
      });
    });
  });

  // ===========================================================================
  // countCharacters
  // ===========================================================================

  describe('countCharacters', () => {
    describe('Success cases', () => {
      test('should count English characters including space', () => {
        expect(countCharacters(TEST_DATA.english)).toBe(11);
      });

      test('should count Korean characters', () => {
        expect(countCharacters(TEST_DATA.korean)).toBe(5);
      });

      test('should count spaces', () => {
        expect(countCharacters('a b c')).toBe(5); // 3 letters + 2 spaces
      });

      test('should count special characters', () => {
        expect(countCharacters('!@#$%^&*()')).toBe(10);
      });

      test('should count newlines and tabs', () => {
        expect(countCharacters('Hello\nWorld\t!')).toBe(13);
      });
    });

    describe('Edge cases', () => {
      test('should return 0 for empty string', () => {
        expect(countCharacters('')).toBe(0);
      });

      test('should return 0 for null', () => {
        expect(countCharacters(null)).toBe(0);
      });

      test('should return 0 for undefined', () => {
        expect(countCharacters(undefined)).toBe(0);
      });

      test('should handle single character', () => {
        expect(countCharacters('A')).toBe(1);
      });
    });
  });

  // ===========================================================================
  // countCharactersNoSpace
  // ===========================================================================

  describe('countCharactersNoSpace', () => {
    describe('Success cases', () => {
      test('should remove spaces from English text', () => {
        expect(countCharactersNoSpace(TEST_DATA.english)).toBe(10);
      });

      test('should remove spaces from Korean text', () => {
        expect(countCharactersNoSpace('안녕 하세요')).toBe(5);
      });

      test('should remove multiple spaces', () => {
        expect(countCharactersNoSpace('a  b   c')).toBe(3);
      });

      test('should remove all whitespace types', () => {
        expect(countCharactersNoSpace('a\tb\nc d')).toBe(4);
      });

      test('should handle text with no spaces', () => {
        expect(countCharactersNoSpace('HelloWorld')).toBe(10);
      });
    });

    describe('Edge cases', () => {
      test('should return 0 for empty string', () => {
        expect(countCharactersNoSpace('')).toBe(0);
      });

      test('should return 0 for null', () => {
        expect(countCharactersNoSpace(null)).toBe(0);
      });

      test('should return 0 for undefined', () => {
        expect(countCharactersNoSpace(undefined)).toBe(0);
      });

      test('should return 0 for only spaces', () => {
        expect(countCharactersNoSpace('   ')).toBe(0);
      });

      test('should return 0 for only whitespace', () => {
        expect(countCharactersNoSpace(' \t\n ')).toBe(0);
      });
    });
  });

  // ===========================================================================
  // countBytes
  // ===========================================================================

  describe('countBytes', () => {
    describe('Success cases', () => {
      test('should count bytes for ASCII characters (1 byte each)', () => {
        expect(countBytes('Hello')).toBe(5);
      });

      test('should count bytes for Korean characters (3 bytes each)', () => {
        expect(countBytes('안녕')).toBe(6);
      });

      test('should count bytes for mixed text', () => {
        // 'Hi' = 2 bytes, '안녕' = 6 bytes
        expect(countBytes('Hi안녕')).toBe(8);
      });

      test('should count bytes for special characters', () => {
        expect(countBytes('!@#$%')).toBe(5);
      });

      test('should count bytes for emoji (4 bytes)', () => {
        expect(countBytes(TEST_DATA.singleEmoji)).toBe(4);
      });

      test('should count bytes for accented characters', () => {
        // 'Café' = C(1) + a(1) + f(1) + é(2)
        expect(countBytes('Café')).toBe(5);
      });
    });

    describe('Edge cases', () => {
      test('should return 0 for empty string', () => {
        expect(countBytes('')).toBe(0);
      });

      test('should return 0 for null', () => {
        expect(countBytes(null)).toBe(0);
      });

      test('should return 0 for undefined', () => {
        expect(countBytes(undefined)).toBe(0);
      });

      test('should handle single ASCII character', () => {
        expect(countBytes('A')).toBe(1);
      });

      test('should handle single Korean character', () => {
        expect(countBytes('한')).toBe(3);
      });
    });

    describe('Boundary cases', () => {
      test('should handle long mixed text', () => {
        // 'Hello ' = 6, '안녕하세요' = 15, ' World ' = 7, '세계' = 6 = 34
        expect(countBytes('Hello 안녕하세요 World 세계')).toBe(34);
      });

      test('should handle spaces correctly', () => {
        expect(countBytes(TEST_DATA.spaces)).toBe(3);
      });
    });
  });

  // ===========================================================================
  // Edge cases - Multilingual & Special Characters
  // ===========================================================================

  describe('Edge cases - Multilingual & Special Characters', () => {
    describe('Emoji handling', () => {
      test('should handle single emoji', () => {
        // Arrange
        mockTokens([1, 2]);

        // Act & Assert
        expect(countGptTokens(TEST_DATA.singleEmoji)).toBe(2);
      });

      test('should handle multiple emojis', () => {
        // Arrange
        mockTokenCount(8);

        // Act & Assert
        expect(countGptTokens(TEST_DATA.multipleEmoji)).toBe(8);
      });

      test('should handle emoji with text', () => {
        // Arrange
        mockTokenCount(5);

        // Act & Assert
        expect(countGptTokens(TEST_DATA.emojiWithText)).toBe(5);
      });

      test('should count bytes correctly for emoji', () => {
        expect(countBytes(TEST_DATA.singleEmoji)).toBe(4);
        expect(countBytes(TEST_DATA.familyEmoji)).toBeGreaterThan(4);
      });

      test('should count characters for emoji (surrogate pairs)', () => {
        // Surrogate pair counts as 2 in JavaScript
        expect(countCharacters(TEST_DATA.singleEmoji)).toBe(2);
        expect(countCharactersNoSpace(TEST_DATA.singleEmoji)).toBe(2);
      });
    });

    describe('Multilingual text handling', () => {
      test('should handle Japanese text (3 bytes each)', () => {
        // Arrange
        mockTokenCount(5);

        // Act & Assert
        expect(countGptTokens(TEST_DATA.japanese)).toBe(5);
        expect(countCharacters(TEST_DATA.japanese)).toBe(5);
        expect(countBytes(TEST_DATA.japanese)).toBe(15);
      });

      test('should handle Chinese text (3 bytes each)', () => {
        // Arrange
        mockTokenCount(4);

        // Act & Assert
        expect(countGptTokens(TEST_DATA.chinese)).toBe(4);
        expect(countCharacters(TEST_DATA.chinese)).toBe(4);
        expect(countBytes(TEST_DATA.chinese)).toBe(12);
      });

      test('should handle Arabic text (2 bytes each)', () => {
        // Arrange
        mockTokenCount(5);

        // Act & Assert
        expect(countGptTokens(TEST_DATA.arabic)).toBe(5);
        expect(countBytes(TEST_DATA.arabic)).toBe(10);
      });

      test('should handle Russian text (2 bytes each)', () => {
        // Arrange
        mockTokenCount(3);

        // Act & Assert
        expect(countGptTokens(TEST_DATA.russian)).toBe(3);
        expect(countBytes(TEST_DATA.russian)).toBe(12);
      });

      test('should handle mixed multilingual text', () => {
        // Arrange
        mockTokenCount(15);

        // Act & Assert
        expect(countGptTokens(TEST_DATA.multilingual)).toBe(15);
        expect(countCharacters(TEST_DATA.multilingual)).toBe(17);
      });

      test('should handle Thai text (3 bytes each)', () => {
        // Arrange
        mockTokenCount(6);

        // Act & Assert
        expect(countGptTokens(TEST_DATA.thai)).toBe(6);
        expect(countBytes(TEST_DATA.thai)).toBe(18);
      });
    });

    describe('Special characters handling', () => {
      test('should handle punctuation marks', () => {
        // Arrange
        mockTokenCount(19);

        // Act & Assert
        expect(countGptTokens(TEST_DATA.punctuation)).toBe(19);
        expect(countCharacters(TEST_DATA.punctuation)).toBe(19);
        expect(countBytes(TEST_DATA.punctuation)).toBe(19);
      });

      test('should handle mathematical symbols', () => {
        // Arrange
        mockTokenCount(12);

        // Act & Assert
        expect(countGptTokens(TEST_DATA.mathSymbols)).toBe(12);
      });

      test('should handle currency symbols', () => {
        // Arrange
        mockTokenCount(6);

        // Act & Assert
        expect(countGptTokens(TEST_DATA.currency)).toBe(6);
        expect(countCharacters(TEST_DATA.currency)).toBe(6);
      });

      test('should handle arrows and special symbols', () => {
        // Arrange
        mockTokenCount(8);

        // Act & Assert
        expect(countGptTokens(TEST_DATA.arrows)).toBe(8);
      });

      test('should handle zero-width characters', () => {
        // Arrange
        mockTokenCount(5);

        // Act & Assert
        expect(countGptTokens(TEST_DATA.zeroWidth)).toBe(5);
        expect(countCharacters(TEST_DATA.zeroWidth)).toBe(5);
      });

      test('should handle combining diacritical marks', () => {
        expect(countBytes('é')).toBeGreaterThanOrEqual(2);
      });
    });

    describe('Whitespace variations', () => {
      test('should handle various whitespace types', () => {
        expect(countCharacters(TEST_DATA.mixedWhitespace)).toBe(9);
        expect(countCharactersNoSpace(TEST_DATA.mixedWhitespace)).toBe(5);
      });

      test('should handle non-breaking space', () => {
        expect(countCharacters(TEST_DATA.nonBreakingSpace)).toBe(11);
        expect(countCharactersNoSpace(TEST_DATA.nonBreakingSpace)).toBe(10);
      });

      test('should handle multiple consecutive whitespace', () => {
        expect(countCharacters(TEST_DATA.consecutiveWhitespace)).toBe(12);
        expect(countCharactersNoSpace(TEST_DATA.consecutiveWhitespace)).toBe(2);
      });

      test('should handle only whitespace', () => {
        expect(countCharacters(TEST_DATA.onlyWhitespace)).toBe(8);
        expect(countCharactersNoSpace(TEST_DATA.onlyWhitespace)).toBe(0);
      });
    });

    describe('Boundary cases', () => {
      test('should handle very long text', () => {
        // Arrange
        mockTokenCount(2500);

        // Act & Assert
        expect(countGptTokens(TEST_DATA.longText)).toBe(2500);
        expect(countCharacters(TEST_DATA.longText)).toBe(10000);
        expect(countBytes(TEST_DATA.longText)).toBe(10000);
      });

      test('should handle text with only numbers', () => {
        // Arrange
        mockTokenCount(3);

        // Act & Assert
        expect(countGptTokens(TEST_DATA.numbers)).toBe(3);
        expect(countCharacters(TEST_DATA.numbers)).toBe(10);
        expect(countBytes(TEST_DATA.numbers)).toBe(10);
      });

      test('should handle single whitespace', () => {
        // Arrange
        mockTokens([1]);

        // Act & Assert
        expect(countGptTokens(TEST_DATA.singleSpace)).toBe(1);
        expect(countCharacters(TEST_DATA.singleSpace)).toBe(1);
        expect(countCharactersNoSpace(TEST_DATA.singleSpace)).toBe(0);
      });

      test('should handle newline only', () => {
        // Arrange
        mockTokens([1]);

        // Act & Assert
        expect(countGptTokens(TEST_DATA.newline)).toBe(1);
        expect(countCharacters(TEST_DATA.newline)).toBe(1);
        expect(countCharactersNoSpace(TEST_DATA.newline)).toBe(0);
      });

      test('should handle surrogate pairs', () => {
        expect(countBytes(TEST_DATA.surrogatePair)).toBe(4);
        expect(countCharacters(TEST_DATA.surrogatePair)).toBe(2);
      });
    });

    describe('Code and programming text', () => {
      test('should handle code snippets', () => {
        // Arrange
        mockTokenCount(12);

        // Act & Assert
        expect(countGptTokens(TEST_DATA.codeSnippet)).toBe(12);
      });

      test('should handle HTML tags', () => {
        // Arrange
        mockTokenCount(10);

        // Act & Assert
        expect(countGptTokens(TEST_DATA.htmlTags)).toBe(10);
        expect(countCharacters(TEST_DATA.htmlTags)).toBe(29);
      });

      test('should handle JSON', () => {
        // Arrange
        mockTokenCount(15);

        // Act & Assert
        expect(countGptTokens(TEST_DATA.json)).toBe(15);
      });

      test('should handle escape sequences in strings', () => {
        // Arrange
        mockTokenCount(8);

        // Act & Assert
        expect(countGptTokens(TEST_DATA.escapeSequence)).toBe(8);
        expect(countCharacters(TEST_DATA.escapeSequence)).toBe(20);
      });
    });
  });

  // ===========================================================================
  // Integration Tests
  // ===========================================================================

  describe('Integration tests', () => {
    test('should show different results for tokens vs characters vs bytes', () => {
      // Arrange
      const text = '안녕하세요 Hello';
      mockTokenCount(10);

      // Act
      const tokens = countGptTokens(text);
      const chars = countCharacters(text);
      const bytes = countBytes(text);

      // Assert
      expect(tokens).toBe(10);
      expect(chars).toBe(11); // 5 Korean + 1 space + 5 English
      expect(bytes).toBeGreaterThan(chars); // Korean chars use multiple bytes
    });

    test('should handle null consistently across all functions', () => {
      expect(countGptTokens(null)).toBe(0);
      expect(countClaudeTokens(null)).toBe(0);
      expect(countGeminiTokens(null)).toBe(0);
      expect(countLlamaTokens(null)).toBe(0);
      expect(countGrokTokens(null)).toBe(0);
      expect(countTokens(null, 'gpt-5')).toBe(0);
      expect(countCharacters(null)).toBe(0);
      expect(countCharactersNoSpace(null)).toBe(0);
      expect(countBytes(null)).toBe(0);
    });

    test('should show model-specific token differences', () => {
      // Arrange
      const text = TEST_DATA.korean;
      mockTokenCount(100);

      // Act
      const gptTokens = countTokens(text, 'gpt-5');
      const claudeTokens = countTokens(text, 'sonnet-4.5');
      const geminiTokens = countTokens(text, 'gemini-3.0');
      const llamaTokens = countTokens(text, 'llama-4');
      const grokTokens = countTokens(text, 'grok');

      // Assert
      expect(gptTokens).toBe(100);
      expect(claudeTokens).toBe(95); // 95% of GPT
      expect(geminiTokens).toBe(110); // 110% of GPT (100% Korean)
      expect(llamaTokens).toBe(97); // 97% of GPT
      expect(grokTokens).toBe(98); // 98% of GPT
      expect(claudeTokens).toBeLessThan(gptTokens);
      expect(geminiTokens).toBeGreaterThan(gptTokens);
      expect(llamaTokens).toBeLessThan(gptTokens);
      expect(grokTokens).toBeLessThan(gptTokens);
    });
  });
});
