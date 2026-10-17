(() => {
  const posts=window.BLOG_POSTS||[],list=document.querySelector('[data-blog-list]');if(!list||!posts.length)return;
  const search=document.querySelector('#blogSearch'),filters=document.querySelector('[data-blog-filters]'),sort=document.querySelector('[data-blog-sort]'),count=document.querySelector('[data-blog-count]'),pagination=document.querySelector('[data-pagination]'),empty=document.querySelector('[data-empty]');
  const names=['全部',...new Set(posts.map(p=>p.category))],pageSize=12;
  let category='全部',page=1;
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const card=p=>`<article class="journal-card" data-category="${esc(p.category)}"><a class="card-image" href="${esc(p.url)}" tabindex="-1" aria-hidden="true"><img src="${esc(p.image)}" srcset="${esc(p.image.slice(0,-5))}-640.webp 640w, ${esc(p.image.slice(0,-5))}-1024.webp 1024w, ${esc(p.image)} 1536w" sizes="(max-width: 760px) 100vw, 33vw" width="1536" height="1024" alt="" loading="lazy" decoding="async"></a><div class="card-content"><p class="card-category">${esc(p.category)}<span>${esc(p.readTime)}</span></p><h2><a href="${esc(p.url)}">${esc(p.title)}</a></h2><p>${esc(p.excerpt)}</p></div></article>`;
  const readURL=()=>{const params=new URLSearchParams(location.search);search.value=params.get('q')||'';category=names.includes(params.get('category'))?params.get('category'):'全部';sort.value=['recommended','latest','category'].includes(params.get('sort'))?params.get('sort'):'recommended';page=Math.max(1,Number.parseInt(params.get('page'),10)||1)};
  const writeURL=()=>{const url=new URL(location.href);url.search='';if(search.value.trim())url.searchParams.set('q',search.value.trim());if(category!=='全部')url.searchParams.set('category',category);if(sort.value!=='recommended')url.searchParams.set('sort',sort.value);if(page>1)url.searchParams.set('page',page);history.replaceState(null,'',url)};
  let loading=false;
  const loadFullText=()=>{if(window.BLOG_SEARCH||loading)return;loading=true;const script=document.createElement('script');script.src='assets/js/blog-search.js';script.onload=()=>render();document.head.append(script)};
  const render=()=>{
    if(search.value.trim())loadFullText();
    const query=search.value.trim().toLocaleLowerCase('zh-HK'),terms=query.split(/\s+/).filter(Boolean);
    const selected=posts.filter(p=>{const text=`${p.title} ${p.category} ${p.excerpt} ${(p.keywords||[]).join(' ')} ${(window.BLOG_SEARCH||{})[p.slug]||''}`.toLocaleLowerCase('zh-HK');return(category==='全部'||p.category===category)&&terms.every(t=>text.includes(t))}).sort((a,b)=>sort.value==='latest'?b.date.localeCompare(a.date)||a.order-b.order:sort.value==='category'?a.category.localeCompare(b.category,'zh-Hant')||a.order-b.order:a.order-b.order);
    const pages=Math.max(1,Math.ceil(selected.length/pageSize));page=Math.min(page,pages);
    list.innerHTML=selected.slice((page-1)*pageSize,page*pageSize).map(card).join('');empty.hidden=selected.length>0;count.textContent=`${category==='簫'?'洞簫':category} · ${selected.length} 篇${selected.length?' · 第 '+page+' / '+pages+' 頁':''}`;
    filters.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.filter===category)));
    pagination.replaceChildren();
    const button=(label,n,disabled=false,current=false)=>{const b=document.createElement('button');b.type='button';b.textContent=label;b.disabled=disabled;if(current)b.setAttribute('aria-current','page');else b.setAttribute('aria-label',label==='上一頁'||label==='下一頁'?label:'第 '+n+' 頁');b.addEventListener('click',()=>{page=n;render();list.scrollIntoView({block:'start'});count.setAttribute('tabindex','-1');count.focus({preventScroll:true})});pagination.append(b)};
    if(pages>1){button('上一頁',page-1,page===1);const visible=[...new Set([1,page-1,page,page+1,pages])].filter(n=>n>=1&&n<=pages).sort((a,b)=>a-b);let previous=0;for(const n of visible){if(previous&&n>previous+1){const gap=document.createElement('span');gap.textContent='…';pagination.append(gap)}button(String(n),n,false,n===page);previous=n}button('下一頁',page+1,page===pages)}
    writeURL();
  };
  search.addEventListener('input',()=>{page=1;render()});search.closest('form').addEventListener('submit',e=>{e.preventDefault();page=1;render()});
  document.querySelector('[data-clear-blog-search]').addEventListener('click',()=>{search.value='';page=1;render();search.focus()});
  filters.addEventListener('click',e=>{const b=e.target.closest('[data-filter]');if(b){category=b.dataset.filter;page=1;render()}});
  sort.addEventListener('change',()=>{page=1;render()});document.querySelector('[data-reset-search]').addEventListener('click',()=>{search.value='';category='全部';sort.value='recommended';page=1;render();search.focus()});
  window.addEventListener('popstate',()=>{readURL();render()});readURL();render();
})();
