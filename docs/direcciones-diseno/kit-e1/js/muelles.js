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
    // sin gráfica un fotograma puede durar 80 ms: se avanza el tiempo real (troceado en pasos de 12 ms para que siga
    // estable) en vez de frenar el movimiento, que si no tardaba el doble o el triple en llegar
    const dt = Math.min(0.1, (t - this.t) / 1000), n = Math.max(3, Math.ceil(dt / 0.012)); this.t = t;
    let quieto = true;
    const recorrer = (v, o, pre) => {
      for (const k of Object.keys(o)) {
        if (o[k] !== null && typeof o[k] === 'object') { v[k] ??= structuredClone(o[k]); recorrer(v[k], o[k], `${pre}${k}.`); continue; }
        if (typeof o[k] !== 'number') { v[k] = o[k]; continue; }
        const id = pre + k, [kk, cc] = this.rig[pre.split('.')[0] || k] ?? this.rig[k] ?? [this.k, this.c];
        let x = v[k] ?? o[k], u = this.vel[id] ?? 0;
        for (let i = 0; i < n; i++) { const a = kk * (o[k] - x) - cc * u; u += a * dt / n; x += u * dt / n; }
        // «llegado» en proporción al valor (dos milésimas: medio grado en un giro de 180, dos centésimas en una
        // distancia de cámara de 11). Esperar a que llegara al pelo alargaba cada paso medio segundo sin que nada se
        // moviera en pantalla
        const tol = 0.002 * Math.max(1, Math.abs(o[k]));
        if (Math.abs(o[k] - x) < tol && Math.abs(u) < tol * 6) { x = o[k]; u = 0; } else quieto = false;
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
