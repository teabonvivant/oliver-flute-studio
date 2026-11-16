(() => {
  const NAMES = ['C', 'C♯', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'B♭', 'B'];
  const SOLFA = ['1', '♯1', '2', '♭3', '3', '4', '♯4', '5', '♯5', '6', '♭7', '7'];
  const KEYS = { 'C': 0, 'D': 2, 'E♭': 3, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B♭': 10 };
  const LETTER = { C: 0, D: 1, E: 2, F: 3, G: 4, A: 5, B: 6 };
  const noteName = m => NAMES[((m % 12) + 12) % 12] + (Math.floor(m / 12) - 1);
  const solfaText = (m, tonic = 0) => {
    const base = SOLFA[((m - tonic) % 12 + 12) % 12];
    const oct = Math.floor((m - (60 + tonic)) / 12);
    return base + (oct > 0 ? `（高${oct > 1 ? oct : ''}八度）` : oct < 0 ? `（低${-oct > 1 ? -oct : ''}八度）` : '');
  };
  const midiToFreq = (m, a4 = 440) => a4 * Math.pow(2, (m - 69) / 12);

  // 長笛 Boehm 基本指法：[左拇指, 左食指, 左中指, 左無名指, 左尾指 G♯, 右食指, 右中指, 右無名指, 右尾指]
  // 右尾指：eb 降 E 鍵、cs 低 C♯ 滾鍵、c 低 C 滾鍵、0 不按。依 Woodwind Fingering Guide 基本指法整理。
  const F = (s, rp) => [...s].map(Number).concat([rp]);
  const FINGERING = {
    60: F('11110111', 'c'), 61: F('11110111', 'cs'), 62: F('11110111', 0),
    63: F('11110111', 'eb'), 64: F('11110110', 'eb'), 65: F('11110100', 'eb'),
    66: F('11110001', 'eb'), 67: F('11110000', 'eb'), 68: F('11111000', 'eb'),
    69: F('11100000', 'eb'), 70: F('11000100', 'eb'), 71: F('11000000', 'eb'),
    72: F('01000000', 'eb'), 73: F('00000000', 'eb'),
    74: F('10110111', 0), 75: F('10110111', 'eb'), 76: F('11110110', 'eb'),
    77: F('11110100', 'eb'), 78: F('11110001', 'eb'), 79: F('11110000', 'eb'),
    80: F('11111000', 'eb'), 81: F('11100000', 'eb'), 82: F('11000100', 'eb'),
    83: F('11000000', 'eb'), 84: F('01000000', 'eb'), 85: F('00000000', 'eb'),
    86: F('10110000', 'eb'), 87: F('11111111', 'eb'), 88: F('11100110', 'eb'),
    89: F('11010100', 'eb'), 90: F('11010001', 'eb'), 91: F('01110000', 'eb'),
    92: F('00111000', 'eb'), 93: F('10100100', 'eb')
  };
  const KEY_NAMES = ['左拇指', '左食指', '左中指', '左無名指', '左尾指（G♯ 鍵）', '右食指', '右中指', '右無名指'];
  const PINKY = { eb: '右尾指按降 E 鍵', cs: '右尾指按低 C♯ 鍵', c: '右尾指按低 C 鍵', 0: '右尾指不按' };
  const REGISTERS = [['低音區', 60, 71], ['中音區', 72, 83], ['高音區', 84, 93]];

  const fingeringLabel = m => {
    const f = FINGERING[m];
    const pressed = KEY_NAMES.filter((_, i) => f[i]);
    return `${noteName(m)} 指法：${pressed.length ? '按 ' + pressed.join('、') : '左右手主鍵全放開'}；${PINKY[f[8]]}。`;
  };

  const fingeringSVG = m => {
    const f = FINGERING[m];
    const on = v => (v ? 'is-on' : '');
    const keys = [
      `<ellipse class="fk ${on(f[0])}" cx="46" cy="36" rx="13" ry="9"/>`,
      `<circle class="fk ${on(f[1])}" cx="78" cy="70" r="15"/>`,
      `<circle class="fk ${on(f[2])}" cx="116" cy="70" r="15"/>`,
      `<circle class="fk ${on(f[3])}" cx="154" cy="70" r="15"/>`,
      `<ellipse class="fk ${on(f[4])}" cx="184" cy="104" rx="12" ry="7"/>`,
      `<circle class="fk ${on(f[5])}" cx="222" cy="70" r="15"/>`,
      `<circle class="fk ${on(f[6])}" cx="260" cy="70" r="15"/>`,
      `<circle class="fk ${on(f[7])}" cx="298" cy="70" r="15"/>`,
      `<ellipse class="fk ${on(f[8] === 'eb')}" cx="332" cy="102" rx="11" ry="7"/>`,
      `<rect class="fk ${on(f[8] === 'cs')}" x="350" y="88" width="20" height="10"/>`,
      `<rect class="fk ${on(f[8] === 'c')}" x="350" y="104" width="20" height="10"/>`
    ].join('');
    return `<svg class="fingering-svg" viewBox="0 0 410 150" role="img" aria-label="${fingeringLabel(m)}"><rect class="fbody" x="12" y="60" width="368" height="20"/><path class="fguide" d="M200 46V128"/>${keys}<text x="116" y="140" text-anchor="middle">左手</text><text x="286" y="140" text-anchor="middle">右手</text><text x="46" y="18" text-anchor="middle">拇指</text><text x="184" y="128" text-anchor="middle" class="fsmall">G♯</text><text x="332" y="124" text-anchor="middle" class="fsmall">E♭</text><text x="376" y="97" class="fsmall">C♯</text><text x="376" y="113" class="fsmall">C</text></svg>`;
  };

  const staffSVG = m => {
    const name = NAMES[((m % 12) + 12) % 12];
    const oct = Math.floor(m / 12) - 1;
    const diat = oct * 7 + LETTER[name[0]];
    const y = 110 - (diat - 30) * 5;
    let ledgers = '';
    for (let d = 28; d >= diat; d -= 2) ledgers += `<path d="M48 ${110 - (d - 30) * 5}h34"/>`;
    for (let d = 40; d <= diat; d += 2) ledgers += `<path d="M48 ${110 - (d - 30) * 5}h34"/>`;
    const acc = name[1] ? `<text class="acc" x="40" y="${y + 6}" text-anchor="middle">${name[1]}</text>` : '';
    const stem = diat >= 34 ? `<path d="M58 ${y + 2}v34"/>` : `<path d="M72 ${y - 2}v-34"/>`;
    return `<svg class="staff-svg" viewBox="0 0 120 160" role="img" aria-label="高音譜表上的 ${noteName(m)}"><text class="clef" x="8" y="150">高音譜表</text><g class="lines">${[70, 80, 90, 100, 110].map(v => `<path d="M8 ${v}h104"/>`).join('')}</g><g class="ledgers">${ledgers}</g>${acc}<ellipse class="head" cx="65" cy="${y}" rx="7.4" ry="5.4" transform="rotate(-20 65 ${y})"/><g class="stem">${stem}</g></svg>`;
  };

  // 音高偵測：歸一化自相關（McLeod Pitch Method 簡化版）
  const detectPitch = (buf, sr, minF = 150, maxF = 2600) => {
    const n = buf.length;
    let rms = 0;
    for (let i = 0; i < n; i++) rms += buf[i] * buf[i];
    rms = Math.sqrt(rms / n);
    if (rms < 0.008) return { freq: 0, clarity: 0, rms };
    const minLag = Math.max(2, Math.floor(sr / maxF)), maxLag = Math.min(n - 2, Math.ceil(sr / minF));
    const nsdf = new Float32Array(maxLag + 2);
    for (let tau = 0; tau <= maxLag + 1; tau++) {
      let r = 0, m = 0;
      for (let i = 0; i < n - tau; i++) { r += buf[i] * buf[i + tau]; m += buf[i] * buf[i] + buf[i + tau] * buf[i + tau]; }
      nsdf[tau] = m ? 2 * r / m : 0;
    }
    const peaks = [];
    let tau = 1;
    while (tau < maxLag && nsdf[tau] > 0) tau++;
    for (; tau <= maxLag; tau++) {
      if (nsdf[tau] > 0) {
        let best = tau;
        while (tau <= maxLag && nsdf[tau] > 0) { if (nsdf[tau] > nsdf[best]) best = tau; tau++; }
        if (best >= minLag) peaks.push(best);
      }
    }
    if (!peaks.length) return { freq: 0, clarity: 0, rms };
    const top = Math.max(...peaks.map(p => nsdf[p]));
    const pick = peaks.find(p => nsdf[p] >= top * 0.9);
    const a = nsdf[pick - 1], b = nsdf[pick], c = nsdf[pick + 1];
    const shift = (a - 2 * b + c) ? 0.5 * (a - c) / (a - 2 * b + c) : 0;
    return { freq: sr / (pick + shift), clarity: b, rms };
  };

  const analyse = (freq, a4 = 440) => {
    const exact = 69 + 12 * Math.log2(freq / a4);
    const midi = Math.round(exact);
    return { midi, cents: Math.round((exact - midi) * 100), exact };
  };

  let ctx = null;
  const audio = () => {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  };
  const playTone = (freq, dur = 1.2) => {
    const c = audio(), t = c.currentTime + 0.02;
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.22, t + 0.05);
    g.gain.setValueAtTime(0.22, t + dur - 0.2);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    g.connect(c.destination);
    [[1, 1], [2, 0.18], [3, 0.06]].forEach(([h, v]) => {
      const o = c.createOscillator(), og = c.createGain();
      o.type = 'sine'; o.frequency.value = freq * h; og.gain.value = v;
      o.connect(og).connect(g); o.start(t); o.stop(t + dur + 0.05);
    });
  };

  const openMic = async () => {
    const c = audio();
    const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false } });
    const src = c.createMediaStreamSource(stream);
    const an = c.createAnalyser();
    an.fftSize = 2048;
    src.connect(an);
    const buf = new Float32Array(an.fftSize);
    return {
      read: () => { an.getFloatTimeDomainData(buf); return detectPitch(buf, c.sampleRate); },
      close: () => { stream.getTracks().forEach(t => t.stop()); src.disconnect(); }
    };
  };
  const micError = e => e && e.name === 'NotAllowedError' ? '未取得咪高峰權限。請在瀏覽器網址列旁允許使用咪高峰，再按一次開始。' : '這部裝置或瀏覽器未能開啟咪高峰。可改用手機 Chrome、Safari 或電腦版瀏覽器。';

  const fillKeySelect = (sel) => {
    if (!sel || sel.options.length) return;
    Object.keys(KEYS).forEach(k => sel.add(new Option('1=' + k, k)));
  };

  // 調音器
  document.querySelectorAll('[data-tuner]').forEach(root => {
    const $ = s => root.querySelector(s);
    const btn = $('[data-tuner-toggle]'), note = $('[data-tuner-note]'), sol = $('[data-tuner-solfa]'), cents = $('[data-tuner-cents]'), hz = $('[data-tuner-hz]'), needle = $('[data-tuner-needle]'), status = $('[data-tuner-status]'), a4Sel = $('[data-tuner-a4]'), keySel = $('[data-tuner-key]');
    fillKeySelect(keySel);
    let mic = null, raf = 0, recent = [];
    const reset = () => { note.textContent = '—'; sol.textContent = '吹一個長音'; cents.textContent = ''; hz.textContent = ''; needle.style.setProperty('--offset', '0'); root.dataset.state = 'idle'; };
    const frame = () => {
      const r = mic.read();
      if (r.freq && r.clarity > 0.86) {
        recent.push(r.freq); if (recent.length > 5) recent.shift();
        const f = [...recent].sort((a, b) => a - b)[recent.length >> 1];
        const a = analyse(f, Number(a4Sel.value));
        note.textContent = noteName(a.midi);
        sol.textContent = `簡譜 ${solfaText(a.midi, KEYS[keySel.value])}`;
        cents.textContent = (a.cents > 0 ? '+' : a.cents < 0 ? '−' : '±') + Math.abs(a.cents) + ' 音分';
        hz.textContent = f.toFixed(1) + ' Hz';
        needle.style.setProperty('--offset', String(Math.max(-50, Math.min(50, a.cents))));
        root.dataset.state = Math.abs(a.cents) <= 5 ? 'in' : a.cents > 0 ? 'sharp' : 'flat';
      } else if (r.rms < 0.008) { recent = []; }
      raf = requestAnimationFrame(frame);
    };
    const stop = () => { cancelAnimationFrame(raf); mic && mic.close(); mic = null; btn.textContent = '開始聆聽'; btn.setAttribute('aria-pressed', 'false'); status.textContent = '已停止。'; reset(); };
    btn.addEventListener('click', async () => {
      if (mic) return stop();
      try { mic = await openMic(); } catch (e) { status.textContent = micError(e); return; }
      btn.textContent = '停止'; btn.setAttribute('aria-pressed', 'true'); status.textContent = '正在聆聽。聲音只在這部裝置分析，不會上載。';
      frame();
    });
    $('[data-tuner-ref]').addEventListener('click', () => playTone(Number(a4Sel.value), 2));
    reset();
  });

  // 節拍器
  const TEMPO_NAMES = [[40, 'Grave'], [60, 'Largo'], [66, 'Larghetto'], [76, 'Adagio'], [108, 'Andante'], [120, 'Moderato'], [156, 'Allegro'], [176, 'Vivace'], [200, 'Presto'], [999, 'Prestissimo']];
  document.querySelectorAll('[data-metronome]').forEach(root => {
    const $ = s => root.querySelector(s);
    const bpmIn = $('[data-bpm]'), bpmRange = $('[data-bpm-range]'), bpmOut = $('[data-bpm-out]'), term = $('[data-tempo-name]'), beatsSel = $('[data-beats]'), subSel = $('[data-sub]'), accent = $('[data-accent]'), dots = $('[data-dots]'), toggle = $('[data-metro-toggle]'), trainer = $('[data-trainer]'), stepIn = $('[data-step]'), everyIn = $('[data-every]'), maxIn = $('[data-max]');
    let bpm = 72, running = false, timer = 0, next = 0, beat = 0, sub = 0, bar = 0, taps = [];
    const queue = [];
    const setBpm = v => {
      bpm = Math.max(30, Math.min(240, Math.round(Number(v) || bpm)));
      bpmIn.value = bpmRange.value = bpm; bpmOut.textContent = bpm;
      term.textContent = TEMPO_NAMES.find(([n]) => bpm < n)[1];
    };
    const drawDots = () => { dots.innerHTML = Array.from({ length: Number(beatsSel.value) }, (_, i) => `<span${i === 0 && accent.checked ? ' class="accent"' : ''}></span>`).join(''); };
    const click = (t, level) => {
      const c = audio(), o = c.createOscillator(), g = c.createGain();
      o.frequency.value = level === 2 ? 1760 : level === 1 ? 1175 : 880;
      const v = level === 0 ? 0.12 : 0.32;
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(v, t + 0.002); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
      o.connect(g).connect(c.destination); o.start(t); o.stop(t + 0.06);
    };
    const schedule = () => {
      const c = audio(), subs = Number(subSel.value), beats = Number(beatsSel.value);
      while (next < c.currentTime + 0.12) {
        const level = sub ? 0 : (beat === 0 && accent.checked ? 2 : 1);
        click(next, level);
        if (!sub) queue.push({ t: next, beat });
        next += 60 / bpm / subs;
        if (++sub >= subs) {
          sub = 0;
          if (++beat >= beats) {
            beat = 0; bar++;
            if (trainer.checked && bar % Math.max(1, Number(everyIn.value)) === 0 && bpm < Number(maxIn.value)) setBpm(Math.min(Number(maxIn.value), bpm + Number(stepIn.value)));
          }
        }
      }
    };
    const paint = () => {
      if (!running) return;
      const now = audio().currentTime;
      while (queue.length && queue[0].t <= now) {
        const { beat: b } = queue.shift();
        [...dots.children].forEach((d, i) => d.classList.toggle('on', i === b));
      }
      requestAnimationFrame(paint);
    };
    const start = () => { const c = audio(); running = true; beat = sub = bar = 0; queue.length = 0; next = c.currentTime + 0.06; schedule(); timer = setInterval(schedule, 25); toggle.textContent = '停止'; toggle.setAttribute('aria-pressed', 'true'); paint(); };
    const stop = () => { running = false; clearInterval(timer); toggle.textContent = '開始'; toggle.setAttribute('aria-pressed', 'false'); [...dots.children].forEach(d => d.classList.remove('on')); };
    toggle.addEventListener('click', () => running ? stop() : start());
    bpmIn.addEventListener('change', () => setBpm(bpmIn.value));
    bpmRange.addEventListener('input', () => setBpm(bpmRange.value));
    root.querySelectorAll('[data-nudge]').forEach(b => b.addEventListener('click', () => setBpm(bpm + Number(b.dataset.nudge))));
    beatsSel.addEventListener('change', () => { beat = 0; drawDots(); });
    accent.addEventListener('change', drawDots);
    $('[data-tap]').addEventListener('click', () => {
      const now = performance.now();
      taps = taps.filter(t => now - t < 2500); taps.push(now);
      if (taps.length >= 2) { const gaps = taps.slice(1).map((t, i) => t - taps[i]); setBpm(60000 / (gaps.reduce((a, b) => a + b) / gaps.length)); }
    });
    document.addEventListener('keydown', e => {
      if (e.code !== 'Space' || e.target.closest('input,select,textarea,button,a')) return;
      e.preventDefault(); running ? stop() : start();
    });
    root.__metronome = { setBpm, get bpm() { return bpm; }, get running() { return running; } };
    setBpm(bpmIn.value); drawDots();
  });

  // 長笛指法表
  document.querySelectorAll('[data-fingering]').forEach(root => {
    const $ = s => root.querySelector(s);
    const picker = $('[data-note-picker]'), view = $('[data-fingering-view]'), keySel = $('[data-fingering-key]');
    fillKeySelect(keySel);
    let current = 67;
    picker.innerHTML = REGISTERS.map(([label, lo, hi]) => `<div class="note-row"><p>${label}</p><div>${Array.from({ length: hi - lo + 1 }, (_, i) => lo + i).map(m => `<button type="button" data-midi="${m}" aria-pressed="false">${noteName(m)}</button>`).join('')}</div></div>`).join('');
    const show = m => {
      current = m;
      picker.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(Number(b.dataset.midi) === m)));
      view.innerHTML = `<div class="fingering-card"><div class="fingering-staff">${staffSVG(m)}</div><div class="fingering-info"><p class="fingering-name">${noteName(m)}</p><p class="fingering-solfa">簡譜 ${solfaText(m, KEYS[keySel.value])}　·　${midiToFreq(m).toFixed(1)} Hz</p>${fingeringSVG(m)}<p class="fingering-text">${fingeringLabel(m)}</p><button type="button" class="btn" data-play>聽這個音</button></div></div>`;
      view.querySelector('[data-play]').addEventListener('click', () => playTone(midiToFreq(m), 1.4));
    };
    picker.addEventListener('click', e => { const b = e.target.closest('[data-midi]'); if (b) show(Number(b.dataset.midi)); });
    picker.addEventListener('keydown', e => {
      if (!['ArrowLeft', 'ArrowRight'].includes(e.key)) return;
      const m = Math.max(60, Math.min(93, current + (e.key === 'ArrowRight' ? 1 : -1)));
      show(m); picker.querySelector(`[data-midi="${m}"]`).focus(); e.preventDefault();
    });
    keySel.addEventListener('change', () => show(current));
    show(current);
  });

  // 長音練習
  class LongTone {
    constructor() { this.reset(); }
    reset() { this.state = 'idle'; this.start = 0; this.last = 0; this.cents = []; this.midis = []; }
    feed(t, pitch) {
      if (pitch) {
        if (this.state !== 'sounding') { this.state = 'sounding'; this.start = t; this.cents = []; this.midis = []; }
        this.last = t; this.cents.push(pitch.exact); this.midis.push(pitch.midi);
        return null;
      }
      if (this.state === 'sounding' && t - this.last > 0.4) {
        this.state = 'idle';
        const seconds = this.last - this.start;
        if (seconds < 1) return null;
        const sorted = [...this.cents].sort((a, b) => a - b);
        const centre = sorted[sorted.length >> 1];
        const midi = Math.round(centre);
        const devs = this.cents.map(c => (c - centre) * 100);
        const spread = Math.sqrt(devs.reduce((s, d) => s + d * d, 0) / devs.length);
        return { seconds: Math.round(seconds * 10) / 10, note: noteName(midi), spread: Math.round(spread) };
      }
      return null;
    }
    elapsed(t) { return this.state === 'sounding' ? t - this.start : 0; }
  }
  document.querySelectorAll('[data-longtone]').forEach(root => {
    const $ = s => root.querySelector(s);
    const btn = $('[data-lt-toggle]'), timeOut = $('[data-lt-time]'), noteOut = $('[data-lt-note]'), status = $('[data-lt-status]'), list = $('[data-lt-history]'), best = $('[data-lt-best]');
    const key = 'oliver-longtone-v1';
    const lt = new LongTone();
    let mic = null, raf = 0;
    const load = () => { try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; } };
    const render = () => {
      const h = load();
      best.textContent = h.length ? Math.max(...h.map(x => x.seconds)).toFixed(1) + ' 秒' : '未有紀錄';
      list.innerHTML = h.slice(0, 8).map(x => `<li><span>${x.date}</span><strong>${x.seconds.toFixed(1)} 秒</strong><span>${x.note}</span><span>${x.spread <= 8 ? '音高很穩' : x.spread <= 18 ? '大致平穩' : '音高有起伏'}（±${x.spread} 音分）</span></li>`).join('') || '<li class="empty">吹完第一個長音後，結果會列在這裏。</li>';
    };
    const save = r => {
      const d = new Date();
      const h = load(); h.unshift({ ...r, date: `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}` });
      try { localStorage.setItem(key, JSON.stringify(h.slice(0, 30))); } catch { }
      render();
    };
    const frame = () => {
      const r = mic.read(), t = performance.now() / 1000;
      const p = r.freq && r.clarity > 0.86 && r.rms > 0.015 ? analyse(r.freq) : null;
      const done = lt.feed(t, p);
      if (done) { save(done); status.textContent = `剛才：${done.note} 長音 ${done.seconds.toFixed(1)} 秒。休息一下，再吹下一個。`; }
      timeOut.textContent = lt.elapsed(t).toFixed(1);
      noteOut.textContent = p ? noteName(p.midi) : lt.state === 'sounding' ? noteOut.textContent : '—';
      root.dataset.state = lt.state;
      raf = requestAnimationFrame(frame);
    };
    const stop = () => { cancelAnimationFrame(raf); mic && mic.close(); mic = null; lt.reset(); btn.textContent = '開始'; btn.setAttribute('aria-pressed', 'false'); timeOut.textContent = '0.0'; noteOut.textContent = '—'; root.dataset.state = 'idle'; };
    btn.addEventListener('click', async () => {
      if (mic) { stop(); status.textContent = '已停止。'; return; }
      try { mic = await openMic(); } catch (e) { status.textContent = micError(e); return; }
      btn.textContent = '停止'; btn.setAttribute('aria-pressed', 'true'); status.textContent = '準備好就吹。聲音停下後會自動記錄。';
      frame();
    });
    $('[data-lt-clear]').addEventListener('click', () => { try { localStorage.removeItem(key); } catch { } render(); });
    render();
  });

  // 長笛紙牌：翻卡練習
  document.querySelectorAll('[data-cards]').forEach(root => {
    const $ = s => root.querySelector(s);
    const cardEl = $('[data-card]'), front = $('[data-card-front]'), back = $('[data-card-back]'), flip = $('[data-card-flip]'), know = $('[data-card-know]'), again = $('[data-card-again]'), range = $('[data-card-range]'), progress = $('[data-card-progress]'), done = $('[data-card-done]');
    let deck = [], total = 0, known = 0;
    const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
    const build = () => {
      const [lo, hi] = range.value.split('-').map(Number);
      deck = shuffle(Array.from({ length: hi - lo + 1 }, (_, i) => lo + i)); total = deck.length; known = 0; done.hidden = true; cardEl.hidden = false; show();
    };
    const show = () => {
      cardEl.classList.remove('flipped'); flip.setAttribute('aria-expanded', 'false');
      if (!deck.length) { cardEl.hidden = true; done.hidden = false; progress.textContent = `${total} 張全部記得`; know.disabled = again.disabled = flip.disabled = true; return; }
      know.disabled = again.disabled = true; flip.disabled = false;
      const m = deck[0];
      front.innerHTML = `<p class="card-suit">指法卡</p>${staffSVG(m)}<p class="card-q">這個音叫甚麼？怎樣按？</p>`;
      back.innerHTML = `<p class="card-suit">指法卡</p><p class="card-name">${noteName(m)}</p>${fingeringSVG(m)}<p class="card-tip">${fingeringLabel(m)}</p>`;
      progress.textContent = `記得 ${known}／${total} 張`;
    };
    flip.addEventListener('click', () => { cardEl.classList.add('flipped'); flip.setAttribute('aria-expanded', 'true'); know.disabled = again.disabled = false; flip.disabled = true; playTone(midiToFreq(deck[0]), 1); know.focus(); });
    know.addEventListener('click', () => { deck.shift(); known++; show(); flip.focus(); });
    again.addEventListener('click', () => { const m = deck.shift(); deck.splice(Math.min(3, deck.length), 0, m); show(); flip.focus(); });
    range.addEventListener('change', build);
    $('[data-card-restart]').addEventListener('click', build);
    build();
  });

  document.querySelectorAll('[data-card-sample]').forEach(el => {
    const m = Number(el.dataset.cardSample);
    el.innerHTML = `<div class="flash-face front"><p class="card-suit">指法卡</p>${staffSVG(m)}</div><div class="flash-face back"><p class="card-suit">指法卡</p><p class="card-name">${noteName(m)}</p>${fingeringSVG(m)}</div>`;
  });

  window.__studio = { detectPitch, analyse, noteName, solfaText, FINGERING, LongTone, staffSVG, fingeringSVG };
})();
