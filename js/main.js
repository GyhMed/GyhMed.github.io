/* GyhMed — 运行时渐进增强
 *
 * 这个脚本只负责交互增强，不负责渲染。
 * 所有正文在构建期已渲染进 HTML，因此：
 *   · 不 fetch 任何 .md，不加载 marked.js，不加载 highlight.js
 *   · 不引用 fonts.googleapis.com / jsdelivr
 *   · 禁用 JavaScript 后，页面内容依然完整可读
 * 路由与页面渲染已从运行时移除（见 build.mjs）。
 */
'use strict';

const THEME_KEY = 'gyhmed-theme';

/* ------------------------------- 主题切换 -------------------------------- */
// 初值由 <head> 里的守卫脚本设定，所以不会出现深色模式白闪。
function currentTheme() {
  return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
}

function toggleTheme() {
  const next = currentTheme() === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  try {
    localStorage.setItem(THEME_KEY, next);
  } catch {}
}

/* ------------------------------- 移动端菜单 ------------------------------- */
let menuOpen = false;

function toggleMenu() {
  menuOpen = !menuOpen;
  const nav = document.querySelector('.nav-links');
  const btn = document.querySelector('.menu-toggle');
  if (nav) nav.classList.toggle('open', menuOpen);
  if (btn) btn.setAttribute('aria-expanded', String(menuOpen));
  document.body.style.overflow = menuOpen ? 'hidden' : '';
}

/* ----------------------------- 阅读进度条 -------------------------------- */
function initProgressBar() {
  const body = document.querySelector('.post-body');
  if (!body) return; // 列表页与首页不显示

  const bar = document.createElement('div');
  bar.className = 'reading-progress';
  bar.setAttribute('aria-hidden', 'true');
  document.body.appendChild(bar);

  let ticking = false;
  const update = () => {
    const top = document.documentElement.scrollTop || document.body.scrollTop;
    const h = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    bar.style.width = h > 0 ? Math.min(100, (top / h) * 100) + '%' : '0%';
  };
  window.addEventListener(
    'scroll',
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        update();
        ticking = false;
      });
    },
    { passive: true },
  );
  update();
}

/* ------------------------------- 滚动揭示 --------------------------------- */
function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function initScrollReveal() {
  if (prefersReducedMotion()) return;
  const observer = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          observer.unobserve(e.target);
        }
      }
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' },
  );
  document
    .querySelectorAll('.post-item, .section-heading, .about-page .bio p, .about-brand')
    .forEach((el, i) => {
      el.classList.add('reveal');
      if (el.classList.contains('post-item')) {
        el.style.transitionDelay = Math.min(i * 60, 300) + 'ms';
      }
      observer.observe(el);
    });
}

/* ------------------------------ 代码复制按钮 ------------------------------ */
function injectCopyButtons() {
  document.querySelectorAll('.post-body pre').forEach((pre) => {
    if (pre.querySelector('.code-copy-btn')) return;
    const btn = document.createElement('button');
    btn.className = 'code-copy-btn';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Copy code');
    btn.setAttribute('title', 'Copy code');
    const COPY_ICON =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
    btn.innerHTML = COPY_ICON;
    pre.style.position = 'relative';
    pre.appendChild(btn);

    btn.addEventListener('click', async () => {
      const code = pre.querySelector('code') ? pre.querySelector('code').textContent : pre.textContent;
      try {
        await navigator.clipboard.writeText(code);
        btn.innerHTML =
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
        btn.classList.add('copied');
        setTimeout(() => {
          btn.innerHTML = COPY_ICON;
          btn.classList.remove('copied');
        }, 2000);
      } catch {
        btn.textContent = '!';
      }
    });
  });
}

/* --------------------------------- 灯箱 ---------------------------------- */
function initLightbox() {
  document.querySelectorAll('.post-body img').forEach((img) => {
    if (img.closest('a')) return;
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', () => {
      const overlay = document.createElement('div');
      overlay.className = 'lightbox-overlay';
      overlay.setAttribute('role', 'dialog');
      overlay.setAttribute('aria-label', 'Image preview');

      const close = document.createElement('button');
      close.className = 'lightbox-close';
      close.type = 'button';
      close.setAttribute('aria-label', 'Close preview');
      close.innerHTML = '&times;';

      const clone = img.cloneNode();
      clone.style.cursor = 'default';
      overlay.append(close, clone);
      document.body.append(overlay);
      document.body.style.overflow = 'hidden';

      const dismiss = () => {
        document.body.style.overflow = '';
        overlay.remove();
        document.removeEventListener('keydown', onKey);
      };
      const onKey = (e) => {
        if (e.key === 'Escape') dismiss();
      };
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay || e.target === close) dismiss();
      });
      close.addEventListener('click', dismiss);
      document.addEventListener('keydown', onKey);
    });
  });
}

/* ------------------------------ TOC 滚动高亮 ------------------------------ */
function initTocScrollSpy() {
  const links = document.querySelectorAll('.toc-list a[data-toc-target]');
  if (links.length < 2) return;
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        links.forEach((a) => a.classList.remove('active'));
        const link = document.querySelector(`.toc-list a[data-toc-target="${entry.target.id}"]`);
        if (link) link.classList.add('active');
      }
    },
    { rootMargin: '-80px 0px -70% 0px', threshold: 0 },
  );
  links.forEach((a) => {
    const target = document.getElementById(a.dataset.tocTarget);
    if (target) observer.observe(target);
  });
}

/* ---------------------------------- init --------------------------------- */
function init() {
  const themeBtn = document.querySelector('.theme-toggle');
  if (themeBtn) themeBtn.addEventListener('click', toggleTheme);
  const menuBtn = document.querySelector('.menu-toggle');
  if (menuBtn) menuBtn.addEventListener('click', toggleMenu);

  initProgressBar();
  initScrollReveal();
  injectCopyButtons();
  initLightbox();
  initTocScrollSpy();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
