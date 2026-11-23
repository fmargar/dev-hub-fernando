// Lo impreso de la colección «FM» para la consola Fragua: lomo, carátula, contraportada, disco, manual (portada y
// las dos páginas de dentro) y el frente de la consola. Se pinta en canvas, así que cambia de proyecto sin volver a
// hornear. El sistema: el color del proyecto en el lomo y en la franja de arriba, el título en Caslon, el sello FM,
// la clasificación «R, revisado antes de salir» y, en la carátula, su bodegón de juguete renderizado en Blender.
import { PROYECTOS } from './datos.js';

const AMBAR = '#F7B500', PAPEL = '#f1ead9', TINTA = '#1d1915';
export const TAM = {
  lomo: [160, 2176], portada: [1080, 1528], dorso: [1080, 1528], disco: [1024, 1024],
  manual: [1024, 1536], pagina_i: [1024, 1536], pagina_d: [1024, 1536], consola: [1536, 336],
};
const RAIZ = new URL('../arte/', import.meta.url).href;
const caslon = (t) => `700 ${t}px 'Caslon Cond'`;
const sans = (t, p = 400) => `${p} ${t}px 'Instrument Sans'`;
const serif = (t) => `italic 400 ${t}px 'Instrument Serif'`;
const mono = (t) => `500 ${t}px 'DM Mono'`;
const conAlfa = (hex, a) => `${hex}${Math.round(a * 255).toString(16).padStart(2, '0')}`;

const arte = {};
export async function cargar() {
  await Promise.all(["700 40px 'Caslon Cond'", "400 40px 'Instrument Sans'", "600 40px 'Instrument Sans'", "italic 40px 'Instrument Serif'", "500 20px 'DM Mono'"].map((f) => document.fonts.load(f)));
}
const caps = {};
export function cargarCaptura(id, n) {
  caps[`${id}-${n}`] ??= new Promise((ok) => { const i = new Image(); i.onload = () => ok(i); i.onerror = () => ok(null); i.src = `${RAIZ}capturas/${id}-${n}.webp`; });
  return caps[`${id}-${n}`];
}
// la carátula de cada proyecto se carga cuando hace falta (la primera vez que se saca su caja)
export function cargarArte(id) {
  arte[id] ??= new Promise((ok) => { const i = new Image(); i.onload = () => ok(i); i.onerror = () => ok(null); i.src = `${RAIZ}portadas/${id}.webp`; });
  return arte[id];
}

function sello(x, cx, cy, r, fondo = AMBAR, tinta = '#2a1d3a') {
  x.save(); x.fillStyle = fondo; x.beginPath(); x.arc(cx, cy, r, 0, Math.PI * 2); x.fill();
  x.fillStyle = tinta; x.font = caslon(r * 1.05); x.textAlign = 'center'; x.textBaseline = 'middle';
  x.fillText('FM', cx, cy + r * 0.06); x.restore();
}
function edad(x, px, py, s = 1) {
  x.save(); x.translate(px, py); x.scale(s, s);
  x.fillStyle = '#fff'; x.fillRect(0, 0, 92, 120); x.fillStyle = '#111'; x.fillRect(5, 5, 82, 84);
  x.fillStyle = '#fff'; x.font = caslon(78); x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('R', 46, 50);
  x.fillStyle = '#111'; x.font = mono(13); x.fillText('REVISADO', 46, 105); x.restore();
}
function cabe(x, texto, fuente, tam, ancho, min = 20) {
  let t = tam; x.font = fuente(t);
  while (x.measureText(texto).width > ancho && t > min) { t -= 2; x.font = fuente(t); }
  return t;
}
export function partir(x, texto, ancho) {
  const lineas = []; let l = '';
  for (const p of texto.split(' ')) { const t = l ? `${l} ${p}` : p; if (x.measureText(t).width > ancho && l) { lineas.push(l); l = p; } else l = t; }
  return [...lineas, l];
}
function parrafo(x, texto, px, py, ancho, alto) { const ls = partir(x, texto, ancho); ls.forEach((l, i) => x.fillText(l, px, py + i * alto)); return py + ls.length * alto; }
// la imagen cubriendo un rectángulo (como background-size: cover), con el punto de interés en (fx, fy)
function cubrir(x, img, dx, dy, dw, dh, fx = 0.5, fy = 0.5) {
  const k = Math.max(dw / img.width, dh / img.height), sw = dw / k, sh = dh / k;
  x.drawImage(img, (img.width - sw) * fx, (img.height - sh) * fy, sw, sh, dx, dy, dw, dh);
}
function marcaFragua(x, px, py, tam, color, alinear = 'left') {
  x.save(); x.font = mono(tam); x.fillStyle = color; x.textAlign = alinear; x.textBaseline = 'middle';
  x.letterSpacing = `${tam * 0.42}px`; x.fillText('FRAGUA', px, py); x.restore();
}

// ── El lomo: de abajo arriba, como los libros en español ──
export function lomo(c, p) {
  const x = c.getContext('2d'), [W, H] = TAM.lomo; x.textBaseline = 'alphabetic';
  x.fillStyle = p.color; x.fillRect(0, 0, W, H);
  x.fillStyle = 'rgba(0,0,0,.22)'; x.fillRect(0, 0, W, 150);
  marcaFragua(x, W / 2, 75, 22, conAlfa(p.tinta, 0.85), 'center');
  x.save(); x.translate(W / 2 + 6, H - 260); x.rotate(-Math.PI / 2); x.fillStyle = p.tinta; x.textBaseline = 'middle'; x.textAlign = 'left';
  cabe(x, p.nombre, caslon, 112, H - 560); x.fillText(p.nombre, 0, 0); x.restore();
  sello(x, W / 2, H - 175, 46, p.tinta, p.color);
  x.fillStyle = p.tinta; x.font = mono(40); x.textAlign = 'center'; x.fillText(p.n, W / 2, H - 60);
}

// ── La carátula ──
export async function portada(c, p) {
  const x = c.getContext('2d'), [W, H] = TAM.portada; x.textBaseline = 'alphabetic';
  const img = await cargarArte(p.id);
  x.fillStyle = p.color; x.fillRect(0, 0, W, H);
  if (img) cubrir(x, img, 0, 96, W, H - 96, 0.5, 0.6);
  // la franja de la consola, igual en toda la colección
  x.fillStyle = '#0e0d0c'; x.fillRect(0, 0, W, 96);
  marcaFragua(x, 48, 50, 30, '#f3ece1');
  x.fillStyle = 'rgba(243,236,225,.6)'; x.font = mono(22); x.textAlign = 'right'; x.fillText(`COLECCIÓN 2026 · N.º ${p.n}`, W - 120, 58);
  sello(x, W - 62, 48, 30);
  // el título sobre un degradado del color del proyecto
  const g = x.createLinearGradient(0, 96, 0, 640); g.addColorStop(0, conAlfa(p.color, 0.96)); g.addColorStop(0.55, conAlfa(p.color, 0.7)); g.addColorStop(1, conAlfa(p.color, 0));
  x.fillStyle = g; x.fillRect(0, 96, W, 544);
  x.textAlign = 'center'; x.fillStyle = p.tinta; x.shadowColor = 'rgba(0,0,0,.4)'; x.shadowBlur = 22; x.shadowOffsetY = 5;
  const t = cabe(x, p.nombre, caslon, 210, W - 120); x.fillText(p.nombre, W / 2, 150 + t * 0.92);
  x.shadowBlur = 10; x.shadowOffsetY = 2; x.fillStyle = '#fff'; x.font = serif(54);
  partir(x, p.lema, W - 200).slice(0, 2).forEach((l, i) => x.fillText(l, W / 2, 200 + t * 0.92 + 20 + i * 62));
  x.shadowBlur = 0; x.shadowOffsetY = 0;
  edad(x, 48, H - 172);
  // la pegatina: «Demo jugable» o «Tráiler»
  x.save(); x.translate(W - 150, H - 150); x.rotate(-0.12); x.fillStyle = AMBAR; x.beginPath(); x.arc(0, 0, 108, 0, Math.PI * 2); x.fill();
  x.fillStyle = '#2a1d3a'; x.textAlign = 'center'; x.font = caslon(p.demo ? 62 : 56); x.fillText(p.demo ? 'Demo' : 'Tráiler', 0, -4);
  x.font = mono(21); x.fillText(p.demo ? 'JUGABLE' : 'DENTRO', 0, 32); x.restore();
}

// ── La contraportada ──
export async function dorso(c, p) {
  const x = c.getContext('2d'), [W, H] = TAM.dorso; x.textBaseline = 'alphabetic'; x.textAlign = 'left';
  const img = await cargarArte(p.id);
  x.fillStyle = p.color; x.fillRect(0, 0, W, H);
  x.fillStyle = 'rgba(0,0,0,.18)'; x.fillRect(0, 0, W, 96);
  marcaFragua(x, 64, 50, 26, conAlfa(p.tinta, 0.8));
  x.fillStyle = conAlfa(p.tinta, 0.7); x.font = mono(22); x.textAlign = 'right'; x.fillText(`${p.tipo.toUpperCase()} · ${p.estado.toUpperCase()}`, W - 64, 58);
  x.textAlign = 'left'; x.fillStyle = p.tinta; x.font = serif(66);
  let y = parrafo(x, p.lema, 64, 210, W - 128, 72);
  x.fillStyle = conAlfa('#ffffff', 0.9); x.font = sans(32);
  y = parrafo(x, p.linea, 64, y + 40, W - 128, 44);
  // dos capturas reales de su web, con su pie; sin web que enseñar, la carátula en una sola franja
  const caps = p.capturas ? await Promise.all([1, 2].map((n) => cargarCaptura(p.id, n))) : [];
  if (caps.length && caps.every(Boolean)) {
    caps.forEach((c, k) => {
      const dx = 64 + k * 492, dy = y + 40;
      x.save(); x.beginPath(); x.rect(dx, dy, 460, 288); x.clip(); cubrir(x, c, dx, dy, 460, 288, 0.5, 0); x.restore();
      x.strokeStyle = 'rgba(255,255,255,.85)'; x.lineWidth = 4; x.strokeRect(dx, dy, 460, 288);
      x.fillStyle = conAlfa('#ffffff', 0.8); x.font = mono(19); x.fillText(p.capturas[k], dx, dy + 318);
    });
    y += 350;
  } else if (img) {
    x.save(); x.beginPath(); x.rect(64, y + 40, W - 128, 300); x.clip(); cubrir(x, img, 64, y + 40, W - 128, 300, 0.5, 0.62); x.restore();
    x.strokeStyle = 'rgba(255,255,255,.85)'; x.lineWidth = 4; x.strokeRect(64, y + 40, W - 128, 300);
    y += 340;
  }
  const n = p.cifras.length, col = (W - 128) / Math.max(n, 2);
  p.cifras.forEach(([v, t], i) => {
    const px = 64 + i * col;
    x.fillStyle = p.tinta; cabe(x, v, caslon, 120, col - 30); x.fillText(v, px, y + 180);
    x.fillStyle = conAlfa('#ffffff', 0.9); x.font = sans(34, 600);
    partir(x, t, col - 30).slice(0, 2).forEach((l, k) => x.fillText(l, px, y + 228 + k * 38));
  });
  x.font = mono(24); let sx = 64;
  for (const s of p.stack) { const w = x.measureText(s).width + 40; x.strokeStyle = 'rgba(255,255,255,.5)'; x.lineWidth = 2; x.strokeRect(sx, H - 250, w, 46); x.fillStyle = '#fff'; x.fillText(s, sx + 20, H - 218); sx += w + 14; }
  edad(x, 64, H - 170, 0.9);
  x.fillStyle = 'rgba(255,255,255,.6)'; x.font = sans(19);
  [`© 2026 Fernando Martínez · ${p.tipo}.`, p.demo ? 'La demo es una simulación: datos inventados, mecánica real.' : 'Las cifras son las del proyecto real.'].forEach((l, i) => x.fillText(l, 180, H - 128 + i * 28));
  x.fillStyle = '#fff'; x.fillRect(W - 280, H - 180, 216, 126); x.fillStyle = '#111';
  for (let i = 0, px = W - 266; px < W - 84; i++) { const w = [2, 4, 2, 6, 2, 3][i % 6]; x.fillRect(px, H - 168, w, 80); px += w + [3, 2, 4, 2, 3][i % 5]; }
  x.font = mono(16); x.textAlign = 'center'; x.fillText(`FM-26-${p.n}`, W - 172, H - 66);
}

// ── El disco: corona impresa; el centro (el agujero) queda vacío ──
export async function disco(c, p) {
  const x = c.getContext('2d'), S = TAM.disco[0], m = S / 2; x.clearRect(0, 0, S, S); x.textBaseline = 'alphabetic';
  const img = await cargarArte(p.id);
  x.save(); x.beginPath(); x.arc(m, m, m, 0, Math.PI * 2); x.clip();
  x.fillStyle = p.color; x.fillRect(0, 0, S, S);
  if (img) { x.globalAlpha = 0.55; cubrir(x, img, 0, 0, S, S, 0.5, 0.7); x.globalAlpha = 1; }
  const g = x.createRadialGradient(m, m, 120, m, m, m); g.addColorStop(0, conAlfa(p.color, 0.85)); g.addColorStop(0.6, conAlfa(p.color, 0.45)); g.addColorStop(1, conAlfa(p.color, 0.9));
  x.fillStyle = g; x.fillRect(0, 0, S, S);
  // arriba el título y debajo, al otro lado del agujero, la consola y el número
  x.textAlign = 'center'; x.fillStyle = p.tinta; x.shadowColor = 'rgba(0,0,0,.45)'; x.shadowBlur = 14;
  cabe(x, p.nombre, caslon, 118, 640); x.fillText(p.nombre, m, 300);
  x.shadowBlur = 0; x.fillStyle = '#fff'; x.font = mono(28); x.fillText(p.demo ? 'DISCO 1 · DEMO · SIMULACIÓN' : 'DISCO 1 · TRÁILER', m, 352);
  marcaFragua(x, m, 760, 30, conAlfa(p.tinta, 0.9), 'center');
  sello(x, m - 170, 850, 40, p.tinta, p.color);
  x.fillStyle = '#fff'; x.font = mono(26); x.fillText(`N.º ${p.n}`, m + 170, 860);
  // anillo exterior fino, como el borde de lectura
  x.strokeStyle = 'rgba(255,255,255,.35)'; x.lineWidth = 3; x.beginPath(); x.arc(m, m, m - 14, 0, Math.PI * 2); x.stroke();
  x.restore();
}

// ── El manual: portada y las dos páginas de dentro. La letra va grande: tiene que leerse en la pantalla ──
export async function manual(c, p) {
  const x = c.getContext('2d'), [W, H] = TAM.manual; x.textBaseline = 'alphabetic'; x.textAlign = 'left';
  const img = await cargarArte(p.id);
  x.fillStyle = PAPEL; x.fillRect(0, 0, W, H);
  x.fillStyle = p.color; x.fillRect(0, 0, W, 22);
  sello(x, 100, 110, 42, p.color, p.tinta);
  x.fillStyle = p.color; x.font = mono(24); x.textAlign = 'right'; x.fillText(`N.º ${p.n}`, W - 70, 120);
  x.textAlign = 'left'; cabe(x, p.nombre, caslon, 170, W - 140); x.fillText(p.nombre, 68, 330);
  x.fillStyle = TINTA; x.font = serif(62); x.fillText('Manual de instrucciones', 72, 410);
  if (img) { x.save(); x.beginPath(); x.rect(68, 470, W - 136, 760); x.clip(); cubrir(x, img, 68, 470, W - 136, 760, 0.5, 0.62); x.restore(); }
  x.fillStyle = TINTA; x.font = sans(30); parrafo(x, p.linea, 68, 1300, W - 136, 42);
  marcaFragua(x, 68, H - 70, 22, conAlfa(TINTA, 0.6));
}
function cabecera(x, p, texto, y) {
  x.fillStyle = p.color; x.font = mono(26); x.fillText(texto.toUpperCase(), 80, y);
  x.fillRect(80, y + 18, 60, 4);
}
export function paginaIzquierda(c, p) {
  const x = c.getContext('2d'), [W, H] = TAM.pagina_i; x.textBaseline = 'alphabetic'; x.textAlign = 'left';
  x.fillStyle = PAPEL; x.fillRect(0, 0, W, H);
  const g = x.createLinearGradient(W - 70, 0, W, 0); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,.1)'); x.fillStyle = g; x.fillRect(W - 70, 0, 70, H);
  x.fillStyle = TINTA; cabe(x, p.nombre, caslon, 120, W - 160); x.fillText(p.nombre, 80, 190);
  x.fillStyle = conAlfa(TINTA, 0.7); x.font = serif(46); let y = parrafo(x, p.lema, 82, 262, W - 160, 52);
  y += 50;
  for (const [titulo, texto] of p.bloques.filter(([t]) => t !== 'Resultado')) {
    cabecera(x, p, titulo, y + 20); x.fillStyle = TINTA; x.font = sans(44);
    y = parrafo(x, texto, 80, y + 110, W - 160, 58) + 46;
  }
  if (p.jugar) { cabecera(x, p, 'Cómo se juega', y + 20); x.fillStyle = TINTA; x.font = sans(36); parrafo(x, p.jugar, 80, y + 100, W - 160, 48); }
  x.fillStyle = conAlfa(TINTA, 0.5); x.font = mono(24); x.fillText('2', 80, H - 70);
}
export function paginaDerecha(c, p) {
  const x = c.getContext('2d'), [W, H] = TAM.pagina_d; x.textBaseline = 'alphabetic'; x.textAlign = 'left';
  x.fillStyle = PAPEL; x.fillRect(0, 0, W, H);
  const g = x.createLinearGradient(0, 0, 70, 0); g.addColorStop(0, 'rgba(0,0,0,.12)'); g.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = g; x.fillRect(0, 0, 70, H);
  const res = p.bloques.find(([t]) => t === 'Resultado');
  let y = 130;
  if (res) { cabecera(x, p, 'Resultado', y); x.fillStyle = TINTA; x.font = sans(44); y = parrafo(x, res[1], 80, y + 90, W - 160, 58) + 40; }
  // las cifras, grandes y en el color del proyecto
  p.cifras.forEach(([v, t]) => {
    x.fillStyle = p.color; cabe(x, v, caslon, 150, 420); x.fillText(v, 80, y + 140);
    x.fillStyle = TINTA; x.font = sans(36); partir(x, t, W - 560).forEach((l, k) => x.fillText(l, 520, y + 92 + k * 44));
    x.fillStyle = conAlfa(TINTA, 0.15); x.fillRect(80, y + 176, W - 160, 2);
    y += 190;
  });
  if (p.stack.length) {
    cabecera(x, p, 'Con qué está hecho', y + 60); x.font = mono(32); let sx = 80; const sy = y + 120;
    for (const s of p.stack) { const w = x.measureText(s).width + 44; x.strokeStyle = conAlfa(TINTA, 0.55); x.lineWidth = 2.5; x.strokeRect(sx, sy, w, 60); x.fillStyle = TINTA; x.fillText(s, sx + 22, sy + 41); sx += w + 16; }
    y = sy + 80;
  }
  if (p.web) { x.fillStyle = p.color; x.font = sans(40, 600); x.fillText(`${p.web[0]} ↗`, 80, Math.max(y + 110, H - 230)); }
  x.fillStyle = conAlfa(TINTA, 0.6); x.font = mono(24); x.fillText(`${p.tipo.toUpperCase()} · ${p.estado.toUpperCase()}`, 80, H - 140);
  x.fillStyle = conAlfa(TINTA, 0.5); x.textAlign = 'right'; x.fillText('3', W - 80, H - 70);
}

// ── El frente de la consola: grafito cepillado, el nombre en espaciado ancho y la marca de encendido ──
export function consola(c) {
  const x = c.getContext('2d'), [W, H] = TAM.consola;
  x.fillStyle = '#2b2a2c'; x.fillRect(0, 0, W, H);
  for (let i = 0; i < 260; i++) { x.fillStyle = `rgba(255,255,255,${0.012 + Math.random() * 0.02})`; x.fillRect(0, Math.random() * H, W, 1); }
  // la ranura (geometría) cae en x 88–1080, y ≈ 128; la luz, en x ≈ 1392: el nombre va debajo, a la izquierda
  marcaFragua(x, 96, 262, 30, 'rgba(243,236,225,.5)', 'left');
  x.strokeStyle = 'rgba(243,236,225,.3)'; x.lineWidth = 2.5; x.beginPath(); x.arc(1392, 250, 15, -1.0, 4.14); x.moveTo(1392, 228); x.lineTo(1392, 246); x.stroke();
}

export { PROYECTOS };
