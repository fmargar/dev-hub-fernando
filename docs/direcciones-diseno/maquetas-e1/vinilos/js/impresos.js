// Lo impreso del cajón de discos, en canvas: la portada y la contraportada de cada funda, la cara del disco (surcos y
// galleta), los tres discos de adorno de la balda, el rótulo de la tienda y la placa del cajón. Sale de los datos de los
// proyectos: cambiar uno no obliga a volver a hornear.
//
// La portada lleva el nombre en una franja arriba: es lo que asoma de cada funda en el cajón, así que hace de índice.
import { PROYECTOS } from '../../../kit-e1/js/datos.js';
import { cargarArte, partir } from '../../../kit-e1/js/coleccion.js';

export const TAM = { portada: [1024, 1024], dorso: [1024, 1024], disco: [1024, 1024], expositor: [512, 512], rotulo: [1584, 288], placa: [540, 160], atril: [552, 160] };
export const FRANJA = 0.1;                // la franja del nombre, en proporción del alto de la portada
const caslon = (t) => `700 ${t}px 'Caslon Cond'`;
const sans = (t, p = 400) => `${p} ${t}px 'Instrument Sans'`;
const serif = (t) => `italic 400 ${t}px 'Instrument Serif'`;
const mono = (t) => `500 ${t}px 'DM Mono'`;
const conAlfa = (hex, a) => `${hex}${Math.round(a * 255).toString(16).padStart(2, '0')}`;
function cabe(x, texto, fuente, tam, ancho, min = 16) {
  let t = tam; x.font = fuente(t);
  while (x.measureText(texto).width > ancho && t > min) { t -= 2; x.font = fuente(t); }
  return t;
}
function cubrir(x, img, dx, dy, dw, dh, fx = 0.5, fy = 0.5) {
  const k = Math.max(dw / img.width, dh / img.height), sw = dw / k, sh = dh / k;
  x.drawImage(img, (img.width - sw) * fx, (img.height - sh) * fy, sw, sh, dx, dy, dw, dh);
}
function parrafo(x, texto, px, py, ancho, alto, max = 9) { const ls = partir(x, texto, ancho).slice(0, max); ls.forEach((l, i) => x.fillText(l, px, py + i * alto)); return py + ls.length * alto; }
function grano(x, w, h, n, a, semilla = 7) {
  let s = semilla; const r = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < n; i++) { x.fillStyle = `rgba(${r() < 0.5 ? '255,255,255' : '0,0,0'},${a * r()})`; x.fillRect(r() * w, r() * h, 1 + r() * 2, 1 + r() * 2); }
}
// el desgaste del cartón: un poco más claro en los cantos, como una funda que ha pasado por muchas manos
function gastado(x, W, H) {
  const g = x.createRadialGradient(W / 2, H / 2, W * 0.42, W / 2, H / 2, W * 0.75);
  g.addColorStop(0, 'rgba(255,248,230,0)'); g.addColorStop(1, 'rgba(255,248,230,.16)');
  x.fillStyle = g; x.fillRect(0, 0, W, H); grano(x, W, H, 2600, 0.12);
}
function sello(x, cx, cy, r, fondo, tinta) {
  x.save(); x.fillStyle = fondo; x.beginPath(); x.arc(cx, cy, r, 0, Math.PI * 2); x.fill();
  x.fillStyle = tinta; x.font = caslon(r * 1.05); x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('FM', cx, cy + r * 0.06); x.restore();
}

// ── La portada: la franja del nombre arriba y, debajo, su carátula; la pegatina dice si dentro hay demo o tráiler ──
export async function portada(c, p) {
  const x = c.getContext('2d'), [W, H] = TAM.portada, F = Math.round(H * FRANJA); x.textBaseline = 'alphabetic';
  const img = await cargarArte(p.id);
  x.fillStyle = p.color; x.fillRect(0, 0, W, H);
  if (img) cubrir(x, img, 0, F, W, H - F, 0.5, 0.6);
  x.fillStyle = p.color; x.fillRect(0, 0, W, F);
  x.fillStyle = p.tinta; x.textAlign = 'left';
  cabe(x, p.nombre, caslon, 84, W - 240); x.fillText(p.nombre, 34, F - 22);
  x.font = mono(26); x.textAlign = 'right'; x.fillStyle = conAlfa(p.tinta, 0.8); x.fillText(`LP ${p.n}`, W - 34, F - 30);
  // el lema, abajo, sobre un velo del color del proyecto
  const g = x.createLinearGradient(0, H - 300, 0, H); g.addColorStop(0, conAlfa(p.color, 0)); g.addColorStop(0.6, conAlfa(p.color, 0.85)); g.addColorStop(1, conAlfa(p.color, 0.95));
  x.fillStyle = g; x.fillRect(0, H - 300, W, 300);
  x.fillStyle = '#fff'; x.textAlign = 'left'; x.font = serif(50); x.shadowColor = 'rgba(0,0,0,.35)'; x.shadowBlur = 10;
  partir(x, p.lema, W - 300).slice(0, 2).reverse().forEach((l, i) => x.fillText(l, 40, H - 52 - i * 58));
  x.shadowBlur = 0;
  sello(x, W - 84, H - 84, 46, p.tinta, p.color);
  // la pegatina, como la del precio de la tienda
  x.save(); x.translate(W - 150, F + 120); x.rotate(0.1); x.fillStyle = '#F7B500'; x.beginPath(); x.arc(0, 0, 84, 0, Math.PI * 2); x.fill();
  x.fillStyle = '#2a1d3a'; x.textAlign = 'center'; x.font = caslon(p.demo ? 50 : 44); x.fillText(p.demo ? 'Demo' : 'Tráiler', 0, -2);
  x.font = mono(17); x.fillText(p.demo ? 'JUGABLE · CARA A' : 'EN LA CARA A', 0, 28); x.restore();
  gastado(x, W, H);
}

// ── La contraportada: los créditos, como en un disco (qué es, qué hice yo, el resultado, con qué está hecho) ──
export async function dorso(c, p) {
  const x = c.getContext('2d'), [W, H] = TAM.dorso, M = 56; x.textBaseline = 'alphabetic'; x.textAlign = 'left';
  x.fillStyle = '#f1ead9'; x.fillRect(0, 0, W, H);
  x.fillStyle = p.color; x.fillRect(0, 0, W, 132);
  x.fillStyle = p.tinta; cabe(x, p.nombre, caslon, 92, W - 2 * M - 200); x.fillText(p.nombre, M, 102);
  x.font = mono(20); x.textAlign = 'right'; x.fillStyle = conAlfa(p.tinta, 0.85); x.fillText(`${p.tipo.toUpperCase()}`, W - M, 64); x.fillText(p.estado.toUpperCase(), W - M, 96);
  x.textAlign = 'left';
  // la cara A (lo que suena) y los créditos, en dos columnas
  const col = (W - 2 * M - 40) / 2;
  x.fillStyle = '#1d1915'; x.font = mono(19); x.fillText('CARA A', M, 186);
  x.font = sans(30, 600); x.fillText(p.demo ? '1. La demo (jugable)' : '1. El tráiler', M, 228);
  x.fillStyle = '#3b342d'; x.font = sans(23); let y = parrafo(x, p.linea, M, 266, col, 30, 5);
  x.fillStyle = '#1d1915'; x.font = mono(19); x.fillText('CRÉDITOS', M + col + 40, 186);
  let yd = 228;
  for (const [t, v] of p.bloques.slice(0, 4)) {
    x.fillStyle = '#6b5f4e'; x.font = mono(16); x.fillText(t.toUpperCase(), M + col + 40, yd);
    x.fillStyle = '#1d1915'; x.font = sans(21); yd = parrafo(x, v, M + col + 40, yd + 28, col, 26, 4) + 16;
  }
  y = Math.max(y, yd) + 18;
  // las cifras, grandes, como los datos de la grabación
  x.strokeStyle = 'rgba(29,25,21,.25)'; x.lineWidth = 2; x.beginPath(); x.moveTo(M, y); x.lineTo(W - M, y); x.stroke();
  const n = p.cifras.length, cw = (W - 2 * M) / Math.max(n, 2);
  p.cifras.forEach(([v, t], i) => {
    const px = M + i * cw;
    x.fillStyle = p.color === '#1d1915' ? '#1d1915' : p.color; cabe(x, String(v), caslon, 78, cw - 24); x.fillText(String(v), px, y + 84);
    x.fillStyle = '#3b342d'; x.font = sans(19, 600); partir(x, String(t), cw - 24).slice(0, 2).forEach((l, k) => x.fillText(l, px, y + 116 + k * 24));
  });
  // con qué está hecho: los instrumentos
  x.fillStyle = '#6b5f4e'; x.font = mono(16); x.fillText('INSTRUMENTOS', M, H - 132);
  x.fillStyle = '#1d1915'; x.font = sans(21); parrafo(x, p.stack.join(' · '), M, H - 102, W - 2 * M - 220, 27, 2);
  sello(x, W - M - 44, H - 98, 44, p.color, p.tinta);
  x.fillStyle = '#6b5f4e'; x.font = mono(15); x.fillText(`© 2026 FERNANDO MARTÍNEZ · LP ${p.n}${p.demo ? ' · LA DEMO ES UNA SIMULACIÓN' : ''}`, M, H - 34);
  gastado(x, W, H);
}

// ── El disco: surcos con su brillo y la galleta del proyecto en el centro (el agujero, en el medio) ──
export function disco(c, p) {
  const x = c.getContext('2d'), S = TAM.disco[0], m = S / 2; x.clearRect(0, 0, S, S);
  x.save(); x.beginPath(); x.arc(m, m, m, 0, Math.PI * 2); x.clip();
  x.fillStyle = '#0c0c0e'; x.fillRect(0, 0, S, S);
  // los surcos: anillos finos, con las pausas entre canciones algo más anchas
  for (let r = m - 10; r > 190; r -= 2.2) {
    const pausa = [430, 372, 318, 262].some((q) => Math.abs(r - q) < 4);
    x.strokeStyle = pausa ? 'rgba(0,0,0,.9)' : `rgba(255,255,255,${0.035 + 0.03 * Math.sin(r * 0.7)})`; x.lineWidth = pausa ? 5 : 1;
    x.beginPath(); x.arc(m, m, r, 0, Math.PI * 2); x.stroke();
  }
  // el brillo: dos abanicos de luz enfrentados, como un vinilo bajo una lámpara
  for (const a of [-0.6, Math.PI - 0.6]) {
    const g = x.createConicGradient(a, m, m);
    g.addColorStop(0, 'rgba(255,240,220,0)'); g.addColorStop(0.04, 'rgba(255,240,220,.16)'); g.addColorStop(0.09, 'rgba(255,240,220,0)'); g.addColorStop(1, 'rgba(255,240,220,0)');
    x.fillStyle = g; x.fillRect(0, 0, S, S);
  }
  // la galleta
  const R = 172;
  x.fillStyle = p.color; x.beginPath(); x.arc(m, m, R, 0, Math.PI * 2); x.fill();
  x.strokeStyle = conAlfa(p.tinta, 0.5); x.lineWidth = 3; x.beginPath(); x.arc(m, m, R - 12, 0, Math.PI * 2); x.stroke();
  x.fillStyle = p.tinta; x.textAlign = 'center'; x.textBaseline = 'alphabetic';
  cabe(x, p.nombre, caslon, 64, 2 * R - 90); x.fillText(p.nombre, m, m - 52);
  x.font = mono(17); x.fillText(p.demo ? 'CARA A · DEMO' : 'CARA A · TRÁILER', m, m - 22);
  x.font = mono(16); x.fillText(`LP ${p.n} · 33⅓`, m, m + 62);
  x.font = mono(13); x.fillStyle = conAlfa(p.tinta, 0.8); x.fillText('FERNANDO MARTÍNEZ', m, m + 92);
  x.restore();
}

// ── Los tres discos de la balda (adorno): formas y colores de la casa, sin nombres ──
const PALETAS = [['#1B2140', '#F7B500', '#e8dcc4'], ['#9E3A26', '#F6E7CF', '#2f3b33'], ['#2c4a52', '#e0a458', '#f1ead9']];
export function expositor(c, k) {
  const x = c.getContext('2d'), [W, H] = TAM.expositor, [a, b, d] = PALETAS[k % 3];
  x.fillStyle = a; x.fillRect(0, 0, W, H);
  x.fillStyle = b;
  if (k === 0) { x.beginPath(); x.arc(W * 0.62, H * 0.58, W * 0.3, 0, Math.PI * 2); x.fill(); x.fillStyle = d; x.fillRect(W * 0.1, H * 0.12, W * 0.08, H * 0.76); }
  else if (k === 1) { for (let i = 0; i < 6; i++) { x.fillStyle = i % 2 ? b : d; x.fillRect(0, H * (0.2 + i * 0.1), W, H * 0.05); } }
  else { x.beginPath(); x.moveTo(0, H); x.lineTo(W * 0.5, H * 0.25); x.lineTo(W, H); x.fill(); x.fillStyle = d; x.beginPath(); x.arc(W * 0.78, H * 0.22, W * 0.09, 0, Math.PI * 2); x.fill(); }
  gastado(x, W, H);
}

// ── El rótulo: pintado a mano sobre la tabla, en oro viejo ──
export function rotulo(c) {
  const x = c.getContext('2d'), [W, H] = TAM.rotulo;
  x.fillStyle = '#1c1512'; x.fillRect(0, 0, W, H);
  x.strokeStyle = '#c9a15a'; x.lineWidth = 4; x.strokeRect(18, 18, W - 36, H - 36);
  x.fillStyle = '#d9b46a'; x.textAlign = 'center'; x.textBaseline = 'middle';
  x.font = caslon(150); x.letterSpacing = '10px'; x.fillText('DISCOS FM', W / 2, H / 2 - 18); x.letterSpacing = '0px';
  x.font = mono(30); x.letterSpacing = '8px'; x.fillText('NUEVE PROYECTOS · UNO POR DISCO', W / 2, H - 58); x.letterSpacing = '0px';
  grano(x, W, H, 3000, 0.18);
}

// ── La placa del cajón ──
export function placa(c) {
  const x = c.getContext('2d'), [W, H] = TAM.placa;
  const g = x.createLinearGradient(0, 0, W, 0); g.addColorStop(0, '#b8914c'); g.addColorStop(0.5, '#d9b56e'); g.addColorStop(1, '#b38a47');
  x.fillStyle = g; x.fillRect(0, 0, W, H);
  x.fillStyle = '#2b1d0b'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.font = mono(40); x.letterSpacing = '6px';
  x.fillText('01 — 09', W / 2, H / 2 + 2); x.letterSpacing = '0px';
}

// ── El cartelito del atril ──
export function atril(c) {
  const x = c.getContext('2d'), [W, H] = TAM.atril;
  x.fillStyle = '#f1ead9'; x.fillRect(0, 0, W, H); x.strokeStyle = '#1d1915'; x.lineWidth = 3; x.strokeRect(10, 10, W - 20, H - 20);
  x.fillStyle = '#1d1915'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.font = caslon(76); x.fillText('Sonando', W / 2, H / 2 + 4);
  grano(x, W, H, 900, 0.12);
}

export { PROYECTOS };
