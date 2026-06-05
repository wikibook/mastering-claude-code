import { useState, useEffect } from 'react';

/**
 * 컴포넌트 마운트 상태를 추적하는 커스텀 훅
 * 초기 렌더링 애니메이션을 위해 사용
 * @returns {boolean} 마운트 여부
 */
export function useMounted() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}
