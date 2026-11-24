// El cajón de discos, con el kit E1. El mostrador de una tienda de discos: un cajón de nogal con nueve vinilos, uno por
// proyecto, un tocadiscos y, en la pared, la tele de los videoclips. Se hojea como en una tienda (la rueda, las flechas
// o el dedo: los discos de delante caen hacia ti); se saca uno y se ve su portada; dado la vuelta, la contraportada con
// los créditos; y pincharlo es llevarlo al tocadiscos: la funda va al atril de «sonando», el disco al plato, baja la
// aguja y en la tele sale su demo (Adivinadle) o su tráiler.
//
// Todo sale de unos pocos valores con muelles (hasta dónde se ha hojeado, cuánto se ha sacado el disco, si está dado
// la vuelta, cuánto se ha pinchado, la aguja y la cámara); las piezas no tienen posición guardada.
import { montarEscena, THREE, RM, b3 } from '../../../kit-e1/js/motor.js';
import { Muelles, suave, mezclar } from '../../../kit-e1/js/muelles.js';
import { montarRutas } from '../../../kit-e1/js/rutas.js';
import * as C from '../../../kit-e1/js/coleccion.js';
import { PROYECTOS, porId } from '../../../kit-e1/js/datos.js';
import { encender, apagarYa } from '../../../kit-e1/js/pantalla.js';
import { ajustar, desajustar } from '../../../kit-e1/js/proyectar.js';
import * as I from './impresos.js';

const $ = (s) => document.querySelector(s);
const movil = () => innerWidth < 760;
const N = PROYECTOS.length;
const PASOS = [
  { id: '', boton: 'La portada', dice: 'La portada del disco. Dale la vuelta para ver los créditos, o pínchalo.' },
  { id: 'creditos', boton: 'Los créditos', dice: 'La contraportada: qué es, qué hice yo, el resultado y con qué está hecho.' },
  { id: 'cara-a', boton: 'Pincharlo', dice: '' },
];
const DEG = Math.PI / 180;

// ── Arranque ──
await C.cargar();
let rutas = null;
const S = await montarEscena({
  plato: $('#plato'), luz: 'luz/', fondo: '#1d1916', exposicion: 1.0,
  etiqueta: 'El mostrador de una tienda de discos: un cajón de nogal con nueve vinilos, uno por proyecto, un tocadiscos y una tele en la pared',
  material(n, { textura }) {
    // lo que la escena une para la web: <lámina>_unida[n][_b<brillo en centésimas>]
    const u = n.match(/^(tienda|cajon|toca|tele|funda|disco)_unida\d*(?:_b(\d+))?$/);
    if (u) return { luz: u[1] === 'funda' ? 'fundas' : u[1], ...(u[2] && { brillo: +u[2] / 100 }) };
    let m = n.match(/^funda_(\d+)_(cara|dorso)$/);
    if (m) return { luz: 'fundas', mapa: textura(`${m[2] === 'cara' ? 'portada' : 'dorso'}_${m[1]}`, I.TAM[m[2] === 'cara' ? 'portada' : 'dorso']), brillo: 0.12 };
    if (n.startsWith('funda_')) return { luz: 'fundas' };
    if (n === 'disco_cara' || n === 'disco_dorso') return { luz: 'disco', mapa: textura('disco', I.TAM.disco), brillo: 0.55 };
    if (n.startsWith('disco_')) return { luz: 'disco', brillo: 0.4 };
    if (n === 'tele_cara') return { color: '#000000', emite: '#0b0d11' };
    if ((m = n.match(/^expositor_(\d)$/))) return { luz: 'tienda', mapa: textura(`expositor_${m[1]}`, I.TAM.expositor) };
    if (n === 'rotulo_cara') return { luz: 'tienda', mapa: textura('rotulo', I.TAM.rotulo), brillo: 0.2 };
    if (n === 'atril_cara') return { luz: 'tienda', mapa: textura('atril', I.TAM.atril) };
    if (n === 'placa_cara') return { luz: 'cajon', mapa: textura('placa', I.TAM.placa), brillo: 0.4 };
    if (n === 'tienda_lampara_bombilla') return { luz: 'tienda', emite: '#8a6a3a' };
    if (n.startsWith('tienda_')) return { luz: 'tienda', brillo: /laton|lampara_pantalla|canto|atril_liston|escuadra/.test(n) ? 0.3 : 0.05 };
    if (n.startsWith('cajon_')) return { luz: 'cajon', brillo: /asa|placa/.test(n) ? 0.3 : 0.05 };
    if (n.startsWith('toca_')) return { luz: 'toca', brillo: /plato|brazo|eje|reposo|mando|placa/.test(n) ? 0.45 : 0.06 };
    if (n.startsWith('tele_')) return { luz: 'tele', brillo: /marco|escuadra/.test(n) ? 0.3 : 0.06 };
    return { luz: 'tienda' };
  },
});
const { nodo, lienzos, texturas } = S;
const D = S.datos, L = D.funda.lado, CJ = D.cajon, INC = D.inclina;
const pintar = (id) => { texturas[id].needsUpdate = true; };

// lo impreso: las fundas (portada y contraportada de cada una), el disco del que se pincha y el adorno de la tienda
I.rotulo(lienzos.rotulo); pintar('rotulo'); I.placa(lienzos.placa); pintar('placa'); I.atril(lienzos.atril); pintar('atril');
for (let k = 0; k < 3; k++) { I.expositor(lienzos[`expositor_${k}`], k); pintar(`expositor_${k}`); }
Promise.all(PROYECTOS.map(async (p, i) => {
  await Promise.all([I.portada(lienzos[`portada_${i}`], p), I.dorso(lienzos[`dorso_${i}`], p)]);
  pintar(`portada_${i}`); pintar(`dorso_${i}`);
})).then(() => S.pedirDibujo());
let discoDe = -1;
function pintarDisco(i) { if (i === discoDe || i < 0) return; discoDe = i; I.disco(lienzos.disco, PROYECTOS[i]); pintar('disco'); }

const fundas = PROYECTOS.map((_, i) => nodo[`funda_${i}`]);
const disco = nodo.disco, brazo = nodo.brazo;

// ── Dónde va cada cosa (en coordenadas de Blender) ──
const SACADA = { x: CJ.x, y: -4.6, z: 3.3 };                 // el pie de la funda sacada, delante del cajón, a la altura de la cara
const ALZA = 3.2;                                            // lo que sube la funda para salir del cajón
const A = D.atril, P = D.plato;
const ATRIL = [SACADA, { x: A.x, y: SACADA.y, z: SACADA.z }, { x: A.x, y: A.y, z: 0 }];
const ENCIMA = { x: P.x, y: P.y, z: P.z + 2.4 };             // el disco, encima del plato antes de bajar
const qPlano = new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI / 2, 0, 0));   // tumbado, la cara A arriba
const qGiro = new THREE.Quaternion(), qTmp = new THREE.Quaternion(), eje = new THREE.Vector3(0, 0, 1), v3 = new THREE.Vector3();

// la inclinación de cada funda (grados, + hacia atrás) según hasta dónde se ha hojeado: las de delante, caídas (la
// primera apoyada en el frente del cajón y cada una en la anterior, sin atravesarla); la que se mira, algo echada
// hacia atrás; y las de detrás, de pie
function inclinaciones(hoja) {
  const a = [];
  let previa = null;
  for (let i = 0; i < N; i++) {
    const t = suave(0, 1, hoja - i);                                   // 1: caída
    const dePie = mezclar(INC.detras, INC.mirada, suave(0, 1, 1 - Math.abs(i - hoja)));
    let caida = -INC.caida;                                            // hacia delante, en positivo
    if (previa !== null) {
      // apoyada en la anterior: el ángulo con el que su borde de arriba toca la cara de detrás de la otra
      const ap = previa * DEG, dy = (D.fundas_y[i] - D.fundas_y[i - 1]) + L * Math.sin(ap) - 0.05;
      caida = Math.max(-INC.caida, Math.atan2(dy, L * Math.cos(ap)) / DEG);
    }
    const adelante = mezclar(-dePie, caida, t);
    a.push(-adelante); previa = adelante;
  }
  return a;
}

// ── Lo que se mueve ──
const cero = () => Array(N).fill(0);
const camPortada = () => camDe('cajon');
const muelles = new Muelles({ hoja: 0, asoma: cero(), saca: 0, gira: 0, pincha: 0, aguja: 0, cam: { x: 0, y: 0, z: 0, dist: 30, inclina: 20, gira: 0, alto: 10, ancho: 16, px: 0.5, py: 0.5, util: [innerWidth, innerHeight] } },
  { rigidez: 150, amort: 22.5 }).ritmo('hoja', 95, 19.5).ritmo('cam', 120, 21).ritmo('saca', 110, 20).ritmo('pincha', 70, 16.5).ritmo('aguja', 140, 22).ritmo('gira', 130, 21);
let sel = 0;                                  // el disco que está fuera (o el último que lo estuvo)
let vuelta = 0, girando = false, ultimo = performance.now();
const enCaminoA = (puntos, t) => {          // un camino de tramos rectos, recorrido con t de 0 a 1
  const n = puntos.length - 1, k = Math.min(n - 1, Math.floor(t * n)), f = t * n - k, a = puntos[k], b = puntos[k + 1];
  return { x: mezclar(a.x, b.x, f), y: mezclar(a.y, b.y, f), z: mezclar(a.z, b.z, f) };
};
function colocar(v) {
  const incl = inclinaciones(v.hoja);
  for (let i = 0; i < N; i++) {
    const f = fundas[i]; let x = CJ.x, y = D.fundas_y[i], z = D.base + v.asoma[i] * 0.35, a = incl[i], g = 0;
    if (i === sel && v.saca > 0.0005) {
      const sube = suave(0, 0.5, v.saca), sale = suave(0.45, 1, v.saca);
      z += ALZA * sube; a = mezclar(incl[i], 6, sube);
      x = mezclar(x, SACADA.x, sale); y = mezclar(y, SACADA.y, sale); z = mezclar(z, SACADA.z, sale);
      g = v.gira * Math.PI;
      const lleva = suave(0.4, 1, v.pincha);
      if (lleva > 0) { const q = enCaminoA(ATRIL, lleva); x = q.x; y = q.y; z = q.z; a = mezclar(6, A.inclina, suave(0.5, 1, lleva)); }
    }
    f.position.copy(b3(x, y, z)); f.rotation.set(-a * DEG, g, 0);
  }
  // el disco: dentro de la funda sacada hasta que se pincha; sale por la derecha, va encima del plato y baja
  disco.visible = v.pincha > 0.002;
  if (disco.visible) {
    const f = fundas[sel]; f.updateMatrixWorld();
    const sale = suave(0, 0.3, v.pincha), vuela = suave(0.3, 0.75, v.pincha), baja = suave(0.75, 0.95, v.pincha);
    v3.set(3.2 * sale, L / 2, 0).applyMatrix4(f.matrixWorld);          // en la funda: (x, z, -y) del vacío
    const fuera = { x: v3.x, y: -v3.z, z: v3.y };
    const p = { x: mezclar(fuera.x, ENCIMA.x, vuela), y: mezclar(fuera.y, ENCIMA.y, vuela), z: mezclar(fuera.z, ENCIMA.z, vuela) + 0.9 * Math.sin(Math.PI * vuela) };
    p.z = mezclar(p.z, P.z + D.disco.grueso / 2 + 0.001, baja);
    disco.position.copy(b3(p.x, p.y, p.z));
    f.getWorldQuaternion(qTmp);
    disco.quaternion.copy(qTmp).slerp(qPlano, vuela).multiply(qGiro.setFromAxisAngle(eje, -vuelta));
  }
  brazo.rotation.y = D.brazo.sonando * DEG * v.aguja;
  const { util, ...cam } = v.cam;
  S.encuadrar(cam, { util: util ?? [innerWidth, innerHeight] });
}
// el disco gira mientras suena (33⅓: unos 3,5 rad/s), hasta que se enciende la tele (entonces ya no se ve y dibujarlo
// sin parar solo restaría fotogramas a la demo)
function bucleGiro() {
  if (!girando) return;
  const t = performance.now(); vuelta += 3.49 * Math.min(0.1, (t - ultimo) / 1000); ultimo = t;
  S.pedirDibujo(); requestAnimationFrame(bucleGiro);
}
function ponerGiro(si) {
  si = si && !RM && !(enTele && enTele !== 'encendiendo');
  if (si === girando) return; girando = si; ultimo = performance.now(); if (si) requestAnimationFrame(bucleGiro);
}
function marcha() { S.enMarcha(muelles.corriendo); }
muelles.alMover = () => { marcha(); S.pedirDibujo(); };
muelles.alParar = () => { marcha(); S.pedirDibujo(); };
S.alDibujar = () => { colocar(muelles.v); seguirMandos(); seguirTele(); };

// ── Las cámaras (el punto mirado, en coordenadas de Blender) ──
const bordeIzq = (sel_) => { const h = document.querySelector(sel_); return h.offsetLeft + h.offsetWidth; };
function huecoBajo(sel_, abajo = innerHeight - 24) {
  const h = document.querySelector(sel_), arriba = h.getBoundingClientRect().bottom + 12;
  return [innerWidth - 24, Math.max(160, abajo - arriba), (arriba + abajo) / 2];
}
const barraAlto = () => document.querySelector('.recorrido').offsetHeight + 30;
function camDe(lugar) {
  const SC = { x: SACADA.x, y: SACADA.y, z: SACADA.z + L / 2 };
  if (lugar === 'cajon') {
    const c = { x: 0.6, y: 0.2, z: 2.4, dist: 34, inclina: 22, gira: -6, alto: 8.4, ancho: 17 };
    if (movil()) { const [w, h, yc] = huecoBajo('.heroe'); return { ...c, x: -2.2, z: 2.0, alto: 6.4, ancho: 8.6, px: 0.5, py: yc / innerHeight, util: [w + 12, h] }; }
    if (innerWidth < 1100) { const [w, h, yc] = huecoBajo('.heroe'); return { ...c, px: 0.5, py: yc / innerHeight, util: [w - 24, h] }; }
    const hd = bordeIzq('.heroe');
    return { ...c, px: (hd + innerWidth) / 2 / innerWidth, py: 0.55, util: [innerWidth - hd - 48, innerHeight - 130] };
  }
  if (lugar === 'sacada' || lugar === 'creditos') {
    const c = { ...SC, dist: 20, inclina: 6, gira: 0, alto: L + 0.6, ancho: L + 0.6 };
    if (movil()) {
      if (lugar === 'creditos') { const top = 62, bot = innerHeight * 0.5; return { ...c, px: 0.5, py: (top + bot) / 2 / innerHeight, util: [innerWidth - 24, bot - top - 8] }; }
      const [w, h, yc] = huecoBajo('.ficha-lateral', innerHeight - barraAlto()); return { ...c, px: 0.5, py: yc / innerHeight, util: [w, h] };
    }
    if (lugar === 'creditos') { const libre = $('.expediente').offsetLeft; return { ...c, px: libre / 2 / innerWidth, py: 0.5, util: [libre - 60, innerHeight - 190] }; }
    const hd = bordeIzq('.ficha-lateral');
    return { ...c, px: (hd + innerWidth) / 2 / innerWidth, py: 0.5, util: [innerWidth - hd - 60, innerHeight - 200] };
  }
  // la tele
  const T = D.tele, c = { x: T.x, y: T.y - 0.45, z: T.z, dist: 18, inclina: 3, gira: 0, alto: T.alto + 0.5, ancho: T.ancho + 0.6 };
  if (movil()) return { ...c, alto: T.alto + 3, ancho: T.ancho + 2, px: 0.5, py: 0.42, util: [innerWidth, innerHeight - 120] };
  // la tele, nunca bajo el recorrido (que crece con los mandos al encenderla): el encuadre va del rótulo a la barra
  const arriba = 76, bajo = innerHeight - document.querySelector('.recorrido').offsetHeight - (document.querySelector('.tele-mandos').hidden ? 58 : 0) - 30;
  return { ...c, px: 0.5, py: (arriba + bajo) / 2 / innerHeight, util: [innerWidth - 140, bajo - arriba] };
}

// ── Los discos del cajón: un botón de verdad (invisible) sobre lo que asoma de cada uno ──
const capa = $('#mandos'), etiqueta = $('.etiqueta');
capa.innerHTML = PROYECTOS.map((p, i) => `<button type="button" class="hoja-b" data-i="${i}" aria-label="${p.nombre}: ${p.linea}"></button>`).join('');
const botones = [...capa.children];
let lugar = 'cajon';
function seguirMandos() {
  const ver = lugar === 'cajon' && muelles.v.saca < 0.02;
  capa.hidden = !ver; if (!ver) { etiqueta.hidden = true; return; }
  const v = muelles.v, s = Math.round(v.hoja), incl = inclinaciones(v.hoja);
  // el borde de arriba de cada funda, en pantalla (las caídas no tienen botón: se vuelve a ellas hojeando hacia atrás)
  const arriba = (i) => {
    const a = incl[i] * DEG, y = D.fundas_y[i] + L * Math.sin(a), z = D.base + L * Math.cos(a) + v.asoma[i] * 0.35;
    return [S.aPantalla(CJ.x - L / 2, y, z), S.aPantalla(CJ.x + L / 2, y, z)];
  };
  for (let i = 0; i < N; i++) {
    const b = botones[i];
    if (i < s) { b.hidden = true; continue; }
    b.hidden = false;
    const [[ax, ay], [bx]] = arriba(i);
    let abajo;
    if (i === s) { const a = incl[i] * DEG, [, py] = S.aPantalla(CJ.x, D.fundas_y[i] + 0.5 * L * Math.sin(a), D.base + 0.5 * L * Math.cos(a)); abajo = py; }
    else abajo = arriba(i - 1)[0][1];
    b.style.cssText = `left:${ax}px;top:${ay - 6}px;width:${bx - ax}px;height:${Math.max(14, abajo - ay + 6)}px`;
  }
  const f = capa.querySelector('.hoja-b:hover, .hoja-b:focus-visible'), k = f ? +f.dataset.i : -1;
  if (k >= 0 && innerWidth >= 760) {
    const p = PROYECTOS[k], r = f.getBoundingClientRect();
    etiqueta.querySelector('b').textContent = `LP ${p.n} · ${p.tipo}`; etiqueta.querySelector('span').textContent = `${p.nombre}. ${p.linea}`;
    const ew = etiqueta.offsetWidth || 280, ex = Math.min(innerWidth - ew - 12, r.right + 16), ey = Math.min(Math.max(70, r.top - 10), innerHeight - 90);
    etiqueta.style.transform = `translate(${Math.round(ex)}px, ${Math.round(ey)}px)`; etiqueta.hidden = false;
  } else etiqueta.hidden = true;
}
// asomar: el disco que se señala sube un poco (como al buscar con el dedo)
let asomado = -1;
function asomar(k) {
  if (k === asomado) return; asomado = k;
  muelles.ir({ asoma: PROYECTOS.map((_, i) => (i === k && i !== Math.round(muelles.obj.hoja) ? 1 : 0)) });
}
capa.addEventListener('pointerover', (e) => { const b = e.target.closest('.hoja-b'); asomar(b ? +b.dataset.i : -1); S.pedirDibujo(); });
capa.addEventListener('pointerout', (e) => { if (!e.relatedTarget?.closest?.('.hoja-b')) asomar(-1); S.pedirDibujo(); });
capa.addEventListener('focusin', (e) => { const b = e.target.closest('.hoja-b'); asomar(b?.matches(':focus-visible') ? +b.dataset.i : -1); S.pedirDibujo(); });
capa.addEventListener('focusout', () => { asomar(-1); S.pedirDibujo(); });
// tocar uno lo saca (si está detrás, se hojea hasta él por el camino)
let trasArrastre = false;                // el clic que sigue a un arrastre no saca el disco
capa.addEventListener('click', (e) => {
  if (trasArrastre) { trasArrastre = false; return; }
  const b = e.target.closest('.hoja-b'); if (!b) return;
  const i = +b.dataset.i;
  rutas.ir(PROYECTOS[i].id);
});
capa.addEventListener('keydown', (e) => {
  const b = e.target.closest('.hoja-b'); if (!b) return;
  const d = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key]; if (!d) return;
  e.preventDefault(); e.stopPropagation();
  hojear(+b.dataset.i + d, true);
});
function hojear(k, foco = false) {
  if (muelles.obj.saca > 0 || muelles.v.saca > 0.03) return;      // con un disco fuera (o volviendo) no se hojea
  k = Math.min(N - 1, Math.max(0, k));
  asomado = -1; muelles.ir({ hoja: k, asoma: cero() });
  // el foco, cuando su botón ya está a la vista (al volver hacia atrás, el de destino sigue oculto un momento)
  if (foco) { const t0 = performance.now(); esperar(() => !botones[k].hidden || performance.now() - t0 > 1500).then(() => { if (!botones[k].hidden) botones[k].focus({ preventScroll: true }); }); }
  anunciar(`Disco ${k + 1} de ${N}: ${PROYECTOS[k].nombre}.`);
}
const aviso = $('.aviso');
function anunciar(t) { aviso.textContent = t; }

// ── La ficha, el expediente y el recorrido ──
const ficha = $('.ficha-lateral'), expediente = $('.expediente'), recorrido = $('.recorrido'), pasos = $('.pasos'), dice = $('.dice'), heroe = $('.heroe');
pasos.innerHTML = PASOS.map((p, i) => `<button type="button" data-paso="${p.id}"><i>${i + 1}</i><span>${p.boton}</span></button>`).join('');
pasos.addEventListener('click', (e) => { const b = e.target.closest('[data-paso]'); if (b) rutas.ir(rutaDe(idActual(), b.dataset.paso)); });
document.addEventListener('click', (e) => {
  const a = e.target.closest('[data-ir]'); if (a) { e.preventDefault(); rutas.ir(a.dataset.ir); }
  const b = e.target.closest('[data-ir-paso]'); if (b) rutas.ir(rutaDe(idActual(), b.dataset.irPaso));
});
const rutaDe = (id, paso) => (paso ? `${id}/${paso}` : id);
const idActual = () => (rutas.actual ?? 'cajon').split('/')[0];
const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
function pintarFicha(p, i) {
  ficha.style.setProperty('--c', p.color);
  ficha.querySelector('.fi-n').textContent = `LP ${p.n} · disco ${i + 1} de ${N}`;
  ficha.querySelector('.fi-nombre').textContent = p.nombre;
  ficha.querySelector('.fi-tipo').textContent = `${p.tipo} · ${p.estado}`;
  ficha.querySelector('.fi-linea').textContent = p.linea;
  ficha.querySelector('.fi-botones').innerHTML = `<button type="button" class="boton boton-luz" data-ir-paso="cara-a"><span class="boton-tapa">${p.demo ? 'Pincharlo: su demo' : 'Pincharlo: su tráiler'}</span></button>
    <button type="button" class="boton boton-claro" data-ir-paso="creditos"><span class="boton-tapa">Darle la vuelta</span></button>
    ${p.web ? `<a class="fi-web" href="${p.web[1]}" target="_blank" rel="noopener">${esc(p.web[0])} ↗</a>` : ''}`;
  expediente.style.setProperty('--c', p.color);
  expediente.querySelector('#ex-nombre').textContent = p.nombre;
  expediente.querySelector('.ex-n b').textContent = p.n;
  expediente.querySelector('.ex-bloques').innerHTML = p.bloques.map(([t, x]) => `<p class="ex-celda"><small>${esc(t)}</small><span>${esc(x)}</span></p>`).join('');
  expediente.querySelector('.ex-cifras').innerHTML = p.cifras.map(([n, t]) => `<p class="ex-celda"><b>${esc(n)}</b><small>${esc(t)}</small></p>`).join('');
  expediente.querySelector('.ex-mat span').textContent = p.stack.join(' · ');
  expediente.querySelector('.ex-web span').innerHTML = p.web ? `<a href="${p.web[1]}" target="_blank" rel="noopener">${esc(p.web[0])} ↗</a>` : 'Sin web pública';
  expediente.querySelector('.ex-estado').textContent = p.estado;
}

// ── La tele de la pared ──
const tele = $('#tele'), mandos = $('.tele-mandos'), webTele = $('.tele-web');
let enTele = null, teleId = null, teleTurno = 0;
function seguirTele() {
  if (tele.hidden) return;
  if (movil()) { if (!tele.classList.contains('completa')) { desajustar(tele); tele.classList.add('completa'); } return; }
  tele.classList.remove('completa');
  const T = D.tele, g = 0.03, y = T.y - 0.445 - 0.004;
  const x0 = T.x - T.ancho / 2 + g, x1 = T.x + T.ancho / 2 - g, z0 = T.z - T.alto / 2 + g, z1 = T.z + T.alto / 2 - g;
  ajustar(tele, [S.aPantalla(x0, y, z1), S.aPantalla(x1, y, z1), S.aPantalla(x1, y, z0), S.aPantalla(x0, y, z0)]);
}
async function encenderTele(p, mio) {
  if (enTele && teleId === p.id) return;
  enTele = 'encendiendo'; teleId = p.id; const t0 = ++teleTurno;
  mandos.hidden = false; webTele.hidden = !p.web;
  if (p.web) { webTele.href = p.web[1]; webTele.querySelector('.boton-tapa').textContent = `${p.web[0].replace(/^github\.com\/[^/]+\//, 'GitHub: ')} ↗`; }
  requestAnimationFrame(() => mandos.classList.add('puestos'));
  const t = await encender(p, { el: tele, RM, guardado: null, alResolver: null });
  if (t0 !== teleTurno || mio !== turno || !t) {
    if (t0 === teleTurno) { t?.apagar(); enTele = null; teleId = null; mandos.classList.remove('puestos'); mandos.hidden = true; }
    return;
  }
  enTele = t; seguirTele(); ponerGiro(girando);
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

// ── Rutas: #cajon, #<id>, #<id>/creditos, #<id>/cara-a ──
rutas = montarRutas({
  inicio: 'cajon',
  validar(r) {
    if (!r || r === 'cajon') return 'cajon';
    const [id, paso = ''] = r.split('/');
    return porId(id) && PASOS.some((p) => p.id === paso) ? rutaDe(id, paso) : null;
  },
  alCambiar: (ruta, o) => irA(ruta, o),
});

let turno = 0, enCurso = 0;
const camCerca = (tol) => ['dist', 'gira', 'x', 'y', 'z'].every((k) => Math.abs(muelles.v.cam[k] - muelles.obj.cam[k]) < tol * (k === 'gira' ? 4 : 1));
function esperar(cond) { return new Promise((ok) => { const mira = () => (cond() ? ok() : requestAnimationFrame(mira)); mira(); }); }
async function irA(ruta, o) {
  const mio = ++turno; enCurso++;
  try { await irA_(ruta, o, mio); } finally { enCurso--; S.pedirDibujo(); }
}
async function irA_(ruta, { inmediato }, mio) {
  const [id, paso = ''] = ruta.split('/');
  const p = porId(id), i = p ? PROYECTOS.indexOf(p) : -1, portada = ruta === 'cajon';
  document.documentElement.dataset.ruta = portada ? 'cajon' : paso || 'disco';
  const focoMandos = document.activeElement?.closest('.lista, .pasos, .ficha-lateral'), focoFuera = document.activeElement?.closest('.recorrido, .tele, .tele-mandos, .expediente, .ficha-lateral');
  heroe.toggleAttribute('inert', !portada);
  recorrido.hidden = portada;
  ficha.hidden = portada || paso !== '';
  expediente.hidden = !p || paso !== 'creditos';
  if (p) { pintarFicha(p, i); for (const b of pasos.children) b.setAttribute('aria-current', b.dataset.paso === paso ? 'step' : 'false'); }
  dice.textContent = paso === 'cara-a' ? (p.demo ? 'En la tele de la tienda: una simulación (personajes inventados; la mecánica es la del juego).' : 'En la tele de la tienda: el tráiler del proyecto.') : p ? PASOS.find((x) => x.id === paso).dice : '';
  if (focoMandos && p) requestAnimationFrame(() => pasos.querySelector('[aria-current="step"]')?.focus({ preventScroll: true }));
  const focoCajon = () => { if (portada && focoFuera && mio === turno) requestAnimationFrame(() => { S.dibujar(); botones[Math.round(muelles.obj.hoja)]?.focus({ preventScroll: true }); }); };
  if (paso !== 'cara-a' || teleId !== id) apagarTele();
  const destino = portada ? 'cajon' : paso === 'creditos' ? 'creditos' : paso === 'cara-a' ? 'tele' : 'sacada';
  const objetivo = { saca: portada ? 0 : 1, gira: paso === 'creditos' ? 1 : 0, pincha: paso === 'cara-a' ? 1 : 0, aguja: paso === 'cara-a' ? 1 : 0 };

  if (inmediato || RM) {
    if (p) { sel = i; pintarDisco(i); }
    lugar = destino; asomado = -1;
    muelles.ir({ hoja: p ? i : muelles.obj.hoja, asoma: cero(), ...objetivo, cam: camDe(destino) }, true);
    ponerGiro(objetivo.aguja === 1);
    S.pedirDibujo();
    if (paso === 'cara-a') encenderTele(p, mio);
    focoCajon();
    return;
  }
  const sigue = () => mio === turno;
  // la vuelta al cajón no necesita la calma de la ida: con muelles más firmes, cambiar de disco con otro pinchado
  // bajó de unos 3 s a unos 2 s (la ida, más lenta, es la que se mira)
  const deVuelta = (si) => muelles.ritmo('pincha', si ? 160 : 70, si ? 25 : 16.5).ritmo('saca', si ? 200 : 110, si ? 28 : 20);
  deVuelta(false);
  // 1. si hay otro disco fuera (o este va a volver al cajón): se levanta la aguja, vuelve el disco a su funda, la
  // funda se da la vuelta si hacía falta y baja a su sitio
  const fueraOtro = muelles.obj.saca > 0 && (portada || sel !== i);
  if (fueraOtro || (p && sel === i && objetivo.pincha === 0 && Math.max(muelles.v.pincha, muelles.obj.pincha) > 0.001)) {
    deVuelta(true);
    muelles.ir({ aguja: 0 }); ponerGiro(false);
    await esperar(() => !sigue() || muelles.v.aguja < 0.5); if (!sigue()) return;    // a media subida ya no toca el disco
    muelles.ir({ pincha: 0, cam: camDe('sacada') });
    await esperar(() => !sigue() || muelles.v.pincha < 0.02); if (!sigue()) return;
  }
  if (fueraOtro) {
    deVuelta(true);
    lugar = portada ? 'cajon' : 'sacada';
    muelles.ir({ gira: 0, saca: 0, cam: camDe('cajon') });
    await esperar(() => !sigue() || (muelles.v.saca < 0.015 && Math.abs(muelles.v.gira) < 0.05)); if (!sigue()) return;   // ya con los botones del cajón a la vista
  }
  deVuelta(false);
  if (portada) { lugar = 'cajon'; muelles.ir({ saca: 0, gira: 0, pincha: 0, aguja: 0, cam: camDe('cajon') }); focoCajon(); return; }
  // 2. hojear hasta él y sacarlo
  if (muelles.obj.saca === 0 || sel !== i) {
    if (Math.abs(muelles.v.hoja - i) > 0.02) {
      muelles.ir({ hoja: i, asoma: cero() });
      await esperar(() => !sigue() || Math.abs(muelles.v.hoja - i) < 0.12); if (!sigue()) return;
    }
    sel = i; pintarDisco(i); asomado = -1;    // el disco compartido cambia de etiqueta solo cuando el anterior ya está guardado
    lugar = 'sacada';
    muelles.ir({ saca: 1, cam: camDe(destino === 'tele' ? 'sacada' : destino) });
    if (destino !== 'sacada' && destino !== 'creditos') { await esperar(() => !sigue() || muelles.v.saca > 0.85); if (!sigue()) return; }
  }
  // 3. en el disco: la portada, los créditos o pincharlo
  if (destino !== 'tele') { lugar = destino; muelles.ir({ gira: objetivo.gira, cam: camDe(destino) }); return; }
  if (Math.max(muelles.v.gira, muelles.obj.gira) > 0.05) {
    muelles.ir({ gira: 0, cam: camDe('sacada') });
    await esperar(() => !sigue() || muelles.v.gira < 0.12); if (!sigue()) return;
  }
  lugar = 'tele';
  muelles.ir({ pincha: 1, cam: camDe('tele') });
  await esperar(() => !sigue() || muelles.v.pincha > 0.96); if (!sigue()) return;
  muelles.ir({ aguja: 1 }); ponerGiro(true);
  await esperar(() => !sigue() || (muelles.v.aguja > 0.85 && camCerca(0.4))); if (!sigue()) return;
  encenderTele(p, mio);
}

// teclado: en el cajón, ↑ ↓ ← → hojean y Enter saca; en un disco, ← → por los pasos; Esc vuelve uno atrás
addEventListener('keydown', (e) => {
  if (e.target.closest('input, textarea, dialog[open]')) return;
  if (e.target.closest('.tele') && e.key !== 'Escape') return;
  const r = rutas.actual, [id, paso = ''] = r.split('/'), k = PASOS.findIndex((p) => p.id === paso);
  if (r === 'cajon') {
    if (e.target.closest('.hoja-b')) return;
    const d = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
    if (d) { e.preventDefault(); hojear(Math.round(muelles.obj.hoja) + d); }
    return;
  }
  if (e.key === 'ArrowRight' && k < PASOS.length - 1) { e.preventDefault(); rutas.ir(rutaDe(id, PASOS[k + 1].id)); }
  else if (e.key === 'ArrowLeft' && k > 0) { e.preventDefault(); rutas.ir(rutaDe(id, PASOS[k - 1].id)); }
  else if (e.key === 'Escape') { e.preventDefault(); rutas.volverA(k > 0 ? rutaDe(id, PASOS[k - 1].id) : 'cajon'); }
});
// la rueda y el dedo hojean (un disco por gesto), solo en el cajón
let rueda = 0, ruedaHasta = 0;
addEventListener('wheel', (e) => {
  if (rutas.actual !== 'cajon' || e.target.closest?.('.lista, .heroe')) return;
  const ahora = performance.now(); if (ahora < ruedaHasta) return;
  rueda += e.deltaY; if (Math.abs(rueda) < 40) return;
  ruedaHasta = ahora + 380; hojear(Math.round(muelles.obj.hoja) + Math.sign(rueda)); rueda = 0;
}, { passive: true });
let dedo = null;
$('#plato').addEventListener('pointerdown', (e) => { if (rutas.actual === 'cajon') dedo = { y: e.clientY, x: e.clientX, paso: 0, id: e.pointerId }; });
addEventListener('pointermove', (e) => {
  if (!dedo || e.pointerId !== dedo.id) return;
  // arrastrar hacia ti (abajo) hojea hacia delante; cada 70 px, un disco
  const n = Math.trunc((e.clientY - dedo.y) / 70);
  if (n !== dedo.paso) { hojear(Math.round(muelles.obj.hoja) + (n - dedo.paso)); dedo.paso = n; document.documentElement.classList.add('hojeando'); }
});
addEventListener('pointerup', () => {
  if (dedo?.paso) { trasArrastre = true; setTimeout(() => { trasArrastre = false; }, 0); }
  dedo = null; document.documentElement.classList.remove('hojeando');
});

// ── La lista de los nueve ──
const lista = $('.lista');
$('.lista-ol').innerHTML = PROYECTOS.map((p, i) => `<li><span class="li-n" style="--c:${p.color}">${p.n}</span>
  <div><b>${p.nombre}</b><span class="li-linea">${p.linea}</span><small>Disco ${i + 1} · ${p.tipo} · ${p.estado}</small></div>
  <span class="li-botones"><button type="button" class="boton boton-claro" data-sacar="${p.id}"><span class="boton-tapa">Sacarlo</span></button>${p.demo ? `<button type="button" class="boton boton-luz" data-sacar="${p.id}/cara-a"><span class="boton-tapa">Demo</span></button>` : ''}</span></li>`).join('');
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
  const c = camDe(lugar);
  if (muelles.corriendo) muelles.empujar('cam', c); else muelles.tocar('cam', c);
  S.dibujar();
});
new ResizeObserver(() => document.documentElement.style.setProperty('--barra', `${recorrido.offsetHeight + 18}px`)).observe(recorrido);
muelles.ir({ cam: camPortada() }, true);
rutas.arrancar();
S.dibujar();
S.listo();
(window.requestIdleCallback ?? setTimeout)(() => C.cargarArte('adivinadle'), { timeout: 3000 });
const redondo = (x) => Math.round(x * 1000) / 1000;
window.__estado = () => ({
  ruta: rutas.actual, hoja: redondo(muelles.v.hoja), sel, saca: redondo(muelles.v.saca), gira: redondo(muelles.v.gira), pincha: redondo(muelles.v.pincha),
  aguja: redondo(muelles.v.aguja), quieto: !muelles.corriendo && !enCurso, lugar, girando,
  tele: !tele.hidden, enTele: enTele && (enTele === 'encendiendo' ? 'encendiendo' : 'encendida'), teleId,
  ficha: !ficha.hidden, expediente: !expediente.hidden, mandos: !capa.hidden,
});
