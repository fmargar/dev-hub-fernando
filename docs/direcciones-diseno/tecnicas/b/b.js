// Técnica B: el mismo modelo de Blender (caja.glb) en tiempo real con three.js.
// La geometría sale de herramientas/caja.py; aquí se le ponen materiales de vinilo y lo impreso se pinta
// en canvas (arte.js), así que el título y el color cambian en vivo. Solo se dibuja cuando algo se mueve.
import * as THREE from 'three';
import { GLTFLoader } from '../vendor/three/GLTFLoader.js';
import { RoomEnvironment } from '../vendor/three/RoomEnvironment.js';
import { BALDA } from '../comun/datos.js';
import { POSES, Muelles, giroCercano } from '../comun/pose.js';
import { montarPlato, arrastre } from '../comun/plato.js';
import * as arte from './arte.js';

// Sin tarjeta gráfica (el navegador dibuja WebGL con la CPU) se baja la calidad: menos píxeles, sin suavizado,
// sombras sencillas y materiales sin barniz. Con ?ligero se fuerza para probarlo.
function quienDibuja() {
  const gl = document.createElement('canvas').getContext('webgl2') ?? document.createElement('canvas').getContext('webgl');
  if (!gl) return '';
  const i = gl.getExtension('WEBGL_debug_renderer_info');
  const n = i ? gl.getParameter(i.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER);
  gl.getExtension('WEBGL_lose_context')?.loseContext();
  return n;
}
const DIBUJA = quienDibuja();
const LIGERO = /swiftshader|llvmpipe|software/i.test(DIBUJA) || new URLSearchParams(location.search).has('ligero');
document.documentElement.classList.toggle('ligero', LIGERO);

const plato = document.getElementById('plato');
const r = new THREE.WebGLRenderer({ antialias: !LIGERO, powerPreference: 'high-performance' });
r.setPixelRatio(LIGERO ? 0.6 : Math.min(devicePixelRatio || 1, 2));
r.outputColorSpace = THREE.SRGBColorSpace;
r.toneMapping = THREE.NeutralToneMapping; r.toneMappingExposure = 1.0;
r.shadowMap.enabled = !LIGERO; r.shadowMap.type = THREE.PCFSoftShadowMap;
plato.prepend(r.domElement);
r.domElement.setAttribute('role', 'img'); r.domElement.setAttribute('aria-label', 'La caja de Adivinadle en la balda, en 3D');

const escena = new THREE.Scene();
escena.background = new THREE.Color('#f7e3d3');
const pm = new THREE.PMREMGenerator(r);
escena.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
escena.environmentIntensity = 0.6;
const camara = new THREE.PerspectiveCamera(30, 1, 0.1, 60);

// Luz de estudio de juguetes: una principal cálida que hace sombra y un relleno frío
const sol = new THREE.DirectionalLight('#fff1e0', 2.0);
sol.position.set(-3.5, 6.5, 6); sol.target.position.set(0, 1, -1);
sol.castShadow = true; sol.shadow.mapSize.setScalar(LIGERO ? 1024 : 2048); sol.shadow.radius = 6; sol.shadow.bias = -0.0004; sol.shadow.normalBias = 0.02;
Object.assign(sol.shadow.camera, { left: -4, right: 4, top: 4, bottom: -3, near: 1, far: 20 });
escena.add(sol, sol.target, new THREE.HemisphereLight('#e8f0ff', '#f0c9b0', LIGERO ? 1.6 : 0.6));

// ── Lo impreso: un canvas por cara, convertido en textura ──
const lienzos = {}, texturas = {};
function textura(id, w, h) {
  const c = arte.lienzo(w, h); lienzos[id] = c;
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.flipY = false; t.anisotropy = 8;
  texturas[id] = t; return t;
}
const estado = { titulo: 'Adivinadle', color: '#c3a8f5' };
const YO = BALDA.findIndex((p) => p.yo);
function pintarImpreso() {
  arte.portada(lienzos.portada, estado); arte.dorso(lienzos.dorso, estado);
  arte.disco(lienzos.disco, estado); arte.manual(lienzos.manual, estado);
  arte.lomo(lienzos[`lomo_${YO}`], YO, estado.color, estado.titulo);
  for (const id of ['portada', 'dorso', 'disco', 'manual', `lomo_${YO}`]) texturas[id].needsUpdate = true;
  cuerpo.color.set(estado.color).offsetHSL(0, -0.05, -0.12);
}

// Vinilo: mate satinado con un poco de barniz; arcilla para la balda y la pared
const vinilo = (color, extra = {}) => (LIGERO ? new THREE.MeshLambertMaterial({ color })
  : new THREE.MeshPhysicalMaterial({ color, roughness: 0.5, clearcoat: 0.35, clearcoatRoughness: 0.4, ...extra }));
const impreso = (t) => (LIGERO ? new THREE.MeshLambertMaterial({ map: t })
  : new THREE.MeshPhysicalMaterial({ map: t, roughness: 0.45, clearcoat: 0.5, clearcoatRoughness: 0.3 }));
const mate = (o) => (LIGERO ? new THREE.MeshLambertMaterial({ color: o.color, map: o.map ?? null }) : new THREE.MeshStandardMaterial(o));
const cuerpo = vinilo('#9d84d6');
const MAT = {
  balda: mate({ color: '#ec9f78', roughness: 0.92 }),
  pared: mate({ color: '#f6d7c3', roughness: 1 }),
  suelo_sombra: mate({ color: '#f0cbb3', roughness: 1 }),
  eje: vinilo('#3b2a5a'),
  disco_base: LIGERO ? mate({ color: '#f1ecff' }) : new THREE.MeshPhysicalMaterial({ color: '#f1ecff', roughness: 0.25, metalness: 0.2, iridescence: 1, iridescenceIOR: 1.6, iridescenceThicknessRange: [200, 600] }),
  manual_hojas: mate({ color: '#fff6ea', roughness: 0.9 }),
};

const cargador = new GLTFLoader();
const gltf = await new Promise((ok, mal) => cargador.load('caja.glb', ok, undefined, mal));
await document.fonts.load('700 100px Fredoka');
const [pw, ph] = arte.TAM.portada;
textura('portada', pw, ph); textura('dorso', pw, ph); textura('disco', ...arte.TAM.disco); textura('manual', ...arte.TAM.manual);
BALDA.forEach((p, i) => { textura(`lomo_${i}`, ...arte.TAM.lomo); if (!p.yo) arte.lomo(lienzos[`lomo_${i}`], i, arte.PASTEL[i]); });

const nodo = {};
gltf.scene.traverse((o) => {
  nodo[o.name] = o;
  if (!o.isMesh) return;
  o.castShadow = !['pared', 'suelo_sombra'].includes(o.name); o.receiveShadow = true;
  const n = o.name, v = n.match(/^vecino_(\d)_(cuerpo|lomo)$/);
  if (v) o.material = v[2] === 'lomo' ? impreso(texturas[`lomo_${v[1]}`]) : vinilo(new THREE.Color(arte.PASTEL[+v[1]]).offsetHSL(0, -0.05, -0.1));
  else if (n === 'lomo') o.material = impreso(texturas[`lomo_${YO}`]);
  else if (['portada', 'dorso'].includes(n)) o.material = impreso(texturas[n]);
  else if (n === 'disco_cara') { o.material = impreso(texturas.disco); o.material.side = THREE.DoubleSide; }
  else if (n === 'manual_portada') o.material = mate({ map: texturas.manual, roughness: 0.85 });
  else if (MAT[n]) o.material = MAT[n];
  else o.material = cuerpo;          // cuerpo de la caja, tapa y pestañas
});
gltf.scene.getObjectByName('camara')?.removeFromParent();
escena.add(gltf.scene);
pintarImpreso();
const { caja, tapa, disco, manual } = nodo;

// ── Poner una pose: las cifras de Blender (Z arriba) pasan a glTF (Y arriba): (x, y, z) → (x, z, -y) ──
const R = THREE.MathUtils.degToRad;
const DIST = 7.6;           // la cámara, a la misma distancia de la balda que la perspectiva de la técnica C
// Mientras la caja está metida en la balda solo entra y sale en línea recta: el giro, el paso al centro y la apertura
// esperan a que asome (si no, atraviesa los lomos de al lado, también al volver a mitad de camino)
const XB = POSES.balda.x;
const suave = (a, b, x) => { const t = THREE.MathUtils.clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
function pintar(v) {
  const fuera = suave(0.12, 0.85, -v.y);
  const de = 90 + 360 * Math.round((v.rz - 90) / 360);
  caja.position.set(XB + (v.x - XB) * fuera, v.z, -v.y);
  caja.rotation.set(R(v.rx * fuera), R(de + (v.rz - de) * fuera), 0, 'YXZ');
  tapa.rotation.set(0, R(v.tapa * fuera), 0);
  disco.position.z = -0.019 + v.disco * fuera * 0.32; disco.rotation.set(R(v.disco * fuera * 9), R(-v.disco * fuera * 9), 0, 'YXZ');
  manual.position.z = -(0.02 + v.manual * fuera * 0.06);
  // encuadre: lo que pide la pose (alto × ancho en el plano de la balda) en el hueco que deja la interfaz
  const W = innerWidth, H = innerHeight, util = H - (W < 760 ? 190 : 150);
  const k = Math.max(v.cam.alto / util, v.cam.ancho / (W - 32));          // unidades por píxel
  const altoVisto = k * H, sube = (W < 760 ? 40 : 20) * k;
  camara.fov = THREE.MathUtils.radToDeg(2 * Math.atan(altoVisto / 2 / DIST));
  camara.position.set(v.cam.x, v.cam.z - sube + 0.9, DIST);
  camara.lookAt(v.cam.x, v.cam.z - sube, 0);
  camara.updateProjectionMatrix();
  r.render(escena, camara);
}
function medir() { r.setSize(innerWidth, innerHeight); camara.aspect = innerWidth / innerHeight; pintar(muelles.v); }

const muelles = new Muelles(POSES.balda, { rigidez: 70, amort: 15 });
muelles.alMover = pintar;
let paso = 'balda';
const ctl = montarPlato({
  irA(id, { inmediato }) {
    paso = id;
    const obj = structuredClone(POSES[id]); obj.rz = giroCercano(muelles.v.rz, obj.rz);
    muelles.ir(obj, inmediato);
  },
  alCambiarDetalle(campo, valor) { estado[campo] = valor; pintarImpreso(); pintar(muelles.v); },
});
let rz0 = 0;
arrastre(plato, {
  alEmpezar() { rz0 = muelles.v.rz; },
  alMover(dx) { if (paso === 'portada' || paso === 'dorso') muelles.empujar('rz', rz0 + dx * 0.45); },
  alSoltar() {
    if (paso !== 'portada' && paso !== 'dorso') return;
    const destino = Math.round(muelles.obj.rz / 180) * 180;
    const id = ((Math.round(destino / 180) % 2) + 2) % 2 ? 'dorso' : 'portada';
    if (id !== paso) ctl.poner(id); else muelles.empujar('rz', destino);
  },
});
addEventListener('resize', medir);
medir();
requestAnimationFrame(() => document.querySelector(".cargando-velo")?.classList.add("fuera"));
// para medir: qué tarjeta gráfica dibuja
window.__render = `${DIBUJA}${LIGERO ? ' · modo ligero' : ''}`;
