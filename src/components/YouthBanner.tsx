/**
 * 板块横幅插画：青春正能量 · 红色风格。
 *
 * 设计要素：朝霞渐变的红橙天空、初升的太阳与光芒、红旗与丝带、
 * 校园天际线、飞鸟与星芒——用在没有实景照片的板块页顶部。
 */

/** 五角星路径（外接圆半径 r，尖角朝上） */
function starPath(cx: number, cy: number, r: number): string {
  const pts: string[] = [];
  for (let i = 0; i < 10; i += 1) {
    const radius = i % 2 === 0 ? r : r * 0.42;
    const angle = -Math.PI / 2 + (i * Math.PI) / 5;
    pts.push(`${(cx + radius * Math.cos(angle)).toFixed(1)} ${(cy + radius * Math.sin(angle)).toFixed(1)}`);
  }
  return `M${pts.join(' L')} Z`;
}

export default function YouthBanner() {
  /* 固定的星芒位置，保证每次渲染一致 */
  const sparkles = [
    [180, 120, 7],
    [420, 96, 5],
    [640, 150, 6],
    [880, 110, 4],
    [1050, 210, 6],
    [1320, 150, 5],
    [1450, 260, 7],
    [300, 300, 5],
    [760, 330, 4],
    [1180, 380, 5],
  ];

  /* 校园天际线：x, 宽, 高, 顶檐 */
  const buildings = [
    [40, 88, 120, 10],
    [140, 62, 168, 0],
    [214, 104, 138, 14],
    [330, 70, 190, 0],
    [410, 96, 150, 10],
    [520, 58, 176, 0],
    [590, 110, 130, 12],
    [712, 76, 196, 0],
    [800, 92, 142, 10],
    [904, 64, 180, 0],
    [980, 104, 156, 12],
    [1096, 72, 200, 0],
    [1180, 96, 148, 10],
    [1288, 66, 184, 0],
    [1366, 100, 140, 12],
    [1478, 82, 168, 0],
  ];

  return (
    <svg
      className="youth-banner"
      viewBox="0 0 1600 700"
      preserveAspectRatio="xMidYMid slice"
      role="presentation"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="yb-sky" x1="0" y1="0" x2="0.25" y2="1">
          <stop offset="0%" stopColor="#6f1712" />
          <stop offset="34%" stopColor="#a82a20" />
          <stop offset="62%" stopColor="#d75336" />
          <stop offset="82%" stopColor="#ef8f4e" />
          <stop offset="100%" stopColor="#f8bd7a" />
        </linearGradient>

        <radialGradient id="yb-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#ffe9c2" stopOpacity="0.9" />
          <stop offset="45%" stopColor="#ffc98a" stopOpacity="0.42" />
          <stop offset="100%" stopColor="#ff9f5a" stopOpacity="0" />
        </radialGradient>

        <linearGradient id="yb-hill-far" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#b4392a" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#8f271d" stopOpacity="0.95" />
        </linearGradient>

        <linearGradient id="yb-hill-near" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7d2118" />
          <stop offset="100%" stopColor="#5b150f" />
        </linearGradient>

        <linearGradient id="yb-flag" x1="0" y1="0" x2="1" y2="0.4">
          <stop offset="0%" stopColor="#e23a2c" />
          <stop offset="60%" stopColor="#d12a1e" />
          <stop offset="100%" stopColor="#b31f16" />
        </linearGradient>

        <linearGradient id="yb-ribbon" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="35%" stopColor="#ffe2bd" stopOpacity="0.22" />
          <stop offset="70%" stopColor="#ffffff" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* 天空 */}
      <rect width="1600" height="700" fill="url(#yb-sky)" />

      {/* 太阳光晕 */}
      <circle cx="1150" cy="250" r="420" fill="url(#yb-glow)" />

      {/* 光芒 */}
      <g stroke="#fff1d0" strokeWidth="3" opacity="0.14">
        <path d="M1150 250 L560 40" />
        <path d="M1150 250 L760 20" />
        <path d="M1150 250 L980 10" />
        <path d="M1150 250 L1420 40" />
        <path d="M1150 250 L1540 120" />
        <path d="M1150 250 L1560 300" />
        <path d="M1150 250 L1500 470" />
      </g>

      {/* 太阳 */}
      <circle cx="1150" cy="250" r="98" fill="#ffdfae" />
      <circle cx="1150" cy="250" r="132" fill="#ffd9a0" opacity="0.22" />

      {/* 飞鸟 */}
      <g stroke="#5b150f" strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.55">
        <path d="M905 150 q20 -16 38 0 q18 -16 38 0" />
        <path d="M1005 205 q16 -13 30 0 q14 -13 30 0" />
        <path d="M845 220 q13 -11 25 0 q12 -11 25 0" />
      </g>

      {/* 远山 */}
      <path
        d="M0 470 C120 420 210 466 320 440 C440 412 520 462 640 442 C760 422 830 470 950 448 C1070 426 1160 468 1280 446 C1390 426 1480 460 1600 438 L1600 700 L0 700 Z"
        fill="url(#yb-hill-far)"
      />

      {/* 校园天际线 */}
      <g>
        {buildings.map(([x, w, h, roof], i) => {
          const y = 660 - h;
          return (
            <g key={`${x}-${i}`}>
              {roof > 0 ? (
                <rect x={x - 6} y={y - roof} width={w + 12} height={roof} fill="#4d110d" opacity="0.9" />
              ) : null}
              <rect x={x} y={y} width={w} height={h} fill="#3f0e0a" opacity="0.92" />
              {/* 窗户 */}
              {Array.from({ length: Math.floor(h / 34) }).map((_, row) =>
                Array.from({ length: Math.max(1, Math.floor(w / 26)) }).map((__, col) => {
                  const on = (row * 7 + col * 3 + i) % 4 !== 0;
                  return (
                    <rect
                      key={`${row}-${col}`}
                      x={x + 10 + col * 26}
                      y={y + 16 + row * 34}
                      width="9"
                      height="11"
                      fill={on ? '#ffd79b' : '#6b221a'}
                      opacity={on ? 0.86 : 0.6}
                    />
                  );
                }),
              )}
            </g>
          );
        })}
      </g>

      {/* 近景山丘 */}
      <path
        d="M0 610 C160 578 260 620 380 600 C520 576 600 624 740 606 C880 588 960 630 1100 610 C1240 590 1330 626 1460 606 C1540 594 1570 602 1600 598 L1600 700 L0 700 Z"
        fill="url(#yb-hill-near)"
      />

      {/* 丝带 */}
      <path
        d="M-40 636 C240 588 420 664 700 626 C980 588 1180 660 1660 606 L1660 700 L-40 700 Z"
        fill="url(#yb-ribbon)"
      />

      {/* 红绸带 */}
      <path
        d="M1600 60 C1400 150 1290 260 1170 360 C1080 436 980 470 860 500 L860 560 C1010 528 1128 486 1230 400 C1350 300 1460 190 1600 130 Z"
        fill="#ffffff"
        opacity="0.13"
      />
      <path
        d="M1600 110 C1420 200 1320 300 1210 392 C1120 466 1030 500 920 526 L920 552 C1050 524 1150 484 1246 406 C1360 314 1470 210 1600 160 Z"
        fill="#ffe3b8"
        opacity="0.2"
      />

      {/* 星群 */}
      {[
        [1318, 148, 24],
        [1404, 212, 15],
        [1502, 148, 11],
        [1258, 238, 8],
        [1440, 96, 8],
      ].map(([x, y, r], i) => (
        <path key={i} d={starPath(x, y, r)} fill="#ffd873" opacity={i === 0 ? 0.95 : 0.72} />
      ))}

      {/* 星芒 */}
      {sparkles.map(([x, y, s], i) => (
        <g key={i} opacity={0.36 + (i % 3) * 0.14} fill="#fff3d6">
          <path d={`M${x} ${y - s} L${x + s * 0.28} ${y - s * 0.28} L${x + s} ${y} L${x + s * 0.28} ${y + s * 0.28} L${x} ${y + s} L${x - s * 0.28} ${y + s * 0.28} L${x - s} ${y} L${x - s * 0.28} ${y - s * 0.28} Z`} />
        </g>
      ))}
    </svg>
  );
}
