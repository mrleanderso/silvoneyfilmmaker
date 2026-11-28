'use strict';
(()=>{const reduced=matchMedia('(prefers-reduced-motion: reduce)');const header=document.querySelector('.shell-header');const root=document.documentElement;
if(header){const bar=document.createElement('div');bar.className='sf-read-progress';bar.setAttribute('aria-hidden','true');bar.innerHTML='<i></i>';header.append(bar);let queued=false;const update=()=>{queued=false;const max=root.scrollHeight-innerHeight;bar.style.setProperty('--sf-read',String(max>0?Math.max(0,Math.min(1,scrollY/max)):0));header.classList.toggle('sf-header-scrolled',scrollY>12)};const schedule=()=>{if(!queued){queued=true;requestAnimationFrame(update)}};addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);addEventListener('pageshow',schedule);update();}
const candidates=[...document.querySelectorAll('[data-reveal],.home-page .category,.home-page .about figure,.editorial-page .editorial-intro figure,.editorial-page .editorial-story img')];
let observer;
function motion(){
  observer?.disconnect();
  if(reduced.matches||!('IntersectionObserver'in window))return;
  observer=new IntersectionObserver(entries=>entries.forEach(({target,isIntersecting})=>{
    if(!isIntersecting)return;target.classList.add('sf-revealed');observer.unobserve(target);
  }),{threshold:.08});
  candidates.forEach(el=>{if(el.getBoundingClientRect().top>innerHeight+30)observer.observe(el)});
}
motion();reduced.addEventListener?.('change',motion);
})();


/* The floating contact is useful only when an inline WhatsApp action is not in view. */
;(()=>{
  const floating=document.querySelector('.sf-whatsapp-float');
  if(!floating||!('IntersectionObserver'in window))return;
  const actions=[...document.querySelectorAll('a[href*="wa.me/"]')].filter(a=>a!==floating&&!a.closest('dialog'));
  const visible=new Set();
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(({target,isIntersecting,intersectionRatio})=>{
      if(isIntersecting&&intersectionRatio>=.9)visible.add(target);else visible.delete(target);
    });
    floating.dataset.sfSuppressed=String(visible.size>0);
  },{threshold:[0,.9,1]});
  actions.forEach(a=>observer.observe(a));
})();
