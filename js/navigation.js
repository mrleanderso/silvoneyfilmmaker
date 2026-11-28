'use strict';
(() => {
  const header = document.querySelector('.site-header');
  const menu = header?.querySelector('.menu-toggle');
  const nav = menu && document.getElementById(menu.getAttribute('aria-controls'));
  if (!header || !menu || !nav) return;

  const mobile = matchMedia('(max-width:820px)');
  const label = menu.querySelector('span');
  const isOpen = () => menu.getAttribute('aria-expanded') === 'true';

  function set(open, restore = false) {
    const expanded = mobile.matches && open;
    if (restore && !expanded && mobile.matches) menu.focus();
    menu.setAttribute('aria-expanded', String(expanded));
    if (label) label.textContent = expanded ? 'Fechar' : 'Menu';
    nav.classList.toggle('open', expanded);
    nav.inert = mobile.matches && !expanded;
  }

  set(false);
  document.documentElement.classList.add('js');
  document.querySelectorAll('[data-js-only]').forEach(el => { el.hidden = false; });
  menu.addEventListener('click', () => set(!isOpen()));
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', e => {
    if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
    if (isOpen()) set(false, nav.contains(document.activeElement));
  }));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && isOpen()) {
      e.preventDefault();
      set(false, true);
    }
  });
  document.addEventListener('click', e => {
    if (isOpen() && !header.contains(e.target)) set(false, nav.contains(document.activeElement));
  });
  header.addEventListener('focusout', e => {
    if (isOpen() && e.relatedTarget && !header.contains(e.relatedTarget)) set(false);
  });
  mobile.addEventListener('change', () => set(false, mobile.matches && nav.contains(document.activeElement)));

  if (document.body.classList.contains('home-page') &&
      ['#galeria','#filmes','#cobertura','#duvidas'].includes(location.hash)) {
    location.replace('partos.html' + location.hash);
  }

  // Native hash navigation remains intact; only improve keyboard/screen-reader focus.
  document.addEventListener('click', e => {
    const a = e.target.closest?.('a[href^="#"]');
    if (!a || e.defaultPrevented || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
    const target = document.getElementById(a.hash.slice(1));
    if (!target) return;
    requestAnimationFrame(() => {
      if (target.closest('[hidden]')) return;
      const focus = target.matches('main,summary') ? target :
        target.querySelector('h2,summary') || target;
      if (!focus.hasAttribute('tabindex') && !focus.matches('a,button,summary,input,select')) {
        focus.setAttribute('tabindex', '-1');
      }
      focus.focus({preventScroll:true});
    });
  });
})();
