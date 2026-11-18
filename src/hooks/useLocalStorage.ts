import { useEffect, useState } from 'react';

const PREFIX = 'akhoon-traders:v1:';

/** Reads a stored value. Falls back safely if storage is blocked or the JSON is broken. */
export function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function clearStorage(keys: string[]): void {
  try {
    keys.forEach((k) => window.localStorage.removeItem(PREFIX + k));
  } catch {
    /* storage unavailable — nothing to clear */
  }
}

/**
 * useState that persists to localStorage. This stands in for a backend:
 * swap the reads/writes in StoreContext for API calls when the server is ready.
 */
export function useLocalStorage<T>(key: string, initial: T | (() => T)) {
  const [value, setValue] = useState<T>(() => {
    const fallback = typeof initial === 'function' ? (initial as () => T)() : initial;
    return readStorage(key, fallback);
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
    } catch {
      /* quota exceeded or storage blocked — keep working in memory */
    }
  }, [key, value]);

  return [value, setValue] as const;
}
