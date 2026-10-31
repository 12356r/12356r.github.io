import { ExternalLink, Home, Info, Store, UtensilsCrossed } from 'lucide-react';
import { Link } from 'react-router-dom';
import Accordion from '../components/Accordion';
import EduSpot from '../components/EduSpot';
import PageBanner from '../components/PageBanner';
import Reveal from '../components/Reveal';
import SectionHead from '../components/SectionHead';
import { DORM_FAQ, DORM_ZONES } from '../data/content';
import { SOURCES } from '../data/site';

export default function Dorm() {
  return (
    <>
      <PageBanner
        art={{ kind: 'banner', seed: 1, mood: 'dusk' }}
        eyebrow="DORM LIFE"
        title="宿舍生活 · 校园里的温馨小家"
        desc="宿舍是大学里最像「生活」的地方：谁先洗澡、垃圾谁倒、几点熄灯，这些小事磨出来的默契，比一门课更早教会人怎么与别人相处。"
        crumbs={[{ label: '宿舍生活' }]}
      />

      <section className="section">
        <div className="container">
          <div className="split">
            <div className="split__main">
              <span className="eyebrow">OVERVIEW</span>
              <h2>住得怎么样，以学校通知为准</h2>
              <p className="lead">
                不同校区的宿舍条件、房型与设施并不相同，也会随年度调整。床位、房型、卫浴与收费标准这些具体数字，
                每年都可能变，这里就不猜了。
              </p>
              <p>
                想知道确切情况，最靠谱的是看学校迎新、学生工作与后勤渠道发布的通知，
                或直接问所在学院（书院）的辅导员和迎新联络人——他们给的信息最新。
              </p>
              <div className="notice" style={{ marginTop: 22 }}>
                <Info size={16} aria-hidden="true" />
                <p>
                  下面四个园区各有自己的食堂与生活配套，园区照片为实地拍摄的入口石碑，宿舍内部未涉及。
                </p>
              </div>
            </div>
            <aside className="split__side">
              <div className="info-card">
                <h3>官方查询入口</h3>
                <p className="muted">以下链接由学校官方发布，可作为查询起点。</p>
                <ul className="source-list">
                  <li>
                    <ExternalLink size={14} aria-hidden="true" />
                    <a href={SOURCES.campusService.url} target="_blank" rel="noopener noreferrer">
                      校园服务
                    </a>
                  </li>
                  <li>
                    <ExternalLink size={14} aria-hidden="true" />
                    <a href={SOURCES.home.url} target="_blank" rel="noopener noreferrer">
                      郑州大学官网
                    </a>
                  </li>
                  <li>
                    <ExternalLink size={14} aria-hidden="true" />
                    <a href={SOURCES.intro.url} target="_blank" rel="noopener noreferrer">
                      学校简介（校区地址）
                    </a>
                  </li>
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <SectionHead
            eyebrow="DORM ZONES"
            title="四个宿舍园区"
            desc="主校区的宿舍按四个园区分布，自南向北依次是柳园、荷园、菊园、松园。"
          />

          <div className="dorm-axis" aria-hidden="true">
            <span>南</span>
            <span className="dorm-axis__line" />
            <span>北</span>
          </div>

          <ul className="dorm-grid">
            {DORM_ZONES.map((zone, i) => (
              <Reveal as="li" key={zone.id} delay={i * 60}>
                <article className="dorm-card">
                  <div className="dorm-card__media">
                    <img
                      src={zone.image}
                      alt={zone.imageAlt}
                      decoding="async"
                      width={1200}
                      height={900}
                    />
                    <span className="dorm-card__shoot">园区实景</span>
                  </div>
                  <div className="dorm-card__body">
                    <span className="dorm-card__order">{zone.order}</span>
                    <h3 className="dorm-card__name">{zone.name}</h3>
                    <p className="dorm-card__summary">{zone.summary}</p>
                    <div className="dorm-card__foot">
                      {zone.canteens.map((c) => (
                        <Link key={c} to="/food#canteen" className="dorm-card__chip dorm-card__chip--food">
                          <UtensilsCrossed size={11} aria-hidden="true" />
                          {c}
                        </Link>
                      ))}
                      {zone.extras.map((e) => (
                        <span key={e} className="dorm-card__chip">
                          <Store size={11} aria-hidden="true" />
                          {e}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </ul>

          <div className="notice" style={{ marginTop: 22 }}>
            <Info size={16} aria-hidden="true" />
            <p>
              <strong>园区与配套：</strong>
              四个园区自南向北依次为柳园、荷园、菊园、松园，各有食堂与生活配套。
              配套的营业时间与开放安排会调整，以现场为准；宿舍房型、床位数与收费以学校通知为准。
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container container--narrow">
          <SectionHead
            eyebrow="FAQ"
            title="住宿常见问题"
            desc="回答尽量指向官方渠道，而不是给出可能过期的结论。"
          />
          <Accordion
            items={DORM_FAQ.map((f) => ({ id: f.id, question: f.question, answer: f.answer, source: f.source }))}
            defaultOpen={DORM_FAQ[0].id}
          />
        </div>
      </section>

      <section className="section section--blue">
        <div className="container cta-band">
          <div>
            <Home size={26} aria-hidden="true" />
            <h2>准备入住了吗？</h2>
            <p>先确认校区与所在学院，再看官方通知里的住宿安排，会比任何第三方汇总都更可靠。</p>
          </div>
          <div className="cta-band__actions">
            <a className="btn" href={SOURCES.campusService.url} target="_blank" rel="noopener noreferrer">
              前往校园服务
              <ExternalLink size={14} aria-hidden="true" />
            </a>
            <a className="btn btn--ghost" href={SOURCES.campusMapOfficial.url} target="_blank" rel="noopener noreferrer">
              查看官方校园地图
            </a>
          </div>
        </div>
      </section>

      <EduSpot route="/dorm" />
    </>
  );
}
