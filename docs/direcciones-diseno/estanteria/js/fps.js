// Contador de fotogramas. Con ?fps en la dirección se ve en pantalla; el guion de medida usa window.__fps.
let marcas = [], midiendo = false, visible = false, girando = false, caja = null, tUlt = 0, n = 0;
// El testigo cambia en cada fotograma mientras se mide: así el navegador tiene que presentar todos
// y la cuenta de fotogramas presentados dice la verdad también cuando la página está quieta.
const testigo = document.createElement('i');
testigo.style.cssText = 'position:fixed;left:0;top:0;width:3px;height:3px;background:#000;opacity:.04;z-index:99;pointer-events:none';
function bucle(t) {
  if (midiendo) { marcas.push(t); testigo.style.transform = `translateX(${marcas.length % 2}px)`; }
  if (visible) { n++; if (t - tUlt >= 500) { caja.textContent = `${Math.round((n * 1000) / (t - tUlt))} fps`; n = 0; tUlt = t; } }
  if (midiendo || visible) requestAnimationFrame(bucle); else girando = false;
}
function arrancar() { if (!girando) { girando = true; requestAnimationFrame(bucle); } }
window.__fps = {
  iniciar() { marcas = []; midiendo = true; document.body.append(testigo); arrancar(); },
  parar() {
    midiendo = false; testigo.remove();
    const d = []; for (let i = 1; i < marcas.length; i++) d.push(marcas[i] - marcas[i - 1]);
    if (!d.length) return { fps: 0, peor: 0, cuadros: 0 };
    const total = marcas[marcas.length - 1] - marcas[0], orden = [...d].sort((a, b) => a - b);
    return { fps: +((d.length * 1000) / total).toFixed(1), peor: +(1000 / orden[Math.floor(orden.length * .95)]).toFixed(1), cuadros: d.length, ms: Math.round(total) };
  },
};
if (new URLSearchParams(location.search).has('fps')) {
  caja = document.createElement('div'); caja.className = 'fps'; caja.textContent = '… fps';
  document.body.append(caja); visible = true; arrancar();
}
