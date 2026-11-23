// Muelles: cada valor persigue su objetivo con rigidez y amortiguación (también los anidados, como la cámara).
// Cambiar el objetivo a mitad de camino no da saltos: se parte de donde esté y a la velocidad que lleve. El bucle
// duerme cuando todo está quieto. Con movimiento reducido, `ir(obj, true)` salta directamente.
export class Muelles {
  constructor(inicial, { rigidez = 120, amort = 19 } = {}) {
    this.v = structuredClone(inicial); this.obj = structuredClone(inicial); this.vel = {}; this.k = rigidez; this.c = amort;
    this.alMover = null; this.alParar = null; this.corriendo = false; this.t = 0; this.rig = {};
  }
  // rigidez propia de algunos campos (p. ej. la cámara, más lenta que la caja)
  ritmo(campo, rigidez, amort) { this.rig[campo] = [rigidez, amort]; return this; }
  ir(obj, inmediato = false) {
    this.obj = { ...this.obj, ...structuredClone(obj) };
    if (inmediato) { this.v = structuredClone(this.obj); this.vel = {}; this.alMover?.(this.v); this.alParar?.(); return; }
    this.arrancar();
  }
  tocar(campo, valor) { this.v[campo] = valor; this.obj[campo] = valor; this.vel[campo] = 0; this.alMover?.(this.v); }
  empujar(campo, valor) { this.obj[campo] = valor; this.arrancar(); }
  arrancar() { if (!this.corriendo) { this.corriendo = true; this.t = performance.now(); requestAnimationFrame((t) => this.paso(t)); } }
  paso(t) {
    const dt = Math.min(0.034, (t - this.t) / 1000); this.t = t;
    let quieto = true;
    const recorrer = (v, o, pre) => {
      for (const k of Object.keys(o)) {
        if (o[k] !== null && typeof o[k] === 'object') { v[k] ??= structuredClone(o[k]); recorrer(v[k], o[k], `${pre}${k}.`); continue; }
        if (typeof o[k] !== 'number') { v[k] = o[k]; continue; }
        const id = pre + k, [kk, cc] = this.rig[pre.split('.')[0] || k] ?? this.rig[k] ?? [this.k, this.c];
        let x = v[k] ?? o[k], u = this.vel[id] ?? 0;
        for (let i = 0; i < 3; i++) { const a = kk * (o[k] - x) - cc * u; u += a * dt / 3; x += u * dt / 3; }
        if (Math.abs(o[k] - x) < 0.0005 && Math.abs(u) < 0.003) { x = o[k]; u = 0; } else quieto = false;
        v[k] = x; this.vel[id] = u;
      }
    };
    recorrer(this.v, this.obj, '');
    this.alMover?.(this.v);
    if (quieto) { this.corriendo = false; this.alParar?.(); } else requestAnimationFrame((tt) => this.paso(tt));
  }
}

// El giro buscado se lleva al equivalente más cercano para que la pieza siga girando hacia el mismo lado.
export const giroCercano = (actual, objetivo) => objetivo - 360 * Math.round((objetivo - actual) / 360);
export const suave = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
export const mezclar = (a, b, t) => a + (b - a) * t;
