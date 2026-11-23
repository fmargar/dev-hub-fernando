// El panel de paletas: cada letra es una paleta de verdad que cae sobre su bisagra. No está en Blender: son tres
// mallas instanciadas (media paleta de arriba, media de abajo y la hoja que cae) con las letras en un atlas de canvas.
// La luz es la horneada en un plano a la altura de las paletas (`tablero_luz`): se lee por la posición de cada píxel.
//
// Cambiar un texto no salta: cada paleta pasa por las letras que hay antes de la nueva en el tambor, una cada
// ~70 ms, y empiezan escalonadas de izquierda a derecha. Con movimiento reducido, cambian de golpe.
import { THREE, b3 } from '../../../kit-e1/js/motor.js';

export const TAMBOR = ' ABCDEFGHIJKLMNÑOPQRSTUVWXYZÁÉÍÓÚÜ0123456789:.-/·→';
const COLS_ATLAS = 8, TW = 96, TH = 152;
const indice = (ch) => Math.max(0, TAMBOR.indexOf(ch));

function atlas() {
  const filas = Math.ceil(TAMBOR.length / COLS_ATLAS);
  const c = document.createElement('canvas'); c.width = COLS_ATLAS * TW; c.height = filas * TH;
  const x = c.getContext('2d');
  x.textAlign = 'center'; x.textBaseline = 'middle';
  [...TAMBOR].forEach((ch, i) => {
    const px = (i % COLS_ATLAS) * TW, py = Math.floor(i / COLS_ATLAS) * TH;
    // la paleta: grafito con la mitad de arriba un punto más clara (le da la luz de frente) y cantos redondeados
    const g = x.createLinearGradient(0, py, 0, py + TH);
    g.addColorStop(0, '#2a2a2d'); g.addColorStop(0.49, '#232326'); g.addColorStop(0.51, '#1b1b1d'); g.addColorStop(1, '#151517');
    x.fillStyle = g; x.beginPath(); x.roundRect(px + 2, py + 2, TW - 4, TH - 4, 7); x.fill();
    x.fillStyle = '#efe9db'; x.font = `500 ${ch === '→' || ch === '·' ? 92 : 112}px 'DM Mono'`;
    x.fillText(ch, px + TW / 2, py + TH / 2 + 6);
  });
  return c;
}

const VERT = /* glsl */`
attribute float parte;
attribute float aViejo; attribute float aNuevo; attribute float aT; attribute float aTinta;
uniform vec2 celda;
varying vec2 vLocal; varying float vViejo; varying float vNuevo; varying float vTinta; varying float vSombra; varying float vParte; varying vec3 vP;
void main() {
  vec3 p = position;
  vSombra = 1.0;
  if (parte > 1.5) {
    if (aT <= 0.0) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); return; }   // sin caer, la hoja no se dibuja
    float a = aT * 3.14159265;
    p = vec3(p.x, p.y * cos(a), p.y * sin(a) + 0.004);
    vSombra = 0.62 + 0.38 * abs(cos(a));
  }
  vLocal = vec2(position.x / celda.x + 0.5, position.y / celda.y + 0.5);
  vViejo = aViejo; vNuevo = aNuevo; vTinta = aTinta; vParte = parte;
  vec4 w = modelMatrix * instanceMatrix * vec4(p, 1.0);
  vP = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}`;
const FRAG = /* glsl */`
uniform sampler2D atlas; uniform sampler2D luz; uniform float escala; uniform vec4 rect; uniform float exposicion; uniform vec2 rejilla;
varying vec2 vLocal; varying float vViejo; varying float vNuevo; varying float vTinta; varying float vSombra; varying float vParte; varying vec3 vP;
vec3 letra(float i, vec2 uv) {
  // con flotantes, mod(16., 8.) puede dar 7.999…: se redondea el índice antes de partirlo en fila y columna
  float k = floor(i + 0.5), f = floor((k + 0.5) / rejilla.x), c = k - f * rejilla.x;
  return texture2D(atlas, vec2((c + uv.x) / rejilla.x, (f + 1.0 - uv.y) / rejilla.y)).rgb;
}
void main() {
  vec2 uv = vLocal; float g;
  if (vParte < 0.5) g = vNuevo;                       // arriba: la letra nueva (la hoja que cae la va destapando)
  else if (vParte < 1.5) g = vViejo;                  // abajo: la vieja, hasta que la hoja cae encima
  else if (gl_FrontFacing) g = vViejo;                // la hoja por delante: la mitad de arriba de la vieja
  else { g = vNuevo; uv.y = 1.0 - uv.y; }             // y por detrás, la mitad de abajo de la nueva
  vec3 c = letra(g, uv);
  float l = dot(c, vec3(0.299, 0.587, 0.114));
  c *= mix(vec3(1.0), vec3(1.0, 0.66, 0.12) * 1.05, vTinta * smoothstep(0.15, 0.5, l));
  vec2 uvL = vec2((vP.x - rect.x) / (rect.z - rect.x), 1.0 - (vP.y - rect.y) / (rect.w - rect.y));
  vec3 L = texture2D(luz, uvL).rgb * escala;
  gl_FragColor = vec4(c * L * vSombra * exposicion, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`;

export class Tablero {
  // d: escena.json → tablero; luz: textura y escala del plano horneado
  constructor(S, d, { luz, escala, RM, alCambiar }) {
    this.S = S; this.d = d; this.RM = RM; this.alCambiar = alCambiar;
    this.cols = d.cols; this.filas = d.filas; const n = this.cols * this.filas; this.n = n;
    const [cw, ch] = d.celda, gap = 0.008;
    // una paleta: tres cuadrados (arriba, abajo, hoja) en coordenadas propias, con la bisagra en y = 0
    const pos = [], parte = [], idx = [];
    const quad = (y0, y1, k) => {
      const b = pos.length / 3;
      pos.push(-cw / 2, y0, 0, cw / 2, y0, 0, cw / 2, y1, 0, -cw / 2, y1, 0); parte.push(k, k, k, k);
      idx.push(b, b + 1, b + 2, b, b + 2, b + 3);
    };
    quad(gap, ch / 2, 0); quad(-ch / 2, -gap, 1); quad(gap, ch / 2, 2);
    const g = new THREE.InstancedBufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('parte', new THREE.Float32BufferAttribute(parte, 1));
    g.setIndex(idx);
    const attr = (nombre) => { const a = new THREE.InstancedBufferAttribute(new Float32Array(n), 1); a.setUsage(THREE.DynamicDrawUsage); g.setAttribute(nombre, a); return a; };
    this.aViejo = attr('aViejo'); this.aNuevo = attr('aNuevo'); this.aT = attr('aT'); this.aTinta = attr('aTinta');
    const cv = atlas(), tex = new THREE.CanvasTexture(cv);
    tex.colorSpace = THREE.SRGBColorSpace; tex.flipY = false; tex.anisotropy = S.LIGERO ? 1 : 8; tex.generateMipmaps = true;
    const L = d.luz;
    this.mat = new THREE.ShaderMaterial({
      vertexShader: VERT, fragmentShader: FRAG, side: THREE.DoubleSide,
      uniforms: {
        atlas: { value: tex }, luz: { value: luz }, escala: { value: escala }, celda: { value: new THREE.Vector2(cw, ch) },
        rect: { value: new THREE.Vector4(L.x0, L.z0, L.x1, L.z1) }, exposicion: { value: 1 }, rejilla: { value: new THREE.Vector2(COLS_ATLAS, cv.height / TH) },
      },
    });
    this.malla = new THREE.InstancedMesh(g, this.mat, n);
    this.malla.frustumCulled = false;
    const m = new THREE.Matrix4();
    for (let r = 0; r < this.filas; r++) {
      for (let c = 0; c < this.cols; c++) {
        m.makeTranslation(b3(d.x0 + (c + 0.5) * d.paso_x, d.y_paletas - 0.002, d.z_filas - (r + 0.5) * d.paso_z));
        this.malla.setMatrixAt(r * this.cols + c, m);
      }
    }
    S.escena.add(this.malla);
    this.actual = new Array(n).fill(' '); this.meta = new Array(n).fill(' ');
    this.activas = new Map();     // celda → { cola: [índices], ini, dur }
    this.corriendo = false;
  }

  // escribe las filas (cada una, un texto de `cols` letras); `tintas` marca qué filas van en ámbar
  escribir(lineas, { inmediato = false, tintas = null } = {}) {
    const ahora = performance.now();
    for (let r = 0; r < this.filas; r++) {
      const txt = (lineas[r] ?? '').toUpperCase().padEnd(this.cols).slice(0, this.cols);
      for (let c = 0; c < this.cols; c++) {
        const k = r * this.cols + c, ch = TAMBOR.includes(txt[c]) ? txt[c] : ' ';
        if (this.meta[k] === ch) continue;
        this.meta[k] = ch;
        if (inmediato || this.RM) { this.fijar(k, ch); continue; }
        // las letras que hay antes de la nueva en el tambor: entre 3 y 7, como un panel que gira hasta su letra
        const ya = this.activas.get(k), desde = ya ? this.aNuevo.array[k] : indice(this.actual[k]), hasta = indice(ch);
        const dist = (hasta - desde + TAMBOR.length) % TAMBOR.length;
        const pasos = Math.min(dist, 3 + Math.floor(Math.random() * 5));
        const cola = []; for (let i = pasos - 1; i >= 0; i--) cola.push((hasta - i + TAMBOR.length) % TAMBOR.length);
        if (!cola.length) { this.fijar(k, ch); continue; }
        // si ya estaba cayendo, sigue desde la letra que enseña ahora
        this.activas.set(k, { de: desde, cola, ini: ahora + (ya ? 0 : c * 16 + r * 34 + Math.random() * 70), dur: 62 + Math.random() * 18 });
      }
      if (tintas) this.tinta(r, tintas[r] ? 1 : 0);
    }
    this.aViejo.needsUpdate = this.aNuevo.needsUpdate = this.aT.needsUpdate = true;
    if (this.activas.size) this.arrancar(); else this.S.pedirDibujo();
  }
  tinta(r, v) { for (let c = 0; c < this.cols; c++) this.aTinta.array[r * this.cols + c] = v; this.aTinta.needsUpdate = true; }
  fijar(k, ch) {
    this.actual[k] = ch; this.activas.delete(k);
    this.aViejo.array[k] = this.aNuevo.array[k] = indice(ch); this.aT.array[k] = 0;
  }
  arrancar() {
    if (this.corriendo) return;
    this.corriendo = true; this.alCambiar?.(true);
    const paso = () => { if (!this.corriendo) return; this.S.pedirDibujo(); requestAnimationFrame(paso); };
    requestAnimationFrame(paso);
  }
  // en cada fotograma (desde el dibujo): avanza las paletas que están cayendo
  actualizar(ahora = performance.now()) {
    if (!this.activas.size) return;
    for (const [k, a] of this.activas) {
      const t = (ahora - a.ini) / a.dur;
      if (t < 0) continue;
      const i = Math.min(Math.floor(t), a.cola.length), f = t - Math.floor(t);
      if (i >= a.cola.length) { this.fijar(k, TAMBOR[a.cola.at(-1)]); continue; }
      this.aViejo.array[k] = i === 0 ? a.de : a.cola[i - 1];
      this.aNuevo.array[k] = a.cola[i];
      this.aT.array[k] = Math.max(0.001, f ** 1.5);         // cae acelerando, como con su peso
    }
    this.aViejo.needsUpdate = this.aNuevo.needsUpdate = this.aT.needsUpdate = true;
    if (!this.activas.size && this.corriendo) { this.corriendo = false; this.alCambiar?.(false); this.S.pedirDibujo(); }
  }
  get quieto() { return !this.activas.size; }
  // dónde cae en la pantalla una fila (para el botón que va encima)
  rectFila(r, c0 = 0, c1 = this.cols) {
    const d = this.d, y = d.y_paletas;
    const [x1, y1] = this.S.aPantalla(d.x0 + c0 * d.paso_x, y, d.z_filas - r * d.paso_z);
    const [x2, y2] = this.S.aPantalla(d.x0 + c1 * d.paso_x, y, d.z_filas - (r + 1) * d.paso_z);
    return [x1, y1, x2 - x1, y2 - y1];
  }
}
