// La estantería, rehecha con el kit E1. Un mueble de nogal en un salón de noche: los nueve juegos de canto en su
// hueco, la consola en el de al lado y la tele encima. Se saca un juego, se le da la vuelta, se abre (el manual a
// la izquierda y el disco centrado en su bandeja), se lee el manual y el disco va a la consola: la tele se enciende
// con la demo (Adivinadle) o el tráiler (los demás).
//
// Todo el movimiento sale de unos pocos valores con muelles (sale, rz, tapa, man, disco, cam): las piezas nunca
// tienen una posición «guardada», se calculan de esos valores en cada fotograma. Por eso volver a mitad de camino,
// pulsar dos veces o entrar por un enlace directo dejan siempre la escena en un estado posible.
import { montarEscena, THREE, RM, b3 } from '../../../kit-e1/js/motor.js';
import { Muelles, giroCercano, suave, mezclar } from '../../../kit-e1/js/muelles.js';
import { montarRutas } from '../../../kit-e1/js/rutas.js';
import * as C from '../../../kit-e1/js/coleccion.js';
import { PROYECTOS, porId } from '../../../kit-e1/js/datos.js';
import { encender } from '../../../kit-e1/js/pantalla.js';

const $ = (s) => document.querySelector(s);
const W = 1.35, H = 1.9, MW = 1.08;
const PASOS = [
  { id: '', boton: 'Carátula', dice: 'Arrastra para girarla. Detrás está lo que es y lo que se consiguió.' },
  { id: 'dorso', boton: 'Detrás', dice: 'La contraportada: qué es, las cifras y con qué está hecho.' },
  { id: 'abierta', boton: 'Abrir', dice: 'El manual a la izquierda y el disco en su bandeja.' },
  { id: 'manual', boton: 'Manual', dice: 'La ficha del proyecto: qué es, qué hice yo y el resultado.' },
  { id: 'tele', boton: 'Consola', dice: '' },
];
const movil = () => innerWidth < 760;
const tecla = { izq: 'ArrowLeft', der: 'ArrowRight' };

// ── Arranque ──
await C.cargar();
let seleccion = -1, rutas = null;                     // la caja que está fuera de su sitio (o saliendo / volviendo)
const nichos = [], cajaMats = [], estaticas = [];
const S = await montarEscena({
  plato: $('#plato'), luz: 'luz/', fondo: '#2a221c', exposicion: 1.06,
  etiqueta: 'Un mueble de nogal con los nueve proyectos como juegos de canto, una consola y una tele',
  material(n, { textura }) {
    if (n === 'pared') return { luz: 'pared' };
    if (n === 'suelo') return { luz: 'suelo' };
    if (n.startsWith('nicho_')) return { luz: 'nicho_con', luz2: 'nicho_sin_0' };
    if (n === 'cajon_tirador' || n.startsWith('cajon_tirador')) return { luz: 'mueble', brillo: 0.55 };
    if (n.startsWith('mueble_') || n.startsWith('cajon_')) return { luz: 'mueble', brillo: 0.07 };
    if (n === 'consola_frente') return { luz: 'objetos', mapa: textura('consola', C.TAM.consola), brillo: 0.18 };
    if (n === 'consola_luz') return { luz: 'objetos', emite: '#000000', brillo: 0.3 };
    if (n === 'tele_testigo') return { emite: '#c0231a' };
    if (n === 'tele_cristal') return { color: '#0c0d11' };   // el cristal apagado: negro con el brillo del estudio, sin el ruido del horneado
    if (n === 'lampara_pantalla') return { color: '#ffd9a0', emite: '#5a3a14', luz: 'objetos', doble: true };
    if (n.startsWith('lampara_')) return { luz: 'objetos', brillo: 0.5 };
    if (/^(consola_|tele_|figura)/.test(n)) return { luz: 'objetos', brillo: n.startsWith('figura') ? 0.3 : 0.25 };
    let m = n.match(/^canto_(\d)_(cuerpo|lomo)$/);
    if (m) return m[2] === 'lomo' ? { luz: 'lomos', mapa: textura(`lomo_${m[1]}`, C.TAM.lomo), brillo: 0.22 } : { luz: 'lomos', brillo: 0.35 };
    // lo que viaja: la caja, el manual y el disco (horneados en el estudio)
    if (n === 'portada' || n === 'dorso') return { luz: 'caja', mapa: textura(n, C.TAM[n]), brillo: 0.3 };
    if (n === 'lomo') return { luz: 'caja', mapa: textura('lomo', C.TAM.lomo), brillo: 0.3 };
    if (n === 'disco_cara') return { luz: 'disco', mapa: textura('disco', C.TAM.disco), brillo: 0.5 };
    if (n === 'disco_base') return { luz: 'disco', color: '#ffffff', brillo: 0.9 };
    if (n === 'manual_portada') return { luz: 'manual', mapa: textura('manual', C.TAM.manual), brillo: 0.08 };
    if (n === 'manual_derecha') return { luz: 'manual', mapa: textura('pagina_d', C.TAM.pagina_d), brillo: 0.04 };
    if (n === 'manual_izquierda') return { luz: 'manual', mapa: textura('pagina_i', C.TAM.pagina_i), brillo: 0.04 };
    if (n.startsWith('manual_')) return { luz: 'manual', brillo: 0.05 };
    return { luz: 'caja', brillo: 0.4 };       // cuerpo, tapa, pestañas, aro, eje y dientes
  },
});
const { nodo, lienzos, texturas } = S;
S.escena.traverse((o) => {
  if (!o.isMesh) return;
  if (o.name.startsWith('nicho_')) nichos.push(o.material);
  if (o.parent && (o.parent.name === 'caja' || o.parent.name === 'tapa')) cajaMats.push(o.material);
});
// lo que viaja con la caja (caja, tapa, manual y disco) y el resto de la sala, que se apaga un poco mientras la caja
// está en primer plano para que se lea como un foco sobre ella
const viajeros = new Set(), fondoMats = [];
nodo.caja.traverse((o) => { if (o.isMesh) viajeros.add(o.material); });
S.escena.traverse((o) => { if (o.isMesh && !viajeros.has(o.material) && !o.name.startsWith('canto_')) fondoMats.push(o.material); });
const cantoMats = []; S.escena.traverse((o) => { if (o.isMesh && o.name.startsWith('canto_')) cantoMats.push(o.material); });
const D = S.datos, X = D.cajas_x, YC = D.cajas_y, ZC = D.cajas_z, RAN = D.ranura, CON = D.consola, TEL = D.tele;
for (let i = 0; i < 9; i++) estaticas.push(nodo[`canto_${i}`]);
const { caja, tapa, disco, manual } = nodo, hoja = nodo.manual_hoja, sitio = nodo.manual_sitio;
const raiz = caja.parent;

// lo impreso de los nueve lomos y el frente de la consola
PROYECTOS.forEach((p, i) => { C.lomo(lienzos[`lomo_${i}`], p); texturas[`lomo_${i}`].needsUpdate = true; });
C.consola(lienzos.consola); texturas.consola.needsUpdate = true;
const ledMat = nodo.consola_luz.material;

async function pintarCaja(p) {
  // una cara por fotograma (pintarla y subirla a la gráfica), con la caja aún quieta: pintar las siete de golpe
  // paraba la página un cuarto de segundo sin gráfica, y subirlas en el primer fotograma del movimiento, también
  await C.cargarArte(p.id);
  const fot = () => new Promise((ok) => requestAnimationFrame(ok));
  const caras = { portada: C.portada, lomo: C.lomo, dorso: C.dorso, disco: C.disco, manual: C.manual, pagina_i: C.paginaIzquierda, pagina_d: C.paginaDerecha };
  for (const [id, pinta] of Object.entries(caras)) {
    await pinta(lienzos[id], p); texturas[id].needsUpdate = true; S.r.initTexture(texturas[id]); await fot();
  }
}

// ── Dónde está cada cosa: todo sale de estos valores ──
const MANO = { x: -1.25, y: -2.7, z: 2.25 };          // la caja en la mano, delante del hueco
function camaraDe(ruta) {
  const m = movil(), [id, paso] = ruta.split('/');
  const sel = Math.max(0, PROYECTOS.findIndex((p) => p.id === id));
  if (id === 'salon') {
    return m ? { x: -1.95, y: 0.6, z: 1.72, dist: 13, alto: 2.45, ancho: 1.95, px: 0.5, py: 0.63, inclina: 3 }
      : { x: -0.55, y: 0.6, z: 2.3, dist: 15, alto: 4.25, ancho: 5.6, px: 0.66, py: 0.55, inclina: 4 };
  }
  if (paso === 'tele') return { x: TEL.x, y: TEL.y, z: TEL.z + TEL.alto / 2, dist: 13, alto: TEL.alto + 0.2, ancho: TEL.ancho + 0.2, px: 0.5, py: m ? 0.45 : 0.49, inclina: 2 };
  // la caja abierta y la consola a la vez: el disco viaja de una a otra sin salir de cuadro
  if (paso === 'consola') return { x: (MANO.x - 1.5 * W + CON.x + CON.ancho / 2) / 2, y: 0, z: 2.3, dist: 13, alto: 2.9, ancho: CON.x + CON.ancho / 2 - MANO.x + 1.5 * W + 2.2, px: 0.5, py: m ? 0.45 : 0.5, inclina: 5 };
  if (paso === 'manual') {
    const cx = MANO.x - 0.35;
    if (m) return { x: cx + (pagina ? MW / 2 : -MW / 2) + (pagina ? 0.012 : -0.012), y: MANO.y - 1.3, z: MANO.z + 0.05, dist: 11, alto: 1.75, ancho: MW + 0.1, px: 0.5, py: 0.44, inclina: 0 };
    return { x: cx, y: MANO.y - 1.3, z: MANO.z + 0.05, dist: 11, alto: 1.95, ancho: 2.4, px: 0.6, py: 0.47, inclina: 0 };
  }
  if (paso === 'abierta') return { x: MANO.x - W / 2, y: MANO.y, z: MANO.z, dist: 11, alto: 2.4, ancho: 3.0, px: m ? 0.5 : 0.62, py: m ? 0.42 : 0.47, inclina: 2 };
  void sel;
  return { x: MANO.x, y: MANO.y, z: MANO.z, dist: 11, alto: 2.55, ancho: 1.8, px: m ? 0.5 : 0.62, py: m ? 0.42 : 0.47, inclina: 2 };
}
const OBJ = {
  salon: { sale: 0, rz: 0, tapa: 0, man: 0, disco: 0 },
  '': { sale: 1, rz: 0, tapa: 0, man: 0, disco: 0 },
  dorso: { sale: 1, rz: -180, tapa: 0, man: 0, disco: 0 },
  abierta: { sale: 1, rz: 0, tapa: -180, man: 0, disco: 0 },
  manual: { sale: 1, rz: 0, tapa: -180, man: 2, disco: 0 },
  consola: { sale: 1, rz: 0, tapa: -180, man: 0, disco: 2 },
};
let pagina = 0;
const muelles = new Muelles({ ...OBJ.salon, cam: camaraDe('salon') }, { rigidez: 70, amort: 15 }).ritmo('cam', 34, 11.5).ritmo('disco', 26, 10);   // el disco, más despacio: se le tiene que ver el viaje
const asoma = new Muelles(Object.fromEntries(PROYECTOS.map((_, i) => [i, 0])), { rigidez: 160, amort: 20 });

const v3 = new THREE.Vector3(), q2 = new THREE.Quaternion(), m4 = new THREE.Matrix4(), e1 = new THREE.Euler();
const R = THREE.MathUtils.degToRad;
// un giro XYZ de Blender, en three: el eje Z de Blender es el Y de three y el Y de Blender es el −Z
const quatB = (rx, ry, rz) => new THREE.Quaternion().setFromEuler(e1.set(R(rx), R(rz), R(-ry), 'YZX'));
const manualCasa = { p: new THREE.Vector3(), q: new THREE.Quaternion() }, discoCasa = { p: new THREE.Vector3(), q: new THREE.Quaternion() };
manualCasa.p.copy(manual.position); manualCasa.q.copy(manual.quaternion);
discoCasa.p.copy(disco.position); discoCasa.q.copy(disco.quaternion);

function colocar(v) {
  const i = Math.max(seleccion, 0);
  const fuera = suave(0, 0.32, v.sale), lleva = suave(0.26, 1, v.sale);
  // 1) la caja: sale en línea recta de su hueco y solo entonces gira y viaja a la mano (así no roza a las vecinas)
  const x0 = X[i], y1 = YC - 1.72;
  const px = mezclar(x0, MANO.x, lleva), py = mezclar(mezclar(YC, y1, fuera), MANO.y, lleva);
  const pz = mezclar(ZC, MANO.z, lleva) + Math.sin(Math.PI * lleva) * 0.25;
  const de = 90 + 360 * Math.round((v.rz - 90) / 360);
  const rz = mezclar(de, v.rz, lleva);
  caja.position.copy(b3(px, py, pz));
  caja.quaternion.copy(quatB(-3 * lleva, 0, rz));
  tapa.rotation.set(0, R(v.tapa * suave(0.7, 1, v.sale)), 0);
  // en su hueco y sin moverse, la caja vuelve a ser la de canto (más ligera y con su luz horneada en el mueble)
  const enSitio = seleccion < 0 || (v.sale < 0.0005 && !rutaFuera());
  caja.visible = !enSitio;
  estaticas.forEach((e, k) => { e.visible = k !== seleccion || enSitio; });
  // la caja sale de la penumbra del hueco; mientras se lee el manual, la caja abierta queda detrás, más apagada
  const leyendo = suave(0.3, 1, Math.min(v.man, 1));
  for (const m of cajaMats) m.uniforms.atenua.value = mezclar(0.42, 1, suave(0, 0.6, fuera)) * mezclar(1, 0.5, leyendo);
  const foco = seleccion >= 0 ? suave(0.15, 1, v.sale) * (1 - suave(1.4, 2, v.disco)) : 0;
  for (const m of fondoMats) m.uniforms.atenua.value = 1 - 0.42 * foco;
  for (const m of cantoMats) m.uniforms.atenua.value = 1 - 0.42 * foco;
  for (const m of nichos) m.uniforms.mezcla.value = seleccion >= 0 ? suave(0, 0.5, fuera) : 0;
  caja.updateMatrixWorld(true);

  // 2) el manual: se desliza 5 mm hacia su lomo (para salir de las pestañas), se levanta y vuela a leerse; luego se abre
  const vm = Math.min(v.man, 1);
  if (v.man < 0.0005) {
    if (manual.parent !== sitio) sitio.add(manual);
    manual.position.copy(manualCasa.p); manual.quaternion.copy(manualCasa.q);
  } else {
    const s1 = suave(0, 0.18, vm), s2 = suave(0.12, 0.38, vm), b = suave(0.32, 1, vm);
    m4.compose(b3(-0.05 * s1, -0.14 * s2, 0), new THREE.Quaternion(), v3.set(1, 1, 1));
    const enTapa = sitio.matrixWorld.clone().multiply(m4);
    const pT = new THREE.Vector3(), qT = new THREE.Quaternion(); enTapa.decompose(pT, qT, v3);
    const cx = MANO.x - 0.35 + MW / 2;           // el lomo del manual, para que el pliego abierto quede centrado
    const pL = b3(cx, MANO.y - 1.3, MANO.z + 0.05);
    if (manual.parent !== raiz) raiz.add(manual);
    manual.position.lerpVectors(pT, pL, b); manual.position.y += Math.sin(Math.PI * b) * 0.18;
    manual.quaternion.slerpQuaternions(qT, q2.identity(), b);
  }
  hoja.rotation.set(0, R(-180 * suave(1, 2, v.man)), 0);

  // 3) el disco: se levanta del eje, vuela delante de la ranura, se tumba y entra
  if (v.disco < 0.0005) {
    if (disco.parent !== caja) caja.add(disco);
    disco.position.copy(discoCasa.p); disco.quaternion.copy(discoCasa.q); disco.visible = true;
  } else {
    const t = v.disco;
    m4.compose(discoCasa.p.clone().add(b3(0, -0.07 * suave(0, 0.25, t), 0)), discoCasa.q, v3.set(1, 1, 1));
    const enCaja = caja.matrixWorld.clone().multiply(m4);
    const p0 = new THREE.Vector3(), q0 = new THREE.Quaternion(); enCaja.decompose(p0, q0, v3);
    const boca = CON.y - CON.fondo / 2;          // el frente de la consola
    const frente = b3(RAN.x, boca - 0.7, RAN.z), dentro = b3(RAN.x, boca + 0.9, RAN.z);
    const tumbado = quatB(-90, 0, 0);
    const b = suave(0.25, 1.5, t), c = suave(1.5, 2, t);
    if (disco.parent !== raiz) raiz.add(disco);
    disco.position.lerpVectors(p0, frente, b).lerp(dentro, c);
    disco.position.y += Math.sin(Math.PI * b) * 0.5;
    disco.quaternion.slerpQuaternions(q0, tumbado, suave(0.3, 1.3, t));
    disco.visible = t < 1.995;
  }

  // 4) las cajas que asoman al pasar el ratón, y la cámara
  estaticas.forEach((e, k) => { e.position.copy(b3(X[k], YC - 0.16 * asoma.v[k], ZC)); });
  S.encuadrar(v.cam, { util: utilDe() });
}
function utilDe() {
  const ruta = rutas?.actual ?? 'salon';
  if (movil()) return ruta === 'salon' ? [innerWidth - 24, innerHeight * 0.52] : [innerWidth - 24, innerHeight - 210];
  if (ruta.endsWith('/tele') && muelles.v.disco > 1.9) return [innerWidth - 100, innerHeight - 200];   // la tele, lo más grande que quepa
  if (ruta.endsWith('/tele')) return [innerWidth - 120, innerHeight - 200];
  return ruta === 'salon' ? [innerWidth * 0.6, innerHeight - 120] : [innerWidth - 470, innerHeight - 190];
}
const rutaFuera = () => (rutas?.actual ?? 'salon') !== 'salon';
muelles.alMover = (v) => { if (muelles.corriendo) S.enMarcha(true); S.dibujar(); vigilarDisco(v); };
muelles.alParar = () => { if (!asoma.corriendo) S.enMarcha(false); };
asoma.alMover = () => { if (asoma.corriendo) S.enMarcha(true); S.pedirDibujo(); };
asoma.alParar = () => { if (!muelles.corriendo) S.enMarcha(false); };
S.alDibujar = () => { colocar(muelles.v); seguirTele(); seguirLomos(); };

// ── Los lomos: botones invisibles encima de cada uno (ratón, dedo, teclado y lector de pantalla) ──
const lomos = $('#lomos'), etiqueta = $('.etiqueta');
lomos.innerHTML = PROYECTOS.map((p, i) => `<button type="button" class="lomo-b" data-i="${i}" aria-label="${p.n}. ${p.nombre}: ${p.linea}"></button>`).join('');
const botonesLomo = [...lomos.children];
function seguirLomos() {
  const ver = (rutas?.actual ?? 'salon') === 'salon';
  lomos.hidden = !ver; if (!ver) { etiqueta.hidden = true; return; }
  botonesLomo.forEach((b, i) => {
    const [x1, y1] = S.aPantalla(X[i] - 0.075, YC - W / 2 - 0.16 * asoma.v[i], ZC + H / 2);
    const [x2, y2] = S.aPantalla(X[i] + 0.075, YC - W / 2, ZC - H / 2);
    b.style.cssText = `left:${x1}px;top:${y1}px;width:${Math.max(x2 - x1, 8)}px;height:${y2 - y1}px`;
  });
  const k = botonesLomo.findIndex((b) => b.matches(':hover, :focus-visible'));
  if (k >= 0) {
    const p = PROYECTOS[k], [ex, ey] = S.aPantalla(X[k], YC - W / 2, ZC + H / 2 + 0.05);
    etiqueta.querySelector('b').textContent = `${p.n} · ${p.nombre}`; etiqueta.querySelector('span').textContent = p.linea;
    etiqueta.style.transform = `translate(${Math.round(ex)}px, ${Math.round(ey)}px)`; etiqueta.hidden = false;
  } else etiqueta.hidden = true;
}
let encima = -1;
function asomar(i) {
  if (encima === i) return; encima = i;
  PROYECTOS.forEach((_, k) => asoma.empujar(k, k === i && !RM ? 1 : 0));
  if (RM) S.pedirDibujo();
}
lomos.addEventListener('pointerover', (e) => { const b = e.target.closest('.lomo-b'); if (b && e.pointerType !== 'touch') asomar(+b.dataset.i); });
lomos.addEventListener('pointerleave', () => asomar(-1));
lomos.addEventListener('focusin', (e) => { const b = e.target.closest('.lomo-b'); if (b) asomar(+b.dataset.i); });
lomos.addEventListener('focusout', () => asomar(-1));
lomos.addEventListener('click', (e) => { const b = e.target.closest('.lomo-b'); if (b) rutas.ir(PROYECTOS[+b.dataset.i].id); });
lomos.addEventListener('keydown', (e) => {
  const b = e.target.closest('.lomo-b'); if (!b) return;
  const i = +b.dataset.i, j = e.key === tecla.der ? Math.min(8, i + 1) : e.key === tecla.izq ? Math.max(0, i - 1) : e.key === 'Home' ? 0 : e.key === 'End' ? 8 : i;
  if (j !== i) { e.preventDefault(); botonesLomo[j].focus(); }
});

// ── El recorrido con la caja: botones, texto y ficha lateral ──
const pasos = $('.pasos'), dice = $('.dice'), recorrido = $('.recorrido'), ficha = $('.ficha-lateral'), heroe = $('.heroe');
pasos.innerHTML = PASOS.map((p, i) => `<button type="button" data-paso="${p.id}"><i>${i + 1}</i><span>${p.boton}</span></button>`).join('');
pasos.addEventListener('click', (e) => { const b = e.target.closest('[data-paso]'); if (b) rutas.ir(rutaDe(idActual(), b.dataset.paso)); });
document.addEventListener('click', (e) => {
  const a = e.target.closest('[data-ir]'); if (a) { e.preventDefault(); rutas.ir(a.dataset.ir); }
  const b = e.target.closest('[data-ir-paso]'); if (b) rutas.ir(rutaDe(idActual(), b.dataset.irPaso));
});
const rutaDe = (id, paso) => (paso ? `${id}/${paso}` : id);
const idActual = () => (rutas.actual ?? 'salon').split('/')[0];
$('.paginas').addEventListener('click', (e) => {
  const b = e.target.closest('[data-pagina]'); if (!b) return;
  ponerPagina(+b.dataset.pagina);
});
function ponerPagina(n, mover = true) {
  pagina = n; for (const b of document.querySelectorAll('[data-pagina]')) b.setAttribute('aria-pressed', String(+b.dataset.pagina === n));
  if (mover) muelles.ir({ cam: camaraDe(rutas.actual) }, RM);
}
function pintarFicha(p) {
  ficha.querySelector('.fl-n').textContent = `N.º ${p.n} de la colección`;
  ficha.querySelector('.fl-nombre').textContent = p.nombre;
  ficha.querySelector('.fl-tipo').textContent = `${p.tipo} · ${p.estado}`;
  ficha.querySelector('.fl-linea').textContent = p.linea;
  ficha.querySelector('.fl-web').innerHTML = p.web ? `<a href="${p.web[1]}" target="_blank" rel="noopener">${p.web[0]} ↗</a>` : '';
}

// ── La tele ──
const tele = $('#tele'), mandos = $('.tele-mandos'), webTele = $('.tele-web');
let enTele = null, teleQuiere = null, discoDentro = false;
function seguirTele() {
  if (tele.hidden) return;
  if (movil()) { tele.style.cssText = ''; tele.classList.add('completa'); return; }
  tele.classList.remove('completa');
  const g = 0.06, x0 = TEL.x - TEL.ancho / 2 + g, x1 = TEL.x + TEL.ancho / 2 - g, z0 = TEL.z + g, z1 = TEL.z + TEL.alto - g, y = TEL.y - 0.08;
  const [a, b] = S.aPantalla(x0, y, z1), [c, d] = S.aPantalla(x1, y, z0);
  tele.style.cssText = `left:${a}px;top:${b}px;width:${c - a}px;height:${d - b}px`;
}
function vigilarDisco(v) {
  const dentro = v.disco > 1.97;
  if (dentro === discoDentro) return;
  discoDentro = dentro;
  ledMat.uniforms.emite.value.set(dentro ? '#ffb347' : '#000000');
  if (dentro && teleQuiere) encenderTele(teleQuiere);
}
// cada encendido lleva su número: si mientras arranca se apaga (o se apaga y se vuelve a encender), el viejo se retira
let teleTurno = 0;
async function encenderTele(p) {
  if (enTele) return;
  const mio = ++teleTurno;
  enTele = 'encendiendo';
  muelles.ir({ cam: camaraDe(`${p.id}/tele`) }, RM);
  nodo.tele_testigo.material.uniforms.emite.value.set('#2f9e44');
  S.pedirDibujo();
  const t = await encender(p, { el: tele, RM, guardado: null, alResolver: null });
  if (mio !== teleTurno || teleQuiere !== p || !t) { t?.apagar(); return; }
  enTele = t; seguirTele();
  mandos.hidden = false; webTele.hidden = !p.web;
  if (p.web) { webTele.href = p.web[1]; webTele.querySelector('.boton-tapa').textContent = `${p.web[0]} ↗`; }
  requestAnimationFrame(() => mandos.classList.add('puestos'));
  t.foco();
}
async function apagarTele() {
  teleQuiere = null;
  if (!enTele) return;
  teleTurno++;
  mandos.classList.remove('puestos'); mandos.hidden = true;
  nodo.tele_testigo.material.uniforms.emite.value.set('#c0231a');
  const t = enTele; enTele = null;
  if (t !== 'encendiendo') await t.apagar(); else { tele.hidden = true; tele.innerHTML = ''; }
  S.pedirDibujo();
}

// ── Las rutas: #salon, #<id>, #<id>/dorso, #<id>/abierta, #<id>/manual, #<id>/tele ──
rutas = montarRutas({
  inicio: 'salon',
  validar(r) {
    if (!r || r === 'salon') return 'salon';
    const [id, paso = ''] = r.split('/');
    return porId(id) && PASOS.some((p) => p.id === paso) ? rutaDe(id, paso) : null;
  },
  alCambiar: (ruta, o) => irA(ruta, o),
});

// Ir de un estado a otro siempre en el mismo orden, sea cual sea el salto (también desde un enlace directo o a mitad
// de otro movimiento): primero vuelven el disco y el manual a la caja, luego se cierra la tapa si hay que girarla o
// guardarla, luego la caja va donde toque (y gira), y al final se abre y salen el manual o el disco.
let turno = 0, enCurso = 0;
const cerca = (campo, x, tol = 0.06) => Math.abs(muelles.v[campo] - x) < tol;
async function fase(objetivo, campos, mio, tol) {
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
  document.documentElement.dataset.ruta = id === 'salon' ? 'salon' : paso || 'caja';
  heroe.toggleAttribute('inert', id !== 'salon');
  recorrido.hidden = id === 'salon'; ficha.hidden = id === 'salon' || paso === 'tele' || paso === 'manual';
  if (p) {
    for (const b of pasos.children) b.setAttribute('aria-current', b.dataset.paso === paso ? 'step' : 'false');
    dice.textContent = paso === 'tele' ? (p.demo ? 'Simulación: personajes inventados, la mecánica es la del juego.' : 'El tráiler del proyecto. Puedes verlo otra vez o ir a su web.') : PASOS.find((x) => x.id === paso).dice;
    pintarFicha(p);
  }
  $('.paginas').hidden = !(paso === 'manual' && movil());
  if (paso !== 'manual') ponerPagina(0, false);
  if (paso !== 'tele') apagarTele();
  // si se entró desde un lomo con el teclado, el foco pasa al paso actual (el lomo ya no se ve)
  if (document.activeElement?.closest('.lomo-b, .lista') && p) requestAnimationFrame(() => pasos.querySelector('[aria-current="step"]')?.focus({ preventScroll: true }));
  if (id === 'salon' && document.activeElement?.closest('.recorrido, .tele, .tele-mandos')) botonesLomo[Math.max(seleccion, 0)].focus({ preventScroll: true });

  const fin = id === 'salon' ? OBJ.salon : OBJ[paso === 'tele' ? 'consola' : paso];
  const cam = camaraDe(paso === 'tele' ? `${id}/consola` : ruta);
  const otra = seleccion >= 0 && p && seleccion !== i;
  if (inmediato || RM) {
    if (p && seleccion !== i) { seleccion = i; await Promise.all(nichos.map((m) => S.ponerLuz2(m, `nicho_sin_${i}`))); }
    if (p) await pintarCaja(p);
    if (mio !== turno) return;
    if (paso === 'tele') teleQuiere = p;
    muelles.ir({ ...fin, rz: giroCercano(muelles.v.rz, fin.rz), cam }, true);
    return;
  }
  // 1) el disco y el manual, a la caja
  const v = muelles.v;
  if (v.disco > 0.02 && fin.disco < v.disco) { if (!await fase({ disco: 0, cam: v.disco > 1.5 ? camaraDe(`${idActual()}/consola`) : muelles.obj.cam }, ['disco'], mio, 0.25)) return; }
  if (v.man > 0.02 && fin.man < v.man) { if (!await fase({ man: fin.man }, ['man'], mio, 0.3)) return; }
  // 2) otra caja fuera: vuelve la que estaba (cerrada) antes de sacar la nueva
  if (otra && v.sale > 0.002) {
    if (v.tapa < -1) { if (!await fase({ tapa: 0 }, ['tapa'], mio, 40)) return; }
    if (!await fase({ sale: 0, rz: giroCercano(v.rz, 0), cam: camaraDe('salon') }, ['sale'], mio, 0.01)) return;
  }
  if (p) {
    if (seleccion !== i) { seleccion = i; await Promise.all(nichos.map((m) => S.ponerLuz2(m, `nicho_sin_${i}`))); }
    await pintarCaja(p);
    if (mio !== turno) return;
  }
  if (paso === 'tele') teleQuiere = p;
  // 3) si hay que girarla o guardarla, primero se cierra
  const gira = Math.abs(giroCercano(muelles.v.rz, fin.rz) - muelles.v.rz) > 5;
  if (muelles.v.tapa < -1 && (fin.tapa === 0 || gira)) { if (!await fase({ tapa: 0, cam }, ['tapa'], mio, 40)) return; }
  // 4) la caja a su sitio y su cara
  const caraYa = { sale: fin.sale, rz: giroCercano(muelles.v.rz, fin.rz), cam };
  if (fin.tapa < -1 || fin.man > 0 || fin.disco > 0) {
    if (!await fase(caraYa, ['sale', 'rz'], mio, 0.08)) return;
    // 5) abrir, y luego el manual o el disco
    if (!await fase({ tapa: fin.tapa }, ['tapa'], mio, 45)) return;
    muelles.ir({ man: fin.man, disco: fin.disco });
  } else muelles.ir(caraYa);
}
function esperar(cond) {
  return new Promise((ok) => { const mira = () => (cond() ? ok() : requestAnimationFrame(mira)); mira(); });
}

// teclado: ← → por los pasos, Esc vuelve uno atrás (Esc también desde dentro de la tele)
addEventListener('keydown', (e) => {
  if (e.target.closest('input, textarea, dialog[open]')) return;
  if (e.target.closest('.tele') && e.key !== 'Escape') return;
  const r = rutas.actual; if (r === 'salon') return;
  const [id, paso = ''] = r.split('/'), k = PASOS.findIndex((p) => p.id === paso);
  if (e.key === tecla.der && k < PASOS.length - 1) { e.preventDefault(); rutas.ir(rutaDe(id, PASOS[k + 1].id)); }
  else if (e.key === tecla.izq && k > 0) { e.preventDefault(); rutas.ir(rutaDe(id, PASOS[k - 1].id)); }
  else if (e.key === 'Escape') { e.preventDefault(); rutas.ir(k > 0 ? rutaDe(id, PASOS[k - 1].id) : 'salon'); }
});

// arrastrar la caja para girarla (en la carátula y la contraportada)
let arr = null;
$('#plato').addEventListener('pointerdown', (e) => {
  const paso = rutas.actual.split('/')[1] ?? '';
  if (rutas.actual === 'salon' || !['', 'dorso'].includes(paso) || e.button !== 0 || muelles.v.sale < 0.95) return;
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
$('.lista-ol').innerHTML = PROYECTOS.map((p) => `<li style="--c:${p.color};--t:${p.tinta}"><span class="li-lomo">${p.n}</span>
  <div><b>${p.nombre}</b><span>${p.linea}</span><small>${p.tipo} · ${p.estado}</small></div>
  <span class="li-botones"><button type="button" class="boton boton-claro" data-sacar="${p.id}"><span class="boton-tapa">Sacarlo</span></button>${p.demo ? `<button type="button" class="boton boton-luz" data-sacar="${p.id}/tele"><span class="boton-tapa">Jugar</span></button>` : ''}</span></li>`).join('');
document.addEventListener('click', (e) => {
  if (e.target.closest('[data-abrir="lista"]')) { lista.showModal(); lista.querySelector('[data-sacar]').focus(); }
  const s = e.target.closest('[data-sacar]'); if (s) { lista.close(); rutas.ir(s.dataset.sacar); requestAnimationFrame(() => pasos.querySelector('[aria-current="step"]')?.focus({ preventScroll: true })); }
});
lista.querySelector('.lista-x').addEventListener('click', () => lista.close());
lista.addEventListener('click', (e) => { if (e.target === lista) lista.close(); });
$('.texto-proyectos').innerHTML = PROYECTOS.map((p) => `<li><h3>${p.nombre}</h3><p>${p.linea}</p>${p.bloques.map(([t, x]) => `<p><b>${t}:</b> ${x}</p>`).join('')}</li>`).join('');

// ── Medidas y arranque ──
addEventListener('resize', () => {
  S.medir(); $('.paginas').hidden = !(rutas.actual.endsWith('/manual') && movil());
  const r = rutas.actual, c = camaraDe(r.endsWith('/tele') && !(enTele && enTele !== 'encendiendo') ? `${idActual()}/consola` : r);
  if (muelles.corriendo) muelles.empujar('cam', c); else muelles.tocar('cam', c);
  S.dibujar();
});
rutas.arrancar();
S.dibujar();
S.listo();
// las carátulas, en segundo plano cuando ya se ve todo
(window.requestIdleCallback ?? setTimeout)(() => PROYECTOS.forEach((p) => C.cargarArte(p.id)), { timeout: 3000 });
// para las pruebas automáticas: en qué estado está la escena
window.__estado = () => ({
  ruta: rutas.actual, seleccion, quieto: !muelles.corriendo && !enCurso, v: { ...muelles.v, rz: ((muelles.v.rz % 360) + 540) % 360 - 180, cam: undefined },
  caja: caja.visible, cantos: estaticas.map((e) => e.visible).join(''), tele: !tele.hidden, enTele: enTele && (enTele === 'encendiendo' ? 'encendiendo' : 'encendida'),
});
