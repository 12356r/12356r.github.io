import { useCallback, useSyncExternalStore } from 'react';

const STORAGE_KEY = 'zzu-explorer:favorites';

function readInitial(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

let ids: string[] = readInitial();
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function snapshot() {
  return ids;
}

function persist(next: string[]) {
  ids = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* 隐私模式下写入失败时仅保留内存状态 */
  }
  listeners.forEach((l) => l());
}

export function useFavorites() {
  const list = useSyncExternalStore(subscribe, snapshot, snapshot);

  const toggle = useCallback((id: string) => {
    persist(ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]);
  }, []);

  const remove = useCallback((id: string) => {
    persist(ids.filter((x) => x !== id));
  }, []);

  const clear = useCallback(() => persist([]), []);

  const has = useCallback((id: string) => ids.includes(id), []);

  return { ids: list, toggle, remove, clear, has, count: list.length };
}
