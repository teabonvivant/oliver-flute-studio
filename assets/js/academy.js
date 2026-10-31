(() => {
  const toggle=document.querySelector('[data-nav-toggle]'),nav=document.querySelector('[data-nav]');
  if(toggle&&nav){
    const close=()=>{nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','開啟選單');toggle.querySelector('span').textContent='選單'};
    toggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'關閉選單':'開啟選單');toggle.querySelector('span').textContent=open?'關閉':'選單'});
    nav.addEventListener('click',e=>{if(e.target.closest('a'))close()});
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('open')){close();toggle.focus()}});
    document.addEventListener('click',e=>{if(!nav.contains(e.target)&&!toggle.contains(e.target))close()});
    matchMedia('(min-width:921px)').addEventListener('change',close);
  }
  const profiles={長笛:'由自然持笛、氣流與清楚發聲開始，再把指法、拍子與換氣放進短旋律。',笛子:'先分清口風、笛膜與封孔，再把唱名和指法連到簡單旋律。',空靈鼓:'由自然回彈、拍點與兩音問答開始，再加入分句和旋律。',簫:'先找到自然的短音與舒服持握，再逐步延伸長音、換氣和慢句。',考級:'先確認考試機構、類型與適用大綱，再整理曲目、評核項目和準備時間。'};
  document.querySelectorAll('[data-advisor]').forEach(form=>{
    const output=form.querySelector('[data-advisor-result]');
    const update=()=>{const d=new FormData(form),name=d.get('instrument');output.textContent=`${name} · ${d.get('level')} · ${d.get('goal')}：${profiles[name]} ${d.get('level')==='零基礎'?'可以先從基本發聲與短曲入手。':'帶同目前教材與一段熟悉作品，方便了解需要整理的部分。'}`};
    form.addEventListener('change',update);update();
  });
  document.querySelectorAll('[data-adult-assessment]').forEach(form=>{
    const target=form.querySelector('[data-adult-result]');
    const map={bright:['長笛','flute'],folk:['笛子','dizi'],calm:['簫','xiao'],relax:['空靈鼓','tongue-drum']};
    const time={short:'每次選一個音、一種節奏或一句短旋律，短時間也有明確焦點。',steady:'可分成暖身、短段與回聽三部分，中間留休息。',weekend:'週末整理主要任務，平日有空時以短段回顧，讓兩次練習接得起來。',unknown:'先找最容易保留的一個時段，再逐步調整練習長度。'};
    const goals={hobby:'先選喜歡而程度合適的短曲，建立願意持續的習慣。',exam:'先了解所選考試的要求，再討論是否適合現在開始準備。',stage:'由能完整演奏的短曲開始，也練開頭、停頓與收尾。',relax:'以舒服的姿勢與可掌握的短句開始，留時間聽聲音的變化。'};
    const update=()=>{const d=new FormData(form),[name,slug]=map[d.get('sound')]||map.bright;target.replaceChildren();const heading=document.createElement('strong');heading.textContent=`你喜歡的聲音方向：${name}`;target.append(heading);for(const text of [profiles[name],time[d.get('time')],goals[d.get('goal')],d.get('volume')==='quiet'?'樂器的聲音仍會傳到周圍。較晚時可改做讀譜、聆聽或無聲節奏練習，把吹奏與敲擊安排在合適時段。':'配合家中環境安排出聲時段，也留意聲音會否傳到其他房間。']){if(text){const p=document.createElement('p');p.textContent=text;target.append(p)}}const a=document.createElement('a');a.href=slug+'-course.html';a.textContent=`了解${name}課程`;target.append(a)};
    form.addEventListener('change',update);form.querySelector('[data-reset-adult]')?.addEventListener('click',()=>{form.reset();update()});update();
  });
  document.querySelectorAll('[data-practice]').forEach(sheet=>{
    const key='oliver-music-practice-v1',checks=[...sheet.querySelectorAll('input[type=checkbox]')];
    try{const values=JSON.parse(localStorage.getItem(key)||'[]');checks.forEach((c,i)=>c.checked=values[i]===true)}catch{}
    sheet.addEventListener('change',()=>{try{localStorage.setItem(key,JSON.stringify(checks.map(c=>c.checked)))}catch{}});
    sheet.querySelector('[data-reset-practice]')?.addEventListener('click',()=>{checks.forEach(c=>c.checked=false);try{localStorage.removeItem(key)}catch{}});
  });
  document.querySelector('[data-print]')?.addEventListener('click',()=>window.print());
  document.querySelectorAll('[data-contact-builder]').forEach(form=>{
    const output=form.querySelector('[data-message-output]'),link=form.querySelector('[data-whatsapp]'),status=form.querySelector('[data-copy-status]');
    const syncLink=()=>link.href='https://wa.me/85298096351?text='+encodeURIComponent(output.value);
    const build=()=>{const d=new FormData(form);const name=String(d.get('name')||'').trim(),level=String(d.get('level')||'').trim(),goal=String(d.get('goal')||'').trim();output.value=`張老師你好，${name?'我是'+name+'，':''}想查詢${d.get('instrument')}課程。${level?'\n年齡與程度：'+level:''}${goal?'\n學習目標與可上課時間：'+goal:''}\n想了解課堂形式、收費及上課安排，謝謝。`;syncLink();status.textContent='確認訊息後，在 WhatsApp 發送。'};
    form.addEventListener('submit',e=>{e.preventDefault();build()});form.querySelector('[data-build-message]').addEventListener('click',build);output.addEventListener('input',syncLink);
    form.querySelector('[data-copy-message]').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(output.value);status.textContent='訊息已複製。'}catch{output.focus();output.select();status.textContent='請複製已選取的訊息。'}});
    build();
  });
})();
(() => {
  if(matchMedia('(prefers-reduced-motion: reduce)').matches||!('IntersectionObserver' in window))return;
  const items=document.querySelectorAll('main .band > h2, main .section-intro, .bento > *, .route-list > a, .journal-card, .course-index article, .work-item, .topic-list a, .faq-list details, .teacher-intro > *, .enquiry-band, .home-tools a, .practice-timeline > div, .resource-directory article');
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.08,rootMargin:'0px 0px -4% 0px'});
  items.forEach(el=>{const sib=[...el.parentElement.children].indexOf(el);el.style.setProperty('--d',Math.min(sib%6,5)*.06+'s');el.setAttribute('data-r','');io.observe(el)});
  if(matchMedia('(hover:hover)').matches)document.querySelectorAll('.tilt').forEach(el=>{el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;el.style.transform=`perspective(900px) rotateY(${x*5}deg) rotateX(${-y*5}deg)`});el.addEventListener('pointerleave',()=>el.style.transform='')});
})();

(()=>{const links=[...document.querySelectorAll('.article-side a[href^="#"]')];if(!links.length||!('IntersectionObserver'in window))return;const mark=id=>links.forEach(a=>a.getAttribute('href')==='#'+id?a.setAttribute('aria-current','true'):a.removeAttribute('aria-current'));const io=new IntersectionObserver(es=>{for(const e of es)if(e.isIntersecting)mark(e.target.id)},{rootMargin:'-15% 0px -75% 0px'});for(const a of links){const t=document.getElementById(a.getAttribute('href').slice(1));if(t)io.observe(t)}})();
