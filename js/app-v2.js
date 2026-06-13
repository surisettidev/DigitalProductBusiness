/* ================================================================
   Freelancer OS — Main JavaScript
   Three.js hero, GSAP animations, mobile-first interactions
   ================================================================ */

(function() {
  'use strict';

  // ============================================================
  // 1. GSAP Setup
  // ============================================================
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
  }

  // ============================================================
  // 2. THREE.JS Hero Canvas
  // ============================================================
  function initHeroCanvas() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, canvas.offsetWidth / canvas.offsetHeight, 0.1, 1000);
    camera.position.z = 30;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
    renderer.setClearColor(0x000000, 0);

    // Particles
    const particleCount = window.innerWidth < 768 ? 1200 : 2500;
    const positions = new Float32Array(particleCount * 3);
    const pColors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    const colorPalette = [
      new THREE.Color('#7c6dfc'),
      new THREE.Color('#a78bfa'),
      new THREE.Color('#ec4899'),
      new THREE.Color('#f59e0b'),
      new THREE.Color('#10b981'),
    ];

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3]     = (Math.random() - 0.5) * 120;
      positions[i3 + 1] = (Math.random() - 0.5) * 80;
      positions[i3 + 2] = (Math.random() - 0.5) * 60;

      const c = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      pColors[i3]     = c.r;
      pColors[i3 + 1] = c.g;
      pColors[i3 + 2] = c.b;

      sizes[i] = Math.random() * 2.5 + 0.5;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('aColor', new THREE.BufferAttribute(pColors, 3));
    geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      },
      vertexShader: `
        attribute float aSize;
        attribute vec3 aColor;
        varying vec3 vColor;
        varying float vAlpha;
        uniform float uTime;
        uniform float uPixelRatio;

        void main() {
          vColor = aColor;
          vec3 pos = position;
          pos.y += sin(uTime * 0.4 + position.x * 0.1) * 0.8;
          pos.x += cos(uTime * 0.3 + position.z * 0.1) * 0.4;
          pos.z += sin(uTime * 0.2 + position.y * 0.1) * 0.6;

          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = aSize * uPixelRatio * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;

          float depth = (pos.z + 30.0) / 60.0;
          vAlpha = clamp(depth * 0.8, 0.1, 0.9);
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vAlpha;

        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          float alpha = smoothstep(0.5, 0.0, dist) * vAlpha;
          gl_FragColor = vec4(vColor, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Floating mesh lines (constellation effect)
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x7c6dfc,
      transparent: true,
      opacity: 0.06,
    });

    const lineGroup = new THREE.Group();
    const lineCount = window.innerWidth < 768 ? 8 : 20;
    for (let i = 0; i < lineCount; i++) {
      const points = [];
      const segCount = Math.floor(Math.random() * 4) + 3;
      for (let j = 0; j < segCount; j++) {
        points.push(new THREE.Vector3(
          (Math.random() - 0.5) * 100,
          (Math.random() - 0.5) * 60,
          (Math.random() - 0.5) * 40
        ));
      }
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
      lineGroup.add(new THREE.Line(lineGeo, lineMaterial));
    }
    scene.add(lineGroup);

    // Mouse parallax
    let mouseX = 0, mouseY = 0;
    let targetX = 0, targetY = 0;

    const heroSection = document.getElementById('hero');
    if (heroSection) {
      heroSection.addEventListener('mousemove', (e) => {
        const rect = heroSection.getBoundingClientRect();
        mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        mouseY = -((e.clientY - rect.top) / rect.height - 0.5) * 2;
      });
    }

    // Touch parallax
    window.addEventListener('touchmove', (e) => {
      const touch = e.touches[0];
      mouseX = (touch.clientX / window.innerWidth - 0.5) * 2;
      mouseY = -(touch.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });

    // Resize
    const handleResize = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      material.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2);
    };

    window.addEventListener('resize', handleResize);

    let animId;
    let time = 0;
    let isVisible = true;

    // Pause when not visible
    const observer = new IntersectionObserver((entries) => {
      isVisible = entries[0].isIntersecting;
    });
    observer.observe(canvas);

    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!isVisible) return;

      time += 0.008;
      material.uniforms.uTime.value = time;

      // Smooth parallax
      targetX += (mouseX - targetX) * 0.03;
      targetY += (mouseY - targetY) * 0.03;

      particles.rotation.y = targetX * 0.15;
      particles.rotation.x = targetY * 0.1;
      lineGroup.rotation.y = time * 0.03;
      lineGroup.rotation.x = Math.sin(time * 0.02) * 0.1;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }

  // ============================================================
  // 3. THREE.JS CTA Canvas (simpler)
  // ============================================================
  function initCtaCanvas() {
    const canvas = document.getElementById('cta-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, canvas.offsetWidth / canvas.offsetHeight, 0.1, 1000);
    camera.position.z = 20;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
    renderer.setPixelRatio(1);
    renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
    renderer.setClearColor(0x000000, 0);

    const count = 600;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const theta = Math.random() * Math.PI * 2;
      const r = 5 + Math.random() * 30;
      positions[i3]     = Math.cos(theta) * r;
      positions[i3 + 1] = (Math.random() - 0.5) * 20;
      positions[i3 + 2] = Math.sin(theta) * r;

      const t = Math.random();
      positions[i3]     = (Math.random() - 0.5) * 80;
      positions[i3 + 1] = (Math.random() - 0.5) * 50;
      positions[i3 + 2] = (Math.random() - 0.5) * 30;

      colors[i3]     = 0.48 + t * 0.2;
      colors[i3 + 1] = 0.42 + t * 0.1;
      colors[i3 + 2] = 0.98 - t * 0.1;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size: 2,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const pts = new THREE.Points(geo, mat);
    scene.add(pts);

    let t2 = 0;
    let isVis = false;
    const obs = new IntersectionObserver(e => { isVis = e[0].isIntersecting; });
    obs.observe(canvas);

    const animate = () => {
      requestAnimationFrame(animate);
      if (!isVis) return;
      t2 += 0.005;
      pts.rotation.y = t2 * 0.3;
      pts.rotation.z = Math.sin(t2 * 0.2) * 0.1;
      renderer.render(scene, camera);
    };
    animate();

    window.addEventListener('resize', () => {
      const w = canvas.offsetWidth, h = canvas.offsetHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
  }

  // ============================================================
  // 4. GSAP Animations
  // ============================================================
  function initGSAP() {
    if (typeof gsap === 'undefined') {
      // Fallback: just make everything visible
      document.querySelectorAll('.hero-line, .hero-sub, .lead-form, .hero-microcopy, .hero-stats').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      return;
    }

    // Hero entrance
    const tl = gsap.timeline({ delay: 0.2 });

    tl.to('.hero-line', {
      opacity: 1,
      y: 0,
      duration: 0.9,
      stagger: 0.15,
      ease: 'power3.out',
    })
    .to('.hero-sub', {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
    }, '-=0.5')
    .to('.lead-form', {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
    }, '-=0.5')
    .to('.hero-microcopy', {
      opacity: 1,
      duration: 0.6,
      ease: 'power2.out',
    }, '-=0.4')
    .to('.hero-stats', {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
    }, '-=0.4');

    // Navigation scroll effect
    ScrollTrigger.create({
      start: 'top -80',
      onEnter: () => document.getElementById('nav')?.classList.add('scrolled'),
      onLeaveBack: () => document.getElementById('nav')?.classList.remove('scrolled'),
    });

    // Section headers
    gsap.utils.toArray('.section-header').forEach(header => {
      gsap.from(header, {
        scrollTrigger: {
          trigger: header,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      });
    });

    // Trust strip
    gsap.from('.trust-item', {
      scrollTrigger: {
        trigger: '.trust-strip',
        start: 'top 90%',
      },
      opacity: 0,
      y: 20,
      stagger: 0.08,
      duration: 0.6,
      ease: 'power2.out',
    });

    // Pain cards
    gsap.utils.toArray('.pain-card').forEach((card, i) => {
      gsap.to(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
        opacity: 1,
        y: 0,
        duration: 0.7,
        delay: (i % 3) * 0.1,
        ease: 'power3.out',
        onStart: () => card.classList.add('visible'),
      });
    });

    // Product cards
    gsap.utils.toArray('.product-card').forEach((card, i) => {
      gsap.to(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
        opacity: 1,
        y: 0,
        duration: 0.7,
        delay: (i % 3) * 0.12,
        ease: 'power3.out',
        onStart: () => card.classList.add('visible'),
      });
    });

    // Bundle card
    gsap.to('.bundle-card', {
      scrollTrigger: {
        trigger: '.bundle-card',
        start: 'top 85%',
      },
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
      onStart: () => document.querySelector('.bundle-card')?.classList.add('visible'),
    });

    // Steps
    gsap.utils.toArray('.step').forEach((step, i) => {
      gsap.to(step, {
        scrollTrigger: {
          trigger: step,
          start: 'top 88%',
        },
        opacity: 1,
        x: 0,
        duration: 0.7,
        delay: i * 0.12,
        ease: 'power3.out',
        onStart: () => step.classList.add('visible'),
      });
    });

    // FAQ items
    gsap.utils.toArray('.faq-item').forEach((item, i) => {
      gsap.to(item, {
        scrollTrigger: {
          trigger: item,
          start: 'top 90%',
        },
        opacity: 1,
        y: 0,
        duration: 0.6,
        delay: (i % 2) * 0.1,
        ease: 'power2.out',
        onStart: () => item.classList.add('visible'),
      });
    });

    // CTA section
    gsap.from('.cta-content', {
      scrollTrigger: {
        trigger: '.final-cta',
        start: 'top 70%',
      },
      y: 60,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
    });

    // Footer
    gsap.from('.footer-brand, .footer-col', {
      scrollTrigger: {
        trigger: '.footer',
        start: 'top 90%',
      },
      y: 30,
      opacity: 0,
      duration: 0.7,
      stagger: 0.1,
      ease: 'power2.out',
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
          e.preventDefault();
          gsap.to(window, {
            scrollTo: { y: target, offsetY: 80 },
            duration: 1,
            ease: 'power3.inOut',
          });
          // Close mobile menu
          document.getElementById('navMobile')?.classList.remove('open');
          document.getElementById('navToggle')?.classList.remove('active');
        }
      });
    });
  }

  // ============================================================
  // 5. Fallback scroll animations (if GSAP not loaded)
  // ============================================================
  function initScrollObserver() {
    if (typeof gsap !== 'undefined') return; // GSAP handles it

    const targets = document.querySelectorAll(
      '.pain-card, .product-card, .bundle-card, .step, .faq-item'
    );

    if (!('IntersectionObserver' in window)) {
      targets.forEach(el => el.classList.add('visible'));
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    targets.forEach(el => io.observe(el));

    // Make hero visible immediately
    document.querySelectorAll('.hero-line, .hero-sub, .lead-form, .hero-microcopy, .hero-stats').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
      el.style.transition = 'none';
    });
  }

  // ============================================================
  // 6. Navigation
  // ============================================================
  function initNav() {
    const toggle = document.getElementById('navToggle');
    const mobile = document.getElementById('navMobile');

    if (toggle && mobile) {
      toggle.addEventListener('click', () => {
        const isOpen = mobile.classList.toggle('open');
        toggle.classList.toggle('active', isOpen);
        toggle.setAttribute('aria-expanded', isOpen);
      });
    }

    // Close menu on nav link click
    document.querySelectorAll('.nav-mobile-link, .nav-mobile-cta').forEach(link => {
      link.addEventListener('click', () => {
        mobile?.classList.remove('open');
        toggle?.classList.remove('active');
      });
    });

    // Scroll detection (no GSAP)
    if (typeof gsap === 'undefined') {
      window.addEventListener('scroll', () => {
        const nav = document.getElementById('nav');
        if (nav) {
          nav.classList.toggle('scrolled', window.scrollY > 80);
        }
      }, { passive: true });
    }
  }

  // ============================================================
  // 7. Checkout Integration
  // The existing checkout.js handles the full Razorpay flow.
  // This function just adds visual polish to buy buttons.
  // ============================================================
  function initCheckout() {
    // The buy-btn clicks are handled by checkout.js (startCheckout).
    // We just add hover ripple effects here for polish.
    document.querySelectorAll('.buy-btn, .bundle-btn').forEach(btn => {
      btn.addEventListener('mousedown', (e) => {
        const ripple = document.createElement('span');
        const rect = btn.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.cssText = `
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          left: ${e.clientX - rect.left - size/2}px;
          top: ${e.clientY - rect.top - size/2}px;
          background: rgba(255,255,255,0.2);
          border-radius: 50%;
          transform: scale(0);
          animation: ripple-effect 0.5s ease forwards;
          pointer-events: none;
        `;
        btn.style.position = 'relative';
        btn.style.overflow = 'hidden';
        btn.appendChild(ripple);
        setTimeout(() => ripple.remove(), 500);
      });
    });

    // Add ripple animation style
    if (!document.getElementById('ripple-style')) {
      const s = document.createElement('style');
      s.id = 'ripple-style';
      s.textContent = `@keyframes ripple-effect { to { transform: scale(2.5); opacity: 0; } }`;
      document.head.appendChild(s);
    }

    // Style the existing fos-email-modal from checkout.js with new design tokens
    // by adding a class when it appears
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(m => {
        m.addedNodes.forEach(node => {
          if (node.nodeType === 1 && node.id === 'fos-email-modal') {
            // Apply new dark theme styles to the dynamically created modal
            node.style.cssText = `
              position: fixed; inset: 0;
              background: rgba(0,0,0,0.75);
              backdrop-filter: blur(8px);
              z-index: 1000;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 20px;
              animation: modal-in 0.25s ease;
            `;
            const box = node.querySelector('.fos-email-box');
            if (box) {
              box.style.cssText = `
                background: #0f0c24;
                border: 1px solid rgba(255,255,255,0.1);
                border-radius: 24px;
                padding: 36px 28px;
                max-width: 420px;
                width: 100%;
                text-align: center;
                box-shadow: 0 20px 60px rgba(0,0,0,0.5);
                animation: modal-slide 0.3s cubic-bezier(0.16,1,0.3,1);
                font-family: 'Inter', system-ui, sans-serif;
                color: #f1f5f9;
              `;
              const h3 = box.querySelector('h3');
              if (h3) {
                h3.style.cssText = 'font-family: "Space Grotesk", "Inter", system-ui; font-size: 1.2rem; font-weight: 700; margin-bottom: 8px; color: #f1f5f9;';
              }
              const p = box.querySelector('p');
              if (p) {
                p.style.cssText = 'color: #94a3b8; font-size: 0.9rem; margin-bottom: 20px;';
              }
              const input = box.querySelector('input[type="email"]');
              if (input) {
                input.style.cssText = `
                  width: 100%; padding: 13px 16px;
                  background: rgba(255,255,255,0.05);
                  border: 1px solid rgba(255,255,255,0.1);
                  border-radius: 12px;
                  font-size: 1rem; color: #f1f5f9;
                  outline: none; margin-bottom: 10px;
                  font-family: inherit;
                  box-sizing: border-box;
                `;
                input.style.setProperty('--placeholder-color', '#64748b');
              }
              const btn = box.querySelector('button[type="submit"]');
              if (btn) {
                btn.style.cssText = `
                  width: 100%; padding: 14px;
                  background: linear-gradient(135deg, #7c6dfc, #a78bfa);
                  color: white; border: none;
                  border-radius: 12px;
                  font-size: 0.95rem; font-weight: 700;
                  cursor: pointer; font-family: inherit;
                  box-shadow: 0 4px 16px rgba(124,109,252,0.4);
                `;
              }
              const cancel = box.querySelector('.fos-email-cancel');
              if (cancel) {
                cancel.style.cssText = `
                  margin-top: 10px; background: none; border: 0;
                  color: #64748b; font-size: 0.85rem; cursor: pointer;
                  font-family: inherit;
                `;
              }
            }
          }
        });
      });
    });
    observer.observe(document.body, { childList: true });
  }

  // ============================================================
  // 8. Lead Form (Newsletter) — uses existing /api/brevo-subscribe
  // ============================================================
  function initLeadForm() {
    const form = document.getElementById('lead-form');
    if (!form) return;

    // If newsletter.js handles this, don't duplicate
    // Just add a fallback in case newsletter.js isn't present
    if (form.dataset.v2Init) return;
    form.dataset.v2Init = '1';

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const emailInput = form.querySelector('input[name="email"]');
      const btn = form.querySelector('.lead-btn');
      const email = emailInput?.value?.trim();

      if (!email) return;

      const btnText = btn.querySelector('.btn-text');
      if (btnText) btnText.textContent = 'Sending...';
      btn.disabled = true;

      try {
        try { localStorage.setItem('flos_email', email); } catch(ex) {}

        // Use same-origin API (deployed on freelance-os.pages.dev)
        const resp = await fetch('/api/brevo-subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });

        if (resp.ok || resp.status === 400) {
          showToast('✅ Check your inbox for the free pricing calculator!', 'success');
          form.reset();
        } else {
          showToast('✅ You\'re on the list! Check your email soon.', 'success');
          form.reset();
        }
      } catch (err) {
        showToast('✅ You\'re signed up! Check your inbox.', 'success');
        form.reset();
      } finally {
        if (btnText) btnText.textContent = 'Get Free Pricing Calculator';
        btn.disabled = false;
      }
    });
  }

  // ============================================================
  // 9. Toast Utility
  // ============================================================
  function showToast(message, type = '') {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.textContent = message;
    toast.className = 'toast ' + type;

    // Force reflow
    toast.offsetHeight;
    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, 4000);
  }

  window.showToast = showToast;

  // ============================================================
  // 10. Year
  // ============================================================
  function initYear() {
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }

  // ============================================================
  // 11. FAQ Accordion Enhancement
  // ============================================================
  function initFAQ() {
    document.querySelectorAll('.faq-item').forEach(item => {
      const summary = item.querySelector('.faq-question');
      const chevron = item.querySelector('.faq-chevron');

      item.addEventListener('toggle', () => {
        // Close others on mobile for better UX
        if (item.open && window.innerWidth < 768) {
          document.querySelectorAll('.faq-item[open]').forEach(other => {
            if (other !== item) other.removeAttribute('open');
          });
        }
      });
    });
  }

  // ============================================================
  // 12. Card Hover 3D Tilt (desktop only)
  // ============================================================
  function initCardTilt() {
    if (window.innerWidth < 1024) return;

    document.querySelectorAll('.product-card, .pain-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `translateY(-8px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`;
        card.style.transition = 'none';
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = '';
      });
    });
  }

  // ============================================================
  // 13. Performance: Lazy init Three.js
  // ============================================================
  function initThreeJs() {
    // Only init if Three.js is available
    if (typeof THREE === 'undefined') return;

    // Hero canvas - init immediately
    initHeroCanvas();

    // CTA canvas - init when in viewport
    const ctaCanvas = document.getElementById('cta-canvas');
    if (ctaCanvas) {
      const ctaObs = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          initCtaCanvas();
          ctaObs.disconnect();
        }
      }, { threshold: 0.1 });
      ctaObs.observe(ctaCanvas);
    }
  }

  // ============================================================
  // 14. Cursor sparkle effect (desktop)
  // ============================================================
  function initCursorSparkle() {
    if (window.innerWidth < 1024 || window.matchMedia('(pointer: coarse)').matches) return;

    let sparkleTimeout;
    let lastX = 0, lastY = 0;

    document.addEventListener('mousemove', (e) => {
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 20) return;
      lastX = e.clientX;
      lastY = e.clientY;

      const sparkle = document.createElement('div');
      sparkle.style.cssText = `
        position: fixed;
        left: ${e.clientX}px;
        top: ${e.clientY}px;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: radial-gradient(circle, #a78bfa, transparent);
        pointer-events: none;
        z-index: 9999;
        transform: translate(-50%, -50%);
        animation: sparkle-fade 0.6s ease forwards;
      `;

      document.body.appendChild(sparkle);
      setTimeout(() => sparkle.remove(), 600);
    });

    // Add sparkle animation style
    const style = document.createElement('style');
    style.textContent = `
      @keyframes sparkle-fade {
        0% { opacity: 0.8; transform: translate(-50%, -50%) scale(1); }
        100% { opacity: 0; transform: translate(-50%, -50%) scale(3); }
      }
    `;
    document.head.appendChild(style);
  }

  // ============================================================
  // 15. Smooth number counter for stats
  // ============================================================
  function initCounters() {
    // Future enhancement placeholder
  }

  // ============================================================
  // 16. Init All
  // ============================================================
  function init() {
    initYear();
    initNav();
    initFAQ();
    initCheckout();
    // Lead form handled by newsletter.js

    // Defer heavy stuff
    if (document.readyState === 'complete') {
      initThreeJs();
      initGSAP();
      initScrollObserver();
      initCardTilt();
      initCursorSparkle();
    } else {
      window.addEventListener('load', () => {
        initThreeJs();
        initGSAP();
        initScrollObserver();
        initCardTilt();
        initCursorSparkle();
      });
    }
  }

  // Start
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
