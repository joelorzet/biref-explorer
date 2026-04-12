'use client';

import { useEffect, useState } from 'react';

const REPO = 'joelorzet/biref-db-scanner';
const CACHE_KEY = 'biref-gh-stars';
const CACHE_TTL = 1000 * 60 * 30;

interface CachedStars {
  count: number;
  ts: number;
}

export function useGithubStars(): number | null {
  const [stars, setStars] = useState<number | null>(() => {
    if (typeof window === 'undefined') {
      return null;
    }
    try {
      const raw = sessionStorage.getItem(CACHE_KEY);
      if (!raw) {
        return null;
      }
      const cached: CachedStars = JSON.parse(raw);
      if (Date.now() - cached.ts < CACHE_TTL) {
        return cached.count;
      }
    } catch {}
    return null;
  });

  useEffect(() => {
    if (stars !== null) {
      return;
    }
    const controller = new AbortController();
    fetch(`https://api.github.com/repos/${REPO}`, {
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((data) => {
        const count = data?.stargazers_count;
        if (typeof count === 'number') {
          setStars(count);
          sessionStorage.setItem(
            CACHE_KEY,
            JSON.stringify({ count, ts: Date.now() }),
          );
        }
      })
      .catch(() => {});
    return () => controller.abort();
  }, [stars]);

  return stars;
}
