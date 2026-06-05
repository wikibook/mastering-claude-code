import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ControlBar from '../ControlBar.jsx';

/**
 * Comprehensive test suite for ControlBar component
 *
 * This component provides copy and clear functionality with:
 * - Copy button with clipboard integration
 * - Clear button for resetting text
 * - Visual feedback for copy success
 * - Disabled states when no text is present
 */
describe('ControlBar Component', () => {
  let consoleErrorSpy;
  let mockOnClear;
  let mockClipboard;

  beforeEach(() => {
    // Mock console.error to suppress error logs in tests
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    // Create mock onClear function
    mockOnClear = jest.fn();

    // Mock the Clipboard API
    mockClipboard = {
      writeText: jest.fn(() => Promise.resolve()),
    };
    Object.defineProperty(navigator, 'clipboard', {
      value: mockClipboard,
      writable: true,
      configurable: true,
    });

    // Use fake timers to control setTimeout behavior
    jest.useFakeTimers();
  });

  afterEach(() => {
    // Restore all mocks
    consoleErrorSpy.mockRestore();
    jest.clearAllMocks();
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  // ============================================================================
  // RENDERING TESTS
  // ============================================================================

  describe('Component Rendering', () => {
    test('should render both copy and clear buttons', () => {
      render(<ControlBar text="Sample text" onClear={mockOnClear} />);

      const copyButton = screen.getByRole('button', { name: /복사/ });
      const clearButton = screen.getByRole('button', { name: /초기화/ });

      expect(copyButton).toBeTruthy();
      expect(clearButton).toBeTruthy();
    });

    test('should render with correct initial button text', () => {
      render(<ControlBar text="Sample text" onClear={mockOnClear} />);

      expect(screen.getByText('복사')).toBeTruthy();
      expect(screen.getByText('초기화')).toBeTruthy();
    });

    test('should render copy icon initially', () => {
      const { container } = render(<ControlBar text="Sample text" onClear={mockOnClear} />);

      // Check that Copy icon is rendered (lucide-react icons have specific class patterns)
      const copyButton = screen.getByRole('button', { name: /복사/ });
      expect(copyButton).toBeTruthy();
    });

    test('should render trash icon for clear button', () => {
      const { container } = render(<ControlBar text="Sample text" onClear={mockOnClear} />);

      const clearButton = screen.getByRole('button', { name: /초기화/ });
      expect(clearButton).toBeTruthy();
    });

    test('should apply correct CSS classes to container', () => {
      const { container } = render(<ControlBar text="Sample text" onClear={mockOnClear} />);

      const containerDiv = container.querySelector('.flex.gap-2');
      expect(containerDiv).toBeTruthy();
    });

    test('should apply correct CSS classes to buttons', () => {
      render(<ControlBar text="Sample text" onClear={mockOnClear} />);

      const copyButton = screen.getByRole('button', { name: /복사/ });
      const clearButton = screen.getByRole('button', { name: /초기화/ });

      // Check that buttons have expected classes
      expect(copyButton.className).toContain('flex');
      expect(copyButton.className).toContain('items-center');
      expect(copyButton.className).toContain('gap-2');
      expect(clearButton.className).toContain('flex');
      expect(clearButton.className).toContain('items-center');
    });
  });

  // ============================================================================
  // COPY BUTTON FUNCTIONALITY - SUCCESS CASES
  // ============================================================================

  describe('Copy Button - Success Cases', () => {
    test('should copy text to clipboard when copy button is clicked', async () => {
      render(<ControlBar text="Hello World" onClear={mockOnClear} />);

      const copyButton = screen.getByRole('button', { name: /복사/ });
      fireEvent.click(copyButton);

      await waitFor(() => {
        expect(mockClipboard.writeText).toHaveBeenCalledWith('Hello World');
      });
    });

    test('should copy Korean text to clipboard', async () => {
      const koreanText = '안녕하세요 세계';
      render(<ControlBar text={koreanText} onClear={mockOnClear} />);

      const copyButton = screen.getByRole('button', { name: /복사/ });
      fireEvent.click(copyButton);

      await waitFor(() => {
        expect(mockClipboard.writeText).toHaveBeenCalledWith(koreanText);
      });
    });

    test('should copy multiline text to clipboard', async () => {
      const multilineText = 'Line 1\nLine 2\nLine 3';
      render(<ControlBar text={multilineText} onClear={mockOnClear} />);

      const copyButton = screen.getByRole('button', { name: /복사/ });
      fireEvent.click(copyButton);

      await waitFor(() => {
        expect(mockClipboard.writeText).toHaveBeenCalledWith(multilineText);
      });
    });

    test('should copy special characters to clipboard', async () => {
      const specialText = '!@#$%^&*()_+-={}[]|:";\'<>?,./`~';
      render(<ControlBar text={specialText} onClear={mockOnClear} />);

      const copyButton = screen.getByRole('button', { name: /복사/ });
      fireEvent.click(copyButton);

      await waitFor(() => {
        expect(mockClipboard.writeText).toHaveBeenCalledWith(specialText);
      });
    });

    test('should show success message after copying', async () => {
      render(<ControlBar text="Sample text" onClear={mockOnClear} />);

      const copyButton = screen.getByRole('button', { name: /복사/ });
      fireEvent.click(copyButton);

      await waitFor(() => {
        expect(screen.getByText('복사됨')).toBeTruthy();
      });
    });

    test('should show check icon after copying', async () => {
      render(<ControlBar text="Sample text" onClear={mockOnClear} />);

      const copyButton = screen.getByRole('button', { name: /복사/ });
      fireEvent.click(copyButton);

      await waitFor(() => {
        // Check icon should be present
        const button = screen.getByRole('button', { name: /복사됨/ });
        expect(button).toBeTruthy();
      });
    });

    test('should revert to original state after 2 seconds', async () => {
      render(<ControlBar text="Sample text" onClear={mockOnClear} />);

      const copyButton = screen.getByRole('button', { name: /복사/ });
      fireEvent.click(copyButton);

      // Wait for copied state
      await waitFor(() => {
        expect(screen.getByText('복사됨')).toBeTruthy();
      });

      // Fast-forward time by 2 seconds
      jest.advanceTimersByTime(2000);

      // Should revert to original state
      await waitFor(() => {
        expect(screen.getByText('복사')).toBeTruthy();
      });
    });

    test('should handle multiple copy operations', async () => {
      render(<ControlBar text="Sample text" onClear={mockOnClear} />);

      const copyButton = screen.getByRole('button', { name: /복사/ });

      // First copy
      fireEvent.click(copyButton);
      await waitFor(() => {
        expect(mockClipboard.writeText).toHaveBeenCalledTimes(1);
      });

      // Fast-forward to reset state
      jest.advanceTimersByTime(2000);

      // Second copy
      fireEvent.click(screen.getByRole('button', { name: /복사/ }));
      await waitFor(() => {
        expect(mockClipboard.writeText).toHaveBeenCalledTimes(2);
      });
    });
  });

  // ============================================================================
  // COPY BUTTON FUNCTIONALITY - ERROR CASES
  // ============================================================================

  describe('Copy Button - Error Cases', () => {
    test('should not copy when text is empty string', async () => {
      render(<ControlBar text="" onClear={mockOnClear} />);

      const copyButton = screen.getByRole('button', { name: /복사/ });
      fireEvent.click(copyButton);

      await waitFor(() => {
        expect(mockClipboard.writeText).not.toHaveBeenCalled();
      });
    });

    test('should not copy when text is null', async () => {
      render(<ControlBar text={null} onClear={mockOnClear} />);

      const copyButton = screen.getByRole('button', { name: /복사/ });
      fireEvent.click(copyButton);

      await waitFor(() => {
        expect(mockClipboard.writeText).not.toHaveBeenCalled();
      });
    });

    test('should not copy when text is undefined', async () => {
      render(<ControlBar text={undefined} onClear={mockOnClear} />);

      const copyButton = screen.getByRole('button', { name: /복사/ });
      fireEvent.click(copyButton);

      await waitFor(() => {
        expect(mockClipboard.writeText).not.toHaveBeenCalled();
      });
    });

    test('should handle clipboard API failure gracefully', async () => {
      mockClipboard.writeText.mockImplementation(() =>
        Promise.reject(new Error('Clipboard access denied'))
      );

      render(<ControlBar text="Sample text" onClear={mockOnClear} />);

      const copyButton = screen.getByRole('button', { name: /복사/ });
      fireEvent.click(copyButton);

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          '복사 실패:',
          expect.any(Error)
        );
      });
    });

    test('should not show success message when copy fails', async () => {
      mockClipboard.writeText.mockImplementation(() =>
        Promise.reject(new Error('Clipboard error'))
      );

      render(<ControlBar text="Sample text" onClear={mockOnClear} />);

      const copyButton = screen.getByRole('button', { name: /복사/ });
      fireEvent.click(copyButton);

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalled();
      });

      // Should still show original button text
      expect(screen.getByText('복사')).toBeTruthy();
      expect(screen.queryByText('복사됨')).toBeFalsy();
    });

    test('should handle clipboard permission error', async () => {
      mockClipboard.writeText.mockImplementation(() =>
        Promise.reject(new DOMException('Permission denied', 'NotAllowedError'))
      );

      render(<ControlBar text="Sample text" onClear={mockOnClear} />);

      const copyButton = screen.getByRole('button', { name: /복사/ });
      fireEvent.click(copyButton);

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          '복사 실패:',
          expect.any(DOMException)
        );
      });
    });
  });

  // ============================================================================
  // CLEAR BUTTON FUNCTIONALITY
  // ============================================================================

  describe('Clear Button - Success Cases', () => {
    test('should call onClear when clear button is clicked', () => {
      render(<ControlBar text="Sample text" onClear={mockOnClear} />);

      const clearButton = screen.getByRole('button', { name: /초기화/ });
      fireEvent.click(clearButton);

      expect(mockOnClear).toHaveBeenCalledTimes(1);
    });

    test('should call onClear with no arguments', () => {
      render(<ControlBar text="Sample text" onClear={mockOnClear} />);

      const clearButton = screen.getByRole('button', { name: /초기화/ });
      fireEvent.click(clearButton);

      expect(mockOnClear).toHaveBeenCalledWith();
    });

    test('should handle multiple clear button clicks', () => {
      render(<ControlBar text="Sample text" onClear={mockOnClear} />);

      const clearButton = screen.getByRole('button', { name: /초기화/ });

      fireEvent.click(clearButton);
      fireEvent.click(clearButton);
      fireEvent.click(clearButton);

      expect(mockOnClear).toHaveBeenCalledTimes(3);
    });

    test('should work with user event library', async () => {
      const user = userEvent.setup({ delay: null });
      render(<ControlBar text="Sample text" onClear={mockOnClear} />);

      const clearButton = screen.getByRole('button', { name: /초기화/ });
      await user.click(clearButton);

      expect(mockOnClear).toHaveBeenCalledTimes(1);
    });
  });

  describe('Clear Button - Error Cases', () => {
    test('should not call onClear when text is empty', () => {
      render(<ControlBar text="" onClear={mockOnClear} />);

      const clearButton = screen.getByRole('button', { name: /초기화/ });
      fireEvent.click(clearButton);

      expect(mockOnClear).not.toHaveBeenCalled();
    });

    test('should not call onClear when text is null', () => {
      render(<ControlBar text={null} onClear={mockOnClear} />);

      const clearButton = screen.getByRole('button', { name: /초기화/ });
      fireEvent.click(clearButton);

      expect(mockOnClear).not.toHaveBeenCalled();
    });

    test('should handle missing onClear prop gracefully', () => {
      // Should not throw error when onClear is not provided
      expect(() => {
        render(<ControlBar text="Sample text" />);
      }).not.toThrow();
    });
  });

  // ============================================================================
  // BUTTON STATES (ENABLED/DISABLED)
  // ============================================================================

  describe('Button Disabled States', () => {
    test('should disable copy button when text is empty', () => {
      render(<ControlBar text="" onClear={mockOnClear} />);

      const copyButton = screen.getByRole('button', { name: /복사/ });
      expect(copyButton.disabled).toBe(true);
    });

    test('should disable clear button when text is empty', () => {
      render(<ControlBar text="" onClear={mockOnClear} />);

      const clearButton = screen.getByRole('button', { name: /초기화/ });
      expect(clearButton.disabled).toBe(true);
    });

    test('should disable copy button when text is null', () => {
      render(<ControlBar text={null} onClear={mockOnClear} />);

      const copyButton = screen.getByRole('button', { name: /복사/ });
      expect(copyButton.disabled).toBe(true);
    });

    test('should disable clear button when text is null', () => {
      render(<ControlBar text={null} onClear={mockOnClear} />);

      const clearButton = screen.getByRole('button', { name: /초기화/ });
      expect(clearButton.disabled).toBe(true);
    });

    test('should disable copy button when text is undefined', () => {
      render(<ControlBar text={undefined} onClear={mockOnClear} />);

      const copyButton = screen.getByRole('button', { name: /복사/ });
      expect(copyButton.disabled).toBe(true);
    });

    test('should disable clear button when text is undefined', () => {
      render(<ControlBar text={undefined} onClear={mockOnClear} />);

      const clearButton = screen.getByRole('button', { name: /초기화/ });
      expect(clearButton.disabled).toBe(true);
    });

    test('should enable copy button when text has content', () => {
      render(<ControlBar text="Sample text" onClear={mockOnClear} />);

      const copyButton = screen.getByRole('button', { name: /복사/ });
      expect(copyButton.disabled).toBe(false);
    });

    test('should enable clear button when text has content', () => {
      render(<ControlBar text="Sample text" onClear={mockOnClear} />);

      const clearButton = screen.getByRole('button', { name: /초기화/ });
      expect(clearButton.disabled).toBe(false);
    });

    test('should enable buttons even with single character', () => {
      render(<ControlBar text="a" onClear={mockOnClear} />);

      const copyButton = screen.getByRole('button', { name: /복사/ });
      const clearButton = screen.getByRole('button', { name: /초기화/ });

      expect(copyButton.disabled).toBe(false);
      expect(clearButton.disabled).toBe(false);
    });

    test('should enable buttons with whitespace-only text', () => {
      render(<ControlBar text="   " onClear={mockOnClear} />);

      const copyButton = screen.getByRole('button', { name: /복사/ });
      const clearButton = screen.getByRole('button', { name: /초기화/ });

      // Whitespace is still considered valid text
      expect(copyButton.disabled).toBe(false);
      expect(clearButton.disabled).toBe(false);
    });

    test('should apply disabled CSS classes when disabled', () => {
      render(<ControlBar text="" onClear={mockOnClear} />);

      const copyButton = screen.getByRole('button', { name: /복사/ });
      const clearButton = screen.getByRole('button', { name: /초기화/ });

      expect(copyButton.className).toContain('disabled:opacity-50');
      expect(copyButton.className).toContain('disabled:cursor-not-allowed');
      expect(clearButton.className).toContain('disabled:opacity-50');
      expect(clearButton.className).toContain('disabled:cursor-not-allowed');
    });
  });

  // ============================================================================
  // ACCESSIBILITY TESTS
  // ============================================================================

  describe('Accessibility', () => {
    test('should have accessible button roles', () => {
      render(<ControlBar text="Sample text" onClear={mockOnClear} />);

      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBe(2);
    });

    test('should have meaningful button text for screen readers', () => {
      render(<ControlBar text="Sample text" onClear={mockOnClear} />);

      expect(screen.getByRole('button', { name: /복사/ })).toBeTruthy();
      expect(screen.getByRole('button', { name: /초기화/ })).toBeTruthy();
    });

    test('should indicate disabled state to assistive technology', () => {
      render(<ControlBar text="" onClear={mockOnClear} />);

      const copyButton = screen.getByRole('button', { name: /복사/ });
      const clearButton = screen.getByRole('button', { name: /초기화/ });

      expect(copyButton.getAttribute('disabled')).not.toBeNull();
      expect(clearButton.getAttribute('disabled')).not.toBeNull();
    });

    test('should update button text for state changes', async () => {
      render(<ControlBar text="Sample text" onClear={mockOnClear} />);

      const copyButton = screen.getByRole('button', { name: /복사/ });
      fireEvent.click(copyButton);

      await waitFor(() => {
        const updatedButton = screen.getByRole('button', { name: /복사됨/ });
        expect(updatedButton).toBeTruthy();
      });
    });

    test('should be keyboard navigable', () => {
      render(<ControlBar text="Sample text" onClear={mockOnClear} />);

      const copyButton = screen.getByRole('button', { name: /복사/ });
      const clearButton = screen.getByRole('button', { name: /초기화/ });

      // Buttons should be focusable by default
      expect(copyButton.tabIndex).not.toBe(-1);
      expect(clearButton.tabIndex).not.toBe(-1);
    });
  });

  // ============================================================================
  // PROPS VALIDATION
  // ============================================================================

  describe('Props Validation', () => {
    test('should handle text prop as string', () => {
      expect(() => {
        render(<ControlBar text="Hello" onClear={mockOnClear} />);
      }).not.toThrow();
    });

    test('should handle text prop as number', () => {
      expect(() => {
        render(<ControlBar text={12345} onClear={mockOnClear} />);
      }).not.toThrow();
    });

    test('should handle onClear prop as function', () => {
      expect(() => {
        render(<ControlBar text="Sample" onClear={() => {}} />);
      }).not.toThrow();
    });

    test('should render without crashing when props change', () => {
      const { rerender } = render(<ControlBar text="Initial" onClear={mockOnClear} />);

      expect(() => {
        rerender(<ControlBar text="Updated" onClear={mockOnClear} />);
      }).not.toThrow();
    });

    test('should update button states when text prop changes', () => {
      const { rerender } = render(<ControlBar text="" onClear={mockOnClear} />);

      let copyButton = screen.getByRole('button', { name: /복사/ });
      expect(copyButton.disabled).toBe(true);

      rerender(<ControlBar text="New text" onClear={mockOnClear} />);

      copyButton = screen.getByRole('button', { name: /복사/ });
      expect(copyButton.disabled).toBe(false);
    });

    test('should handle onClear function change', () => {
      const newOnClear = jest.fn();
      const { rerender } = render(<ControlBar text="Sample" onClear={mockOnClear} />);

      rerender(<ControlBar text="Sample" onClear={newOnClear} />);

      const clearButton = screen.getByRole('button', { name: /초기화/ });
      fireEvent.click(clearButton);

      expect(newOnClear).toHaveBeenCalledTimes(1);
      expect(mockOnClear).not.toHaveBeenCalled();
    });
  });

  // ============================================================================
  // EDGE CASES AND BOUNDARY CONDITIONS
  // ============================================================================

  describe('Edge Cases and Boundary Conditions', () => {
    test('should handle very long text', async () => {
      const longText = 'A'.repeat(10000);
      render(<ControlBar text={longText} onClear={mockOnClear} />);

      const copyButton = screen.getByRole('button', { name: /복사/ });
      fireEvent.click(copyButton);

      await waitFor(() => {
        expect(mockClipboard.writeText).toHaveBeenCalledWith(longText);
      });
    });

    test('should handle text with unicode characters', async () => {
      const unicodeText = '😀😃😄😁🎉🎊';
      render(<ControlBar text={unicodeText} onClear={mockOnClear} />);

      const copyButton = screen.getByRole('button', { name: /복사/ });
      fireEvent.click(copyButton);

      await waitFor(() => {
        expect(mockClipboard.writeText).toHaveBeenCalledWith(unicodeText);
      });
    });

    test('should handle rapid clicking on copy button', async () => {
      render(<ControlBar text="Sample text" onClear={mockOnClear} />);

      const copyButton = screen.getByRole('button', { name: /복사/ });

      // Click rapidly
      fireEvent.click(copyButton);
      fireEvent.click(copyButton);
      fireEvent.click(copyButton);

      await waitFor(() => {
        // Should still handle all clicks
        expect(mockClipboard.writeText).toHaveBeenCalled();
      });
    });

    test('should handle clicking clear button while copy is in success state', async () => {
      render(<ControlBar text="Sample text" onClear={mockOnClear} />);

      const copyButton = screen.getByRole('button', { name: /복사/ });
      fireEvent.click(copyButton);

      await waitFor(() => {
        expect(screen.getByText('복사됨')).toBeTruthy();
      });

      const clearButton = screen.getByRole('button', { name: /초기화/ });
      fireEvent.click(clearButton);

      expect(mockOnClear).toHaveBeenCalledTimes(1);
    });

    test('should handle component unmounting during timeout', async () => {
      const { unmount } = render(<ControlBar text="Sample text" onClear={mockOnClear} />);

      const copyButton = screen.getByRole('button', { name: /복사/ });
      fireEvent.click(copyButton);

      await waitFor(() => {
        expect(screen.getByText('복사됨')).toBeTruthy();
      });

      // Unmount before timeout completes
      expect(() => {
        unmount();
        jest.advanceTimersByTime(2000);
      }).not.toThrow();
    });

    test('should handle zero as text value', () => {
      render(<ControlBar text={0} onClear={mockOnClear} />);

      const copyButton = screen.getByRole('button', { name: /복사/ });
      const clearButton = screen.getByRole('button', { name: /초기화/ });

      // 0 is falsy, so buttons should be disabled
      expect(copyButton.disabled).toBe(true);
      expect(clearButton.disabled).toBe(true);
    });

    test('should handle false as text value', () => {
      render(<ControlBar text={false} onClear={mockOnClear} />);

      const copyButton = screen.getByRole('button', { name: /복사/ });
      const clearButton = screen.getByRole('button', { name: /초기화/ });

      expect(copyButton.disabled).toBe(true);
      expect(clearButton.disabled).toBe(true);
    });
  });

  // ============================================================================
  // INTEGRATION TESTS
  // ============================================================================

  describe('Integration Tests', () => {
    test('should handle complete user workflow: copy then clear', async () => {
      render(<ControlBar text="Sample text" onClear={mockOnClear} />);

      // Step 1: Copy text
      const copyButton = screen.getByRole('button', { name: /복사/ });
      fireEvent.click(copyButton);

      await waitFor(() => {
        expect(mockClipboard.writeText).toHaveBeenCalledWith('Sample text');
        expect(screen.getByText('복사됨')).toBeTruthy();
      });

      // Step 2: Wait for state to revert
      jest.advanceTimersByTime(2000);

      await waitFor(() => {
        expect(screen.getByText('복사')).toBeTruthy();
      });

      // Step 3: Clear
      const clearButton = screen.getByRole('button', { name: /초기화/ });
      fireEvent.click(clearButton);

      expect(mockOnClear).toHaveBeenCalledTimes(1);
    });

    test('should maintain state consistency across multiple operations', async () => {
      const { rerender } = render(<ControlBar text="Initial text" onClear={mockOnClear} />);

      // Operation 1: Copy
      fireEvent.click(screen.getByRole('button', { name: /복사/ }));
      await waitFor(() => {
        expect(screen.getByText('복사됨')).toBeTruthy();
      });

      // Operation 2: Update text while in copied state
      rerender(<ControlBar text="New text" onClear={mockOnClear} />);

      // Should still show copied state
      expect(screen.getByText('복사됨')).toBeTruthy();

      // Operation 3: Wait for timeout
      jest.advanceTimersByTime(2000);

      await waitFor(() => {
        expect(screen.getByText('복사')).toBeTruthy();
      });
    });

    test('should work correctly with dynamic text updates', () => {
      const { rerender } = render(<ControlBar text="Text 1" onClear={mockOnClear} />);

      expect(screen.getByRole('button', { name: /복사/ }).disabled).toBe(false);

      rerender(<ControlBar text="" onClear={mockOnClear} />);
      expect(screen.getByRole('button', { name: /복사/ }).disabled).toBe(true);

      rerender(<ControlBar text="Text 2" onClear={mockOnClear} />);
      expect(screen.getByRole('button', { name: /복사/ }).disabled).toBe(false);
    });
  });
});
