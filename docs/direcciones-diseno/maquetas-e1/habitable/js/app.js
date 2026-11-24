// La maqueta habitable, con el kit E1. Una maqueta de arquitecto en la mesa del estudio: los nueve proyectos son nueve
// edificios de cartón alrededor de una plaza con una pantalla. Se toca un edificio y se le levanta el tejado (se ve su
// planta de arriba por dentro); «por dentro» lo separa planta a planta, como una axonometría explotada, con su cajetín
// (qué es, qué hice yo, el resultado, con qué está hecho); «en la plaza» baja a la calle y la pantalla pone su demo
// (Adivinadle) o su tráiler. Una parcela vacía espera al siguiente.
//
// Como en las otras maquetas, todo sale de unos pocos valores con muelles (la cámara, lo que se abre cada edificio y el
// foco): las piezas no tienen posición guardada, se calculan en cada fotograma, así que volver a mitad o entrar por un
// enlace directo dejan siempre la maqueta en un estado posible.
import { montarEscena, THREE, RM } from '../../../kit-e1/js/motor.js';
import { Muelles, suave } from '../../../kit-e1/js/muelles.js';
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
  { id: '', boton: 'El edificio', dice: 'Con el tejado levantado: la planta de arriba, por dentro.' },
  { id: 'caso', boton: 'Por dentro', dice: 'Planta a planta, con su cajetín: qué es, qué hice yo, el resultado y con qué está hecho.' },
  { id: 'plaza', boton: 'En la plaza', dice: '' },
];
const IDS = PROYECTOS.map((p) => p.id);

// ── Arranque ──
await C.cargar();
let seleccion = -1, rutas = null, encima = '';
const VIDRIO = /_(v[SNEO]?\d+|luz\d|muelle\d|cochera\d|rendija)$/;
const S = await montarEscena({
  plato: $('#plato'), luz: 'luz/', fondo: '#cfc7ba', exposicion: 1.0,
  pixelesEnMarcha: 80000,      // sin gráfica, cada píxel de esta maqueta cuesta el triple que en la estantería
  etiqueta: 'Una maqueta de arquitecto sobre una mesa: nueve edificios de cartón, uno por proyecto, alrededor de una plaza con una pantalla',
  material(n, { textura }) {
    if (n === 'pantalla_cara') return { color: '#000000', emite: '#0b0d11' };
    if (n === 'marquesina_cara') return { mapa: textura('marquesina', I.TAM.marquesina) };     // un cartel con luz propia
    if (n.startsWith('rotulo_')) return { luz: 'base', mapa: textura('rotulos', I.TAM.rotulos), brillo: 0.04 };
    if (n.startsWith('base_')) return { luz: 'base', brillo: 0.03 };
    if (n.startsWith('mesa_')) return { luz: 'mesa', brillo: 0.04 };
    const m = n.match(/^ed_([a-z]+)_p\d/);
    if (m) return { luz: `ed_${m[1]}`, luz2: `ed_${m[1]}_ab`, brillo: VIDRIO.test(n) ? 0.35 : 0.03 };
    return { luz: 'base' };
  },
});
const { nodo, lienzos, texturas } = S;
const D = S.datos, E = D.edificios, P = D.pantalla;

// cada edificio: sus partes (vacíos apilados), sus materiales y su caja (para el botón que va encima)
const ED = {};
for (const id of IDS) {
  const e = E[id], partes = e.partes.map((_, k) => { const n = nodo[`ed_${id}_p${k}`]; return { n, y0: n.position.y }; });
  const mats = []; for (const { n } of partes) n.traverse((o) => { if (o.isMesh) mats.push(o.material); });
  const caja = new THREE.Box3(); for (const { n } of partes) caja.expandByObject(n);
  const explotado = e.alto + (partes.length - 1) * D.delta + D.alza_tejado;
  ED[id] = { ...e, partes, mats, caja, explotado };
}
const propios = new Set(Object.values(ED).flatMap((e) => e.mats));
const restoMats = S.mats.filter((m) => !propios.has(m) && m.uniforms);

// lo impreso fijo: los rótulos de las parcelas y el cartel de la plaza
I.rotulos(lienzos.rotulos, Object.keys(D.sitio)); texturas.rotulos.needsUpdate = true;
let marquesinaDe = undefined;
function marquesina(p) {
  if (marquesinaDe === p) return; marquesinaDe = p;
  I.marquesina(lienzos.marquesina, p); texturas.marquesina.needsUpdate = true; S.pedirDibujo();
}
marquesina(null);

// ── Las cámaras ──
let giro = 0;                                   // lo que se ha girado la maqueta arrastrando (solo en la vista entera)
const bordeIzq = (sel) => { const h = document.querySelector(sel); return h.offsetLeft + h.offsetWidth; };
function huecoBajo(sel, abajo = innerHeight - 24) {   // [ancho, alto, centro y] libre debajo de un cuadro de arriba
  const h = document.querySelector(sel), arriba = h.offsetTop + h.offsetHeight + 12;
  return [innerWidth - 24, Math.max(160, abajo - arriba), (arriba + abajo) / 2];
}
function camVista() {
  const c = { x: 0, y: -0.3, z: 0.7, dist: 42, inclina: 36, gira: giro };
  if (movil()) {
    const [w, h, yc] = huecoBajo('.heroe');
    return { ...c, z: 0.4, inclina: 54, alto: 12.6, ancho: 15.8, px: 0.5, py: yc / innerHeight, util: [w + 12, h] };
  }
  if (apilado()) {
    const [w, h, yc] = huecoBajo('.heroe');
    return { ...c, alto: 10.6, ancho: 16.4, px: 0.5, py: yc / innerHeight, util: [w - 24, h] };
  }
  const hd = bordeIzq('.heroe');
  return { ...c, alto: 10.6, ancho: 16.6, px: (hd + innerWidth) / 2 / innerWidth, py: 0.54, util: [innerWidth - hd - 48, innerHeight - 120] };
}
const giraDe = (id) => (ED[id].x < 0 ? -24 : ED[id].x > 0 ? 24 : 0);
function camEdificio(id, paso) {
  const e = ED[id], m = movil(), caso = paso === 'caso';
  const alto = caso ? e.explotado : e.alto + D.alza_tejado;
  const c = { x: e.x, y: e.y, z: alto * (caso ? 0.5 : 0.42), dist: caso ? 30 : 22, inclina: caso ? 20 : 32, gira: giraDe(id), alto: alto + (caso ? 0.7 : 1.4), ancho: caso ? 3.8 : 4.6 };
  if (m) {
    if (caso) { const top = 62, bot = innerHeight * 0.5; return { ...c, px: 0.5, py: (top + bot) / 2 / innerHeight, util: [innerWidth - 24, bot - top - 8] }; }
    const [w, h, yc] = huecoBajo('.ficha-lateral', innerHeight - 84);
    return { ...c, px: 0.5, py: yc / innerHeight, util: [w, h] };
  }
  if (caso) {   // el cajetín, a la derecha, como en un plano; el edificio en el hueco de la izquierda
    const cj = document.querySelector('.cajetin'), libre = cj.offsetLeft;
    return { ...c, px: libre / 2 / innerWidth, py: 0.48, util: [libre - 60, innerHeight - 170] };
  }
  const hd = bordeIzq('.ficha-lateral');
  return { ...c, px: (hd + innerWidth) / 2 / innerWidth, py: 0.5, util: [innerWidth - hd - 60, innerHeight - 170] };
}
// la plaza: primero desde arriba (para no atravesar edificios), luego a pie de calle, de frente a la pantalla
function camPlaza(abajo) {
  if (!abajo) return { x: 0, y: P.y, z: P.z, dist: 18, inclina: 30, gira: 0, alto: 6.4, ancho: 9.5, px: 0.5, py: 0.5, util: [innerWidth, innerHeight - 100] };
  if (movil()) return { x: 0, y: P.y, z: P.z, dist: 4.4, inclina: 4, gira: 0, alto: P.alto + 1.2, ancho: P.ancho + 0.9, px: 0.5, py: 0.42, util: [innerWidth, innerHeight - 120] };
  // el encuadre baja hasta las patas, que pueden quedar tras el recorrido; la pantalla, no: si el recorrido (que crece
  // con los mandos al encenderla) sube más que ella, el encuadre se acorta por abajo
  const alto = innerHeight - 200, arriba = 0.46 * innerHeight - alto / 2;
  const tope = innerHeight - recorrido.offsetHeight - (mandos.hidden ? 58 : 0) - 18 + 56, bajo = Math.min(arriba + alto, tope);
  return { x: 0, y: P.y, z: P.z, dist: 4.4, inclina: 4, gira: 0, alto: P.alto + 0.34, ancho: P.ancho + 0.4, px: 0.5, py: (arriba + bajo) / 2 / innerHeight, util: [innerWidth - 140, bajo - arriba] };
}
function camaraDe(ruta) {
  const [id, paso = ''] = ruta.split('/');
  if (id === 'maqueta') return camVista();
  if (paso === 'plaza') return camPlaza(abajo);
  return camEdificio(id, paso);
}

// ── Lo que se mueve ──
const cerrado = Object.fromEntries(IDS.map((id) => [id, 0]));
const muelles = new Muelles({ abre: { ...cerrado }, foco: 0, cam: camVista() }, { rigidez: 150, amort: 22.5 })
  .ritmo('cam', 110, 20).ritmo('abre', 140, 22);   // al ritmo de las otras maquetas: cada paso, en torno a un segundo
function abreDe(ruta) {
  const [id, paso = ''] = ruta.split('/'), a = { ...cerrado };
  if (id === 'maqueta') { if (encima) a[encima] = 0.3; return a; }
  if (paso === '') a[id] = 1; else if (paso === 'caso') a[id] = 2;
  return a;
}
function colocar(v) {
  const sel = PROYECTOS[seleccion]?.id;
  for (const id of IDS) {
    const e = ED[id], a = Math.max(0, v.abre[id]), n = e.partes.length;
    e.partes.forEach(({ n: nd, y0 }, k) => {
      nd.position.y = y0 + (k === n - 1 ? D.alza_tejado * Math.min(a, 1) : 0) + Math.max(a - 1, 0) * k * D.delta;
    });
    const mezcla = Math.min(1, a), atenua = id === sel ? 1 : 1 - 0.2 * v.foco;
    for (const m of e.mats) { m.uniforms.mezcla.value = mezcla; m.uniforms.atenua.value = atenua; }
  }
  for (const m of restoMats) m.uniforms.atenua.value = 1 - 0.2 * v.foco;
  const { util, ...c } = v.cam;
  S.encuadrar(c, { util: util ?? [innerWidth, innerHeight] });
}
function marcha() { S.enMarcha(muelles.corriendo); }
muelles.alMover = () => { marcha(); S.pedirDibujo(); };
muelles.alParar = () => { marcha(); S.pedirDibujo(); };
S.alDibujar = () => { colocar(muelles.v); seguirSolares(); seguirTele(); };

// ── Los solares: un botón invisible encima de cada edificio ──
const capa = $('#solares'), etiqueta = $('.etiqueta');
capa.innerHTML = IDS.map((id) => { const p = porId(id); return `<button type="button" class="solar" data-id="${id}" aria-label="${p.nombre}: ${p.linea}"></button>`; }).join('');
const botones = Object.fromEntries([...capa.children].map((b) => [b.dataset.id, b]));
const esquina = new THREE.Vector3();
function rectDe(caja) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (let k = 0; k < 8; k++) {
    esquina.set(k & 1 ? caja.max.x : caja.min.x, k & 2 ? caja.max.y : caja.min.y, k & 4 ? caja.max.z : caja.min.z).project(S.camara);
    const sx = (esquina.x + 1) / 2 * innerWidth, sy = (1 - esquina.y) / 2 * innerHeight;
    x0 = Math.min(x0, sx); x1 = Math.max(x1, sx); y0 = Math.min(y0, sy); y1 = Math.max(y1, sy);
  }
  return [x0, y0, x1 - x0, y1 - y0];
}
function seguirSolares() {
  const ver = (rutas?.actual ?? 'maqueta') === 'maqueta';
  // fuera de la maqueta, la capa se oculta y no llega el pointerleave: se olvida el señalado, para que al volver no
  // se quede un tejado asomado con el ratón ya en otra parte
  capa.hidden = !ver; if (!ver) { etiqueta.hidden = true; encima = ''; return; }
  for (const id of IDS) {
    const [x, y, w, h] = rectDe(ED[id].caja);
    botones[id].style.cssText = `left:${x}px;top:${y}px;width:${w}px;height:${h}px`;
  }
  const b = capa.querySelector('.solar:hover, .solar:focus-visible'), p = b && porId(b.dataset.id);
  if (p && !arr?.movido) {
    const [x, y, w] = rectDe(ED[p.id].caja);
    etiqueta.querySelector('b').textContent = `${p.n} · ${p.tipo}`; etiqueta.querySelector('span').textContent = `${p.nombre}. ${p.linea}`;
    const ew = etiqueta.offsetWidth || 280, ex = Math.min(Math.max(8, x + w / 2 - ew / 2), innerWidth - ew - 8);
    const ey = y - (etiqueta.offsetHeight || 70) - 6;
    etiqueta.style.transform = `translate(${Math.round(ex)}px, ${Math.round(Math.max(64, ey))}px)`; etiqueta.hidden = false;
  } else etiqueta.hidden = true;
}
function asomar(id) {
  if (encima === id) return; encima = id;
  if (rutas.actual === 'maqueta') muelles.ir({ abre: abreDe('maqueta') }, RM);
  S.pedirDibujo();
}
capa.addEventListener('pointerover', (e) => { const b = e.target.closest('.solar'); if (b && e.pointerType !== 'touch' && !arr?.movido) asomar(b.dataset.id); });
capa.addEventListener('pointerleave', () => asomar(''));
// solo el foco de teclado asoma el tejado: el que se devuelve tras volver con el ratón no se ve ni debe levantarlo
capa.addEventListener('focusin', (e) => { const b = e.target.closest('.solar'); if (b && b.matches(':focus-visible')) asomar(b.dataset.id); });
capa.addEventListener('focusout', () => asomar(''));
capa.addEventListener('click', (e) => { const b = e.target.closest('.solar'); if (b && !arrastrado) rutas.ir(b.dataset.id); });
// las flechas mueven el foco al edificio de al lado, como en la maqueta (la plaza en medio no cuenta)
capa.addEventListener('keydown', (e) => {
  const b = e.target.closest('.solar'); if (!b) return;
  const dir = { ArrowRight: [1, 0], ArrowLeft: [-1, 0], ArrowUp: [0, 1], ArrowDown: [0, -1] }[e.key]; if (!dir) return;
  e.preventDefault();
  const a = D.sitio[b.dataset.id];
  let mejor = null, dm = Infinity;
  for (const id of IDS) {
    const s = D.sitio[id], dx = s.c - a.c, dy = s.f - a.f, avance = dx * dir[0] + dy * dir[1];
    if (avance <= 0) continue;
    const d = avance + 2 * Math.abs(dx * dir[1] - dy * dir[0]);
    if (d < dm) { dm = d; mejor = id; }
  }
  if (mejor) botones[mejor].focus();
});

// arrastrar la maqueta entera para girarla un poco (no más de lo que deja ver la mesa)
let arr = null, arrastrado = false;
$('#plato').addEventListener('pointerdown', (e) => {
  if (rutas.actual !== 'maqueta' || e.button !== 0) return;
  arr = { x: e.clientX, giro, id: e.pointerId, movido: false }; arrastrado = false;
});
addEventListener('pointermove', (e) => {
  if (!arr || e.pointerId !== arr.id) return;
  const dx = e.clientX - arr.x; if (!arr.movido && Math.abs(dx) < 6) return;
  if (!arr.movido) { arr.movido = true; document.documentElement.classList.add('arrastrando'); asomar(''); $('#plato').setPointerCapture?.(e.pointerId); }
  giro = Math.max(-26, Math.min(26, arr.giro - dx * 0.09));
  muelles.empujar('cam', camVista());
});
const soltar = (e) => {
  if (!arr || e.pointerId !== arr.id) return;
  arrastrado = arr.movido; arr = null; document.documentElement.classList.remove('arrastrando');
  if (arrastrado) setTimeout(() => { arrastrado = false; }, 0);
};
addEventListener('pointerup', soltar); addEventListener('pointercancel', soltar);

// ── La ficha, el cajetín y el recorrido ──
const ficha = $('.ficha-lateral'), cajetin = $('.cajetin'), recorrido = $('.recorrido'), pasos = $('.pasos'), dice = $('.dice'), heroe = $('.heroe');
pasos.innerHTML = PASOS.map((p, i) => `<button type="button" data-paso="${p.id}"><i>${i + 1}</i><span>${p.boton}</span></button>`).join('');
pasos.addEventListener('click', (e) => { const b = e.target.closest('[data-paso]'); if (b) rutas.ir(rutaDe(idActual(), b.dataset.paso)); });
document.addEventListener('click', (e) => {
  const a = e.target.closest('[data-ir]'); if (a) { e.preventDefault(); rutas.ir(a.dataset.ir); }
  const b = e.target.closest('[data-ir-paso]'); if (b) rutas.ir(rutaDe(idActual(), b.dataset.irPaso));
});
const rutaDe = (id, paso) => (paso ? `${id}/${paso}` : id);
const idActual = () => (rutas.actual ?? 'maqueta').split('/')[0];
const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
function pintarFicha(p) {
  ficha.style.setProperty('--c', p.color);
  ficha.querySelector('.fi-n').textContent = `Edificio ${p.n}`;
  ficha.querySelector('.fi-nombre').textContent = p.nombre;
  ficha.querySelector('.fi-tipo').textContent = `${p.tipo} · ${p.estado}`;
  ficha.querySelector('.fi-linea').textContent = p.linea;
  ficha.querySelector('.fi-botones').innerHTML = `<button type="button" class="boton boton-luz" data-ir-paso="caso"><span class="boton-tapa">Verlo por dentro</span></button>
    <button type="button" class="boton boton-claro" data-ir-paso="plaza"><span class="boton-tapa">${p.demo ? 'Su demo, en la plaza' : 'Su tráiler, en la plaza'}</span></button>
    ${p.web ? `<a class="fi-web" href="${p.web[1]}" target="_blank" rel="noopener">${esc(p.web[0])} ↗</a>` : ''}`;
  cajetin.style.setProperty('--c', p.color);
  cajetin.querySelector('#cj-nombre').textContent = p.nombre;
  cajetin.querySelector('.cj-n b').textContent = p.n;
  cajetin.querySelector('.cj-bloques').innerHTML = p.bloques.map(([t, x]) => `<p class="cj-celda"><small>${esc(t)}</small><span>${esc(x)}</span></p>`).join('');
  cajetin.querySelector('.cj-cifras').innerHTML = p.cifras.map(([n, t]) => `<p class="cj-celda"><b>${esc(n)}</b><small>${esc(t)}</small></p>`).join('');
  cajetin.querySelector('.cj-mat span').textContent = p.stack.join(' · ');
  cajetin.querySelector('.cj-web span').innerHTML = p.web ? `<a href="${p.web[1]}" target="_blank" rel="noopener">${esc(p.web[0])} ↗</a>` : 'Sin web pública';
  cajetin.querySelector('.cj-estado').textContent = p.estado;
}

// ── La pantalla de la plaza ──
const tele = $('#tele'), mandos = $('.tele-mandos'), webTele = $('.tele-web');
let enTele = null, teleId = null, teleTurno = 0;
function seguirTele() {
  if (tele.hidden) return;
  if (movil()) { if (!tele.classList.contains('completa')) { desajustar(tele); tele.classList.add('completa'); } return; }
  tele.classList.remove('completa');
  // pegada al cristal por sus cuatro esquinas (la cámara mira un poco desde abajo: no es un rectángulo exacto)
  const g = 0.02, x0 = P.x - P.ancho / 2 + g, x1 = P.x + P.ancho / 2 - g, z0 = P.z - P.alto / 2 + g, z1 = P.z + P.alto / 2 - g, y = P.y - 0.004;
  ajustar(tele, [S.aPantalla(x0, y, z1), S.aPantalla(x1, y, z1), S.aPantalla(x1, y, z0), S.aPantalla(x0, y, z0)]);
}
// cada encendido lleva su número: si mientras arranca se apaga o se pide otro, el viejo se retira. Con otro proyecto,
// la pantalla del kit sustituye al anterior en el acto (nunca se queda el viejo puesto)
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

// ── Rutas: #maqueta, #<id>, #<id>/caso, #<id>/plaza ──
rutas = montarRutas({
  inicio: 'maqueta',
  validar(r) {
    if (!r || r === 'maqueta') return 'maqueta';
    const [id, paso = ''] = r.split('/');
    return porId(id) && PASOS.some((p) => p.id === paso) ? rutaDe(id, paso) : null;
  },
  alCambiar: (ruta, o) => irA(ruta, o),
});

let turno = 0, enCurso = 0, abajo = false;    // abajo: la cámara está a pie de calle, en la plaza
const camCerca = (tol) => ['dist', 'inclina', 'gira', 'x', 'y', 'z'].every((k) => Math.abs(muelles.v.cam[k] - muelles.obj.cam[k]) < tol * (k === 'dist' ? 1 : k === 'inclina' || k === 'gira' ? 4 : 0.6));
function esperar(cond) { return new Promise((ok) => { const mira = () => (cond() ? ok() : requestAnimationFrame(mira)); mira(); }); }
async function irA(ruta, o) {
  const mio = ++turno; enCurso++;
  try { await irA_(ruta, o, mio); } finally { enCurso--; }
}
async function irA_(ruta, { inmediato }, mio) {
  const [id, paso = ''] = ruta.split('/');
  const p = porId(id), i = PROYECTOS.indexOf(p);
  document.documentElement.dataset.ruta = id === 'maqueta' ? 'maqueta' : paso || 'edificio';
  // el foco: se mira antes de esconder nada (al esconder su caja, el navegador lo suelta)
  const focoSolar = document.activeElement?.closest('.solares, .lista, .pasos, .ficha-lateral'), focoFuera = document.activeElement?.closest('.recorrido, .tele, .tele-mandos, .cajetin');
  const antes = PROYECTOS[seleccion];
  seleccion = i;
  heroe.toggleAttribute('inert', id !== 'maqueta');
  recorrido.hidden = id === 'maqueta';
  ficha.hidden = !p || paso !== '';
  cajetin.hidden = !p || paso !== 'caso';
  if (p) {
    for (const b of pasos.children) b.setAttribute('aria-current', b.dataset.paso === paso ? 'step' : 'false');
    dice.textContent = paso === 'plaza' ? (p.demo ? 'En la pantalla de la plaza: una simulación (personajes inventados; la mecánica es la del juego).' : 'En la pantalla de la plaza: el tráiler del proyecto.') : PASOS.find((x) => x.id === paso).dice;
    pintarFicha(p);
  }
  marquesina(paso === 'plaza' ? p : null);
  if (focoSolar && p) requestAnimationFrame(() => pasos.querySelector('[aria-current="step"]')?.focus({ preventScroll: true }));
  if (id === 'maqueta' && focoFuera) requestAnimationFrame(() => { S.dibujar(); botones[antes?.id ?? IDS[0]]?.focus({ preventScroll: true }); });
  if (paso !== 'plaza') apagarTele();
  const foco = p && paso !== 'plaza' ? 1 : 0;
  // ya en la plaza con la pantalla puesta, otro proyecto: solo cambia lo que sale en ella
  if (paso === 'plaza' && abajo && teleId && !inmediato && !RM) { encenderTele(p, mio); return; }

  if (inmediato || RM) {
    abajo = paso === 'plaza';
    muelles.ir({ abre: abreDe(ruta), foco, cam: camaraDe(ruta) }, true);
    S.pedirDibujo();
    if (paso === 'plaza') encenderTele(p, mio);
    return;
  }
  // salir de la plaza: primero se sube (desde la calle, ir en línea recta atravesaría edificios)
  if (abajo && paso !== 'plaza') {
    abajo = false; muelles.ir({ cam: camPlaza(false) });
    await esperar(() => mio !== turno || camCerca(0.9)); if (mio !== turno) return;
  }
  if (paso !== 'plaza') { muelles.ir({ abre: abreDe(ruta), foco, cam: camaraDe(ruta) }); return; }
  // a la plaza: los edificios se cierran, la cámara pasa por encima de la plaza y baja a la calle
  muelles.ir({ abre: abreDe(ruta), foco: 0 });
  if (!abajo) {
    muelles.ir({ cam: camPlaza(false) });
    await esperar(() => mio !== turno || camCerca(1.6)); if (mio !== turno) return;
    abajo = true;
  }
  muelles.ir({ cam: camPlaza(true) });
  await esperar(() => mio !== turno || camCerca(0.5)); if (mio !== turno) return;
  encenderTele(p, mio);
}

// teclado: ← → por los pasos, Esc vuelve uno atrás (también desde dentro de la pantalla)
addEventListener('keydown', (e) => {
  if (e.target.closest('input, textarea, dialog[open]')) return;
  if (e.target.closest('.tele') && e.key !== 'Escape') return;
  const r = rutas.actual; if (r === 'maqueta') return;
  const [id, paso = ''] = r.split('/'), k = PASOS.findIndex((p) => p.id === paso);
  if (e.key === 'ArrowRight' && k < PASOS.length - 1) { e.preventDefault(); rutas.ir(rutaDe(id, PASOS[k + 1].id)); }
  else if (e.key === 'ArrowLeft' && k > 0) { e.preventDefault(); rutas.ir(rutaDe(id, PASOS[k - 1].id)); }
  else if (e.key === 'Escape') { e.preventDefault(); rutas.ir(k > 0 ? rutaDe(id, PASOS[k - 1].id) : 'maqueta'); }
});

// ── La lista de los nueve ──
const lista = $('.lista');
$('.lista-ol').innerHTML = PROYECTOS.map((p) => `<li><span class="li-n" style="--c:${p.color}">${p.n}</span>
  <div><b>${p.nombre}</b><span class="li-linea">${p.linea}</span><small>${p.tipo} · ${p.estado}</small></div>
  <span class="li-botones"><button type="button" class="boton boton-claro" data-sacar="${p.id}"><span class="boton-tapa">Edificio</span></button>${p.demo ? `<button type="button" class="boton boton-luz" data-sacar="${p.id}/plaza"><span class="boton-tapa">Demo</span></button>` : ''}</span></li>`).join('');
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
rutas.arrancar();
S.dibujar();
S.listo();
(window.requestIdleCallback ?? setTimeout)(() => C.cargarArte('adivinadle'), { timeout: 3000 });
window.__girar = (g) => { giro = g; if (rutas.actual === 'maqueta') muelles.ir({ cam: camVista() }); };   // para medir
const redondo = (x) => Math.round(x * 1000) / 1000;
window.__estado = () => ({
  ruta: rutas.actual, seleccion, quieto: !muelles.corriendo && !enCurso, abajo, giro: redondo(giro), foco: redondo(muelles.v.foco),
  abre: Object.fromEntries(IDS.filter((id) => muelles.v.abre[id] > 0.001).map((id) => [id, redondo(muelles.v.abre[id])])),
  abiertos: IDS.filter((id) => muelles.v.abre[id] > 0.001).join(','),
  tele: !tele.hidden, enTele: enTele && (enTele === 'encendiendo' ? 'encendiendo' : 'encendida'),
  ficha: !ficha.hidden, cajetin: !cajetin.hidden,
});
