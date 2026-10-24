(()=>{
  const items=[...document.querySelectorAll('[data-sub]')];
  if(!items.length)return;
  const set=(item,open)=>{item.classList.toggle('open',open);item.querySelector('.sub-toggle').setAttribute('aria-expanded',String(open))};
  const closeAll=except=>items.forEach(i=>{if(i!==except&&i.classList.contains('open'))set(i,false)});
  items.forEach(item=>{
    const btn=item.querySelector('.sub-toggle');
    btn.addEventListener('click',e=>{e.stopPropagation();const open=!item.classList.contains('open');closeAll(item);set(item,open)});
    item.addEventListener('focusout',e=>{if(matchMedia('(min-width: 921px)').matches&&!item.contains(e.relatedTarget))set(item,false)});
  });
  document.addEventListener('click',e=>{if(!e.target.closest('[data-sub]'))closeAll()});
  document.addEventListener('keydown',e=>{if(e.key!=='Escape')return;const open=items.find(i=>i.classList.contains('open'));if(open){set(open,false);open.querySelector('.sub-toggle').focus();e.stopImmediatePropagation()}},true);
})();
