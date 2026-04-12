'use client';

import { useMemo, useState } from 'react';
import {
  computeSearch,
  type SearchMode,
  type SearchResult,
} from '@/components/json/jsonSearch';

export interface JsonSearchState {
  query: string;
  mode: SearchMode;
  result: SearchResult;
  setQuery: (query: string) => void;
  setMode: (mode: SearchMode) => void;
}

export function useJsonSearch(value: unknown): JsonSearchState {
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState<SearchMode>('all');

  const result = useMemo(
    () => computeSearch(value, { query, mode }),
    [value, query, mode],
  );

  return { query, mode, result, setQuery, setMode };
}
