import { useEffect, useState } from 'react';

// her harfte api isteği gitmemesi için
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // eski sayacı iptal et
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}