// Mide las cuatro técnicas: peso, fotogramas presentados por interacción (traza del compositor) y ritmo del
// bucle de la página (requestAnimationFrame), con la gráfica (Vulkan, RTX) y por software (SwiftShader).
// Uso: PLAYWRIGHT_MJS=<index.mjs de Playwright> node medir/medir.mjs <dirección base> <salida.json> [técnicas] [modos]
import { writeFileSync } from 'node:fs';
const { chromium } = await import(process.env.PLAYWRIGHT_MJS ?? 'playwright');
const base = process.argv[2] ?? 'http://127.0.0.1:4380/';
const salida = process.argv[3] ?? 'medidas.json';
const tecnicas = (process.argv[4] ?? 'a,b,c,d').split(',');
const modos = (process.argv[5] ?? 'gpu,software').split(',');
const ARGS = { gpu: ['--use-angle=vulkan', '--enable-gpu', '--ignore-gpu-blocklist', '--enable-features=Vulkan'], software: [] };
const pausa = (p, ms) => p.waitForTimeout(ms);
const filas = [];

async function medir(p, accion) {
  const cdp = p.__cdp ??= await p.context().newCDPSession(p);
  const ev = []; const oir = (d) => ev.push(...d.value);
  cdp.on('Tracing.dataCollected', oir);
  await cdp.send('Tracing.start', { categories: 'viz', transferMode: 'ReportEvents' });
  await p.evaluate(() => window.__fps.iniciar());
  const t0 = Date.now(); await accion(); const seg = (Date.now() - t0) / 1000;
  const raf = await p.evaluate(() => window.__fps.parar());
  const fin = new Promise((ok) => cdp.once('Tracing.tracingComplete', ok));
  await cdp.send('Tracing.end'); await fin; cdp.off('Tracing.dataCollected', oir);
  const ts = ev.filter((e) => e.name === 'Display::DrawAndSwap' && e.ph !== 'E').map((e) => e.ts / 1000).sort((x, y) => x - y);
  const d = ts.slice(1).map((x, i) => x - ts[i]).sort((x, y) => x - y);
  return { presentados: +(ts.length / seg).toFixed(1), peor: d.length ? +(1000 / d[Math.floor(d.length * 0.95)]).toFixed(1) : 0, raf: raf.fps, rafPeor: raf.peor };
}

for (const modo of modos) {
  const b = await chromium.launch({ args: ARGS[modo] });
  for (const t of tecnicas) {
    for (const [w, h, movil] of [[1440, 900, false], [390, 844, true]]) {
      const ctx = await b.newContext({ bypassCSP: true, viewport: { width: w, height: h }, deviceScaleFactor: movil ? 2 : 1, hasTouch: movil, isMobile: movil });
      const p = await ctx.newPage(); const errores = []; let peso = 0, n = 0;
      p.on('pageerror', (e) => errores.push(e.message)); p.on('console', (m) => { if (m.type() === 'error') errores.push(m.text()); });
      p.on('requestfinished', () => { n++; });
      const t0 = Date.now();
      await p.goto(`${base}${t}/#balda`, { waitUntil: 'load' });
      // lista para usarse: A cuando se ve su primer fotograma; B cuando se quita el velo; C y D al cargar
      await p.waitForFunction(() => !document.querySelector('.cargando-velo') || document.querySelector('.cargando-velo').classList.contains('fuera'), null, { timeout: 30000 });
      const lista = Date.now() - t0;
      const pesar = () => p.evaluate(() => [performance.getEntriesByType('navigation')[0], ...performance.getEntriesByType('resource')].reduce((s, e) => s + (e.encodedBodySize || 0), 0));
      const pesoLista = await pesar();
      await p.waitForLoadState('networkidle'); await pausa(p, 1200);
      if (t === 'a') await p.waitForFunction(() => document.getElementById('carga')?.classList.contains('fuera'), null, { timeout: 60000 }).catch(() => {});
      peso = await pesar();
      const render = await p.evaluate(() => window.__render ?? null);
      const fila = { modo, tecnica: t, ancho: w, pesoLista: Math.round(pesoLista / 1024), pesoTotal: Math.round(peso / 1024), peticiones: n, listaMs: lista, render, medidas: {} };
      const ir = (paso, ms) => async () => { await p.click(`[data-paso="${paso}"]`); await pausa(p, ms); };
      fila.medidas.sacar = await medir(p, ir('portada', 2200));
      fila.medidas.girar = await medir(p, ir('dorso', 2200));
      // arrastrar para girar: medio segundo de gesto y el muelle que vuelve
      fila.medidas.arrastrar = await medir(p, async () => {
        const x = w / 2, y = h / 2; await p.mouse.move(x, y); await p.mouse.down();
        for (let i = 1; i <= 30; i++) { await p.mouse.move(x - i * 8, y); await pausa(p, 16); }
        await p.mouse.up(); await pausa(p, 1600);
      });
      await p.click('[data-paso="dorso"]').catch(() => {}); await pausa(p, 1500);
      fila.medidas.abrir = await medir(p, ir('abierta', 2600));
      fila.medidas.volver = await medir(p, ir('balda', 2600));
      // comprobaciones: dirección directa, atrás, teclado y sin desbordar
      await p.goto(`${base}${t}/#abierta`); await pausa(p, 1500);
      const directa = await p.evaluate(() => document.documentElement.dataset.paso === 'abierta');
      await p.keyboard.press('ArrowLeft'); await pausa(p, 400);
      const teclado = await p.evaluate(() => document.documentElement.dataset.paso === 'dorso');
      await p.goBack(); await pausa(p, 400);
      const atras = await p.evaluate(() => document.documentElement.dataset.paso === 'abierta');
      const ancho = await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth);
      fila.comprobado = { directa, teclado, atras, sinDesborde: ancho };
      fila.errores = errores;
      filas.push(fila);
      const m = fila.medidas;
      console.log(`${modo.padEnd(8)} ${t} ${String(w).padStart(4)} | lista ${String(lista).padStart(5)} ms, ${fila.pesoLista} KB (total ${fila.pesoTotal} KB) | ` +
        Object.entries(m).map(([k, v]) => `${k} ${v.presentados}/${v.peor} raf ${v.raf}/${v.rafPeor}`).join(' · ') +
        ` | ${JSON.stringify(fila.comprobado)}${errores.length ? ' ERRORES ' + errores.join(' | ') : ''}${render ? ' | ' + render : ''}`);
      await ctx.close();
    }
  }
  await b.close();
}
writeFileSync(salida, JSON.stringify(filas, null, 1));
