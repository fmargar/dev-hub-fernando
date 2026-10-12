// Capturas de una maqueta viva: portada, una ficha abierta y la página entera, en móvil y escritorio.
// Uso: node cap-vivo.mjs l-acuario [selector-del-botón-a-pulsar]
import { chromium } from '/home/fernando/dev/ms-rewards-bot-propio/node_modules/playwright/index.mjs';
const [f, sel = '.criatura'] = process.argv.slice(2);
const b = await chromium.launch({ args: ['--use-gl=angle', '--enable-unsafe-swiftshader'] });
// Calentar la GPU por software: el primer contexto WebGL del navegador se pierde al poco de nacer
{ const c = await b.newPage(); await c.setContent('<canvas></canvas>'); await c.evaluate(() => document.querySelector('canvas').getContext('webgl')); await c.waitForTimeout(1500); await c.close(); }
for (const [w, h, t, s] of [[390, 844, 'movil-390', 2], [1440, 900, 'escritorio-1440', 1]]) {
  const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: s });
  const errores = []; p.on('pageerror', e => errores.push(e.message)); p.on('console', m => m.type() === 'error' && errores.push(m.text()));
  await p.goto((process.env.BASE || 'file://' + process.cwd()) + '/' + f + '.html', { waitUntil: 'networkidle' });
  await p.waitForTimeout(3500);
  await p.screenshot({ path: `${f}-${t}.png` });
  await p.locator(sel).first().click({ force: true }); await p.waitForTimeout(2500);
  await p.screenshot({ path: `${f}-ficha-${t}.png` });
  console.log(t, errores.length ? errores : 'sin errores');
  await p.close();
  // La página completa, en otra pestaña a DPR 1: con WebGL por software, un lienzo de miles de
  // píxeles de alto a DPR 2 hace perder el contexto y la captura sale velada
  const q = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  await q.goto((process.env.BASE || 'file://' + process.cwd()) + '/' + f + '.html', { waitUntil: 'networkidle' });
  await q.waitForTimeout(2500);
  await q.evaluate(() => scrollTo(0, document.documentElement.scrollHeight)); await q.waitForTimeout(1500);
  await q.evaluate(() => scrollTo(0, 0)); await q.waitForTimeout(800);
  await q.screenshot({ path: `${f}-${t}-completa.png`, fullPage: true });
  await q.close();
}
await b.close();
