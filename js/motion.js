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
;(()=>{const reduced=matchMedia('(prefers-reduced-motion: reduce)'),fine=matchMedia('(hover:hover) and (pointer:fine)');
const hero=document.querySelector('[data-sf-depth-hero]'),preview=document.querySelector('[data-sf-depth]');function bind(el,area,heroMode){if(!el||!area)return;let frame=0;const reset=()=>{cancelAnimationFrame(frame);for(const key of ['--sf-rx','--sf-ry','--sf-x','--sf-y'])el.style.removeProperty(key)};area.addEventListener('pointermove',e=>{if(reduced.matches||!fine.matches||e.pointerType==='touch')return;const r=area.getBoundingClientRect();if(!r.width||!r.height)return;const x=Math.max(-.5,Math.min(.5,(e.clientX-r.left)/r.width-.5)),y=Math.max(-.5,Math.min(.5,(e.clientY-r.top)/r.height-.5));cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{if(heroMode){el.style.setProperty('--sf-x',x*8+'px');el.style.setProperty('--sf-y',y*6+'px')}else{el.style.setProperty('--sf-rx',-y*5+'deg');el.style.setProperty('--sf-ry',x*7+'deg')}})});area.addEventListener('pointerleave',reset);reduced.addEventListener?.('change',reset)}const birth=document.querySelector('.birth-page .cinema-photo.hero-art');bind(hero,hero?.closest('.hero'),true);bind(birth,birth?.closest('.cinema-hero'),true);bind(preview,preview,false);
})();
