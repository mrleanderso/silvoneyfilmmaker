'use strict';
(() => {
  const root = document.querySelector('#experiencia');
  if (!root) return;
  const acts = [...root.querySelectorAll('.sf-exhibit-act')];
  const controls = root.querySelector('.sf-exhibit-controls');
  const buttons = [...root.querySelectorAll('[data-exhibit-act]')];
  const status = root.querySelector('#exhibit-status');
  if (!controls || !status || acts.length !== buttons.length || acts.length < 2) return;

  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(hover:hover) and (pointer:fine)');
  const more = root.querySelector('#sf-gallery-panel');
  function revealMore() {if (more && ['#galeria','#sf-gallery-panel'].includes(location.hash)) more.open=true;}
  revealMore();
  addEventListener('hashchange',revealMore);
  let index = 0;
  let frame = 0;
  let touch = null;
  let suppressClickUntil = 0;

  function reset(stage) {
    stage.style.removeProperty('--tilt-x');
    stage.style.removeProperty('--tilt-y');
  }
  function select(next) {
    if (!Number.isInteger(next) || next < 0 || next >= acts.length || next === index) return;
    const direction = next > index ? 'next' : 'prev';
    cancelAnimationFrame(frame);
    acts.forEach((act,i) => {
      act.hidden = i !== next;
      act.removeAttribute('data-enter');
      reset(act.querySelector('.sf-exhibit-stage'));
    });
    index = next;
    if (!reduced.matches) acts[index].dataset.enter = direction;
    buttons.forEach((button,i) => button.setAttribute('aria-pressed',String(i === index)));
    status.textContent = 'Ato '+(index+1)+' de '+acts.length+': '+buttons[index].textContent.trim();
    root.dispatchEvent(new CustomEvent('sf:exhibit-change',{bubbles:true,detail:{act:index+1}}));
  }
  buttons.forEach((button,i) => button.addEventListener('click',() => select(i)));
  controls.addEventListener('keydown',event => {
    if (!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? acts.length-1 :
      Math.min(acts.length-1,Math.max(0,index+(event.key === 'ArrowRight' ? 1 : -1)));
    select(next);
    buttons[next].focus();
  });
  acts.forEach(act => {
    const stage = act.querySelector('.sf-exhibit-stage');
    const world = act.querySelector('.sf-exhibit-world');
    world.addEventListener('animationend',() => act.removeAttribute('data-enter'));
    stage.addEventListener('pointermove',event => {
      if (reduced.matches || !fine.matches || event.pointerType === 'touch') return;
      const rect=stage.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      cancelAnimationFrame(frame);
      frame=requestAnimationFrame(() => {
        stage.style.setProperty('--tilt-y',((event.clientX-rect.left)/rect.width-.5)*6+'deg');
        stage.style.setProperty('--tilt-x',((event.clientY-rect.top)/rect.height-.5)*-4+'deg');
      });
    });
    stage.addEventListener('pointerleave',() => {cancelAnimationFrame(frame);reset(stage)});
    stage.addEventListener('touchstart',event => {
      touch=event.touches.length === 1 ? [event.touches[0].clientX,event.touches[0].clientY] : null;
    },{passive:true});
    stage.addEventListener('touchcancel',() => {touch=null},{passive:true});
    stage.addEventListener('touchend',event => {
      if (!touch) return;
      const dx=event.changedTouches[0].clientX-touch[0];
      const dy=event.changedTouches[0].clientY-touch[1];
      touch=null;
      if (Math.abs(dx)>65 && Math.abs(dx)>Math.abs(dy)*1.6) {
        suppressClickUntil=Date.now()+350;
        select(index+(dx<0?1:-1));
      }
    },{passive:true});
    act.querySelectorAll('.sf-exhibit-print').forEach(link => {
      link.addEventListener('click',event => {
        if (Date.now()<suppressClickUntil) {event.preventDefault();event.stopImmediatePropagation();}
      },true);
    });
  });
  reduced.addEventListener?.('change',() => {
    cancelAnimationFrame(frame);
    acts.forEach(act => {act.removeAttribute('data-enter');reset(act.querySelector('.sf-exhibit-stage'))});
  });
  controls.hidden=false;
  if ('IntersectionObserver' in window && !reduced.matches) {
    const intro=new IntersectionObserver(entries => {
      if (!entries.some(entry=>entry.isIntersecting)) return;
      intro.disconnect();
      if (index===0 && !reduced.matches) acts[0].dataset.enter='next';
    },{threshold:.3});
    intro.observe(acts[0].querySelector('.sf-exhibit-stage'));
  }
})();
