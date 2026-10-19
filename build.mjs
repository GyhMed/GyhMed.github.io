/* GyhMed site builder — prerenders every route to real HTML.
 *
 * Source layout (in the repo):
 *   posts/*.md      生活随笔（Writing）
 *   notes/*.md      文献笔记（Notes）
 *   about.md        关于页正文
 *   css/ js/ assets/   运行时资源
 *
 * Output: _site/  ← 这才是部署到 GitHub Pages 的目录。
 *   源 .md 文件不会被部署，所以不再存在「目录泄露 index.json」和
 *   「/posts/*.md 可被直接抓取」这两类问题。
 *
 * 设计约束（不要破坏）：
 *   1. 产物 HTML 不得引用任何境外 CDN（fonts.googleapis / jsdelivr / unpkg）。
 *      字体自托管在 /assets/fonts，代码高亮在构建期完成。
 *   2. 每个路由都必须是一个真实的 index.html，正文内联在 HTML 里，
 *      且返回 200。禁用 JavaScript 后内容仍应完整可读。
 *   3. 所有绝对 URL 一律用 https://www.gyhmed.com（带 www）。
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { marked } from 'marked';
import hljs from 'highlight.js/lib/common';

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const OUT = path.join(ROOT, '_site');

const SITE = {
  origin: 'https://www.gyhmed.com',
  name: 'GyhMed',
  tagline: 'A quiet corner for thoughts',
  description:
    'GyhMed 的个人站点：肿瘤免疫学文献笔记、生物信息分析记录，以及一些生活随笔。' +
    ' Personal site — immunology literature notes, bioinformatics, and essays.',
  author: 'GyhMed',
  email: 'admin@gyhmed.com',
  locale: 'zh_CN',
};

const NAV = [
  { key: 'home', label: 'Home', href: '/' },
  { key: 'writing', label: 'Writing', href: '/writing/' },
  { key: 'notes', label: 'Notes', href: '/notes/' },
  { key: 'about', label: 'About', href: '/about/' },
];

/* ---------------------------------- utils --------------------------------- */

const esc = (s = '') =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const abs = (p) => SITE.origin + p;

/** CJK 安全的 slug：保留中日韩字符，其余转连字符。 */
const slugify = (s) =>
  String(s)
    .trim()
    .toLowerCase()
    .replace(/[^\p{Letter}\p{Number}]+/gu, '-')
    .replace(/^-+|-+$/g, '') || 'section';

/** 与旧站一致的阅读时长估算（200 词/分钟，CJK 按字符折算）。 */
function readingTime(md) {
  const stripped = md.replace(/```[\s\S]*?```/g, '');
  const cjk = (stripped.match(/[\u3400-\u9fff\uf900-\ufaff]/g) || []).length;
  const latin = (stripped.replace(/[\u3400-\u9fff\uf900-\ufaff]/g, ' ').match(/\S+/g) || []).length;
  return Math.max(1, Math.ceil((latin + cjk / 1.8) / 200));
}

const fmtDate = (d) => (d ? String(d).slice(0, 10).replace(/-/g, '.') : '');

/* ------------------------------ front matter ------------------------------ */

/** 极简 YAML 子集解析：`key: "value"` 与 `key: ["a", "b"]`。 */
function parseFrontMatter(raw) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(raw);
  if (!m) return { data: {}, body: raw };
  const data = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = /^([A-Za-z_][\w-]*)\s*:\s*(.*)$/.exec(line.trim());
    if (!kv) continue;
    const [, key, restRaw] = kv;
    const rest = restRaw.trim();
    if (rest.startsWith('[')) {
      data[key] = rest
        .replace(/^\[|\]$/g, '')
        .split(',')
        .map((x) => x.trim().replace(/^"|"$/g, ''))
        .filter(Boolean);
    } else {
      data[key] = rest.replace(/^"|"$/g, '');
    }
  }
  return { data, body: raw.slice(m[0].length) };
}

async function loadCollection(dir, base) {
  const entries = await fs.readdir(path.join(ROOT, dir), { withFileTypes: true });
  const items = [];
  for (const e of entries) {
    if (!e.isFile() || !e.name.endsWith('.md')) continue;
    const slug = e.name.replace(/\.md$/, '');
    const raw = await fs.readFile(path.join(ROOT, dir, e.name), 'utf8');
    const { data, body } = parseFrontMatter(raw);
    const words = body;
    items.push({
      slug,
      url: `/${base}/${slug}/`,
      mdPath: `${dir}/${e.name}`,
      title: data.title || slug,
      date: data.date || '',
      section: data.section || base,
      lang: data.lang || 'zh-CN',
      venue: data.venue || '',
      year: data.year || '',
      tags: data.tags || [],
      excerpt: data.excerpt || '',
      minutes: readingTime(words),
      _body: body,
    });
  }
  items.sort((a, b) => String(b.date).localeCompare(String(a.date)));
  return items;
}

/* ------------------------------ markdown → HTML ---------------------------- */

marked.setOptions({ gfm: true, breaks: false });

/**
 * 渲染正文：把 front matter 之后重复的 H1 去掉（页面标题已由模板输出，
 * 一篇文档只能有一个 h1），给 h2/h3 补稳定 id，并在构建期完成代码高亮。
 */
function renderBody(item) {
  let md = item._body.replace(/^\s*#\s+.+\r?\n/, ''); // 去掉与标题重复的首个 H1
  let html = marked.parse(md);

  // 构建期代码高亮，运行时不再加载 highlight.js
  html = html.replace(/<pre><code(?: class="language-([\w+-]+)")?>([\s\S]*?)<\/code><\/pre>/g,
    (_all, lang, code) => {
      const src = code
        .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');
      let out, cls;
      try {
        if (lang && hljs.getLanguage(lang)) {
          out = hljs.highlight(src, { language: lang, ignoreIllegals: true }).value;
          cls = ` class="language-${lang}"`;
        } else {
          out = hljs.highlightAuto(src).value;
          cls = '';
        }
      } catch {
        out = esc(src);
        cls = lang ? ` class="language-${lang}"` : '';
      }
      return `<pre>${cls ? `<code${cls}>` : '<code>'}${out}</code></pre>`;
    });

  // 稳定 id：同一篇文档多次构建得到相同锚点，爬虫与分享链接才不会失效
  const used = new Set();
  html = html.replace(/<h([23])>([\s\S]*?)<\/h\1>/g, (_all, lvl, inner) => {
    const text = inner.replace(/<[^>]+>/g, '');
    let id = slugify(text);
    while (used.has(id)) id += '-';
    used.add(id);
    return `<h${lvl} id="${id}">${inner}</h${lvl}>`;
  });

  // 站外链接补 rel，避免把访客直接送走
  html = html.replace(/<a href="(https?:\/\/[^"]+)"/g,
    '<a href="$1" target="_blank" rel="noopener noreferrer"');

  return html;
}

function buildToc(item) {
  // 层级按 # 数量判定；锚点 id 与 renderBody 里的算法保持一致
  const rows = [...item._body.matchAll(/^(##|###)\s+(.+)$/gm)].map((m) => ({
    lvl: m[1].length,
    text: m[2].trim(),
  }));
  if (rows.length < 2) return '';
  const used = new Set();
  const lis = rows
    .map(({ lvl, text }) => {
      let id = slugify(text);
      while (used.has(id)) id += '-';
      used.add(id);
      return `<li><a href="#${id}" class="${lvl === 3 ? 'toc-h3' : ''}" data-toc-target="${id}">${esc(text)}</a></li>`;
    })
    .join('');
  return `<nav aria-label="Table of contents"><p class="toc-heading">On this page</p><ul class="toc-list">${lis}</ul></nav>`;
}

/* --------------------------------- layout --------------------------------- */

const THEME_GUARD = `<script>(function(){try{var t=localStorage.getItem('gyhmed-theme');if(t!=='dark'&&t!=='light'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.setAttribute('data-theme',t);}catch(e){}})();</script>`;

function head({ title, description, canonical, lang, jsonLd, active }) {
  return `<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <meta name="author" content="${SITE.author}">
  <link rel="canonical" href="${abs(canonical)}">
  <meta property="og:site_name" content="${SITE.name}">
  <meta property="og:type" content="${canonical === '/' ? 'website' : 'article'}">
  <meta property="og:url" content="${abs(canonical)}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:locale" content="${SITE.locale}">
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(description)}">
  <link rel="alternate" type="application/rss+xml" title="${SITE.name} — ${SITE.tagline}" href="${abs('/feed.xml')}">
  <link rel="icon" href="/favicon.ico" sizes="any">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
  ${THEME_GUARD}
  <link rel="stylesheet" href="/css/style.css">
  <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
</head>`;
}

function bodyShell({ lang, active, main }) {
  const links = NAV.map(
    (n) =>
      `<li><a href="${n.href}" data-nav="${n.key}"${n.key === active ? ' class="active" aria-current="page"' : ''}>${n.label}</a></li>`,
  ).join('\n          ');
  return `<body>
  <a href="#app" class="skip-link">Skip to content</a>
  <header class="site-header" role="banner">
    <div class="nav-inner">
      <a href="/" class="site-logo" aria-label="Home"><span class="logo-dot" aria-hidden="true"></span>${SITE.name}</a>
      <nav aria-label="Main navigation">
        <ul class="nav-links">
          ${links}
        </ul>
      </nav>
      <div class="nav-right">
        <button class="theme-toggle" aria-label="Toggle theme" type="button">
          <svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
          <svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
        </button>
        <button class="menu-toggle" aria-label="Toggle menu" aria-expanded="false" type="button">
          <svg class="icon-menu" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          <svg class="icon-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
    </div>
  </header>
  <main class="main-content" id="app">${main}</main>
  <footer class="site-footer" role="contentinfo">
    <div class="footer-inner">
      <p class="footer-copy">&copy; 2022-2026 ${SITE.author}</p>
      <ul class="footer-links">
        <li><a href="/about/">About</a></li>
        <li><a href="/writing/">Writing</a></li>
        <li><a href="/notes/">Notes</a></li>
        <li><a href="/feed.xml">RSS</a></li>
      </ul>
    </div>
  </footer>
  <script data-goatcounter="https://gyhmed.goatcounter.com/count" async src="//gc.zgo.at/count.js"></script>
  <script src="/js/main.js"></script>
</body>`;
}

function page(opts) {
  return `<!DOCTYPE html>
<html lang="${opts.lang || 'zh-CN'}">
${head(opts)}
${bodyShell(opts)}
</html>
`;
}

/* ---------------------------------- views --------------------------------- */

function itemCard(it, kind) {
  const tags = it.tags.map((t) => `<span class="post-tag">${esc(t)}</span>`).join('');
  const when = kind === 'note' && it.venue ? `${esc(it.venue)}'${esc(it.year)}` : fmtDate(it.date);
  return `    <li class="post-item">
      <a href="${it.url}" aria-label="Read: ${esc(it.title)}">
        <time class="post-date" datetime="${esc(it.date)}">${when}</time>
        <div>
          <span class="post-title">${esc(it.title)}</span>
          ${it.excerpt ? `<div class="post-excerpt">${esc(it.excerpt)}</div>` : ''}
          ${tags ? `<div class="post-meta-footer">${tags}</div>` : ''}
        </div>
      </a>
    </li>`;
}

function homeView({ notes, writing }) {
  const total = notes.length + writing.length;
  const section = (heading, list, kind, moreHref) =>
    list.length
      ? `      <section class="container-wide">
        <h2 class="section-heading">${heading}</h2>
        <ul class="post-list">
${list.slice(0, 4).map((x) => itemCard(x, kind)).join('\n')}
        </ul>
        <div style="margin-top: 1.5rem;"><a href="${moreHref}" class="view-all-link">查看全部 &rarr;</a></div>
      </section>`
      : '';
  return `
    <div class="view">
      <section class="hero" aria-labelledby="hero-heading">
        <div class="container-wide">
          <div class="hero-content">
            <h1 id="hero-heading">A quiet corner<br>for <span class="highlight">thoughts</span>.</h1>
            <p class="subtitle">肿瘤免疫学文献笔记、生物信息分析记录，以及一些生活随笔。 Written by ${SITE.author}.</p>
            <div class="hero-meta">
              <span>${total} 篇</span>
              <span class="divider"></span>
              <span>Est. 2026</span>
            </div>
          </div>
          <div class="hero-decoration" aria-hidden="true"></div>
        </div>
      </section>
${section('Latest Notes · 文献笔记', notes, 'note', '/notes/')}
${section('Latest Writing · 生活随笔', writing, 'post', '/writing/')}
    </div>`;
}

function listView({ heading, blurb, list, kind }) {
  return `
    <div class="view">
      <div class="container-wide blog-header">
        <h1>${esc(heading)}</h1>
        <p>${esc(blurb)}</p>
        ${list.length ? `<ul class="post-list">\n${list.map((x) => itemCard(x, kind)).join('\n')}\n        </ul>` : '<p style="color: var(--text-muted);">还没有内容。</p>'}
      </div>
    </div>`;
}

function articleView({ item, html, toc, prev, next, backHref, backLabel, kind }) {
  const tags = item.tags.map((t) => `<span class="post-tag">${esc(t)}</span>`).join('');
  const when =
    kind === 'note' && item.venue
      ? `<span>${esc(item.venue)}'${esc(item.year)}</span>`
      : item.date
        ? `<time datetime="${esc(item.date)}">${fmtDate(item.date)}</time>`
        : '';
  const nav = `<nav class="post-nav" aria-label="${kind === 'note' ? 'Note' : 'Post'} navigation">
        ${
          prev
            ? `<a href="${prev.url}" class="nav-prev"><span class="nav-label">&larr; Previous</span><span class="nav-title">${esc(prev.title)}</span></a>`
            : `<a href="${backHref}" class="nav-prev"><span class="nav-label">&larr; Back to</span><span class="nav-title">${esc(backLabel)}</span></a>`
        }
        ${next ? `<a href="${next.url}" class="nav-next"><span class="nav-label">Next &rarr;</span><span class="nav-title">${esc(next.title)}</span></a>` : ''}
      </nav>`;
  return `
    <article class="view post-page">
      <div class="post-with-toc">
        <div class="post-main">
          <header class="post-header">
            <div class="post-header-meta">
              ${when}
              <span class="meta-divider"></span>
              <span>${item.minutes} min read</span>
            </div>
            <h1>${esc(item.title)}</h1>
            ${tags ? `<div class="post-tags">${tags}</div>` : ''}
          </header>
          <div class="post-body">
${html}
          </div>
          ${nav}
        </div>
        <aside class="toc-aside" aria-label="Table of contents">${toc}</aside>
      </div>
    </article>`;
}

/* ---------------------------------- assets -------------------------------- */

async function copyDir(rel) {
  const src = path.join(ROOT, rel);
  const dst = path.join(OUT, rel);
  await fs.mkdir(dst, { recursive: true });
  for (const e of await fs.readdir(src, { withFileTypes: true })) {
    if (e.isFile()) await fs.copyFile(path.join(src, e.name), path.join(dst, e.name));
  }
}

async function buildCss() {
  const base = await fs.readFile(path.join(ROOT, 'css/style.css'), 'utf8');
  const light = await fs.readFile(path.join(ROOT, 'assets/vendor/hljs-github.css'), 'utf8');
  const dark = await fs.readFile(path.join(ROOT, 'assets/vendor/hljs-github-dark.css'), 'utf8');
  // 高亮配色按 data-theme 作用域切换；data-theme 由 head 里的守卫脚本保证一定存在
  const scopedDark = dark.replace(/(^|\})\s*([^{}@][^{]*)\{/g, (_a, brace, sel) => {
    const out = sel
      .split(',')
      .map((s) => `html[data-theme="dark"] ${s.trim()}`.trim())
      .join(', ');
    return `${brace} ${out} {`;
  });
  const fontFace = `/* 自托管字体：产物不得引用 fonts.googleapis.com（大陆不可达且阻塞首屏） */
@font-face{font-family:'Inter';font-style:normal;font-weight:500;font-display:swap;src:url('/assets/fonts/Inter-500.woff2') format('woff2');}
@font-face{font-family:'Inter';font-style:normal;font-weight:600;font-display:swap;src:url('/assets/fonts/Inter-600.woff2') format('woff2');}
@font-face{font-family:'Inter';font-style:normal;font-weight:700;font-display:swap;src:url('/assets/fonts/Inter-700.woff2') format('woff2');}
`;
  const out = path.join(OUT, 'css');
  await fs.mkdir(out, { recursive: true });
  await fs.writeFile(
    path.join(out, 'style.css'),
    fontFace + base + '\n\n/* ---- highlight.js (构建期内联，运行时零外部请求) ---- */\n' + light + '\n' + scopedDark,
    'utf8',
  );
}

function sitemapXml(urls) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map((u) => `  <url><loc>${abs(u.path)}</loc>${u.date ? `<lastmod>${u.date}</lastmod>` : ''}</url>`)
  .join('\n')}
</urlset>
`;
}

function feedXml(items) {
  const escX = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const rfc = (d) => {
    if (!d) return '';
    const t = new Date(d + 'T00:00:00Z');
    return Number.isNaN(t.getTime()) ? '' : t.toUTCString();
  };
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>${escX(SITE.name + ' — ' + SITE.tagline)}</title>
  <link>${abs('/')}</link>
  <description>${escX(SITE.description)}</description>
  <language>zh-cn</language>
  <atom:link href="${abs('/feed.xml')}" rel="self" type="application/rss+xml"/>
${items
  .slice(0, 30)
  .map(
    (i) => `  <item>
    <title>${escX(i.title)}</title>
    <link>${abs(i.url)}</link>
    <guid isPermaLink="true">${abs(i.url)}</guid>
    ${rfc(i.date) ? `<pubDate>${rfc(i.date)}</pubDate>` : ''}
    <description>${escX(i.excerpt)}</description>
  </item>`,
  )
  .join('\n')}
</channel>
</rss>
`;
}

/* ----------------------------------- main --------------------------------- */

async function write(rel, content) {
  const p = path.join(OUT, rel);
  await fs.mkdir(path.dirname(p), { recursive: true });
  await fs.writeFile(p, content, 'utf8');
  return rel;
}

async function main() {
  await fs.rm(OUT, { recursive: true, force: true });
  await fs.mkdir(OUT, { recursive: true });

  const [notes, writing] = await Promise.all([loadCollection('notes', 'note'), loadCollection('posts', 'post')]);
  const aboutRaw = parseFrontMatter(await fs.readFile(path.join(ROOT, 'about.md'), 'utf8'));
  const aboutHtml = marked.parse(aboutRaw.body);
  const aboutData = aboutRaw.data;

  const written = [];
  const jsonLdSite = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE.name,
    url: abs('/'),
    description: SITE.description,
  };

  /* 首页 */
  written.push(
    await write(
      'index.html',
      page({
        title: `${SITE.name} — ${SITE.tagline}`,
        description: SITE.description,
        canonical: '/',
        lang: 'zh-CN',
        active: 'home',
        jsonLd: jsonLdSite,
        main: homeView({ notes, writing }),
      }),
    ),
  );

  /* 列表页 */
  written.push(
    await write(
      'writing/index.html',
      page({
        title: `Writing — ${SITE.name}`,
        description: '生活随笔：关于写作、学习与日常记录的思考。',
        canonical: '/writing/',
        active: 'writing',
        jsonLd: { ...jsonLdSite, '@type': 'CollectionPage', name: 'Writing' },
        main: listView({ heading: 'Writing', blurb: '生活随笔。 All published essays.', list: writing, kind: 'post' }),
      }),
    ),
  );
  // 旧地址 /blog 保留一个跳转壳，避免已分享的链接失效
  written.push(
    await write(
      'blog/index.html',
      `<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8"><title>Writing — ${SITE.name}</title><meta name="robots" content="noindex"><link rel="canonical" href="${abs('/writing/')}"><meta http-equiv="refresh" content="0; url=${abs('/writing/')}"></head><body><p>已移动到 <a href="${abs('/writing/')}">/writing/</a>。</p></body></html>`,
    ),
  );
  written.push(
    await write(
      'notes/index.html',
      page({
        title: `Notes — ${SITE.name}`,
        description: '文献精读笔记：肿瘤免疫学、胰腺癌微环境、单细胞分析。',
        canonical: '/notes/',
        active: 'notes',
        jsonLd: { ...jsonLdSite, '@type': 'CollectionPage', name: 'Notes' },
        main: listView({ heading: 'Notes', blurb: '文献精读笔记。 Literature reading notes.', list: notes, kind: 'note' }),
      }),
    ),
  );

  /* 关于页 */
  written.push(
    await write(
      'about/index.html',
      page({
        title: `About — ${SITE.name}`,
        description: aboutData.excerpt || '关于 GyhMed。',
        canonical: '/about/',
        active: 'about',
        jsonLd: { ...jsonLdSite, '@type': 'AboutPage', name: 'About' },
        main: `
    <div class="view">
      <div class="container">
        <article class="about-page">
          <h1>About</h1>
          <p class="about-subtitle">A corner for thoughtful writing.</p>
          <div class="about-brand">
            <div class="about-avatar" aria-hidden="true">G</div>
            <div class="about-brand-info">
              <span class="about-brand-name">GyhMed</span>
              <span class="about-brand-tagline">Writer &middot; Thinker &middot; Explorer</span>
              <span class="about-brand-tagline">Contact: <a href="mailto:admin@gyhmed.com">admin@gyhmed.com</a></span>
            </div>
          </div>
          <div class="bio">
${aboutHtml}
          </div>
        </article>
      </div>
    </div>`,
      }),
    ),
  );

  /* 详情页 */
  const adjacent = (list, i) => ({ prev: list[i + 1] || null, next: list[i - 1] || null });
  for (const [list, kind, backHref, backLabel, active] of [
    [writing, 'post', '/writing/', 'All writing', 'writing'],
    [notes, 'note', '/notes/', 'All notes', 'notes'],
  ]) {
    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      const { prev, next } = adjacent(list, i);
      const title = `${item.title} — ${SITE.name}`;
      written.push(
        await write(
          `${kind === 'note' ? 'note' : 'post'}/${item.slug}/index.html`,
          page({
            title,
            description: item.excerpt || item.title,
            canonical: item.url,
            lang: item.lang,
            active,
            jsonLd: {
              '@context': 'https://schema.org',
              '@type': kind === 'note' ? 'ScholarlyArticle' : 'BlogPosting',
              headline: item.title,
              datePublished: item.date,
              inLanguage: item.lang,
              author: { '@type': 'Person', name: SITE.author },
              url: abs(item.url),
              description: item.excerpt || '',
              keywords: item.tags.join(', '),
              timeRequired: `PT${item.minutes}M`,
              ...(kind === 'note' && item.venue
                ? { isPartOf: { '@type': 'Periodical', name: item.venue } }
                : {}),
            },
            main: articleView({
              item,
              html: renderBody(item),
              toc: buildToc(item),
              prev,
              next,
              backHref,
              backLabel,
              kind,
            }),
          }),
        ),
      );
    }
  }

  /* 404：与正文同一套模板，不再手工复制 index.html */
  written.push(
    await write(
      '404.html',
      page({
        title: `Not found — ${SITE.name}`,
        description: '这个地址下没有内容。',
        canonical: '/404.html',
        active: '',
        jsonLd: jsonLdSite,
        main: `
    <div class="view">
      <div class="container">
        <article class="about-page">
          <h1>404 — 页面不存在</h1>
          <p>这个地址下没有内容。可以从 <a href="/">首页</a>、<a href="/notes/">Notes</a> 或 <a href="/writing/">Writing</a> 继续。</p>
        </article>
      </div>
    </div>`,
      }),
    ),
  );

  /* 资源与元数据 */
  await buildCss();
  await copyDir('js');
  await copyDir('assets/fonts');
  await fs.copyFile(path.join(ROOT, 'CNAME'), path.join(OUT, 'CNAME'));
  await fs.mkdir(path.join(OUT, '.well-known'), { recursive: true });
  await fs.copyFile(path.join(ROOT, '.well-known/security.txt'), path.join(OUT, '.well-known/security.txt'));
  await fs.copyFile(path.join(ROOT, 'WW_verify_qZQQgoxLcsV74uWp.txt'), path.join(OUT, 'WW_verify_qZQQgoxLcsV74uWp.txt'));
  await fs.copyFile(path.join(ROOT, 'favicon.svg'), path.join(OUT, 'favicon.svg'));
  await fs.copyFile(path.join(ROOT, 'favicon.ico'), path.join(OUT, 'favicon.ico'));
  await fs.copyFile(path.join(ROOT, 'apple-touch-icon.png'), path.join(OUT, 'apple-touch-icon.png'));

  const urls = [
    { path: '/' },
    { path: '/writing/' },
    { path: '/notes/' },
    { path: '/about/' },
    ...notes.map((n) => ({ path: n.url, date: n.date })),
    ...writing.map((w) => ({ path: w.url, date: w.date })),
  ];
  written.push(await write('sitemap.xml', sitemapXml(urls)));
  written.push(await write('feed.xml', feedXml([...notes, ...writing].sort((a, b) => String(b.date).localeCompare(String(a.date))))));

  // 源 .md 不再部署，因此不需要 Disallow 它们；主机名统一带 www
  written.push(
    await write(
      'robots.txt',
      `User-agent: *\nAllow: /\n\n# AI 抓取：默认屏蔽（保留原站决定）\nUser-agent: GPTBot\nDisallow: /\n\nUser-agent: ChatGPT-User\nDisallow: /\n\nUser-agent: CCBot\nDisallow: /\n\nUser-agent: anthropic-ai\nDisallow: /\n\nUser-agent: Bytespider\nDisallow: /\n\nUser-agent: cohere-ai\nDisallow: /\n\nSitemap: ${abs('/sitemap.xml')}\n`,
    ),
  );

  console.log(`built ${written.length} files into _site/`);
  console.log(`  notes: ${notes.length}  writing: ${writing.length}`);
  for (const w of written) console.log('  ·', w);
}

await main();
