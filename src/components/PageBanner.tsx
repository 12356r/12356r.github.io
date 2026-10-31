import type { ReactNode } from 'react';
import type { ArtSpec } from './SceneArt';
import Breadcrumbs, { type Crumb } from './Breadcrumbs';
import YouthBanner from './YouthBanner';

interface PageBannerProps {
  art: ArtSpec;
  /** 实景照片：提供后作为横幅背景，art 仅在加载失败 / 缺省时使用 */
  image?: string;
  imageSm?: string;
  imageAlt?: string;
  title: string;
  eyebrow?: string;
  desc?: ReactNode;
  crumbs: Crumb[];
  /** 右下角统计或额外信息 */
  aside?: ReactNode;
  height?: 'md' | 'lg';
}

export default function PageBanner({
  image,
  imageSm,
  imageAlt,
  title,
  eyebrow,
  desc,
  crumbs,
  aside,
  height = 'md',
}: PageBannerProps) {
  return (
    <header
      className={`page-banner page-banner--${height} ${image ? 'page-banner--photo' : 'page-banner--youth'}`}
    >
      <div className="page-banner__bg">
        {image ? (
          <img
            className="page-banner__img"
            src={image}
            srcSet={imageSm ? `${imageSm} 1000w` : undefined}
            sizes="100vw"
            alt={imageAlt ?? ''}
            fetchPriority="high"
            decoding="async"
          />
        ) : (
          /* 没有实景照片的板块：统一用「青春正能量 · 红色」插画做背景 */
          <YouthBanner />
        )}
      </div>
      <div className="page-banner__scrim" />
      <div className="container page-banner__inner">
        <div className="page-banner__crumbs">
          <Breadcrumbs items={crumbs} />
        </div>
        {eyebrow ? <span className="page-banner__eyebrow">{eyebrow}</span> : null}
        <h1 className="page-banner__title">{title}</h1>
        {desc ? <p className="page-banner__desc">{desc}</p> : null}
        {aside ? <div className="page-banner__aside">{aside}</div> : null}
      </div>
    </header>
  );
}
