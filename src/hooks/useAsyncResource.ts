'use client';

import { useEffect, useRef, useState } from 'react';

export interface AsyncResourceState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

/**
 * Fire an async loader when a key changes, with loading/error state
 * and cancellation on unmount / key change. Use for "fetch once per
 * dependency" cases like codegen output or single-record reads.
 *
 * The `load` callback is captured in a ref so callers can pass an
 * inline arrow without triggering a re-fetch loop. Only `key` is
 * observed as a dependency.
 */
export function useAsyncResource<T, K>(
  key: K,
  load: (key: K) => Promise<T>,
): AsyncResourceState<T> {
  const [state, setState] = useState<AsyncResourceState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const loadRef = useRef(load);
  loadRef.current = load;

  useEffect(() => {
    let cancelled = false;
    setState({ data: null, loading: true, error: null });
    loadRef
      .current(key)
      .then((data) => {
        if (!cancelled) {
          setState({ data, loading: false, error: null });
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setState({
            data: null,
            loading: false,
            error: (err as Error).message,
          });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [key]);

  return state;
}
