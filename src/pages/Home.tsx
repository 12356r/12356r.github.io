import {
  ArrowRight,
  BedDouble,
  Compass,
  Images,
  MapPinned,
  MessageSquare,
  Sparkles,
  UtensilsCrossed,
  Users,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import HeroCarousel, { type HeroSlide } from '../components/HeroCarousel';
import SectionHead from '../components/SectionHead';
import PlaceCard from '../components/PlaceCard';
import Reveal from '../components/Reveal';
import MiniCarousel from '../components/MiniCarousel';
import SceneArt from '../components/SceneArt';
import VerificationBadge from '../components/VerificationBadge';
import CountUpNumber from '../components/CountUpNumber';
import { NEWS_CHANNELS } from '../data/content';
import { DORM_ZONES, FOOD_ITEMS } from '../data/content';
import { ACTIVITY_FEATURES } from '../data/activityFeatures';
import { PLACES } from '../data/scenery';
import { NAV_FLAT, OVERVIEW_STATS, QUICK_LINKS, SOURCES } from '../data/site';

const SLIDES: HeroSlide[] = [
  {
    art: { kind: 'hero', seed: 11, mood: 'dusk' },
    image: {
      wide: '/images/hero/gate-wide.jpg',
      tall: '/images/hero/gate-tall.jpg',
      alt: '郑州大学校门，门楼上写有「郑州大学」校名，后方是校园教学楼群',
    },
    eyebrow: 'ZHENGZHOU UNIVERSITY · CAMPUS EXPLORER',
    title: '遇见郑大 · 遇见更好的自己',
    subtitle: '校园风光｜生活体验｜青春记忆',
    desc: '从一处风景开始，探索郑州大学的校园生活与人文故事。',
    to: '/life',
    cta: '开启校园生活',
  },
  {
    art: { kind: 'hero', seed: 5, mood: 'day' },
    image: {
      wide: '/images/hero/road-wide.jpg',
      tall: '/images/hero/road-tall.jpg',
      alt: '校园林荫道，两侧高大的悬铃木在午后阳光里投下树影',
    },
    eyebrow: 'CAMPUS SCENERY',
    title: '在校园里，走一段安静的路',
    subtitle: '图书馆 · 林荫道 · 湖边风',
    desc: '校园风光栏目整理了校园里的地标与四季风景，每一处都能点进去细看。',
    to: '/scenery',
    cta: '浏览校园风光',
  },
  {
    art: { kind: 'hero', seed: 71, mood: 'spring' },
    image: {
      wide: '/images/hero/aerial-wide.jpg',
      tall: '/images/hero/aerial-tall.jpg',
      alt: '郑州大学主校区航拍，中轴线上的广场、钟楼与成组分布的教学楼',
      position: '50% 55%',
    },
    eyebrow: 'CAMPUS MAP',
    title: '把校园，放进一张地图里',
    subtitle: '四校区地址 · 地点检索 · 地图定位',
    desc: '基于公开地图底图的地点浏览工具。坐标核验完成前，地图不会标注未经确认的位置。',
    to: '/map',
    cta: '打开校园地图',
  },
  {
    art: { kind: 'hero', seed: 53, mood: 'autumn' },
    image: {
      wide: '/images/hero/wall-wide.jpg',
      tall: '/images/hero/wall-tall.jpg',
      alt: '郑州大学校园石墙上的「郑州大学」题字牌，墙上有树影与竹枝',
      position: '50% 45%',
    },
    layout: 'split',
    eyebrow: 'CAMPUS BOARD',
    title: '在贴吧里，说说今天的郑大',
    subtitle: '匿名发布 · 图文并茂 · 所有人可见',
    desc: '不用登录就能留言，文字和照片都行。食堂新窗口、自习室空位、操场晚风，都可以写进来。',
    to: '/board',
    cta: '去校园贴吧',
  },
];

const QUICK_ICONS = [Images, BedDouble, UtensilsCrossed, Users, MessageSquare];

/* 三张卡片改用各板块的真实照片轮播 */
const LIFE_CARDS = [
  {
    to: '/dorm',
    title: '宿舍生活',
    en: 'DORM LIFE',
    desc: '四个园区从南到北排开，各有食堂与生活配套。',
    slides: DORM_ZONES.map((z) => ({ src: z.image, alt: z.imageAlt })),
  },
  {
    to: '/food',
    title: '校园美食',
    en: 'CAMPUS FOOD',
    desc: '六家食堂的实景门头，点进去还能看各家档口推荐。',
    slides: FOOD_ITEMS.filter((f) => f.area === 'canteen' && f.image).map((f) => ({
      src: f.image as string,
      alt: `${f.name}实景`,
    })),
  },
  {
    to: '/activities',
    title: '社团活动',
    en: 'ACTIVITIES',
    desc: '科技体验营、社团文化节、百团大战——三场活动的现场。',
    slides: ACTIVITY_FEATURES.map((a) => ({ src: a.image, alt: a.imageAlt })),
  },
];

export default function Home() {
  const featured = PLACES.filter((p) => p.verification !== 'illustrative').slice(0, 4);
  const heroPlace = PLACES.find((p) => p.id === 'campus-main');

  const statsRef = useRef<HTMLDListElement>(null);
  const [statsVisible, setStatsVisible] = useState(false);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setStatsVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setStatsVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    const fallback = window.setTimeout(() => setStatsVisible(true), 2000);
    return () => {
      io.disconnect();
      window.clearTimeout(fallback);
    };
  }, []);

  return (
    <div className="home">
      <HeroCarousel slides={SLIDES} />

      {/* 快捷入口 */}
      <section className="quick-strip" aria-label="快捷入口">
        <div className="container">
          <ul className="quick-grid">
            {QUICK_LINKS.map((item, i) => {
              const Icon = QUICK_ICONS[i] ?? Images;
              return (
                <li key={item.to}>
                  <Link to={item.to} className="quick-card">
                    <span className="quick-card__icon">
                      <Icon size={22} aria-hidden="true" />
                    </span>
                    <span className="quick-card__text">
                      <span className="quick-card__cn">{item.label}</span>
                      <span className="quick-card__en">{item.en}</span>
                      <span className="quick-card__desc">{item.desc}</span>
                    </span>
                    <ArrowRight size={16} className="quick-card__arrow" aria-hidden="true" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* 数据概览 */}
      <section className="section overview">
        <div className="container">
          <div className="overview__head">
            <div>
              <span className="eyebrow">ABOUT ZZU</span>
              <h2>一所扎根中原的综合性大学</h2>
              <p className="lead">
                郑州大学是国家“211 工程”重点建设高校、“双一流”建设高校，现有四个校区、总占地 8500 余亩，
                校本部设有 48 个学院、128 个本科专业。
              </p>
            </div>
            <a className="link-arrow" href={SOURCES.intro.url} target="_blank" rel="noopener noreferrer">
              查看学校简介
              <ArrowRight size={15} aria-hidden="true" />
            </a>
          </div>

          <dl className="stats" ref={statsRef}>
            {OVERVIEW_STATS.map((s) => (
              <div className="stat" key={s.label}>
                <dt>{s.label}</dt>
                <dd>
                  <strong>
                    {/^\d+$/.test(s.value) ? (
                      <CountUpNumber value={Number(s.value)} active={statsVisible} />
                    ) : (
                      s.value
                    )}
                  </strong>
                  <span>{s.unit}</span>
                </dd>
                {s.note ? <p className="stat__note">{s.note}</p> : null}
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* 校园风光精选 */}
      <section className="section section--soft">
        <div className="container">
          <SectionHead
            eyebrow="CAMPUS SCENERY"
            title="校园风光"
            desc="漫步校园，发现属于郑大的四季风景。钟楼、眉湖、杏坛、厚山，都在步行半小时的距离里。"
            action={
              <Link to="/scenery" className="link-arrow">
                查看更多
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            }
          />
          <div className="grid grid--4">
            {featured.map((place, i) => (
              <Reveal key={place.id} delay={i * 70}>
                <PlaceCard place={place} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 校园地图入口 */}
      <section className="section map-entry-section">
        <div className="container map-entry">
          <div className="map-entry__copy">
            <span className="eyebrow">CAMPUS MAP</span>
            <h2>校园地图</h2>
            <p className="lead">
              四个校区的地址已收录；校园建筑的具体坐标尚未全部获得，因此地图暂不标注建筑位置，先用总览图与地点清扫替代。
            </p>
            <ul className="map-entry__list">
              <li>
                <MapPinned size={17} aria-hidden="true" />
                按校区与类别筛选地点
              </li>
              <li>
                <Compass size={17} aria-hidden="true" />
                地图缩放、拖动与地点定位
              </li>
              <li>
                <Sparkles size={17} aria-hidden="true" />
                支持在地图上标注并本地保存坐标
              </li>
            </ul>
            <div className="map-entry__actions">
              <Link className="btn" to="/map">
                查看地图
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <a
                className="btn btn--ghost"
                href={SOURCES.campusMapOfficial.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                学校官方校园地图
              </a>
            </div>
          </div>

          <div className="map-entry__preview">
            <div className="map-entry__canvas">
              <SceneArt art={{ kind: 'map', seed: 3 }} />
              <div className="map-entry__pin">
                <MapPinned size={16} aria-hidden="true" />
                {heroPlace ? heroPlace.name : '校园'}
              </div>
              <span className="media-flag">地图底图预览</span>
            </div>
            <p className="map-entry__note">
              地图页使用 OpenStreetMap 开放底图。若底图加载失败，页面会显示提示与备用入口，不影响其他内容。
            </p>
          </div>
        </div>
      </section>

      {/* 校园生活栏目 */}
      <section className="section section--blue">
        <div className="container">
          <SectionHead
            eyebrow="CAMPUS LIFE"
            title="校园生活"
            desc="住宿、餐饮与社团，是了解一所大学最日常的三个入口。"
          />
          <div className="grid grid--3">
            {LIFE_CARDS.map((card, i) => (
              <Reveal key={card.to} delay={i * 70}>
                <article className="card card--hover life-card">
                  <div className="card__media card__media--wide">
                    <MiniCarousel slides={card.slides} interval={4200} />
                  </div>
                  <div className="card__body">
                    <p className="life-card__en">{card.en}</p>
                    <h3 className="card__title">
                      <Link to={card.to} className="card__hit">
                        {card.title}
                      </Link>
                    </h3>
                    <p className="card__desc">{card.desc}</p>
                    <div className="card__foot">
                      <span className="link-arrow">
                        了解更多
                        <ArrowRight size={14} aria-hidden="true" />
                      </span>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 校园资讯 */}
      <section className="section">
        <div className="container">
          <SectionHead
            eyebrow="NEWS & NOTICE"
            title="校园资讯"
            desc="本站不转载、不改写新闻。以下为学校官方信息渠道，可直接前往查看最新发布。"
            action={
              <Link to="/news" className="link-arrow">
                资讯与公告
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            }
          />
          <ul className="news-list">
            {NEWS_CHANNELS.map((item, i) => (
              <Reveal as="li" key={item.id} delay={i * 60} className="news-item">
                <div className="news-item__main">
                  <span className="tag">{item.category}</span>
                  <h3>
                    <Link to={`/news/${item.id}`}>{item.title}</Link>
                  </h3>
                  <p>{item.summary}</p>
                </div>
                <div className="news-item__side">
                  <VerificationBadge status={item.verification} compact />
                  <Link to={`/news/${item.id}`} className="link-arrow">
                    查看
                    <ArrowRight size={14} aria-hidden="true" />
                  </Link>
                </div>
              </Reveal>
            ))}
          </ul>
          <div className="notice" style={{ marginTop: 28 }}>
            <Sparkles size={16} aria-hidden="true" />
            <p>
              <strong>关于内容：</strong>
              本站是校园文化与信息导览项目，不是郑州大学官方网站。需要核实的政策、通知与数据，请以学校官方发布为准。
            </p>
          </div>
        </div>
      </section>

      {/* 页内导航补全：资讯 / 关于 */}
      <section className="section section--soft home-links">
        <div className="container home-links__inner">
          <p className="home-links__title">更多内容</p>
          <div className="chips">
            {[...NAV_FLAT.filter((n) => n.to !== '/'), { to: '/news', label: '资讯与公告', en: 'NEWS' }, { to: '/about', label: '关于本站', en: 'ABOUT' }].map(
              (item) => (
                <Link key={item.to} to={item.to} className="chip">
                  {item.label}
                </Link>
              ),
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
