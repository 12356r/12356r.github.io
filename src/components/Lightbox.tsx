import { X } from 'lucide-react';
import { useEffect, useRef, type ReactNode } from 'react';
import { useLockBody } from '../hooks/useUi';
import { useFocusTrap } from '../hooks/useFocusTrap';

export default function Lightbox({
  open,
  onClose,
  children,
  label,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  label: string;
}) {
  useLockBody(open);
  const panelRef = useRef<HTMLDivElement>(null);
  useFocusTrap(panelRef, open);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={label}>
      <div className="lightbox__backdrop" onClick={onClose} />
      <div className="lightbox__panel" ref={panelRef}>
        <button type="button" className="lightbox__close" onClick={onClose} aria-label="关闭图片预览">
          <X size={20} aria-hidden="true" />
        </button>
        {children}
      </div>
    </div>
  );
}
