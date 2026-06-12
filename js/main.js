'use strict';

/* =============================================
   GyhMed Blog — SPA Engine (Enhanced)
   ============================================= */

// --- State ---
const state = {
  posts: [],
  postsLoaded: false,
  currentView: null,
  postCache: new Map(),
  theme: null,
  menuOpen: false,
};

const $app = document.getElementById('app');

// --- Reduced Motion Check ---
function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// --- Router ---
function parsePath() {
  const parts = location.pathname.replace(/^\/+|\/+$/g, '').split('/').filter(Boolean);
  return { view: parts[0] || 'home', slug: parts[1] || null };
}

function navigate(path) {
  if (location.pathname === path) {
    handleRoute();
    return;
  }
  history.pushState(null, '', path);
  handleRoute();
}

// --- Helpers ---
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-');
  return `${y}.${m}.${d}`;
}

function estimateReadingTime(md) {
  const words = md.replace(/```[\s\S]*?```/g, '').split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

// =============================================
// THEME TOGGLE
// =============================================
function getSystemTheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function initTheme() {
  const saved = localStorage.getItem('gyhmed-theme');
  if (saved === 'dark' || saved === 'light') {
    state.theme = saved;
    document.documentElement.setAttribute('data-theme', saved);
  }
  // If no saved preference, rely on CSS @media (prefers-color-scheme)
}

function toggleTheme() {
  const current = state.theme || getSystemTheme();
  const next = current === 'dark' ? 'light' : 'dark';
  state.theme = next;
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('gyhmed-theme', next);
}

// =============================================
// MOBILE MENU
// =============================================
function toggleMenu() {
  state.menuOpen = !state.menuOpen;
  const $nav = document.querySelector('.nav-links');
  const $btn = document.querySelector('.menu-toggle');
  if ($nav) $nav.classList.toggle('open', state.menuOpen);
  if ($btn) $btn.setAttribute('aria-expanded', String(state.menuOpen));
  // Prevent body scroll when menu open
  document.body.style.overflow = state.menuOpen ? 'hidden' : '';
}

function closeMenu() {
  if (!state.menuOpen) return;
  state.menuOpen = false;
  const $nav = document.querySelector('.nav-links');
  const $btn = document.querySelector('.menu-toggle');
  if ($nav) $nav.classList.remove('open');
  if ($btn) $btn.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

// =============================================
// PAGE EXIT ANIMATION
// =============================================
function exitCurrentView() {
  return new Promise(resolve => {
    if (prefersReducedMotion()) { resolve(); return; }
    const $view = $app.querySelector('.view');
    if (!$view) { resolve(); return; }
    $view.classList.remove('view');
    $view.classList.add('view-exit');
    $view.addEventListener('animationend', resolve, { once: true });
    setTimeout(resolve, 220); // fallback
  });
}

// =============================================
// POST LOADING
// =============================================
async function loadPosts(force = false) {
  if (state.postsLoaded && !force) return state.posts;
  try {
    const res = await fetch('/posts/index.json');
    if (!res.ok) throw new Error(`Failed to load posts index (${res.status})`);
    state.posts = await res.json();
    state.posts.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
    state.postsLoaded = true;
    return state.posts;
  } catch (err) {
    console.warn('Could not load posts:', err.message);
    state.posts = [];
    state.postsLoaded = true;
    return [];
  }
}

async function loadPostContent(slug) {
  if (state.postCache.has(slug)) return state.postCache.get(slug);
  try {
    const res = await fetch(`/posts/${encodeURIComponent(slug)}.md`);
    if (!res.ok) throw new Error(`Post not found (${res.status})`);
    const md = await res.text();
    state.postCache.set(slug, md);
    return md;
  } catch (err) {
    throw err;
  }
}

function getPostMeta(slug) {
  return state.posts.find(p => p.slug === slug) || null;
}

function getAdjacentPosts(slug) {
  const idx = state.posts.findIndex(p => p.slug === slug);
  if (idx === -1) return { prev: null, next: null };
  return {
    prev: idx < state.posts.length - 1 ? state.posts[idx + 1] : null,
    next: idx > 0 ? state.posts[idx - 1] : null,
  };
}

// =============================================
// READING PROGRESS BAR
// =============================================
let $progressBar = null;

function initProgressBar() {
  $progressBar = document.createElement('div');
  $progressBar.className = 'reading-progress';
  $progressBar.setAttribute('aria-hidden', 'true');
  document.body.appendChild($progressBar);

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      updateProgressBar();
      ticking = false;
    });
  }, { passive: true });
}

function updateProgressBar() {
  if (!$progressBar || state.currentView !== 'post') {
    if ($progressBar) $progressBar.style.width = '0%';
    return;
  }
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  if (scrollHeight <= 0) {
    $progressBar.style.width = '0%';
    return;
  }
  const pct = Math.min(100, (scrollTop / scrollHeight) * 100);
  $progressBar.style.width = pct + '%';
}

function showProgressBar(show) {
  if (!$progressBar) return;
  $progressBar.style.display = show ? '' : 'none';
  if (!show) $progressBar.style.width = '0%';
}

// =============================================
// SCROLL REVEAL (Intersection Observer)
// =============================================
let revealObserver = null;

function initScrollReveal() {
  if (prefersReducedMotion()) return;
  if (revealObserver) revealObserver.disconnect();

  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px',
  });
}

function observeRevealElements() {
  if (prefersReducedMotion() || !revealObserver) return;
  const selectors = '.post-item, .section-heading, .about-page .bio p, .about-brand';
  document.querySelectorAll(selectors).forEach((el, i) => {
    el.classList.add('reveal');
    if (el.classList.contains('post-item')) {
      el.style.transitionDelay = Math.min(i * 60, 300) + 'ms';
    }
    revealObserver.observe(el);
  });
}

// =============================================
// CODE COPY BUTTONS
// =============================================
function injectCopyButtons() {
  document.querySelectorAll('.post-body pre').forEach(pre => {
    if (pre.querySelector('.code-copy-btn')) return;

    const btn = document.createElement('button');
    btn.className = 'code-copy-btn';
    btn.setAttribute('aria-label', 'Copy code');
    btn.setAttribute('title', 'Copy code');
    btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`;

    btn.addEventListener('click', async () => {
      const code = pre.querySelector('code')?.textContent || pre.textContent;
      try {
        await navigator.clipboard.writeText(code);
        btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
        btn.classList.add('copied');
        setTimeout(() => {
          btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`;
          btn.classList.remove('copied');
        }, 2000);
      } catch {
        btn.textContent = '!';
      }
    });

    pre.style.position = 'relative';
    pre.appendChild(btn);
  });
}

// =============================================
// IMAGE LIGHTBOX
// =============================================
function initLightbox() {
  document.querySelectorAll('.post-body img').forEach(img => {
    if (img.closest('a')) return; // Skip linked images
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', () => openLightbox(img));
  });
}

function openLightbox(img) {
  const overlay = document.createElement('div');
  overlay.className = 'lightbox-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-label', 'Image preview');

  const closeBtn = document.createElement('button');
  closeBtn.className = 'lightbox-close';
  closeBtn.setAttribute('aria-label', 'Close preview');
  closeBtn.innerHTML = '&times;';

  const clone = img.cloneNode();
  clone.style.cursor = 'default';

  overlay.appendChild(closeBtn);
  overlay.appendChild(clone);
  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';

  function close() {
    document.body.style.overflow = '';
    overlay.remove();
  }

  overlay.addEventListener('click', e => {
    if (e.target === overlay || e.target === closeBtn) close();
  });
  closeBtn.addEventListener('click', close);

  document.addEventListener('keydown', function handler(e) {
    if (e.key === 'Escape') {
      close();
      document.removeEventListener('keydown', handler);
    }
  });
}

// =============================================
// TABLE OF CONTENTS (TOC) + SCROLL SPY
// =============================================
let tocSpyObserver = null;

function generateTOC() {
  const headings = document.querySelectorAll('.post-body h2, .post-body h3');
  if (headings.length < 2) return; // Skip TOC if too few headings

  const $tocAside = document.querySelector('.toc-aside');
  if (!$tocAside) return;

  let html = '<p class="toc-heading">On this page</p><ul class="toc-list">';
  headings.forEach((h, i) => {
    const id = `heading-${i}`;
    h.id = id;
    const level = h.tagName.toLowerCase();
    const cls = level === 'h3' ? ' toc-h3' : '';
    html += `<li><a href="#${id}" class="${cls}" data-toc-target="${id}">${h.textContent}</a></li>`;
  });
  html += '</ul>';

  $tocAside.innerHTML = `<nav aria-label="Table of contents">${html}</nav>`;

  // Scroll spy
  initTocScrollSpy(headings);
}

function initTocScrollSpy(headings) {
  if (tocSpyObserver) tocSpyObserver.disconnect();

  tocSpyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const link = document.querySelector(`.toc-list a[data-toc-target="${entry.target.id}"]`);
      if (!link) return;
      if (entry.isIntersecting) {
        document.querySelectorAll('.toc-list a').forEach(a => a.classList.remove('active'));
        link.classList.add('active');
      }
    });
  }, {
    rootMargin: '-80px 0px -70% 0px',
    threshold: 0,
  });

  headings.forEach(h => tocSpyObserver.observe(h));
}

// =============================================
// SYNTAX HIGHLIGHTING (highlight.js)
// =============================================
function applySyntaxHighlight() {
  if (typeof hljs !== 'undefined') {
    document.querySelectorAll('.post-body pre code').forEach(block => {
      hljs.highlightElement(block);
    });
  }
}

// =============================================
// JSON-LD STRUCTURED DATA
// =============================================
function injectJsonLd(data) {
  let existing = document.querySelector('script[type="application/ld+json"]');
  if (existing) existing.remove();
  if (!data) return;

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
}

function setSiteJsonLd() {
  injectJsonLd({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'GyhMed',
    url: 'https://gyhmed.com',
    description: 'Personal blog by GyhMed — writings on medicine, technology, and life.',
  });
}

function setPostJsonLd(meta, readingTime) {
  if (!meta) return;
  injectJsonLd({
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: meta.title,
    datePublished: meta.date,
    author: { '@type': 'Person', name: 'GyhMed' },
    url: `https://gyhmed.com/post/${meta.slug}`,
    description: meta.excerpt || '',
    keywords: (meta.tags || []).join(', '),
    timeRequired: `PT${readingTime}M`,
  });
}

// =============================================
// VIEW RENDERING
// =============================================
function renderLoading() {
  $app.setAttribute('aria-busy', 'true');
  $app.innerHTML = '<div class="view"><div class="state-loading">Loading…</div></div>';
}

function renderError(msg) {
  $app.setAttribute('aria-busy', 'false');
  $app.innerHTML = `<div class="view"><div class="state-error">${escapeHtml(msg)}</div></div>`;
}

function renderEmpty() {
  $app.setAttribute('aria-busy', 'false');
  $app.innerHTML = '<div class="view"><div class="state-empty">No posts yet. Check back soon.</div></div>';
}

// --- Home View ---
function renderHomeView(posts) {
  const recent = posts.slice(0, 5);
  const postItems = recent.map((p, i) => renderPostItem(p, i)).join('');

  $app.innerHTML = `
    <div class="view">
      <section class="hero" aria-labelledby="hero-heading">
        <div class="container-wide">
          <div class="hero-content">
            <h1 id="hero-heading">
              A quiet corner<br>
              for <span class="highlight">thoughts</span>.
            </h1>
            <p class="subtitle">
              Personal notes on medicine, technology, and the spaces between.
              Written by GyhMed.
            </p>
            <div class="hero-meta">
              <span>${posts.length} article${posts.length !== 1 ? 's' : ''}</span>
              <span class="divider"></span>
              <span>Est. 2026</span>
            </div>
          </div>
          <div class="hero-decoration" aria-hidden="true"></div>
        </div>
      </section>

      <section class="container-wide">
        <h2 class="section-heading">Recent Writings</h2>
        ${posts.length > 0
          ? `<ul class="post-list">${postItems}</ul>`
          : '<p style="color: var(--text-muted);">No posts published yet.</p>'
        }
        ${posts.length > 5
          ? `<div style="margin-top: 1.5rem;"><a href="/blog" class="view-all-link">View all articles &rarr;</a></div>`
          : ''
        }
      </section>
    </div>
  `;
  onRenderComplete();
}

// --- Blog List View ---
function renderBlogView(posts) {
  const postItems = posts.map((p, i) => renderPostItem(p, i)).join('');

  $app.innerHTML = `
    <div class="view">
      <div class="container-wide blog-header">
        <h1>Blog</h1>
        <p>All published articles.</p>
        ${posts.length > 0
          ? `<ul class="post-list">${postItems}</ul>`
          : '<p style="color: var(--text-muted);">No posts published yet.</p>'
        }
      </div>
    </div>
  `;
  onRenderComplete();
}

function renderPostItem(post, index) {
  const tags = (post.tags || []).map(t => `<span class="post-tag">${escapeHtml(t)}</span>`).join('');
  return `
    <li class="post-item">
      <a href="/post/${encodeURIComponent(post.slug)}" aria-label="Read: ${escapeHtml(post.title)}">
        <time class="post-date" datetime="${post.date || ''}">${formatDate(post.date)}</time>
        <div>
          <span class="post-title">${escapeHtml(post.title)}</span>
          ${post.excerpt ? `<div class="post-excerpt">${escapeHtml(post.excerpt)}</div>` : ''}
          ${tags ? `<div class="post-meta-footer">${tags}</div>` : ''}
        </div>
      </a>
    </li>
  `;
}

// --- Single Post View ---
async function renderPostView(slug) {
  const meta = getPostMeta(slug);
  let md;
  try {
    md = await loadPostContent(slug);
  } catch (err) {
    renderError('Post not found.');
    return;
  }

  const title = meta ? escapeHtml(meta.title) : 'Untitled';
  const date = meta ? formatDate(meta.date) : '';
  const dateIso = meta ? (meta.date || '') : '';
  const tags = meta
    ? (meta.tags || []).map(t => `<span class="post-tag">${escapeHtml(t)}</span>`).join('')
    : '';
  const readingTime = estimateReadingTime(md);
  const { prev, next } = getAdjacentPosts(slug);

  let html;
  try {
    if (typeof marked !== 'undefined') {
      html = marked.parse(md);
    } else {
      // Fallback: basic rendering
      html = fallbackRender(md);
    }
  } catch (e) {
    html = `<pre>${escapeHtml(md)}</pre>`;
  }

  // Build prev/next nav
  let navHtml = '<nav class="post-nav" aria-label="Post navigation">';
  if (prev) {
    navHtml += `
      <a href="/post/${encodeURIComponent(prev.slug)}" class="nav-prev">
        <span class="nav-label">&larr; Previous</span>
        <span class="nav-title">${escapeHtml(prev.title)}</span>
      </a>`;
  } else {
    navHtml += `
      <a href="/blog" class="nav-prev">
        <span class="nav-label">&larr; Back to</span>
        <span class="nav-title">All articles</span>
      </a>`;
  }
  if (next) {
    navHtml += `
      <a href="/post/${encodeURIComponent(next.slug)}" class="nav-next">
        <span class="nav-label">Next &rarr;</span>
        <span class="nav-title">${escapeHtml(next.title)}</span>
      </a>`;
  }
  navHtml += '</nav>';

  $app.innerHTML = `
    <article class="view post-page">
      <div class="post-with-toc">
        <div class="post-main">
          <header class="post-header">
            <div class="post-header-meta">
              ${date ? `<time datetime="${dateIso}">${date}</time>` : ''}
              ${date ? '<span class="meta-divider"></span>' : ''}
              <span>${readingTime} min read</span>
            </div>
            <h1>${title}</h1>
            ${tags ? `<div class="post-tags">${tags}</div>` : ''}
          </header>
          <div class="post-body">
            ${html}
          </div>
          ${navHtml}
        </div>
        <aside class="toc-aside" aria-label="Table of contents"></aside>
      </div>
    </article>
  `;

  document.title = `${title} — GyhMed`;

  // JSON-LD for this post
  setPostJsonLd(meta, readingTime);

  onRenderComplete();
}

// --- About View ---
function renderAboutView() {
  $app.innerHTML = `
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
            </div>
          </div>

          <div class="bio">
            <p>
              Welcome to <strong>gyhmed.com</strong> — a personal space for
              writing, reflection, and sharing ideas. This is where I collect
              things I'm learning, thinking about, or simply want to remember.
            </p>
            <p>
              The topics here span medicine, technology, and everyday life.
              Each article is an honest attempt to put thoughts into words —
              nothing more, nothing less.
            </p>
            <p>
              If something here resonates with you, feel free to reach out.
            </p>
          </div>
        </article>
      </div>
    </div>
  `;
  onRenderComplete();
}

// =============================================
// MARKED.JS FALLBACK RENDERER
// =============================================
function fallbackRender(md) {
  // Basic Markdown-to-HTML for when marked.js fails to load
  let html = escapeHtml(md);

  // Headings
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

  // Bold & italic
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

  // Code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Horizontal rule
  html = html.replace(/^---$/gm, '<hr>');

  // Line breaks to paragraphs (simple)
  html = html.replace(/\n\n/g, '</p><p>');
  html = '<p>' + html + '</p>';

  // Clean up empty paragraphs around block elements
  html = html.replace(/<p>\s*(<h[1-6]>)/g, '$1');
  html = html.replace(/(<\/h[1-6]>)\s*<\/p>/g, '$1');
  html = html.replace(/<p>\s*(<hr>)\s*<\/p>/g, '$1');
  html = html.replace(/<p>\s*<\/p>/g, '');

  return html;
}

// =============================================
// POST-RENDER HOOK
// =============================================
function onRenderComplete() {
  $app.setAttribute('aria-busy', 'false');
  initScrollReveal();
  observeRevealElements();

  // Post-specific enhancements
  if (state.currentView === 'post') {
    showProgressBar(true);
    injectCopyButtons();
    initLightbox();
    generateTOC();
    applySyntaxHighlight();
  } else {
    showProgressBar(false);
    if (state.currentView !== 'post') {
      injectJsonLd(null); // Clear post JSON-LD
    }
  }
}

// =============================================
// NAV ACTIVE STATE
// =============================================
function updateActiveNav(view) {
  document.querySelectorAll('[data-nav]').forEach(el => {
    const isActive = el.dataset.nav === view;
    el.classList.toggle('active', isActive);
    el.setAttribute('aria-current', isActive ? 'page' : 'false');
  });
}

// =============================================
// ROUTE HANDLER
// =============================================
async function handleRoute() {
  const { view, slug } = parsePath();

  // Prevent re-rendering the same view
  if (state.currentView === view && !slug) return;

  // Close mobile menu on navigation
  closeMenu();

  view === 'home'
    ? document.title = 'GyhMed — A quiet corner for thoughts'
    : document.title = `GyhMed — ${view.charAt(0).toUpperCase() + view.slice(1)}`;

  updateActiveNav(view === 'post' ? 'blog' : view);

  if (view === 'post' && !slug) {
    navigate('/blog');
    return;
  }

  // Reset progress bar on navigation
  showProgressBar(false);

  // Exit animation before rendering new content
  await exitCurrentView();

  // Set current view
  state.currentView = view;

  renderLoading();

  try {
    switch (view) {
      case 'home': {
        const posts = await loadPosts();
        renderHomeView(posts);
        setSiteJsonLd();
        break;
      }
      case 'blog': {
        const posts = await loadPosts();
        renderBlogView(posts);
        setSiteJsonLd();
        break;
      }
      case 'post': {
        await loadPosts();
        await renderPostView(slug);
        break;
      }
      case 'about':
        renderAboutView();
        setSiteJsonLd();
        break;
      default:
        navigate('/');
        return;
    }

    // Scroll to top after route change
    window.scrollTo({ top: 0, behavior: 'instant' });
  } catch (err) {
    console.error('Render error:', err);
    renderError('Something went wrong. Please try again.');
  }
}

// =============================================
// INIT
// =============================================
function init() {
  // Theme
  initTheme();

  // Listen for system theme changes (hljs sync handled in HTML inline script)
  // No action needed here — CSS @media handles variable switching,
  // and the HTML MutationObserver + matchMedia listener handles hljs.

  // Router
  window.addEventListener('popstate', handleRoute);

  if (location.hash.startsWith('#/')) {
    history.replaceState(null, '', location.hash.replace(/^#/, '') || '/');
  }

  // Delegated click handler
  document.addEventListener('click', event => {
    const link = event.target.closest('a');
    if (!link || link.target || link.origin !== location.origin) return;

    // Allow hash-only anchor links (TOC, in-page navigation)
    if (link.hash && link.pathname === location.pathname) {
      // Don't prevent default — let browser scroll to anchor
      return;
    }

    event.preventDefault();
    navigate(link.pathname);
  });

  // Initialize reading progress bar
  initProgressBar();

  // Start routing
  handleRoute();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
