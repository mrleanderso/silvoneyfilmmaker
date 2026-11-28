const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const names=['index.html','partos.html','ensaios.html','sobre.html','contato.html','links.html','imersao.html'];
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
test('cobertura opcional e orçamento em um único link',()=>{
  const node=(value='')=>({value,hidden:true,href:'',dataset:{},attrs:{},listeners:{},addEventListener(k,fn){(this.listeners[k]??=[]).push(fn)},fire(k){for(const fn of this.listeners[k]||[])fn({})},setAttribute(k,v){this.attrs[k]=v}});
  const birth=node('Cesárea'),month=node('2027-01'),hospital=node('Hospital & Maternidade'),send=node(),plan=node(),button=node();
  button.dataset.sfChoice='filme';
  const nodes={'sf-plan-birth':birth,'sf-plan-month':month,'sf-plan-hospital':hospital};
  const root={querySelector:s=>s==='#planejar'?plan:send,querySelectorAll:()=>[button]};
  const document={querySelector:()=>root,getElementById:s=>nodes[s]};
  vm.runInNewContext(read('js/booking.js'),{document,location:{hash:'#planejar'},addEventListener(){},requestAnimationFrame(fn){fn()}});
  let text=decodeURIComponent(send.href);
  for(const v of ['Tipo de parto: Cesárea','Previsão: 01/2027','Maternidade: Hospital & Maternidade'])assert.ok(text.includes(v));
  assert.equal(plan.hidden,false);assert.equal(plan.open,true);
  assert.doesNotMatch(text,/Cobertura:/);
  button.fire('click');assert.ok(decodeURIComponent(send.href).includes('Cobertura: Filme'));
  assert.equal(button.attrs['aria-pressed'],'true');
  button.fire('click');assert.doesNotMatch(decodeURIComponent(send.href),/Cobertura:/);
  for(const n of [birth,month,hospital])n.value='';
  plan.fire('input');assert.doesNotMatch(decodeURIComponent(send.href),/Tipo de parto:|Previsão:|Maternidade:|Cobertura:/);
});

test('CSS e JavaScript de produção estão nas pastas corretas',()=>{
  const entries=fs.readdirSync(root,{withFileTypes:true});
  assert.deepEqual(entries.filter(x=>x.isFile()&&/\.(css|js)$/.test(x.name)).map(x=>x.name),[]);
  for(const [page,html] of Object.entries(pages)){
    for(const m of html.matchAll(/\b(?:src|href)="([^"]+\.(?:css|js)(?:\?[^"]*)?)"/g)){
      const ref=m[1].split('?')[0];
      if(/^https?:/i.test(ref))continue;
      assert.match(ref,ref.endsWith('.css')?/^\/css\//:/^\/js\//,page+': '+ref);
    }
  }
});

test('Partos tem uma coleção única e 18 imagens distintas',()=>{
  const html=pages['partos.html'];
  const main=html.match(/<main\b[\s\S]*?<\/main>/)[0];
  const photos=[...main.matchAll(/<a\b[^>]*data-sf-photo[^>]*href="([^"]+)"/g)].map(m=>m[1]);
  assert.equal(photos.length,17);
  assert.equal(new Set(photos).size,17);
  const images=[...main.matchAll(/<img\b[^>]*src="([^"]+)"/g)].map(m=>m[1]);
  assert.equal(images.length,18);
  assert.equal(new Set(images).size,18);
  assert.equal((main.match(/href="https:\/\/wa\.me\//g)||[]).length,2);
});

test('imersão mantém seis fotos e alternativa nativa',()=>{
  const html=pages['imersao.html'];
  assert.equal((html.match(/<article class="im-wall /g)||[]).length,3);
  const photos=[...html.matchAll(/<a class="im-photo[^"]*" href="([^"]+)"/g)].map(m=>m[1]);
  assert.equal(photos.length,6);assert.equal(new Set(photos).size,6);
  assert.match(html,/<noscript>/);
  assert.match(pages['partos.html'],/href="imersao.html"/);
  assert.match(pages['links.html'],/href="\/imersao.html"/);
});
