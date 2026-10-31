import { ArrowRight, Dices, RotateCcw, X } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { CANTEEN_PICKS, FOOD_ITEMS } from '../data/content';

interface WheelItem {
  label: string;
  canteen: string;
  canteenId: string;
  floor?: string;
}

const PALETTE = ['#2f7fc1', '#4a9ad4', '#6fb2e0', '#8ec6ea', '#2b8f7d', '#4aa895', '#c98a3c', '#dda75c'];

function canteenName(id: string): string {
  return FOOD_ITEMS.find((f) => f.id === id)?.name ?? '';
}

const ITEMS: WheelItem[] = CANTEEN_PICKS.map((p) => ({
  label: p.name,
  canteen: canteenName(p.canteenId),
  canteenId: p.canteenId,
  floor: p.floor,
}));

const SLICE = (Math.PI * 2) / Math.max(1, ITEMS.length);

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

export default function FoodWheel() {
  /** 支持 /food?wheel=1 直接打开转盘，方便分享「今天吃什么」 */
  const [open, setOpen] = useState(() => new URLSearchParams(window.location.search).get('wheel') === '1');
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<WheelItem | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rotationRef = useRef(0);
  const rafRef = useRef(0);

  const items = useMemo(() => ITEMS, []);

  const draw = useCallback(
    (rotation: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cssSize = canvas.clientWidth || 420;
      const size = cssSize;
      if (canvas.width !== Math.round(size * dpr)) {
        canvas.width = Math.round(size * dpr);
        canvas.height = Math.round(size * dpr);
      }
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, size, size);
      const cx = size / 2;
      const cy = size / 2;
      const R = size / 2 - 2;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rotation);
      items.forEach((item, i) => {
        const a0 = i * SLICE - Math.PI / 2;
        const a1 = a0 + SLICE;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, R, a0, a1);
        ctx.closePath();
        ctx.fillStyle = PALETTE[i % PALETTE.length];
        ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.85)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // 文字沿半径排布
        ctx.save();
        ctx.rotate(a0 + SLICE / 2);
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = 'rgba(255,255,255,0.96)';
        const fontSize = Math.max(9, Math.min(13, size * 0.027));
        ctx.font = `600 ${fontSize}px "Noto Sans SC", system-ui, sans-serif`;
        const label = item.label.length > 7 ? `${item.label.slice(0, 7)}…` : item.label;
        ctx.fillText(label, R - 14, 0);
        ctx.restore();
      });
      ctx.restore();

      // 中心圆
      ctx.beginPath();
      ctx.arc(cx, cy, size * 0.13, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.strokeStyle = 'rgba(23,59,94,0.12)';
      ctx.stroke();
      ctx.fillStyle = '#183b5b';
      ctx.font = `700 ${Math.round(size * 0.045)}px "Noto Serif SC", system-ui, serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('今天吃', cx, cy - size * 0.022);
      ctx.fillText('什么', cx, cy + size * 0.028);
    },
    [items],
  );

  useEffect(() => {
    if (!open) return;
    draw(rotationRef.current);
    const onResize = () => draw(rotationRef.current);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [open, draw]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !spinning) setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, spinning]);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  const spin = () => {
    if (spinning || items.length === 0) return;
    setResult(null);
    setSpinning(true);

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const target = Math.floor(Math.random() * items.length);
    // 让 target 扇区中心停在指针（正上方）
    const want = -target * SLICE - SLICE / 2;
    const turns = reduce ? 0 : 5 + Math.floor(Math.random() * 2);
    const from = rotationRef.current;
    const to = want - Math.PI * 2 * turns;

    if (reduce) {
      rotationRef.current = to;
      draw(to);
      setSpinning(false);
      setResult(items[target]);
      return;
    }

    const duration = 3600 + Math.random() * 600;
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = easeOutCubic(t);
      const rot = from + (to - from) * eased;
      rotationRef.current = rot;
      draw(rot);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        rotationRef.current = to % (Math.PI * 2);
        setSpinning(false);
        setResult(items[target]);
      }
    };
    rafRef.current = requestAnimationFrame(step);
  };

  const close = () => {
    if (spinning) return;
    setOpen(false);
  };

  /* /food?wheel=1&spin=1：打开即自动转一次，方便截图演示 */
  const autoSpun = useRef(false);
  useEffect(() => {
    if (!open || autoSpun.current) return;
    if (new URLSearchParams(window.location.search).get('spin') !== '1') return;
    autoSpun.current = true;
    const t = window.setTimeout(() => spin(), 400);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <>
      <button type="button" className="wheel-trigger" onClick={() => setOpen(true)}>
        <span className="wheel-trigger__icon" aria-hidden="true">
          <Dices size={18} />
        </span>
        <span className="wheel-trigger__text">
          <strong>每日吃什么</strong>
          <span>转一下，从已收录的 {items.length} 道档口美食里挑一个</span>
        </span>
        <span className="wheel-trigger__go" aria-hidden="true">
          <ArrowRight size={16} />
        </span>
      </button>

      {open
        ? createPortal(
            <div className="wheel-overlay" role="dialog" aria-modal="true" aria-label="每日吃什么" onClick={close}>
              <div className="wheel-modal" onClick={(e) => e.stopPropagation()}>
                <button type="button" className="wheel-modal__close" onClick={close} aria-label="关闭">
                  <X size={18} aria-hidden="true" />
                </button>

                <div className="wheel-stage">
                  <div className="wheel-pointer" aria-hidden="true" />
                  <canvas ref={canvasRef} className="wheel-canvas" aria-hidden="true" />
                </div>

                <div className="wheel-panel" aria-live="polite">
                  {result ? (
                    <>
                      <p className="wheel-panel__eyebrow">今天就吃</p>
                      <p className="wheel-panel__dish">{result.label}</p>
                      <p className="wheel-panel__meta">
                        {result.canteen}
                        {result.floor ? ` · ${result.floor}` : ''}
                      </p>
                      <div className="wheel-panel__actions">
                        <button type="button" className="btn btn--ghost btn--sm" onClick={spin}>
                          <RotateCcw size={14} aria-hidden="true" />
                          再转一次
                        </button>
                        <Link className="btn btn--sm" to={`/food/${result.canteenId}`} onClick={() => setOpen(false)}>
                          去这家食堂
                          <ArrowRight size={14} aria-hidden="true" />
                        </Link>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="wheel-panel__eyebrow">{spinning ? '转动中…' : '不知道吃啥？'}</p>
                      <p className="wheel-panel__hint">
                        {spinning ? '看看指针停在哪个档口' : '点下面的按钮，转盘会从已收录的档口里随机挑一个'}
                      </p>
                      <div className="wheel-panel__actions">
                        <button type="button" className="btn btn--sm" onClick={spin} disabled={spinning}>
                          <Dices size={14} aria-hidden="true" />
                          开始转
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
