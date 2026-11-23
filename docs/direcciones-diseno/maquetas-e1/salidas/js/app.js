// El panel de salidas, con el kit E1. El vestíbulo de una terminal al atardecer: los nueve proyectos son nueve vuelos
// en un panel de paletas. Se elige uno, el quiosco imprime su tarjeta de embarque (la cara: el destino; el dorso: la
// información del vuelo; la colilla: su web) y al embarcar la tarjeta se pasa por el lector del mismo quiosco: su luz
// se pone verde y la pantalla del quiosco pone la demo (Adivinadle) o el tráiler (los demás). Las puertas filtran el
// panel, que se reescribe paleta a paleta.
//
// Como en la estantería, todo sale de unos pocos valores con muelles (imprime, sale, rz, lee, corta, cam): la tarjeta no
// tiene una posición guardada, se calcula en cada fotograma, así que volver a mitad o entrar por un enlace directo
// dejan siempre la escena en un estado posible.
import { montarEscena, THREE, RM, b3 } from '../../../kit-e1/js/motor.js';
import { Muelles, giroCercano, suave, mezclar } from '../../../kit-e1/js/muelles.js';
import { montarRutas } from '../../../kit-e1/js/rutas.js';
import * as C from '../../../kit-e1/js/coleccion.js';
import { PROYECTOS, porId } from '../../../kit-e1/js/datos.js';
import { encender, apagarYa } from '../../../kit-e1/js/pantalla.js';
import { ajustar } from '../../../kit-e1/js/proyectar.js';
import { Tablero } from './paletas.js';
import * as I from './impresos.js';

const $ = (s) => document.querySelector(s);
const movil = () => innerWidth < 760;
const deCanto = () => innerHeight > innerWidth;      // pantalla vertical: la tarjeta, de pie, y el panel con menos columnas
const apilado = () => !movil() && (innerWidth < 1100 || deCanto());   // tableta: el cuadro de información arriba
const PASOS = [
  { id: '', boton: 'Tarjeta', dice: 'La cara de la tarjeta. Arrastra para darle la vuelta; la colilla lleva a su web.' },
  { id: 'dorso', boton: 'Detrás', dice: 'La información del vuelo: qué es, qué hice yo, el resultado y con qué está hecho.' },
  { id: 'embarque', boton: 'Embarcar', dice: '' },
];
// las puertas: A productos, B sistemas propios, C trabajos (empresa, ayuntamiento, fin de ciclo), D pruebas técnicas
const PUERTA = { adivinadle: 'A1', wardux: 'A2', calculo: 'A3', agentes: 'B1', servidor: 'B2', erp: 'C1', marbella: 'C2', vados: 'C3', vision: 'D1' };
const GRUPOS = [['', 'Todas'], ['A', 'Productos'], ['B', 'Sistemas'], ['C', 'Trabajos'], ['D', 'Pruebas']];
// las horas de salida: a partir de la hora de verdad, redondeada, cada pocos minutos
const HORAS = (() => {
  const d = new Date(); const base = Math.ceil((d.getHours() * 60 + d.getMinutes() + 10) / 5) * 5;
  return [0, 5, 15, 20, 30, 40, 45, 55, 65].map((m) => { const t = (base + m) % 1440; return `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`; });
})();
const vueloDe = (p) => { const i = PROYECTOS.indexOf(p); return { vuelo: `FM ${p.n}`, puerta: PUERTA[p.id], hora: HORAS[i], asiento: `${p.n}A` }; };
const ESTADO = (p) => p.estado.toUpperCase();
let pintadaVertical = deCanto();   // la tarjeta pintada de pie (vertical) o apaisada
let ultimaEntrada = 'raton';   // el foco solo se devuelve a un sitio cuando se viene del teclado
addEventListener('pointerdown', () => { ultimaEntrada = 'raton'; }, true);
addEventListener('keydown', () => { ultimaEntrada = 'teclado'; }, true);

// ── Arranque ──
await C.cargar();
let seleccion = -1, rutas = null, filtro = '', encima = -1;
const AZUL = '#7fd1ff', VERDE = '#3ee07a';   // la luz del lector: esperando / tarjeta leída
const S = await montarEscena({
  plato: $('#plato'), luz: 'luz/', fondo: '#1a1b1d', exposicion: 1.04,
  etiqueta: 'El vestíbulo de una terminal: un panel de salidas con los nueve proyectos como vuelos, un reloj y un quiosco que imprime tarjetas de embarque',
  material(n, { textura }) {
    if (n === 'tablero_luz' || n.startsWith('ventanal_')) return null;            // solo estaban para hornear la luz
    if (n === 'tablero_rotulos') return { luz: 'tablero', mapa: textura('rotulos', I.TAM.rotulos) };
    if (n === 'cartel_cara') return { mapa: textura('cartel', I.TAM.cartel) };    // retroiluminado: sin luz horneada
    if (n === 'quiosco_pantalla') return { mapa: textura('quiosco', I.TAM.quiosco) };
    if (n === 'quiosco_luz_lector') return { color: '#000000', emite: AZUL };
    if (/^(pared|suelo|techo)/.test(n)) return { luz: 'sala' };
    if (n.startsWith('tablero_') || n.startsWith('cartel_')) return { luz: 'tablero', brillo: /riel|varilla|marco/.test(n) ? 0.3 : 0.08 };
    if (n.startsWith('quiosco_') || n.startsWith('reloj_')) return { luz: 'quiosco', brillo: n.startsWith('reloj_') ? 0.25 : 0.14 };
    if (n === 'tarjeta_cara') return { luz: 'tarjeta', mapa: textura('cara', I.TAM.cara), brillo: 0.05 };
    if (n === 'tarjeta_dorso') return { luz: 'tarjeta', mapa: textura('dorso', I.TAM.dorso), brillo: 0.05 };
    if (n === 'colilla_cara') return { luz: 'tarjeta', mapa: textura('colilla', I.TAM.colilla), brillo: 0.05 };
    if (n === 'colilla_dorso') return { luz: 'tarjeta', mapa: textura('colilla_dorso', I.TAM.colilla_dorso), brillo: 0.05 };
    return { luz: 'tarjeta', brillo: 0.05 };
  },
});
const { nodo, lienzos, texturas } = S;
const D = S.datos, T = D.tablero, Q = D.quiosco, TJ = D.tarjeta, P = D.pantalla, L = D.lector;
const tarjeta = nodo.tarjeta, colillaN = nodo.colilla;
const colillaCasa = colillaN.position.clone();
const luzLector = nodo.quiosco_luz_lector.material;
const tarjetaMats = new Set(), fondoMats = [];
tarjeta.traverse((o) => { if (o.isMesh) tarjetaMats.add(o.material); });
S.escena.traverse((o) => { if (o.isMesh && o.material.uniforms && !tarjetaMats.has(o.material)) fondoMats.push(o.material); });

// la luz de las paletas: el plano horneado, leído por posición
const luzPaletas = await new THREE.TextureLoader().loadAsync('luz/tablero_luz.webp');
luzPaletas.colorSpace = THREE.SRGBColorSpace; luzPaletas.flipY = false;
const escalas = await fetch('luz/luz.json').then((x) => x.json());
const tablero = new Tablero(S, T, { luz: luzPaletas, escala: escalas.tablero_luz, RM, alCambiar: () => marcha() });

// lo impreso fijo: el cartel y la pantalla del quiosco
I.cartel(lienzos.cartel); texturas.cartel.needsUpdate = true;
function pantallaQuiosco(estado, p) { I.quiosco(lienzos.quiosco, estado, p); texturas.quiosco.needsUpdate = true; S.pedirDibujo(); }
pantallaQuiosco('espera');

// ── El panel: qué dice cada fila según el filtro y el ancho ──
// en vertical, lo que importa primero (destino, puerta y estado) a la izquierda: en el móvil se ven las 20 primeras
// columnas; en la tableta, el panel entero (si no, la última columna asomaba cortada por el borde). En horizontal, el orden de un aeropuerto, con una paleta libre a la derecha para que nada toque el borde
function columnas() {
  // en el móvil solo se ven las 20 primeras: el estado va más lejos para que no asome cortado por el borde
  if (movil()) return [['DESTINO', 0, 17], ['PUERTA', 18, 2], ['ESTADO', 27, 13], ['HORA', 41, 5]];
  return deCanto()
    ? [['DESTINO', 0, 17], ['PUERTA', 18, 2], ['ESTADO', 21, 13], ['HORA', 35, 5], ['VUELO', 41, 4]]
    : [['HORA', 0, 5], ['VUELO', 6, 4], ['DESTINO', 11, 17], ['PUERTA', 29, 2], ['ESTADO', 32, 13]];
}
const columnasVistas = () => (movil() ? 20 : T.cols);
let filasProyecto = [];
function textoFila(p, estado) {
  const v = vueloDe(p), linea = new Array(T.cols).fill(' ');
  const valores = { HORA: v.hora, VUELO: v.vuelo.replace(' ', ''), DESTINO: p.nombre.toUpperCase(), PUERTA: v.puerta, ESTADO: estado ?? ESTADO(p) };
  for (const [nombre, desde, ancho] of columnas()) [...valores[nombre].slice(0, ancho)].forEach((ch, k) => { linea[desde + k] = ch; });
  return linea.join('');
}
let maquetaColumnas = '';
function escribirPanel({ inmediato = false } = {}) {
  filasProyecto = PROYECTOS.filter((p) => !filtro || PUERTA[p.id][0] === filtro);
  while (filasProyecto.length < T.filas) filasProyecto.push(null);
  const sel = PROYECTOS[seleccion];
  const lineas = filasProyecto.map((p) => (p ? textoFila(p, p === sel && rutaFuera() ? 'EMBARCANDO' : null) : ''));
  const tintas = filasProyecto.map((p, r) => !!p && ((p === sel && rutaFuera()) || r === encima));
  tablero.escribir(lineas, { inmediato, tintas });
  const cols = columnas(), clave = cols.map((c) => c[1]).join();
  if (clave !== maquetaColumnas) {
    maquetaColumnas = clave;
    I.rotulos(lienzos.rotulos, cols.map(([n, d]) => [n, d]), T.cols); texturas.rotulos.needsUpdate = true;
  }
  botonesFila.forEach((b, r) => {
    const p = filasProyecto[r]; b.hidden = !p;
    if (p) { const v = vueloDe(p); b.setAttribute('aria-label', `Vuelo ${v.vuelo} a ${p.nombre}, puerta ${v.puerta}, ${p.estado}. ${p.linea}`); }
  });
}

// ── Dónde está cada cosa ──
const MANO = { x: Q.x - 4.6, y: Q.y - 5.2, z: Q.ranura_z + 1.3 };      // la tarjeta en la mano, delante del quiosco
const BOCA = { x: Q.x, y: Q.y - 0.45, z: Q.ranura_z };
const LARGO = TJ.ancho + TJ.colilla;
const bordeHeroe = () => heroe.offsetLeft + heroe.offsetWidth;   // sin transformaciones: vale también mientras se esconde
// la parte de la pantalla donde tiene que caber lo encuadrado (en píxeles), según el tamaño: el panel, al lado del
// cuadro de información (o debajo, en tableta y móvil) y con sitio para las puertas; la tarjeta y el quiosco, entre la
// cabecera y la barra de pasos
function zonaDe(que) {
  const W = innerWidth, H = innerHeight, m = movil();
  if (que === 'panel') {
    if (!apilado() && !m) { const x = bordeHeroe() + 24; return { zx: x, zy: 70, zw: W - x - 24, zh: H - 70 - 78 }; }
    const y = heroe.offsetTop + heroe.offsetHeight + (m ? 8 : 16);
    return { zx: m ? 8 : 24, zy: y, zw: W - (m ? 16 : 48), zh: H - y - (m ? 64 : 80) };
  }
  const arriba = m ? 58 : 76, abajo = (recorrido.hidden ? 120 : recorrido.offsetHeight) + (m ? 20 : 34);
  return { zx: m ? 10 : 32, zy: arriba, zw: W - (m ? 20 : 64), zh: H - arriba - abajo };
}
function camaraDe(ruta) {
  const [id, paso] = ruta.split('/');
  if (id === 'panel') {
    const n = columnasVistas(), entero = n === T.cols;
    // con el titular encima (tableta y móvil) el cuadro sube un poco: el cartel «Salidas» y el reloj, enteros bajo él
    const arriba = apilado() || movil();
    return { x: entero ? T.x + 0.3 : T.x0 + (n * T.paso_x) / 2, y: T.y, z: T.z + (arriba ? 1.1 : 0.6), dist: 60, alto: arriba ? 11.4 : 10.4, ancho: entero ? T.ancho + 1.2 : n * T.paso_x + 0.4, inclina: 2, ...zonaDe('panel') };
  }
  const z = zonaDe('tarjeta');
  if (paso === 'embarque') return enPantalla ? camPantalla() : camLector();
  // imprimiendo: la pantalla del quiosco entera (dice qué vuelo imprime) y la boca, con la tarjeta saliendo
  if (ruta === 'imprime') return { x: Q.x - 0.3, y: BOCA.y, z: 8.7, dist: 16, alto: 4.9, ancho: 4.4, inclina: 12, ...z };
  if (deCanto()) return { x: MANO.x, y: MANO.y, z: MANO.z, dist: 9, alto: LARGO + 0.12, ancho: TJ.alto + 0.12, inclina: 0, ...z };
  return { x: MANO.x, y: MANO.y, z: MANO.z, dist: 9, alto: TJ.alto + 0.24, ancho: LARGO + 0.3, inclina: 0, ...z };
}
// al embarcar: primero el quiosco de arriba abajo (la tarjeta llega al lector y su luz se pone verde) y luego, de
// frente y cerca, su pantalla con el marco
let enPantalla = false;
const camLector = () => ({ x: Q.x, y: Q.y, z: 7.9, dist: 16, alto: 6.4, ancho: 3.8, inclina: 6, ...zonaDe('tarjeta') });
const camPantalla = () => ({ x: P.x, y: P.y, z: P.z, dist: 10, alto: 2.3 + 0.18, ancho: 2.9 + 0.18, inclina: 0, ...zonaDe('tarjeta') });
const OBJ = {
  panel: { imprime: 0, sale: 0, rz: 0, lee: 0 },
  '': { imprime: 1, sale: 1, rz: 0, lee: 0 },
  dorso: { imprime: 1, sale: 1, rz: 180, lee: 0 },
};
const heroe = $('.heroe'), recorrido = $('.recorrido');
// cerca del amortiguamiento crítico: llegan rápido y sin rebotar. Ningún paso pasa de un segundo
const muelles = new Muelles({ ...OBJ.panel, corta: 0, cam: camaraDe('panel') }, { rigidez: 150, amort: 22.5 })
  .ritmo('cam', 120, 21).ritmo('imprime', 110, 20).ritmo('lee', 140, 22.5).ritmo('corta', 60, 13);
const R = THREE.MathUtils.degToRad, e1 = new THREE.Euler();
const quatB = (rx, ry, rz) => new THREE.Quaternion().setFromEuler(e1.set(R(rx), R(rz), R(-ry), 'YZX'));
const qPlana = quatB(-90, 0, -90);           // tumbada y con la colilla por delante: así sale de la impresora
const qLee = quatB(0, 0, 0);                 // de pie contra el lector, por su cara
const pA = new THREE.Vector3(), pB = new THREE.Vector3(), qB = new THREE.Quaternion();
const pLee = b3(L.x, L.y - 0.06, L.z - 0.27);   // tapa el lector, con su luz asomando por encima

function colocar(v) {
  // 1) la tarjeta: sale tumbada por la boca de la impresora y luego sube a la mano, de pie
  const dentro = BOCA.y + LARGO / 2 + 0.06, fuera = BOCA.y - LARGO / 2 + 0.22;
  pA.copy(b3(BOCA.x, mezclar(dentro, fuera, v.imprime), BOCA.z));
  const s = suave(0, 1, v.sale), l = suave(0, 1, v.lee);
  const de = 360 * Math.round(v.rz / 360);
  qB.copy(quatB(0, pintadaVertical ? 90 : 0, mezclar(de, v.rz, s)));
  pB.copy(b3(MANO.x, MANO.y, MANO.z));
  tarjeta.position.lerpVectors(pA, pB, s); tarjeta.position.y += Math.sin(Math.PI * s) * 0.6;
  tarjeta.quaternion.slerpQuaternions(qPlana, qB, s);
  // 1b) al embarcar, de donde esté (la mano o la boca de la impresora) al lector
  if (l > 0) { tarjeta.position.lerp(pLee, l); tarjeta.position.y += Math.sin(Math.PI * l) * 0.3 * s; tarjeta.quaternion.slerp(qLee, l); }
  tarjeta.visible = seleccion >= 0 && v.imprime > 0.002;
  // 2) la colilla: se arranca por el troquel (gira hacia fuera, se aparta y desaparece)
  colillaN.rotation.set(0, R(-38 * v.corta), 0);
  colillaN.position.copy(colillaCasa).add(new THREE.Vector3(0.35 * v.corta, -0.25 * v.corta * v.corta, 0));
  colillaN.visible = v.corta < 0.97;
  // 3) con la tarjeta en la mano, el vestíbulo se apaga: un foco sobre ella (que no distraiga nada de detrás)
  const foco = seleccion >= 0 ? s * (1 - l) : 0;
  for (const m of fondoMats) m.uniforms.atenua.value = 1 - 0.9 * foco;   // (con 0.78 aún asomaba el reloj detrás de la tarjeta)
  // las paletas tienen su propio material y su luz es muy intensa: aun al 4 % asomaba una cifra detrás de la tarjeta.
  // Se apagan del todo con la tarjeta en la mano
  tablero.mat.uniforms.exposicion.value = (1 - foco) * (1 - foco); tablero.malla.visible = foco < 0.995;
  luzLector.uniforms.emite.value.set(seleccion >= 0 && v.lee > 0.9 ? VERDE : AZUL);
  S.encuadrar(v.cam);
}

// ── El reloj: la hora de verdad ──
function reloj() {
  const d = new Date(), seg = d.getSeconds(), min = d.getMinutes() + seg / 60, h = (d.getHours() % 12) + min / 60;
  nodo.reloj_eje_segundos.rotation.set(0, 0, -R(seg * 6));
  nodo.reloj_eje_minutos.rotation.set(0, 0, -R(min * 6));
  nodo.reloj_eje_horas.rotation.set(0, 0, -R(h * 30));
}
setInterval(() => { if (!document.hidden && (rutas?.actual ?? 'panel') === 'panel') { reloj(); S.pedirDibujo(); } }, 1000);
reloj();

// ── Lo que se mueve: muelles, paletas y el ligero (menos píxeles mientras algo se mueve, en el modo sin gráfica) ──
function marcha() { S.enMarcha(muelles.corriendo || !tablero.quieto); }
muelles.alMover = () => { marcha(); S.pedirDibujo(); };
muelles.alParar = () => { marcha(); S.pedirDibujo(); };   // un último dibujo en reposo: coloca el enlace de la colilla, las filas…
S.alDibujar = () => { tablero.actualizar(); colocar(muelles.v); seguirFilas(); seguirTele(); seguirColilla(); seguirPuertas(); };

// ── Las filas: un botón invisible encima de cada vuelo ──
const capaFilas = $('#filas'), etiqueta = $('.etiqueta');
capaFilas.innerHTML = Array.from({ length: T.filas }, (_, r) => `<button type="button" class="fila-b" data-r="${r}"></button>`).join('');
const botonesFila = [...capaFilas.children];
function seguirFilas() {
  const ver = (rutas?.actual ?? 'panel') === 'panel';
  capaFilas.hidden = !ver; if (!ver) { etiqueta.hidden = true; return; }
  const hasta = columnasVistas();
  botonesFila.forEach((b, r) => {
    const [x, y, w, h] = tablero.rectFila(r, 0, hasta);
    b.style.cssText = `left:${x}px;top:${y}px;width:${w}px;height:${h}px`;
  });
  const k = botonesFila.findIndex((b) => !b.hidden && b.matches(':hover, :focus-visible'));
  const p = filasProyecto[k];
  if (k >= 0 && p) {
    const c = columnas().find((x) => x[0] === 'DESTINO');
    const [x, y, , h] = tablero.rectFila(k, c[1], c[1] + c[2]);
    etiqueta.querySelector('b').textContent = `${vueloDe(p).vuelo} · ${p.tipo}`; etiqueta.querySelector('span').textContent = p.linea;
    const ex = Math.min(Math.max(8, x), innerWidth - 310);
    etiqueta.style.transform = `translate(${Math.round(ex)}px, ${Math.round(y + h)}px)`; etiqueta.hidden = false;
  } else etiqueta.hidden = true;
}
function resaltar(r) {
  if (encima === r) return; encima = r;
  const sel = PROYECTOS[seleccion];
  filasProyecto.forEach((p, k) => tablero.tinta(k, !!p && (k === r || (p === sel && rutaFuera())) ? 1 : 0));
  S.pedirDibujo();
}
capaFilas.addEventListener('pointerover', (e) => { const b = e.target.closest('.fila-b'); if (b) preparar(+b.dataset.r); if (b && e.pointerType !== 'touch') resaltar(+b.dataset.r); });
capaFilas.addEventListener('pointerleave', () => resaltar(-1));
capaFilas.addEventListener('focusin', (e) => { const b = e.target.closest('.fila-b'); if (b) preparar(+b.dataset.r); if (b?.matches(':focus-visible')) resaltar(+b.dataset.r); });
capaFilas.addEventListener('focusout', () => resaltar(-1));
capaFilas.addEventListener('click', (e) => { const b = e.target.closest('.fila-b'); const p = b && filasProyecto[+b.dataset.r]; if (p) rutas.ir(p.id); });
capaFilas.addEventListener('keydown', (e) => {
  const b = e.target.closest('.fila-b'); if (!b) return;
  const vivos = botonesFila.filter((x) => !x.hidden), i = vivos.indexOf(b);
  const j = ['ArrowDown', 'ArrowRight'].includes(e.key) ? Math.min(vivos.length - 1, i + 1) : ['ArrowUp', 'ArrowLeft'].includes(e.key) ? Math.max(0, i - 1) : e.key === 'Home' ? 0 : e.key === 'End' ? vivos.length - 1 : i;
  if (j !== i) { e.preventDefault(); vivos[j].focus(); }
});

// ── Las puertas ──
const puertas = $('.puertas');
puertas.innerHTML = GRUPOS.map(([g, n]) => `<button type="button" data-puerta="${g}" aria-pressed="${g === ''}"${g ? ` aria-label="Puerta ${g}: ${n}"` : ''}>${g ? `<b>${g}</b>` : ''}<span>${n}</span></button>`).join('');
puertas.hidden = false;
puertas.addEventListener('click', (e) => {
  const b = e.target.closest('[data-puerta]'); if (!b || b.dataset.puerta === filtro) return;
  filtro = b.dataset.puerta;
  for (const x of puertas.children) x.setAttribute('aria-pressed', String(x.dataset.puerta === filtro));
  encima = -1; escribirPanel();
});
function seguirPuertas() {
  if ((rutas?.actual ?? 'panel') !== 'panel') return;
  const [x, y] = S.aPantalla(T.x0 - 0.05, T.y_paletas, T.z - T.alto / 2 - 0.25);
  const w = puertas.offsetWidth, ex = Math.min(Math.max(12, x), innerWidth - w - 12);
  puertas.style.transform = `translate(${Math.round(ex)}px, ${Math.round(Math.min(y + 10, innerHeight - 60))}px)`;
}

// ── El recorrido con la tarjeta ──
const pasos = $('.pasos'), dice = $('.dice'), ficha = $('.ficha-lateral');
pasos.innerHTML = PASOS.map((p, i) => `<button type="button" data-paso="${p.id}"><i>${i + 1}</i><span>${p.boton}</span></button>`).join('');
pasos.addEventListener('click', (e) => { const b = e.target.closest('[data-paso]'); if (b) rutas.ir(rutaDe(idActual(), b.dataset.paso)); });
document.addEventListener('click', (e) => {
  const a = e.target.closest('[data-ir]'); if (a) { e.preventDefault(); rutas.ir(a.dataset.ir); }
  const b = e.target.closest('[data-ir-paso]'); if (b) rutas.ir(rutaDe(idActual(), b.dataset.irPaso));
});
const rutaDe = (id, paso) => (paso ? `${id}/${paso}` : id);
const idActual = () => (rutas.actual ?? 'panel').split('/')[0];
const rutaFuera = () => (rutas?.actual ?? 'panel') !== 'panel';
function pintarFicha(p) {
  const v = vueloDe(p);
  ficha.querySelector('.fl-n').textContent = `Vuelo ${v.vuelo} · puerta ${v.puerta}`;
  ficha.querySelector('.fl-nombre').textContent = p.nombre;
  ficha.querySelector('.fl-tipo').textContent = `${p.tipo} · ${p.estado}`;
  ficha.querySelector('.fl-linea').textContent = p.linea;
  ficha.querySelector('.fl-web').innerHTML = p.web ? `<a href="${p.web[1]}" target="_blank" rel="noopener">${p.web[0]} ↗</a>` : '';
}
// La tarjeta se pinta una cara por fotograma, con la tarjeta aún dentro de la impresora, y antes de hacer falta: en
// cuanto el ratón o el foco se posan en una fila del panel. Al pulsar, ya está (sin gráfica, imprimir empezaba con
// un parón). Si se pide otro vuelo a mitad, el pintado viejo se deja y empieza el nuevo.
let pintada = null, pintando = Promise.resolve();
function pintarTarjeta(p) {
  const vert = deCanto(), clave = `${p.id}|${vert}`;
  if (pintada === clave) return pintando;
  pintada = clave; pintadaVertical = vert;
  const antes = pintando;
  pintando = (async () => {
    await antes; await C.cargarArte(p.id);
    const fot = () => new Promise((ok) => requestAnimationFrame(ok)), v = vueloDe(p);
    const caras = vert
      ? { cara: () => I.caraVertical(lienzos.cara, p, v), colilla: () => I.colillaVertical(lienzos.colilla, p, v), dorso: () => I.dorsoVertical(lienzos.dorso, p), colilla_dorso: () => I.colillaDorsoVertical(lienzos.colilla_dorso, p) }
      : { cara: () => I.cara(lienzos.cara, p, v), colilla: () => I.colilla(lienzos.colilla, p, v), dorso: () => I.dorso(lienzos.dorso, p), colilla_dorso: () => I.colillaDorso(lienzos.colilla_dorso, p) };
    for (const [id, pinta] of Object.entries(caras)) {
      if (pintada !== clave) return;
      await pinta(); texturas[id].needsUpdate = true; S.r.initTexture(texturas[id]); await fot();
    }
  })();
  return pintando;
}
// preparar la tarjeta de una fila mientras se mira (solo con la impresora vacía: si no, se vería cambiar)
function preparar(r) {
  const p = filasProyecto[r];
  if (!p || seleccion >= 0 || (rutas?.actual ?? 'panel') !== 'panel' || muelles.v.imprime > 0.003 || muelles.obj.imprime !== 0) return;
  pintarTarjeta(p);
}

// la colilla: un enlace de verdad encima; al pulsarlo se arranca
const enlaceColilla = $('.colilla-enlace');
const cajaColilla = new THREE.Box3(), esquina = new THREE.Vector3();
function seguirColilla() {
  const p = PROYECTOS[seleccion], v = muelles.v;
  const ver = !!p?.web && rutas?.actual === p.id && v.sale > 0.97 && Math.abs(v.rz - 360 * Math.round(v.rz / 360)) < 4 && v.corta < 0.01 && !muelles.corriendo;
  enlaceColilla.hidden = !ver; if (!ver) return;
  if (enlaceColilla.dataset.id !== p.id) {
    enlaceColilla.dataset.id = p.id; enlaceColilla.href = p.web[1];
    enlaceColilla.querySelector('.oculto').textContent = `Arrancar la colilla e ir a ${p.web[0]} (se abre en otra pestaña)`;
  }
  // el rectángulo de la colilla en pantalla, sea cual sea la postura de la tarjeta (apaisada o de pie)
  tarjeta.updateMatrixWorld(true); cajaColilla.setFromObject(nodo.colilla_cara);
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (let k = 0; k < 8; k++) {
    esquina.set(k & 1 ? cajaColilla.max.x : cajaColilla.min.x, k & 2 ? cajaColilla.max.y : cajaColilla.min.y, k & 4 ? cajaColilla.max.z : cajaColilla.min.z).project(S.camara);
    const sx = (esquina.x + 1) / 2 * innerWidth, sy = (1 - esquina.y) / 2 * innerHeight;
    x0 = Math.min(x0, sx); x1 = Math.max(x1, sx); y0 = Math.min(y0, sy); y1 = Math.max(y1, sy);
  }
  enlaceColilla.style.cssText = `left:${x0}px;top:${y0}px;width:${x1 - x0}px;height:${y1 - y0}px`;
}
// la web se abre en otra pestaña; al cabo de un momento la colilla vuelve a su sitio, para quien quiera ir otra vez
// (antes se quedaba arrancada y el enlace desaparecía de la tarjeta)
let reponer = 0;
enlaceColilla.addEventListener('click', () => {
  muelles.empujar('corta', 1); if (RM) muelles.ir({ corta: 1 }, true);
  clearTimeout(reponer);
  reponer = setTimeout(() => { if (muelles.obj.corta === 1) { muelles.empujar('corta', 0); if (RM) muelles.ir({ corta: 0 }, true); } }, 1800);
});

// ── La pantalla del quiosco: el cristal encima del 3D, pegado a sus cuatro esquinas (matrix3d) ──
const tele = $('#tele'), mandos = $('.tele-mandos'), webTele = $('.tele-web');
let enTele = null, teleId = null, teleTurno = 0;
function seguirTele() {
  if (tele.hidden) return;
  if (movil()) { tele.style.cssText = ''; tele.classList.add('completa'); return; }
  tele.classList.remove('completa');
  const g = 0.012, x0 = P.x - P.ancho / 2 + g, x1 = P.x + P.ancho / 2 - g, z0 = P.z + P.alto / 2 - g, z1 = P.z - P.alto / 2 + g;
  ajustar(tele, [S.aPantalla(x0, P.y, z0), S.aPantalla(x1, P.y, z0), S.aPantalla(x1, P.y, z1), S.aPantalla(x0, P.y, z1)]);
}
// cada encendido lleva su número: si mientras arranca se apaga (o se cambia de vuelo), el viejo se retira. Con otro
// vuelo, la pantalla del kit sustituye al anterior en el acto (nunca se queda el viejo puesto)
async function encenderTele(p) {
  if (enTele && teleId === p.id) return;
  const mio = ++teleTurno; enTele = 'encendiendo'; teleId = p.id;
  pintarMandos(p);
  const t = await encender(p, { el: tele, RM, guardado: null, alResolver: null });
  if (mio !== teleTurno || !t) { if (mio === teleTurno) t?.apagar(); return; }
  enTele = t; seguirTele();
  // el foco, en el primer mando (fuera de la pantalla): con el teclado no hay que cruzar la demo para salir
  if (ultimaEntrada === 'teclado' || document.activeElement === document.body) mandos.querySelector('button')?.focus({ preventScroll: true });
}
function pintarMandos(p) {
  mandos.hidden = false; webTele.hidden = !p.web;
  if (p.web) { webTele.href = p.web[1]; webTele.querySelector('.boton-tapa').textContent = `${p.web[0].replace(/^github\.com\/[^/]+\//, 'GitHub: ')} ↗`; }
  requestAnimationFrame(() => mandos.classList.add('puestos'));
}
function apagarTele() {
  if (!enTele) return;
  teleTurno++;
  mandos.classList.remove('puestos'); mandos.hidden = true;
  const t = enTele; enTele = null; teleId = null;
  if (t !== 'encendiendo') t.apagar(); else apagarYa(tele);
  S.pedirDibujo();
}

// ── Rutas: #panel, #<id>, #<id>/dorso, #<id>/embarque ──
rutas = montarRutas({
  inicio: 'panel',
  validar(r) {
    if (!r || r === 'panel') return 'panel';
    const [id, paso = ''] = r.split('/');
    return porId(id) && PASOS.some((p) => p.id === paso) ? rutaDe(id, paso) : null;
  },
  alCambiar: (ruta, o) => irA(ruta, o),
});

let turno = 0, enCurso = 0;
const cerca = (campo, x, tol) => Math.abs(muelles.v[campo] - x) < tol;
function esperar(cond) { return new Promise((ok) => { const mira = () => (cond() ? ok() : requestAnimationFrame(mira)); mira(); }); }
async function fase(objetivo, campos, mio, tol = 0.05) {
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
  document.documentElement.dataset.ruta = id === 'panel' ? 'panel' : paso || 'tarjeta';
  // el foco: se mira antes de esconder nada (al esconder su caja, el navegador lo suelta)
  const f = document.activeElement, perdido = !f || f === document.body || !!f.closest('.fila-b, .lista, .pasos, .recorrido, .tele, .heroe');
  const antes = PROYECTOS[seleccion];
  heroe.toggleAttribute('inert', id !== 'panel');
  recorrido.hidden = id === 'panel'; ficha.hidden = id === 'panel' || paso === 'embarque';
  if (p) {
    for (const b of pasos.children) b.setAttribute('aria-current', b.dataset.paso === paso ? 'step' : 'false');
    dice.textContent = paso === 'embarque' ? (p.demo ? 'La demo es una simulación: personajes inventados, la mecánica es la del juego.' : 'El tráiler del proyecto, en la pantalla del quiosco.') : PASOS.find((x) => x.id === paso).dice;
    pintarFicha(p);
  }
  if (p && paso !== 'embarque' && perdido) requestAnimationFrame(() => pasos.querySelector('[aria-current="step"]')?.focus({ preventScroll: true }));
  if (id === 'panel' && perdido && ultimaEntrada === 'teclado') requestAnimationFrame(() => { S.dibujar(); botonesFila[Math.max(0, filasProyecto.indexOf(antes))]?.focus({ preventScroll: true }); });
  const otra = seleccion >= 0 && (!p || seleccion !== i);
  if (paso !== 'embarque') { apagarTele(); enPantalla = false; }

  // con la pantalla ya puesta, otro vuelo: se cambia la tarjeta fuera de cuadro y la pantalla cambia de disco
  if (paso === 'embarque' && otra && enPantalla && !inmediato) {
    seleccion = i; escribirPanel();
    await pintarTarjeta(p); if (mio !== turno) return;
    muelles.ir({ imprime: 1, sale: 0, lee: 1, rz: 0, corta: 0 }, true); muelles.ir({ cam: camPantalla() });
    pantallaQuiosco('leida', p); encenderTele(p);
    return;
  }
  if (otra) apagarTele();
  if (inmediato || RM) {
    if (p && seleccion !== i) { seleccion = i; await pintarTarjeta(p); if (mio !== turno) return; }
    if (!p) seleccion = -1;
    pantallaQuiosco(!p ? 'espera' : paso === 'embarque' ? 'leida' : 'imprime', p);
    escribirPanel({ inmediato: true });
    enPantalla = paso === 'embarque';
    const fin = !p ? OBJ.panel : paso === 'embarque' ? { imprime: 1, sale: muelles.v.sale > 0.5 ? 1 : 0, rz: 0, lee: 1 } : OBJ[paso];
    muelles.ir({ ...fin, rz: giroCercano(muelles.v.rz, fin.rz), corta: 0, cam: camaraDe(ruta) }, true);
    S.pedirDibujo();
    if (paso === 'embarque') encenderTele(p);
    return;
  }
  // 1) de vuelta al panel: la tarjeta vuelve a la impresora, que se la traga, mientras la cámara ya se va
  if (!p) {
    pantallaQuiosco('espera'); escribirPanel();
    muelles.ir({ ...OBJ.panel, rz: giroCercano(muelles.v.rz, 0), cam: camaraDe('panel') });
    await esperar(() => mio !== turno || muelles.v.imprime < 0.003);
    if (mio === turno) { seleccion = -1; muelles.tocar('corta', 0); escribirPanel(); }
    return;
  }
  // 1b) otra tarjeta en la mano: a la impresora, y sale la nueva
  if (otra && muelles.v.imprime > 0.002) {
    const cam = camaraDe('imprime');
    if (muelles.v.sale > 0.01 || muelles.v.lee > 0.01) { if (!await fase({ sale: 0, lee: 0, rz: giroCercano(muelles.v.rz, 0), cam }, ['sale', 'lee'], mio, 0.12)) return; }
    if (!await fase({ imprime: 0, cam }, ['imprime'], mio, 0.03)) return;
  }
  // 2) la tarjeta nueva: se pinta dentro de la impresora y sale
  if (seleccion !== i || muelles.v.imprime < 0.002) {
    seleccion = i; muelles.tocar('corta', 0); muelles.tocar('lee', 0); muelles.tocar('sale', 0);
    escribirPanel(); pantallaQuiosco('imprime', p);
    await pintarTarjeta(p); if (mio !== turno) return;
  } else escribirPanel();
  if (muelles.v.imprime < 0.9) { if (!await fase({ imprime: 1, cam: camaraDe('imprime') }, ['imprime'], mio, 0.45)) return; }
  // 3) a la mano, por la cara o por el dorso (y la colilla, si se había arrancado, vuelve a su sitio)
  if (paso !== 'embarque') {
    pantallaQuiosco('imprime', p);
    muelles.ir({ ...OBJ[paso], rz: giroCercano(muelles.v.rz, OBJ[paso].rz), corta: 0, cam: camaraDe(id) });
    return;
  }
  // 4) embarcar: la tarjeta, al lector (desde la mano o recién impresa); se pone la luz verde y la cámara se acerca a
  // la pantalla, que arranca mientras llega
  if (!await fase({ lee: 1, rz: giroCercano(muelles.v.rz, 0), corta: 0, cam: camLector() }, ['lee'], mio, 0.12)) return;
  pantallaQuiosco('leida', p);
  enPantalla = true; muelles.ir({ cam: camPantalla() });
  encenderTele(p);
}

// teclado: ← → por los pasos; Esc, al panel (también desde dentro de la pantalla), por el historial si se puede
addEventListener('keydown', (e) => {
  if (e.target.closest?.('input, textarea, dialog[open]')) return;
  if (e.target.closest?.('.tele') && e.key !== 'Escape') return;
  const r = rutas.actual; if (r === 'panel') return;
  const [id, paso = ''] = r.split('/'), k = PASOS.findIndex((p) => p.id === paso);
  if (e.key === 'ArrowRight' && k < PASOS.length - 1) { e.preventDefault(); rutas.ir(rutaDe(id, PASOS[k + 1].id)); }
  else if (e.key === 'ArrowLeft' && k > 0) { e.preventDefault(); rutas.ir(rutaDe(id, PASOS[k - 1].id)); }
  else if (e.key === 'Escape') { e.preventDefault(); rutas.volverA('panel'); }
});

// arrastrar la tarjeta para darle la vuelta
let arr = null;
$('#plato').addEventListener('pointerdown', (e) => {
  const paso = rutas.actual.split('/')[1] ?? '';
  if (rutas.actual === 'panel' || !['', 'dorso'].includes(paso) || e.button !== 0 || muelles.v.sale < 0.95) return;
  arr = { x: e.clientX, rz: muelles.obj.rz, id: e.pointerId, movido: false };
  e.currentTarget.setPointerCapture(e.pointerId);
});
$('#plato').addEventListener('pointermove', (e) => {
  if (!arr || e.pointerId !== arr.id) return;
  const dx = e.clientX - arr.x; if (!arr.movido && Math.abs(dx) < 5) return;
  arr.movido = true; document.documentElement.classList.add('arrastrando'); muelles.empujar('rz', arr.rz + dx * 0.5);
});
const soltar = (e) => {
  if (!arr || e.pointerId !== arr.id) return;
  const movido = arr.movido; arr = null; document.documentElement.classList.remove('arrastrando');
  if (!movido) return;
  const destino = Math.round(muelles.obj.rz / 180) * 180, dorso = Math.abs(Math.round(destino / 180)) % 2 === 1;
  muelles.empujar('rz', destino);
  const quiere = rutaDe(idActual(), dorso ? 'dorso' : '');
  if (quiere !== rutas.actual) rutas.ir(quiere);
};
$('#plato').addEventListener('pointerup', soltar); $('#plato').addEventListener('pointercancel', soltar);

// ── La lista de los nueve ──
const lista = $('.lista');
$('.lista-ol').innerHTML = PROYECTOS.map((p) => `<li><span class="li-vuelo">FM ${p.n}</span>
  <div><b>${p.nombre}</b><span class="li-linea">${p.linea}</span><small>Puerta ${PUERTA[p.id]} · ${p.tipo} · ${p.estado}</small></div>
  <span class="li-botones"><button type="button" class="boton boton-claro" data-sacar="${p.id}"><span class="boton-tapa">Tarjeta</span></button>${p.demo ? `<button type="button" class="boton boton-luz" data-sacar="${p.id}/embarque"><span class="boton-tapa">Embarcar</span></button>` : ''}</span></li>`).join('');
document.addEventListener('click', (e) => {
  if (e.target.closest('[data-abrir="lista"]')) { lista.showModal(); lista.querySelector('[data-sacar]').focus(); }
  const s = e.target.closest('[data-sacar]'); if (s) { lista.close(); rutas.ir(s.dataset.sacar); requestAnimationFrame(() => pasos.querySelector('[aria-current="step"]')?.focus({ preventScroll: true })); }
});
lista.querySelector('.lista-x').addEventListener('click', () => lista.close());
lista.addEventListener('click', (e) => { if (e.target === lista) lista.close(); });
$('.texto-proyectos').innerHTML = PROYECTOS.map((p) => `<li><h3>${p.nombre}</h3><p>${p.linea}</p>${p.bloques.map(([t, x]) => `<p><b>${t}:</b> ${x}</p>`).join('')}</li>`).join('');

// ── Medidas y arranque ──
let eraMovil = movil(), eraVertical = deCanto();
new ResizeObserver(() => document.documentElement.style.setProperty('--barra', `${recorrido.offsetHeight + 18}px`)).observe(recorrido);
addEventListener('resize', () => {
  S.medir();
  if (deCanto() !== eraVertical || movil() !== eraMovil) {                 // el panel cambia el orden de sus columnas
    eraVertical = deCanto(); eraMovil = movil(); escribirPanel();
    if (seleccion >= 0 && pintadaVertical !== deCanto()) pintarTarjeta(PROYECTOS[seleccion]);   // y la tarjeta, de apaisada a de pie
  }
  const r = rutas.actual, c = camaraDe(r);
  if (muelles.corriendo) muelles.empujar('cam', c); else muelles.tocar('cam', c);
  S.dibujar();
});
escribirPanel({ inmediato: true });
rutas.arrancar();
S.dibujar();
S.listo();
// el panel se escribe al entrar, letra a letra (sin movimiento reducido)
if (!RM && rutas.actual === 'panel') { tablero.escribir(new Array(T.filas).fill(''), { inmediato: true }); setTimeout(() => escribirPanel(), 500); }
(window.requestIdleCallback ?? setTimeout)(() => PROYECTOS.forEach((p) => C.cargarArte(p.id)), { timeout: 3000 });
window.__estado = () => ({
  ruta: rutas.actual, seleccion, quieto: !muelles.corriendo && !enCurso && (rutas.actual !== 'panel' || tablero.quieto), filtro, enPantalla,   // el panel cuenta solo cuando se ve
  v: { imprime: muelles.v.imprime, sale: muelles.v.sale, lee: muelles.v.lee, rz: (() => { const g = Math.round(((muelles.v.rz % 360) + 360) % 360 * 1000) / 1000; return g > 180 ? g - 360 : g; })(), corta: muelles.v.corta },
  tarjeta: tarjeta.visible, tele: !tele.hidden, enTele: enTele && (enTele === 'encendiendo' ? 'encendiendo' : 'encendida'), teleId,
  filas: filasProyecto.map((p) => p?.id ?? '').join(','),
});
