'use strict';
(() => {
  const header = document.querySelector('.site-header');
  const menu = header?.querySelector('.menu-toggle');
  const nav = menu && document.getElementById(menu.getAttribute('aria-controls'));
  if (!header || !menu || !nav) return;
  const mobile = matchMedia('(max-width:820px)');
  const label = menu.querySelector('span');
  function set(open) {
    const expanded = mobile.matches && open;
    menu.setAttribute('aria-expanded', String(expanded));
    if (label) label.textContent = expanded ? 'Fechar' : 'Menu';
    nav.classList.toggle('open', expanded);
    nav.inert = mobile.matches && !expanded;
  }
  set(false);
  document.documentElement.classList.add('js');
  menu.addEventListener('click', () => set(menu.getAttribute('aria-expanded') !== 'true'));
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => set(false)));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
      set(false);
      menu.focus();
    }
  });
  document.addEventListener('click', e => {
    if (!header.contains(e.target)) set(false);
  });
  header.addEventListener('focusout', e => {
    if (e.relatedTarget && !header.contains(e.relatedTarget)) set(false);
  });
  mobile.addEventListener('change', () => set(false));
  if (document.body.classList.contains('home-page') &&
      ['#galeria','#filmes','#cobertura','#duvidas'].includes(location.hash)) {
    location.replace('partos.html' + location.hash);
  }
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      if (e.defaultPrevented || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
      const target = document.getElementById(a.hash.slice(1));
      if (!target) return;
      requestAnimationFrame(() => {
        if (target.hidden) return;
        const focus = target.matches('main,summary') ? target :
          target.querySelector('h2[tabindex],summary') || target;
        if (!focus.hasAttribute('tabindex') && !focus.matches('a,button,summary,input,select')) {
          focus.setAttribute('tabindex', '-1');
        }
        focus.focus({preventScroll:true});
      });
    });
  });
})();
