// Técnica E: el modelo de Blender con la luz HORNEADA (herramientas/hornear.py) en three.js.
// La luz, las sombras de contacto y la oclusión ya vienen calculadas en texturas («luz»); aquí cada superficie
// es su color (o lo impreso, pintado en canvas) multiplicado por esa luz. No hay luces ni sombras en tiempo real:
// solo un brillo de estudio calculado con dos ventanas fijas, que es lo que hace que el plástico se vea plástico
// al girar. Por eso va igual con la gráfica que sin ella. Lo comparten E1 («premium») y E2 («estilizado»).
import * as THREE from 'three';
import { GLTFLoader } from '../vendor/three/GLTFLoader.js';
import { BALDA } from '../comun/datos.js';
import { POSES as BASE, Muelles, giroCercano } from '../comun/pose.js';
import { montarPlato, arrastre, RM } from '../comun/plato.js';

// La balda de E: siete lomos de canto y dos cajas de frente (mismas cifras que hornear.py)
export const ESPINAS = [0, 2, 4, 5, 6, 7, 8];
export const EXPUESTAS = [1, 3];
const PASO = 0.15 + 0.012;
const X_YO = (ESPINAS.indexOf(2) - (ESPINAS.length - 1) / 2) * PASO;

// Las poses de siempre; solo cambia dónde está la caja en la balda y el encuadre de la balda (la portada de la web:
// la balda abajo y sitio arriba para la cabecera). En móvil se encuadran los lomos y las cajas de frente asoman.
const POSES = structuredClone(BASE);
POSES.balda = { ...POSES.balda, x: X_YO, cam: { x: 0, z: 1.75, alto: 3.7, ancho: 5.0, anchoMovil: 2.3 } };
for (const p of Object.values(POSES)) p.cam.anchoMovil ??= p.cam.ancho;

function quienDibuja() {
  const gl = document.createElement('canvas').getContext('webgl2') ?? document.createElement('canvas').getContext('webgl');
  if (!gl) return '';
  const i = gl.getExtension('WEBGL_debug_renderer_info');
  const n = i ? gl.getParameter(i.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER);
  gl.getExtension('WEBGL_lose_context')?.loseContext();
  return n;
}

// ── El material horneado: color × lo impreso × la luz de Blender, más el brillo de estudio ──
const VERT = /* glsl */`
varying vec2 vUv; varying vec2 vUv1; varying vec3 vN; varying vec3 vP;
void main() {
  vUv = uv; vUv1 = uv1;
  vec4 p = modelMatrix * vec4(position, 1.0);
  vP = p.xyz; vN = normalize(mat3(modelMatrix) * normal);
  gl_Position = projectionMatrix * viewMatrix * p;
}`;
const FRAG = /* glsl */`
uniform vec3 color; uniform sampler2D mapa; uniform sampler2D luz; uniform sampler2D luz2;
uniform float mezcla; uniform float escala; uniform float brillo; uniform float exposicion;
varying vec2 vUv; varying vec2 vUv1; varying vec3 vN; varying vec3 vP;
void main() {
  vec3 alb = color;
  #ifdef CON_MAPA
    alb *= texture2D(mapa, vUv).rgb;
  #endif
  vec3 L = texture2D(luz, vUv1).rgb;
  #ifdef CON_LUZ2
    L = mix(L, texture2D(luz2, vUv1).rgb, mezcla);
  #endif
  vec3 c = alb * L * escala;
  #ifdef CON_BRILLO
    vec3 N = normalize(vN); if (!gl_FrontFacing) N = -N;
    vec3 V = normalize(cameraPosition - vP); vec3 r = reflect(-V, N);
    float fr = pow(1.0 - max(dot(N, V), 0.0), 5.0);
    #ifdef DURO
      // brillo de tebeo: una mancha blanca con borde neto y un filo claro
      float s = step(0.955, dot(r, normalize(vec3(-0.5, 0.62, 0.6))));
      c = mix(c, vec3(1.0), brillo * s * 0.85) + brillo * 0.25 * step(0.55, fr);
    #else
      // dos ventanas de estudio fijas en el mundo y el techo claro: el brillo se mueve al girar la caja
      float s1 = smoothstep(0.86, 0.975, dot(r, normalize(vec3(-0.55, 0.62, 0.56))));
      float s2 = smoothstep(0.93, 0.985, dot(r, normalize(vec3(0.7, 0.25, 0.67))));
      float techo = smoothstep(-0.1, 0.9, r.y);
      c += brillo * (s1 * 0.9 + s2 * 0.3 + (0.04 + 0.96 * fr) * (0.08 + 0.42 * techo));
    #endif
  #endif
  gl_FragColor = vec4(c * exposicion, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`;

// Contorno de tebeo (E2): la misma pieza por detrás, hinchada unos píxeles en pantalla
const CONTORNO_V = /* glsl */`
uniform float grosor; uniform vec2 res;
void main() {
  vec4 p = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  vec2 d = (projectionMatrix * vec4(normalMatrix * normal, 0.0)).xy;
  p.xy += normalize(d + 1e-6) * grosor * 2.0 / res * p.w;
  gl_Position = p;
}`;
const CONTORNO_F = /* glsl */`
uniform vec3 tinta;
void main() { gl_FragColor = vec4(tinta, 1.0);
  #include <colorspace_fragment>
}`;

export async function arrancar(cfg) {
  const DIBUJA = quienDibuja();
  const LIGERO = /swiftshader|llvmpipe|software/i.test(DIBUJA) || new URLSearchParams(location.search).has('ligero');
  document.documentElement.classList.toggle('ligero', LIGERO);
  const plato = document.getElementById('plato');
  const r = new THREE.WebGLRenderer({ antialias: !LIGERO, powerPreference: 'high-performance' });
  // Sin gráfica lo que cuesta es cada píxel (la pared llena la pantalla): en el modo ligero se dibuja con un tope
  // de unos 380.000 píxeles y el navegador lo amplía; en un móvil eso es 0,75, en escritorio algo menos
  const DPR = LIGERO ? Math.min(0.75, Math.sqrt(380000 / (innerWidth * innerHeight))) : Math.min(devicePixelRatio || 1, 2);
  r.setPixelRatio(DPR);
  r.outputColorSpace = THREE.SRGBColorSpace;
  r.toneMapping = THREE.NeutralToneMapping;
  plato.prepend(r.domElement);
  r.domElement.setAttribute('role', 'img'); r.domElement.setAttribute('aria-label', cfg.etiqueta);
  const escena = new THREE.Scene();
  escena.background = new THREE.Color(cfg.fondo);
  const camara = new THREE.PerspectiveCamera(30, 1, 0.1, 60);

  // las texturas de luz y su escala (luz.json la escribe herramientas/luces.py)
  const base = cfg.luz;
  const [gltf, escalas] = await Promise.all([
    new Promise((ok, mal) => new GLTFLoader().load(`${base}caja.glb`, ok, undefined, mal)),
    fetch(`${base}luz.json`).then((x) => x.json()),
  ]);
  const cargador = new THREE.TextureLoader();
  const luces = Object.fromEntries(await Promise.all(Object.keys(escalas).map(async (n) => {
    const t = await cargador.loadAsync(`${base}${n}.webp`);
    t.colorSpace = THREE.SRGBColorSpace; t.flipY = false; t.channel = 1; return [n, t];
  })));
  const luzDe = (n) => luces[n];

  // ── Lo impreso: un canvas por cara ──
  const arte = cfg.arte;
  await arte.cargar?.();
  const lienzos = {}, texturas = {};
  function textura(id, [w, h]) {
    const c = document.createElement('canvas'); c.width = w; c.height = h; lienzos[id] = c;
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.flipY = false;
    t.anisotropy = LIGERO ? 1 : 8; texturas[id] = t; return t;
  }
  const estado = { ...cfg.estado };
  const YO = BALDA.findIndex((p) => p.yo);
  textura('portada', arte.TAM.portada); textura('dorso', arte.TAM.dorso); textura('disco', arte.TAM.disco); textura('manual', arte.TAM.manual);
  for (const i of ESPINAS) { textura(`lomo_${i}`, arte.TAM.lomo); if (i !== YO) arte.lomo(lienzos[`lomo_${i}`], i); }
  for (const i of EXPUESTAS) { textura(`expuesta_${i}`, arte.TAM.portada); arte.expuesta(lienzos[`expuesta_${i}`], i); }

  const mats = [];
  function horneado({ color = '#ffffff', mapa = null, luz, luz2 = null, brillo = 0 }) {
    const m = new THREE.ShaderMaterial({
      vertexShader: VERT, fragmentShader: FRAG,
      defines: { USE_UV1: '', ...(mapa && { CON_MAPA: '' }), ...(luz2 && { CON_LUZ2: '' }), ...(brillo && { CON_BRILLO: '' }), ...(cfg.duro && brillo && { DURO: '' }) },
      uniforms: {
        color: { value: new THREE.Color(color) }, mapa: { value: mapa }, luz: { value: luzDe(luz) }, luz2: { value: luz2 && luzDe(luz2) },
        mezcla: { value: 0 }, escala: { value: escalas[luz] }, brillo: { value: brillo }, exposicion: { value: cfg.exposicion },
      },
    });
    mats.push(m); return m;
  }
  const contorno = cfg.contorno && new THREE.ShaderMaterial({
    vertexShader: CONTORNO_V, fragmentShader: CONTORNO_F, side: THREE.BackSide,
    uniforms: { grosor: { value: cfg.contorno.grosor * DPR }, res: { value: new THREE.Vector2(1, 1) }, tinta: { value: new THREE.Color(cfg.contorno.tinta) } },
  });

  const nodo = {}, cuerpo = [], conLuz2 = [];
  const C = cfg.colores;
  const todas = [];
  gltf.scene.traverse((o) => { nodo[o.name] = o; todas.push(o); });
  todas.forEach((o) => {
    if (!o.isMesh) return;
    const n = o.name;
    let m;
    const v = n.match(/^vecino_(\d)_(cuerpo|lomo)$/), e = n.match(/^expuesta_(\d)_(cuerpo|portada)$/);
    if (v) m = v[2] === 'lomo' ? horneado({ mapa: texturas[`lomo_${v[1]}`], luz: 'vecinos', brillo: C.brilloImpreso })
      : horneado({ color: C.vecino(+v[1]), luz: 'vecinos', brillo: C.brilloPlastico });
    else if (e) m = e[2] === 'portada' ? horneado({ mapa: texturas[`expuesta_${e[1]}`], luz: 'vecinos', brillo: C.brilloImpreso })
      : horneado({ color: C.vecino(+e[1]), luz: 'vecinos', brillo: C.brilloPlastico });
    else if (['balda', 'pared', 'suelo_sombra'].includes(n)) { m = horneado({ color: C[n], luz: `${n}_sin`, luz2: `${n}_con` }); conLuz2.push(m); }
    else if (n === 'lomo') m = horneado({ mapa: texturas[`lomo_${YO}`], luz: 'caja', brillo: C.brilloImpreso });
    else if (n === 'portada' || n === 'dorso') m = horneado({ mapa: texturas[n], luz: 'caja', brillo: C.brilloImpreso });
    else if (n === 'disco_cara') { m = horneado({ mapa: texturas.disco, luz: 'caja', brillo: C.brilloDisco }); m.side = THREE.DoubleSide; }
    else if (n === 'manual_portada') m = horneado({ mapa: texturas.manual, luz: 'caja', brillo: C.brilloPapel });
    else if (n === 'manual_hojas') m = horneado({ color: C.papel, luz: 'caja', brillo: C.brilloPapel });
    else if (n === 'disco_base') m = horneado({ color: C.plata, luz: 'caja', brillo: C.brilloDisco * 1.6 });
    else { m = horneado({ color: C.plastico(estado), luz: 'caja', brillo: C.brilloPlastico }); cuerpo.push(m); }   // cuerpo, tapa, pestañas y eje
    o.material = m;
    if (contorno && cfg.contorno.piezas.test(n)) { const h = new THREE.Mesh(o.geometry, contorno); h.name = `${n}_contorno`; o.add(h); }
  });
  escena.add(gltf.scene);
  const { caja, tapa, disco, manual } = nodo;

  function pintarImpreso() {
    arte.portada(lienzos.portada, estado); arte.dorso(lienzos.dorso, estado);
    arte.disco(lienzos.disco, estado); arte.manual(lienzos.manual, estado);
    arte.lomo(lienzos[`lomo_${YO}`], YO, estado);
    for (const id of ['portada', 'dorso', 'disco', 'manual', `lomo_${YO}`]) texturas[id].needsUpdate = true;
    for (const m of cuerpo) m.uniforms.color.value.set(C.plastico(estado));
  }
  pintarImpreso();

  // ── Poner una pose: (x, y, z) de Blender → (x, z, -y) en glTF ──
  const R = THREE.MathUtils.degToRad, DIST = 7.6;
  const XB = POSES.balda.x, ZB = POSES.balda.z;
  // Mientras la caja está metida en la balda solo puede entrar y salir en línea recta: el giro, el paso al centro y
  // la apertura esperan a que asome lo bastante (si no, atraviesa los lomos de al lado, también al volver a mitad)
  const suave = (a, b, x) => { const t = THREE.MathUtils.clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
  function pintar(v) {
    const fuera = suave(0.12, 0.85, -v.y);
    const de = 90 + 360 * Math.round((v.rz - 90) / 360);   // el giro «de canto» más cercano, para no dar vueltas de más
    const rz = de + (v.rz - de) * fuera, x = XB + (v.x - XB) * fuera;
    caja.position.set(x, v.z, -v.y);
    caja.rotation.set(R(v.rx * fuera), R(rz), 0, 'YXZ');
    tapa.rotation.set(0, R(v.tapa * fuera), 0);
    disco.position.z = -0.019 + v.disco * fuera * 0.32; disco.rotation.set(R(v.disco * fuera * 9), R(-v.disco * fuera * 9), 0, 'YXZ');
    manual.position.z = -(0.02 + v.manual * fuera * 0.06);
    // la sombra de contacto de la caja en la balda se va según se aleja
    const lejos = Math.hypot(x - XB, v.y, v.z - ZB);
    const enBalda = THREE.MathUtils.clamp(1 - lejos / 0.7, 0, 1);
    for (const m of conLuz2) m.uniforms.mezcla.value = enBalda;
    const W = innerWidth, H = innerHeight, movil = W < 760, util = H - (movil ? 190 : 150);
    const k = Math.max(v.cam.alto / util, (movil ? v.cam.anchoMovil : v.cam.ancho) / (W - 32));
    const sube = (movil ? 40 : 20) * k;
    camara.fov = THREE.MathUtils.radToDeg(2 * Math.atan((k * H) / 2 / DIST));
    camara.position.set(v.cam.x, v.cam.z - sube + 0.9, DIST);
    camara.lookAt(v.cam.x, v.cam.z - sube, 0);
    camara.updateProjectionMatrix();
    r.render(escena, camara);
  }
  let pendiente = false;
  function pedirDibujo() { if (pendiente) return; pendiente = true; requestAnimationFrame(() => { pendiente = false; pintar(muelles.v); }); }
  function medir() {
    r.setSize(innerWidth, innerHeight); camara.aspect = innerWidth / innerHeight;
    if (contorno) contorno.uniforms.res.value.set(innerWidth * DPR, innerHeight * DPR);
    pintar(muelles.v);
  }

  const muelles = new Muelles(POSES.balda, { rigidez: 70, amort: 15 });
  muelles.alMover = pintar;
  let paso = 'balda';
  const ctl = montarPlato({
    irA(id, { inmediato }) {
      paso = id;
      const obj = structuredClone(POSES[id]); obj.rz = giroCercano(muelles.v.rz, obj.rz);
      muelles.ir(obj, inmediato);
    },
    alCambiarDetalle(campo, valor) { estado[campo] = valor; pintarImpreso(); pedirDibujo(); },
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
  requestAnimationFrame(() => document.querySelector('.cargando-velo')?.classList.add('fuera'));
  window.__render = `${DIBUJA}${LIGERO ? ' · modo ligero' : ''}`;
  return { RM };
}
