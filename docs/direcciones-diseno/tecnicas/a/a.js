// Técnica A: la caja es una película de Blender (150 fotogramas) que se recorre con los botones o arrastrando.
// Todo lo que se ve sale de herramientas/caja.py (geometría, luz y cámara) y de herramientas/texturas.html
// (lo impreso), así que se puede rehacer entero; pero el texto queda dentro de la foto.
import { montarPlato, arrastre, RM } from '../comun/plato.js';

const N = 150;
const CLAVE = { balda: 1, portada: 40, dorso: 75, abierta: 150 };
const PARADAS = [1, 40, 75, 105, 150];
const esVertical = () => innerWidth / innerHeight < 0.8;
let vertical = esVertical();
let CORTE = vertical ? { dir: 'v', w: 720, h: 1280 } : { dir: 'h', w: 1200, h: 800 };
const ruta = (i) => `fotogramas/${CORTE.dir}/f_${String(i).padStart(4, '0')}.webp`;

const lienzo = document.getElementById('lienzo');
const ctx = lienzo.getContext('2d', { alpha: false });
let fotos = new Array(N + 1);
let cargadas = 0;

function medir() {
  // a sangre: la película cubre la pantalla y se recorta por los lados que sobran
  const k = Math.max(innerWidth / CORTE.w, innerHeight / CORTE.h);
  const w = Math.round(CORTE.w * k), h = Math.round(CORTE.h * k);
  const dpr = Math.min(devicePixelRatio || 1, CORTE.w / w, 2);
  lienzo.style.width = `${w}px`; lienzo.style.height = `${h}px`;
  lienzo.width = Math.round(w * Math.max(dpr, 1)); lienzo.height = Math.round(h * Math.max(dpr, 1));
  ultimo = -1; dibujar();
}

function cargar(i) {
  if (fotos[i]) return fotos[i].lista;
  const img = new Image(); img.decoding = 'async'; img.src = ruta(i);
  const lista = fotos, foto = { img, ok: false };
  lista[i] = foto;
  foto.lista = img.decode().then(() => { if (lista !== fotos) return; foto.ok = true; cargadas++; barra(); if (Math.round(f) === i) { ultimo = -1; dibujar(); } }).catch(() => {});
  return foto.lista;
}
const barraEl = document.getElementById('carga-barra');
function barra() {
  barraEl.style.width = `${(cargadas / N) * 100}%`;
  if (cargadas >= N) document.getElementById('carga').classList.add('fuera');
}

let f = 1, ultimo = -1;
function cercana(i) {
  for (let d = 0; d < N; d++) { for (const j of [i - d, i + d]) if (j >= 1 && j <= N && fotos[j]?.ok) return j; }
  return null;
}
function dibujar() {
  const i = Math.round(f), j = cercana(i);
  if (j === null || j === ultimo) return;
  ultimo = j;
  ctx.drawImage(fotos[j].img, 0, 0, lienzo.width, lienzo.height);
}

// Reproducir hasta un fotograma: a ritmo de película (60 por segundo), con entrada y salida suaves
let anim = null;
function ir(destino, inmediato) {
  if (anim) cancelAnimationFrame(anim.raf);
  if (inmediato) { f = destino; ultimo = -1; dibujar(); anim = null; return; }
  const desde = f, dur = Math.max(450, Math.abs(destino - desde) / 60 * 1000), t0 = performance.now();
  const suave = (t) => (t < .5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
  anim = { raf: 0 };
  const paso = (t) => {
    const k = Math.min(1, (t - t0) / dur);
    f = desde + (destino - desde) * suave(k); dibujar();
    if (k < 1) anim.raf = requestAnimationFrame(paso); else anim = null;
  };
  anim.raf = requestAnimationFrame(paso);
}

const ctl = montarPlato({
  irA(id, { inmediato }) {
    let destino = CLAVE[id];
    if (id === 'portada') destino = Math.abs(f - 105) < Math.abs(f - 40) ? 105 : 40;
    ir(destino, inmediato);
  },
  detallesEnVivo: false,
  avisoDetalle: 'Aquí el título y el color están <b>dentro de la foto</b>: para cambiarlos se cambia el texto en el código y se vuelve a renderizar la película (unos 5 minutos en la gráfica, 150 fotogramas por corte).',
});

// Arrastrar recorre la película; al soltar se para en el paso más cercano
let f0 = null;
arrastre(document.getElementById('plato'), {
  alEmpezar() { f0 = null; },
  alMover(dx) {
    // al empezar a arrastrar de verdad (no con un toque), se para lo que estuviera reproduciéndose
    if (f0 === null) { if (anim) { cancelAnimationFrame(anim.raf); anim = null; } f0 = f; }
    f = Math.min(N, Math.max(1, f0 - dx / (vertical ? 3 : 5))); dibujar();
  },
  alSoltar() {
    const p = PARADAS.reduce((a, b) => (Math.abs(b - f) < Math.abs(a - f) ? b : a));
    const id = p === 1 ? 'balda' : p === 75 ? 'dorso' : p === 150 ? 'abierta' : 'portada';
    if (id !== ctl.actual) ctl.poner(id); else ir(p, RM);
  },
});

// Primero el fotograma del paso en el que se entra y las paradas; después, el resto en orden de cercanía
let tanda = 0;
async function cargarTodo() {
  const mia = ++tanda;
  medir();
  await cargar(Math.round(f));
  for (const p of PARADAS) cargar(p);
  const orden = Array.from({ length: N }, (_, k) => k + 1).sort((a, b) => Math.abs(a - f) - Math.abs(b - f));
  for (let k = 0; k < orden.length && mia === tanda; k += 6) await Promise.all(orden.slice(k, k + 6).map(cargar));
}
cargarTodo();
// Al girar el teléfono se cambia de corte (vertical u horizontal) y se vuelven a pedir los fotogramas
addEventListener('resize', () => {
  if (esVertical() === vertical) { medir(); return; }
  vertical = esVertical();
  CORTE = vertical ? { dir: 'v', w: 720, h: 1280 } : { dir: 'h', w: 1200, h: 800 };
  fotos = new Array(N + 1); cargadas = 0; ultimo = -1;
  document.getElementById('carga').classList.remove('fuera'); barra();
  cargarTodo();
});
