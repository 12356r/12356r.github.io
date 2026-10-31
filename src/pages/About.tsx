import { BookOpenCheck, ExternalLink, Mail } from 'lucide-react';
import PageBanner from '../components/PageBanner';
import SectionHead from '../components/SectionHead';
import { ABOUT_FACTS, OVERVIEW_STATS, SITE, SOURCES } from '../data/site';

const PRINCIPLES = [
  '优先采用学校官网与官方公开发布的资料，不转载二手概括。',
  '内容会随学校信息更新，以学校最新公告为准。',
  '无法核验的名称、坐标、价格、时间与政策，不写成事实。',
  '首页首屏的照片由项目方提供；其余配图为本地示意插画，不使用其他高校照片冒充校园实景。',
  '页面中的校徽为郑州大学标识，仅用于非官方场景下的校名识别，版权归学校所有。',
  '内容可能变化时，以学校最新公告为准。',
];

export default function About() {
  return (
    <>
      <PageBanner
        art={{ kind: 'banner', seed: 91, mood: 'summer' }}
        eyebrow="ABOUT"
        title="关于郑州大学校园探索"
        desc="一个以校园导览方式整理郑州大学公开信息的非官方项目。我们更愿意把「不确定」标出来，而不是把它写得像事实。"
        crumbs={[{ label: '关于本站' }]}
      />

      <section className="section">
        <div className="container">
          <div className="split">
            <div className="split__main">
              <span className="eyebrow">PURPOSE</span>
              <h2>为什么做这个站点</h2>
              <p className="lead">
                访客、准大学生、家长与在校同学，常常需要同一批信息：校园在哪里、有什么、怎么去、有哪些学院、生活是什么样的。
                这些内容分散在官方站点与各种二手渠道里，而二手渠道常常把猜测写成事实。
              </p>
              <p>
                本站尝试换一种做法：把可以核验的内容整理成结构化数据，把不能核验的部分明确标注出来，
                并把每个结论都链接回它的来源。它不追求「看起来最丰富」，而是追求「经得起核对」。
              </p>
            </div>
            <aside className="split__side">
              <div className="info-card">
                <h3>项目信息</h3>
                <dl className="mini-dl">
                  <div>
                    <dt>项目性质</dt>
                    <dd>校园文化与信息导览（非官方）</dd>
                  </div>
                  <div>
                    <dt>内容更新</dt>
                    <dd>{SITE.updatedAt}</dd>
                  </div>
                  <div>
                    <dt>反馈方式</dt>
                    <dd>
                      <a href={`mailto:${SITE.feedbackMail}`}>{SITE.feedbackMail}</a>
                    </dd>
                  </div>
                </dl>
                <div className="info-card__actions">
                  <a className="btn btn--sm" href={SOURCES.home.url} target="_blank" rel="noopener noreferrer">
                    郑州大学官网
                    <ExternalLink size={13} aria-hidden="true" />
                  </a>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <SectionHead
            eyebrow="PRINCIPLES"
            title="内容原则"
            desc="这些原则决定了页面上哪些内容会出现、以什么形式出现。"
          />
          <ul className="principle-list">
            {PRINCIPLES.map((p, i) => (
              <li key={p}>
                <span className="principle-list__num">{String(i + 1).padStart(2, '0')}</span>
                {p}
              </li>
            ))}
          </ul>

          <div className="grid grid--3" style={{ marginTop: 40 }}>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHead
            eyebrow="ABOUT ZZU"
            title="关于郑州大学"
            desc="以下内容摘自学校官网“学校简介”。"
            action={
              <a className="link-arrow" href={SOURCES.intro.url} target="_blank" rel="noopener noreferrer">
                阅读原文
                <ExternalLink size={14} aria-hidden="true" />
              </a>
            }
          />
          <div className="about-facts">
            <ul className="bullet-list">
              {ABOUT_FACTS.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <dl className="stats stats--compact">
              {OVERVIEW_STATS.map((s) => (
                <div className="stat" key={s.label}>
                  <dt>{s.label}</dt>
                  <dd>
                    <strong>{s.value}</strong>
                    <span>{s.unit}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <p className="overview__source">
            数据来源：
            <a href={SOURCES.intro.url} target="_blank" rel="noopener noreferrer">
              {SOURCES.intro.label}
            </a>
          </p>
        </div>
      </section>

      <section className="section section--blue">
        <div className="container cta-band">
          <div>
            <BookOpenCheck size={26} aria-hidden="true" />
            <h2>发现内容有误？</h2>
            <p>欢迎指出具体条目与对应的官方信息，我们会据此修正。</p>
          </div>
          <div className="cta-band__actions">
            <a className="btn" href={`mailto:${SITE.feedbackMail}?subject=校园探索内容反馈`}>
              <Mail size={15} aria-hidden="true" />
              发送反馈
            </a>
          </div>
        </div>
        <div className="container">
          <p className="footer__disclaimer" style={{ marginTop: 28, color: 'var(--c-body)' }}>
            {SITE.disclaimer}
          </p>
        </div>
      </section>
    </>
  );
}
