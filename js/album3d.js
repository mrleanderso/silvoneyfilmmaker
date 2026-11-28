'use strict';
(() => {
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const book=document.querySelector('.sf-book-experience');
  if(!book)return;
  const q=s=>book.querySelector(s);
  const photos=[...document.querySelectorAll('#galeria .album .photo')].map(fig=>{
    const img=fig.querySelector('img');
    return {src:img?.getAttribute('src'),alt:img?.alt||'',caption:fig.querySelector('figcaption span')?.textContent||''};
  }).filter(p=>p.src);
  const toggle=document.querySelector('.sf-book-toggle'), galleryToggle=document.querySelector('.sf-gallery-toggle');
  const depthToggle=document.querySelector('.sf-depth-toggle'), depth=document.querySelector('#sf-depth-panel');
  const switcher=document.querySelector('.birth-view-switch'), gallery=document.querySelector('#sf-gallery-panel');
  const help=document.querySelector('#birth-gallery-help');
  const panel=q('#sf-book-panel'),stage=q('.sf-book-stage'),leaf=q('.sf-book-leaf'),cover=q('.sf-book-cover');
  const leafImage=leaf?.querySelector('img'),leafText=leaf?.querySelector('p');
  const img=q('#sf-book-image'),caption=q('#sf-book-caption'),count=q('#sf-book-count'),number=q('.sf-book-number');
  const prev=q('[data-book-prev]'),next=q('[data-book-next]'),expand=q('[data-book-expand]'),err=q('#sf-book-error');
  if(!photos.length||![toggle,galleryToggle,switcher,gallery,panel,stage,leaf,cover,leafImage,leafText,img,caption,count,number,prev,next,expand].every(Boolean))return;
  let index=0,busy=false,first=true,animationTimer=0,start=null,mode=null;
  const cached=new Map();
  function preload(){
    if(typeof Image!=='function')return;
    for(const i of [index-1,index+1])if(photos[i]&&!cached.has(i)){
      const image=new Image();image.decoding='async';image.src=photos[i].src;cached.set(i,image);
    }
  }
  function render(){
    const photo=photos[index];
    if(img.getAttribute('src')!==photo.src){
      if(err)err.hidden=true;
      img.hidden=false;img.src=photo.src;
    }
    img.alt=photo.alt;
    caption.textContent=photo.caption;
    number.textContent=String(index+1).padStart(2,'0');
    count.textContent=(index+1)+' / '+photos.length;
    prev.setAttribute('aria-disabled',String(busy||index===0));next.setAttribute('aria-disabled',String(busy||index===photos.length-1));
    expand.href=photo.src;expand.setAttribute('aria-disabled',String(busy));
    if(mode==='book')preload();
  }
  function finish(){
    clearTimeout(animationTimer);
    stage.removeAttribute('data-turn');stage.removeAttribute('data-opening');
    leaf.hidden=true;cover.hidden=true;busy=false;render();
  }
  function move(dir){
    const target=index+dir;
    if(busy||target<0||target>=photos.length)return;
    if(reduced.matches){index=target;render();return}
    leafImage.src=photos[dir>0?index:target].src;
    leafText.textContent=photos[dir>0?target:index].caption;
    index=target;busy=true;render();
    leaf.hidden=false;stage.dataset.turn=dir>0?'next':'prev';
    animationTimer=setTimeout(finish,1000);
  }
  leaf.addEventListener('animationend',e=>{if(e.target===leaf&&busy)finish()});
  cover.addEventListener('animationend',e=>{if(e.target===cover&&busy)finish()});
  function setMode(value){
    if(mode===value)return;
    if(busy)finish();
    mode=value;
    toggle.setAttribute('aria-pressed',String(value==='book'));
    galleryToggle.setAttribute('aria-pressed',String(value==='gallery'));
    depthToggle?.setAttribute('aria-pressed',String(value==='depth'));
    gallery.hidden=value!=='gallery';book.hidden=value!=='book';panel.hidden=value!=='book';
    if(depth)depth.hidden=value!=='depth';
    if(help)help.textContent=value==='book'?'Folheie seis fotografias do portfólio.':value==='depth'?'Explore seis fotografias em perspectiva.':'Toque nas fotografias para ampliar.';
    if(value==='depth')depth?.dispatchEvent(new Event('sf:depth-open'));
    if(value==='book'){
      render();
      if(first&&!reduced.matches){
        first=false;busy=true;render();cover.hidden=false;stage.dataset.opening='true';
        animationTimer=setTimeout(finish,1000);
      }else first=false;
    }
  }
  toggle.addEventListener('click',()=>setMode('book'));
  galleryToggle.addEventListener('click',()=>setMode('gallery'));
  if(depthToggle&&depth){
    const ready=()=>{depthToggle.hidden=depth.dataset.ready!=='true'};
    depthToggle.addEventListener('click',()=>{if(depth.dataset.ready==='true')setMode('depth')});
    document.addEventListener('DOMContentLoaded',ready);ready();
  }
  prev.addEventListener('click',()=>move(-1));
  next.addEventListener('click',()=>move(1));
  expand.addEventListener('click',e=>{
    if(busy){e.preventDefault();return}
    if(e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;
    const event=new CustomEvent('sf:open-photo',{cancelable:true,detail:{index,opener:expand}});
    if(!document.dispatchEvent(event))e.preventDefault();
  });
  panel.addEventListener('keydown',e=>{
    if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();move(e.key==='ArrowLeft'?-1:1)}
  });
  stage.addEventListener('touchstart',e=>{start=e.touches.length===1?[e.touches[0].clientX,e.touches[0].clientY]:null},{passive:true});
  stage.addEventListener('touchcancel',()=>{start=null},{passive:true});
  stage.addEventListener('touchend',e=>{
    if(!start)return;const x=e.changedTouches[0].clientX-start[0],y=e.changedTouches[0].clientY-start[1];start=null;
    if(Math.abs(x)>45&&Math.abs(x)>Math.abs(y)*1.5)move(x<0?1:-1);
  },{passive:true});
  reduced.addEventListener?.('change',()=>{if(busy)finish()});
  img.addEventListener('error',()=>{if(err){err.hidden=false;img.hidden=true}});
  img.addEventListener('load',()=>{if(err)err.hidden=true;img.hidden=false});
  switcher.hidden=false;setMode('gallery');
})();
