import { useEffect, useRef, type RefObject } from 'react';

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

/**
 * 把键盘焦点限制在弹窗内（Tab / Shift+Tab 循环），关闭后还原到触发元素。
 * 仅做焦点的“圈定”，按 Esc 关闭由各弹窗自己处理。
 */
export function useFocusTrap(ref: RefObject<HTMLElement>, active: boolean) {
  const previous = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active) return;
    const container = ref.current;
    if (!container) return;

    previous.current = document.activeElement as HTMLElement | null;
    const nodes = () => Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => el.offsetParent !== null);

    const first = nodes()[0];
    first?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const list = nodes();
      if (list.length === 0) return;
      const head = list[0];
      const tail = list[list.length - 1];
      const current = document.activeElement as HTMLElement | null;

      if (e.shiftKey && (current === head || !container.contains(current))) {
        e.preventDefault();
        tail.focus();
      } else if (!e.shiftKey && current === tail) {
        e.preventDefault();
        head.focus();
      }
    };

    container.addEventListener('keydown', onKeyDown);
    return () => {
      container.removeEventListener('keydown', onKeyDown);
      previous.current?.focus?.();
    };
  }, [ref, active]);
}
