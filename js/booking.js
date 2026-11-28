'use strict';
(() => {
  const root = document.querySelector('#cobertura');
  if (!root) return;
  const buttons = [...root.querySelectorAll('[data-sf-choice]')];
  const plan = root.querySelector('#planejar');
  const send = root.querySelector('#sf-plan-send');
  const get = id => document.getElementById('sf-plan-' + id);
  const fields = ['birth','month','hospital'].map(get);
  if (!send || !plan || !buttons.length || !fields.every(Boolean)) return;

  const names = {foto:'Fotografia',filme:'Filme',completo:'Fotografia e filme'};
  let selected = '';
  function update() {
    const lines = ['Olá, Silvoney! Gostaria de consultar valores e disponibilidade para o registro de parto.'];
    if (names[selected]) lines.push('Cobertura: ' + names[selected]);
    for (const [id,label] of [['birth','Tipo de parto'],['month','Previsão'],['hospital','Maternidade']]) {
      let value = get(id).value.trim();
      if (id === 'month' && /^\d{4}-\d{2}$/.test(value)) {
        const [year,month] = value.split('-');
        value = month + '/' + year;
      }
      if (value) lines.push(label + ': ' + value);
    }
    send.href = 'https://wa.me/5565984010597?text=' + encodeURIComponent(lines.join('\n'));
  }
  buttons.forEach(button => {
    button.disabled = false;
    button.addEventListener('click', () => {
      selected = selected === button.dataset.sfChoice ? '' : button.dataset.sfChoice;
      buttons.forEach(b => b.setAttribute('aria-pressed',String(b.dataset.sfChoice === selected)));
      update();
    });
  });
  plan.addEventListener('input',update);
  plan.addEventListener('change',update);
  plan.hidden = false;
  function reveal() { if (location.hash === '#planejar') plan.open = true; }
  addEventListener('hashchange',reveal);
  reveal();
  update();
})();
