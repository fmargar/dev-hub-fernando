// Las direcciones del recorrido: cada paso tiene la suya (#salon, #adivinadle, #adivinadle/abierta…), así se puede
// entrar directo, compartir el enlace y volver con «atrás». La maqueta dice qué rutas valen y qué hacer en cada una.
export function montarRutas({ inicio, validar, alCambiar }) {
  let actual = null;
  function ir(ruta, { inmediato = false, historia = true } = {}) {
    ruta = validar(ruta) ?? inicio;
    if (ruta === actual) return;
    const antes = actual; actual = ruta;
    if (historia) history.pushState({ ruta }, '', `#${ruta}`);
    alCambiar(ruta, { inmediato, antes });
  }
  addEventListener('popstate', () => ir(decodeURIComponent(location.hash.slice(1)) || inicio, { historia: false }));
  const primera = validar(decodeURIComponent(location.hash.slice(1))) ?? inicio;
  history.replaceState({ ruta: primera }, '', `#${primera}`);
  return {
    ir, arrancar() { ir(primera, { inmediato: true, historia: false }); },
    get actual() { return actual; },
    // sustituir la entrada actual (para pasos intermedios que no deben llenar el historial)
    cambiar(ruta) { actual = ruta; history.replaceState({ ruta }, '', `#${ruta}`); },
  };
}
