// La centralita, con el kit E1. Un mueble de cerámica y latón: los nueve proyectos son nueve puertos (el décimo, con
// la placa en blanco, espera al siguiente). Se lleva la clavija a un puerto, o se pulsa el puerto y va sola: encaja
// con un pequeño rebote, el cordón la sigue, se enciende su piloto y el panel de tres caras gira para poner su ficha.
// «En línea» gira el panel otra vez: la tercera cara es la pantalla, con la demo (Adivinadle) o el tráiler.
//
// La clavija no tiene posiciones guardadas: un muelle la lleva de donde esté a donde toque, y para cambiar de sitio
// primero sale recta del puerto (o se levanta de su cuna), viaja por delante del tablero y entra recta en el nuevo.
// Así, cambiar de idea a mitad, soltarla en el aire o entrar por un enlace dejan siempre la centralita en un estado
// posible. El cordón se tiende en cada fotograma entre el pasacables de la repisa y la cola de la clavija.
import { montarEscena, THREE, RM, b3 } from '../../../kit-e1/js/motor.js';
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
  { id: '', boton: 'Conectado', dice: 'La clavija está en su puerto y el panel pone su ficha. Puedes llevarla a otro arrastrándola, o pulsar otro puerto.' },
  { id: 'linea', boton: 'En línea', dice: '' },
];
const IDS = PROYECTOS.map((p) => p.id);

// ── Arranque ──
await C.cargar();
let seleccion = -1, rutas = null;
const S = await montarEscena({
  plato: $('#plato'), luz: 'luz/', fondo: '#232d33', exposicion: 1.0,
  etiqueta: 'Una centralita de cerámica y latón: diez puertos con su piloto y su placa, una clavija con su cordón sobre la repisa y, encima, un panel que gira',
  material(n, { textura, datos }) {
    if (n === 'panel_cara') return { luz: 'mueble', mapa: textura('tablero', I.tamTablero(datos.tablero)), brillo: 0.12 };
    if (n === 'panel_cara_0') return { mapa: textura('rotulo', I.TAM_CARA), brillo: 0.1 };
    if (n === 'panel_cara_1') return { mapa: textura('ficha', I.TAM_CARA), brillo: 0.1 };
    if (n === 'pantalla_cara') return { color: '#000000', emite: '#0b0d11', brillo: 0.2 };
    if (n.startsWith('piloto_')) return { luz: 'mueble', brillo: 0.5 };
    if (n === 'mueble_laton_unido') return { luz: 'mueble', brillo: 0.5 };
    if (n === 'mueble_unido') return { luz: 'mueble', brillo: 0.16 };
    if (n === 'clavija_laton_unida') return { luz: 'clavija', brillo: 0.55 };
    if (n === 'clavija_unida') return { luz: 'clavija', brillo: 0.3 };
    if (n === 'panel_laton_unido') return { luz: 'panel', brillo: 0.5 };
    if (n === 'panel_cuerpo_unido') return { luz: 'panel', brillo: 0.1 };
    return { luz: 'pared' };
  },
});
const { nodo, lienzos, texturas } = S;
const D = S.datos, T = D.tablero, P = D.panel, CL = D.clavija, FRENTE = D.frente;
I.tablero(lienzos.tablero, D); texturas.tablero.needsUpdate = true;
I.rotulo(lienzos.rotulo); texturas.rotulo.needsUpdate = true;
let fichaDe = null;
function pintarFichaCara(p) { if (fichaDe === p.id) return; fichaDe = p.id; I.ficha(lienzos.ficha, p); texturas.ficha.needsUpdate = true; }
pintarFichaCara(PROYECTOS[0]);
const pilotos = D.orden.map((_, i) => nodo[`piloto_${i}`].material);
const APAGADO = new THREE.Color('#000000'), ASOMA = new THREE.Color('#6b3d08'), ENCENDIDO = new THREE.Color('#ffae3d');

// ── La clavija: dónde se asienta (cada asiento con su salida) y el muelle que la lleva ──
const V3 = (a) => new THREE.Vector3(a[0], a[1], a[2]);            // en coordenadas de Blender
const REPOSO = { pos: V3(CL.reposo), sale: new THREE.Vector3(0, 0, 0.9) };
const PUERTOS = D.puertos.map(([x, z]) => ({ pos: new THREE.Vector3(x, FRENTE - 0.1 + CL.mete, z), sale: new THREE.Vector3(0, -1.25, 0) }));
const asiento = (k) => (k === 'reposo' ? REPOSO : PUERTOS[k]);
const cl = { p: REPOSO.pos.clone(), v: new THREE.Vector3(), sentada: 'reposo', meta: 'reposo', viva: false, arrastre: null, cerca: -1, t: 0 };
const meta_ = new THREE.Vector3(), ac = new THREE.Vector3();
function moverClavija(t) {
  const dt = Math.min(0.1, (t - cl.t) / 1000), n = Math.max(3, Math.ceil(dt / 0.008)); cl.t = t;
  let k = 190, c = 24;
  if (cl.arrastre) { meta_.copy(cl.arrastre); k = 320; c = 30; }
  else if (cl.sentada !== null && cl.sentada !== cl.meta) {             // sale recta de donde estaba
    const a = asiento(cl.sentada); meta_.copy(a.pos).add(a.sale); k = 260; c = 26;
    if (cl.p.distanceTo(meta_) < 0.3) cl.sentada = null;
  } else if (cl.sentada === null) {                                     // viaja por delante hasta la boca del nuevo
    const a = asiento(cl.meta); meta_.copy(a.pos).add(a.sale);
    if (cl.p.distanceTo(meta_) < 0.32) { cl.sentada = cl.meta; alSentar(cl.meta); }
  } else { meta_.copy(asiento(cl.meta).pos); k = 420; c = 21; }         // entra y rebota un poco contra el aro
  for (let i = 0; i < n; i++) {
    ac.copy(meta_).sub(cl.p).multiplyScalar(k).addScaledVector(cl.v, -c);
    cl.v.addScaledVector(ac, dt / n); cl.p.addScaledVector(cl.v, dt / n);
  }
  const quieta = !cl.arrastre && cl.sentada === cl.meta && cl.p.distanceTo(meta_) < 0.004 && cl.v.length() < 0.03;
  if (quieta) { cl.p.copy(meta_); cl.v.set(0, 0, 0); cl.viva = false; } else requestAnimationFrame(moverClavija);
  marcha(); S.pedirDibujo();
}
function despertarClavija() { if (cl.viva) return; cl.viva = true; cl.t = performance.now(); requestAnimationFrame(moverClavija); }
function llevarClavija(k, ya = false) {
  cl.meta = k;
  if (ya || RM) { cl.sentada = k; cl.p.copy(asiento(k).pos); cl.v.set(0, 0, 0); cl.arrastre = null; S.pedirDibujo(); return; }
  despertarClavija();
}
let alSentar = () => {};

// ── El cordón: un tubo entre el pasacables y la cola de la clavija, que se recoloca en cada fotograma ──
const TRAMOS = 36, LADOS = 8, RADIO = 0.062;
const cordon = (() => {
  const g = new THREE.BufferGeometry(), nv = (TRAMOS + 1) * LADOS;
  g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(nv * 3), 3));
  g.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(nv * 3), 3));
  const uv = new Float32Array(nv * 2), idx = [];
  for (let i = 0; i <= TRAMOS; i++) for (let j = 0; j < LADOS; j++) { uv[(i * LADOS + j) * 2] = i / TRAMOS; uv[(i * LADOS + j) * 2 + 1] = j / LADOS; }
  for (let i = 0; i < TRAMOS; i++) for (let j = 0; j < LADOS; j++) {
    const a = i * LADOS + j, b = i * LADOS + (j + 1) % LADOS, c = a + LADOS, d = b + LADOS; idx.push(a, c, b, b, c, d);
  }
  g.setAttribute('uv', new THREE.BufferAttribute(uv, 2)); g.setIndex(idx);
  const m = new THREE.ShaderMaterial({
    uniforms: { largo: { value: 1 } },
    vertexShader: 'varying vec3 vN; varying vec2 vU; void main(){ vN = normalize(mat3(modelMatrix) * normal); vU = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
    fragmentShader: `uniform float largo; varying vec3 vN; varying vec2 vU;
      void main(){ vec3 n = normalize(vN);
        float l = 0.34 + 0.66 * max(dot(n, normalize(vec3(-0.5, 0.75, 0.45))), 0.0);
        float trenza = 0.82 + 0.18 * sin(vU.x * largo * 46.0 + vU.y * 6.2832 * 2.0);   // el trenzado del cordón de tela
        vec3 c = vec3(0.42, 0.085, 0.07) * l * trenza + vec3(0.05) * pow(max(dot(n, normalize(vec3(-0.3, 0.6, 0.74))), 0.0), 12.0);
        gl_FragColor = vec4(c, 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
  });
  const malla = new THREE.Mesh(g, m); malla.frustumCulled = false; S.escena.add(malla);
  return { g, m };
})();
const A3 = b3(...CL.pasacables), B3 = new THREE.Vector3(), C1 = new THREE.Vector3(), C2 = new THREE.Vector3();
const pt = new THREE.Vector3(), tg = new THREE.Vector3(), n1 = new THREE.Vector3(), n2 = new THREE.Vector3(), EJE = new THREE.Vector3(1, 0, 0.0001);
function tenderCordon() {
  B3.copy(b3(cl.p.x, cl.p.y - CL.largo + 0.04, cl.p.z));
  const d = A3.distanceTo(B3);
  C1.copy(A3).add(b3(0, -0.12 - 0.05 * d, 0.4 + 0.1 * d));              // sale hacia arriba del pasacables
  C2.copy(B3).add(b3(0, -(0.5 + 0.2 * d), -0.24 * d));                  // llega a la cola desde atrás, con su comba
  const pos = cordon.g.attributes.position.array, nor = cordon.g.attributes.normal.array;
  for (let i = 0; i <= TRAMOS; i++) {
    const t = i / TRAMOS, u = 1 - t;
    pt.set(0, 0, 0).addScaledVector(A3, u * u * u).addScaledVector(C1, 3 * u * u * t).addScaledVector(C2, 3 * u * t * t).addScaledVector(B3, t * t * t);
    tg.set(0, 0, 0).addScaledVector(A3, -3 * u * u).addScaledVector(C1, 3 * u * u - 6 * u * t).addScaledVector(C2, 6 * u * t - 3 * t * t).addScaledVector(B3, 3 * t * t).normalize();
    n1.crossVectors(tg, EJE).normalize(); n2.crossVectors(tg, n1);
    for (let j = 0; j < LADOS; j++) {
      const a = (j / LADOS) * Math.PI * 2, ca = Math.cos(a), sa = Math.sin(a), k = (i * LADOS + j) * 3;
      const nx = n1.x * ca + n2.x * sa, ny = n1.y * ca + n2.y * sa, nz = n1.z * ca + n2.z * sa;
      nor[k] = nx; nor[k + 1] = ny; nor[k + 2] = nz;
      pos[k] = pt.x + nx * RADIO; pos[k + 1] = pt.y + ny * RADIO; pos[k + 2] = pt.z + nz * RADIO;
    }
  }
  cordon.g.attributes.position.needsUpdate = true; cordon.g.attributes.normal.needsUpdate = true;
  cordon.m.uniforms.largo.value = d + 1.2;
}

// ── Las cámaras ──
const bordeIzq = (sel) => { const h = document.querySelector(sel); return h.offsetLeft + h.offsetWidth; };
function huecoBajo(sel, abajo = innerHeight - 24) {
  const h = document.querySelector(sel), arriba = h.offsetTop + h.offsetHeight + 12;
  return [innerWidth - 24, Math.max(160, abajo - arriba), (arriba + abajo) / 2];
}
// el mueble entero, en lo que dejan libre la tarjeta (o la ficha) y la barra de pasos
function camMueble(sel, abajo) {
  const c = { x: 0, y: FRENTE, z: 5.25, dist: 46, inclina: 7, gira: 9, alto: 12.0, ancho: 16.4 };
  // en tableta la tarjeta de portada va arriba, pero la ficha sigue a un lado
  if (movil() || (apilado() && (sel === '.heroe' || innerHeight > innerWidth))) { const [w, h, yc] = huecoBajo(sel, abajo); return { ...c, gira: 0, ancho: movil() ? 13.7 : 16.4, alto: movil() ? 11.6 : 12.0, px: 0.5, py: yc / innerHeight, util: [w + (movil() ? 16 : -24), h] }; }
  const hd = bordeIzq(sel), bajo = abajo ?? innerHeight - 20;
  return { ...c, px: (hd + innerWidth) / 2 / innerWidth, py: (78 + bajo) / 2 / innerHeight, util: [innerWidth - hd - 48, bajo - 78] };
}
function camPantalla() {
  const c = { x: 0, y: P.y - P.radio, z: P.z, dist: 14, inclina: 2, gira: 0 };
  if (movil() || innerHeight > innerWidth) return { ...camMueble('.ficha-lateral', innerHeight - (recorrido.offsetHeight + 30)) };
  // la pantalla, nunca bajo el recorrido (que crece con los mandos al encenderla): si sube más, el encuadre se acorta
  const alto = innerHeight - 190, arriba = 0.46 * innerHeight - alto / 2;
  const tope = innerHeight - recorrido.offsetHeight - (mandos.hidden ? 58 : 0) - 18 - 14, bajo = Math.min(arriba + alto, tope);
  return { ...c, alto: P.alto + 0.5, ancho: P.ancho + 0.8, px: 0.5, py: (arriba + bajo) / 2 / innerHeight, util: [innerWidth - 120, bajo - arriba] };
}
function camaraDe(ruta) {
  const [id, paso = ''] = ruta.split('/');
  if (id === 'centralita') return camMueble('.heroe');
  if (paso === 'linea') return camPantalla();
  return camMueble('.ficha-lateral', innerHeight - (recorrido.offsetHeight + 30));
}
const muelles = new Muelles({ gira: 0, cam: camMueble('.heroe') }, { rigidez: 150, amort: 22.5 }).ritmo('cam', 110, 20).ritmo('gira', 70, 15.5);

// ── Colocar: la clavija, el cordón, el panel y los pilotos ──
const EJE_X = new THREE.Vector3(1, 0, 0);
let asomado = -1, pendiente = null;
function colocar(v) {
  nodo.clavija.position.copy(b3(cl.p.x, cl.p.y, cl.p.z));
  tenderCordon();
  if (pendiente && v.gira >= pendiente.umbral) { pintarFichaCara(pendiente.p); pendiente = null; }
  nodo.panel.quaternion.setFromAxisAngle(EJE_X, -v.gira * Math.PI * 2 / 3);
  const puesta = cl.sentada === cl.meta && cl.meta !== 'reposo' && !cl.arrastre ? cl.meta : -1;
  pilotos.forEach((m, i) => m.uniforms.emite.value.copy(i === puesta ? ENCENDIDO : i === asomado || i === cl.cerca ? ASOMA : APAGADO));
  const { util, ...c } = v.cam;
  S.encuadrar(c, { util: util ?? [innerWidth, innerHeight] });
}
function marcha() { S.enMarcha(muelles.corriendo || cl.viva); }
muelles.alMover = () => { marcha(); S.pedirDibujo(); };
muelles.alParar = () => { marcha(); S.pedirDibujo(); };
S.alDibujar = () => { colocar(muelles.v); seguirPuertos(); seguirTele(); };

// ── Botones invisibles encima de cada puerto ──
const capa = $('#puertos'), etiqueta = $('.etiqueta');
capa.innerHTML = D.orden.map((id, i) => { const p = porId(id); return p ? `<button type="button" class="solar" data-id="${id}" data-i="${i}" aria-label="Puerto ${p.n}, ${p.nombre}: ${p.linea}"></button>` : ''; }).join('');
const botones = Object.fromEntries([...capa.children].map((b) => [b.dataset.id, b]));
function rectPuerto(i) {
  const [x, z] = D.puertos[i], a = S.aPantalla(x - D.hx * 0.46, FRENTE, z + 0.93), b = S.aPantalla(x + D.hx * 0.46, FRENTE, z - 1.22);
  return [Math.min(a[0], b[0]), Math.min(a[1], b[1]), Math.abs(b[0] - a[0]), Math.abs(b[1] - a[1])];
}
function seguirPuertos() {
  const ver = (rutas?.actual ?? 'centralita').split('/')[1] !== 'linea';
  capa.hidden = !ver; if (!ver) { etiqueta.hidden = true; asomado = -1; return; }
  for (const id of IDS) { const [x, y, w, h] = rectPuerto(+botones[id].dataset.i); botones[id].style.cssText = `left:${x}px;top:${y}px;width:${w}px;height:${h}px`; }
  const b = capa.querySelector('.solar:hover, .solar:focus-visible'), p = b && !cl.arrastre && porId(b.dataset.id);
  if (p && p.id !== idActual()) {
    const [x, y, w, h] = rectPuerto(+b.dataset.i);
    etiqueta.querySelector('b').textContent = `Puerto ${p.n} · ${p.tipo}`; etiqueta.querySelector('span').textContent = `${p.nombre}. ${p.linea}`;
    const ew = etiqueta.offsetWidth || 280, ex = Math.min(Math.max(8, x + w / 2 - ew / 2), innerWidth - ew - 8);
    const abajo = y + h + 8, ey = abajo + (etiqueta.offsetHeight || 70) > innerHeight - 8 ? y - (etiqueta.offsetHeight || 70) - 8 : abajo;
    etiqueta.style.transform = `translate(${Math.round(ex)}px, ${Math.round(ey)}px)`; etiqueta.hidden = false;
  } else etiqueta.hidden = true;
}
function asomar(i) { if (asomado === i) return; asomado = i; S.pedirDibujo(); }
capa.addEventListener('pointerover', (e) => { const b = e.target.closest('.solar'); if (b && e.pointerType !== 'touch') asomar(+b.dataset.i); });
capa.addEventListener('pointerleave', () => asomar(-1));
capa.addEventListener('focusin', (e) => { const b = e.target.closest('.solar'); if (b && b.matches(':focus-visible')) asomar(+b.dataset.i); });
capa.addEventListener('focusout', () => asomar(-1));
capa.addEventListener('click', (e) => { const b = e.target.closest('.solar'); if (b && !recienArrastrada) rutas.ir(b.dataset.id); });
capa.addEventListener('keydown', (e) => {
  const b = e.target.closest('.solar'); if (!b) return;
  const k = +b.dataset.i, cols = D.cols;
  const j = { ArrowRight: k + 1, ArrowLeft: k - 1, ArrowDown: k + cols, ArrowUp: k - cols, Home: 0, End: IDS.length - 1 }[e.key];
  if (j === undefined) return;
  e.preventDefault();
  const id = D.orden[j]; if (id && botones[id]) botones[id].focus();
});

// ── Coger la clavija y llevarla a mano: se arrastra por un plano delante del tablero y se suelta cerca de un puerto ──
const rayo = new THREE.Raycaster(), ndc = new THREE.Vector2(), planoY = FRENTE - 0.1 + CL.mete - 1.25, golpe = new THREE.Vector3();
const plano = new THREE.Plane(new THREE.Vector3(0, 0, 1), planoY);    // en three.js, z = −y de Blender: el plano y = planoY
let agarre = null, recienArrastrada = false;
function puntoEnPlano(e) {
  ndc.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1); rayo.setFromCamera(ndc, S.camara);
  if (!rayo.ray.intersectPlane(plano, golpe)) return null;
  return new THREE.Vector3(Math.max(-7.2, Math.min(7.2, golpe.x)), planoY, Math.max(1.1, Math.min(6.4, golpe.y)));
}
function puertoCerca(p) {
  let mejor = -1, dm = 1.15;
  D.puertos.forEach(([x, z], i) => { if (!porId(D.orden[i])) return; const d = Math.hypot(p.x - x, p.z - z); if (d < dm) { dm = d; mejor = i; } });
  return mejor;
}
addEventListener('pointerdown', (e) => {
  if (e.button !== 0 || (rutas.actual.split('/')[1] ?? '') === 'linea' || !e.target.closest('#plato')) return;
  const [sx, sy] = S.aPantalla(cl.p.x, cl.p.y - 1.0, cl.p.z), [tx, ty] = S.aPantalla(cl.p.x, cl.p.y - 0.2, cl.p.z);
  const cerca = Math.min(Math.hypot(e.clientX - sx, e.clientY - sy), Math.hypot(e.clientX - tx, e.clientY - ty));
  if (cerca > (e.pointerType === 'touch' ? 44 : 34)) return;
  agarre = { id: e.pointerId, x: e.clientX, y: e.clientY, movida: false };
}, true);
addEventListener('pointermove', (e) => {
  if (!agarre || e.pointerId !== agarre.id) return;
  if (!agarre.movida && Math.hypot(e.clientX - agarre.x, e.clientY - agarre.y) < 6) return;
  const p = puntoEnPlano(e); if (!p) return;
  if (!agarre.movida) { agarre.movida = true; document.documentElement.classList.add('arrastrando'); }
  cl.arrastre = p; cl.sentada = null; cl.cerca = puertoCerca(p); despertarClavija();
});
function soltarClavija(e) {
  if (!agarre || e.pointerId !== agarre.id) return;
  const movida = agarre.movida; agarre = null;
  if (!movida) return;
  document.documentElement.classList.remove('arrastrando');
  recienArrastrada = true; setTimeout(() => { recienArrastrada = false; }, 60);
  const i = puertoCerca(cl.arrastre); cl.arrastre = null; cl.cerca = -1;
  const ruta = i >= 0 ? D.orden[i] : 'centralita';
  if (rutas.actual === ruta) llevarClavija(i >= 0 ? i : 'reposo'); else rutas.ir(ruta);   // soltada donde estaba: vuelve a entrar
}
addEventListener('pointerup', soltarClavija); addEventListener('pointercancel', soltarClavija);
$('#plato').addEventListener('pointermove', (e) => {
  if (agarre || e.pointerType === 'touch') return;
  const [sx, sy] = S.aPantalla(cl.p.x, cl.p.y - 1.0, cl.p.z);
  document.documentElement.classList.toggle('sobre-clavija', (rutas.actual.split('/')[1] ?? '') !== 'linea' && Math.hypot(e.clientX - sx, e.clientY - sy) < 34);
});

// ── La ficha y el recorrido ──
const ficha = $('.ficha-lateral'), recorrido = $('.recorrido'), pasos = $('.pasos'), dice = $('.dice'), heroe = $('.heroe');
pasos.innerHTML = PASOS.map((p, i) => `<button type="button" data-paso="${p.id}"><i>${i + 1}</i><span>${p.boton}</span></button>`).join('');
pasos.addEventListener('click', (e) => { const b = e.target.closest('[data-paso]'); if (b) rutas.ir(rutaDe(idActual(), b.dataset.paso)); });
document.addEventListener('click', (e) => {
  const a = e.target.closest('[data-ir]'); if (a) { e.preventDefault(); rutas.ir(a.dataset.ir); }
  const b = e.target.closest('[data-ir-paso]'); if (b) rutas.ir(rutaDe(idActual(), b.dataset.irPaso));
});
const rutaDe = (id, paso) => (paso ? `${id}/${paso}` : id);
const idActual = () => (rutas?.actual ?? 'centralita').split('/')[0];
const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
function pintarFicha(p) {
  ficha.style.setProperty('--c', p.color);
  ficha.querySelector('.fi-n').textContent = `Puerto ${p.n} · conectado`;
  ficha.querySelector('.fi-nombre').textContent = p.nombre;
  ficha.querySelector('.fi-tipo').textContent = `${p.tipo} · ${p.estado}`;
  ficha.querySelector('.fi-linea').textContent = p.linea;
  ficha.querySelector('.fi-bloques').innerHTML = p.bloques.slice(1).map(([t, x]) => `<p><small>${esc(t)}</small>${esc(x)}</p>`).join('')
    + (p.stack.length ? `<p><small>Qué interviene</small>${esc(p.stack.join(' · '))}</p>` : '');
  ficha.querySelector('.fi-botones').innerHTML = `<button type="button" class="boton boton-luz" data-ir-paso="linea"><span class="boton-tapa">${p.demo ? 'Ponerlo en línea <small>demo</small>' : 'Ponerlo en línea <small>tráiler</small>'}</span></button>
    ${p.web ? `<a class="fi-web" href="${p.web[1]}" target="_blank" rel="noopener">${esc(p.web[0])} ↗</a>` : ''}`;
}

// ── La pantalla: la tercera cara del panel ──
const tele = $('#tele'), mandos = $('.tele-mandos'), webTele = $('.tele-web');
let enTele = null, teleId = null, teleTurno = 0;
function seguirTele() {
  if (tele.hidden) return;
  // en el móvil y en la tableta en vertical, la demo ocupa la pantalla (en 3D quedaría a 350 px de ancho)
  if (movil() || innerHeight > innerWidth) { if (!tele.classList.contains('completa')) { desajustar(tele); tele.classList.add('completa'); } return; }
  tele.classList.remove('completa');
  const g = 0.03, y = P.y - P.radio - 0.014, x0 = -P.ancho / 2 + 0.06 + g, x1 = P.ancho / 2 - 0.06 - g, z0 = P.z - P.alto / 2 + 0.1 + g, z1 = P.z + P.alto / 2 - 0.1 - g;
  ajustar(tele, [S.aPantalla(x0, y, z1), S.aPantalla(x1, y, z1), S.aPantalla(x1, y, z0), S.aPantalla(x0, y, z0)]);
}
async function encenderTele(p, mio) {
  if (enTele && teleId === p.id) return;
  enTele = 'encendiendo'; teleId = p.id; const t0 = ++teleTurno;
  mandos.hidden = false; webTele.hidden = !p.web;      // antes de encender: la barra crece con los mandos
  if (p.web) { webTele.href = p.web[1]; webTele.querySelector('.boton-tapa').textContent = `${p.web[0].replace(/^github\.com\/[^/]+\//, 'GitHub: ')} ↗`; }
  requestAnimationFrame(() => mandos.classList.add('puestos'));
  if (!movil() && innerHeight <= innerWidth) muelles.ir({ cam: camPantalla() });   // la barra ha crecido: el encuadre, encima de ella
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

// ── Rutas: #centralita, #<id>, #<id>/linea ──
rutas = montarRutas({
  inicio: 'centralita',
  validar(r) {
    if (!r || r === 'centralita') return 'centralita';
    const [id, paso = ''] = r.split('/');
    return porId(id) && PASOS.some((p) => p.id === paso) ? rutaDe(id, paso) : null;
  },
  alCambiar: (ruta, o) => irA(ruta, o),
});

let turno = 0, enCurso = 0;
function esperar(cond) { return new Promise((ok) => { const mira = () => (cond() ? ok() : requestAnimationFrame(mira)); mira(); }); }
const cara = () => ((Math.round(muelles.v.gira) % 3) + 3) % 3;
// el panel gira siempre hacia el mismo lado: el siguiente valor, desde donde está, que deja delante la cara pedida
function giraHasta(c, vuelta = false) {
  const g = muelles.obj.gira, base = Math.ceil(g - 0.001);
  let t = base + ((c - base) % 3 + 3) % 3;
  if (vuelta && t - g < 0.5) t += 3;
  return t;
}
async function irA(ruta, o) {
  const mio = ++turno; enCurso++;
  try { await irA_(ruta, o, mio); } finally { enCurso--; }
}
async function irA_(ruta, { inmediato }, mio) {
  const [id, paso = ''] = ruta.split('/');
  const p = porId(id), i = p ? D.orden.indexOf(id) : -1;
  document.documentElement.dataset.ruta = id === 'centralita' ? 'centralita' : paso || 'conectado';
  const focoDentro = document.activeElement?.closest('.puertos, .lista, .pasos, .ficha-lateral'), focoFuera = document.activeElement?.closest('.recorrido, .tele, .tele-mandos');
  const antes = seleccion, cambia = antes !== i;
  heroe.toggleAttribute('inert', id !== 'centralita');
  recorrido.hidden = id === 'centralita';
  ficha.hidden = !p || paso !== '';
  if (p) {
    for (const b of pasos.children) b.setAttribute('aria-current', b.dataset.paso === paso ? 'step' : 'false');
    dice.textContent = paso === 'linea' ? (p.demo ? 'En la pantalla del panel: una simulación (personajes inventados; la mecánica es la del juego).' : 'En la pantalla del panel: el tráiler del proyecto.') : PASOS[0].dice;
    pintarFicha(p);
  }
  if (focoDentro && p && !document.activeElement?.closest('.puertos')) requestAnimationFrame(() => pasos.querySelector('[aria-current="step"]')?.focus({ preventScroll: true }));
  if (id === 'centralita' && focoFuera) requestAnimationFrame(() => { S.dibujar(); botones[D.orden[antes]]?.focus({ preventScroll: true }); });
  if (paso !== 'linea' || cambia) apagarTele();
  seleccion = i;
  const c = !p ? 0 : paso === 'linea' ? 2 : 1;

  if (inmediato || RM) {
    llevarClavija(p ? i : 'reposo', true);
    if (p) { pendiente = null; pintarFichaCara(p); }
    muelles.ir({ gira: c, cam: camaraDe(ruta) }, true);
    S.pedirDibujo();
    if (paso === 'linea') encenderTele(p, mio);
    return;
  }
  llevarClavija(p ? i : 'reposo');
  muelles.ir({ cam: camaraDe(ruta) });
  if (!p) { pendiente = null; muelles.ir({ gira: giraHasta(0) }); return; }
  // el panel espera a que la clavija toque su puerto: es la conexión la que lo hace girar
  await esperar(() => mio !== turno || cl.sentada === i);
  if (mio !== turno) return;
  let destino;
  if (fichaDe !== p.id && cara() === 1 && Math.abs(muelles.v.gira - Math.round(muelles.v.gira)) < 0.3) {
    // la ficha de otro está delante: una vuelta entera, y se cambia cuando queda detrás
    destino = giraHasta(c, true); pendiente = { p, umbral: muelles.v.gira + 0.85 };
  } else { pendiente = null; pintarFichaCara(p); destino = giraHasta(c); }
  muelles.ir({ gira: destino });
  if (paso !== 'linea') return;
  await esperar(() => mio !== turno || Math.abs(muelles.v.gira - destino) < 0.02);
  if (mio !== turno) return;
  encenderTele(p, mio);
}

// teclado: ← → por los pasos, Esc vuelve uno atrás (también desde dentro de la pantalla)
addEventListener('keydown', (e) => {
  if (e.target.closest('input, textarea, dialog[open], .puertos')) { if (e.key !== 'Escape' || !e.target.closest('.puertos')) return; }
  if (e.target.closest('.tele') && e.key !== 'Escape') return;
  const r = rutas.actual; if (r === 'centralita') return;
  const [id, paso = ''] = r.split('/'), k = PASOS.findIndex((p) => p.id === paso);
  if (e.key === 'ArrowRight' && k < PASOS.length - 1) { e.preventDefault(); rutas.ir(rutaDe(id, PASOS[k + 1].id)); }
  else if (e.key === 'ArrowLeft' && k > 0) { e.preventDefault(); rutas.ir(rutaDe(id, PASOS[k - 1].id)); }
  else if (e.key === 'Escape') { e.preventDefault(); rutas.ir(k > 0 ? rutaDe(id, PASOS[k - 1].id) : 'centralita'); }
});

// ── La lista de los nueve ──
const lista = $('.lista');
$('.lista-ol').innerHTML = PROYECTOS.map((p) => `<li><span class="li-n" style="--c:${p.color}">${p.n}</span>
  <div><b>${p.nombre}</b><span class="li-linea">${p.linea}</span><small>Puerto ${p.n} · ${p.tipo} · ${p.estado}</small></div>
  <span class="li-botones"><button type="button" class="boton boton-claro" data-sacar="${p.id}"><span class="boton-tapa">Conectar</span></button>${p.demo ? `<button type="button" class="boton boton-luz" data-sacar="${p.id}/linea"><span class="boton-tapa">Jugar</span></button>` : ''}</span></li>`).join('');
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
  ruta: rutas.actual, seleccion, quieto: !muelles.corriendo && !enCurso && !cl.viva && !agarre,
  cara: cara(), clavija: cl.sentada === 'reposo' ? 'reposo' : cl.sentada === null ? 'aire' : D.orden[cl.sentada],
  fichaDe, v: { gira: redondo(muelles.v.gira) },
  tele: !tele.hidden, enTele: enTele && (enTele === 'encendiendo' ? 'encendiendo' : 'encendida'),
  ficha: !ficha.hidden,
});
// para las pruebas: dónde está la clavija en la pantalla (por donde se la coge)
window.__clavija = () => S.aPantalla(cl.p.x, cl.p.y - 1.0, cl.p.z);
