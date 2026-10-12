// Capturas de una maqueta viva: portada, una ficha abierta y la página entera, en móvil y escritorio.
// Uso: node cap-vivo.mjs l-acuario [selector-del-botón-a-pulsar]
import { chromium } from '/home/fernando/dev/ms-rewards-bot-propio/node_modules/playwright/index.mjs';
const [f, sel = '.criatura'] = process.argv.slice(2);
const b = await chromium.launch({ args: ['--use-gl=angle', '--enable-unsafe-swiftshader'] });
for (const [w, h, t, s] of [[390, 844, 'movil-390', 2], [1440, 900, 'escritorio-1440', 1]]) {
  const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: s });
  const errores = []; p.on('pageerror', e => errores.push(e.message)); p.on('console', m => m.type() === 'error' && errores.push(m.text()));
  await p.goto('file://' + process.cwd() + '/' + f + '.html', { waitUntil: 'networkidle' });
  await p.waitForTimeout(3500);
  await p.screenshot({ path: `${f}-${t}.png` });
  await p.evaluate(() => scrollTo(0, document.documentElement.scrollHeight)); await p.waitForTimeout(1500);
  await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(800);
  await p.screenshot({ path: `${f}-${t}-completa.png`, fullPage: true });
  await p.locator(sel).first().click({ force: true }); await p.waitForTimeout(2500);
  await p.screenshot({ path: `${f}-ficha-${t}.png` });
  console.log(t, errores.length ? errores : 'sin errores');
}
await b.close();
