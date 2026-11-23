// Lo impreso de E2 («estilizado»): el juguete pastel de la técnica B, con los detalles a mano de la D encima
// (contorno de tinta, pegatinas troqueladas, cinta y anotaciones con rotulador). Todo en canvas: cambia en vivo.
import { BALDA } from '../comun/datos.js';
import * as B from '../b/arte.js';

export const TINTA = '#2b2140';
export const TAM = B.TAM;
const MANO = (peso, tam) => `${peso} ${tam}px 'Comic Neue', 'Comic Sans MS', cursive`;
const F = (peso, tam) => `${peso} ${tam}px Fredoka, system-ui, sans-serif`;

export async function cargar() {
  await Promise.all(['700 100px Fredoka', "700 40px 'Comic Neue'"].map((f) => document.fonts.load(f)));
}

// Trazo de rotulador: la línea tiembla un poco y no es del todo recta (siempre igual: semilla fija)
function azar(semilla) { let s = semilla; return () => ((s = (s * 16807) % 2147483647) / 2147483647) - 0.5; }
function rotulador(g, puntos, grosor, color = TINTA, semilla = 7) {
  const a = azar(semilla);
  g.save(); g.strokeStyle = color; g.lineWidth = grosor; g.lineCap = 'round'; g.lineJoin = 'round';
  g.beginPath(); g.moveTo(puntos[0][0], puntos[0][1]);
  for (let i = 1; i < puntos.length; i++) {
    const [x0, y0] = puntos[i - 1], [x1, y1] = puntos[i];
    g.quadraticCurveTo((x0 + x1) / 2 + a() * 14, (y0 + y1) / 2 + a() * 14, x1, y1);
  }
  g.stroke(); g.restore();
}
function flecha(g, x0, y0, x1, y1, semilla) {
  const mx = (x0 + x1) / 2 + (y1 - y0) * 0.25, my = (y0 + y1) / 2 - (x1 - x0) * 0.25;
  rotulador(g, [[x0, y0], [mx, my], [x1, y1]], 7, TINTA, semilla);
  const ang = Math.atan2(y1 - my, x1 - mx);
  for (const s of [-1, 1]) rotulador(g, [[x1, y1], [x1 - 34 * Math.cos(ang + s * 0.5), y1 - 34 * Math.sin(ang + s * 0.5)]], 7, TINTA, semilla + s);
}
// Contorno de tinta por dentro del borde, con las esquinas redondas (solo en el manual: las cajas ya llevan el
// contorno de la malla invertida y un segundo marco pintado parecía un error)
function marco(g, w, h, grosor = 14) {
  g.save(); g.strokeStyle = TINTA; g.lineWidth = grosor; g.beginPath(); g.roundRect(grosor / 2, grosor / 2, w - grosor, h - grosor, 28); g.stroke(); g.restore();
}
// Pegatina troquelada: estrella con borde blanco y contorno de tinta
function pegatina(g, x, y, r, puntas, fondo, lineas, giro = -0.15) {
  g.save(); g.translate(x, y); g.rotate(giro);
  const forma = (rr) => { g.beginPath(); for (let i = 0; i < puntas * 2; i++) { const a = (i / (puntas * 2)) * Math.PI * 2, q = i % 2 ? rr * 0.8 : rr; g.lineTo(Math.cos(a) * q, Math.sin(a) * q); } g.closePath(); };
  forma(r + 14); g.fillStyle = '#fff'; g.fill(); g.lineWidth = 5; g.strokeStyle = TINTA; g.stroke();
  forma(r); g.fillStyle = fondo; g.fill();
  g.fillStyle = TINTA; g.textAlign = 'center'; g.textBaseline = 'middle';
  lineas.forEach(([t, tam], i) => { g.font = MANO(700, tam); g.fillText(t, 0, (i - (lineas.length - 1) / 2) * tam * 1.02); });
  g.restore();
}
function cinta(g, x, y, w, h, giro, texto) {
  g.save(); g.translate(x, y); g.rotate(giro);
  g.fillStyle = 'rgba(255,246,234,.88)'; g.fillRect(-w / 2, -h / 2, w, h);
  g.fillStyle = 'rgba(43,33,64,.08)'; for (let i = -w / 2; i < w / 2; i += 18) g.fillRect(i, -h / 2, 8, h);
  g.fillStyle = TINTA; g.font = MANO(700, h * 0.5); g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(texto, 0, 2);
  g.restore();
}
function nota(g, texto, x, y, tam, giro = -0.06) {
  g.save(); g.translate(x, y); g.rotate(giro); g.fillStyle = TINTA; g.font = MANO(700, tam); g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(texto, 0, 0); g.restore();
}

export function portada(c, estado) {
  const g = c.getContext('2d');
  B.portada(c, estado);
  cinta(g, 170, 520, 300, 70, -0.35, 'N.º 01');
  nota(g, '¿quién será?', 800, 548, 54);
  flecha(g, 860, 590, 650, 800, 11);
  pegatina(g, 900, 240, 92, 12, '#ff9fc4', [['¡Nuevo', 40], ['cada día!', 40]], 0.18);
}

export function dorso(c, estado) {
  const g = c.getContext('2d');
  B.dorso(c, estado);
  rotulador(g, [[60, 486], [380, 496], [700, 482]], 8, TINTA, 3);
  nota(g, 'lo jugáis cada día →', 740, 1170, 44, -0.04);
  pegatina(g, 930, 1230, 74, 10, '#ffd97a', [['¡pruébala!', 30]], -0.2);
}

export function lomo(c, i, estado) {
  B.lomo(c, i, estado ? estado.color : B.PASTEL[i], estado ? estado.titulo : BALDA[i].nombre);
  const g = c.getContext('2d');
}

export function disco(c, estado) {
  const g = c.getContext('2d');
  B.disco(c, estado);
  g.save(); g.strokeStyle = TINTA; g.lineWidth = 12; g.beginPath(); g.arc(512, 512, 505, 0, Math.PI * 2); g.stroke(); g.restore();
  nota(g, '¡no rayar!', 512, 640, 46, 0.05);
}

export function manual(c, estado) {
  const g = c.getContext('2d');
  B.manual(c, estado);
  marco(g, c.width, c.height, 12);
  flecha(g, 690, 1180, 760, 1060, 5);
  nota(g, 'esto es lo mío', 600, 1230, 44, -0.05);
}

// Las cajas de frente: el mismo juguete pastel, con su color de lomo, el título gordo y una pegatina
export function expuesta(c, i) {
  const g = c.getContext('2d'), w = c.width, h = c.height, p = BALDA[i], color = B.PASTEL[i];
  g.fillStyle = color; g.fillRect(0, 0, w, h);
  g.fillStyle = 'rgba(255,255,255,.25)'; g.beginPath(); g.arc(w * 0.2, h * 0.72, 300, 0, Math.PI * 2); g.fill();
  g.beginPath(); g.arc(w * 0.86, h * 0.3, 200, 0, Math.PI * 2); g.fill();
  g.fillStyle = '#fff6ea'; g.beginPath(); g.arc(92, 92, 46, 0, Math.PI * 2); g.fill();
  g.fillStyle = TINTA; g.font = F(700, 42); g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('FM', 92, 94);
  g.textBaseline = 'alphabetic';
  let t = 170; g.font = F(700, t); while (g.measureText(p.nombre).width > w - 140 && t > 40) { t -= 6; g.font = F(700, t); }
  g.fillStyle = TINTA; g.fillText(p.nombre, w / 2 + 6, 520 + 10); g.fillStyle = '#fff6ea'; g.fillText(p.nombre, w / 2, 520);
  g.fillStyle = 'rgba(43,33,64,.16)'; g.font = F(700, 620); g.fillText(p.n, w / 2, 1220);
  pegatina(g, w - 190, h - 210, 92, 12, '#ffd97a', [['N.º', 34], [p.n, 64]], -0.2);
}
