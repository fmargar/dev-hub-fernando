// La biblioteca, con el kit E1. Una librería de nogal, de noche, y delante la mesa de lectura con su lámpara. En la
// balda del centro, nueve libros de tela, uno por proyecto. Se saca uno y se ve la tapa; dado la vuelta, la
// contracubierta con los créditos; y abrirlo es dejarlo en la mesa: la tapa se levanta y del pliegue sube un teatrillo
// de papel con la pantalla, donde sale su demo (Adivinadle) o su tráiler.
//
// Todo sale de unos pocos valores con muelles (cuánto se ha sacado el libro, si está dado la vuelta, cuánto se ha
// abierto, lo que asoma cada lomo y la cámara); las piezas no tienen posición guardada. El libro que viaja es uno
// solo: al sacarlo se viste con la tela y los impresos del elegido y ocupa su sitio en la balda.
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
  { id: '', boton: 'La tapa', dice: 'La tapa del libro. Dale la vuelta para leer la contracubierta, o ábrelo.' },
  { id: 'creditos', boton: 'La contracubierta', dice: 'La contracubierta: qué es, qué hice yo, el resultado y con qué está hecho.' },
  { id: 'abierto', boton: 'Abrirlo', dice: '' },
];
const DEG = Math.PI / 180;

// ── Arranque ──
await C.cargar();
let rutas = null;
const S = await montarEscena({
  plato: $('#plato'), luz: 'luz/', fondo: '#171310', exposicion: 1.0,
  etiqueta: 'Una librería de nogal con nueve libros de tela, uno por proyecto, y delante una mesa de lectura con su lámpara',
  material(n, { textura }) {
    // lo que la escena une para la web: <lámina>_unida[n]_b<brillo en centésimas>
    const u = n.match(/^(sala|tomos|mesa)_unida\d*_b(\d+)$/);
    if (u) return { luz: u[1], ...(u[1] === 'mesa' && { luz2: 'mesa_libro' }), brillo: +u[2] / 100 };
    let m = n.match(/^lomo_(\d)$/);
    if (m) return { luz: 'tomos', mapa: textura(`lomo_${m[1]}`, I.TAM.lomo), brillo: 0.1 };
    if (n === 'hueco_cara') return { luz: 'sala', mapa: textura('hueco', I.TAM.hueco) };
    if (n === 'tele_cara') return { color: '#000000', emite: '#0b0d11' };
    if (n === 'mesa_lampara_tubo') return { luz: 'mesa', luz2: 'mesa_libro', emite: '#8a6a3a' };
    if (n === 'mesa_lampara_pantalla') return { luz: 'mesa', luz2: 'mesa_libro', emite: '#0f4a30', brillo: 0.45, doble: true };
    if ((m = n.match(/^libro_(cara|dorso|lomo)$/))) return { luz: 'libro', mapa: textura({ cara: 'tapa', dorso: 'dorso', lomo: 'lomo' }[m[1]], I.TAM[m[1] === 'cara' ? 'tapa' : m[1]]), brillo: 0.1 };
    if ((m = n.match(/^libro_(suelo|fondo)$/))) return { luz: 'pop', mapa: textura(m[1], I.TAM[m[1]]) };
    if (n.startsWith('libro_tela')) return { luz: 'libro', brillo: 0.06 };
    if (n.startsWith('libro_')) return { luz: 'libro' };
    if (n === 'pop_telon_cara') return { luz: 'pop', mapa: textura('telon', I.TAM.telon) };
    if (/^pop_ala_._cara$/.test(n)) return { luz: 'pop', mapa: textura('ala', I.TAM.ala) };
    if (n.startsWith('pop_')) return { luz: 'pop', doble: true };
    return { luz: 'sala' };
  },
});
const { nodo, lienzos, texturas } = S;
const D = S.datos, B = D.libro, PL = D.pliegue, CAPAS = D.capas, P = D.pantalla;
const pintar = (id) => { texturas[id].needsUpdate = true; };

// lo impreso: los nueve lomos de la balda y la tarjeta del hueco; el libro que viaja se viste al sacarlo
I.hueco(lienzos.hueco); pintar('hueco');
PROYECTOS.forEach((p, i) => { I.lomo(lienzos[`lomo_${i}`], p, D.gruesos[i] / D.altos[i]); pintar(`lomo_${i}`); });
const libro = nodo.libro, tapa = nodo.libro_tapa, pops = [nodo.pop_0, nodo.pop_1, nodo.pop_2], pests = [nodo.pest_0, nodo.pest_1, nodo.pest_2];
const tomos = PROYECTOS.map((_, i) => nodo[`tomo_${i}`]);
const telas = ['libro_tela_base', 'libro_tela_canto', 'libro_tela_tapa'].map((n) => nodo[n].material);
const delLibro = Object.keys(nodo).filter((n) => /^libro_(tela|hojas|cara|dorso|lomo)/.test(n)).map((n) => nodo[n].material);
const frentes = Object.keys(nodo).filter((n) => n.startsWith('pop_frente_')).sort((a, b) => a.match(/\d+/)[0] - b.match(/\d+/)[0]).map((n) => nodo[n].material);
const deLaMesa = S.mats.filter((m) => m.uniforms.luz2.value);
let vestido = -1;
// la tela y los impresos del libro que viaja: los del proyecto elegido
async function vestir(i) {
  if (i === vestido || i < 0) return; vestido = i;
  const p = PROYECTOS[i];
  for (const m of telas) m.uniforms.color.value.set(p.color);
  frentes.forEach((m, k) => m.uniforms.color.value.set(k % 3 === 1 ? '#f3ecdc' : k % 3 === 0 ? p.color : mezclaColor(p.color, '#f3ecdc', 0.45)));
  I.lomo(lienzos.lomo, p, D.gruesos[i] / D.altos[i]); I.dorso(lienzos.dorso, p); I.suelo(lienzos.suelo, p); I.fondo(lienzos.fondo, p); I.telon(lienzos.telon, p); I.ala(lienzos.ala, p);
  for (const id of ['lomo', 'dorso', 'suelo', 'fondo', 'telon', 'ala']) pintar(id);
  await I.tapa(lienzos.tapa, p); if (vestido === i) { pintar('tapa'); S.pedirDibujo(); }
}
function mezclaColor(a, b, t) { return `#${new THREE.Color(a).lerp(new THREE.Color(b), t).getHexString()}`; }

// ── Dónde va cada cosa. Las posiciones, en coordenadas de Blender; los giros, de los ejes del libro (x: a lo largo
// del lomo; y: del corte al lomo; z: de la contracubierta a la tapa) a los del mundo ──
function ejes(x, y, z) {
  const m = new THREE.Matrix4().makeBasis(b3(...x), b3(...z), b3(...y).negate());
  return new THREE.Quaternion().setFromRotationMatrix(m);
}
const qBalda = ejes([0, 0, 1], [0, -1, 0], [1, 0, 0]);      // de pie, el lomo hacia ti
const qMano = ejes([0, 0, 1], [-1, 0, 0], [0, -1, 0]);      // de pie, la tapa hacia ti (el lomo, a la izquierda)
const qMesa = new THREE.Quaternion();                        // tumbado en la mesa, el lomo al fondo
const MANO = { x: 0, y: -6.6, z: 3.5 };
const MESA = { x: PL.x, y: PL.y - B.W / 2, z: PL.z + B.T / 2 };
const enBalda = (i) => ({ x: D.tomos_x[i] + D.gruesos[i] / 2, y: D.lomos + B.W / 2, z: D.z0 + D.altos[i] / 2 });
const q = new THREE.Quaternion(), qG = new THREE.Quaternion(), vY = new THREE.Vector3(0, 1, 0), v3 = new THREE.Vector3();

// ── Lo que se mueve ──
const cero = () => Array(N).fill(0);
const muelles = new Muelles({ asoma: cero(), saca: 0, gira: 0, abre: 0, cam: { x: 0, y: 0, z: 0, dist: 30, inclina: 8, gira: 0, alto: 10, ancho: 16, px: 0.5, py: 0.5, util: [innerWidth, innerHeight] } },
  { rigidez: 150, amort: 22.5 }).ritmo('cam', 120, 21).ritmo('saca', 105, 19.5).ritmo('abre', 62, 13.5).ritmo('gira', 130, 21).ritmo('asoma', 210, 20);
let sel = 0;                                  // el libro que está fuera (o el último que lo estuvo)
function colocar(v) {
  const s = v.saca, fuera = s > 0.001;
  for (let i = 0; i < N; i++) { tomos[i].visible = !(fuera && i === sel); tomos[i].rotation.x = 8 * DEG * v.asoma[i]; }
  libro.visible = fuera;
  if (fuera) {
    const i = sel, a = Math.max(0, v.abre);
    const sale = suave(0, 0.45, s), vuela = suave(0.35, 1, s), baja = suave(0, 0.55, a);
    const b = enBalda(i), k = suave(0.3, 0.9, s);
    const ex = mezclar(D.altos[i] / B.H, 1, k), ez = mezclar(D.gruesos[i] / B.T, 1, k);
    let x = mezclar(b.x, MANO.x, vuela), y = mezclar(b.y - (B.W + 0.35) * sale, MANO.y, vuela), z = mezclar(b.z, MANO.z, vuela);
    q.copy(qBalda).slerp(qMano, vuela);
    if (Math.abs(v.gira) > 0.0005) q.premultiply(qG.setFromAxisAngle(vY, v.gira * Math.PI));
    if (baja > 0) { x = mezclar(x, MESA.x, baja); y = mezclar(y, MESA.y, baja); z = mezclar(z, MESA.z, baja) + 0.7 * Math.sin(Math.PI * baja); q.slerp(qMesa, baja); }
    // el vacío del libro está en el pliegue, a ras de la contracubierta: se pone donde toca para que el centro caiga en (x, y, z)
    v3.set(0, B.T / 2 * ez, B.W / 2).applyQuaternion(q);
    libro.position.copy(b3(x, y, z)).sub(v3); libro.quaternion.copy(q); libro.scale.set(ex, ez, 1);
    // la tapa y las capas del desplegable giran lo mismo sobre su pliegue: cada capa sigue paralela a la tapa
    const ang = Math.min(100, 90 * (a <= 0.45 ? 0 : (a - 0.45) / 0.55)) * DEG, ver = ang > 0.012;
    tapa.rotation.x = -ang;
    for (let c = 0; c < 3; c++) {
      pops[c].visible = pests[c].visible = ver; pops[c].rotation.x = -ang;
      const h = c < 2 ? CAPAS[c].h : 0.3;
      pests[c].position.copy(b3(0, -CAPAS[c].d - h * Math.cos(ang), B.T / 2 + h * Math.sin(ang)));
    }
    // la luz del libro: en la balda, la de dentro del mueble; fuera, la suya
    const at = mezclar(0.55, 1, suave(0.1, 0.8, s));
    for (const m of delLibro) m.uniforms.atenua.value = at;
    for (const m of deLaMesa) m.uniforms.mezcla.value = suave(0.3, 0.6, a);
  } else for (const m of deLaMesa) m.uniforms.mezcla.value = 0;
  const { util, ...cam } = v.cam;
  S.encuadrar(cam, { util: util ?? [innerWidth, innerHeight] });
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
  if (lugar === 'balda') {
    const c = { x: -0.3, y: -1.0, z: 3.6, dist: 36, inclina: 9, gira: 0, alto: 8.4, ancho: 9.6 };
    if (movil()) { const [w, h, yc] = huecoBajo('.heroe'); return { ...c, x: -0.55, z: 4.4, alto: 6.2, ancho: 6.5, px: 0.5, py: yc / innerHeight, util: [w + 12, h] }; }
    if (innerWidth < 1100) { const [w, h, yc] = huecoBajo('.heroe'); return { ...c, x: -0.55, z: 4.0, alto: 5.6, ancho: 7.6, px: 0.5, py: yc / innerHeight, util: [w - 24, h] }; }
    const hd = bordeIzq('.heroe');
    return { ...c, px: (hd + innerWidth) / 2 / innerWidth, py: 0.52, util: [innerWidth - hd - 48, innerHeight - 110] };
  }
  if (lugar === 'tapa' || lugar === 'creditos') {
    const c = { ...MANO, dist: 20, inclina: 4, gira: 0, alto: B.H + 0.5, ancho: B.W + 0.6 };
    if (movil()) {
      if (lugar === 'creditos') { const top = 62, bot = innerHeight * 0.5; return { ...c, px: 0.5, py: (top + bot) / 2 / innerHeight, util: [innerWidth - 24, bot - top - 8] }; }
      const [w, h, yc] = huecoBajo('.ficha-lateral', innerHeight - barraAlto()); return { ...c, px: 0.5, py: yc / innerHeight, util: [w, h] };
    }
    if (lugar === 'creditos') { const libre = $('.expediente').offsetLeft; return { ...c, px: libre / 2 / innerWidth, py: 0.5, util: [libre - 60, innerHeight - 190] }; }
    const hd = bordeIzq('.ficha-lateral');
    return { ...c, px: (hd + innerWidth) / 2 / innerWidth, py: 0.5, util: [innerWidth - hd - 60, innerHeight - 200] };
  }
  // el teatrillo: del pie de la pantalla al nombre de arriba, con los bastidores dentro
  const c = { x: PL.x, y: PL.y - CAPAS[0].d, z: PL.z + B.T / 2 + 1.12, dist: 15, inclina: 14, gira: 0, alto: 2.7, ancho: 3.5 };
  if (movil()) return { ...c, z: c.z + 0.1, alto: 4.2, ancho: 3.9, px: 0.5, py: 0.45, util: [innerWidth, innerHeight - 120] };
  // nunca bajo el recorrido (que crece con los mandos al encender la pantalla): el encuadre va de la cabecera a la barra
  const arriba = 76, bajo = innerHeight - document.querySelector('.recorrido').offsetHeight - (document.querySelector('.tele-mandos').hidden ? 58 : 0) - 30;
  return { ...c, px: 0.5, py: (arriba + bajo) / 2 / innerHeight, util: [innerWidth - 140, bajo - arriba] };
}

// ── Los lomos de la balda: un botón de verdad (invisible) sobre cada uno ──
const capa = $('#mandos'), etiqueta = $('.etiqueta');
capa.innerHTML = PROYECTOS.map((p, i) => `<button type="button" class="lomo-b" data-i="${i}" aria-label="${p.nombre}: ${p.linea}"></button>`).join('');
const botones = [...capa.children];
let lugar = 'balda';
function seguirMandos() {
  const ver = lugar === 'balda' && muelles.v.saca < 0.02;
  capa.hidden = !ver; if (!ver) { etiqueta.hidden = true; return; }
  for (let i = 0; i < N; i++) {
    const [ax, ay] = S.aPantalla(D.tomos_x[i], D.lomos, D.z0 + D.altos[i]), [bx, by] = S.aPantalla(D.tomos_x[i] + D.gruesos[i], D.lomos, D.z0);
    botones[i].style.cssText = `left:${ax}px;top:${ay}px;width:${bx - ax}px;height:${by - ay}px`;
  }
  const f = capa.querySelector('.lomo-b:hover, .lomo-b:focus-visible'), k = f ? +f.dataset.i : -1;
  if (k >= 0 && innerWidth >= 760) {
    const p = PROYECTOS[k], r = f.getBoundingClientRect();
    etiqueta.querySelector('b').textContent = `Tomo ${p.n} · ${p.tipo}`; etiqueta.querySelector('span').textContent = `${p.nombre}. ${p.linea}`;
    const ew = etiqueta.offsetWidth || 280, ex = Math.min(innerWidth - ew - 12, Math.max(12, r.left + r.width / 2 - ew / 2)), ey = Math.max(70, r.top - (etiqueta.offsetHeight || 70) - 14);
    etiqueta.style.transform = `translate(${Math.round(ex)}px, ${Math.round(ey)}px)`; etiqueta.hidden = false;
  } else etiqueta.hidden = true;
}
// el lomo que se señala se inclina hacia ti (como al tirar de un libro con el dedo); su lámina se va cargando ya
let asomado = -1;
function asomar(k) {
  if (k === asomado) return; asomado = k;
  muelles.ir({ asoma: PROYECTOS.map((_, i) => (i === k ? 1 : 0)) });
  if (k >= 0) C.cargarArte(PROYECTOS[k].id);
}
capa.addEventListener('pointerover', (e) => { const b = e.target.closest('.lomo-b'); asomar(b ? +b.dataset.i : -1); S.pedirDibujo(); });
capa.addEventListener('pointerout', (e) => { if (!e.relatedTarget?.closest?.('.lomo-b')) asomar(-1); S.pedirDibujo(); });
capa.addEventListener('focusin', (e) => { const b = e.target.closest('.lomo-b'); asomar(b?.matches(':focus-visible') ? +b.dataset.i : -1); S.pedirDibujo(); });
capa.addEventListener('focusout', () => { asomar(-1); S.pedirDibujo(); });
capa.addEventListener('click', (e) => { const b = e.target.closest('.lomo-b'); if (b) rutas.ir(PROYECTOS[+b.dataset.i].id); });
const aviso = $('.aviso');
function alLomo(k) {
  k = Math.min(N - 1, Math.max(0, k)); botones[k].focus({ preventScroll: true });
  aviso.textContent = `Libro ${k + 1} de ${N}: ${PROYECTOS[k].nombre}.`;
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
const idActual = () => (rutas.actual ?? 'balda').split('/')[0];
const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
function pintarFicha(p, i) {
  ficha.style.setProperty('--c', p.color);
  ficha.querySelector('.fi-n').textContent = `Tomo ${p.n} · libro ${i + 1} de ${N}`;
  ficha.querySelector('.fi-nombre').textContent = p.nombre;
  ficha.querySelector('.fi-tipo').textContent = `${p.tipo} · ${p.estado}`;
  ficha.querySelector('.fi-linea').textContent = p.linea;
  ficha.querySelector('.fi-botones').innerHTML = `<button type="button" class="boton boton-luz" data-ir-paso="abierto"><span class="boton-tapa">${p.demo ? 'Abrirlo: su demo' : 'Abrirlo: su tráiler'}</span></button>
    <button type="button" class="boton boton-claro" data-ir-paso="creditos"><span class="boton-tapa">Darle la vuelta</span></button>
    ${p.web ? `<a class="fi-web" href="${p.web[1]}" target="_blank" rel="noopener">${esc(p.web[0])} ↗</a>` : ''}`;
  expediente.style.setProperty('--c', p.color);
  expediente.querySelector('#ex-nombre').textContent = p.nombre;
  expediente.querySelector('.ex-n b').textContent = p.n;
  expediente.querySelector('.ex-bloques').innerHTML = p.bloques.map(([t, x]) => `<p class="ex-celda"><small>${esc(t)}</small><span>${esc(x)}</span></p>`).join('');
  expediente.querySelector('.ex-cifras').innerHTML = p.cifras.map(([n, t]) => `<p class="ex-celda"><b>${esc(n)}</b><small>${esc(t)}</small></p>`).join('');
  expediente.querySelector('.ex-mat span').textContent = p.stack.length ? p.stack.join(' · ') : '—';
  expediente.querySelector('.ex-web span').innerHTML = p.web ? `<a href="${p.web[1]}" target="_blank" rel="noopener">${esc(p.web[0])} ↗</a>` : 'Sin web pública';
  expediente.querySelector('.ex-estado').textContent = p.estado;
}

// ── La pantalla del teatrillo ──
const tele = $('#tele'), mandos = $('.tele-mandos'), webTele = $('.tele-web');
let enTele = null, teleId = null, teleTurno = 0;
function esquina(x, s) {            // un punto del telón (x a lo ancho, s desde su pliegue hacia arriba), en píxeles
  v3.set(x, -0.021, s); pops[0].localToWorld(v3).project(S.camara);
  return [(v3.x + 1) / 2 * innerWidth, (1 - v3.y) / 2 * innerHeight];
}
function seguirTele() {
  if (tele.hidden) return;
  if (movil()) { if (!tele.classList.contains('completa')) { desajustar(tele); tele.classList.add('completa'); } return; }
  tele.classList.remove('completa');
  libro.updateMatrixWorld(true);
  const g = 0.012, x0 = -P.ancho / 2 + g, x1 = P.ancho / 2 - g, s0 = P.pie + g, s1 = P.pie + P.alto - g;
  ajustar(tele, [esquina(x0, s1), esquina(x1, s1), esquina(x1, s0), esquina(x0, s0)]);
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

// ── Rutas: #balda, #<id>, #<id>/creditos, #<id>/abierto ──
rutas = montarRutas({
  inicio: 'balda',
  validar(r) {
    if (!r || r === 'balda') return 'balda';
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
  const p = porId(id), i = p ? PROYECTOS.indexOf(p) : -1, portada = ruta === 'balda';
  document.documentElement.dataset.ruta = portada ? 'balda' : paso || 'libro';
  const focoMandos = document.activeElement?.closest('.lista, .pasos, .ficha-lateral'), focoFuera = document.activeElement?.closest('.recorrido, .tele, .tele-mandos, .expediente, .ficha-lateral');
  heroe.toggleAttribute('inert', !portada);
  recorrido.hidden = portada;
  ficha.hidden = portada || paso !== '';
  expediente.hidden = !p || paso !== 'creditos';
  if (p) { pintarFicha(p, i); for (const b of pasos.children) b.setAttribute('aria-current', b.dataset.paso === paso ? 'step' : 'false'); }
  dice.textContent = paso === 'abierto' ? (p.demo ? 'En el teatrillo del libro: una simulación (personajes inventados; la mecánica es la del juego).' : 'En el teatrillo del libro: el tráiler del proyecto.') : p ? PASOS.find((x) => x.id === paso).dice : '';
  if (focoMandos && p) requestAnimationFrame(() => pasos.querySelector('[aria-current="step"]')?.focus({ preventScroll: true }));
  const focoBalda = () => { if (portada && focoFuera && mio === turno) requestAnimationFrame(() => { S.dibujar(); botones[sel]?.focus({ preventScroll: true }); }); };
  if (paso !== 'abierto' || teleId !== id) apagarTele();
  const destino = portada ? 'balda' : paso === 'creditos' ? 'creditos' : paso === 'abierto' ? 'abierto' : 'tapa';
  const objetivo = { saca: portada ? 0 : 1, gira: paso === 'creditos' ? 1 : 0, abre: paso === 'abierto' ? 1 : 0 };

  if (inmediato || RM) {
    if (p) { sel = i; await vestir(i); if (mio !== turno) return; }
    lugar = destino; asomado = -1;
    muelles.ir({ asoma: cero(), ...objetivo, cam: camDe(destino) }, true);
    S.pedirDibujo();
    if (paso === 'abierto') encenderTele(p, mio);
    focoBalda();
    return;
  }
  const sigue = () => mio === turno;
  // la vuelta no necesita la calma de la ida (la ida, más lenta, es la que se mira)
  const deVuelta = (si) => muelles.ritmo('abre', si ? 150 : 62, si ? 24 : 13.5).ritmo('saca', si ? 190 : 105, si ? 27 : 19.5);
  deVuelta(false);
  // 1. si hay otro libro fuera (o este vuelve a la balda, o hay que cerrarlo): se cierra, se pone derecho y vuelve
  const fueraOtro = muelles.obj.saca > 0 && (portada || sel !== i);
  if (fueraOtro || (p && sel === i && objetivo.abre === 0 && Math.max(muelles.v.abre, muelles.obj.abre) > 0.001)) {
    deVuelta(true);
    muelles.ir({ abre: 0, cam: camDe('tapa') });
    await esperar(() => !sigue() || muelles.v.abre < 0.03); if (!sigue()) return;
  }
  if (fueraOtro) {
    deVuelta(true);
    lugar = portada ? 'balda' : 'tapa';
    muelles.ir({ gira: 0, saca: 0, abre: 0, cam: camDe('balda') });
    await esperar(() => !sigue() || (muelles.v.saca < 0.015 && Math.abs(muelles.v.gira) < 0.05)); if (!sigue()) return;
  }
  deVuelta(false);
  if (portada) { lugar = 'balda'; muelles.ir({ saca: 0, gira: 0, abre: 0, cam: camDe('balda') }); focoBalda(); return; }
  // 2. sacarlo
  if (muelles.obj.saca === 0 || sel !== i) {
    await vestir(i); if (!sigue()) return;      // el libro que viaja cambia de tela solo cuando el anterior ya está en su sitio
    sel = i; asomado = -1;
    lugar = 'tapa';
    muelles.ir({ asoma: cero(), saca: 1, cam: camDe(destino === 'abierto' ? 'tapa' : destino) });
    if (destino === 'abierto') { await esperar(() => !sigue() || muelles.v.saca > 0.85); if (!sigue()) return; }
  }
  // 3. con el libro en la mano: la tapa, la contracubierta o abrirlo
  if (destino !== 'abierto') { lugar = destino; muelles.ir({ gira: objetivo.gira, abre: 0, cam: camDe(destino) }); return; }
  if (Math.max(muelles.v.gira, muelles.obj.gira) > 0.05) {
    muelles.ir({ gira: 0, cam: camDe('tapa') });
    await esperar(() => !sigue() || muelles.v.gira < 0.12); if (!sigue()) return;
  }
  lugar = 'abierto';
  muelles.ir({ gira: 0, abre: 1, cam: camDe('abierto') });
  await esperar(() => !sigue() || (muelles.v.abre > 0.985 && camCerca(0.4))); if (!sigue()) return;
  encenderTele(p, mio);
}

// teclado: en la balda, ← → por los lomos e Intro saca; en un libro, ← → por los pasos; Esc vuelve uno atrás
addEventListener('keydown', (e) => {
  if (e.target.closest('input, textarea, dialog[open]')) return;
  if (e.target.closest('.tele') && e.key !== 'Escape') return;
  const r = rutas.actual, [id, paso = ''] = r.split('/'), k = PASOS.findIndex((p) => p.id === paso);
  if (r === 'balda') {
    const d = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key]; if (!d) return;
    if (e.target.closest('.heroe, .barra')) return;
    e.preventDefault();
    const b = e.target.closest('.lomo-b'); alLomo(b ? +b.dataset.i + d : d > 0 ? 0 : N - 1);
    return;
  }
  if (e.key === 'ArrowRight' && k < PASOS.length - 1) { e.preventDefault(); rutas.ir(rutaDe(id, PASOS[k + 1].id)); }
  else if (e.key === 'ArrowLeft' && k > 0) { e.preventDefault(); rutas.ir(rutaDe(id, PASOS[k - 1].id)); }
  else if (e.key === 'Escape') { e.preventDefault(); rutas.volverA(k > 0 ? rutaDe(id, PASOS[k - 1].id) : 'balda'); }
});

// ── La lista de los nueve ──
const lista = $('.lista');
$('.lista-ol').innerHTML = PROYECTOS.map((p, i) => `<li><span class="li-n" style="--c:${p.color}">${p.n}</span>
  <div><b>${p.nombre}</b><span class="li-linea">${p.linea}</span><small>Libro ${i + 1} · ${p.tipo} · ${p.estado}</small></div>
  <span class="li-botones"><button type="button" class="boton boton-claro" data-sacar="${p.id}"><span class="boton-tapa">Sacarlo</span></button>${p.demo ? `<button type="button" class="boton boton-luz" data-sacar="${p.id}/abierto"><span class="boton-tapa">Demo</span></button>` : ''}</span></li>`).join('');
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
await vestir(0);
muelles.ir({ cam: camDe('balda') }, true);
rutas.arrancar();
S.dibujar();
S.listo();
(window.requestIdleCallback ?? setTimeout)(() => C.cargarArte('adivinadle'), { timeout: 3000 });
const redondo = (x) => Math.round(x * 1000) / 1000;
window.__estado = () => ({
  ruta: rutas.actual, sel, saca: redondo(muelles.v.saca), gira: redondo(muelles.v.gira), abre: redondo(muelles.v.abre),
  quieto: !muelles.corriendo && !enCurso, lugar, vestido,
  tele: !tele.hidden, enTele: enTele && (enTele === 'encendiendo' ? 'encendiendo' : 'encendida'), teleId,
  ficha: !ficha.hidden, expediente: !expediente.hidden, mandos: !capa.hidden,
});
