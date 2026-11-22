// «La estantería»: los proyectos son juegos de una colección inventada (consola Fragua, sello FM).
// Recorrido: la balda con los lomos → se saca una caja (gira, se ve la contraportada) → se abre →
// a la izquierda el librillo (el manual), a la derecha el disco → el disco entra en la consola →
// la tele se enciende con la demo (Adivinadle) o con el tráiler del juego.
// Estados: balda → caja → abierta → jugando. Cada paso entra en el historial del navegador.
import { PROYECTOS, porId } from './datos.js';
import { crearCaja, lomoHTML, colores } from './caja.js';
import { abrirManual } from './manual.js';
import { sonar, sonidoActivo, alternarSonido } from './sonido.js';
import './fps.js';

const $ = (s) => document.querySelector(s);
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const ESTRECHO = matchMedia('(max-width: 979px), (max-aspect-ratio: 11/10)');
const PERS = 2200;
const CURVA = 'cubic-bezier(.22, 1, .36, 1)';
const DURA = (ms) => (RM ? 1 : ms);
const espera = (ms) => new Promise((r) => setTimeout(r, RM ? 0 : ms));
const raiz = document.documentElement;

const lomos = $('#lomos'), capa = $('#capa'), velo = $('#velo'), sitio = $('#caja-sitio'), mandos = $('#mandos'), leyenda = $('#leyenda-caja');
const consola = $('#consola'), tele = $('#tele'), teleCuerpo = tele.querySelector('.tele-cuerpo'), etiqueta = $('#etiqueta');
const pantallaEl = $('#pantalla'), boca = $('#ranura-boca');
let pantallaMandos;

// ——— Partidas guardadas (la tarjeta de memoria): qué juegos has visto y tu récord en la demo ———
let partida = { vistos: [], record: {} };
try { partida = { ...partida, ...JSON.parse(localStorage.getItem('fragua-partida') || '{}') }; } catch { /* sin memoria */ }
function guardar() { try { localStorage.setItem('fragua-partida', JSON.stringify(partida)); } catch { /* nada */ } pintarMemoria(); }
function visto(id) { if (!partida.vistos.includes(id)) { partida.vistos.push(id); guardar(); } }
function pintarMemoria() {
  const n = partida.vistos.length;
  $('#memoria').innerHTML = n ? `Tarjeta de memoria · <b>${n}</b> de ${PROYECTOS.length} vistos` : 'Tarjeta de memoria · vacía';
  for (const l of lomos.querySelectorAll('.lomo[data-id]')) l.classList.toggle('visto', partida.vistos.includes(l.dataset.id));
}

// ——— La balda ———
function montarBalda() {
  lomos.innerHTML = PROYECTOS.map((p, i) => `<button type="button" class="lomo" data-id="${p.id}" style="${colores(p)};--i:${i}" tabindex="${i ? -1 : 0}" aria-label="${p.nombre}: ${p.linea} Sacar de la estantería">${lomoHTML(p)}</button>`).join('')
    + `<a class="lomo hueco" href="mailto:fmargardeveloper@gmail.com?subject=Un%20proyecto%20para%20el%20hueco" style="--i:9" tabindex="-1" aria-label="Hueco libre para el próximo proyecto: escríbeme"><span class="lomo-in"><span></span><span class="lomo-titulo">El próximo</span><span></span></span></a>`;
  $('#lista').innerHTML = PROYECTOS.map((p) => `<li style="--c:${p.color};--k:url('../arte/k/mini-${p.id}.webp')"><span class="mini" aria-hidden="true"></span><div><h3>${p.nombre}</h3><p>${p.linea}</p>
    <p class="estado"><span>${p.tipo} · ${p.estado}</span><button type="button" data-sacar="${p.id}">Sacarlo de la estantería</button></p></div></li>`).join('');
  pintarMemoria();
}

const PORDEFECTO = ['Elige un juego', 'Pasa por los lomos · pulsa uno para sacarlo'];
function rotular(p) {
  const [b, s] = p ? [p.nombre, `${p.linea} · ${p.estado}`] : PORDEFECTO;
  etiqueta.innerHTML = `<b>${b}</b><span>${s}</span>`;
}

const pedidas = new Set();
function precargar(id) { if (pedidas.has(id)) return; pedidas.add(id); const i = new Image(); i.src = `arte/k/${id}.webp`; }
lomos.addEventListener('pointerover', (e) => { const l = e.target.closest('.lomo[data-id]'); if (l) { rotular(porId(l.dataset.id)); precargar(l.dataset.id); } });
lomos.addEventListener('pointerleave', () => rotular(null));
lomos.addEventListener('focusin', (e) => { const l = e.target.closest('.lomo[data-id]'); rotular(l ? porId(l.dataset.id) : null); });
lomos.addEventListener('click', (e) => { const l = e.target.closest('.lomo[data-id]'); if (l) pedir(() => sacar(l.dataset.id)); });
lomos.addEventListener('keydown', (e) => {
  const todos = [...lomos.querySelectorAll('.lomo')], i = todos.indexOf(document.activeElement);
  if (i < 0) return;
  let j = i;
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') j = Math.min(todos.length - 1, i + 1);
  else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') j = Math.max(0, i - 1);
  else if (e.key === 'Home') j = 0;
  else if (e.key === 'End') j = todos.length - 1;
  else return;
  e.preventDefault();
  todos[i].tabIndex = -1; todos[j].tabIndex = 0; todos[j].focus();
});
$('#lista').addEventListener('click', (e) => {
  const b = e.target.closest('[data-sacar]'); if (!b) return;
  scrollTo({ top: 0, behavior: RM ? 'auto' : 'smooth' });
  setTimeout(() => pedir(() => sacar(b.dataset.sacar)), RM ? 0 : 450);
});

// ——— La cola: cada gesto espera a que termine el anterior; los repetidos no se apilan ———
let cola = Promise.resolve(), enCola = 0;
function pedir(fn) {
  if (enCola > 1) return;
  enCola++;
  cola = cola.then(fn).catch((e) => console.error(e)).finally(() => { enCola--; });
}

// ——— Estado ———
let estado = 'balda', actual = null, cp = null, caja = null, tapa = null, G = null;
let theta = 0, inclina = 0, desplaza = 0, escala = 1, manual = null, tv = null, discoVuela = null;
const NIVEL = { balda: 0, caja: 1, abierta: 2, jugando: 3 };

function geometria() {
  const vw = innerWidth, vh = innerHeight, estrecho = ESTRECHO.matches;
  if (estrecho) {
    const w = Math.min(vw - 96, (vh - 250) / 1.26, 330), h = w * 1.26;
    return { estrecho, w, h, d: h * 36 / 340, cx: vw / 2, cy: Math.max(30 + h / 2, (vh - 150) / 2), abierta: Math.min(1, (vw - 28) / (2 * w)) };
  }
  const u = Math.min(vw / 1440, vh / 900);
  const libre = vw - 420 * u - 44;
  const h = Math.min(vh * .64, 590, (libre / 2) * 1.26), w = h / 1.26;
  return { estrecho, w, h, d: h * 36 / 340, cx: 24 + libre / 2, cy: Math.min(vh * .47, vh - h / 2 - 130), abierta: 1 };
}

function transformaCaja() { return `translateX(${desplaza}px) rotateX(${inclina}deg) rotateY(${theta}deg)`; }
function aplicar() { caja.style.transform = transformaCaja(); cp.style.setProperty('--b', `${((theta % 360) + 360) % 360 / 180 * 60 - 20}%`); }

// Anima y deja el último fotograma puesto como estilo
async function anima(el, frames, opts) {
  const a = el.animate(frames, { ...opts, duration: DURA(opts.duration), fill: 'forwards' });
  await a.finished.catch(() => {});
  const ult = frames[frames.length - 1];
  for (const k of Object.keys(ult)) if (k !== 'offset' && k !== 'easing') el.style[k] = ult[k];
  a.cancel();
}

function colocarCaja() {
  G = geometria();
  Object.assign(cp.style, { left: `${G.cx - G.w / 2}px`, top: `${G.cy - G.h / 2}px`, width: `${G.w}px`, height: `${G.h}px` });
  cp.style.setProperty('--w', `${G.w}px`); cp.style.setProperty('--h', `${G.h}px`); cp.style.setProperty('--d', `${G.d}px`);
  tapa.style.transform = `translateZ(${G.d / 2}px) rotateY(${estado === 'abierta' || estado === 'jugando' ? -180 : 0}deg)`;
  if (estado === 'abierta' || estado === 'jugando') { desplaza = G.w / 2; escala = G.abierta; }
  cp.style.transform = escala !== 1 ? `scale(${escala})` : '';
  aplicar();
  colocarMandos();
}

function colocarMandos() {
  if (!G) return;
  const alto = G.h * escala;
  const y = G.cy + alto / 2 + (G.estrecho ? 18 : 26);
  mandos.style.transform = `translate(${G.cx}px, ${y}px) translateX(-50%)`;
  leyenda.style.transform = `translate(${G.cx}px, ${y + mandos.offsetHeight + 14}px) translateX(-50%)`;
}

function boton(m, texto, tecla, clase = '') {
  return `<button type="button" class="boton ${clase}" data-a="${m}"><span class="boton-tapa">${texto}${tecla ? ` <kbd>${tecla}</kbd>` : ''}</span></button>`;
}
function ponerMandos() {
  const s = `<button type="button" class="boton boton-oscuro boton-sonido" data-a="sonido" aria-pressed="${sonidoActivo()}"><span class="boton-tapa">Sonido: ${sonidoActivo() ? 'sí' : 'no'}</span></button>`;
  if (estado === 'caja') {
    mandos.innerHTML = boton('abrir', 'Abrir la caja', '↵', 'boton-luz') + boton('girar', theta % 360 ? 'Ver la carátula' : 'Darle la vuelta', 'F') + boton('devolver', 'Devolverlo', 'Esc', 'boton-oscuro') + s;
    leyenda.textContent = G.estrecho ? 'Arrastra la caja para girarla · toca para abrirla' : 'Arrastra la caja para girarla · ← → para cambiar de juego';
  } else if (estado === 'abierta') {
    mandos.innerHTML = boton('meter', 'Meter el disco', '↵', 'boton-luz') + boton('manual', 'Leer el manual', 'M') + boton('cerrar', 'Cerrar la caja', 'Esc', 'boton-oscuro') + s;
    leyenda.textContent = G.estrecho ? 'Toca el disco para meterlo en la consola' : 'Coge el disco y llévalo a la consola';
  }
  colocarMandos();
  mandos.classList.add('puestos'); leyenda.classList.add('puesta');
}
function quitarMandos() { mandos.classList.remove('puestos'); leyenda.classList.remove('puesta'); }

// ——— Sacar un juego de la balda ———
async function sacar(id, { historial = true, lado = 0 } = {}) {
  if (estado !== 'balda') return;
  const p = porId(id), lomo = lomos.querySelector(`.lomo[data-id="${id}"]`);
  actual = p; estado = 'caja'; theta = 90; inclina = 0; desplaza = 0; escala = 1;
  G = geometria();
  cp = crearCaja(p, G); caja = cp.querySelector('.caja'); tapa = cp.querySelector('.tapa');
  capa.hidden = false; sitio.append(cp);
  colocarCaja();
  raiz.classList.add('ocupado', 'con-caja');
  velo.classList.add('puesto');
  consola.classList.add('espera');
  visto(id);

  // La caja empieza justo donde está el lomo (girada 90°, enseñando el canto) y sale hacia ti
  const r = lomo.getBoundingClientRect();
  const s = r.height / (G.h * PERS / (PERS - G.w / 2));
  const dx = r.left + r.width / 2 - G.cx, dy = r.top + r.height / 2 - G.cy;
  lomo.classList.add('fuera');
  sonar.sacar();
  if (!lado) anima(velo, [{ opacity: 0 }, { opacity: 1 }], { duration: 500 });
  const desde = lado ? `translate(${lado * G.w * 1.4}px, 0) scale(.92)` : `translate(${dx}px, ${dy}px) scale(${s})`;
  const tiempos = { duration: 820, easing: 'linear' };
  await Promise.all([
    anima(cp, [
      { transform: desde, opacity: lado ? 0 : 1, easing: 'cubic-bezier(.3, 0, .3, 1)' },
      { transform: lado ? 'translate(0, 0) scale(.96)' : `translate(${dx}px, ${dy - G.h * s * .1}px) scale(${s * 1.04})`, opacity: 1, offset: .24, easing: CURVA },
      { transform: 'translate(0, 0) scale(1)', opacity: 1 },
    ], tiempos),
    anima(caja, [
      { transform: `translateX(0) rotateX(0deg) rotateY(${lado ? -lado * 50 : 90}deg)`, easing: 'cubic-bezier(.3, 0, .3, 1)' },
      { transform: `translateX(0) rotateX(0deg) rotateY(${lado ? -lado * 30 : 90}deg)`, offset: .24, easing: 'cubic-bezier(.2, .9, .25, 1.12)' },
      { transform: 'translateX(0px) rotateX(0deg) rotateY(0deg)' },
    ], tiempos),
  ]);
  theta = 0; aplicar(); cp.style.transform = '';
  if (historial) history.pushState({ nivel: 1, id }, '', `#${id}`);
  ponerMandos();
  mandos.querySelector('[data-a="abrir"]').focus({ preventScroll: true });
}

// ——— Devolverlo a la balda ———
async function devolver({ lado = 0 } = {}) {
  if (estado !== 'caja') return;
  quitarMandos();
  const lomo = lomos.querySelector(`.lomo[data-id="${actual.id}"]`);
  const r = lomo.getBoundingClientRect();
  const s = r.height / (G.h * PERS / (PERS - G.w / 2));
  const dx = r.left + r.width / 2 - G.cx, dy = r.top + r.height / 2 - G.cy;
  // gira por el camino corto hasta enseñar el lomo
  const t0 = ((theta % 360) + 360) % 360, destino = lado ? (t0 > 180 ? 360 : 0) + lado * 50 : (t0 > 270 ? 450 : 90);
  const tiempos = { duration: 640, easing: 'linear' };
  if (!lado) anima(velo, [{ opacity: 1 }, { opacity: 0 }], { duration: 560 });
  sonar.sacar();
  await Promise.all([
    anima(cp, [
      { transform: 'translate(0, 0) scale(1)', opacity: 1, easing: 'cubic-bezier(.5, 0, .4, 1)' },
      lado ? { transform: `translate(${-lado * G.w * 1.4}px, 0) scale(.92)`, opacity: 0 }
        : { transform: `translate(${dx}px, ${dy}px) scale(${s})`, opacity: 1 },
    ], tiempos),
    anima(caja, [
      { transform: `translateX(0px) rotateX(${inclina}deg) rotateY(${t0}deg)`, easing: 'cubic-bezier(.5, 0, .4, 1)' },
      { transform: `translateX(0px) rotateX(0deg) rotateY(${destino}deg)` },
    ], tiempos),
  ]);
  lomo.classList.remove('fuera');
  cp.remove(); cp = caja = tapa = null;
  estado = 'balda'; const fue = actual; actual = null; theta = 0;
  if (!lado) {
    capa.hidden = true; velo.classList.remove('puesto');
    raiz.classList.remove('ocupado', 'con-caja'); consola.classList.remove('espera');
    lomo.focus({ preventScroll: true });
    const todos = [...lomos.querySelectorAll('.lomo')]; todos.forEach((l) => { l.tabIndex = l === lomo ? 0 : -1; });
  }
  return fue;
}

// ← → con una caja fuera: se devuelve hacia un lado y sale la siguiente por el otro
async function cambiar(dir) {
  if (estado !== 'caja') return;
  const i = PROYECTOS.indexOf(actual), sig = PROYECTOS[(i + dir + PROYECTOS.length) % PROYECTOS.length];
  await devolver({ lado: -dir });
  await sacar(sig.id, { historial: false, lado: dir });
  history.replaceState({ nivel: 1, id: sig.id }, '', `#${sig.id}`);
}

// ——— Girar: botón, tecla o arrastre ———
async function girar() {
  if (estado !== 'caja') return;
  const desde = theta, hasta = Math.round(theta / 180) * 180 + 180;
  await anima(caja, [{ transform: transformaCaja() }, { transform: `translateX(${desplaza}px) rotateX(0deg) rotateY(${hasta}deg)` }], { duration: 760, easing: 'cubic-bezier(.3, 1.25, .45, 1)' });
  theta = ((hasta % 360) + 360) % 360; inclina = 0; aplicar();
  sonar.tecla();
  ponerMandos();
  mandos.querySelector('[data-a="girar"]').focus({ preventScroll: true });
  return desde;
}

let arrastre = null;
sitio.addEventListener('pointerdown', (e) => {
  if (!cp || !cp.contains(e.target)) return;
  if (estado === 'abierta') {
    const d = e.target.closest('.disco');
    if (d) cogerDisco(e, d);
    return;
  }
  if (estado !== 'caja' || enCola) return;
  arrastre = { x: e.clientX, y: e.clientY, t0: theta, movido: false, v: 0, ux: e.clientX, ut: performance.now(), id: e.pointerId };
  cp.setPointerCapture(e.pointerId);
});
sitio.addEventListener('pointermove', (e) => {
  if (!arrastre || e.pointerId !== arrastre.id) return;
  const dx = e.clientX - arrastre.x, dy = e.clientY - arrastre.y;
  if (!arrastre.movido && Math.hypot(dx, dy) < 6) return;
  arrastre.movido = true;
  const ahora = performance.now();
  arrastre.v = (e.clientX - arrastre.ux) / Math.max(1, ahora - arrastre.ut); arrastre.ux = e.clientX; arrastre.ut = ahora;
  theta = arrastre.t0 + dx * .5; inclina = Math.max(-12, Math.min(12, -dy * .06));
  aplicar();
});
function soltar(e) {
  if (!arrastre || e.pointerId !== arrastre.id) return;
  const a = arrastre; arrastre = null;
  if (!a.movido) {
    // un toque: delante abre la caja; detrás le da la vuelta
    pedir(() => (((theta % 360) + 360) % 360 === 180 ? girar() : abrir()));
    return;
  }
  const lanzado = theta + a.v * 220;
  const hasta = Math.round(lanzado / 180) * 180;
  pedir(async () => {
    await anima(caja, [{ transform: transformaCaja() }, { transform: `translateX(${desplaza}px) rotateX(0deg) rotateY(${hasta}deg)` }], { duration: 620, easing: 'cubic-bezier(.25, 1.35, .45, 1)' });
    theta = ((hasta % 360) + 360) % 360; inclina = 0; aplicar();
    ponerMandos();
  });
}
sitio.addEventListener('pointerup', soltar);
sitio.addEventListener('pointercancel', soltar);

// ——— Abrir y cerrar la caja ———
async function abrir({ historial = true } = {}) {
  if (estado !== 'caja') return;
  quitarMandos();
  if (theta % 360) {
    await anima(caja, [{ transform: transformaCaja() }, { transform: `translateX(0px) rotateX(0deg) rotateY(${theta > 180 ? 360 : 0}deg)` }], { duration: 520, easing: CURVA });
    theta = 0; aplicar();
  }
  cp.classList.add('abriendo');
  sonar.abrir();
  const dz = G.d / 2;
  await Promise.all([
    anima(tapa, [
      { transform: `translateZ(${dz}px) rotateY(0deg)`, easing: 'cubic-bezier(.6, 0, .4, 1)' },
      { transform: `translateZ(${dz}px) rotateY(-14deg)`, offset: .12, easing: 'cubic-bezier(.3, 0, .2, 1)' },
      { transform: `translateZ(${dz}px) rotateY(-180deg)` },
    ], { duration: 900, easing: 'linear' }),
    anima(caja, [{ transform: 'translateX(0px) rotateX(0deg) rotateY(0deg)' }, { transform: `translateX(${G.w / 2}px) rotateX(0deg) rotateY(0deg)` }], { duration: 900, easing: 'cubic-bezier(.5, 0, .2, 1)' }),
    G.abierta < 1 ? anima(cp, [{ transform: 'scale(1)' }, { transform: `scale(${G.abierta})` }], { duration: 900, easing: 'cubic-bezier(.5, 0, .2, 1)' }) : null,
  ]);
  desplaza = G.w / 2; escala = G.abierta;
  cp.classList.remove('abriendo'); cp.classList.add('abierta');
  estado = 'abierta';
  if (historial) history.pushState({ nivel: 2, id: actual.id }, '', `#${actual.id}`);
  ponerMandos();
  mandos.querySelector('[data-a="meter"]').focus({ preventScroll: true });
}

async function cerrarCaja() {
  if (estado !== 'abierta') return;
  quitarMandos();
  if (manual) { await manual.cerrar(); }
  cp.classList.remove('abierta'); cp.classList.add('abriendo');
  const dz = G.d / 2;
  await Promise.all([
    anima(tapa, [{ transform: `translateZ(${dz}px) rotateY(-180deg)`, easing: 'cubic-bezier(.5, 0, .3, 1)' }, { transform: `translateZ(${dz}px) rotateY(0deg)` }], { duration: 640 }),
    anima(caja, [{ transform: transformaCaja() }, { transform: 'translateX(0px) rotateX(0deg) rotateY(0deg)' }], { duration: 640, easing: 'cubic-bezier(.5, 0, .3, 1)' }),
    escala !== 1 ? anima(cp, [{ transform: `scale(${escala})` }, { transform: 'scale(1)' }], { duration: 640, easing: 'cubic-bezier(.5, 0, .3, 1)' }) : null,
  ]);
  sonar.cerrar();
  cp.classList.remove('abriendo');
  desplaza = 0; escala = 1; cp.style.transform = '';
  estado = 'caja';
  ponerMandos();
  mandos.querySelector('[data-a="abrir"]').focus({ preventScroll: true });
}

// ——— El manual ———
function leerManual() {
  if (estado !== 'abierta' || manual) return;
  const origen = cp.querySelector('.librillo');
  quitarMandos();
  manual = abrirManual(actual, {
    origen, RM, estrecho: G.estrecho,
    alCerrar: () => { manual = null; if (estado === 'abierta') { ponerMandos(); mandos.querySelector('[data-a="manual"]')?.focus({ preventScroll: true }); } },
  });
}

// ——— El disco: se coge, se arrastra y entra por la ranura ———
function ranura() {
  const r = consola.getBoundingClientRect();
  return { x0: r.left + r.width * .09, x1: r.left + r.width * .55, y: r.top + r.height * .465, visible: r.bottom > 0 && r.top < innerHeight };
}
// dónde se pone un disco de lado «base» para quedar justo encima de la ranura (y cuánto encoge)
function sobreRanura(s, base) {
  const dd = (s.x1 - s.x0) * .92;
  return { x: (s.x0 + s.x1) / 2 - base / 2, y: s.y - dd / 2 - 6 - base / 2, dd, k: dd / base };
}

function nuevoDiscoVuela(rect) {
  const el = document.createElement('div');
  el.className = 'disco-vuela';
  el.innerHTML = `<img src="arte/d/${actual.id}.webp" alt="">`;
  Object.assign(el.style, { width: `${rect.width}px`, height: `${rect.height}px`, transform: `translate(${rect.left}px, ${rect.top}px)` });
  document.body.append(el);
  return el;
}

function cogerDisco(e, d) {
  if (enCola || discoVuela) return;
  const r = d.getBoundingClientRect();
  const a = { x: e.clientX, y: e.clientY, movido: false, id: e.pointerId, r };
  d.setPointerCapture(e.pointerId);
  const mover = (ev) => {
    if (ev.pointerId !== a.id) return;
    const dx = ev.clientX - a.x, dy = ev.clientY - a.y;
    if (!a.movido) {
      if (Math.hypot(dx, dy) < 6) return;
      a.movido = true;
      discoVuela = nuevoDiscoVuela(r);
      d.closest('.bandeja').querySelector('.disco').classList.add('cogido');
      sonar.coger();
      quitarMandos();
    }
    discoVuela.style.transform = `translate(${r.left + dx}px, ${r.top + dy}px) scale(1.06) rotate(${dx * .2}deg)`;
    const s = ranura();
    const cerca = Math.hypot(ev.clientX - (s.x0 + s.x1) / 2, ev.clientY - s.y) < Math.max(150, r.width * .9);
    consola.classList.toggle('cerca', cerca);
    a.cerca = cerca; a.dx = dx; a.dy = dy;
  };
  const fin = (ev) => {
    if (ev.pointerId !== a.id) return;
    d.removeEventListener('pointermove', mover); d.removeEventListener('pointerup', fin); d.removeEventListener('pointercancel', fin);
    consola.classList.remove('cerca');
    if (!a.movido) { pedir(() => meterDisco()); return; }
    if (a.cerca && ev.type === 'pointerup') pedir(() => meterDisco({ desde: true }));
    else {
      // vuelve a su eje
      pedir(async () => {
        await anima(discoVuela, [{ transform: discoVuela.style.transform }, { transform: `translate(${r.left}px, ${r.top}px) scale(1) rotate(0deg)` }], { duration: 420, easing: CURVA });
        discoVuela.remove(); discoVuela = null;
        cp.querySelector('.disco').classList.remove('cogido');
        sonar.coger();
        ponerMandos();
      });
    }
  };
  d.addEventListener('pointermove', mover); d.addEventListener('pointerup', fin); d.addEventListener('pointercancel', fin);
}

async function meterDisco({ desde = false, historial = true } = {}) {
  if (estado !== 'abierta') return;
  if (manual) await manual.cerrar();
  quitarMandos();
  const discoCaja = cp.querySelector('.disco');
  if (!discoVuela) {
    discoVuela = nuevoDiscoVuela(discoCaja.getBoundingClientRect());
    discoCaja.classList.add('cogido');
    sonar.coger();
  }
  estado = 'jugando';
  const r0 = discoVuela.getBoundingClientRect(), base = parseFloat(discoVuela.style.width);
  const s = ranura();
  const f = s.visible ? sobreRanura(s, base) : { x: innerWidth / 2 - base / 2, y: innerHeight + 40, dd: base / 2, k: .5 };
  // 1) vuela girando hasta encima de la ranura
  await anima(discoVuela, [
    { transform: discoVuela.style.transform || `translate(${r0.left}px, ${r0.top}px)` },
    { transform: `translate(${f.x}px, ${f.y}px) scale(${f.k}) rotate(300deg)` },
  ], { duration: desde ? 380 : 660, easing: CURVA });
  // 2) se pone de canto y entra: lo que pasa por debajo de la ranura queda tapado
  if (s.visible) {
    Object.assign(boca.style, { width: `${innerWidth}px`, height: `${s.y}px` });
    boca.append(discoVuela);
    await anima(discoVuela, [
      { transform: `translate(${f.x}px, ${f.y}px) scale(${f.k}) perspective(${base * 3}px) rotateX(0deg) rotate(300deg)` },
      { transform: `translate(${f.x}px, ${f.y + f.dd * .2}px) scale(${f.k}) perspective(${base * 3}px) rotateX(78deg) rotate(300deg)`, offset: .4 },
      { transform: `translate(${f.x}px, ${f.y + f.dd * 1.1}px) scale(${f.k}) perspective(${base * 3}px) rotateX(80deg) rotate(300deg)` },
    ], { duration: 520, easing: 'cubic-bezier(.4, 0, .6, 1)' });
  }
  discoVuela.remove(); discoVuela = null;
  consola.classList.remove('espera'); consola.classList.add('leyendo');
  sonar.leer();
  if (historial) history.pushState({ nivel: 3, id: actual.id }, '', `#${actual.id}`);
  await espera(650);
  await encenderTele();
}

function cristalDestino() {
  const vw = innerWidth, vh = innerHeight;
  if (G.estrecho || getComputedStyle(tele).display === 'none') return { left: 0, top: 0, width: vw, height: vh - 70 };
  // la tele entera tiene que caber, con los mandos debajo: el cristal es el 88,4 % de su ancho y el 69,7 % de su alto
  const c = tele.querySelector('.tele-cristal').getBoundingClientRect(), t = teleCuerpo.getBoundingClientRect();
  const ratio = c.width / c.height, fw = c.width / t.width, fh = c.height / t.height;
  const h = Math.min((vh - 96) * fh, ((vw - 48) * fw) / ratio), w = h * ratio;
  const teleAlto = h / fh, arriba = Math.max(12, (vh - 72 - teleAlto) / 2);
  return { left: (vw - w) / 2, top: arriba + (c.top - t.top) / t.height * teleAlto, width: w, height: h, pie: arriba + teleAlto + 14 };
}

let zoomTele = null;
async function encenderTele() {
  const p = actual, dest = cristalDestino();
  // la caja se aparta y la tele viene al centro
  anima(cp, [{ opacity: 1 }, { opacity: 0 }], { duration: 380 });
  if (!G.estrecho && getComputedStyle(tele).display !== 'none') {
    const c = tele.querySelector('.tele-cristal').getBoundingClientRect(), tr = teleCuerpo.getBoundingClientRect();
    const k = dest.width / c.width;
    teleCuerpo.style.transformOrigin = `${c.left - tr.left + c.width / 2}px ${c.top - tr.top + c.height / 2}px`;
    zoomTele = `translate(${dest.left + dest.width / 2 - (c.left + c.width / 2)}px, ${dest.top + dest.height / 2 - (c.top + c.height / 2)}px) scale(${k})`;
    tele.classList.add('grande');
    await anima(teleCuerpo, [{ transform: 'none' }, { transform: zoomTele }], { duration: 720, easing: 'cubic-bezier(.65, 0, .25, 1)' });
  }
  Object.assign(pantallaEl.style, { left: `${dest.left}px`, top: `${dest.top}px`, width: `${dest.width}px`, height: `${dest.height}px` });
  pantallaMandos.style.cssText = G.estrecho ? 'left:0;right:0;bottom:0;height:70px;justify-content:center;align-items:center;background:#050607' : `left:50%;transform:translateX(-50%);top:${dest.pie}px`;
  pantallaMandos.querySelector('[data-a="sonido"] .boton-tapa').textContent = `Sonido: ${sonidoActivo() ? 'sí' : 'no'}`;
  const { encender } = await import('./pantalla.js');
  if (estado !== 'jugando' || actual !== p) return;
  consola.classList.remove('leyendo');
  tv = await encender(p, {
    el: pantallaEl, mandos: pantallaMandos, RM, guardado: partida.record[p.id],
    alResolver: (n) => { if (!partida.record[p.id] || n < partida.record[p.id]) { partida.record[p.id] = n; guardar(); } },
  });
  if (tv && estado === 'jugando') tv.foco();
}

async function sacarDisco() {
  if (estado !== 'jugando') return;
  if (tv) { await tv.apagar(); tv = null; } else { pantallaEl.hidden = true; pantallaMandos.hidden = true; }
  consola.classList.remove('leyendo');
  if (zoomTele) {
    await anima(teleCuerpo, [{ transform: zoomTele }, { transform: 'none' }], { duration: 620, easing: 'cubic-bezier(.65, 0, .25, 1)' });
    teleCuerpo.style.transform = ''; tele.classList.remove('grande'); zoomTele = null;
  }
  // el disco sale de la ranura y vuelve a la caja
  const s = ranura(), discoCaja = cp.querySelector('.disco');
  anima(cp, [{ opacity: 0 }, { opacity: 1 }], { duration: 380 });
  const dest = discoCaja.getBoundingClientRect();
  const el = nuevoDiscoVuela(dest), f = sobreRanura(s, dest.width);
  el.style.transform = `translate(${f.x}px, ${f.y}px) scale(${f.k})`;
  if (s.visible) {
    Object.assign(boca.style, { width: `${innerWidth}px`, height: `${s.y}px` });
    boca.append(el);
    await anima(el, [
      { transform: `translate(${f.x}px, ${f.y + f.dd * 1.1}px) scale(${f.k}) perspective(${dest.width * 3}px) rotateX(80deg)` },
      { transform: `translate(${f.x}px, ${f.y}px) scale(${f.k}) perspective(${dest.width * 3}px) rotateX(0deg)` },
    ], { duration: 420, easing: 'cubic-bezier(.2, .8, .3, 1)' });
    document.body.append(el);
  }
  await anima(el, [
    { transform: `translate(${f.x}px, ${f.y}px) scale(${f.k})` },
    { transform: `translate(${dest.left}px, ${dest.top}px) scale(1) rotate(-200deg)` },
  ], { duration: 560, easing: CURVA });
  el.remove();
  discoCaja.classList.remove('cogido');
  sonar.coger();
  estado = 'abierta';
  consola.classList.add('espera');
  ponerMandos();
  mandos.querySelector('[data-a="meter"]').focus({ preventScroll: true });
}

// ——— Mandos y teclado ———
function accion(a) {
  if (a === 'sonido') {
    const on = alternarSonido();
    for (const b of document.querySelectorAll('[data-a="sonido"]')) { b.setAttribute('aria-pressed', on); b.querySelector('.boton-tapa').textContent = `Sonido: ${on ? 'sí' : 'no'}`; }
    if (on) sonar.tecla();
    return;
  }
  if (a === 'abrir') pedir(() => abrir());
  else if (a === 'girar') pedir(() => girar());
  else if (a === 'devolver' || a === 'cerrar' || a === 'sacar') atras();
  else if (a === 'meter') pedir(() => meterDisco());
  else if (a === 'manual') pedir(() => leerManual());
}
mandos.addEventListener('click', (e) => { const b = e.target.closest('[data-a]'); if (b) accion(b.dataset.a); });
sitio.addEventListener('click', (e) => {
  if (estado === 'abierta' && e.target.closest('.librillo')) pedir(() => leerManual());
});
sitio.addEventListener('keydown', (e) => {
  if ((e.key === 'Enter' || e.key === ' ') && e.target.closest('.disco')) { e.preventDefault(); pedir(() => meterDisco()); }
});
velo.addEventListener('click', () => { if (estado === 'caja' || estado === 'abierta') atras(); });

// Ir hacia atrás siempre pasa por el historial, para que el botón «atrás» del navegador haga lo mismo
function atras() {
  if (history.state?.nivel > 0) history.back();
  else pedir(() => bajarA(NIVEL[estado] - 1));
}
async function bajarA(n) {
  while (NIVEL[estado] > n) {
    const antes = estado;
    if (estado === 'jugando') await sacarDisco();
    else if (estado === 'abierta') await cerrarCaja();
    else if (estado === 'caja') await devolver();
    if (estado === antes) break;
  }
}
addEventListener('popstate', (e) => {
  const n = e.state?.nivel ?? 0;
  if (n < NIVEL[estado]) pedir(() => bajarA(n));
  else if (n > NIVEL[estado] && e.state?.id) {
    // «adelante» del navegador: se rehace el recorrido sin volver a apuntarlo
    pedir(async () => {
      if (estado === 'balda') await sacar(e.state.id, { historial: false });
      if (n >= 2 && estado === 'caja') await abrir({ historial: false });
      if (n >= 3 && estado === 'abierta') await meterDisco({ historial: false });
    });
  }
});

document.addEventListener('keydown', (e) => {
  if (e.metaKey || e.ctrlKey || e.altKey || manual) return;
  const k = e.key;
  if (estado === 'jugando') {
    if (k === 'Escape') { e.preventDefault(); atras(); }
    else if (tv && (k === 'Enter' || k === ' ')) tv.saltar();
    return;
  }
  if (estado === 'caja') {
    if (k === 'Escape') { e.preventDefault(); atras(); }
    else if (k === 'f' || k === 'F') { e.preventDefault(); pedir(() => girar()); }
    else if (k === 'ArrowRight') { e.preventDefault(); pedir(() => cambiar(1)); }
    else if (k === 'ArrowLeft') { e.preventDefault(); pedir(() => cambiar(-1)); }
  } else if (estado === 'abierta') {
    if (k === 'Escape') { e.preventDefault(); atras(); }
    else if (k === 'm' || k === 'M') { e.preventDefault(); pedir(() => leerManual()); }
  }
  // Tab no sale de la caja mientras está fuera
  if (k === 'Tab' && (estado === 'caja' || estado === 'abierta')) {
    const vis = [...(estado === 'abierta' ? cp.querySelectorAll('.librillo, .disco:not(.cogido)') : []), ...mandos.querySelectorAll('button')];
    if (!vis.length) return;
    const i = vis.indexOf(document.activeElement);
    if (e.shiftKey && i <= 0) { e.preventDefault(); vis[vis.length - 1].focus({ preventScroll: true }); }
    else if (!e.shiftKey && (i === vis.length - 1 || i < 0)) { e.preventDefault(); vis[0].focus({ preventScroll: true }); }
  }
});

// Al cambiar el tamaño de la ventana se recoloca todo lo que esté fuera de su sitio
let reloj = 0;
addEventListener('resize', () => {
  cancelAnimationFrame(reloj);
  reloj = requestAnimationFrame(() => {
    if (!cp || enCola) return;
    colocarCaja();
    if (estado === 'jugando' && pantallaEl && !pantallaEl.hidden) {
      const dest = cristalDestino();
      Object.assign(pantallaEl.style, { left: `${dest.left}px`, top: `${dest.top}px`, width: `${dest.width}px`, height: `${dest.height}px` });
      if (zoomTele) {
        teleCuerpo.style.transform = ''; tele.classList.remove('grande');
        const c = tele.querySelector('.tele-cristal').getBoundingClientRect(), tr = teleCuerpo.getBoundingClientRect();
        teleCuerpo.style.transformOrigin = `${c.left - tr.left + c.width / 2}px ${c.top - tr.top + c.height / 2}px`;
        zoomTele = `translate(${dest.left + dest.width / 2 - (c.left + c.width / 2)}px, ${dest.top + dest.height / 2 - (c.top + c.height / 2)}px) scale(${dest.width / c.width})`;
        teleCuerpo.style.transform = zoomTele; tele.classList.add('grande');
      }
      pantallaMandos.style.top = G.estrecho ? '' : `${dest.pie}px`;
    }
  });
});

// ——— Arranque ———
pantallaMandos = document.createElement('div');
pantallaMandos.className = 'pantalla-mandos'; pantallaMandos.hidden = true;
pantallaMandos.innerHTML = boton('sacar', 'Sacar el disco', 'Esc', 'boton-luz') + '<button type="button" class="boton boton-oscuro" data-a="sonido"><span class="boton-tapa">Sonido</span></button>';
pantallaMandos.addEventListener('click', (e) => { const b = e.target.closest('[data-a]'); if (b) accion(b.dataset.a); });
document.body.append(pantallaMandos);

montarBalda();
rotular(null);
// si alguien llega con #adivinadle, se le saca ese juego
const pedido = location.hash.slice(1);
history.replaceState({ nivel: 0 }, '', location.pathname + location.search);
requestAnimationFrame(() => document.body.classList.remove('cargando'));
if (pedido && porId(pedido)) setTimeout(() => pedir(() => sacar(pedido)), RM ? 0 : 900);
// el resto del arte se pide cuando el navegador está libre, para que abrir vaya al instante
const precarga = () => {
  for (const p of PROYECTOS) { const i = new Image(); i.src = `arte/d/${p.id}.webp`; }
  import('./pantalla.js');
};
('requestIdleCallback' in window) ? requestIdleCallback(precarga, { timeout: 3000 }) : setTimeout(precarga, 2000);
