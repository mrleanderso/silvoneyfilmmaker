'use strict';
(() => {
  const root = document.querySelector('#cobertura');
  if (!root) return;
  const options = [
  {
    "id": "foto",
    "title": "Fotografia",
    "desc": "Os primeiros olhares, o colo e os detalhes que mudam com o tempo.",
    "url": "https://wa.me/5565984010597?text=Ol%C3%A1%2C%20Silvoney!%20Gostaria%20de%20consultar%20valores%20e%20disponibilidade%20para%20fotografia%20de%20parto."
  },
  {
    "id": "filme",
    "title": "Filme de nascimento",
    "desc": "Relembre as vozes, o primeiro choro e os encontros da família.",
    "url": "https://wa.me/5565984010597?text=Ol%C3%A1%2C%20Silvoney!%20Gostaria%20de%20consultar%20valores%20e%20disponibilidade%20para%20filme%20de%20nascimento."
  },
  {
    "id": "completo",
    "title": "Fotografia + filme",
    "desc": "Preserve a história em imagens e sons, de duas maneiras complementares.",
    "url": "https://wa.me/5565984010597?text=Ol%C3%A1%2C%20Silvoney!%20Gostaria%20de%20consultar%20valores%20e%20disponibilidade%20para%20fotografia%20e%20filme%20de%20parto."
  }
];
  const buttons = [...root.querySelectorAll('[data-sf-choice]')];
  const preview = root.querySelector('#sf-choice-preview');
  const title = root.querySelector('#sf-choice-title');
  const desc = root.querySelector('#sf-choice-desc');
  const contact = root.querySelector('#sf-choice-contact');
  const plan = root.querySelector('#planejar');
  const get = id => document.getElementById('sf-plan-' + id);
  const fields = ['service','birth','month','hospital'].map(get);
  const send = get('send');
  const ready = Boolean(plan && send && fields.every(Boolean));
  const names = {foto:'Fotografia',filme:'Filme',completo:'Fotografia e filme'};
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
    send.href = 'https://wa.me/5565984010597?text=' + encodeURIComponent(lines.join('\n'));
  }
  function select(id, syncPlan = true) {
    const option = options.find(o => o.id === id);
    buttons.forEach(b => {
      const selected = b.dataset.sfChoice === id;
      b.setAttribute('aria-pressed',String(selected));
      b.textContent = selected ? 'Cobertura selecionada ✓' : 'Selecionar cobertura →';
    });
    if (preview && title && desc && contact) {
      preview.hidden = !option;
      if (option) {
        title.textContent = option.title;
        desc.textContent = option.desc;
        contact.href = option.url;
      }
    }
    if (ready && syncPlan) { get('service').value = names[id] || ''; update(); }
  }
  if (ready) {
    update();
    plan.hidden = false;
    plan.addEventListener('input', update);
    plan.addEventListener('change', update);
    get('service').addEventListener('change', () => {
      const id = Object.keys(names).find(k => names[k] === get('service').value);
      select(id,false);
    });
    const reveal = () => {
      if (location.hash === '#planejar') plan.open = true;
    };
    addEventListener('hashchange', reveal);
    reveal();
  }
  if (!buttons.length || !preview || !title || !desc || !contact) return;
  buttons.forEach(button => {
    button.hidden = false;
    button.addEventListener('click', () => {
      select(button.dataset.sfChoice);
      if (matchMedia('(max-width:820px)').matches && preview.scrollIntoView) {
        const bounds=preview.getBoundingClientRect();
        if(bounds.bottom>innerHeight || bounds.top<0) {
          preview.scrollIntoView({block:'nearest',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
        }
      }
    });
  });
  root.querySelectorAll('[data-coverage-direct]').forEach(a => {a.hidden = true;});
})();
