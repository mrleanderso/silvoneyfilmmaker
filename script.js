'use strict';
const $=s=>document.querySelector(s), $$=s=>Array.from(document.querySelectorAll(s));
document.documentElement.classList.add('js');
const header=$('.site-header'), menu=$('.menu-toggle'), nav=$('#navigation');
const mobile=matchMedia('(max-width:820px)'), reduced=matchMedia('(prefers-reduced-motion:reduce)');
function setMenu(open){nav.inert=mobile.matches&&!open;menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open);if(typeof scheduleScroll==='function')requestAnimationFrame(updateScroll);menu.querySelector('span').textContent=open?'Fechar':'Menu';}
menu.addEventListener('click',()=>setMenu(menu.getAttribute('aria-expanded')!=='true'));
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
setMenu(false);
header.addEventListener('focusout',e=>{if(e.relatedTarget&&!header.contains(e.relatedTarget))setMenu(false)});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.getAttribute('aria-expanded')==='true'){setMenu(false);menu.focus()}});
document.addEventListener('click',e=>{if(!header.contains(e.target))setMenu(false)});
mobile.addEventListener('change',()=>{setMenu(false);updateScroll()});

const sections=$$('main section[id]'), navLinks=$$('#navigation a[href^="#"]');
let queued=false;
function updateScroll(){queued=false;const y=window.scrollY;header.classList.toggle('scrolled',header.classList.contains('scrolled')?y>16:y>55);const full=document.documentElement.scrollHeight-innerHeight;header.style.setProperty('--read',String(full>0?Math.min(1,y/full):0));let current='';for(const section of sections)if(section.getBoundingClientRect().top<145)current=section.id;for(const a of navLinks){if(a.hash==='#'+current)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current')}
}
function scheduleScroll(){if(!queued){queued=true;requestAnimationFrame(updateScroll)}}
addEventListener('scroll',scheduleScroll,{passive:true});addEventListener('resize',scheduleScroll);updateScroll();
document.addEventListener('focusin',scheduleScroll);document.addEventListener('focusout',scheduleScroll);
// Reveals are progressive enhancement; no JS and reduced motion retain the complete page.
let observer;function setupMotion(){observer?.disconnect();$$('[data-reveal]').forEach(e=>e.classList.remove('awaiting'));document.body.classList.toggle('motion-ready',!reduced.matches);if(reduced.matches||!('IntersectionObserver'in window))return;observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.remove('awaiting');observer.unobserve(entry.target)}}),{threshold:.06,rootMargin:'0px 0px 40px 0px'});$$('[data-reveal]').forEach(e=>{if(e.getBoundingClientRect().top>innerHeight+40){e.classList.add('awaiting');observer.observe(e)}})}
setupMotion();reduced.addEventListener('change',()=>{setupMotion();if(reduced.matches)animation?.cancel()});
const dialog=$('#gallery'), large=$('#large-photo'), thumbs=$('.gallery-thumbs'), photos=$$('.photo-button');let index=0, opener, animation;
const thumbButtons=photos.map((button,i)=>{const thumb=document.createElement('button'), img=button.querySelector('img').cloneNode();img.alt='';img.src=button.querySelector('img').dataset.thumb||img.src;img.loading='lazy';img.removeAttribute('width');img.removeAttribute('height');thumb.type='button';thumb.setAttribute('aria-label','Ver fotografia '+(i+1)+': '+button.closest('figure').querySelector('figcaption').textContent.trim());thumb.append(img);thumb.addEventListener('click',()=>showPhoto(i));thumbs.append(thumb);return thumb});
const galleryState=$('#gallery-state'),retry=$('#retry-photo');let loadTimer;
function galleryLoading(){clearTimeout(loadTimer);retry.hidden=true;galleryState.hidden=true;if(!large.complete){loadTimer=setTimeout(()=>{galleryState.textContent='Carregando fotografia…';galleryState.hidden=false},250)}else if(!large.naturalWidth){galleryError()}}
function galleryError(){clearTimeout(loadTimer);galleryState.textContent='Não foi possível carregar esta fotografia. Tente novamente ou veja a próxima.';galleryState.hidden=false;retry.hidden=false}
large.addEventListener('load',()=>{clearTimeout(loadTimer);galleryState.hidden=true;retry.hidden=true});large.addEventListener('error',galleryError);retry.addEventListener('click',()=>{large.src=photos[index].querySelector('img').src;galleryLoading();$('#next').focus()});
function showPhoto(i,motion=true){if(motion)animation?.cancel();index=(i+photos.length)%photos.length;const source=photos[index].querySelector('img');large.src=source.src;large.alt=source.alt;$('#large-caption').textContent=photos[index].closest('figure').querySelector('figcaption span').textContent;$('#photo-count').textContent=`${index+1} / ${photos.length}`;thumbButtons.forEach((b,j)=>b.setAttribute('aria-current',String(index===j)));const active=thumbButtons[index];thumbs.scrollLeft=Math.max(0,active.offsetLeft-thumbs.offsetLeft-(thumbs.clientWidth-active.clientWidth)/2);galleryLoading();if(motion&&!reduced.matches){large.classList.remove('changing');void large.offsetWidth;large.classList.add('changing')}}
function openGallery(i,button){opener=button;const start=button.querySelector('img').getBoundingClientRect();showPhoto(i,false);dialog.showModal();updateScroll();if(reduced.matches||!large.animate)return;
// FLIP-style scale from the selected photograph to the viewer, inside the top layer.
const end=large.getBoundingClientRect();const img=button.querySelector('img');const ratio=img.naturalWidth/img.naturalHeight;if(!Number.isFinite(ratio)||!ratio)return;let w=Math.min(end.width,end.height*ratio),h=w/ratio;const x=end.left+(end.width-w)/2,y=end.top+(end.height-h)/2;const sx=Math.max(.05,start.width/w),sy=Math.max(.05,start.height/h);const dx=start.left+start.width/2-(x+w/2),dy=start.top+start.height/2-(y+h/2);animation?.cancel();animation=large.animate([{opacity:.35,transform:`translate(${dx}px,${dy}px) scale(${sx},${sy})`},{opacity:1,transform:'none'}],{duration:370,easing:'cubic-bezier(.22,.72,.22,1)'});}
photos.forEach((b,i)=>b.addEventListener('click',e=>{if(typeof dialog.showModal!=='function')return;e.preventDefault();openGallery(i,b)}));
$('.close-gallery').addEventListener('click',()=>dialog.close());$('#previous').addEventListener('click',()=>showPhoto(index-1));$('#next').addEventListener('click',()=>showPhoto(index+1));
function backdropClose(d){d.addEventListener('click',e=>{if(e.target!==d)return;const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close()})}backdropClose(dialog);
dialog.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();showPhoto(index+(e.key==='ArrowRight'?1:-1))}});dialog.addEventListener('close',()=>{animation?.cancel();opener?.focus({preventScroll:true});scheduleScroll()});
let touchX=0,touchY=0;large.addEventListener('touchstart',e=>{touchX=e.changedTouches[0].clientX;touchY=e.changedTouches[0].clientY},{passive:true});large.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-touchX,dy=e.changedTouches[0].clientY-touchY;if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)*1.5)showPhoto(index+(dx<0?1:-1))},{passive:true});
// Anchor navigation: focus the destination heading so keyboard and screen-reader users retain context.
$$('a[href^="#"]').forEach(a=>a.addEventListener('click',()=>{const target=document.getElementById(a.hash.slice(1));if(!target)return;const focus=target.matches('main')?target:target.querySelector('h2[tabindex]')||target;requestAnimationFrame(()=>{focus.focus({preventScroll:true});if(a.classList.contains('skip'))target.scrollIntoView({block:'start',behavior:'instant'});scheduleScroll()})}));
// If JavaScript is unavailable, static photographs remain visible and the direct contact link remains usable.
// Restrained, optional depth on pointer devices; no scroll listener changes layout.
const heroArt=$('.hero-art'), fine=matchMedia('(hover:hover) and (pointer:fine)');let depthFrame=0;heroArt.addEventListener('pointermove',e=>{if(reduced.matches||!fine.matches)return;const r=heroArt.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;cancelAnimationFrame(depthFrame);depthFrame=requestAnimationFrame(()=>{heroArt.style.setProperty('--dx',`${x*8}px`);heroArt.style.setProperty('--dy',`${y*6}px`);});});heroArt.addEventListener('pointerleave',()=>{cancelAnimationFrame(depthFrame);heroArt.style.setProperty('--dx','0px');heroArt.style.setProperty('--dy','0px')});reduced.addEventListener('change',()=>{heroArt.style.removeProperty('--dx');heroArt.style.removeProperty('--dy')});
