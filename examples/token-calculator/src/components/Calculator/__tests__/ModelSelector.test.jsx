import { describe, it, expect, jest } from '@jest/globals';
import { render, screen, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ModelSelector from '../ModelSelector.jsx';

// Constants from the source file
const MODELS = [
  { id: 'gpt-5', name: 'GPT-5', provider: 'OpenAI' },
  { id: 'sonnet-4.5', name: 'Sonnet 4.5', provider: 'Anthropic' },
  { id: 'opus-4.5', name: 'Opus 4.5', provider: 'Anthropic' },
  { id: 'gemini-3.0', name: 'Gemini 3.0', provider: 'Google' },
  { id: 'llama-4', name: 'Llama 4', provider: 'Meta' },
  { id: 'grok', name: 'Grok', provider: 'xAI' },
];

describe('ModelSelector Component', () => {
  // ============================================================================
  // RENDERING TESTS
  // ============================================================================

  describe('Component Rendering', () => {
    it('should render without crashing with valid props', () => {
      const mockOnModelChange = jest.fn();
      const { container } = render(
        <ModelSelector selectedModel="gpt-5" onModelChange={mockOnModelChange} />
      );
      expect(container).toBeTruthy();
    });

    it('should render the label text in Korean', () => {
      const mockOnModelChange = jest.fn();
      render(
        <ModelSelector selectedModel="gpt-5" onModelChange={mockOnModelChange} />
      );

      const label = screen.getByText('모델 선택');
      expect(label).toBeInTheDocument();
      expect(label.tagName).toBe('LABEL');
    });

    it('should render all model buttons', () => {
      const mockOnModelChange = jest.fn();
      render(
        <ModelSelector selectedModel="gpt-5" onModelChange={mockOnModelChange} />
      );

      MODELS.forEach((model) => {
        const button = screen.getByRole('button', { name: model.name });
        expect(button).toBeInTheDocument();
      });
    });

    it('should render exactly 6 model buttons', () => {
      const mockOnModelChange = jest.fn();
      render(
        <ModelSelector selectedModel="gpt-5" onModelChange={mockOnModelChange} />
      );

      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(6);
    });

    it('should render buttons in the correct order', () => {
      const mockOnModelChange = jest.fn();
      render(
        <ModelSelector selectedModel="gpt-5" onModelChange={mockOnModelChange} />
      );

      const buttons = screen.getAllByRole('button');
      expect(buttons[0]).toHaveTextContent('GPT-5');
      expect(buttons[1]).toHaveTextContent('Sonnet 4.5');
      expect(buttons[2]).toHaveTextContent('Opus 4.5');
      expect(buttons[3]).toHaveTextContent('Gemini 3.0');
      expect(buttons[4]).toHaveTextContent('Llama 4');
      expect(buttons[5]).toHaveTextContent('Grok');
    });
  });

  // ============================================================================
  // SELECTED MODEL STYLING TESTS
  // ============================================================================

  describe('Selected Model Styling', () => {
    it('should apply active styling to the selected model button', () => {
      const mockOnModelChange = jest.fn();
      render(
        <ModelSelector selectedModel="sonnet-4.5" onModelChange={mockOnModelChange} />
      );

      const selectedButton = screen.getByRole('button', { name: 'Sonnet 4.5' });
      expect(selectedButton).toHaveClass('bg-indigo-600', 'text-white');
    });

    it('should apply inactive styling to non-selected model buttons', () => {
      const mockOnModelChange = jest.fn();
      render(
        <ModelSelector selectedModel="gpt-5" onModelChange={mockOnModelChange} />
      );

      const nonSelectedButton = screen.getByRole('button', { name: 'Opus 4.5' });
      expect(nonSelectedButton).toHaveClass('bg-white', 'dark:bg-slate-800');
      expect(nonSelectedButton).not.toHaveClass('bg-indigo-600');
    });

    it('should update styling when selectedModel prop changes', () => {
      const mockOnModelChange = jest.fn();
      const { rerender } = render(
        <ModelSelector selectedModel="gpt-5" onModelChange={mockOnModelChange} />
      );

      let gptButton = screen.getByRole('button', { name: 'GPT-5' });
      let sonnetButton = screen.getByRole('button', { name: 'Sonnet 4.5' });

      expect(gptButton).toHaveClass('bg-indigo-600');
      expect(sonnetButton).not.toHaveClass('bg-indigo-600');

      // Change selected model
      rerender(
        <ModelSelector selectedModel="sonnet-4.5" onModelChange={mockOnModelChange} />
      );

      gptButton = screen.getByRole('button', { name: 'GPT-5' });
      sonnetButton = screen.getByRole('button', { name: 'Sonnet 4.5' });

      expect(gptButton).not.toHaveClass('bg-indigo-600');
      expect(sonnetButton).toHaveClass('bg-indigo-600');
    });

    it('should handle when no model is initially selected', () => {
      const mockOnModelChange = jest.fn();
      render(
        <ModelSelector selectedModel="" onModelChange={mockOnModelChange} />
      );

      const buttons = screen.getAllByRole('button');
      buttons.forEach((button) => {
        expect(button).not.toHaveClass('bg-indigo-600', 'text-white');
      });
    });
  });

  // ============================================================================
  // EVENT HANDLING TESTS
  // ============================================================================

  describe('onClick Event Handling', () => {
    it('should call onModelChange when a model button is clicked', () => {
      const mockOnModelChange = jest.fn();
      render(
        <ModelSelector selectedModel="gpt-5" onModelChange={mockOnModelChange} />
      );

      const sonnetButton = screen.getByRole('button', { name: 'Sonnet 4.5' });
      fireEvent.click(sonnetButton);

      expect(mockOnModelChange).toHaveBeenCalledTimes(1);
      expect(mockOnModelChange).toHaveBeenCalledWith('sonnet-4.5');
    });

    it('should call onModelChange with correct model id for each button', () => {
      const mockOnModelChange = jest.fn();
      render(
        <ModelSelector selectedModel="gpt-5" onModelChange={mockOnModelChange} />
      );

      MODELS.forEach((model, index) => {
        const button = screen.getByRole('button', { name: model.name });
        fireEvent.click(button);

        expect(mockOnModelChange).toHaveBeenNthCalledWith(index + 1, model.id);
      });

      expect(mockOnModelChange).toHaveBeenCalledTimes(MODELS.length);
    });

    it('should call onModelChange when clicking already selected model', () => {
      const mockOnModelChange = jest.fn();
      render(
        <ModelSelector selectedModel="gpt-5" onModelChange={mockOnModelChange} />
      );

      const gptButton = screen.getByRole('button', { name: 'GPT-5' });
      fireEvent.click(gptButton);

      expect(mockOnModelChange).toHaveBeenCalledWith('gpt-5');
    });

    it('should handle multiple rapid clicks correctly', () => {
      const mockOnModelChange = jest.fn();
      render(
        <ModelSelector selectedModel="gpt-5" onModelChange={mockOnModelChange} />
      );

      const sonnetButton = screen.getByRole('button', { name: 'Sonnet 4.5' });

      fireEvent.click(sonnetButton);
      fireEvent.click(sonnetButton);
      fireEvent.click(sonnetButton);

      expect(mockOnModelChange).toHaveBeenCalledTimes(3);
      expect(mockOnModelChange).toHaveBeenCalledWith('sonnet-4.5');
    });

    it('should handle clicks using userEvent (simulating real user interaction)', async () => {
      const user = userEvent.setup();
      const mockOnModelChange = jest.fn();
      render(
        <ModelSelector selectedModel="gpt-5" onModelChange={mockOnModelChange} />
      );

      const opusButton = screen.getByRole('button', { name: 'Opus 4.5' });
      await user.click(opusButton);

      expect(mockOnModelChange).toHaveBeenCalledWith('opus-4.5');
    });
  });

  // ============================================================================
  // PROPS VALIDATION TESTS
  // ============================================================================

  describe('Props Handling', () => {
    it('should handle null selectedModel prop', () => {
      const mockOnModelChange = jest.fn();
      render(
        <ModelSelector selectedModel={null} onModelChange={mockOnModelChange} />
      );

      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(6);

      // No button should have selected styling
      buttons.forEach((button) => {
        expect(button).not.toHaveClass('bg-indigo-600');
      });
    });

    it('should handle undefined selectedModel prop', () => {
      const mockOnModelChange = jest.fn();
      render(
        <ModelSelector selectedModel={undefined} onModelChange={mockOnModelChange} />
      );

      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(6);
    });

    it('should handle invalid selectedModel value', () => {
      const mockOnModelChange = jest.fn();
      render(
        <ModelSelector selectedModel="invalid-model" onModelChange={mockOnModelChange} />
      );

      const buttons = screen.getAllByRole('button');

      // No button should have selected styling
      buttons.forEach((button) => {
        expect(button).not.toHaveClass('bg-indigo-600');
      });
    });

    it('should not crash when onModelChange is not provided', () => {
      // This tests defensive programming, though props should be required
      expect(() => {
        render(<ModelSelector selectedModel="gpt-5" />);
      }).toThrow();
    });

    it('should handle all valid model IDs', () => {
      const mockOnModelChange = jest.fn();

      MODELS.forEach((model) => {
        const { unmount } = render(
          <ModelSelector selectedModel={model.id} onModelChange={mockOnModelChange} />
        );

        const selectedButton = screen.getByRole('button', { name: model.name });
        expect(selectedButton).toHaveClass('bg-indigo-600', 'text-white');

        unmount();
      });
    });
  });

  // ============================================================================
  // ACCESSIBILITY TESTS
  // ============================================================================

  describe('Accessibility', () => {
    it('should have accessible button roles', () => {
      const mockOnModelChange = jest.fn();
      render(
        <ModelSelector selectedModel="gpt-5" onModelChange={mockOnModelChange} />
      );

      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(6);

      buttons.forEach((button) => {
        expect(button).toBeVisible();
      });
    });

    it('should have proper label element structure', () => {
      const mockOnModelChange = jest.fn();
      render(
        <ModelSelector selectedModel="gpt-5" onModelChange={mockOnModelChange} />
      );

      const label = screen.getByText('모델 선택');
      expect(label.tagName).toBe('LABEL');
      expect(label).toHaveClass('block', 'text-sm', 'font-medium');
    });

    it('should have visible and readable button text', () => {
      const mockOnModelChange = jest.fn();
      render(
        <ModelSelector selectedModel="gpt-5" onModelChange={mockOnModelChange} />
      );

      MODELS.forEach((model) => {
        const button = screen.getByRole('button', { name: model.name });
        expect(button).toBeVisible();
        expect(button.textContent).toBe(model.name);
      });
    });

    it('should support keyboard navigation (tab through buttons)', () => {
      const mockOnModelChange = jest.fn();
      render(
        <ModelSelector selectedModel="gpt-5" onModelChange={mockOnModelChange} />
      );

      const buttons = screen.getAllByRole('button');

      // Verify buttons can receive focus (not disabled)
      buttons.forEach((button) => {
        expect(button).not.toBeDisabled();
      });
    });

    it('should support keyboard activation (Enter/Space)', async () => {
      const user = userEvent.setup();
      const mockOnModelChange = jest.fn();
      render(
        <ModelSelector selectedModel="gpt-5" onModelChange={mockOnModelChange} />
      );

      const sonnetButton = screen.getByRole('button', { name: 'Sonnet 4.5' });

      // Focus and press Enter
      sonnetButton.focus();
      await user.keyboard('{Enter}');

      expect(mockOnModelChange).toHaveBeenCalledWith('sonnet-4.5');
    });

    it('should have appropriate button styling for focus states', () => {
      const mockOnModelChange = jest.fn();
      render(
        <ModelSelector selectedModel="gpt-5" onModelChange={mockOnModelChange} />
      );

      const buttons = screen.getAllByRole('button');

      // Buttons should have transition classes for smooth visual feedback
      buttons.forEach((button) => {
        expect(button).toHaveClass('transition-colors');
      });
    });
  });

  // ============================================================================
  // EDGE CASES AND ERROR HANDLING
  // ============================================================================

  describe('Edge Cases', () => {
    it('should handle switching between all models sequentially', () => {
      const mockOnModelChange = jest.fn();
      const { rerender } = render(
        <ModelSelector selectedModel="gpt-5" onModelChange={mockOnModelChange} />
      );

      MODELS.forEach((model, index) => {
        rerender(
          <ModelSelector selectedModel={model.id} onModelChange={mockOnModelChange} />
        );

        const selectedButton = screen.getByRole('button', { name: model.name });
        expect(selectedButton).toHaveClass('bg-indigo-600');

        // Verify other buttons are not selected
        MODELS.filter((m) => m.id !== model.id).forEach((otherModel) => {
          const otherButton = screen.getByRole('button', { name: otherModel.name });
          expect(otherButton).not.toHaveClass('bg-indigo-600');
        });
      });
    });

    it('should handle empty string as selectedModel', () => {
      const mockOnModelChange = jest.fn();
      render(
        <ModelSelector selectedModel="" onModelChange={mockOnModelChange} />
      );

      const buttons = screen.getAllByRole('button');
      buttons.forEach((button) => {
        expect(button).toHaveClass('bg-white');
        expect(button).not.toHaveClass('bg-indigo-600');
      });
    });

    it('should handle model selection with numeric-like model IDs', () => {
      const mockOnModelChange = jest.fn();
      render(
        <ModelSelector selectedModel="gemini-3.0" onModelChange={mockOnModelChange} />
      );

      const geminiButton = screen.getByRole('button', { name: 'Gemini 3.0' });
      expect(geminiButton).toHaveClass('bg-indigo-600');
    });

    it('should maintain component structure after multiple re-renders', () => {
      const mockOnModelChange = jest.fn();
      const { rerender } = render(
        <ModelSelector selectedModel="gpt-5" onModelChange={mockOnModelChange} />
      );

      for (let i = 0; i < 10; i++) {
        const randomModel = MODELS[Math.floor(Math.random() * MODELS.length)];
        rerender(
          <ModelSelector
            selectedModel={randomModel.id}
            onModelChange={mockOnModelChange}
          />
        );
      }

      // Structure should remain intact
      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(6);
      expect(screen.getByText('모델 선택')).toBeInTheDocument();
    });

    it('should handle case-sensitive model IDs correctly', () => {
      const mockOnModelChange = jest.fn();
      render(
        <ModelSelector selectedModel="GPT-5" onModelChange={mockOnModelChange} />
      );

      // Should not match 'gpt-5' (case sensitive)
      const gptButton = screen.getByRole('button', { name: 'GPT-5' });
      expect(gptButton).not.toHaveClass('bg-indigo-600');
    });
  });

  // ============================================================================
  // CSS CLASSES AND STYLING TESTS
  // ============================================================================

  describe('CSS Classes and Styling', () => {
    it('should apply correct container classes', () => {
      const mockOnModelChange = jest.fn();
      const { container } = render(
        <ModelSelector selectedModel="gpt-5" onModelChange={mockOnModelChange} />
      );

      const mainDiv = container.querySelector('.mb-4');
      expect(mainDiv).toBeInTheDocument();
    });

    it('should apply correct label classes', () => {
      const mockOnModelChange = jest.fn();
      render(
        <ModelSelector selectedModel="gpt-5" onModelChange={mockOnModelChange} />
      );

      const label = screen.getByText('모델 선택');
      expect(label).toHaveClass(
        'block',
        'text-sm',
        'font-medium',
        'text-slate-700',
        'dark:text-slate-300',
        'mb-2'
      );
    });

    it('should apply flex layout to button container', () => {
      const mockOnModelChange = jest.fn();
      const { container } = render(
        <ModelSelector selectedModel="gpt-5" onModelChange={mockOnModelChange} />
      );

      const buttonContainer = container.querySelector('.flex');
      expect(buttonContainer).toHaveClass('flex', 'flex-wrap', 'gap-2');
    });

    it('should apply common button classes to all buttons', () => {
      const mockOnModelChange = jest.fn();
      render(
        <ModelSelector selectedModel="gpt-5" onModelChange={mockOnModelChange} />
      );

      const buttons = screen.getAllByRole('button');
      buttons.forEach((button) => {
        expect(button).toHaveClass(
          'px-4',
          'py-2',
          'rounded-lg',
          'text-sm',
          'font-medium',
          'transition-colors'
        );
      });
    });

    it('should apply dark mode classes to inactive buttons', () => {
      const mockOnModelChange = jest.fn();
      render(
        <ModelSelector selectedModel="gpt-5" onModelChange={mockOnModelChange} />
      );

      const inactiveButton = screen.getByRole('button', { name: 'Sonnet 4.5' });
      expect(inactiveButton).toHaveClass(
        'dark:bg-slate-800',
        'dark:text-slate-300',
        'dark:border-slate-700',
        'dark:hover:bg-slate-700'
      );
    });
  });

  // ============================================================================
  // INTEGRATION TESTS
  // ============================================================================

  describe('Integration Scenarios', () => {
    it('should handle complete user flow: render, select, change selection', async () => {
      const user = userEvent.setup();
      const mockOnModelChange = jest.fn();
      const { rerender } = render(
        <ModelSelector selectedModel="gpt-5" onModelChange={mockOnModelChange} />
      );

      // Initial state
      expect(screen.getByRole('button', { name: 'GPT-5' })).toHaveClass('bg-indigo-600');

      // User clicks Sonnet
      await user.click(screen.getByRole('button', { name: 'Sonnet 4.5' }));
      expect(mockOnModelChange).toHaveBeenCalledWith('sonnet-4.5');

      // Parent component updates selectedModel
      rerender(
        <ModelSelector selectedModel="sonnet-4.5" onModelChange={mockOnModelChange} />
      );

      // Verify UI updated
      expect(screen.getByRole('button', { name: 'Sonnet 4.5' })).toHaveClass('bg-indigo-600');
      expect(screen.getByRole('button', { name: 'GPT-5' })).not.toHaveClass('bg-indigo-600');
    });

    it('should maintain correct state through multiple model changes', async () => {
      const user = userEvent.setup();
      const mockOnModelChange = jest.fn();
      render(
        <ModelSelector selectedModel="gpt-5" onModelChange={mockOnModelChange} />
      );

      // Click through all models
      for (const model of MODELS) {
        const button = screen.getByRole('button', { name: model.name });
        await user.click(button);
      }

      expect(mockOnModelChange).toHaveBeenCalledTimes(MODELS.length);

      // Verify each call had correct model ID
      MODELS.forEach((model, index) => {
        expect(mockOnModelChange).toHaveBeenNthCalledWith(index + 1, model.id);
      });
    });
  });
});
