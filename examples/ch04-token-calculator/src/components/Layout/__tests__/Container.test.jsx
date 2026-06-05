/**
 * @jest-environment jsdom
 */
import { describe, it, expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import Container from '../Container.jsx';

describe('Container Component', () => {
  describe('Rendering Tests', () => {
    it('should render without crashing', () => {
      const { container } = render(<Container />);
      expect(container).toBeTruthy();
    });

    it('should render with children', () => {
      render(
        <Container>
          <div data-testid="child-element">Test Content</div>
        </Container>
      );

      const childElement = screen.getByTestId('child-element');
      expect(childElement).toBeInTheDocument();
      expect(childElement).toHaveTextContent('Test Content');
    });

    it('should render multiple children', () => {
      render(
        <Container>
          <div data-testid="child-1">First Child</div>
          <div data-testid="child-2">Second Child</div>
          <div data-testid="child-3">Third Child</div>
        </Container>
      );

      expect(screen.getByTestId('child-1')).toBeInTheDocument();
      expect(screen.getByTestId('child-2')).toBeInTheDocument();
      expect(screen.getByTestId('child-3')).toBeInTheDocument();
    });

    it('should render with text content as children', () => {
      render(<Container>Plain text content</Container>);

      expect(screen.getByText('Plain text content')).toBeInTheDocument();
    });

    it('should render with complex nested children', () => {
      render(
        <Container>
          <div>
            <header data-testid="header">Header</header>
            <main data-testid="main">
              <section>
                <p data-testid="paragraph">Nested paragraph</p>
              </section>
            </main>
          </div>
        </Container>
      );

      expect(screen.getByTestId('header')).toBeInTheDocument();
      expect(screen.getByTestId('main')).toBeInTheDocument();
      expect(screen.getByTestId('paragraph')).toBeInTheDocument();
    });
  });

  describe('Props Handling', () => {
    it('should accept and render children prop correctly', () => {
      const testContent = <span data-testid="test-span">Test Span</span>;
      render(<Container>{testContent}</Container>);

      expect(screen.getByTestId('test-span')).toBeInTheDocument();
    });

    it('should handle missing children prop gracefully', () => {
      const { container } = render(<Container />);

      // Component should still render without crashing
      expect(container.firstChild).toBeInTheDocument();

      // The inner div should be empty
      const innerDiv = container.querySelector('.max-w-3xl');
      expect(innerDiv).toBeEmptyDOMElement();
    });

    it('should handle null children', () => {
      const { container } = render(<Container>{null}</Container>);

      expect(container.firstChild).toBeInTheDocument();
      const innerDiv = container.querySelector('.max-w-3xl');
      expect(innerDiv).toBeEmptyDOMElement();
    });

    it('should handle undefined children', () => {
      const { container } = render(<Container>{undefined}</Container>);

      expect(container.firstChild).toBeInTheDocument();
      const innerDiv = container.querySelector('.max-w-3xl');
      expect(innerDiv).toBeEmptyDOMElement();
    });

    it('should handle empty string as children', () => {
      const { container } = render(<Container>{''}</Container>);

      expect(container.firstChild).toBeInTheDocument();
      const innerDiv = container.querySelector('.max-w-3xl');
      expect(innerDiv).toBeEmptyDOMElement();
    });

    it('should handle boolean children (false)', () => {
      const { container } = render(<Container>{false}</Container>);

      expect(container.firstChild).toBeInTheDocument();
      const innerDiv = container.querySelector('.max-w-3xl');
      expect(innerDiv).toBeEmptyDOMElement();
    });

    it('should handle boolean children (true)', () => {
      const { container } = render(<Container>{true}</Container>);

      expect(container.firstChild).toBeInTheDocument();
      const innerDiv = container.querySelector('.max-w-3xl');
      expect(innerDiv).toBeEmptyDOMElement();
    });
  });

  describe('CSS Classes and Styling', () => {
    it('should apply correct outer container classes', () => {
      const { container } = render(
        <Container>
          <div>Content</div>
        </Container>
      );

      const outerDiv = container.firstChild;
      expect(outerDiv).toHaveClass('min-h-screen');
      expect(outerDiv).toHaveClass('bg-slate-50');
      expect(outerDiv).toHaveClass('dark:bg-slate-950');
      expect(outerDiv).toHaveClass('transition-colors');
      expect(outerDiv).toHaveClass('duration-300');
    });

    it('should apply correct inner container classes', () => {
      const { container } = render(
        <Container>
          <div>Content</div>
        </Container>
      );

      const innerDiv = container.querySelector('.max-w-3xl');
      expect(innerDiv).toBeInTheDocument();
      expect(innerDiv).toHaveClass('max-w-3xl');
      expect(innerDiv).toHaveClass('mx-auto');
      expect(innerDiv).toHaveClass('p-4');
      expect(innerDiv).toHaveClass('md:p-8');
    });

    it('should maintain consistent structure with two nested divs', () => {
      const { container } = render(
        <Container>
          <div data-testid="content">Test</div>
        </Container>
      );

      // Check that we have the expected structure
      const outerDiv = container.firstChild;
      const innerDiv = outerDiv.firstChild;
      const content = innerDiv.firstChild;

      expect(outerDiv.tagName).toBe('DIV');
      expect(innerDiv.tagName).toBe('DIV');
      expect(content).toHaveAttribute('data-testid', 'content');
    });

    it('should have all required Tailwind utility classes', () => {
      const { container } = render(<Container><div>Test</div></Container>);

      const outerDiv = container.firstChild;
      const classList = Array.from(outerDiv.classList);

      // Verify all expected classes are present
      const expectedClasses = [
        'min-h-screen',
        'bg-slate-50',
        'dark:bg-slate-950',
        'transition-colors',
        'duration-300'
      ];

      expectedClasses.forEach(className => {
        expect(classList).toContain(className);
      });
    });
  });

  describe('Different Children Types', () => {
    it('should render with React component as child', () => {
      const ChildComponent = () => <div data-testid="child-component">Child Component</div>;

      render(
        <Container>
          <ChildComponent />
        </Container>
      );

      expect(screen.getByTestId('child-component')).toBeInTheDocument();
    });

    it('should render with array of elements', () => {
      const items = ['Item 1', 'Item 2', 'Item 3'];

      render(
        <Container>
          {items.map((item, index) => (
            <div key={index} data-testid={`item-${index}`}>
              {item}
            </div>
          ))}
        </Container>
      );

      items.forEach((item, index) => {
        expect(screen.getByTestId(`item-${index}`)).toHaveTextContent(item);
      });
    });

    it('should render with fragment as child', () => {
      render(
        <Container>
          <>
            <div data-testid="fragment-child-1">First</div>
            <div data-testid="fragment-child-2">Second</div>
          </>
        </Container>
      );

      expect(screen.getByTestId('fragment-child-1')).toBeInTheDocument();
      expect(screen.getByTestId('fragment-child-2')).toBeInTheDocument();
    });

    it('should render with number as child', () => {
      render(<Container>{42}</Container>);

      expect(screen.getByText('42')).toBeInTheDocument();
    });

    it('should render with mixed content types', () => {
      render(
        <Container>
          Plain text
          <span data-testid="span">Span element</span>
          {123}
          <div data-testid="div">Div element</div>
        </Container>
      );

      expect(screen.getByText(/Plain text/)).toBeInTheDocument();
      expect(screen.getByTestId('span')).toBeInTheDocument();
      expect(screen.getByText(/123/)).toBeInTheDocument();
      expect(screen.getByTestId('div')).toBeInTheDocument();
    });

    it('should render with conditional children', () => {
      const showContent = true;

      render(
        <Container>
          {showContent && <div data-testid="conditional">Conditional Content</div>}
        </Container>
      );

      expect(screen.getByTestId('conditional')).toBeInTheDocument();
    });

    it('should handle conditional children when condition is false', () => {
      const showContent = false;

      const { container } = render(
        <Container>
          {showContent && <div data-testid="conditional">Conditional Content</div>}
        </Container>
      );

      expect(screen.queryByTestId('conditional')).not.toBeInTheDocument();
      const innerDiv = container.querySelector('.max-w-3xl');
      expect(innerDiv).toBeEmptyDOMElement();
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long text content', () => {
      const longText = 'A'.repeat(1000);

      render(<Container>{longText}</Container>);

      expect(screen.getByText(longText)).toBeInTheDocument();
    });

    it('should handle special characters in children', () => {
      const specialChars = '!@#$%^&*()_+-=[]{}|;:",.<>?/~`';

      render(<Container>{specialChars}</Container>);

      expect(screen.getByText(specialChars)).toBeInTheDocument();
    });

    it('should handle HTML entities in children', () => {
      render(
        <Container>
          <div data-testid="entities">&lt; &gt; &amp; &quot;</div>
        </Container>
      );

      const element = screen.getByTestId('entities');
      expect(element).toBeInTheDocument();
    });

    it('should maintain structure when rendered multiple times', () => {
      const { rerender, container } = render(
        <Container>
          <div>First render</div>
        </Container>
      );

      expect(container.firstChild).toHaveClass('min-h-screen');

      rerender(
        <Container>
          <div>Second render</div>
        </Container>
      );

      expect(container.firstChild).toHaveClass('min-h-screen');
      expect(screen.getByText('Second render')).toBeInTheDocument();
    });

    it('should handle empty array as children', () => {
      const { container } = render(<Container>{[]}</Container>);

      const innerDiv = container.querySelector('.max-w-3xl');
      expect(innerDiv).toBeEmptyDOMElement();
    });

    it('should handle deeply nested component hierarchy', () => {
      const DeepNested = () => (
        <div data-testid="level-1">
          <div data-testid="level-2">
            <div data-testid="level-3">
              <div data-testid="level-4">
                <div data-testid="level-5">Deep Content</div>
              </div>
            </div>
          </div>
        </div>
      );

      render(
        <Container>
          <DeepNested />
        </Container>
      );

      expect(screen.getByTestId('level-1')).toBeInTheDocument();
      expect(screen.getByTestId('level-5')).toHaveTextContent('Deep Content');
    });
  });

  describe('Accessibility', () => {
    it('should render semantic HTML structure', () => {
      const { container } = render(
        <Container>
          <main>Main Content</main>
        </Container>
      );

      expect(container.querySelector('main')).toBeInTheDocument();
    });

    it('should not interfere with child component accessibility attributes', () => {
      render(
        <Container>
          <button aria-label="Click me" data-testid="button">
            Click
          </button>
        </Container>
      );

      const button = screen.getByTestId('button');
      expect(button).toHaveAttribute('aria-label', 'Click me');
    });

    it('should preserve child component roles', () => {
      render(
        <Container>
          <nav role="navigation" data-testid="nav">
            Navigation
          </nav>
        </Container>
      );

      const nav = screen.getByTestId('nav');
      expect(nav).toHaveAttribute('role', 'navigation');
    });
  });

  describe('Integration Tests', () => {
    it('should work correctly as a layout wrapper', () => {
      render(
        <Container>
          <header data-testid="header">
            <h1>Title</h1>
          </header>
          <main data-testid="main">
            <p>Content</p>
          </main>
          <footer data-testid="footer">
            <p>Footer</p>
          </footer>
        </Container>
      );

      expect(screen.getByTestId('header')).toBeInTheDocument();
      expect(screen.getByTestId('main')).toBeInTheDocument();
      expect(screen.getByTestId('footer')).toBeInTheDocument();
    });

    it('should maintain proper DOM hierarchy', () => {
      const { container } = render(
        <Container>
          <div data-testid="child">Content</div>
        </Container>
      );

      const outerContainer = container.firstChild;
      const innerContainer = outerContainer.firstChild;
      const child = screen.getByTestId('child');

      expect(innerContainer.contains(child)).toBe(true);
      expect(outerContainer.contains(innerContainer)).toBe(true);
    });
  });
});
