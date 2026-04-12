'use client';

import { useEffect, useRef } from 'react';

/**
 * Fires a callback on Enter when focus is on the body or some other
 * non-interactive wrapper. Native Enter handling already covers
 * inputs, selects, buttons, and textareas (which can opt in via
 * their own keydown), so we deliberately skip those.
 *
 * Internally uses a ref so the latest callback closure is always
 * used without re-binding the window listener on every render.
 */
export function useGlobalEnter(
  onEnter: () => void,
  enabled: boolean = true,
): void {
  const handlerRef = useRef(onEnter);
  handlerRef.current = onEnter;

  useEffect(() => {
    if (!enabled) {
      return;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Enter' || e.shiftKey || e.metaKey || e.ctrlKey) {
        return;
      }
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName;
      if (
        tag === 'INPUT' ||
        tag === 'TEXTAREA' ||
        tag === 'SELECT' ||
        tag === 'BUTTON'
      ) {
        return;
      }
      e.preventDefault();
      handlerRef.current();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [enabled]);
}
