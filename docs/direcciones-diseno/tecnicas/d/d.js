// Técnica D: un SVG que hace su propio 3D. Cada cara de la caja es un polígono con contorno negro y color plano
// (línea clara de tebeo); su dibujo, también SVG, se coloca encima con una matriz afín. Una sola fuente de verdad:
// las caras, su arte y la pose. Sin WebGL, sin imágenes: se edita como cualquier SVG.
import { JUEGO, BALDA } from '../comun/datos.js';
import { CAJA, POSES, X_BALDA, PASO_BALDA, Muelles, giroCercano } from '../comun/pose.js';
import { montarPlato, arrastre } from '../comun/plato.js';

const { W, H, D } = CAJA, G = 0.02, w2 = W / 2, d2 = D / 2, h2 = H / 2;
const NS = 'http://www.w3.org/2000/svg';
const TINTA = '#16161d', PAPEL = '#fbf3df', PIEL = '#f5c9a0';
const COLOR_LOMO = ['#2f6db5', '#e2402f', null, '#3f9a5a', '#7d4fa8', '#1f8a8a', '#e46b9b', '#f6c445', '#3d3d48'];
const svg = document.getElementById('lienzo');
const est = { titulo: 'Adivinadle', k: '#e2402f' };

// ── Matrices 3 × 4 (giro + traslación) en las unidades y ejes de Blender ──
const mul = (A, B) => [0, 1, 2].flatMap((f) => [0, 1, 2, 3].map((c) => A[f * 4] * B[c] + A[f * 4 + 1] * B[4 + c] + A[f * 4 + 2] * B[8 + c] + (c === 3 ? A[f * 4 + 3] : 0)));
const tras = (x, y, z) => [1, 0, 0, x, 0, 1, 0, y, 0, 0, 1, z];
const rz = (g) => { const a = g * Math.PI / 180, c = Math.cos(a), s = Math.sin(a); return [c, -s, 0, 0, s, c, 0, 0, 0, 0, 1, 0]; };
const rx = (g) => { const a = g * Math.PI / 180, c = Math.cos(a), s = Math.sin(a); return [1, 0, 0, 0, 0, c, -s, 0, 0, s, c, 0]; };
const aplicar = (M, p) => [M[0] * p[0] + M[1] * p[1] + M[2] * p[2] + M[3], M[4] * p[0] + M[5] * p[1] + M[6] * p[2] + M[7], M[8] * p[0] + M[9] * p[1] + M[10] * p[2] + M[11]];
const ID = tras(0, 0, 0);

// Una cara de un lado de una caja, con sus esquinas abajo-izq, abajo-der, arriba-der, arriba-izq vistas desde fuera
function lado(dir, [x, y, z], [a, b, c]) {
  const P = {
    '-y': [[x - a, y - b, z - c], [x + a, y - b, z - c], [x + a, y - b, z + c], [x - a, y - b, z + c]],
    '+y': [[x + a, y + b, z - c], [x - a, y + b, z - c], [x - a, y + b, z + c], [x + a, y + b, z + c]],
    '-x': [[x - a, y + b, z - c], [x - a, y - b, z - c], [x - a, y - b, z + c], [x - a, y + b, z + c]],
    '+x': [[x + a, y - b, z - c], [x + a, y + b, z - c], [x + a, y + b, z + c], [x + a, y - b, z + c]],
    '+z': [[x - a, y - b, z + c], [x + a, y - b, z + c], [x + a, y + b, z + c], [x - a, y + b, z + c]],
    '-z': [[x - a, y + b, z - c], [x + a, y + b, z - c], [x + a, y - b, z - c], [x - a, y - b, z - c]],
  };
  return P[dir];
}

// ── El arte de cada cara (unidades de dibujo: 100 por unidad de Blender) ──
const T = (x, y, tam, txt, extra = '') => `<text x="${x}" y="${y}" font-size="${tam}" ${extra}>${txt}</text>`;
function partir(texto, max) {
  const out = []; let l = '';
  for (const p of texto.split(' ')) { if ((l + ' ' + p).trim().length > max) { out.push(l); l = p; } else l = (l + ' ' + p).trim(); }
  return [...out, l];
}
const parrafo = (x, y, tam, alto, lineas, extra = '') => `<text x="${x}" y="${y}" font-size="${tam}" ${extra}>${lineas.map((l, i) => `<tspan x="${x}" dy="${i ? alto : 0}">${l}</tspan>`).join('')}</text>`;

// Un sospechoso dibujado en línea clara: cabeza, cuerpo y un rasgo
function tipo(x, base, ropa, rasgo, sombra = false) {
  const t = `stroke="${TINTA}" stroke-width=".9" stroke-linejoin="round"`;
  if (sombra) return `<g ${t}><rect x="${x - 8}" y="${base - 26}" width="16" height="26" rx="6" fill="${TINTA}"/><circle cx="${x}" cy="${base - 33}" r="8.5" fill="${TINTA}"/>
    <rect x="${x - 10}" y="${base - 44}" width="20" height="3" fill="${TINTA}"/><rect x="${x - 6}" y="${base - 52}" width="12" height="9" rx="1.5" fill="${TINTA}"/>
    <text x="${x}" y="${base - 29.5}" font-size="11" font-weight="700" fill="#f6c445" stroke="none" text-anchor="middle">?</text></g>`;
  const r = {
    pelo: `<path d="M${x - 8.5} ${base - 34} q8.5 -12 17 0 q-3 -4 -8.5 -4 q-5 0 -8.5 4z" fill="#9a5b2e"/>`,
    gorra: `<path d="M${x - 8.5} ${base - 35} q8.5 -10 17 0z" fill="#2f6db5"/><path d="M${x + 4} ${base - 35.5} h9 v2 h-9z" fill="#2f6db5"/>`,
    tupe: `<path d="M${x - 8} ${base - 36} q2 -9 12 -7 q-2 2 4 6 q-8 -3 -16 1z" fill="#f6c445"/>`,
    casco: `<path d="M${x - 9.5} ${base - 32} a9.5 9.5 0 0 1 19 0z" fill="#b9c2cc"/><path d="M${x} ${base - 42} v-5" stroke-width="1.6"/>`,
    lazo: `<path d="M${x - 8.5} ${base - 34} q8.5 -11 17 0z" fill="#3d2418"/><path d="M${x + 5} ${base - 41} l5 -3 v6z M${x + 5} ${base - 41} l-1 5 l4 -1z" fill="#e46b9b"/>`,
  }[rasgo];
  return `<g ${t}><rect x="${x - 8}" y="${base - 26}" width="16" height="26" rx="6" fill="${ropa}"/><circle cx="${x}" cy="${base - 33}" r="8.5" fill="${PIEL}"/>${r}
    <circle cx="${x - 3}" cy="${base - 33}" r=".9" fill="${TINTA}" stroke="none"/><circle cx="${x + 3}" cy="${base - 33}" r=".9" fill="${TINTA}" stroke="none"/>
    <path d="M${x - 2.5} ${base - 29} q2.5 1.8 5 0" fill="none" stroke-width=".7"/></g>`;
}

const ARTE = {
  portada: () => `<rect width="135" height="190" fill="var(--k)"/>
    <circle cx="16" cy="15" r="8" fill="${PAPEL}" stroke="${TINTA}" stroke-width="1"/>${T(16, 17.8, 7, 'FM', 'font-weight="700" text-anchor="middle"')}
    ${T(124, 17, 5.2, 'COLECCIÓN 2026 · Nº 01', 'text-anchor="end" font-weight="700"')}
    <text class="titulo-d" x="67.5" y="44" font-size="23" font-weight="700" text-anchor="middle" data-titulo>${est.titulo}</text>
    <rect x="10" y="54" width="115" height="106" rx="3" fill="${PAPEL}" stroke="${TINTA}" stroke-width="1.2"/>
    <g stroke="${TINTA}" stroke-width=".45" opacity=".55">${[0, 1, 2, 3, 4, 5].map((i) => `<line x1="10" x2="125" y1="${84 + i * 10}" y2="${84 + i * 10}"/>`).join('')}</g>
    <rect x="10" y="140" width="115" height="20" fill="#e8d9b5" stroke="${TINTA}" stroke-width="1.2"/>
    ${[['#3f9a5a', 'pelo'], ['#f6c445', 'gorra'], ['#2f6db5', 'tupe'], [null, null], ['#e46b9b', 'casco'], ['#7d4fa8', 'lazo']].map(([c, r], i) => tipo(25 + i * 17, 148 + (i % 2) * 3, c, r, !c)).join('')}
    <path d="M66 62 h50 a4 4 0 0 1 4 4 v12 a4 4 0 0 1 -4 4 h-30 l-8 7 l1 -7 h-13 a4 4 0 0 1 -4 -4 v-12 a4 4 0 0 1 4 -4z" fill="#fff" stroke="${TINTA}" stroke-width="1"/>
    ${T(93, 74.5, 7.2, '¿Quién es hoy?', 'text-anchor="middle" font-weight="700"')}
    <g stroke="${TINTA}" stroke-width="1.1"><circle cx="76" cy="116" r="12" fill="rgba(255,255,255,.35)"/><path d="M84.5 124.5 l9 9" stroke-width="3.5" stroke-linecap="round"/><circle cx="76" cy="116" r="12" fill="none" stroke="#f6c445" stroke-width="2"/><circle cx="76" cy="116" r="13.4" fill="none"/></g>
    <rect x="10" y="166" width="17" height="18" fill="${PAPEL}" stroke="${TINTA}" stroke-width="1"/>${T(18.5, 178, 10, 'R', 'font-weight="700" text-anchor="middle"')}${T(18.5, 182.5, 3, 'REVISADO', 'text-anchor="middle"')}
    <g transform="translate(110 172) rotate(-10)"><path d="${[...Array(16)].map((_, i) => `${i ? 'L' : 'M'}${(i % 2 ? 14 : 19) * Math.cos(i * Math.PI / 8)} ${(i % 2 ? 11 : 15) * Math.sin(i * Math.PI / 8)}`).join(' ')}Z" fill="#f6c445" stroke="${TINTA}" stroke-width="1"/>
      ${T(0, -0.5, 6.4, 'DEMO', 'text-anchor="middle" font-weight="700"')}${T(0, 5.5, 5, 'jugable', 'text-anchor="middle" font-weight="700"')}</g>`,
  dorso: () => `<rect width="135" height="190" fill="${PAPEL}"/><rect width="135" height="12" fill="var(--k)" stroke="${TINTA}" stroke-width="1"/>
    ${T(8, 8.4, 4.6, 'FM · Nº 01', 'font-weight="700" fill="' + PAPEL + '"')}${T(127, 8.4, 4.6, 'PRODUCTO PUBLICADO', 'font-weight="700" text-anchor="end" fill="' + PAPEL + '"')}
    ${parrafo(8, 26, 10, 10.5, partir(JUEGO.lema, 24), 'font-weight="700"')}
    ${parrafo(8, 72, 5.4, 6.8, partir(JUEGO.que, 46))}
    ${JUEGO.cifras.map(([n, t], i) => `<g transform="translate(${8 + i * 41} 92)"><rect width="37" height="34" rx="3" fill="${['#f6c445', '#9cd3ea', '#e46b9b'][i]}" stroke="${TINTA}" stroke-width="1"/>
      ${T(18.5, 20, 15, n, 'text-anchor="middle" font-weight="700"')}${T(18.5, 29, 4.6, t, 'text-anchor="middle" font-weight="700"')}</g>`).join('')}
    ${JUEGO.stack.map((s, i) => `<g transform="translate(${8 + i * 30} 134)"><rect width="27" height="9" rx="4.5" fill="${TINTA}"/>${T(13.5, 6.4, 4.8, s, 'text-anchor="middle" font-weight="700" fill="' + PAPEL + '"')}</g>`).join('')}
    <rect x="8" y="164" width="17" height="18" fill="var(--k)" stroke="${TINTA}" stroke-width="1"/>${T(16.5, 176, 10, 'R', 'font-weight="700" text-anchor="middle"')}
    ${parrafo(30, 170, 3.6, 4.6, [`© 2026 Fernando Martínez · ${JUEGO.estado}.`, 'La demo es una simulación: datos', 'inventados, mecánica real.'])}
    <g fill="${TINTA}">${[...Array(18)].map((_, i) => `<rect x="${100 + i * 1.6}" y="164" width="${i % 3 ? .6 : 1.1}" height="18"/>`).join('')}</g>`,
  lomo: (i) => `<rect width="15" height="190" fill="${BALDA[i].yo ? 'var(--k)' : COLOR_LOMO[i]}"/><circle cx="7.5" cy="10" r="5.2" fill="${PAPEL}" stroke="${TINTA}" stroke-width=".8"/>${T(7.5, 11.8, 4.6, 'FM', 'text-anchor="middle" font-weight="700"')}
    <text transform="translate(5 22) rotate(90)" font-size="8.6" font-weight="700" fill="${PAPEL}" stroke="${TINTA}" stroke-width=".9" paint-order="stroke" ${BALDA[i].yo ? 'data-titulo' : ''}>${BALDA[i].yo ? est.titulo : BALDA[i].nombre}</text>
    ${T(7.5, 184, 5, BALDA[i].n, `text-anchor="middle" font-weight="700" fill="${PAPEL}"`)}`,
  bandeja: () => `<rect width="127" height="182" fill="#3d3d48"/><circle cx="69.5" cy="91" r="7" fill="#24242c" stroke="${TINTA}" stroke-width="1"/>`,
  tapaDentro: () => `<rect width="135" height="190" fill="#4a4a56"/><rect x="${135 - 20 - 22}" y="14" width="22" height="5" fill="#3d3d48" stroke="${TINTA}" stroke-width=".8"/><rect x="${135 - 20 - 22}" y="171" width="22" height="5" fill="#3d3d48" stroke="${TINTA}" stroke-width=".8"/>`,
  disco: () => `<circle cx="60" cy="60" r="59" fill="var(--k)" stroke="${TINTA}" stroke-width="1.4"/><circle cx="60" cy="60" r="47" fill="none" stroke="${PAPEL}" stroke-width=".5" opacity=".7"/>
    <circle cx="60" cy="60" r="11.5" fill="#dcdcdc" stroke="${TINTA}" stroke-width="1.2"/><circle cx="60" cy="60" r="5" fill="#3d3d48" stroke="${TINTA}" stroke-width="1"/>
    <text x="60" y="36" font-size="13" font-weight="700" text-anchor="middle" fill="${PAPEL}" stroke="${TINTA}" stroke-width="1" paint-order="stroke" data-titulo>${est.titulo}</text>
    ${T(60, 92, 5, 'DISCO 1 · DEMO', `text-anchor="middle" font-weight="700" fill="${PAPEL}"`)}<path d="M14 54 a46 46 0 0 1 20 -30" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".55"/>`,
  manual: () => `<rect width="112" height="166" fill="${PAPEL}"/><rect x="6" y="6" width="100" height="32" rx="2" fill="var(--k)" stroke="${TINTA}" stroke-width="1"/>
    <text x="12" y="25" font-size="14" font-weight="700" fill="${PAPEL}" stroke="${TINTA}" stroke-width="1" paint-order="stroke" data-titulo>${est.titulo}</text>${T(12, 33, 4.6, 'MANUAL DE INSTRUCCIONES', `font-weight="700" fill="${PAPEL}"`)}
    ${[0, 1, 2].map((i) => `<rect x="${6 + i * 34}" y="44" width="30" height="30" fill="#fff" stroke="${TINTA}" stroke-width="1"/>`).join('')}
    <g transform="translate(21 74) scale(.62) translate(-21 -74)">${tipo(21, 74, '#2f6db5', 'tupe')}</g>
    <g transform="translate(47 74) scale(.62) translate(-47 -74)">${tipo(47, 74, '#2f6db5', 'tupe')}</g>
    <path d="M53 47 h17 v9 h-9 l-4 4 v-4 h-4z" fill="#fff" stroke="${TINTA}" stroke-width=".7"/>${T(61.5, 53.5, 3.8, '¿Mario?', 'text-anchor="middle" font-weight="700"')}<g transform="translate(89 59)"><path d="M-9 -9 l18 18 M9 -9 l-18 18" stroke="#3f9a5a" stroke-width="3" stroke-linecap="round"/></g>
    ${T(6, 86, 6, 'QUÉ ES', 'font-weight="700"')}${parrafo(6, 94, 4.8, 6, partir(JUEGO.que, 44))}
    ${T(6, 130, 6, 'QUÉ HICE YO', 'font-weight="700"')}${parrafo(6, 138, 4.8, 6, partir(JUEGO.hice, 44))}`,
};

// ── La escena: todas las caras, cada una colgada de un nudo (balda, caja, tapa, disco o manual) ──
const caras = [];
function cara(nudo, esquinas, color, arte = null, { ancho = 0, alto = 0, sinForma = false, cuando = null } = {}) {
  const g = document.createElementNS(NS, 'g');
  const forma = document.createElementNS(NS, 'path');
  forma.setAttribute('fill', color); forma.setAttribute('class', 'forma');
  if (!sinForma) g.append(forma);
  let a = null;
  if (arte) { a = document.createElementNS(NS, 'g'); a.innerHTML = arte; g.append(a); }
  const luz = document.createElementNS(NS, 'path'); luz.setAttribute('class', 'luz'); g.append(luz);
  if (!sinForma) { const borde = document.createElementNS(NS, 'path'); borde.setAttribute('class', 'borde'); g.append(borde); }
  caras.push({ nudo, esquinas, g, a, ancho, alto, sinForma, cuando, normal: null });
}
// balda y vecinos (quietos)
const NUDOS = { mundo: ID };
const largo = 9 * PASO_BALDA + 1.6;
cara('mundo', lado('+z', [0, -0.05, 0], [largo / 2, 0.95, 0]), '#c9783e');
cara('mundo', lado('-y', [0, -1.0, -0.06], [largo / 2, 0, 0.06]), '#a45f2c');
BALDA.forEach((p, i) => {
  if (p.yo) return;
  const n = `v${i}`, x = X_BALDA + (i - 2) * PASO_BALDA;
  NUDOS[n] = mul(tras(x, 0, h2), rz(90));
  cara(n, lado('-x', [0, 0, 0], [w2, d2, h2]), COLOR_LOMO[i], ARTE.lomo(i), { ancho: 15, alto: 190 });
  for (const dir of ['+z', '-y', '+y']) cara(n, lado(dir, [0, 0, 0], [w2, d2, h2]), '#2b2b33');
});
// la caja: cuerpo por fuera, bordes de la boca, paredes por dentro y bandeja
const caja = [
  ['+y', [0, 0, 0], [w2, d2, h2], 'dorso'], ['-x', [0, 0, 0], [w2, d2, h2], 'lomo'], ['+x', [0, 0, 0], [w2, d2, h2]], ['+z', [0, 0, 0], [w2, d2, h2]], ['-z', [0, 0, 0], [w2, d2, h2]],
];
for (const [dir, c, h, arte] of caja) cara('caja', lado(dir, c, h), '#2b2b33', arte === 'dorso' ? ARTE.dorso() : arte === 'lomo' ? ARTE.lomo(2) : null, arte === 'dorso' ? { ancho: 135, alto: 190 } : arte === 'lomo' ? { ancho: 15, alto: 190 } : {});
const abierta = (v) => v.tapa < -4;
for (const [c, h] of [[[-w2 + G / 2, -d2, 0], [G / 2, 0, h2]], [[w2 - G / 2, -d2, 0], [G / 2, 0, h2]], [[0, -d2, h2 - G / 2], [w2, 0, G / 2]], [[0, -d2, -h2 + G / 2], [w2, 0, G / 2]]]) cara('caja', lado('-y', c, h), '#2b2b33', null, { cuando: abierta });
const yi = -G / 2, hy = d2 - G / 2;
cara('caja', lado('+x', [-w2 + G, yi, 0], [0, hy, h2 - G]), '#1f1f27', null, { cuando: abierta });
cara('caja', lado('-x', [w2 - G, yi, 0], [0, hy, h2 - G]), '#1f1f27', null, { cuando: abierta });
cara('caja', lado('-z', [0, yi, h2 - G], [w2 - G, hy, 0]), '#1f1f27', null, { cuando: abierta });
cara('caja', lado('+z', [0, yi, -h2 + G], [w2 - G, hy, 0]), '#1f1f27', null, { cuando: abierta });
cara('caja', lado('-y', [0, d2 - G, 0], [w2 - G, 0, h2 - G]), '#3d3d48', ARTE.bandeja(), { ancho: 127, alto: 182, cuando: abierta });
cara('disco', lado('-y', [0, 0, 0], [0.6, 0, 0.6]), 'none', ARTE.disco(), { ancho: 120, alto: 120, sinForma: true, cuando: abierta });
// la tapa: carátula por fuera, cara de dentro y canto; el manual va en la tapa
cara('tapa', lado('-y', [w2, 0, 0], [w2, 0, h2]), '#2b2b33', ARTE.portada(), { ancho: 135, alto: 190 });
cara('tapa', lado('+y', [w2, G, 0], [w2, 0, h2]), '#4a4a56', ARTE.tapaDentro(), { ancho: 135, alto: 190 });
cara('tapa', lado('+x', [W, G / 2, 0], [0, G / 2, h2]), '#2b2b33');
cara('manual', lado('+y', [0, 0.022, 0], [0.56, 0, 0.83]), PAPEL, ARTE.manual(), { ancho: 112, alto: 166, cuando: abierta });
cara('manual', lado('+x', [0.56, 0.011, 0], [0, 0.011, 0.83]), '#e8dcc0', null, { cuando: abierta });

const capa = document.getElementById('caras');
for (const c of caras) capa.append(c.g);          // todas en el SVG desde el principio (las ocultas, sin pintar)
const sombraBalda = document.getElementById('sombra-balda');

// ── Cámara y dibujo ──
const LUZ = (() => { const l = [-0.45, -0.55, 0.7], n = Math.hypot(...l); return l.map((v) => v / n); })();
const DIST = 7.6;
let orden = '';
function pintar(v) {
  const Wp = innerWidth, Hp = innerHeight, util = Hp - (Wp < 760 ? 190 : 150);
  const k = Math.max(v.cam.alto / util, v.cam.ancho / (Wp - 32)), sube = (Wp < 760 ? 40 : 20) * k;
  const focal = 1 / k * DIST;                          // píxeles por unidad a la distancia de la balda
  const ojo = [v.cam.x, -DIST, v.cam.z - sube + 0.9], mira = [v.cam.x, 0, v.cam.z - sube];
  const f = norm(sub(mira, ojo)), de = norm(cruz(f, [0, 0, 1])), ar = cruz(de, f);
  const proy = (p) => { const d = sub(p, ojo), z = dot(d, f); return [Wp / 2 + focal * dot(d, de) / z, Hp / 2 - focal * dot(d, ar) / z, z]; };
  NUDOS.caja = mul(tras(v.x, v.y, v.z), mul(rz(v.rz), rx(v.rx)));
  NUDOS.tapa = mul(NUDOS.caja, mul(tras(-w2, -d2, 0), rz(v.tapa)));
  NUDOS.disco = mul(NUDOS.caja, mul(tras(0.06, d2 - G - 0.036 - v.disco * 0.32, 0), mul(rz(-v.disco * 9), rx(v.disco * 9))));
  NUDOS.manual = mul(NUDOS.tapa, tras(w2 + 0.04, G + v.manual * 0.06, 0));
  const vistas = [];
  for (const c of caras) {
    if (c.cuando && !c.cuando(v)) { c.g.style.display = 'none'; continue; }
    const M = NUDOS[c.nudo], P = c.esquinas.map((e) => proy(aplicar(M, e)));
    let area = 0; for (let i = 0; i < 4; i++) { const a = P[i], b = P[(i + 1) % 4]; area += a[0] * b[1] - b[0] * a[1]; }
    if (area >= -0.5) { c.g.style.display = 'none'; continue; }
    c.g.style.display = '';
    const d = `M${P.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join('L')}Z`;
    if (!c.sinForma) { c.g.firstChild.setAttribute('d', d); c.g.lastChild.setAttribute('d', d); }
    if (c.a) {
      const [bl, , tr, tl] = P;
      c.a.setAttribute('transform', `matrix(${((tr[0] - tl[0]) / c.ancho).toFixed(4)} ${((tr[1] - tl[1]) / c.ancho).toFixed(4)} ${((bl[0] - tl[0]) / c.alto).toFixed(4)} ${((bl[1] - tl[1]) / c.alto).toFixed(4)} ${tl[0].toFixed(1)} ${tl[1].toFixed(1)})`);
    }
    // sombreado de tebeo: dos tonos, sin degradados
    const e = c.esquinas.map((x) => aplicar(M, x)), nrm = norm(cruz(sub(e[1], e[0]), sub(e[3], e[0])));
    const luz = c.g.querySelector('.luz');
    luz.setAttribute('d', c.sinForma ? '' : d); luz.style.opacity = dot(nrm, LUZ) < 0.2 ? '1' : '0';
    vistas.push([P.reduce((s, p) => s + p[2], 0) / 4, c]);
  }
  vistas.sort((a, b) => b[0] - a[0]);
  const nuevo = vistas.map(([, c]) => caras.indexOf(c)).join(',');
  if (nuevo !== orden) { orden = nuevo; for (const [, c] of vistas) capa.append(c.g); }
  // la sombra plana de la caja en la balda (mientras está en ella)
  const fuera = Math.min(1, Math.max(0, -v.y / 1.0));
  if (fuera < 1) {
    const s = [[-d2 - 0.04, -w2], [d2 + 0.1, -w2], [d2 + 0.1, w2], [-d2 - 0.04, w2]].map(([x, y]) => proy([v.x + x + 0.08, y + v.y + 0.02, 0.001]));
    sombraBalda.setAttribute('d', `M${s.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join('L')}Z`);
  }
  sombraBalda.style.opacity = String(0.9 * (1 - fuera));
}
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cruz = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = (a) => { const n = Math.hypot(...a); return a.map((x) => x / n); };

const muelles = new Muelles(POSES.balda, { rigidez: 70, amort: 15 });
muelles.alMover = pintar;
let paso = 'balda';
const ctl = montarPlato({
  irA(id, { inmediato }) {
    paso = id;
    const obj = structuredClone(POSES[id]); obj.rz = giroCercano(muelles.v.rz, obj.rz);
    muelles.ir(obj, inmediato);
  },
  alCambiarDetalle(campo, valor) {
    if (campo === 'titulo') document.querySelectorAll('[data-titulo]').forEach((e) => { e.textContent = valor; });
    if (campo === 'color') svg.style.setProperty('--k', valor);
    ajustarTitulo();
  },
});
// el título de la carátula se encoge si no cabe (como en el canvas de B, pero con SVG)
function ajustarTitulo() {
  const t = svg.querySelector('.titulo-d'); t.removeAttribute('textLength'); t.setAttribute('font-size', '23');
  const ancho = t.getComputedTextLength();
  if (ancho > 118) t.setAttribute('font-size', (23 * 118 / ancho).toFixed(1));
}
let rz0 = 0;
arrastre(document.getElementById('plato'), {
  alEmpezar() { rz0 = muelles.v.rz; },
  alMover(dx) { if (paso === 'portada' || paso === 'dorso') muelles.empujar('rz', rz0 + dx * 0.45); },
  alSoltar() {
    if (paso !== 'portada' && paso !== 'dorso') return;
    const destino = Math.round(muelles.obj.rz / 180) * 180;
    const id = ((Math.round(destino / 180) % 2) + 2) % 2 ? 'dorso' : 'portada';
    if (id !== paso) ctl.poner(id); else muelles.empujar('rz', destino);
  },
});
function medir() { svg.setAttribute('viewBox', `0 0 ${innerWidth} ${innerHeight}`); pintar(muelles.v); }
addEventListener('resize', medir);
document.fonts.ready.then(() => { ajustarTitulo(); medir(); });
medir();
