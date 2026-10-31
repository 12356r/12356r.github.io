import { useId } from 'react';

/**
 * PlantArt —— 本地绘制的植物插画（非照片）。
 * 六种形态：扇形叶（银杏）、阔叶树冠、针叶、水生、地被、藤本。
 * 每株植物通过 palette 改变叶色与花色，图形本身不使用任何外部图片。
 */

export type PlantForm = 'fan' | 'canopy' | 'conifer' | 'aquatic' | 'ground' | 'vine';

export interface PlantPalette {
  bg: string;
  leaf: string;
  leafDark: string;
  flower: string;
  flowerDeep: string;
}

export interface PlantArtSpec {
  form: PlantForm;
  palette: PlantPalette;
  seed?: number;
  /** 针叶树冠形：柱状（水杉）或宽塔形（油松） */
  habit?: 'columnar' | 'broad';
  /** 地被/草本的花序形态：花朵或穗状（芦苇） */
  inflorescence?: 'flower' | 'plume';
}

function rosette(
  cx: number,
  cy: number,
  r: number,
  fill: string,
  deep: string,
  petals = 5,
  rot = 0,
  key = 'r',
): JSX.Element[] {
  const items: JSX.Element[] = [];
  for (let i = 0; i < petals; i++) {
    const a = ((Math.PI * 2) / petals) * i + rot;
    const x = cx + Math.cos(a) * r * 0.6;
    const y = cy + Math.sin(a) * r * 0.6;
    items.push(
      <ellipse
        key={`${key}-p${i}`}
        cx={x}
        cy={y}
        rx={r * 0.52}
        ry={r * 0.38}
        fill={fill}
        transform={`rotate(${(a * 180) / Math.PI} ${x} ${y})`}
      />,
    );
  }
  items.push(<circle key={`${key}-c`} cx={cx} cy={cy} r={r * 0.2} fill={deep} />);
  return items;
}

export default function PlantArt({ art }: { art: PlantArtSpec }) {
  const raw = useId().replace(/[:]/g, '');
  const { palette: p, form, seed = 3 } = art;

  const parts: JSX.Element[] = [];
  let key = 0;
  const add = (el: JSX.Element) => parts.push(<g key={key++}>{el}</g>);
  const rand = (n: number) => ((Math.sin(seed * 12.9898 + n * 78.233) * 43758.5453) % 1 + 1) % 1;

  if (form === 'fan') {
    add(<path d="M300 400 C 297 344, 300 306, 302 274" stroke={p.leafDark} strokeWidth="8" fill="none" strokeLinecap="round" />);
    add(<path d="M302 330 C 276 300, 256 274, 244 240" stroke={p.leafDark} strokeWidth="5" fill="none" strokeLinecap="round" />);
    add(<path d="M302 318 C 326 288, 344 262, 356 232" stroke={p.leafDark} strokeWidth="5" fill="none" strokeLinecap="round" />);
    add(<path d="M302 300 C 300 250, 300 208, 300 176" stroke={p.leafDark} strokeWidth="5" fill="none" strokeLinecap="round" />);

    const fan = (cx: number, cy: number, s: number, rot: number) => (
      <g transform={`translate(${cx} ${cy}) rotate(${rot}) scale(${s})`}>
        <path
          d="M0 0 C 4 -38, 34 -56, 60 -48 C 66 -64, 92 -58, 94 -32 C 96 -6, 62 12, 28 12 C 12 12, 2 8, 0 0 Z"
          fill={p.leaf}
        />
        <path d="M2 2 C 28 -6, 60 -12, 92 -28" stroke={p.leafDark} strokeWidth="2.4" fill="none" opacity="0.45" />
        <path d="M46 -50 L48 -8 M68 -56 L72 -18" stroke={p.leafDark} strokeWidth="1.8" opacity="0.3" />
      </g>
    );
    add(fan(238, 236, 1.15, -128));
    add(fan(252, 258, 1.0, -104));
    add(fan(296, 172, 1.25, -46));
    add(fan(306, 186, 1.05, -8));
    add(fan(360, 228, 1.1, 34));
    add(fan(344, 258, 0.92, 62));
    add(fan(300, 226, 0.9, -20));
    add(<ellipse cx="330" cy="292" rx="10" ry="12" fill={p.flower} opacity="0.85" />);
    add(<ellipse cx="352" cy="308" rx="8" ry="10" fill={p.flower} opacity="0.65" />);
  } else if (form === 'conifer') {
    const columnar = art.habit === 'columnar';
    const maxHalf = columnar ? 62 : 132;
    add(<path d="M300 404 L300 108" stroke={p.leafDark} strokeWidth="8" strokeLinecap="round" fill="none" />);
    for (let k = 0; k < 7; k++) {
      const y = (columnar ? 168 : 176) + k * (columnar ? 30 : 32);
      const half = maxHalf - k * (columnar ? 6 : 14);
      const drop = columnar ? 22 : 26;
      add(
        <path
          d={`M300 ${y - 20} C ${300 - half * 0.45} ${y - 6}, ${300 - half} ${y + drop * 0.5}, ${300 - half} ${y + drop} Q 300 ${y + drop + 10} ${300 + half} ${y + drop} C ${300 + half} ${y + drop * 0.5}, ${300 + half * 0.45} ${y - 6}, 300 ${y - 20} Z`}
          fill={k % 2 ? p.leaf : p.leafDark}
          opacity="0.96"
        />,
      );
      // 边缘的针叶短刺
      for (let n = 0; n < 6; n++) {
        const t = (n + 1) / 7;
        add(
          <path
            key={`n${k}-${n}`}
            d={`M${300 - half * t} ${y + drop * (0.35 + t * 0.5)} l -7 ${columnar ? 9 : 12}`}
            stroke={p.leaf}
            strokeWidth="2.2"
            strokeLinecap="round"
            opacity="0.75"
          />,
        );
        add(
          <path
            key={`m${k}-${n}`}
            d={`M${300 + half * t} ${y + drop * (0.35 + t * 0.5)} l 7 ${columnar ? 9 : 12}`}
            stroke={p.leaf}
            strokeWidth="2.2"
            strokeLinecap="round"
            opacity="0.75"
          />,
        );
      }
    }
    add(<ellipse cx="300" cy="146" rx="8" ry="15" fill={p.flower} opacity="0.9" />);
    add(<ellipse cx={300 + maxHalf * 0.5} cy="300" rx="6" ry="11" fill={p.flowerDeep} opacity="0.6" />);
    add(<ellipse cx={300 - maxHalf * 0.55} cy="336" rx="6" ry="11" fill={p.flowerDeep} opacity="0.6" />);
  } else if (form === 'aquatic') {
    add(
      <g>
        <rect x="0" y="286" width="600" height="164" fill={`url(#w-${raw})`} />
        <rect x="0" y="286" width="600" height="4" fill="#ffffff" opacity="0.35" />
        {[0, 1, 2, 3, 4].map((k) => (
          <path
            key={k}
            d={`M${40 + k * 130} ${330 + k * 22} q 44 -12 88 0`}
            stroke="#ffffff"
            strokeWidth="2"
            fill="none"
            opacity="0.38"
          />
        ))}
      </g>,
    );
    const pad = (cx: number, cy: number, r: number, rot: number) => (
      <g transform={`rotate(${rot} ${cx} ${cy})`}>
        <ellipse cx={cx} cy={cy} rx={r} ry={r * 0.5} fill={p.leaf} />
        <ellipse cx={cx - r * 0.18} cy={cy - r * 0.12} rx={r * 0.55} ry={r * 0.18} fill={p.leafDark} opacity="0.28" />
        <path d={`M${cx} ${cy} L${cx + r * 0.92} ${cy - r * 0.16}`} stroke="#ffffff" strokeWidth="3" opacity="0.55" />
      </g>
    );
    add(pad(168, 356, 96, -10));
    add(pad(430, 384, 78, 14));
    add(pad(300, 412, 88, 4));
    add(
      <g>
        <path d="M300 318 L300 276" stroke={p.leafDark} strokeWidth="6" strokeLinecap="round" />
        <g transform="translate(0 -10)">
          {rosette(300, 246, 64, p.flower, p.flowerDeep, 12, 0.15, 'fl').map((el) => el)}
        </g>
        <ellipse cx="300" cy="236" rx="16" ry="11" fill={p.flowerDeep} opacity="0.85" />
      </g>,
    );
    add(
      <g>
        {[0, 1, 2].map((k) => {
          const x = 148 + k * 26;
          const top = 250 - k * 20;
          return (
            <g key={`l${k}`}>
              <path d={`M${x} 302 L${x + 4} ${top}`} stroke={p.leafDark} strokeWidth="3.4" strokeLinecap="round" />
              <ellipse cx={x + 5} cy={top - 6} rx="6" ry="15" fill={p.leaf} transform={`rotate(${-10 + k * 7} ${x + 5} ${top - 6})`} />
            </g>
          );
        })}
        {[0, 1, 2].map((k) => {
          const x = 452 - k * 24;
          const top = 254 - k * 16;
          return (
            <g key={`r${k}`}>
              <path d={`M${x} 302 L${x - 4} ${top}`} stroke={p.leafDark} strokeWidth="3.4" strokeLinecap="round" />
              <ellipse cx={x - 5} cy={top - 5} rx="6" ry="13" fill={p.leafDark} transform={`rotate(${9 - k * 6} ${x - 5} ${top - 5})`} />
            </g>
          );
        })}
      </g>,
    );
  } else if (form === 'vine') {
    add(
      <path
        d="M140 408 C 208 336, 168 288, 252 250 C 330 214, 300 156, 378 132 C 424 118, 450 98, 476 62"
        stroke={p.leafDark}
        strokeWidth="7"
        fill="none"
        strokeLinecap="round"
      />,
    );
    for (let k = 0; k < 10; k++) {
      const t = k / 9;
      const x = 150 + t * 316 + Math.sin(k * 1.9) * 22;
      const y = 400 - t * 300 + Math.cos(k * 1.4) * 20;
      add(
        <ellipse
          cx={x}
          cy={y}
          rx={28 - t * 6}
          ry={14 - t * 2}
          fill={k % 2 ? p.leaf : p.leafDark}
          opacity="0.94"
          transform={`rotate(${-34 + k * 16} ${x} ${y})`}
        />,
      );
    }
    const trumpet = (cx: number, cy: number, s: number) => (
      <g transform={`translate(${cx} ${cy}) scale(${s})`}>
        <path d="M0 0 C -14 -18, -36 -28, -40 -54 C -24 -60, -8 -54, 0 -40 C 8 -54, 24 -60, 40 -54 C 36 -28, 14 -18, 0 0 Z" fill={p.flower} />
        <path d="M0 -40 L0 -68" stroke={p.flowerDeep} strokeWidth="4" />
        <circle cx="0" cy="-70" r="5" fill={p.flowerDeep} />
        <circle cx="-12" cy="-46" r="3" fill={p.flowerDeep} opacity="0.5" />
        <circle cx="12" cy="-46" r="3" fill={p.flowerDeep} opacity="0.5" />
      </g>
    );
    add(trumpet(230, 262, 1.5));
    add(trumpet(352, 172, 1.3));
    add(trumpet(462, 92, 1.05));
  } else if (form === 'ground') {
    const blade = (x: number, h: number, bend: number, color: string, opacity = 1, w = 7) => (
      <path
        d={`M${x} 398 C ${x + bend * 0.3} ${398 - h * 0.5}, ${x + bend} ${398 - h * 0.85}, ${x + bend * 1.35} ${398 - h}`}
        stroke={color}
        strokeWidth={w}
        strokeLinecap="round"
        fill="none"
        opacity={opacity}
      />
    );
    for (let k = 0; k < 13; k++) {
      const x = 156 + k * 24;
      const h = 110 + rand(k) * 150;
      add(blade(x, h, (rand(k + 7) - 0.5) * 92, k % 2 ? p.leaf : p.leafDark, 0.95));
    }
    if (art.inflorescence === 'plume') {
      for (let k = 0; k < 7; k++) {
        const cx = 178 + k * 42;
        const top = 148 - rand(k + 20) * 46;
        add(<path d={`M${cx} 398 C ${cx + 4} ${top + 70}, ${cx} ${top + 40}, ${cx} ${top}`} stroke={p.leafDark} strokeWidth="3.2" fill="none" />);
        add(<ellipse cx={cx} cy={top} rx="11" ry="34" fill={p.flower} opacity="0.92" />);
        for (let n = 0; n < 7; n++) {
          const yy = top - 24 + n * 8;
          add(
            <path
              key={`h${k}-${n}`}
              d={`M${cx - 9} ${yy} q -9 -4 -13 3 M${cx + 9} ${yy} q 9 -4 13 3`}
              stroke={p.flower} 
              strokeWidth="1.6"
              fill="none"
              opacity="0.7"
            />,
          );
        }
      }
    } else {
      for (let k = 0; k < 6; k++) {
        const cx = 182 + k * 48;
        const cy = 200 - rand(k + 20) * 62;
        add(<path d={`M${cx} 398 C ${cx} ${cy + 44}, ${cx} ${cy + 22}, ${cx} ${cy}`} stroke={p.leafDark} strokeWidth="3.4" fill="none" />);
        add(<g>{rosette(cx, cy, 30, p.flower, p.flowerDeep, 5, k * 0.3, `g${k}`).map((el) => el)}</g>);
      }
    }
  } else {
    // 阔叶树冠：玉兰 / 桂花 / 紫薇 / 木槿 / 海桐
    add(<path d="M296 404 C 300 356, 300 322, 300 288" stroke={p.leafDark} strokeWidth="13" strokeLinecap="round" fill="none" />);
    add(<path d="M300 316 C 266 292, 240 272, 222 240" stroke={p.leafDark} strokeWidth="7" fill="none" strokeLinecap="round" />);
    add(<path d="M300 306 C 334 282, 358 262, 376 232" stroke={p.leafDark} strokeWidth="7" fill="none" strokeLinecap="round" />);
    add(<path d="M300 292 C 300 250, 300 214, 300 182" stroke={p.leafDark} strokeWidth="6" fill="none" strokeLinecap="round" />);

    const crown: Array<[number, number, number, number]> = [
      [300, 158, 66, 0],
      [232, 190, 54, 1],
      [368, 196, 52, 1],
      [266, 226, 46, 0],
      [336, 228, 44, 1],
      [300, 208, 54, 0],
      [404, 236, 36, 1],
      [196, 232, 36, 0],
    ];
    crown.forEach(([cx, cy, r, dark]) => {
      add(<ellipse cx={cx} cy={cy} rx={r} ry={r * 0.8} fill={dark ? p.leafDark : p.leaf} opacity="0.96" />);
      add(<ellipse cx={cx - r * 0.28} cy={cy - r * 0.34} rx={r * 0.46} ry={r * 0.3} fill="#ffffff" opacity="0.1" />);
    });

    const flowers: Array<[number, number, number]> = [
      [262, 176, 17],
      [312, 152, 20],
      [352, 200, 16],
      [286, 224, 15],
      [336, 232, 14],
      [236, 236, 13],
      [372, 250, 12],
    ];
    flowers.forEach(([cx, cy, r], k) => {
      add(<g>{rosette(cx, cy, r, p.flower, p.flowerDeep, 5, k * 0.4, `c${k}`).map((el) => el)}</g>);
    });
  }

  return (
    <svg
      viewBox="0 0 600 450"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-hidden="true"
      focusable="false"
      style={{ display: 'block', width: '100%', height: '100%' }}
    >
      <defs>
        <linearGradient id={`bg-${raw}`} x1="0" y1="0" x2="0.35" y2="1">
          <stop offset="0%" stopColor={p.bg} />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.6" />
        </linearGradient>
        <linearGradient id={`w-${raw}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a9cfe4" />
          <stop offset="100%" stopColor="#7aafcc" />
        </linearGradient>
      </defs>

      <rect width="600" height="450" fill={`url(#bg-${raw})`} />
      {/* 标本盘：一圈极淡的环形线，给插画一个“图鉴”的框架 */}
      <circle cx="300" cy="234" r="186" fill="#ffffff" opacity="0.45" />
      <circle cx="300" cy="234" r="186" fill="none" stroke={p.leafDark} strokeWidth="1" opacity="0.16" />
      <circle cx="300" cy="234" r="170" fill="none" stroke={p.leafDark} strokeWidth="0.8" opacity="0.1" strokeDasharray="2 6" />
      <ellipse cx="300" cy="406" rx="150" ry="15" fill="rgba(31, 61, 45, 0.14)" />
      {parts}
    </svg>
  );
}
