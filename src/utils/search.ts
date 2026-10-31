import { FOOD_ITEMS, ACTIVITIES, NEWS_CHANNELS } from '../data/content';
import { PLACES } from '../data/scenery';
import { campusName } from '../data/campuses';

export interface SearchHit {
  id: string;
  type: '校园风光' | '校园美食' | '社团活动' | '资讯入口';
  title: string;
  subtitle: string;
  to: string;
}

function normalize(text: string) {
  return text.toLowerCase().replace(/\s+/g, '');
}

function buildIndex(): SearchHit[] {
  const hits: SearchHit[] = [];

  for (const p of PLACES) {
    hits.push({
      id: `place-${p.id}`,
      type: '校园风光',
      title: p.name,
      subtitle: [campusName(p.campus), p.category, p.summary].filter(Boolean).join(' · '),
      to: `/scenery/${p.id}`,
    });
  }

  for (const f of FOOD_ITEMS) {
    const areaLabel = '食堂';
    hits.push({
      id: `food-${f.id}`,
      type: '校园美食',
      title: f.name,
      subtitle: `${areaLabel} · ${f.kind} · ${f.summary}`,
      to: `/food#${f.area}`,
    });
  }

  for (const a of ACTIVITIES) {
    hits.push({
      id: `act-${a.id}`,
      type: '社团活动',
      title: a.title,
      subtitle: a.category,
      to: '/activities',
    });
  }

  for (const n of NEWS_CHANNELS) {
    hits.push({
      id: `news-${n.id}`,
      type: '资讯入口',
      title: n.title,
      subtitle: n.category,
      to: `/news/${n.id}`,
    });
  }

  return hits;
}

const INDEX = buildIndex();

export function searchAll(query: string, limitPerType = 12): SearchHit[] {
  const q = normalize(query);
  if (!q) return [];
  const scored = INDEX.map((hit) => {
    const title = normalize(hit.title);
    const sub = normalize(hit.subtitle);
    let score = 0;
    if (title === q) score = 100;
    else if (title.startsWith(q)) score = 80;
    else if (title.includes(q)) score = 60;
    else if (sub.includes(q)) score = 30;
    return { hit, score };
  })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);

  const counters = new Map<string, number>();
  const out: SearchHit[] = [];
  for (const { hit } of scored) {
    const n = (counters.get(hit.type) ?? 0) + 1;
    if (n > limitPerType) continue;
    counters.set(hit.type, n);
    out.push(hit);
  }
  return out;
}

export function groupHits(hits: SearchHit[]) {
  const order: SearchHit['type'][] = ['校园风光', '校园美食', '社团活动', '资讯入口'];
  return order
    .map((type) => ({ type, items: hits.filter((h) => h.type === type) }))
    .filter((g) => g.items.length > 0);
}
