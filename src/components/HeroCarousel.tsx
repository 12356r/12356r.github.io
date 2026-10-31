import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { useCallback, useEffect, useRef, useState, type TouchEvent as ReactTouchEvent } from 'react';
import { Link } from 'react-router-dom';
import SceneArt, { type ArtSpec } from './SceneArt';

export interface HeroSlide {
  art: ArtSpec;
  /** 实景照片：提供后优先使用，加载失败自动回退到插画 */
  image?: { wide: string; tall: string; alt: string; position?: string };
  /**
   * full：整幅铺满；split：竖幅照片靠右，左侧留出深色文案区
   * （用于竖构图照片需要完整露出细节时，例如钟楼上的校训刻字）
   */
  layout?: 'full' | 'split';
  eyebrow: string;
  title: string;
  subtitle: string;
  desc: string;
  to: string;
  cta: string;
}

function initialIndex(total: number) {
  if (typeof window === 'undefined') return 0;
  const raw = new URLSearchParams(window.location.search).get('slide');
  const n = Number(raw);
  if (!Number.isFinite(n) || n < 1 || n > total) return 0;
  return Math.floor(n) - 1;
}

export default function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(() => initialIndex(slides.length));
  const [paused, setPaused] = useState(false);
  const [autoPlay, setAutoPlay] = useState(true);
  const [failed, setFailed] = useState<Record<number, boolean>>({});
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const go = useCallback(
    (dir: number) => {
      setIndex((i) => (i + dir + slides.length) % slides.length);
    },
    [slides.length],
  );

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) setAutoPlay(false);
  }, []);

  useEffect(() => {
    if (paused || !autoPlay || slides.length < 2) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) setIndex((i) => (i + 1) % slides.length);
    }, 6500);
    return () => window.clearInterval(timer);
  }, [paused, autoPlay, slides.length]);

  const onTouchStart = (e: ReactTouchEvent<HTMLElement>) => {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  };

  const onTouchEnd = (e: ReactTouchEvent<HTMLElement>) => {
    const start = touchStart.current;
    if (!start) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy)) go(dx > 0 ? -1 : 1);
    touchStart.current = null;
  };

  const active = slides[index];

  return (
    <section
      className={`hero ${active.layout === 'split' ? 'hero--split' : ''}`}
      aria-roledescription="轮播"
      aria-label="校园风景轮播"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="hero__stage">
        {slides.map((s, i) => (
          <div
            key={s.title}
            className={`hero__slide ${i === index ? 'is-active' : ''} ${s.layout === 'split' ? 'is-split' : ''}`}
            aria-hidden={i !== index}
          >
            {s.image && !failed[i] ? (
              <picture>
                {s.layout !== 'split' ? <source media="(max-width: 720px)" srcSet={s.image.tall} /> : null}
                <img
                  src={s.layout === 'split' ? s.image.tall : s.image.wide}
                  alt={s.image.alt}
                  style={s.image.position ? { objectPosition: s.image.position } : undefined}
                  loading="eager"
                  fetchPriority={i === 0 ? 'high' : 'auto'}
                  decoding="async"
                  onError={() => setFailed((prev) => ({ ...prev, [i]: true }))}
                />
              </picture>
            ) : (
              <SceneArt art={s.art} />
            )}
          </div>
        ))}
        <div className="hero__scrim" />
      </div>

      <div className="container hero__inner">
        <div className="hero__copy" key={index}>
          <span className="hero__eyebrow">{active.eyebrow}</span>
          <h1 className="hero__title">{active.title}</h1>
          <p className="hero__subtitle">{active.subtitle}</p>
          <p className="hero__desc">{active.desc}</p>
          <div className="hero__actions">
            <Link className="btn btn--light btn--lg" to={active.to}>
              {active.cta}
            </Link>
          </div>
        </div>
      </div>

      <div className="hero__controls">
        <button type="button" className="hero__arrow" onClick={() => go(-1)} aria-label="上一张">
          <ChevronLeft size={20} aria-hidden="true" />
        </button>
        <button type="button" className="hero__arrow" onClick={() => go(1)} aria-label="下一张">
          <ChevronRight size={20} aria-hidden="true" />
        </button>
        <button
          type="button"
          className="hero__arrow"
          onClick={() => setAutoPlay((v) => !v)}
          aria-label={autoPlay ? '暂停自动播放' : '开始自动播放'}
          aria-pressed={autoPlay}
        >
          {autoPlay ? <Pause size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}
        </button>
      </div>

      <div className="hero__dots" role="tablist" aria-label="选择轮播图片">
        {slides.map((s, i) => (
          <button
            key={s.title}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={`第 ${i + 1} 张：${s.title}`}
            className={`hero__dot ${i === index ? 'is-active' : ''}`}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>

      <p className="hero__flag">
        {active.image && !failed[index] ? '校园实景照片' : '配图为示意插画，非校园实景照片'}
      </p>
    </section>
  );
}
