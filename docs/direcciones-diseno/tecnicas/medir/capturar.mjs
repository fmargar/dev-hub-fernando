// Capturas de los cuatro pasos de una técnica. Uso: node medir/capturar.mjs <dirección de la técnica> <carpeta> <prefijo> [gpu]
const { chromium } = await import(process.env.PLAYWRIGHT_MJS ?? 'playwright');
const [url, dir, pre, gpu] = process.argv.slice(2);
const args = gpu ? ['--use-angle=vulkan', '--enable-gpu', '--ignore-gpu-blocklist', '--enable-features=Vulkan'] : [];
const b = await chromium.launch({ args });
for (const [w, h, m] of [[1440, 900, false], [390, 844, true]]) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: m ? 2 : 1, isMobile: m, hasTouch: m });
  const p = await ctx.newPage(); const err = [];
  p.on('pageerror', (e) => err.push(e.message)); p.on('console', (c) => { if (c.type() === 'error') err.push(c.text()); });
  await p.goto(`${url}#balda`, { waitUntil: 'networkidle' }); await p.waitForTimeout(1500);
  for (const paso of ['balda', 'portada', 'dorso', 'abierta']) {
    if (paso !== 'balda') { await p.click(`[data-paso="${paso}"]`); await p.waitForTimeout(paso === 'abierta' ? 3200 : 2600); }
    await p.screenshot({ path: `${dir}/${pre}-${paso}-${w}.png` });
  }
  if (err.length) console.log(w, 'ERRORES', err.slice(0, 5));
  await ctx.close();
}
await b.close();
