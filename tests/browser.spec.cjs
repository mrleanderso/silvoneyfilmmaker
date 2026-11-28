const {test,expect}=require('@playwright/test');
const pages=['/','/partos.html','/ensaios.html','/sobre.html','/contato.html','/links','/imersao.html'];
for(const url of pages)test('carrega sem erros e sem overflow '+url,async({page})=>{
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(url);
  await expect(page.locator('h1')).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2)).toBeTruthy();
  expect(errors).toEqual([]);
});
test('menu abre e fecha no celular',async({page},info)=>{
  test.skip(info.project.name==='desktop');
  await page.goto('/');
  const menu=page.locator('.menu-toggle');
  await menu.click();
  await expect(menu).toHaveAttribute('aria-expanded','true');
  await page.keyboard.press('Escape');
  await expect(menu).toHaveAttribute('aria-expanded','false');
});
test('galeria amplia e navega',async({page})=>{
  await page.goto('/partos.html#experiencia');
  await page.locator('.sf-exhibit-print--front').first().click();
  await expect(page.locator('#gallery')).toBeVisible();
  await page.locator('#next').click();
  await expect(page.locator('#photo-count')).toContainText('3 / 17');
  await page.locator('.close-gallery').click();
  await expect(page.locator('#gallery')).not.toBeVisible();
});

test('orçamento opcional e mensagens',async({page})=>{
  await page.goto('/partos.html#planejar');
  await expect(page.locator('#planejar')).toHaveAttribute('open','');
  await page.locator('[data-sf-choice="filme"]').click();
  await expect(page.locator('[data-sf-choice="filme"]')).toHaveAttribute('aria-pressed','true');
  await page.locator('#sf-plan-hospital').fill('Hospital & Maternidade');
  const href=await page.locator('#sf-plan-send').getAttribute('href');
  expect(decodeURIComponent(href)).toContain('Cobertura: Filme');
  expect(decodeURIComponent(href)).toContain('Hospital & Maternidade');
});

test('ensaios personalizam o contato',async({page})=>{
  await page.goto('/ensaios.html');
  await page.locator('[data-album="familias"]').click();
  await expect(page.locator('#familias')).toBeVisible();
  expect(decodeURIComponent(await page.locator('#album-contact').getAttribute('href'))).toContain('família');
});
test('WhatsApp permanece sem JavaScript',async({browser})=>{
  const context=await browser.newContext({javaScriptEnabled:false});
  const page=await context.newPage();
  await page.goto('http://127.0.0.1:4173/partos.html');
  await expect(page.locator('.sf-cover-primary')).toBeVisible();
  await context.close();
});




test('as fotografias têm destino direto sem JavaScript',async({browser})=>{
  const context=await browser.newContext({javaScriptEnabled:false});
  const page=await context.newPage();
  await page.goto('http://127.0.0.1:4173/partos.html#galeria');
  const link=page.locator('.sf-exhibit-print--rear').first();
  await expect(link).toBeVisible();
  await expect(link).toHaveAttribute('href',/\.webp$/);
  expect(await link.evaluate(a=>getComputedStyle(a).pointerEvents)).not.toBe('none');
  await context.close();
});



for(const url of ['/','/partos.html'])test('capa editorial preserva fotografia e ações '+url,async({page})=>{
  await page.goto(url);
  const cover=page.locator('.sf-cover');
  await expect(cover.locator('h1')).toBeVisible();
  await expect(cover.locator('.sf-cover-primary')).toBeVisible();
  const geometry=await cover.evaluate(el=>{
    const image=el.querySelector('.sf-cover-media').getBoundingClientRect();
    const copy=el.querySelector('.sf-cover-inner').getBoundingClientRect();
    const button=el.querySelector('.sf-cover-primary').getBoundingClientRect();
    return {separate:image.right<=copy.left+1||copy.right<=image.left+1||image.bottom<=copy.top+1||copy.bottom<=image.top+1,button:button.height>=44,overflow:el.scrollWidth>el.clientWidth+2};
  });
  expect(geometry.separate).toBeTruthy();
  expect(geometry.button).toBeTruthy();
  expect(geometry.overflow).toBeFalsy();
});

test('contato prioriza orçamento no celular',async({page},info)=>{
  test.skip(info.project.name==='desktop');
  await page.goto('/contato.html');
  const positions=await page.locator('.editorial-contact').evaluate(el=>({
    action:el.querySelector('.editorial-contact-options').getBoundingClientRect().bottom,
    photo:el.querySelector('figure').getBoundingClientRect().top
  }));
  expect(positions.action).toBeLessThan(positions.photo);
});
test('álbum profundo abre a categoria certa e mantém histórico',async({page})=>{
  await page.goto('/ensaios.html#familias');
  await expect(page.locator('#familias')).toBeVisible();
  await page.locator('[data-album="retratos"]').click();
  await expect(page.locator('#retratos')).toBeVisible();
  await page.goBack();
  await expect(page.locator('#familias')).toBeVisible();
  await expect(page.locator('[data-album="familias"]')).toHaveAttribute('aria-current','true');
});
test('menu restaura foco ao fechar com Escape',async({page},info)=>{
  test.skip(info.project.name==='desktop');
  await page.goto('/');
  const menu=page.locator('.menu-toggle');
  await menu.click();
  await page.locator('.shell-nav a').first().focus();
  await page.keyboard.press('Escape');
  await expect(menu).toBeFocused();
  await expect(menu).toHaveAttribute('aria-expanded','false');
});
test('ensaios recuperam falha de carregamento da imagem',async({page})=>{
  await page.goto('/ensaios.html');
  const first=page.locator('#retratos .print').first();
  const href=await first.getAttribute('href');
  // Force an image URL not already cached by the thumbnail.
  await first.evaluate(a=>{a.href+='?viewer=1'});
  await page.route(url=>url.pathname.endsWith('/'+href)&&url.searchParams.has('viewer'),route=>url.searchParams.has('retry')?route.continue():route.abort());
  await first.click();
  await expect(page.locator('#shoot-error')).toBeVisible();
  await expect(page.locator('#shoot-retry')).toBeVisible();
  await page.locator('#shoot-retry').click();
  await expect(page.locator('#shoot-error')).not.toBeVisible();
  await expect.poll(()=>page.locator('#shoot-large').evaluate(img=>img.complete&&img.naturalWidth>0)).toBeTruthy();
  await page.keyboard.press('Escape');
  await expect(first).toBeFocused();
});

test('exposição contínua, navegação e ampliação',async({page})=>{
  await page.goto('/partos.html#experiencia');
  const root=page.locator('#experiencia');
  for(let i=1;i<=3;i++)await expect(root.locator('#exhibit-act-'+i)).toBeVisible();
  await root.locator('a[href="#exhibit-act-3"]').click();
  await expect(page).toHaveURL(/#exhibit-act-3$/);
  const photo=root.locator('#exhibit-act-3 .sf-exhibit-print--front');
  await photo.click();
  await expect(page.locator('#gallery')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(photo).toBeFocused();
});
test('link da bio chega à galeria 3D',async({page})=>{
  await page.goto('/links');
  await page.locator('a[href="/imersao.html"]').click();
  await expect(page.locator('h1')).toContainText('Entre');
});
test('primeiro ato e galeria funcionam sem JavaScript',async({browser})=>{
  const context=await browser.newContext({javaScriptEnabled:false});
  const page=await context.newPage();
  await page.goto('http://127.0.0.1:4173/partos.html#experiencia');
  await expect(page.locator('#exhibit-act-1 .sf-exhibit-print--front')).toBeVisible();
  await expect(page.locator('.sf-exhibit-index')).toBeVisible();
  await expect(page.locator('#exhibit-act-2')).toBeVisible();
  await expect(page.locator('#exhibit-act-3')).toBeVisible();
  await expect(page.locator('#sf-gallery-panel')).toBeVisible();
  await context.close();
});

test('portfólio integrado não repete fotografias e mantém todos os registros',async({page})=>{
  await page.goto('/partos.html#experiencia');
  const collection=page.locator('[data-sf-photo]');
  expect(await collection.count()).toBe(17);
  const links=await collection.evaluateAll(nodes=>nodes.map(a=>a.href));
  expect(new Set(links).size).toBe(17);
  const more=page.locator('#sf-gallery-panel');
  await expect(more).not.toHaveAttribute('open','');
  await more.locator('summary').click();
  await expect(more).toHaveAttribute('open','');
  await expect(more.locator('a.photo-button')).toHaveCount(10);
});

test('exposição sem sobreposição e navegação nativa',async({page})=>{
  await page.goto('/partos.html#experiencia');
  const root=page.locator('#experiencia');
  for(let i=1;i<=3;i++){
    const act=root.locator('#exhibit-act-'+i);
    await expect(act).toBeVisible();
    await act.scrollIntoViewIfNeeded();
    const result=await act.evaluate(el=>{
      const s=el.querySelector('.sf-exhibit-stage').getBoundingClientRect();
      const p=[...el.querySelectorAll('.sf-exhibit-print')].map(a=>a.getBoundingClientRect());
      const overlap=Math.max(0,Math.min(p[0].right,p[1].right)-Math.max(p[0].left,p[1].left))*Math.max(0,Math.min(p[0].bottom,p[1].bottom)-Math.max(p[0].top,p[1].top));
      return {inside:p.every(r=>r.left>=s.left-2&&r.right<=s.right+2&&r.top>=s.top-2&&r.bottom<=s.bottom+2),overlap};
    });
    expect(result.inside).toBeTruthy();
    expect(result.overlap).toBe(0);
  }
});

test('imersão permite girar, ampliar e voltar à vista plana',async({page})=>{
  await page.goto('/imersao.html');
  await expect(page.locator('#im-viewport')).toHaveAttribute('data-mode','3d');
  await page.locator('[data-room="2"]').click();
  await expect(page.locator('#im-title')).toHaveText('A família');
  await expect(page.locator('#room-0')).toHaveAttribute('aria-hidden','true');
  await expect(page.locator('#room-2')).not.toHaveAttribute('aria-hidden','true');
  await page.locator('#room-2 .im-photo--0').click();
  await expect(page.locator('.im-dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await page.locator('.im-mode').click();
  await expect(page.locator('#im-viewport')).toHaveAttribute('data-mode','flat');
  await expect(page.locator('#room-0')).toBeVisible();
});
test('imersão respeita movimento reduzido',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/imersao.html');
  await expect(page.locator('#im-viewport')).toHaveAttribute('data-mode','flat');
  await expect(page.locator('#room-2')).toBeVisible();
});
