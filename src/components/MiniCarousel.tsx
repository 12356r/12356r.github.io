import { useEffect, useRef, useState } from 'react';

export interface MiniSlide {
  src: string;
  alt: string;
}

interface Props {
  slides: MiniSlide[];
  /** 切换间隔（毫秒），默认 4000 */
  interval?: number;
  /** 圆点是否显示 */
  dots?: boolean;
  className?: string;
}

/**
 * 卡片内的迷你轮播：几张实景照片淡入淡出轮播。
 * - 鼠标悬停 / 聚焦时暂停
 * - 用户偏好减少动效时不自动播放，只显示第一张
 */
export default function MiniCarousel({ slides, interval = 4000, dots = true, className = '' }: Props) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useRef(false);

  useEffect(() => {
    reduce.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  useEffect(() => {
    if (slides.length < 2 || paused || reduce.current) return;
    const timer = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, interval);
    return () => window.clearInterval(timer);
  }, [slides.length, interval, paused]);

  if (slides.length === 0) return null;

  return (
    <div
      className={`mini-carousel ${className}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {slides.map((s, i) => (
        <img
          key={s.src}
          src={s.src}
          alt={s.alt}
          className={`mini-carousel__img ${i === index ? 'is-active' : ''}`}
          loading={i === 0 ? 'eager' : 'lazy'}
          decoding="async"
          aria-hidden={i !== index}
        />
      ))}

      {dots && slides.length > 1 ? (
        <div className="mini-carousel__dots" aria-hidden="true">
          {slides.map((s, i) => (
            <span key={s.src} className={`mini-carousel__dot ${i === index ? 'is-active' : ''}`} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
