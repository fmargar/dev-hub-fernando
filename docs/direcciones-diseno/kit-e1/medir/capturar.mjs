// Fotos de una maqueta en los estados que se pidan, con la gráfica (o por software con MODO=software).
// Uso: PLAYWRIGHT_MJS=<index.mjs> node capturar.mjs <dirección> <carpeta> <ancho>x<alto> <ruta>[@ms] [<ruta>[@ms]…]
//   Cada ruta se visita navegando por el hash (como un enlace o el botón «atrás»), espera ms (2500 por defecto) y
//   hace la foto. Una ruta «!js:código» ejecuta código en la página en lugar de navegar. Los errores salen al final.
const { chromium } = await import(process.env.PLAYWRIGHT_MJS ?? 'playwright');
const [base, dir, tam, ...rutas] = process.argv.slice(2);
const [w, h] = tam.split('x').map(Number), movil = w < 760;
const ARGS = process.env.MODO === 'software' ? [] : ['--use-angle=vulkan', '--enable-gpu', '--ignore-gpu-blocklist', '--enable-features=Vulkan'];
const b = await chromium.launch({ args: ARGS });
const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: movil ? 2 : 1, hasTouch: movil, isMobile: movil, reducedMotion: process.env.RM ? 'reduce' : 'no-preference' });
const p = await ctx.newPage(); const errores = [];
p.on('pageerror', (e) => errores.push(e.message)); p.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errores.push(m.text()); });
const primera = rutas[0].split('@')[0];
await p.goto(`${base}#${primera.startsWith('!') ? 'salon' : primera}`, { waitUntil: 'load' });
await p.waitForFunction(() => document.querySelector('.cargando-velo')?.classList.contains('fuera'), null, { timeout: 60000 }).catch(() => errores.push('el velo no se quitó'));
let k = 0;
for (const r of rutas) {
  const [ruta, ms = '2500'] = r.split('@');
  if (k > 0 || ruta.startsWith('!')) {
    if (ruta.startsWith('!js:')) await p.evaluate(ruta.slice(4));
    else await p.evaluate((x) => { location.hash = x; }, ruta);
  }
  await p.waitForTimeout(+ms);
  const nombre = `${String(k).padStart(2, '0')}-${ruta.replace(/[^a-z0-9]+/gi, '_').slice(0, 30)}-${w}.png`;
  await p.screenshot({ path: `${dir}/${nombre}` }); console.log(nombre); k++;
}
console.log('render:', await p.evaluate(() => window.__render));
if (errores.length) console.log('ERRORES:\n' + [...new Set(errores)].join('\n'));
await b.close();
