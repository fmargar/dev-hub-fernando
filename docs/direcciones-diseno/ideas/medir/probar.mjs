// Prueba y mide el abanico de ideas: capturas y fotogramas presentados por interacción (traza del compositor).
// Uso: PLAYWRIGHT_MJS=<index.mjs de Playwright> node medir/probar.mjs <dirección> <carpeta de capturas>
const { chromium } = await import(process.env.PLAYWRIGHT_MJS ?? 'playwright');
const base = process.argv[2] ?? 'http://127.0.0.1:4321/';
const caps = process.argv[3];
const b = await chromium.launch();
const filas = [];
const pausa = (p, ms) => p.waitForTimeout(ms);
async function medir(p, nombre, accion) {
  const cdp = p.__cdp ??= await p.context().newCDPSession(p);
  const ev = []; const oir = (d) => ev.push(...d.value);
  cdp.on('Tracing.dataCollected', oir);
  await cdp.send('Tracing.start', { categories: 'viz', transferMode: 'ReportEvents' });
  // testigo: obliga a presentar cada fotograma para que la cuenta no baje por estar quieto
  await p.evaluate(() => { const t = document.createElement('i'); t.id = 'testigo'; t.style.cssText = 'position:fixed;left:0;top:0;width:3px;height:3px;background:#000;opacity:.04;z-index:99;pointer-events:none'; document.body.append(t); let n = 0; window.__sigue = true; (function f() { if (!window.__sigue) return t.remove(); t.style.transform = `translateX(${n++ % 2}px)`; requestAnimationFrame(f); })(); });
  const t0 = Date.now(); await accion(); const seg = (Date.now() - t0) / 1000;
  await p.evaluate(() => { window.__sigue = false; });
  const fin = new Promise((ok) => cdp.once('Tracing.tracingComplete', ok));
  await cdp.send('Tracing.end'); await fin; cdp.off('Tracing.dataCollected', oir);
  const ts = ev.filter((e) => e.name === 'Display::DrawAndSwap' && e.ph !== 'E').map((e) => e.ts / 1000).sort((x, y) => x - y);
  const d = ts.slice(1).map((x, i) => x - ts[i]).sort((x, y) => x - y);
  filas.push({ nombre, fps: +(ts.length / seg).toFixed(1), peor: d.length ? +(1000 / d[Math.floor(d.length * .95)]).toFixed(1) : 0 });
}
for (const [w, h, movil] of [[1440, 900, false], [390, 844, true], [900, 1000, false]]) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: movil ? 2 : 1, hasTouch: movil, isMobile: movil });
  const p = await ctx.newPage(); const errores = []; let peso = 0, n = 0;
  p.on('pageerror', (e) => errores.push(e.message)); p.on('console', (m) => { if (m.type() === 'error') errores.push(m.text()); });
  p.on('response', async (r) => { try { peso += (await r.body()).length; n++; } catch {} });
  await p.goto(base, { waitUntil: 'networkidle' }); await pausa(p, 900);
  console.log(`${w}: primera carga ${(peso / 1024).toFixed(0)} KB en ${n} peticiones`);
  if (caps) await p.screenshot({ path: `${caps}/ideas-portada-${w}.png` });
  await medir(p, `${w} · bajar por la página con la rueda`, async () => { for (let i = 0; i < 40; i++) { await p.mouse.wheel(0, 70); await pausa(p, 30); } await pausa(p, 600); });
  if (caps) await p.screenshot({ path: `${caps}/ideas-rejilla-${w}.png` });
  await p.locator('#todas').scrollIntoViewIfNeeded(); await pausa(p, 700);
  await medir(p, `${w} · filtrar por Codex (las tarjetas se recolocan)`, async () => { await p.click('[data-autor="Codex"]'); await pausa(p, 900); });
  await medir(p, `${w} · ordenar por mundo`, async () => { await p.click('[data-orden="mundo"]'); await pausa(p, 900); });
  await p.click('[data-autor=""]'); await p.click('[data-orden="nota"]'); await pausa(p, 900);
  const t = p.locator('#rejilla .tarjeta[data-id="tramoya"] button');
  await t.scrollIntoViewIfNeeded(); await pausa(p, 600);
  await medir(p, `${w} · abrir una idea (la imagen vuela a la ficha)`, async () => { await t.click(); await pausa(p, 900); });
  if (caps) await p.screenshot({ path: `${caps}/ideas-ficha-${w}.png` });
  await medir(p, `${w} · pasar a la siguiente idea`, async () => { await p.keyboard.press('ArrowRight'); await pausa(p, 700); });
  await medir(p, `${w} · cerrar (vuelve a su tarjeta)`, async () => { await p.keyboard.press('Escape'); await pausa(p, 800); });
  // dirección directa y botón atrás
  await p.goto(base + '#idea/salidas'); await pausa(p, 1200);
  const abierta = await p.evaluate(() => document.querySelector('#ficha').open && document.querySelector('#f-nombre').textContent);
  await p.click('[data-cerrar]'); await pausa(p, 900);
  const cerrada = await p.evaluate(() => !document.querySelector('#ficha').open && location.hash === '');
  await t.click(); await pausa(p, 900); await p.goBack(); await pausa(p, 900);
  const atras = await p.evaluate(() => !document.querySelector('#ficha').open);
  const ancho = await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth);
  console.log(`${w}: entrada directa=${abierta} cerrar=${cerrada} atrás=${atras} sin-scroll-lateral=${ancho}`);
  if (errores.length) console.log(`ERRORES ${w}:`, errores.join(' | '));
  await ctx.close();
}
await b.close();
console.log('\npresentados/s | peor 5 % | interacción');
for (const f of filas) console.log(`${String(f.fps).padStart(6)} | ${String(f.peor).padStart(6)} | ${f.nombre}`);
