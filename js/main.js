'use strict';

/* =============================================
   GyhMed Blog — SPA Engine
   ============================================= */

// --- State ---
const state = {
  posts: [],
  postsLoaded: false,
  currentView: null,
  postCache: new Map(),
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
  const words = md.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

// --- Post Loading ---
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

// --- Reading Progress Bar ---
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

// --- Scroll Reveal (Intersection Observer) ---
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

  const selectors = '.post-item, .section-heading, .about-page .bio p';
  document.querySelectorAll(selectors).forEach((el, i) => {
    el.classList.add('reveal');
    if (el.classList.contains('post-item')) {
      el.style.transitionDelay = Math.min(i * 60, 300) + 'ms';
    }
    revealObserver.observe(el);
  });
}

// --- View Rendering ---
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
        </div>
      </section>

      <section class="container-wide">
        <h2 class="section-heading">Recent Writings</h2>
        ${posts.length > 0
          ? `<ul class="post-list">${postItems}</ul>`
          : '<p style="color: var(--text-muted);">No posts published yet.</p>'
        }
        ${posts.length > 5
          ? `<div style="margin-top: 1rem;"><a href="/blog" class="view-all-link">View all articles →</a></div>`
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
      <div class="container-wide" style="padding-top: var(--gap-xl);">
        <h1 style="margin-bottom: 0.5rem;">Blog</h1>
        <p style="color: var(--text-secondary); margin-bottom: var(--gap-lg);">
          All published articles.
        </p>
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

  let html;
  try {
    html = marked.parse(md);
  } catch (e) {
    html = `<pre>${escapeHtml(md)}</pre>`;
  }

  $app.innerHTML = `
    <article class="view post-page">
      <div class="container">
        <header class="post-header">
          ${date ? `<time class="post-date-lg" datetime="${dateIso}">${date}</time>` : ''}
          <h1>${title}</h1>
          ${tags ? `<div class="post-tags">${tags}</div>` : ''}
        </header>
        <div class="post-body">
          ${html}
        </div>
        <nav class="post-nav" aria-label="Post navigation">
          <a href="/blog" class="nav-prev">&larr; Back to blog</a>
        </nav>
      </div>
    </article>
  `;

  document.title = `${title} — GyhMed`;
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

// --- Post-Render Hook ---
function onRenderComplete() {
  $app.setAttribute('aria-busy', 'false');
  initScrollReveal();
  observeRevealElements();

  // Show/hide reading progress bar
  showProgressBar(state.currentView === 'post');
}

// --- Nav Active State ---
function updateActiveNav(view) {
  document.querySelectorAll('[data-nav]').forEach(el => {
    const isActive = el.dataset.nav === view;
    el.classList.toggle('active', isActive);
    el.setAttribute('aria-current', isActive ? 'page' : 'false');
  });
}

// --- Route Handler ---
async function handleRoute() {
  const { view, slug } = parsePath();

  // Prevent re-rendering the same view
  if (state.currentView === view && !slug) return;

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

  // Set current view early so onRenderComplete can check it
  state.currentView = view;

  renderLoading();

  try {
    switch (view) {
      case 'home': {
        const posts = await loadPosts();
        renderHomeView(posts);
        break;
      }
      case 'blog': {
        const posts = await loadPosts();
        renderBlogView(posts);
        break;
      }
      case 'post': {
        await loadPosts();
        await renderPostView(slug);
        break;
      }
      case 'about':
        renderAboutView();
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

// --- Init ---
function init() {
  window.addEventListener('popstate', handleRoute);

  if (location.hash.startsWith('#/')) {
    history.replaceState(null, '', location.hash.replace(/^#/, '') || '/');
  }

  document.addEventListener('click', event => {
    const link = event.target.closest('a');
    if (!link || link.target || link.origin !== location.origin) return;
    event.preventDefault();
    navigate(link.pathname);
  });

  // Initialize reading progress bar
  initProgressBar();

  handleRoute();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
