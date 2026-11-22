// Lo que sale en la tele al meter un disco: el tubo se enciende, arranca la consola (una vez por visita
// entera; las siguientes, en corto) y después la demo o, si el juego no trae demo, su tráiler.
import { colores } from './caja.js';
import { sonar } from './sonido.js';

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const css = new Promise((ok) => {
  const l = document.createElement('link');
  l.rel = 'stylesheet'; l.href = 'css/pantalla.css'; l.onload = l.onerror = ok;
  document.head.append(l);
});
let arrancada = false;

function trailer(p) {
  const cifras = p.cifras.map(([n, t], i) => `<li style="--i:${i}"><b>${esc(n)}</b><span>${esc(t)}</span></li>`).join('');
  return `<div class="tr" style="${colores(p)};--n:${p.cifras.length}">
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

export async function encender(p, { el, mandos, RM, guardado, alResolver }) {
  await css;
  el.style.cssText += `;${colores(p)}`;
  el.innerHTML = '<div class="pantalla-in"></div><div class="tubo"></div>';
  el.hidden = false;
  const dentro = el.querySelector('.pantalla-in'), tubo = el.querySelector('.tubo');
  let juego = null, vivo = true, saltar = null;

  // El tubo: una raya que se abre a todo el cristal con un destello
  sonar.tele();
  if (!RM) {
    await Promise.all([
      dentro.animate([{ transform: 'scale(1, .004)', filter: 'brightness(3)' }, { transform: 'scale(1, .004)', filter: 'brightness(3)', offset: .25 }, { transform: 'none', filter: 'none' }], { duration: 420, easing: 'cubic-bezier(.2, .8, .2, 1)' }).finished,
      tubo.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 340, easing: 'ease-out', fill: 'forwards' }).finished,
    ]).catch(() => {});
  } else tubo.style.opacity = 0;
  if (!vivo) return null;

  // El arranque: el sello de la consola. Se salta con un clic o una tecla
  dentro.innerHTML = `<div class="arranque${arrancada ? ' corto' : ''}"><b>${'FRAGUA'.split('').map((l, i) => `<i style="--i:${i}">${l}</i>`).join('')}</b><span>Colección de Fernando Martínez</span></div>`;
  if (!RM) {
    sonar.arranque();
    await new Promise((ok) => {
      const fin = setTimeout(ok, arrancada ? 650 : 1500);
      saltar = () => { clearTimeout(fin); ok(); };
      el.addEventListener('pointerdown', saltar, { once: true });
    });
    el.removeEventListener('pointerdown', saltar); saltar = null;
  }
  arrancada = true;
  if (!vivo) return null;

  if (p.demo) {
    const mod = await import(`./juegos/${p.id}.js`);
    if (!vivo) return null;
    dentro.innerHTML = '';
    juego = mod.montar(dentro, { RM, guardado, alResolver });
  } else {
    dentro.innerHTML = trailer(p);
    dentro.addEventListener('click', (e) => {
      if (!e.target.closest('[data-otra-vez]')) return;
      const tr = dentro.querySelector('.tr');
      tr.replaceWith(tr.cloneNode(true));
    });
  }
  mandos.hidden = false;
  requestAnimationFrame(() => mandos.classList.add('puestos'));
  return {
    foco() { (juego?.primero?.() || dentro.querySelector('a, button') || mandos.querySelector('button'))?.focus({ preventScroll: true }); },
    saltar() { saltar?.(); },
    async apagar() {
      vivo = false; saltar?.();
      mandos.classList.remove('puestos');
      sonar.tele();
      if (!RM) {
        tubo.style.opacity = 0;
        await dentro.animate([{ transform: 'none', filter: 'none' }, { transform: 'scale(1, .006)', filter: 'brightness(2.5)', offset: .55 }, { transform: 'scale(0, .006)', filter: 'brightness(3)' }], { duration: 360, easing: 'cubic-bezier(.5, 0, .7, .4)', fill: 'forwards' }).finished.catch(() => {});
      }
      juego?.quitar();
      el.hidden = true; el.innerHTML = '';
      mandos.hidden = true;
    },
  };
}
