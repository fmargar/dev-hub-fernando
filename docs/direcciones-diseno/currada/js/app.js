// El plano que se conduce. Aquí se junta todo: la maquetación del plano (un escenario de 1440×900 o de
// 390 de ancho que se escala entero), las vías y los trenes, lo que se toca (tiradores, paradas,
// teclado), el andén que dice dónde está el tren y la ficha que sale de la última parada.
//
// Se pinta bajo demanda: si nada se mueve, no hay bucle. Y si el plano no está en pantalla, tampoco.

import { LINEAS, OTROS, TRAZADO } from './datos.js';
import { construirVia } from './via.js';
import { Tren } from './tren.js';
import { crearPintor } from './pintor.js';

const raiz = document.documentElement;
const $ = (s, r = document) => r.querySelector(s);
const crea = (etq, clase, texto) => { const e = document.createElement(etq); if (clase) e.className = clase; if (texto != null) e.textContent = texto; return e; };

const pagina = $('#pagina'), plano = $('.plano'), lienzo = $('.plano__lienzo'), red = $('[data-red]'), anden = $('[data-anden]');
const ficha = $('[data-ficha]'), hoja = $('[data-hoja]');
const reducido = matchMedia('(prefers-reduced-motion: reduce)');

const MEDIDAS = { coches: 3, paso: 40, largo: 34 };
const R_PARADA = 12.5, R_CAB = 16, R_FIN = 13;
const DIRS = { n: [0, -1], s: [0, 1], e: [1, 0], o: [-1, 0], ne: [0.7, -0.7], no: [-0.7, -0.7], se: [0.7, 0.7], so: [-0.7, 0.7] };
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
const COLORES = new Float32Array(LINEAS.flatMap((l) => hex(l.color)));
const ORDEN = [...LINEAS].sort((a, b) => a.n - b.n);           // L1…L6: el orden del teclado y de la lista
const LUZ = [-0.5, -0.62, 0.72];

let pintor = crearPintor(lienzo);
if (!pintor) raiz.classList.add('sin-gl');

let geo = null, lineas = [], calidad = 1;
let raf = 0, antes = null, visible = true, lentos = 0;
let mx = 0, my = 0, lx = 0, ly = 0;
let abierta = null, tCierre = 0, pista = null, entero = true;
const escena = { coches: [], paradas: [], luz: new Float32Array(3), colores: COLORES, papel: hex('#efe9dc'), tinta: hex('#15171c') };
const lienzoTinta = document.createElement('canvas');

// ————— Maquetación —————

function medir() {
  const W = plano.clientWidth, H = window.innerHeight;
  const horizontal = W >= 900;
  const T = TRAZADO[horizontal ? 'horizontal' : 'vertical'];
  const k = horizontal ? Math.max(Math.min(W / T.ancho, H / T.alto), 0.5) : Math.min(W / T.ancho, 1.7);
  // en horizontal el plano ocupa la pantalla; si la ventana es más alta que el plano, solo un poco más que él
  const alto = horizontal ? Math.max(T.alto * k, Math.min(H, T.alto * k * 1.1)) : T.alto * k;
  const g = { modo: horizontal ? 'horizontal' : 'vertical', W, alto, k, ox: (W - T.ancho * k) / 2, oy: horizontal ? (alto - T.alto * k) / 2 : 0 };
  g.dpr = dprDe(g);
  return g;
}

// Tope de densidad: nunca más de 2, ni más de 4 millones de píxeles, ni una textura mayor de 4096.
function dprDe(g) {
  const tope = Math.min(window.devicePixelRatio || 1, 2, Math.sqrt(4e6 / (g.W * g.alto)), 4096 / g.alto, 4096 / g.W);
  return Math.max(Math.min(1, tope), tope * calidad);
}

function aplicarGeo() {
  raiz.dataset.modo = geo.modo;
  raiz.style.setProperty('--k', geo.k);
  raiz.style.setProperty('--ox', geo.ox + 'px');
  raiz.style.setProperty('--oy', geo.oy + 'px');
  raiz.style.setProperty('--alto', geo.alto + 'px');
}

function ancla(lado, r, k) {
  const t = lado.split('-'), cab = t.includes('cab');
  const [ex, ey] = DIRS[t.find((x) => DIRS[x])];
  const g = (r + 7) * k;
  let dx = ex * g, dy = ey * g;
  let ax = ex > 0 ? '0%' : ex < 0 ? '-100%' : '-50%';
  const ay = ey > 0 ? '0%' : ey < 0 ? '-100%' : '-50%';
  if (ex === 0 && t.includes('fin')) { dx = r * k; ax = '-100%'; }
  else if (ex === 0 && (cab || t.includes('ini'))) { dx = -r * k; ax = '0%'; }
  return { dx, dy, ax, ay, ex, ey };
}

// ————— Vías, trenes y lo que se toca —————

function montar() {
  red.textContent = '';
  const T = TRAZADO[geo.modo];
  lineas = LINEAS.map((linea, idx) => {
    const t = T.lineas[linea.id];
    const via = construirVia(t.via, { radio: t.radio ?? T.radio ?? 30, cerrada: !!t.cerrada });
    const L = { linea, idx, via, alza: 0, cerca: false, agarre: null, paradas: [], cs: [], tTope: 0, caja: null };
    L.tren = new Tren(via, t.paradas.map(([x, y]) => via.envuelve(via.proyectar(x, y).s)), MEDIDAS, (tipo, i, dato) => ocurre(L, tipo, i, dato));
    const ult = t.paradas.length - 1;

    t.paradas.forEach(([x, y, lado], i) => {
      // La cabecera y el final no van sobre la vía sino justo detrás del tope: son el tope.
      let tipo = 0, r = R_PARADA;
      if (i === 0) {
        tipo = 1; r = R_CAB;
        if (via.cerrada) { const [ex, ey] = DIRS[lado]; x += ex * (R_CAB + 13); y += ey * (R_CAB + 13); lado = 'e'; }
        else { const p = via.en(0); x -= p.c * (R_CAB + 4); y -= p.s * (R_CAB + 4); }
      } else if (i === ult) {
        tipo = 2; r = R_FIN;
        if (!via.cerrada) { const p = via.en(via.largo); x += p.c * (R_FIN + 2); y += p.s * (R_FIN + 2); }
      }
      const p = { i, x, y, r, tipo, lado, activa: 0, onda: 0, resalte: 0, px: 0, py: 0 };
      const b = crea('button', 'parada' + (tipo === 1 ? ' parada--cabecera' : tipo === 2 ? ' parada--final' : ''));
      b.type = 'button'; b.tabIndex = -1;
      b.style.setProperty('--linea', linea.color); b.style.setProperty('--linea-tinta', linea.tinta);
      b.setAttribute('aria-label', `Línea ${linea.n}, ${linea.nombre}: llevar el tren a la parada ${i + 1}, ${linea.paradas[i]}`);
      if (tipo === 1) b.append(crea('span', 'parada__insignia', 'L' + linea.n));
      b.append(crea('span', 'parada__nombre', tipo === 1 ? linea.nombre : linea.paradas[i]));
      b.addEventListener('click', () => llevar(L, i));
      b.addEventListener('pointerenter', (e) => { if (e.pointerType !== 'touch') { p.resalte = 1; despertar(); } });
      b.addEventListener('pointerleave', () => { p.resalte = 0; despertar(); });
      p.el = b; L.paradas.push(p); red.append(b);
    });
    return L;
  });

  // Un tirador por tren, en el orden L1…L6: es lo que recorre el tabulador.
  for (const linea of ORDEN) {
    const L = lineas.find((x) => x.linea === linea);
    const h = crea('button', 'tren'); h.type = 'button';
    h.style.setProperty('--linea', linea.color);
    h.setAttribute('role', 'slider');
    h.setAttribute('aria-label', `Tren de la línea ${linea.n}, ${linea.nombre}`);
    h.setAttribute('aria-valuemin', '1'); h.setAttribute('aria-valuemax', String(L.paradas.length));
    L.tirador = h; red.append(h);
    cablear(L);
    marcar(L, 0);
  }

  pista = crea('p', 'pista', geo.modo === 'vertical' ? 'agárralo y tira →' : 'agarra el tren y lánzalo →');
  pista.setAttribute('aria-hidden', 'true');
  red.append(pista);
}

function cablear(L) {
  const h = L.tirador, t = L.tren;
  const cerca = (v) => () => { L.cerca = v; despertar(); };
  h.addEventListener('pointerenter', (e) => { if (e.pointerType !== 'touch') cerca(true)(); });
  h.addEventListener('pointerleave', cerca(false));
  h.addEventListener('focus', cerca(true));
  h.addEventListener('blur', cerca(false));

  h.addEventListener('pointerdown', (e) => {
    if (e.button || L.agarre) return;
    e.preventDefault();
    h.setPointerCapture(e.pointerId);
    const p = aDiseno(e), cs = t.coches(L.cs);
    let g = 0, dm = Infinity;
    cs.forEach((c, j) => { const d = Math.hypot(c.x - p.x, c.y - p.y); if (d < dm) { dm = d; g = j; } });
    const pr = L.via.proyectar(p.x, p.y, t.s[g], 90);
    L.agarre = { id: e.pointerId, coche: g, s: pr.s, dif: t.s[g] - pr.s, x0: e.clientX, y0: e.clientY, t0: performance.now(), movido: false };
    t.agarrar(g, t.s[g]);
    h.classList.add('es-agarrado'); quitarPista(); despertar();
  });
  h.addEventListener('pointermove', (e) => {
    const a = L.agarre; if (!a || a.id !== e.pointerId) return;
    if (Math.hypot(e.clientX - a.x0, e.clientY - a.y0) > 6) a.movido = true;
    const p = aDiseno(e), pr = L.via.proyectar(p.x, p.y, a.s, 150);
    a.s = pr.s;
    // el dedo no puede pedir más vía de la que hay: el tope se nota al lanzar, no al sujetar
    let s = pr.s + a.dif;
    if (!L.via.cerrada) s = Math.max(t.medio + (t.n - 1 - a.coche) * t.paso, Math.min(L.via.largo - t.medio - a.coche * t.paso, s));
    t.arrastrar(s); despertar();
  });
  const suelta = (e) => {
    const a = L.agarre; if (!a || a.id !== e.pointerId) return;
    L.agarre = null; h.classList.remove('es-agarrado');
    t.soltar();
    const n = L.paradas.length;
    if (!a.movido && performance.now() - a.t0 < 400 && e.type === 'pointerup') llevar(L, (actual(L) + 1) % n);   // un toque: siguiente parada
    else if (reducido.matches) llevar(L, t.cercana().i);
    despertar();
  };
  h.addEventListener('pointerup', suelta);
  h.addEventListener('pointercancel', suelta);

  h.addEventListener('keydown', (e) => {
    const n = L.paradas.length, a = actual(L);
    let a2 = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') a2 = L.via.cerrada ? (a + 1) % n : Math.min(n - 1, a + 1);
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') a2 = L.via.cerrada ? (a + n - 1) % n : Math.max(0, a - 1);
    else if (e.key === 'Home') a2 = 0;
    else if (e.key === 'End' || e.key === 'Enter' || e.key === ' ') a2 = n - 1;
    if (a2 == null) return;
    e.preventDefault(); quitarPista(); llevar(L, a2);
  });
}

const actual = (L) => (L.tren.modo === 'auto' ? L.tren.destino : L.tren.parada >= 0 ? L.tren.parada : L.tren.cercana().i);
function aDiseno(e) { const r = plano.getBoundingClientRect(); return { x: (e.clientX - r.left - geo.ox) / geo.k, y: (e.clientY - r.top - geo.oy) / geo.k }; }
function quitarPista() { if (pista) { pista.classList.add('se-va'); pista = null; } }

/** Manda el tren a una parada. Con movimiento reducido no viaja: aparece allí. */
function llevar(L, i) {
  const t = L.tren;
  if (t.parada === i && t.modo !== 'mano') { anunciar(L, i); if (i === L.paradas.length - 1) sacarFicha(L); return; }
  if (reducido.matches) { if (t.parada >= 0) marcar(L, -1); t.colocar(i); ocurre(L, 'llegada', i); }
  else t.irA(i);
  despertar();
}

function ocurre(L, tipo, i, dato) {
  const p = L.paradas[i];
  if (tipo === 'paso') { p.onda = 0.001; anunciar(L, i); }
  else if (tipo === 'tope') {
    p.onda = 0.001; L.tTope = performance.now();
    if (i === 0) anunciar(L, i, dato > 420 ? 'Tope. Por ahí no hay más vía.' : 'Tope.');
  } else if (tipo === 'salida') marcar(L, -1);
  else if (tipo === 'llegada') {
    marcar(L, i);
    if (!(i === 0 && performance.now() - L.tTope < 1500)) anunciar(L, i);
    if (i === L.paradas.length - 1) sacarFicha(L);
  }
}

function marcar(L, i) {
  L.paradas.forEach((p) => p.el.classList.toggle('es-activa', p.i === i));
  if (i < 0) return;
  L.tirador.setAttribute('aria-valuenow', String(i + 1));
  L.tirador.setAttribute('aria-valuetext', `Parada ${i + 1} de ${L.paradas.length}: ${L.linea.paradas[i]}`);
}

let dicho = '';
function anunciar(L, i, otra) {
  const l = L.linea, ult = i === L.paradas.length - 1;
  const frase = otra || (ult ? 'Fin de línea: sale la ficha.' : l.textos[i]);
  const clave = l.id + i + frase; if (clave === dicho) return; dicho = clave;
  anden.style.setProperty('--linea', l.color); anden.style.setProperty('--linea-tinta', l.tinta);
  $('.anden__insignia', anden).textContent = 'L' + l.n;
  $('.anden__titulo', anden).textContent = `${l.nombre} · ${ult ? 'Ficha' : l.pasos[i]}`;
  $('.anden__frase', anden).textContent = frase;
  anden.classList.remove('cambia'); void anden.offsetWidth; anden.classList.add('cambia');
}

// ————— Colocar (en cada cambio de tamaño) —————

function colocar() {
  const { k, ox, oy } = geo;
  for (const L of lineas) for (const p of L.paradas) {
    p.px = ox + p.x * k; p.py = oy + p.y * k;
    const a = ancla(p.lado, p.r, k), e = p.el.style;
    e.left = p.px + 'px'; e.top = p.py + 'px';
    e.setProperty('--dx', a.dx + 'px'); e.setProperty('--dy', a.dy + 'px');
    e.setProperty('--ax', a.ax); e.setProperty('--ay', a.ay);
    e.setProperty('--ex', a.ex); e.setProperty('--ey', a.ey);
  }
  if (pista) {
    const c = lineas.find((L) => L.linea.n === 1).tren.coches([])[2];
    pista.style.transform = `translate(${ox + (c.x - 12) * k}px, ${oy + (c.y + 14) * k}px)`;
  }
  if (pintor) {
    pintor.configurar({ ancho: geo.W, alto: geo.alto, dpr: geo.dpr, k, ox, oy,
      lineas: lineas.map((L) => ({ tramos: L.via.tramos.map(([a, b, c, d]) => [ox + a * k, oy + b * k, ox + c * k, oy + d * k]) })) });
    rotular();
  } else dibujarSinGl();
  entero = true; despertar();
}

// El nombre se imprime en el tablero: se dibuja en un lienzo aparte, justo donde está el h1 (que queda
// transparente encima), y el sombreador lo trata como tinta: recibe las sombras de las vías y los trenes.
function rotular() {
  const esc = geo.dpr, c = lienzoTinta;
  c.width = Math.round(geo.W * esc); c.height = Math.round(geo.alto * esc);
  const ctx = c.getContext('2d');
  ctx.setTransform(esc, 0, 0, esc, 0, 0); ctx.clearRect(0, 0, geo.W, geo.alto);
  ctx.fillStyle = '#fff'; ctx.textBaseline = 'alphabetic';
  const base = plano.getBoundingClientRect();
  for (const span of plano.querySelectorAll('.nombre span')) {
    const cs = getComputedStyle(span);
    const sonda = crea('i'); sonda.style.cssText = 'display:inline-block;width:0;height:0;vertical-align:baseline';
    span.prepend(sonda); const r = sonda.getBoundingClientRect(); sonda.remove();
    ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    if ('letterSpacing' in ctx) ctx.letterSpacing = cs.letterSpacing;
    ctx.fillText(span.textContent, r.left - base.left, r.top - base.top);
  }
  pintor.rotular(c); entero = true;
}

// Sin WebGL2 el plano se dibuja plano, en SVG: se pierde el relieve, no el contenido ni el manejo.
function dibujarSinGl() {
  let svg = $('.plano__svg', plano);
  if (!svg) { svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); svg.setAttribute('class', 'plano__svg'); svg.setAttribute('aria-hidden', 'true'); lienzo.after(svg); }
  const { k, ox, oy } = geo;
  svg.setAttribute('viewBox', `0 0 ${geo.W} ${geo.alto}`);
  svg.innerHTML = lineas.map((L) => {
    const d = L.via.tramos.map(([a, b, c, e], j) => `${j ? '' : `M${ox + a * k} ${oy + b * k}`}L${ox + c * k} ${oy + e * k}`).join('');
    const ps = L.paradas.map((p) => `<circle cx="${p.px}" cy="${p.py}" r="${p.r * k}" fill="${p.tipo ? L.linea.color : '#fbf9f3'}" stroke="#15171c" stroke-width="${p.tipo === 1 ? 0 : 3 * k}"/>`).join('');
    return `<path d="${d}" fill="none" stroke="${L.linea.color}" stroke-width="${13 * k}" stroke-linecap="round" stroke-linejoin="round"/>${ps}`;
  }).join('');
}

// ————— El fotograma —————

function despertar() {
  if (raf || !visible) return;
  antes = null; raf = requestAnimationFrame(fotograma);
}

function fotograma(ahora) {
  raf = 0;
  const dt = antes == null ? 1 / 60 : Math.min(Math.max((ahora - antes) / 1000, 0), 0.1);
  if (antes != null) ritmo(ahora - antes);
  antes = ahora;
  const { k, ox, oy } = geo;
  let vivo = false, nc = 0, np = 0;
  // Lo que hay que repintar: el rectángulo que abarca lo que se ha movido (o todo, si cambia la luz).
  let zx0 = Infinity, zy0 = Infinity, zx1 = -Infinity, zy1 = -Infinity;
  const ensucia = (x0, y0, x1, y1) => { if (x0 < zx0) zx0 = x0; if (y0 < zy0) zy0 = y0; if (x1 > zx1) zx1 = x1; if (y1 > zy1) zy1 = y1; };
  const margen = 34 * k;

  for (const L of lineas) {
    const t = L.tren;
    let seMueve = t.avanzar(dt);
    const qa = t.modo === 'mano' ? 1 : L.cerca ? 0.35 : 0;
    if (L.alza !== qa) { seMueve = true; if (Math.abs(qa - L.alza) > 0.004) L.alza += (qa - L.alza) * Math.min(1, dt * 13); else L.alza = qa; }
    if (seMueve) vivo = true;

    const cs = t.coches(L.cs);
    for (let j = 0; j < t.n; j++) {
      const c = cs[j], o = escena.coches[nc] || (escena.coches[nc] = {}); nc++;
      o.x = ox + c.x * k; o.y = oy + c.y * k; o.c = c.c; o.s = c.s; o.linea = L.idx;
      o.faroDelante = j === 0 ? t.luz : 0; o.faroDetras = j === t.n - 1 ? -t.luz : 0; o.agarre = L.alza;
    }
    if (seMueve || !L.caja) {
      let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
      for (let j = 0; j < t.n; j++) { const x = ox + cs[j].x * k, y = oy + cs[j].y * k; if (x < x0) x0 = x; if (y < y0) y0 = y; if (x > x1) x1 = x; if (y > y1) y1 = y; }
      if (L.caja) ensucia(...L.caja);
      L.caja = [x0 - margen, y0 - margen, x1 + margen, y1 + margen]; ensucia(...L.caja);
    }
    const m = cs[t.centro];
    if (seMueve || entero) L.tirador.style.transform = `translate(${(ox + m.x * k).toFixed(1)}px, ${(oy + m.y * k).toFixed(1)}px) rotate(${Math.atan2(m.s, m.c).toFixed(3)}rad)`;

    for (const p of L.paradas) {
      const qp = p.tipo === 1 ? Math.max(p.resalte * 0.7, L.alza) : Math.max(t.parada === p.i ? 1 : 0, p.resalte * 0.7);
      let cambia = false;
      if (p.activa !== qp) { cambia = true; if (Math.abs(qp - p.activa) > 0.004) p.activa += (qp - p.activa) * Math.min(1, dt * 11); else p.activa = qp; }
      if (p.onda > 0) { p.onda += dt / 0.8; if (p.onda >= 1) p.onda = 0; cambia = true; }
      if (cambia) { vivo = true; const m2 = (p.r + 34) * k; ensucia(p.px - m2, p.py - m2, p.px + m2, p.py + m2); }
      const e = escena.paradas[np] || (escena.paradas[np] = {}); np++;
      e.x = p.px; e.y = p.py; e.r = p.r * k; e.activa = p.activa; e.linea = L.idx; e.tipo = p.tipo; e.onda = p.onda;
    }
  }
  escena.coches.length = nc; escena.paradas.length = np;

  // la luz sigue un poco al puntero: los brillos de las vías se deslizan
  if (Math.abs(mx - lx) + Math.abs(my - ly) > 0.002) { lx += (mx - lx) * Math.min(1, dt * 5); ly += (my - ly) * Math.min(1, dt * 5); vivo = true; entero = true; }
  escena.luz[0] = LUZ[0] + lx * 0.24; escena.luz[1] = LUZ[1] + ly * 0.18; escena.luz[2] = LUZ[2];

  if (pintor) { if (entero) pintor.pintar(escena); else if (zx1 > zx0) pintor.pintar(escena, [zx0, zy0, zx1, zy1]); }
  entero = false;
  if (vivo) despertar(), (antes = ahora);
}

// Si el equipo no llega a 30 fps sostenidos, se baja la densidad un escalón (y se vuelve a hornear).
function ritmo(ms) {
  if (ms > 34 && ms < 250) lentos++; else lentos = Math.max(0, lentos - 2);
  if (lentos > 45 && geo.dpr > 1) { lentos = 0; calidad *= 0.8; geo.dpr = dprDe(geo); colocar(); }
}

// ————— La ficha —————

function hojaHTML(l) {
  const i = ORDEN.indexOf(l), ant = ORDEN[(i + ORDEN.length - 1) % ORDEN.length], sig = ORDEN[(i + 1) % ORDEN.length];
  const lado = l.imagen
    ? `<figure class="hoja__foto entra" style="--i:3"><img src="${l.imagen}" alt="Portada de ${l.nombre}" width="1600" height="1000"></figure>`
    : `<div class="hoja__cifra entra" style="--i:3;--n:${l.cifra[0].length}"><b>${l.cifra[0]}</b><span>${l.cifra[1]}</span></div>`;
  const enlace = l.web
    ? `<a class="boton entra" style="--i:5" href="${l.web[1]}" target="_blank" rel="noopener"><span>Abrir ${l.web[0]}</span><span aria-hidden="true">↗</span></a>`
    : l.estado === 'En desarrollo' ? '<p class="hoja__nota entra" style="--i:5">En preparación: todavía sin enlace público.</p>' : '';
  const otra = (o, flecha) => `<button type="button" class="hoja__otra" data-ir="${o.id}" style="--linea:${o.color};--linea-tinta:${o.tinta}"><i>L${o.n}</i><span>${flecha === '←' ? '← ' : ''}${o.nombre}${flecha === '→' ? ' →' : ''}</span></button>`;
  return `<article class="hoja">
    <header class="hoja__cab">
      <span class="hoja__insignia">L${l.n}</span>
      <ol class="hoja__tira" aria-hidden="true">${[...l.paradas.slice(0, -1), 'Ficha'].map((p) => `<li>${p}</li>`).join('')}</ol>
      <button type="button" class="hoja__volver" data-volver><span aria-hidden="true">←</span> Volver al plano</button>
    </header>
    <div class="hoja__cuerpo">
      <div>
        <h2 class="hoja__titulo entra" id="ficha-t">${l.nombre}</h2>
        <p class="hoja__estado entra" style="--i:1"><b>${l.tipo}</b> <span>· ${l.estado.toLowerCase()}</span></p>
        <ol class="recorrido">${l.textos.map((t, j) => `<li class="entra" style="--i:${j + 2}"><b>${l.pasos[j]}</b><span>${t}</span></li>`).join('')}</ol>
      </div>
      <aside class="hoja__lado">
        ${lado}
        <ul class="hoja__pila entra" style="--i:4" aria-label="Tecnologías">${l.stack.map((s) => `<li>${s}</li>`).join('')}</ul>
        ${enlace}
      </aside>
    </div>
    <footer class="hoja__pie">${otra(ant, '←')}${otra(sig, '→')}</footer>
  </article>`;
}

function vestir(linea, origen) {
  const o = origen || { x: innerWidth / 2, y: innerHeight / 2 };
  return { '--linea': linea.color, '--linea-tinta': linea.tinta, '--fx': o.x + 'px', '--fy': o.y + 'px',
    '--fr': Math.hypot(Math.max(o.x, innerWidth - o.x), Math.max(o.y, innerHeight - o.y)) + 24 + 'px' };
}
const pon = (el, vars) => { for (const [n, v] of Object.entries(vars)) el.style.setProperty(n, v); };
const centro = (el) => { const r = el.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; };

function mostrar(id, origen, L = null) {
  const linea = LINEAS.find((l) => l.id === id); if (!linea) return;
  clearTimeout(tCierre);
  const foco = abierta ? abierta.foco : document.activeElement;
  pon(ficha, vestir(linea, origen));
  hoja.innerHTML = hojaHTML(linea); hoja.scrollTop = 0;
  ficha.hidden = false; ficha.classList.remove('se-cierra', 'es-abierta'); void ficha.offsetWidth; ficha.classList.add('es-abierta');
  pagina.inert = true; raiz.classList.add('con-ficha');
  abierta = { id, L, foco };
  hoja.focus({ preventScroll: true });
}

// De una ficha a otra: el color de la línea nueva entra desde el botón pulsado y se retira dejando la hoja nueva.
function cambiar(id, origen) {
  const linea = LINEAS.find((l) => l.id === id); if (!linea || !abierta) return;
  const velo = crea('div', 'ficha__velo'); pon(velo, vestir(linea, origen)); ficha.append(velo);
  void velo.offsetWidth; velo.classList.add('va');
  setTimeout(() => {
    ficha.style.setProperty('--linea', linea.color); ficha.style.setProperty('--linea-tinta', linea.tinta);
    hoja.innerHTML = hojaHTML(linea); hoja.scrollTop = 0; abierta.id = id; hoja.focus({ preventScroll: true });
    velo.classList.add('se-va'); setTimeout(() => velo.remove(), 450);
  }, reducido.matches ? 0 : 460);
}

function ocultar() {
  if (!abierta) return;
  const { L, foco } = abierta; abierta = null;
  ficha.classList.add('se-cierra'); ficha.classList.remove('es-abierta');
  pagina.inert = false; raiz.classList.remove('con-ficha');
  tCierre = setTimeout(() => { ficha.hidden = true; ficha.classList.remove('se-cierra'); hoja.textContent = ''; }, reducido.matches ? 0 : 540);
  const vuelve = L ? L.tirador : foco;
  if (vuelve && vuelve.isConnected) vuelve.focus({ preventScroll: true });
  if (L) setTimeout(() => llevar(L, 0), reducido.matches ? 0 : 200);      // el tren vuelve solo a su cabecera
}

const rutaDe = () => (location.hash.match(/^#\/linea\/([a-z]+)/) || [])[1] || null;
function abrirFicha(id, origen, L) { history.pushState({ ficha: id }, '', '#/linea/' + id); mostrar(id, origen, L); }
function cerrarFicha() {
  if (history.state && history.state.ficha) history.back();
  else { history.replaceState(null, '', location.pathname + location.search); ocultar(); }
}
function sincronizar() {
  const id = rutaDe();
  if (id && (!abierta || abierta.id !== id)) mostrar(id, null);
  else if (!id && abierta) ocultar();
}

function sacarFicha(L) {
  setTimeout(() => {
    if (abierta || L.tren.parada !== L.paradas.length - 1) return;
    const p = L.paradas[L.paradas.length - 1], r = plano.getBoundingClientRect();
    abrirFicha(L.linea.id, { x: r.left + p.px, y: r.top + p.py }, L);
  }, reducido.matches ? 0 : 260);
}

ficha.addEventListener('click', (e) => {
  const b = e.target.closest('button'); if (!b) return;
  if ('volver' in b.dataset) cerrarFicha();
  else if (b.dataset.ir) { history.replaceState({ ficha: b.dataset.ir }, '', '#/linea/' + b.dataset.ir); cambiar(b.dataset.ir, centro(b)); }
});
addEventListener('popstate', sincronizar);
addEventListener('hashchange', sincronizar);

addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && abierta) { e.preventDefault(); cerrarFicha(); return; }
  if (abierta || e.ctrlKey || e.metaKey || e.altKey) return;
  const n = Number(e.key);
  if (n >= 1 && n <= lineas.length) { const L = lineas.find((x) => x.linea.n === n); if (L) { e.preventDefault(); L.tirador.focus(); } }
});

// ————— La lista de abajo —————

function listar() {
  const ol = $('[data-lista]'), ul = $('[data-otros]');
  for (const l of ORDEN) {
    const li = crea('li'), b = crea('button', 'fila'); b.type = 'button';
    b.style.setProperty('--linea', l.color); b.style.setProperty('--linea-tinta', l.tinta);
    b.append(crea('span', 'fila__insignia', 'L' + l.n), crea('span', 'fila__nombre', l.nombre), crea('span', 'fila__que', l.textos[0]),
      crea('span', 'fila__res', l.textos[2]), crea('span', 'fila__estado', l.estado));
    b.setAttribute('aria-label', `${l.nombre}: abrir la ficha`);
    b.addEventListener('click', () => abrirFicha(l.id, centro($('.fila__insignia', b))));
    li.append(b); ol.append(li);
  }
  for (const o of OTROS) {
    const li = crea('li'), d = crea('div', 'fila'), nombre = crea('span', 'fila__nombre');
    if (o.web) { const a = crea('a', '', o.nombre); a.href = o.web[1]; a.target = '_blank'; a.rel = 'noopener'; nombre.append(a); } else nombre.textContent = o.nombre;
    d.append(nombre, crea('span', 'fila__que', o.que), crea('span', 'fila__res', o.resultado), crea('span', 'fila__estado', o.estado));
    li.append(d); ul.append(li);
  }
}

// ————— Arranque —————

geo = medir(); aplicarGeo();
montar(); listar(); colocar();
if (document.fonts) {
  Promise.all([document.fonts.load('800 80px "Host Grotesk"'), document.fonts.load('italic 500 80px "Bodoni Moda"')])
    .then(() => { if (pintor) { rotular(); despertar(); } });
}
sincronizar();

let pendiente = 0;
addEventListener('resize', () => { cancelAnimationFrame(pendiente); pendiente = requestAnimationFrame(reajustar); });
function reajustar() {
  const n = medir();
  if (n.modo === geo.modo && n.W === geo.W && n.alto === geo.alto && n.dpr === geo.dpr) return;
  const cambia = n.modo !== geo.modo;
  const donde = lineas.map((L) => actual(L));
  geo = n; aplicarGeo();
  if (cambia) { montar(); lineas.forEach((L, i) => { L.tren.colocar(donde[i]); marcar(L, donde[i]); }); }
  colocar();
}

plano.addEventListener('pointermove', (e) => {
  if (e.pointerType === 'touch' || reducido.matches) return;
  const r = plano.getBoundingClientRect();
  mx = ((e.clientX - r.left) / r.width) * 2 - 1; my = ((e.clientY - r.top) / Math.min(r.height, innerHeight)) * 2 - 1;
  despertar();
});
plano.addEventListener('pointerleave', () => { mx = 0; my = 0; despertar(); });

// Fuera de pantalla o con la pestaña oculta no se pinta ni se simula.
new IntersectionObserver(([e]) => { visible = e.isIntersecting && !document.hidden; if (visible) despertar(); }, { threshold: 0 }).observe(plano);
document.addEventListener('visibilitychange', () => { visible = !document.hidden && estaEnPantalla(); if (visible) despertar(); });
function estaEnPantalla() { const r = plano.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight; }
lienzo.addEventListener('pintor:repintar', () => { entero = true; despertar(); });

// Mientras nadie haya tocado nada, el tren de la línea 1 da un empujoncito de vez en cuando: «tira de mí».
setTimeout(function aviso() {
  if (!pista || reducido.matches) return;
  const L = lineas.find((x) => x.linea.n === 1);
  if (visible && !abierta && L.tren.parada === 0 && L.tren.modo === 'libre') { L.tren.empujar(245); despertar(); }
  setTimeout(aviso, 5200);
}, 2600);
