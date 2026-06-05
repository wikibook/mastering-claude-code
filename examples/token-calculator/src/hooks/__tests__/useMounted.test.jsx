import { renderHook } from '@testing-library/react';
import { useMounted } from '../useMounted.jsx';

describe('useMounted', () => {
  it('should return false initially and true after mount', () => {
    const { result } = renderHook(() => useMounted());

    // After the hook renders and effects run, mounted should be true
    expect(result.current).toBe(true);
  });

  it('should maintain true value across re-renders', () => {
    const { result, rerender } = renderHook(() => useMounted());

    expect(result.current).toBe(true);

    // Re-render the hook
    rerender();

    expect(result.current).toBe(true);
  });
});
