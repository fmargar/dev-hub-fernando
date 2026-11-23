// Intenta romper una maqueta: saltos de ruta a mitad de animación, doble clic, «atrás» del navegador, cambio de
// tamaño a mitad de camino. Tras cada prueba espera a que todo quede quieto y comprueba que el estado final es el que
// pide la ruta (con window.__estado, que expone cada maqueta) y que no hay errores en la consola.
// Uso: PLAYWRIGHT_MJS=<index.mjs> node romper.mjs <dirección> <pruebas.json> [carpeta de fotos]
//   pruebas.json: [{ "nombre": "…", "pasos": [["ruta", "#x/y", ms] | ["clic", "selector", ms] | ["dobleclic", "selector", ms]
//                  | ["atras", ms] | ["tam", ancho, alto, ms] | ["tecla", "Escape", ms]], "espera": { campo: valor } }]
import { readFileSync } from 'node:fs';
const { chromium } = await import(process.env.PLAYWRIGHT_MJS ?? 'playwright');
const [base, fich, fotos] = process.argv.slice(2);
const pruebas = JSON.parse(readFileSync(fich, 'utf8'));
const ARGS = process.env.MODO === 'software' ? [] : ['--use-angle=vulkan', '--enable-gpu', '--ignore-gpu-blocklist', '--enable-features=Vulkan'];
const b = await chromium.launch({ args: ARGS });
let fallos = 0;
for (const [k, t] of pruebas.entries()) {
  const [w, h] = t.tam ?? [1440, 900], movil = w < 760;
  const ctx = await b.newContext({ viewport: { width: w, height: h }, hasTouch: movil, isMobile: movil, deviceScaleFactor: 1 });
  const p = await ctx.newPage(); const errores = [];
  p.on('pageerror', (e) => errores.push(e.message)); p.on('console', (m) => { if (m.type() === 'error') errores.push(m.text()); });
  await p.goto(`${base}${t.inicio ?? '#salon'}`, { waitUntil: 'load' });
  await p.waitForFunction(() => document.querySelector('.cargando-velo')?.classList.contains('fuera'), null, { timeout: 60000 });
  await p.waitForTimeout(600);
  for (const s of t.pasos) {
    const [tipo, ...a] = s, ms = a.at(-1);
    if (tipo === 'ruta') await p.evaluate((x) => { location.hash = x; }, a[0]);
    else if (tipo === 'clic') await p.click(a[0], { force: true });
    else if (tipo === 'dobleclic') await p.dblclick(a[0], { force: true });
    else if (tipo === 'atras') await p.goBack();
    else if (tipo === 'tam') await p.setViewportSize({ width: a[0], height: a[1] });
    else if (tipo === 'tecla') await p.keyboard.press(a[0]);
    await p.waitForTimeout(ms);
  }
  await p.waitForFunction(() => window.__estado().quieto, null, { timeout: 20000 }).catch(() => errores.push('no se queda quieta'));
  await p.waitForTimeout(t.reposo ?? 400);
  const e = await p.evaluate(() => window.__estado());
  const mal = Object.entries(t.espera ?? {}).filter(([c, v]) => {
    const x = c.split('.').reduce((o, kk) => o?.[kk], e);
    return typeof v === 'number' ? Math.abs(x - v) > 0.02 : x !== v;
  });
  const ok = !mal.length && !errores.length;
  if (!ok) fallos++;
  console.log(`${ok ? 'BIEN' : 'MAL '}  ${t.nombre}${mal.length ? `  · esperaba ${mal.map(([c, v]) => `${c}=${v}`).join(', ')}; hay ${JSON.stringify(e)}` : ''}${errores.length ? `  · errores: ${[...new Set(errores)].join(' | ')}` : ''}`);
  if (fotos) await p.screenshot({ path: `${fotos}/romper-${String(k).padStart(2, '0')}.png` });
  await ctx.close();
}
console.log(fallos ? `${fallos} con fallos` : 'todo bien');
await b.close();
