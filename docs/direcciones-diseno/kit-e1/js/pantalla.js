// Lo que sale en una pantalla al «meter el disco»: el cristal se enciende, arranca la consola (algo más largo la
// primera vez de la visita; luego en corto) y después la demo jugable o, si el proyecto no trae demo, su tráiler.
// Lo usa cualquier maqueta: la tele del salón, la pantalla del quiosco… Estilos en css/tele.css.
//
// Una pantalla solo tiene un proyecto a la vez: si se enciende otro con la pantalla ya puesta, el anterior se corta
// en el acto y el nuevo entra con un arranque corto (como cambiar de disco). Un `apagar` viejo que llegue tarde no
// toca la pantalla si ya es de otro.
//
// El tráiler (unos 6 s): primero el proyecto de verdad (una captura de su web dentro de una ventana de navegador, o
// su carátula si no tiene web que se pueda enseñar), luego una segunda captura —o un esquema animado de lo que hace—
// con sus cifras al lado, y al final la tarjeta con su enlace.
import { cargarArte } from './coleccion.js';

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const RAIZ = new URL('../arte/', import.meta.url).href;
const captura = (p, n) => `${RAIZ}capturas/${p.id}-${n}.webp`;
let arrancada = false;

// las imágenes del tráiler, decodificadas antes de que haga falta pintarlas (si no, el primer fotograma sale vacío)
const cargadas = {};
function precargar(p) {
  const urls = p.demo ? [] : p.capturas ? [captura(p, 1), captura(p, 2)] : [`${RAIZ}portadas/${p.id}.webp`];
  return Promise.all(urls.map((u) => (cargadas[u] ??= (() => { const i = new Image(); i.src = u; return i.decode().catch(() => {}); })())));
}

// ── Los esquemas de los proyectos sin web pública: lo que hace, en movimiento, sin datos de nadie ──
const ESQUEMAS = {
  // 28 tareas con su propio reloj que acaban en un solo orquestador
  servidor: () => {
    const puntos = Array.from({ length: 28 }, (_, k) => {
      const c = k % 7, f = Math.floor(k / 7);
      return `<i style="--x:${(c - 3) * 12}cqw;--y:${(f - 1.5) * 15 - 8}cqh;--i:${(k * 7) % 28}"></i>`;
    }).join('');
    return `<div class="es es-servidor"><div class="es-puntos">${puntos}</div><b class="es-uno">1</b><p class="es-pie">28 tareas con su propio reloj → un orquestador</p></div>`;
  },
  // una ficha de producto: la IA escribe la descripción y una persona pone el sello
  erp: () => `<div class="es es-erp"><div class="es-ficha"><i class="es-foto"></i><div class="es-texto"><small>Ficha de producto · ejemplo</small><b>Lámpara de mesa</b>
      ${[92, 100, 84, 96, 58].map((w, i) => `<span class="es-l" style="--w:${w}%;--i:${i}"></span>`).join('')}</div><em class="es-sello">Aprobado</em></div>
    <p class="es-pie">La IA redacta la descripción · una persona la aprueba</p></div>`,
  // cuatro zonas y dos sistemas antiguos que acaban en un solo registro
  vados: () => {
    const t = ['Zona 1', 'Zona 2', 'Zona 3', 'Zona 4', 'Sistema antiguo A', 'Sistema antiguo B'];
    const fichas = t.map((n, k) => `<i style="--x:${((k % 3) - 1) * 30}cqw;--y:${(Math.floor(k / 3) - .5) * 34}cqh;--i:${k}"${k > 3 ? ' class="viejo"' : ''}>${n}</i>`).join('');
    return `<div class="es es-vados">${fichas}<b class="es-uno">Un solo registro</b><p class="es-pie">4 zonas y 2 sistemas antiguos, unificados</p></div>`;
  },
  // seis pantallas de prueba, cada una con su acierto
  vision: () => `<div class="es es-vision"><div class="es-rejilla">${Array.from({ length: 6 }, (_, k) => `<i style="--i:${k}"><s></s><s></s><s></s><u>✓</u></i>`).join('')}</div>
    <p class="es-pie">6 pantallas de prueba · el modelo, en mi propio equipo</p></div>`,
};

function trailer(p) {
  const cifras = p.cifras.map(([n, t], i) => `<li style="--i:${i}"><b>${esc(n)}</b><span>${esc(t)}</span></li>`).join('');
  const marco = (n) => `<figure class="tr-marco"><i class="tr-barra"><s></s><s></s><s></s><span>${esc(p.capturas[n - 1])}</span></i><img src="${captura(p, n)}" alt="" decoding="async"></figure>`;
  const a = p.capturas ? marco(1) : '<div class="tr-arte"></div><div class="tr-velo"></div>';
  const b = p.capturas ? marco(2) : (ESQUEMAS[p.id]?.() ?? '');
  return `<div class="tr${p.capturas ? ' con-capturas' : ''}" style="--n:${p.cifras.length}">
    <section class="tr-a" style="--ini:0s">${a}<div class="tr-titulo"><b>${esc(p.nombre)}</b><span>${esc(p.lema)}</span></div></section>
    <section class="tr-b" style="--ini:2.7s">${b}<ul class="tr-cifras">${cifras}</ul></section>
    <div class="tr-fin"><span class="tr-sello">FM</span><b>${esc(p.nombre)}</b><p>${esc(p.linea)}</p><p class="tr-estado">${esc(p.tipo)} · ${esc(p.estado)}</p>
      <div class="tr-botones">${p.web ? `<a class="boton boton-luz" href="${p.web[1]}" target="_blank" rel="noopener"><span class="boton-tapa">Ir a su web ↗</span></a>` : ''}
      <button type="button" class="boton boton-oscuro" data-otra-vez><span class="boton-tapa">Ver otra vez</span></button></div></div>
    <p class="tr-rotulo">Tráiler · ${esc(p.nombre)}</p>
  </div>`;
}

// el: el elemento que hace de cristal (container-type: size). Devuelve { foco, apagar } o null si se cortó antes.
export async function encender(p, { el, RM, guardado, alResolver }) {
  const previa = el._pantalla, yo = {}; el._pantalla = yo;
  previa?.cortar();
  const cambio = !!previa && !el.hidden;             // ya estaba encendida con otro: se cambia de disco
  cargarArte(p.id);
  const listas = precargar(p);
  el.style.setProperty('--c', p.color); el.style.setProperty('--t', p.tinta);
  el.style.setProperty('--k', `url('${RAIZ}portadas/${p.id}.webp')`);
  el.innerHTML = '<div class="pantalla-in"></div><div class="tubo"></div>';
  el.hidden = false;
  const dentro = el.querySelector('.pantalla-in'), tubo = el.querySelector('.tubo');
  // los colores y la carátula también en lo de dentro: así no dependen del estilo del cristal, que la maqueta mueve
  for (const k of ['--c', '--t', '--k']) dentro.style.setProperty(k, el.style.getPropertyValue(k));
  let juego = null, vivo = true, saltar = null;
  const mia = () => vivo && el._pantalla === yo;
  yo.cortar = () => { vivo = false; saltar?.(); juego?.quitar(); juego = null; };

  // el cristal: una raya que se abre con un destello (si ya estaba encendida, solo un parpadeo)
  if (RM) tubo.style.opacity = 0;
  else if (cambio) await tubo.animate([{ opacity: .35 }, { opacity: 0 }], { duration: 180, easing: 'ease-out', fill: 'forwards' }).finished.catch(() => {});
  else {
    await Promise.all([
      dentro.animate([{ transform: 'scale(1, .004)', opacity: 1 }, { transform: 'scale(1, .004)', offset: .25 }, { transform: 'none' }], { duration: 360, easing: 'cubic-bezier(.2, .8, .2, 1)' }).finished,
      tubo.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, easing: 'ease-out', fill: 'forwards' }).finished,
    ]).catch(() => {});
  }
  if (!mia()) return null;

  // el arranque: el nombre de la consola. Se salta con un clic o una tecla
  const corto = arrancada || cambio;
  dentro.innerHTML = `<div class="arranque${corto ? ' corto' : ''}"><b>${'FRAGUA'.split('').map((l, i) => `<i style="--i:${i}">${l}</i>`).join('')}</b><span>Colección de Fernando Martínez</span></div>`;
  if (!RM) {
    await new Promise((ok) => {
      const fin = setTimeout(ok, corto ? 380 : 620);
      saltar = () => { clearTimeout(fin); ok(); };
      el.addEventListener('pointerdown', saltar, { once: true });
      addEventListener('keydown', saltar, { once: true });
    });
    el.removeEventListener('pointerdown', saltar); removeEventListener('keydown', saltar); saltar = null;
  }
  arrancada = true;
  if (!mia()) return null;

  if (p.demo) {
    const mod = await import(`./${p.id}.js`);
    if (!mia()) return null;
    dentro.innerHTML = '';
    juego = mod.montar(dentro, { RM, guardado, alResolver });
  } else {
    // las imágenes ya vienen cargadas casi siempre (se piden al empezar); si no, como mucho medio segundo más
    await Promise.race([listas, new Promise((ok) => setTimeout(ok, 500))]);
    if (!mia()) return null;
    dentro.innerHTML = trailer(p);
    dentro.addEventListener('click', (e) => {
      if (!e.target.closest('[data-otra-vez]')) return;
      const tr = dentro.querySelector('.tr'); tr.replaceWith(tr.cloneNode(true));
      dentro.querySelector('.tr-fin a, .tr-fin button')?.focus({ preventScroll: true });
    });
  }
  return {
    foco() { (juego?.primero?.() || dentro.querySelector('a, button'))?.focus({ preventScroll: true }); },
    async apagar() {
      if (el._pantalla !== yo) { yo.cortar(); return; }   // la pantalla ya es de otro: no se toca
      vivo = false; saltar?.();
      if (!RM) {
        tubo.style.opacity = 0;
        await dentro.animate([{ transform: 'none', opacity: 1 }, { transform: 'scale(1, .006)', opacity: 1, offset: .55 }, { transform: 'scale(0, .006)', opacity: 0 }], { duration: 280, easing: 'cubic-bezier(.5, 0, .7, .4)', fill: 'forwards' }).finished.catch(() => {});
      }
      juego?.quitar(); juego = null;
      // si entretanto se ha encendido otra vez, el cristal ya es de la nueva: no se toca
      if (el._pantalla === yo) { el._pantalla = null; el.hidden = true; el.innerHTML = ''; }
    },
  };
}

// apagar en el acto, sin animación (para cuando se sale a mitad del arranque)
export function apagarYa(el) {
  el._pantalla?.cortar?.(); el._pantalla = null; el.hidden = true; el.innerHTML = '';
}
