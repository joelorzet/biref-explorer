'use client';

import { type RefObject, useEffect, useState } from 'react';

/**
 * Track a target element's viewport rectangle while `active` is true.
 * Re-measures on scroll (capture phase so nested scroll containers
 * count), on window resize, and via requestAnimationFrame whenever the
 * dependency toggles. Returns null when inactive so callers can gate
 * rendering on the presence of a rect.
 */
export function useAnchoredRect<T extends Element>(
  ref: RefObject<T>,
  active: boolean,
): DOMRect | null {
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (!active) {
      setRect(null);
      return;
    }
    const measure = () => {
      const node = ref.current;
      if (node) {
        setRect(node.getBoundingClientRect());
      }
    };
    measure();
    window.addEventListener('scroll', measure, true);
    window.addEventListener('resize', measure);
    return () => {
      window.removeEventListener('scroll', measure, true);
      window.removeEventListener('resize', measure);
    };
  }, [ref, active]);

  return rect;
}
