// La caja de un juego: lomo, carátula, contraportada y, por dentro, el librillo y el disco.
// Todo es HTML y CSS en 3D: la caja gira, la tapa se abre desde el lomo y el disco se coge.
import { ROTULOS } from './datos.js';

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
export const colores = (p) => `--c:${p.color};--t:${p.tinta};--k:url('../arte/k/${p.id}.webp')`;

// La clasificación propia de la colección: «R», revisado. Todo lo que sale lo ha revisado alguien.
const EDAD = '<span class="edad"><i>R</i><span>Revisado<br>antes de salir</span></span>';

export function lomoHTML(p) {
  return `<span class="lomo-in"><span class="lomo-sello">FM</span><span class="lomo-titulo">${esc(p.nombre)}</span><span class="lomo-n">${p.n}</span></span><span class="lomo-guardado"></span>`;
}

function pegatina(p) {
  return p.demo
    ? `<span class="pegatina">Demo jugable<small>${ROTULOS[p.demo][0]}</small></span>`
    : `<span class="pegatina trailer">Incluye tráiler<small>${esc(p.estado)}</small></span>`;
}

function caratula(p) {
  const largo = p.nombre.length > 12;
  return `<div class="k-arte"></div>
    <div class="k-sup"><b><span class="sello">FM</span>Fragua</b><span>n.º ${p.n}</span></div>
    <p class="k-titulo${largo ? ' largo' : ''}">${esc(p.nombre)}</p>
    <div class="k-inf">${EDAD}</div>
    ${pegatina(p)}
    <div class="brillo"></div>`;
}

function contraportada(p) {
  const cifras = p.cifras.map(([n, t]) => `<li><b>${esc(n)}</b><span>${esc(t)}</span></li>`).join('');
  const stack = p.stack.length ? `<div class="do-stack">${p.stack.map((s) => `<span>${esc(s)}</span>`).join('')}</div>` : '<div class="do-stack"></div>';
  return `<div class="do">
    <div class="do-sup"><span>Fragua · n.º ${p.n}</span><span>${esc(p.tipo)}</span></div>
    <p class="do-lema">${esc(p.lema)}</p>
    <p class="do-texto">${esc(p.bloques[0][1])}</p>
    <div class="do-fotos" aria-hidden="true"><i style="--px:20%;--py:70%"></i><i style="--px:85%;--py:35%"></i></div>
    <ul class="do-cifras">${cifras}</ul>
    ${stack}
    <div class="do-inf">${EDAD}<p class="do-legal">© 2026 Fernando Martínez. Estado: ${esc(p.estado)}. ${p.demo ? 'La demo es una simulación: datos inventados, mecánica real.' : 'Este disco trae un tráiler; el manual lo cuenta todo.'}</p><span class="barras"><i></i>FM-26-${p.n}</span></div>
  </div><div class="brillo"></div>`;
}

export function crearCaja(p, { w, h, d }) {
  const cp = document.createElement('div');
  cp.className = 'cp';
  cp.style.cssText = `${colores(p)};--w:${w}px;--h:${h}px;--d:${d}px;width:${w}px;height:${h}px`;
  cp.innerHTML = `<div class="caja">
    <div class="cara cara-lomo lomo" style="${colores(p)}">${lomoHTML(p)}</div>
    <div class="cara canto-d"></div><div class="cara canto-a"></div><div class="cara canto-b"></div>
    <div class="cara dorso">${contraportada(p)}</div>
    <div class="cara bandeja"><span class="hueco-disco"></span><span class="eje"></span>
      <button type="button" class="disco" aria-label="Coger el disco de ${esc(p.nombre)}"><img src="arte/d/${p.id}.webp" alt="" draggable="false"></button></div>
    <div class="tapa">
      <div class="cara frente">${caratula(p)}</div>
      <div class="cara dentro-tapa"><span class="pestana p1"></span><span class="pestana p2"></span>
        <button type="button" class="librillo" aria-label="Leer el manual de ${esc(p.nombre)}"><span class="librillo-arte"></span><span class="librillo-pie"><b>${esc(p.nombre)}</b><span>Manual de instrucciones</span></span></button></div>
    </div>
  </div>`;
  return cp;
}
