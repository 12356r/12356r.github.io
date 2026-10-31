import { useCallback, useEffect, useState } from 'react';

export type ThemeChoice = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'zzu-explorer:theme';

function readChoice(): ThemeChoice {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === 'light' || raw === 'dark' || raw === 'system') return raw;
  } catch {
    /* 忽略 */
  }
  return 'system';
}

export function resolveTheme(choice: ThemeChoice): 'light' | 'dark' {
  if (choice !== 'system') return choice;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/** 主题：light / dark / system，写入 localStorage，并同步 <html data-theme>。 */
export function useTheme() {
  const [choice, setChoice] = useState<ThemeChoice>(() =>
    typeof window === 'undefined' ? 'light' : readChoice(),
  );
  const [resolved, setResolved] = useState<'light' | 'dark'>(() =>
    typeof window === 'undefined' ? 'light' : resolveTheme(readChoice()),
  );

  useEffect(() => {
    const next = resolveTheme(choice);
    setResolved(next);
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(STORAGE_KEY, choice);
    } catch {
      /* 忽略 */
    }

    if (choice !== 'system') return;
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => {
      const v = mql.matches ? 'dark' : 'light';
      setResolved(v);
      document.documentElement.dataset.theme = v;
    };
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [choice]);

  const toggle = useCallback(() => {
    setChoice((prev) => (resolveTheme(prev) === 'dark' ? 'light' : 'dark'));
  }, []);

  return { choice, resolved, setChoice, toggle };
}
