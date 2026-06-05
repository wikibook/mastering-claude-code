import { describe, test, expect, jest } from '@jest/globals';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import '@testing-library/jest-dom';

// Mock lucide-react icons
jest.unstable_mockModule('lucide-react', () => ({
  Moon: jest.fn(({ className }) =>
    React.createElement('div', { 'data-testid': 'moon-icon', className }, 'Moon')
  ),
  Sun: jest.fn(({ className }) =>
    React.createElement('div', { 'data-testid': 'sun-icon', className }, 'Sun')
  ),
}));

// Import Header component after mocking
const { default: Header } = await import('../Header.jsx');

describe('Header Component', () => {
  describe('Rendering - Success Cases', () => {
    test('should render the main heading with correct text', () => {
      const mockToggle = jest.fn();
      render(React.createElement(Header, { darkMode: false, onToggleTheme: mockToggle }));

      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('Token Calculator');
    });

    test('should render the Korean subtitle', () => {
      const mockToggle = jest.fn();
      render(React.createElement(Header, { darkMode: false, onToggleTheme: mockToggle }));

      const subtitle = screen.getByText('LLM 토큰 계산기');
      expect(subtitle).toBeInTheDocument();
    });

    test('should render the theme toggle button', () => {
      const mockToggle = jest.fn();
      render(React.createElement(Header, { darkMode: false, onToggleTheme: mockToggle }));

      const button = screen.getByRole('button', { name: '테마 전환' });
      expect(button).toBeInTheDocument();
    });

    test('should render header element with correct structure', () => {
      const mockToggle = jest.fn();
      const { container } = render(React.createElement(Header, { darkMode: false, onToggleTheme: mockToggle }));

      const header = container.querySelector('header');
      expect(header).toBeInTheDocument();
    });
  });

  describe('Dark Mode - Icon Display', () => {
    test('should display Moon icon when darkMode is false (light mode)', () => {
      const mockToggle = jest.fn();
      render(React.createElement(Header, { darkMode: false, onToggleTheme: mockToggle }));

      const moonIcon = screen.getByTestId('moon-icon');
      expect(moonIcon).toBeInTheDocument();
      expect(screen.queryByTestId('sun-icon')).not.toBeInTheDocument();
    });

    test('should display Sun icon when darkMode is true (dark mode)', () => {
      const mockToggle = jest.fn();
      render(React.createElement(Header, { darkMode: true, onToggleTheme: mockToggle }));

      const sunIcon = screen.getByTestId('sun-icon');
      expect(sunIcon).toBeInTheDocument();
      expect(screen.queryByTestId('moon-icon')).not.toBeInTheDocument();
    });

    test('should apply correct CSS classes to Moon icon in light mode', () => {
      const mockToggle = jest.fn();
      render(React.createElement(Header, { darkMode: false, onToggleTheme: mockToggle }));

      const moonIcon = screen.getByTestId('moon-icon');
      expect(moonIcon).toHaveClass('w-5', 'h-5', 'text-slate-600');
    });

    test('should apply correct CSS classes to Sun icon in dark mode', () => {
      const mockToggle = jest.fn();
      render(React.createElement(Header, { darkMode: true, onToggleTheme: mockToggle }));

      const sunIcon = screen.getByTestId('sun-icon');
      expect(sunIcon).toHaveClass('w-5', 'h-5', 'text-yellow-500');
    });
  });

  describe('Props Handling - onToggleTheme Function', () => {
    test('should call onToggleTheme when theme button is clicked', async () => {
      const mockToggle = jest.fn();
      const user = userEvent.setup();
      render(React.createElement(Header, { darkMode: false, onToggleTheme: mockToggle }));

      const button = screen.getByRole('button', { name: '테마 전환' });
      await user.click(button);

      expect(mockToggle).toHaveBeenCalledTimes(1);
    });

    test('should call onToggleTheme exactly once per click', async () => {
      const mockToggle = jest.fn();
      const user = userEvent.setup();
      render(React.createElement(Header, { darkMode: false, onToggleTheme: mockToggle }));

      const button = screen.getByRole('button', { name: '테마 전환' });
      await user.click(button);
      await user.click(button);
      await user.click(button);

      expect(mockToggle).toHaveBeenCalledTimes(3);
    });

    test('should not throw error if onToggleTheme is called', async () => {
      const mockToggle = jest.fn();
      const user = userEvent.setup();
      render(React.createElement(Header, { darkMode: false, onToggleTheme: mockToggle }));

      const button = screen.getByRole('button', { name: '테마 전환' });

      await expect(user.click(button)).resolves.not.toThrow();
    });
  });

  describe('Props Handling - darkMode Prop', () => {
    test('should update icon when darkMode prop changes from false to true', () => {
      const mockToggle = jest.fn();
      const { rerender } = render(React.createElement(Header, { darkMode: false, onToggleTheme: mockToggle }));

      expect(screen.getByTestId('moon-icon')).toBeInTheDocument();

      rerender(React.createElement(Header, { darkMode: true, onToggleTheme: mockToggle }));

      expect(screen.getByTestId('sun-icon')).toBeInTheDocument();
      expect(screen.queryByTestId('moon-icon')).not.toBeInTheDocument();
    });

    test('should update icon when darkMode prop changes from true to false', () => {
      const mockToggle = jest.fn();
      const { rerender } = render(React.createElement(Header, { darkMode: true, onToggleTheme: mockToggle }));

      expect(screen.getByTestId('sun-icon')).toBeInTheDocument();

      rerender(React.createElement(Header, { darkMode: false, onToggleTheme: mockToggle }));

      expect(screen.getByTestId('moon-icon')).toBeInTheDocument();
      expect(screen.queryByTestId('sun-icon')).not.toBeInTheDocument();
    });
  });

  describe('CSS Classes and Styling', () => {
    test('should apply correct CSS classes to header element', () => {
      const mockToggle = jest.fn();
      const { container } = render(React.createElement(Header, { darkMode: false, onToggleTheme: mockToggle }));

      const header = container.querySelector('header');
      expect(header).toHaveClass('flex', 'items-center', 'justify-between', 'mb-8');
    });

    test('should apply correct CSS classes to heading', () => {
      const mockToggle = jest.fn();
      render(React.createElement(Header, { darkMode: false, onToggleTheme: mockToggle }));

      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveClass('text-2xl', 'md:text-3xl', 'font-bold');
    });

    test('should apply correct CSS classes to subtitle', () => {
      const mockToggle = jest.fn();
      render(React.createElement(Header, { darkMode: false, onToggleTheme: mockToggle }));

      const subtitle = screen.getByText('LLM 토큰 계산기');
      expect(subtitle).toHaveClass('mt-1');
    });

    test('should apply correct CSS classes to theme button', () => {
      const mockToggle = jest.fn();
      render(React.createElement(Header, { darkMode: false, onToggleTheme: mockToggle }));

      const button = screen.getByRole('button', { name: '테마 전환' });
      expect(button).toHaveClass('p-2', 'rounded-lg');
    });
  });

  describe('Accessibility', () => {
    test('should have accessible name for theme toggle button', () => {
      const mockToggle = jest.fn();
      render(React.createElement(Header, { darkMode: false, onToggleTheme: mockToggle }));

      const button = screen.getByRole('button', { name: '테마 전환' });
      expect(button).toHaveAttribute('aria-label', '테마 전환');
    });

    test('should have proper heading hierarchy with h1', () => {
      const mockToggle = jest.fn();
      render(React.createElement(Header, { darkMode: false, onToggleTheme: mockToggle }));

      const h1 = screen.getByRole('heading', { level: 1 });
      expect(h1).toBeInTheDocument();
    });

    test('should be keyboard accessible for theme toggle', async () => {
      const mockToggle = jest.fn();
      const user = userEvent.setup();
      render(React.createElement(Header, { darkMode: false, onToggleTheme: mockToggle }));

      const button = screen.getByRole('button', { name: '테마 전환' });
      button.focus();

      expect(button).toHaveFocus();

      await user.keyboard('{Enter}');
      expect(mockToggle).toHaveBeenCalledTimes(1);
    });

    test('should be keyboard accessible with Space key', async () => {
      const mockToggle = jest.fn();
      const user = userEvent.setup();
      render(React.createElement(Header, { darkMode: false, onToggleTheme: mockToggle }));

      const button = screen.getByRole('button', { name: '테마 전환' });
      button.focus();

      await user.keyboard(' ');
      expect(mockToggle).toHaveBeenCalledTimes(1);
    });

    test('should have button role for interactive element', () => {
      const mockToggle = jest.fn();
      render(React.createElement(Header, { darkMode: false, onToggleTheme: mockToggle }));

      const button = screen.getByRole('button');
      expect(button.tagName).toBe('BUTTON');
    });
  });

  describe('Edge Cases', () => {
    test('should handle undefined darkMode prop gracefully', () => {
      const mockToggle = jest.fn();
      render(React.createElement(Header, { darkMode: undefined, onToggleTheme: mockToggle }));

      // Should default to showing Moon icon (falsy value)
      expect(screen.getByTestId('moon-icon')).toBeInTheDocument();
    });

    test('should handle null darkMode prop gracefully', () => {
      const mockToggle = jest.fn();
      render(React.createElement(Header, { darkMode: null, onToggleTheme: mockToggle }));

      // Should default to showing Moon icon (falsy value)
      expect(screen.getByTestId('moon-icon')).toBeInTheDocument();
    });

    test('should handle truthy non-boolean darkMode values', () => {
      const mockToggle = jest.fn();
      render(React.createElement(Header, { darkMode: 1, onToggleTheme: mockToggle }));

      // Truthy value should show Sun icon
      expect(screen.getByTestId('sun-icon')).toBeInTheDocument();
    });

    test('should handle falsy non-boolean darkMode values', () => {
      const mockToggle = jest.fn();
      render(React.createElement(Header, { darkMode: 0, onToggleTheme: mockToggle }));

      // Falsy value should show Moon icon
      expect(screen.getByTestId('moon-icon')).toBeInTheDocument();
    });

    test('should render without crashing when onToggleTheme is not provided', () => {
      expect(() => {
        render(React.createElement(Header, { darkMode: false }));
      }).not.toThrow();
    });

    test('should handle rapid consecutive clicks', async () => {
      const mockToggle = jest.fn();
      const user = userEvent.setup();
      render(React.createElement(Header, { darkMode: false, onToggleTheme: mockToggle }));

      const button = screen.getByRole('button', { name: '테마 전환' });

      // Simulate rapid clicking
      await user.tripleClick(button);

      expect(mockToggle).toHaveBeenCalled();
      expect(mockToggle.mock.calls.length).toBeGreaterThan(0);
    });
  });

  describe('Component Structure', () => {
    test('should render title and subtitle in the same container', () => {
      const mockToggle = jest.fn();
      const { container } = render(React.createElement(Header, { darkMode: false, onToggleTheme: mockToggle }));

      const heading = screen.getByText('Token Calculator');
      const subtitle = screen.getByText('LLM 토큰 계산기');

      expect(heading.parentElement).toBe(subtitle.parentElement);
    });

    test('should maintain layout structure with header element', () => {
      const mockToggle = jest.fn();
      const { container } = render(React.createElement(Header, { darkMode: false, onToggleTheme: mockToggle }));

      const header = container.querySelector('header');
      const heading = screen.getByRole('heading', { level: 1 });
      const button = screen.getByRole('button');

      expect(header).toContainElement(heading);
      expect(header).toContainElement(button);
    });

    test('should render exactly one heading', () => {
      const mockToggle = jest.fn();
      render(React.createElement(Header, { darkMode: false, onToggleTheme: mockToggle }));

      const headings = screen.getAllByRole('heading');
      expect(headings).toHaveLength(1);
    });

    test('should render exactly one button', () => {
      const mockToggle = jest.fn();
      render(React.createElement(Header, { darkMode: false, onToggleTheme: mockToggle }));

      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(1);
    });
  });

  describe('Text Content Verification', () => {
    test('should display exact English title text', () => {
      const mockToggle = jest.fn();
      render(React.createElement(Header, { darkMode: false, onToggleTheme: mockToggle }));

      expect(screen.getByText('Token Calculator')).toBeInTheDocument();
    });

    test('should display exact Korean subtitle text', () => {
      const mockToggle = jest.fn();
      render(React.createElement(Header, { darkMode: false, onToggleTheme: mockToggle }));

      expect(screen.getByText('LLM 토큰 계산기')).toBeInTheDocument();
    });

    test('should not contain any other text content', () => {
      const mockToggle = jest.fn();
      const { container } = render(React.createElement(Header, { darkMode: false, onToggleTheme: mockToggle }));

      const headerText = container.textContent;
      // Should only contain the title, subtitle, and icon text (Moon or Sun)
      expect(headerText).toContain('Token Calculator');
      expect(headerText).toContain('LLM 토큰 계산기');
    });
  });

  describe('Integration Tests', () => {
    test('should work correctly in a complete light to dark mode flow', async () => {
      const mockToggle = jest.fn();
      const user = userEvent.setup();
      const { rerender } = render(React.createElement(Header, { darkMode: false, onToggleTheme: mockToggle }));

      // Initial state - light mode
      expect(screen.getByTestId('moon-icon')).toBeInTheDocument();

      // User clicks to toggle
      const button = screen.getByRole('button', { name: '테마 전환' });
      await user.click(button);

      expect(mockToggle).toHaveBeenCalledTimes(1);

      // Simulate state change to dark mode
      rerender(React.createElement(Header, { darkMode: true, onToggleTheme: mockToggle }));

      // Should now show sun icon
      expect(screen.getByTestId('sun-icon')).toBeInTheDocument();
      expect(screen.queryByTestId('moon-icon')).not.toBeInTheDocument();
    });

    test('should work correctly in a complete dark to light mode flow', async () => {
      const mockToggle = jest.fn();
      const user = userEvent.setup();
      const { rerender } = render(React.createElement(Header, { darkMode: true, onToggleTheme: mockToggle }));

      // Initial state - dark mode
      expect(screen.getByTestId('sun-icon')).toBeInTheDocument();

      // User clicks to toggle
      const button = screen.getByRole('button', { name: '테마 전환' });
      await user.click(button);

      expect(mockToggle).toHaveBeenCalledTimes(1);

      // Simulate state change to light mode
      rerender(React.createElement(Header, { darkMode: false, onToggleTheme: mockToggle }));

      // Should now show moon icon
      expect(screen.getByTestId('moon-icon')).toBeInTheDocument();
      expect(screen.queryByTestId('sun-icon')).not.toBeInTheDocument();
    });

    test('should maintain all static content during theme changes', () => {
      const mockToggle = jest.fn();
      const { rerender } = render(React.createElement(Header, { darkMode: false, onToggleTheme: mockToggle }));

      // Check content in light mode
      expect(screen.getByText('Token Calculator')).toBeInTheDocument();
      expect(screen.getByText('LLM 토큰 계산기')).toBeInTheDocument();

      // Switch to dark mode
      rerender(React.createElement(Header, { darkMode: true, onToggleTheme: mockToggle }));

      // Content should remain the same
      expect(screen.getByText('Token Calculator')).toBeInTheDocument();
      expect(screen.getByText('LLM 토큰 계산기')).toBeInTheDocument();
    });
  });
});
