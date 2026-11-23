// Lo impreso de E1 («premium»): el mismo diseño que la foto de producto de la técnica A (texturas.html), pero
// pintado en el navegador, así que el título y el color de la colección cambian en vivo sin volver a hornear.
// La ilustración de la carátula es el diorama renderizado en Blender para la técnica A.
import { JUEGO, BALDA } from '../comun/datos.js';

export const COLORES = ['#1C47A0', '#9E3A26', '#2a1d3a', '#17583F', '#4A2F78', '#17656A', '#C5612A', '#B8901C', '#94295F'];
const TINTAS = ['#DCE6FF', '#F6E7CF', '#F7B500', '#E9D9A6', '#EBDDFB', '#D8F3EF', '#FFF0DE', '#2A2004', '#FFE3F1'];
const AMBAR = '#F7B500', PAPEL = '#f1ead9';
export const TAM = { portada: [1080, 1520], dorso: [1080, 1520], lomo: [160, 2026], disco: [1024, 1024], manual: [1024, 1512] };

let dio = null;
export async function cargar() {
  await Promise.all(["700 40px 'Caslon Cond'", "400 40px 'Instrument Sans'", "italic 40px 'Instrument Serif'", "500 20px 'DM Mono'"].map((f) => document.fonts.load(f)));
  dio = await new Promise((ok, mal) => { const i = new Image(); i.onload = () => ok(i); i.onerror = mal; i.src = '../e/diorama.webp'; });
}

function sello(x, cx, cy, r, fondo = AMBAR, tinta = '#2a1d3a') {
  x.save(); x.fillStyle = fondo; x.beginPath(); x.arc(cx, cy, r, 0, Math.PI * 2); x.fill();
  x.fillStyle = tinta; x.font = `700 ${r * 1.05}px 'Caslon Cond'`; x.textAlign = 'center'; x.textBaseline = 'middle';
  x.fillText('FM', cx, cy + r * 0.06); x.restore();
}
function edad(x, px, py, s = 1) {
  x.save(); x.translate(px, py); x.scale(s, s);
  x.fillStyle = '#fff'; x.fillRect(0, 0, 92, 120); x.fillStyle = '#111'; x.fillRect(5, 5, 82, 84);
  x.fillStyle = '#fff'; x.font = "700 78px 'Caslon Cond'"; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('R', 46, 50);
  x.fillStyle = '#111'; x.font = "500 13px 'DM Mono'"; x.fillText('REVISADO', 46, 105); x.restore();
}
function cabe(x, texto, fuente, tam, ancho) {
  let t = tam; x.font = fuente(t);
  while (x.measureText(texto).width > ancho && t > 20) { t -= 4; x.font = fuente(t); }
}
function partir(x, texto, ancho) {
  const lineas = []; let l = '';
  for (const p of texto.split(' ')) { const t = l ? `${l} ${p}` : p; if (x.measureText(t).width > ancho) { lineas.push(l); l = p; } else l = t; }
  return [...lineas, l];
}
const caslon = (t) => `700 ${t}px 'Caslon Cond'`;
const conAlfa = (hex, a) => `${hex}${Math.round(a * 255).toString(16).padStart(2, '0')}`;

export function portada(c, { titulo, color }) {
  const x = c.getContext('2d'); x.textBaseline = 'alphabetic';
  x.drawImage(dio, 0, 0, 1080, 1520);
  const g = x.createLinearGradient(0, 0, 0, 560); g.addColorStop(0, conAlfa(color, 0.92)); g.addColorStop(1, conAlfa(color, 0));
  x.fillStyle = g; x.fillRect(0, 0, 1080, 560);
  sello(x, 92, 92, 44);
  x.fillStyle = 'rgba(255,255,255,.75)'; x.font = "500 22px 'DM Mono'"; x.textAlign = 'right'; x.fillText('COLECCIÓN 2026 · N.º 01', 1020, 100);
  x.textAlign = 'center'; x.fillStyle = AMBAR; x.shadowColor = 'rgba(0,0,0,.45)'; x.shadowBlur = 24; x.shadowOffsetY = 6;
  cabe(x, titulo, caslon, 200, 960); x.fillText(titulo, 540, 350);
  x.shadowBlur = 0; x.shadowOffsetY = 0; x.fillStyle = '#fff'; x.font = "italic 64px 'Instrument Serif'"; x.fillText('¿Quién es hoy?', 540, 440);
  edad(x, 48, 1360);
  x.save(); x.translate(900, 1380); x.rotate(-0.12); x.fillStyle = AMBAR; x.beginPath(); x.arc(0, 0, 112, 0, Math.PI * 2); x.fill();
  x.fillStyle = '#2a1d3a'; x.textAlign = 'center'; x.font = caslon(64); x.fillText('Demo', 0, -6); x.font = "500 22px 'DM Mono'"; x.fillText('JUGABLE', 0, 32); x.restore();
}

export function dorso(c, { color }) {
  const x = c.getContext('2d'); x.textBaseline = 'alphabetic';
  x.fillStyle = color; x.fillRect(0, 0, 1080, 1520);
  x.fillStyle = 'rgba(255,255,255,.6)'; x.font = "500 22px 'DM Mono'"; x.textAlign = 'left'; x.fillText('FM · COLECCIÓN 2026 · N.º 01', 70, 96);
  x.textAlign = 'right'; x.fillText('PRODUCTO PUBLICADO', 1010, 96);
  x.textAlign = 'left'; x.fillStyle = AMBAR; x.font = "italic 70px 'Instrument Serif'";
  ['Un personaje nuevo cada día.', 'El mismo caso para', 'todo el mundo.'].forEach((l, i) => x.fillText(l, 70, 210 + i * 74));
  x.fillStyle = 'rgba(255,255,255,.88)'; x.font = "400 31px 'Instrument Sans'";
  partir(x, JUEGO.que, 940).forEach((l, i) => x.fillText(l, 70, 480 + i * 44));
  for (const [sx, sy, sw, sh, dx] of [[120, 520, 420, 300, 70], [380, 640, 400, 285, 560]]) {
    x.drawImage(dio, sx, sy, sw, sh, dx, 640, 450, 320); x.strokeStyle = 'rgba(255,255,255,.85)'; x.lineWidth = 4; x.strokeRect(dx, 640, 450, 320);
  }
  JUEGO.cifras.forEach(([n, t], i) => {
    const px = 70 + i * 320;
    x.fillStyle = AMBAR; x.font = caslon(120); x.fillText(n, px, 1120);
    x.fillStyle = 'rgba(255,255,255,.7)'; x.font = "500 24px 'DM Mono'"; x.fillText(t.toUpperCase(), px, 1160);
  });
  x.font = "500 24px 'DM Mono'"; let sx = 70;
  for (const s of JUEGO.stack) { const w = x.measureText(s).width + 40; x.strokeStyle = 'rgba(255,255,255,.5)'; x.lineWidth = 2; x.strokeRect(sx, 1210, w, 46); x.fillStyle = '#fff'; x.fillText(s, sx + 20, 1242); sx += w + 14; }
  edad(x, 70, 1330, 0.95);
  x.fillStyle = 'rgba(255,255,255,.55)'; x.font = "400 19px 'Instrument Sans'";
  [`© 2026 Fernando Martínez. Estado: ${JUEGO.estado}.`, 'La demo es una simulación: datos inventados, mecánica real.'].forEach((l, i) => x.fillText(l, 200, 1370 + i * 28));
  x.fillStyle = '#fff'; x.fillRect(800, 1320, 210, 130); x.fillStyle = '#111';
  for (let i = 0, px = 815; px < 990; i++) { const w = [2, 4, 2, 6, 2, 3][i % 6]; x.fillRect(px, 1332, w, 82); px += w + [3, 2, 4, 2, 3][i % 5]; }
  x.font = "500 16px 'DM Mono'"; x.fillText('FM-26-01', 860, 1438);
}

export function lomo(c, i, estado) {
  const x = c.getContext('2d'); x.textBaseline = 'alphabetic'; x.textAlign = 'left';
  const fondo = estado ? estado.color : COLORES[i], tinta = estado ? AMBAR : TINTAS[i], nombre = estado ? estado.titulo : BALDA[i].nombre;
  x.fillStyle = fondo; x.fillRect(0, 0, 160, 2026);
  sello(x, 80, 96, 48, tinta, fondo);
  x.save(); x.translate(80, 200); x.rotate(Math.PI / 2); x.fillStyle = tinta; x.textBaseline = 'middle';
  cabe(x, nombre, (t) => `700 ${t}px 'Caslon Cond'`, 110, 1560); x.fillText(nombre, 0, 4); x.restore();
  x.fillStyle = tinta; x.font = "500 44px 'DM Mono'"; x.textAlign = 'center'; x.fillText(BALDA[i].n, 80, 1960);
}

export function disco(c, { titulo }) {
  const x = c.getContext('2d'); x.clearRect(0, 0, 1024, 1024); x.textBaseline = 'alphabetic';
  x.save(); x.beginPath(); x.arc(512, 512, 512, 0, Math.PI * 2); x.clip();
  x.drawImage(dio, 112, 420, 640, 640, 0, 0, 1024, 1024);
  x.fillStyle = 'rgba(30,18,44,.35)'; x.fillRect(0, 0, 1024, 1024);
  x.fillStyle = AMBAR; x.textAlign = 'center'; x.shadowColor = 'rgba(0,0,0,.5)'; x.shadowBlur = 16;
  cabe(x, titulo, caslon, 112, 620); x.fillText(titulo, 512, 300);
  x.shadowBlur = 0; x.fillStyle = '#fff'; x.font = "500 26px 'DM Mono'"; x.fillText('DISCO 1 · DEMO · SIMULACIÓN', 512, 350);
  sello(x, 512, 860, 50); x.restore();
}

export function manual(c, { titulo, color }) {
  const x = c.getContext('2d'); x.textBaseline = 'alphabetic';
  x.fillStyle = PAPEL; x.fillRect(0, 0, 1024, 1512);
  sello(x, 90, 90, 40, color, AMBAR);
  x.fillStyle = color; x.font = "500 22px 'DM Mono'"; x.textAlign = 'right'; x.fillText('N.º 01', 960, 98);
  x.textAlign = 'left'; cabe(x, titulo, caslon, 170, 880); x.fillText(titulo, 70, 330);
  x.font = "italic 58px 'Instrument Serif'"; x.fillText('Manual de instrucciones', 74, 410);
  x.drawImage(dio, 60, 260, 744, 660, 70, 480, 884, 784);
  x.font = "400 26px 'Instrument Sans'"; partir(x, JUEGO.hice, 880).forEach((l, i) => x.fillText(l, 70, 1340 + i * 38));
}

// Las cajas de frente de la balda: el mismo sistema de colección (color del lomo, Caslon, sello y clasificación),
// sin ilustración propia todavía: un marco y el número grande
export function expuesta(c, i) {
  const x = c.getContext('2d'); x.textBaseline = 'alphabetic';
  const p = BALDA[i], fondo = COLORES[i], tinta = TINTAS[i];
  x.fillStyle = fondo; x.fillRect(0, 0, 1080, 1520);
  const g = x.createRadialGradient(540, 820, 60, 540, 820, 760); g.addColorStop(0, 'rgba(255,255,255,.16)'); g.addColorStop(1, 'rgba(0,0,0,.25)');
  x.fillStyle = g; x.fillRect(0, 0, 1080, 1520);
  x.strokeStyle = conAlfa(tinta, 0.55); x.lineWidth = 3; x.strokeRect(48, 48, 984, 1424);
  sello(x, 120, 128, 44, tinta, fondo);
  x.fillStyle = conAlfa(tinta, 0.8); x.font = "500 22px 'DM Mono'"; x.textAlign = 'right'; x.fillText(`COLECCIÓN 2026 · N.º ${p.n}`, 980, 136);
  x.textAlign = 'center'; x.fillStyle = conAlfa(tinta, 0.18); x.font = caslon(760); x.fillText(p.n, 540, 1120);
  x.fillStyle = tinta; cabe(x, p.nombre, caslon, 170, 900); x.fillText(p.nombre, 540, 420);
  edad(x, 96, 1310);
}
