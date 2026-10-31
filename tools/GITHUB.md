# 上传到 GitHub

这个项目准备了两条路：一条用脚本（不需要装 git），一条用网页手动上传。

---

## 方式一：脚本上传（推荐）

前置条件：能连上 GitHub 的网络。

### 1. 生成 Personal Access Token

1. 打开 https://github.com/settings/tokens?type=beta （Fine-grained token）
2. 点 **Generate new token**
3. 权限勾选：**Repository access** 选 All repositories；**Permissions → Repository permissions → Contents: Read and write**
4. 生成后复制 `github_pat_...` 这一串（只显示一次）

### 2. 运行脚本

在项目目录打开 PowerShell：

```powershell
$env:GITHUB_TOKEN = "把刚才复制的 token 粘到这里"
node tools/github-upload.mjs --user 你的GitHub用户名 --repo zzu-campus-explorer
```

脚本会自动：

- 在你的账号下创建仓库 `zzu-campus-explorer`（已存在就用现有的）
- 把 176 个文件（源码 + 图片）全部上传
- 提交到 `main` 分支

完成后打开 `https://github.com/你的用户名/zzu-campus-explorer` 即可。

> 上传完成后，建议到 GitHub 设置里把这个 token 删掉（Settings → Developer settings → Tokens）。

### 如果提示连不上 api.github.com

这台机器的 `hosts` 文件里有把这些域名指向 `127.0.0.1` 的条目（第 35—75 行）。用**管理员**权限打开 PowerShell 执行：

```powershell
Copy-Item C:\Windows\System32\drivers\etc\hosts C:\Windows\System32\drivers\etc\hosts.bak
(Get-Content C:\Windows\System32\drivers\etc\hosts) | Where-Object { $_ -notmatch 'github' } |
  Set-Content C:\Windows\System32\drivers\etc\hosts -Encoding utf8
```

脚本里已经内置了"绕过 hosts、直接连真实 IP"的处理，所以不修 hosts 也能用；但修好之后浏览器也能正常打开 GitHub。

---

## 方式二：网页手动上传

适合只有几个文件改动，或者不想用 token 的情况。

1. 登录 GitHub，点右上角 **+ → New repository**
2. 仓库名填 `zzu-campus-explorer`，选 Public，**不要**勾选 "Add a README file"
3. 进入空仓库，点 **uploading an existing file**
4. 把项目文件夹里的这些内容拖进去：`src`、`public`、`server`、`tools`、`.github`、`index.html`、`package.json`、`pnpm-lock.yaml`、`tsconfig.json`、`vite.config.ts`、`README.md`、`.gitignore`
   - **不要**拖 `node_modules`、`dist`、`shots`
   - 网页一次最多 100 个文件，`public/images` 建议分几次拖
5. 填提交说明，点 **Commit changes**

---

## 上传之后：让网站能被访问

仓库里有 `.github/workflows/deploy-pages.yml`，配置一次即可自动发布：

1. 仓库 → **Settings → Pages**
2. **Source** 选 **GitHub Actions**
3. 回到 **Actions** 标签，等"构建并部署到 GitHub Pages"跑完
4. 访问 `https://你的用户名.github.io/zzu-campus-explorer/`

> 注意：本地开发时页面用的是站内绝对路径（`/images/...`）。如果部署在子路径下发现图片 404，把 `vite.config.ts` 里的 `base` 改成 `'/zzu-campus-explorer/'` 再提交。
>
> 另外，贴吧（`/board`）需要后端，GitHub Pages 只能托管静态页面，贴吧会提示"连不上留言服务"，其余板块不受影响。
