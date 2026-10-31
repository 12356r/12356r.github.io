import type { Campus } from './types';
import { SOURCES } from './site';

/** 四个校区及其地址，均出自学校简介与招生网公开页面。 */
export const CAMPUSES: Campus[] = [
  {
    id: 'main',
    name: '主校区',
    address: '郑州市科学大道 100 号',
    short: '学校法定住所地所在校区',
    art: { kind: 'plaza', seed: 11, mood: 'spring' },
    sources: [SOURCES.intro],
    verification: 'verified',
  },
  {
    id: 'south',
    name: '南校区',
    address: '郑州市大学北路 75 号',
    short: '位于大学北路',
    art: { kind: 'block', seed: 23, mood: 'autumn' },
    sources: [SOURCES.intro],
    verification: 'verified',
  },
  {
    id: 'north',
    name: '北校区',
    address: '郑州市文化路 97 号',
    short: '位于文化路',
    art: { kind: 'trees', seed: 37, mood: 'summer' },
    sources: [SOURCES.intro],
    verification: 'verified',
  },
  {
    id: 'east',
    name: '东校区',
    address: '郑州市大学北路 40 号',
    short: '位于大学北路',
    art: { kind: 'arch', seed: 53, mood: 'dusk' },
    sources: [SOURCES.intro],
    verification: 'verified',
  },
];

export const CAMPUS_MAP: Record<string, Campus> = Object.fromEntries(
  CAMPUSES.map((c) => [c.id, c]),
);

export function campusName(id: string): string {
  return CAMPUS_MAP[id]?.name ?? '校区待核验';
}
