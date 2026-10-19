# gyhmed.com

个人站点源仓库。构建后是一个纯静态多页站点，部署在 GitHub Pages（`https://www.gyhmed.com`）。

## 怎么发一篇新文章

只需要往对应目录里丢一个 `.md` 文件，不用改任何清单文件。

```md
---
title: "文章标题"
date: "2026-10-19"
section: "notes"          # notes = 文献笔记，writing = 生活随笔
lang: "zh-CN"             # 英文内容写 en
venue: "Cancer Cell"      # 仅文献笔记需要
year: "2026"              # 仅文献笔记需要
tags: ["PDAC", "cDC2"]
excerpt: "列表页和搜索引擎摘要里显示的一段话。"
---

正文从这里开始。构建时会自动去掉与 `title` 重复的首个 `# 一级标题`。
```

- 文献笔记放 `notes/<slug>.md`，发布后的地址是 `/note/<slug>/`
- 生活随笔放 `posts/<slug>.md`，发布后的地址是 `/post/<slug>/`
- `<slug>` 只用小写字母、数字和连字符

推送到 `main` 之后 GitHub Actions 会自动构建并发布。

## 本地构建与预览

```bash
npm ci
node build.mjs          # 产物输出到 _site/
python3 -m http.server 8000 --directory _site
```

`_site/` 已在 `.gitignore` 里，不要提交。

## 目录结构

```
posts/  notes/  about.md      内容源（Markdown + front matter）
css/  js/  assets/            运行时资源
build.mjs                     构建脚本：预渲染全部路由 + sitemap + RSS
.github/workflows/deploy.yml  自动构建发布
```

## 这个站点的几条硬性约束

改 `build.mjs` 或模板时不要破坏下面任何一条，它们都是为了解决具体问题而设的：

1. **每个路由都必须预渲染成真实的 `index.html`，正文内联在 HTML 里，返回 200。** 不要退回「空壳 HTML + 运行时 fetch Markdown」的做法——那样除首页外的所有页面都会以 HTTP 404 被搜索引擎丢弃。
2. **产物不得引用任何境外 CDN**（`fonts.googleapis.com`、`cdn.jsdelivr.net`、`unpkg.com`）。字体自托管在 `assets/fonts/`，代码高亮在构建期完成。这些域名在中国大陆不可达或不稳定，且会阻塞首屏。
3. **所有绝对 URL 一律使用 `https://www.gyhmed.com`（带 www）。** `CNAME` 是 `www.gyhmed.com`，canonical 指向不带 www 的地址会让搜索引擎抓错规范域名。
4. **禁用 JavaScript 后，页面内容仍应完整可读。** `js/main.js` 只做交互增强（主题切换、TOC 高亮、代码复制、灯箱、滚动揭示），不做渲染。
5. **每篇文档只能有一个 `<h1>`**，由模板输出；正文里与标题重复的一级标题在构建时剥离。
6. **不要在页脚放备案号。** 站点托管在境外的 GitHub Pages，属于境外接入，没有备案义务；挂一个已失效的备案号反而是错的。只有当托管迁到中国境内节点时才需要重新备案并悬挂。

## 域名与 HTTPS

`www.gyhmed.com` 在 Cloudflare DNS 里必须是 **仅 DNS（灰云）** 指向 `gyhmed.github.io`。改成橙云会让公网解析返回 Cloudflare 的 IP，GitHub 便无法验证域名、不再为自定义域名签发和续期证书，最终表现为 Cloudflare 返回 **HTTP 526**、整站不可访问。

证书由 GitHub Pages 自动签发和续期（Let's Encrypt，90 天），无需人工维护。仓库 Settings → Pages 里的 **Enforce HTTPS** 保持勾选。

## 许可

代码（`build.mjs`、`js/`、`css/`、`_site` 以外的工程文件）采用 MIT，见 `LICENSE`。
文字内容（`posts/`、`notes/`、`about.md`）采用 CC BY-NC-SA 4.0，见 `LICENSE.content`。
