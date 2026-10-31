import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, ExternalLink, Info, MapPin, Maximize2 } from 'lucide-react';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import FavoriteButton from '../components/FavoriteButton';
import Lightbox from '../components/Lightbox';
import Media from '../components/Media';
import PlaceCard from '../components/PlaceCard';
import Reveal from '../components/Reveal';
import SceneArt from '../components/SceneArt';
import VerificationBadge from '../components/VerificationBadge';
import { campusName } from '../data/campuses';
import { getPlace, PLACES } from '../data/scenery';

export default function PlaceDetail() {
  const { id } = useParams();
  const place = getPlace(id);
  const [viewer, setViewer] = useState<number | null>(null);

  const images = place ? [place.art, ...(place.gallery ?? [])] : [];

  if (!place) {
    return (
      <section className="section">
        <div className="container notfound">
          <p className="eyebrow">404</p>
          <h1>没有找到这个地点</h1>
          <p>该地点可能尚未收录，或链接中的编号有误。</p>
          <div className="notfound__actions">
            <Link className="btn" to="/scenery">
              返回校园风光
            </Link>
            <Link className="btn btn--ghost" to="/">
              回到首页
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const related = PLACES.filter((p) => p.id !== place.id && p.campus === place.campus).slice(0, 3);
  const relatedFallback = PLACES.filter((p) => p.id !== place.id).slice(0, 3);
  const suggestions = related.length > 0 ? related : relatedFallback;

  return (
    <>
      <article className="detail">
        <div className="detail__stage">
          <button
            type="button"
            className="detail__zoom"
            onClick={() => setViewer(0)}
            aria-label="放大查看图片"
          >
            <Maximize2 size={16} aria-hidden="true" />
          </button>
          <div className="detail__stage-media">
            <Media
              art={place.art}
              image={place.imageWide ?? place.image}
              alt={`${place.name}${place.image ? '校园实景照片' : '（示意图）'}`}
              flag={null}
            />
          </div>
          <div className="detail__stage-scrim" />
          <div className="container detail__stage-inner">
            <Breadcrumbs items={[{ label: '校园风光', to: '/scenery' }, { label: place.name }]} />
            <div className="detail__title-row">
              <div>
                <p className="detail__campus">
                  {campusName(place.campus)} · {place.category}
                </p>
                <h1>{place.name}</h1>
                <p className="detail__en">{place.nameEn}</p>
              </div>
              <FavoriteButton id={`place-${place.id}`} label={place.name} />
            </div>
          </div>
        </div>

        <div className="container detail__body">
          <div className="detail__main">
            <div className="detail__badges">
              <VerificationBadge status={place.verification} />
              {place.tags.map((t) => (
                <span className="tag tag--muted" key={t}>
                  {t}
                </span>
              ))}
            </div>

            {place.verification === 'pending' ? (
              <div className="notice notice--warn">
                <Info size={16} aria-hidden="true" />
                <p>
                  <strong>补充说明：</strong>
                  本条目的名称与位置来自项目方整理或公开资料，尚未获得学校官方页面确认。本站不提供未经核实的坐标、开放时间与游览细节。
                </p>
              </div>
            ) : null}

            {place.verification === 'illustrative' ? (
              <div className="notice notice--warn">
                <Info size={16} aria-hidden="true" />
                <p>
                  <strong>提示：</strong>
                  本条目用于演示栏目结构与版式，不代表任何真实校园地点。
                </p>
              </div>
            ) : null}

            <section className="detail__section">
              <h2>简介</h2>
              {place.description.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </section>

            {place.tips && place.tips.length > 0 ? (
              <section className="detail__section">
                <h2>游览建议</h2>
                <ul className="bullet-list">
                  {place.tips.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </section>
            ) : null}

            {images.length > 1 && !place.image ? (
              <section className="detail__section">
                <h2>图集</h2>
                <p className="muted" style={{ fontSize: 13 }}>
                  以下为同一地点的示意插画（不同季节与时段），点击可放大查看。
                </p>
                <ul className="thumb-strip">
                  {images.map((art, i) => (
                    <li key={i}>
                      <button
                        type="button"
                        className="thumb"
                        onClick={() => setViewer(i)}
                        aria-label={`查看第 ${i + 1} 张示意图`}
                      >
                        <SceneArt art={art} />
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            <section className="detail__section">
              <h2>延伸阅读</h2>
              <ul className="source-list">
                {place.sources.map((s) => (
                  <li key={s.url}>
                    <ExternalLink size={14} aria-hidden="true" />
                    <a href={s.url} target="_blank" rel="noopener noreferrer">
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
              {place.note ? <p className="muted detail__note">{place.note}</p> : null}
              <p className="muted detail__updated">内容更新日期：{place.updatedAt}</p>
            </section>
          </div>

          <aside className="detail__side">
            <div className="info-card">
              <h2>地点信息</h2>
              <dl>
                <div>
                  <dt>所属校区</dt>
                  <dd>{campusName(place.campus)}</dd>
                </div>
                {place.location ? (
                  <div>
                    <dt>具体位置</dt>
                    <dd>{place.location}</dd>
                  </div>
                ) : null}
                <div>
                  <dt>类别</dt>
                  <dd>{place.category}</dd>
                </div>
                <div>
                  <dt>开放信息</dt>
                  <dd>{place.openInfo ?? '暂未收集到开放信息'}</dd>
                </div>
                <div>
                  <dt>地图坐标</dt>
                  <dd>{place.coords ? '已标注' : '暂未标注'}</dd>
                </div>
              </dl>
              <div className="info-card__actions">
                <Link className="btn btn--sm" to={`/map?place=${place.id}`}>
                  <MapPin size={14} aria-hidden="true" />
                  地图定位
                </Link>
                <Link className="btn btn--ghost btn--sm" to="/scenery">
                  <ArrowLeft size={14} aria-hidden="true" />
                  返回列表
                </Link>
              </div>
            </div>

            <div className="notice" style={{ marginTop: 18 }}>
              <Info size={16} aria-hidden="true" />
              <p>
                校园出入、参观与开放安排可能调整，出行前请查阅学校官方发布的最新信息。
              </p>
            </div>
          </aside>
        </div>

        <section className="section section--soft">
          <div className="container">
            <div className="section-head">
              <div className="section-head__main">
                <span className="eyebrow">MORE PLACES</span>
                <h2>相关地点</h2>
                <p>同一校区内收录的其他地点。</p>
              </div>
              <Link to="/scenery" className="link-arrow">
                查看全部
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
            <div className="grid grid--3">
              {suggestions.map((p, i) => (
                <Reveal key={p.id} delay={i * 60}>
                  <PlaceCard place={p} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </article>

      <Lightbox open={viewer !== null} onClose={() => setViewer(null)} label={`${place.name} 图片预览`}>
        {viewer !== null ? (
          <>
            <div className="lightbox__media">
              <SceneArt art={images[viewer] ?? place.art} />
            </div>
            <div className="lightbox__bar">
              <button
                type="button"
                className="icon-btn"
                onClick={() => setViewer((v) => (v === null ? null : (v - 1 + images.length) % images.length))}
                aria-label="上一张"
              >
                <ChevronLeft size={20} aria-hidden="true" />
              </button>
              <p className="lightbox__caption">
                {place.name} · 第 {viewer + 1} / {images.length} 张 · 示意图（非实景照片）
              </p>
              <button
                type="button"
                className="icon-btn"
                onClick={() => setViewer((v) => (v === null ? null : (v + 1) % images.length))}
                aria-label="下一张"
              >
                <ChevronRight size={20} aria-hidden="true" />
              </button>
            </div>
          </>
        ) : null}
      </Lightbox>
    </>
  );
}
