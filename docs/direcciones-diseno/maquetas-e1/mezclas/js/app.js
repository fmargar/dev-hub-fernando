// La mesa de mezclas, con el kit E1. Un estudio: los nueve proyectos son los nueve canales de la mesa, cada uno con su
// cinta rotulada y la tapa del fader de su color. Se sube un fader (arrastrándolo, con su muelle, o con un clic) y el
// canal se abre: su cinta se enciende, su medidor baila y sale su ficha; «su hoja de pista» cuenta qué es, qué hice yo
// y el resultado; «en el monitor» lo pone en la pantalla grande del estudio, con su demo (Adivinadle) o su tráiler.
// «Solo» y «silencio» filtran los canales como en una mesa de verdad. El décimo canal, sin rotular, espera al siguiente.
//
// Como en las otras maquetas, todo sale de unos pocos valores con muelles (un valor por fader y la cámara): bajar un
// fader a mitad, o entrar por un enlace directo, dejan siempre la mesa en un estado posible. No hay sonido.
import { montarEscena, THREE, RM } from '../../../kit-e1/js/motor.js';
import { Muelles } from '../../../kit-e1/js/muelles.js';
import { montarRutas } from '../../../kit-e1/js/rutas.js';
import * as C from '../../../kit-e1/js/coleccion.js';
import { PROYECTOS, porId } from '../../../kit-e1/js/datos.js';
import { encender, apagarYa } from '../../../kit-e1/js/pantalla.js';
import { ajustar, desajustar } from '../../../kit-e1/js/proyectar.js';
import * as I from './impresos.js';

const $ = (s) => document.querySelector(s);
const movil = () => innerWidth < 760;
const apilado = () => !movil() && innerWidth < 1100;
const PASOS = [
  { id: '', boton: 'El canal', dice: 'El canal, abierto: su fader arriba y su medidor en marcha. Bájalo (o arrastra otro) para cambiar.' },
  { id: 'ficha', boton: 'Su hoja de pista', dice: 'La hoja de pista: qué es, qué hice yo, el resultado y con qué está hecho.' },
  { id: 'monitor', boton: 'En el monitor', dice: '' },
];
const IDS = PROYECTOS.map((p) => p.id);
const ARRIBA = 0.72, ASOMA = 0.1;                // dónde se queda el fader de un canal abierto (el 0 de la escala) y cuánto asoma al pasar

// ── Arranque ──
await C.cargar();
let seleccion = -1, rutas = null, encima = -1;
const S = await montarEscena({
  plato: $('#plato'), luz: 'luz/', fondo: '#15161a', exposicion: 1.25, pixelesEnMarcha: 110000,
  etiqueta: 'Un estudio de grabación: una mesa de mezclas con diez canales, cada uno con su fader y su medidor, y detrás un monitor grande entre dos altavoces',
  material(n, { textura, datos }) {
    if (n === 'cara') return { luz: 'cara', mapa: textura('cara', I.tam(datos)), brillo: 0.05 };
    if (n.startsWith('medidor_')) return { mapa: textura(`med${n.slice(8)}`, I.TAM_MEDIDOR) };
    if (n === 'pantalla_cara') return { color: '#000000', emite: '#0b0d11' };
    if (n.startsWith('boton_')) return { luz: 'mesa', brillo: 0.12 };
    if (n.startsWith('fader_')) return { luz: 'faders', brillo: 0.25 };
    if (n.startsWith('mesa_metal')) return { luz: 'mesa', brillo: 0.45 };
    if (n.startsWith('mesa_')) return { luz: 'mesa', brillo: 0.12 };
    if (n.startsWith('estudio_')) return { luz: 'estudio', brillo: 0.06 };
    return { luz: 'pared' };
  },
});
const { nodo, lienzos, texturas } = S;
const D = S.datos, M = D.monitor, F = D.fader, N = D.orden.length;

// de las coordenadas de la cara de la mesa (x, y hacia el fondo, z fuera de la cara) a las del estudio
const SEN = Math.sin(THREE.MathUtils.degToRad(D.inclina)), COS = Math.cos(THREE.MathUtils.degToRad(D.inclina));
const mundo = (x, y, z = 0) => [D.pivote[0] + x, D.pivote[1] + y * COS - z * SEN, D.pivote[2] + y * SEN + z * COS];
const centro = (i) => D.x0 + D.paso * (i + 0.5);
const enPantalla = (x, y, z = 0) => S.aPantalla(...mundo(x, y, z));

// cada canal: el vacío de su fader, sus materiales y los de sus botones
const CAN = D.orden.map((id, i) => {
  const raiz = nodo[`fader_${i}`], mats = [];
  raiz.traverse((o) => { if (o.isMesh) mats.push(o.material); });
  return { id, i, raiz, mats, s: nodo[`boton_s_${i}`].material, m: nodo[`boton_m_${i}`].material, nivel: 0, pico: 0, pintado: -1, fase: i * 1.7 };
});
// la pared del fondo y los muebles salen del horno más oscuros de lo que pide la página: se les sube la luz aquí
for (const [n, k] of [['pared_unida', 2.6], ['estudio_unido', 1.5]]) nodo[n]?.traverse((o) => { if (o.isMesh) o.material.uniforms.atenua.value = k; });
const SALIDA = [{ nivel: 0, pico: 0, pintado: -1 }, { nivel: 0, pico: 0, pintado: -1 }];
for (const lz of Object.values(texturas)) { lz.magFilter = THREE.LinearFilter; }

// ── Solo y silencio ──
const solos = new Set(), mudos = new Set();
const apagado = (i) => mudos.has(i) || (solos.size > 0 && !solos.has(i));
const filtro = $('.filtro');
function pintarCara() {
  I.cara(lienzos.cara, D, { abierto: seleccion >= 0 ? D.orden.indexOf(PROYECTOS[seleccion].id) : -1, apagado, solo: (i) => solos.has(i), mudo: (i) => mudos.has(i) });
  texturas.cara.needsUpdate = true;
  for (const c of CAN) {
    c.s.uniforms.emite.value.set(solos.has(c.i) ? '#b98a00' : '#000000');
    c.m.uniforms.emite.value.set(mudos.has(c.i) ? '#b3261e' : '#000000');
    const a = apagado(c.i) ? 0.32 : 1; for (const m of c.mats) m.uniforms.atenua.value = a;
  }
  const n = IDS.filter((id) => !apagado(D.orden.indexOf(id))).length;
  filtro.hidden = !(solos.size || mudos.size);
  filtro.querySelector('span').textContent = n === 1 ? 'Suena un canal de nueve' : `Suenan ${n} canales de nueve`;
  for (const b of capa.querySelectorAll('.sm')) b.setAttribute('aria-pressed', (b.dataset.sm === 's' ? solos : mudos).has(+b.dataset.i));
  S.pedirDibujo();
}
function alternar(conjunto, i) { if (conjunto.has(i)) conjunto.delete(i); else conjunto.add(i); pintarCara(); arrancarBaile(); }

// ── Las cámaras ──
const bordeIzq = (sel) => { const h = document.querySelector(sel); return h.offsetLeft + h.offsetWidth; };
function huecoBajo(sel, abajo = innerHeight - 24) {
  const h = document.querySelector(sel), arriba = h.offsetTop + h.offsetHeight + 12;
  return [innerWidth - 24, Math.max(160, abajo - arriba), (arriba + abajo) / 2];
}
function camVista() {
  const c = { x: 0, y: 1.6, z: 4.4, dist: 46, inclina: 26, gira: 0, alto: 13.6, ancho: 22.6 };
  // en vertical, la mesa llena el ancho (el monitor asoma detrás): los faders son lo que se toca
  if (movil()) { const [w, h, yc] = huecoBajo('.heroe'); return { ...c, y: 0.4, z: 2.4, inclina: 38, alto: 9.4, ancho: 18.2, px: 0.5, py: yc / innerHeight, util: [w + 16, h] }; }
  if (apilado()) { const [w, h, yc] = huecoBajo('.heroe'); return innerHeight > innerWidth ? { ...c, alto: 12.6, ancho: 19, px: 0.5, py: yc / innerHeight, util: [w - 24, h] } : { ...c, y: 0.4, z: 2.4, inclina: 38, alto: 9.4, ancho: 18.4, px: 0.5, py: yc / innerHeight, util: [w - 24, h] }; }
  const hd = bordeIzq('.heroe');
  return { ...c, px: (hd + innerWidth) / 2 / innerWidth, py: 0.52, util: [innerWidth - hd - 48, innerHeight - 110] };
}
function camCanal(id, paso) {
  // más cerca y más de arriba, centrada entre el canal y el centro de la mesa (para que se vea a quién acompaña)
  const i = D.orden.indexOf(id), cx = centro(i) * 0.72, p = mundo(cx, 3.6);
  const c = { x: p[0], y: p[1], z: p[2], dist: 30, inclina: 44, gira: 0, alto: 9.2, ancho: 13.4 };
  if (movil()) {
    if (paso === 'ficha') { const top = 62, bot = innerHeight * 0.5; return { ...c, x: mundo(centro(i) * 0.82, 0)[0], ancho: 7, alto: 8.2, px: 0.5, py: (top + bot) / 2 / innerHeight, util: [innerWidth - 24, bot - top - 8] }; }
    const [w, h, yc] = huecoBajo('.ficha-lateral', innerHeight - 84); return { ...c, x: mundo(centro(i) * 0.82, 0)[0], ancho: 7, alto: 8.6, px: 0.5, py: yc / innerHeight, util: [w, h] };
  }
  // en la tableta de pie queda poco ancho junto al papel: se acerca al canal, como en el móvil
  if (innerHeight > innerWidth) Object.assign(c, { x: mundo(centro(i) * 0.82, 0)[0], ancho: 7.4, alto: 8.8 });
  if (paso === 'ficha') { const libre = $('.cajetin').offsetLeft; return { ...c, px: libre / 2 / innerWidth, py: 0.5, util: [libre - 60, innerHeight - 190] }; }
  const hd = bordeIzq('.ficha-lateral');
  return { ...c, px: (hd + innerWidth) / 2 / innerWidth, py: 0.5, util: [innerWidth - hd - 60, innerHeight - 190] };
}
function camMonitor() {
  if (movil()) return { x: M.x, y: M.y, z: M.z, dist: 26, inclina: 4, gira: 0, alto: M.alto + 1.2, ancho: M.ancho + 1.4, px: 0.5, py: 0.4, util: [innerWidth, innerHeight - 140] };
  // el monitor, nunca bajo el recorrido (que crece con los mandos al encenderlo): si sube más, el encuadre se acorta
  const alto = innerHeight - 200, arriba = 0.47 * innerHeight - alto / 2;
  const tope = innerHeight - recorrido.offsetHeight - (mandos.hidden ? 58 : 0) - 18 + 40, bajo = Math.min(arriba + alto, tope);
  return { x: M.x, y: M.y, z: M.z, dist: 26, inclina: 4, gira: 0, alto: M.alto + 0.7, ancho: M.ancho + 1.0, px: 0.5, py: (arriba + bajo) / 2 / innerHeight, util: [innerWidth - 80, bajo - arriba] };
}
function camaraDe(ruta) {
  const [id, paso = ''] = ruta.split('/');
  if (id === 'estudio') return camVista();
  if (paso === 'monitor') return camMonitor();
  return camCanal(id, paso);
}
const faders0 = Object.fromEntries(CAN.map((c) => [`f${c.i}`, 0]));
const muelles = new Muelles({ ...faders0, cam: camVista() }, { rigidez: 190, amort: 17 }).ritmo('cam', 110, 20);   // los faders, con un punto de rebote

function colocar(v) {
  for (const c of CAN) c.raiz.position.z = -(F.y0 + Math.min(1.04, Math.max(-0.03, v[`f${c.i}`])) * F.rec);
  const { util, ...cam } = v.cam;
  S.encuadrar(cam, { util: util ?? [innerWidth, innerHeight] });
}
// a dónde va cada fader: el del canal abierto, arriba; el que tiene el ratón encima, asoma; el que se arrastra, lo lleva el dedo
function faders() {
  const abierto = seleccion >= 0 ? D.orden.indexOf(PROYECTOS[seleccion].id) : -1, o = {};
  for (const c of CAN) o[`f${c.i}`] = arr?.i === c.i && arr.movido ? arr.t : c.i === abierto ? ARRIBA : c.i === encima && !apagado(c.i) ? ASOMA : 0;
  return o;
}

// ── Los medidores: bailan con una señal inventada (no hay sonido) mientras su canal está arriba ──
let bailando = false, tBaile = 0;
const senal = (t, f) => 0.62 + 0.2 * Math.sin(t * 5.1 + f) + 0.12 * Math.sin(t * 11.3 + f * 2.1) + 0.1 * Math.sin(t * 23.7 + f * 0.7);
function nivelDe(c, t) {
  if (apagado(c.i) || !D.color[c.id] || c.id === 'siguiente') return 0;
  const f = Math.max(0, muelles.v[`f${c.i}`]); if (f < 0.02) return 0;
  return Math.min(1, f / ARRIBA * (RM ? 0.66 : senal(t, c.fase)));
}
function pintarMedidores(t, dt) {
  let vivo = false, suma = 0;
  const paso = (m, obj, lienzo, tex) => {
    m.nivel += (obj - m.nivel) * Math.min(1, dt * (obj > m.nivel ? 28 : 9));
    m.pico = Math.max(m.nivel, m.pico - dt * 0.35);
    const clave = Math.round(m.nivel * 16) * 32 + Math.round(m.pico * 16);
    if (clave !== m.pintado) { m.pintado = clave; I.medidor(lienzo, m.nivel, m.pico); tex.needsUpdate = true; }
    if (m.nivel > 0.01 || m.pico > 0.01 || obj > 0) vivo = true;
  };
  for (const c of CAN) { const o = nivelDe(c, t); suma = Math.max(suma, o); paso(c, o, lienzos[`med${c.i}`], texturas[`med${c.i}`]); }
  SALIDA.forEach((m, k) => paso(m, suma * (k ? 0.94 : 1) * (suma ? 0.92 + 0.08 * Math.sin(t * 7 + k * 2) : 0), lienzos[`med${N + k}`], texturas[`med${N + k}`]));
  return vivo;
}
function arrancarBaile() {
  if (bailando) return; bailando = true; tBaile = performance.now(); let ultimo = 0;
  const paso = (t) => {
    // sin gráfica, el baile va a 20 por segundo: cada fotograma suyo cuesta un dibujo entero
    if (S.LIGERO && t - ultimo < 48 && !muelles.corriendo) { requestAnimationFrame(paso); return; }
    ultimo = t;
    const dt = Math.min(0.1, (t - tBaile) / 1000); tBaile = t;
    const visible = !(enPantallaPuesta && (rutas?.actual ?? '').endsWith('/monitor'));   // con la demo puesta no se ven: no gastan fotogramas
    const vivo = pintarMedidores(t / 1000, dt) && visible && !document.hidden;
    if (!muelles.corriendo) S.pedirDibujo();
    if (vivo && !RM) requestAnimationFrame(paso); else bailando = false;
  };
  requestAnimationFrame(paso);
}

// ── Lo que se mueve ──
function marcha() { S.enMarcha(muelles.corriendo); }
muelles.alMover = () => { marcha(); S.pedirDibujo(); arrancarBaile(); };
muelles.alParar = () => { marcha(); S.pedirDibujo(); };
S.alDibujar = () => { colocar(muelles.v); seguirCanales(); seguirTele(); };

// ── Un botón por canal encima de su fader, y los de solo y silencio ──
const capa = $('#solares'), etiqueta = $('.etiqueta');
capa.innerHTML = D.orden.map((id, i) => {
  const p = porId(id); if (!p) return '';
  return `<button type="button" class="solar" data-id="${id}" data-i="${i}" aria-label="Canal ${p.n}, ${p.nombre}: ${p.linea}"></button>
    <button type="button" class="sm" data-sm="s" data-i="${i}" aria-pressed="false" aria-label="Solo: que suene solo ${p.nombre}"></button>
    <button type="button" class="sm" data-sm="m" data-i="${i}" aria-pressed="false" aria-label="Silenciar ${p.nombre}"></button>`;
}).join('');
const botones = Object.fromEntries([...capa.querySelectorAll('.solar')].map((b) => [b.dataset.id, b]));
const sm = [...capa.querySelectorAll('.sm')];
function rect(puntos) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const [x, y] of puntos) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
  return [x0, y0, x1 - x0, y1 - y0];
}
const rectCanal = (i) => { const cx = centro(i), a = D.paso / 2 - 0.03; return rect([enPantalla(cx - a, 0.05), enPantalla(cx + a, 0.05), enPantalla(cx + a, 4.95, 0.3), enPantalla(cx - a, 4.95, 0.3)]); };
function seguirCanales() {
  const r = rutas?.actual ?? 'estudio', ver = !r.endsWith('/monitor');
  capa.hidden = !ver; if (!ver) { etiqueta.hidden = true; return; }
  for (const id of IDS) { const [x, y, w, h] = rectCanal(D.orden.indexOf(id)); botones[id].style.cssText = `left:${x}px;top:${y}px;width:${w}px;height:${h}px`; }
  for (const b of sm) {
    const cx = centro(+b.dataset.i) + (b.dataset.sm === 's' ? -1 : 1) * D.boton.dx, a = D.boton.ancho / 2, f = D.boton.fondo / 2, y = D.boton.y;
    const [x, yy, w, h] = rect([enPantalla(cx - a, y - f, 0.15), enPantalla(cx + a, y - f, 0.15), enPantalla(cx + a, y + f, 0.15), enPantalla(cx - a, y + f, 0.15)]);
    b.style.cssText = `left:${x}px;top:${yy}px;width:${w}px;height:${h}px`;
  }
  const b = r === 'estudio' && !arr && capa.querySelector('.solar:hover, .solar:focus-visible'), p = b && porId(b.dataset.id);
  if (p) {
    const [x, y, w] = rectCanal(D.orden.indexOf(p.id));
    etiqueta.querySelector('b').textContent = `Canal ${p.n} · ${p.tipo}`; etiqueta.querySelector('span').textContent = `${p.nombre}. ${p.linea}`;
    const ew = etiqueta.offsetWidth || 280, ex = Math.min(Math.max(8, x + w / 2 - ew / 2), innerWidth - ew - 8);
    etiqueta.style.transform = `translate(${Math.round(ex)}px, ${Math.round(Math.max(8, y - (etiqueta.offsetHeight || 70) - 10))}px)`; etiqueta.hidden = false;
  } else etiqueta.hidden = true;
}
function asomar(i) { if (encima === i) return; encima = i; muelles.ir(faders()); }
capa.addEventListener('pointerover', (e) => { const b = e.target.closest('.solar'); if (b && e.pointerType !== 'touch') asomar(+b.dataset.i); });
capa.addEventListener('pointerleave', () => asomar(-1));
capa.addEventListener('focusin', (e) => { const b = e.target.closest('.solar'); if (b && b.matches(':focus-visible')) asomar(+b.dataset.i); });
capa.addEventListener('focusout', () => asomar(-1));

// arrastrar un fader: el dedo lo lleva a lo largo de su ranura y el muelle lo sigue. Soltado arriba, abre el canal;
// soltado abajo, vuelve a su sitio (y si era el canal abierto, lo cierra). Un clic sin arrastrar lo abre.
let arr = null;
function alturaEn(i, e) {
  const [ax, ay] = enPantalla(centro(i) + F.dx, F.y0, 0.2), [bx, by] = enPantalla(centro(i) + F.dx, F.y0 + F.rec, 0.2);
  const dx = bx - ax, dy = by - ay;
  return ((e.clientX - ax) * dx + (e.clientY - ay) * dy) / (dx * dx + dy * dy);
}
capa.addEventListener('pointerdown', (e) => {
  const b = e.target.closest('.solar'); if (!b || e.button !== 0) return;
  const i = +b.dataset.i;
  arr = { i, id: b.dataset.id, puntero: e.pointerId, x: e.clientX, y: e.clientY, movido: false, t: muelles.v[`f${i}`], desde: alturaEn(i, e) - muelles.v[`f${i}`] };
  // si se coge por la tapa, se lleva desde donde está; si se toca la ranura más arriba, la tapa va al dedo
  if (Math.abs(arr.desde) > 0.2) arr.desde = 0;
  try { b.setPointerCapture(e.pointerId); } catch { /* un puntero que ya no existe */ }
});
capa.addEventListener('pointermove', (e) => {
  if (!arr || e.pointerId !== arr.puntero) return;
  if (!arr.movido && Math.hypot(e.clientX - arr.x, e.clientY - arr.y) < 6) return;
  arr.movido = true; document.documentElement.classList.add('arrastrando');
  const t = alturaEn(arr.i, e) - arr.desde;
  arr.t = t < 0 ? t * 0.15 : t > 1 ? 1 + (t - 1) * 0.15 : t;          // pasado el tope, cede un poco y tira hacia dentro
  muelles.ir(faders());
});
function soltar(e) {
  if (!arr || e.pointerId !== arr.puntero) return;
  const a = arr; arr = null; document.documentElement.classList.remove('arrastrando');
  const abierto = idActual() === a.id;
  if (e.type === 'pointercancel') { muelles.ir(faders()); return; }
  if (!a.movido) { ir(a.id); return; }
  ultimoArrastre = performance.now();
  if (a.t > 0.42) ir(a.id); else if (abierto) ir('estudio');
  muelles.ir(faders());
}
let ultimoArrastre = 0;
function ir(ruta) { if (rutas.actual === ruta) muelles.ir(faders()); else rutas.ir(ruta); }
capa.addEventListener('pointerup', soltar); capa.addEventListener('pointercancel', soltar);
// el teclado (y los lectores) pulsan sin puntero: Enter o espacio abren el canal
capa.addEventListener('click', (e) => {
  const s = e.target.closest('.sm'); if (s) { alternar(s.dataset.sm === 's' ? solos : mudos, +s.dataset.i); return; }
  const b = e.target.closest('.solar'); if (!b || e.detail !== 0) return;
  ir(b.dataset.id);
});
capa.addEventListener('keydown', (e) => {
  const b = e.target.closest('.solar, .sm'); if (!b) return;
  const i = +b.dataset.i;
  if (b.matches('.solar') && (e.key === 's' || e.key === 'S')) { alternar(solos, i); return; }
  if (b.matches('.solar') && (e.key === 'm' || e.key === 'M')) { alternar(mudos, i); return; }
  const j = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: IDS.length - 1 }[e.key];
  if (j === undefined || rutas.actual !== 'estudio') return;
  e.preventDefault(); e.stopPropagation();
  const id = D.orden[j]; if (id && botones[id]) (b.matches('.sm') ? capa.querySelector(`.sm[data-sm="${b.dataset.sm}"][data-i="${j}"]`) : botones[id]).focus();
});
filtro.querySelector('button').addEventListener('click', () => { solos.clear(); mudos.clear(); pintarCara(); arrancarBaile(); });

// ── La ficha, la hoja de pista y el recorrido ──
const ficha = $('.ficha-lateral'), cajetin = $('.cajetin'), recorrido = $('.recorrido'), pasos = $('.pasos'), dice = $('.dice'), heroe = $('.heroe');
pasos.innerHTML = PASOS.map((p, i) => `<button type="button" data-paso="${p.id}"><i>${i + 1}</i><span>${p.boton}</span></button>`).join('');
pasos.addEventListener('click', (e) => { const b = e.target.closest('[data-paso]'); if (b) rutas.ir(rutaDe(idActual(), b.dataset.paso)); });
document.addEventListener('click', (e) => {
  const a = e.target.closest('[data-ir]'); if (a) { e.preventDefault(); rutas.ir(a.dataset.ir); }
  const b = e.target.closest('[data-ir-paso]'); if (b) rutas.ir(rutaDe(idActual(), b.dataset.irPaso));
});
const rutaDe = (id, paso) => (paso ? `${id}/${paso}` : id);
const idActual = () => (rutas.actual ?? 'estudio').split('/')[0];
const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
function pintarFicha(p) {
  ficha.style.setProperty('--c', p.color);
  ficha.querySelector('.fi-n').textContent = `Canal ${p.n} · abierto`;
  ficha.querySelector('.fi-nombre').textContent = p.nombre;
  ficha.querySelector('.fi-tipo').textContent = `${p.tipo} · ${p.estado}`;
  ficha.querySelector('.fi-linea').textContent = p.linea;
  ficha.querySelector('.fi-botones').innerHTML = `<button type="button" class="boton boton-luz" data-ir-paso="monitor"><span class="boton-tapa">${p.demo ? 'Probarlo en el monitor' : 'Su tráiler, en el monitor'}</span></button>
    <button type="button" class="boton boton-claro" data-ir-paso="ficha"><span class="boton-tapa">Su hoja de pista</span></button>
    ${p.web ? `<a class="fi-web" href="${p.web[1]}" target="_blank" rel="noopener">${esc(p.web[0])} ↗</a>` : ''}`;
  cajetin.style.setProperty('--c', p.color);
  cajetin.querySelector('#cj-nombre').textContent = p.nombre;
  cajetin.querySelector('.cj-n b').textContent = p.n;
  cajetin.querySelector('.cj-bloques').innerHTML = p.bloques.map(([t, x]) => `<p class="cj-celda"><small>${esc(t)}</small><span>${esc(x)}</span></p>`).join('');
  cajetin.querySelector('.cj-cifras').innerHTML = p.cifras.map(([n, t]) => `<p class="cj-celda"><b>${esc(n)}</b><small>${esc(t)}</small></p>`).join('');
  cajetin.querySelector('.cj-mat').hidden = !p.stack.length;
  cajetin.querySelector('.cj-mat span').textContent = p.stack.join(' · ');
  cajetin.querySelector('.cj-web span').innerHTML = p.web ? `<a href="${p.web[1]}" target="_blank" rel="noopener">${esc(p.web[0])} ↗</a>` : 'Sin web pública';
  cajetin.querySelector('.cj-estado').textContent = p.estado;
}

// ── El monitor del estudio ──
const tele = $('#tele'), mandos = $('.tele-mandos'), webTele = $('.tele-web');
let enTele = null, teleId = null, teleTurno = 0, enPantallaPuesta = false;
function seguirTele() {
  if (tele.hidden) return;
  // en el móvil y en la tableta en vertical, la demo ocupa la pantalla (en 3D quedaría a 400 px de ancho)
  if (movil() || innerHeight > innerWidth) { if (!tele.classList.contains('completa')) { desajustar(tele); tele.classList.add('completa'); } return; }
  tele.classList.remove('completa');
  const g = 0.03, y = M.y - M.fondo / 2 + 0.005, x0 = M.x - M.ancho / 2 + g, x1 = M.x + M.ancho / 2 - g, z0 = M.z - M.alto / 2 + g, z1 = M.z + M.alto / 2 - g;
  ajustar(tele, [S.aPantalla(x0, y, z1), S.aPantalla(x1, y, z1), S.aPantalla(x1, y, z0), S.aPantalla(x0, y, z0)]);
}
// cada encendido lleva su número: si mientras arranca se apaga o se pide otro, el viejo se retira; con otro proyecto,
// la pantalla del kit sustituye al anterior en el acto
async function encenderTele(p, mio) {
  if (enTele && teleId === p.id) return;
  enTele = 'encendiendo'; teleId = p.id; const t0 = ++teleTurno;
  mandos.hidden = false; webTele.hidden = !p.web;      // antes de encender: la barra crece con los mandos
  if (p.web) { webTele.href = p.web[1]; webTele.querySelector('.boton-tapa').textContent = `${p.web[0].replace(/^github\.com\/[^/]+\//, 'GitHub: ')} ↗`; }
  requestAnimationFrame(() => mandos.classList.add('puestos'));
  const t = await encender(p, { el: tele, RM, guardado: null, alResolver: null });
  if (t0 !== teleTurno || mio !== turno || !t) { if (t0 === teleTurno) t?.apagar(); return; }
  enTele = t; seguirTele();
  // el foco, en el primer mando (fuera de la pantalla): con el teclado no hay que cruzar la demo para salir
  if (document.activeElement === document.body || document.activeElement?.closest('.recorrido, .lista')) mandos.querySelector('button')?.focus({ preventScroll: true });
}
async function apagarTele() {
  if (!enTele) return;
  teleTurno++;
  mandos.classList.remove('puestos'); mandos.hidden = true;
  const t = enTele; enTele = null; teleId = null;
  if (t !== 'encendiendo') await t.apagar(); else apagarYa(tele);
  S.pedirDibujo();
}

// ── Rutas: #estudio, #<id>, #<id>/ficha, #<id>/monitor ──
rutas = montarRutas({
  inicio: 'estudio',
  validar(r) {
    if (!r || r === 'estudio') return 'estudio';
    const [id, paso = ''] = r.split('/');
    return porId(id) && PASOS.some((p) => p.id === paso) ? rutaDe(id, paso) : null;
  },
  alCambiar: (ruta, o) => irA(ruta, o),
});

let turno = 0, enCurso = 0;
function esperar(cond) { return new Promise((ok) => { const mira = () => (cond() ? ok() : requestAnimationFrame(mira)); mira(); }); }
async function irA(ruta, o) {
  const mio = ++turno; enCurso++;
  try { await irA_(ruta, o, mio); } finally { enCurso--; }
}
async function irA_(ruta, { inmediato }, mio) {
  const [id, paso = ''] = ruta.split('/');
  const p = porId(id), i = PROYECTOS.indexOf(p);
  document.documentElement.dataset.ruta = id === 'estudio' ? 'estudio' : paso || 'canal';
  const focoDentro = document.activeElement?.closest('.solares, .lista, .pasos, .ficha-lateral'), focoFuera = document.activeElement?.closest('.recorrido, .tele, .tele-mandos, .cajetin');
  const antes = PROYECTOS[seleccion];
  heroe.toggleAttribute('inert', id !== 'estudio');
  recorrido.hidden = id === 'estudio';
  ficha.hidden = !p || paso !== '';
  cajetin.hidden = !p || paso !== 'ficha';
  if (p) {
    for (const b of pasos.children) b.setAttribute('aria-current', b.dataset.paso === paso ? 'step' : 'false');
    dice.textContent = paso === 'monitor' ? (p.demo ? 'En el monitor del estudio: una simulación (personajes inventados; la mecánica es la del juego).' : 'En el monitor del estudio: el tráiler del proyecto.') : PASOS.find((x) => x.id === paso).dice;
    pintarFicha(p);
    // abrir un canal que no sonaba lo devuelve a la mezcla
    const k = D.orden.indexOf(id); if (mudos.delete(k) || (solos.size && !solos.has(k) && solos.add(k))) { /* se repinta abajo */ }
  }
  // el foco sigue al paso solo si se venía con el teclado (tras arrastrar un fader no se enseña un anillo de foco)
  if (focoDentro && p && performance.now() - ultimoArrastre > 400 && document.activeElement?.matches(':focus-visible')) requestAnimationFrame(() => pasos.querySelector('[aria-current="step"]')?.focus({ preventScroll: true }));
  if (id === 'estudio' && focoFuera) requestAnimationFrame(() => { S.dibujar(); botones[antes?.id ?? IDS[0]]?.focus({ preventScroll: true }); });
  // fuera del monitor, o con otro canal, la pantalla se apaga
  if (paso !== 'monitor' || (seleccion >= 0 && seleccion !== i)) { apagarTele(); enPantallaPuesta = false; }
  seleccion = p ? i : -1;
  pintarCara();
  if (inmediato || RM) {
    enPantallaPuesta = paso === 'monitor';
    muelles.ir({ ...faders(), cam: camaraDe(ruta) }, true);
    pintarMedidores(0, 1); S.pedirDibujo(); arrancarBaile();
    if (paso === 'monitor') encenderTele(p, mio);
    return;
  }
  if (paso !== 'monitor') { muelles.ir({ ...faders(), cam: camaraDe(ruta) }); return; }
  // al monitor: el fader sube (si aún no estaba), la cámara levanta la vista a la pantalla y, al llegar, se enciende
  muelles.ir({ ...faders(), cam: camMonitor() });
  await esperar(() => mio !== turno || Math.abs(muelles.v.cam.z - M.z) < 0.5);
  if (mio !== turno) return;
  enPantallaPuesta = true; muelles.ir({ cam: camMonitor() });
  encenderTele(p, mio);
}

// teclado: ← → por los pasos, Esc vuelve uno atrás (también desde dentro de la pantalla)
addEventListener('keydown', (e) => {
  if (e.target.closest('input, textarea, dialog[open]')) return;
  if (e.target.closest('.tele') && e.key !== 'Escape') return;
  const r = rutas.actual; if (r === 'estudio') return;
  const [id, paso = ''] = r.split('/'), k = PASOS.findIndex((p) => p.id === paso);
  if (e.key === 'ArrowRight' && k < PASOS.length - 1) { e.preventDefault(); rutas.ir(rutaDe(id, PASOS[k + 1].id)); }
  else if (e.key === 'ArrowLeft' && k > 0) { e.preventDefault(); rutas.ir(rutaDe(id, PASOS[k - 1].id)); }
  else if (e.key === 'Escape') { e.preventDefault(); rutas.ir(k > 0 ? rutaDe(id, PASOS[k - 1].id) : 'estudio'); }
});

// ── La lista de los nueve ──
const lista = $('.lista');
$('.lista-ol').innerHTML = PROYECTOS.map((p) => `<li><span class="li-n" style="--c:${p.color}">${p.n}</span>
  <div><b>${p.nombre}</b><span class="li-linea">${p.linea}</span><small>Canal ${p.n} · ${p.tipo} · ${p.estado}</small></div>
  <span class="li-botones"><button type="button" class="boton boton-claro" data-sacar="${p.id}"><span class="boton-tapa">Abrir</span></button>${p.demo ? `<button type="button" class="boton boton-luz" data-sacar="${p.id}/monitor"><span class="boton-tapa">Probar</span></button>` : ''}</span></li>`).join('');
document.addEventListener('click', (e) => {
  if (e.target.closest('[data-abrir="lista"]')) { lista.showModal(); lista.querySelector('[data-sacar]').focus(); }
  const s = e.target.closest('[data-sacar]'); if (s) { lista.close(); rutas.ir(s.dataset.sacar); requestAnimationFrame(() => pasos.querySelector('[aria-current="step"]')?.focus({ preventScroll: true })); }
});
lista.querySelector('.lista-x').addEventListener('click', () => lista.close());
lista.addEventListener('click', (e) => { if (e.target === lista) lista.close(); });
$('.texto-proyectos').innerHTML = PROYECTOS.map((p) => `<li><h3>${p.nombre}</h3><p>${p.linea}</p>${p.bloques.map(([t, x]) => `<p><b>${t}:</b> ${x}</p>`).join('')}</li>`).join('');

// ── Medidas y arranque ──
addEventListener('resize', () => {
  S.medir();
  const c = camaraDe(rutas.actual);
  if (muelles.corriendo) muelles.empujar('cam', c); else muelles.tocar('cam', c);
  S.dibujar();
});
new ResizeObserver(() => document.documentElement.style.setProperty('--barra', `${recorrido.offsetHeight + 18}px`)).observe(recorrido);
for (let k = 0; k < N + 2; k++) I.medidor(lienzos[`med${k}`], 0, 0);
await document.fonts.ready;
rutas.arrancar();
S.dibujar();
S.listo();
(window.requestIdleCallback ?? setTimeout)(() => C.cargarArte('adivinadle'), { timeout: 3000 });
const redondo = (x) => Math.round(x * 1000) / 1000;
window.__estado = () => ({
  ruta: rutas.actual, seleccion, quieto: !muelles.corriendo && !enCurso && !arr,
  faders: CAN.map((c) => redondo(muelles.v[`f${c.i}`])), arriba: CAN.filter((c) => muelles.v[`f${c.i}`] > 0.5).map((c) => c.id).join(','),
  solos: [...solos].sort().join(','), mudos: [...mudos].sort().join(','), bailando,
  tele: !tele.hidden, enTele: enTele && (enTele === 'encendiendo' ? 'encendiendo' : 'encendida'),
  ficha: !ficha.hidden, cajetin: !cajetin.hidden,
});
