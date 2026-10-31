/**
 * 用 GitHub REST API 上传整个项目（不需要安装 git）。
 *
 * 用法：
 *   node tools/github-upload.mjs --user <GitHub用户名> --repo <仓库名> [--private] [--dir <项目目录>]
 *   token 从环境变量 GITHUB_TOKEN 读取
 *
 * 说明：
 * - 机器上的 hosts 把 github.com / api.github.com 指到了 127.0.0.1，
 *   所以这里用自定义 lookup 强制解析到真实 IP，绕过 hosts。
 * - 只上传源码与图片，跳过 node_modules / dist / shots / server/data。
 */
import { request } from 'node:https';
import { readFile, readdir, stat } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';
import { createHash } from 'node:crypto';

/* GitHub 真实 IP（hosts 被改过时用） */
const REAL_IPS = ['140.82.113.6', '20.205.243.168', '140.82.121.6'];
let ipIndex = 0;

const SKIP_DIRS = new Set(['node_modules', '.git', 'dist', 'shots', 'data']);
const args = process.argv.slice(2);
const getArg = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i !== -1 && args[i + 1] ? args[i + 1] : fallback;
};

const TOKEN = process.env.GITHUB_TOKEN;
const OWNER = getArg('user');
const REPO = getArg('repo', 'zzu-campus-explorer');
const IS_PRIVATE = args.includes('--private');
const ROOT = getArg('dir', process.cwd());

if (!TOKEN) {
  console.error('缺少 GITHUB_TOKEN 环境变量');
  process.exit(1);
}
if (!OWNER) {
  console.error('缺少 --user 参数（你的 GitHub 用户名）');
  process.exit(1);
}

function api(method, path, body) {
  const payload = body ? JSON.stringify(body) : null;
  return new Promise((resolve, reject) => {
    const ip = REAL_IPS[ipIndex % REAL_IPS.length];
    const req = request(
      {
        host: 'api.github.com',
        path: `/api${path}`,
        method,
        port: 443,
        headers: {
          'user-agent': 'zzu-campus-uploader',
          accept: 'application/vnd.github+json',
          authorization: `Bearer ${TOKEN}`,
          'x-github-api-version': '2022-11-28',
          ...(payload ? { 'content-type': 'application/json', 'content-length': Buffer.byteLength(payload) } : {}),
        },
        lookup(hostname, opts, cb) {
          // 强制使用真实 IP，绕过 hosts 里指向 127.0.0.1 的条目
          cb(null, ip, 4);
        },
      },
      (res) => {
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => {
          const text = Buffer.concat(chunks).toString('utf8');
          let json = null;
          try {
            json = text ? JSON.parse(text) : null;
          } catch {
            json = { raw: text };
          }
          resolve({ status: res.statusCode, body: json });
        });
      },
    );
    req.on('error', (err) => {
      // 换一个 IP 重试一次
      ipIndex += 1;
      reject(err);
    });
    req.setTimeout(60000, () => req.destroy(new Error('请求超时')));
    if (payload) req.write(payload);
    req.end();
  });
}

async function apiRetry(method, path, body, tries = 3) {
  for (let i = 0; i < tries; i += 1) {
    try {
      return await api(method, path, body);
    } catch (err) {
      if (i === tries - 1) throw err;
      await new Promise((r) => setTimeout(r, 1200));
    }
  }
  throw new Error('unreachable');
}

async function walk(dir, out = []) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = join(dir, e.name);
    if (e.isDirectory()) {
      if (SKIP_DIRS.has(e.name)) {
        // 只跳过根级的 server/data
        if (e.name === 'data' && !full.includes(`${sep}server${sep}`)) continue;
        continue;
      }
      await walk(full, out);
    } else if (e.isFile()) {
      out.push(full);
    }
  }
  return out;
}

function gitBlobSha(buf) {
  const header = `blob ${buf.length}\0`;
  return createHash('sha1').update(header).update(buf).digest('hex');
}

async function main() {
  /* 1. 创建仓库（已存在则继续） */
  const me = await apiRetry('GET', '/user');
  if (me.status !== 200) {
    console.error('token 无效：', me.status, me.body?.message);
    process.exit(1);
  }
  console.log(`已登录：${me.body.login}`);

  const create = await apiRetry('POST', '/user/repos', {
    name: REPO,
    description: '郑州大学校园探索 · 校园导览与思政育人站点',
    private: IS_PRIVATE,
    auto_init: false,
  });
  if (create.status === 201) {
    console.log(`仓库已创建：${create.body.html_url}`);
  } else if (create.status === 422) {
    console.log(`仓库已存在，继续上传：https://github.com/${OWNER}/${REPO}`);
  } else {
    console.error('创建仓库失败：', create.status, create.body?.message);
    process.exit(1);
  }

  /* 2. 上传文件为 blob */
  const files = await walk(ROOT);
  console.log(`准备上传 ${files.length} 个文件`);

  const tree = [];
  let done = 0;
  for (const file of files) {
    const rel = relative(ROOT, file).split(sep).join('/');
    if (rel.startsWith('server/data') || rel.includes('node_modules')) continue;
    const buf = await readFile(file);
    const blob = await apiRetry('POST', `/repos/${OWNER}/${REPO}/git/blobs`, {
      content: buf.toString('base64'),
      encoding: 'base64',
    });
    if (blob.status !== 201) {
      console.error(`  ✗ ${rel}：${blob.status} ${blob.body?.message ?? ''}`);
      process.exit(1);
    }
    tree.push({ path: rel, mode: '100644', type: 'blob', sha: blob.body.sha });
    done += 1;
    if (done % 20 === 0) console.log(`  已上传 ${done}/${files.length}`);
  }
  console.log(`文件上传完成：${done} 个`);

  /* 3. 建 tree + commit + 更新分支 */
  const newTree = await apiRetry('POST', `/repos/${OWNER}/${REPO}/git/trees`, { tree });
  if (newTree.status !== 201) {
    console.error('创建 tree 失败：', newTree.status, newTree.body?.message);
    process.exit(1);
  }

  const commit = await apiRetry('POST', `/repos/${OWNER}/${REPO}/git/commits`, {
    message: 'docs: 郑州大学校园探索站点（源码 + 图片）',
    tree: newTree.body.sha,
  });
  if (commit.status !== 201) {
    console.error('创建 commit 失败：', commit.status, commit.body?.message);
    process.exit(1);
  }

  const ref = await apiRetry('POST', `/repos/${OWNER}/${REPO}/git/refs`, {
    ref: 'refs/heads/main',
    sha: commit.body.sha,
  });
  if (ref.status !== 201) {
    // 分支已存在：强制更新
    const upd = await apiRetry('PATCH', `/repos/${OWNER}/${REPO}/git/refs/heads/main`, {
      sha: commit.body.sha,
      force: true,
    });
    if (upd.status !== 200) {
      console.error('更新分支失败：', upd.status, upd.body?.message);
      process.exit(1);
    }
  }

  console.log(`\n✔ 上传完成：https://github.com/${OWNER}/${REPO}`);
}

main().catch((err) => {
  console.error('上传失败：', err.message);
  process.exit(1);
});
