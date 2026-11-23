// Kit E1: el motor común. Carga una escena de Blender con su luz horneada (herramientas/kit.py y luces.py), le
// pone a cada pieza su material (color × lo impreso en un canvas × la luz, más un brillo de estudio que se mueve
// al girar) y la dibuja solo cuando algo cambia. No hay luces ni sombras en tiempo real: por eso va igual con la
// gráfica que sin ella. Sin gráfica (o con ?ligero) se dibuja con menos píxeles y sin suavizado.
//
// Coordenadas: las de Blender (x, y, z; la cámara mira desde -Y) se pasan a three.js como (x, z, -y) con `b3`.
import * as THREE from 'three';
import { GLTFLoader } from '../vendor/three/GLTFLoader.js';

export { THREE };
export const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
export const b3 = (x, y, z) => new THREE.Vector3(x, z, -y);

function quienDibuja() {
  const c = document.createElement('canvas');
  const gl = c.getContext('webgl2') ?? c.getContext('webgl');
  if (!gl) return '';
  const i = gl.getExtension('WEBGL_debug_renderer_info');
  const n = i ? gl.getParameter(i.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER);
  gl.getExtension('WEBGL_lose_context')?.loseContext();
  return n;
}

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
uniform float mezcla; uniform float escala; uniform float escala2; uniform float brillo; uniform float exposicion;
uniform float atenua; uniform vec3 emite; uniform float opacidad;
varying vec2 vUv; varying vec2 vUv1; varying vec3 vN; varying vec3 vP;
void main() {
  vec3 alb = color;
  #ifdef CON_MAPA
    vec4 im = texture2D(mapa, vUv); alb *= im.rgb;
  #endif
  #ifdef CON_LUZ
    vec3 L = texture2D(luz, vUv1).rgb * escala;
    #ifdef CON_LUZ2
      L = mix(L, texture2D(luz2, vUv1).rgb * escala2, mezcla);
    #endif
  #else
    vec3 L = vec3(1.0);
  #endif
  vec3 c = alb * L * atenua + emite;
  #ifdef CON_BRILLO
    vec3 N = normalize(vN); if (!gl_FrontFacing) N = -N;
    vec3 V = normalize(cameraPosition - vP); vec3 r = reflect(-V, N);
    float fr = pow(1.0 - max(dot(N, V), 0.0), 5.0);
    // dos ventanas de estudio fijas en el mundo y el techo claro: el brillo se mueve al girar la pieza
    float s1 = smoothstep(0.86, 0.975, dot(r, normalize(vec3(-0.55, 0.62, 0.56))));
    float s2 = smoothstep(0.93, 0.985, dot(r, normalize(vec3(0.7, 0.25, 0.67))));
    float techo = smoothstep(-0.1, 0.9, r.y);
    c += brillo * atenua * (s1 * 0.9 + s2 * 0.3 + (0.04 + 0.96 * fr) * (0.08 + 0.42 * techo));
  #endif
  gl_FragColor = vec4(c * exposicion, opacidad);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`;

// Pone en marcha el lienzo, carga la escena y su luz, y devuelve lo necesario para que cada maqueta haga lo suyo.
//   cfg.plato     el elemento donde va el lienzo
//   cfg.luz       carpeta con escena.glb, luz.json y las texturas
//   cfg.material  (nombre de la pieza, ayudas) → opciones del material, o null para dejarla fuera
//   cfg.fondo, cfg.exposicion, cfg.etiqueta
export async function montarEscena(cfg) {
  const DIBUJA = quienDibuja();
  const LIGERO = /swiftshader|llvmpipe|software/i.test(DIBUJA) || new URLSearchParams(location.search).has('ligero');
  document.documentElement.classList.toggle('ligero', LIGERO);
  const r = new THREE.WebGLRenderer({ antialias: !LIGERO, powerPreference: 'high-performance' });
  // Sin gráfica cuesta cada píxel: un tope de unos 380.000 que el navegador amplía
  // y mientras algo se mueve, la mitad (unos 190.000): en movimiento no se nota y la cuenta de fotogramas sí
  let moviendo = false;
  const dpr = () => (LIGERO ? Math.min(0.75, Math.sqrt((moviendo ? Math.min(160000, 0.34 * innerWidth * innerHeight) : 380000) / (innerWidth * innerHeight))) : Math.min(devicePixelRatio || 1, 2));
  r.setPixelRatio(dpr());
  r.outputColorSpace = THREE.SRGBColorSpace;
  r.toneMapping = THREE.NeutralToneMapping;
  cfg.plato.prepend(r.domElement);
  r.domElement.setAttribute('role', 'img'); r.domElement.setAttribute('aria-label', cfg.etiqueta);
  const escena = new THREE.Scene();
  escena.background = new THREE.Color(cfg.fondo);
  const camara = new THREE.PerspectiveCamera(30, 1, 0.1, 120);

  const base = cfg.luz;
  const [gltf, escalas, datos] = await Promise.all([
    new GLTFLoader().loadAsync(`${base}escena.glb`),
    fetch(`${base}luz.json`).then((x) => x.json()),
    fetch(`${base}escena.json`).then((x) => x.json()).catch(() => ({})),
  ]);
  const cargador = new THREE.TextureLoader();
  const luces = {};
  async function luz(n) {
    luces[n] ??= cargador.loadAsync(`${base}${n}.webp`).then((t) => {
      t.colorSpace = THREE.SRGBColorSpace; t.flipY = false; t.channel = 1; t.anisotropy = LIGERO ? 1 : 4; return t;
    });
    return luces[n];
  }

  // Lo impreso: un canvas por cara, que la maqueta pinta cuando quiere
  const lienzos = {}, texturas = {};
  function textura(id, [w, h], { transparente = false } = {}) {
    if (texturas[id]) return texturas[id];
    const c = document.createElement('canvas'); c.width = w; c.height = h; lienzos[id] = c;
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.flipY = false;
    t.anisotropy = LIGERO ? 1 : 8; t.premultiplyAlpha = transparente; texturas[id] = t; return t;
  }

  const mats = [];
  async function horneado({ color = '#ffffff', mapa = null, luz: l = null, luz2 = null, brillo = 0, emite = null, doble = false, transparente = false }) {
    const [tl, tl2] = await Promise.all([l && luz(l), luz2 && luz(luz2)]);
    const m = new THREE.ShaderMaterial({
      vertexShader: VERT, fragmentShader: FRAG, transparent: transparente, side: doble ? THREE.DoubleSide : THREE.FrontSide,
      defines: { USE_UV1: '', ...(mapa && { CON_MAPA: '' }), ...(l && { CON_LUZ: '' }), ...(luz2 && { CON_LUZ2: '' }), ...(brillo && { CON_BRILLO: '' }) },
      uniforms: {
        color: { value: new THREE.Color(color) }, mapa: { value: mapa }, luz: { value: tl }, luz2: { value: tl2 },
        mezcla: { value: 0 }, escala: { value: escalas[l] ?? 1 }, escala2: { value: escalas[luz2] ?? 1 }, brillo: { value: brillo },
        exposicion: { value: cfg.exposicion ?? 1 }, atenua: { value: 1 }, emite: { value: new THREE.Color(emite ?? '#000000') }, opacidad: { value: 1 },
      },
    });
    mats.push(m); return m;
  }
  // cambiar la segunda luz de un material (p. ej. el hueco sin la caja que se ha sacado)
  async function ponerLuz2(m, n) { m.uniforms.luz2.value = await luz(n); m.uniforms.escala2.value = escalas[n]; }

  const nodo = {}, todas = [], fuera = new Set();
  gltf.scene.traverse((o) => { nodo[o.name] = o; todas.push(o); });
  const ayudas = { textura, lienzos, texturas, datos };
  await Promise.all(todas.filter((o) => o.isMesh).map(async (o) => {
    const op = cfg.material(o.name, ayudas);
    if (!op) { o.visible = false; fuera.add(o); return; }
    o.material = await horneado(op);
  }));
  escena.add(gltf.scene);

  // ── Cámara: mira un punto (en coordenadas de Blender) desde `dist`, con `inclina` grados hacia abajo, y ajusta el
  // campo para que quepan `alto` × `ancho` unidades en el hueco libre de la pantalla. `px`, `py` (0–1) dicen dónde
  // de la pantalla cae ese punto: así se deja sitio a la cabecera sin mover la escena.
  const v = new THREE.Vector3();
  //   Si la cámara trae `zona` (x, y, ancho y alto en píxeles: zx, zy, zw, zh), esa es la parte de la pantalla donde
  //   tiene que caber lo encuadrado, centrado en ella; así cada tamaño de pantalla reserva el sitio de su texto.
  function encuadrar(c, { util = [innerWidth, innerHeight] } = {}) {
    const W = innerWidth, H = innerHeight;
    if (c.zw) { util = [c.zw, c.zh]; c = { ...c, px: (c.zx + c.zw / 2) / W, py: (c.zy + c.zh / 2) / H }; }
    const k = Math.max(c.alto / util[1], c.ancho / util[0]);
    camara.fov = THREE.MathUtils.radToDeg(2 * Math.atan((k * H) / 2 / c.dist));
    const inc = THREE.MathUtils.degToRad(c.inclina ?? 0), gir = THREE.MathUtils.degToRad(c.gira ?? 0);
    const obj = b3(c.x, c.y, c.z);
    v.set(Math.sin(gir) * Math.cos(inc), Math.sin(inc), Math.cos(gir) * Math.cos(inc)).multiplyScalar(c.dist);
    camara.position.copy(obj).add(v);
    camara.lookAt(obj);
    camara.setViewOffset(W, H, W * (0.5 - (c.px ?? 0.5)), H * (0.5 - (c.py ?? 0.5)), W, H);
    camara.updateProjectionMatrix();
    // las matrices de la cámara, al día ya: lo que se pega encima del 3D (aPantalla) se calcula en este mismo fotograma,
    // antes del render; si no, iba un fotograma tarde y, tras un salto sin animar (movimiento reducido), se quedaba mal
    camara.updateMatrixWorld();
    return k;
  }

  let pendiente = false, alDibujar = null;
  function dibujar() { alDibujar?.(); r.render(escena, camara); }
  function pedirDibujo() { if (pendiente) return; pendiente = true; requestAnimationFrame(() => { pendiente = false; dibujar(); }); }
  function medir() { r.setPixelRatio(dpr()); r.setSize(innerWidth, innerHeight); camara.aspect = innerWidth / innerHeight; }
  // la maqueta avisa cuando empieza y termina un movimiento; solo cambia algo en el modo ligero
  function enMarcha(si) {
    if (!LIGERO || si === moviendo) return;
    moviendo = si; r.setPixelRatio(dpr()); r.setSize(innerWidth, innerHeight);
    if (!si) dibujar();
  }
  medir();

  // de un punto de la escena (Blender) a píxeles de la pantalla
  function aPantalla(x, y, z) {
    const p = b3(x, y, z).project(camara);
    return [(p.x + 1) / 2 * innerWidth, (1 - p.y) / 2 * innerHeight];
  }
  function precompilar() {
    const escondidas = [];
    escena.traverse((o) => { if (!o.visible && !fuera.has(o)) { o.visible = true; escondidas.push(o); } });
    try {
      r.compile(escena, camara);
      escena.traverse((o) => {
        const u = o.material?.uniforms; if (!u) return;
        for (const k in u) if (u[k].value?.isTexture && u[k].value.image) r.initTexture(u[k].value);
      });
    } finally { for (const o of escondidas) o.visible = false; }
  }
  window.__render = `${DIBUJA}${LIGERO ? ' · modo ligero' : ''}`;
  return {
    THREE, r, escena, camara, nodo, mats, lienzos, texturas, textura, datos, LIGERO, ponerLuz2,
    encuadrar, dibujar, pedirDibujo, medir, aPantalla, enMarcha,
    set alDibujar(f) { alDibujar = f; },
    // al quitar el velo de carga: antes, se preparan todos los programas de la gráfica y se suben todas las texturas,
    // también las de lo que aún está escondido (la caja, el disco, la tarjeta…). Sin gráfica, compilar un material la
    // primera vez que aparece paraba la página entre 300 y 600 ms en mitad de un movimiento
    listo() { precompilar(); requestAnimationFrame(() => document.querySelector('.cargando-velo')?.classList.add('fuera')); },
  };
}
