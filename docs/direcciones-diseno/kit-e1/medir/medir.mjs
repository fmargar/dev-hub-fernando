// Mide la fluidez de una maqueta del kit E1: en cada paso del recorrido, los fotogramas presentados (traza del
// compositor) y el ritmo del bucle de la página (requestAnimationFrame), con la gráfica (Vulkan) y por software
// (SwiftShader, que activa el modo ligero), a 1440 × 900 y 390 × 844. También el peso y el tiempo hasta poder usarla.
// Uso: PLAYWRIGHT_MJS=<index.mjs> node medir.mjs <dirección> <recorrido.json> <salida.json> [modos]
//   recorrido.json: [["nombre", "#ruta" | "!js:código", ms], …]   (ms: lo que se mide tras saltar a esa ruta)
import { readFileSync, writeFileSync } from 'node:fs';
const { chromium } = await import(process.env.PLAYWRIGHT_MJS ?? 'playwright');
const [base, fRec, salida, modosTxt = 'gpu,software'] = process.argv.slice(2);
const recorrido = JSON.parse(readFileSync(fRec, 'utf8'));
const ARGS = { gpu: ['--use-angle=vulkan', '--enable-gpu', '--ignore-gpu-blocklist', '--enable-features=Vulkan'], software: [] };
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

for (const modo of modosTxt.split(',')) {
  const b = await chromium.launch({ args: ARGS[modo] });
  for (const [w, h, movil] of [[1440, 900, false], [390, 844, true]]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: movil ? 2 : 1, hasTouch: movil, isMobile: movil });
    const p = await ctx.newPage(); const errores = [];
    p.on('pageerror', (e) => errores.push(e.message));
    const t0 = Date.now();
    await p.goto(`${base}#salon`, { waitUntil: 'load' });
    await p.waitForFunction(() => document.querySelector('.cargando-velo')?.classList.contains('fuera'), null, { timeout: 60000 });
    const lista = Date.now() - t0;
    const pesar = () => p.evaluate(() => [performance.getEntriesByType('navigation')[0], ...performance.getEntriesByType('resource')].reduce((s, e) => s + (e.encodedBodySize || 0), 0));
    const pesoLista = await pesar();
    await p.waitForLoadState('networkidle'); await p.waitForTimeout(800);
    const fila = { modo, ancho: w, render: await p.evaluate(() => window.__render), listaMs: lista, pesoLista: Math.round(pesoLista / 1024), pesoTotal: Math.round(await pesar() / 1024), medidas: {} };
    for (const [nombre, ruta, ms] of recorrido) {
      fila.medidas[nombre] = await medir(p, async () => { await p.evaluate((x) => { if (x.startsWith('!js:')) (0, eval)(x.slice(4)); else location.hash = x; }, ruta); await p.waitForTimeout(ms); });
    }
    fila.errores = errores;
    filas.push(fila);
    const peor = Math.min(...Object.values(fila.medidas).map((m) => Math.min(m.raf, m.presentados)));
    console.log(`${modo} ${w}px  lista ${lista} ms  ${fila.pesoLista}/${fila.pesoTotal} KB  peor ${peor} fps  ${fila.render}`);
    for (const [n, m] of Object.entries(fila.medidas)) console.log(`   ${n.padEnd(14)} presentados ${String(m.presentados).padStart(5)}  (p95 ${m.peor})   rAF ${String(m.raf).padStart(5)} (peor ${m.rafPeor})`);
    await ctx.close();
  }
  await b.close();
}
writeFileSync(salida, JSON.stringify(filas, null, 1));
