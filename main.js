const $ = id => document.getElementById(id);
const RM = document.documentElement.classList.contains('rm');
const wide = () => innerWidth >= 900;
const ease = t => t < .5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3) / 2;

/* ---- split headings into masked words (kept as one readable string for AT) ---- */
document.querySelectorAll('[data-split]').forEach(splitWords);
function splitWords(el) {
  const text = el.textContent.trim(); el.setAttribute('aria-label', text); let i = 0;
  el.innerHTML = text.split(/\s+/).map(w => `<span class="w" aria-hidden="true"><span style="--i:${i++}">${w}</span></span>`).join(' ');
}

/* ---- project list + hero figure ---- */
const P = window.PROJECTS, grid = $('grid');
const media = (p, hero) => `<span class="mask" style="aspect-ratio:${p.aspect}"><span class="par"><video muted loop playsinline preload="none" poster="${p.thumbnail}" ${p.preview ? `data-src="${p.preview}"` : ''} role="img" aria-label="${p.alt || p.title}"></video></span>${hero ? '' : '<span class="lab"><span>View project</span><span>↗</span></span>'}</span>`;
P.forEach((p, i) => {
  const n = String(i + 1).padStart(3, '0'), li = document.createElement('li');
  li.className = 'proj'; li.setAttribute('data-rv', '');
  li.innerHTML = `<div class="meta"><span class="idx">${n} / ${String(P.length).padStart(3, '0')}</span><h3 data-split>${p.title}</h3>${p.description ? `<p class="desc">${p.description}</p>` : ''}<button type="button" class="roll more"><span data-t="Watch video ↗">Watch video ↗</span></button></div>
    <div class="fw"><button type="button" class="frame" aria-label="Play: ${p.title}">${media(p)}</button></div>`;
  splitWords(li.querySelector('h3'));
  li.querySelectorAll('button').forEach(b => b.addEventListener('click', () => openViewer(p, b)));
  grid.appendChild(li);
});
const hp = P[0];
$('heroFig').innerHTML = `<button type="button" class="frame" aria-label="Play: ${hp.title}">${media(hp, true)}</button><span class="cta-cap">001 — ${hp.title} ↗</span>`;
$('heroFig').querySelector('button').addEventListener('click', e => openViewer(hp, e.currentTarget));
document.querySelectorAll('.yr').forEach(e => e.textContent = new Date().getFullYear());
$('mq').textContent = 'SELECTED WORK — RIYOZEN — SELECTED WORK — RIYOZEN — ';

/* ---- reveals: one observer, per-element delays come from CSS vars ---- */
const rio = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); rio.unobserve(e.target); } }), { threshold: .15, rootMargin: '0px 0px -8% 0px' });
document.querySelectorAll('[data-rv]').forEach(el => rio.observe(el));
addEventListener('load', () => document.querySelectorAll('.hero [data-rv]').forEach(el => el.classList.add('in')));
setTimeout(() => document.querySelectorAll('.hero [data-rv]').forEach(el => el.classList.add('in')), 120);

/* ---- video previews: load near viewport, play only while visible, never with sound ---- */
const vids = [...document.querySelectorAll('video[data-src]')];
const vio = new IntersectionObserver(es => es.forEach(e => {
  const v = e.target;
  if (e.isIntersecting && !v.src) v.src = v.dataset.src;
  if (RM) return;
  e.intersectionRatio > .35 && !document.hidden && !dlg.open ? v.play().catch(() => {}) : v.pause();
}), { threshold: [0, .35, .6], rootMargin: '200px 0px' });
vids.forEach(v => vio.observe(v));
const syncVids = () => vids.forEach(v => { if (!v.src) return; if (document.hidden || dlg.open) v.pause(); });
document.addEventListener('visibilitychange', syncVids);

/* ---- viewer ---- */
const dlg = $('viewer'), player = $('player'), vf = $('vframe'); let opener = null;
function openViewer(p, btn) {
  opener = btn; const [w, h] = p.aspect.split('/').map(Number);
  vf.style.aspectRatio = p.aspect; vf.classList.toggle('wide', w / h > 1);
  player.poster = p.thumbnail; player.src = p.video;
  $('vt').textContent = p.title; $('vd').textContent = p.description || '';
  vids.forEach(v => v.pause()); document.body.classList.add('lock');
  dlg.showModal(); player.play().catch(() => {});
}
function shut() { dlg.close(); }
$('close').addEventListener('click', shut);
dlg.addEventListener('click', e => { if (e.target === dlg) shut(); });
dlg.addEventListener('close', () => { player.pause(); player.removeAttribute('src'); player.load(); document.body.classList.remove('lock'); opener && opener.focus(); onScroll(); });
player.addEventListener('error', () => { if (player.getAttribute('src')) $('vd').textContent = 'This video could not be loaded.'; });

/* ---- contact: copy ---- */
$('copy').addEventListener('click', async () => {
  const s = $('copied'), b = $('copy').firstElementChild;
  try { await navigator.clipboard.writeText('habiburrashid498@gmail.com'); s.textContent = 'Email copied'; b.textContent = 'Copied ✓'; b.dataset.t = 'Copied ✓'; setTimeout(() => { b.textContent = b.dataset.t = 'Copy email'; }, 2200); }
  catch { s.textContent = 'Copy failed. Use the email link.'; }
});

/* ---- anchor navigation: eased scroll ---- */
document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
  const id = a.getAttribute('href'), t = id === '#top' ? document.body : document.querySelector(id);
  if (!t) return; e.preventDefault();
  const y = id === '#top' ? 0 : t.getBoundingClientRect().top + scrollY, y0 = scrollY, d = RM ? 0 : Math.min(1100, 450 + Math.abs(y - y0) * .25), t0 = performance.now();
  const step = now => { const k = d ? Math.min(1, (now - t0) / d) : 1; scrollTo(0, y0 + (y - y0) * ease(k)); k < 1 && requestAnimationFrame(step); };
  requestAnimationFrame(step); history.replaceState(null, '', id);
}));

/* ---- scroll-linked: progress bar, marquee, statement words, parallax ---- */
const bar = $('progress'), mq = $('mq'), st = $('statement');
st.innerHTML = st.textContent.trim().split(/\s+/).map(w => `<span class="sw">${w}</span>`).join(' ');
const words = [...st.children], pars = [...document.querySelectorAll('.proj .par, .hero .par')];
let ticking = false;
function onScroll() {
  ticking = false; const y = scrollY, vh = innerHeight;
  bar.style.transform = `scaleX(${(y / Math.max(1, document.documentElement.scrollHeight - vh)).toFixed(4)})`;
  if (RM) return;
  const wr = mq.parentElement.getBoundingClientRect();
  if (wr.bottom > 0 && wr.top < vh) mq.style.transform = `translate3d(${(-(y * .35) % (mq.scrollWidth / 2)).toFixed(1)}px,0,0)`;
  const r = st.getBoundingClientRect();
  if (r.bottom > 0 && r.top < vh) { const k = Math.min(1, Math.max(0, (vh * .85 - r.top) / (r.height + vh * .25))); const n = Math.round(k * words.length); words.forEach((w, i) => w.classList.toggle('on', i < n)); }
  if (wide()) pars.forEach(p => { const b = p.parentElement.getBoundingClientRect(); if (b.bottom < 0 || b.top > vh) return; p.style.transform = `translate3d(0,${((b.top + b.height / 2 - vh / 2) / vh * -5).toFixed(2)}%,0)`; });
}
addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
addEventListener('resize', onScroll); onScroll();
