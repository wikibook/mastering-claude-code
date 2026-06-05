/**
 * @jest-environment jsdom
 */

import { describe, test, expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import Footer from '../Footer.jsx';

describe('Footer Component', () => {
  describe('Rendering', () => {
    test('should render footer element', () => {
      const { container } = render(React.createElement(Footer));
      const footer = container.querySelector('footer');

      expect(footer).toBeInTheDocument();
    });

    test('should render with semantic footer tag', () => {
      render(React.createElement(Footer));
      const footer = screen.getByRole('contentinfo');

      expect(footer).toBeInTheDocument();
    });

    test('should render exactly one paragraph element', () => {
      const { container } = render(React.createElement(Footer));
      const paragraphs = container.querySelectorAll('p');

      expect(paragraphs).toHaveLength(1);
    });

    test('should render without crashing', () => {
      expect(() => render(React.createElement(Footer))).not.toThrow();
    });
  });

  describe('Text Content', () => {
    test('should display correct Korean and English text content', () => {
      render(React.createElement(Footer));

      const text = screen.getByText(/LLM Token Calculator/i);
      expect(text).toBeInTheDocument();
    });

    test('should contain complete message text', () => {
      render(React.createElement(Footer));

      const fullText = screen.getByText(
        'LLM Token Calculator - 최신 AI 모델의 토큰 수를 실시간으로 계산합니다.'
      );
      expect(fullText).toBeInTheDocument();
    });

    test('should contain Korean description text', () => {
      render(React.createElement(Footer));

      const koreanText = screen.getByText(/최신 AI 모델의 토큰 수를 실시간으로 계산합니다/);
      expect(koreanText).toBeInTheDocument();
    });

    test('should have text content in paragraph element', () => {
      const { container } = render(React.createElement(Footer));
      const paragraph = container.querySelector('p');

      expect(paragraph?.textContent).toBe(
        'LLM Token Calculator - 최신 AI 모델의 토큰 수를 실시간으로 계산합니다.'
      );
    });
  });

  describe('CSS Classes and Styling', () => {
    test('should apply correct Tailwind classes to footer element', () => {
      const { container } = render(React.createElement(Footer));
      const footer = container.querySelector('footer');

      expect(footer).toHaveClass('mt-8');
      expect(footer).toHaveClass('pt-6');
      expect(footer).toHaveClass('border-t');
      expect(footer).toHaveClass('border-slate-200');
      expect(footer).toHaveClass('dark:border-slate-800');
    });

    test('should have all expected footer classes', () => {
      const { container} = render(React.createElement(Footer));
      const footer = container.querySelector('footer');

      const expectedClasses = [
        'mt-8',
        'pt-6',
        'border-t',
        'border-slate-200',
        'dark:border-slate-800'
      ];

      expectedClasses.forEach(className => {
        expect(footer).toHaveClass(className);
      });
    });

    test('should apply correct Tailwind classes to paragraph element', () => {
      const { container } = render(React.createElement(Footer));
      const paragraph = container.querySelector('p');

      expect(paragraph).toHaveClass('text-center');
      expect(paragraph).toHaveClass('text-sm');
      expect(paragraph).toHaveClass('text-slate-500');
      expect(paragraph).toHaveClass('dark:text-slate-400');
    });

    test('should have all expected paragraph classes', () => {
      const { container } = render(React.createElement(Footer));
      const paragraph = container.querySelector('p');

      const expectedClasses = [
        'text-center',
        'text-sm',
        'text-slate-500',
        'dark:text-slate-400'
      ];

      expectedClasses.forEach(className => {
        expect(paragraph).toHaveClass(className);
      });
    });
  });

  describe('Structure and Hierarchy', () => {
    test('should have paragraph as direct child of footer', () => {
      const { container } = render(React.createElement(Footer));
      const footer = container.querySelector('footer');
      const paragraph = footer?.querySelector('p');

      expect(paragraph).toBeInTheDocument();
      expect(paragraph?.parentElement).toBe(footer);
    });

    test('should not contain any links', () => {
      const { container } = render(React.createElement(Footer));
      const links = container.querySelectorAll('a');

      expect(links).toHaveLength(0);
    });

    test('should not contain any buttons', () => {
      const { container } = render(React.createElement(Footer));
      const buttons = container.querySelectorAll('button');

      expect(buttons).toHaveLength(0);
    });

    test('should not contain any images', () => {
      const { container } = render(React.createElement(Footer));
      const images = container.querySelectorAll('img');

      expect(images).toHaveLength(0);
    });

    test('should have only footer and paragraph elements', () => {
      const { container } = render(React.createElement(Footer));
      const allElements = container.querySelectorAll('*');

      // Should only have: div (container), footer, and p
      expect(allElements.length).toBe(3);
    });
  });

  describe('Props Handling', () => {
    test('should render correctly without any props', () => {
      expect(() => render(React.createElement(Footer))).not.toThrow();
    });

    test('should maintain consistent output on multiple renders', () => {
      const { container: container1 } = render(React.createElement(Footer));
      const { container: container2 } = render(React.createElement(Footer));

      expect(container1.innerHTML).toBe(container2.innerHTML);
    });

    test('should be a pure component with no props', () => {
      const { container, rerender } = render(React.createElement(Footer));
      const initialHTML = container.innerHTML;

      rerender(React.createElement(Footer));

      expect(container.innerHTML).toBe(initialHTML);
    });
  });

  describe('Accessibility', () => {
    test('should have proper semantic HTML with footer role', () => {
      render(React.createElement(Footer));
      const footer = screen.getByRole('contentinfo');

      expect(footer).toBeInTheDocument();
    });

    test('should have visible text content for screen readers', () => {
      const { container } = render(React.createElement(Footer));
      const paragraph = container.querySelector('p');

      expect(paragraph).toBeVisible();
      expect(paragraph?.textContent).toBeTruthy();
    });

    test('should not have any accessibility violations with empty alt text', () => {
      const { container } = render(React.createElement(Footer));
      const images = container.querySelectorAll('img');

      // No images should exist
      expect(images).toHaveLength(0);
    });

    test('should not have hidden content that affects accessibility', () => {
      const { container } = render(React.createElement(Footer));
      const footer = container.querySelector('footer');
      const paragraph = footer?.querySelector('p');

      expect(footer).not.toHaveAttribute('aria-hidden', 'true');
      expect(paragraph).not.toHaveAttribute('aria-hidden', 'true');
    });

    test('should have descriptive text for assistive technologies', () => {
      render(React.createElement(Footer));
      const text = screen.getByText(/LLM Token Calculator/);

      expect(text).toBeInTheDocument();
      expect(text.textContent).toContain('LLM Token Calculator');
      expect(text.textContent).toContain('토큰 수를 실시간으로 계산');
    });

    test('should use proper heading hierarchy (no headings in footer)', () => {
      const { container } = render(React.createElement(Footer));
      const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');

      // Footer should not contain headings
      expect(headings).toHaveLength(0);
    });

    test('should have centered text for better readability', () => {
      const { container } = render(React.createElement(Footer));
      const paragraph = container.querySelector('p');

      expect(paragraph).toHaveClass('text-center');
    });
  });

  describe('Edge Cases', () => {
    test('should render in isolation without other components', () => {
      const { container } = render(React.createElement(Footer));

      expect(container.firstChild).toBeInTheDocument();
    });

    test('should render multiple instances independently', () => {
      const { container: container1 } = render(React.createElement(Footer));
      const { container: container2 } = render(React.createElement(Footer));

      const footer1 = container1.querySelector('footer');
      const footer2 = container2.querySelector('footer');

      expect(footer1).not.toBe(footer2);
      expect(footer1?.textContent).toBe(footer2?.textContent);
    });

    test('should maintain structure after unmounting and remounting', () => {
      const { container, unmount, rerender } = render(React.createElement(Footer));
      const originalHTML = container.innerHTML;

      unmount();
      rerender(React.createElement(Footer));

      expect(container.querySelector('footer')).toBeInTheDocument();
    });

    test('should handle rapid re-renders without errors', () => {
      const { rerender } = render(React.createElement(Footer));

      expect(() => {
        for (let i = 0; i < 10; i++) {
          rerender(React.createElement(Footer));
        }
      }).not.toThrow();
    });
  });

  describe('Component Type and Export', () => {
    test('should be a valid React component', () => {
      expect(typeof Footer).toBe('function');
    });

    test('should render as a React element', () => {
      const element = React.createElement(Footer);
      expect(element).toBeDefined();
      expect(element.type).toBe(Footer);
    });

    test('should be the default export', () => {
      expect(Footer).toBeDefined();
      expect(Footer.name).toBe('Footer');
    });
  });

  describe('Dark Mode Support', () => {
    test('should have dark mode border class', () => {
      const { container } = render(React.createElement(Footer));
      const footer = container.querySelector('footer');

      expect(footer).toHaveClass('dark:border-slate-800');
    });

    test('should have dark mode text color class on paragraph', () => {
      const { container } = render(React.createElement(Footer));
      const paragraph = container.querySelector('p');

      expect(paragraph).toHaveClass('dark:text-slate-400');
    });

    test('should have both light and dark mode border colors', () => {
      const { container } = render(React.createElement(Footer));
      const footer = container.querySelector('footer');

      expect(footer?.className).toContain('border-slate-200');
      expect(footer?.className).toContain('dark:border-slate-800');
    });

    test('should have both light and dark mode text colors', () => {
      const { container } = render(React.createElement(Footer));
      const paragraph = container.querySelector('p');

      expect(paragraph?.className).toContain('text-slate-500');
      expect(paragraph?.className).toContain('dark:text-slate-400');
    });
  });

  describe('Snapshot Testing', () => {
    test('should match snapshot', () => {
      const { container } = render(React.createElement(Footer));
      expect(container.firstChild).toMatchSnapshot();
    });

    test('should have consistent HTML structure', () => {
      const { container } = render(React.createElement(Footer));
      const footer = container.querySelector('footer');

      expect(footer?.tagName).toBe('FOOTER');
      expect(footer?.children).toHaveLength(1);
      expect(footer?.children[0].tagName).toBe('P');
    });
  });

  describe('Integration and Context', () => {
    test('should render correctly when wrapped in div container', () => {
      const { container } = render(
        React.createElement('div', null, React.createElement(Footer))
      );

      const footer = container.querySelector('footer');
      expect(footer).toBeInTheDocument();
    });

    test('should render correctly alongside other elements', () => {
      const { container } = render(
        React.createElement('div', null,
          React.createElement('header', null, 'Header'),
          React.createElement('main', null, 'Main Content'),
          React.createElement(Footer)
        )
      );

      const footer = container.querySelector('footer');
      expect(footer).toBeInTheDocument();
      expect(footer?.textContent).toContain('LLM Token Calculator');
    });

    test('should not interfere with sibling components', () => {
      const { container } = render(
        React.createElement('div', null,
          React.createElement('div', { id: 'sibling' }, 'Sibling'),
          React.createElement(Footer)
        )
      );

      const sibling = container.querySelector('#sibling');
      const footer = container.querySelector('footer');

      expect(sibling).toBeInTheDocument();
      expect(footer).toBeInTheDocument();
    });
  });
});
