'use client';

import { useCallback, useState } from 'react';

/**
 * Small set-backed toggle state. Useful for collapsed groups, active
 * selections, multi-picks. Anywhere you want a "has" check and a
 * toggle without rewriting the boilerplate each time.
 */
export function useToggleSet<T>(initial: Iterable<T> = []) {
  const [set, setSet] = useState<Set<T>>(() => new Set(initial));

  const has = useCallback((value: T) => set.has(value), [set]);

  const toggle = useCallback((value: T) => {
    setSet((prev) => {
      const next = new Set(prev);
      if (next.has(value)) {
        next.delete(value);
      } else {
        next.add(value);
      }
      return next;
    });
  }, []);

  const add = useCallback((value: T) => {
    setSet((prev) => {
      if (prev.has(value)) {
        return prev;
      }
      const next = new Set(prev);
      next.add(value);
      return next;
    });
  }, []);

  const remove = useCallback((value: T) => {
    setSet((prev) => {
      if (!prev.has(value)) {
        return prev;
      }
      const next = new Set(prev);
      next.delete(value);
      return next;
    });
  }, []);

  const clear = useCallback(() => setSet(new Set()), []);

  return { set, has, toggle, add, remove, clear };
}
