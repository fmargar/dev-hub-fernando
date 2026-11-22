// Mide los fotogramas por segundo de cada interacción y el peso de la primera carga.
// Uso: PLAYWRIGHT_MJS=<ruta al index.mjs de Playwright> node medir/fps.mjs <dirección> [carpeta de capturas]
// Sin gráfica, el navegador sin cabeza pinta por software: sirve de vara de medir a la baja.
const { chromium } = await import(process.env.PLAYWRIGHT_MJS ?? 'playwright');
const base = process.argv[2] ?? 'http://127.0.0.1:4311/';
const caps = process.argv[3];
const b = await chromium.launch();
const filas = [];
const pausa = (p, ms) => p.waitForTimeout(ms);

// La cifra que vale es la de fotogramas PRESENTADOS (traza del compositor): los requestAnimationFrame
// pueden seguir a buen ritmo mientras la pantalla se actualiza a trompicones.
async function medir(p, nombre, accion, cola = 400) {
  const cdp = p.__cdp ??= await p.context().newCDPSession(p);
  const ev = []; const oir = (d) => ev.push(...d.value);
  cdp.on('Tracing.dataCollected', oir);
  await cdp.send('Tracing.start', { categories: 'viz', transferMode: 'ReportEvents' });
  await p.evaluate(() => window.__fps.iniciar());
  const t0 = Date.now();
  await accion();
  await pausa(p, cola);
  const seg = (Date.now() - t0) / 1000;
  const r = await p.evaluate(() => window.__fps.parar());
  const fin = new Promise((ok) => cdp.once('Tracing.tracingComplete', ok));
  await cdp.send('Tracing.end'); await fin; cdp.off('Tracing.dataCollected', oir);
  const ts = ev.filter((e) => e.name === 'Display::DrawAndSwap' && e.ph !== 'E').map((e) => e.ts / 1000).sort((x, y) => x - y);
  const d = ts.slice(1).map((x, i) => x - ts[i]).sort((x, y) => x - y);
  filas.push({ nombre, fps: +(ts.length / seg).toFixed(1), peor: d.length ? +(1000 / d[Math.floor(d.length * .95)]).toFixed(1) : 0, cuadros: ts.length, raf: r.fps });
}
async function mover(p, puntos, paso = 16) { for (const [x, y] of puntos) { await p.mouse.move(x, y); await pausa(p, paso); } }
const tramo = (a, c, n) => Array.from({ length: n }, (_, i) => [a[0] + ((c[0] - a[0]) * (i + 1)) / n, a[1] + ((c[1] - a[1]) * (i + 1)) / n]);
const centro = async (p, sel) => { const r = await p.locator(sel).first().boundingBox(); return [r.x + r.width / 2, r.y + r.height / 2]; };

// ── Escritorio 1440 × 900 ──
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  const p = await ctx.newPage();
  const errores = []; let peso = 0, n = 0; const pesos = {};
  p.on('pageerror', (e) => errores.push(e.message));
  p.on('console', (m) => { if (m.type() === 'error') errores.push(m.text()); });
  p.on('response', async (r) => { try { const l = (await r.body()).length; peso += l; n++; pesos[r.url().split('/').pop()] = l; } catch {} });
  await p.goto(base, { waitUntil: 'commit' });
  await p.waitForFunction(() => window.__fps);
  await medir(p, 'Carga: sube el rótulo y caen los objetos', () => pausa(p, 2400), 0);
  await p.waitForLoadState('networkidle');
  console.log(`PRIMERA CARGA: ${(peso / 1024).toFixed(0)} KB en ${n} peticiones`);
  const antes = peso, nAntes = n;
  if (caps) await p.screenshot({ path: `${caps}/mesa-1440.png` });

  const ids = ['servidor', 'vision', 'adivinadle', 'wardux', 'calculo', 'marbella', 'erp', 'vados', 'agentes'];
  const pts = []; let ult = [40, 480];
  for (const id of ids) { const c = await centro(p, `.obj[data-id=${id}] .pz`); pts.push(...tramo(ult, c, 14), ...Array(22).fill(c)); ult = c; }
  await medir(p, 'Pasar el ratón por los nueve objetos (cada uno hace su gracia)', () => mover(p, pts));
  await p.mouse.move(700, 560); await pausa(p, 600);

  const caja = await centro(p, '.obj[data-id=adivinadle] .pz-tapa');
  await medir(p, 'Coger la caja, pasearla en círculo y soltarla con impulso', async () => {
    await p.mouse.move(...caja); await p.mouse.down();
    const giro = Array.from({ length: 90 }, (_, i) => [caja[0] + Math.sin(i / 14) * 260, caja[1] + 120 - Math.cos(i / 14) * 120]);
    await mover(p, giro); await mover(p, tramo(giro.at(-1), [giro.at(-1)[0] + 160, giro.at(-1)[1] - 40], 5), 12);
    await p.mouse.up();
  }, 900);
  const calc = await centro(p, '.obj[data-id=calculo] .pz');
  await medir(p, 'Arrastrar la calculadora de lado a lado', async () => {
    await p.mouse.move(...calc); await p.mouse.down();
    await mover(p, [...tramo(calc, [300, 620], 40), ...tramo([300, 620], [1100, 380], 40)]);
    await p.mouse.up();
  }, 900);

  const c2 = await centro(p, '.obj[data-id=adivinadle] .pz-tapa');
  await medir(p, 'Elegir la caja (se levanta y sale su etiqueta)', async () => { await p.mouse.click(...c2); await pausa(p, 900); }, 0);
  if (caps) await p.screenshot({ path: `${caps}/elegido-1440.png` });
  await medir(p, 'Abrir Adivinadle: la mesa se despeja, la caja crece y la tapa sale', async () => { await p.click('[data-abrir]'); await pausa(p, 2900); }, 0);
  await p.waitForLoadState('networkidle');
  console.log(`AL ABRIR ADIVINADLE: ${((peso - antes) / 1024).toFixed(0)} KB más en ${n - nAntes} peticiones`);
  await medir(p, 'Jugar: tres intentos (la ficha vuela y las casillas giran)', async () => {
    for (const i of [2, 7, 0]) { await p.click(`.ficha[data-i="${i}"]`); await pausa(p, 1200); }
  }, 0);
  if (caps) await p.screenshot({ path: `${caps}/jugando-1440.png` });
  const sol = await p.evaluate(() => [...document.querySelectorAll('.ficha:not(.usada)')].map((f) => +f.dataset.i));
  await medir(p, 'Resolver el caso (o agotar los intentos): sello y carta girada', async () => {
    for (const i of sol.slice(0, 3)) { if (await p.locator('.adv.acabado').count()) break; await p.click(`.ficha[data-i="${i}"]`); await pausa(p, 900); }
    await pausa(p, 1600);
  }, 0);
  if (caps) await p.screenshot({ path: `${caps}/final-1440.png` });
  await p.mouse.move(900, 500);
  await medir(p, 'Bajar por la página del proyecto con la rueda', async () => { for (let i = 0; i < 30; i++) { await p.mouse.wheel(0, 60); await pausa(p, 28); } });
  if (caps) await p.screenshot({ path: `${caps}/ficha-1440.png` });
  await p.evaluate(() => document.querySelector('#proyecto').scrollTo(0, 0)); await pausa(p, 300);
  await medir(p, 'Volver a la mesa: la tapa regresa y los objetos vuelven', async () => { await p.click('.pestana'); await pausa(p, 2600); }, 0);
  if (caps) await p.screenshot({ path: `${caps}/vuelta-1440.png` });
  await p.mouse.move(700, 500);
  await medir(p, 'Bajar de la mesa a la lista de proyectos con la rueda', async () => { for (let i = 0; i < 40; i++) { await p.mouse.wheel(0, 60); await pausa(p, 28); } });
  if (caps) await p.screenshot({ path: `${caps}/lista-1440.png` });
  await medir(p, 'Abrir otro proyecto desde la lista (Cálculo Exacto)', async () => { await p.click('.fila button[data-id=calculo]'); await pausa(p, 1500); }, 0);
  if (caps) await p.screenshot({ path: `${caps}/calculo-1440.png` });
  if (errores.length) console.log('ERRORES 1440:', errores.join(' | '));
  await ctx.close();
}

// ── Móvil 390 × 844 (con dedo) ──
{
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
  const p = await ctx.newPage();
  const errores = [];
  p.on('pageerror', (e) => errores.push(e.message));
  await p.goto(base, { waitUntil: 'commit' });
  await p.waitForFunction(() => window.__fps);
  await medir(p, 'Móvil · carga', () => pausa(p, 2400), 0);
  if (caps) await p.screenshot({ path: `${caps}/mesa-390.png` });
  if (caps) await p.screenshot({ path: `${caps}/mesa-390-entera.png`, fullPage: true });
  await medir(p, 'Móvil · bajar por la mesa', async () => { for (let i = 0; i < 30; i++) { await p.mouse.wheel(0, 40); await pausa(p, 28); } });
  await p.evaluate(() => scrollTo(0, 0)); await pausa(p, 400);
  await medir(p, 'Móvil · tocar la caja (etiqueta)', async () => { await p.locator('.obj[data-id=adivinadle] .pz-tapa').tap(); await pausa(p, 800); }, 0);
  if (caps) await p.screenshot({ path: `${caps}/elegido-390.png` });
  await medir(p, 'Móvil · abrir Adivinadle', async () => { await p.tap('[data-abrir]'); await pausa(p, 2900); }, 0);
  if (caps) await p.screenshot({ path: `${caps}/interior-390.png` });
  await p.locator('.adv-fichas').scrollIntoViewIfNeeded(); await pausa(p, 300);
  await medir(p, 'Móvil · jugar dos intentos', async () => { for (const i of [2, 7]) { await p.tap(`.ficha[data-i="${i}"]`); await pausa(p, 1200); } }, 0);
  await p.locator('.adv-leyenda').scrollIntoViewIfNeeded(); await pausa(p, 300);
  if (caps) await p.screenshot({ path: `${caps}/jugando-390.png` });
  await p.evaluate(() => document.querySelector('#proyecto').scrollTo(0, 0)); await pausa(p, 300);
  await medir(p, 'Móvil · volver a la mesa', async () => { await p.tap('.pestana'); await pausa(p, 2200); }, 0);
  if (caps) await p.screenshot({ path: `${caps}/vuelta-390.png` });
  if (errores.length) console.log('ERRORES 390:', errores.join(' | '));
  await ctx.close();
}
await b.close();
console.log('\npresentados/s | peor 5 % | rAF/s | fotogramas | interacción');
for (const f of filas) console.log(`${String(f.fps).padStart(6)} | ${String(f.peor).padStart(6)} | ${String(f.raf).padStart(6)} | ${String(f.cuadros).padStart(5)} | ${f.nombre}`);
const malas = filas.filter((f) => f.fps < 30);
console.log(malas.length ? `\nPOR DEBAJO DE 30: ${malas.map((f) => f.nombre).join('; ')}` : '\nTodas las interacciones por encima de 30 fps.');
