'use strict';
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const book = document.querySelector('.sf-book-experience');
  if (!book) return;
  const q = s => book.querySelector(s);
  const photos = [...document.querySelectorAll('#galeria .album .photo')].map(fig => {
    const img = fig.querySelector('img');
    return {src:img?.getAttribute('src'),alt:img?.alt || '',caption:fig.querySelector('figcaption span')?.textContent || ''};
  }).filter(photo => photo.src);
  const toggle=document.querySelector('.sf-book-toggle'), galleryToggle=document.querySelector('.sf-gallery-toggle');
  const switcher=document.querySelector('.birth-view-switch'), gallery=document.querySelector('#sf-gallery-panel');
  const help=document.querySelector('#birth-gallery-help');
  const panel=q('#sf-book-panel'), stage=q('.sf-book-stage');
  const leaf=q('.sf-book-right'), img=q('#sf-book-image'), caption=q('#sf-book-caption');
  const count=q('#sf-book-count'), number=q('.sf-book-number'), prev=q('[data-book-prev]'), next=q('[data-book-next]');
  const err=q('#sf-book-error');
  if (!photos.length || ![toggle,galleryToggle,switcher,gallery,panel,stage,leaf,img,caption,count,number,prev,next].every(Boolean)) return;
  let index=0, busy=false, changeTimer=0, endTimer=0, start=null;
  function render() {
    const photo=photos[index];
    if (img.getAttribute('src') !== photo.src) {
      if (err) err.hidden=true;
      img.hidden=false;
      img.src=photo.src;
    }
    img.alt=photo.alt;
    caption.textContent=photo.caption;
    number.textContent=String(index+1).padStart(2,'0');
    count.textContent=(index+1)+' / '+photos.length;
    prev.disabled=index===0;
    next.disabled=index===photos.length-1;
  }
  function finish() {
    clearTimeout(changeTimer);
    clearTimeout(endTimer);
    stage.removeAttribute('data-turn');
    busy=false;
    render();
  }
  function move(dir) {
    if (busy || index+dir<0 || index+dir>=photos.length) return;
    index+=dir;
    if (reduced.matches) { render(); return; }
    busy=true;
    stage.dataset.turn=dir>0?'next':'prev';
    changeTimer=setTimeout(render,240);
    endTimer=setTimeout(finish,750);
  }
  leaf.addEventListener('animationend', e => {
    if (busy && e.target===leaf) finish();
  });
  function setMode(isBook) {
    if (!isBook && busy) finish();
    toggle.setAttribute('aria-pressed',String(isBook));
    galleryToggle.setAttribute('aria-pressed',String(!isBook));
    gallery.hidden=isBook;
    book.hidden=!isBook;
    panel.hidden=!isBook;
    if(help) help.textContent=isBook?'Use as setas ou deslize para folhear as seis fotografias.':'Toque nas fotografias para ampliar.';
    if(isBook) render();
  }
  toggle.addEventListener('click',()=>setMode(true));
  galleryToggle.addEventListener('click',()=>setMode(false));
  prev.addEventListener('click',()=>move(-1));
  next.addEventListener('click',()=>move(1));
  panel.addEventListener('keydown', e => {
    if (e.key==='ArrowLeft'||e.key==='ArrowRight') {
      e.preventDefault();move(e.key==='ArrowLeft'?-1:1);
    }
  });
  stage.addEventListener('touchstart', e => {
    start=e.touches.length===1?[e.touches[0].clientX,e.touches[0].clientY]:null;
  },{passive:true});
  stage.addEventListener('touchcancel',()=>{start=null},{passive:true});
  stage.addEventListener('touchend', e => {
    if (!start) return;
    const x=e.changedTouches[0].clientX-start[0], y=e.changedTouches[0].clientY-start[1];
    start=null;
    if (Math.abs(x)>45 && Math.abs(x)>Math.abs(y)*1.5) move(x<0?1:-1);
  },{passive:true});
  reduced.addEventListener?.('change',()=>{if(busy)finish()});
  img.addEventListener('error',()=>{if(err){err.hidden=false;img.hidden=true}});
  img.addEventListener('load',()=>{if(err)err.hidden=true;img.hidden=false});
  switcher.hidden=false;
  setMode(false);
})();
