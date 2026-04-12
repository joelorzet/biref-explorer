'use client';

import { useMemo, useState } from 'react';

/**
 * Debounce-free text filter with a memoized projection. Give it a
 * source list and a getter that returns the text to match against,
 * and it returns the query state plus the filtered list.
 */
export function useTextFilter<T>(
  items: readonly T[],
  getText: (item: T) => string,
): {
  query: string;
  setQuery: (query: string) => void;
  filtered: readonly T[];
} {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) {
      return items;
    }
    return items.filter((item) => getText(item).toLowerCase().includes(needle));
  }, [items, query, getText]);

  return { query, setQuery, filtered };
}
