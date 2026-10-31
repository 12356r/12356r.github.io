/**
 * 校园贴吧 · 极简后端
 *
 * 目标：让「匿名留言 + 所有人可见 + 图文」真的能跑起来，而不是只存在浏览器 localStorage 里。
 * 设计：零第三方依赖，只用 Node 内置模块；帖子存 JSON，图片存文件；同一进程同时托管 dist 静态站点。
 *
 * 运行：node server/index.js  →  http://127.0.0.1:5190/
 */
import http from 'node:http';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT || 5190);
const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const DATA_DIR = path.join(__dirname, 'data');
const UPLOAD_DIR = path.join(DATA_DIR, 'uploads');
const DB_FILE = path.join(DATA_DIR, 'posts.json');

const MAX_POSTS = 300;
const MAX_TEXT = 800;
const MAX_IMAGES = 3;
const MAX_IMAGE_BYTES = 4 * 1024 * 1024;
const POST_COOLDOWN_MS = 8000;

/** 极简 IP 冷却，避免刷屏 */
const lastPostByIp = new Map();
/** 帖子列表（内存 + JSON 落盘） */
let posts = [];

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.map': 'application/json; charset=utf-8',
};

function ensureDirs() {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  if (fs.existsSync(DB_FILE)) {
    try {
      posts = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
      if (!Array.isArray(posts)) posts = [];
    } catch {
      posts = [];
    }
  }
}

let writing = Promise.resolve();
function savePosts() {
  // 串行写临时文件再 rename，避免半截文件
  writing = writing.then(async () => {
    const tmp = `${DB_FILE}.tmp`;
    await fsp.writeFile(tmp, JSON.stringify(posts.slice(0, MAX_POSTS), null, 1), 'utf8');
    await fsp.rename(tmp, DB_FILE);
  });
  return writing;
}

function json(res, status, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    'content-length': Buffer.byteLength(body),
  });
  res.end(body);
}

function readBody(req, limit = 14 * 1024 * 1024) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', (c) => {
      size += c.length;
      if (size > limit) {
        reject(new Error('payload too large'));
        req.destroy();
        return;
      }
      chunks.push(c);
    });
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

function clientIp(req) {
  return (req.socket.remoteAddress || 'unknown').replace(/^::ffff:/, '');
}

const MAX_REPLIES_PER_POST = 100;
const MAX_REPLY_TEXT = 300;
const REPLY_COOLDOWN_MS = 4000;
const lastReplyByIp = new Map();

function publicReply(r) {
  return { id: r.id, text: r.text, createdAt: r.createdAt, nickname: r.nickname };
}

/** 四个板块：种草 / 交友 / 心事 / 经验 */
const CATEGORIES = ['种草', '交友', '心事', '经验'];
const DEFAULT_CATEGORY = '种草';

function publicPost(p) {
  return {
    id: p.id,
    text: p.text,
    images: p.images,
    createdAt: p.createdAt,
    nickname: p.nickname,
    likes: p.likes || 0,
    category: p.category || DEFAULT_CATEGORY,
    replies: (p.replies || []).slice(-MAX_REPLIES_PER_POST).map(publicReply),
  };
}

/** 匿名昵称：由 id 派生，稳定且不涉及任何个人信息 */
const ADJ = ['勤奋', '安静', '爱笑', '早起', '夜跑', '读书', '认真', '慢热', '好奇', '爱猫'];
function nicknameFor(id) {
  const h = crypto.createHash('sha1').update(id).digest();
  return `${ADJ[h[0] % ADJ.length]}的郑大同学`;
}

async function handleApi(req, res, url) {
  const { pathname } = url;

  if (pathname === '/api/board/posts' && req.method === 'GET') {
    return json(res, 200, { posts: posts.slice(0, 100).map(publicPost), total: posts.length });
  }

  /* 单条留言：供「我的收藏」按 id 取回内容 */
  const oneMatch = /^\/api\/board\/posts\/([0-9a-f-]{36})$/.exec(pathname);
  if (oneMatch && req.method === 'GET') {
    const post = posts.find((p) => p.id === oneMatch[1]);
    if (!post) return json(res, 404, { error: '留言不存在或已被删除' });
    return json(res, 200, { post: publicPost(post) });
  }

  if (pathname === '/api/board/posts' && req.method === 'POST') {
    const ip = clientIp(req);
    const now = Date.now();
    const last = lastPostByIp.get(ip) || 0;
    if (now - last < POST_COOLDOWN_MS) {
      return json(res, 429, { error: `发得太快了，请 ${Math.ceil((POST_COOLDOWN_MS - (now - last)) / 1000)} 秒后再试` });
    }

    let body;
    try {
      body = JSON.parse((await readBody(req)).toString('utf8') || '{}');
    } catch {
      return json(res, 400, { error: '请求格式不正确' });
    }

    const text = String(body.text || '').trim().slice(0, MAX_TEXT);
    const rawImages = Array.isArray(body.images) ? body.images.slice(0, MAX_IMAGES) : [];
    const category = CATEGORIES.includes(body.category) ? body.category : DEFAULT_CATEGORY;

    if (!text && rawImages.length === 0) {
      return json(res, 400, { error: '写点什么，或者选一张照片' });
    }

    const id = crypto.randomUUID();
    const savedImages = [];
    for (const [i, dataUrl] of rawImages.entries()) {
      if (typeof dataUrl !== 'string') continue;
      const m = /^data:image\/(png|jpe?g|webp);base64,(.+)$/i.exec(dataUrl);
      if (!m) continue;
      const buf = Buffer.from(m[2], 'base64');
      if (buf.length > MAX_IMAGE_BYTES) {
        return json(res, 413, { error: '单张照片太大了（上限 4MB）' });
      }
      const ext = m[1].toLowerCase() === 'png' ? 'png' : m[1].toLowerCase() === 'webp' ? 'webp' : 'jpg';
      const file = `${id}-${i}.${ext}`;
      await fsp.writeFile(path.join(UPLOAD_DIR, file), buf);
      savedImages.push(`/uploads/${file}`);
    }

    const post = {
      id,
      text,
      images: savedImages,
      nickname: nicknameFor(id),
      createdAt: new Date().toISOString(),
      deleteToken: crypto.randomBytes(12).toString('hex'),
      likes: 0,
      category,
    };

    posts.unshift(post);
    if (posts.length > MAX_POSTS) posts = posts.slice(0, MAX_POSTS);
    lastPostByIp.set(ip, now);
    await savePosts();

    return json(res, 201, { post: publicPost(post), deleteToken: post.deleteToken });
  }

  /* ---------- 回复 ---------- */
  const replyMatch = /^\/api\/board\/posts\/([0-9a-f-]{36})\/replies$/.exec(pathname);
  if (replyMatch && req.method === 'POST') {
    const ip = clientIp(req);
    const now = Date.now();
    const last = lastReplyByIp.get(ip) || 0;
    if (now - last < REPLY_COOLDOWN_MS) {
      return json(res, 429, { error: '回复太快了，缓一下再发' });
    }

    const post = posts.find((p) => p.id === replyMatch[1]);
    if (!post) return json(res, 404, { error: '帖子不存在' });

    let body;
    try {
      body = JSON.parse((await readBody(req)).toString('utf8') || '{}');
    } catch {
      return json(res, 400, { error: '请求格式不正确' });
    }

    const text = String(body.text || '').trim().slice(0, MAX_REPLY_TEXT);
    if (!text) return json(res, 400, { error: '回复内容不能为空' });

    if (!Array.isArray(post.replies)) post.replies = [];
    if (post.replies.length >= MAX_REPLIES_PER_POST) {
      return json(res, 429, { error: '这条留言的回复已经满了' });
    }

    const reply = {
      id: crypto.randomUUID(),
      text,
      nickname: nicknameFor(crypto.randomUUID()),
      createdAt: new Date().toISOString(),
      deleteToken: crypto.randomBytes(12).toString('hex'),
    };
    post.replies.push(reply);
    lastReplyByIp.set(ip, now);
    await savePosts();

    return json(res, 201, { reply: publicReply(reply), deleteToken: reply.deleteToken });
  }

  const delReplyMatch = /^\/api\/board\/posts\/([0-9a-f-]{36})\/replies\/([0-9a-f-]{36})$/.exec(pathname);
  if (delReplyMatch && req.method === 'DELETE') {
    const token = req.headers['x-delete-token'];
    const post = posts.find((p) => p.id === delReplyMatch[1]);
    if (!post || !Array.isArray(post.replies)) return json(res, 404, { error: '帖子不存在' });
    const idx = post.replies.findIndex((r) => r.id === delReplyMatch[2]);
    if (idx === -1) return json(res, 404, { error: '回复不存在' });
    if (!token || post.replies[idx].deleteToken !== token) return json(res, 403, { error: '只能删除自己的回复' });
    post.replies.splice(idx, 1);
    await savePosts();
    return json(res, 200, { ok: true });
  }

  const delMatch = /^\/api\/board\/posts\/([0-9a-f-]{36})$/.exec(pathname);
  if (delMatch && req.method === 'DELETE') {
    const token = req.headers['x-delete-token'];
    const idx = posts.findIndex((p) => p.id === delMatch[1]);
    if (idx === -1) return json(res, 404, { error: '帖子不存在' });
    if (!token || posts[idx].deleteToken !== token) return json(res, 403, { error: '只能删除自己发布的留言' });
    const [removed] = posts.splice(idx, 1);
    for (const img of removed.images || []) {
      fsp.unlink(path.join(UPLOAD_DIR, path.basename(img))).catch(() => {});
    }
    await savePosts();
    return json(res, 200, { ok: true });
  }

  if (pathname === '/api/board/stats') {
    return json(res, 200, { total: posts.length });
  }

  return json(res, 404, { error: '接口不存在' });
}

function serveFile(res, file, cache = 'public, max-age=3600') {
  fs.stat(file, (err, stat) => {
    if (err || !stat.isFile()) {
      res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
      res.end('Not found');
      return;
    }
    const ext = path.extname(file).toLowerCase();
    res.writeHead(200, {
      'content-type': MIME[ext] || 'application/octet-stream',
      'content-length': stat.size,
      'cache-control': cache,
    });
    fs.createReadStream(file).pipe(res);
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  try {
    if (url.pathname.startsWith('/api/')) {
      return await handleApi(req, res, url);
    }
    if (url.pathname.startsWith('/uploads/')) {
      const name = path.basename(url.pathname);
      return serveFile(res, path.join(UPLOAD_DIR, name), 'public, max-age=86400');
    }
    // 静态资源：dist 优先，找不到就回落到 index.html（SPA 路由）
    const rel = decodeURIComponent(url.pathname).replace(/^\/+/, '');
    const candidate = path.join(DIST, rel);
    if (rel && candidate.startsWith(DIST) && fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      /* HTML 不缓存：否则改版后浏览器仍拿旧页面引用的旧 JS */
      const isHtml = candidate.toLowerCase().endsWith('.html');
      return serveFile(res, candidate, isHtml ? 'no-store' : 'public, max-age=3600');
    }
    const indexFile = path.join(DIST, 'index.html');
    if (fs.existsSync(indexFile)) return serveFile(res, indexFile, 'no-store');
    res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
    res.end('dist 尚未构建，请先运行 pnpm build');
  } catch (err) {
    console.error(err);
    if (!res.headersSent) json(res, 500, { error: '服务器开小差了' });
  }
});

ensureDirs();
server.listen(PORT, '127.0.0.1', () => {
  console.log(`校园贴吧服务已启动：http://127.0.0.1:${PORT}/  (数据目录 server/data)`);
});
