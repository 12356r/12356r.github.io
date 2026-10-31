import { Bookmark, ImagePlus, Loader2, Lock, MessageSquare, RefreshCw, Send, Trash2, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Lightbox from '../components/Lightbox';
import EduSpot from '../components/EduSpot';
import PageBanner from '../components/PageBanner';
import { useFavorites } from '../hooks/useFavorites';

interface BoardReply {
  id: string;
  text: string;
  createdAt: string;
  nickname: string;
}

interface BoardPost {
  id: string;
  text: string;
  images: string[];
  createdAt: string;
  nickname: string;
  likes: number;
  category: BoardCategory;
  replies: BoardReply[];
}

const CATEGORIES = [
  { id: '种草', en: 'PICKS', hint: '好吃好用好去处' },
  { id: '交友', en: 'FRIENDS', hint: '找搭子、约自习' },
  { id: '心事', en: 'FEELINGS', hint: '想说但没处说的话' },
  { id: '经验', en: 'TIPS', hint: '选课、考试、办事流程' },
] as const;

type BoardCategory = (typeof CATEGORIES)[number]['id'];

const MAX_TEXT = 800;
const MAX_IMAGES = 3;
const MAX_REPLY = 300;
const TOKEN_KEY = 'zzu-board:owned';

/** 位置：同一进程托管，前端直接打同源接口 */
const API = '/api/board';

function relativeTime(iso: string): string {
  const t = new Date(iso).getTime();
  const diff = Date.now() - t;
  if (Number.isNaN(t)) return '';
  if (diff < 60_000) return '刚刚';
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)} 分钟前`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)} 小时前`;
  if (diff < 7 * 86_400_000) return `${Math.floor(diff / 86_400_000)} 天前`;
  const d = new Date(t);
  return `${d.getMonth() + 1} 月 ${d.getDate()} 日`;
}

function readOwned(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(TOKEN_KEY) || '{}');
  } catch {
    return {};
  }
}

function writeOwned(map: Record<string, string>) {
  localStorage.setItem(TOKEN_KEY, JSON.stringify(map));
}

/** 浏览器端先压到最长边 1400px，减少上传体积 */
async function fileToDataUrl(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 1400 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('canvas unavailable');
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close?.();
  return canvas.toDataURL('image/jpeg', 0.82);
}

export default function Board() {
  const [posts, setPosts] = useState<BoardPost[]>([]);
  const [params] = useSearchParams();
  const focusId = params.get('post');
  const { has, toggle } = useFavorites();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [text, setText] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [offline, setOffline] = useState(false);
  const [owned, setOwned] = useState<Record<string, string>>({});
  const [viewer, setViewer] = useState<{ postId: string; index: number } | null>(null);
  const [category, setCategory] = useState<BoardCategory>('种草');
  const [filter, setFilter] = useState<'all' | BoardCategory>('all');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const load = useCallback(async (silent = false) => {
    if (!silent) setRefreshing(true);
    try {
      const res = await fetch(`${API}/posts`, { cache: 'no-store' });
      if (!res.ok) throw new Error(String(res.status));
      const data = (await res.json()) as { posts: BoardPost[] };
      setPosts(data.posts);
      setOffline(false);
    } catch {
      setOffline(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    setOwned(readOwned());
    void load();
    const timer = window.setInterval(() => void load(true), 12_000);
    return () => window.clearInterval(timer);
  }, [load]);

  /* 从「我的收藏」带 ?post=<id> 进来时，滚到该留言并高亮 */
  useEffect(() => {
    if (!focusId || loading) return;
    const el = document.getElementById(`post-${focusId}`);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [focusId, loading, posts]);

  const pickImages = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError(null);
    const room = MAX_IMAGES - images.length;
    const list = Array.from(files).slice(0, Math.max(0, room));
    const next: string[] = [];
    for (const f of list) {
      if (!f.type.startsWith('image/')) continue;
      if (f.size > 8 * 1024 * 1024) {
        setError('单张照片请不要超过 8MB');
        continue;
      }
      try {
        next.push(await fileToDataUrl(f));
      } catch {
        setError('这张照片读不出来，换一张试试');
      }
    }
    setImages((prev) => [...prev, ...next].slice(0, MAX_IMAGES));
    if (fileRef.current) fileRef.current.value = '';
  };

  const submit = async () => {
    if (sending) return;
    const body = text.trim();
    if (!body && images.length === 0) {
      setError('写点什么，或者选一张照片');
      return;
    }
    setSending(true);
    setError(null);
    try {
      const res = await fetch(`${API}/posts`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ text: body, images, category }),
      });
      const data = (await res.json()) as { post?: BoardPost; deleteToken?: string; error?: string };
      if (!res.ok || !data.post) {
        setError(data.error || '发布失败，稍后再试');
        return;
      }
      setPosts((prev) => [data.post as BoardPost, ...prev]);
      if (data.deleteToken) {
        const map = { ...readOwned(), [data.post.id]: data.deleteToken };
        writeOwned(map);
        setOwned(map);
      }
      setText('');
      setImages([]);
    } catch {
      setError('连不上服务器：贴吧需要先用 node server/index.js 启动服务');
    } finally {
      setSending(false);
    }
  };

  const remove = async (post: BoardPost) => {
    const token = owned[post.id];
    if (!token) return;
    if (!window.confirm('删除这条留言？删除后不可恢复。')) return;
    try {
      const res = await fetch(`${API}/posts/${post.id}`, {
        method: 'DELETE',
        headers: { 'x-delete-token': token },
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setError(data.error || '删除失败');
        return;
      }
      setPosts((prev) => prev.filter((p) => p.id !== post.id));
      const map = { ...owned };
      delete map[post.id];
      writeOwned(map);
      setOwned(map);
    } catch {
      setError('删除失败，检查服务是否在运行');
    }
  };

  const submitReply = async (post: BoardPost) => {
    const body = replyText.trim();
    if (!body || sendingReply) return;
    setSendingReply(true);
    setError(null);
    try {
      const res = await fetch(`${API}/posts/${post.id}/replies`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ text: body }),
      });
      const data = (await res.json()) as { reply?: BoardReply; deleteToken?: string; error?: string };
      if (!res.ok || !data.reply) {
        setError(data.error || '回复失败，稍后再试');
        return;
      }
      setPosts((prev) =>
        prev.map((p) => (p.id === post.id ? { ...p, replies: [...(p.replies ?? []), data.reply as BoardReply] } : p)),
      );
      if (data.deleteToken) {
        const map = { ...readOwned(), [data.reply.id]: data.deleteToken };
        writeOwned(map);
        setOwned(map);
      }
      setReplyText('');
      setReplyTo(null);
    } catch {
      setError('连不上服务器，回复没有发出去');
    } finally {
      setSendingReply(false);
    }
  };

  const removeReply = async (post: BoardPost, reply: BoardReply) => {
    const token = owned[reply.id];
    if (!token) return;
    if (!window.confirm('删除这条回复？')) return;
    try {
      const res = await fetch(`${API}/posts/${post.id}/replies/${reply.id}`, {
        method: 'DELETE',
        headers: { 'x-delete-token': token },
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setError(data.error || '删除失败');
        return;
      }
      setPosts((prev) =>
        prev.map((p) => (p.id === post.id ? { ...p, replies: (p.replies ?? []).filter((r) => r.id !== reply.id) } : p)),
      );
      const map = { ...owned };
      delete map[reply.id];
      writeOwned(map);
      setOwned(map);
    } catch {
      setError('删除失败，检查服务是否在运行');
    }
  };

  const viewing = viewer ? posts.find((p) => p.id === viewer.postId) : null;
  const visiblePosts = filter === 'all' ? posts : posts.filter((p) => p.category === filter);

  return (
    <>
      <PageBanner
        art={{ kind: 'banner', seed: 21, mood: 'dusk' }}
        image="/images/board/board-banner.jpg"
        imageSm="/images/board/board-banner-sm.jpg"
        imageAlt="郑州大学校园里的石墙与「郑州大学」题字牌，墙上有树影与竹枝"
        eyebrow="CAMPUS BOARD"
        title="校园贴吧 · 匿名留言板"
        desc="在这里，你可以种草、找搭子、说说心事，也可以把踩过的坑留给后来人。匿名很容易，好好说话不容易——这大概是最日常的一次自我修养。"
        crumbs={[{ label: '校园贴吧' }]}
      />

      <section className="section">
        <div className="container board">
          <div className="board__main">
            {/* 发布 */}
            <div className="board-compose">
              <div className="board-compose__head">
                <span className="board-compose__anon">
                  <Lock size={13} aria-hidden="true" />
                  匿名发布
                </span>
                <span className="muted">所有人可见 · 管理员可清理违规内容</span>
              </div>

              <div className="board-cats" role="radiogroup" aria-label="选择板块">
                {CATEGORIES.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    role="radio"
                    aria-checked={category === c.id}
                    className={`board-cat board-cat--${c.id} ${category === c.id ? 'is-on' : ''}`}
                    onClick={() => setCategory(c.id)}
                  >
                    <span className="board-cat__name">{c.id}贴</span>
                    <span className="board-cat__hint">{c.hint}</span>
                  </button>
                ))}
              </div>

              <textarea
                className="board-compose__text"
                value={text}
                maxLength={MAX_TEXT}
                onChange={(e) => setText(e.target.value)}
                placeholder={`想对郑大说点什么？当前发在「${category}贴」——${CATEGORIES.find((c) => c.id === category)?.hint}。`}
                rows={4}
              />

              {images.length > 0 ? (
                <ul className="board-thumbs">
                  {images.map((src, i) => (
                    <li key={i}>
                      <img src={src} alt={`待发布的照片 ${i + 1}`} />
                      <button
                        type="button"
                        className="board-thumbs__del"
                        aria-label="移除这张照片"
                        onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
                      >
                        <X size={12} aria-hidden="true" />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}

              <div className="board-compose__foot">
                <div className="board-compose__tools">
                  <button
                    type="button"
                    className="btn btn--ghost btn--sm"
                    onClick={() => fileRef.current?.click()}
                    disabled={images.length >= MAX_IMAGES}
                  >
                    <ImagePlus size={14} aria-hidden="true" />
                    照片 {images.length > 0 ? `${images.length}/${MAX_IMAGES}` : ''}
                  </button>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    multiple
                    hidden
                    onChange={(e) => void pickImages(e.target.files)}
                  />
                  <span className="board-compose__count">
                    {text.length}/{MAX_TEXT}
                  </span>
                </div>
                <button type="button" className="btn btn--sm" onClick={() => void submit()} disabled={sending}>
                  {sending ? <Loader2 size={14} className="spin" aria-hidden="true" /> : <Send size={14} aria-hidden="true" />}
                  {sending ? '发布中' : '匿名发布'}
                </button>
              </div>

              {error ? <p className="board-error">{error}</p> : null}
              {offline ? (
                <p className="board-error">
                  连不上留言服务。这个板块需要后端：在项目目录运行 <code>node server/index.js</code>，再打开
                  <code>http://127.0.0.1:5190/board</code>。
                </p>
              ) : null}
            </div>

            {/* 列表 */}
            <div className="board-list">
              <div className="board-list__head">
                <h2>
                  <MessageSquare size={16} aria-hidden="true" />
                  {filter === 'all' ? '全部留言' : `${filter}贴`}
                  <span className="board-list__count">{visiblePosts.length}</span>
                </h2>
                <button type="button" className="btn btn--ghost btn--sm" onClick={() => void load()} disabled={refreshing}>
                  <RefreshCw size={13} className={refreshing ? 'spin' : ''} aria-hidden="true" />
                  刷新
                </button>
              </div>

              <div className="board-filter" role="tablist" aria-label="按板块筛选">
                <button
                  type="button"
                  role="tab"
                  aria-selected={filter === 'all'}
                  className={`board-filter__item ${filter === 'all' ? 'is-on' : ''}`}
                  onClick={() => setFilter('all')}
                >
                  全部
                  <span>{posts.length}</span>
                </button>
                {CATEGORIES.map((c) => {
                  const count = posts.filter((p) => p.category === c.id).length;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      role="tab"
                      aria-selected={filter === c.id}
                      className={`board-filter__item board-filter__item--${c.id} ${filter === c.id ? 'is-on' : ''}`}
                      onClick={() => setFilter(c.id)}
                    >
                      {c.id}贴
                      <span>{count}</span>
                    </button>
                  );
                })}
              </div>

              {loading ? (
                <p className="board-empty">
                  <Loader2 size={16} className="spin" aria-hidden="true" /> 正在加载留言…
                </p>
              ) : visiblePosts.length === 0 ? (
                <p className="board-empty">
                  {filter === 'all' ? '还没有人留言。第一条就交给你了。' : `这个板块还没有${filter}贴，来发第一条吧。`}
                </p>
              ) : (
                <ul className="board-posts">
                  {visiblePosts.map((p) => {
                    const favId = `board-${p.id}`;
                    const saved = has(favId);
                    return (
                    <li
                      key={p.id}
                      id={`post-${p.id}`}
                      className={`board-post ${focusId === p.id ? 'is-focused' : ''}`}
                    >
                      <div className="board-post__head">
                        <span className="board-post__avatar" aria-hidden="true">
                          {p.nickname.slice(0, 1)}
                        </span>
                        <span className="board-post__name">{p.nickname}</span>
                        <span className={`board-tag board-tag--${p.category}`}>{p.category}贴</span>
                        <time className="board-post__time" dateTime={p.createdAt}>
                          {relativeTime(p.createdAt)}
                        </time>
                        <button
                          type="button"
                          className={`board-post__fav ${saved ? 'is-on' : ''}`}
                          onClick={() => toggle(favId)}
                          aria-pressed={saved}
                          aria-label={saved ? '取消收藏这条留言' : '收藏这条留言'}
                          title={saved ? '已收藏，可在「我的收藏」查看' : '收藏到「我的收藏」'}
                        >
                          <Bookmark size={13} aria-hidden="true" fill={saved ? 'currentColor' : 'none'} />
                        </button>
                        {owned[p.id] ? (
                          <button
                            type="button"
                            className="board-post__del"
                            onClick={() => void remove(p)}
                            aria-label="删除我发布的这条留言"
                          >
                            <Trash2 size={13} aria-hidden="true" />
                          </button>
                        ) : null}
                      </div>
                      {p.text ? <p className="board-post__text">{p.text}</p> : null}
                      {p.images.length > 0 ? (
                        <div className={`board-post__images board-post__images--${Math.min(p.images.length, 3)}`}>
                          {p.images.map((src, i) => (
                            <button
                              key={src}
                              type="button"
                              className="board-post__image"
                              onClick={() => setViewer({ postId: p.id, index: i })}
                              aria-label="查看大图"
                            >
                              <img src={src} alt={`${p.nickname}发布的照片 ${i + 1}`} loading="lazy" />
                            </button>
                          ))}
                        </div>
                      ) : null}

                      {/* 回复区 */}
                      <div className="board-replies">
                        {p.replies.length > 0 ? (
                          <ul className="board-reply-list">
                            {p.replies.map((r) => (
                              <li key={r.id} className="board-reply">
                                <span className="board-reply__name">{r.nickname}</span>
                                <span className="board-reply__text">{r.text}</span>
                                <time className="board-reply__time" dateTime={r.createdAt}>
                                  {relativeTime(r.createdAt)}
                                </time>
                                {owned[r.id] ? (
                                  <button
                                    type="button"
                                    className="board-reply__del"
                                    onClick={() => void removeReply(p, r)}
                                    aria-label="删除我发布的这条回复"
                                  >
                                    <X size={11} aria-hidden="true" />
                                  </button>
                                ) : null}
                              </li>
                            ))}
                          </ul>
                        ) : null}

                        {replyTo === p.id ? (
                          <div className="board-reply-form">
                            <textarea
                              className="board-reply-form__input"
                              value={replyText}
                              maxLength={MAX_REPLY}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder="匿名回复，说点具体的…"
                              rows={2}
                              autoFocus
                            />
                            <div className="board-reply-form__foot">
                              <span className="board-reply-form__count">
                                {replyText.length}/{MAX_REPLY}
                              </span>
                              <button
                                type="button"
                                className="btn btn--ghost btn--sm"
                                onClick={() => {
                                  setReplyTo(null);
                                  setReplyText('');
                                }}
                              >
                                取消
                              </button>
                              <button
                                type="button"
                                className="btn btn--sm"
                                onClick={() => void submitReply(p)}
                                disabled={sendingReply || !replyText.trim()}
                              >
                                {sendingReply ? <Loader2 size={13} className="spin" aria-hidden="true" /> : <Send size={13} aria-hidden="true" />}
                                回复
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            type="button"
                            className="board-reply-btn"
                            onClick={() => {
                              setReplyTo(p.id);
                              setReplyText('');
                            }}
                          >
                            <MessageSquare size={13} aria-hidden="true" />
                            {p.replies.length > 0 ? `${p.replies.length} 条回复 · 我也说两句` : '回复'}
                          </button>
                        )}
                      </div>
                    </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>
      </section>

      <Lightbox
        open={Boolean(viewer && viewing)}
        onClose={() => setViewer(null)}
        label="留言中的照片"
      >
        {viewing && viewer ? (
          <img
            src={viewing.images[viewer.index]}
            alt={`${viewing.nickname}发布的照片`}
            style={{ width: '100%', height: 'auto', borderRadius: 12, display: 'block' }}
          />
        ) : null}
      </Lightbox>

      <EduSpot route="/board" />
    </>
  );
}
