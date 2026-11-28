// El ascensor, con el kit E1. Un edificio de oficinas de los años treinta: una planta por proyecto y un ascensor de
// cabina, de nogal y latón, con cancela de tijera. La botonera es el índice: junto a cada botón, su planta. Se pulsa
// uno y la cancela se cierra, la aguja corre de planta en planta, la cabina sube y la cancela se abre a su rellano: la
// puerta del despacho con el nombre en el cristal, el tablón de corcho con su expediente (qué es, qué hice yo, el
// resultado, con qué está hecho) y la pantalla, con su demo (Adivinadle) o su tráiler. Arriba, la planta 10, en obras.
//
// Como en las otras maquetas, todo sale de unos pocos valores con muelles (la planta de la cabina, la cancela y la
// cámara); las piezas no tienen posición guardada, se calculan en cada fotograma. La cámara se cuenta desde el suelo de
// la cabina: viaja con ella, nunca se queda atrás ni se sale por el techo.
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
  { id: '', boton: 'La planta', dice: 'Su planta: la puerta del despacho, el tablón y la pantalla.' },
  { id: 'tablon', boton: 'Su expediente', dice: 'En el tablón: qué es, qué hice yo, el resultado y con qué está hecho.' },
  { id: 'pantalla', boton: 'La pantalla', dice: '' },
];
const OBRAS = 10;
const plantaDe = (ruta) => { const id = ruta.split('/')[0]; return id === 'vestibulo' ? 0 : id === 'obras' ? OBRAS : PROYECTOS.findIndex((p) => p.id === id) + 1; };
const rutaDePlanta = (k) => (k <= 0 ? 'vestibulo' : k >= OBRAS ? 'obras' : PROYECTOS[k - 1].id);

// ── Arranque ──
await C.cargar();
let rutas = null;
const LATON = /_(boca|pasamanos|bisel|botonera|esfera|certificado|umbral|riel|aguja_eje|pomo|bocallave|aplique|floron|collar|pantalla_marco|paraguero|banco_pata|rotulo_placa|junquillo|marco_[aibd])|_unida\d*_laton$/;   // _unida…: lo que la escena une para la web
const GLOBO = /_(globo|bombilla)$|_aplique_-?\d+_globo$|lampara_globo$/;
const S = await montarEscena({
  plato: $('#plato'), luz: 'luz/', fondo: '#1c1a18', exposicion: 1.0,
  pixelesEnMarcha: 100000,     // sin gráfica, el viaje entre plantas iba justo a 30 fps con el valor del kit
  etiqueta: 'Dentro de un ascensor antiguo de nogal y latón: la botonera hace de índice de las nueve plantas, una por proyecto',
  material(n, { textura }) {
    if (/^pantalla_\d+_cara$/.test(n)) return { color: '#000000', emite: '#0b0d11' };
    if (n === 'directorio_cara') return { luz: 'p0', mapa: textura('directorio', I.TAM.directorio) };
    if (n === 'rotulo_cara') return { luz: 'p0', mapa: textura('rotulo', I.TAM.rotulo), brillo: 0.35 };
    if (n === 'obras_cara') return { luz: `p${OBRAS}`, mapa: textura('obras', I.TAM.obras) };
    let m = n.match(/^puerta_(\d+)_cristal$/);
    if (m) return { luz: `p${m[1]}`, mapa: textura('puertas', I.TAM.puertas), emite: '#2a2418', brillo: 0.25 };
    if ((m = n.match(/^tablon_(\d+)_cara$/))) return { luz: `p${m[1]}`, mapa: textura('tablones', I.TAM.tablones) };
    if (n.startsWith('numero_')) return { luz: 'hueco', mapa: textura('numeros', I.TAM.numeros) };
    if (n === 'esfera_cara') return { luz: 'cabina', mapa: textura('esfera', I.TAM.esfera), brillo: 0.15 };
    if (n === 'botonera_cara') return { luz: 'cabina', mapa: textura('botonera', I.TAM.botonera), brillo: 0.4 };
    if (n === 'certificado_cara') return { luz: 'cabina', mapa: textura('certificado', I.TAM.certificado) };
    if (n.startsWith('botonnum_')) return { luz: 'cabina', mapa: textura('botones', I.TAM.botones), brillo: 0.2 };
    if (n.startsWith('boton_')) return { luz: 'cabina', brillo: 0.25 };
    if (/^(cab_|cancela_)/.test(n)) return { luz: 'cabina', brillo: LATON.test(n) || n.startsWith('cancela_b') ? 0.3 : 0.06 };
    if (n.startsWith('hueco_')) return { luz: 'hueco', brillo: LATON.test(n) ? 0.25 : 0 };
    if ((m = n.match(/^p(\d+)_/))) return { luz: `p${m[1]}`, brillo: LATON.test(n) ? 0.3 : 0.04, ...(GLOBO.test(n) && { emite: '#6b5a3c' }) };
    return { luz: 'p0' };
  },
});
const { nodo, lienzos, texturas } = S;
const D = S.datos, PISO = D.piso, CG = D.cancela, B = D.botonera;

// lo impreso: todo de una vez (cambia de proyecto sin volver a hornear)
const pintar = (id) => { texturas[id].needsUpdate = true; };
I.directorio(lienzos.directorio); pintar('directorio');
I.rotulo(lienzos.rotulo); pintar('rotulo');
I.obras(lienzos.obras); pintar('obras');
I.numeros(lienzos.numeros); pintar('numeros');
I.esfera(lienzos.esfera); pintar('esfera');
I.botones(lienzos.botones); pintar('botones');
I.certificado(lienzos.certificado); pintar('certificado');
I.botonera(lienzos.botonera, D); pintar('botonera');
Promise.all([I.puertas(lienzos.puertas), I.tablones(lienzos.tablones)]).then(() => { pintar('puertas'); pintar('tablones'); S.pedirDibujo(); });

// cada planta, sus piezas (para no dibujar las que no se ven), y la cancela, barra a barra
const PLANTAS = D.plantas, dePlanta = Array.from({ length: PLANTAS }, () => []);
S.escena.traverse((o) => {
  if (!o.isMesh) return;
  const m = o.name.match(/^(?:p|puerta_|tablon_|pantalla_|numero_|hueco_)(\d+)(?:_|$)/);
  if (m && !o.name.startsWith('hueco_fondo') && !o.name.startsWith('hueco_lado')) dePlanta[+m[1]].push(o);
  else if (/^(directorio|rotulo)_/.test(o.name)) dePlanta[0].push(o);
  else if (o.name.startsWith('obras_')) dePlanta[OBRAS].push(o);
});
const barras = Array.from({ length: CG.barras }, (_, i) => ({
  piezas: Object.values(nodo).filter((o) => o.name === `cancela_b${i}` || o.name.startsWith(`cancela_b${i}_`)).map((o) => ({ o, x: o.position.x })),
  tramo: nodo[`cancela_d${i}`],
}));
const CORRE = -1.1;      // lo que se corre la cancela plegada hacia el canto de la boca
const cabinaNodo = nodo.cabina, aguja = nodo.aguja;
const botonIdx = (k) => D.botones.findIndex((b) => b.planta === k);

// ── Las cámaras (el punto mirado, en coordenadas de Blender; su z, desde el suelo de la cabina) ──
const bordeIzq = (sel) => { const h = document.querySelector(sel); return h.offsetLeft + h.offsetWidth; };
function huecoBajo(sel, abajo = innerHeight - 24) {
  const h = document.querySelector(sel), arriba = h.offsetTop + h.offsetHeight + 12;
  return [innerWidth - 24, Math.max(160, abajo - arriba), (arriba + abajo) / 2];
}
const barraAlto = () => document.querySelector('.recorrido').offsetHeight + 30;   // se usa antes de declarar `recorrido`
// dentro de la cabina, de frente: en la portada, la botonera y media boca; en una planta, la boca entera y la botonera
function camCabina(portada) {
  const c = { x: portada ? 3.0 : -0.4, y: 6, z: 12.2, dist: 16, inclina: 0, gira: 0, alto: portada ? 19.5 : 22.5, ancho: portada ? 17 : 21.5 };
  if (movil()) {
    if (portada) { const [w, h, yc] = huecoBajo('.heroe'); return { ...c, x: 5.6, z: 12.1, alto: 15.2, ancho: 9.0, px: 0.5, py: yc / innerHeight, util: [w + 12, h] }; }
    // la botonera, o entera o fuera: a medias se cortaban los nombres. Fuera: el borde derecho del encuadre, justo antes
    // de ella (lo que se ve de ancho depende de la pantalla, porque manda el alto)
    const [w, h, yc] = huecoBajo('.ficha-lateral', innerHeight - barraAlto()), visto = Math.max(13.5, 22.5 * (w + 12) / h);
    return { ...c, x: B.x - B.ancho / 2 - 0.25 - visto / 2, z: 11.4, alto: 22.5, ancho: 13.5, px: 0.5, py: yc / innerHeight, util: [w + 12, h] };
  }
  // en tableta, la portada lleva la tarjeta arriba, a lo ancho; la ficha sigue a la izquierda, como en el escritorio
  if (apilado() && portada) { const [w, h, yc] = huecoBajo('.heroe'); return { ...c, px: 0.5, py: yc / innerHeight, util: [w - 24, h] }; }
  const hd = bordeIzq(portada ? '.heroe' : '.ficha-lateral');
  return { ...c, px: (hd + innerWidth) / 2 / innerWidth, py: 0.52, util: [innerWidth - hd - 48, innerHeight - (portada ? 120 : 160)] };
}
// en el rellano, recién salido de la cabina (paso intermedio: de la boca al rellano se va en línea recta)
const camUmbral = () => ({ x: D.puerta.x, y: 49, z: 13.5, dist: 36, inclina: 0, gira: 0, alto: 22, ancho: 30, px: 0.5, py: 0.5, util: [innerWidth, innerHeight] });
function camTablon() {
  const T = D.tablon, c = { x: T.x, y: D.rellano.y1, z: T.z, dist: 21, inclina: 2, gira: 14, alto: T.alto + 2.6, ancho: T.ancho + 2.6 };
  if (movil()) { const top = 62, bot = innerHeight * 0.5; return { ...c, px: 0.5, py: (top + bot) / 2 / innerHeight, util: [innerWidth - 24, bot - top - 8] }; }
  const libre = $('.expediente').offsetLeft;
  return { ...c, px: libre / 2 / innerWidth, py: 0.5, util: [libre - 60, innerHeight - 190] };
}
function camPantalla() {
  const P = D.pantalla, c = { x: P.x, y: D.rellano.y1 - 1.2, z: P.z, dist: 15, inclina: 0, gira: -8, alto: P.alto + 0.5, ancho: P.ancho + 0.6 };
  if (movil()) return { ...c, alto: P.alto + 3, ancho: P.ancho + 2, px: 0.5, py: 0.42, util: [innerWidth, innerHeight - 120] };
  // la pantalla, nunca bajo el recorrido (que crece con los mandos al encenderla): el encuadre va del rótulo a la barra
  const arriba = 76, bajo = innerHeight - document.querySelector('.recorrido').offsetHeight - (document.querySelector('.tele-mandos').hidden ? 58 : 0) - 30;
  return { ...c, px: 0.5, py: (arriba + bajo) / 2 / innerHeight, util: [innerWidth - 140, bajo - arriba] };
}
const camDe = (lugar, ruta) => (lugar === 'umbral' ? camUmbral() : lugar === 'tablon' ? camTablon() : lugar === 'pantalla' ? camPantalla() : camCabina(ruta === 'vestibulo'));

// ── Lo que se mueve: la planta de la cabina, la cancela (1 cerrada) y la cámara ──
const muelles = new Muelles({ cab: 0, cancela: 0, cam: camCabina(true) }, { rigidez: 150, amort: 22.5 })
  .ritmo('cab', 120, 22).ritmo('cancela', 300, 34).ritmo('cam', 130, 22.5);
const pliegue = (c) => (CG.plegada + (CG.paso - CG.plegada) * c) / CG.paso;
function colocar(v) {
  cabinaNodo.position.y = v.cab * PISO;
  aguja.rotation.z = I.anguloPlanta(Math.min(Math.max(v.cab, 0), 10)) - Math.PI / 2;
  const c = Math.min(Math.max(v.cancela, 0), 1), f = pliegue(c), corre = (1 - c) * CORRE;
  barras.forEach(({ piezas, tramo }, i) => {
    const dx = corre + i * CG.paso * (f - 1);
    for (const { o, x } of piezas) o.position.x = x + dx;
    if (tramo) { tramo.position.x = CG.x0 + corre + i * CG.paso * f; tramo.scale.x = f; }
  });
  for (let k = 0; k < PLANTAS; k++) { const ver = Math.abs(k - v.cab) < 1.25; for (const o of dePlanta[k]) o.visible = ver; }
  const { util, ...cam } = v.cam;
  S.encuadrar({ ...cam, z: cam.z + v.cab * PISO }, { util: util ?? [innerWidth, innerHeight] });
}
function marcha() { S.enMarcha(muelles.corriendo); }
muelles.alMover = () => { marcha(); S.pedirDibujo(); };
muelles.alParar = () => { marcha(); S.pedirDibujo(); };
S.alDibujar = () => { colocar(muelles.v); seguirMandos(); seguirTele(); };

// ── La botonera: un botón de verdad (invisible) encima de cada fila de la placa ──
const capa = $('#mandos'), etiqueta = $('.etiqueta');
const filas = D.botones.filter((b) => b.planta != null);
capa.innerHTML = filas.map((b) => {
  const p = PROYECTOS[b.planta - 1], nombre = b.planta === 0 ? 'Vestíbulo' : b.planta === OBRAS ? 'Planta 10, en obras' : `Planta ${b.planta}: ${p.nombre}. ${p.linea}`;
  return `<button type="button" class="fila-b" data-planta="${b.planta}" aria-label="${nombre}"></button>`;
}).join('');
const filaBoton = Object.fromEntries([...capa.children].map((b) => [b.dataset.planta, b]));
function seguirMandos() {
  const ver = lugar === 'dentro' && !document.documentElement.classList.contains('viajando');
  capa.hidden = !ver; if (!ver) { etiqueta.hidden = true; return; }
  const zc = muelles.v.cab * PISO, y = B.y ?? D.cabina.y1 - 0.25, x0 = B.x - B.ancho / 2 + 0.15, x1 = B.x + B.ancho / 2 - 0.15, h = B.fila / 2;
  for (const b of filas) {
    const [ax, ay] = S.aPantalla(x0, y, zc + b.z + h), [bx, by] = S.aPantalla(x1, y, zc + b.z - h);
    filaBoton[b.planta].style.cssText = `left:${ax}px;top:${ay}px;width:${bx - ax}px;height:${by - ay}px`;
  }
  const f = capa.querySelector('.fila-b:hover, .fila-b:focus-visible'), k = f ? +f.dataset.planta : -1;
  if (k > 0 && k < OBRAS && innerWidth >= 760) {
    const p = PROYECTOS[k - 1], r = f.getBoundingClientRect();
    etiqueta.querySelector('b').textContent = `Planta ${k} · ${p.tipo}`; etiqueta.querySelector('span').textContent = p.linea;
    const ew = etiqueta.offsetWidth || 280, ex = Math.max(8, r.left - ew - 14), ey = Math.min(Math.max(70, r.top + r.height / 2 - (etiqueta.offsetHeight || 70) / 2), innerHeight - 90);
    etiqueta.style.transform = `translate(${Math.round(ex)}px, ${Math.round(ey)}px)`; etiqueta.hidden = false;
  } else etiqueta.hidden = true;
}
capa.addEventListener('pointerover', () => S.pedirDibujo());
capa.addEventListener('pointerout', () => S.pedirDibujo());
capa.addEventListener('focusin', () => S.pedirDibujo());
capa.addEventListener('click', (e) => { const b = e.target.closest('.fila-b'); if (b) rutas.ir(rutaDePlanta(+b.dataset.planta)); });
// las flechas, de fila en fila (arriba, la planta de arriba)
capa.addEventListener('keydown', (e) => {
  const b = e.target.closest('.fila-b'); if (!b) return;
  const d = { ArrowUp: 1, ArrowDown: -1 }[e.key]; if (!d) return;
  e.preventDefault(); e.stopPropagation();
  filaBoton[Math.min(OBRAS, Math.max(0, +b.dataset.planta + d))]?.focus();
});
// el botón pedido se enciende hasta que la cabina llega
let encendido = -1;
function luzBoton(k) {
  if (encendido === k) return;
  for (const [kk, on] of [[encendido, false], [k, true]]) {
    const i = botonIdx(kk); if (i < 0) continue;
    for (const n of [`boton_${i}`, `botonnum_${i}`]) nodo[n]?.material.uniforms.emite.value.set(on ? '#a8591a' : '#000000');
  }
  encendido = k; I.botonera(lienzos.botonera, D, k); pintar('botonera'); S.pedirDibujo();
}

// ── La ficha, el expediente y el recorrido ──
const ficha = $('.ficha-lateral'), expediente = $('.expediente'), recorrido = $('.recorrido'), pasos = $('.pasos'), dice = $('.dice'), heroe = $('.heroe');
pasos.innerHTML = PASOS.map((p, i) => `<button type="button" data-paso="${p.id}"><i>${i + 1}</i><span>${p.boton}</span></button>`).join('');
pasos.addEventListener('click', (e) => { const b = e.target.closest('[data-paso]'); if (b) rutas.ir(rutaDe(idActual(), b.dataset.paso)); });
document.addEventListener('click', (e) => {
  const a = e.target.closest('[data-ir]'); if (a) { e.preventDefault(); rutas.ir(a.dataset.ir); }
  const b = e.target.closest('[data-ir-paso]'); if (b) rutas.ir(rutaDe(idActual(), b.dataset.irPaso));
});
const rutaDe = (id, paso) => (paso ? `${id}/${paso}` : id);
const idActual = () => (rutas.actual ?? 'vestibulo').split('/')[0];
const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
function pintarFicha(p, k) {
  if (!p) {      // la planta en obras
    ficha.style.setProperty('--c', '#e6b422');
    ficha.querySelector('.fi-n').textContent = 'Planta 10';
    ficha.querySelector('.fi-nombre').textContent = 'En obras';
    ficha.querySelector('.fi-tipo').textContent = 'Aquí va el siguiente';
    ficha.querySelector('.fi-linea').textContent = 'Cada proyecto nuevo es una planta más y un botón más en la botonera.';
    ficha.querySelector('.fi-botones').innerHTML = '<button type="button" class="boton boton-claro" data-ir="vestibulo"><span class="boton-tapa">Bajar al vestíbulo</span></button>';
    return;
  }
  ficha.style.setProperty('--c', p.color);
  ficha.querySelector('.fi-n').textContent = `Planta ${k}`;
  ficha.querySelector('.fi-nombre').textContent = p.nombre;
  ficha.querySelector('.fi-tipo').textContent = `${p.tipo} · ${p.estado}`;
  ficha.querySelector('.fi-linea').textContent = p.linea;
  ficha.querySelector('.fi-botones').innerHTML = `<button type="button" class="boton boton-luz" data-ir-paso="tablon"><span class="boton-tapa">Su expediente</span></button>
    <button type="button" class="boton boton-claro" data-ir-paso="pantalla"><span class="boton-tapa">${p.demo ? 'Su demo, en la pantalla' : 'Su tráiler, en la pantalla'}</span></button>
    ${p.web ? `<a class="fi-web" href="${p.web[1]}" target="_blank" rel="noopener">${esc(p.web[0])} ↗</a>` : ''}`;
  expediente.style.setProperty('--c', p.color);
  expediente.querySelector('#ex-nombre').textContent = p.nombre;
  expediente.querySelector('.ex-n b').textContent = k;
  expediente.querySelector('.ex-bloques').innerHTML = p.bloques.map(([t, x]) => `<p class="ex-celda"><small>${esc(t)}</small><span>${esc(x)}</span></p>`).join('');
  expediente.querySelector('.ex-cifras').innerHTML = p.cifras.map(([n, t]) => `<p class="ex-celda"><b>${esc(n)}</b><small>${esc(t)}</small></p>`).join('');
  expediente.querySelector('.ex-mat span').textContent = p.stack.join(' · ');
  expediente.querySelector('.ex-web span').innerHTML = p.web ? `<a href="${p.web[1]}" target="_blank" rel="noopener">${esc(p.web[0])} ↗</a>` : 'Sin web pública';
  expediente.querySelector('.ex-estado').textContent = p.estado;
}

// ── La pantalla del rellano ──
const tele = $('#tele'), mandos = $('.tele-mandos'), webTele = $('.tele-web');
let enTele = null, teleId = null, teleTurno = 0;
function seguirTele() {
  if (tele.hidden) return;
  if (movil() || innerHeight > innerWidth) { if (!tele.classList.contains('completa')) { desajustar(tele); tele.classList.add('completa'); } return; }
  tele.classList.remove('completa');
  const P = D.pantalla, g = 0.03, zc = muelles.v.cab * PISO, y = D.rellano.y1 - 1.22 - 0.004;
  const x0 = P.x - P.ancho / 2 + g, x1 = P.x + P.ancho / 2 - g, z0 = zc + P.z - P.alto / 2 + g, z1 = zc + P.z + P.alto / 2 - g;
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
    // descartado: si aún era el último encendido, la pantalla queda libre (si no, volver aquí no la encendía nunca)
    if (t0 === teleTurno) { t?.apagar(); enTele = null; teleId = null; mandos.classList.remove('puestos'); mandos.hidden = true; }
    return;
  }
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

// ── Rutas: #vestibulo, #<id>, #<id>/tablon, #<id>/pantalla, #obras ──
rutas = montarRutas({
  inicio: 'vestibulo',
  validar(r) {
    if (!r || r === 'vestibulo') return 'vestibulo';
    if (r === 'obras') return 'obras';
    const [id, paso = ''] = r.split('/');
    return porId(id) && PASOS.some((p) => p.id === paso) ? rutaDe(id, paso) : null;
  },
  alCambiar: (ruta, o) => irA(ruta, o),
});

// lugar: dónde está la cámara — dentro (de la cabina), umbral (recién salida al rellano), tablon o pantalla
let turno = 0, enCurso = 0, lugar = 'dentro';
const camCerca = (tol) => ['dist', 'gira', 'x', 'y', 'z'].every((k) => Math.abs(muelles.v.cam[k] - muelles.obj.cam[k]) < tol * (k === 'gira' ? 4 : 1));
function esperar(cond) { return new Promise((ok) => { const mira = () => (cond() ? ok() : requestAnimationFrame(mira)); mira(); }); }
async function irA(ruta, o) {
  const mio = ++turno; enCurso++;
  try { await irA_(ruta, o, mio); } finally { enCurso--; if (!enCurso) document.documentElement.classList.remove('viajando'); S.pedirDibujo(); }
}
async function irA_(ruta, { inmediato }, mio) {
  const [id, paso = ''] = ruta.split('/');
  const p = porId(id), k = plantaDe(ruta), obras = k === OBRAS, portada = ruta === 'vestibulo';
  document.documentElement.dataset.ruta = portada ? 'vestibulo' : obras ? 'obras' : paso || 'planta';
  const focoMandos = document.activeElement?.closest('.mandos, .lista, .pasos, .ficha-lateral'), focoFuera = document.activeElement?.closest('.recorrido, .tele, .tele-mandos, .expediente');
  heroe.toggleAttribute('inert', !portada);
  recorrido.hidden = portada;
  pasos.hidden = obras;
  ficha.hidden = portada || (paso !== '');
  expediente.hidden = !p || paso !== 'tablon';
  pintarFicha(p, k);
  if (p) for (const b of pasos.children) b.setAttribute('aria-current', b.dataset.paso === paso ? 'step' : 'false');
  dice.textContent = obras ? 'Planta 10: en obras. La cancela no se abre: aquí va el siguiente proyecto.' : paso === 'pantalla' ? (p.demo ? 'En la pantalla del rellano: una simulación (personajes inventados; la mecánica es la del juego).' : 'En la pantalla del rellano: el tráiler del proyecto.') : p ? PASOS.find((x) => x.id === paso).dice : '';
  if (focoMandos && p) requestAnimationFrame(() => pasos.querySelector('[aria-current="step"]')?.focus({ preventScroll: true }));
  // el foco vuelve a la botonera, pero cuando se ve (en el viaje está escondida y el foco se perdía)
  const focoBotonera = () => { if (portada && focoFuera && mio === turno) requestAnimationFrame(() => { S.dibujar(); filaBoton[1]?.focus({ preventScroll: true }); }); };
  // la pantalla se apaga al salir de ella y también al cambiar de planta (si no, viajaba con la cabina)
  if (paso !== 'pantalla' || teleId !== id) apagarTele();
  const destino = paso === 'tablon' ? 'tablon' : paso === 'pantalla' ? 'pantalla' : 'dentro';
  const cerrada = obras ? 1 : 0;

  if (inmediato || RM) {
    lugar = destino; luzBoton(-1);
    muelles.ir({ cab: k, cancela: cerrada, cam: camDe(destino, ruta) }, true);
    S.pedirDibujo();
    if (paso === 'pantalla') encenderTele(p, mio);
    focoBotonera();
    return;
  }
  const sigue = () => mio === turno;
  // ya en la pantalla de esta planta: solo cambia lo que sale en ella (no aplica: cada planta tiene la suya)
  // 1. otra planta: volver a la cabina, cerrar la cancela, viajar y abrirla
  if (Math.round(muelles.obj.cab) !== k || Math.abs(muelles.v.cab - k) > 0.02) {
    if (lugar === 'tablon' || lugar === 'pantalla') {
      lugar = 'umbral'; muelles.ir({ cam: camUmbral() });
      await esperar(() => !sigue() || camCerca(2.5)); if (!sigue()) return;
    }
    if (lugar === 'umbral') {
      lugar = 'dentro'; muelles.ir({ cam: camCabina(false) });
      await esperar(() => !sigue() || camCerca(1.2)); if (!sigue()) return;
    }
    luzBoton(k);
    document.documentElement.classList.add('viajando');
    muelles.ir({ cancela: 1, cam: camCabina(portada) });
    await esperar(() => !sigue() || muelles.v.cancela > 0.86); if (!sigue()) return;
    muelles.ir({ cab: k });
    await esperar(() => !sigue() || Math.abs(muelles.v.cab - k) < 0.16); if (!sigue()) return;
    muelles.ir({ cancela: cerrada });
    luzBoton(-1);
    document.documentElement.classList.remove('viajando');
  } else if (muelles.obj.cancela !== cerrada) muelles.ir({ cancela: cerrada });
  // 2. en la planta: dentro de la cabina, o fuera, en el tablón o en la pantalla
  if (destino === 'dentro') {
    if (lugar === 'tablon' || lugar === 'pantalla') {
      lugar = 'umbral'; muelles.ir({ cam: camUmbral() });
      await esperar(() => !sigue() || camCerca(2.5)); if (!sigue()) return;
    }
    lugar = 'dentro'; muelles.ir({ cam: camCabina(portada) });
    focoBotonera();
    return;
  }
  if (lugar === 'dentro') {
    await esperar(() => !sigue() || muelles.v.cancela < 0.25); if (!sigue()) return;
    lugar = 'umbral'; muelles.ir({ cam: camUmbral() });
    await esperar(() => !sigue() || camCerca(3)); if (!sigue()) return;
  }
  lugar = destino; muelles.ir({ cam: camDe(destino, ruta) });
  if (destino === 'pantalla') {
    await esperar(() => !sigue() || camCerca(0.4)); if (!sigue()) return;
    encenderTele(p, mio);
  }
}

// teclado: ↑ ↓ de planta en planta (dentro de la cabina), ← → por los pasos, Esc vuelve uno atrás
addEventListener('keydown', (e) => {
  if (e.target.closest('input, textarea, dialog[open]')) return;
  if (e.target.closest('.tele') && e.key !== 'Escape') return;
  const r = rutas.actual, [id, paso = ''] = r.split('/'), k = PASOS.findIndex((p) => p.id === paso);
  if ((e.key === 'ArrowUp' || e.key === 'ArrowDown') && !e.target.closest('.fila-b') && (r === 'vestibulo' || r === 'obras' || paso === '')) {
    e.preventDefault(); rutas.ir(rutaDePlanta(Math.min(OBRAS, Math.max(0, plantaDe(r) + (e.key === 'ArrowUp' ? 1 : -1))))); return;
  }
  if (r === 'vestibulo') return;
  if (r === 'obras') { if (e.key === 'Escape') { e.preventDefault(); rutas.ir('vestibulo'); } return; }
  if (e.key === 'ArrowRight' && k < PASOS.length - 1) { e.preventDefault(); rutas.ir(rutaDe(id, PASOS[k + 1].id)); }
  else if (e.key === 'ArrowLeft' && k > 0) { e.preventDefault(); rutas.ir(rutaDe(id, PASOS[k - 1].id)); }
  else if (e.key === 'Escape') { e.preventDefault(); rutas.ir(k > 0 ? rutaDe(id, PASOS[k - 1].id) : 'vestibulo'); }
});
// la rueda y el dedo: bajar por la página es subir de planta (una por gesto)
let rueda = 0, ruedaHasta = 0;
const enCabina = () => { const r = rutas.actual; return r === 'vestibulo' || r === 'obras' || !r.includes('/'); };
function otraPlanta(d) {
  if (!enCabina() || $('.lista').open) return;
  const k = Math.min(OBRAS, Math.max(0, plantaDe(rutas.actual) + d));
  if (k !== plantaDe(rutas.actual)) rutas.ir(rutaDePlanta(k));
}
addEventListener('wheel', (e) => {
  if (e.target.closest('.expediente, .lista, .tele, .ficha-lateral')) return;
  const ahora = performance.now(); if (ahora < ruedaHasta) return;
  rueda += e.deltaY; if (Math.abs(rueda) < 50) return;
  ruedaHasta = ahora + 900; otraPlanta(Math.sign(rueda)); rueda = 0;
}, { passive: true });
let dedo = null;
$('#plato').addEventListener('pointerdown', (e) => { if (e.pointerType === 'touch') dedo = { y: e.clientY, t: performance.now() }; });
addEventListener('pointerup', (e) => {
  if (!dedo || e.pointerType !== 'touch') return;
  const dy = dedo.y - e.clientY, rapido = performance.now() - dedo.t < 600; dedo = null;
  if (rapido && Math.abs(dy) > 60) otraPlanta(dy > 0 ? 1 : -1);
});

// ── La lista de las nueve ──
const lista = $('.lista');
$('.lista-ol').innerHTML = PROYECTOS.map((p, i) => `<li><span class="li-n" style="--c:${p.color}">${i + 1}</span>
  <div><b>${p.nombre}</b><span class="li-linea">${p.linea}</span><small>Planta ${i + 1} · ${p.tipo} · ${p.estado}</small></div>
  <span class="li-botones"><button type="button" class="boton boton-claro" data-sacar="${p.id}"><span class="boton-tapa">Su planta</span></button>${p.demo ? `<button type="button" class="boton boton-luz" data-sacar="${p.id}/pantalla"><span class="boton-tapa">Demo</span></button>` : ''}</span></li>`).join('');
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
  const c = camDe(lugar, rutas.actual);
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
  ruta: rutas.actual, planta: redondo(muelles.v.cab), quieto: !muelles.corriendo && !enCurso, lugar, cancela: redondo(muelles.v.cancela),
  encendido, tele: !tele.hidden, enTele: enTele && (enTele === 'encendiendo' ? 'encendiendo' : 'encendida'), teleId,
  ficha: !ficha.hidden, expediente: !expediente.hidden, mandos: !capa.hidden,
});
