// Fotos de una página con animación al hacer scroll: una por cada punto pedido del recorrido.
import { chromium } from '/home/fernando/dev/ms-rewards-bot-propio/node_modules/playwright/index.mjs';
const [f, ...puntos] = process.argv.slice(2);
const b = await chromium.launch();
for (const [w, h, t] of [[1440, 900, 'escritorio'], [390, 844, 'movil']]) {
  const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  p.on('pageerror', e => console.log('ERROR', e.message));
  await p.goto('file://' + process.cwd() + '/' + f + '.html', { waitUntil: 'networkidle' });
  await p.waitForTimeout(800);
  for (const v of puntos) {
    await p.evaluate(y => window.scrollTo(0, y * innerHeight), Number(v));
    await p.waitForTimeout(1200);
    await p.screenshot({ path: `/tmp/explode/${f}-${t}-${v}.png` });
  }
}
await b.close();
