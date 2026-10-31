import { ArrowUpRight, Mail, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { NAV_FLAT, SITE, SOURCES } from '../data/site';

const OFFICIAL_LINKS = [
  { label: '郑州大学官网', url: 'https://www15.zzu.edu.cn/' },
  { label: '学校简介', url: SOURCES.intro.url },
  { label: '院系专业', url: SOURCES.departmentsHumanities.url },
  { label: '校园地图（官方）', url: SOURCES.campusMapOfficial.url },
  { label: '郑州大学新闻网', url: SOURCES.news.url },
  { label: '招生网', url: SOURCES.admission.url },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <p className="footer__logo">
            <img className="footer__emblem" src="/brand/zzu-emblem.png" width={40} height={40} alt="" decoding="async" />
            郑州大学<span>校园探索</span>
          </p>
          <p className="footer__en">{SITE.nameEn}</p>
          <p className="footer__desc">
            以校园导览的方式，整理郑州大学的风光、生活、学科与参观信息。
          </p>
          <p className="footer__meta">
            <MapPin size={14} aria-hidden="true" />
            主校区：郑州市科学大道 100 号
          </p>
          <p className="footer__meta">
            <Mail size={14} aria-hidden="true" />
            <a href={`mailto:${SITE.feedbackMail}`}>内容反馈与纠错</a>
          </p>
        </div>

        <nav className="footer__col" aria-label="页脚栏目导航">
          <h2 className="footer__col-title">栏目</h2>
          <ul>
            {[...NAV_FLAT, { to: '/news', label: '资讯与公告', en: 'NEWS' }, { to: '/about', label: '关于本站', en: 'ABOUT' }].map(
              (item) => (
                <li key={item.to}>
                  <Link to={item.to}>{item.label}</Link>
                </li>
              ),
            )}
            <li>
              <Link to="/favorites">我的收藏</Link>
            </li>
          </ul>
        </nav>

        <div className="footer__col">
          <h2 className="footer__col-title">官方入口</h2>
          <ul>
            {OFFICIAL_LINKS.map((l) => (
              <li key={l.url}>
                <a href={l.url} target="_blank" rel="noopener noreferrer">
                  {l.label}
                  <ArrowUpRight size={12} aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer__col footer__col--note">
          <h2 className="footer__col-title">数据与说明</h2>
          <p>首屏使用项目方提供的校园实景照片；其余插图为示意图，未使用其他高校照片冒充郑大实景。</p>
          <p>创建者：张梦想、赵怡然、杨子涵</p>
          <p>内容更新日期：{SITE.updatedAt}</p>
        </div>
      </div>

      <div className="container footer__bottom">
        <p className="footer__disclaimer">{SITE.disclaimer}</p>
        <p className="footer__copy">© {new Date().getFullYear()} {SITE.name} · 校园文化与信息导览项目</p>
      </div>
    </footer>
  );
}
