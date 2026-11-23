// El panel de salidas, con el kit E1. El vestíbulo de una terminal al atardecer: los nueve proyectos son nueve vuelos
// en un panel de paletas. Se elige uno, el quiosco imprime su tarjeta de embarque (la cara: el destino; el dorso: la
// información del vuelo; la colilla: su web) y al embarcar se pasa a la cabina, donde la pantalla del respaldo pone la
// demo (Adivinadle) o el tráiler (los demás). Las puertas filtran el panel, que se reescribe paleta a paleta.
//
// Como en la estantería, todo sale de unos pocos valores con muelles (imprime, sale, rz, corta, cam): la tarjeta no
// tiene una posición guardada, se calcula en cada fotograma, así que volver a mitad o entrar por un enlace directo
// dejan siempre la escena en un estado posible.
import { montarEscena, THREE, RM, b3 } from '../../../kit-e1/js/motor.js';
import { Muelles, giroCercano, suave, mezclar } from '../../../kit-e1/js/muelles.js';
import { montarRutas } from '../../../kit-e1/js/rutas.js';
import * as C from '../../../kit-e1/js/coleccion.js';
import { PROYECTOS, porId } from '../../../kit-e1/js/datos.js';
import { encender } from '../../../kit-e1/js/pantalla.js';
import { Tablero } from './paletas.js';
import * as I from './impresos.js';

const $ = (s) => document.querySelector(s);
const movil = () => innerWidth < 760;
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

// ── Arranque ──
await C.cargar();
let seleccion = -1, rutas = null, filtro = '', encima = -1;
const S = await montarEscena({
  plato: $('#plato'), luz: 'luz/', fondo: '#1a1b1d', exposicion: 1.04,
  etiqueta: 'El vestíbulo de una terminal: un panel de salidas con los nueve proyectos como vuelos, un reloj y un quiosco que imprime tarjetas de embarque',
  material(n, { textura }) {
    if (n === 'tablero_luz' || n.startsWith('ventanal_')) return null;            // solo estaban para hornear la luz
    if (n === 'tablero_rotulos') return { luz: 'tablero', mapa: textura('rotulos', I.TAM.rotulos) };
    if (n === 'cartel_cara') return { mapa: textura('cartel', I.TAM.cartel) };    // retroiluminado: sin luz horneada
    if (n === 'quiosco_pantalla') return { mapa: textura('quiosco', I.TAM.quiosco) };
    if (n === 'quiosco_luz_lector') return { color: '#000000', emite: '#7fd1ff' };
    if (n === 'cabina_ventana') return { mapa: textura('cielo', I.TAM.cielo) };
    if (n.startsWith('cabina_luz_')) return { color: '#fff1dc' };
    if (/^cabina_asiento_\d_pantalla$/.test(n)) return { color: '#000000', emite: '#0c1018' };   // apagada, con un punto de reflejo
    if (/^cabina_asiento_\d_funda$/.test(n)) return { luz: 'cabina', color: '#b9b2a5', brillo: 0.02 };  // el paño del cabecero: el sol lo quemaba
    if (n.startsWith('cabina_')) return { luz: 'cabina', brillo: /_(marco|pestillo|brazo)$/.test(n) ? 0.18 : 0.04 };
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
const D = S.datos, T = D.tablero, Q = D.quiosco, RJ = D.reloj, TJ = D.tarjeta, P = D.pantalla, V = D.ventana;
const tarjeta = nodo.tarjeta, colillaN = nodo.colilla, raiz = tarjeta.parent;
const colillaCasa = colillaN.position.clone();
// el cielo de la ventanilla se horneó pegado al hueco: un pelo hacia dentro de la cabina, para que no parpadee
nodo.cabina_ventana.position.x += 0.03;
const tarjetaMats = new Set(), fondoMats = [];
tarjeta.traverse((o) => { if (o.isMesh) tarjetaMats.add(o.material); });
S.escena.traverse((o) => { if (o.isMesh && o.material.uniforms && !tarjetaMats.has(o.material) && !o.name.startsWith('cabina_')) fondoMats.push(o.material); });

// la luz de las paletas: el plano horneado, leído por posición
const luzPaletas = await new THREE.TextureLoader().loadAsync('luz/tablero_luz.webp');
luzPaletas.colorSpace = THREE.SRGBColorSpace; luzPaletas.flipY = false;
const escalas = await fetch('luz/luz.json').then((x) => x.json());
const tablero = new Tablero(S, T, { luz: luzPaletas, escala: escalas.tablero_luz, RM, alCambiar: () => marcha() });

// lo impreso fijo: el cartel, el cielo, la pantalla del quiosco
I.cartel(lienzos.cartel); texturas.cartel.needsUpdate = true;
I.cielo(lienzos.cielo); texturas.cielo.needsUpdate = true;
function pantallaQuiosco(estado, p) { I.quiosco(lienzos.quiosco, estado, p); texturas.quiosco.needsUpdate = true; S.pedirDibujo(); }
pantallaQuiosco('espera');

// ── El panel: qué dice cada fila según el filtro y el ancho ──
function columnas() {
  return movil()
    ? [['DESTINO', 0, 17], ['PUERTA', 18, 2], ['ESTADO', 23, 13], ['HORA', 36, 5], ['VUELO', 41, 5]]
    : [['HORA', 0, 5], ['VUELO', 6, 5], ['DESTINO', 12, 17], ['PUERTA', 30, 2], ['ESTADO', 33, 13]];
}
let filasProyecto = [];
function textoFila(p, estado) {
  const v = vueloDe(p), linea = new Array(T.cols).fill(' ');
  const valores = { HORA: v.hora, VUELO: v.vuelo, DESTINO: p.nombre.toUpperCase(), PUERTA: v.puerta, ESTADO: estado ?? ESTADO(p) };
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
function camaraDe(ruta) {
  const m = movil(), [id, paso] = ruta.split('/');
  if (id === 'panel') {
    const zc = T.z + 0.6;                    // el panel y el cartel encima
    if (m) {
      const ancho = 20 * T.paso_x + 0.9;     // las primeras 20 columnas: destino y puerta
      return { x: T.x0 + 10 * T.paso_x, y: T.y, z: zc - 0.4, dist: 60, alto: 9.4, ancho, px: 0.5, py: 0.69, inclina: 2 };
    }
    if (apilado()) {                          // tableta: debajo del cuadro de información, entero
      const [, , arriba, abajo] = huecoApilado();
      return { x: T.x + 0.3, y: T.y, z: zc, dist: 60, alto: 10.4, ancho: T.ancho + 1.2, px: 0.5, py: (arriba + abajo) / 2 / innerHeight, inclina: 2 };
    }
    // el panel, centrado en el hueco que deja a su derecha el cuadro de información
    const hd = bordeHeroe();
    return { x: T.x + 0.3, y: T.y, z: zc, dist: 60, alto: 10.4, ancho: T.ancho + 1.2, px: (hd + innerWidth) / 2 / innerWidth, py: 0.53, inclina: 2 };
  }
  if (paso === 'embarque') return camCabina(enPantalla);
  if (ruta === 'imprime') return { x: BOCA.x - 0.6, y: BOCA.y, z: BOCA.z + 0.4, dist: 16, alto: 3.6, ancho: 4.6, px: m ? 0.5 : 0.6, py: m ? 0.55 : 0.5, inclina: 20 };
  if (m) return { x: MANO.x, y: MANO.y, z: MANO.z, dist: 9, alto: LARGO + 0.06, ancho: TJ.alto + 0.06, px: 0.5, py: 0.48, inclina: 0 };
  return { x: MANO.x, y: MANO.y, z: MANO.z, dist: 9, alto: TJ.alto + 0.3, ancho: LARGO + 0.55, px: 0.5, py: 0.47, inclina: 0 };
}
// la cabina: al entrar, un plano abierto con la ventanilla; al encenderse la pantalla, de frente y cerca
let enPantalla = false;
function camCabina(cerca) {
  if (cerca && !movil()) return { x: P.x - 0.1, y: P.y, z: P.z, dist: 8, alto: P.alto + 0.3, ancho: P.ancho + 0.5, px: 0.5, py: 0.47, inclina: 0, gira: 3 };
  // de lado, desde el pasillo: la ventanilla con el sol a la izquierda y el respaldo con su pantalla
  return { x: P.x - 1.6, y: P.y, z: P.z + 0.5, dist: 9, alto: 5.2, ancho: 7.2, px: 0.5, py: 0.5, inclina: 3, gira: 12 };
}
const bordeHeroe = () => { const h = document.querySelector('.heroe'); return h.offsetLeft + h.offsetWidth; };   // sin transformaciones: vale también mientras se esconde
const apilado = () => !movil() && innerWidth < 1100;
function huecoApilado() {   // [ancho, alto, arriba, abajo] libres entre el cuadro de información y las puertas
  const h = document.querySelector('.heroe'), arriba = h.offsetTop + h.offsetHeight + 20, abajo = innerHeight - 76;
  return [innerWidth - 48, abajo - arriba, arriba, abajo];
}
function utilDe() {
  const ruta = rutas?.actual ?? 'panel', m = movil();
  if (m) return ruta === 'panel' ? [innerWidth - 16, innerHeight * 0.5] : [innerWidth - 24, innerHeight - 150];
  if (ruta === 'panel') return apilado() ? huecoApilado().slice(0, 2) : [innerWidth - bordeHeroe() - 56, innerHeight - 150];
  if (ruta.endsWith('/embarque')) return enPantalla ? [innerWidth - 140, innerHeight - 190] : [innerWidth, innerHeight];
  return [innerWidth - 80, innerHeight - 200];
}
const OBJ = {
  panel: { imprime: 0, sale: 0, rz: 0 },
  '': { imprime: 1, sale: 1, rz: 0 },
  dorso: { imprime: 1, sale: 1, rz: 180 },
  embarque: { imprime: 1, sale: 1, rz: 0 },
};
const muelles = new Muelles({ ...OBJ.panel, corta: 0, cam: camaraDe('panel') }, { rigidez: 70, amort: 15 })
  .ritmo('cam', 30, 11).ritmo('imprime', 22, 9.5).ritmo('corta', 40, 9);
const R = THREE.MathUtils.degToRad, e1 = new THREE.Euler();
const quatB = (rx, ry, rz) => new THREE.Quaternion().setFromEuler(e1.set(R(rx), R(rz), R(-ry), 'YZX'));
const qPlana = quatB(-90, 0, -90);           // tumbada y con la colilla por delante: así sale de la impresora
const pA = new THREE.Vector3(), pB = new THREE.Vector3(), qA = new THREE.Quaternion(), qB = new THREE.Quaternion();

function colocar(v) {
  // 1) la tarjeta: sale tumbada por la boca de la impresora y luego sube a la mano, de pie
  const dentro = BOCA.y + LARGO / 2 + 0.06, fuera = BOCA.y - LARGO / 2 + 0.22;
  pA.copy(b3(BOCA.x, mezclar(dentro, fuera, v.imprime), BOCA.z));
  const s = suave(0, 1, v.sale);
  const vertical = movil() ? 90 : 0;
  const de = 360 * Math.round(v.rz / 360);
  qB.copy(quatB(0, vertical, mezclar(de, v.rz, s)));
  pB.copy(b3(MANO.x, MANO.y, MANO.z));
  tarjeta.position.lerpVectors(pA, pB, s); tarjeta.position.y += Math.sin(Math.PI * s) * 0.6;
  tarjeta.quaternion.slerpQuaternions(qPlana, qB, s);
  tarjeta.visible = seleccion >= 0 && v.imprime > 0.002;
  // 2) la colilla: se arranca por el troquel (gira hacia fuera, se aparta y desaparece)
  colillaN.rotation.set(0, R(-38 * v.corta), 0);
  colillaN.position.copy(colillaCasa).add(new THREE.Vector3(0.35 * v.corta, -0.25 * v.corta * v.corta, 0));
  colillaN.visible = v.corta < 0.97;
  // 3) con la tarjeta en la mano, el vestíbulo se apaga un poco: un foco sobre ella
  const foco = seleccion >= 0 ? s : 0;
  for (const m of fondoMats) m.uniforms.atenua.value = 1 - 0.38 * foco;
  S.encuadrar(v.cam, { util: utilDe() });
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
  const hasta = movil() ? 20 : T.cols;
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
capaFilas.addEventListener('pointerover', (e) => { const b = e.target.closest('.fila-b'); if (b && e.pointerType !== 'touch') resaltar(+b.dataset.r); });
capaFilas.addEventListener('pointerleave', () => resaltar(-1));
capaFilas.addEventListener('focusin', (e) => { const b = e.target.closest('.fila-b'); if (b) resaltar(+b.dataset.r); });
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
const pasos = $('.pasos'), dice = $('.dice'), recorrido = $('.recorrido'), ficha = $('.ficha-lateral'), heroe = $('.heroe');
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
let pintadaVertical = false;
async function pintarTarjeta(p) {
  // una cara por fotograma, con la tarjeta aún dentro de la impresora
  await C.cargarArte(p.id);
  const fot = () => new Promise((ok) => requestAnimationFrame(ok)), v = vueloDe(p);
  const vert = movil(); pintadaVertical = vert;
  const caras = vert
    ? { cara: () => I.caraVertical(lienzos.cara, p, v), colilla: () => I.colillaVertical(lienzos.colilla, p, v), dorso: () => I.dorsoVertical(lienzos.dorso, p), colilla_dorso: () => I.colillaDorsoVertical(lienzos.colilla_dorso, p) }
    : { cara: () => I.cara(lienzos.cara, p, v), colilla: () => I.colilla(lienzos.colilla, p, v), dorso: () => I.dorso(lienzos.dorso, p), colilla_dorso: () => I.colillaDorso(lienzos.colilla_dorso, p) };
  for (const [id, pinta] of Object.entries(caras)) { await pinta(); texturas[id].needsUpdate = true; S.r.initTexture(texturas[id]); await fot(); }
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
enlaceColilla.addEventListener('click', () => { muelles.empujar('corta', 1); if (RM) muelles.ir({ corta: 1 }, true); });

// ── La pantalla del respaldo ──
const tele = $('#tele'), mandos = $('.tele-mandos'), webTele = $('.tele-web'), fundido = $('.fundido');
let enTele = null, teleTurno = 0;
function seguirTele() {
  if (tele.hidden) return;
  if (movil()) { tele.style.cssText = ''; tele.classList.add('completa'); return; }
  tele.classList.remove('completa');
  const g = 0.04, y = P.y - 0.09;
  const [a, b] = S.aPantalla(P.x - P.ancho / 2 + g, y, P.z + P.alto / 2 - g), [c, d] = S.aPantalla(P.x + P.ancho / 2 - g, y, P.z - P.alto / 2 + g);
  tele.style.cssText = `left:${a}px;top:${b}px;width:${c - a}px;height:${d - b}px`;
}
async function encenderTele(p, mio) {
  if (enTele) return;
  enTele = 'encendiendo'; const t0 = ++teleTurno;
  const t = await encender(p, { el: tele, RM, guardado: null, alResolver: null });
  if (t0 !== teleTurno || mio !== turno || !t) { t?.apagar(); return; }
  enTele = t; seguirTele();
  mandos.hidden = false; webTele.hidden = !p.web;
  if (p.web) { webTele.href = p.web[1]; webTele.querySelector('.boton-tapa').textContent = `${p.web[0]} ↗`; }
  requestAnimationFrame(() => mandos.classList.add('puestos'));
  t.foco();
}
async function apagarTele() {
  if (!enTele) return;
  teleTurno++;
  mandos.classList.remove('puestos'); mandos.hidden = true;
  const t = enTele; enTele = null;
  if (t !== 'encendiendo') await t.apagar(); else { tele.hidden = true; tele.innerHTML = ''; }
  S.pedirDibujo();
}
function fundir(negro) {
  if (RM) { fundido.classList.toggle('negro', negro); return Promise.resolve(); }
  return new Promise((ok) => {
    if (fundido.classList.contains('negro') === negro) { ok(); return; }
    fundido.classList.toggle('negro', negro); setTimeout(ok, 400);
  });
}
let aBordo = false;   // la cámara está en la cabina

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
  document.documentElement.dataset.ruta = id === 'panel' ? 'panel' : paso || 'tarjeta';
  // el foco: se mira antes de esconder nada (al esconder su caja, el navegador lo suelta)
  const focoFila = document.activeElement?.closest('.fila-b, .lista, .pasos'), focoFuera = document.activeElement?.closest('.recorrido, .tele, .tele-mandos');
  const antes = PROYECTOS[seleccion];
  heroe.toggleAttribute('inert', id !== 'panel');
  recorrido.hidden = id === 'panel'; ficha.hidden = id === 'panel' || paso === 'embarque';
  if (p) {
    for (const b of pasos.children) b.setAttribute('aria-current', b.dataset.paso === paso ? 'step' : 'false');
    dice.textContent = paso === 'embarque' ? (p.demo ? 'A bordo: la demo es una simulación (personajes inventados, la mecánica es la del juego).' : 'A bordo: el tráiler del proyecto.') : PASOS.find((x) => x.id === paso).dice;
    pintarFicha(p);
  }
  if (focoFila && p) requestAnimationFrame(() => pasos.querySelector('[aria-current="step"]')?.focus({ preventScroll: true }));
  if (id === 'panel' && focoFuera) requestAnimationFrame(() => { S.dibujar(); botonesFila[Math.max(0, filasProyecto.indexOf(antes))]?.focus({ preventScroll: true }); });
  const fin = id === 'panel' ? OBJ.panel : OBJ[paso];

  // 0) si estábamos a bordo y nos vamos: se apaga la pantalla, fundido y de vuelta al vestíbulo
  if (paso !== 'embarque') {
    apagarTele();
    if (aBordo) {
      await fundir(true); if (mio !== turno) return;
      aBordo = false; enPantalla = false;
      muelles.tocar('cam', camaraDe(p && seleccion === i ? id : 'panel'));
      S.dibujar(); await fundir(false); if (mio !== turno) return;
    }
  }
  if (inmediato || RM) {
    if (p && seleccion !== i) { seleccion = i; await pintarTarjeta(p); if (mio !== turno) return; pantallaQuiosco('imprime', p); }
    if (!p) { seleccion = -1; pantallaQuiosco('espera'); }
    escribirPanel({ inmediato: true });
    if (paso === 'embarque') { aBordo = true; enPantalla = true; }
    muelles.ir({ ...fin, rz: giroCercano(muelles.v.rz, fin.rz), corta: seleccion === i ? muelles.v.corta : 0, cam: camaraDe(ruta) }, true);
    S.pedirDibujo();
    if (paso === 'embarque') encenderTele(p, mio);
    return;
  }
  // 1) otra tarjeta en la mano (o ninguna que hacer con ella): vuelve a la impresora, que se la traga
  const otra = seleccion >= 0 && (!p || seleccion !== i);
  if (otra && muelles.v.imprime > 0.002) {
    const camVuelta = p ? camaraDe('imprime') : camaraDe('panel');
    if (muelles.v.sale > 0.01) { if (!await fase({ sale: 0, rz: giroCercano(muelles.v.rz, 0), cam: camVuelta }, ['sale'], mio, 0.01)) return; }
    if (!await fase({ imprime: 0, cam: camVuelta }, ['imprime'], mio, 0.004)) return;
  }
  if (!p) {
    seleccion = -1; pantallaQuiosco('espera'); escribirPanel();
    muelles.ir({ ...OBJ.panel, cam: camaraDe('panel') });
    return;
  }
  // 2) la tarjeta nueva: se pinta dentro de la impresora y sale
  if (seleccion !== i || muelles.v.imprime < 0.002) {
    seleccion = i; muelles.tocar('corta', 0);
    escribirPanel();
    await pintarTarjeta(p); if (mio !== turno) return;
    pantallaQuiosco('imprime', p);
  } else escribirPanel();
  if (muelles.v.imprime < 0.99) { if (!await fase({ imprime: 1, sale: 0, cam: camaraDe('imprime') }, ['imprime'], mio, 0.01)) return; }
  // 3) a la mano, por su cara
  const mano = { sale: 1, rz: giroCercano(muelles.v.rz, fin.rz), cam: camaraDe(id) };
  if (paso !== 'embarque') { muelles.ir(mano); return; }
  if (muelles.v.sale < 0.9) { if (!await fase(mano, ['sale'], mio, 0.03)) return; }
  // 4) embarcar: fundido, la cabina, y la pantalla se enciende cuando la cámara llega
  await fundir(true); if (mio !== turno) return;
  aBordo = true; enPantalla = false;
  muelles.tocar('cam', camCabina(false)); S.dibujar();
  await fundir(false); if (mio !== turno) return;
  await new Promise((ok) => setTimeout(ok, 650)); if (mio !== turno) return;
  // la cámara se acerca a la pantalla mientras se enciende (el cristal sigue a la pantalla en cada fotograma)
  enPantalla = true; muelles.ir({ cam: camCabina(true) });
  encenderTele(p, mio);
}

// teclado: ← → por los pasos, Esc vuelve uno atrás (también desde dentro de la pantalla)
addEventListener('keydown', (e) => {
  if (e.target.closest('input, textarea, dialog[open]')) return;
  if (e.target.closest('.tele') && e.key !== 'Escape') return;
  const r = rutas.actual; if (r === 'panel') return;
  const [id, paso = ''] = r.split('/'), k = PASOS.findIndex((p) => p.id === paso);
  if (e.key === 'ArrowRight' && k < PASOS.length - 1) { e.preventDefault(); rutas.ir(rutaDe(id, PASOS[k + 1].id)); }
  else if (e.key === 'ArrowLeft' && k > 0) { e.preventDefault(); rutas.ir(rutaDe(id, PASOS[k - 1].id)); }
  else if (e.key === 'Escape') { e.preventDefault(); rutas.ir(k > 0 ? rutaDe(id, PASOS[k - 1].id) : 'panel'); }
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
let eraMovil = movil();
addEventListener('resize', () => {
  S.medir();
  if (movil() !== eraMovil) {                                                // el panel cambia el orden de sus columnas
    eraMovil = movil(); escribirPanel();
    if (seleccion >= 0 && pintadaVertical !== movil()) pintarTarjeta(PROYECTOS[seleccion]);   // y la tarjeta, de apaisada a de pie
  }
  const r = rutas.actual, c = r.endsWith('/embarque') ? camCabina(enPantalla) : camaraDe(r);
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
  ruta: rutas.actual, seleccion, quieto: !muelles.corriendo && !enCurso && tablero.quieto, filtro, aBordo,
  v: { imprime: muelles.v.imprime, sale: muelles.v.sale, rz: (() => { const g = Math.round(((muelles.v.rz % 360) + 360) % 360 * 1000) / 1000; return g > 180 ? g - 360 : g; })(), corta: muelles.v.corta },
  tarjeta: tarjeta.visible, tele: !tele.hidden, enTele: enTele && (enTele === 'encendiendo' ? 'encendiendo' : 'encendida'),
  filas: filasProyecto.map((p) => p?.id ?? '').join(','),
});
