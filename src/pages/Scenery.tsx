import { ExternalLink, Info, Leaf, Mountain, RotateCcw, Search, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import EduSpot from '../components/EduSpot';
import PageBanner from '../components/PageBanner';
import PlaceCard from '../components/PlaceCard';
import EmptyState from '../components/EmptyState';
import Reveal from '../components/Reveal';
import SectionHead from '../components/SectionHead';
import VerificationBadge from '../components/VerificationBadge';
import Lightbox from '../components/Lightbox';
import PlantArt from '../components/PlantArt';
import { PLACES, PLACE_CATEGORIES } from '../data/scenery';
import { CAMPUSES } from '../data/campuses';
import { PLANT_CATEGORIES, PLANTS, type Plant, type PlantCategory } from '../data/plants';

const CAMPUS_FILTERS = [{ id: 'all', name: '全部校区' }, ...CAMPUSES.map((c) => ({ id: c.id, name: c.name }))];

/** 校园风光的六个核心景点（数据里排在最前面的六条） */
const CORE_SPOTS = PLACES.slice(0, 6);

export default function Scenery() {
  const [params, setParams] = useSearchParams();
  const [q, setQ] = useState('');
  const [category, setCategory] = useState<string>('全部风景');
  const [campus, setCampus] = useState<string>(() => {
    const c = params.get('campus');
    return c && CAMPUSES.some((x) => x.id === c) ? c : 'all';
  });

  const [plantCat, setPlantCat] = useState<'全部' | PlantCategory>('全部');
  const [plantQuery, setPlantQuery] = useState('');
  const [plantOpen, setPlantOpen] = useState<Plant | null>(null);

  /* 两个板块：核心景点 / 校园植物；带 ?plant= 或 ?plantCat= 时直接打开植物板块 */
  const [view, setView] = useState<'places' | 'plants'>(() =>
    params.get('view') === 'plants' || params.get('plant') || params.get('plantCat') ? 'plants' : 'places',
  );

  useEffect(() => {
    const c = params.get('campus');
    if (c && CAMPUSES.some((x) => x.id === c)) setCampus(c);
  }, [params]);

  /* 支持 /scenery?plant=<id> 直接打开某种植物的详情，便于分享 */
  useEffect(() => {
    const id = params.get('plant');
    if (!id) return;
    const target = PLANTS.find((p) => p.id === id);
    if (target) setPlantOpen(target);
  }, [params]);

  /* 支持 /scenery?plantCat=水生植物 直接按类型查看 */
  useEffect(() => {
    const c = params.get('plantCat');
    if (c && (PLANT_CATEGORIES as readonly string[]).includes(c)) {
      setPlantCat(c as PlantCategory);
    }
  }, [params]);

  const closePlant = () => {
    setPlantOpen(null);
    if (params.has('plant')) {
      const next = new URLSearchParams(params);
      next.delete('plant');
      setParams(next, { replace: true });
    }
  };

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return PLACES.filter((p) => {
      if (category !== '全部风景' && p.category !== category) return false;
      if (campus !== 'all' && p.campus !== campus) return false;
      if (!term) return true;
      return [p.name, p.nameEn, p.summary, p.category, ...p.tags]
        .join(' ')
        .toLowerCase()
        .includes(term);
    });
  }, [q, category, campus]);

  const plants = useMemo(() => {
    const term = plantQuery.trim().toLowerCase();
    return PLANTS.filter((p) => {
      if (plantCat !== '全部' && p.category !== plantCat) return false;
      if (!term) return true;
      return [p.name, p.latin, p.family, p.summary, p.bloom, ...p.spots]
        .join(' ')
        .toLowerCase()
        .includes(term);
    });
  }, [plantCat, plantQuery]);

  const dirty = q.trim() !== '' || category !== '全部风景' || campus !== 'all';

  const reset = () => {
    setQ('');
    setCategory('全部风景');
    setCampus('all');
  };

  return (
    <>
      <PageBanner
        art={{ kind: 'banner', seed: 31, mood: 'spring' }}
        image="/images/scenery/season-banner.jpg"
        imageSm="/images/scenery/season-banner-sm.jpg"
        imageAlt="郑州大学校园四季：春季樱花、夏季垂柳与湖中黑天鹅、秋季银杏与图书馆、冬季雪景"
        eyebrow="CAMPUS SCENERY"
        title="校园风光 · 在郑大遇见四季"
        desc="杏坛的典故、钟楼的校训、厚山那座一锹一锹堆起来的山——校园里的每一处景，其实都在悄悄说着话。挑一个下午走上一圈，你会明白这所学校想把什么留给学生。"
        crumbs={[{ label: '校园风光' }]}
        height="lg"
      />

      <div className="container">
        <div className="view-tabs-row">
          <div className="view-tabs" role="tablist" aria-label="校园风光板块">
            <button
              type="button"
              role="tab"
              aria-selected={view === 'places'}
              className="view-tab"
              onClick={() => setView('places')}
            >
              <Mountain size={15} aria-hidden="true" />
              核心景点
              <span className="view-tab__count">{PLACES.length}</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={view === 'plants'}
              className="view-tab"
              onClick={() => setView('plants')}
            >
              <Leaf size={15} aria-hidden="true" />
              校园植物
              <span className="view-tab__count">{PLANTS.length}</span>
            </button>
          </div>
          <p className="view-tabs-note">景点按地点整理，植物按种类整理；两边都支持搜索与筛选。</p>
        </div>
      </div>

      <section className="section section--flush-top" hidden={view !== 'places'}>
        <div className="container">
          <div className="spot-strip">
            <p className="spot-strip__label">
              <Leaf size={14} aria-hidden="true" />
              核心景点
            </p>
            <div className="chips">
              {CORE_SPOTS.map((spot) => (
                <Link key={spot.id} to={`/scenery/${spot.id}`} className="chip chip--spot">
                  {spot.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="toolbar">
            <div className="toolbar__group" style={{ flex: 1 }}>
              <label className="field" style={{ flex: 1 }}>
                <Search size={16} aria-hidden="true" />
                <input
                  type="search"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="搜索地点名称，例如「图书馆」"
                  aria-label="搜索校园地点"
                />
                {q ? (
                  <button type="button" className="icon-btn icon-btn--sm" onClick={() => setQ('')} aria-label="清空关键词">
                    <X size={14} aria-hidden="true" />
                  </button>
                ) : null}
              </label>
            </div>
            <div className="toolbar__group">
              <label className="field field--select">
                <span className="field__label">校区</span>
                <select value={campus} onChange={(e) => setCampus(e.target.value)} aria-label="按校区筛选">
                  {CAMPUS_FILTERS.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>
              <button type="button" className="btn btn--ghost btn--sm" onClick={reset} disabled={!dirty}>
                <RotateCcw size={14} aria-hidden="true" />
                清空筛选
              </button>
            </div>
          </div>

          <div className="chips" role="group" aria-label="按类别筛选" style={{ marginBottom: 28 }}>
            {PLACE_CATEGORIES.filter(
              (c) => c === '全部风景' || PLACES.some((p) => p.category === c),
            ).map((c) => (
              <button
                key={c}
                type="button"
                className="chip"
                aria-pressed={category === c}
                onClick={() => setCategory(c)}
              >
                {c}
                <span className="chip__count">
                  {c === '全部风景' ? PLACES.length : PLACES.filter((p) => p.category === c).length}
                </span>
              </button>
            ))}
          </div>

          <p className="result-count" aria-live="polite">
            共 {filtered.length} 个地点
            {dirty ? '（已筛选）' : ''}
          </p>

          {filtered.length > 0 ? (
            <div className="grid grid--3">
              {filtered.map((place, i) => (
                <Reveal key={place.id} delay={Math.min(i, 5) * 60}>
                  <PlaceCard place={place} />
                </Reveal>
              ))}
            </div>
          ) : (
            <EmptyState
              title="没有符合条件的地点"
              desc="换一个关键词，或清空筛选条件看看全部内容。"
              action={
                <button type="button" className="btn btn--ghost" onClick={reset}>
                  清空筛选
                </button>
              }
            />
          )}
        </div>
      </section>

      {/* ---------------- 校园植物 ---------------- */}
      <section className="section section--soft section--flush-top" id="plants" hidden={view !== 'plants'}>
        <div className="container">
          <SectionHead
            eyebrow="CAMPUS PLANTS"
            title="校园植物"
            desc="一株荇菜只肯长在干净的水里，一棵银杏每年准时变黄。二十四种植物的四季变化，是最容易看懂的生态文明课——不用讲道理，看就够了。"
            action={
              <span className="tag tag--muted">
                <Leaf size={12} aria-hidden="true" />
                共 {PLANTS.length} 种
              </span>
            }
          />

          <div className="notice" style={{ marginBottom: 24 }}>
            <Info size={16} aria-hidden="true" />
            <p>
              <strong>两批资料：</strong>
              二十四种植物的形态与观赏特征按乔木、花灌木、水生植物、地被与藤本分类整理，
              花期与叶色变化随气候略有差异；具体位置建议按现场植物挂牌核对。
            </p>
          </div>

          <div className="toolbar">
            <label className="field" style={{ flex: 1, minWidth: 240 }}>
              <Search size={16} aria-hidden="true" />
              <input
                type="search"
                value={plantQuery}
                onChange={(e) => setPlantQuery(e.target.value)}
                placeholder="搜索植物名称、科属或位置，例如「银杏」「眉湖」"
                aria-label="搜索校园植物"
              />
              {plantQuery ? (
                <button type="button" className="icon-btn icon-btn--sm" onClick={() => setPlantQuery('')} aria-label="清空关键词">
                  <X size={14} aria-hidden="true" />
                </button>
              ) : null}
            </label>
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              onClick={() => {
                setPlantQuery('');
                setPlantCat('全部');
              }}
              disabled={!plantQuery && plantCat === '全部'}
            >
              清空筛选
            </button>
          </div>

          <div className="chips" role="group" aria-label="按植物类型筛选" style={{ marginBottom: 26 }}>
            {PLANT_CATEGORIES.map((c) => (
              <button key={c} type="button" className="chip" aria-pressed={plantCat === c} onClick={() => setPlantCat(c)}>
                {c}
                <span className="chip__count">
                  {c === '全部' ? PLANTS.length : PLANTS.filter((p) => p.category === c).length}
                </span>
              </button>
            ))}
          </div>

          <p className="result-count" aria-live="polite">
            共 {plants.length} 种
          </p>

          {plants.length > 0 ? (
            <ul className="plant-grid">
              {plants.map((plant, i) => (
                <Reveal as="li" key={plant.id} delay={Math.min(i, 7) * 50}>
                  <article className="plant-card">
                    <div className="plant-card__media">
                      <PlantArt art={plant.art} />
                      <span className="plant-card__seal">{plant.category}</span>
                    </div>
                    <div className="plant-card__body">
                      <h3 className="plant-card__name">{plant.name}</h3>
                      <p className="plant-card__latin">{plant.latin}</p>
                      <p className="plant-card__meta">
                        {plant.family} · {plant.bloom}
                      </p>
                      <p className="plant-card__desc">{plant.summary}</p>
                      <div className="plant-card__foot">
                        <button type="button" className="link-arrow" onClick={() => setPlantOpen(plant)}>
                          查看详情
                        </button>
                      </div>
                    </div>
                  </article>
                </Reveal>
              ))}
            </ul>
          ) : (
            <EmptyState
              title="没有匹配的植物"
              desc="换一个关键词，或清空类型筛选再看看。"
              action={
                <button
                  type="button"
                  className="btn btn--ghost"
                  onClick={() => {
                    setPlantQuery('');
                    setPlantCat('全部');
                  }}
                >
                  清空筛选
                </button>
              }
            />
          )}
        </div>
      </section>

      <Lightbox open={Boolean(plantOpen)} onClose={closePlant} label={`${plantOpen?.name ?? ''} 植物详情`}>
        {plantOpen ? (
          <>
            <div className="lightbox__media">
              <PlantArt art={plantOpen.art} />
            </div>
            <div className="lightbox__body">
              <div className="plant-detail__head">
                <div>
                  <h2>{plantOpen.name}</h2>
                  <p className="plant-card__latin">{plantOpen.latin}</p>
                </div>
                <span className="tag">{plantOpen.category}</span>
              </div>
              <dl className="mini-dl">
                <div>
                  <dt>科属</dt>
                  <dd>{plantOpen.family}</dd>
                </div>
                <div>
                  <dt>观赏期</dt>
                  <dd>{plantOpen.bloom}</dd>
                </div>
                <div>
                  <dt>物种信息</dt>
                  <dd>
                    
                  </dd>
                </div>
                <div>
                  <dt>校园分布</dt>
                  <dd>
                    <VerificationBadge status="pending" compact />
                  </dd>
                </div>
              </dl>

              <h3 className="plant-detail__label">形态特征</h3>
              <ul className="bullet-list">
                {plantOpen.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>

              <h3 className="plant-detail__label">校园中的分布</h3>
              <div className="chips" style={{ marginTop: 8 }}>
                {plantOpen.spots.map((s) => (
                  <span className="chip chip--static" key={s}>
                    {s}
                  </span>
                ))}
              </div>
              <p className="muted" style={{ marginTop: 10, fontSize: 12.5 }}>
                植物分布会随补植与改造变化，具体位置以现场挂牌为准。
              </p>

              <h3 className="plant-detail__label">延伸阅读</h3>
              <ul className="source-list">
                {plantOpen.sources.map((s) => (
                  <li key={s.url}>
                    <ExternalLink size={14} aria-hidden="true" />
                    <a href={s.url} target="_blank" rel="noopener noreferrer">
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </>
        ) : null}
      </Lightbox>

      <EduSpot route="/scenery" />
    </>
  );
}
