import { ArrowRight, Bookmark, Star, Trash2, UtensilsCrossed, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import EmptyState from '../components/EmptyState';
import PageBanner from '../components/PageBanner';
import PlaceCard from '../components/PlaceCard';
import Reveal from '../components/Reveal';
import { CANTEEN_PICKS, FOOD_ITEMS } from '../data/content';
import { PLACES } from '../data/scenery';
import { useFavorites } from '../hooks/useFavorites';

interface BoardPostLite {
  id: string;
  text: string;
  category: string;
  nickname: string;
  createdAt: string;
  images: string[];
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default function Favorites() {
  const { ids, clear, remove } = useFavorites();
  const saved = PLACES.filter((p) => ids.includes(`place-${p.id}`));
  const boardIds = ids.filter((id) => id.startsWith('board-')).map((id) => id.slice(6));
  const savedPicks = CANTEEN_PICKS.filter((p) => ids.includes(`pick-${p.id}`));

  const [boardPosts, setBoardPosts] = useState<BoardPostLite[]>([]);
  const [missing, setMissing] = useState<string[]>([]);
  const [boardOffline, setBoardOffline] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (boardIds.length === 0) {
      setBoardPosts([]);
      setMissing([]);
      setBoardOffline(false);
      return;
    }
    (async () => {
      const results = await Promise.all(
        boardIds.map(async (id) => {
          try {
            const res = await fetch(`/api/board/posts/${id}`, { cache: 'no-store' });
            if (res.status === 404) return { id, post: null as BoardPostLite | null, gone: true };
            if (!res.ok) throw new Error(String(res.status));
            const data = (await res.json()) as { post: BoardPostLite };
            return { id, post: data.post, gone: false };
          } catch {
            return { id, post: null as BoardPostLite | null, gone: false };
          }
        }),
      );
      if (cancelled) return;
      const found = results.filter((r) => r.post).map((r) => r.post as BoardPostLite);
      const gone = results.filter((r) => r.gone).map((r) => r.id);
      const failed = results.filter((r) => !r.post && !r.gone);
      setBoardPosts(found);
      setMissing(gone);
      setBoardOffline(failed.length > 0);
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids.join(',')]);

  const total = saved.length + boardPosts.length + missing.length + savedPicks.length;

  return (
    <>
      <PageBanner
        art={{ kind: 'banner', seed: 11, mood: 'autumn' }}
        eyebrow="MY COLLECTION"
        title="我的收藏"
        desc="收藏保存在当前浏览器（localStorage）中，清除浏览器数据后会丢失。贴吧留言被作者删除后，这里会显示为失效条目。"
        crumbs={[{ label: '我的收藏' }]}
      />

      <section className="section">
        <div className="container">
          {total > 0 ? (
            <>
              <div className="favorites-head">
                <p className="result-count" aria-live="polite">
                  共收藏 {total} 项{saved.length > 0 ? ` · 地点 ${saved.length}` : ''}
                  {savedPicks.length > 0 ? ` · 食堂推荐 ${savedPicks.length}` : ''}
                  {boardPosts.length + missing.length > 0 ? ` · 贴吧留言 ${boardPosts.length + missing.length}` : ''}
                </p>
                <button type="button" className="btn btn--ghost btn--sm" onClick={clear}>
                  <Trash2 size={14} aria-hidden="true" />
                  清空收藏
                </button>
              </div>

              {saved.length > 0 ? (
                <div className="grid grid--3">
                  {saved.map((p, i) => (
                    <Reveal key={p.id} delay={Math.min(i, 6) * 60}>
                      <PlaceCard place={p} />
                    </Reveal>
                  ))}
                </div>
              ) : null}

              {savedPicks.length > 0 ? (
                <div className="fav-board">
                  <h2 className="fav-board__title">
                    <UtensilsCrossed size={16} aria-hidden="true" />
                    食堂档口
                    <span>{savedPicks.length}</span>
                  </h2>
                  <ul className="fav-picks">
                    {savedPicks.map((pick) => {
                      const canteen = FOOD_ITEMS.find((f) => f.id === pick.canteenId);
                      return (
                        <li key={pick.id} className="fav-pick">
                          <div className="fav-pick__media">
                            <img src={pick.image} alt={pick.imageAlt} loading="lazy" />
                          </div>
                          <div className="fav-pick__body">
                            <div className="fav-pick__top">
                              <h3 className="fav-pick__name">{pick.name}</h3>
                              {pick.price ? <span className="fav-pick__price">{pick.price}</span> : null}
                              <button
                                type="button"
                                className="fav-board__remove"
                                onClick={() => remove(`pick-${pick.id}`)}
                                aria-label="从收藏中移除这个档口"
                              >
                                <X size={13} aria-hidden="true" />
                              </button>
                            </div>
                            <p className="fav-pick__meta">
                              {canteen?.name ?? '食堂'}
                              {pick.floor ? ` · ${pick.floor}` : ''}
                            </p>
                            <Link className="link-arrow" to={`/food/${pick.canteenId}`}>
                              去这家食堂
                              <ArrowRight size={13} aria-hidden="true" />
                            </Link>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : null}

              {boardPosts.length > 0 || missing.length > 0 ? (
                <div className="fav-board">
                  <h2 className="fav-board__title">
                    <Bookmark size={16} aria-hidden="true" />
                    贴吧留言
                    <span>{boardPosts.length + missing.length}</span>
                  </h2>

                  {boardOffline ? (
                    <p className="fav-board__hint">
                      有一条留言暂时取不回来——贴吧需要后端（<code>node server/index.js</code>）才能读取内容。
                    </p>
                  ) : null}

                  <ul className="fav-board__list">
                    {boardPosts.map((p) => (
                      <li key={p.id} className="fav-board__item">
                        <div className="fav-board__head">
                          <span className={`board-tag board-tag--${p.category}`}>{p.category}贴</span>
                          <span className="fav-board__name">{p.nickname}</span>
                          <time className="fav-board__time" dateTime={p.createdAt}>
                            {formatDate(p.createdAt)}
                          </time>
                          <button
                            type="button"
                            className="fav-board__remove"
                            onClick={() => remove(`board-${p.id}`)}
                            aria-label="从收藏中移除这条留言"
                          >
                            <X size={13} aria-hidden="true" />
                          </button>
                        </div>
                        <p className="fav-board__text">{p.text || '（这条留言只有图片）'}</p>
                        {p.images.length > 0 ? (
                          <p className="fav-board__imgs">
                            <Bookmark size={12} aria-hidden="true" /> 含 {p.images.length} 张照片
                          </p>
                        ) : null}
                        <Link className="link-arrow" to={`/board?post=${p.id}`}>
                          回贴吧查看
                          <ArrowRight size={13} aria-hidden="true" />
                        </Link>
                      </li>
                    ))}

                    {missing.map((id) => (
                      <li key={id} className="fav-board__item fav-board__item--gone">
                        <div className="fav-board__head">
                          <span className="fav-board__name">这条留言已被删除</span>
                          <button
                            type="button"
                            className="fav-board__remove"
                            onClick={() => remove(`board-${id}`)}
                            aria-label="从收藏中移除这条失效留言"
                          >
                            <X size={13} aria-hidden="true" />
                          </button>
                        </div>
                        <p className="fav-board__text muted">收藏时的留言已不在贴吧中，可以从这里清掉。</p>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </>
          ) : (
            <EmptyState
              icon={<Star size={26} aria-hidden="true" />}
              title="还没有收藏任何内容"
              desc="在校园风光点卡片右上角的星标收藏地点；在食堂详情页点档口图上的书签收藏菜品；在校园贴吧点留言上的书签收藏留言。"
              action={
                <Link className="btn" to="/life">
                  去校园生活看看
                  <ArrowRight size={15} aria-hidden="true" />
                </Link>
              }
            />
          )}
        </div>
      </section>
    </>
  );
}
