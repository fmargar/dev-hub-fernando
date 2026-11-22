// Las imágenes de las tarjetas del índice: cada técnica abierta, sin la interfaz. Uso: node medir/tarjetas.mjs <base> <carpeta>
const { chromium } = await import(process.env.PLAYWRIGHT_MJS ?? 'playwright');
const [base, dir] = process.argv.slice(2);
const b = await chromium.launch({ args: ['--use-angle=vulkan', '--enable-gpu', '--ignore-gpu-blocklist', '--enable-features=Vulkan'] });
for (const t of ['a', 'b', 'c', 'd']) {
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto(`${base}${t}/#portada`, { waitUntil: 'networkidle' });
  await p.addStyleTag({ content: '.cabeza,.pie,.detalle,.carga{display:none!important}' });
  await p.waitForTimeout(t === 'a' ? 3000 : 1500);
  await p.screenshot({ path: `${dir}/${t}.png` });
  await p.close();
}
await b.close();
