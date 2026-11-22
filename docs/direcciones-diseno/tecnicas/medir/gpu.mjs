// Qué tarjeta dibuja WebGL con cada juego de opciones de Chromium.
const { chromium } = await import(process.env.PLAYWRIGHT_MJS ?? 'playwright');
const juegos = {
  software: [],
  vulkan: ['--use-angle=vulkan', '--enable-gpu', '--ignore-gpu-blocklist', '--enable-features=Vulkan'],
  egl: ['--use-gl=egl', '--enable-gpu', '--ignore-gpu-blocklist'],
  'angle-gl': ['--use-angle=gl', '--enable-gpu', '--ignore-gpu-blocklist'],
  'nuevo-headless-vulkan': ['--headless=new', '--use-angle=vulkan', '--enable-gpu', '--ignore-gpu-blocklist', '--enable-features=Vulkan'],
};
for (const [n, args] of Object.entries(juegos)) {
  try {
    const b = await chromium.launch({ args });
    const p = await b.newPage();
    const r = await p.evaluate(() => { const gl = document.createElement('canvas').getContext('webgl2'); if (!gl) return 'sin webgl2'; const i = gl.getExtension('WEBGL_debug_renderer_info'); return i ? gl.getParameter(i.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER); });
    console.log(n.padEnd(22), r); await b.close();
  } catch (e) { console.log(n, 'ERROR', e.message.split('\n')[0]); }
}
