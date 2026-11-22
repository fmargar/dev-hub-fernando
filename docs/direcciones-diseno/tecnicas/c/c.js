// Técnica C: la caja hecha con caras de HTML en 3D (CSS) y la ilustración en SVG escrita a mano.
// Nada es una imagen: cambiar el título o el color es cambiar texto y una variable de CSS.
import { JUEGO, BALDA } from '../comun/datos.js';
import { CAJA, POSES, X_BALDA, PASO_BALDA, Muelles, giroCercano } from '../comun/pose.js';
import { montarPlato, arrastre, RM } from '../comun/plato.js';

const { W, H, D } = CAJA, G = 0.02;
const U = 220;                       // píxeles por unidad dentro del mundo (luego se escala a la pantalla)
const px = (v) => `${(v * U).toFixed(2)}px`;
const TINTAS = ['#2f5bd3', '#ff6c2f', null, '#00a95c', '#765ba7', '#00838a', '#ff4f8b', '#ffd23f', '#1a1a1a'];

const plato = document.getElementById('plato');
const mundo = document.getElementById('mundo');
mundo.style.setProperty('--u', `${U}px`);

// Una cara: un rectángulo w × h (en unidades) con su centro en c y su giro.
function cara(clase, w, h, c, giro = '', html = '') {
  const e = document.createElement('div');
  e.className = `cara ${clase}`;
  e.style.cssText = `width:${px(w)};height:${px(h)};transform:translate(-50%,-50%) translate3d(${px(c[0])},${px(c[1])},${px(c[2])}) ${giro}`;
  e.innerHTML = html;
  return e;
}

// La ilustración de la carátula: seis sospechosos de geometría simple, uno en sombra, y la lupa.
// Tres tintas que se superponen como en una risografía (multiplicar).
function arte() {
  const gente = [0, 1, 2, 3, 4, 5].map((i) => {
    const x = 26 + i * 40, sombra = i === 3, tinta = ['var(--rosa)', 'var(--amarillo)', 'var(--k)', null, 'var(--rosa)', 'var(--amarillo)'][i];
    const cabeza = ['<rect x="-14" y="-30" width="28" height="12" rx="2"/>', '<line x1="0" y1="-44" x2="0" y2="-28" stroke-width="3"/><circle cx="0" cy="-46" r="4"/>',
      '<path d="M-16 -22 L0 -58 L16 -22 Z"/>', '<path d="M-20 -24 h40 v-6 h-40 z M-10 -30 h20 v-10 h-20z"/>', '<path d="M-14 -24 L-9 -44 L-2 -26 Z M14 -24 L9 -44 L2 -26 Z"/>', '<ellipse cx="0" cy="-30" rx="22" ry="12"/>'][i];
    return `<g transform="translate(${x} 0)" class="${sombra ? 'sombra' : 'tinta'}" style="${sombra ? '' : `fill:${tinta};stroke:${tinta}`}">
      <rect x="-15" y="-6" width="30" height="62" rx="12"/><circle cx="0" cy="-15" r="15"/>${cabeza}
      ${sombra ? '<text x="0" y="-8" text-anchor="middle" class="interroga">?</text>' : '<circle cx="-5" cy="-15" r="2.2" class="ojo"/><circle cx="5" cy="-15" r="2.2" class="ojo"/>'}</g>`;
  }).join('');
  const rayas = Array.from({ length: 13 }, (_, i) => `<line x1="0" x2="270" y1="${20 + i * 11}" y2="${20 + i * 11}" ${i % 5 === 0 ? 'class="gruesa"' : ''}/>`).join('');
  return `<svg class="k-arte" viewBox="0 0 270 190" aria-hidden="true">
    <rect width="270" height="190" class="fondo-arte"/>
    <g class="rayas">${rayas}</g>
    <g transform="translate(0 120)" class="fila">${gente}</g>
    <g class="lupa"><circle cx="146" cy="112" r="46"/><line x1="180" y1="146" x2="226" y2="186"/></g>
  </svg>`;
}

const cifras = JUEGO.cifras.map(([n, t]) => `<li><b>${n}</b><span>${t}</span></li>`).join('');
const PORTADA = `<div class="k">
  <div class="k-sup"><span class="sello">FM</span><span>Colección 2026</span><span>N.º 01</span></div>
  <p class="k-titulo" data-titulo>${JUEGO.nombre}</p>
  <p class="k-sub">¿Quién es hoy?</p>
  ${arte()}
  <div class="k-inf"><span class="edad"><b>R</b>Revisado</span><span class="pega">Demo<br>jugable</span></div>
</div>`;
const DORSO = `<div class="do">
  <div class="k-sup"><span>FM · N.º 01</span><span>Producto publicado</span></div>
  <p class="do-lema">${JUEGO.lema}</p>
  <p class="do-que">${JUEGO.que}</p>
  <ul class="do-cifras">${cifras}</ul>
  <p class="do-stack">${JUEGO.stack.map((s) => `<span>${s}</span>`).join('')}</p>
  <div class="do-inf"><span class="edad"><b>R</b>Revisado</span><p>© 2026 Fernando Martínez · ${JUEGO.estado}. La demo es una simulación: datos inventados, mecánica real.</p><span class="barras"></span></div>
</div>`;
const lomo = (p, i) => `<div class="lo" style="--l:${p.yo ? 'var(--k)' : TINTAS[i]}"><span class="sello">FM</span><span class="lo-t"${p.yo ? ' data-titulo' : ''}>${p.nombre}</span><span class="lo-n">${p.n}</span></div>`;
const MANUAL = `<div class="ma"><span class="sello">FM</span><p class="ma-t" data-titulo>${JUEGO.nombre}</p><p class="ma-s">Manual de instrucciones</p>
  <ol><li><b>Qué es</b>${JUEGO.que}</li><li><b>Qué hice yo</b>${JUEGO.hice}</li></ol></div>`;
const DISCO = `<div class="di"><svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="49" class="di-fondo"/><circle cx="50" cy="50" r="49" class="di-anillo"/>
  <g transform="translate(50 50)">${[0, 1, 2, 3, 4, 5].map((i) => `<circle r="${44 - i * 4}" class="di-raya"/>`).join('')}</g>
  <circle cx="50" cy="50" r="11" class="di-hueco"/><circle cx="50" cy="50" r="5" class="di-eje"/></svg>
  <p class="di-t" data-titulo>${JUEGO.nombre}</p><p class="di-s">Disco 1 · demo</p></div>`;

// ── Construir el mundo ──
const balda = document.createElement('div'); balda.className = 'grupo';
const largo = 9 * PASO_BALDA + 1.6;
balda.append(
  cara('balda-frente', largo, 0.12, [0, 0.06, 1.0]),
  cara('balda-arriba', largo, 1.9, [0, 0, 0.05], 'rotateX(90deg)'),
);
BALDA.forEach((p, i) => {
  if (p.yo) return;
  const x = X_BALDA + (i - 2) * PASO_BALDA;
  balda.append(cara('vecino-arriba', D, W, [x, -H, 0], 'rotateX(90deg)'), cara('vecino', D, H, [x, -H / 2, W / 2], '', lomo(p, i)));
});
const caja = document.createElement('div'); caja.className = 'grupo caja';
const tapa = document.createElement('div'); tapa.className = 'grupo tapa';
const disco = cara('disco', 1.2, 1.2, [0, 0, 0], '', DISCO);
const manual = cara('manual', 1.12, 1.66, [0, 0, 0], '', MANUAL);
caja.append(
  cara('dorso', W, H, [0, 0, -D / 2], 'rotateY(180deg)', DORSO),
  cara('lomo', D, H, [-W / 2, 0, 0], 'rotateY(-90deg)', lomo(BALDA[2], 2)),
  cara('canto', D, H, [W / 2, 0, 0], 'rotateY(90deg)'),
  cara('canto', W, D, [0, -H / 2, 0], 'rotateX(90deg)'),
  cara('canto', W, D, [0, H / 2, 0], 'rotateX(-90deg)'),
  cara('bandeja', W - 0.04, H - 0.04, [0, 0, -D / 2 + G], '', '<span class="eje-b"></span>'),
  disco, tapa,
);
tapa.append(
  cara('portada', W, H, [W / 2, 0, 0], '', PORTADA),
  cara('tapa-dentro', W, H, [W / 2, 0, -G], 'rotateY(180deg)', '<span class="pinza"></span><span class="pinza abajo"></span>'),
  cara('canto', G, H, [W, 0, -G / 2], 'rotateY(90deg)'),
  manual,
);
const sombra = document.createElement('div'); sombra.className = 'sombra-caja';
mundo.append(balda, sombra, caja);

// ── Poner una pose en pantalla ──
let escala = 1;
function encuadre(cam) {
  const alto = innerHeight - (innerWidth < 760 ? 190 : 150), ancho = innerWidth - 32;
  return Math.min(alto / (cam.alto * U), ancho / (cam.ancho * U));
}
function pintar(v) {
  escala = encuadre(v.cam);
  plato.style.perspective = `${(7.6 * U * escala).toFixed(0)}px`;
  mundo.style.transform = `translate3d(0, ${innerWidth < 760 ? -40 : -20}px, 0) scale3d(${escala},${escala},${escala}) translate3d(${px(-v.cam.x)},${px(v.cam.z)},0)`;
  caja.style.transform = `translate3d(${px(v.x)},${px(-v.z)},${px(-v.y)}) rotateY(${v.rz}deg) rotateX(${-v.rx}deg)`;
  tapa.style.transform = `translate3d(${px(-W / 2)},0,${px(D / 2)}) rotateY(${v.tapa}deg)`;
  disco.style.transform = `translate(-50%,-50%) translate3d(${px(0.06)},0,${px(-D / 2 + G + 0.012 + v.disco * 0.32)}) rotateX(${v.disco * 9}deg) rotateY(${-v.disco * 9}deg)`;
  manual.style.transform = `translate(-50%,-50%) translate3d(${px(W / 2 + 0.04)},0,${px(-(G + 0.012 + v.manual * 0.06))}) rotateY(180deg)`;
  // la sombra plana se queda en la balda mientras la caja está en ella y se desvanece al salir
  const fuera = Math.min(1, Math.max(0, -v.y / 1.2));
  sombra.style.transform = `translate(-50%,-50%) translate3d(${px(v.x)},-1px,${px(-v.y)}) rotateX(90deg)`;
  sombra.style.opacity = String(1 - fuera);
}

const muelles = new Muelles(POSES.balda, { rigidez: 70, amort: 15 });
muelles.alMover = pintar;
let paso = 'balda';

const ctl = montarPlato({
  irA(id, { inmediato }) {
    paso = id;
    const obj = structuredClone(POSES[id]);
    obj.rz = giroCercano(muelles.v.rz, obj.rz);
    muelles.ir(obj, inmediato);
  },
  alCambiarDetalle(campo, valor) {
    if (campo === 'titulo') document.querySelectorAll('[data-titulo]').forEach((e) => { e.textContent = valor; });
    if (campo === 'color') mundo.style.setProperty('--k', valor);
  },
});

// Arrastrar: en la carátula o la contraportada, la caja gira con el dedo y al soltar cae a la cara más cercana
let rz0 = 0;
arrastre(plato, {
  alEmpezar() { rz0 = muelles.v.rz; },
  alMover(dx) {
    if (paso !== 'portada' && paso !== 'dorso') return;
    muelles.empujar('rz', rz0 + dx * 0.45);
  },
  alSoltar() {
    if (paso !== 'portada' && paso !== 'dorso') return;
    const destino = Math.round(muelles.obj.rz / 180) * 180;
    const id = ((Math.round(destino / 180) % 2) + 2) % 2 ? 'dorso' : 'portada';
    if (id !== paso) ctl.poner(id); else muelles.empujar('rz', destino);
  },
});
addEventListener('resize', () => pintar(muelles.v));
document.documentElement.classList.toggle('rm', RM);
