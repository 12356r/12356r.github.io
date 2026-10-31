import L from 'leaflet';
import {
  Compass,
  Crosshair,
  ExternalLink,
  Info,
  MapPin,
  MapPinned,
  Maximize2,
  RotateCcw,
  Search,
  X,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import PageBanner from '../components/PageBanner';
import Lightbox from '../components/Lightbox';
import SectionHead from '../components/SectionHead';
import VerificationBadge from '../components/VerificationBadge';
import { CAMPUSES, campusName } from '../data/campuses';
import { PLACES } from '../data/scenery';
import { SOURCES } from '../data/site';

/** 初始视角：郑州市区。校区与建筑的精确坐标尚未核验，因此不做任何标注。 */
const CITY_CENTER: [number, number] = [34.7466, 113.6254];
const STORAGE_KEY = 'zzu-explorer:coords';

type CoordMap = Record<string, { lat: number; lng: number }>;

type OverviewCampus = 'main' | 'north' | 'south';

/** 静态总览图：目前收录主校区、北校区与南校区 */
const OVERVIEW_MAPS: Record<
  OverviewCampus,
  { name: string; src: string; alt: string; desc: string; caption: string; credit: string }
> = {
  main: {
    name: '主校区',
    src: '/images/map/campus-map-main.jpg',
    alt: '郑州大学主校区标注地图：标出柳园、荷园、菊园、松园等生活区，体育场馆、教学区与主要道路',
    desc: '一张覆盖主校区的标注总览图：各宿舍园区、体育场馆、教学楼群、图书馆与主要道路都标在图里。点击图片可放大查看，或切换到「交互地图」按地点检索。',
    caption: '覆盖主校区的标注总览图。点击图片可放大查看。',
    credit: '主校区总览图',
  },
  north: {
    name: '北校区',
    src: '/images/map/campus-map-north.jpg',
    alt: '郑州大学北校区标注地图：标出南门、东门、体育馆与操场、图书馆、小礼堂、1 至 11 号楼、南餐厅与北餐厅、男寝楼群',
    desc: '北校区（郑州市文化路 97 号）的标注总览图：南门、东门、体育馆与操场、图书馆、小礼堂、教学楼与宿舍楼群都标在图里。点击图片可放大查看。',
    caption: '北校区标注总览图，方位以图内标注为准。点击图片可放大查看。',
    credit: '北校区总览图',
  },
  south: {
    name: '南校区',
    src: '/images/map/campus-map-south.jpg',
    alt: '郑州大学南校区标注地图：标出北门、南门、体育场、体育楼、行政楼、游泳馆、琴房、小礼堂，以及教 14 楼、教 2/3/12 楼、学 2—16 楼与教师西生活区',
    desc: '南校区（郑州市大学北路 75 号）的分区标注图：北门与南门、体育场与体育楼、行政楼、游泳馆、琴房、小礼堂，以及教 14 楼、教 2/3/12 楼、学 2—16 楼、教师西生活区等区域都标在图里。点击图片可放大查看。',
    caption: '南校区分区标注图，图内文字为竖排，放大后可看清。点击图片可放大查看。',
    credit: '南校区总览图',
  },
};

function readCoords(): CoordMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === 'object' && parsed ? (parsed as CoordMap) : {};
  } catch {
    return {};
  }
}

function writeCoords(next: CoordMap) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* 忽略写入失败 */
  }
}

const CATEGORIES = ['全部', '学习与教学场所', '自然景观', '校园公共空间', '校园文化场所', '校园建筑'] as const;

export default function MapPage() {
  const [params, setParams] = useSearchParams();
  const selectedId = params.get('place');

  const [q, setQ] = useState('');
  const [category, setCategory] = useState<string>('全部');
  const [campus, setCampus] = useState<string>('all');
  const [marking, setMarking] = useState(false);
  const [coords, setCoords] = useState<CoordMap>(() => readCoords());
  const [tileError, setTileError] = useState(false);
  const [hint, setHint] = useState<string | null>(null);
  const [overviewOpen, setOverviewOpen] = useState(false);
  const [overviewCampus, setOverviewCampus] = useState<OverviewCampus>(() => {
    const v = params.get('overview');
    return v === 'north' || v === 'south' ? v : 'main';
  });
  /** 默认先看整张总览图，需要检索地点时再切到交互地图 */
  const [view, setView] = useState<'overview' | 'interactive'>('overview');
  /** 交互地图只在切到该视图时才初始化，避免在隐藏容器里量到 0 尺寸 */
  const [mapReady, setMapReady] = useState(false);

  const mapEl = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerLayer = useRef<L.LayerGroup | null>(null);
  const stateRef = useRef<{ marking: boolean; selectedId: string | null }>({
    marking: false,
    selectedId: null,
  });

  const list = useMemo(() => {
    const term = q.trim().toLowerCase();
    return PLACES.filter((p) => {
      if (category !== '全部' && p.category !== category) return false;
      if (campus !== 'all' && p.campus !== campus) return false;
      if (!term) return true;
      return [p.name, p.summary, p.category, ...p.tags].join(' ').toLowerCase().includes(term);
    });
  }, [q, category, campus]);

  const selected = useMemo(() => PLACES.find((p) => p.id === selectedId) ?? null, [selectedId]);

  const setSelected = useCallback(
    (id: string | null) => {
      const next = new URLSearchParams(params);
      if (id) next.set('place', id);
      else next.delete('place');
      setParams(next, { replace: true });
    },
    [params, setParams],
  );

  /* ---------- 初始化地图 ---------- */
  useEffect(() => {
    if (view !== 'interactive') return;
    if (!mapEl.current || mapRef.current) return;

    const map = L.map(mapEl.current, {
      center: CITY_CENTER,
      zoom: 11,
      zoomControl: true,
      scrollWheelZoom: false,
      attributionControl: true,
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> 贡献者',
    });
    tiles.on('tileerror', () => setTileError(true));
    tiles.on('load', () => setTileError(false));
    tiles.addTo(map);

    markerLayer.current = L.layerGroup().addTo(map);
    mapRef.current = map;
    setMapReady(true);

    map.on('click', (e: L.LeafletMouseEvent) => {
      const { marking: isMarking, selectedId: target } = stateRef.current;
      if (!target) {
        setHint('请先在左侧列表中选择一个地点，再点击地图标注坐标。');
        return;
      }
      if (!isMarking) {
        setHint('如需标注坐标，请先点击右上角的「标注坐标」按钮。');
        return;
      }
      setCoords((prev) => {
        const next = { ...prev, [target]: { lat: e.latlng.lat, lng: e.latlng.lng } };
        writeCoords(next);
        return next;
      });
      setHint('坐标已保存到本机浏览器（未核验），可随时清除。');
    });

    return () => {
      map.remove();
      mapRef.current = null;
      markerLayer.current = null;
      setMapReady(false);
    };
  }, [view]);

  /* ---------- 同步当前状态给地图事件回调 ---------- */
  useEffect(() => {
    stateRef.current = { marking, selectedId: selectedId ?? null };
    const el = mapEl.current;
    if (el) el.style.cursor = marking ? 'crosshair' : '';
  }, [marking, selectedId]);

  /* ---------- 渲染标记 ---------- */
  useEffect(() => {
    const layer = markerLayer.current;
    if (!layer) return;    layer.clearLayers();

    const icon = (active: boolean) =>
      L.divIcon({
        className: 'map-pin',
        html: `<span class="map-pin__dot${active ? ' is-active' : ''}"></span>`,
        iconSize: [18, 18],
        iconAnchor: [9, 9],
      });

    list.forEach((place) => {
      const c = coords[place.id] ?? place.coords ?? null;
      if (!c) return;
      const marker = L.marker([c.lat, c.lng], {
        icon: icon(place.id === selectedId),
        title: place.name,
        keyboard: true,
        alt: place.name,
      });
      marker.bindTooltip(place.name, { direction: 'top', offset: [0, -8] });
      marker.on('click', () => setSelected(place.id));
      marker.addTo(layer);
    });
  }, [list, coords, selectedId, setSelected, mapReady]);

  /* ---------- 选中地点时移动到标记 ---------- */
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selected) return;
    const c = coords[selected.id] ?? selected.coords ?? null;
    if (c) {
      map.flyTo([c.lat, c.lng], Math.max(map.getZoom(), 16), { duration: 0.8 });
    }
  }, [selected, coords, mapReady]);

  /* ---------- 切回交互地图时重新计算尺寸（隐藏期间容器为 0） ---------- */
  useEffect(() => {
    if (view !== 'interactive') return;
    const t = window.setTimeout(() => mapRef.current?.invalidateSize(), 120);
    return () => window.clearTimeout(t);
  }, [view, mapReady]);

  const choosePlace = (id: string) => {
    setSelected(id);
    const place = PLACES.find((p) => p.id === id);
    const c = coords[id] ?? place?.coords ?? null;
    if (!c) {
      setHint('该地点暂无坐标，地图不标注。可打开「标注坐标」模式自行标注（仅保存在本机）。');
    } else {
      setHint(null);
    }
  };

  const resetView = () => {
    mapRef.current?.flyTo(CITY_CENTER, 11, { duration: 0.6 });
    setSelected(null);
    setHint(null);
    setMarking(false);
  };

  const clearLocal = () => {
    setCoords({});
    writeCoords({});
    setHint('已清除本机保存的全部标注。');
  };

  const annotatedCount = Object.keys(coords).length;

  return (
    <div className="map-page">
      <PageBanner
        art={{ kind: 'banner', seed: 3, mood: 'day' }}
        eyebrow="CAMPUS MAP"
        title="校园地图 · 探索郑大"
        desc="四个校区散在郑州城里，学校的年轮也跟着城市一起长。先在地图上认认路，再出门走走——归属感，常常就是从「我知道怎么走」开始的。"
        crumbs={[{ label: '校园地图' }]}
        height="md"
      />

      <div className="container">
        <div className="view-tabs-row">
          <div className="view-tabs" role="tablist" aria-label="地图视图">
            <button
              type="button"
              role="tab"
              aria-selected={view === 'overview'}
              className="view-tab"
              onClick={() => setView('overview')}
            >
              <MapPinned size={15} aria-hidden="true" />
              校园总览图
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={view === 'interactive'}
              className="view-tab"
              onClick={() => setView('interactive')}
            >
              <Compass size={15} aria-hidden="true" />
              交互地图
              <span className="view-tab__hint">按地点检索</span>
            </button>
          </div>
          <p className="view-tabs-note">总览图是静态标注地图；交互地图支持搜索、筛选与坐标标注。</p>
        </div>
      </div>

      <section className="section" hidden={view !== 'interactive'}>
        <div className="container">
          <div className="notice notice--warn" style={{ marginBottom: 22 }}>
            <Info size={16} aria-hidden="true" />
            <p>
              <strong>关于坐标：</strong>
              站点未获得经核验的校园建筑经纬度，故不在地图上标注任何未经确认的位置。你可以使用「标注坐标」模式手动记录，数据只保存在本机浏览器，不会被当作官方数据。
            </p>
          </div>

          <div className="toolbar">
            <label className="field" style={{ flex: 1, minWidth: 240 }}>
              <Search size={16} aria-hidden="true" />
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="搜索地点"
                aria-label="搜索地点"
              />
              {q ? (
                <button type="button" className="icon-btn icon-btn--sm" onClick={() => setQ('')} aria-label="清空关键词">
                  <X size={14} aria-hidden="true" />
                </button>
              ) : null}
            </label>
            <label className="field field--select">
              <span className="field__label">校区</span>
              <select value={campus} onChange={(e) => setCampus(e.target.value)} aria-label="按校区筛选">
                <option value="all">全部校区</option>
                {CAMPUSES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              className={`btn btn--sm ${marking ? '' : 'btn--ghost'}`}
              aria-pressed={marking}
              onClick={() => {
                if (!selected) {
                  setHint('请先选择一个地点，再开启标注模式。');
                  return;
                }
                setMarking((v) => !v);
                setHint(marking ? '已退出标注模式。' : '标注模式已开启：在地图上点击可为所选地点记录坐标。');
              }}
            >
              <Crosshair size={14} aria-hidden="true" />
              {marking ? '标注中…' : '标注坐标'}
            </button>
            <button type="button" className="btn btn--ghost btn--sm" onClick={resetView}>
              <RotateCcw size={14} aria-hidden="true" />
              重置视角
            </button>
          </div>

          <div className="chips" role="group" aria-label="按类别筛选" style={{ marginBottom: 20 }}>
            {CATEGORIES.map((c) => (
              <button key={c} type="button" className="chip" aria-pressed={category === c} onClick={() => setCategory(c)}>
                {c}
              </button>
            ))}
          </div>

          {hint ? (
            <div className="notice" style={{ marginBottom: 18 }} role="status">
              <Info size={16} aria-hidden="true" />
              <p>{hint}</p>
              <button type="button" className="icon-btn icon-btn--sm" onClick={() => setHint(null)} aria-label="关闭提示">
                <X size={14} aria-hidden="true" />
              </button>
            </div>
          ) : null}

          <div className="map-layout">
            <aside className="map-list" aria-label="地点列表">
              <div className="map-list__head">
                <h2>地点（{list.length}）</h2>
                {selected ? (
                  <button type="button" className="btn btn--ghost btn--sm" onClick={resetView}>
                    <Maximize2 size={13} aria-hidden="true" />
                    全部地点
                  </button>
                ) : null}
              </div>
              {list.length === 0 ? (
                <p className="map-list__empty">没有符合条件的地点，试试清空筛选。</p>
              ) : (
                <ul className="map-list__items">
                  {list.map((p) => {
                    const c = coords[p.id] ?? p.coords ?? null;
                    return (
                      <li key={p.id}>
                        <button
                          type="button"
                          className={`map-list__item ${p.id === selectedId ? 'is-active' : ''}`}
                          onClick={() => choosePlace(p.id)}
                          aria-pressed={p.id === selectedId}
                        >
                          <span className="map-list__name">
                            {p.name}
                            {c ? (
                              <span className="map-list__dot" title="已有坐标" aria-label="已有坐标" />
                            ) : (
                              <span className="map-list__pending">暂无坐标</span>
                            )}
                          </span>
                          <span className="map-list__meta">
                            {campusName(p.campus)} · {p.category}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
              {annotatedCount > 0 ? (
                <div className="map-list__foot">
                  <p className="muted">本机已标注 {annotatedCount} 个地点</p>
                  <button type="button" className="btn btn--ghost btn--sm" onClick={clearLocal}>
                    清除标注
                  </button>
                </div>
              ) : null}
            </aside>

            <div className="map-shell">
              <div ref={mapEl} className="map-canvas" role="application" aria-label="校园地图" />              {annotatedCount === 0 ? (
                <div className="map-empty-hint">
                  <MapPin size={18} aria-hidden="true" />
                  <p>
                    <strong>地图上暂无经核验的地点坐标。</strong>
                    在左侧选择一个地点后，可用「标注坐标」在地图上记录位置，数据仅保存在本机。
                  </p>
                </div>
              ) : null}
              {tileError ? (
                <div className="map-fallback" role="alert">
                  <p>
                    <strong>地图底图加载失败。</strong>
                    可能是网络或地图服务暂时不可用，页面其他内容不受影响。
                  </p>
                  <a
                    className="btn btn--sm"
                    href="https://www.openstreetmap.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    打开 OpenStreetMap
                    <ExternalLink size={13} aria-hidden="true" />
                  </a>
                  <a className="btn btn--ghost btn--sm" href={SOURCES.campusMapOfficial.url} target="_blank" rel="noopener noreferrer">
                    学校官方校园地图
                  </a>
                </div>
              ) : null}
              <div className="map-legend">
                <span>
                  <span className="map-pin__dot" /> 已标注地点
                </span>
                <span className="muted">底图 © OpenStreetMap 贡献者</span>
              </div>
            </div>
          </div>

          {selected ? (
            <div className="map-detail" role="region" aria-label="所选地点详情">
              <div className="map-detail__head">
                <div>
                  <p className="map-detail__meta">
                    {campusName(selected.campus)} · {selected.category}
                  </p>
                  <h2>{selected.name}</h2>
                </div>
                <div className="map-detail__badges">
                  <VerificationBadge status={selected.verification} compact />
                  <button type="button" className="icon-btn icon-btn--sm" onClick={() => setSelected(null)} aria-label="关闭详情">
                    <X size={16} aria-hidden="true" />
                  </button>
                </div>
              </div>
              <p>{selected.summary}</p>
              <div className="map-detail__foot">
                <span className="map-detail__coord">
                  <MapPin size={14} aria-hidden="true" />
                  {coords[selected.id]
                    ? `本机标注：${coords[selected.id].lat.toFixed(5)}, ${coords[selected.id].lng.toFixed(5)}（未核验）`
                    : selected.coords
                      ? '已标注坐标'
                      : '暂无坐标，地图暂不标注'}
                </span>
                <Link className="link-arrow" to={`/scenery/${selected.id}`}>
                  查看地点详情
                </Link>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {/* 校园总览图（静态标注地图，默认视图） */}
      <section className="section section--soft" aria-labelledby="overview-title" hidden={view !== 'overview'}>
        <div className="container">
          <SectionHead
            eyebrow="CAMPUS OVERVIEW"
            title={`${OVERVIEW_MAPS[overviewCampus].name}总览图`}
            desc={OVERVIEW_MAPS[overviewCampus].desc}
            action={
              <button type="button" className="btn btn--ghost btn--sm" onClick={() => setOverviewOpen(true)}>
                <Maximize2 size={14} aria-hidden="true" />
                查看大图
              </button>
            }
          />

          <div className="map-campus-tabs" role="tablist" aria-label="总览图校区">
            {(['main', 'north', 'south'] as const).map((key) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={overviewCampus === key}
                className="map-campus-tab"
                onClick={() => setOverviewCampus(key)}
              >
                {OVERVIEW_MAPS[key].name}
              </button>
            ))}
          </div>

          <figure className="map-figure">
            <button
              type="button"
              className="map-figure__btn"
              onClick={() => setOverviewOpen(true)}
              aria-label={`放大查看${OVERVIEW_MAPS[overviewCampus].name}地图`}
            >
              <img
                src={OVERVIEW_MAPS[overviewCampus].src}
                alt={OVERVIEW_MAPS[overviewCampus].alt}
                fetchPriority="high"
                decoding="async"
              />
            </button>
            <figcaption>{OVERVIEW_MAPS[overviewCampus].caption}</figcaption>
          </figure>
        </div>
      </section>

      <Lightbox
        open={overviewOpen}
        onClose={() => setOverviewOpen(false)}
        label={`${OVERVIEW_MAPS[overviewCampus].name}地图`}
      >
        <div className="lightbox__map">
          <img src={OVERVIEW_MAPS[overviewCampus].src} alt={`${OVERVIEW_MAPS[overviewCampus].name}标注地图（大图）`} />
        </div>
        <p className="lightbox__caption" style={{ marginTop: 12 }}>
          {OVERVIEW_MAPS[overviewCampus].credit}
        </p>
      </Lightbox>
    </div>
  );
}
