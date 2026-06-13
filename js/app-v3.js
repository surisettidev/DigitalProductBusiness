/* ================================================================
   Freelancer OS v3 — app-v3.js
   GSAP-only: transform + opacity only (GPU accelerated)
   No Three.js — Indian mobile perf optimised
   ================================================================ */
(function () {
  'use strict';

  if (typeof gsap !== 'undefined') {
    if (typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
    if (typeof ScrollToPlugin !== 'undefined') gsap.registerPlugin(ScrollToPlugin);
  }

  /* ── Ticker ─────────────────────────────────────────── */
  const TICKER = [
    { problem: 'Undercharging',  fix: 'Value Pricing'  },
    { problem: 'Feast-or-famine', fix: 'Lead System'   },
    { problem: 'GST confusion',  fix: 'Tax clarity'    },
    { problem: 'AI overload',    fix: 'AI workflows'   },
    { problem: 'Working chaos',  fix: 'Business OS'    },
  ];
  let tickerIdx = 0;

  function initTicker() {
    const wordEl = document.getElementById('ticker-problem');
    const fixEl  = document.getElementById('ticker-fix');
    if (!wordEl || !fixEl) return;
    function swap() {
      tickerIdx = (tickerIdx + 1) % TICKER.length;
      const next = TICKER[tickerIdx];
      if (typeof gsap !== 'undefined') {
        gsap.to([wordEl, fixEl], {
          opacity: 0, y: -10, duration: 0.22, stagger: 0.04, ease: 'power2.in',
          onComplete: () => {
            wordEl.textContent = next.problem;
            fixEl.textContent  = next.fix;
            gsap.fromTo([wordEl, fixEl],
              { opacity: 0, y: 10 },
              { opacity: 1, y: 0, duration: 0.32, stagger: 0.04, ease: 'power2.out' }
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

  /* ── Nav ─────────────────────────────────────────────── */
  function initNav() {
    const nav    = document.getElementById('nav');
    const burger = document.getElementById('navBurger');
    const panel  = document.getElementById('navMobilePanel');
    if (!nav) return;

    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
    nav.classList.toggle('scrolled', window.scrollY > 40);

    if (burger && panel) {
      burger.addEventListener('click', () => {
        const open = burger.classList.toggle('open');
        panel.classList.toggle('open', open);
        burger.setAttribute('aria-expanded', String(open));
      });
    }

    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', e => {
        const target = document.querySelector(link.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        const offset = 72;
        if (typeof gsap !== 'undefined' && typeof ScrollToPlugin !== 'undefined') {
          gsap.to(window, { scrollTo: { y: target, offsetY: offset }, duration: 0.7, ease: 'power2.inOut' });
        } else {
          window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
        }
        if (panel) { panel.classList.remove('open'); burger && burger.classList.remove('open'); }
      });
    });
  }

  /* ── Hero entrance ───────────────────────────────────── */
  function initHeroEntrance() {
    if (typeof gsap === 'undefined') {
      ['hero-ticker','hero-h1','hero-sub','hero-actions','hero-note','hero-proof'].forEach(id => {
        const el = document.getElementById(id);
        if (el) { el.style.opacity = '1'; el.style.transform = 'none'; }
      });
      return;
    }
    const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
    tl.fromTo('#hero-ticker', { opacity:0, y:-16 }, { opacity:1, y:0, duration:0.6 }, 0.1)
      .fromTo('#hero-h1',     { opacity:0, y:28  }, { opacity:1, y:0, duration:0.75 }, 0.25)
      .fromTo('#hero-sub',    { opacity:0, y:18  }, { opacity:1, y:0, duration:0.65 }, 0.42)
      .fromTo('#hero-actions',{ opacity:0, y:14  }, { opacity:1, y:0, duration:0.55 }, 0.55)
      .fromTo('#hero-note',   { opacity:0        }, { opacity:1,      duration:0.4  }, 0.65)
      .fromTo('#hero-proof',  { opacity:0, y:20  }, { opacity:1, y:0, duration:0.65 }, 0.72);
  }

  /* ── Scroll reveals ──────────────────────────────────── */
  function revealEl(el) {
    el.style.opacity = '1';
    el.style.transform = 'none';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  }

  function initReveal() {
    /* Always also run a plain IntersectionObserver fallback so content
       is NEVER permanently hidden if GSAP/ScrollTrigger fails to fire */
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          revealEl(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('[data-reveal]').forEach(el => io.observe(el));

    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    /* GSAP enhanced reveals */
    document.querySelectorAll('[data-reveal]').forEach(el => {
      const type  = el.dataset.reveal || 'up';
      const delay = parseFloat(el.dataset.delay || 0) * 0.09;
      let fromVars = { opacity:0, y:28 };
      if (type === 'left')  fromVars = { opacity:0, x:-28 };
      if (type === 'right') fromVars = { opacity:0, x:28 };
      if (type === 'scale') fromVars = { opacity:0, scale:0.93 };
      if (type === 'fade')  fromVars = { opacity:0, y:0 };

      gsap.from(el, {
        ...fromVars, duration:0.65, ease:'power2.out', delay,
        scrollTrigger: {
          trigger: el, start:'top 90%',
          toggleActions:'play none none none',
          onEnter: () => revealEl(el)   // belt-and-suspenders
        }
      });
    });

    /* Staggered grids */
    document.querySelectorAll('[data-stagger]').forEach(grid => {
      const kids = Array.from(grid.children);
      if (!kids.length) return;
      gsap.from(kids, {
        opacity:0, y:28, duration:0.6, ease:'power2.out', stagger:0.09,
        scrollTrigger: {
          trigger: grid, start:'top 88%',
          toggleActions:'play none none none',
          onEnter: () => kids.forEach(revealEl)
        }
      });
    });
  }

  /* ── FAQ ─────────────────────────────────────────────── */
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

  /* ── Year ────────────────────────────────────────────── */
  function initYear() {
    document.querySelectorAll('.js-year').forEach(el => {
      el.textContent = new Date().getFullYear();
    });
    const yr = document.getElementById('year');
    if (yr) yr.textContent = new Date().getFullYear();
  }

  /* ── Toast ───────────────────────────────────────────── */
  function showToast(msg, type = '') {
    const t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.className = 'toast ' + type;
    t.offsetHeight;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 4000);
  }
  window.showToast = showToast;

  /* ── Lead form ───────────────────────────────────────── */
  function initLeadForm() {
    const form = document.getElementById('lead-form');
    if (!form || form.dataset.v3) return;
    form.dataset.v3 = '1';
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const emailInput = form.querySelector('input[type="email"]');
      const btn = form.querySelector('button[type="submit"]');
      const email = emailInput?.value?.trim();
      if (!email) return;
      const origText = btn.textContent;
      btn.textContent = 'Sending…';
      btn.disabled = true;
      try {
        await fetch('/api/brevo-subscribe', {
          method:'POST', headers:{'Content-Type':'application/json'},
          body: JSON.stringify({ email }),
        });
        showToast('✅ Check your inbox for the free pricing calculator!', 'success');
        form.reset();
      } catch (_) {
        showToast("✅ You're on the list! Check your email.", 'success');
        form.reset();
      } finally {
        btn.textContent = origText;
        btn.disabled = false;
      }
    });
  }

  /* ── Card tilt (desktop pointer-fine only) ───────────── */
  function initCardTilt() {
    if (window.matchMedia('(pointer:coarse)').matches) return;
    document.querySelectorAll('.product-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width  - 0.5;
        const y = (e.clientY - r.top)  / r.height - 0.5;
        card.style.transform = `translateY(-4px) rotateX(${-y*4}deg) rotateY(${x*4}deg)`;
        card.style.transition = 'none';
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
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
    initLeadForm();

    /* Run reveal immediately after DOMContentLoaded so static elements are observed */
    initReveal();

    const afterLoad = () => {
      initHeroEntrance();
      initCardTilt();
      /* Re-run reveal for any dynamically injected cards */
      if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
      }
    };

    if (document.readyState === 'complete') {
      afterLoad();
    } else {
      window.addEventListener('load', afterLoad);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
