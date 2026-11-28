'use strict';
(() => {
  const view = document.querySelector('#im-viewport');
  const toolbar = document.querySelector('.im-toolbar');
  const stops = [...document.querySelectorAll('[data-room]')];
  const mode = document.querySelector('.im-mode');
  const help = document.querySelector('#im-help');
  const status = document.querySelector('.im-status');
  const count = document.querySelector('#im-count');
  const title = document.querySelector('#im-title');
  const walls = [...document.querySelectorAll('.im-world > .im-wall')];
  const header = document.querySelector('.im-header');
  const intro = document.querySelector('.im-intro');
  const dock = document.querySelector('.im-dock');
  const names = ['O encontro','Os detalhes','A família','Seu registro'];
  if (![view,toolbar,mode,help,status,count,title,header,intro,dock].every(Boolean) || walls.length!==4 || stops.length!==4) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const supported = typeof CSS !== 'undefined' && CSS.supports('transform-style','preserve-3d') && CSS.supports('perspective','600px');
  let current=0, angle=0, active=false, drag=null, suppressUntil=0, resizeFrame=0;
  const mod=(n,m)=>((n%m)+m)%m;
  function measure() {
    if (!active) return;
    const w=view.clientWidth,h=view.clientHeight;
    if (!w||!h) return;
    const top=Math.max(header.getBoundingClientRect().bottom,intro.getBoundingClientRect().bottom);
    const bottom=dock.getBoundingClientRect().top;
    const available=bottom-top;
    if(available<145){setMode(false);return;}
    const depth=600,lens=Math.min(w*.48,available*.88), scale=depth/lens;
    const values={
      '--lens':lens+'px', '--scene-center':((top+bottom)/2)+'px',
      '--wall-height':(available*1.06*scale)+'px',
      '--art-width':Math.min(1080,w*.88*scale)+'px',
      '--room-title':(Math.min(62,Math.max(24,w*.046),available*.15)*scale)+'px',
      '--room-text':(Math.min(17,Math.max(12,w*.031),available*.062)*scale)+'px',
      '--room-gap':(Math.min(17,available*.045)*scale)+'px',
      '--room-button':(44*scale)+'px'
    };
    for(const [key,value] of Object.entries(values))view.style.setProperty(key,value);
  }
  function rotate(value) {
    angle=value;
    view.style.setProperty('--angle',-angle+'deg');
  }
  function select(i,nearest=true) {
    if (!active || !Number.isInteger(i) || i<0 || i>=walls.length) return;
    if(walls.some((wall,n)=>n!==i&&wall.contains(document.activeElement)))stops[i].focus({preventScroll:true});
    current=i;
    const delta=mod(i*90-angle+180,360)-180;
    rotate(nearest?angle+delta:i*90);
    stops.forEach((b,n)=>b.setAttribute('aria-pressed',String(n===i)));
    walls.forEach((wall,n)=>{
      wall.inert=n!==i;
      if(n!==i)wall.setAttribute('aria-hidden','true');else wall.removeAttribute('aria-hidden');
      wall.querySelectorAll('img').forEach(img=>{if(n===i)img.loading='eager'});
    });
    count.textContent='0'+(i+1)+' / 04';
    title.textContent=names[i];
  }
  function setMode(next) {
    active=next&&supported;
    drag=null;
    view.classList.remove('is-dragging');
    document.body.classList.toggle('im-immersive',active);
    view.dataset.mode=active?'3d':'flat';
    mode.textContent=active?'Vista plana':'Entrar em 3D';
    mode.setAttribute('aria-pressed',String(active));
    toolbar.hidden=!active;
    help.hidden=!active;
    status.hidden=!active;
    view.tabIndex=active?0:-1;
    if(active){window.scrollTo(0,0);select(current,false);measure();}
    else walls.forEach(w=>{w.inert=false;w.removeAttribute('aria-hidden')});
  }
  if (supported) {
    mode.hidden=false;
    setMode(!reduced.matches);
    mode.addEventListener('click',()=>setMode(!active));
    stops.forEach((b,i)=>b.addEventListener('click',()=>select(i)));
    view.addEventListener('keydown',e=>{
      if(!active||e.target!==view)return;
      if(e.key==='ArrowLeft'||e.key==='ArrowRight'||e.key==='Home'||e.key==='End'){
        e.preventDefault();
        select(e.key==='Home'?0:e.key==='End'?3:mod(current+(e.key==='ArrowRight'?1:-1),4));
      }
    });
    view.addEventListener('dragstart',e=>{if(active)e.preventDefault()});
    view.addEventListener('pointerdown',e=>{
      if(!active||!e.isPrimary||e.button!==0)return;
      suppressUntil=0;
      drag={id:e.pointerId,x:e.clientX,y:e.clientY,angle,moved:false};
    });
    view.addEventListener('pointermove',e=>{
      if(!drag||drag.id!==e.pointerId)return;
      const dx=e.clientX-drag.x,dy=e.clientY-drag.y;
      if(!drag.moved){
        if(Math.abs(dy)>12&&Math.abs(dy)>Math.abs(dx)){drag=null;return}
        if(Math.abs(dx)<10)return;
        drag.moved=true;
        view.classList.add('is-dragging');
        view.setPointerCapture?.(e.pointerId);
      }
      rotate(drag.angle-dx*180/Math.max(1,view.clientWidth));
    });
    function endDrag(e){
      if(!drag||drag.id!==e.pointerId)return;
      const moved=drag.moved;drag=null;
      view.classList.remove('is-dragging');
      if(view.hasPointerCapture?.(e.pointerId))view.releasePointerCapture(e.pointerId);
      if(moved){suppressUntil=Date.now()+400;select(mod(Math.round(angle/90),4))}
    }
    view.addEventListener('pointerup',endDrag);
    view.addEventListener('pointercancel',endDrag);
    view.addEventListener('lostpointercapture',endDrag);
    view.addEventListener('pointerleave',()=>{if(drag&&!drag.moved)drag=null});
    view.addEventListener('click',e=>{if(Date.now()<suppressUntil){e.preventDefault();e.stopImmediatePropagation()}},true);
    function scheduleMeasure(){cancelAnimationFrame(resizeFrame);resizeFrame=requestAnimationFrame(measure)}
    if('ResizeObserver' in window){const ro=new ResizeObserver(scheduleMeasure);[view,header,intro,dock].forEach(el=>ro.observe(el));}
    addEventListener('resize',scheduleMeasure);
    reduced.addEventListener?.('change',()=>{if(reduced.matches)setMode(false)});
  }
  const dialog=document.querySelector('.im-dialog');
  const large=dialog?.querySelector('.im-large');
  const caption=dialog?.querySelector('.im-dialog-caption');
  const close=dialog?.querySelector('.im-close');
  let opener=null;
  large?.addEventListener('load',()=>{if(opener)caption.textContent=opener.querySelector('img').alt});
  view.querySelectorAll('.im-photo').forEach(link=>{
    link.addEventListener('click',e=>{
      if(e.ctrlKey||e.metaKey||e.shiftKey||e.altKey||!dialog||!large||!caption||!close||dialog.open||typeof dialog.showModal!=='function')return;
      e.preventDefault();
      opener=link;
      const img=link.querySelector('img');
      large.src=link.href;
      large.alt=img.alt;
      caption.textContent=img.alt;
      dialog.showModal();
    });
  });
  if(dialog&&close){
    close.addEventListener('click',()=>dialog.close());
    large?.addEventListener('error',()=>{caption.textContent='Não foi possível carregar esta imagem. Feche e tente novamente.'});
    dialog.addEventListener('close',()=>opener?.focus({preventScroll:true}));
  }
})();
