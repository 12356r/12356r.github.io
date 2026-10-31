import { ArrowRight, Home, Mountain, Users, UtensilsCrossed } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageBanner from '../components/PageBanner';
import Reveal from '../components/Reveal';
import { ACTIVITIES, CANTEEN_PICKS, DORM_ZONES, FOOD_ITEMS } from '../data/content';
import { PLANTS } from '../data/plants';
import { PLACES } from '../data/scenery';

interface LifeModule {
  to: string;
  name: string;
  en: string;
  icon: typeof Home;
  desc: string;
  stat: string;
  tags: string[];
}

const canteenCount = FOOD_ITEMS.filter((f) => f.area === 'canteen').length;

const MODULES: LifeModule[] = [
  {
    to: '/scenery',
    name: '校园风光',
    en: 'SCENERY',
    icon: Mountain,
    desc: '分「核心景点」与「校园植物」两个板块：一边按地点看眉湖、钟楼、樱花园，一边按种类认识校园里常见的树与花。',
    stat: `${PLACES.length} 个地点 · ${PLANTS.length} 种植物`,
    tags: ['核心景点', '校园植物'],
  },
  {
    to: '/dorm',
    name: '宿舍生活',
    en: 'DORM',
    icon: Home,
    desc: '主校区的宿舍按四个园区分布，自南向北依次是柳园、荷园、菊园、松园；每个园区的食堂与配套都列在一起。',
    stat: `${DORM_ZONES.length} 个宿舍园区`,
    tags: ['园区分布', '食堂配套'],
  },
  {
    to: '/food',
    name: '校园美食',
    en: 'FOOD',
    icon: UtensilsCrossed,
    desc: '按食堂整理；每家食堂可以点进详情页看档口推荐。',
    stat: `${canteenCount} 家食堂 · ${CANTEEN_PICKS.length} 条档口推荐`,
    tags: ['食堂', '档口推荐'],
  },
  {
    to: '/activities',
    name: '社团活动',
    en: 'ACTIVITIES',
    icon: Users,
    desc: '社团是学生自己组织的公共生活：在这里能找到常见社团类型，以及获取真实活动信息的官方渠道。',
    stat: `${ACTIVITIES.length} 类活动`,
    tags: ['社团类型', '官方渠道'],
  },
];

export default function CampusLife() {
  return (
    <>
      <PageBanner
        art={{ kind: 'banner', seed: 11, mood: 'spring' }}
        eyebrow="CAMPUS LIFE"
        title="校园生活 · 从哪里开始看"
        desc="校园生活分成风光、宿舍、美食、社团四个模块。挑一个感兴趣的进去——每一块都能当成一堂看得见的课。"
        crumbs={[{ label: '校园生活' }]}
      />

      <section className="section">
        <div className="container">
          <div className="life-grid">
            {MODULES.map((m, i) => {
              const Icon = m.icon;
              return (
                <Reveal key={m.to} delay={i * 70}>
                  <Link to={m.to} className="life-card">
                    <span className="life-card__icon" aria-hidden="true">
                      <Icon size={22} />
                    </span>
                    <span className="life-card__en">{m.en}</span>
                    <h2 className="life-card__name">{m.name}</h2>
                    <p className="life-card__desc">{m.desc}</p>
                    <div className="life-card__tags">
                      {m.tags.map((t) => (
                        <span className="life-card__tag" key={t}>
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="life-card__foot">
                      <span className="life-card__stat">{m.stat}</span>
                      <span className="life-card__go">
                        进入
                        <ArrowRight size={14} aria-hidden="true" />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
