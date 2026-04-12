'use client';

import { useCallback } from 'react';

/**
 * Standard append / update-at / remove-at / extend helpers over a
 * controlled array state. The caller owns the array and the setter
 * (so external state can still replace the whole thing); this hook
 * just gives back stable action functions instead of reinventing
 * them in every list component.
 */
export function useArrayState<T>(
  values: readonly T[],
  onChange: (next: T[]) => void,
) {
  const append = useCallback(
    (item: T) => onChange([...values, item]),
    [values, onChange],
  );
  const extend = useCallback(
    (items: readonly T[]) => {
      if (items.length === 0) {
        return;
      }
      onChange([...values, ...items]);
    },
    [values, onChange],
  );
  const updateAt = useCallback(
    (index: number, next: T) =>
      onChange(values.map((item, i) => (i === index ? next : item))),
    [values, onChange],
  );
  const removeAt = useCallback(
    (index: number) => onChange(values.filter((_, i) => i !== index)),
    [values, onChange],
  );
  const clear = useCallback(() => onChange([]), [onChange]);

  return { append, extend, updateAt, removeAt, clear };
}
