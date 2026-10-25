(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* nav */
  const bar = $('[data-bar]');
  const burger = $('[data-burger]');
  const setMenu = (open) => {
    bar.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.querySelector('em').textContent = open ? '關閉' : '選單';
    document.documentElement.style.overflow = open ? 'hidden' : '';
  };
  burger.addEventListener('click', () => setMenu(!bar.classList.contains('open')));
  $$('#nav a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && bar.classList.contains('open')) { setMenu(false); burger.focus(); } });
  let lastY = scrollY;
  const onScroll = () => {
    const y = scrollY;
    bar.classList.toggle('scrolled', y > 40);
    bar.classList.toggle('hide', y > innerHeight * .8 && y > lastY && !bar.classList.contains('open') && !bar.contains(document.activeElement) && !bar.querySelector('.has-sub.open'));
    lastY = y;
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* 聲音 */
  let ctx = null;
  const buffers = {};
  const audioCtx = () => {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  };
  const load = (name) => buffers[name] || (buffers[name] = fetch(`assets/audio/home/${name}.mp3`)
    .then((r) => { if (!r.ok) throw Error(r.status); return r.arrayBuffer(); })
    .then((b) => new Promise((ok, bad) => audioCtx().decodeAudioData(b, ok, bad)))
    .catch((e) => { delete buffers[name]; throw e; }));
  let current = null;
  const stopCurrent = (release = .35) => {
    if (!current) return;
    const c = current; current = null;
    const t = ctx.currentTime;
    c.gain.gain.cancelScheduledValues(t);
    c.gain.gain.setValueAtTime(c.gain.gain.value, t);
    c.gain.gain.linearRampToValueAtTime(0, t + release);
    c.src.stop(t + release + .05);
    c.onStop && c.onStop();
  };
  const play = (buffer, wave, onStop) => {
    stopCurrent(.12);
    const ac = audioCtx();
    const src = ac.createBufferSource();
    const gain = ac.createGain();
    const analyser = ac.createAnalyser();
    analyser.fftSize = 2048;
    src.buffer = buffer;
    gain.gain.setValueAtTime(0, ac.currentTime);
    gain.gain.linearRampToValueAtTime(1, ac.currentTime + .06);
    src.connect(gain).connect(analyser).connect(ac.destination);
    src.start();
    const c = { src, gain, onStop, wave };
    current = c;
    wave && wave.listen(analyser);
    src.onended = () => { if (current === c) { current = null; onStop && onStop(); } };
    return c;
  };

  /* 氣流線 */
  const waves = {};
  class Wave {
    constructor(canvas) {
      this.c = canvas; this.g = canvas.getContext('2d');
      this.kind = canvas.dataset.wave;
      this.light = !!canvas.closest('.finale');
      this.draw = this.kind === 'hero' && !reduce ? 0 : 1;
      this.bumps = []; this.analyser = null; this.level = 0; this.visible = false; this.raf = 0;
      this.buf = new Float32Array(2048);
      new ResizeObserver(() => this.resize()).observe(canvas);
      new IntersectionObserver(([e]) => { this.visible = e.isIntersecting; this.kick(); }).observe(canvas);
    }
    resize() {
      const d = Math.min(devicePixelRatio || 1, 2);
      const r = this.c.getBoundingClientRect();
      this.w = r.width; this.h = r.height;
      this.c.width = Math.round(r.width * d); this.c.height = Math.round(r.height * d);
      this.g.setTransform(d, 0, 0, d, 0, 0);
      this.render(performance.now());
    }
    listen(a) { this.analyser = a; this.kick(); }
    bump(x, amp) { if (this.bumps.length < 12) this.bumps.push({ x, amp, t: performance.now() }); this.kick(); }
    active() { return this.analyser || this.bumps.length || this.level > .002 || this.draw < 1 || (this.light && !reduce); }
    kick() { if (!this.raf && this.visible && !document.hidden) this.raf = requestAnimationFrame((t) => this.loop(t)); }
    loop(t) { this.raf = 0; this.render(t); if (this.visible && !document.hidden && this.active()) this.kick(); }
    render(t) {
      const { g, w, h } = this; if (!w) return;
      const mid = h / 2, n = Math.max(2, Math.round(w / 3));
      g.clearRect(0, 0, w, h);
      let data = null;
      if (this.analyser) {
        this.analyser.getFloatTimeDomainData(this.buf);
        let rms = 0; for (let i = 0; i < this.buf.length; i++) rms += this.buf[i] * this.buf[i];
        rms = Math.sqrt(rms / this.buf.length);
        this.level += (rms - this.level) * .25;
        data = this.buf;
        if (this.level < .002 && (!current || current.wave !== this)) { this.analyser = null; this.level = 0; }
      }
      this.bumps = this.bumps.filter((b) => t - b.t < 1400);
      const span = Math.min(1, this.draw);
      const span2 = this.kind === 'hero' ? 560 : 300;
      const gainY = h * .4 * Math.min(1, this.level * 9 + .15);
      g.lineWidth = this.analyser ? 1.6 : 1;
      g.strokeStyle = this.analyser ? (this.light ? '#e0846f' : '#a34530') : (this.light ? '#f3f1ea66' : '#1f2b2a');
      let peak = 0, start = 0;
      if (data) {
        for (let k = 1; k < 1024; k++) if (data[k - 1] < 0 && data[k] >= 0) { start = k; break; }
        for (let k = start; k < start + span2; k++) peak = Math.max(peak, Math.abs(data[k]));
      }
      g.beginPath();
      for (let i = 0; i <= n * span; i++) {
        const x = (i / n) * w;
        const edge = Math.sin(Math.PI * i / n);
        let y = 0;
        if (data) {
          const f = start + (i / n) * span2, k = Math.floor(f), r = f - k;
          const v = (data[k] * (1 - r) + data[k + 1] * r) / (peak || 1);
          y += v * gainY * edge;
        }
        for (const b of this.bumps) {
          const age = (t - b.t) / 1000;
          const dx = (x - b.x) / 90;
          y += b.amp * Math.exp(-dx * dx) * Math.cos(dx * 2.4 - age * 18) * Math.exp(-age * 3.2) * edge;
        }
        if (this.light && !reduce && !data) y += Math.sin(i / n * Math.PI * 3 + t / 900) * Math.sin(t / 2400) * 10 * edge;
        i ? g.lineTo(x, mid + y) : g.moveTo(x, mid + y);
      }
      g.stroke();
    }
  }
  $$('canvas[data-wave]').forEach((c) => { waves[c.dataset.wave] = new Wave(c); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) stopCurrent(.1); Object.values(waves).forEach((w) => w.kick()); });

  /* hero: pointer crossing the line */
  const hero = waves.hero;
  const breath = $('.breath');
  if (hero && !reduce) {
    let lastP = null, lastT = 0;
    breath.addEventListener('pointermove', (e) => {
      const r = hero.c.getBoundingClientRect();
      const y = e.clientY - r.top - r.height / 2;
      const now = performance.now();
      if (lastP !== null && Math.sign(lastP) !== Math.sign(y) && now - lastT > 60) {
        hero.bump(e.clientX - r.left, Math.max(-38, Math.min(38, (y - lastP) * 1.6)) || 14);
        lastT = now;
      }
      lastP = y;
    });
    breath.addEventListener('pointerleave', () => { lastP = null; });
  }

  /* 按住聽一個音 */
  const hold = $('[data-hold]');
  const status = $('[data-hold-status]');
  const idleText = status.textContent;
  let holding = false;
  const startHold = () => {
    if (holding) return;
    holding = true; hold.classList.add('on');
    status.textContent = '載入中…';
    load(hold.dataset.hold).then((b) => {
      if (!holding) return;
      status.textContent = '聽：氣流穩定，音便穩定';
      play(b, hero, () => {});
    }).catch(() => { status.textContent = '未能載入聲音，請稍後再試'; holding = false; hold.classList.remove('on'); });
  };
  const endHold = () => {
    if (!holding) return;
    holding = false; hold.classList.remove('on');
    stopCurrent(.5);
    status.textContent = idleText;
  };
  hold.addEventListener('pointerdown', (e) => { e.preventDefault(); hold.setPointerCapture?.(e.pointerId); audioCtx(); startHold(); });
  hold.addEventListener('pointerup', endHold);
  hold.addEventListener('pointercancel', endHold);
  hold.addEventListener('lostpointercapture', endHold);
  hold.addEventListener('contextmenu', (e) => e.preventDefault());
  hold.addEventListener('keydown', (e) => { if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) { e.preventDefault(); audioCtx(); startHold(); } });
  hold.addEventListener('keyup', (e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); endHold(); } });
  hold.addEventListener('blur', endHold);
  addEventListener('blur', endHold);

  /* 四種聲音：聽一句 */
  const plays = $$('[data-play]');
  const resetPlays = () => plays.forEach((p) => p.setAttribute('aria-pressed', 'false'));
  plays.forEach((btn) => btn.addEventListener('click', () => {
    if (btn.getAttribute('aria-pressed') === 'true') { stopCurrent(.3); resetPlays(); return; }
    audioCtx();
    endHold();
    resetPlays();
    btn.setAttribute('aria-pressed', 'true');
    load(btn.dataset.play).then((b) => {
      if (btn.getAttribute('aria-pressed') !== 'true') return;
      play(b, waves[btn.dataset.play], () => btn.setAttribute('aria-pressed', 'false'));
    }).catch(() => { btn.setAttribute('aria-pressed', 'false'); btn.lastChild.textContent = '未能載入'; });
  }));

  /* 首頁節拍器 */
  const metro = $('[data-metro]');
  if (metro) {
    const out = $('[data-bpm-out]', metro);
    const toggle = $('[data-metro-toggle]', metro);
    const dots = $$('.beats i', metro);
    let bpm = 72, running = false, next = 0, beat = 0, timer = 0, meter = 4;
    $$('[data-meter]', metro).forEach((b) => b.addEventListener('click', () => {
      meter = Number(b.dataset.meter); beat = 0;
      $$('[data-meter]', metro).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      dots.forEach((d, i) => { d.hidden = i >= meter; });
    }));
    const queue = [];
    const click = (t, accent) => {
      const o = ctx.createOscillator(), gn = ctx.createGain();
      o.frequency.value = accent ? 1760 : 1175;
      gn.gain.setValueAtTime(0, t);
      gn.gain.linearRampToValueAtTime(accent ? .5 : .32, t + .002);
      gn.gain.exponentialRampToValueAtTime(.0001, t + .06);
      o.connect(gn).connect(ctx.destination); o.start(t); o.stop(t + .07);
    };
    const schedule = () => {
      while (next < ctx.currentTime + .12) { click(next, beat % meter === 0); queue.push({ t: next, b: beat % meter }); next += 60 / bpm; beat++; }
      timer = setTimeout(schedule, 25);
    };
    const paint = () => {
      if (!running) { dots.forEach((d) => d.classList.remove('on')); return; }
      while (queue.length && queue[0].t <= ctx.currentTime) {
        const q = queue.shift();
        dots.forEach((d, i) => d.classList.toggle('on', i === q.b));
      }
      requestAnimationFrame(paint);
    };
    const stop = () => { running = false; clearTimeout(timer); queue.length = 0; toggle.textContent = '開始'; toggle.setAttribute('aria-pressed', 'false'); };
    toggle.addEventListener('click', () => {
      if (running) return stop();
      audioCtx(); running = true; beat = 0; next = ctx.currentTime + .08;
      toggle.textContent = '停止'; toggle.setAttribute('aria-pressed', 'true');
      schedule(); requestAnimationFrame(paint);
    });
    $$('[data-bpm]', metro).forEach((b) => b.addEventListener('click', () => {
      bpm = Math.max(40, Math.min(208, bpm + Number(b.dataset.bpm)));
      out.textContent = bpm;
    }));
    document.addEventListener('visibilitychange', () => { if (document.hidden && running) stop(); });
  }

  /* 文字拆字（保留完整可讀名稱） */
  const split = (el) => {
    const targets = el.querySelectorAll('.ln').length ? $$('.ln', el) : [el];
    const chars = [];
    targets.forEach((t) => {
      const text = t.textContent;
      const sr = document.createElement('span');
      sr.className = 'sr'; sr.textContent = text;
      Object.assign(sr.style, { position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap' });
      const vis = document.createElement('span');
      vis.setAttribute('aria-hidden', 'true');
      for (const ch of text) {
        const w = document.createElement('span'); w.className = 'split-w';
        const i = document.createElement('span'); i.textContent = ch;
        w.append(i); vis.append(w); chars.push(i);
      }
      t.replaceChildren(sr, vis);
    });
    return chars;
  };

  /* 動態編排 */
  const gsap = window.gsap, ST = window.ScrollTrigger;
  if (reduce) return;
  /* 手機及無 GSAP：用 IntersectionObserver 做同樣的進場，不載入動畫庫 */
  if (!reduce && (!gsap || !ST)) {
    const sel = '.facts > div, .route-list li, .tools li, .posts a, .metro, .finale p, .finale .acts, .voice-copy > *, .sec-head h2, .teacher blockquote .ln, .portrait, .arrange > div';
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add('in'); io.unobserve(e.target);
    }), { rootMargin: '0px 0px -10% 0px' });
    $$(sel).forEach((el) => { el.classList.add('will-in'); io.observe(el); });
    return;
  }
  gsap.registerPlugin(ST);
  ST.config({ ignoreMobileResize: true, autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load' });

  let lenis = null;
  if (window.Lenis && matchMedia('(hover: hover) and (pointer: fine)').matches) {
    lenis = new window.Lenis({ duration: 1.1, smoothWheel: true });
    lenis.on('scroll', ST.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    $$('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => {
      const id = a.getAttribute('href'); if (id.length < 2) return;
      const el = document.querySelector(id); if (!el) return;
      e.preventDefault(); lenis.scrollTo(el, { offset: -20 }); el.setAttribute('tabindex', '-1'); el.focus({ preventScroll: true });
    }));
  }

  // hero intro
  const heroChars = split($('.hero-title'));
  const intro = gsap.timeline({ defaults: { ease: 'expo.out' } });
  intro.from(heroChars, { yPercent: 110, duration: 1.1, stagger: .045 }, .1)
    .to(hero, { draw: 1, duration: 1.4, ease: 'power2.inOut', onUpdate: () => hero.kick() }, .35)
    .from('.hold', { scale: .6, opacity: 0, duration: .8 }, 1.1)
    .from(['.hold-note', '.hero-foot'], { y: 16, opacity: 0, duration: .8, stagger: .08 }, 1.2)
    .add(() => hero.bump(hero.w * .62, 26), 1.6);

  const scrollScenes = () => {
  // 段落標題
  $$('.sec-head h2[data-split], .finale h2').forEach((el) => {
    const chars = split(el);
    gsap.from(chars, { yPercent: 110, duration: .9, ease: 'expo.out', stagger: .025, scrollTrigger: { trigger: el, start: 'top 85%' } });
  });

  gsap.from('.teacher blockquote .ln', { y: 30, opacity: 0, duration: 1, ease: 'expo.out', stagger: .12, scrollTrigger: { trigger: '.teacher blockquote', start: 'top 85%' } });

  const mm = gsap.matchMedia();
  mm.add('(min-width: 901px)', () => {
    const track = $('[data-track]');
    $('.voices').classList.add('hscroll');
    const dist = () => track.scrollWidth - innerWidth;
    const names = $$('.vindex a'), bar = $('[data-vbar]');
    const mark = (p) => { bar.style.transform = `scaleX(${p})`; const k = Math.round(p * 3); names.forEach((a, i) => a.classList.toggle('on', i === k)); };
    const tween = gsap.to(track, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: '.voices', start: 'top top', end: () => '+=' + dist() * .7, pin: true, scrub: .6, invalidateOnRefresh: true, anticipatePin: 1, onUpdate: (st) => mark(st.progress) } });
    mark(0);
    const jump = (e) => {
      const i = names.indexOf(e.currentTarget), st = tween.scrollTrigger;
      e.preventDefault(); e.stopImmediatePropagation();
      const y = st.start + (st.end - st.start) * (i / 3) + 2;
      lenis ? lenis.scrollTo(y) : scrollTo({ top: y, behavior: 'smooth' });
      setTimeout(() => $('.play', $$('.voice')[i]).focus({ preventScroll: true }), 900);
    };
    names.forEach((a) => a.addEventListener('click', jump, true));
    $$('.voice').forEach((v) => {
      gsap.fromTo($('figure img', v), { xPercent: -6 }, { xPercent: 6, ease: 'none', scrollTrigger: { trigger: v, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true } });
      gsap.from($$('.voice-copy > *', v), { y: 40, opacity: 0, stagger: .06, duration: .8, ease: 'expo.out', scrollTrigger: { trigger: v, containerAnimation: tween, start: 'left 70%' } });
    });
    // 路線預覽圖
    const peek = $('[data-peek-img]');
    const routes = $('.routes');
    const px = gsap.quickTo(peek, 'x', { duration: .45, ease: 'power3' });
    const py = gsap.quickTo(peek, 'y', { duration: .45, ease: 'power3' });
    $$('[data-peek]').forEach((a) => {
      a.addEventListener('pointerenter', () => { peek.src = a.dataset.peek; gsap.to(peek, { opacity: 1, scale: 1, rotate: -2, duration: .3 }); });
      a.addEventListener('pointerleave', () => gsap.to(peek, { opacity: 0, scale: .9, rotate: 0, duration: .25 }));
    });
    const move = (e) => { const r = routes.getBoundingClientRect(); px(e.clientX - r.left + 28); py(e.clientY - r.top - 100); };
    routes.addEventListener('pointermove', move);
    return () => { $('.voices').classList.remove('hscroll'); routes.removeEventListener('pointermove', move); names.forEach((a) => { a.removeEventListener('click', jump, true); a.classList.remove('on'); }); };
  });
  mm.add('(max-width: 900px)', () => {
    $$('.voice').forEach((v) => gsap.from($$('.voice-copy > *', v), { y: 30, opacity: 0, stagger: .06, duration: .8, ease: 'expo.out', scrollTrigger: { trigger: v, start: 'top 75%' } }));
  });

  // portrait
  gsap.from('.portrait', { clipPath: 'inset(100% 0 0 0)', duration: 1.3, ease: 'expo.inOut', scrollTrigger: { trigger: '.portrait', start: 'top 80%' } });
  gsap.from('.portrait img', { scale: 1.25, duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: '.portrait', start: 'top 80%' } });

  // 數字
  $$('[data-count]').forEach((el) => {
    const end = Number(el.dataset.count), o = { v: 0 };
    gsap.to(o, { v: end, duration: 1.6, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%' }, onUpdate: () => { el.textContent = Math.round(o.v); } });
  });

  // photo reel
  $$('[data-row]').forEach((row) => {
    const dir = Number(row.dataset.row);
    gsap.fromTo(row, { x: () => dir < 0 ? 0 : -innerWidth * .25 }, { x: () => dir < 0 ? -innerWidth * .3 : innerWidth * .05, ease: 'none', scrollTrigger: { trigger: '.reel', start: 'top bottom', end: 'bottom top', scrub: .6, invalidateOnRefresh: true } });
  });

  // 其他區塊淡入
  gsap.set('.facts > div, .route-list li, .tools li, .posts a, .metro, .finale p, .finale .acts', { y: 36, opacity: 0 });
  ST.batch('.facts > div, .route-list li, .tools li, .posts a, .metro, .finale p, .finale .acts', { start: 'top 92%', once: true, onEnter: (els) => gsap.to(els, { y: 0, opacity: 1, duration: .9, ease: 'expo.out', stagger: .06 }) });

    ST.refresh();
  };
  (window.requestIdleCallback || ((f) => setTimeout(f, 1)))(scrollScenes, { timeout: 1800 });
})();
