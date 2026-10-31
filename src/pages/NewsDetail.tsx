import { ArrowLeft, ArrowRight, ExternalLink, Info } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import VerificationBadge from '../components/VerificationBadge';
import { NEWS_CHANNELS } from '../data/content';

export default function NewsDetail() {
  const { id } = useParams();
  const item = NEWS_CHANNELS.find((n) => n.id === id);

  if (!item) {
    return (
      <section className="section">
        <div className="container notfound">
          <p className="eyebrow">404</p>
          <h1>没有找到这条资讯入口</h1>
          <p>链接可能已经失效，请返回资讯列表重新选择。</p>
          <div className="notfound__actions">
            <Link className="btn" to="/news">
              返回资讯与公告
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const others = NEWS_CHANNELS.filter((n) => n.id !== item.id).slice(0, 3);

  return (
    <section className="section">
      <div className="container container--narrow">
        <Breadcrumbs items={[{ label: '资讯与公告', to: '/news' }, { label: item.title }]} />

        <header className="article-head">
          <div className="place-card__meta">
            <span className="tag">{item.category}</span>
            <VerificationBadge status={item.verification} compact />
          </div>
          <h1>{item.title}</h1>
          <p className="muted">官方渠道：{item.source.label}</p>
        </header>

        <div className="article-body">
          <p>{item.summary}</p>

          <div className="notice">
            <Info size={16} aria-hidden="true" />
            <p>
              本站不复制官方新闻正文，也不代表官方立场。页面只作为入口存在：点击下方按钮会跳转到学校官方站点，
              最新内容、发布时间与后续修订均以官方页面为准。
            </p>
          </div>

          <div className="info-card__actions" style={{ marginTop: 24 }}>
            <a className="btn" href={item.source.url} target="_blank" rel="noopener noreferrer">
              前往官方页面
              <ExternalLink size={14} aria-hidden="true" />
            </a>
            <Link className="btn btn--ghost" to="/news">
              <ArrowLeft size={14} aria-hidden="true" />
              返回列表
            </Link>
          </div>
        </div>

        <div className="article-more">
          <h2>其他官方入口</h2>
          <ul className="news-list">
            {others.map((n) => (
              <li className="news-item" key={n.id}>
                <div className="news-item__main">
                  <span className="tag">{n.category}</span>
                  <h3>
                    <Link to={`/news/${n.id}`}>{n.title}</Link>
                  </h3>
                  <p>{n.summary}</p>
                </div>
                <div className="news-item__side">
                  <Link to={`/news/${n.id}`} className="link-arrow">
                    详情
                    <ArrowRight size={14} aria-hidden="true" />
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
