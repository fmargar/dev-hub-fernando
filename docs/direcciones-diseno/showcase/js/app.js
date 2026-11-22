// La mesa: objetos con peso que se cogen, se sueltan y se abren.
// Todo el movimiento va por transform y opacity; el bucle duerme cuando nada se mueve.
import { PROYECTOS, ROTULOS, porId } from './datos.js';
import { MEDIDAS, MARGEN_SOMBRA } from './medidas.js';
import './fps.js';

const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const CURVA = 'cubic-bezier(.22, 1, .36, 1)';
const $ = (s, r = document) => r.querySelector(s);
const el = (html) => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };
const limita = (v, a, b) => Math.min(b, Math.max(a, v));
const espera = (ms) => new Promise((r) => setTimeout(r, ms));

// ───────── Los objetos: piezas (imagen + rotulación en HTML) y su sitio en la mesa ─────────
const leds = [33.75, 38.25, 42.65, 47.05, 51.45, 55.85, 60.25, 64.75]
  .map((x, i) => `<i class="srv-led${i < 2 ? ' fijo' : ''}${i === 5 ? ' ambar' : ''}" style="left:${x}%;--i:${i}"></i>`).join('');
const lineas = [[20, 46], [25.5, 70], [29, 64], [32.5, 68], [36, 40], [44, 70], [47.5, 58], [51, 66]]
  .map(([t, w]) => `<i class="erp-linea" style="top:${t}%;width:${w}%"></i>`).join('');

const OBJETOS = [
  { id: 'servidor', x: 66, y: 228, r: 2.5, m: [292, 1265, 0.8], pesa: 1,
    piezas: [{ img: 'servidor', x: 0, y: 0, html: leds }] },
  { id: 'vision', x: 262, y: 420, r: -6, m: [262, 1640, 0.95],
    piezas: [{ img: 'lamina', x: 0, y: 0, html: '<span class="lam-et e1" style="left:58%;top:17%">Formulario</span><span class="lam-et e2" style="left:8%;top:87%">Botón</span><span class="lam-et e3" style="left:76%;top:85%">Gráfica</span>' }] },
  { id: 'adivinadle', x: 452, y: 236, r: -4, m: [195, 560, 1.05], pesa: 1,
    piezas: [
      { img: 'caja-base', x: 13, y: 12, html: '<span class="caja-fondo">¿Quién es hoy?</span>' },
      { img: 'caja-tapa', x: 0, y: 0, clase: 'tapa', html: '<span class="caja-titulo">Adivinadle</span><span class="caja-sub">Un caso nuevo<br>cada día</span><span class="caja-pie">¿Quién es el personaje de hoy?</span>' },
    ] },
  { id: 'wardux', x: 800, y: 300, r: 4.5, m: [104, 850, 0.78],
    piezas: [{ img: 'periodico', x: 0, y: 0, html: '<span class="per-cabecera">Wardux</span><span class="per-fecha"><span>IA y hardware</span><span>En español</span></span><img class="per-foto" src="arte/captura-wardux.webp" alt="" loading="lazy"><span class="per-visto">Revisado</span>' }] },
  { id: 'calculo', x: 1046, y: 232, r: -3, m: [290, 840, 0.8], pesa: 1,
    piezas: [{ img: 'calculadora', x: 0, y: 0, html: '<div class="cal-ranura"><div class="cal-tique"><i></i><i></i><i></i><i></i></div></div><div class="cal-lcd"><span>0,00</span><span>46/46</span></div><div class="cal-tecla"></div>' }] },
  { id: 'marbella', x: 1252, y: 262, r: 7, m: [285, 1470, 0.95],
    piezas: [{ img: 'postal', x: 0, y: 0, clase: 'postal', html: '<div class="pos-dorso"><div><b>Marbella Fácil</b>Reservas, directorio y servicios en una sola web.</div><i>10 con Matrícula de Honor</i></div>' }] },
  { id: 'agentes', x: 420, y: 716, r: 1.5, m: [195, 1080, 1.05], pesa: 1,
    piezas: [{ img: 'bandejas', x: 0, y: 0, html: '<i class="ban-ficha f1"></i><i class="ban-ficha f2"></i><i class="ban-ficha f3"></i><i class="ban-ficha f4"></i><span class="ban-rotulo r1">Encargo</span><span class="ban-rotulo r2">Revisión</span><span class="ban-rotulo r3">Hecho</span>' }] },
  { id: 'vados', x: 806, y: 620, r: -5, m: [98, 1500, 0.8],
    piezas: [{ img: 'placa', x: 0, y: 0, clase: 'placa', html: '<span class="pla-texto">Vado<br>permanente<small>Marbella</small></span>' }] },
  { id: 'erp', x: 1010, y: 540, r: 0, m: [118, 1280, 0.62],
    piezas: [
      { img: 'tampon', x: 0, y: 232, r: 5 },
      { img: 'portapapeles', x: 196, y: 0, r: 4, html: `${lineas}<span class="erp-ok">Aprobado</span>` },
      { img: 'sello', x: 50, y: 138, r: -20, clase: 'sello', estilo: '--sx:160;--sy:-6' },
    ] },
];
const ALTO_MOVIL = 1800;
const ORDEN_CAIDA = ['adivinadle', 'calculo', 'wardux', 'servidor', 'agentes', 'erp', 'marbella', 'vision', 'vados'];

function medir(def) {
  let w = 0, h = 0;
  for (const p of def.piezas) {
    p.w ??= MEDIDAS[p.img].w; p.h = p.w * MEDIDAS[p.img].r;
    w = Math.max(w, p.x + p.w); h = Math.max(h, p.y + p.h);
  }
  def.w = w; def.h = h;
}

// Monta las piezas de un objeto. Sirve igual para la mesa que para la página del proyecto (arte grande).
function construir(def, grande = false) {
  const dir = grande ? 'arte/g/' : 'arte/';
  const cuerpo = document.createElement('div');
  const som = document.createElement('div');
  for (const p of def.piezas) {
    const giro = p.r ? `rotate(${p.r}deg)` : 'none';
    cuerpo.append(el(`<div class="pz pz-${p.clase || p.img}" style="left:${p.x}px;top:${p.y}px;width:${p.w}px;height:${p.h}px;--w:${p.w}px;--giro:${giro};${p.estilo || ''}"><img src="${dir}${p.img}.webp" alt="" draggable="false">${p.html || ''}</div>`));
    const m = Math.max(p.w, p.h) * MARGEN_SOMBRA;
    som.append(el(`<div class="sm" style="left:${p.x - m}px;top:${p.y - m}px;width:${p.w + 2 * m}px;height:${p.h + 2 * m}px;transform:${giro}"><img class="sm-a" src="arte/s/${p.img}.webp" alt=""><img class="sm-c" src="arte/s/${p.img}-c.webp" alt=""></div>`));
  }
  return { cuerpo, som };
}

// ───────── Escena y escala ─────────
const mesa = $('#mesa'), escena = $('#escena'), capa = $('#objetos'), etiqueta = $('#etiqueta'), hoja = $('#proyecto');
const E = { k: 1, ox: 0, oy: 0, movil: null, ancho: 1440, alto: 900 };
const objs = [];
const porDom = new Map();
let zTop = 20;

function componer() {
  const movil = innerWidth <= 760;
  const cambia = movil !== E.movil;
  E.movil = movil;
  if (movil) {
    E.ancho = 390; E.alto = ALTO_MOVIL; E.k = innerWidth / 390; E.ox = 0; E.oy = 0;
    mesa.style.height = `${E.alto * E.k}px`;
  } else {
    mesa.style.height = '';
    E.ancho = 1440; E.alto = 900;
    const H = mesa.clientHeight;
    E.k = Math.min(innerWidth / 1440, H / 900);
    E.ox = (innerWidth - 1440 * E.k) / 2; E.oy = (H - 900 * E.k) / 2;
  }
  escena.style.height = `${E.alto}px`;
  escena.style.transform = `translate(${E.ox}px, ${E.oy}px) scale(${E.k})`;
  if (cambia) for (const o of objs) { asentar(o); pintar(o); }
}

function casaDe(o) {
  const d = o.def;
  return E.movil ? { x: d.m[0] - d.w / 2, y: d.m[1] - d.h / 2, r: d.r * .6, s: d.m[2] } : { x: d.x, y: d.y, r: d.r, s: 1 };
}
function asentar(o) {
  o.casa = casaDe(o);
  Object.assign(o, { x: o.casa.x, y: o.casa.y, r: o.casa.r, s: o.casa.s, tx: o.casa.x, ty: o.casa.y, tr: o.casa.r, a: 0, ta: 0, vx: 0, vy: 0, vr: 0, va: 0 });
  o.dom.style.setProperty('--s', o.s);
}

function pintar(o) {
  const a = Math.max(o.a, 0);
  o.cuerpo.style.transform = `translate3d(${o.x}px,${o.y}px,0) rotate(${o.r}deg) scale(${o.s * (1 + .07 * o.a)})`;
  o.som.style.transform = `translate3d(${o.x + (3 + 20 * a) * o.s}px,${o.y + (5 + 32 * a) * o.s}px,0) rotate(${o.r}deg) scale(${o.s * (1 + .1 * a)})`;
  o.som.style.opacity = Math.max(.1, 1 - .42 * a);
}

// ───────── Muelles: un solo bucle, que se para cuando todo está quieto ─────────
const despiertos = new Set();
let raf = 0, tAnt = 0;
function despertar(o) {
  if (RM) { Object.assign(o, { x: o.tx, y: o.ty, r: o.tr, a: o.ta }); pintar(o); return; }
  despiertos.add(o);
  if (!raf) { tAnt = performance.now(); raf = requestAnimationFrame(paso); }
}
function paso(t) {
  const dt = Math.min((t - tAnt) / 1000, 1 / 20); tAnt = t;
  const h = dt / 3;
  for (const o of despiertos) {
    for (let i = 0; i < 3; i++) {
      if (!o.cogido) {
        o.vx += (190 * (o.tx - o.x) - 21 * o.vx) * h; o.x += o.vx * h;
        o.vy += (190 * (o.ty - o.y) - 21 * o.vy) * h; o.y += o.vy * h;
      }
      o.vr += (150 * (o.tr - o.r) - 13 * o.vr) * h; o.r += o.vr * h;
      const ka = o.cae ? 95 : 250, ca = o.cae ? 14 : 20;
      o.va += (ka * (o.ta - o.a) - ca * o.va) * h; o.a += o.va * h;
    }
    if (o.cae && o.a <= .03) { o.cae = false; if (o.def.pesa) golpe(); }
    const quieto = !o.cogido && Math.abs(o.tx - o.x) + Math.abs(o.ty - o.y) < .15 && Math.abs(o.vx) + Math.abs(o.vy) < 2
      && Math.abs(o.tr - o.r) < .03 && Math.abs(o.vr) < .3 && Math.abs(o.ta - o.a) < .004 && Math.abs(o.va) < .03;
    if (quieto) { Object.assign(o, { x: o.tx, y: o.ty, r: o.tr, a: o.ta, cae: false }); despiertos.delete(o); }
    pintar(o);
  }
  raf = despiertos.size ? requestAnimationFrame(paso) : 0;
}
// El golpe de un objeto pesado al caer: la mesa entera tiembla un pelo.
function golpe() {
  if (RM) return;
  capa.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(2.5px)' }, { transform: 'translateY(-1px)' }, { transform: 'translateY(0)' }], { duration: 170, easing: 'ease-out' });
}

// ───────── Montaje ─────────
function montarMesa() {
  $('#rotulo').innerHTML = [...'FERNANDO'].map((c, i) => `<span class="l"><span style="transition-delay:${i * 55}ms">${c}</span></span>`).join('');
  for (const def of OBJETOS) {
    medir(def);
    const p = porId(def.id);
    const dom = el(`<div class="obj" data-id="${def.id}" tabindex="0" role="button" aria-label="${p.nombre}: ${p.linea} Pulsa Intro para abrirlo."></div>`);
    const { cuerpo, som } = construir(def);
    cuerpo.className = 'obj-cuerpo'; som.className = 'obj-som';
    for (const c of [cuerpo, som]) { c.style.width = `${def.w}px`; c.style.height = `${def.h}px`; }
    cuerpo.append(el(`<span class="obj-nombre"><b>${p.n}</b>${p.nombre}</span>`));
    dom.append(som, cuerpo);
    capa.append(dom);
    const o = { def, id: def.id, p, dom, cuerpo, som, w: def.w, h: def.h };
    objs.push(o); porDom.set(dom, o);
  }
  $('#indice').innerHTML = PROYECTOS.map((p) => `<button type="button" data-id="${p.id}"><b>${p.n}</b>${p.nombre}</button>`).join('');
  $('#lista-filas').innerHTML = PROYECTOS.map((p) => `<li class="fila"><button type="button" data-id="${p.id}">
    <span class="fila-n">${p.n}</span><span class="fila-nombre">${p.nombre}</span><span class="fila-linea">${p.linea}</span>
    <span class="fila-meta"><span class="chip">${p.estado}</span><span class="fila-flecha" aria-hidden="true">→</span></span></button></li>`).join('');
  componer();
}
const objDe = (id) => objs.find((o) => o.id === id);

function entrada() {
  const directo = idDeRuta();
  if (RM || directo) { document.body.classList.remove('cargando'); return; }
  const orden = ORDEN_CAIDA.map(objDe);
  for (const o of orden) { o.a = 5.2; o.cuerpo.style.opacity = 0; o.som.style.opacity = 0; pintar(o); o.som.style.opacity = 0; }
  requestAnimationFrame(() => requestAnimationFrame(() => {
    document.body.classList.remove('cargando');
    orden.forEach((o, i) => setTimeout(() => { o.cuerpo.style.opacity = ''; o.cae = true; o.ta = 0; despertar(o); }, 380 + i * 105));
    setTimeout(ola, 380 + orden.length * 105 + 850);
  }));
}

// ───────── Coger, soltar, elegir ─────────
let toque = null, sobre = null, elegido = null, abierto = null, ultimoArrastre = 0;
const aEscena = (e) => { const r = mesa.getBoundingClientRect(); return { x: (e.clientX - r.left - E.ox) / E.k, y: (e.clientY - r.top - E.oy) / E.k }; };
function altura(o) { o.ta = o.cogido ? 1 : o === elegido ? .55 : o === sobre ? .3 : 0; despertar(o); }
function vivir(o, si) { o.dom.classList.toggle('vivo', si); altura(o); }

capa.addEventListener('pointerover', (e) => {
  if (e.pointerType !== 'mouse' || toque?.movido) return;
  const o = porDom.get(e.target.closest('.obj'));
  if (o === sobre) return;
  const antes = sobre; sobre = o || null;
  if (antes && antes !== elegido) vivir(antes, false); else if (antes) altura(antes);
  if (o) vivir(o, true);
});
capa.addEventListener('pointerleave', () => { if (sobre && !toque?.movido) { const a = sobre; sobre = null; if (a !== elegido) vivir(a, false); else altura(a); } });

capa.addEventListener('pointerdown', (e) => {
  const o = porDom.get(e.target.closest('.obj'));
  if (!o || e.button || abierto) return;
  const p = aEscena(e);
  toque = { o, id: e.pointerId, x0: p.x, y0: p.y, dx: p.x - o.x, dy: p.y - o.y, lx: p.x, ly: p.y, lt: e.timeStamp, vx: 0, vy: 0, movido: false, arrastra: !E.movil && e.pointerType !== 'touch' };
  if (toque.arrastra) { o.dom.style.zIndex = ++zTop; e.preventDefault(); }
});
addEventListener('pointermove', (e) => {
  if (!toque || e.pointerId !== toque.id || !toque.arrastra) return;
  const p = aEscena(e), o = toque.o;
  if (!toque.movido) {
    if (Math.hypot(p.x - toque.x0, p.y - toque.y0) < 5) return;
    toque.movido = true; o.cogido = true; o.dom.classList.add('cogido'); elegir(null); altura(o);
  }
  const dt = Math.max(e.timeStamp - toque.lt, 1);
  toque.vx = toque.vx * .5 + ((p.x - toque.lx) / dt) * 500; toque.vy = toque.vy * .5 + ((p.y - toque.ly) / dt) * 500;
  toque.lx = p.x; toque.ly = p.y; toque.lt = e.timeStamp;
  o.x = o.tx = p.x - toque.dx; o.y = o.ty = p.y - toque.dy;
  o.tr = o.casa.r + limita(toque.vx * .011, -10, 10);
  despertar(o);
});
function soltar(e) {
  if (!toque || e.pointerId !== toque.id) return;
  const { o } = toque;
  if (toque.movido) {
    const parado = e.timeStamp - toque.lt > 90;
    const vx = parado ? 0 : limita(toque.vx, -2600, 2600), vy = parado ? 0 : limita(toque.vy, -2600, 2600);
    o.cogido = false; o.dom.classList.remove('cogido');
    o.vx = vx; o.vy = vy;
    o.tx = limita(o.x + vx * .11, -o.w * .35, E.ancho - o.w * .65); o.ty = limita(o.y + vy * .11, 30, E.alto - o.h * .55);
    o.casa = { ...o.casa, x: o.tx, y: o.ty, r: limita(o.casa.r + vx * .003, -14, 14) }; o.tr = o.casa.r;
    o.cae = true; altura(o);
    ultimoArrastre = performance.now();
  }
  toque = null;
}
addEventListener('pointerup', soltar);
addEventListener('pointercancel', soltar);

capa.addEventListener('click', (e) => {
  const o = porDom.get(e.target.closest('.obj'));
  if (!o || performance.now() - ultimoArrastre < 250) return;
  if (o === elegido) ir(o.id); else elegir(o);
});
capa.addEventListener('dblclick', (e) => { const o = porDom.get(e.target.closest('.obj')); if (o) ir(o.id); });
capa.addEventListener('keydown', (e) => {
  const o = porDom.get(e.target.closest('.obj'));
  if (o && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); ir(o.id); }
});
capa.addEventListener('focusin', (e) => { const o = porDom.get(e.target.closest('.obj')); if (o && e.target.matches(':focus-visible')) vivir(o, true); });
capa.addEventListener('focusout', (e) => { const o = porDom.get(e.target.closest('.obj')); if (o && o !== elegido && o !== sobre) vivir(o, false); });

function elegir(o) {
  if (elegido === o) return;
  const antes = elegido; elegido = o;
  if (antes) { antes.dom.classList.remove('elegido'); vivir(antes, antes === sobre); }
  for (const b of $('#indice').children) b.classList.toggle('activo', !!o && b.dataset.id === o.id);
  if (!o) { etiqueta.hidden = true; return; }
  o.dom.style.zIndex = ++zTop;
  o.dom.classList.add('elegido'); vivir(o, true);
  precargar(o);
  const p = o.p;
  etiqueta.innerHTML = `<p class="et-n"><b>${p.n}</b> · ${p.objeto}</p><h2 class="et-nombre">${p.nombre}</h2><p class="et-linea">${p.linea}</p>
    <p class="et-meta"><span class="chip">${p.tipo}</span><span class="chip">${p.estado}</span></p>
    <p class="et-pie"><button type="button" class="boton boton-naranja" data-abrir="${p.id}"><span class="boton-tapa">Abrir <kbd>↵</kbd></span></button><button type="button" class="et-cerrar" data-soltar>Soltar</button></p>`;
  etiqueta.hidden = false;
  if (!E.movil) {
    const r = mesa.getBoundingClientRect();
    const cx = r.left + E.ox + (o.tx + o.w / 2) * E.k, cy = r.top + E.oy + (o.ty + o.h / 2) * E.k, medio = (o.w * o.s * E.k) / 2;
    let x = cx + medio + 22;
    if (x + 292 > innerWidth - 12) x = cx - medio - 22 - 292;
    etiqueta.style.left = `${limita(x, 12, innerWidth - 304)}px`;
    etiqueta.style.top = `${limita(cy - etiqueta.offsetHeight / 2, 12, innerHeight - etiqueta.offsetHeight - 12)}px`;
  }
  etiqueta.classList.remove('entra'); void etiqueta.offsetWidth; etiqueta.classList.add('entra');
}
etiqueta.addEventListener('click', (e) => {
  const b = e.target.closest('[data-abrir]');
  if (b) ir(b.dataset.abrir); else if (e.target.closest('[data-soltar]')) elegir(null);
});
addEventListener('pointerdown', (e) => { if (elegido && !e.target.closest('.obj, .etiqueta, .indice')) elegir(null); });
addEventListener('keydown', (e) => { if (e.key === 'Escape') { if (abierto) volver(); else elegir(null); } });
addEventListener('scroll', () => { if (elegido && !abierto) elegir(null); }, { passive: true });
$('#indice').addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) elegir(objDe(b.dataset.id)); });
$('#indice').addEventListener('pointerover', (e) => { const b = e.target.closest('button'); if (b && e.pointerType === 'mouse') { const o = objDe(b.dataset.id); if (o !== elegido) { sobre = o; vivir(o, true); } } });
$('#indice').addEventListener('pointerout', (e) => { const b = e.target.closest('button'); if (b && sobre && sobre.id === b.dataset.id) { const o = sobre; sobre = null; if (o !== elegido) vivir(o, false); } });
$('#lista-filas').addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) ir(b.dataset.id); });

// En móvil no hay ratón: cada objeto hace su gracia al entrar en pantalla.
const aLaVista = new Set();
const vista = new IntersectionObserver((es) => {
  for (const e of es) {
    const o = porDom.get(e.target.parentElement);
    if (o) aLaVista[e.isIntersecting ? 'add' : 'delete'](o);
    if (!o || !E.movil || !e.isIntersecting || o === elegido || abierto) continue;
    setTimeout(() => { if (o !== elegido) { o.dom.classList.add('vivo'); setTimeout(() => { if (o !== elegido) o.dom.classList.remove('vivo'); }, 1700); } }, 250);
  }
}, { threshold: .85 });

// Sin que nadie toque nada, de vez en cuando un objeto hace su gracia: la mesa está viva.
let turno = 0;
const RONDA = ['calculo', 'erp', 'adivinadle', 'agentes', 'servidor', 'wardux', 'marbella', 'vision', 'vados'];
function gracia(o, ms = 1500) {
  if (abierto || o === sobre || o === elegido || o.cogido) return;
  o.dom.classList.add('vivo'); o.ta = E.movil ? 0 : .3; despertar(o);
  setTimeout(() => { if (o !== sobre && o !== elegido) { o.dom.classList.remove('vivo'); altura(o); } }, ms);
}
function guino() {
  if (document.hidden || abierto || elegido || sobre || toque || RM || !mesaALaVista()) return;
  // En móvil, solo entre los que están en pantalla
  const cand = RONDA.map(objDe).filter((o) => !E.movil || aLaVista.has(o));
  if (!cand.length) return;
  gracia(cand[turno++ % cand.length]);
  if (!E.movil && turno % 3 === 0) setTimeout(() => gracia(cand[(turno + 3) % cand.length], 1300), 420);
}
// Nada más asentarse, los objetos se presentan uno tras otro, de izquierda a derecha.
function ola() {
  if (RM || E.movil || document.hidden) return;
  [...objs].sort((a, b) => a.x - b.x).forEach((o, i) => setTimeout(() => gracia(o, 1350), i * 165));
}
setInterval(guino, 3400);
// Lo que no se ve no se anima: los parpadeos de fondo se paran fuera de la mesa.
new IntersectionObserver(([e]) => document.body.classList.toggle('mesa-fuera', !e.isIntersecting)).observe(mesa);

// ───────── Abrir y volver ─────────
const grandes = new Map();
function precargar(o) {
  if (grandes.has(o.id)) return grandes.get(o.id);
  const pr = Promise.all(o.def.piezas.map((p) => { const i = new Image(); i.src = `arte/g/${p.img}.webp`; return i.decode().catch(() => {}); }));
  grandes.set(o.id, pr);
  if (o.p.interior) import(`./proyectos/${o.id}.js`).catch(() => {});
  return pr;
}
const idDeRuta = () => { const m = location.hash.match(/^#\/proyecto\/([\w-]+)/); return m && porId(m[1]) ? m[1] : null; };
function ir(id) { if (abierto?.id === id) return; history.pushState({ p: id }, '', `#/proyecto/${id}`); abrir(id, true); }
function volver() { if (history.state?.p) history.back(); else { history.replaceState(null, '', location.pathname + location.search); cerrar(); } }
addEventListener('popstate', () => { const id = idDeRuta(); if (id) { if (abierto?.id !== id) abrir(id, false); } else if (abierto) cerrar(); });

function htmlProyecto(p) {
  const i = PROYECTOS.indexOf(p), sig = PROYECTOS[(i + 1) % PROYECTOS.length];
  const rot = p.interior && ROTULOS[p.demo];
  const ent = p.entradilla ? `${p.entradilla[0]} <em>${p.entradilla[1]}</em> ${p.entradilla[2]}` : p.linea;
  // La ficha: lo que quiere saber quien entra, sin bajar ni jugar
  const papel = p.bloques.find(([t]) => t === 'Qué hice yo');
  const ficha = [
    papel && ['Mi papel', papel[1]],
    p.stack.length && ['Hecho con', p.stack.join(' · ')],
    ['En cifras', p.cifras.map(([n, t]) => `<span><b>${n}</b> ${t}</span>`).join('')],
  ].filter(Boolean);
  return `
  <div class="pr-barra">
    <button type="button" class="pestana" data-volver><span aria-hidden="true">←</span> Volver a la mesa</button>
    ${rot ? `<p class="pr-rotulo"><span class="chip chip-lleno">${rot[0]}</span><span class="largo">${rot[1]}</span></p>` : ''}
    <span class="pr-pos">${p.n} / 0${PROYECTOS.length}</span>
  </div>
  <div class="pr-cabeza">
    <div class="pr-texto">
      <span class="pr-num" aria-hidden="true">${p.n}</span>
      <p class="pr-objeto">${p.objeto}</p>
      <h2 id="pr-titulo" tabindex="-1">${p.nombre}</h2>
      <p class="pr-entradilla">${ent}</p>
      <p class="pr-chips"><span class="chip">${p.tipo}</span><span class="chip">${p.estado}</span></p>
      ${p.web ? `<p class="pr-accion"><a class="boton boton-naranja boton-grande" href="${p.web[1]}" rel="noopener"><span class="boton-tapa">${p.web[0]} ↗</span></a></p>` : ''}
      <dl class="pr-ficha">${ficha.map(([t, x]) => `<div><dt>${t}</dt><dd>${x}</dd></div>`).join('')}</dl>
    </div>
    <div class="pr-pieza-hueco pr-hueco-${p.id}"><div class="pr-pieza" id="pr-pieza"></div></div>
  </div>
  <div class="pr-cuerpo">
    <div class="pr-bloques">${p.bloques.map(([t, x]) => `<section class="pr-bloque"><h3>${t}</h3><p>${x}</p></section>`).join('')}</div>
    <div class="pr-cifras">${p.cifras.map(([n, t]) => `<p class="pr-cifra"><b>${n}</b><span>${t}</span></p>`).join('')}</div>
    ${p.stack.length ? `<p class="pr-stack"><span class="sobre">Hecho con</span>${p.stack.map((s) => `<span class="chip">${s}</span>`).join('')}</p>` : ''}
    <div class="pr-otro">
      <button type="button" class="boton" data-volver><span class="boton-tapa">← Volver a la mesa</span></button>
      <button type="button" class="sig" data-sig="${sig.id}"><small>Siguiente · ${sig.n}</small><b>${sig.nombre} →</b></button>
    </div>
  </div>`;
}

// De dónde sale la pieza: el sitio del objeto en la mesa, en coordenadas de pantalla.
function origen(o, pieza, f) {
  const m = mesa.getBoundingClientRect(), r = pieza.getBoundingClientRect();
  const cx = m.left + E.ox + (o.x + o.w / 2) * E.k, cy = m.top + E.oy + (o.y + o.h / 2) * E.k;
  return `translate(${cx - (r.left + r.width / 2)}px, ${cy - (r.top + r.height / 2)}px) rotate(${o.r}deg) scale(${(o.s * E.k) / f})`;
}
const mesaALaVista = () => mesa.getBoundingClientRect().bottom > innerHeight * .5;

// Proyectos cuya pieza no ocupa todo el hueco. El periódico plegado mide lo que una página del abierto.
const AJUSTE = { wardux: (ancho, alto, estrecho) => (estrecho ? [ancho, alto] : [ancho, Math.min(alto, ancho * .647) * .94]) };
let interior = null, montando = null, pasando = false;
async function abrir(id, animar) {
  if (pasando) return; pasando = true;
  const o = objDe(id), p = o.p;
  elegir(null);
  if (montando) interior = await montando.catch(() => null);
  if (interior) { interior.quitar?.(); interior = null; }
  if (abierto && abierto !== o) abierto.dom.classList.remove('oculto');
  const veniaDeOtro = !!abierto;
  abierto = o;
  if (veniaDeOtro) { despiertos.delete(o); Object.assign(o, { x: o.casa.x, y: o.casa.y, r: o.casa.r, tx: o.casa.x, ty: o.casa.y, tr: o.casa.r, a: 0, ta: 0, vx: 0, vy: 0 }); pintar(o); }
  await Promise.race([precargar(o), espera(animar ? 500 : 60)]);
  hoja.innerHTML = htmlProyecto(p);
  hoja.classList.add('fuera'); hoja.classList.remove('bajada'); hoja.hidden = false; hoja.scrollTop = 0;
  document.documentElement.classList.add('con-proyecto'); document.body.classList.add('abierto');

  // La pieza, a su tamaño en la página
  const pieza = $('#pr-pieza'), hueco = pieza.parentElement, def = o.def;
  const estrecho = innerWidth <= 760;
  const cs = getComputedStyle(hueco);
  let anchoMax = hueco.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight), altoMax = estrecho ? innerHeight * .46 : innerHeight - 150;
  if (AJUSTE[id]) [anchoMax, altoMax] = AJUSTE[id](anchoMax, altoMax, estrecho);
  const tope = Math.min(...def.piezas.map((z) => (z.gmax || 1100) / z.w));
  const f = Math.min(anchoMax / def.w, altoMax / def.h, tope, estrecho ? 9 : (def.id === 'adivinadle' ? 9 : 3.4));
  pieza.style.width = `${def.w * f}px`; pieza.style.height = `${def.h * f}px`;
  const g = construir(def, true);
  g.cuerpo.className = 'grupo'; g.som.className = 'grupo';
  for (const c of [g.som, g.cuerpo]) { c.style.width = `${def.w}px`; c.style.height = `${def.h}px`; c.style.transform = `scale(${f})`; }
  g.som.style.transform = `translate(${6 * f}px, ${9 * f}px) scale(${f})`;
  pieza.append(g.som, g.cuerpo);

  // Los demás objetos se apartan de la mesa
  for (const q of objs) {
    if (q === o) continue;
    const dx = q.x + q.w / 2 - E.ancho / 2, dy = q.y + q.h / 2 - Math.min(E.alto, 900) / 2, d = Math.hypot(dx, dy) || 1;
    q.tx = q.x + (dx / d) * 1500; q.ty = q.y + (dy / d) * 1100; q.ta = 1; q.tr = q.casa.r + (dx > 0 ? 14 : -14); despertar(q);
  }
  o.dom.classList.add('oculto');
  const vuela = animar && !veniaDeOtro && mesaALaVista() && !RM;
  hoja.classList.toggle('opaca', !vuela);
  const anim = vuela
    ? pieza.animate([{ transform: origen(o, pieza, f) }, { transform: 'none' }], { duration: 820, easing: CURVA, fill: 'backwards' })
    : pieza.animate([{ opacity: 0, transform: 'translateY(26px) scale(.96)' }, { opacity: 1, transform: 'none' }], { duration: RM ? 1 : 520, easing: CURVA, fill: 'backwards' });
  await espera(vuela ? 300 : 80);
  hoja.classList.remove('fuera');
  await anim.finished.catch(() => {});
  hoja.classList.add('opaca');
  if (!p.interior) g.cuerpo.classList.add('vivo');
  $('#pr-titulo').focus({ preventScroll: true });
  pasando = false;
  if (p.interior && abierto === o) {
    try {
      const mod = await import(`./proyectos/${id}.js`);
      if (abierto === o && $('#pr-pieza') === pieza) {
        montando = mod.montar({ pieza, hueco, hoja, f, RM, estrecho });
        const dentro = await montando;
        montando = null;
        if (abierto === o && $('#pr-pieza') === pieza) interior = dentro; else dentro?.quitar?.();
      }
    } catch (err) { montando = null; console.error('No se pudo montar el interior', err); }
  }
}

async function cerrar() {
  if (!abierto || pasando) return; pasando = true;
  const o = abierto, pieza = $('#pr-pieza');
  hoja.classList.add('fuera');
  if (montando) interior = await montando.catch(() => null);
  if (interior) { await interior.guardar?.(); interior.quitar?.(); interior = null; }
  const vuela = mesaALaVista() && !RM && hoja.scrollTop < innerHeight * .6;
  if (vuela) hoja.classList.remove('opaca');
  objs.filter((q) => q !== o).forEach((q, i) => setTimeout(() => { q.tx = q.casa.x; q.ty = q.casa.y; q.tr = q.casa.r; q.ta = 0; despertar(q); }, RM ? 0 : 90 + i * 34));
  if (vuela) {
    const f = pieza.offsetWidth / o.def.w;
    await pieza.animate([{ transform: 'none' }, { transform: origen(o, pieza, f) }], { duration: 620, easing: 'cubic-bezier(.5, 0, .2, 1)', fill: 'forwards' }).finished.catch(() => {});
  } else await hoja.animate([{ opacity: 1 }, { opacity: 0 }], { duration: RM ? 1 : 240, fill: 'forwards' }).finished.catch(() => {});
  hoja.getAnimations().forEach((a) => a.cancel());
  o.dom.classList.remove('oculto');
  if (vuela) { o.a = .5; o.cae = true; o.ta = 0; despertar(o); }
  hoja.hidden = true; hoja.innerHTML = '';
  document.documentElement.classList.remove('con-proyecto'); document.body.classList.remove('abierto');
  abierto = null; pasando = false;
  o.dom.focus({ preventScroll: true });
}
// Al bajar por la hoja, la barra se queda en lo justo (volver y rótulo) para no pisar la demo
hoja.addEventListener('scroll', () => hoja.classList.toggle('bajada', hoja.scrollTop > 24), { passive: true });
hoja.addEventListener('click', (e) => {
  if (e.target.closest('[data-volver]')) volver();
  const s = e.target.closest('[data-sig]');
  if (s) { history.replaceState({ p: s.dataset.sig }, '', `#/proyecto/${s.dataset.sig}`); abrir(s.dataset.sig, false); }
});

// ───────── Arranque ─────────
montarMesa();
for (const o of objs) { asentar(o); pintar(o); vista.observe(o.cuerpo); }
let tRe = 0;
addEventListener('resize', () => { clearTimeout(tRe); tRe = setTimeout(() => { elegir(null); componer(); }, 80); });
(document.fonts?.ready || Promise.resolve()).then(() => {
  entrada();
  const id = idDeRuta();
  if (id) abrir(id, false);
});
