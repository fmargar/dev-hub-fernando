// Pinta lo impreso de la caja (técnica A) en un navegador sin cabeza y lo guarda en PNG para Blender.
// Uso: PLAYWRIGHT_MJS=<index.mjs de Playwright> node herramientas/texturas.mjs <dirección de tecnicas/> <diorama.png> <carpeta de salida>
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
const { chromium } = await import(process.env.PLAYWRIGHT_MJS ?? 'playwright');
const [base, diorama, salida] = process.argv.slice(2);
mkdirSync(salida, { recursive: true });
const b = await chromium.launch();
const p = await b.newPage();
p.on('pageerror', (e) => console.error('ERROR', e.message));
await p.route('**/diorama.png', (r) => r.fulfill({ body: readFileSync(diorama), contentType: 'image/png' }));
await p.goto(`${base}herramientas/texturas.html`);
await p.waitForFunction(() => window.listo);
const datos = await p.evaluate(() => window.pintar());
for (const [k, url] of Object.entries(datos)) writeFileSync(`${salida}/${k}.png`, Buffer.from(url.split(',')[1], 'base64'));
console.log('texturas:', Object.keys(datos).join(' '));
await b.close();
