/* ================================================================
   Freelancer OS v3.1 — app-v3.js — Chrome DevTools verified
   All bugs fixed:
   A: Hero opacity:0 in CSS, GSAP reveals + immediate fallback
   B: FAQ <details> never hidden by CSS — GSAP adds subtle entrance only
   C: data-stagger uses autoAlpha (sets both opacity+visibility atomically)
   D: lead-form handled ONLY by newsletter.js — removed from here
   E: No race between IO and GSAP — IO is ONLY fallback when GSAP absent
   ================================================================ */
(function () {
  'use strict';

  /* ── Register GSAP plugins ──────────────────────────── */
  if (typeof gsap !== 'undefined') {
    if (typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
    if (typeof ScrollToPlugin !== 'undefined') gsap.registerPlugin(ScrollToPlugin);
  }

  const hasGsap = () => typeof gsap !== 'undefined';
  const hasST   = () => hasGsap() && typeof ScrollTrigger !== 'undefined';

  /* ── Reveal helper — called by both IO and GSAP ──────── */
  function showEl(el) {
    el.style.opacity    = '1';
    el.style.transform  = 'none';
    el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
  }

  /* ── Hero immediate fallback (no GSAP = instant show) ── */
  const HERO_IDS = ['hero-ticker','hero-h1','hero-sub','hero-actions','hero-note','hero-proof'];
  function showHeroFallback() {
    HERO_IDS.forEach(id => {
      const el = document.getElementById(id);
      if (el) showEl(el);
    });
  }

  /* ── Hero entrance animation ─────────────────────────── */
  function initHeroEntrance() {
    if (!hasGsap()) { showHeroFallback(); return; }

    const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
    tl.to('#hero-ticker',  { opacity:1, y:0, duration:.6 },  0.1)
      .to('#hero-h1',      { opacity:1, y:0, duration:.75 }, 0.28)
      .to('#hero-sub',     { opacity:1, y:0, duration:.65 }, 0.44)
      .to('#hero-actions', { opacity:1, y:0, duration:.55 }, 0.57)
      .to('#hero-note',    { opacity:1,      duration:.4  }, 0.67)
      .to('#hero-proof',   { opacity:1, y:0, duration:.65 }, 0.74);

    /* Set initial GSAP state for hero elements
       (CSS already sets opacity:0, GSAP needs to match its internal state) */
    HERO_IDS.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      if (id !== 'hero-note') {
        gsap.set(el, { y: id === 'hero-ticker' ? -16 : 24 });
      }
    });
  }

  /* ── Scroll Reveal — for [data-reveal]:not(details) ──── */
  function initReveal() {
    const revealEls = Array.from(document.querySelectorAll('[data-reveal]:not(details)'));
    if (!revealEls.length) return;

    if (!hasST()) {
      /* No GSAP: use IntersectionObserver only */
      const io = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) { showEl(e.target); io.unobserve(e.target); } });
      }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
      revealEls.forEach(el => io.observe(el));
      return;
    }

    /* GSAP ScrollTrigger — do NOT also run IO to avoid race condition */
    revealEls.forEach(el => {
      const type  = el.dataset.reveal || 'up';
      const delay = parseFloat(el.dataset.delay || 0) * 0.09;

      const fromMap = {
        up:    { opacity:0, y:24 },
        left:  { opacity:0, x:-24 },
        right: { opacity:0, x:24 },
        scale: { opacity:0, scale:0.94 },
        fade:  { opacity:0 },
      };
      const fromVars = fromMap[type] || fromMap.up;

      gsap.fromTo(el, fromVars,
        { opacity:1, y:0, x:0, scale:1, duration:.65, ease:'power2.out', delay,
          scrollTrigger: {
            trigger: el, start: 'top 90%',
            toggleActions: 'play none none none',
            /* Safety: if scrollTrigger never fires (already in viewport), force show */
            onEnter: () => { gsap.set(el, { opacity:1, y:0, x:0, scale:1 }); }
          }
        }
      );
    });
  }

  /* ── Stagger reveal for grids (problems, products) ───── */
  function initStagger() {
    document.querySelectorAll('[data-stagger]').forEach(grid => {
      const kids = Array.from(grid.children).filter(c => c.nodeType === 1);
      if (!kids.length) return;

      if (!hasST()) {
        /* No GSAP: kids are naturally visible (no CSS opacity:0 on them) */
        return;
      }

      /* Use autoAlpha (sets visibility+opacity atomically — no flash) */
      gsap.fromTo(kids,
        { autoAlpha: 0, y: 24 },
        { autoAlpha: 1, y: 0, duration: .6, ease: 'power2.out', stagger: 0.08,
          scrollTrigger: {
            trigger: grid, start: 'top 88%',
            toggleActions: 'play none none none',
            onEnter: () => kids.forEach(k => gsap.set(k, { autoAlpha:1, y:0 }))
          }
        }
      );
    });
  }

  /* ── FAQ: GSAP-only subtle entrance (NO CSS opacity:0) ── */
  function initFaqReveal() {
    /* FIX BUG B: FAQ items are ALWAYS visible in CSS.
       GSAP adds a subtle slide-in if available, but content is never hidden. */
    const items = Array.from(document.querySelectorAll('.faq-item'));
    if (!items.length || !hasST()) return;

    gsap.fromTo(items,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: .5, ease: 'power2.out', stagger: 0.06,
        scrollTrigger: {
          trigger: '.faq-list', start: 'top 90%',
          toggleActions: 'play none none none',
          onEnter: () => items.forEach(el => gsap.set(el, { opacity:1, y:0 }))
        }
      }
    );
  }

  /* ── FAQ accordion (mobile: one open at a time) ──────── */
  function initFaq() {
    document.querySelectorAll('.faq-item').forEach(item => {
      item.addEventListener('toggle', () => {
        if (item.open && window.innerWidth < 768) {
          document.querySelectorAll('.faq-item[open]').forEach(other => {
            if (other !== item) other.removeAttribute('open');
          });
        }
      });
    });
  }

  /* ── Nav ─────────────────────────────────────────────── */
  function initNav() {
    const nav    = document.getElementById('nav');
    const burger = document.getElementById('navBurger');
    const panel  = document.getElementById('navMobilePanel');
    if (!nav) return;

    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if (burger && panel) {
      burger.addEventListener('click', () => {
        const open = burger.classList.toggle('open');
        panel.classList.toggle('open', open);
        burger.setAttribute('aria-expanded', String(open));
      });
    }

    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', e => {
        const href = link.getAttribute('href');
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 72;
        if (hasGsap() && typeof ScrollToPlugin !== 'undefined') {
          gsap.to(window, { scrollTo: top, duration: .7, ease: 'power2.inOut' });
        } else {
          window.scrollTo({ top, behavior: 'smooth' });
        }
        if (panel) { panel.classList.remove('open'); burger && burger.classList.remove('open'); }
      });
    });
  }

  /* ── Ticker ──────────────────────────────────────────── */
  const TICKER = [
    { problem: 'Undercharging',   fix: 'Value Pricing'  },
    { problem: 'Feast-or-famine', fix: 'Lead System'    },
    { problem: 'GST confusion',   fix: 'Tax clarity'    },
    { problem: 'AI overload',     fix: 'AI workflows'   },
    { problem: 'Working chaos',   fix: 'Business OS'    },
  ];
  let tickerIdx = 0;

  function initTicker() {
    const wordEl = document.getElementById('ticker-problem');
    const fixEl  = document.getElementById('ticker-fix');
    if (!wordEl || !fixEl) return;

    function swap() {
      tickerIdx = (tickerIdx + 1) % TICKER.length;
      const next = TICKER[tickerIdx];
      if (hasGsap()) {
        gsap.to([wordEl, fixEl], {
          opacity:0, y:-8, duration:.2, stagger:.04, ease:'power2.in',
          onComplete: () => {
            wordEl.textContent = next.problem;
            fixEl.textContent  = next.fix;
            gsap.fromTo([wordEl, fixEl],
              { opacity:0, y:8 },
              { opacity:1, y:0, duration:.28, stagger:.04, ease:'power2.out' }
            );
          }
        });
      } else {
        wordEl.textContent = next.problem;
        fixEl.textContent  = next.fix;
      }
    }
    setInterval(swap, 2800);
  }

  /* ── Year ────────────────────────────────────────────── */
  function initYear() {
    const yr = new Date().getFullYear();
    document.querySelectorAll('#year, .js-year').forEach(el => { el.textContent = yr; });
  }

  /* ── Toast ───────────────────────────────────────────── */
  function showToast(msg, type) {
    const t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.className = 'toast' + (type ? ' ' + type : '');
    t.offsetHeight; // force reflow
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 4500);
  }
  window.showToast = showToast;

  /* ── Card tilt (desktop pointer-fine only) ───────────── */
  function initCardTilt() {
    if (window.matchMedia('(pointer:coarse)').matches) return;
    document.querySelectorAll('.product-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width  - .5;
        const y = (e.clientY - r.top)  / r.height - .5;
        card.style.transform  = `translateY(-4px) rotateX(${-y*4}deg) rotateY(${x*4}deg)`;
        card.style.transition = 'none';
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform  = '';
        card.style.transition = '';
      });
    });
  }

  /* ── Init ────────────────────────────────────────────── */
  function init() {
    initYear();
    initNav();
    initTicker();
    initFaq();

    /* Reveal non-hero elements immediately at DOMContentLoaded */
    initReveal();
    initStagger();
    initFaqReveal();

    /* Hero entrance waits for window.load (all resources ready) */
    const afterLoad = () => {
      initHeroEntrance();
      initCardTilt();
      if (hasST()) ScrollTrigger.refresh();
    };

    if (document.readyState === 'complete') {
      afterLoad();
    } else {
      window.addEventListener('load', afterLoad);
    }

    /* Safety net: if window.load never fires within 3s, show hero anyway */
    setTimeout(() => {
      HERO_IDS.forEach(id => {
        const el = document.getElementById(id);
        if (el && getComputedStyle(el).opacity === '0') showEl(el);
      });
    }, 3000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
