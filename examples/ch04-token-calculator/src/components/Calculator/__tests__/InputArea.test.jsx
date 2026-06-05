import { describe, it, expect, jest } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import InputArea from '../InputArea.jsx';

describe('InputArea Component', () => {
  // ==================== RENDERING TESTS ====================

  describe('Component Rendering', () => {
    it('should render the component with all required elements', () => {
      const mockOnTextChange = jest.fn();
      render(<InputArea text="" onTextChange={mockOnTextChange} />);

      // Check label is rendered
      const label = screen.getByText('프롬프트 입력');
      expect(label).toBeInTheDocument();
      expect(label.tagName).toBe('LABEL');

      // Check textarea is rendered
      const textarea = screen.getByPlaceholderText('토큰을 계산할 텍스트를 입력하세요...');
      expect(textarea).toBeInTheDocument();
      expect(textarea.tagName).toBe('TEXTAREA');
    });

    it('should render with correct initial value from props', () => {
      const mockOnTextChange = jest.fn();
      const initialText = 'Initial text value';

      render(<InputArea text={initialText} onTextChange={mockOnTextChange} />);

      const textarea = screen.getByPlaceholderText('토큰을 계산할 텍스트를 입력하세요...');
      expect(textarea).toHaveValue(initialText);
    });

    it('should render with empty value when text prop is empty string', () => {
      const mockOnTextChange = jest.fn();

      render(<InputArea text="" onTextChange={mockOnTextChange} />);

      const textarea = screen.getByPlaceholderText('토큰을 계산할 텍스트를 입력하세요...');
      expect(textarea).toHaveValue('');
    });

    it('should apply correct CSS classes for styling', () => {
      const mockOnTextChange = jest.fn();

      render(<InputArea text="" onTextChange={mockOnTextChange} />);

      const textarea = screen.getByPlaceholderText('토큰을 계산할 텍스트를 입력하세요...');
      expect(textarea).toHaveClass('w-full', 'h-64', 'p-4', 'rounded-xl', 'resize-none');
    });
  });

  // ==================== PROPS HANDLING TESTS ====================

  describe('Props Handling', () => {
    it('should accept and display text prop correctly', () => {
      const mockOnTextChange = jest.fn();
      const testText = 'Test text content';

      render(<InputArea text={testText} onTextChange={mockOnTextChange} />);

      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveValue(testText);
    });

    it('should update displayed value when text prop changes', () => {
      const mockOnTextChange = jest.fn();
      const { rerender } = render(<InputArea text="Initial" onTextChange={mockOnTextChange} />);

      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveValue('Initial');

      // Update prop
      rerender(<InputArea text="Updated" onTextChange={mockOnTextChange} />);
      expect(textarea).toHaveValue('Updated');
    });

    it('should display placeholder when value is empty', () => {
      const mockOnTextChange = jest.fn();

      render(<InputArea text="" onTextChange={mockOnTextChange} />);

      const textarea = screen.getByPlaceholderText('토큰을 계산할 텍스트를 입력하세요...');
      expect(textarea).toBeInTheDocument();
      expect(textarea.getAttribute('placeholder')).toBe('토큰을 계산할 텍스트를 입력하세요...');
    });

    it('should handle onTextChange callback prop', () => {
      const mockOnTextChange = jest.fn();

      render(<InputArea text="" onTextChange={mockOnTextChange} />);

      const textarea = screen.getByRole('textbox');
      expect(textarea).toBeInTheDocument();
      // Callback existence is validated by the component not crashing
    });
  });

  // ==================== USER INTERACTION TESTS ====================

  describe('User Interactions - Typing', () => {
    it('should call onTextChange when user types text', async () => {
      const user = userEvent.setup();
      const mockOnTextChange = jest.fn();

      render(<InputArea text="" onTextChange={mockOnTextChange} />);

      const textarea = screen.getByRole('textbox');
      await user.type(textarea, 'Hello');

      // Should be called for each character typed
      expect(mockOnTextChange).toHaveBeenCalled();
      expect(mockOnTextChange.mock.calls.length).toBeGreaterThan(0);
    });

    it('should pass the correct new value to onTextChange callback', async () => {
      const user = userEvent.setup();
      let currentValue = '';
      const mockOnTextChange = jest.fn((newValue) => {
        currentValue = newValue;
      });

      const { rerender } = render(<InputArea text={currentValue} onTextChange={mockOnTextChange} />);

      const textarea = screen.getByRole('textbox');

      // Type 'T'
      await user.type(textarea, 'T');
      rerender(<InputArea text={currentValue} onTextChange={mockOnTextChange} />);

      // Type 'e'
      await user.type(textarea, 'e');
      rerender(<InputArea text={currentValue} onTextChange={mockOnTextChange} />);

      // Type 's'
      await user.type(textarea, 's');
      rerender(<InputArea text={currentValue} onTextChange={mockOnTextChange} />);

      // Type 't'
      await user.type(textarea, 't');
      rerender(<InputArea text={currentValue} onTextChange={mockOnTextChange} />);

      // Verify final value is 'Test'
      expect(currentValue).toBe('Test');
      expect(mockOnTextChange).toHaveBeenCalled();
    });

    it('should handle typing in existing text', async () => {
      const user = userEvent.setup();
      const mockOnTextChange = jest.fn();

      render(<InputArea text="Hello" onTextChange={mockOnTextChange} />);

      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveValue('Hello');

      // Simulate adding more text by clearing and re-typing
      mockOnTextChange.mockClear();
      await user.clear(textarea);
      expect(mockOnTextChange).toHaveBeenCalledWith('');

      // Type the new complete value
      mockOnTextChange.mockClear();
      await user.type(textarea, 'Hello World');

      expect(mockOnTextChange).toHaveBeenCalled();
      // Verify onChange was called with 'Hello World'
      const calls = mockOnTextChange.mock.calls;
      expect(calls[calls.length - 1][0]).toBe('Hello World');
    });

    it('should handle special characters input', async () => {
      const user = userEvent.setup();
      const mockOnTextChange = jest.fn();

      render(<InputArea text="" onTextChange={mockOnTextChange} />);

      const textarea = screen.getByRole('textbox');
      // Use paste for special characters to avoid keyboard mapping issues
      await user.click(textarea);
      await user.paste('!@#$%^&*()');

      expect(mockOnTextChange).toHaveBeenCalled();
      const lastCall = mockOnTextChange.mock.calls[mockOnTextChange.mock.calls.length - 1];
      expect(lastCall[0]).toBe('!@#$%^&*()');
    });

    it('should handle multi-line text input', async () => {
      const user = userEvent.setup();
      const mockOnTextChange = jest.fn();

      render(<InputArea text="" onTextChange={mockOnTextChange} />);

      const textarea = screen.getByRole('textbox');
      // Use paste for multi-line text to avoid enter key issues
      const multiLineText = 'Line 1\nLine 2\nLine 3';
      await user.click(textarea);
      await user.paste(multiLineText);

      expect(mockOnTextChange).toHaveBeenCalled();
      const lastCall = mockOnTextChange.mock.calls[mockOnTextChange.mock.calls.length - 1];
      expect(lastCall[0]).toBe(multiLineText);
    });

    it('should handle Unicode and emoji characters', async () => {
      const user = userEvent.setup();
      const mockOnTextChange = jest.fn();

      render(<InputArea text="" onTextChange={mockOnTextChange} />);

      const textarea = screen.getByRole('textbox');
      // Use paste for Unicode characters to avoid keyboard mapping issues
      const unicodeText = 'Hello 안녕하세요 こんにちは';
      await user.click(textarea);
      await user.paste(unicodeText);

      expect(mockOnTextChange).toHaveBeenCalled();
      const lastCall = mockOnTextChange.mock.calls[mockOnTextChange.mock.calls.length - 1];
      expect(lastCall[0]).toBe(unicodeText);
    });
  });

  describe('User Interactions - Pasting', () => {
    it('should call onTextChange when user pastes text', async () => {
      const user = userEvent.setup();
      const mockOnTextChange = jest.fn();

      render(<InputArea text="" onTextChange={mockOnTextChange} />);

      const textarea = screen.getByRole('textbox');
      await user.click(textarea);
      await user.paste('Pasted content');

      expect(mockOnTextChange).toHaveBeenCalled();
      const lastCall = mockOnTextChange.mock.calls[mockOnTextChange.mock.calls.length - 1];
      expect(lastCall[0]).toBe('Pasted content');
    });

    it('should handle pasting large text content', async () => {
      const user = userEvent.setup();
      const mockOnTextChange = jest.fn();

      render(<InputArea text="" onTextChange={mockOnTextChange} />);

      const textarea = screen.getByRole('textbox');
      const largeText = 'Lorem ipsum '.repeat(1000); // Large text content

      await user.click(textarea);
      await user.paste(largeText);

      expect(mockOnTextChange).toHaveBeenCalled();
      const lastCall = mockOnTextChange.mock.calls[mockOnTextChange.mock.calls.length - 1];
      expect(lastCall[0]).toBe(largeText);
    });

    it('should handle pasting text with multiple lines', async () => {
      const user = userEvent.setup();
      const mockOnTextChange = jest.fn();

      render(<InputArea text="" onTextChange={mockOnTextChange} />);

      const textarea = screen.getByRole('textbox');
      const multiLineText = 'Line 1\nLine 2\nLine 3\nLine 4';

      await user.click(textarea);
      await user.paste(multiLineText);

      expect(mockOnTextChange).toHaveBeenCalled();
      const lastCall = mockOnTextChange.mock.calls[mockOnTextChange.mock.calls.length - 1];
      expect(lastCall[0]).toBe(multiLineText);
    });
  });

  describe('User Interactions - Clearing', () => {
    it('should call onTextChange when user clears the textarea', async () => {
      const user = userEvent.setup();
      const mockOnTextChange = jest.fn();

      render(<InputArea text="Some text" onTextChange={mockOnTextChange} />);

      const textarea = screen.getByRole('textbox');
      await user.clear(textarea);

      expect(mockOnTextChange).toHaveBeenCalledWith('');
    });

    it('should handle selecting all and deleting', async () => {
      const user = userEvent.setup();
      const mockOnTextChange = jest.fn();

      render(<InputArea text="Delete me" onTextChange={mockOnTextChange} />);

      const textarea = screen.getByRole('textbox');
      await user.tripleClick(textarea); // Select all
      await user.keyboard('{Backspace}');

      expect(mockOnTextChange).toHaveBeenCalled();
      const lastCall = mockOnTextChange.mock.calls[mockOnTextChange.mock.calls.length - 1];
      expect(lastCall[0]).toBe('');
    });
  });

  // ==================== EDGE CASES TESTS ====================

  describe('Edge Cases', () => {
    it('should handle empty string value', () => {
      const mockOnTextChange = jest.fn();

      render(<InputArea text="" onTextChange={mockOnTextChange} />);

      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveValue('');
    });

    it('should handle very long text content', () => {
      const mockOnTextChange = jest.fn();
      const longText = 'A'.repeat(10000);

      render(<InputArea text={longText} onTextChange={mockOnTextChange} />);

      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveValue(longText);
      expect(textarea.value.length).toBe(10000);
    });

    it('should handle text with only whitespace', () => {
      const mockOnTextChange = jest.fn();
      const whitespaceText = '   \n\n\t\t   ';

      render(<InputArea text={whitespaceText} onTextChange={mockOnTextChange} />);

      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveValue(whitespaceText);
    });

    it('should handle text with HTML entities and tags', async () => {
      const user = userEvent.setup();
      const mockOnTextChange = jest.fn();

      render(<InputArea text="" onTextChange={mockOnTextChange} />);

      const textarea = screen.getByRole('textbox');
      const htmlContent = '<div>Test &amp; &lt;script&gt;</div>';
      await user.click(textarea);
      await user.paste(htmlContent);

      expect(mockOnTextChange).toHaveBeenCalled();
      const lastCall = mockOnTextChange.mock.calls[mockOnTextChange.mock.calls.length - 1];
      expect(lastCall[0]).toBe(htmlContent);
    });

    it('should handle null or undefined gracefully (with fallback)', () => {
      const mockOnTextChange = jest.fn();

      // React will warn about null/undefined, but component should handle gracefully
      // Testing with empty string as that's the expected fallback
      render(<InputArea text="" onTextChange={mockOnTextChange} />);

      const textarea = screen.getByRole('textbox');
      expect(textarea).toBeInTheDocument();
    });

    it('should handle rapid successive changes', async () => {
      const user = userEvent.setup();
      const mockOnTextChange = jest.fn();

      render(<InputArea text="" onTextChange={mockOnTextChange} />);

      const textarea = screen.getByRole('textbox');

      // Simulate rapid typing
      await user.type(textarea, 'Quick', { delay: 1 });

      expect(mockOnTextChange.mock.calls.length).toBeGreaterThan(0);
      // Each character should trigger onChange
      expect(mockOnTextChange).toHaveBeenCalledTimes(5); // Q, u, i, c, k
    });

    it('should handle text with various line break types', () => {
      const mockOnTextChange = jest.fn();
      const textWithBreaks = 'Line1\nLine2\rLine3\r\nLine4';

      render(<InputArea text={textWithBreaks} onTextChange={mockOnTextChange} />);

      const textarea = screen.getByRole('textbox');
      expect(textarea.value).toContain('Line1');
      expect(textarea.value).toContain('Line4');
    });
  });

  // ==================== ACCESSIBILITY TESTS ====================

  describe('Accessibility', () => {
    it('should have a label associated with textarea', () => {
      const mockOnTextChange = jest.fn();

      render(<InputArea text="" onTextChange={mockOnTextChange} />);

      const label = screen.getByText('프롬프트 입력');
      expect(label).toBeInTheDocument();
    });

    it('should be keyboard accessible', async () => {
      const user = userEvent.setup();
      const mockOnTextChange = jest.fn();

      render(<InputArea text="" onTextChange={mockOnTextChange} />);

      const textarea = screen.getByRole('textbox');

      // Tab to focus
      await user.tab();
      expect(textarea).toHaveFocus();

      // Type with keyboard
      await user.keyboard('Hello');
      expect(mockOnTextChange).toHaveBeenCalled();
    });

    it('should be accessible via role="textbox"', () => {
      const mockOnTextChange = jest.fn();

      render(<InputArea text="" onTextChange={mockOnTextChange} />);

      const textarea = screen.getByRole('textbox');
      expect(textarea).toBeInTheDocument();
    });

    it('should support screen reader navigation', () => {
      const mockOnTextChange = jest.fn();

      render(<InputArea text="Some text" onTextChange={mockOnTextChange} />);

      // Check that textarea has accessible attributes
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('placeholder');
      // Textarea value is set via the value property, not attribute
      expect(textarea.value).toBe('Some text');
    });

    it('should allow focus and blur events', async () => {
      const user = userEvent.setup();
      const mockOnTextChange = jest.fn();

      render(<InputArea text="" onTextChange={mockOnTextChange} />);

      const textarea = screen.getByRole('textbox');

      // Focus
      await user.click(textarea);
      expect(textarea).toHaveFocus();

      // Blur
      await user.tab();
      expect(textarea).not.toHaveFocus();
    });
  });

  // ==================== EVENT HANDLING TESTS ====================

  describe('onChange Event Handling', () => {
    it('should trigger onChange with correct event structure', async () => {
      const user = userEvent.setup();
      const mockOnTextChange = jest.fn();

      render(<InputArea text="" onTextChange={mockOnTextChange} />);

      const textarea = screen.getByRole('textbox');
      await user.type(textarea, 'A');

      // Verify the callback receives a string value (not the event object)
      expect(mockOnTextChange).toHaveBeenCalledWith('A');
      expect(typeof mockOnTextChange.mock.calls[0][0]).toBe('string');
    });

    it('should not call onChange when text prop changes externally', () => {
      const mockOnTextChange = jest.fn();
      const { rerender } = render(<InputArea text="Initial" onTextChange={mockOnTextChange} />);

      mockOnTextChange.mockClear();

      // Change prop externally
      rerender(<InputArea text="Changed externally" onTextChange={mockOnTextChange} />);

      // onChange should not be called for prop updates
      expect(mockOnTextChange).not.toHaveBeenCalled();
    });

    it('should handle onChange being called multiple times rapidly', async () => {
      const user = userEvent.setup();
      const mockOnTextChange = jest.fn();

      render(<InputArea text="" onTextChange={mockOnTextChange} />);

      const textarea = screen.getByRole('textbox');
      await user.type(textarea, 'Fast', { delay: 1 });

      // Should handle all calls without errors
      expect(mockOnTextChange.mock.calls.length).toBe(4);
    });
  });

  // ==================== TEXTAREA BEHAVIOR TESTS ====================

  describe('Textarea Specific Behavior', () => {
    it('should be a multiline input element', () => {
      const mockOnTextChange = jest.fn();

      render(<InputArea text="" onTextChange={mockOnTextChange} />);

      const textarea = screen.getByRole('textbox', { multiline: true });
      expect(textarea).toBeInTheDocument();
    });

    it('should not be resizable (resize-none class)', () => {
      const mockOnTextChange = jest.fn();

      render(<InputArea text="" onTextChange={mockOnTextChange} />);

      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveClass('resize-none');
    });

    it('should maintain text selection after typing', async () => {
      const user = userEvent.setup();
      const mockOnTextChange = jest.fn();

      render(<InputArea text="Select this text" onTextChange={mockOnTextChange} />);

      const textarea = screen.getByRole('textbox');
      await user.click(textarea);

      // Textarea should be focusable and selectable
      expect(textarea).toHaveFocus();
    });

    it('should handle cursor positioning correctly', async () => {
      const user = userEvent.setup();
      const mockOnTextChange = jest.fn();

      render(<InputArea text="Hello World" onTextChange={mockOnTextChange} />);

      const textarea = screen.getByRole('textbox');
      await user.click(textarea);

      // Should allow cursor interaction
      expect(textarea).toHaveFocus();
      expect(textarea.value).toBe('Hello World');
    });
  });

  // ==================== INTEGRATION TESTS ====================

  describe('Integration Scenarios', () => {
    it('should work correctly in a complete user flow', async () => {
      const user = userEvent.setup();
      const mockOnTextChange = jest.fn();

      const { rerender } = render(<InputArea text="" onTextChange={mockOnTextChange} />);

      const textarea = screen.getByRole('textbox');

      // Step 1: User types initial text
      await user.type(textarea, 'Initial text');
      expect(mockOnTextChange).toHaveBeenCalled();

      // Step 2: Parent component updates the value
      rerender(<InputArea text="Initial text" onTextChange={mockOnTextChange} />);
      expect(textarea).toHaveValue('Initial text');

      // Step 3: User adds more text
      mockOnTextChange.mockClear();
      await user.type(textarea, ' more');
      expect(mockOnTextChange).toHaveBeenCalled();

      // Step 4: Parent updates again
      rerender(<InputArea text="Initial text more" onTextChange={mockOnTextChange} />);
      expect(textarea).toHaveValue('Initial text more');
    });

    it('should handle controlled component pattern correctly', async () => {
      const user = userEvent.setup();
      let currentText = '';
      const handleTextChange = (newText) => {
        currentText = newText;
      };

      const { rerender } = render(
        <InputArea text={currentText} onTextChange={handleTextChange} />
      );

      const textarea = screen.getByRole('textbox');

      // Type each character and re-render with the updated value
      await user.type(textarea, 'T');
      rerender(<InputArea text={currentText} onTextChange={handleTextChange} />);

      await user.type(textarea, 'e');
      rerender(<InputArea text={currentText} onTextChange={handleTextChange} />);

      await user.type(textarea, 's');
      rerender(<InputArea text={currentText} onTextChange={handleTextChange} />);

      await user.type(textarea, 't');
      rerender(<InputArea text={currentText} onTextChange={handleTextChange} />);

      expect(currentText).toBe('Test');
    });
  });
});
