'use strict';
(() => {
  const view = document.querySelector('#im-viewport');
  const toolbar = document.querySelector('.im-toolbar');
  const stops = [...document.querySelectorAll('[data-room]')];
  const mode = document.querySelector('.im-mode');
  const help = document.querySelector('#im-help');
  const status = document.querySelector('.im-status');
  const walls = [...document.querySelectorAll('article.im-wall')];
  const names = ['O encontro','Os detalhes','A família'];
  if (!view || !toolbar || !mode || !help || !status || walls.length!==3 || stops.length!==3) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const supported = CSS.supports('transform-style','preserve-3d') && CSS.supports('perspective','600px');
  let current=0, angle=0, active=false, drag=null, suppressUntil=0;
  const mobile = matchMedia('(max-width:680px)');
  function measure() {
    if (!active) return;
    const w=view.clientWidth,h=view.clientHeight;
    if (!w||!h) return;
    const lens=Math.min(w*.68,h*.86), depth=600;
    view.style.setProperty('--lens',lens+'px');
    view.style.setProperty('--wall-height',Math.min(1600,h*.86*depth/lens)+'px');
    view.style.setProperty('--art-width',Math.min(1000,w*.81*depth/lens)+'px');
  }
  function rotate(value) {
    angle=Math.max(0,Math.min(180,value));
    view.style.setProperty('--angle',-angle+'deg');
  }
  function select(i) {
    if (!active || !Number.isInteger(i) || i<0 || i>=walls.length) return;
    current=i;
    rotate(i*90);
    stops.forEach((b,n)=>b.setAttribute('aria-pressed',String(n===i)));
    walls.forEach((wall,n)=>{
      wall.inert=n!==i;
      if(n!==i)wall.setAttribute('aria-hidden','true');else wall.removeAttribute('aria-hidden');
      wall.querySelectorAll('img').forEach(img=>{if(n===i)img.loading='eager'});
    });
    document.querySelector('#im-count').textContent='0'+(i+1)+' / 03';
    document.querySelector('#im-title').textContent=names[i];
  }
  function setMode(next) {
    active=next&&supported;
    drag=null;
    view.classList.remove('is-dragging');
    view.dataset.mode=active?'3d':'flat';
    mode.setAttribute('aria-pressed',String(!active));
    mode.textContent=active?'Vista plana':'Vista 3D';
    help.hidden=!active;
    status.hidden=!active;
    stops.forEach(b=>{b.disabled=!active});
    view.tabIndex=active?0:-1;
    if(active){measure();select(current)}
    else walls.forEach(w=>{w.inert=false;w.removeAttribute('aria-hidden')});
  }
  if (supported) {
    toolbar.hidden=false;
    setMode(!reduced.matches);
    mode.addEventListener('click',()=>setMode(!active));
    stops.forEach((b,i)=>b.addEventListener('click',()=>select(i)));
    view.addEventListener('keydown',e=>{
      if(!active||e.target!==view)return;
      if(e.key==='ArrowLeft'||e.key==='ArrowRight'||e.key==='Home'||e.key==='End'){
        e.preventDefault();
        select(e.key==='Home'?0:e.key==='End'?2:Math.max(0,Math.min(2,current+(e.key==='ArrowRight'?1:-1))));
      }
    });
    view.addEventListener('pointerdown',e=>{
      if(!active||!e.isPrimary||e.button!==0)return;
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
      if(moved){suppressUntil=Date.now()+400;select(Math.round(angle/90))}
    }
    view.addEventListener('pointerup',endDrag);
    view.addEventListener('pointercancel',endDrag);
    view.addEventListener('lostpointercapture',endDrag);
    view.addEventListener('pointerleave',e=>{if(drag&&!drag.moved)drag=null});
    if('ResizeObserver' in window)new ResizeObserver(measure).observe(view);else addEventListener('resize',measure);
    mobile.addEventListener?.('change',measure);
    reduced.addEventListener?.('change',()=>{if(reduced.matches)setMode(false)});
  }
  const dialog=document.querySelector('.im-dialog');
  const large=dialog?.querySelector('.im-large');
  const caption=dialog?.querySelector('.im-dialog-caption');
  const close=dialog?.querySelector('.im-close');
  let opener=null;
  view.querySelectorAll('.im-photo').forEach(link=>{
    link.addEventListener('click',e=>{
      if(Date.now()<suppressUntil){e.preventDefault();return}
      if(e.ctrlKey||e.metaKey||e.shiftKey||e.altKey||!dialog||typeof dialog.showModal!=='function')return;
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
    dialog.addEventListener('close',()=>opener?.focus({preventScroll:true}));
  }
})();
