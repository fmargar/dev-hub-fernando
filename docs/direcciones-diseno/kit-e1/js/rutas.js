// Las direcciones del recorrido: cada paso tiene la suya (#salon, #adivinadle, #adivinadle/abierta…), así se puede
// entrar directo, compartir el enlace y volver con «atrás». La maqueta dice qué rutas valen y qué hacer en cada una.
//
// `volverA(ruta)` es lo que hace Esc: si esa ruta está atrás en el historial de esta visita, se vuelve allí con el
// propio historial (así «atrás» del navegador no te mete otra vez donde estabas); si no, se va a ella.
export function montarRutas({ inicio, validar, alCambiar }) {
  let actual = null, pos = 0;
  const pila = [];                                   // las entradas de historial de esta visita, por posición
  function ir(ruta, { inmediato = false, historia = true } = {}) {
    ruta = validar(ruta) ?? inicio;
    if (ruta === actual) return;
    const antes = actual; actual = ruta;
    if (historia) { pos++; pila.length = pos; pila[pos] = ruta; history.pushState({ ruta, pos }, '', `#${ruta}`); }
    alCambiar(ruta, { inmediato, antes });
  }
  addEventListener('popstate', (e) => {
    // un enlace #ruta de la página crea una entrada nueva sin estado: se numera como las demás
    if (Number.isInteger(e.state?.pos)) pos = e.state.pos; else pos++;
    ir(decodeURIComponent(location.hash.slice(1)) || inicio, { historia: false });
    pila.length = Math.max(pila.length, pos + 1); pila[pos] = actual;
    if (!Number.isInteger(e.state?.pos)) { pila.length = pos + 1; history.replaceState({ ruta: actual, pos }, '', `#${actual}`); }
  });
  const primera = validar(decodeURIComponent(location.hash.slice(1))) ?? inicio;
  history.replaceState({ ruta: primera, pos: 0 }, '', `#${primera}`); pila[0] = primera;
  return {
    ir, arrancar() { ir(primera, { inmediato: true, historia: false }); },
    get actual() { return actual; },
    // sustituir la entrada actual (para pasos intermedios que no deben llenar el historial)
    cambiar(ruta) { actual = ruta; pila[pos] = ruta; history.replaceState({ ruta, pos }, '', `#${ruta}`); },
    volverA(ruta) {
      ruta = validar(ruta) ?? inicio;
      if (ruta === actual) return;
      for (let j = pos - 1; j >= 0; j--) if (pila[j] === ruta) { history.go(j - pos); return; }
      ir(ruta);
    },
  };
}
