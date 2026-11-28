// La foto de cada vitrina apagada: la escena sola, sin su cabecera ni su titular, a 16:10.
// Uso: PLAYWRIGHT_MJS=<index.mjs> node fotos.mjs <dirección de maquetas-e1/> <carpeta de salida> <idea> [<idea>…]
const { chromium } = await import(process.env.PLAYWRIGHT_MJS ?? 'playwright');
const [base, dir, ...ideas] = process.argv.slice(2);
const b = await chromium.launch({ args: ['--use-angle=vulkan', '--enable-gpu', '--ignore-gpu-blocklist', '--enable-features=Vulkan'] });
const p = await (await b.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1.5 })).newPage();
for (const idea of ideas) {
  await p.goto(`${base}${idea}/`, { waitUntil: 'load' });
  await p.addStyleTag({ content: '.barra, .heroe { display: none !important; }' });
  await p.evaluate(() => dispatchEvent(new Event('resize')));
  await p.waitForFunction(() => document.querySelector('.cargando-velo')?.classList.contains('fuera'), null, { timeout: 90000 });
  await p.waitForTimeout(2500);
  await p.screenshot({ path: `${dir}/${idea}.png` });
  console.log(idea);
}
await b.close();
