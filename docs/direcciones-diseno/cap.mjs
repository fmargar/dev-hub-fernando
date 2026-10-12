import { chromium } from '/home/fernando/dev/ms-rewards-bot-propio/node_modules/playwright/index.mjs';
const b = await chromium.launch();
const lista = process.argv.slice(2).length ? process.argv.slice(2) : ['a-sala-de-control','b-cartel','c-mezcla'];
for (const f of lista) for (const [w,h,t] of [[390,844,'movil-390'],[1440,900,'escritorio-1440']]) {
  const p = await b.newPage({ viewport:{width:w,height:h}, deviceScaleFactor: t.startsWith('movil')?2:1 });
  await p.goto('file://' + process.cwd() + '/' + f + '.html', { waitUntil:'networkidle' });
  await p.waitForTimeout(1800);
  await p.screenshot({ path: `${f}-${t}.png` });
  await p.screenshot({ path: `${f}-${t}-completa.png`, fullPage:true });
}
await b.close();
