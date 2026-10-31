import { ArrowRight, CornerDownLeft, Search, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { groupHits, searchAll } from '../utils/search';
import { useLockBody } from '../hooks/useUi';
import { useFocusTrap } from '../hooks/useFocusTrap';

export default function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  useLockBody(open);
  useFocusTrap(panelRef, open);

  const hits = useMemo(() => searchAll(q), [q]);
  const groups = useMemo(() => groupHits(hits), [hits]);

  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => inputRef.current?.focus(), 40);
    return () => window.clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) setQ('');
  }, [open]);

  if (!open) return null;

  const submit = () => {
    const term = q.trim();
    if (!term) return;
    onClose();
    navigate(`/search?q=${encodeURIComponent(term)}`);
  };

  return (
    <div className="search-overlay" role="dialog" aria-modal="true" aria-label="站内搜索">
      <div className="search-overlay__backdrop" onClick={onClose} />
      <div className="search-overlay__panel" ref={panelRef}>
        <div className="search-overlay__bar">
          <Search size={20} aria-hidden="true" />
          <input
            ref={inputRef}
            type="search"
            className="search-overlay__input"
            placeholder="搜索校园地点、学院、美食、活动…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') submit();
            }}
            aria-label="搜索关键词"
          />
          <button type="button" className="icon-btn" onClick={onClose} aria-label="关闭搜索">
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <div className="search-overlay__body">
          {!q.trim() ? (
            <div className="search-hints">
              <p className="search-hints__title">试试这些关键词</p>
              <div className="chips">
                {['图书馆', '厚山', '植物园', '主校区', '计算机', '招生'].map((k) => (
                  <button key={k} type="button" className="chip" onClick={() => setQ(k)}>
                    {k}
                  </button>
                ))}
              </div>
            </div>
          ) : groups.length === 0 ? (
            <div className="search-empty">
              <p>没有找到与「{q}」相关的内容。</p>
              <p className="muted">可以尝试更短的关键词，或查看校园风光与校园美食页面。</p>
            </div>
          ) : (
            <div className="search-results">
              {groups.map((g) => (
                <section key={g.type} className="search-group">
                  <p className="search-group__title">{g.type}</p>
                  <ul>
                    {g.items.map((hit) => (
                      <li key={hit.id}>
                        <button
                          type="button"
                          className="search-hit"
                          onClick={() => {
                            onClose();
                            navigate(hit.to);
                          }}
                        >
                          <span className="search-hit__title">{hit.title}</span>
                          <span className="search-hit__sub">{hit.subtitle}</span>
                          <ArrowRight size={15} aria-hidden="true" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          )}
        </div>

        <div className="search-overlay__foot">
          <span>
            <CornerDownLeft size={13} aria-hidden="true" style={{ verticalAlign: '-2px' }} /> 回车查看全部结果
          </span>
          <span>esc 关闭</span>
        </div>
      </div>
    </div>
  );
}
