import { ArrowRight, ExternalLink, Info, MapPin, Phone, Search, Store, UtensilsCrossed, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import EmptyState from '../components/EmptyState';
import Lightbox from '../components/Lightbox';
import Media from '../components/Media';
import EduSpot from '../components/EduSpot';
import PageBanner from '../components/PageBanner';
import Reveal from '../components/Reveal';
import SectionHead from '../components/SectionHead';
import VerificationBadge from '../components/VerificationBadge';
import { CANTEEN_PICKS, FOOD_AREAS, FOOD_ITEMS } from '../data/content';
import FoodWheel from '../components/FoodWheel';
import { SOURCES } from '../data/site';
import type { FoodArea } from '../data/types';

const AREA_ICON: Record<FoodArea, typeof Store> = {
  canteen: UtensilsCrossed,
};

const AREA_DESC: Record<FoodArea, string> = {
  canteen:
    '主校区按柳园、荷园、菊园、松园四个生活区分设餐厅：柳园有聚英园与风华园，荷园有一、二餐厅，菊园有秋穗园，松园有竞舸园。',
};

const AREA_NOTICE: Record<FoodArea, { tone: 'warn' | 'info'; text: string }> = {
  canteen: {
    tone: 'info',
    text: '餐厅的位置、楼层与设施按现场整理；菜单、价格、营业时间与支付方式以现场公示为准。',
  },
};

export default function Food() {
  const [q, setQ] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return FOOD_ITEMS;
    return FOOD_ITEMS.filter((f) =>
      [f.name, f.summary, f.kind, f.location, ...(f.tags ?? [])].join(' ').toLowerCase().includes(term),
    );
  }, [q]);

  const grouped = useMemo(
    () =>
      FOOD_AREAS.map((area) => ({
        ...area,
        items: filtered.filter((item) => item.area === area.id),
      })),
    [filtered],
  );

  const current = FOOD_ITEMS.find((f) => f.id === openId) ?? null;
  const visibleCount = filtered.length;

  return (
    <>
      <PageBanner
        art={{ kind: 'banner', seed: 3, mood: 'autumn' }}
        eyebrow="CAMPUS FOOD"
        title="校园美食 · 寻找郑大的日常味道"
        desc="一日三餐，是校园里最有烟火气的课堂。吃得饱、吃得干净、不剩下那半碗饭——「勤俭」两个字，其实就藏在每天的餐盘里。"
        crumbs={[{ label: '校园美食' }]}
      />

      <section className="section">
        <div className="container">
          <FoodWheel />

          <div className="notice" style={{ marginBottom: 24 }}>
            <Info size={16} aria-hidden="true" />
            <p>
              <strong>资料来源：</strong>
              6 家餐厅配有实景照片、位置与招牌菜品说明；价格、营业时间与菜单以现场公示为准。
            </p>
          </div>

          {/* 板块导航 + 搜索 */}
          <div className="food-toolbar">
            <nav className="food-nav" aria-label="美食板块导航">
              {FOOD_AREAS.map((area) => {
                const Icon = AREA_ICON[area.id];
                const count = FOOD_ITEMS.filter((i) => i.area === area.id).length;
                return (
                  <a key={area.id} href={`#${area.id}`} className="food-nav__item">
                    <Icon size={16} aria-hidden="true" />
                    <span>{area.label}</span>
                    <span className="food-nav__count">{count}</span>
                  </a>
                );
              })}
            </nav>

            <label className="field" style={{ minWidth: 260 }}>
              <Search size={16} aria-hidden="true" />
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="搜索食堂或档口"
                aria-label="搜索校园美食"
              />
              {q ? (
                <button type="button" className="icon-btn icon-btn--sm" onClick={() => setQ('')} aria-label="清空关键词">
                  <X size={14} aria-hidden="true" />
                </button>
              ) : null}
            </label>
          </div>

          {visibleCount === 0 ? (
            <EmptyState
              title="没有匹配的内容"
              desc="换一个关键词试试，或清空搜索查看全部三个板块。"
              action={
                <button type="button" className="btn btn--ghost" onClick={() => setQ('')}>
                  清空搜索
                </button>
              }
            />
          ) : null}

          {grouped.map((area) => {
            if (area.items.length === 0) return null;
            const notice = AREA_NOTICE[area.id];
            return (
              <section className="food-block" id={area.id} key={area.id} aria-labelledby={`${area.id}-title`}>
                <SectionHead
                  eyebrow={area.en}
                  title={area.label}
                  desc={AREA_DESC[area.id]}
                  action={
                    <span className="tag tag--muted">
                      {area.items.length} 条
                    </span>
                  }
                />

                <div className={`notice ${notice.tone === 'warn' ? 'notice--warn' : ''}`} style={{ marginBottom: 24 }}>
                  <Info size={16} aria-hidden="true" />
                  <p>{notice.text}</p>
                </div>

                <div className={`grid ${area.id === 'canteen' ? 'grid--3' : 'grid--4'}`}>
                  {area.items.map((item, i) => (
                    <Reveal key={item.id} delay={Math.min(i, 5) * 60}>
                      <article className="card card--hover food-card">
                        <div className="card__media">
                          <Media
                            art={item.art}
                            image={item.image}
                            alt={`${item.name}${item.image ? ' 校园实景照片' : '（示意图）'}`}
                          />
                        </div>
                        <div className="card__body">
                          <div className="place-card__meta">
                            <span className="tag">{item.kind}</span>
                            <VerificationBadge status={item.verification} compact />
                          </div>
                          <h3 className="card__title">{item.name}</h3>
                          <p className="card__desc">{item.summary}</p>
                          <p className="scene-note">
                            <MapPin size={13} aria-hidden="true" /> {item.location}
                          </p>
                          {item.highlights && item.highlights.length > 0 ? (
                            <div className="food-tags">
                              {item.highlights.slice(0, 3).map((h) => (
                                <span className="food-tag" key={h}>
                                  {h}
                                </span>
                              ))}
                            </div>
                          ) : null}
                          {item.contact ? (
                            <p className="scene-note">
                              <Phone size={13} aria-hidden="true" /> {item.contact}
                            </p>
                          ) : null}
                          <div className="card__foot">
                            {CANTEEN_PICKS.some((p) => p.canteenId === item.id) ? (
                              <Link className="link-arrow" to={`/food/${item.id}`}>
                                美食推荐
                                <ArrowRight size={14} aria-hidden="true" />
                              </Link>
                            ) : (
                              <button type="button" className="link-arrow" onClick={() => setOpenId(item.id)}>
                                查看详情
                                <ArrowRight size={14} aria-hidden="true" />
                              </button>
                            )}
                          </div>
                        </div>
                      </article>
                    </Reveal>
                  ))}
                </div>
              </section>
            );
          })}

          <div className="info-card" style={{ marginTop: 40 }}>
            <h2>在哪里查真实的校园餐饮信息？</h2>
            <p>
              餐饮信息变化频繁，最可靠的方式是查看学校官方渠道与校内现场公示。本站只提供已确认的信息与查询入口，
              不用猜测填补空白。
            </p>
            <div className="info-card__actions">
              <a className="btn btn--sm" href={SOURCES.campusService.url} target="_blank" rel="noopener noreferrer">
                校园服务
                <ExternalLink size={13} aria-hidden="true" />
              </a>
              <a className="btn btn--ghost btn--sm" href={SOURCES.home.url} target="_blank" rel="noopener noreferrer">
                郑州大学官网
              </a>
            </div>
          </div>
        </div>
      </section>

      <Lightbox open={Boolean(current)} onClose={() => setOpenId(null)} label="美食详情">
        {current ? (
          <>
            <div className="lightbox__media">
              <Media
                art={current.art}
                image={current.imageWide ?? current.image}
                alt={`${current.name}${current.image ? ' 校园实景照片' : '（示意图）'}`}
                flag={null}
              />
            </div>
            <div className="lightbox__body">
              <div className="place-card__meta">
                <span className="tag">
                  {FOOD_AREAS.find((a) => a.id === current.area)?.label} · {current.kind}
                </span>
                <VerificationBadge status={current.verification} compact />
              </div>
              <h2>{current.name}</h2>
              <p>{current.summary}</p>
              <dl className="mini-dl">
                <div>
                  <dt>位置</dt>
                  <dd>{current.location}</dd>
                </div>
                {current.contact ? (
                  <div>
                    <dt>联系方式</dt>
                    <dd>{current.contact}</dd>
                  </div>
                ) : null}
                <div>
                  <dt>价格 / 营业时间</dt>
                  <dd>未提供（以现场公示为准）</dd>
                </div>
                <div>
                  <dt>更新时间</dt>
                  <dd>{current.updatedAt}</dd>
                </div>
              </dl>
              {current.note ? <p className="muted">{current.note}</p> : null}
              {current.features && current.features.length > 0 ? (
                <div className="food-detail__block">
                  <p className="food-detail__label">楼层与设施</p>
                  <div className="food-facts">
                    {current.features.map((f) => (
                      <span className="food-facts__item" key={f}>
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
              {current.highlights && current.highlights.length > 0 ? (
                <div className="food-detail__block">
                  <p className="food-detail__label">招牌 / 推荐</p>
                  <div className="food-tags">
                    {current.highlights.map((h) => (
                      <span className="food-tag" key={h}>
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
              {current.sources.length > 0 ? (
                <>
                  <h3 className="plant-detail__label">延伸阅读</h3>
                  <ul className="source-list">
                    {current.sources.map((s) => (
                      <li key={s.url}>
                        <ExternalLink size={14} aria-hidden="true" />
                        <a href={s.url} target="_blank" rel="noopener noreferrer">
                          {s.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p className="muted" style={{ marginTop: 12, fontSize: 12.5 }}>
                  {current.verification === 'illustrative'
                    ? '价格、营业时间以现场公示为准。'
                    : '实景照片与菜品说明。'}
                </p>
              )}
            </div>
          </>
        ) : null}
      </Lightbox>

      <EduSpot route="/food" />
    </>
  );
}
