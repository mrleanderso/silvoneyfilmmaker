'use strict';
(() => {
const $=s=>document.querySelector(s), $$=s=>Array.from(document.querySelectorAll(s));
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const dialog=$('#gallery'), large=$('#large-photo'), thumbs=$('.gallery-thumbs'), photos=$$('.photo-button');let index=0, opener, animation;
if(!dialog||!large||!thumbs||!photos.length)return;
let thumbButtons=[];
function ensureThumbs(){if(thumbButtons.length)return;thumbButtons=photos.map((button,i)=>{const thumb=document.createElement('button'), img=button.querySelector('img').cloneNode();img.alt='';img.src=button.querySelector('img').dataset.thumb||img.src;img.loading='lazy';img.removeAttribute('width');img.removeAttribute('height');thumb.type='button';thumb.setAttribute('aria-label','Ver fotografia '+(i+1)+': '+button.closest('figure').querySelector('figcaption').textContent.trim());thumb.append(img);thumb.addEventListener('click',()=>showPhoto(i));thumbs.append(thumb);return thumb});}
const galleryState=$('#gallery-state'),retry=$('#retry-photo');let loadTimer;
function galleryLoading(){clearTimeout(loadTimer);retry.hidden=true;galleryState.hidden=true;if(!large.complete){loadTimer=setTimeout(()=>{galleryState.textContent='Carregando fotografia…';galleryState.hidden=false},250)}else if(!large.naturalWidth){galleryError()}}
function galleryError(){clearTimeout(loadTimer);galleryState.textContent='Não foi possível carregar esta fotografia. Tente novamente ou veja a próxima.';galleryState.hidden=false;retry.hidden=false}
large.addEventListener('load',()=>{clearTimeout(loadTimer);galleryState.hidden=true;retry.hidden=true});large.addEventListener('error',galleryError);retry.addEventListener('click',()=>{const url=new URL(photos[index].querySelector('img').src,location.href);url.searchParams.set('retry',String(Date.now()));large.src=url.href;galleryLoading()});
function showPhoto(i,motion=true){if(motion)animation?.cancel();index=(i+photos.length)%photos.length;const source=photos[index].querySelector('img');large.src=source.src;large.alt=source.alt;$('#large-caption').textContent=photos[index].closest('figure').querySelector('figcaption span').textContent;$('#photo-count').textContent=`${index+1} / ${photos.length}`;thumbButtons.forEach((b,j)=>b.setAttribute('aria-current',String(index===j)));const active=thumbButtons[index];thumbs.scrollLeft=Math.max(0,active.offsetLeft-thumbs.offsetLeft-(thumbs.clientWidth-active.clientWidth)/2);galleryLoading();if(motion&&!reduced.matches){large.classList.remove('changing');void large.offsetWidth;large.classList.add('changing')}}
function openGallery(i,button){if(dialog.open||!photos[i])return;opener=button;const imgElement=button?.querySelector('img');const start=imgElement?.getBoundingClientRect();ensureThumbs();showPhoto(i,false);dialog.showModal();if(reduced.matches||!large.animate||!start)return;
// FLIP-style scale from the selected photograph to the viewer, inside the top layer.
const end=large.getBoundingClientRect();const img=button.querySelector('img');const ratio=img.naturalWidth/img.naturalHeight;if(!Number.isFinite(ratio)||!ratio)return;let w=Math.min(end.width,end.height*ratio),h=w/ratio;const x=end.left+(end.width-w)/2,y=end.top+(end.height-h)/2;const sx=Math.max(.05,start.width/w),sy=Math.max(.05,start.height/h);const dx=start.left+start.width/2-(x+w/2),dy=start.top+start.height/2-(y+h/2);animation?.cancel();animation=large.animate([{opacity:.35,transform:`translate(${dx}px,${dy}px) scale(${sx},${sy})`},{opacity:1,transform:'none'}],{duration:370,easing:'cubic-bezier(.22,.72,.22,1)'});}
photos.forEach((b,i)=>{
  if(typeof dialog.showModal!=='function')return;
  b.setAttribute('aria-haspopup','dialog');
  b.addEventListener('click',e=>{
    if(e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;
    e.preventDefault();openGallery(i,b);
  });
});
document.addEventListener('sf:open-photo',e=>{
  const i=e.detail?.index;
  if(typeof dialog.showModal!=='function'||!Number.isInteger(i)||!photos[i]||dialog.open)return;
  e.preventDefault();
  openGallery(i,e.detail.opener);
});
$('.close-gallery').addEventListener('click',()=>dialog.close());$('#previous').addEventListener('click',()=>showPhoto(index-1));$('#next').addEventListener('click',()=>showPhoto(index+1));
function backdropClose(d){d.addEventListener('click',e=>{if(e.target!==d)return;const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close()})}backdropClose(dialog);
dialog.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();showPhoto(index+(e.key==='ArrowRight'?1:-1))}});dialog.addEventListener('close',()=>{animation?.cancel();if(opener?.isConnected)opener.focus({preventScroll:true})});
let touchX=0,touchY=0;large.addEventListener('touchstart',e=>{touchX=e.changedTouches[0].clientX;touchY=e.changedTouches[0].clientY},{passive:true});large.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-touchX,dy=e.changedTouches[0].clientY-touchY;if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)*1.5)showPhoto(index+(dx<0?1:-1))},{passive:true});

reduced.addEventListener('change',()=>{if(reduced.matches)animation?.cancel()});
})();
