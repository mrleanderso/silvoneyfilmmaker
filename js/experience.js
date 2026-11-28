'use strict';
(() => {
  const root = document.querySelector('#experiencia');
  if (!root) return;
  const stages = [...root.querySelectorAll('.sf-exhibit-stage')];
  const more = root.querySelector('#sf-gallery-panel');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let frame = 0;
  let enabled = false;
  const visible = new Set();
  function revealMore() {
    if (more && ['#galeria','#sf-gallery-panel'].includes(location.hash)) more.open = true;
  }
  revealMore();
  addEventListener('hashchange', revealMore);
  root.querySelectorAll('.sf-exhibit-index a').forEach((link,i) => {
    link.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return;
      root.dispatchEvent(new CustomEvent('sf:exhibit-change',{bubbles:true,detail:{act:i+1}}));
    });
  });
  if (!('IntersectionObserver' in window) || !stages.length) return;
  function reset(stage) {
    for (const prop of ['--drift-front','--drift-rear','--yaw']) stage.style.removeProperty(prop);
  }
  function paint() {
    frame = 0;
    if (!enabled || document.hidden || document.querySelector('dialog[open]')) return;
    for (const stage of visible) {
      const r = stage.getBoundingClientRect();
      const progress = Math.max(-1,Math.min(1,(innerHeight/2-r.top-r.height/2)/(innerHeight/2+r.height/2)));
      stage.style.setProperty('--drift-front', (progress*-5).toFixed(2)+'px');
      stage.style.setProperty('--drift-rear', (progress*9).toFixed(2)+'px');
      stage.style.setProperty('--yaw', (progress*2).toFixed(2)+'deg');
    }
  }
  function schedule() {
    if (enabled && visible.size && !frame) frame = requestAnimationFrame(paint);
  }
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) visible.add(entry.target);
      else {visible.delete(entry.target);reset(entry.target);}
    }
    schedule();
  },{rootMargin:'40px'});
  function configure() {
    enabled = !reduced.matches;
    observer.disconnect();
    visible.clear();
    cancelAnimationFrame(frame);
    frame = 0;
    stages.forEach(reset);
    removeEventListener('scroll',schedule);
    removeEventListener('resize',schedule);
    if (enabled) {
      stages.forEach(stage => observer.observe(stage));
      addEventListener('scroll',schedule,{passive:true});
      addEventListener('resize',schedule,{passive:true});
    }
  }
  reduced.addEventListener?.('change',configure);
  document.addEventListener('visibilitychange',schedule);
  configure();
})();
