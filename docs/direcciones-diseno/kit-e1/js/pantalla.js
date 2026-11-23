// Lo que sale en una pantalla al «meter el disco»: el cristal se enciende, arranca la consola (en largo la primera
// vez de la visita; luego en corto) y después la demo jugable o, si el proyecto no trae demo, su tráiler.
// Lo usa cualquier maqueta: la tele del salón, la ventanilla del avión… Estilos en css/tele.css.
import { cargarArte } from './coleccion.js';

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const RAIZ = new URL('../arte/', import.meta.url).href;
let arrancada = false;

function trailer(p) {
  const cifras = p.cifras.map(([n, t], i) => `<li style="--i:${i}"><b>${esc(n)}</b><span>${esc(t)}</span></li>`).join('');
  return `<div class="tr" style="--n:${p.cifras.length}">
    <div class="tr-arte"></div><div class="tr-velo"></div>
    <p class="tr-presenta">Fragua presenta</p>
    <div class="tr-titulo"><b>${esc(p.nombre)}</b><span>${esc(p.lema)}</span></div>
    <ul class="tr-cifras">${cifras}</ul>
    <div class="tr-fin"><span class="tr-sello">FM</span><b>${esc(p.nombre)}</b><p>${esc(p.linea)}</p><p class="tr-estado">${esc(p.tipo)} · ${esc(p.estado)}</p>
      ${p.web ? `<a class="boton boton-luz" href="${p.web[1]}" target="_blank" rel="noopener"><span class="boton-tapa">${esc(p.web[0])} ↗</span></a>` : ''}
      <button type="button" class="boton boton-oscuro" data-otra-vez><span class="boton-tapa">Ver otra vez</span></button></div>
    <p class="tr-rotulo">Tráiler · ${esc(p.nombre)}</p>
  </div>`;
}

// el: el elemento que hace de cristal (container-type: size). Devuelve { foco, apagar }.
export async function encender(p, { el, RM, guardado, alResolver }) {
  cargarArte(p.id);
  el.style.setProperty('--c', p.color); el.style.setProperty('--t', p.tinta);
  el.style.setProperty('--k', `url('${RAIZ}portadas/${p.id}.webp')`);
  el.innerHTML = '<div class="pantalla-in"></div><div class="tubo"></div>';
  el.hidden = false;
  const dentro = el.querySelector('.pantalla-in'), tubo = el.querySelector('.tubo');
  let juego = null, vivo = true, saltar = null;

  // el cristal: una raya que se abre con un destello
  if (!RM) {
    await Promise.all([
      dentro.animate([{ transform: 'scale(1, .004)', opacity: 1 }, { transform: 'scale(1, .004)', offset: .25 }, { transform: 'none' }], { duration: 420, easing: 'cubic-bezier(.2, .8, .2, 1)' }).finished,
      tubo.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 340, easing: 'ease-out', fill: 'forwards' }).finished,
    ]).catch(() => {});
  } else tubo.style.opacity = 0;
  if (!vivo) return null;

  // el arranque: el nombre de la consola. Se salta con un clic o una tecla
  dentro.innerHTML = `<div class="arranque${arrancada ? ' corto' : ''}"><b>${'FRAGUA'.split('').map((l, i) => `<i style="--i:${i}">${l}</i>`).join('')}</b><span>Colección de Fernando Martínez</span></div>`;
  if (!RM) {
    await new Promise((ok) => {
      const fin = setTimeout(ok, arrancada ? 650 : 1500);
      saltar = () => { clearTimeout(fin); ok(); };
      el.addEventListener('pointerdown', saltar, { once: true });
      addEventListener('keydown', saltar, { once: true });
    });
    el.removeEventListener('pointerdown', saltar); removeEventListener('keydown', saltar); saltar = null;
  }
  arrancada = true;
  if (!vivo) return null;

  if (p.demo) {
    const mod = await import(`./${p.id}.js`);
    if (!vivo) return null;
    dentro.innerHTML = '';
    juego = mod.montar(dentro, { RM, guardado, alResolver });
  } else {
    dentro.innerHTML = trailer(p);
    dentro.addEventListener('click', (e) => {
      if (!e.target.closest('[data-otra-vez]')) return;
      const tr = dentro.querySelector('.tr'); tr.replaceWith(tr.cloneNode(true));
    });
  }
  return {
    foco() { (juego?.primero?.() || dentro.querySelector('a, button'))?.focus({ preventScroll: true }); },
    async apagar() {
      vivo = false; saltar?.();
      if (!RM) {
        tubo.style.opacity = 0;
        await dentro.animate([{ transform: 'none', opacity: 1 }, { transform: 'scale(1, .006)', opacity: 1, offset: .55 }, { transform: 'scale(0, .006)', opacity: 0 }], { duration: 320, easing: 'cubic-bezier(.5, 0, .7, .4)', fill: 'forwards' }).finished.catch(() => {});
      }
      juego?.quitar();
      // si entretanto se ha encendido otra vez, el cristal ya es de la nueva: no se toca
      if (dentro.isConnected) { el.hidden = true; el.innerHTML = ''; }
    },
  };
}
