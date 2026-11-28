'use strict';
(() => {
  const q = s => document.querySelector(s);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const dialog = q('#gallery');
  const large = q('#large-photo');
  const thumbs = q('.gallery-thumbs');
  const photos = [...document.querySelectorAll('.photo-button')];
  const state = q('#gallery-state');
  const retry = q('#retry-photo');
  const caption = q('#large-caption');
  const count = q('#photo-count');
  const close = q('.close-gallery');
  const previous = q('#previous');
  const next = q('#next');
  if (!photos.length || ![dialog,large,thumbs,state,retry,caption,count,close,previous,next].every(Boolean)) return;
  if (typeof dialog.showModal !== 'function') return;

  let index = 0, opener, animation, loadTimer, start = null;
  let thumbButtons = [];
  function ensureThumbs() {
    if (thumbButtons.length) return;
    thumbButtons = photos.map((photo,i) => {
      const button = document.createElement('button');
      const source = photo.querySelector('img');
      const img = document.createElement('img');
      img.src = source.dataset.thumb || source.src;
      img.alt = ''; img.loading = 'lazy'; img.decoding = 'async';
      button.type = 'button';
      button.setAttribute('aria-label','Ver fotografia '+(i+1)+': '+photo.closest('figure').querySelector('figcaption').textContent.trim());
      button.append(img);
      button.addEventListener('click',()=>showPhoto(i));
      thumbs.append(button);
      return button;
    });
  }
  function error() {
    clearTimeout(loadTimer);
    state.textContent = 'Não foi possível carregar esta fotografia. Tente novamente ou veja a próxima.';
    state.hidden = false; retry.hidden = false;
  }
  function loading() {
    clearTimeout(loadTimer); retry.hidden = true; state.hidden = true;
    if (!large.complete) {
      loadTimer = setTimeout(()=>{state.textContent='Carregando fotografia…';state.hidden=false},250);
    } else if (!large.naturalWidth) error();
  }
  large.addEventListener('load',()=>{clearTimeout(loadTimer);state.hidden=true;retry.hidden=true});
  large.addEventListener('error',error);
  retry.addEventListener('click',()=>{
    const url = new URL(photos[index].querySelector('img').src,location.href);
    url.searchParams.set('retry',String(Date.now())); large.src=url.href; loading();
  });
  function showPhoto(i,motion=true) {
    if (motion) animation?.cancel();
    index=(i+photos.length)%photos.length;
    const source=photos[index].querySelector('img');
    if (large.src!==source.src) large.src=source.src;
    large.alt=source.alt;
    caption.textContent=photos[index].closest('figure').querySelector('figcaption span').textContent;
    count.textContent=(index+1)+' / '+photos.length;
    thumbButtons.forEach((button,j)=>button.setAttribute('aria-current',String(index===j)));
    const active=thumbButtons[index];
    if (active) {
      const a=active.getBoundingClientRect(), t=thumbs.getBoundingClientRect();
      thumbs.scrollLeft=Math.max(0,thumbs.scrollLeft+a.left-t.left-(t.width-a.width)/2);
    }
    loading();
    if (motion&&!reduced.matches) {
      large.classList.remove('changing'); void large.offsetWidth; large.classList.add('changing');
    }
  }
  function openGallery(i,element) {
    if (dialog.open||!photos[i]) return;
    opener=element;
    const source=element?.querySelector('img');
    const start=source?.getBoundingClientRect();
    ensureThumbs();
    dialog.showModal(); showPhoto(i,false);
    if (reduced.matches||!large.animate||!start) return;
    const end=large.getBoundingClientRect(), ratio=source.naturalWidth/source.naturalHeight;
    if (!Number.isFinite(ratio)||!ratio||!end.width||!end.height) return;
    const w=Math.min(end.width,end.height*ratio), h=w/ratio;
    const dx=start.left+start.width/2-end.left-end.width/2, dy=start.top+start.height/2-end.top-end.height/2;
    animation?.cancel();
    animation=large.animate([{opacity:.35,transform:`translate(${dx}px,${dy}px) scale(${Math.max(.05,start.width/w)},${Math.max(.05,start.height/h)})`},{opacity:1,transform:'none'}],{duration:370,easing:'cubic-bezier(.22,.72,.22,1)'});
  }
  photos.forEach((photo,i)=>{
    photo.setAttribute('aria-haspopup','dialog');
    photo.addEventListener('click',e=>{
      if (e.ctrlKey||e.metaKey||e.shiftKey||e.altKey) return;
      e.preventDefault();openGallery(i,photo);
    });
  });
  document.addEventListener('sf:open-photo',e=>{
    const i=e.detail?.index;
    if (!Number.isInteger(i)||!photos[i]||dialog.open) return;
    e.preventDefault();openGallery(i,e.detail.opener);
  });
  close.addEventListener('click',()=>dialog.close());
  previous.addEventListener('click',()=>showPhoto(index-1));
  next.addEventListener('click',()=>showPhoto(index+1));
  dialog.addEventListener('click',e=>{
    if (e.target!==dialog) return;
    const r=dialog.getBoundingClientRect();
    if (e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom) dialog.close();
  });
  dialog.addEventListener('keydown',e=>{
    if (e.key==='ArrowRight'||e.key==='ArrowLeft') {e.preventDefault();showPhoto(index+(e.key==='ArrowRight'?1:-1))}
  });
  dialog.addEventListener('close',()=>{animation?.cancel();clearTimeout(loadTimer);if(opener?.isConnected)opener.focus({preventScroll:true})});
  large.addEventListener('touchstart',e=>{start=e.touches.length===1?[e.touches[0].clientX,e.touches[0].clientY]:null},{passive:true});
  large.addEventListener('touchcancel',()=>{start=null},{passive:true});
  large.addEventListener('touchend',e=>{
    if (!start) return;
    const dx=e.changedTouches[0].clientX-start[0],dy=e.changedTouches[0].clientY-start[1];start=null;
    if (Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)*1.5) showPhoto(index+(dx<0?1:-1));
  },{passive:true});
  reduced.addEventListener?.('change',()=>{if(reduced.matches)animation?.cancel()});
})();
