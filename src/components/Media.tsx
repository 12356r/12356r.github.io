import { useState } from 'react';
import SceneArt, { type ArtSpec } from './SceneArt';

interface MediaProps {
  art: ArtSpec;
  image?: string | null;
  alt: string;
  /** 图片下方/角标提示，默认为示意插画时自动显示 */
  flag?: string | null;
  className?: string;
  align?: 'center' | 'bottom';
}

/**
 * 统一媒体组件：
 * - 有授权实景图（image 字段）时使用 <img>，加载失败自动回退到插画；
 * - 没有实景图时使用本地插画，并明确标注「示意图」。
 */
export default function Media({ art, image, alt, flag, className, align = 'center' }: MediaProps) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(image) && !failed;
  const flagText = flag === undefined ? (showImage ? null : '示意图 · 非实景照片') : flag;

  return (
    <div className={className} style={{ position: 'relative', overflow: 'hidden' }}>
      {showImage ? (
        <img
          src={image as string}
          alt={alt}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : (
        <SceneArt art={art} align={align} />
      )}
      {flagText ? <span className="media-flag">{flagText}</span> : null}
    </div>
  );
}
