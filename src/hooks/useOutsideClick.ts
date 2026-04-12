'use client';

import { type RefObject, useEffect, useRef } from 'react';

/**
 * Fires `handler` when a pointer event lands outside the referenced
 * element. Null-safe: if the ref hasn't been attached yet the handler
 * just no-ops. Skips while `active` is false so popovers can trivially
 * opt out when closed.
 */
export function useOutsideClick<T extends HTMLElement>(
  active: boolean,
  handler: () => void,
): RefObject<T> {
  const ref = useRef<T>(null);
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    if (!active) {
      return;
    }
    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (!ref.current || !target) {
        return;
      }
      if (!ref.current.contains(target)) {
        handlerRef.current();
      }
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [active]);

  return ref;
}
