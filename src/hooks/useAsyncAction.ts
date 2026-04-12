'use client';

import { useCallback, useState } from 'react';

export interface AsyncActionState<T> {
  result: T | null;
  running: boolean;
  error: string | null;
}

/**
 * Generic wrapper for a user-triggered async action: tracks running,
 * result, and error state, and exposes a single `run` trigger that
 * accepts a task factory. Callers can thread the task through any
 * decorator (e.g. notify.promise) before handing it back.
 */
export function useAsyncAction<T>() {
  const [state, setState] = useState<AsyncActionState<T>>({
    result: null,
    running: false,
    error: null,
  });

  const run = useCallback(async (task: () => Promise<T>): Promise<T | null> => {
    setState({ result: null, running: true, error: null });
    try {
      const value = await task();
      setState({ result: value, running: false, error: null });
      return value;
    } catch (err) {
      setState({
        result: null,
        running: false,
        error: (err as Error).message,
      });
      return null;
    }
  }, []);

  const reset = useCallback(
    () => setState({ result: null, running: false, error: null }),
    [],
  );

  return { ...state, run, reset };
}
