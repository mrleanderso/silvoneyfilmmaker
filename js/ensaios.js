'use strict';
(() => {
  const options = [...document.querySelectorAll('.album-option')];
  const panels = [...document.querySelectorAll('.shoot-album')];
  const selector = document.querySelector('#escolher-album');
  const status = document.querySelector('#album-status');
  const returnLink = document.querySelector('.album-return');
  const contact = document.querySelector('#album-contact');
  const contactTitle = document.querySelector('#album-contact-title');
  const contactLabel = document.querySelector('#album-contact-label');
  if (!panels.length || ![selector,status,returnLink,contact,contactTitle,contactLabel].every(Boolean)) return;

  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const pageSize = 6;
  const limits = new Map();
  const offers = {
    retratos:['Vamos guardar os primeiros dias?','Consultar ensaio de bebê','retratos dos primeiros dias do meu bebê'],
    externos:['Vamos registrar essa fase?','Consultar ensaio infantil','um ensaio infantil'],
    familias:['Vamos criar memórias em família?','Consultar ensaio em família','um ensaio em família'],
    celebracoes:['Vamos registrar essa celebração?','Consultar aniversário','uma cobertura de aniversário']
  };
  let current = null;
  const photos = panel => [...panel.querySelectorAll('.shoot-grid figure')];

  function renderPhotos(panel) {
    const all = photos(panel);
    const limit = limits.get(panel.id) || pageSize;
    all.forEach((figure,i) => { figure.hidden = i >= limit; });
    const more = panel.querySelector('.album-more');
    const left = Math.max(0,all.length-limit);
    if (more) {
      more.hidden = left === 0;
      more.querySelector('.album-progress').textContent = 'Exibindo '+Math.min(limit,all.length)+' de '+all.length+' fotos';
      more.querySelector('button').firstChild.textContent = 'Ver mais '+Math.min(pageSize,left)+' fotos ';
    }
    return all;
  }

  function selectAlbum(id, announce = true) {
    const panel = panels.find(p => p.id === id) || panels[0];
    const changed = current !== panel;
    current = panel;
    if (changed && announce && !reduced.matches) {
      panel.classList.remove('sf-album-enter');
      requestAnimationFrame(() => panel.classList.add('sf-album-enter'));
    }
    panels.forEach(p => { p.hidden = p !== panel; });
    options.forEach(a => {
      if (a.dataset.album === panel.id) a.setAttribute('aria-current','true');
      else a.removeAttribute('aria-current');
    });
    const all = renderPhotos(panel);
    returnLink.hidden = false;
    const offer = offers[panel.id] || ['Vamos registrar esse momento?','Consultar registro','um ensaio fotográfico'];
    contactTitle.textContent = offer[0];
    contactLabel.textContent = offer[1];
    contact.href = 'https://wa.me/5565984010597?text='+encodeURIComponent('Olá, Silvoney! Gostaria de consultar valores e disponibilidade para '+offer[2]+'.');
    if (announce) status.textContent = panel.querySelector('h2').textContent+': '+all.length+' fotos no álbum.';
  }

  function focusHeading() {
    const heading = current.querySelector('h2');
    if (!heading) return;
    heading.setAttribute('tabindex','-1');
    heading.focus({preventScroll:true});
    heading.scrollIntoView({block:'start',behavior:reduced.matches?'instant':'smooth'});
  }

  function sync(initial = false) {
    const id = location.hash.slice(1);
    if (id === 'nascimentos') { location.replace('partos.html#galeria'); return; }
    const panel = panels.find(p => p.id === id);
    if (panel && current !== panel) {
      selectAlbum(id,false);
      if (initial) requestAnimationFrame(() => focusHeading());
    } else if (!id || !current) selectAlbum(panels[0].id,false);
  }

  options.forEach(a => a.addEventListener('click', e => {
    if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    const id = a.dataset.album;
    if (location.hash !== '#'+id) history.pushState(null,'','#'+id);
    selectAlbum(id);
    focusHeading();
  }));

  panels.forEach(panel => {
    panel.querySelector('.album-more-button')?.addEventListener('click', () => {
      const previous = limits.get(panel.id) || pageSize;
      limits.set(panel.id,previous+pageSize);
      const all = renderPhotos(panel);
      status.textContent = 'Exibindo '+Math.min(previous+pageSize,all.length)+' de '+all.length+' fotos.';
      all[previous]?.querySelector('a')?.focus();
    });
  });

  sync(true);
  addEventListener('hashchange', () => sync());
  addEventListener('popstate', () => sync());
  returnLink.querySelector('a')?.addEventListener('click', e => {
    if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    selector.scrollIntoView({block:'start',behavior:reduced.matches?'instant':'smooth'});
    options.find(a => a.dataset.album === current?.id)?.focus({preventScroll:true});
  });

  const dialog = document.querySelector('.shoot-view');
  const large = document.querySelector('#shoot-large');
  const caption = document.querySelector('#shoot-caption');
  const count = document.querySelector('#shoot-count');
  const error = document.querySelector('#shoot-error');
  const retry = document.querySelector('#shoot-retry');
  const prev = document.querySelector('#shoot-prev');
  const next = document.querySelector('#shoot-next');
  const close = dialog?.querySelector('.shoot-close');
  if (!dialog || typeof dialog.showModal !== 'function' || ![large,caption,count,error,retry,prev,next,close].every(Boolean)) return;

  let activeLinks = [], idx = 0, opener = null, start = null;
  function show(i) {
    if (!activeLinks.length) return;
    idx = (i+activeLinks.length)%activeLinks.length;
    const a = activeLinks[idx], img = a.querySelector('img');
    error.hidden = retry.hidden = true;
    large.hidden = false;
    if (large.src !== a.href) large.src = a.href;
    large.alt = img.alt;
    caption.textContent = a.closest('figure').querySelector('figcaption span').textContent;
    count.textContent = (idx+1)+' / '+activeLinks.length;
    prev.disabled = next.disabled = activeLinks.length < 2;
    if (large.complete && !large.naturalWidth) fail();
  }
  function fail() {
    large.hidden = true;
    error.hidden = retry.hidden = false;
  }
  large.addEventListener('error',fail);
  large.addEventListener('load',() => { large.hidden = false; error.hidden = retry.hidden = true; });
  retry.addEventListener('click',() => {
    const url = new URL(activeLinks[idx].href,location.href);
    url.searchParams.set('retry',String(Date.now()));
    large.hidden = false; error.hidden = retry.hidden = true; large.src = url.href;
    close.focus({preventScroll:true});
  });
  panels.forEach(panel => {
    [...panel.querySelectorAll('.print')].forEach(a => {
      a.setAttribute('aria-haspopup','dialog');
      a.addEventListener('click', e => {
        if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.button !== 0 || dialog.open) return;
        e.preventDefault();
        opener = a;
        activeLinks = [...panel.querySelectorAll('.print')];
        show(activeLinks.indexOf(a));
        dialog.showModal();
      });
    });
  });
  close.addEventListener('click',() => dialog.close());
  prev.addEventListener('click',() => show(idx-1));
  next.addEventListener('click',() => show(idx+1));
  dialog.addEventListener('keydown',e => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault(); show(idx+(e.key==='ArrowLeft'?-1:1));
    }
  });
  dialog.addEventListener('close',() => { if (opener?.isConnected) opener.focus({preventScroll:true}); });
  dialog.addEventListener('click',e => {
    if (e.target !== dialog) return;
    const r = dialog.getBoundingClientRect();
    if (e.clientX<r.left || e.clientX>r.right || e.clientY<r.top || e.clientY>r.bottom) dialog.close();
  });
  large.addEventListener('touchstart',e => {
    start = e.touches.length === 1 ? [e.touches[0].clientX,e.touches[0].clientY] : null;
  },{passive:true});
  large.addEventListener('touchcancel',() => { start = null; },{passive:true});
  large.addEventListener('touchend',e => {
    if (!start) return;
    const dx=e.changedTouches[0].clientX-start[0], dy=e.changedTouches[0].clientY-start[1];
    start=null;
    if (Math.abs(dx)>50 && Math.abs(dx)>Math.abs(dy)*1.5) show(idx+(dx<0?1:-1));
  },{passive:true});
})();
