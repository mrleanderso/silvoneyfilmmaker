'use strict';
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const options = [
  {
    "id": "foto",
    "title": "Fotografia",
    "desc": "Guarde os detalhes do nascimento em fotografias selecionadas e tratadas.",
    "img": "/assets/detalhe.webp",
    "alt": "Detalhe da mão de um recém-nascido",
    "msg": "fotografia de parto",
    "url": "https://wa.me/5565984010597?text=Ol%C3%A1%2C%20Silvoney!%20Gostaria%20de%20consultar%20valores%20e%20disponibilidade%20para%20fotografia%20de%20parto."
  },
  {
    "id": "filme",
    "title": "Filme",
    "desc": "Relembre o primeiro choro, as vozes e os movimentos em um filme editado.",
    "img": "/assets/filme-afeto.webp",
    "alt": "Família reunida com o bebê na maternidade",
    "msg": "filme de nascimento",
    "url": "https://wa.me/5565984010597?text=Ol%C3%A1%2C%20Silvoney!%20Gostaria%20de%20consultar%20valores%20e%20disponibilidade%20para%20filme%20de%20nascimento."
  },
  {
    "id": "completo",
    "title": "Fotografia + filme",
    "desc": "Reviva a história em imagens e sons, com os dois registros.",
    "img": "/assets/familia.webp",
    "alt": "Pais abraçados junto ao recém-nascido",
    "msg": "fotografia e filme de parto",
    "url": "https://wa.me/5565984010597?text=Ol%C3%A1%2C%20Silvoney!%20Gostaria%20de%20consultar%20valores%20e%20disponibilidade%20para%20fotografia%20e%20filme%20de%20parto."
  }
];
  const buttons = [...document.querySelectorAll('[data-sf-choice]')];
  const image = document.querySelector('#sf-choice-image');
  const title = document.querySelector('#sf-choice-title');
  const desc = document.querySelector('#sf-choice-desc');
  const contact = document.querySelector('#sf-choice-contact');
  const plan = document.querySelector('#planejar');
  const get = id => document.getElementById('sf-plan-' + id);
  const fields = ['service','birth','month','hospital'].map(get);
  const send = get('send');
  const ready = plan && send && fields.every(Boolean);
  const phone = '5565984010597';
  function update() {
    if (!ready) return;
    const lines = ['Olá, Silvoney! Gostaria de consultar valores e disponibilidade para o registro de parto.'];
    for (const [id,label] of [['service','Cobertura'],['birth','Tipo de parto'],['month','Previsão'],['hospital','Maternidade']]) {
      let value = get(id).value.trim();
      if (id === 'month' && /^\d{4}-\d{2}$/.test(value)) {
        const [y,m] = value.split('-');
        value = m + '/' + y;
      }
      if (value) lines.push(label + ': ' + value);
    }
    send.href = 'https://wa.me/' + phone + '?text=' + encodeURIComponent(lines.join('\n'));
  }
  if (ready) {
    update();
    plan.hidden = false;
    plan.addEventListener('input', update);
    plan.addEventListener('change', update);
    const reveal = () => { if (location.hash === '#planejar') plan.open = true; };
    addEventListener('hashchange', reveal);
    reveal();
  }
  if (!buttons.length || !image || !title || !desc || !contact) return;
  buttons.forEach(button => button.addEventListener('click', () => {
    const option = options.find(o => o.id === button.dataset.sfChoice);
    if (!option) return;
    if (ready) {
      get('service').value = {foto:'Fotografia',filme:'Filme',completo:'Fotografia e filme'}[option.id];
      update();
    }
    if (button.getAttribute('aria-pressed') === 'true') return;
    buttons.forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    image.src = option.img;
    image.alt = option.alt;
    title.textContent = option.title;
    desc.textContent = option.desc;
    contact.href = option.url;
    if (!reduced.matches && image.animate) {
      image.animate([{opacity:.65},{opacity:1}], {duration:220,easing:'ease-out'});
    }
  }));
})();
