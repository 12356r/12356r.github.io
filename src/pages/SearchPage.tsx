import { ArrowRight, Search, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import EmptyState from '../components/EmptyState';
import Reveal from '../components/Reveal';
import { groupHits, searchAll } from '../utils/search';

const SUGGESTIONS = ['图书馆', '厚山', '植物园', '主校区', '计算机', '法学', '招生'];

export default function SearchPage() {
  const [params, setParams] = useSearchParams();
  const q = params.get('q') ?? '';
  const [draft, setDraft] = useState(q);

  const hits = useMemo(() => searchAll(q), [q]);
  const groups = useMemo(() => groupHits(hits), [hits]);

  const submit = (value: string) => {
    const term = value.trim();
    setDraft(value);
    if (term) setParams({ q: term }, { replace: true });
    else setParams({}, { replace: true });
  };

  return (
    <section className="section">
      <div className="container container--narrow">
        <span className="eyebrow">SITE SEARCH</span>
        <h1 className="search-page__title">站内搜索</h1>

        <form
          className="search-page__form"
          onSubmit={(e) => {
            e.preventDefault();
            submit(draft);
          }}
          role="search"
        >
          <label className="field" style={{ flex: 1 }}>
            <Search size={18} aria-hidden="true" />
            <input
              type="search"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="搜索校园地点、学院、美食、活动…"
              aria-label="搜索关键词"
            />
            {draft ? (
              <button
                type="button"
                className="icon-btn icon-btn--sm"
                onClick={() => {
                  setDraft('');
                  submit('');
                }}
                aria-label="清空关键词"
              >
                <X size={14} aria-hidden="true" />
              </button>
            ) : null}
          </label>
          <button type="submit" className="btn">
            搜索
          </button>
        </form>

        {q ? (
          <>
            <p className="result-count" aria-live="polite">
              关键词「{q}」共找到 {hits.length} 条结果
            </p>
            {groups.length > 0 ? (
              <div className="search-page__results">
                {groups.map((g) => (
                  <section key={g.type} className="search-group">
                    <h2 className="search-group__title">{g.type}</h2>
                    <ul>
                      {g.items.map((hit, i) => (
                        <Reveal as="li" key={hit.id} delay={Math.min(i, 6) * 40}>
                          <Link to={hit.to} className="search-hit search-hit--link">
                            <span className="search-hit__title">{hit.title}</span>
                            <span className="search-hit__sub">{hit.subtitle}</span>
                            <ArrowRight size={15} aria-hidden="true" />
                          </Link>
                        </Reveal>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>
            ) : (
              <EmptyState
                title="没有找到相关内容"
                desc="试试更短的关键词，或者换个说法。"
                action={
                  <button type="button" className="btn btn--ghost" onClick={() => submit('')}>
                    清空关键词
                  </button>
                }
              />
            )}
          </>
        ) : (
          <div className="search-page__hints">
            <p>输入关键词开始搜索，或试试下面这些：</p>
            <div className="chips">
              {SUGGESTIONS.map((s) => (
                <button key={s} type="button" className="chip" onClick={() => submit(s)}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
