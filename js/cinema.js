'use strict';
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(hover:hover) and (pointer:fine)');
  const hero = document.querySelector('.sf-cinematic-hero');
  if (hero) {
    let frame = 0;
    const reset = () => {
      cancelAnimationFrame(frame);
      hero.style.removeProperty('--cinema-x');
      hero.style.removeProperty('--cinema-y');
    };
    hero.addEventListener('pointermove', e => {
      if (reduced.matches || !fine.matches || e.pointerType==='touch') return;
      const r=hero.getBoundingClientRect();
      if (!r.width || !r.height) return;
      const x=Math.max(-.5,Math.min(.5,(e.clientX-r.left)/r.width-.5));
      const y=Math.max(-.5,Math.min(.5,(e.clientY-r.top)/r.height-.5));
      cancelAnimationFrame(frame);
      frame=requestAnimationFrame(()=>{
        hero.style.setProperty('--cinema-x',x*26+'px');
        hero.style.setProperty('--cinema-y',y*18+'px');
      });
    });
    hero.addEventListener('pointerleave',reset);
    reduced.addEventListener?.('change',reset);
  }
  const chapters=[...document.querySelectorAll('[data-sf-story]')];
  if (chapters.length && 'IntersectionObserver' in window && !reduced.matches) {
    const observer=new IntersectionObserver(items=>{
      items.forEach(({target,isIntersecting})=>{
        if(!isIntersecting)return;
        target.classList.add('sf-story-seen');
        observer.unobserve(target);
      });
    },{threshold:.15});
    chapters.forEach(chapter=>observer.observe(chapter));
    reduced.addEventListener?.('change',()=>{if(reduced.matches)observer.disconnect()});
  }

  const panel=document.querySelector('#sf-depth-panel');
  if(!panel)return;
  const stage=panel.querySelector('.sf-depth-stage');
  const track=panel.querySelector('.sf-depth-photos');
  const prev=panel.querySelector('[data-depth-prev]');
  const next=panel.querySelector('[data-depth-next]');
  const caption=panel.querySelector('#sf-depth-caption');
  const count=panel.querySelector('#sf-depth-count');
  const photos=[...document.querySelectorAll('#galeria .album .photo')].map(fig=>{
    const img=fig.querySelector('img');
    return {src:img?.getAttribute('src'),alt:img?.alt||'',caption:fig.querySelector('figcaption span')?.textContent||''};
  }).filter(p=>p.src);
  if(!photos.length||![stage,track,prev,next,caption,count].every(Boolean))return;
  let index=0, cards=[], start=null;
  function build(){
    if(cards.length)return;
    cards=photos.map((photo,i)=>{
      const card=document.createElement('button');
      card.type='button';
      card.className='sf-depth-card';
      card.setAttribute('aria-label','Selecionar fotografia '+(i+1)+': '+photo.caption);
      const img=document.createElement('img');
      img.src=photo.src;img.alt=photo.alt;img.decoding='async';img.loading='lazy';
      card.append(img);
      card.addEventListener('click',()=>{index=i;render()});
      track.append(card);
      return card;
    });
  }
  function render(){
    cards.forEach((card,i)=>{
      let offset=i-index;
      if(offset>photos.length/2)offset-=photos.length;
      if(offset< -photos.length/2)offset+=photos.length;
      const visible=Math.abs(offset)<=2;
      card.style.setProperty('--offset',offset);
      card.style.setProperty('--distance',Math.abs(offset));
      card.hidden=!visible;
      card.tabIndex=offset===0?0:-1;
      card.setAttribute('aria-current',offset===0?'true':'false');
    });
    caption.textContent=photos[index].caption;
    count.textContent=(index+1)+' / '+photos.length;
  }
  function move(dir){
    index=(index+dir+photos.length)%photos.length;
    render();
  }
  panel.addEventListener('sf:depth-open',()=>{build();render()});
  prev.addEventListener('click',()=>move(-1));
  next.addEventListener('click',()=>move(1));
  panel.addEventListener('keydown',e=>{
    if(e.key==='ArrowLeft'||e.key==='ArrowRight'){
      e.preventDefault();move(e.key==='ArrowLeft'?-1:1);
      if(e.target.classList.contains('sf-depth-card'))cards[index].focus({preventScroll:true});
    }
  });
  stage.addEventListener('touchstart',e=>{
    start=e.touches.length===1?[e.touches[0].clientX,e.touches[0].clientY]:null;
  },{passive:true});
  stage.addEventListener('touchcancel',()=>{start=null},{passive:true});
  stage.addEventListener('touchend',e=>{
    if(!start)return;
    const dx=e.changedTouches[0].clientX-start[0],dy=e.changedTouches[0].clientY-start[1];start=null;
    if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.5)move(dx<0?1:-1);
  },{passive:true});
  panel.dataset.ready='true';
})();
