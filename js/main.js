(() => {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.matchMedia('(max-width: 760px)').matches;
  const hasGSAP = typeof window.gsap !== 'undefined';
  const hasST = hasGSAP && typeof window.ScrollTrigger !== 'undefined';
  const hasLenis = typeof window.Lenis !== 'undefined';

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

  /* ===== ヒーローキャラクター: 視線・頭追従 ===== */
  function initHeroCharacter() {
    if (reducedMotion) return;
    const svg = document.getElementById('heroChar');
    if (!svg) return;

    const pupilL = svg.querySelector('.pupil-left');
    const pupilR = svg.querySelector('.pupil-right');
    const head   = svg.querySelector('.char-head');
    if (!pupilL || !pupilR) return;

    const state = { tx: 0, ty: 0, x: 0, y: 0 };

    const onMove = (e) => {
      const r = svg.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = (e.clientX - cx) / (r.width / 2);
      const dy = (e.clientY - cy) / (r.height / 2);
      state.tx = Math.max(-1, Math.min(1, dx));
      state.ty = Math.max(-1, Math.min(1, dy));
    };
    const onLeave = () => { state.tx = 0; state.ty = 0; };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerleave', onLeave);
    document.addEventListener('mouseleave', onLeave);

    function loop() {
      requestAnimationFrame(loop);
      state.x += (state.tx - state.x) * 0.12;
      state.y += (state.ty - state.y) * 0.12;
      const px = state.x * 4.5;
      const py = state.y * 5;
      pupilL.setAttribute('transform', `translate(${px} ${py})`);
      pupilR.setAttribute('transform', `translate(${px} ${py})`);
      if (head) {
        // 頭をほんの少しだけ追従（CSSアニメと合成）
        head.style.transform = `translate(${state.x * 4}px, ${state.y * 3}px)`;
      }
    }
    loop();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeroCharacter);
  } else {
    initHeroCharacter();
  }
})();
