// El banco óptico, con el kit E1. Un banco de laboratorio: los nueve proyectos son nueve muestras en fila, cada una en
// su portamuestras, y por el carril corre una lente grande. Se desliza arrastrándola (o con las flechas) y, al pararse
// sobre una muestra, la enseña ampliada con su nombre. «La muestra» la mira de cerca; «por dentro» abate la lente y deja la hoja de observación (qué es, qué hice yo, el resultado, con qué está hecha); «en el visor» lleva
// la muestra a la platina del visor del banco, que se enciende con su demo (Adivinadle) o su tráiler. Un portamuestras
// libre espera a la siguiente.
//
// Como en las otras maquetas, todo sale de unos pocos valores con muelles (dónde está la lente, cuánto se ha abatido,
// cuánto ha viajado la muestra al visor, la cámara): nada tiene una posición guardada, se calcula en cada fotograma,
// así que volver a mitad o entrar por un enlace directo dejan siempre el banco en un estado posible.
import { montarEscena, THREE, RM, b3 } from '../../../kit-e1/js/motor.js';
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
  { id: '', boton: 'La muestra', dice: 'A través de la lente, ampliada. Arrastra la lente para pasar a otra.' },
  { id: 'ficha', boton: 'Por dentro', dice: 'La lente, abatida: la hoja de observación dice qué es, qué hice yo, el resultado y con qué está hecha.' },
  { id: 'visor', boton: 'En el visor', dice: '' },
];
const IDS = PROYECTOS.map((p) => p.id), N = IDS.length;

// ── Arranque ──
await C.cargar();
let seleccion = -1, rutas = null;
const S = await montarEscena({
  plato: $('#plato'), luz: 'luz/', fondo: '#1b2026', exposicion: 1.0,
  etiqueta: 'Un banco óptico de laboratorio: nueve muestras en fila, cada una en su portamuestras, y una lente grande que corre por un carril y las amplía; a la derecha, el visor del banco',
  material(n, { textura }) {
    if (n === 'imp_mesa') return { luz: 'mesa', mapa: textura('mesa', I.TAM.mesa), brillo: 0.1 };
    if (n === 'imp_regla') return { luz: 'mesa', mapa: textura('regla', I.TAM.regla), brillo: 0.2 };
    if (n.startsWith('imp_muestra_')) return { luz: 'muestras', mapa: textura('muestras', I.TAM.muestras), brillo: 0.06 };
    if (n === 'cristal_lente') return { mapa: textura('lupa', I.TAM.lupa), brillo: 0.5 };
    if (n === 'pantalla_cara') return { color: '#000000', emite: '#0b0d11' };
    if (n === 'luz_fuente') return { color: '#000000', emite: '#ffe9c4' };
    if (n.startsWith('lente_')) return { luz: 'lente', brillo: 0.35 };
    if (n === 'banco_metal_unido') return { luz: 'banco', brillo: 0.4 };
    if (n.startsWith('banco_')) return { luz: 'banco', brillo: 0.08 };
    return { luz: 'pared' };
  },
});
const { nodo, lienzos, texturas } = S;
const D = S.datos, M = D.monitor, U = D.muestra, L = D.lente, P = D.platina;
const xs = (i) => D.x0 + D.paso * i;
I.mesa(lienzos.mesa, D); texturas.mesa.needsUpdate = true;
I.regla(lienzos.regla, D); texturas.regla.needsUpdate = true;
I.muestras(lienzos.muestras, () => { texturas.muestras.needsUpdate = true; S.pedirDibujo(); });
I.lupa(lienzos.lupa, () => { texturas.lupa.needsUpdate = true; S.pedirDibujo(); });

// las piezas que se mueven: el carro de la lente, su cabeza (se abate) y la lámina de cada muestra
const carro = nodo.lente, cabeza = nodo.lente_cabeza, cristal = nodo.cristal_lente;
const laminas = D.orden.map((_, i) => nodo[`imp_muestra_${i}`]);
const casaLamina = laminas.map((l) => l.position.clone());
const propios = new Set([...laminas.map((l) => l.material), cristal.material, ...['lente_carro_unido', 'lente_cabeza_unida'].map((n) => nodo[n]?.material)]);
const fondoMats = S.mats.filter((m) => !propios.has(m) && m.uniforms);

// lo que se ve por la lente: el cristal enseña un trozo de la tira ampliada, que corre con la lente
const uvC = cristal.geometry.attributes.uv, posC = cristal.geometry.attributes.position, baseU = new Float32Array(uvC.count);
cristal.geometry.computeBoundingBox();
{ const bb = cristal.geometry.boundingBox, cx = (bb.min.x + bb.max.x) / 2, cy = (bb.min.y + bb.max.y) / 2, d = bb.max.x - bb.min.x;
  // el campo que cabe en el círculo: el cuadrado de la muestra ampliada, algo recortado en las esquinas
  for (let k = 0; k < uvC.count; k++) { baseU[k] = (posC.getX(k) - cx) / d * 0.94; uvC.setY(k, 0.5 - (posC.getY(k) - cy) / d * 0.94); } }
let uvPuesta = NaN;
function ponerLupa(lx) {
  const s = Math.min(D.orden.length - 0.5, Math.max(-0.5, lx));
  if (Math.abs(s - uvPuesta) < 1e-4) return; uvPuesta = s;
  for (let k = 0; k < uvC.count; k++) uvC.setX(k, (s + 0.5 + baseU[k]) / D.orden.length);
  uvC.needsUpdate = true;
}

// ── Las cámaras ──
const bordeIzq = (sel) => { const h = document.querySelector(sel); return h.offsetLeft + h.offsetWidth; };
function huecoBajo(sel, abajo = innerHeight - 24) {
  const h = document.querySelector(sel), arriba = h.offsetTop + h.offsetHeight + 12;
  return [innerWidth - 24, Math.max(160, abajo - arriba), (arriba + abajo) / 2];
}
// el banco: la cámara acompaña a la lente, así las muestras se ven de un tamaño que se lee en cualquier pantalla
function camVista(lx) {
  const x = xs(lx);
  const c = { x: x * 0.88 + 0.4, y: -0.6, z: 2.0, dist: 40, inclina: 9, gira: 0, alto: 6.4, ancho: 15 };
  if (movil()) { const [w, h, yc] = huecoBajo('.heroe', innerHeight - 96); return { ...c, x, alto: 6.0, ancho: 6.6, px: 0.5, py: yc / innerHeight, util: [w + 16, h] }; }
  if (apilado()) { const [w, h, yc] = huecoBajo('.heroe', innerHeight - 96); return { ...c, x: x * 0.8 + 0.4, ancho: 12.5, px: 0.5, py: yc / innerHeight, util: [w - 24, h] }; }
  const hd = bordeIzq('.heroe');
  return { ...c, px: (hd + innerWidth) / 2 / innerWidth, py: 0.5, util: [innerWidth - hd - 48, innerHeight - 190] };
}
function camMuestra(i, paso) {
  const c = { x: xs(i), y: -0.8, z: 2.2, dist: 17, inclina: 5, gira: 0, alto: 4.4, ancho: 3.6 };
  if (paso === 'ficha') Object.assign(c, { z: 1.9, alto: 4.9, inclina: 14, ancho: 3.4 });
  if (movil()) {
    if (paso === 'ficha') { const top = 62, bot = innerHeight * 0.5; return { ...c, px: 0.5, py: (top + bot) / 2 / innerHeight, util: [innerWidth - 24, bot - top - 8] }; }
    const [w, h, yc] = huecoBajo('.ficha-lateral', innerHeight - 84); return { ...c, px: 0.5, py: yc / innerHeight, util: [w, h] };
  }
  if (paso === 'ficha') { const libre = $('.cajetin').offsetLeft || innerWidth * 0.6; return { ...c, px: libre / 2 / innerWidth, py: 0.5, util: [libre - 60, innerHeight - 190] }; }
  const hd = bordeIzq('.ficha-lateral');
  return { ...c, px: (hd + innerWidth) / 2 / innerWidth, py: 0.5, util: [innerWidth - hd - 60, innerHeight - 190] };
}
function camVisor(cerca) {
  if (!cerca) return { x: M.x - 2.4, y: M.y, z: M.z - 0.5, dist: 22, inclina: 10, gira: -8, alto: 6.4, ancho: 11, px: 0.5, py: 0.5, util: [innerWidth, innerHeight - 100] };
  if (movil()) return { x: M.x - 0.8, y: M.y, z: M.z, dist: 13, inclina: 4, gira: -4, alto: M.alto + 1.2, ancho: M.ancho + 2.4, px: 0.5, py: 0.4, util: [innerWidth, innerHeight - 140] };
  const estrecho = innerWidth < 1100;   // en tableta, la platina asoma menos y la pantalla gana ancho
  // la pantalla, nunca bajo el recorrido (que crece con los mandos al encenderla): si sube más, el encuadre se acorta
  const alto = innerHeight - 200, arriba = 0.47 * innerHeight - alto / 2;
  const tope = innerHeight - recorrido.offsetHeight - (mandos.hidden ? 58 : 0) - 18 + 52, bajo = Math.min(arriba + alto, tope);
  return { x: M.x - (estrecho ? 0.35 : 0.8), y: M.y, z: M.z, dist: 13, inclina: 4, gira: -4, alto: M.alto + 0.5, ancho: M.ancho + (estrecho ? 0.9 : 2.0), px: 0.5, py: (arriba + bajo) / 2 / innerHeight, util: [innerWidth - (estrecho ? 60 : 160), bajo - arriba] };
}
function camaraDe(ruta) {
  const [id, paso = ''] = ruta.split('/');
  if (id === 'banco') return camVista(muelles.obj.lx);
  if (paso === 'visor') return camVisor(enPantalla);
  return camMuestra(IDS.indexOf(id), paso);
}
const muelles = new Muelles({ lx: 0, aparta: 0, visor: 0, cam: {} }, { rigidez: 150, amort: 22.5 })
  .ritmo('cam', 105, 20).ritmo('lx', 70, 16.5).ritmo('aparta', 120, 20).ritmo('visor', 80, 17.5);   // la lente, con su resistencia
muelles.v.cam = camVista(0); muelles.obj.cam = camVista(0);

const X3 = new THREE.Vector3(1, 0, 0), R = THREE.MathUtils.degToRad;
const casaCarroX = 0;
function colocar(v) {
  carro.position.x = casaCarroX + xs(v.lx);
  cabeza.quaternion.setFromAxisAngle(X3, R(-88) * suave(0, 1, v.aparta));      // se abate hacia atrás, bajo las muestras
  ponerLupa(v.lx);
  // la muestra elegida viaja a la platina del visor: sale por arriba de su marco y baja entre las pinzas
  laminas.forEach((l, i) => {
    if (i !== seleccion || v.visor < 0.001) { l.position.copy(casaLamina[i]); return; }
    const t = suave(0, 1, v.visor), sube = suave(0, 0.35, v.visor) * (1 - suave(0.7, 1, v.visor));
    l.position.copy(casaLamina[i]).add(b3((P.x - xs(i)) * suave(0.2, 0.85, v.visor), (P.y - U.y) * t, (P.z - U.z) * t + 2.1 * sube));
  });
  const foco = seleccion >= 0 ? 1 - v.visor : 0, hacia = suave(0, 1, Math.min(1, Math.abs(v.lx - seleccion)));
  laminas.forEach((l, i) => { l.material.uniforms.atenua.value = seleccion < 0 || i === seleccion ? 1 : 1 - 0.45 * foco * (1 - hacia); });
  for (const m of fondoMats) m.uniforms.atenua.value = 1 - 0.3 * foco * (1 - hacia);
  cristal.material.uniforms.atenua.value = 1 - 0.55 * suave(0.3, 1, v.aparta);
  const { util, ...c } = v.cam;
  S.encuadrar(c, { util: util ?? [innerWidth, innerHeight] });
}

// ── Lo que se mueve ──
function marcha(extra = false) { S.enMarcha(muelles.corriendo || extra); }
muelles.alMover = () => { marcha(); S.pedirDibujo(); };
muelles.alParar = () => { marcha(); S.pedirDibujo(); };
S.alDibujar = () => { colocar(muelles.v); seguirSolares(); seguirTele(); };

// ── Botones invisibles: uno por muestra y otro encima de la lente (se arrastra) ──
const capa = $('#solares'), etiqueta = $('.etiqueta'), lenteB = $('#lente-b');
capa.innerHTML = IDS.map((id) => { const p = porId(id); return `<button type="button" class="solar" data-id="${id}" aria-label="${p.nombre}: ${p.linea}"></button>`; }).join('');
const botones = Object.fromEntries([...capa.children].map((b) => [b.dataset.id, b]));
function rectDe(x0, y, z0, x1, z1) {
  const [ax, ay] = S.aPantalla(x0, y, z1), [bx, by] = S.aPantalla(x1, y, z0);
  return [ax, ay, bx - ax, by - ay];
}
const lenteEn = () => Math.min(D.orden.length - 1, Math.max(0, Math.round(muelles.obj.lx)));
function seguirSolares() {
  const r = rutas?.actual ?? 'banco', enBanco = r === 'banco', enMuestra = !enBanco && !r.includes('/');
  capa.hidden = !enBanco;
  lenteB.hidden = !(enBanco || enMuestra);
  if (!lenteB.hidden) {
    const x = xs(muelles.v.lx), [lx, ly, lw, lh] = rectDe(x - L.aro, D.carril.y, L.z - L.aro, x + L.aro, L.z + L.aro);
    lenteB.style.cssText = `left:${lx}px;top:${ly}px;width:${lw}px;height:${lh}px`;
    const p = PROYECTOS[lenteEn()];
    lenteB.setAttribute('aria-label', `La lente, sobre ${p ? p.nombre : 'el portamuestras libre'}. Flechas para deslizarla${enBanco && p ? '; Intro para observarla' : ''}.`);
  }
  if (!enBanco) { etiqueta.hidden = true; return; }
  for (const id of IDS) {
    const x = xs(IDS.indexOf(id)), [bx, by, bw, bh] = rectDe(x - U.ancho / 2 - 0.15, U.y, 0.1, x + U.ancho / 2 + 0.15, U.z + U.alto / 2 + 0.15);
    botones[id].style.cssText = `left:${bx}px;top:${by}px;width:${bw}px;height:${bh}px`;
  }
  // el rótulo de la muestra que tiene la lente encima, bajo el carro, cuando la lente se ha parado
  const i = lenteEn(), p = PROYECTOS[i], parada = Math.abs(muelles.v.lx - i) < 0.12;
  etiqueta.querySelector('b').textContent = p ? `${p.n} · ${p.tipo}` : '10 · Libre';
  etiqueta.querySelector('span').textContent = p ? `${p.nombre}. ${p.linea}` : 'Un portamuestras libre: aquí va el siguiente proyecto.';
  const [ex, ey] = S.aPantalla(xs(muelles.v.lx), D.carril.y - 0.6, 0), ew = etiqueta.offsetWidth || 280;
  const px = Math.min(Math.max(8, ex - ew / 2), innerWidth - ew - 8), tope = innerHeight - (etiqueta.offsetHeight || 70) - 8;
  etiqueta.style.transform = `translate(${Math.round(px)}px, ${Math.round(Math.min(ey + 10, tope))}px)`;
  etiqueta.hidden = false; etiqueta.classList.toggle('lejos', !parada);
}
// llevar la lente a una muestra (sin abrirla); en el banco la cámara la acompaña
function deslizar(i) {
  i = Math.min(D.orden.length - 1, Math.max(0, i));
  muelles.ir({ lx: i, ...(rutas.actual === 'banco' && { cam: camVista(i) }) });
}
capa.addEventListener('focusin', (e) => { const b = e.target.closest('.solar'); if (b && b.matches(':focus-visible')) deslizar(IDS.indexOf(b.dataset.id)); });
// con el ratón, la lente acude a la muestra sobre la que te paras (un instante después, para no perseguir al cursor)
let acudeT = 0;
capa.addEventListener('pointerover', (e) => {
  const b = e.target.closest('.solar'); if (!b || e.pointerType === 'touch' || arr) return;
  clearTimeout(acudeT); acudeT = setTimeout(() => { if (rutas.actual === 'banco' && !arr) deslizar(IDS.indexOf(b.dataset.id)); }, 140);
});
capa.addEventListener('pointerleave', () => clearTimeout(acudeT));
capa.addEventListener('click', (e) => { const b = e.target.closest('.solar'); if (b) rutas.ir(b.dataset.id); });
capa.addEventListener('keydown', (e) => {
  const b = e.target.closest('.solar'); if (!b) return;
  const k = IDS.indexOf(b.dataset.id), j = { ArrowRight: k + 1, ArrowLeft: k - 1, Home: 0, End: N - 1 }[e.key];
  if (j === undefined) return;
  e.preventDefault(); botones[IDS[j]]?.focus();
});

// arrastrar la lente por el carril: va con muelle (cede y sigue), y al soltarla se queda en la muestra más cercana
let arr = null;
const pxPorMuestra = () => Math.max(20, S.aPantalla(xs(1), D.carril.y, L.z)[0] - S.aPantalla(xs(0), D.carril.y, L.z)[0]);
function soltarEn(i) {
  const r = rutas.actual;
  if (r === 'banco') { deslizar(i); return; }
  const j = Math.min(N - 1, i);                                 // con una muestra abierta, la lente se queda en otra muestra
  if (IDS[j] === r) muelles.ir({ lx: j }); else rutas.ir(IDS[j]);
}
lenteB.addEventListener('pointerdown', (e) => {
  if (e.button !== 0) return;
  arr = { x: e.clientX, lx: muelles.v.lx, id: e.pointerId, movido: false, px: pxPorMuestra() };
  try { lenteB.setPointerCapture(e.pointerId); } catch { /* un puntero que ya no está: se sigue sin capturarlo */ }
});
lenteB.addEventListener('pointermove', (e) => {
  if (!arr || e.pointerId !== arr.id) return;
  const dx = e.clientX - arr.x; if (!arr.movido && Math.abs(dx) < 5) return;
  arr.movido = true; document.documentElement.classList.add('arrastrando');
  const lx = Math.min(D.orden.length - 0.7, Math.max(-0.3, arr.lx + dx / arr.px));
  muelles.ir({ lx, ...(rutas.actual === 'banco' && { cam: camVista(lx) }) });
});
const soltar = (e) => {
  if (!arr || e.pointerId !== arr.id) return;
  const movido = arr.movido; arr = null; document.documentElement.classList.remove('arrastrando');
  if (movido) { soltarEn(lenteEn()); lenteB.dataset.arrastrada = '1'; setTimeout(() => delete lenteB.dataset.arrastrada, 0); }
};
lenteB.addEventListener('pointerup', soltar); lenteB.addEventListener('pointercancel', soltar);
lenteB.addEventListener('click', () => {
  if (lenteB.dataset.arrastrada || rutas.actual !== 'banco') return;
  const p = PROYECTOS[lenteEn()]; if (p) rutas.ir(p.id);
});
lenteB.addEventListener('keydown', (e) => {
  const d = { ArrowRight: 1, ArrowLeft: -1 }[e.key]; if (!d) return;
  e.preventDefault(); e.stopPropagation(); soltarEn(lenteEn() + d);
});
// la rueda (o el gesto a los lados) también la desliza, de muestra en muestra
let ruedaT = 0;
addEventListener('wheel', (e) => {
  if (rutas.actual !== 'banco' || e.target.closest?.('dialog, .cajetin')) return;
  const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY, t = performance.now();
  if (Math.abs(d) < 8 || t - ruedaT < 160) return; ruedaT = t;
  deslizar(lenteEn() + Math.sign(d));
}, { passive: true });

// ── La ficha, la hoja de observación y el recorrido ──
const ficha = $('.ficha-lateral'), cajetin = $('.cajetin'), recorrido = $('.recorrido'), pasos = $('.pasos'), dice = $('.dice'), heroe = $('.heroe');
pasos.innerHTML = PASOS.map((p, i) => `<button type="button" data-paso="${p.id}"><i>${i + 1}</i><span>${p.boton}</span></button>`).join('');
pasos.addEventListener('click', (e) => { const b = e.target.closest('[data-paso]'); if (b) rutas.ir(rutaDe(idActual(), b.dataset.paso)); });
document.addEventListener('click', (e) => {
  const a = e.target.closest('[data-ir]'); if (a) { e.preventDefault(); rutas.ir(a.dataset.ir); }
  const b = e.target.closest('[data-ir-paso]'); if (b) rutas.ir(rutaDe(idActual(), b.dataset.irPaso));
});
const rutaDe = (id, paso) => (paso ? `${id}/${paso}` : id);
const idActual = () => (rutas.actual ?? 'banco').split('/')[0];
const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
function pintarFicha(p) {
  ficha.style.setProperty('--c', p.color);
  ficha.querySelector('.fi-n').textContent = `Muestra ${p.n} · ×10`;
  ficha.querySelector('.fi-nombre').textContent = p.nombre;
  ficha.querySelector('.fi-tipo').textContent = `${p.tipo} · ${p.estado}`;
  ficha.querySelector('.fi-linea').textContent = p.linea;
  ficha.querySelector('.fi-botones').innerHTML = `<button type="button" class="boton boton-luz" data-ir-paso="visor"><span class="boton-tapa">${p.demo ? 'Probarla en el visor' : 'Su tráiler, en el visor'}</span></button>
    <button type="button" class="boton boton-claro" data-ir-paso="ficha"><span class="boton-tapa">Verla por dentro</span></button>
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

// ── El visor del banco ──
const tele = $('#tele'), mandos = $('.tele-mandos'), webTele = $('.tele-web');
let enTele = null, teleId = null, teleTurno = 0, enPantalla = false;
function seguirTele() {
  if (tele.hidden) return;
  // en el móvil y en la tableta en vertical, la demo ocupa la pantalla (en 3D quedaría a 400 px de ancho)
  if (movil() || innerHeight > innerWidth) { if (!tele.classList.contains('completa')) { desajustar(tele); tele.classList.add('completa'); } return; }
  tele.classList.remove('completa');
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

// ── Rutas: #banco, #<id>, #<id>/ficha, #<id>/visor ──
rutas = montarRutas({
  inicio: 'banco',
  validar(r) {
    if (!r || r === 'banco') return 'banco';
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
  document.documentElement.dataset.ruta = id === 'banco' ? 'banco' : paso || 'muestra';
  const focoDentro = document.activeElement?.closest('.solares, .lente-b, .lista, .pasos, .ficha-lateral'), focoFuera = document.activeElement?.closest('.recorrido, .tele, .tele-mandos, .cajetin');
  const antes = PROYECTOS[seleccion];
  heroe.toggleAttribute('inert', id !== 'banco');
  recorrido.hidden = id === 'banco';
  ficha.hidden = !p || paso !== '';
  cajetin.hidden = !p || paso !== 'ficha';
  if (p) {
    for (const b of pasos.children) b.setAttribute('aria-current', b.dataset.paso === paso ? 'step' : 'false');
    dice.textContent = paso === 'visor' ? (p.demo ? 'En el visor del banco: una simulación (personajes inventados; la mecánica es la del juego).' : 'En el visor del banco: el tráiler del proyecto.') : PASOS.find((x) => x.id === paso).dice;
    pintarFicha(p);
  }
  if (focoDentro && p && !arrastreReciente()) requestAnimationFrame(() => pasos.querySelector('[aria-current="step"]')?.focus({ preventScroll: true }));
  if (id === 'banco' && focoFuera) requestAnimationFrame(() => { S.dibujar(); botones[antes?.id ?? IDS[0]]?.focus({ preventScroll: true }); });
  // fuera del visor, o con otra muestra (la que había vuelve a su marco), la pantalla se apaga
  if (paso !== 'visor' || (seleccion >= 0 && seleccion !== i)) { apagarTele(); enPantalla = false; }
  const fin = { lx: p ? i : muelles.obj.lx, aparta: p && paso !== '' ? 1 : 0, visor: paso === 'visor' ? 1 : 0 };

  if (inmediato || RM) {
    seleccion = p ? i : -1;
    enPantalla = paso === 'visor';
    muelles.ir(fin, true); muelles.ir({ cam: camaraDe(ruta) }, true);
    S.pedirDibujo();
    if (paso === 'visor') encenderTele(p, mio);
    return;
  }
  // 1) otra muestra en el visor (o ninguna que llevar): la que hay vuelve a su marco
  const otra = seleccion >= 0 && (!p || seleccion !== i);
  if (otra && muelles.v.visor > 0.01) {
    if (!await fase({ visor: 0, cam: camVisor(false) }, ['visor'], mio, 0.03)) return;
  }
  if (!p) {
    seleccion = -1;
    muelles.ir({ ...fin, cam: camVista(muelles.obj.lx) });
    return;
  }
  seleccion = i;
  if (paso !== 'visor') { muelles.ir({ ...fin, cam: camaraDe(ruta) }); return; }
  // al visor: la lente va a su muestra y se abate (si no lo estaba); luego la muestra viaja y la pantalla se enciende
  if (!cerca('lx', i, 0.1) || muelles.v.aparta < 0.8) { if (!await fase({ lx: i, aparta: 1, visor: 0, cam: camMuestra(i, '') }, ['lx', 'aparta'], mio, 0.12)) return; }
  if (!await fase({ ...fin, cam: camVisor(false) }, ['visor'], mio, 0.05)) return;
  enPantalla = true; muelles.ir({ cam: camVisor(true) });
  encenderTele(p, mio);
}
function arrastreReciente() { return !!lenteB.dataset.arrastrada || document.activeElement === lenteB; }

// teclado: ← → por los pasos, Esc vuelve uno atrás (también desde dentro de la pantalla)
addEventListener('keydown', (e) => {
  if (e.target.closest('input, textarea, dialog[open]')) return;
  if (e.target.closest('.tele') && e.key !== 'Escape') return;
  const r = rutas.actual; if (r === 'banco') return;
  const [id, paso = ''] = r.split('/'), k = PASOS.findIndex((p) => p.id === paso);
  if (e.key === 'ArrowRight' && k < PASOS.length - 1) { e.preventDefault(); rutas.ir(rutaDe(id, PASOS[k + 1].id)); }
  else if (e.key === 'ArrowLeft' && k > 0) { e.preventDefault(); rutas.ir(rutaDe(id, PASOS[k - 1].id)); }
  else if (e.key === 'Escape') { e.preventDefault(); rutas.ir(k > 0 ? rutaDe(id, PASOS[k - 1].id) : 'banco'); }
});

// ── La lista de los nueve ──
const lista = $('.lista');
$('.lista-ol').innerHTML = PROYECTOS.map((p) => `<li><span class="li-n" style="--c:${p.color}">${p.n}</span>
  <div><b>${p.nombre}</b><span class="li-linea">${p.linea}</span><small>Muestra ${p.n} · ${p.tipo} · ${p.estado}</small></div>
  <span class="li-botones"><button type="button" class="boton boton-claro" data-sacar="${p.id}"><span class="boton-tapa">Observar</span></button>${p.demo ? `<button type="button" class="boton boton-luz" data-sacar="${p.id}/visor"><span class="boton-tapa">Probar</span></button>` : ''}</span></li>`).join('');
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
  ruta: rutas.actual, seleccion, quieto: !muelles.corriendo && !enCurso,
  v: { lx: redondo(muelles.v.lx), aparta: redondo(muelles.v.aparta), visor: redondo(muelles.v.visor) },
  lente: lenteEn(),
  fuera: laminas.map((l, i) => (l.position.equals(casaLamina[i]) ? '' : D.orden[i])).filter(Boolean).join(','),
  tele: !tele.hidden, enTele: enTele && (enTele === 'encendiendo' ? 'encendiendo' : 'encendida'),
  ficha: !ficha.hidden, cajetin: !cajetin.hidden,
});
window.__paso = pxPorMuestra;     // para las pruebas: cuántos píxeles hay entre dos muestras a la altura de la lente
