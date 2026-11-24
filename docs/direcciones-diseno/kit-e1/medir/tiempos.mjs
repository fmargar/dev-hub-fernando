// Cuánto tarda cada paso del recorrido en quedarse quieto (y, si enciende una pantalla, en tenerla puesta), las
// tareas largas del hilo principal en cada paso y una foto al final de cada uno. Apunta la carga del servidor.
// Uso: PLAYWRIGHT_MJS=<index.mjs> [MODO=software] node tiempos.mjs <dirección> <carpeta> <ancho>x<alto> <ruta> [<ruta>…]
//   ruta: «#x/y» (como un enlace) o «!js:código» o «!clic:selector»
//   PANTALLA=<regex> (opcional): las rutas que encienden una pantalla (por omisión, las que acaban en /tele o /embarque)
import { loadavg } from 'node:os';
const { chromium } = await import(process.env.PLAYWRIGHT_MJS ?? 'playwright');
const [base, dir, tam, ...rutas] = process.argv.slice(2);
const [w, h] = tam.split('x').map(Number), movil = w < 760;
const PANTALLA = process.env.PANTALLA ?? '/(tele|embarque)$';
const ARGS = process.env.MODO === 'software' ? [] : ['--use-angle=vulkan', '--enable-gpu', '--ignore-gpu-blocklist', '--enable-features=Vulkan'];
const b = await chromium.launch({ args: ARGS });
const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: movil ? 2 : 1, hasTouch: movil, isMobile: movil });
const p = await ctx.newPage(); const errores = [];
p.on('pageerror', (e) => errores.push(e.message));
await p.addInitScript(() => {
  window.__largas = [];
  new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__largas.push(`${Math.round(e.duration)}@${Math.round(e.startTime - (window.__t0 ?? 0))}`); }).observe({ type: 'longtask', buffered: true });
});
await p.goto(`${base}#salon`, { waitUntil: 'load' });
await p.waitForFunction(() => document.querySelector('.cargando-velo')?.classList.contains('fuera'), null, { timeout: 90000 });
await p.waitForTimeout(1200);
const carga = loadavg()[0].toFixed(1);
console.log(`${tam} ${process.env.MODO ?? 'gpu'} · carga del servidor ${carga} · ${await p.evaluate(() => window.__render)}`);
let k = 0;
for (const r of rutas) {
  await p.evaluate(() => { window.__largas = []; window.__t0 = performance.now(); });
  const t0 = Date.now();
  if (r.startsWith('!js:')) await p.evaluate(r.slice(4));
  else if (r.startsWith('!clic:')) await p.click(r.slice(6));
  else await p.evaluate((x) => { location.hash = x; }, r);
  await p.waitForTimeout(60);
  await p.waitForFunction((re) => {
    const e = window.__estado(), pantalla = new RegExp(re).test(e.ruta);
    return e.quieto && (!pantalla || e.enTele === 'encendida');
  }, PANTALLA, { timeout: 30000, polling: 30 }).catch(() => errores.push(`${r}: no se quedó quieto en 30 s`));
  const ms = Date.now() - t0;
  const largas = await p.evaluate(() => window.__largas);
  // la foto de una pantalla, cuando ya ha entrado su contenido (el tiempo medido no cambia)
  if (new RegExp(PANTALLA).test(await p.evaluate(() => window.__estado().ruta))) await p.waitForTimeout(1500);
  const nombre = `${String(k).padStart(2, '0')}-${r.replace(/[^a-z0-9]+/gi, '_').slice(0, 28)}-${w}.png`;
  await p.screenshot({ path: `${dir}/${nombre}` });
  console.log(`  ${r.padEnd(30)} ${String(ms).padStart(5)} ms   tareas largas: ${largas.length ? largas.join(', ') + ' (ms@ms desde el gesto)' : 'ninguna'}`);
  k++;
}
console.log(`  carga al acabar ${loadavg()[0].toFixed(1)}`);
if (errores.length) console.log('ERRORES:\n' + [...new Set(errores)].join('\n'));
await b.close();
