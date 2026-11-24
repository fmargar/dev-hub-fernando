// El tablero del taller, con el kit E1. Una pared de taller: los nueve proyectos son nueve herramientas colgadas en
// un tablero perforado, cada una sobre su silueta blanca. Se descuelga una (queda su silueta, como en los talleres
// ordenados: se ve qué falta) y se tiene en la mano; «su ficha» es la orden de trabajo (qué es, qué hice yo, el
// resultado, con qué está hecha); «en el banco» se lleva al monitor sujeto en el tornillo, que se enciende con su demo
// (Adivinadle) o su tráiler. Un hueco libre con la silueta discontinua espera al siguiente.
//
// Como en las otras maquetas, todo sale de unos pocos valores con muelles (sale, banco, gira, la cámara): la
// herramienta no tiene una posición guardada, se calcula en cada fotograma, así que volver a mitad o entrar por un
// enlace directo dejan siempre el taller en un estado posible.
import { montarEscena, THREE, RM, b3 } from '../../../kit-e1/js/motor.js';
import { Muelles, giroCercano, suave, mezclar } from '../../../kit-e1/js/muelles.js';
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
  { id: '', boton: 'La herramienta', dice: 'Descolgada: en el tablero queda su silueta. Arrástrala para girarla.' },
  { id: 'ficha', boton: 'Su ficha', dice: 'La orden de trabajo: qué es, qué hice yo, el resultado y con qué está hecha.' },
  { id: 'banco', boton: 'En el banco', dice: '' },
];
const IDS = PROYECTOS.map((p) => p.id);

// ── Arranque ──
await C.cargar();
let seleccion = -1, rutas = null, encima = '';
let tamSiluetas = [2048, 1178];
const S = await montarEscena({
  plato: $('#plato'), luz: 'luz/', fondo: '#2b2f33', exposicion: 1.0,
  etiqueta: 'La pared de un taller: un tablero perforado con nueve herramientas colgadas, cada una sobre su silueta blanca, y debajo un banco con un monitor sujeto en el tornillo',
  material(n, { textura, datos }) {
    if (n.startsWith('tablero_')) { tamSiluetas = I.tam(datos.tablero); return { luz: 'tablero_con', luz2: 'tablero_sin', mapa: textura('siluetas', tamSiluetas), brillo: 0.02 }; }
    if (n === 'pantalla_cara') return { color: '#000000', emite: '#0b0d11' };
    if (n.startsWith('herr_')) return { luz: 'herramientas', brillo: 0.22 };
    if (/^taller_(gancho|tornillo_(husillo|palanca|bola|fija_chapa|movil_chapa))/.test(n)) return { luz: 'taller', brillo: 0.45 };
    if (n.startsWith('taller_')) return { luz: 'taller', brillo: 0.05 };
    return { luz: 'pared' };
  },
});
const { nodo, lienzos, texturas } = S;
const D = S.datos, T = D.tablero, M = D.monitor;
I.tablero(lienzos.siluetas, D); texturas.siluetas.needsUpdate = true;

// cada herramienta: su vacío (en el gancho), sus materiales, su centro y su caja colgada
const HE = {};
for (const id of IDS) {
  const raiz = nodo[`herr_${id}`], mats = [];
  raiz.traverse((o) => { if (o.isMesh) mats.push(o.material); });
  raiz.updateMatrixWorld(true);
  const caja = new THREE.Box3().setFromObject(raiz), centro = caja.getCenter(new THREE.Vector3()).sub(raiz.position);
  const largo = caja.max.y - caja.min.y;
  HE[id] = { raiz, mats, caja, centro, largo, casa: raiz.position.clone(), a: 0, v: 0, hueco: D.orden.indexOf(id) };
}
const losetas = D.orden.map((_, i) => nodo[`tablero_${i}`].material);
const propios = new Set(Object.values(HE).flatMap((h) => h.mats));
const fondoMats = S.mats.filter((m) => !propios.has(m) && m.uniforms);

// ── Dónde está cada cosa ──
const MANO = { x: 1.2, y: -6.2, z: 6.0 };                                      // en la mano, delante del tablero
const BANCO = { x: M.x - M.ancho / 2 - 0.2, y: M.y - 0.55, z: M.z - 0.35 };   // la punta, contra el marco del monitor
const R = THREE.MathUtils.degToRad, e1 = new THREE.Euler();
const quatB = (rx, ry, rz) => new THREE.Quaternion().setFromEuler(e1.set(R(rx), R(rz), R(-ry), 'YZX'));   // en grados de Blender
const pA = new THREE.Vector3(), pB = new THREE.Vector3(), qA = new THREE.Quaternion(), qB = new THREE.Quaternion(), qH = new THREE.Quaternion(), c1 = new THREE.Vector3();

// ── Las cámaras ──
let giroVista = 0;
const bordeIzq = (sel) => { const h = document.querySelector(sel); return h.offsetLeft + h.offsetWidth; };
function huecoBajo(sel, abajo = innerHeight - 24) {
  const h = document.querySelector(sel), arriba = h.offsetTop + h.offsetHeight + 12;
  return [innerWidth - 24, Math.max(160, abajo - arriba), (arriba + abajo) / 2];
}
function camVista() {
  const c = { x: 0, y: T.y, z: (T.z0 + T.z1) / 2 - 0.5, dist: 46, inclina: 7, gira: giroVista, alto: 11.2, ancho: 17.4 };
  if (movil()) { const [w, h, yc] = huecoBajo('.heroe'); return { ...c, alto: 10.4, ancho: 16.9, px: 0.5, py: yc / innerHeight, util: [w + 16, h] }; }
  if (apilado()) { const [w, h, yc] = huecoBajo('.heroe'); return { ...c, px: 0.5, py: yc / innerHeight, util: [w - 24, h] }; }
  const hd = bordeIzq('.heroe');
  return { ...c, px: (hd + innerWidth) / 2 / innerWidth, py: 0.53, util: [innerWidth - hd - 48, innerHeight - 110] };
}
function camMano(id, paso) {
  const l = HE[id].largo, c = { x: MANO.x, y: MANO.y, z: MANO.z, dist: 16, inclina: 3, gira: 0, alto: l + 1.0, ancho: l * 0.8 + 0.6 };
  if (movil()) {
    if (paso === 'ficha') { const top = 62, bot = innerHeight * 0.5; return { ...c, px: 0.5, py: (top + bot) / 2 / innerHeight, util: [innerWidth - 24, bot - top - 8] }; }
    const [w, h, yc] = huecoBajo('.ficha-lateral', innerHeight - 84); return { ...c, px: 0.5, py: yc / innerHeight, util: [w, h] };
  }
  if (paso === 'ficha') { const libre = $('.cajetin').offsetLeft; return { ...c, px: libre / 2 / innerWidth, py: 0.5, util: [libre - 60, innerHeight - 170] }; }
  const hd = bordeIzq('.ficha-lateral');
  return { ...c, px: (hd + innerWidth) / 2 / innerWidth, py: 0.5, util: [innerWidth - hd - 60, innerHeight - 170] };
}
function camBanco(cerca) {
  if (!cerca) return { x: M.x - 2.2, y: M.y, z: M.z - 0.3, dist: 20, inclina: 12, gira: -8, alto: 6.0, ancho: 10, px: 0.5, py: 0.5, util: [innerWidth, innerHeight - 100] };
  if (movil()) return { x: M.x - 0.8, y: M.y, z: M.z, dist: 12, inclina: 4, gira: -4, alto: M.alto + 1.2, ancho: M.ancho + 2.4, px: 0.5, py: 0.4, util: [innerWidth, innerHeight - 140] };
  const estrecho = innerWidth < 1100;   // en tableta, el tornillo asoma menos y el monitor gana ancho
  // el monitor, nunca bajo el recorrido (que crece con los mandos al encenderlo): si sube más, el encuadre se acorta
  const alto = innerHeight - 200, arriba = 0.47 * innerHeight - alto / 2;
  const tope = innerHeight - recorrido.offsetHeight - (mandos.hidden ? 58 : 0) - 18 + 52, bajo = Math.min(arriba + alto, tope);
  return { x: M.x - (estrecho ? 0.35 : 0.75), y: M.y, z: M.z, dist: 12, inclina: 4, gira: -4, alto: M.alto + 0.5, ancho: M.ancho + (estrecho ? 0.9 : 1.9), px: 0.5, py: (arriba + bajo) / 2 / innerHeight, util: [innerWidth - (estrecho ? 60 : 160), bajo - arriba] };
}
function camaraDe(ruta) {
  const [id, paso = ''] = ruta.split('/');
  if (id === 'taller') return camVista();
  if (paso === 'banco') return camBanco(enPantalla);
  return camMano(id, paso);
}
const OBJ = { taller: { sale: 0, banco: 0, gira: 0 }, '': { sale: 1, banco: 0, gira: -18 }, ficha: { sale: 1, banco: 0, gira: 38 }, banco: { sale: 1, banco: 1, gira: 0 } };
const muelles = new Muelles({ ...OBJ.taller, cam: camVista() }, { rigidez: 150, amort: 22.5 })
  .ritmo('cam', 110, 20).ritmo('sale', 100, 19).ritmo('banco', 95, 18.5);   // cada paso, en torno a un segundo

function colocar(v) {
  const sel = PROYECTOS[seleccion]?.id;
  for (const id of IDS) {
    const h = HE[id], r = h.raiz;
    if (id !== sel || v.sale < 0.001) {   // colgada, con su balanceo
      r.position.copy(h.casa); r.quaternion.setFromAxisAngle(Z3, R(h.a));
      continue;
    }
    // 1) fuera del gancho: un poco arriba y hacia delante; 2) a la mano, de pie y algo girada; 3) al banco, tumbada
    const s = v.sale, fuera = suave(0, 0.3, s), lleva = suave(0.25, 1, s);
    qH.setFromAxisAngle(Z3, R(h.a));
    pA.copy(h.casa).add(b3(0, -1.3 * fuera, 0.42 * fuera));
    qA.copy(quatB(6, v.gira, 0));
    pB.copy(b3(MANO.x, MANO.y, MANO.z)).sub(c1.copy(h.centro).applyQuaternion(qA));
    r.position.lerpVectors(pA, pB, lleva); r.position.y += Math.sin(Math.PI * lleva) * 0.6;
    r.quaternion.slerpQuaternions(qH, qA, lleva);
    if (v.banco > 0.001) {
      const b = suave(0, 1, v.banco);
      qB.copy(quatB(0, 0, 0)).multiply(new THREE.Quaternion().setFromAxisAngle(Z3, R(84)));
      // la punta (abajo del todo) contra el marco: con la herramienta tumbada, el centro queda medio largo a la izquierda
      pB.copy(b3(BANCO.x - h.largo / 2 + 0.1, BANCO.y, BANCO.z)).sub(c1.copy(h.centro).applyQuaternion(qB));
      const pM = r.position.clone();
      r.position.lerpVectors(pM, pB, b); r.position.y += Math.sin(Math.PI * b) * 0.9;
      r.quaternion.slerp(qB, b);
    }
  }
  D.orden.forEach((id, i) => { if (losetas[i]) losetas[i].uniforms.mezcla.value = id === sel ? suave(0, 0.3, v.sale) : 0; });
  const foco = sel ? suave(0.2, 1, v.sale) * (1 - v.banco) : 0;
  for (const m of fondoMats) m.uniforms.atenua.value = 1 - 0.5 * foco;   // la que está en la mano destaca sobre las colgadas
  const { util, ...c } = v.cam;
  S.encuadrar(c, { util: util ?? [innerWidth, innerHeight] });
}
const Z3 = new THREE.Vector3(0, 0, 1);

// ── El balanceo de lo colgado: un péndulo amortiguado por herramienta, con su propio bucle ──
let balanceando = false;
function empujon(id, fuerza) {
  HE[id].v += fuerza; if (balanceando || RM) return;
  balanceando = true; let t0 = performance.now();
  const paso = (t) => {
    const dt = Math.min(0.033, (t - t0) / 1000); t0 = t; let vivo = false;
    for (const h of Object.values(HE)) {
      if (!h.a && !h.v) continue;
      // amortiguado como un gancho de tablero: dos o tres vaivenes y quieto en un segundo y medio
      for (let i = 0; i < 3; i++) { h.v += (-55 * h.a - 5 * h.v) * dt / 3; h.a += h.v * dt / 3; }
      if (Math.abs(h.a) < 0.02 && Math.abs(h.v) < 0.05) { h.a = 0; h.v = 0; } else vivo = true;
    }
    marcha(vivo); S.pedirDibujo();
    if (vivo) requestAnimationFrame(paso); else { balanceando = false; marcha(); }
  };
  requestAnimationFrame(paso);
}

// ── Lo que se mueve ──
function marcha(extra = false) { S.enMarcha(muelles.corriendo || balanceando || extra); }
muelles.alMover = () => { marcha(); S.pedirDibujo(); };
muelles.alParar = () => { marcha(); S.pedirDibujo(); };
S.alDibujar = () => { colocar(muelles.v); seguirSolares(); seguirTele(); };

// ── Botones invisibles encima de cada herramienta colgada ──
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
  const ver = (rutas?.actual ?? 'taller') === 'taller';
  capa.hidden = !ver; if (!ver) { etiqueta.hidden = true; encima = ''; return; }   // oculta, no llega el pointerleave
  for (const id of IDS) {
    // el hueco entero de la silueta (más fácil de acertar que la herramienta sola)
    const [x, y, w, h] = rectDe(HE[id].caja), extra = Math.max(0, 54 - w) / 2;
    botones[id].style.cssText = `left:${x - extra}px;top:${y}px;width:${w + 2 * extra}px;height:${h}px`;
  }
  const b = capa.querySelector('.solar:hover, .solar:focus-visible'), p = b && porId(b.dataset.id);
  if (p) {
    const [x, y, w, h] = rectDe(HE[p.id].caja);
    etiqueta.querySelector('b').textContent = `${p.n} · ${p.tipo}`; etiqueta.querySelector('span').textContent = `${p.nombre}. ${p.linea}`;
    const ew = etiqueta.offsetWidth || 280, ex = Math.min(Math.max(8, x + w / 2 - ew / 2), innerWidth - ew - 8);
    const abajo = y + h + 8, ey = abajo + (etiqueta.offsetHeight || 70) > innerHeight - 8 ? y - (etiqueta.offsetHeight || 70) - 8 : abajo;
    etiqueta.style.transform = `translate(${Math.round(ex)}px, ${Math.round(ey)}px)`; etiqueta.hidden = false;
  } else etiqueta.hidden = true;
}
function asomar(id) {
  if (encima === id) return; encima = id;
  if (id) empujon(id, 34 * (Math.random() < 0.5 ? -1 : 1));
  S.pedirDibujo();
}
capa.addEventListener('pointerover', (e) => { const b = e.target.closest('.solar'); if (b && e.pointerType !== 'touch') asomar(b.dataset.id); });
capa.addEventListener('pointerleave', () => asomar(''));
// solo el foco de teclado asoma: el que se devuelve tras volver con el ratón no debe mover nada
capa.addEventListener('focusin', (e) => { const b = e.target.closest('.solar'); if (b && b.matches(':focus-visible')) asomar(b.dataset.id); });
capa.addEventListener('focusout', () => asomar(''));
capa.addEventListener('click', (e) => { const b = e.target.closest('.solar'); if (b) rutas.ir(b.dataset.id); });
capa.addEventListener('keydown', (e) => {
  const b = e.target.closest('.solar'); if (!b) return;
  const k = HE[b.dataset.id].hueco, cols = D.cols;
  const j = { ArrowRight: k + 1, ArrowLeft: k - 1, ArrowDown: k + cols, ArrowUp: k - cols, Home: 0, End: IDS.length - 1 }[e.key];
  if (j === undefined) return;
  e.preventDefault();
  const id = D.orden[j]; if (id && botones[id]) botones[id].focus();
});

// ── La ficha, la orden de trabajo y el recorrido ──
const ficha = $('.ficha-lateral'), cajetin = $('.cajetin'), recorrido = $('.recorrido'), pasos = $('.pasos'), dice = $('.dice'), heroe = $('.heroe');
pasos.innerHTML = PASOS.map((p, i) => `<button type="button" data-paso="${p.id}"><i>${i + 1}</i><span>${p.boton}</span></button>`).join('');
pasos.addEventListener('click', (e) => { const b = e.target.closest('[data-paso]'); if (b) rutas.ir(rutaDe(idActual(), b.dataset.paso)); });
document.addEventListener('click', (e) => {
  const a = e.target.closest('[data-ir]'); if (a) { e.preventDefault(); rutas.ir(a.dataset.ir); }
  const b = e.target.closest('[data-ir-paso]'); if (b) rutas.ir(rutaDe(idActual(), b.dataset.irPaso));
});
const rutaDe = (id, paso) => (paso ? `${id}/${paso}` : id);
const idActual = () => (rutas.actual ?? 'taller').split('/')[0];
const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const HERR = (id) => D.herramientas[id].nombre;
function pintarFicha(p) {
  ficha.style.setProperty('--c', p.color);
  ficha.querySelector('.fi-n').textContent = `Hueco ${p.n} · la ${HERR(p.id)}`;
  ficha.querySelector('.fi-nombre').textContent = p.nombre;
  ficha.querySelector('.fi-tipo').textContent = `${p.tipo} · ${p.estado}`;
  ficha.querySelector('.fi-linea').textContent = p.linea;
  ficha.querySelector('.fi-botones').innerHTML = `<button type="button" class="boton boton-luz" data-ir-paso="banco"><span class="boton-tapa">${p.demo ? 'Probarla en el banco' : 'Su tráiler, en el banco'}</span></button>
    <button type="button" class="boton boton-claro" data-ir-paso="ficha"><span class="boton-tapa">Su ficha</span></button>
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

// ── El monitor del banco ──
const tele = $('#tele'), mandos = $('.tele-mandos'), webTele = $('.tele-web');
let enTele = null, teleId = null, teleTurno = 0, enPantalla = false;
function seguirTele() {
  if (tele.hidden) return;
  // en el móvil y en la tableta en vertical, la demo ocupa la pantalla (en 3D quedaría a 400 px de ancho)
  if (movil() || innerHeight > innerWidth) { if (!tele.classList.contains('completa')) { desajustar(tele); tele.classList.add('completa'); } return; }
  tele.classList.remove('completa');
  // pegada al cristal por sus cuatro esquinas (la cámara lo mira algo girada: no es un rectángulo exacto)
  const g = 0.02, y = M.y - M.fondo / 2 + 0.005, x0 = M.x - M.ancho / 2 + g, x1 = M.x + M.ancho / 2 - g, z0 = M.z - M.alto / 2 + g, z1 = M.z + M.alto / 2 - g;
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

// ── Rutas: #taller, #<id>, #<id>/ficha, #<id>/banco ──
rutas = montarRutas({
  inicio: 'taller',
  validar(r) {
    if (!r || r === 'taller') return 'taller';
    const [id, paso = ''] = r.split('/');
    return porId(id) && PASOS.some((p) => p.id === paso) ? rutaDe(id, paso) : null;
  },
  alCambiar: (ruta, o) => irA(ruta, o),
});

let turno = 0, enCurso = 0;
const cerca = (campo, x, tol) => Math.abs(muelles.v[campo] - x) < tol;
function esperar(cond) { return new Promise((ok) => { const mira = () => (cond() ? ok() : requestAnimationFrame(mira)); mira(); }); }
async function fase(objetivo, campos, mio, tol = 0.02) {
  muelles.ir(objetivo);
  await esperar(() => mio !== turno || campos.every((c) => cerca(c, objetivo[c], tol)));
  return mio === turno;
}
async function irA(ruta, o) {
  const mio = ++turno; enCurso++;
  try { await irA_(ruta, o, mio); } finally { enCurso--; }
}
async function irA_(ruta, { inmediato }, mio) {
  const [id, paso = ''] = ruta.split('/');
  const p = porId(id), i = PROYECTOS.indexOf(p);
  document.documentElement.dataset.ruta = id === 'taller' ? 'taller' : paso || 'herramienta';
  const focoDentro = document.activeElement?.closest('.solares, .lista, .pasos, .ficha-lateral'), focoFuera = document.activeElement?.closest('.recorrido, .tele, .tele-mandos, .cajetin');
  const antes = PROYECTOS[seleccion];
  heroe.toggleAttribute('inert', id !== 'taller');
  recorrido.hidden = id === 'taller';
  ficha.hidden = !p || paso !== '';
  cajetin.hidden = !p || paso !== 'ficha';
  if (p) {
    for (const b of pasos.children) b.setAttribute('aria-current', b.dataset.paso === paso ? 'step' : 'false');
    dice.textContent = paso === 'banco' ? (p.demo ? 'En el monitor del banco: una simulación (personajes inventados; la mecánica es la del juego).' : 'En el monitor del banco: el tráiler del proyecto.') : PASOS.find((x) => x.id === paso).dice;
    pintarFicha(p);
  }
  if (focoDentro && p) requestAnimationFrame(() => pasos.querySelector('[aria-current="step"]')?.focus({ preventScroll: true }));
  if (id === 'taller' && focoFuera) requestAnimationFrame(() => { S.dibujar(); botones[antes?.id ?? IDS[0]]?.focus({ preventScroll: true }); });
  // fuera del banco, o con otra herramienta (la que había vuelve a su gancho), el monitor se apaga
  if (paso !== 'banco' || (seleccion >= 0 && seleccion !== i)) { apagarTele(); enPantalla = false; }
  const fin = id === 'taller' ? OBJ.taller : OBJ[paso];

  if (inmediato || RM) {
    seleccion = p ? i : -1;
    enPantalla = paso === 'banco';
    muelles.ir({ ...fin, cam: camaraDe(ruta) }, true);
    S.pedirDibujo();
    if (paso === 'banco') encenderTele(p, mio);
    return;
  }
  // 1) otra herramienta en la mano (o ninguna que hacer con ella): vuelve a su gancho
  const otra = seleccion >= 0 && (!p || seleccion !== i);
  if (otra && muelles.v.sale > 0.001) {
    const camVuelta = camVista();
    if (muelles.v.banco > 0.01) { if (!await fase({ banco: 0, gira: 0, cam: camMano(PROYECTOS[seleccion].id, '') }, ['banco'], mio, 0.03)) return; }
    if (!await fase({ sale: 0, gira: 0, cam: camVuelta }, ['sale'], mio, 0.006)) return;
  }
  if (!p) {
    seleccion = -1;
    muelles.ir({ ...OBJ.taller, cam: camVista() });
    return;
  }
  seleccion = i;
  const objetivo = { sale: 1, banco: fin.banco, gira: giroCercano(muelles.v.gira, fin.gira) };
  if (paso !== 'banco') { muelles.ir({ ...objetivo, cam: camaraDe(ruta) }); return; }
  // al banco: primero a la mano (si aún no estaba), luego al monitor; la pantalla se enciende al tocarlo
  if (muelles.v.sale < 0.9) { if (!await fase({ sale: 1, banco: 0, gira: 0, cam: camMano(id, '') }, ['sale'], mio, 0.05)) return; }
  if (!await fase({ ...objetivo, cam: camBanco(false) }, ['banco'], mio, 0.04)) return;
  enPantalla = true; muelles.ir({ cam: camBanco(true) });
  encenderTele(p, mio);
}

// teclado: ← → por los pasos, Esc vuelve uno atrás (también desde dentro de la pantalla)
addEventListener('keydown', (e) => {
  if (e.target.closest('input, textarea, dialog[open]')) return;
  if (e.target.closest('.tele') && e.key !== 'Escape') return;
  const r = rutas.actual; if (r === 'taller') return;
  const [id, paso = ''] = r.split('/'), k = PASOS.findIndex((p) => p.id === paso);
  if (e.key === 'ArrowRight' && k < PASOS.length - 1) { e.preventDefault(); rutas.ir(rutaDe(id, PASOS[k + 1].id)); }
  else if (e.key === 'ArrowLeft' && k > 0) { e.preventDefault(); rutas.ir(rutaDe(id, PASOS[k - 1].id)); }
  else if (e.key === 'Escape') { e.preventDefault(); rutas.ir(k > 0 ? rutaDe(id, PASOS[k - 1].id) : 'taller'); }
});

// arrastrar la herramienta en la mano para girarla; al soltar, vuelve a su postura
let arr = null;
$('#plato').addEventListener('pointerdown', (e) => {
  const paso = rutas.actual.split('/')[1] ?? '';
  if (rutas.actual === 'taller' || !['', 'ficha'].includes(paso) || e.button !== 0 || muelles.v.sale < 0.95) return;
  arr = { x: e.clientX, gira: muelles.obj.gira, id: e.pointerId, movido: false };
  e.currentTarget.setPointerCapture(e.pointerId);
});
$('#plato').addEventListener('pointermove', (e) => {
  if (!arr || e.pointerId !== arr.id) return;
  const dx = e.clientX - arr.x; if (!arr.movido && Math.abs(dx) < 5) return;
  arr.movido = true; document.documentElement.classList.add('arrastrando'); muelles.empujar('gira', arr.gira + dx * 0.6);
});
const soltar = (e) => {
  if (!arr || e.pointerId !== arr.id) return;
  arr = null; document.documentElement.classList.remove('arrastrando');
  const paso = rutas.actual.split('/')[1] ?? '';
  if (OBJ[paso]) muelles.empujar('gira', giroCercano(muelles.v.gira, OBJ[paso].gira));
};
$('#plato').addEventListener('pointerup', soltar); $('#plato').addEventListener('pointercancel', soltar);

// ── La lista de los nueve ──
const lista = $('.lista');
$('.lista-ol').innerHTML = PROYECTOS.map((p) => `<li><span class="li-n" style="--c:${p.color}">${p.n}</span>
  <div><b>${p.nombre}</b><span class="li-linea">${p.linea}</span><small>La ${HERR(p.id)} · ${p.tipo} · ${p.estado}</small></div>
  <span class="li-botones"><button type="button" class="boton boton-claro" data-sacar="${p.id}"><span class="boton-tapa">Descolgar</span></button>${p.demo ? `<button type="button" class="boton boton-luz" data-sacar="${p.id}/banco"><span class="boton-tapa">Probar</span></button>` : ''}</span></li>`).join('');
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
const redondo = (x) => Math.round(x * 1000) / 1000;
window.__estado = () => ({
  ruta: rutas.actual, seleccion, quieto: !muelles.corriendo && !enCurso && !balanceando,
  v: { sale: redondo(muelles.v.sale), banco: redondo(muelles.v.banco), gira: redondo(muelles.v.gira) },
  fuera: IDS.filter((id) => !HE[id].raiz.position.equals(HE[id].casa)).join(','),
  tele: !tele.hidden, enTele: enTele && (enTele === 'encendiendo' ? 'encendiendo' : 'encendida'),
  ficha: !ficha.hidden, cajetin: !cajetin.hidden,
});
