import { useEffect } from 'react';
import { SITE } from '../data/site';

function setMeta(selector: string, attr: 'content', value: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement('meta');
    const nameMatch = selector.match(/\[(name|property)="([^"]+)"\]/);
    if (nameMatch) el.setAttribute(nameMatch[1], nameMatch[2]);
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
}

/**
 * 为每个路由设置中文标题与描述，并同步 Open Graph 字段。
 * 单页应用里这是最容易被忽略的 SEO 环节。
 */
export function usePageMeta(title?: string, description?: string) {
  useEffect(() => {
    const fullTitle = title ? `${title} · ${SITE.name}` : `${SITE.name} · ${SITE.tagline}`;
    document.title = fullTitle;
    setMeta('meta[property="og:title"]', 'content', fullTitle);
    setMeta('meta[name="description"]', 'content', description ?? SITE.description);
    setMeta('meta[property="og:description"]', 'content', description ?? SITE.description);

    return () => {
      document.title = `${SITE.name} · ${SITE.tagline}`;
    };
  }, [title, description]);
}
