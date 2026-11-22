// Lo impreso de la técnica B (juguete de vinilo): se pinta en un canvas en el navegador, con la letra de la web,
// y three.js lo usa como textura. Cambiar el título o el color es volver a pintar un canvas (milisegundos).
import { JUEGO, BALDA } from '../comun/datos.js';

export const TINTA = '#3b2a5a';
export const CREMA = '#fff6ea';
export const PASTEL = ['#8ec5ff', '#ff9f8a', null, '#8fd6bf', '#c3a8f5', '#7fcfd0', '#ff9fc4', '#ffd97a', '#a9c98f'];
const F = (peso, tam) => `${peso} ${tam}px Fredoka, system-ui, sans-serif`;

function lienzo(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
function redondo(g, x, y, w, h, r) { g.beginPath(); g.roundRect(x, y, w, h, r); }
// Un texto que cabe: baja el tamaño hasta que entra en el ancho
function cabe(g, texto, peso, tam, ancho) {
  let t = tam; g.font = F(peso, t);
  while (g.measureText(texto).width > ancho && t > 10) { t -= 2; g.font = F(peso, t); }
  return t;
}
// Sombra suave de juguete: un óvalo difuso bajo cada cosa
function sombra(g, x, y, rx, ry, a = 0.18) {
  const gr = g.createRadialGradient(x, y, 0, x, y, rx);
  gr.addColorStop(0, `rgba(59,42,90,${a})`); gr.addColorStop(1, 'rgba(59,42,90,0)');
  g.save(); g.translate(x, y); g.scale(1, ry / rx); g.translate(-x, -y);
  g.fillStyle = gr; g.beginPath(); g.arc(x, y, rx, 0, Math.PI * 2); g.fill(); g.restore();
}
// Volumen de vinilo: un brillo arriba a la izquierda y un poco de sombra abajo, sobre la forma ya rellena
function volumen(g, x, y, r) {
  const gr = g.createRadialGradient(x - r * 0.4, y - r * 0.5, r * 0.1, x, y, r * 1.2);
  gr.addColorStop(0, 'rgba(255,255,255,.55)'); gr.addColorStop(0.45, 'rgba(255,255,255,0)'); gr.addColorStop(1, 'rgba(59,42,90,.22)');
  return gr;
}

// Un muñeco de vinilo: cuerpo de cápsula, cabeza redonda y un rasgo propio
function muneco(g, x, base, color, rasgo, oscuro = false) {
  const r = 50;
  sombra(g, x, base + 4, 70, 16);
  const pinta = (dibujo) => { g.fillStyle = oscuro ? TINTA : color; dibujo(); g.fill(); if (!oscuro) { g.fillStyle = volumen(g, x, base - 120, 110); dibujo(); g.fill(); } };
  pinta(() => redondo(g, x - 46, base - 120, 92, 120, 46));
  pinta(() => { g.beginPath(); g.arc(x, base - 150, r, 0, Math.PI * 2); });
  g.fillStyle = oscuro ? TINTA : color;
  if (rasgo === 'orejas') { pinta(() => { g.beginPath(); g.arc(x - 38, base - 192, 20, 0, Math.PI * 2); g.arc(x + 38, base - 192, 20, 0, Math.PI * 2); }); }
  if (rasgo === 'antena') { g.fillRect(x - 4, base - 228, 8, 34); pinta(() => { g.beginPath(); g.arc(x, base - 232, 13, 0, Math.PI * 2); }); }
  if (rasgo === 'gorro') { pinta(() => { g.beginPath(); g.moveTo(x - 46, base - 176); g.quadraticCurveTo(x, base - 290, x + 46, base - 176); g.closePath(); }); }
  if (rasgo === 'sombrero') { pinta(() => redondo(g, x - 64, base - 192, 128, 18, 9)); pinta(() => redondo(g, x - 36, base - 238, 72, 52, 18)); }
  if (rasgo === 'seta') { pinta(() => { g.beginPath(); g.ellipse(x, base - 180, 70, 44, 0, Math.PI, 0); g.closePath(); }); g.fillStyle = CREMA; for (const [dx, dy, rr] of [[-34, -196, 10], [8, -212, 12], [36, -190, 8]]) { g.beginPath(); g.arc(x + dx, base + dy, rr, 0, Math.PI * 2); g.fill(); } }
  if (oscuro) {
    g.fillStyle = '#ffd97a'; g.font = F(700, 64); g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('?', x, base - 146);
  } else {
    g.fillStyle = TINTA; for (const dx of [-17, 17]) { g.beginPath(); g.ellipse(x + dx, base - 152, 6, 8, 0, 0, Math.PI * 2); g.fill(); }
    g.fillStyle = 'rgba(255,120,140,.35)'; for (const dx of [-30, 30]) { g.beginPath(); g.ellipse(x + dx, base - 134, 10, 6, 0, 0, Math.PI * 2); g.fill(); }
  }
}

function sello(g, x, y, r, fondo, tinta) {
  g.fillStyle = fondo; g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill();
  g.fillStyle = tinta; g.font = F(700, r * 0.9); g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('FM', x, y + r * 0.04);
}

export function portada(c, { titulo, color }) {
  const g = c.getContext('2d'), w = c.width, h = c.height;
  g.fillStyle = color; g.fillRect(0, 0, w, h);
  // cielo de pegatina: dos círculos grandes de un tono más claro
  g.fillStyle = 'rgba(255,255,255,.22)'; g.beginPath(); g.arc(w * 0.85, h * 0.12, 260, 0, Math.PI * 2); g.fill();
  g.beginPath(); g.arc(w * 0.08, h * 0.55, 180, 0, Math.PI * 2); g.fill();
  sello(g, 92, 92, 46, CREMA, TINTA);
  g.fillStyle = TINTA; g.font = F(600, 30); g.textAlign = 'right'; g.textBaseline = 'middle'; g.fillText('COLECCIÓN 2026 · Nº 01', w - 60, 92);
  // el título, gordo y con un canto de juguete (una copia desplazada más oscura)
  g.textAlign = 'center'; g.textBaseline = 'alphabetic';
  const t = cabe(g, titulo, 700, 190, w - 110);
  g.fillStyle = TINTA; g.fillText(titulo, w / 2 + 6, 330 + 10);
  g.fillStyle = CREMA; g.fillText(titulo, w / 2, 330);
  g.font = F(500, Math.min(54, t * 0.36)); g.fillStyle = TINTA; g.fillText('¿Quién es hoy?', w / 2, 410);
  // la rueda de reconocimiento: suelo crema con rayas de altura
  redondo(g, 50, 470, w - 100, 820, 60); g.fillStyle = CREMA; g.fill();
  g.save(); g.clip();
  g.strokeStyle = 'rgba(59,42,90,.14)'; g.lineWidth = 6;
  for (let y = 560; y < 1200; y += 70) { g.beginPath(); g.moveTo(50, y); g.lineTo(w - 50, y); g.stroke(); }
  g.fillStyle = 'rgba(59,42,90,.06)'; g.fillRect(50, 1130, w - 100, 160);
  // los seis sospechosos, grandes y un poco apretados, como en una foto de grupo
  g.save(); g.translate(540, 1250); g.scale(1.62, 1.62); g.translate(-540, -1250);
  const cols = ['#ff9fc4', '#ffd97a', '#8ec5ff', null, '#8fd6bf', '#ff9f8a'], rasgos = ['orejas', 'antena', 'gorro', 'sombrero', null, 'seta'];
  cols.forEach((col, i) => muneco(g, 540 + (i - 2.5) * 106, 1236 + (i % 2) * 10, col ?? TINTA, rasgos[i], i === 3));
  // la lupa sobre el de la sombra: aro gordo amarillo con brillo
  const lx = 540 + 0.5 * 106, ly = 1236 - 150;
  g.lineWidth = 26; g.strokeStyle = '#ffd97a'; g.beginPath(); g.arc(lx, ly, 104, 0, Math.PI * 2); g.stroke();
  g.lineWidth = 8; g.strokeStyle = 'rgba(255,255,255,.6)'; g.beginPath(); g.arc(lx, ly, 104, Math.PI * 1.1, Math.PI * 1.45); g.stroke();
  g.lineCap = 'round'; g.lineWidth = 34; g.strokeStyle = TINTA; g.beginPath(); g.moveTo(lx + 78, ly + 78); g.lineTo(lx + 150, ly + 150); g.stroke();
  g.restore();
  g.restore();
  // pie: clasificación y pegatina
  redondo(g, 60, h - 190, 120, 130, 26); g.fillStyle = CREMA; g.fill();
  g.fillStyle = TINTA; g.font = F(700, 74); g.textAlign = 'center'; g.textBaseline = 'alphabetic'; g.fillText('R', 120, h - 104);
  g.font = F(600, 20); g.fillText('REVISADO', 120, h - 76);
  g.save(); g.translate(w - 150, h - 140); g.rotate(-0.2);
  g.fillStyle = '#ffd97a'; g.beginPath(); g.arc(0, 0, 104, 0, Math.PI * 2); g.fill();
  g.fillStyle = 'rgba(255,255,255,.35)'; g.beginPath(); g.arc(-28, -34, 40, 0, Math.PI * 2); g.fill();
  g.fillStyle = TINTA; g.font = F(700, 46); g.fillText('Demo', 0, -4); g.font = F(600, 32); g.fillText('jugable', 0, 36);
  g.restore();
}

export function dorso(c, { color }) {
  const g = c.getContext('2d'), w = c.width, h = c.height;
  g.fillStyle = CREMA; g.fillRect(0, 0, w, h);
  g.fillStyle = color; redondo(g, 0, 0, w, 470, [0, 0, 80, 80]); g.fill();
  g.fillStyle = TINTA; g.font = F(600, 28); g.textAlign = 'left'; g.textBaseline = 'middle'; g.fillText('FM · Nº 01', 60, 70);
  g.textAlign = 'right'; g.fillText('PRODUCTO PUBLICADO', w - 60, 70);
  g.textAlign = 'left'; g.textBaseline = 'alphabetic'; g.font = F(700, 78);
  const lineas = ['Un personaje nuevo', 'cada día. El mismo', 'caso para todo', 'el mundo.'];
  lineas.forEach((l, i) => g.fillText(l, 60, 180 + i * 78));
  // lo que es, en párrafo
  g.font = F(600, 34); g.fillStyle = TINTA;
  let y = 560; const palabras = JUEGO.que.split(' '); let linea = '';
  for (const p of palabras) { const prueba = linea ? `${linea} ${p}` : p; if (g.measureText(prueba).width > w - 120) { g.fillText(linea, 60, y); y += 46; linea = p; } else linea = prueba; }
  g.fillText(linea, 60, y);
  // tres pastillas con las cifras
  JUEGO.cifras.forEach(([n, t], i) => {
    const x = 60 + i * ((w - 120 - 40) / 3 + 20), pw = (w - 120 - 40) / 3;
    redondo(g, x, 760, pw, 230, 40); g.fillStyle = ['#ffd97a', '#8fd6bf', '#ff9fc4'][i]; g.fill();
    g.fillStyle = 'rgba(255,255,255,.35)'; redondo(g, x + 14, 774, pw - 28, 60, 30); g.fill();
    g.fillStyle = TINTA; g.textAlign = 'center'; g.font = F(700, 96); g.fillText(n, x + pw / 2, 900); g.font = F(600, 30); g.fillText(t, x + pw / 2, 952);
  });
  g.textAlign = 'left'; g.font = F(600, 30); let x = 60;
  for (const s of JUEGO.stack) { const ww = g.measureText(s).width + 50; redondo(g, x, 1050, ww, 64, 32); g.fillStyle = TINTA; g.fill(); g.fillStyle = CREMA; g.fillText(s, x + 25, 1093); x += ww + 14; }
  redondo(g, 60, h - 190, 120, 130, 26); g.fillStyle = color; g.fill();
  g.fillStyle = TINTA; g.font = F(700, 74); g.textAlign = 'center'; g.fillText('R', 120, h - 104); g.font = F(600, 20); g.fillText('REVISADO', 120, h - 76);
  g.textAlign = 'left'; g.font = F(500, 24);
  g.fillText(`© 2026 Fernando Martínez · ${JUEGO.estado}.`, 210, h - 130); g.fillText('La demo es una simulación: datos inventados, mecánica real.', 210, h - 96);
  for (let i = 0; i < 30; i++) { g.fillStyle = TINTA; g.fillRect(w - 260 + i * 7, h - 180, i % 3 ? 3 : 5, 110); }
}

export function lomo(c, i, color, titulo = BALDA[i].nombre) {
  const g = c.getContext('2d'), w = c.width, h = c.height, p = BALDA[i];
  g.fillStyle = color; g.fillRect(0, 0, w, h);
  g.fillStyle = 'rgba(255,255,255,.25)'; g.fillRect(0, 0, w * 0.28, h);
  sello(g, w / 2, 100, 52, CREMA, TINTA);
  g.save(); g.translate(w / 2 + 4, 190); g.rotate(Math.PI / 2);
  g.fillStyle = TINTA; g.textAlign = 'left'; g.textBaseline = 'middle';
  cabe(g, titulo, 700, 92, h - 400); g.fillText(titulo, 0, 0);
  g.restore();
  g.fillStyle = TINTA; g.font = F(600, 46); g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(p.n, w / 2, h - 90);
}

export function disco(c, { titulo, color }) {
  const g = c.getContext('2d'), s = c.width, m = s / 2;
  g.fillStyle = color; g.fillRect(0, 0, s, s);
  g.fillStyle = 'rgba(255,255,255,.28)'; g.beginPath(); g.arc(m - 140, m - 180, 230, 0, Math.PI * 2); g.fill();
  for (let r = 330; r < 500; r += 26) { g.strokeStyle = 'rgba(255,255,255,.22)'; g.lineWidth = 3; g.beginPath(); g.arc(m, m, r, 0, Math.PI * 2); g.stroke(); }
  g.textAlign = 'center'; g.textBaseline = 'alphabetic';
  cabe(g, titulo, 700, 120, 640);
  g.fillStyle = TINTA; g.fillText(titulo, m + 4, 330 + 6); g.fillStyle = CREMA; g.fillText(titulo, m, 330);
  g.fillStyle = TINTA; g.font = F(600, 40); g.fillText('DISCO 1 · DEMO', m, 760);
  sello(g, m, 850, 46, CREMA, TINTA);
}

export function manual(c, { titulo, color }) {
  const g = c.getContext('2d'), w = c.width, h = c.height;
  g.fillStyle = CREMA; g.fillRect(0, 0, w, h);
  g.fillStyle = color; redondo(g, 50, 50, w - 100, 330, 50); g.fill();
  sello(g, 120, 120, 40, CREMA, TINTA);
  g.fillStyle = TINTA; g.textAlign = 'left'; g.textBaseline = 'alphabetic'; cabe(g, titulo, 700, 120, w - 200); g.fillText(titulo, 90, 300);
  g.font = F(600, 36); g.fillText('Manual de instrucciones', 90, 350);
  let y = 470;
  for (const [t, texto] of [['Qué es', JUEGO.que], ['Qué hice yo', JUEGO.hice]]) {
    g.fillStyle = '#ffd97a'; redondo(g, 60, y - 48, g.measureText(t).width + 80, 64, 32); g.fill();
    g.fillStyle = TINTA; g.font = F(700, 40); g.fillText(t, 90, y);
    g.font = F(600, 34); y += 66; let linea = '';
    for (const p of texto.split(' ')) { const pr = linea ? `${linea} ${p}` : p; if (g.measureText(pr).width > w - 160) { g.fillText(linea, 90, y); y += 46; linea = p; } else linea = pr; }
    g.fillText(linea, 90, y); y += 120;
  }
}

export const TAM = { portada: [1080, 1520], dorso: [1080, 1520], lomo: [160, 2026], disco: [1024, 1024], manual: [888, 1316] };
export { lienzo };
