import { useId, useMemo } from 'react';

/**
 * SceneArt —— 本地生成的水彩／扁平插画场景。
 *
 * 说明：本站暂未获得可确认授权的郑州大学实景照片，因此所有视觉预览都使用
 * 明确标注为「示意图」的本地插画，不使用其他高校照片冒充郑大实景。
 * 若拿到授权实景图，只需在数据里填入 image 字段即可自动替换（见 README）。
 */

export type ArtKind =
  | 'hero'
  | 'banner'
  | 'lake'
  | 'library'
  | 'arch'
  | 'block'
  | 'trees'
  | 'plaza'
  | 'bridge'
  | 'court'
  | 'stage'
  | 'garden'
  | 'room'
  | 'bowl'
  | 'cup'
  | 'map';

export type ArtMood = 'spring' | 'summer' | 'autumn' | 'winter' | 'dusk' | 'day';

export interface ArtSpec {
  kind: ArtKind;
  seed?: number;
  mood?: ArtMood;
}

interface Palette {
  skyFrom: string;
  skyTo: string;
  sun: string;
  hillFar: string;
  hillNear: string;
  tree: string;
  treeDark: string;
  building: string;
  buildingShade: string;
  wall: string;
  window: string;
  water: string;
  waterDeep: string;
  ground: string;
  groundAlt: string;
  accent: string;
}

const PALETTES: Record<ArtMood, Palette> = {
  day: {
    skyFrom: '#f6cfa5',
    skyTo: '#fff3e4',
    sun: '#fff3cf',
    hillFar: '#e8c9a6',
    hillNear: '#d9b48d',
    tree: '#418c66',
    treeDark: '#2a6b4a',
    building: '#f8ead5',
    buildingShade: '#d8c3a6',
    wall: '#f6ece1',
    window: '#c98f63',
    water: '#8fbfd0',
    waterDeep: '#6b9fb4',
    ground: '#cfd49a',
    groundAlt: '#b9c184',
    accent: '#f5c99b',
  },
  spring: {
    skyFrom: '#f9d4ad',
    skyTo: '#fff6ea',
    sun: '#fffdf0',
    hillFar: '#d7d9a8',
    hillNear: '#c3c78f',
    tree: '#519a72',
    treeDark: '#337553',
    building: '#f7ecdd',
    buildingShade: '#ddc7ac',
    wall: '#fbf2e8',
    window: '#d09b6d',
    water: '#9cc9d8',
    waterDeep: '#74a6bb',
    ground: '#d9dca6',
    groundAlt: '#c4c98f',
    accent: '#f3b8cd',
  },
  summer: {
    skyFrom: '#f2b884',
    skyTo: '#fdf0dd',
    sun: '#fff8d8',
    hillFar: '#e3c19c',
    hillNear: '#d0a87f',
    tree: '#2f7d55',
    treeDark: '#1c5f3d',
    building: '#f0e0c9',
    buildingShade: '#cfb391',
    wall: '#f4e9dd',
    window: '#bb8054',
    water: '#8bbdcc',
    waterDeep: '#679bb0',
    ground: '#ccd197',
    groundAlt: '#b2bb80',
    accent: '#f2b98a',
  },
  autumn: {
    skyFrom: '#ffd9b0',
    skyTo: '#fff2e2',
    sun: '#fff1c8',
    hillFar: '#e6c7a6',
    hillNear: '#cfa87e',
    tree: '#c98a4c',
    treeDark: '#a56a34',
    building: '#f3e3d1',
    buildingShade: '#dbbfa4',
    wall: '#eceef1',
    window: '#c2a78f',
    water: '#cfc6ba',
    waterDeep: '#b0a99e',
    ground: '#e3d3ad',
    groundAlt: '#d6bd8c',
    accent: '#e98b52',
  },
  winter: {
    skyFrom: '#e9dccd',
    skyTo: '#fdf6ee',
    sun: '#fbfdff',
    hillFar: '#efe2d2',
    hillNear: '#e0cdb8',
    tree: '#8ba3b7',
    treeDark: '#6b8497',
    building: '#fbf3ea',
    buildingShade: '#e3d2c0',
    wall: '#fdf7f0',
    window: '#c9a888',
    water: '#e6e0d4',
    waterDeep: '#cbbfae',
    ground: '#fdf6ee',
    groundAlt: '#efe2d2',
    accent: '#c9a27d',
  },
  dusk: {
    skyFrom: '#f7c39a',
    skyTo: '#f6e5d8',
    sun: '#ffd9a8',
    hillFar: '#dcc4b4',
    hillNear: '#c4ad9c',
    tree: '#6b7f72',
    treeDark: '#4d5f55',
    building: '#efd9c6',
    buildingShade: '#cfae97',
    wall: '#e4dee6',
    window: '#f6d79a',
    water: '#cfc0ae',
    waterDeep: '#b0a08d',
    ground: '#c9b3a0',
    groundAlt: '#b39c88',
    accent: '#f0a06a',
  },
};

function rng(seed: number) {
  let a = seed >>> 0;
  return function next() {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface Ctx {
  p: Palette;
  r: () => number;
  uid: string;
}

/* ---------------- 通用图层 ---------------- */

function Sky({ p, id }: { p: Palette; id: string }) {
  return (
    <g>
      <rect width="800" height="600" fill={`url(#sky-${id})`} />
      <ellipse cx="600" cy="118" rx="150" ry="54" fill="#ffffff" opacity="0.28" />
      <ellipse cx="250" cy="86" rx="190" ry="46" fill="#ffffff" opacity="0.18" />
      <circle cx="150" cy="120" r="46" fill={`url(#sun-${id})`} />
      <defs>
        <linearGradient id={`sky-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={p.skyFrom} />
          <stop offset="100%" stopColor={p.skyTo} />
        </linearGradient>
        <radialGradient id={`sun-${id}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={p.sun} stopOpacity="0.95" />
          <stop offset="65%" stopColor={p.sun} stopOpacity="0.35" />
          <stop offset="100%" stopColor={p.sun} stopOpacity="0" />
        </radialGradient>
      </defs>
    </g>
  );
}

function Hills({ p, r }: { p: Palette; r: () => number }) {
  const far = [
    `M0 372 C 110 ${330 + r() * 18}, 200 ${356 + r() * 10}, 300 352`,
    `C 400 ${332 + r() * 14}, 470 368, 560 356`,
    `C 650 ${338 + r() * 12}, 720 366, 800 350 L800 600 L0 600 Z`,
  ].join(' ');
  return (
    <g>
      <path d={far} fill={p.hillFar} opacity="0.9" />
      <path
        d="M0 392 C 120 366, 210 394, 320 386 C 430 378, 500 400, 610 392 C 700 386, 750 398, 800 392 L800 600 L0 600 Z"
        fill={p.hillNear}
        opacity="0.75"
      />
    </g>
  );
}

function TreeRow({
  p,
  r,
  baseY,
  from = -20,
  to = 820,
  step = 46,
  scale = 1,
  opacity = 1,
}: {
  p: Palette;
  r: () => number;
  baseY: number;
  from?: number;
  to?: number;
  step?: number;
  scale?: number;
  opacity?: number;
}) {
  const items: JSX.Element[] = [];
  let i = 0;
  for (let x = from; x < to; x += step * (0.7 + r() * 0.7)) {
    const h = (26 + r() * 26) * scale;
    const w = (16 + r() * 12) * scale;
    const dark = r() > 0.55;
    items.push(
      <g key={i++} opacity={opacity}>
        <rect
          x={x - 2.2 * scale}
          y={baseY - h * 0.55}
          width={4.4 * scale}
          height={h * 0.6}
          rx={2 * scale}
          fill={p.treeDark}
          opacity="0.55"
        />
        <ellipse cx={x} cy={baseY - h * 0.85} rx={w} ry={h * 0.62} fill={dark ? p.treeDark : p.tree} />
        <ellipse
          cx={x - w * 0.4}
          cy={baseY - h * 1.05}
          rx={w * 0.7}
          ry={h * 0.5}
          fill={dark ? p.tree : p.treeDark}
          opacity="0.35"
        />
      </g>,
    );
  }
  return <g>{items}</g>;
}

function Building({
  p,
  x,
  y,
  w,
  h,
  cols,
  rows,
  roofStyle = 'flat',
}: {
  p: Palette;
  x: number;
  y: number;
  w: number;
  h: number;
  cols: number;
  rows: number;
  roofStyle?: 'flat' | 'step' | 'dome' | 'gable';
}) {
  const cw = w / cols;
  const rh = h / rows;
  const cells: JSX.Element[] = [];
  for (let c = 0; c < cols; c++) {
    for (let rr = 0; rr < rows; rr++) {
      cells.push(
        <rect
          key={`${c}-${rr}`}
          x={x + cw * c + cw * 0.26}
          y={y + rh * rr + rh * 0.28}
          width={cw * 0.48}
          height={rh * 0.42}
          rx={2}
          fill={p.window}
          opacity={0.55 + ((c * 7 + rr * 3) % 5) * 0.08}
        />,
      );
    }
  }
  return (
    <g>
      <rect x={x + 6} y={y + 8} width={w} height={h} rx={4} fill={p.buildingShade} opacity="0.5" />
      <rect x={x} y={y} width={w} height={h} rx={4} fill={p.building} />
      {roofStyle === 'gable' && (
        <path d={`M${x - 10} ${y} L${x + w / 2} ${y - h * 0.28} L${x + w + 10} ${y} Z`} fill={p.buildingShade} />
      )}
      {roofStyle === 'dome' && (
        <path
          d={`M${x + w * 0.22} ${y} Q ${x + w / 2} ${y - h * 0.62} ${x + w * 0.78} ${y} Z`}
          fill={p.buildingShade}
        />
      )}
      {roofStyle === 'step' && (
        <rect x={x + w * 0.36} y={y - h * 0.22} width={w * 0.28} height={h * 0.22} fill={p.buildingShade} />
      )}
      <rect x={x} y={y + h - 10} width={w} height={10} fill={p.buildingShade} opacity="0.55" />
      {cells}
    </g>
  );
}

function Ground({ p, y, alt = false }: { p: Palette; y: number; alt?: boolean }) {
  return (
    <g>
      <rect x="0" y={y} width="800" height={600 - y} fill={alt ? p.groundAlt : p.ground} />
      <ellipse cx="400" cy={y + 6} rx="470" ry="26" fill="#ffffff" opacity="0.16" />
    </g>
  );
}

function Water({ p, id, y, h }: { p: Palette; id: string; y: number; h: number }) {
  const lines: JSX.Element[] = [];
  for (let i = 0; i < 7; i++) {
    const ly = y + 14 + i * (h / 8);
    lines.push(
      <rect
        key={i}
        x={60 + i * 34}
        y={ly}
        width={120 + ((i * 57) % 180)}
        height="2"
        rx="1"
        fill="#ffffff"
        opacity={0.22 - i * 0.02}
      />,
    );
  }
  return (
    <g>
      <rect x="0" y={y} width="800" height={h} fill={`url(#water-${id})`} />
      {lines}
      <defs>
        <linearGradient id={`water-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={p.waterDeep} stopOpacity="0.85" />
          <stop offset="100%" stopColor={p.water} stopOpacity="0.95" />
        </linearGradient>
      </defs>
    </g>
  );
}

/* ---------------- 各类场景 ---------------- */

function SceneLake({ p, r, id }: Ctx & { id: string }) {
  return (
    <>
      <Sky p={p} id={id} />
      <Hills p={p} r={r} />
      <TreeRow p={p} r={r} baseY={402} opacity={0.85} />
      <Water p={p} id={id} y={410} h={190} />
      <g opacity="0.5">
        {[0, 1, 2, 3, 4].map((i) => (
          <path
            key={i}
            d={`M${120 + i * 130} 452 q 14 -22 28 0 q -14 12 -28 0`}
            fill={p.treeDark}
            opacity={0.35}
          />
        ))}
      </g>
      <Ground p={p} y={560} alt />
    </>
  );
}

function SceneLibrary({ p, r, id }: Ctx & { id: string }) {
  return (
    <>
      <Sky p={p} id={id} />
      <Hills p={p} r={r} />
      <TreeRow p={p} r={r} baseY={402} step={54} opacity={0.7} />
      <Building p={p} x={210} y={186} w={380} h={216} cols={7} rows={5} roofStyle="step" />
      <Building p={p} x={210} y={186} w={54} h={216} cols={0} rows={0} />
      <rect x="180" y="402" width="440" height="12" rx="4" fill={p.buildingShade} />
      <rect x="158" y="414" width="484" height="10" rx="4" fill={p.buildingShade} opacity="0.75" />
      <Ground p={p} y={424} />
      <ellipse cx="400" cy="470" rx="150" ry="16" fill={p.buildingShade} opacity="0.18" />
      <TreeRow p={p} r={r} baseY={470} from={40} to={190} step={40} scale={0.8} />
      <TreeRow p={p} r={r} baseY={470} from={620} to={800} step={40} scale={0.8} />
    </>
  );
}

function SceneArch({ p, r, id }: Ctx & { id: string }) {
  return (
    <>
      <Sky p={p} id={id} />
      <Hills p={p} r={r} />
      <rect x="150" y="230" width="500" height="180" rx="6" fill={p.building} />
      <path d="M150 230 L400 172 L650 230 Z" fill={p.buildingShade} />
      <path
        d="M320 410 L320 320 Q400 246 480 320 L480 410 Z"
        fill={p.buildingShade}
        opacity="0.9"
      />
      <path d="M336 410 L336 324 Q400 264 464 324 L464 410 Z" fill={p.window} opacity="0.32" />
      <rect x="120" y="404" width="560" height="14" rx="4" fill={p.buildingShade} />
      <Ground p={p} y={418} />
      <TreeRow p={p} r={r} baseY={470} from={20} to={170} step={44} scale={0.85} />
      <TreeRow p={p} r={r} baseY={470} from={640} to={800} step={44} scale={0.85} />
      <rect x="398" y="196" width="4" height="36" fill={p.buildingShade} />
    </>
  );
}

function SceneBlock({ p, r, id }: Ctx & { id: string }) {
  const b1x = 60 + r() * 30;
  const b2x = 320 + r() * 40;
  const b3x = 590 + r() * 30;
  return (
    <>
      <Sky p={p} id={id} />
      <Hills p={p} r={r} />
      <Building p={p} x={b1x} y={250} w={210} h={156} cols={6} rows={4} />
      <Building p={p} x={b2x} y={222} w={230} h={184} cols={7} rows={5} />
      <Building p={p} x={b3x} y={264} w={180} h={142} cols={5} rows={4} />
      <Ground p={p} y={406} />
      <path d="M0 470 L800 452" stroke={p.buildingShade} strokeWidth="16" opacity="0.3" />
      <TreeRow p={p} r={r} baseY={420} step={40} scale={0.9} opacity={0.95} />
    </>
  );
}

function SceneTrees({ p, r, id }: Ctx & { id: string }) {
  return (
    <>
      <Sky p={p} id={id} />
      <Hills p={p} r={r} />
      <Ground p={p} y={400} />
      <path
        d="M300 600 C 340 500, 300 470, 380 400 L 440 400 C 380 470, 420 510, 470 600 Z"
        fill={p.wall}
        opacity="0.55"
      />
      <TreeRow p={p} r={r} baseY={410} step={38} scale={1.1} />
      <TreeRow p={p} r={r} baseY={520} from={-30} to={840} step={70} scale={1.8} opacity={0.95} />
      <TreeRow p={p} r={r} baseY={560} from={-60} to={860} step={92} scale={2.2} opacity={0.9} />
    </>
  );
}

function ScenePlaza({ p, r, id }: Ctx & { id: string }) {
  const lines: JSX.Element[] = [];
  for (let i = 0; i < 9; i++) {
    lines.push(
      <path
        key={i}
        d={`M${400 + (i - 4) * 42} 424 L${400 + (i - 4) * 190} 600`}
        stroke={p.wall}
        strokeWidth="2"
        opacity="0.5"
      />,
    );
  }
  for (let i = 0; i < 5; i++) {
    lines.push(
      <path
        key={`h${i}`}
        d={`M0 ${440 + i * 34 + i * i * 6} L800 ${440 + i * 34 + i * i * 6}`}
        stroke={p.wall}
        strokeWidth="1.6"
        opacity="0.35"
      />,
    );
  }
  return (
    <>
      <Sky p={p} id={id} />
      <Hills p={p} r={r} />
      <Building p={p} x={250} y={196} w={300} h={210} cols={5} rows={5} roofStyle="flat" />
      <Ground p={p} y={406} alt />
      <g>{lines}</g>
      <rect x="396" y="300" width="3" height="110" fill={p.buildingShade} />
      <path d="M400 300 L440 318 L400 332 Z" fill={p.accent} opacity="0.85" />
      <TreeRow p={p} r={r} baseY={430} from={20} to={180} step={46} scale={0.9} />
      <TreeRow p={p} r={r} baseY={430} from={630} to={800} step={46} scale={0.9} />
    </>
  );
}

function SceneBridge({ p, r, id }: Ctx & { id: string }) {
  return (
    <>
      <Sky p={p} id={id} />
      <Hills p={p} r={r} />
      <TreeRow p={p} r={r} baseY={404} step={52} scale={0.9} opacity={0.8} />
      <Water p={p} id={id} y={408} h={192} />
      <path
        d="M120 470 Q400 372 680 470 L680 486 Q400 390 120 486 Z"
        fill={p.building}
      />
      <path d="M120 470 Q400 372 680 470" stroke={p.buildingShade} strokeWidth="7" fill="none" />
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const x = 160 + i * 96;
        const y = 470 - Math.sin(((x - 120) / 560) * Math.PI) * 96;
        return <rect key={i} x={x} y={y} width="4" height={470 - y} fill={p.building} opacity="0.8" />;
      })}
      <Ground p={p} y={560} alt />
    </>
  );
}

function SceneCourt({ p, r, id }: Ctx & { id: string }) {
  return (
    <>
      <Sky p={p} id={id} />
      <Hills p={p} r={r} />
      <Building p={p} x={60} y={252} w={200} h={150} cols={5} rows={4} />
      <Building p={p} x={560} y={238} w={200} h={164} cols={5} rows={4} />
      <rect x="150" y="420" width="500" height="180" rx="90" fill="#e8b98f" opacity="0.55" />
      <rect x="176" y="440" width="448" height="142" rx="71" fill="none" stroke="#ffffff" strokeWidth="4" opacity="0.8" />
      <rect x="176" y="440" width="448" height="142" rx="71" fill={p.tree} opacity="0.45" />
      <g opacity="0.85">
        <rect x="270" y="300" width="6" height="130" fill={p.buildingShade} />
        <rect x="256" y="292" width="34" height="8" rx="3" fill={p.wall} />
        <path d="M256 300 h34 v22 h-34 z" fill="none" stroke={p.wall} strokeWidth="3" />
        <rect x="524" y="300" width="6" height="130" fill={p.buildingShade} />
        <rect x="510" y="292" width="34" height="8" rx="3" fill={p.wall} />
        <path d="M510 300 h34 v22 h-34 z" fill="none" stroke={p.wall} strokeWidth="3" />
      </g>
      <Ground p={p} y={556} />
    </>
  );
}

function SceneStage({ p, r, id }: Ctx & { id: string }) {
  const flags: JSX.Element[] = [];
  for (let i = 0; i < 9; i++) {
    flags.push(
      <path
        key={i}
        d={`M${80 + i * 82} 300 Q ${94 + i * 82} 322 ${108 + i * 82} 302`}
        stroke={i % 2 ? p.accent : p.tree}
        strokeWidth="9"
        fill="none"
        opacity="0.7"
        strokeLinecap="round"
      />,
    );
  }
  return (
    <>
      <Sky p={p} id={id} />
      <Hills p={p} r={r} />
      <g>{flags}</g>
      <rect x="180" y="360" width="440" height="70" rx="6" fill={p.building} />
      <rect x="200" y="330" width="400" height="34" rx="5" fill={p.buildingShade} opacity="0.85" />
      <Ground p={p} y={430} />
      <g opacity="0.55">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <g key={i}>
            <circle cx={150 + i * 100} cy={492} r="13" fill={p.treeDark} opacity="0.5" />
            <rect x={142 + i * 100} y={500} width="16" height="34" rx="7" fill={p.treeDark} opacity="0.4" />
          </g>
        ))}
      </g>
      <TreeRow p={p} r={r} baseY={430} from={20} to={140} step={40} scale={0.7} />
      <TreeRow p={p} r={r} baseY={430} from={660} to={800} step={40} scale={0.7} />
    </>
  );
}

function SceneGarden({ p, r, id }: Ctx & { id: string }) {
  return (
    <>
      <Sky p={p} id={id} />
      <Hills p={p} r={r} />
      <path
        d="M250 404 V300 Q400 236 550 300 V404 Z"
        fill={p.wall}
        opacity="0.9"
      />
      <path
        d="M250 300 Q400 236 550 300"
        stroke={p.buildingShade}
        strokeWidth="6"
        fill="none"
      />
      <g opacity="0.65">
        {[0, 1, 2, 3].map((i) => (
          <path
            key={i}
            d={`M${290 + i * 66} 404 V310`}
            stroke={p.buildingShade}
            strokeWidth="3"
            opacity="0.5"
          />
        ))}
      </g>
      <Ground p={p} y={404} alt />
      <path d="M0 520 Q200 480 400 512 Q600 544 800 508 L800 600 L0 600 Z" fill={p.groundAlt} opacity="0.7" />
      <TreeRow p={p} r={r} baseY={430} step={36} scale={0.85} />
      <g opacity="0.7">
        {Array.from({ length: 14 }).map((_, i) => (
          <circle
            key={i}
            cx={60 + ((i * 137) % 700)}
            cy={470 + ((i * 53) % 90)}
            r={5 + (i % 3) * 2}
            fill={i % 3 === 0 ? p.accent : p.tree}
            opacity="0.6"
          />
        ))}
      </g>
    </>
  );
}

function SceneRoom() {
  return (
    <>
      <rect width="800" height="600" fill="#f2ece4" />
      <rect x="0" y="430" width="800" height="170" fill="#e2d5c6" />
      <rect x="470" y="90" width="250" height="220" rx="8" fill="url(#win-grad)" />
      <rect x="470" y="90" width="250" height="220" rx="8" fill="none" stroke="#cbbcab" strokeWidth="8" />
      <defs>
        <linearGradient id="win-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#cfe6f7" />
          <stop offset="100%" stopColor="#eaf5ff" />
        </linearGradient>
      </defs>
      <path d="M595 90 V310 M470 200 H720" stroke="#cbbcab" strokeWidth="7" />
      <g opacity="0.55">
        <circle cx="660" cy="150" r="34" fill="#ffe9b8" />
        <path d="M470 270 Q560 230 640 262 Q690 280 720 268 L720 310 H470 Z" fill="#a8cdb8" />
      </g>
      {/* 床 */}
      <rect x="70" y="300" width="300" height="150" rx="10" fill="#dfe8f2" />
      <rect x="70" y="300" width="300" height="44" rx="10" fill="#c9d9e9" />
      <rect x="86" y="286" width="120" height="42" rx="10" fill="#ffffff" opacity="0.92" />
      <rect x="70" y="440" width="300" height="16" rx="6" fill="#c2b3a4" />
      {/* 书桌 */}
      <rect x="410" y="360" width="250" height="14" rx="6" fill="#d4c3ae" />
      <rect x="420" y="374" width="12" height="90" fill="#c2b3a4" />
      <rect x="638" y="374" width="12" height="90" fill="#c2b3a4" />
      <rect x="470" y="322" width="70" height="38" rx="4" fill="#9fc2dd" />
      <rect x="556" y="330" width="46" height="30" rx="4" fill="#f3d6a8" />
      <ellipse cx="620" cy="352" rx="22" ry="8" fill="#c9d9e9" />
      {/* 绿植 */}
      <rect x="690" y="410" width="40" height="34" rx="5" fill="#d9b48c" />
      <ellipse cx="710" cy="392" rx="26" ry="22" fill="#7fae8c" />
      <ellipse cx="698" cy="378" rx="16" ry="14" fill="#96c0a0" />
      {/* 灯 */}
      <rect x="300" y="0" width="2" height="70" fill="#cbbcab" />
      <path d="M276 70 h50 l-10 20 h-30 Z" fill="#e8dcc8" />
    </>
  );
}

function SceneBowl() {
  return (
    <>
      <rect width="800" height="600" fill="#f7efe4" />
      <rect x="0" y="330" width="800" height="270" fill="#eddfcd" />
      <path d="M0 330 H800 V344 H0 Z" fill="#e0cfb8" opacity="0.8" />
      <ellipse cx="400" cy="420" rx="230" ry="58" fill="#dcc8ae" opacity="0.55" />
      <path d="M250 300 Q400 500 550 300 Z" fill="#ffffff" />
      <path d="M250 300 Q400 500 550 300" fill="none" stroke="#e3d3bd" strokeWidth="6" />
      <ellipse cx="400" cy="300" rx="150" ry="40" fill="#f6ead7" />
      <ellipse cx="400" cy="298" rx="126" ry="30" fill="#e9a86a" opacity="0.85" />
      <g opacity="0.8">
        <path d="M320 296 q30 -18 60 0 q-30 14 -60 0" fill="#f6d9a8" />
        <path d="M400 292 q34 -20 66 2 q-32 16 -66 -2" fill="#f0c98d" />
        <circle cx="356" cy="286" r="9" fill="#c9762f" />
        <circle cx="432" cy="300" r="8" fill="#c9762f" opacity="0.8" />
        <path d="M386 276 q10 -16 24 0" stroke="#7fae8c" strokeWidth="5" fill="none" strokeLinecap="round" />
      </g>
      <g stroke="#ffffff" strokeWidth="6" fill="none" opacity="0.5" strokeLinecap="round">
        <path d="M380 250 q14 -26 0 -48 q-14 -22 2 -44" />
        <path d="M420 254 q-14 -24 2 -46 q14 -22 0 -42" />
      </g>
      <g opacity="0.7">
        <rect x="620" y="330" width="86" height="12" rx="5" fill="#cbb59a" />
        <rect x="668" y="250" width="6" height="84" fill="#cbb59a" />
        <path d="M640 250 h64 l-8 -26 h-48 Z" fill="#e8d6bd" />
      </g>
      <circle cx="150" cy="420" r="26" fill="#e7d3b5" opacity="0.6" />
      <circle cx="196" cy="446" r="16" fill="#dcc4a2" opacity="0.6" />
      <rect x="90" y="250" width="4" height="140" fill="#cbb59a" opacity="0.5" />
    </>
  );
}

function SceneCup() {
  return (
    <>
      <rect width="800" height="600" fill="#f4f7fa" />
      <rect x="0" y="340" width="800" height="260" fill="#e8eef4" />
      <ellipse cx="400" cy="420" rx="210" ry="50" fill="#d7e2ec" opacity="0.7" />
      <path d="M300 200 h200 l-22 210 q-4 26 -30 26 h-96 q-26 0 -30 -26 Z" fill="#ffffff" />
      <path d="M300 200 h200 l-6 58 h-188 Z" fill="#dfe9f1" />
      <path d="M316 268 h168 l-16 132 q-3 18 -22 18 h-92 q-19 0 -22 -18 Z" fill="#c98a4f" opacity="0.85" />
      <rect x="330" y="150" width="10" height="80" rx="5" fill="#9fc2dd" transform="rotate(8 335 190)" />
      <g opacity="0.85">
        <circle cx="470" cy="300" r="16" fill="#ffffff" opacity="0.5" />
        <circle cx="440" cy="340" r="10" fill="#ffffff" opacity="0.4" />
      </g>
      <path d="M508 250 q46 6 40 52 q-6 44 -46 44" fill="none" stroke="#ffffff" strokeWidth="9" opacity="0.9" />
      <g opacity="0.6">
        <circle cx="180" cy="330" r="34" fill="#e3d2bd" />
        <circle cx="180" cy="330" r="24" fill="#d3bfa6" />
        <ellipse cx="620" cy="352" rx="40" ry="14" fill="#dfe9f1" />
      </g>
    </>
  );
}

/* ---------------- 电影感剪影场景（用于首屏与页面横幅） ---------------- */

interface HeroPalette {
  top: string;
  mid: string;
  low: string;
  sun: string;
  hillFar: string;
  hillNear: string;
  building: string;
  tree: string;
  ground: string;
  lamp: string;
}

const HERO_SKIES: Record<ArtMood, HeroPalette> = {
  dusk: {
    top: '#16233c',
    mid: '#3c5677',
    low: '#e9a878',
    sun: '#ffe3b8',
    hillFar: '#2b4767',
    hillNear: '#1d3450',
    building: '#132436',
    tree: '#182a3c',
    ground: '#0d1c2c',
    lamp: '#ffd29a',
  },
  day: {
    top: '#124a77',
    mid: '#4e93c4',
    low: '#d8ebf8',
    sun: '#fff8e2',
    hillFar: '#2f6b93',
    hillNear: '#1f4f72',
    building: '#143950',
    tree: '#153c52',
    ground: '#0f2a3b',
    lamp: '#ffe0b0',
  },
  spring: {
    top: '#20395c',
    mid: '#6d8cb2',
    low: '#f5d3c4',
    sun: '#fff0e2',
    hillFar: '#33557a',
    hillNear: '#223d5c',
    building: '#172c44',
    tree: '#17303f',
    ground: '#0f2233',
    lamp: '#ffdcb4',
  },
  summer: {
    top: '#123f63',
    mid: '#4a8fae',
    low: '#dcefe0',
    sun: '#fff8dd',
    hillFar: '#2b675f',
    hillNear: '#1c4945',
    building: '#12333a',
    tree: '#123029',
    ground: '#0c2422',
    lamp: '#ffe2ac',
  },
  autumn: {
    top: '#202b48',
    mid: '#6f6577',
    low: '#f0b079',
    sun: '#ffd9a4',
    hillFar: '#3a4460',
    hillNear: '#262f47',
    building: '#161e30',
    tree: '#1b2433',
    ground: '#0d1420',
    lamp: '#ffcb8a',
  },
  winter: {
    top: '#20364e',
    mid: '#7593ad',
    low: '#e4eef6',
    sun: '#fdfeff',
    hillFar: '#3b5570',
    hillNear: '#28415a',
    building: '#172636',
    tree: '#182a38',
    ground: '#0f1e2b',
    lamp: '#ffe6c2',
  },
};

function SceneHero({ mood, r, id }: { mood: ArtMood; r: () => number; id: string }) {
  const s = HERO_SKIES[mood] ?? HERO_SKIES.day;

  const stars = Array.from({ length: 22 }).map((_, i) => {
    const x = 20 + r() * 760;
    const y = 10 + r() * 190;
    const rad = 0.8 + r() * 1.4;
    return <circle key={`st${i}`} cx={x} cy={y} r={rad} fill="#ffffff" opacity={0.15 + r() * 0.45} />;
  });

  // 远处建筑剪影
  const buildings: JSX.Element[] = [];
  const blocks = [
    { x: 30, w: 92, h: 58 },
    { x: 136, w: 62, h: 44 },
    { x: 214, w: 116, h: 72 },
    { x: 348, w: 74, h: 52 },
    { x: 440, w: 104, h: 66 },
    { x: 562, w: 66, h: 46 },
    { x: 644, w: 132, h: 62 },
  ];
  blocks.forEach((b, bi) => {
    const y = 470 - b.h;
    buildings.push(<rect key={`b${bi}`} x={b.x} y={y} width={b.w} height={b.h} fill={s.building} opacity="0.95" />);
    // 屋顶细节
    if (bi % 2 === 0) {
      buildings.push(
        <rect key={`bt${bi}`} x={b.x + b.w * 0.4} y={y - 12} width={b.w * 0.2} height="12" fill={s.building} opacity="0.9" />,
      );
    }
    // 稀疏亮窗
    const cols = Math.max(2, Math.floor(b.w / 22));
    for (let c = 0; c < cols; c++) {
      for (let row = 0; row < 3; row++) {
        if (r() > 0.45) continue;
        buildings.push(
          <rect
            key={`w${bi}-${c}-${row}`}
            x={b.x + 8 + c * 20}
            y={y + 12 + row * 24}
            width="7"
            height="10"
            fill={s.lamp}
            opacity={0.5 + r() * 0.35}
          />,
        );
      }
    }
  });

  // 树冠剪影
  const trees: JSX.Element[] = [];
  for (let i = 0; i < 16; i++) {
    const x = -20 + i * 54 + r() * 20;
    const h = 30 + r() * 24;
    trees.push(
      <ellipse key={`tr${i}`} cx={x} cy={472 - h * 0.4} rx={24 + r() * 12} ry={h * 0.55} fill={s.tree} opacity="0.96" />,
    );
  }

  return (
    <>
      <defs>
        <linearGradient id={`hsky-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={s.top} />
          <stop offset="48%" stopColor={s.mid} />
          <stop offset="100%" stopColor={s.low} />
        </linearGradient>
        <radialGradient id={`hglow-${id}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={s.sun} stopOpacity="0.72" />
          <stop offset="55%" stopColor={s.sun} stopOpacity="0.22" />
          <stop offset="100%" stopColor={s.sun} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`hgrd-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={s.ground} stopOpacity="0.55" />
          <stop offset="100%" stopColor={s.ground} />
        </linearGradient>
      </defs>

      <rect width="800" height="600" fill={`url(#hsky-${id})`} />
      {stars}
      <ellipse cx="566" cy="418" rx="250" ry="140" fill={`url(#hglow-${id})`} />
      <circle cx="566" cy="418" r="30" fill={s.sun} opacity="0.5" />

      {/* 远山 */}
      <path
        d={`M0 436 C 120 408, 210 ${430 + r() * 8}, 320 422 C 430 414, 500 436, 600 428 C 690 422, 750 436, 800 430 L800 600 L0 600 Z`}
        fill={s.hillFar}
        opacity="0.5"
      />
      <path
        d={`M0 452 C 130 434, 240 456, 360 446 C 470 438, 560 458, 670 450 C 730 446, 770 452, 800 448 L800 600 L0 600 Z`}
        fill={s.hillNear}
        opacity="0.66"
      />

      {buildings}
      {trees}

      {/* 雾气 */}
      <rect x="0" y="436" width="800" height="40" fill="#ffffff" opacity="0.06" />
      <rect x="0" y="470" width="800" height="130" fill={`url(#hgrd-${id})`} />

      {/* 前景道路与灯 */}
      <path d="M312 600 L372 478 L428 478 L488 600 Z" fill="#ffffff" opacity="0.045" />
      <g opacity="0.9">
        <rect x="186" y="406" width="3" height="66" fill={s.building} />
        <circle cx="187.5" cy="404" r="5" fill={s.lamp} opacity="0.9" />
        <circle cx="187.5" cy="404" r="16" fill={s.lamp} opacity="0.1" />
        <rect x="612" y="402" width="3" height="70" fill={s.building} />
        <circle cx="613.5" cy="400" r="5" fill={s.lamp} opacity="0.9" />
        <circle cx="613.5" cy="400" r="16" fill={s.lamp} opacity="0.1" />
      </g>
    </>
  );
}

/* ---------------- 横幅全景（1600 × 420） ---------------- */

function SceneBanner({ mood, r, id }: { mood: ArtMood; r: () => number; id: string }) {
  const s = HERO_SKIES[mood] ?? HERO_SKIES.day;
  const H = 420;

  const stars = Array.from({ length: 26 }).map((_, i) => (
    <circle
      key={`bs${i}`}
      cx={20 + r() * 1560}
      cy={10 + r() * 120}
      r={0.7 + r() * 1.2}
      fill="#ffffff"
      opacity={0.12 + r() * 0.4}
    />
  ));

  const blocks: JSX.Element[] = [];
  const layout = [
    { x: 60, w: 150, h: 78 },
    { x: 236, w: 96, h: 56 },
    { x: 366, w: 176, h: 96 },
    { x: 570, w: 110, h: 66 },
    { x: 714, w: 158, h: 86 },
    { x: 902, w: 92, h: 58 },
    { x: 1026, w: 180, h: 100 },
    { x: 1236, w: 108, h: 64 },
    { x: 1370, w: 176, h: 84 },
  ];
  layout.forEach((b, bi) => {
    const y = H - 34 - b.h;
    blocks.push(<rect key={`bb${bi}`} x={b.x} y={y} width={b.w} height={b.h} fill={s.building} opacity="0.95" />);
    if (bi % 3 === 0) {
      blocks.push(
        <rect key={`bbt${bi}`} x={b.x + b.w * 0.42} y={y - 10} width={b.w * 0.16} height="10" fill={s.building} />,
      );
    }
    const cols = Math.max(2, Math.floor(b.w / 26));
    for (let c = 0; c < cols; c++) {
      for (let row = 0; row < 3; row++) {
        if (r() > 0.4) continue;
        blocks.push(
          <rect
            key={`bw${bi}-${c}-${row}`}
            x={b.x + 10 + c * 24}
            y={y + 10 + row * 20}
            width="7"
            height="9"
            fill={s.lamp}
            opacity={0.45 + r() * 0.4}
          />,
        );
      }
    }
  });

  const trees: JSX.Element[] = [];
  for (let i = 0; i < 30; i++) {
    const x = -30 + i * 56 + r() * 22;
    const h = 26 + r() * 20;
    trees.push(<ellipse key={`btree${i}`} cx={x} cy={H - 30 - h * 0.35} rx={24 + r() * 10} ry={h * 0.55} fill={s.tree} />);
  }

  return (
    <>
      <defs>
        <linearGradient id={`bsky-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={s.top} />
          <stop offset="55%" stopColor={s.mid} />
          <stop offset="100%" stopColor={s.low} />
        </linearGradient>
        <radialGradient id={`bglow-${id}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={s.sun} stopOpacity="0.7" />
          <stop offset="60%" stopColor={s.sun} stopOpacity="0.2" />
          <stop offset="100%" stopColor={s.sun} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`bgrd-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={s.ground} stopOpacity="0.5" />
          <stop offset="100%" stopColor={s.ground} />
        </linearGradient>
      </defs>

      <rect width="1600" height={H} fill={`url(#bsky-${id})`} />
      {stars}
      <ellipse cx="1180" cy="286" rx="330" ry="130" fill={`url(#bglow-${id})`} />

      <path
        d={`M0 320 C 180 292, 320 ${316 + r() * 8}, 520 306 C 720 296, 860 320, 1060 312 C 1240 304, 1400 320, 1600 308 L1600 ${H} L0 ${H} Z`}
        fill={s.hillFar}
        opacity="0.45"
      />
      <path
        d={`M0 340 C 200 320, 380 344, 600 334 C 800 326, 980 348, 1200 340 C 1380 334, 1500 344, 1600 338 L1600 ${H} L0 ${H} Z`}
        fill={s.hillNear}
        opacity="0.6"
      />

      {blocks}
      {trees}

      <rect x="0" y="322" width="1600" height="34" fill="#ffffff" opacity="0.055" />
      <rect x="0" y={H - 34} width="1600" height="34" fill={`url(#bgrd-${id})`} />
    </>
  );
}

function SceneMap({ p }: { p: Palette }) {  return (
    <>
      <rect width="800" height="600" fill="#eef4fa" />
      <g opacity="0.55">
        {Array.from({ length: 14 }).map((_, i) => (
          <path key={`v${i}`} d={`M${i * 60} 0 V600`} stroke="#dbe6f0" strokeWidth="1" />
        ))}
        {Array.from({ length: 10 }).map((_, i) => (
          <path key={`h${i}`} d={`M0 ${i * 60} H800`} stroke="#dbe6f0" strokeWidth="1" />
        ))}
      </g>
      <path
        d="M-20 430 C 120 380, 200 470, 320 440 C 440 410, 520 470, 640 430 C 720 404, 780 430, 820 418 L820 470 C 760 486, 700 460, 640 484 C 520 528, 430 470, 320 496 C 200 524, 110 460, -20 494 Z"
        fill={p.water}
        opacity="0.75"
      />
      <g fill={p.tree} opacity="0.35">
        <rect x="90" y="120" width="120" height="88" rx="10" />
        <rect x="250" y="90" width="150" height="110" rx="10" />
        <rect x="470" y="130" width="120" height="80" rx="10" />
        <rect x="620" y="100" width="110" height="100" rx="10" />
        <rect x="140" y="250" width="130" height="90" rx="10" />
        <rect x="330" y="240" width="140" height="100" rx="10" />
        <rect x="540" y="260" width="150" height="80" rx="10" />
      </g>
      <g fill="none" stroke="#ffffff" strokeWidth="9" strokeLinecap="round" opacity="0.95">
        <path d="M0 226 H800" />
        <path d="M400 0 V600" />
        <path d="M216 0 V600" />
        <path d="M600 0 V600" />
      </g>
      <g>
        <circle cx="400" cy="226" r="14" fill={p.accent} stroke="#ffffff" strokeWidth="4" />
        <circle cx="216" cy="392" r="10" fill="#ffffff" stroke={p.accent} strokeWidth="4" />
        <circle cx="600" cy="140" r="10" fill="#ffffff" stroke={p.accent} strokeWidth="4" />
      </g>
    </>
  );
}

/* ---------------- 对外组件 ---------------- */

const LANDSCAPE: Record<string, (c: Ctx & { id: string }) => JSX.Element> = {
  lake: SceneLake,
  library: SceneLibrary,
  arch: SceneArch,
  block: SceneBlock,
  trees: SceneTrees,
  plaza: ScenePlaza,
  bridge: SceneBridge,
  court: SceneCourt,
  stage: SceneStage,
  garden: SceneGarden,
};

export interface SceneArtProps {
  art: ArtSpec;
  className?: string;
  rounded?: boolean;
  /** 裁切对齐方式：横幅类容器用 bottom，保证地平线与建筑不被裁掉 */
  align?: 'center' | 'bottom';
}

export default function SceneArt({ art, className, align = 'center' }: SceneArtProps) {
  const autoId = useId().replace(/[:]/g, '');
  const mood = art.mood ?? 'day';
  const p = PALETTES[mood];
  const seed = art.seed ?? 7;

  const body = useMemo(() => {
    const r = rng(seed * 977 + 13);
    const ctx: Ctx & { id: string } = { p, r, uid: autoId, id: autoId };

    if (art.kind === 'banner') return <SceneBanner mood={mood} r={r} id={autoId} />;
    if (art.kind === 'hero') return <SceneHero mood={mood} r={r} id={autoId} />;
    if (art.kind === 'room') return <SceneRoom />;
    if (art.kind === 'bowl') return <SceneBowl />;
    if (art.kind === 'cup') return <SceneCup />;
    if (art.kind === 'map') return <SceneMap p={p} />;

    const render = LANDSCAPE[art.kind] ?? SceneLake;
    return render(ctx);
  }, [art.kind, seed, p, autoId]);

  return (
    <svg
      className={className}
      viewBox={art.kind === 'banner' ? '0 0 1600 420' : '0 0 800 600'}
      preserveAspectRatio={
        art.kind === 'banner' ? 'xMidYMid slice' : align === 'bottom' ? 'xMidYMax slice' : 'xMidYMid slice'
      }
      role="img"
      aria-hidden="true"
      focusable="false"
      style={{ display: 'block', width: '100%', height: '100%' }}
    >
      {body}
    </svg>
  );
}
