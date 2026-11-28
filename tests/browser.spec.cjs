const {test,expect}=require('@playwright/test');
const pages=['/','/partos.html','/ensaios.html','/sobre.html','/contato.html','/links'];
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
  await page.goto('/partos.html#galeria');
  await page.locator('.photo-button').first().click();
  await expect(page.locator('#gallery')).toBeVisible();
  await page.locator('#next').click();
  await expect(page.locator('#photo-count')).toContainText('2 / 17');
  await page.locator('.close-gallery').click();
  await expect(page.locator('#gallery')).not.toBeVisible();
});
test('álbum opcional e teclado',async({page})=>{
  await page.goto('/partos.html#galeria');
  await page.locator('.sf-book-toggle').click();
  await expect(page.locator('#sf-book-count')).toHaveText('1 / 6');
  await page.locator('[data-book-next]').click();
  await expect(page.locator('#sf-book-count')).toHaveText('2 / 6');
  await page.locator('.sf-book-stage').focus();
  await page.keyboard.press('ArrowLeft');
  await expect(page.locator('#sf-book-count')).toHaveText('1 / 6');
  await expect(page.locator('#sf-gallery-panel')).not.toBeVisible();
  await page.locator('.sf-gallery-toggle').click();
  await expect(page.locator('#sf-gallery-panel')).toBeVisible();
  await expect(page.locator('#sf-book-panel')).not.toBeVisible();
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
test('tour pode abrir e fechar',async({page})=>{
  await page.goto('/links');
  await page.locator('[data-tour-open]').first().click();
  await expect(page.locator('#sf-tour')).toBeVisible();
  await page.locator('#sf-tour [data-tour-close]').first().click();
  await expect(page.locator('#sf-tour')).not.toBeVisible();
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
  await expect(page.locator('.cinema-actions a[href*="wa.me"]')).toBeVisible();
  await context.close();
});

test('galeria 3D alterna e navega',async({page})=>{
  await page.goto('/partos.html#galeria');
  await page.locator('.sf-depth-toggle').click();
  await expect(page.locator('#sf-depth-panel')).toBeVisible();
  await expect(page.locator('#sf-gallery-panel')).not.toBeVisible();
  await expect(page.locator('#sf-depth-count')).toHaveText('1 / 6');
  await page.locator('[data-depth-next]').click();
  await expect(page.locator('#sf-depth-count')).toHaveText('2 / 6');
  await page.locator('.sf-gallery-toggle').click();
  await expect(page.locator('#sf-depth-panel')).not.toBeVisible();
  await expect(page.locator('#sf-gallery-panel')).toBeVisible();
});

test('fotografia central em perspectiva amplia e devolve foco',async({page})=>{
  await page.goto('/partos.html#galeria');
  await page.locator('.sf-depth-toggle').click();
  const current=page.locator('.sf-depth-card[aria-current=true]');
  await current.click();
  await expect(page.locator('#gallery')).toBeVisible();
  await page.locator('.close-gallery').click();
  await expect(current).toBeFocused();
});
test('as fotografias têm destino direto sem JavaScript',async({browser})=>{
  const context=await browser.newContext({javaScriptEnabled:false});
  const page=await context.newPage();
  await page.goto('http://127.0.0.1:4173/partos.html#galeria');
  const link=page.locator('a.photo-button').first();
  await expect(link).toBeVisible();
  await expect(link).toHaveAttribute('href',/\.webp$/);
  await context.close();
});
