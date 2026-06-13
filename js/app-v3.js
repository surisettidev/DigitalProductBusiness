/* ================================================================
   Freelancer OS v3 — app-v3.js
   GSAP-only animations: transform + opacity only (GPU accelerated)
   No Three.js / WebGL — Indian mobile perf optimised
   ================================================================ */
(function () {
  'use strict';

  // ─── GSAP setup ────────────────────────────────────────────────
  if (typeof gsap !== 'undefined') {
    if (typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
    if (typeof ScrollToPlugin !== 'undefined') gsap.registerPlugin(ScrollToPlugin);
  }

  // ─── Ticker copy ───────────────────────────────────────────────
  const TICKER = [
    { problem: 'Undercharging', fix: 'Value Pricing' },
    { problem: 'No pipeline',   fix: 'Lead System'  },
    { problem: 'GST fears',     fix: 'Tax clarity'  },
    { problem: 'AI confusion',  fix: 'AI workflows' },
    { problem: 'No systems',    fix: 'Business OS'  },
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
          opacity: 0,
          y: -10,
          duration: 0.25,
          stagger: 0.05,
          ease: 'power2.in',
          onComplete: () => {
            wordEl.textContent = next.problem;
            fixEl.textContent  = next.fix;
            gsap.fromTo([wordEl, fixEl],
              { opacity: 0, y: 10 },
              { opacity: 1, y: 0, duration: 0.35, stagger: 0.05, ease: 'power2.out' }
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

  // ─── Navigation ────────────────────────────────────────────────
  function initNav() {
    const nav    = document.getElementById('nav');
    const burger = document.getElementById('navBurger');
    const panel  = document.getElementById('navMobilePanel');

    if (!nav) return;

    // Scroll class
    const onScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Burger
    if (burger && panel) {
      burger.addEventListener('click', () => {
        const open = burger.classList.toggle('open');
        panel.classList.toggle('open', open);
        burger.setAttribute('aria-expanded', open);
      });
    }

    // Smooth scroll links
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', e => {
        const target = document.querySelector(link.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        if (typeof gsap !== 'undefined' && typeof ScrollToPlugin !== 'undefined') {
          gsap.to(window, { scrollTo: { y: target, offsetY: 72 }, duration: 0.75, ease: 'power2.inOut' });
        } else {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        // Close mobile panel
        if (panel) { panel.classList.remove('open'); burger && burger.classList.remove('open'); }
      });
    });
  }

  // ─── Hero entrance ─────────────────────────────────────────────
  function initHeroEntrance() {
    if (typeof gsap === 'undefined') return;

    gsap.fromTo('#hero-ticker',
      { opacity: 0, y: -16 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', delay: 0.15 }
    );
    gsap.fromTo('#hero-h1',
      { opacity: 0, y: 28 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', delay: 0.3 }
    );
    gsap.fromTo('#hero-sub',
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', delay: 0.45 }
    );
    gsap.fromTo('#hero-actions',
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: 0.58 }
    );
    gsap.fromTo('#hero-note',
      { opacity: 0 },
      { opacity: 1, duration: 0.5, ease: 'power2.out', delay: 0.7 }
    );
    gsap.fromTo('#hero-proof',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.75, ease: 'power2.out', delay: 0.82 }
    );
  }

  // ─── Scroll-triggered reveals ──────────────────────────────────
  function initReveal() {
    // Fallback: pure CSS IntersectionObserver for low-end devices or no GSAP
    const useGsap = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';

    if (!useGsap) {
      // CSS class fallback
      const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'none';
            entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

      document.querySelectorAll('[data-reveal]').forEach(el => io.observe(el));
      return;
    }

    // GSAP ScrollTrigger reveals
    document.querySelectorAll('[data-reveal]').forEach((el, i) => {
      const type   = el.dataset.reveal || 'up';
      const delay  = parseFloat(el.dataset.delay || 0) * 0.08;

      let from = { opacity: 0, y: 28 };
      if (type === 'left')  from = { opacity: 0, x: -28 };
      if (type === 'right') from = { opacity: 0, x: 28 };
      if (type === 'scale') from = { opacity: 0, scale: 0.93 };
      if (type === 'fade')  from = { opacity: 0 };

      gsap.from(el, {
        ...from,
        duration: 0.7,
        ease: 'power2.out',
        delay,
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none',
        }
      });
    });

    // Staggered grids
    document.querySelectorAll('[data-stagger]').forEach(grid => {
      const children = grid.querySelectorAll(':scope > *');
      gsap.from(children, {
        opacity: 0,
        y: 28,
        duration: 0.65,
        ease: 'power2.out',
        stagger: 0.1,
        scrollTrigger: {
          trigger: grid,
          start: 'top 85%',
          toggleActions: 'play none none none',
        }
      });
    });
  }

  // ─── Year ──────────────────────────────────────────────────────
  function initYear() {
    const el = document.getElementById('year');
    if (el) el.textContent = new Date().getFullYear();
  }

  // ─── FAQ ───────────────────────────────────────────────────────
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

  // ─── Toast ─────────────────────────────────────────────────────
  function showToast(msg, type = '') {
    const t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.className = 'toast ' + type;
    t.offsetHeight; // force reflow
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 4000);
  }
  window.showToast = showToast;

  // ─── Lead form ─────────────────────────────────────────────────
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
        const r = await fetch('/api/brevo-subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
        showToast('✅ Check your inbox for the free pricing calculator!', 'success');
        form.reset();
      } catch (_) {
        showToast('✅ You\'re on the list! Check your email.', 'success');
        form.reset();
      } finally {
        btn.textContent = origText;
        btn.disabled = false;
      }
    });
  }

  // ─── Card hover tilt (desktop only) ───────────────────────────
  function initCardTilt() {
    if (window.matchMedia('(pointer:coarse)').matches) return;
    document.querySelectorAll('.product-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width  - 0.5;
        const y = (e.clientY - r.top)  / r.height - 0.5;
        card.style.transform = `translateY(-4px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`;
        card.style.transition = 'none';
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = '';
      });
    });
  }

  // ─── Init ──────────────────────────────────────────────────────
  function init() {
    initYear();
    initNav();
    initTicker();
    initFaq();
    initLeadForm();

    const afterLoad = () => {
      initHeroEntrance();
      initReveal();
      initCardTilt();
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
