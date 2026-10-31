import { ArrowRight, ExternalLink, Info, Newspaper } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import EmptyState from '../components/EmptyState';
import PageBanner from '../components/PageBanner';
import Reveal from '../components/Reveal';
import VerificationBadge from '../components/VerificationBadge';
import { NEWS_CATEGORIES, NEWS_CHANNELS } from '../data/content';

export default function News() {
  const [category, setCategory] = useState<string>('全部');

  const list = useMemo(
    () => NEWS_CHANNELS.filter((n) => category === '全部' || n.category === category),
    [category],
  );

  return (
    <>
      <PageBanner
        art={{ kind: 'banner', seed: 23, mood: 'dusk' }}
        eyebrow="NEWS & NOTICE"
        title="资讯与公告"
        desc="本站不转载、不改写、不编造新闻。这里只提供学校官方信息渠道的入口与说明，所有动态请以官方发布为准。"
        crumbs={[{ label: '资讯与公告' }]}
      />

      <section className="section">
        <div className="container">
          <div className="notice" style={{ marginBottom: 26 }}>
            <Info size={16} aria-hidden="true" />
            <p>
              <strong>为什么这里没有新闻列表？</strong>
              新闻标题、获奖信息与公告日期必须与官方原文一致。本站没有建立自动同步机制，
              为避免信息过期或失真，改为直接提供官方渠道入口。
            </p>
          </div>

          <div className="chips" role="group" aria-label="按资讯分类筛选" style={{ marginBottom: 26 }}>
            {NEWS_CATEGORIES.map((c) => (
              <button key={c} type="button" className="chip" aria-pressed={category === c} onClick={() => setCategory(c)}>
                {c}
                <span className="chip__count">
                  {c === '全部' ? NEWS_CHANNELS.length : NEWS_CHANNELS.filter((n) => n.category === c).length}
                </span>
              </button>
            ))}
          </div>

          {list.length > 0 ? (
            <ul className="news-list">
              {list.map((n, i) => (
                <Reveal as="li" key={n.id} delay={i * 50} className="news-item">
                  <div className="news-item__main">
                    <span className="tag">{n.category}</span>
                    <h3>
                      <Link to={`/news/${n.id}`}>{n.title}</Link>
                    </h3>
                    <p>{n.summary}</p>
                  </div>
                  <div className="news-item__side">
                    <VerificationBadge status={n.verification} compact />
                    <Link to={`/news/${n.id}`} className="link-arrow">
                      详情
                      <ArrowRight size={14} aria-hidden="true" />
                    </Link>
                    <a className="link-arrow" href={n.source.url} target="_blank" rel="noopener noreferrer">
                      官网
                      <ExternalLink size={13} aria-hidden="true" />
                    </a>
                  </div>
                </Reveal>
              ))}
            </ul>
          ) : (
            <EmptyState
              icon={<Newspaper size={26} aria-hidden="true" />}
              title="该分类暂无入口"
              desc="切换其他分类，或直接前往学校官方渠道查看。"
            />
          )}
        </div>
      </section>
    </>
  );
}
