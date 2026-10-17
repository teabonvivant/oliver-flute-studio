(() => {
  const groups = document.querySelectorAll('[data-lightbox-group]');
  groups.forEach((g) => {
    const n = Number(g.dataset.collapsible || 0);
    if (!n) return;
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'btn lb-more'; b.textContent = `顯示全部（還有 ${n} 張）`;
    b.addEventListener('click', () => { g.classList.add('expanded'); b.remove(); });
    g.after(b);
  });
  if (location.hash) {
    const t = document.querySelector(location.hash);
    const g = t && t.querySelector('.lb-grid[data-collapsible]');
    if (g) { g.classList.add('expanded'); g.nextElementSibling?.classList.contains('lb-more') && g.nextElementSibling.remove(); }
  }

  let box, img, cap, items = [], idx = 0, opener = null;
  const build = () => {
    box = document.createElement('div');
    box.className = 'lightbox'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true'); box.setAttribute('aria-label', '放大檢視');
    box.innerHTML = '<button class="lb-close" type="button" aria-label="關閉">×</button><button class="lb-prev" type="button" aria-label="上一張">‹</button><figure><img alt=""><figcaption></figcaption></figure><button class="lb-next" type="button" aria-label="下一張">›</button>';
    img = box.querySelector('img'); cap = box.querySelector('figcaption');
    box.addEventListener('click', (e) => { if (e.target === box || e.target.closest('figure') === null && !e.target.closest('button')) close(); });
    box.querySelector('.lb-close').addEventListener('click', close);
    box.querySelector('.lb-prev').addEventListener('click', () => go(-1));
    box.querySelector('.lb-next').addEventListener('click', () => go(1));
    document.body.append(box);
  };
  const show = () => {
    const a = items[idx];
    img.src = a.href; img.alt = a.dataset.lightbox || '';
    cap.textContent = `${a.dataset.lightbox || ''}（${idx + 1} / ${items.length}）`;
    box.querySelector('.lb-prev').hidden = box.querySelector('.lb-next').hidden = items.length < 2;
  };
  const go = (d) => { idx = (idx + d + items.length) % items.length; show(); };
  const open = (list, i, from) => {
    if (!box) build();
    items = list; idx = i; opener = from; show();
    box.classList.add('open'); document.body.classList.add('lb-lock');
    box.querySelector('.lb-close').focus();
  };
  const close = () => {
    box.classList.remove('open'); document.body.classList.remove('lb-lock');
    img.removeAttribute('src');
    opener && opener.focus();
  };
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a.lb-item');
    if (!a) return;
    e.preventDefault();
    const scope = a.closest('[data-lightbox-group]') || a.closest('.band') || document;
    const list = [...scope.querySelectorAll('a.lb-item')].filter((x) => x.offsetParent !== null);
    open(list, Math.max(0, list.indexOf(a)), a);
  });
  document.addEventListener('keydown', (e) => {
    if (!box || !box.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') go(-1);
    else if (e.key === 'ArrowRight') go(1);
    else if (e.key === 'Tab') {
      const f = [...box.querySelectorAll('button:not([hidden])')];
      const i = f.indexOf(document.activeElement);
      e.preventDefault();
      f[(i + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
    }
  });

  document.addEventListener('click', (e) => {
    const c = e.target.closest('a.video-card[data-video]');
    if (!c) return;
    e.preventDefault();
    const [kind, id] = c.dataset.video.split(':');
    const src = kind === 'yt'
      ? `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`
      : `https://player.vimeo.com/video/${id}?autoplay=1`;
    const f = document.createElement('iframe');
    f.src = src; f.title = c.querySelector('strong').textContent;
    f.allow = 'autoplay; fullscreen; picture-in-picture'; f.allowFullscreen = true;
    const t = c.querySelector('.video-thumb');
    t.replaceChildren(f);
    c.removeAttribute('href');
    c.classList.add('playing');
  });
})();
