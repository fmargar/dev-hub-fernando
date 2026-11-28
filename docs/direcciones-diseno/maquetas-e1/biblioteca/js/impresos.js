// Lo impreso de la biblioteca, en canvas: el lomo, la tapa y la contracubierta de cada libro (tela con el título
// estampado en oro y una lámina pegada), las dos páginas del desplegable, el telón de su teatrillo, los bastidores y la
// tarjeta del hueco. Sale de los datos de los proyectos: cambiar uno no obliga a volver a hornear.
import { cargarArte, partir } from '../../../kit-e1/js/coleccion.js';

export const TAM = { lomo: [1152, 180], tapa: [832, 1152], dorso: [832, 1152], suelo: [1152, 840], fondo: [1152, 840], telon: [1240, 800], ala: [128, 600], hueco: [336, 480] };
const ORO = '#d9b56e', ORO_2 = '#b8914c', PAPEL = '#f3ecdc', TINTA = '#1d1915';
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
// más oscuro o más claro que un color (para los pliegues y los filos)
function tono(hex, k) {
  const n = parseInt(hex.slice(1), 16), c = [n >> 16, (n >> 8) & 255, n & 255].map((v) => Math.round(k < 0 ? v * (1 + k) : v + (255 - v) * k));
  return `rgb(${c.join(',')})`;
}
// la tela de encuadernar: el color, una trama fina de hilos y algo de grano
function tela(x, W, H, color, semilla = 5) {
  x.fillStyle = color; x.fillRect(0, 0, W, H);
  x.globalAlpha = 0.07;
  for (let i = 0; i < W; i += 3) { x.fillStyle = i % 6 ? '#000' : '#fff'; x.fillRect(i, 0, 1, H); }
  for (let j = 0; j < H; j += 3) { x.fillStyle = j % 6 ? '#fff' : '#000'; x.fillRect(0, j, W, 1); }
  x.globalAlpha = 1;
  let s = semilla; const r = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < (W * H) / 900; i++) { x.fillStyle = `rgba(${r() < 0.5 ? '255,255,255' : '0,0,0'},${0.1 * r()})`; x.fillRect(r() * W, r() * H, 1 + r() * 2, 1 + r() * 2); }
}
function papel(x, W, H, color = PAPEL) {
  x.fillStyle = color; x.fillRect(0, 0, W, H);
  let s = 3; const r = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < (W * H) / 1400; i++) { x.fillStyle = `rgba(90,70,40,${0.06 * r()})`; x.fillRect(r() * W, r() * H, 1 + r() * 2, 1 + r() * 2); }
}
// el estampado en oro: un degradado suave, como el pan de oro bajo una lámpara
function oro(x, x0, x1) { const g = x.createLinearGradient(x0, 0, x1, 0); g.addColorStop(0, ORO_2); g.addColorStop(0.45, '#ecd08f'); g.addColorStop(1, ORO_2); return g; }
function filete(x, px, py, w, h, grueso = 3) { x.lineWidth = grueso; x.strokeRect(px, py, w, h); }
function sello(x, cx, cy, r) {
  x.save(); x.lineWidth = Math.max(2, r * 0.08); x.beginPath(); x.arc(cx, cy, r, 0, Math.PI * 2); x.stroke();
  x.font = caslon(r * 1.05); x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('FM', cx, cy + r * 0.06); x.restore();
}

// ── El lomo: se lee de abajo arriba. `prop` es grueso/alto del libro: el lienzo es fijo y el dibujo se ajusta ──
export function lomo(c, p, prop = TAM.lomo[1] / TAM.lomo[0]) {
  const x = c.getContext('2d'), [W, HC] = TAM.lomo, H = Math.round(W * prop);
  x.save(); x.scale(1, HC / H);
  tela(x, W, H, p.color, 3 + p.n * 7);
  x.fillStyle = x.strokeStyle = oro(x, 0, W);
  // los nervios: dos filetes dobles, a los pies y a la cabeza
  for (const px of [150, 166, W - 150, W - 166]) x.fillRect(px, 10, 3, H - 20);
  x.textBaseline = 'middle'; x.textAlign = 'center';
  x.font = mono(H * 0.2); x.fillText(p.n, 82, H / 2 + 2);
  x.textAlign = 'left'; cabe(x, p.nombre, caslon, Math.min(H * 0.62, 112), W - 520); x.fillText(p.nombre, 205, H / 2 + 4);
  sello(x, W - 82, H / 2, Math.min(40, H * 0.26));
  x.restore();
}

// ── La tapa: tela, el título estampado en oro y la lámina del proyecto pegada, con su filete ──
export async function tapa(c, p) {
  const x = c.getContext('2d'), [W, H] = TAM.tapa; x.textBaseline = 'alphabetic';
  const img = await cargarArte(p.id);
  tela(x, W, H, p.color, 11);
  x.strokeStyle = x.fillStyle = oro(x, 0, W);
  filete(x, 38, 38, W - 76, H - 76, 4); filete(x, 52, 52, W - 104, H - 104, 1.5);
  x.textAlign = 'center';
  x.font = mono(24); x.letterSpacing = '6px'; x.fillText(`TOMO ${p.n}`, W / 2, 130); x.letterSpacing = '0px';
  const t = cabe(x, p.nombre, caslon, 150, W - 170); x.fillText(p.nombre, W / 2, 150 + t * 0.9);
  const yl = 170 + t;
  x.fillRect(W / 2 - 60, yl, 120, 3);
  // la lámina pegada: su borde de papel y una sombra corta
  const lx = 120, ly = yl + 46, lw = W - 240, lh = H - ly - 300;
  x.save(); x.shadowColor = 'rgba(0,0,0,.4)'; x.shadowBlur = 14; x.shadowOffsetY = 4; x.fillStyle = PAPEL; x.fillRect(lx - 12, ly - 12, lw + 24, lh + 24); x.restore();
  if (img) cubrir(x, img, lx, ly, lw, lh, 0.5, 0.5); else { x.fillStyle = tono(p.color, -0.3); x.fillRect(lx, ly, lw, lh); }
  x.fillStyle = x.strokeStyle = oro(x, 0, W);
  x.font = serif(40); const ls = partir(x, p.lema, W - 220).slice(0, 2); ls.forEach((l, i) => x.fillText(l, W / 2, H - 222 + i * 48));
  x.font = mono(20); x.letterSpacing = '4px'; x.fillText(p.demo ? 'DESPLEGABLE · CON DEMO' : 'DESPLEGABLE · CON TRÁILER', W / 2, H - 92); x.letterSpacing = '0px';
}

// ── La contracubierta: los créditos en una etiqueta de papel pegada sobre la tela ──
export function dorso(c, p) {
  const x = c.getContext('2d'), [W, H] = TAM.dorso, M = 70; x.textBaseline = 'alphabetic'; x.textAlign = 'left';
  tela(x, W, H, p.color, 17);
  x.strokeStyle = conAlfa('#000000', 0.25); filete(x, 38, 38, W - 76, H - 76, 4);
  x.save(); x.shadowColor = 'rgba(0,0,0,.35)'; x.shadowBlur = 12; x.shadowOffsetY = 3; x.fillStyle = PAPEL; x.fillRect(M, 96, W - 2 * M, H - 300); x.restore();
  const px = M + 40, ancho = W - 2 * M - 80; let y = 176;
  x.fillStyle = TINTA; cabe(x, p.nombre, caslon, 84, ancho); x.fillText(p.nombre, px, y);
  x.font = mono(19); x.fillStyle = '#6b5f4e'; y += 38; x.fillText(`${p.tipo.toUpperCase()} · ${p.estado.toUpperCase()}`, px, y);
  x.fillStyle = TINTA; x.fillRect(px, y + 18, ancho, 2); y += 62;
  for (const [t, texto] of p.bloques) {
    x.font = mono(18); x.fillStyle = '#6b5f4e'; x.fillText(t.toUpperCase(), px, y); y += 34;
    x.font = sans(27); x.fillStyle = TINTA; y = parrafo(x, texto, px, y, ancho, 36, 4) + 22;
  }
  // las cifras, en fila
  const n = p.cifras.length, cw = ancho / Math.max(n, 2); y = Math.max(y + 6, H - 204 - 150);
  x.fillRect(px, y - 30, ancho, 2);
  p.cifras.forEach(([cifra, de], i) => {
    x.fillStyle = TINTA; cabe(x, cifra, caslon, 64, cw - 16); x.fillText(cifra, px + i * cw, y + 36);
    x.font = mono(16); x.fillStyle = '#6b5f4e'; parrafo(x, de.toUpperCase(), px + i * cw, y + 64, cw - 14, 22, 2);
  });
  if (p.stack.length) { x.font = mono(18); x.fillStyle = '#6b5f4e'; x.fillText(p.stack.join(' · ').toUpperCase(), px, H - 204 - 30); }
  // al pie, sobre la tela: el sello de la casa y el tomo
  x.fillStyle = x.strokeStyle = conAlfa(p.tinta, 0.9);
  sello(x, W / 2, H - 122, 40);
  x.font = mono(18); x.textAlign = 'center'; x.letterSpacing = '4px'; x.fillText(`FERNANDO MARTÍNEZ · TOMO ${p.n}`, W / 2, H - 52); x.letterSpacing = '0px';
}

// ── El desplegable. La página de abajo: las tablas del escenario y, al borde, el lema ──
export function suelo(c, p) {
  const x = c.getContext('2d'), [W, H] = TAM.suelo;
  papel(x, W, H);
  // las tablas, en fuga hacia el pliegue (arriba del lienzo)
  x.strokeStyle = conAlfa(p.color, 0.22); x.lineWidth = 2;
  for (let i = -9; i <= 9; i++) { x.beginPath(); x.moveTo(W / 2 + i * 44, 0); x.lineTo(W / 2 + i * 92, H * 0.76); x.stroke(); }
  for (const f of [0.2, 0.42, 0.62]) { x.beginPath(); x.moveTo(0, H * f); x.lineTo(W, H * f); x.stroke(); }
  x.fillStyle = conAlfa(p.color, 0.1); x.fillRect(0, 0, W, H * 0.76);
  x.fillStyle = PAPEL; x.fillRect(0, H * 0.76, W, H * 0.24);
  x.fillStyle = p.color; x.fillRect(60, H * 0.76 + 4, W - 120, 3);
  x.fillStyle = TINTA; x.textAlign = 'center'; x.textBaseline = 'alphabetic';
  cabe(x, p.lema, serif, 54, W - 160, 30); x.fillText(p.lema, W / 2, H - 92);
  x.font = mono(20); x.fillStyle = '#6b5f4e'; x.letterSpacing = '4px'; x.fillText(`TOMO ${p.n} · ${p.tipo.toUpperCase()}`, W / 2, H - 42); x.letterSpacing = '0px';
}
// La página de detrás (la que queda de pie): el cielo del teatrillo y, arriba, el nombre
export function fondo(c, p) {
  const x = c.getContext('2d'), [W, H] = TAM.fondo;
  const g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, tono(p.color, -0.25)); g.addColorStop(1, tono(p.color, 0.12));
  x.fillStyle = g; x.fillRect(0, 0, W, H);
  // estrellas de imprenta: puntos de oro en trama
  x.fillStyle = conAlfa(ORO, 0.55);
  for (let j = 0; j < 22; j++) for (let i = 0; i < 30; i++) { const px = 20 + i * 38 + (j % 2) * 19, py = 16 + j * 38; x.beginPath(); x.arc(px, py, (i * 7 + j * 3) % 5 === 0 ? 3.4 : 1.6, 0, 7); x.fill(); }
  x.fillStyle = tono(p.color, -0.35); x.fillRect(0, 0, W, 168);
  x.fillStyle = oro(x, 0, W); x.fillRect(0, 166, W, 4);
  x.textAlign = 'center'; x.textBaseline = 'middle';
  cabe(x, p.nombre, caslon, 128, W - 420); x.fillText(p.nombre, W / 2, 88);
  x.font = mono(22); x.letterSpacing = '5px'; x.textAlign = 'left'; x.fillText(`TOMO ${p.n}`, 70, 88); x.textAlign = 'right'; x.fillText(p.demo ? 'DEMO' : 'TRÁILER', W - 70, 88); x.letterSpacing = '0px';
}
// El telón: el marco de la pantalla (la pantalla va encima, en negro)
export function telon(c, p) {
  const x = c.getContext('2d'), [W, H] = TAM.telon;
  papel(x, W, H, tono(p.color, -0.12));
  x.strokeStyle = x.fillStyle = oro(x, 0, W);
  filete(x, 14, 14, W - 28, H - 28, 4);
  // la embocadura: un filo de oro alrededor de la pantalla (40 px de margen a los lados, 68 arriba, 80 abajo)
  filete(x, 30, 58, W - 60, H - 58 - 68, 3);
  x.textAlign = 'center'; x.textBaseline = 'middle'; x.font = mono(22); x.letterSpacing = '6px';
  x.fillText(p.demo ? 'HOY · UNA SIMULACIÓN QUE SE JUEGA' : 'HOY · EL TRÁILER DEL PROYECTO', W / 2, 34);
  x.fillText('· · ·   FM   · · ·', W / 2, H - 42); x.letterSpacing = '0px';
  x.fillStyle = '#050506'; x.fillRect(40, 68, W - 80, H - 68 - 80);
}
// Los bastidores: una cortina recogida, con sus pliegues y un fleco de oro
export function ala(c, p) {
  const x = c.getContext('2d'), [W, H] = TAM.ala;
  x.fillStyle = p.color; x.fillRect(0, 0, W, H);
  for (let i = 0; i < 5; i++) {
    const g = x.createLinearGradient(i * W / 5, 0, (i + 1) * W / 5, 0);
    g.addColorStop(0, 'rgba(0,0,0,.34)'); g.addColorStop(0.5, 'rgba(255,255,255,.14)'); g.addColorStop(1, 'rgba(0,0,0,.34)');
    x.fillStyle = g; x.fillRect(i * W / 5, 0, W / 5 + 1, H);
  }
  x.fillStyle = oro(x, 0, W); x.fillRect(0, 0, W, 16); x.fillRect(0, H - 40, W, 8);
  for (let i = 0; i < W; i += 8) x.fillRect(i, H - 32, 4, 26);
}
// La tarjeta del hueco de la balda
export function hueco(c) {
  const x = c.getContext('2d'), [W, H] = TAM.hueco;
  papel(x, W, H); x.strokeStyle = TINTA; filete(x, 14, 14, W - 28, H - 28, 3);
  x.fillStyle = TINTA; x.textAlign = 'center'; x.textBaseline = 'alphabetic';
  x.font = mono(22); x.letterSpacing = '4px'; x.fillText('TOMO 10', W / 2, 92); x.letterSpacing = '0px';
  x.font = caslon(86); x.fillText('El', W / 2, 210); x.fillText('siguiente', W / 2, 290);
  x.fillRect(W / 2 - 40, 322, 80, 3);
  x.font = serif(34); x.fillText('en preparación', W / 2, 384);
}
