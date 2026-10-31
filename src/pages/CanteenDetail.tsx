import { ArrowLeft, ArrowRight, Bookmark, Info, MapPin, UtensilsCrossed } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import Media from '../components/Media';
import VerificationBadge from '../components/VerificationBadge';
import { CANTEEN_PICKS, FOOD_ITEMS } from '../data/content';
import { useFavorites } from '../hooks/useFavorites';

export default function CanteenDetail() {
  const { id } = useParams();
  const item = FOOD_ITEMS.find((f) => f.id === id && f.area === 'canteen');
  const picks = CANTEEN_PICKS.filter((p) => p.canteenId === id);
  const { has, toggle } = useFavorites();

  if (!item) {
    return (
      <section className="section">
        <div className="container notfound">
          <p className="eyebrow">404</p>
          <h1>没有找到这个食堂</h1>
          <p>该食堂可能尚未收录，或链接中的编号有误。</p>
          <div className="notfound__actions">
            <Link className="btn" to="/food">
              返回校园美食
            </Link>
            <Link className="btn btn--ghost" to="/">
              回到首页
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const others = FOOD_ITEMS.filter((f) => f.area === 'canteen' && f.id !== item.id);
  const zoneLabel = item.location.split('（')[0];

  return (
    <article className="detail detail--canteen">
      <div className="detail__stage">
        <div className="detail__stage-media">
          <Media
            art={item.art}
            image={item.imageWide ?? item.image}
            alt={`${item.name}${item.image ? ' 校园实景照片' : '（示意图）'}`}
            flag={null}
          />
        </div>
        <div className="detail__stage-scrim" />
        <div className="container detail__stage-inner">
          <Breadcrumbs items={[{ label: '校园美食', to: '/food' }, { label: item.name }]} />
          <div className="detail__title-row">
            <div>
              <p className="detail__campus">
                {item.kind} · {zoneLabel}
              </p>
              <h1>{item.name}</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="container detail__body">
        <div className="detail__main">
          <div className="detail__badges">
            <VerificationBadge status={item.verification} />
            {item.tags.map((t) => (
              <span className="tag tag--muted" key={t}>
                {t}
              </span>
            ))}
          </div>

          <p className="lead">{item.summary}</p>

          <section className="detail__section">
            <h2>美食推荐</h2>

            {picks.length > 0 ? (
              <>
                <p className="pick-block__note" style={{ marginBottom: 16 }}>
                  <Info size={13} aria-hidden="true" />
                  菜品与价格由项目方整理，配图仅供辨认品类。
                </p>
                <ul className="pick-grid pick-grid--detail">
                  {picks.map((pick) => {
                    const favId = `pick-${pick.id}`;
                    const saved = has(favId);
                    return (
                      <li className="pick-card" key={pick.id}>
                        <div className="pick-card__media">
                          <img src={pick.image} alt={pick.imageAlt} loading="lazy" decoding="async" />
                          <button
                            type="button"
                            className={`pick-card__fav ${saved ? 'is-on' : ''}`}
                            onClick={() => toggle(favId)}
                            aria-pressed={saved}
                            aria-label={saved ? '取消收藏这个档口' : '收藏这个档口'}
                            title={saved ? '已收藏，可在「我的收藏」查看' : '收藏到「我的收藏」'}
                          >
                            <Bookmark size={14} aria-hidden="true" fill={saved ? 'currentColor' : 'none'} />
                          </button>
                        </div>
                        <div className="pick-card__body">
                          <div className="pick-card__top">
                            <h3 className="pick-card__name">{pick.name}</h3>
                            {pick.price ? <span className="pick-card__price">{pick.price}</span> : null}
                          </div>
                          {pick.floor ? <p className="pick-card__floor">{pick.floor}</p> : null}
                          <p className="pick-card__desc">{pick.desc}</p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </>
            ) : (
              <p className="muted">
                这家食堂的档口推荐还在整理中。如果你有想补充的窗口或菜品，欢迎通过页脚的联系方式告诉我们。
              </p>
            )}
          </section>

          {item.features && item.features.length > 0 ? (
            <section className="detail__section">
              <h2>楼层与设施</h2>
              <div className="food-facts">
                {item.features.map((f) => (
                  <span className="food-facts__item" key={f}>
                    {f}
                  </span>
                ))}
              </div>
            </section>
          ) : null}

          {item.highlights && item.highlights.length > 0 ? (
            <section className="detail__section">
              <h2>招牌菜品</h2>
              <div className="food-tags">
                {item.highlights.map((h) => (
                  <span className="food-tag" key={h}>
                    {h}
                  </span>
                ))}
              </div>
            </section>
          ) : null}

          <section className="detail__section">
            <h2>说明</h2>
            <p>{item.note}</p>
            <p className="muted detail__updated">内容更新日期：{item.updatedAt}</p>
          </section>
        </div>

        <aside className="detail__side">
          <div className="info-card">
            <h2>食堂信息</h2>
            <dl>
              <div>
                <dt>位置</dt>
                <dd>{item.location}</dd>
              </div>
              <div>
                <dt>类别</dt>
                <dd>{item.kind}</dd>
              </div>
              <div>
                <dt>核验状态</dt>
                <dd>
                  <VerificationBadge status={item.verification} compact />
                </dd>
              </div>
              <div>
                <dt>价格 / 营业时间</dt>
                <dd>以现场公示为准</dd>
              </div>
            </dl>
            <div className="info-card__actions">
              <Link className="btn btn--sm btn--ghost" to="/food">
                <ArrowLeft size={14} aria-hidden="true" />
                返回校园美食
              </Link>
              <Link className="btn btn--sm" to="/map">
                <MapPin size={14} aria-hidden="true" />
                校园地图
              </Link>
            </div>
          </div>

          <div className="info-card">
            <h2>其他食堂</h2>
            <ul className="side-list">
              {others.map((o) => (
                <li key={o.id}>
                  <Link to={`/food/${o.id}`} className="side-list__link">
                    <UtensilsCrossed size={14} aria-hidden="true" />
                    <span>{o.name}</span>
                    <ArrowRight size={13} aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </article>
  );
}
