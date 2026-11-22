// El recorrido como poses: dónde está la caja, cómo gira, cuánto se abre y qué mira la cámara.
// Las mismas cifras que la toma de Blender (herramientas/caja.py), en sus unidades (1 = 10 cm):
// X a la derecha, Y hacia el fondo (la cámara mira desde -Y) y Z hacia arriba. Las técnicas B, C y D
// las usan tal cual; la A ya las lleva dentro de sus fotogramas.

export const CAJA = { W: 1.35, H: 1.9, D: 0.15 };
export const PASO_BALDA = CAJA.D + 0.012;
export const X_BALDA = (2 - 4) * PASO_BALDA;     // Adivinadle es el tercero de nueve

// x, y, z: centro de la caja · rx, rz: giros en grados · tapa: 0 cerrada, -180 abierta del todo
// disco y manual: cuánto salen de su sitio (0 a 1) · cam: punto que se mira y cuánto tiene que caber (alto y ancho,
// en unidades del plano de la balda)
export const POSES = {
  balda: { x: X_BALDA, y: 0, z: CAJA.H / 2, rx: 0, rz: 90, tapa: 0, disco: 0, manual: 0, cam: { x: X_BALDA, z: 1.0, alto: 2.7, ancho: 2.6 } },
  portada: { x: 0, y: -2.3, z: 1.42, rx: 0, rz: 0, tapa: 0, disco: 0, manual: 0, cam: { x: 0, z: 1.38, alto: 3.9, ancho: 2.6 } },
  dorso: { x: 0, y: -2.3, z: 1.42, rx: 0, rz: -180, tapa: 0, disco: 0, manual: 0, cam: { x: 0, z: 1.38, alto: 3.9, ancho: 2.6 } },
  abierta: { x: CAJA.W / 2 - 0.06, y: -2.3, z: 1.38, rx: -10, rz: 0, tapa: -180, disco: 1, manual: 1, cam: { x: 0, z: 1.3, alto: 3.9, ancho: 4.1 } },
};

// El giro buscado se lleva al equivalente más cercano para que la caja siga girando hacia el mismo lado.
export function giroCercano(actual, objetivo) {
  const v = objetivo - 360 * Math.round((objetivo - actual) / 360);
  return v;
}

// Muelles: cada valor persigue su objetivo con rigidez y amortiguación; el bucle duerme cuando todo está quieto.
export class Muelles {
  constructor(inicial, { rigidez = 120, amort = 19 } = {}) {
    this.v = structuredClone(inicial); this.obj = structuredClone(inicial); this.vel = {}; this.k = rigidez; this.c = amort;
    this.alMover = null; this.corriendo = false; this.t = 0;
  }
  ir(obj, inmediato = false) {
    this.obj = structuredClone(obj);
    if (inmediato) { this.v = structuredClone(obj); this.vel = {}; this.alMover?.(this.v); return; }
    this.arrancar();
  }
  tocar(campo, valor) { this.v[campo] = valor; this.obj[campo] = valor; this.vel[campo] = 0; this.alMover?.(this.v); }
  empujar(campo, valor) { this.obj[campo] = valor; this.arrancar(); }
  arrancar() { if (!this.corriendo) { this.corriendo = true; this.t = performance.now(); requestAnimationFrame((t) => this.paso(t)); } }
  paso(t) {
    const dt = Math.min(0.034, (t - this.t) / 1000); this.t = t;
    let quieto = true;
    const recorrer = (v, o, vel, pre) => {
      for (const k of Object.keys(o)) {
        if (typeof o[k] === 'object') { recorrer(v[k], o[k], vel, `${pre}${k}.`); continue; }
        const id = pre + k; let x = v[k], u = vel[id] ?? 0;
        for (let i = 0; i < 3; i++) { const a = this.k * (o[k] - x) - this.c * u; u += a * dt / 3; x += u * dt / 3; }
        if (Math.abs(o[k] - x) < 0.0006 && Math.abs(u) < 0.003) { x = o[k]; u = 0; } else quieto = false;
        v[k] = x; vel[id] = u;
      }
    };
    recorrer(this.v, this.obj, this.vel, '');
    this.alMover?.(this.v);
    if (quieto) this.corriendo = false; else requestAnimationFrame((tt) => this.paso(tt));
  }
}
