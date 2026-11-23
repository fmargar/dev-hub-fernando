// Lo impreso del panel de salidas: la tarjeta de embarque (cara, dorso y las dos caras de la colilla), el cartel de
// «Salidas», los rótulos de las columnas y la pantalla del quiosco. Todo en canvas: cambia
// de vuelo sin volver a hornear. La letra se mide para leerse en pantalla: nada por debajo de 30 px en el canvas
// (unos 13 px en escritorio con la tarjeta en la mano).
import { cargarArte } from '../../../kit-e1/js/coleccion.js';

export const PX = 1000;                         // píxeles de canvas por unidad de la escena (1 = 10 cm)
export const TAM = {
  cara: [1450, 800], dorso: [1450, 800], colilla: [550, 800], colilla_dorso: [550, 800],
  cartel: [1392, 256], rotulos: [2576, 74], quiosco: [780, 600],
};
const PAPEL = '#f3eee3', TINTA = '#1d1915', GRIS = '#6d655b', AMBAR = '#F7B500';
const caslon = (t) => `700 ${t}px 'Caslon Cond'`;
const sans = (t, p = 400) => `${p} ${t}px 'Instrument Sans'`;
const serif = (t) => `italic 400 ${t}px 'Instrument Serif'`;
const mono = (t) => `500 ${t}px 'DM Mono'`;
const alfa = (hex, a) => `${hex}${Math.round(a * 255).toString(16).padStart(2, '0')}`;

function cabe(x, texto, fuente, tam, ancho, min = 20) {
  let t = tam; x.font = fuente(t);
  while (x.measureText(texto).width > ancho && t > min) { t -= 2; x.font = fuente(t); }
  return t;
}
function partir(x, texto, ancho) {
  const ls = []; let l = '';
  for (const p of texto.split(' ')) { const t = l ? `${l} ${p}` : p; if (x.measureText(t).width > ancho && l) { ls.push(l); l = p; } else l = t; }
  return [...ls, l];
}
function parrafo(x, texto, px, py, ancho, alto, max = 99) {
  const ls = partir(x, texto, ancho);
  const corte = ls.length > max ? [...ls.slice(0, max - 1), `${ls[max - 1]}…`] : ls;
  corte.forEach((l, i) => x.fillText(l, px, py + i * alto)); return py + corte.length * alto;
}
function cubrir(x, img, dx, dy, dw, dh, fx = 0.5, fy = 0.5) {
  const k = Math.max(dw / img.width, dh / img.height), sw = dw / k, sh = dh / k;
  x.drawImage(img, (img.width - sw) * fx, (img.height - sh) * fy, sw, sh, dx, dy, dw, dh);
}
function sello(x, cx, cy, r, fondo, tinta) {
  x.save(); x.fillStyle = fondo; x.beginPath(); x.arc(cx, cy, r, 0, Math.PI * 2); x.fill();
  x.fillStyle = tinta; x.font = caslon(r * 1.05); x.textAlign = 'center'; x.textBaseline = 'middle';
  x.fillText('FM', cx, cy + r * 0.06); x.restore();
}
// el código de barras: siempre el mismo para el mismo vuelo
function barras(x, px, py, w, h, semilla, vertical = false) {
  let s = [...semilla].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
  const r = () => { s = (s * 1103515245 + 12345) >>> 0; return s / 2 ** 32; };
  x.fillStyle = TINTA;
  for (let t = 0; t < (vertical ? h : w);) {
    const g = 2 + Math.floor(r() * 4) * 2, hueco = 2 + Math.floor(r() * 3) * 2;
    if (vertical) x.fillRect(px, py + t, w, Math.min(g, h - t)); else x.fillRect(px + t, py, Math.min(g, w - t), h);
    t += g + hueco;
  }
}
function campo(x, etiqueta, valor, px, py, ancho, tam = 50) {
  x.fillStyle = GRIS; x.font = mono(28); x.fillText(etiqueta.toUpperCase(), px, py);
  x.fillStyle = TINTA; cabe(x, valor, (t) => sans(t, 600), tam, ancho, 30); x.fillText(valor, px, py + tam + 14);
}
// la ventanilla del avión: un rectángulo de esquinas muy redondas
function ventanilla(x, px, py, w, h) { x.beginPath(); x.roundRect(px, py, w, h, Math.min(w, h) * 0.32); }

// ── La cara de la tarjeta ──
export async function cara(c, p, v) {
  const x = c.getContext('2d'), [W, H] = TAM.cara; x.textBaseline = 'alphabetic'; x.textAlign = 'left';
  const img = await cargarArte(p.id);
  x.fillStyle = PAPEL; x.fillRect(0, 0, W, H);
  // la franja del vuelo, en el color del proyecto
  x.fillStyle = p.color; x.fillRect(0, 0, W, 124);
  sello(x, 82, 62, 38, p.tinta, p.color);
  x.fillStyle = p.tinta; x.font = mono(30); x.letterSpacing = '6px'; x.fillText('TARJETA DE EMBARQUE', 146, 73);
  x.textAlign = 'right'; x.fillText(`N.º ${p.n} · COLECCIÓN 2026`, W - 56, 73); x.letterSpacing = '0px'; x.textAlign = 'left';
  // el destino, grande; debajo, el lema
  x.fillStyle = GRIS; x.font = mono(28); x.fillText('DESTINO', 64, 200);
  x.fillStyle = TINTA; const t = cabe(x, p.nombre, caslon, 132, 800, 60); x.fillText(p.nombre, 60, 200 + t * 0.95);
  x.fillStyle = alfa(TINTA, 0.78); x.font = serif(44);
  let y = parrafo(x, p.lema, 64, 200 + t * 0.95 + 66, 780, 50, 2);
  // los datos del vuelo, en una rejilla de cuatro
  y = Math.max(y + 34, 520);
  x.fillStyle = alfa(TINTA, 0.14); x.fillRect(64, y - 44, 790, 2);
  [['Vuelo', v.vuelo], ['Puerta', v.puerta], ['Embarque', v.hora], ['Asiento', v.asiento]].forEach(([e, val], i) => campo(x, e, val, 64 + i * 200, y, 180));
  x.fillStyle = GRIS; x.font = mono(28); x.fillText(`${p.tipo} · ${p.estado}`.toUpperCase(), 64, H - 50);
  // la ventanilla con el arte del proyecto
  const vx = 900, vy = 168, vw = 494, vh = 560;
  x.save(); ventanilla(x, vx, vy, vw, vh); x.clip();
  x.fillStyle = p.color; x.fillRect(vx, vy, vw, vh);
  if (img) cubrir(x, img, vx, vy, vw, vh, 0.5, 0.62);
  const g = x.createLinearGradient(vx, vy, vx + vw, vy + vh); g.addColorStop(0, 'rgba(255,255,255,.22)'); g.addColorStop(0.4, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(vx, vy, vw, vh);
  x.restore();
  x.strokeStyle = alfa(TINTA, 0.85); x.lineWidth = 6; ventanilla(x, vx, vy, vw, vh); x.stroke();
  x.fillStyle = GRIS; x.font = mono(26); x.textAlign = 'right'; x.fillText(p.demo ? 'A BORDO: DEMO JUGABLE' : 'A BORDO: TRÁILER', vx + vw, H - 50); x.textAlign = 'left';
  // el troquel: media perforación en el borde derecho (la otra mitad está en la colilla)
  x.fillStyle = alfa(TINTA, 0.35); for (let k = 10; k < H; k += 22) x.fillRect(W - 4, k, 4, 10);
}

// ── La colilla: lo que te quedas; arrancarla lleva a la web ──
export function colilla(c, p, v) {
  const x = c.getContext('2d'), [W, H] = TAM.colilla; x.textBaseline = 'alphabetic'; x.textAlign = 'left';
  x.fillStyle = PAPEL; x.fillRect(0, 0, W, H);
  x.fillStyle = p.color; x.fillRect(0, 0, W, 124);
  x.fillStyle = alfa(TINTA, 0.35); for (let k = 10; k < H; k += 22) x.fillRect(0, k, 4, 10);
  x.fillStyle = p.tinta; x.font = mono(30); x.letterSpacing = '6px'; x.fillText('COLILLA', 48, 73); x.letterSpacing = '0px';
  x.fillStyle = TINTA; cabe(x, p.nombre, caslon, 76, W - 96, 40); x.fillText(p.nombre, 46, 230);
  campo(x, 'Vuelo', v.vuelo, 48, 300, 200, 46); campo(x, 'Puerta', v.puerta, 280, 300, 200, 46);
  x.fillStyle = alfa(TINTA, 0.14); x.fillRect(48, 410, W - 96, 2);
  if (p.web) {
    const txt = `${p.web[0].replace(/^github\.com\//, '')} ↗`;
    x.fillStyle = p.color === '#B8901C' ? '#7a5d0c' : p.color; cabe(x, txt, (t) => sans(t, 600), 46, W - 96, 28); x.fillText(txt, 48, 482);
    x.fillStyle = GRIS; x.font = sans(32); x.fillText('Arráncala para ir a su web', 48, 532);
  } else {
    x.fillStyle = GRIS; x.font = sans(34); parrafo(x, 'Sin web pública: guárdala de recuerdo.', 48, 482, W - 96, 42);
  }
  barras(x, 48, 600, W - 96, 120, p.id + v.vuelo);
  x.fillStyle = GRIS; x.font = mono(26); x.fillText(`FM-26-${p.n}`, 48, 766);
}

// ── El dorso: la información del vuelo (qué es, qué hice yo, el resultado, las cifras y el equipaje) ──
export function dorso(c, p) {
  const x = c.getContext('2d'), [W, H] = TAM.dorso; x.textBaseline = 'alphabetic'; x.textAlign = 'left';
  x.fillStyle = PAPEL; x.fillRect(0, 0, W, H);
  x.fillStyle = TINTA; x.fillRect(0, 0, W, 96);
  x.fillStyle = '#f3eee3'; x.font = mono(30); x.letterSpacing = '6px'; x.fillText('INFORMACIÓN DEL VUELO', 64, 60);
  x.textAlign = 'right'; x.fillStyle = AMBAR; x.fillText(p.nombre.toUpperCase(), W - 64, 60); x.textAlign = 'left'; x.letterSpacing = '0px';
  const col = (W - 128 - 2 * 48) / 3;
  p.bloques.forEach(([titulo, texto], i) => {
    const px = 64 + i * (col + 48);
    x.fillStyle = p.color === '#B8901C' ? '#7a5d0c' : p.color; x.font = mono(28); x.fillText(titulo.toUpperCase(), px, 160);
    x.fillRect(px, 176, 48, 4);
    x.fillStyle = TINTA; x.font = sans(36); parrafo(x, texto, px, 232, col, 46, 6);
  });
  x.fillStyle = alfa(TINTA, 0.14); x.fillRect(64, 540, W - 128, 2);
  // las cifras, a la izquierda; el equipaje (con qué está hecho), a la derecha
  let cx = 64;
  for (const [n, t] of p.cifras.slice(0, 3)) {
    x.fillStyle = TINTA; const tt = cabe(x, n, caslon, 92, 300, 50); const w = Math.max(x.measureText(n).width, 150);
    x.fillText(n, cx, 640);
    x.fillStyle = GRIS; x.font = mono(26); partir(x, t.toUpperCase(), Math.max(w, 230)).slice(0, 2).forEach((l, k) => x.fillText(l, cx, 684 + k * 32));
    cx += Math.max(w, 230) + 48; void tt;
  }
  if (p.stack.length) {
    x.fillStyle = GRIS; x.font = mono(26); x.textAlign = 'right'; x.fillText('EQUIPAJE DE MANO', W - 64, 590); x.textAlign = 'left';
    x.font = mono(30); let sx = W - 64; const sy = 618;
    for (const s of [...p.stack].reverse()) {
      const w = x.measureText(s).width + 40; sx -= w;
      x.strokeStyle = alfa(TINTA, 0.6); x.lineWidth = 2.5; x.beginPath(); x.roundRect(sx, sy, w, 56, 8); x.stroke();
      x.fillStyle = TINTA; x.fillText(s, sx + 20, sy + 38); sx -= 12;
    }
  }
  x.fillStyle = GRIS; x.font = sans(26);
  x.fillText(p.demo ? 'A bordo: la demo es una simulación, con datos inventados y la mecánica real.' : 'Las cifras son las del proyecto real.', 64, H - 28);
}
export function colillaDorso(c, p) {
  const x = c.getContext('2d'), [W, H] = TAM.colilla_dorso; x.textBaseline = 'alphabetic'; x.textAlign = 'left';
  x.fillStyle = PAPEL; x.fillRect(0, 0, W, H);
  x.fillStyle = TINTA; x.fillRect(0, 0, W, 96);
  x.fillStyle = alfa(TINTA, 0.35); for (let k = 10; k < H; k += 22) x.fillRect(W - 4, k, 4, 10);
  sello(x, 96, 260, 52, p.color, p.tinta);
  x.fillStyle = TINTA; x.font = sans(36, 600); parrafo(x, 'Conserva la colilla hasta el final del viaje.', 48, 380, W - 96, 46);
  x.fillStyle = GRIS; x.font = sans(30); parrafo(x, 'Fernando Martínez · Desarrollador Full Stack', 48, 520, W - 96, 40);
  x.font = mono(26); x.fillText('FMARGARDEVELOPER@GMAIL.COM', 48, H - 60);
}

// ── El cartel de «Salidas», retroiluminado (amarillo y negro, como la señalética de un aeropuerto) ──
export function cartel(c) {
  const x = c.getContext('2d'), [W, H] = TAM.cartel;
  x.fillStyle = AMBAR; x.fillRect(0, 0, W, H);
  // el avión despegando, de trazo grueso
  x.save(); x.translate(130, H / 2 + 4); x.rotate(-0.42); x.fillStyle = '#111';
  x.beginPath(); x.roundRect(-70, -13, 150, 26, 13); x.fill();
  x.beginPath(); x.moveTo(-6, -10); x.lineTo(-40, -74); x.lineTo(-14, -74); x.lineTo(34, -10); x.closePath(); x.fill();
  x.beginPath(); x.moveTo(-6, 10); x.lineTo(-40, 74); x.lineTo(-14, 74); x.lineTo(34, 10); x.closePath(); x.fill();
  x.beginPath(); x.moveTo(-58, -8); x.lineTo(-80, -40); x.lineTo(-66, -40); x.lineTo(-40, -8); x.closePath(); x.fill();
  x.beginPath(); x.moveTo(-58, 8); x.lineTo(-80, 40); x.lineTo(-66, 40); x.lineTo(-40, 8); x.closePath(); x.fill();
  x.restore();
  x.fillStyle = '#111'; x.textBaseline = 'middle'; x.font = sans(124, 600); x.fillText('Salidas', 250, H / 2 + 6);
  const w = x.measureText('Salidas').width; x.font = sans(64); x.fillStyle = '#111'; x.fillText('Departures', 290 + w, H / 2 + 22);
}

// ── Los rótulos de las columnas, en la franja de arriba del panel ──
export function rotulos(c, columnas, cols) {
  const x = c.getContext('2d'), [W, H] = TAM.rotulos;
  x.fillStyle = '#0d0d0e'; x.fillRect(0, 0, W, H);
  x.fillStyle = AMBAR; x.font = mono(31); x.textBaseline = 'middle'; x.letterSpacing = '3px';
  for (const [nombre, desde] of columnas) x.fillText(nombre, (desde / cols) * W + 6, H / 2 + 2);
}

// ── La pantalla del quiosco ──
export function quiosco(c, estado, p) {
  const x = c.getContext('2d'), [W, H] = TAM.quiosco;
  const g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#13213f'); g.addColorStop(1, '#0a1226');
  x.fillStyle = g; x.fillRect(0, 0, W, H);
  x.fillStyle = AMBAR; x.fillRect(0, 0, W, 10);
  sello(x, 70, 74, 34, AMBAR, '#13213f');
  x.fillStyle = '#e8eefc'; x.font = mono(26); x.letterSpacing = '4px'; x.fillText('FACTURACIÓN', 124, 84); x.letterSpacing = '0px';
  x.textBaseline = 'alphabetic';
  if (estado === 'leida' && p) {
    x.font = sans(44, 600); x.fillText(`FM ${p.n} · ${p.nombre}`, 44, 250);
    x.fillStyle = '#3ee07a'; x.font = sans(40, 600); x.fillText('✓ Tarjeta leída', 44, 330);
    x.fillStyle = '#b8c4e0'; x.font = sans(32); x.fillText('Buen vuelo.', 44, 400);
  } else if (estado === 'imprime' && p) {
    x.font = sans(44, 600); x.fillText(`FM ${p.n} · ${p.nombre}`, 44, 250);
    x.fillStyle = '#b8c4e0'; x.font = sans(34); x.fillText('Imprimiendo tu tarjeta…', 44, 312);
    x.fillStyle = 'rgba(255,255,255,.14)'; x.beginPath(); x.roundRect(44, 380, W - 88, 22, 11); x.fill();
    x.fillStyle = AMBAR; x.beginPath(); x.roundRect(44, 380, (W - 88) * 0.72, 22, 11); x.fill();
    x.fillStyle = '#b8c4e0'; x.font = sans(30); x.fillText('Recógela debajo de la pantalla ↓', 44, 500);
  } else {
    x.font = sans(52, 600); x.fillText('Elige tu vuelo', 44, 260);
    x.fillStyle = '#b8c4e0'; x.font = sans(34); x.fillText('en el panel de salidas.', 44, 318);
    x.fillText('Tu tarjeta sale por aquí ↓', 44, 470);
  }
}

// ── En el móvil la tarjeta se sostiene de pie (girada 90°): cada cara se compone en vertical y se gira dentro de su
// canvas, para que en la pantalla la letra quede derecha. La cara se ve girada a la derecha y el dorso, a la izquierda.
function enVertical(c, sentido, pinta) {
  const o = document.createElement('canvas'); o.width = c.height; o.height = c.width;
  const r = pinta(o);
  const fin = () => {
    const x = c.getContext('2d'); x.save();
    if (sentido > 0) { x.translate(0, c.height); x.rotate(-Math.PI / 2); } else { x.translate(c.width, 0); x.rotate(Math.PI / 2); }
    x.drawImage(o, 0, 0); x.restore();
  };
  return r instanceof Promise ? r.then(fin) : fin();
}
export async function caraVertical(c, p, v) {
  return enVertical(c, 1, async (o) => {
    const x = o.getContext('2d'), W = o.width, H = o.height; x.textBaseline = 'alphabetic'; x.textAlign = 'left';
    const img = await cargarArte(p.id);
    x.fillStyle = PAPEL; x.fillRect(0, 0, W, H);
    x.fillStyle = p.color; x.fillRect(0, 0, W, 120);
    sello(x, 74, 60, 36, p.tinta, p.color);
    x.fillStyle = p.tinta; x.font = mono(28); x.letterSpacing = '5px'; x.fillText('TARJETA DE EMBARQUE', 130, 70);
    x.letterSpacing = '0px';
    x.fillStyle = GRIS; x.font = mono(30); x.fillText('DESTINO', 56, 196);
    x.fillStyle = TINTA; const t = cabe(x, p.nombre, caslon, 128, W - 112, 60); x.fillText(p.nombre, 52, 196 + t * 0.95);
    x.fillStyle = alfa(TINTA, 0.78); x.font = serif(44); parrafo(x, p.lema, 56, 196 + t * 0.95 + 62, W - 112, 50, 2);
    const vx = 56, vy = 470, vw = W - 112, vh = 470;
    x.save(); ventanilla(x, vx, vy, vw, vh); x.clip(); x.fillStyle = p.color; x.fillRect(vx, vy, vw, vh);
    if (img) cubrir(x, img, vx, vy, vw, vh, 0.5, 0.62); x.restore();
    x.strokeStyle = alfa(TINTA, 0.85); x.lineWidth = 6; ventanilla(x, vx, vy, vw, vh); x.stroke();
    [['Vuelo', v.vuelo], ['Puerta', v.puerta], ['Embarque', v.hora], ['Asiento', v.asiento]].forEach(([e, val], i) => campo(x, e, val, 56 + (i % 2) * 360, 1030 + Math.floor(i / 2) * 150, 320, 56));
    x.fillStyle = GRIS; x.font = mono(28); x.fillText(`${p.tipo} · ${p.estado}`.toUpperCase(), 56, H - 50);
    x.fillStyle = alfa(TINTA, 0.35); for (let k = 10; k < W; k += 22) x.fillRect(k, H - 4, 10, 4);
  });
}
export function colillaVertical(c, p, v) {
  return enVertical(c, 1, (o) => {
    const x = o.getContext('2d'), W = o.width, H = o.height; x.textBaseline = 'alphabetic'; x.textAlign = 'left';
    x.fillStyle = PAPEL; x.fillRect(0, 0, W, H);
    x.fillStyle = alfa(TINTA, 0.35); for (let k = 10; k < W; k += 22) x.fillRect(k, 0, 10, 4);
    x.fillStyle = GRIS; x.font = mono(28); x.letterSpacing = '5px'; x.fillText('COLILLA', 56, 74); x.letterSpacing = '0px';
    x.fillStyle = TINTA; cabe(x, p.nombre, caslon, 76, 440, 40); x.fillText(p.nombre, 54, 152);
    campo(x, 'Vuelo', v.vuelo, 540, 66, 220, 44);
    if (p.web) {
      const txt = `${p.web[0].replace(/^github\.com\//, '')} ↗`;
      x.fillStyle = p.color === '#B8901C' ? '#7a5d0c' : p.color; cabe(x, txt, (t) => sans(t, 600), 50, W - 112, 28); x.fillText(txt, 56, 262);
      x.fillStyle = GRIS; x.font = sans(34); x.fillText('Toca la colilla para ir a su web', 56, 312);
    } else { x.fillStyle = GRIS; x.font = sans(36); x.fillText('Sin web pública: guárdala de recuerdo.', 56, 262); }
    barras(x, 56, 370, W - 112, 110, p.id + v.vuelo);
    x.fillStyle = GRIS; x.font = mono(26); x.fillText(`FM-26-${p.n}`, 56, 522);
  });
}
export function dorsoVertical(c, p) {
  return enVertical(c, -1, (o) => {
    const x = o.getContext('2d'), W = o.width, H = o.height; x.textBaseline = 'alphabetic'; x.textAlign = 'left';
    x.fillStyle = PAPEL; x.fillRect(0, 0, W, H);
    x.fillStyle = TINTA; x.fillRect(0, 0, W, 96);
    x.fillStyle = AMBAR; x.font = mono(28); x.letterSpacing = '5px'; x.fillText('INFORMACIÓN DEL VUELO', 56, 60); x.letterSpacing = '0px';
    let y = 160;
    for (const [titulo, texto] of p.bloques) {
      x.fillStyle = p.color === '#B8901C' ? '#7a5d0c' : p.color; x.font = mono(28); x.fillText(titulo.toUpperCase(), 56, y);
      x.fillStyle = TINTA; x.font = sans(43); y = parrafo(x, texto, 56, y + 56, W - 112, 54, 4) + 40;
    }
    x.fillStyle = alfa(TINTA, 0.14); x.fillRect(56, y, W - 112, 2); y += 96;
    let cx = 56;
    for (const [n, t] of p.cifras.slice(0, 2)) {
      x.fillStyle = TINTA; cabe(x, n, caslon, 88, 320, 50); x.fillText(n, cx, y);
      x.fillStyle = GRIS; x.font = mono(26); partir(x, t.toUpperCase(), 320).slice(0, 2).forEach((l, k) => x.fillText(l, cx, y + 40 + k * 32));
      cx += 360;
    }
    if (p.stack.length) {
      x.font = mono(30); let sx = 56; const sy = Math.min(H - 150, y + 150);   // justo debajo de las cifras
      x.fillStyle = GRIS; x.font = mono(26); x.fillText('EQUIPAJE DE MANO', 56, sy - 22); x.font = mono(30);
      for (const s of p.stack) { const w = x.measureText(s).width + 40; x.strokeStyle = alfa(TINTA, 0.6); x.lineWidth = 2.5; x.beginPath(); x.roundRect(sx, sy, w, 56, 8); x.stroke(); x.fillStyle = TINTA; x.fillText(s, sx + 20, sy + 38); sx += w + 12; }
    }
  });
}
export function colillaDorsoVertical(c, p) {
  return enVertical(c, -1, (o) => {
    const x = o.getContext('2d'), W = o.width, H = o.height; x.textBaseline = 'alphabetic'; x.textAlign = 'left';
    x.fillStyle = PAPEL; x.fillRect(0, 0, W, H);
    sello(x, 100, 130, 50, p.color, p.tinta);
    x.fillStyle = TINTA; x.font = sans(38, 600); parrafo(x, 'Conserva la colilla hasta el final del viaje.', 180, 118, W - 240, 46);
    x.fillStyle = GRIS; x.font = sans(32); x.fillText('Fernando Martínez · Desarrollador Full Stack', 56, 330);
    x.font = mono(26); x.fillText('FMARGARDEVELOPER@GMAIL.COM', 56, 400);
  });
}
