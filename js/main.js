(() => {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.matchMedia('(max-width: 760px)').matches;
  const hasGSAP = typeof window.gsap !== 'undefined';
  const hasST = hasGSAP && typeof window.ScrollTrigger !== 'undefined';
  const hasLenis = typeof window.Lenis !== 'undefined';
  const hasTHREE = typeof window.THREE !== 'undefined';

  if (hasST) window.gsap.registerPlugin(window.ScrollTrigger);

  /* ===== 基本UI ===== */
  const header = document.getElementById('siteHeader');
  const navToggle = document.getElementById('navToggle');
  const nav = document.getElementById('globalNav');
  const toTop = document.getElementById('toTop');
  const yearEl = document.getElementById('year');
  const form = document.getElementById('contactForm');
  const formNote = document.getElementById('formNote');
  const progressBar = document.querySelector('#scrollProgress span');

  if (yearEl) yearEl.textContent = new Date().getFullYear();

  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      navToggle.classList.toggle('is-open', open);
      navToggle.setAttribute('aria-expanded', String(open));
    });
    nav.querySelectorAll('a').forEach((a) =>
      a.addEventListener('click', () => {
        nav.classList.remove('is-open');
        navToggle.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      })
    );
  }

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      formNote.textContent = '入力内容をご確認ください。';
      formNote.style.color = '#F06AA8';
      form.reportValidity();
      return;
    }
    formNote.textContent = '送信できました ✦ 返信まで少々お待ちください。';
    formNote.style.color = '#7A5FD8';
    form.reset();
  });

  /* ===== Lenis スムーススクロール ===== */
  let lenis = null;
  if (hasLenis && !reducedMotion) {
    lenis = new window.Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false,
      touchMultiplier: 1.4,
    });

    if (hasST) {
      lenis.on('scroll', window.ScrollTrigger.update);
      window.gsap.ticker.add((time) => lenis.raf(time * 1000));
      window.gsap.ticker.lagSmoothing(0);
    } else {
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }

    // アンカーリンクをLenis経由でスムーズスクロール
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const href = a.getAttribute('href');
        if (!href || href === '#') return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        lenis.scrollTo(target, { offset: -70, duration: 1.4 });
      });
    });

    // To-top
    toTop?.addEventListener('click', () => lenis.scrollTo(0, { duration: 1.4 }));
  } else {
    toTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ===== スクロール進捗バー & ヘッダー ===== */
  const updateProgress = (scroll) => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const p = max > 0 ? Math.min(1, Math.max(0, scroll / max)) : 0;
    if (progressBar) progressBar.style.transform = `scaleX(${p})`;
    header?.classList.toggle('scrolled', scroll > 12);
    toTop?.classList.toggle('is-visible', scroll > 600);
  };
  if (lenis) lenis.on('scroll', ({ scroll }) => updateProgress(scroll));
  else window.addEventListener('scroll', () => updateProgress(window.scrollY), { passive: true });
  updateProgress(window.scrollY);

  /* ===== GSAP スクロール演出 ===== */
  if (hasST && !reducedMotion) {
    document.documentElement.classList.add('gsap-ready');
    const gsap = window.gsap;
    const ST = window.ScrollTrigger;

    // ヒーロー初回ローディング
    gsap.from('.eyebrow', { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out', delay: 0.1 });
    gsap.from('.hero-title .line', {
      y: 90,
      opacity: 0,
      rotateX: 30,
      duration: 1.1,
      stagger: 0.1,
      ease: 'power4.out',
      delay: 0.2,
    });
    gsap.from('.hero-lead', { y: 30, opacity: 0, duration: 0.9, ease: 'power3.out', delay: 0.55 });
    gsap.from('.hero-actions > *', {
      y: 30,
      opacity: 0,
      duration: 0.7,
      stagger: 0.08,
      ease: 'power3.out',
      delay: 0.7,
    });
    gsap.from('.hero-stats li', {
      y: 30,
      opacity: 0,
      duration: 0.7,
      stagger: 0.1,
      ease: 'power3.out',
      delay: 0.9,
    });
    gsap.from('.hero-visual', {
      scale: 0.85,
      opacity: 0,
      rotateY: -15,
      duration: 1.5,
      ease: 'power4.out',
      delay: 0.3,
    });

    // ヒーロー内のサブカードをスクロールでフローティング
    gsap.utils.toArray('.hero-visual [data-depth]').forEach((el) => {
      const d = parseFloat(el.dataset.depth) || 0.5;
      gsap.to(el, {
        y: () => -window.innerHeight * 0.18 * d,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });
    });

    // ヒーローテキストもスクロールでフェードアウト
    gsap.to('.hero-text', {
      y: -60,
      opacity: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom 30%',
        scrub: 1,
      },
    });

    // 背景ブロブのパララックス
    gsap.utils.toArray('[data-parallax]').forEach((el) => {
      const speed = parseFloat(el.dataset.parallax) || 0.2;
      gsap.to(el, {
        y: () => -window.innerHeight * speed * 2,
        ease: 'none',
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
        },
      });
    });

    // 各セクション見出し
    gsap.utils.toArray('.section-head').forEach((head) => {
      gsap.from(head, {
        y: 60,
        opacity: 0,
        rotateX: 15,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: head, start: 'top 85%' },
      });
    });

    // カードを奥から手前へ
    const cardSelectors = ['.feature-card', '.liver-card', '.support-card'];
    cardSelectors.forEach((sel) => {
      const groups = {};
      document.querySelectorAll(sel).forEach((card) => {
        const parent = card.parentElement;
        const key = parent ? parent.getAttribute('data-card-group') || (parent.dataset.cardGroup = Math.random().toString(36).slice(2, 8)) : '';
        groups[key] = groups[key] || [];
        groups[key].push(card);
      });
      Object.values(groups).forEach((cards) => {
        gsap.from(cards, {
          y: 80,
          opacity: 0,
          z: -100,
          duration: 0.9,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: cards[0], start: 'top 88%' },
        });
      });
    });

    // 募集セクションを奥行きスクラブ
    gsap.from('.recruit-card', {
      scale: 0.92,
      rotateX: 8,
      opacity: 0,
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.recruit-card', start: 'top 80%' },
    });

    // コンタクトフォーム
    gsap.from('.contact-form', {
      y: 60,
      opacity: 0,
      scale: 0.96,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.contact-form', start: 'top 85%' },
    });

    // マーキーは触らない（CSSアニメで動いてる）

    // フッター
    gsap.from('.site-footer .footer-brand, .site-footer .footer-nav > *, .site-footer .footer-sns', {
      y: 30,
      opacity: 0,
      duration: 0.7,
      stagger: 0.08,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.site-footer', start: 'top 90%' },
    });

    ST.refresh();
  } else {
    // フォールバック：IntersectionObserverでフェード
    const targets = document.querySelectorAll(
      '.section-head, .feature-card, .liver-card, .support-card, .recruit-card, .contact-form'
    );
    targets.forEach((el) => el.classList.add('reveal'));
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add('is-visible');
              io.unobserve(e.target);
            }
          });
        },
        { threshold: 0.12 }
      );
      targets.forEach((el) => io.observe(el));
    } else {
      targets.forEach((el) => el.classList.add('is-visible'));
    }
  }

  /* ===== カードの3Dチルト（マウス追従） ===== */
  if (!isMobile && !reducedMotion) {
    const tiltCards = document.querySelectorAll('.feature-card, .liver-card, .support-card');
    tiltCards.forEach((card) => {
      let raf = null;
      const onMove = (e) => {
        const r = card.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width - 0.5) * 2;
        const y = ((e.clientY - r.top) / r.height - 0.5) * 2;
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          card.style.transform = `perspective(900px) rotateY(${x * 7}deg) rotateX(${-y * 7}deg) translateZ(0)`;
        });
      };
      const onLeave = () => {
        if (raf) cancelAnimationFrame(raf);
        card.style.transform = 'perspective(900px) rotateY(0) rotateX(0) translateZ(0)';
      };
      card.addEventListener('mousemove', onMove);
      card.addEventListener('mouseleave', onLeave);
    });
  }

  /* ===== Three.js ヒーローシーン ===== */
  function initHeroScene() {
    if (!hasTHREE || reducedMotion) return;
    const container = document.getElementById('heroVisual');
    const canvas = document.getElementById('heroCanvas');
    if (!container || !canvas) return;

    const T = window.THREE;
    const renderer = new T.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new T.Scene();
    const camera = new T.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.set(0, 0, 6.5);

    // ライト
    scene.add(new T.AmbientLight(0xffffff, 0.55));
    const lPink = new T.PointLight(0xff7ab6, 2.4, 20);
    lPink.position.set(3, 3, 4);
    scene.add(lPink);
    const lPurple = new T.PointLight(0xb998ff, 2.2, 20);
    lPurple.position.set(-3, -2, 3);
    scene.add(lPurple);
    const lWhite = new T.DirectionalLight(0xffffff, 0.5);
    lWhite.position.set(0, 5, 5);
    scene.add(lWhite);

    // クリスタル群
    const gemConfigs = [
      { size: 1.15, color: 0xff9ecc, x: 0,    y: 0,    z: 0,   geo: 'ico' },
      { size: 0.55, color: 0xb998ff, x: -1.7, y: 1.2,  z: -0.8, geo: 'oct' },
      { size: 0.45, color: 0xffc9e2, x: 1.6,  y: 1.4,  z: 0.6,  geo: 'ico' },
      { size: 0.65, color: 0xc4a6ff, x: -1.5, y: -1.5, z: 1,    geo: 'oct' },
      { size: 0.4,  color: 0xff7ab6, x: 1.9,  y: -1.0, z: -0.6, geo: 'ico' },
      { size: 0.32, color: 0xe8dcff, x: 0.5,  y: 2.0,  z: -0.5, geo: 'oct' },
      { size: 0.3,  color: 0xffd1dc, x: -2.1, y: 0.3,  z: 0.8,  geo: 'ico' },
    ];
    const gems = [];
    gemConfigs.forEach((cfg) => {
      const geo = cfg.geo === 'ico'
        ? new T.IcosahedronGeometry(cfg.size, 0)
        : new T.OctahedronGeometry(cfg.size, 0);
      const mat = new T.MeshStandardMaterial({
        color: cfg.color,
        emissive: cfg.color,
        emissiveIntensity: 0.35,
        flatShading: true,
        roughness: 0.25,
        metalness: 0.55,
        transparent: true,
        opacity: 0.92,
      });
      const mesh = new T.Mesh(geo, mat);
      mesh.position.set(cfg.x, cfg.y, cfg.z);
      mesh.userData = {
        rotX: (Math.random() - 0.5) * 0.006 + 0.003,
        rotY: (Math.random() - 0.5) * 0.006 + 0.003,
        floatOffset: Math.random() * Math.PI * 2,
        floatAmp: 0.12 + Math.random() * 0.12,
        baseY: cfg.y,
        baseX: cfg.x,
      };
      scene.add(mesh);
      gems.push(mesh);
    });

    // パーティクル
    const particleCount = isMobile ? 70 : 220;
    const pGeo = new T.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const vels = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 5;
      vels[i] = 0.001 + Math.random() * 0.003;
    }
    pGeo.setAttribute('position', new T.BufferAttribute(positions, 3));
    const pMat = new T.PointsMaterial({
      size: 0.05,
      color: 0xffffff,
      transparent: true,
      opacity: 0.85,
      sizeAttenuation: true,
      depthWrite: false,
      blending: T.AdditiveBlending,
    });
    const particles = new T.Points(pGeo, pMat);
    scene.add(particles);

    // マウスパララックス
    const mouse = { tx: 0, ty: 0, x: 0, y: 0 };
    container.addEventListener('pointermove', (e) => {
      const r = container.getBoundingClientRect();
      mouse.tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      mouse.ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
    });
    container.addEventListener('pointerleave', () => {
      mouse.tx = 0;
      mouse.ty = 0;
    });

    // リサイズ
    let cw = 0, ch = 0;
    function resize() {
      const r = canvas.parentElement.getBoundingClientRect();
      const w = Math.max(1, Math.round(r.width));
      const h = Math.max(1, Math.round(r.height));
      if (w === cw && h === ch) return;
      cw = w; ch = h;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement);

    // 一時停止用フラグ
    let visible = true;
    document.addEventListener('visibilitychange', () => {
      visible = document.visibilityState === 'visible';
    });

    // スクロールでカメラY
    let scrollY = window.scrollY;
    if (lenis) lenis.on('scroll', ({ scroll }) => (scrollY = scroll));
    else window.addEventListener('scroll', () => (scrollY = window.scrollY), { passive: true });

    const clock = new T.Clock();
    function tick() {
      requestAnimationFrame(tick);
      if (!visible) return;
      const t = clock.getElapsedTime();

      mouse.x += (mouse.tx - mouse.x) * 0.06;
      mouse.y += (mouse.ty - mouse.y) * 0.06;

      gems.forEach((g) => {
        g.rotation.x += g.userData.rotX;
        g.rotation.y += g.userData.rotY;
        g.position.y = g.userData.baseY + Math.sin(t + g.userData.floatOffset) * g.userData.floatAmp;
        g.position.x = g.userData.baseX + Math.cos(t * 0.6 + g.userData.floatOffset) * 0.06;
      });

      // パーティクルがゆっくり上昇
      const pos = pGeo.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        pos[i * 3 + 1] += vels[i];
        if (pos[i * 3 + 1] > 7) pos[i * 3 + 1] = -7;
      }
      pGeo.attributes.position.needsUpdate = true;
      particles.rotation.y = t * 0.04;

      camera.position.x = mouse.x * 0.6;
      camera.position.y = -mouse.y * 0.5 - scrollY * 0.0008;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    }
    tick();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeroScene);
  } else {
    initHeroScene();
  }
})();
