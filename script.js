(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const pad = n => String(n).padStart(2, '0');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
  const WORKS = window.WORKS || [], SHOW = window.SHOWCASE || [], SERV = window.SERVICES || [], REV = window.REVIEWS || [], C = window.CONTACT || {};
  const byFile = Object.fromEntries(WORKS.map(w => [w.src, w]));
  const ratio = m => (m && m.w && m.h) ? (m.w / m.h) : 2 / 3;

  /* ---------- scroll suave (Lenis) + GSAP ---------- */
  gsap.registerPlugin(ScrollTrigger);
  let lenis = null;
  if (!reduce && window.Lenis) {
    lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  $$('[data-scroll]').forEach(a => a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    const t = id === '#top' ? 0 : $(id);
    if (t === null) return;
    e.preventDefault();
    if (lenis) lenis.scrollTo(t, { duration: 1.5, easing: x => 1 - Math.pow(1 - x, 4) });
    else (t === 0 ? window.scrollTo({ top: 0, behavior: 'smooth' }) : t.scrollIntoView({ behavior: 'smooth' }));
  }));

  /* ---------- revelar ao rolar ---------- */
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
  }), { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  $$('.reveal,.rl').forEach(el => io.observe(el));

  /* ---------- HERO: slideshow em tela cheia ---------- */
  const slides = $$('.hero__slide'), dots = $$('.hero__dots i');
  let si = 0;
  const setSlide = n => {
    slides[si].classList.remove('is-active'); dots[si] && dots[si].classList.remove('on');
    si = n % slides.length;
    slides[si].classList.add('is-active'); dots[si] && dots[si].classList.add('on');
  };
  slides[0].classList.add('is-active'); dots[0] && dots[0].classList.add('on');
  if (!reduce) setInterval(() => setSlide(si + 1), 6000);
  if (!reduce) {
    const st = { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true };
    gsap.to('#heroMedia', { yPercent: 14, ease: 'none', scrollTrigger: st });
    gsap.to('#heroContent', { yPercent: -14, opacity: 0, ease: 'none', scrollTrigger: { trigger: '#hero', start: 'top top', end: '70% top', scrub: true } });
    gsap.to('#heroFoot', { opacity: 0, ease: 'none', scrollTrigger: { trigger: '#hero', start: '30% top', end: '75% top', scrub: true } });
  }
  gsap.to('#ring', { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true } });

  /* ---------- TRABALHOS selecionados ---------- */
  const track = $('#hsTrack');
  SHOW.forEach((s, i) => {
    const m = byFile[s.src] || {};
    const el = document.createElement('div');
    el.className = 'hs__item';
    el.style.cssText = `--h:${s.h};--y:${s.y};--ar:${ratio(m)}`;
    el.innerHTML = `<div class="hs__frame" data-cursor="Ver" data-src="${s.src}"><img src="${s.src}" alt="${m.title || ''}" loading="lazy"></div>
      <div class="hs__cap"><b>${pad(i + 1)}</b>${m.cat || ''} — ${m.title || ''}</div>`;
    track.appendChild(el);
  });
  track.insertAdjacentHTML('beforeend', `<div class="hs__end"><a href="#galeria" data-scroll>Ver todos<br>os <em>registros</em> ↓</a></div>`);
  $('.hs__end a').addEventListener('click', e => {
    e.preventDefault();
    const t = $('#galeria');
    lenis ? lenis.scrollTo(t, { duration: 1.5 }) : t.scrollIntoView({ behavior: 'smooth' });
  });
  const hsCount = $('#hsCount'), hsBar = $('#hsBar');
  const setCount = p => { hsCount.textContent = `${pad(Math.min(SHOW.length, Math.max(1, Math.round(p * (SHOW.length - 1)) + 1)))} / ${pad(SHOW.length)}`; };
  setCount(0);
  const mm = gsap.matchMedia();
  mm.add('(min-width: 901px)', () => {
    const dist = () => Math.max(0, track.scrollWidth - innerWidth);
    const tween = gsap.to(track, {
      x: () => -dist(), ease: 'none',
      scrollTrigger: {
        trigger: '#trabalhos', pin: true, start: 'top top', end: () => '+=' + dist(), scrub: 0.8, invalidateOnRefresh: true,
        onUpdate: self => { hsBar.style.transform = `scaleX(${self.progress})`; setCount(self.progress); }
      }
    });
    if (!reduce) $$('.hs__frame img').forEach(img => gsap.fromTo(img, { xPercent: -6 }, {
      xPercent: 6, ease: 'none',
      scrollTrigger: { trigger: img.closest('.hs__item'), containerAnimation: tween, start: 'left right', end: 'right left', scrub: true }
    }));
  });
  track.addEventListener('scroll', () => {
    if (innerWidth > 900) return;
    setCount(track.scrollLeft / Math.max(1, track.scrollWidth - track.clientWidth));
  }, { passive: true });

  /* ---------- GALERIA + filtro ---------- */
  const grid = $('#grid'), filters = $('#filters'), galCount = $('#galCount');
  const cats = ['Todos', ...new Set(WORKS.map(w => w.cat))];
  let current = [];
  filters.innerHTML = cats.map((c, i) => `<button class="${i === 0 ? 'on' : ''}" data-cat="${c}">${c}<sup>${c === 'Todos' ? WORKS.length : WORKS.filter(w => w.cat === c).length}</sup></button>`).join('');
  const gio = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('is-in'); gio.unobserve(e.target); }
  }), { threshold: 0.08, rootMargin: '0px 0px -4% 0px' });
  function render(cat) {
    current = cat === 'Todos' ? WORKS : WORKS.filter(w => w.cat === cat);
    grid.innerHTML = current.map((w, i) => `<button class="g-item" data-cursor="Ver" data-i="${i}" ${w.w && w.h ? `style="aspect-ratio:${w.w}/${w.h}"` : ''}>
      <img src="${w.src}" alt="${w.title} — ${w.cat}" loading="lazy">
      <span class="g-item__cap"><span>${w.title}</span><span>${pad(i + 1)}</span></span></button>`).join('');
    $$('.g-item', grid).forEach((el, i) => { el.style.transitionDelay = `${(i % 3) * 90}ms`; gio.observe(el); });
    galCount.textContent = `${current.length} ${current.length === 1 ? 'fotografia' : 'fotografias'}`;
    ScrollTrigger.refresh();
  }
  render('Todos');
  filters.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    $$('button', filters).forEach(x => x.classList.toggle('on', x === b));
    grid.classList.add('fade');
    setTimeout(() => { render(b.dataset.cat); grid.classList.remove('fade'); }, 320);
  });
  grid.addEventListener('click', e => {
    const b = e.target.closest('.g-item'); if (b) openLb(current, +b.dataset.i);
  });
  track.addEventListener('click', e => {
    const f = e.target.closest('.hs__frame'); if (!f) return;
    openLb(WORKS, Math.max(0, WORKS.findIndex(w => w.src === f.dataset.src)));
  });

  /* ---------- LIGHTBOX ---------- */
  const lb = $('#lb'), lbImg = $('#lbImg'), lbCap = $('#lbCap'), lbNum = $('#lbNum');
  let list = [], idx = 0, startX = 0;
  function show(i, animate) {
    idx = (i + list.length) % list.length;
    const w = list[idx];
    const set = () => {
      lbImg.onload = () => lbImg.classList.remove('sw');
      lbImg.src = w.src; lbImg.alt = w.title;
      lbCap.textContent = `${w.cat} — ${w.title}`;
      lbNum.textContent = `${pad(idx + 1)} / ${pad(list.length)}`;
      if (lbImg.complete) lbImg.classList.remove('sw');
    };
    if (animate) { lbImg.classList.add('sw'); setTimeout(set, 220); } else set();
  }
  function openLb(l, i) {
    list = l; show(i, false);
    lb.classList.add('open'); lb.setAttribute('aria-hidden', 'false');
    if (lenis) lenis.stop(); else document.body.style.overflow = 'hidden';
  }
  function closeLb() {
    lb.classList.remove('open'); lb.setAttribute('aria-hidden', 'true');
    if (lenis) lenis.start(); else document.body.style.overflow = '';
  }
  $('#lbClose').addEventListener('click', closeLb);
  $('#lbPrev').addEventListener('click', e => { e.stopPropagation(); show(idx - 1, true); });
  $('#lbNext').addEventListener('click', e => { e.stopPropagation(); show(idx + 1, true); });
  lb.addEventListener('click', e => { if (e.target === lb || e.target.classList.contains('lb__fig')) closeLb(); });
  addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowRight') show(idx + 1, true);
    if (e.key === 'ArrowLeft') show(idx - 1, true);
  });
  lb.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', e => {
    const d = e.changedTouches[0].clientX - startX;
    if (Math.abs(d) > 50) show(idx + (d < 0 ? 1 : -1), true);
  });

  /* ---------- SERVIÇOS ---------- */
  const svcList = $('#svcList'), prev = $('#svcPreview'), prevImg = $('img', prev);
  svcList.innerHTML = SERV.map((s, i) => `<li class="svc" data-img="${s.img}"><span class="svc__n">${pad(i + 1)}</span><span class="svc__t">${s.name}</span><span class="svc__a">↗</span></li>`).join('');
  if (fine) {
    svcList.addEventListener('mouseover', e => {
      const li = e.target.closest('.svc'); if (!li) return;
      if (prevImg.getAttribute('src') !== li.dataset.img) prevImg.src = li.dataset.img;
      prev.classList.add('on');
    });
    svcList.addEventListener('mouseleave', () => prev.classList.remove('on'));
    svcList.addEventListener('mousemove', e => {
      prev.style.left = (e.clientX + 36) + 'px';
      prev.style.top = (e.clientY - prev.offsetHeight / 2) + 'px';
    });
  }

  /* ---------- CONTATO ---------- */
  const msg = encodeURIComponent('Olá, Shenia! Vim pelo site e gostaria de fazer um orçamento.');
  const hasWa = !!C.whatsapp;
  const wa = hasWa ? `https://wa.me/${C.whatsapp}?text=${msg}` : `https://www.instagram.com/${C.instagram}/`;
  ['#ctaBig', '#ctaWpp', '#phoneLink'].forEach(s => $(s).setAttribute('href', wa));
  $('#phoneLink').textContent = hasWa ? (C.phoneLabel || '') : 'Chamar no Instagram';
  $('#ctaBig').dataset.cursor = 'Falar';

  /* ---------- DEPOIMENTOS ---------- */
  const rg = $('#reviewsGrid');
  rg.innerHTML = REV.map((r, i) => `<figure class="rv" style="transition-delay:${(i % 3) * 90}ms"><div><div class="rv__stars" aria-label="5 estrelas">★★★★★</div><blockquote class="rv__text">“${r.text}”</blockquote></div><figcaption class="rv__who"><b>${r.name}</b><span>Google · ${r.when}</span></figcaption></figure>`).join('');
  $$('.rv', rg).forEach(el => io.observe(el));

  /* ---------- LINHA DO TEMPO ---------- */
  (() => {
    const tl = $('#tl'), track = $('#tlTrack'), clipsEl = $('#tlClips'), head = $('#tlHead'), tc = $('#tlTc'), now = $('#tlNow');
    const SECS = [
      ['#hero', 'Abertura', '#9aa0a6'], ['#sobre', 'Sobre', '#9aa0a6'], ['#trabalhos', 'Trabalhos', '#f4c2c2'],
      ['#galeria', 'Galeria', '#a9c9e8'], ['#depoimentos', 'Depoimentos', '#f0b08f'], ['#servicos', 'Serviços', '#9aa0a6'], ['#contato', 'Contato', '#25d366']
    ];
    $('#tlCta').setAttribute('href', wa);
    const clips = SECS.map(([sel, name, col], i) => {
      const el = document.createElement('div');
      el.className = 'tl__clip'; el.style.setProperty('--c', col);
      el.innerHTML = `<span>${name}</span>`;
      clipsEl.appendChild(el); return el;
    });
    let max = 1, dh = 1, starts = [], active = -1;
    const scrollTo = (y, immediate) => {
      if (lenis) lenis.scrollTo(y, immediate ? { immediate: true, force: true } : { duration: 1.5, easing: x => 1 - Math.pow(1 - x, 4) });
      else window.scrollTo({ top: y, behavior: immediate ? 'auto' : 'smooth' });
    };
    function measure() {
      dh = document.documentElement.scrollHeight;
      max = Math.max(1, dh - innerHeight);
      starts = SECS.map(([sel]) => {
        const el = $(sel), sp = el.closest('.pin-spacer') || el;
        return Math.max(0, sp.getBoundingClientRect().top + scrollY);
      });
      starts[0] = 0;
      clips.forEach((c, i) => {
        const a = starts[i] / dh * 100, b = (i < clips.length - 1 ? starts[i + 1] : dh) / dh * 100;
        c.style.left = a + '%'; c.style.width = `calc(${Math.max(0, b - a)}% - 3px)`;
      });
      update();
    }
    function update() {
      const p = Math.min(1, Math.max(0, scrollY / max));
      head.style.left = (p * 100) + '%';
      const t = p * 90, f = Math.floor((t % 1) * 30), s = Math.floor(t) % 60, m = Math.floor(t / 60);
      tc.textContent = `00:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}:${String(f).padStart(2, '0')}`;
      let a = 0;
      starts.forEach((st, i) => { if (st / dh <= p + 0.0005) a = i; });
      if (p > 0.995) a = clips.length - 1;
      if (a !== active) {
        active = a;
        clips.forEach((c, i) => c.classList.toggle('on', i === a));
        now.textContent = SECS[a][1];
      }
    }
    addEventListener('scroll', update, { passive: true });
    addEventListener('resize', () => setTimeout(measure, 200));
    ScrollTrigger.addEventListener('refresh', measure);
    addEventListener('load', () => { measure(); setTimeout(measure, 600); });
    measure();
    setTimeout(() => tl.classList.add('in'), reduce ? 0 : 1700);

    /* arrastar = rolar (scrub) · clicar num clipe = ir até a seção */
    let down = false, moved = false, sx = 0;
    const fx = e => { const r = track.getBoundingClientRect(); return Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)); };
    track.addEventListener('pointerdown', e => { down = true; moved = false; sx = e.clientX; track.setPointerCapture(e.pointerId); });
    track.addEventListener('pointermove', e => {
      if (!down) return;
      if (Math.abs(e.clientX - sx) > 4) moved = true;
      if (moved) scrollTo(fx(e) * max, true);
    });
    track.addEventListener('pointerup', e => {
      if (!down) return; down = false;
      if (moved) return;
      const f = fx(e);
      let i = 0; starts.forEach((st, k) => { if (st / dh <= f) i = k; });
      scrollTo(Math.min(max, starts[i]), false);
    });
    track.addEventListener('pointercancel', () => { down = false; });
  })();

  /* ---------- MENU MOBILE ---------- */
  (() => {
    const burger = $('#burger'), menu = $('#menu'), nav = $('.nav');
    $('#menuWpp').setAttribute('href', wa);
    $$('.menu__links a').forEach((a, i) => a.style.setProperty('--i', i));
    const set = open => {
      menu.classList.toggle('open', open); nav.classList.toggle('open', open);
      menu.setAttribute('aria-hidden', String(!open)); burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
      if (lenis) open ? lenis.stop() : lenis.start(); else document.body.style.overflow = open ? 'hidden' : '';
    };
    burger.addEventListener('click', () => set(!menu.classList.contains('open')));
    $$('.menu__links a').forEach(a => a.addEventListener('click', e => {
      e.preventDefault();
      const t = $(a.getAttribute('href'));
      set(false);
      setTimeout(() => { lenis ? lenis.scrollTo(t, { duration: 1.4 }) : t.scrollIntoView({ behavior: 'smooth' }); }, 450);
    }));
    $('.menu__foot').addEventListener('click', e => { if (e.target.closest('a')) set(false); });
    addEventListener('keydown', e => { if (e.key === 'Escape' && menu.classList.contains('open')) set(false); });
    matchMedia('(min-width: 701px)').addEventListener('change', e => { if (e.matches) set(false); });
  })();

  /* ---------- CURSOR ---------- */
  if (fine && !reduce) {
    const cur = $('#cursor'), label = $('span', cur);
    const qx = gsap.quickTo(cur, 'x', { duration: .35, ease: 'power3' });
    const qy = gsap.quickTo(cur, 'y', { duration: .35, ease: 'power3' });
    addEventListener('mousemove', e => { cur.classList.add('on'); qx(e.clientX); qy(e.clientY); });
    document.addEventListener('mouseleave', () => cur.classList.remove('on'));
    document.addEventListener('mouseover', e => {
      const t = e.target.closest('[data-cursor]');
      if (t) { label.textContent = t.dataset.cursor; cur.classList.add('big'); } else cur.classList.remove('big');
    });
  }

  addEventListener('load', () => ScrollTrigger.refresh());
})();
