const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const names=['index.html','partos.html','ensaios.html','sobre.html','contato.html','links.html'];
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const pages=Object.fromEntries(names.map(p=>[p,read(p)]));
for(const [p,html] of Object.entries(pages)){
  test(p+' IDs, âncoras e recursos locais',()=>{
    const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
    assert.equal(ids.length,new Set(ids).size,'IDs duplicados');
    for(const m of html.matchAll(/href="#([^"]+)"/g))assert.ok(ids.includes(m[1]),m[0]);
    for(const m of html.matchAll(/href="\/?([\w-]+\.html)#([^"]+)"/g))assert.ok(pages[m[1]]?.includes('id="'+m[2]+'"'),m[0]);
    for(const m of html.matchAll(/\b(?:src|href)="([^"]+)"/g)){
      let value=m[1];
      if(/^(https?:|mailto:|tel:|#|data:)/i.test(value))continue;
      value=value.split(/[?#]/)[0].replace(/^\//,'');
      if(!value||value==='links')continue;
      assert.ok(fs.existsSync(path.join(root,value)),p+': '+value);
    }
    for(const m of html.matchAll(/<img\b[^>]*>/g))assert.match(m[0],/\balt=/);
  });
}
test('sintaxe dos scripts atuais',()=>{
  const files=new Set();
  for(const html of Object.values(pages))for(const m of html.matchAll(/<script[^>]*src="([^"]+)"/g))files.add(m[1].split('?')[0].replace(/^\//,''));
  for(const name of files)new vm.Script(read(name),{filename:name});
});
test('cabeçalhos de segurança e rewrite',()=>{
  const conf=JSON.parse(read('vercel.json'));
  assert.ok(conf.rewrites.some(x=>x.source==='/links'&&x.destination==='/links.html'));
  assert.ok(conf.headers.flatMap(x=>x.headers).some(x=>x.key==='Content-Security-Policy'));
});
test('orçamento compõe texto sem campos vazios e sincroniza cobertura',()=>{
  const node=(value='')=>({value,hidden:true,href:'',dataset:{},listeners:{},addEventListener(k,fn){(this.listeners[k]??=[]).push(fn)},fire(k){for(const fn of this.listeners[k]||[])fn({})},getAttribute(){return 'false'},setAttribute(){}});
  const service=node('Fotografia e filme'),birth=node('Cesárea'),month=node('2027-01'),hospital=node('Hospital & Maternidade'),send=node(),plan=node(),button=node();
  button.dataset.sfChoice='filme';
  const nodes={'sf-plan-service':service,'sf-plan-birth':birth,'sf-plan-month':month,'sf-plan-hospital':hospital,'sf-plan-send':send};
  const preview=node(),title=node(),desc=node(),contact=node();
  const selectors={'#planejar':plan,'#sf-choice-image':preview,'#sf-choice-title':title,'#sf-choice-desc':desc,'#sf-choice-contact':contact};
  const document={querySelector:s=>selectors[s]||null,querySelectorAll:()=>[button],getElementById:s=>nodes[s]};
  vm.runInNewContext(read('js/booking.js'),{document,matchMedia:()=>({matches:true}),location:{hash:'#planejar'},addEventListener(){}});
  let text=decodeURIComponent(send.href);
  for(const v of ['Cobertura: Fotografia e filme','Tipo de parto: Cesárea','Previsão: 01/2027','Maternidade: Hospital & Maternidade'])assert.ok(text.includes(v));
  assert.equal(plan.hidden,false);assert.equal(plan.open,true);
  button.fire('click');assert.ok(decodeURIComponent(send.href).includes('Cobertura: Filme'));
  for(const n of [service,birth,month,hospital])n.value='';
  plan.fire('input');assert.doesNotMatch(decodeURIComponent(send.href),/Tipo de parto:|Previsão:|Maternidade:|Cobertura:/);
});
