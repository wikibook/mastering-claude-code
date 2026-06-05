/**
 * @jest-environment jsdom
 */

import { describe, test, expect, beforeEach } from '@jest/globals';
import React from 'react';
import { render, screen } from '@testing-library/react';
import TokenDisplay from '../TokenDisplay.jsx';

describe('TokenDisplay Component', () => {
  describe('Rendering with valid props', () => {
    test('should render all four stat cards', () => {
      const { container } = render(
        <TokenDisplay
          tokenCount={100}
          charCount={500}
          charCountNoSpace={450}
          byteSize={1024}
        />
      );

      const statCards = container.querySelectorAll('[class*="p-4"]');
      expect(statCards.length).toBe(4);
    });

    test('should display token count with Korean label', () => {
      render(
        <TokenDisplay
          tokenCount={100}
          charCount={500}
          charCountNoSpace={450}
          byteSize={1024}
        />
      );

      expect(screen.getByText('토큰 수')).toBeInTheDocument();
      expect(screen.getByText('100')).toBeInTheDocument();
    });

    test('should display character count with spaces', () => {
      render(
        <TokenDisplay
          tokenCount={100}
          charCount={500}
          charCountNoSpace={450}
          byteSize={1024}
        />
      );

      expect(screen.getByText('글자 수 (공백 포함)')).toBeInTheDocument();
      expect(screen.getByText('500')).toBeInTheDocument();
    });

    test('should display character count without spaces', () => {
      render(
        <TokenDisplay
          tokenCount={100}
          charCount={500}
          charCountNoSpace={450}
          byteSize={1024}
        />
      );

      expect(screen.getByText('글자 수 (공백 제외)')).toBeInTheDocument();
      expect(screen.getByText('450')).toBeInTheDocument();
    });

    test('should display byte size with B suffix', () => {
      render(
        <TokenDisplay
          tokenCount={100}
          charCount={500}
          charCountNoSpace={450}
          byteSize={1024}
        />
      );

      expect(screen.getByText('바이트 크기')).toBeInTheDocument();
      expect(screen.getByText('1,024 B')).toBeInTheDocument();
    });
  });

  describe('Number formatting', () => {
    test('should format large token count with commas', () => {
      render(
        <TokenDisplay
          tokenCount={1000000}
          charCount={500}
          charCountNoSpace={450}
          byteSize={1024}
        />
      );

      expect(screen.getByText('1,000,000')).toBeInTheDocument();
    });

    test('should format large character count with commas', () => {
      render(
        <TokenDisplay
          tokenCount={100}
          charCount={5000000}
          charCountNoSpace={4500000}
          byteSize={1024}
        />
      );

      expect(screen.getByText('5,000,000')).toBeInTheDocument();
      expect(screen.getByText('4,500,000')).toBeInTheDocument();
    });

    test('should format large byte size with commas', () => {
      render(
        <TokenDisplay
          tokenCount={100}
          charCount={500}
          charCountNoSpace={450}
          byteSize={10485760}
        />
      );

      expect(screen.getByText('10,485,760 B')).toBeInTheDocument();
    });

    test('should handle numbers without needing commas', () => {
      render(
        <TokenDisplay
          tokenCount={999}
          charCount={888}
          charCountNoSpace={777}
          byteSize={666}
        />
      );

      expect(screen.getByText('999')).toBeInTheDocument();
      expect(screen.getByText('888')).toBeInTheDocument();
      expect(screen.getByText('777')).toBeInTheDocument();
      expect(screen.getByText('666 B')).toBeInTheDocument();
    });
  });

  describe('Edge cases - zero values', () => {
    test('should handle all zero values', () => {
      render(
        <TokenDisplay
          tokenCount={0}
          charCount={0}
          charCountNoSpace={0}
          byteSize={0}
        />
      );

      const zeroValues = screen.getAllByText('0');
      expect(zeroValues.length).toBeGreaterThanOrEqual(3);
      expect(screen.getByText('0 B')).toBeInTheDocument();
    });

    test('should handle zero token count', () => {
      render(
        <TokenDisplay
          tokenCount={0}
          charCount={100}
          charCountNoSpace={90}
          byteSize={200}
        />
      );

      expect(screen.getByText('0')).toBeInTheDocument();
      expect(screen.getByText('100')).toBeInTheDocument();
    });

    test('should handle zero byte size', () => {
      render(
        <TokenDisplay
          tokenCount={10}
          charCount={20}
          charCountNoSpace={15}
          byteSize={0}
        />
      );

      expect(screen.getByText('0 B')).toBeInTheDocument();
    });
  });

  describe('Edge cases - null and undefined handling', () => {
    test('should handle null tokenCount gracefully', () => {
      // Note: This will throw an error in the component since toLocaleString
      // is called on null. In a real scenario, prop validation or default props
      // should be added to handle this case.
      expect(() => {
        render(
          <TokenDisplay
            tokenCount={null}
            charCount={100}
            charCountNoSpace={90}
            byteSize={200}
          />
        );
      }).toThrow();
    });

    test('should handle undefined values gracefully', () => {
      // Similar to null, undefined will cause issues. This test documents
      // the current behavior and suggests the need for prop validation.
      expect(() => {
        render(
          <TokenDisplay
            tokenCount={undefined}
            charCount={undefined}
            charCountNoSpace={undefined}
            byteSize={undefined}
          />
        );
      }).toThrow();
    });

    test('should work with valid default values', () => {
      // This shows the expected usage with valid numeric values
      render(
        <TokenDisplay
          tokenCount={0}
          charCount={0}
          charCountNoSpace={0}
          byteSize={0}
        />
      );

      expect(screen.getByText('토큰 수')).toBeInTheDocument();
    });
  });

  describe('Visual styling and layout', () => {
    test('should apply highlight styling to token count card', () => {
      const { container } = render(
        <TokenDisplay
          tokenCount={100}
          charCount={500}
          charCountNoSpace={450}
          byteSize={1024}
        />
      );

      const cards = container.querySelectorAll('[class*="p-4"]');
      const tokenCard = cards[0];

      expect(tokenCard.className).toContain('bg-indigo-600');
      expect(tokenCard.className).toContain('text-white');
    });

    test('should apply non-highlight styling to other cards', () => {
      const { container } = render(
        <TokenDisplay
          tokenCount={100}
          charCount={500}
          charCountNoSpace={450}
          byteSize={1024}
        />
      );

      const cards = container.querySelectorAll('[class*="p-4"]');
      const charCard = cards[1];

      expect(charCard.className).toContain('bg-white');
      expect(charCard.className).toContain('dark:bg-slate-800');
    });

    test('should use grid layout for cards', () => {
      const { container } = render(
        <TokenDisplay
          tokenCount={100}
          charCount={500}
          charCountNoSpace={450}
          byteSize={1024}
        />
      );

      const gridContainer = container.firstChild;
      expect(gridContainer.className).toContain('grid');
      expect(gridContainer.className).toContain('grid-cols-2');
      expect(gridContainer.className).toContain('md:grid-cols-4');
    });

    test('should render icons for each stat', () => {
      const { container } = render(
        <TokenDisplay
          tokenCount={100}
          charCount={500}
          charCountNoSpace={450}
          byteSize={1024}
        />
      );

      // Check for SVG icons (lucide-react renders SVGs)
      const icons = container.querySelectorAll('svg');
      expect(icons.length).toBe(4);
    });

    test('should apply rounded corners to cards', () => {
      const { container } = render(
        <TokenDisplay
          tokenCount={100}
          charCount={500}
          charCountNoSpace={450}
          byteSize={1024}
        />
      );

      const cards = container.querySelectorAll('[class*="rounded-xl"]');
      expect(cards.length).toBe(4);
    });
  });

  describe('Large numbers handling', () => {
    test('should handle very large token counts', () => {
      render(
        <TokenDisplay
          tokenCount={999999999}
          charCount={500}
          charCountNoSpace={450}
          byteSize={1024}
        />
      );

      expect(screen.getByText('999,999,999')).toBeInTheDocument();
    });

    test('should handle billions in byte size', () => {
      render(
        <TokenDisplay
          tokenCount={100}
          charCount={500}
          charCountNoSpace={450}
          byteSize={1073741824}
        />
      );

      expect(screen.getByText('1,073,741,824 B')).toBeInTheDocument();
    });

    test('should maintain readability with maximum safe integer', () => {
      const maxSafeInt = Number.MAX_SAFE_INTEGER;
      render(
        <TokenDisplay
          tokenCount={maxSafeInt}
          charCount={500}
          charCountNoSpace={450}
          byteSize={1024}
        />
      );

      // The number should be formatted with commas
      const formattedNumber = maxSafeInt.toLocaleString();
      expect(screen.getByText(formattedNumber)).toBeInTheDocument();
    });
  });

  describe('Decimal number handling', () => {
    test('should handle decimal token counts by rounding/truncating', () => {
      render(
        <TokenDisplay
          tokenCount={100.5}
          charCount={500}
          charCountNoSpace={450}
          byteSize={1024}
        />
      );

      // toLocaleString will format 100.5 as "100.5"
      expect(screen.getByText('100.5')).toBeInTheDocument();
    });

    test('should handle decimal byte sizes', () => {
      render(
        <TokenDisplay
          tokenCount={100}
          charCount={500}
          charCountNoSpace={450}
          byteSize={1024.75}
        />
      );

      expect(screen.getByText('1,024.75 B')).toBeInTheDocument();
    });
  });

  describe('Negative number handling', () => {
    test('should display negative numbers if provided', () => {
      render(
        <TokenDisplay
          tokenCount={-100}
          charCount={500}
          charCountNoSpace={450}
          byteSize={1024}
        />
      );

      expect(screen.getByText('-100')).toBeInTheDocument();
    });

    test('should format negative large numbers', () => {
      render(
        <TokenDisplay
          tokenCount={-1000000}
          charCount={500}
          charCountNoSpace={450}
          byteSize={1024}
        />
      );

      expect(screen.getByText('-1,000,000')).toBeInTheDocument();
    });
  });

  describe('Component structure and accessibility', () => {
    test('should render stats in correct order', () => {
      const { container } = render(
        <TokenDisplay
          tokenCount={100}
          charCount={500}
          charCountNoSpace={450}
          byteSize={1024}
        />
      );

      const labels = container.querySelectorAll('[class*="text-xs"]');
      expect(labels[0].textContent).toBe('토큰 수');
      expect(labels[1].textContent).toBe('글자 수 (공백 포함)');
      expect(labels[2].textContent).toBe('글자 수 (공백 제외)');
      expect(labels[3].textContent).toBe('바이트 크기');
    });

    test('should have proper text size classes', () => {
      const { container } = render(
        <TokenDisplay
          tokenCount={100}
          charCount={500}
          charCountNoSpace={450}
          byteSize={1024}
        />
      );

      const values = container.querySelectorAll('[class*="text-2xl"]');
      expect(values.length).toBe(4);
    });

    test('should apply transition classes', () => {
      const { container } = render(
        <TokenDisplay
          tokenCount={100}
          charCount={500}
          charCountNoSpace={450}
          byteSize={1024}
        />
      );

      const values = container.querySelectorAll('[class*="transition-all"]');
      expect(values.length).toBe(4);
    });
  });

  describe('Props updates and re-rendering', () => {
    test('should update display when tokenCount changes', () => {
      const { rerender } = render(
        <TokenDisplay
          tokenCount={100}
          charCount={500}
          charCountNoSpace={450}
          byteSize={1024}
        />
      );

      expect(screen.getByText('100')).toBeInTheDocument();

      rerender(
        <TokenDisplay
          tokenCount={200}
          charCount={500}
          charCountNoSpace={450}
          byteSize={1024}
        />
      );

      expect(screen.getByText('200')).toBeInTheDocument();
      expect(screen.queryByText('100')).not.toBeInTheDocument();
    });

    test('should update all values when all props change', () => {
      const { rerender } = render(
        <TokenDisplay
          tokenCount={100}
          charCount={500}
          charCountNoSpace={450}
          byteSize={1024}
        />
      );

      rerender(
        <TokenDisplay
          tokenCount={200}
          charCount={1000}
          charCountNoSpace={900}
          byteSize={2048}
        />
      );

      expect(screen.getByText('200')).toBeInTheDocument();
      expect(screen.getByText('1,000')).toBeInTheDocument();
      expect(screen.getByText('900')).toBeInTheDocument();
      expect(screen.getByText('2,048 B')).toBeInTheDocument();
    });

    test('should handle rapid prop changes', () => {
      const { rerender } = render(
        <TokenDisplay
          tokenCount={0}
          charCount={0}
          charCountNoSpace={0}
          byteSize={0}
        />
      );

      for (let i = 1; i <= 10; i++) {
        rerender(
          <TokenDisplay
            tokenCount={i * 100}
            charCount={i * 500}
            charCountNoSpace={i * 450}
            byteSize={i * 1024}
          />
        );
      }

      expect(screen.getByText('1,000')).toBeInTheDocument();
      expect(screen.getByText('5,000')).toBeInTheDocument();
      expect(screen.getByText('4,500')).toBeInTheDocument();
      expect(screen.getByText('10,240 B')).toBeInTheDocument();
    });
  });

  describe('Integration with different locales', () => {
    test('should use locale-specific number formatting', () => {
      // toLocaleString() uses the system's default locale
      // This test verifies the method is called correctly
      render(
        <TokenDisplay
          tokenCount={1234567}
          charCount={500}
          charCountNoSpace={450}
          byteSize={1024}
        />
      );

      // In most English locales, this will be "1,234,567"
      const formattedNumber = (1234567).toLocaleString();
      expect(screen.getByText(formattedNumber)).toBeInTheDocument();
    });
  });

  describe('Snapshot tests', () => {
    test('should match snapshot with typical values', () => {
      const { container } = render(
        <TokenDisplay
          tokenCount={100}
          charCount={500}
          charCountNoSpace={450}
          byteSize={1024}
        />
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    test('should match snapshot with zero values', () => {
      const { container } = render(
        <TokenDisplay
          tokenCount={0}
          charCount={0}
          charCountNoSpace={0}
          byteSize={0}
        />
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    test('should match snapshot with large values', () => {
      const { container } = render(
        <TokenDisplay
          tokenCount={1000000}
          charCount={5000000}
          charCountNoSpace={4500000}
          byteSize={10485760}
        />
      );

      expect(container.firstChild).toMatchSnapshot();
    });
  });
});
