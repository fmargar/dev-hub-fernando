// Un convoy sobre su vía. Cada coche es una masa con su posición s a lo largo de la línea; los
// enganches son muelles amortiguados (por eso el tren hace el acordeón al tirar o al chocar con el
// tope). Tres maneras de moverlo: a mano (un muelle blando entre el dedo y el coche agarrado), solo
// (frena con v² = 2·a·d para clavarse en la parada) o suelto (rueda con su inercia y, si pasa
// despacio por una parada, el freno magnético de la estación lo atrapa).
//
// Unidades: px de diseño y segundos. La masa de cada coche es 1.

const H = 1 / 240;          // paso fijo de la simulación
const ENGANCHE_K = 620, ENGANCHE_C = 22, HOLGURA = 5;   // el enganche cede: hasta HOLGURA px de más o de menos
const MANO_K = 260, MANO_C = 24, MANO_MAX = 14000;
const RODADURA = 46, AIRE = 0.85;                 // deceleración constante y proporcional a v
const IMAN_K = 150, IMAN_C = 19, IMAN_RADIO = 30, IMAN_VEL = 250;
const AUTO_VMAX = 760, AUTO_ACEL = 1500, AUTO_FRENO = 1150;
const REBOTE = 0.32;

export class Tren {
  /**
   * @param via       la de via.js
   * @param paradas   s de cada parada, en orden
   * @param medidas   { coches, paso (entre centros), largo (de un coche) } en px de diseño
   */
  constructor(via, paradas, medidas, alOcurrir = () => {}) {
    this.via = via; this.paradas = paradas; this.alOcurrir = alOcurrir;
    this.n = medidas.coches; this.paso = medidas.paso; this.medio = medidas.largo / 2;
    this.s = new Float64Array(this.n); this.v = new Float64Array(this.n);
    this.centro = (this.n - 1) >> 1;               // el coche que se centra en las paradas
    this.modo = 'libre';                           // 'libre' | 'mano' | 'auto'
    this.agarrado = 0; this.sMano = 0; this.destino = -1;
    this.parada = -1;                              // en cuál está parado (-1: en marcha)
    this.sentido = 1; this.luz = 1;                // hacia dónde mira el faro, con su fundido
    this.resto = 0; this.dormido = false; this.reloj = 0; this.tTope = -1;
    this.a = new Float64Array(this.n);
    this.colocar(0);
  }

  /** Dónde tiene que quedar el coche central para que el tren esté «en» la parada i. */
  sParada(i) {
    const s = this.paradas[i];
    if (this.via.cerrada) return s;
    const cola = (this.n - 1 - this.centro) * this.paso + this.medio, morro = this.centro * this.paso + this.medio;
    return Math.max(cola + 2, Math.min(this.via.largo - morro - 2, s));
  }

  colocar(i) {
    const sc = this.sParada(i);
    for (let k = 0; k < this.n; k++) { this.s[k] = sc + (this.centro - k) * this.paso; this.v[k] = 0; }
    this.parada = i; this.modo = 'libre'; this.destino = -1; this.dormido = false;
  }

  get sCentro() { return this.s[this.centro]; }
  get vel() { return this.v[this.centro]; }

  agarrar(coche, sDedo) {
    this.modo = 'mano'; this.agarrado = coche; this.sMano = sDedo; this.destino = -1; this.dormido = false;
  }
  arrastrar(sDedo) { this.sMano = sDedo; this.dormido = false; }
  soltar() { if (this.modo === 'mano') this.modo = 'libre'; }
  irA(i) { this.modo = 'auto'; this.destino = i; this.dormido = false; }
  /** Un empujón: el tren se mueve un poco y el freno de la parada lo devuelve a su sitio. */
  empujar(v) { for (let k = 0; k < this.n; k++) this.v[k] += v; this.dormido = false; }

  /** La parada más cercana al coche central y a cuánto queda (con signo). */
  cercana() {
    let mejor = -1, dMejor = Infinity;
    for (let i = 0; i < this.paradas.length; i++) {
      let d = this.sParada(i) - this.sCentro;
      if (this.via.cerrada) { const L = this.via.largo; d = ((d % L) + L + L / 2) % L - L / 2; }
      if (Math.abs(d) < Math.abs(dMejor)) { dMejor = d; mejor = i; }
    }
    return { i: mejor, d: dMejor };
  }

  avanzar(dt) {
    if (this.dormido) return false;
    this.resto += Math.min(dt, 0.1);
    while (this.resto >= H) { this.#paso(); this.resto -= H; }
    // faro: se pasa de un extremo al otro con un fundido cuando el tren cambia de sentido
    if (Math.abs(this.vel) > 90) this.sentido = Math.sign(this.vel);
    this.luz += (this.sentido - this.luz) * Math.min(1, dt * 7);
    return true;
  }

  #paso() {
    const { s, v, n, via } = this;
    const a = this.a.fill(0);
    this.reloj += H;
    for (let k = 0; k + 1 < n; k++) {
      const f = ENGANCHE_K * (s[k] - s[k + 1] - this.paso) + ENGANCHE_C * (v[k] - v[k + 1]);
      a[k] -= f; a[k + 1] += f;
    }
    const antes = this.sCentro;
    const cerca = this.cercana();

    if (this.modo === 'mano') {
      const g = this.agarrado;
      let f = MANO_K * n * (this.sMano - s[g]) - MANO_C * n * v[g];
      a[g] += Math.max(-MANO_MAX, Math.min(MANO_MAX, f));
    } else if (this.modo === 'auto') {
      let d = this.sParada(this.destino) - this.sCentro;
      if (via.cerrada) { const L = via.largo; d = ((d % L) + L + L / 2) % L - L / 2; }
      // planea la frenada con la mitad del freno que tiene: le sobra para seguir la curva sin pasarse
      const quiere = Math.sign(d) * Math.min(AUTO_VMAX, Math.sqrt(AUTO_FRENO * Math.abs(d)));
      // acelera con su tope y frena con algo más de margen, para llegar a la parada sin pasarse
      const frenando = Math.abs(quiere) < Math.abs(this.vel) && quiere * this.vel >= 0;
      const tope = frenando ? AUTO_FRENO * 1.5 : AUTO_ACEL;
      const empuje = Math.max(-tope, Math.min(tope, (quiere - this.vel) * 30));
      for (let k = 0; k < n; k++) a[k] += empuje;
      if (Math.abs(d) < 3 && Math.abs(this.vel) < 40) this.modo = 'libre';
    }
    if (this.modo === 'libre' && Math.abs(cerca.d) < IMAN_RADIO && Math.abs(this.vel) < IMAN_VEL) {
      const f = IMAN_K * cerca.d - IMAN_C * this.vel;
      for (let k = 0; k < n; k++) a[k] += f;
    }

    for (let k = 0; k < n; k++) {
      if (this.modo !== 'auto') {
        const roce = RODADURA * Math.sign(v[k]) + AIRE * v[k];
        a[k] -= Math.abs(v[k]) < 0.6 ? v[k] / H * 0.5 : roce;
      }
      v[k] += a[k] * H; s[k] += v[k] * H;
    }
    // topes de fin de línea: el coche que llega rebota y los enganches hacen el resto
    if (!via.cerrada) {
      const max = via.largo - this.medio, min = this.medio;
      if (s[0] > max) { const golpe = v[0]; s[0] = max; v[0] = -REBOTE * golpe; this.#tope(this.paradas.length - 1, golpe); }
      if (s[n - 1] < min) { const golpe = -v[n - 1]; s[n - 1] = min; v[n - 1] = REBOTE * golpe; this.#tope(0, golpe); }
    }

    // los coches no se atraviesan ni se sueltan: al llegar al límite del enganche se llevan uno a otro
    for (let k = 0; k + 1 < n; k++) {
      const hueco = s[k] - s[k + 1], falta = hueco < this.paso - HOLGURA ? this.paso - HOLGURA - hueco : hueco > this.paso + HOLGURA ? this.paso + HOLGURA - hueco : 0;
      if (falta === 0) continue;
      s[k] += falta / 2; s[k + 1] -= falta / 2;
      if ((v[k] - v[k + 1]) * falta < 0) v[k] = v[k + 1] = (v[k] + v[k + 1]) / 2;
    }

    if (!via.cerrada) { const max = via.largo - this.medio, min = this.medio; if (s[0] > max) s[0] = max; if (s[n - 1] < min) s[n - 1] = min; }

    // paradas: pasar de largo, llegar y salir
    for (let i = 0; i < this.paradas.length; i++) {
      const sp = this.sParada(i);
      let d0 = antes - sp, d1 = this.sCentro - sp;
      if (via.cerrada) { const L = via.largo; d0 = ((d0 % L) + L + L / 2) % L - L / 2; d1 = ((d1 % L) + L + L / 2) % L - L / 2; }
      if (i !== this.parada && d0 * d1 < 0 && Math.abs(d0) < 40 && Math.abs(this.vel) > 60) this.alOcurrir('paso', i, this.vel);
    }
    if (this.parada >= 0 && Math.abs(this.sParada(this.parada) - this.sCentro) > 18 && !via.cerrada) { this.alOcurrir('salida', this.parada); this.parada = -1; }
    else if (this.parada >= 0 && via.cerrada && Math.abs(cerca.d) > 18) { this.alOcurrir('salida', this.parada); this.parada = -1; }

    let quieto = true;
    for (let k = 0; k < n; k++) if (Math.abs(v[k]) > 2.5) { quieto = false; break; }
    if (quieto && this.modo === 'libre' && Math.abs(cerca.d) < 0.9) {
      if (this.parada !== cerca.i) { this.parada = cerca.i; this.alOcurrir('llegada', cerca.i); }
      // del todo parado: se coloca exacto y deja de simularse hasta que alguien lo toque
      let cuadrado = true;
      for (let k = 0; k < n; k++) if (Math.abs(v[k]) > 0.4 || Math.abs(s[k] - (this.sCentro + (this.centro - k) * this.paso)) > 0.3) cuadrado = false;
      if (cuadrado && Math.abs(this.luz - this.sentido) < 0.02) { for (let k = 0; k < n; k++) v[k] = 0; this.dormido = true; }
    } else if (quieto && this.modo === 'libre' && Math.abs(cerca.d) >= IMAN_RADIO) {
      // se ha quedado parado entre dos paradas: el imán no llega, así que lo lleva la más cercana
      this.irA(cerca.i);
    }
  }

  // Un golpe contra el tope se cuenta una vez, aunque los coches de detrás sigan empujando.
  #tope(i, golpe) {
    if (golpe < 90 || this.reloj - this.tTope < 0.5) return;
    this.tTope = this.reloj; this.alOcurrir('tope', i, golpe);
  }

  /** Posición y orientación de cada coche, para pintar. */
  coches(sal) {
    const p = {};
    for (let k = 0; k < this.n; k++) {
      this.via.en(this.s[k], p);
      const o = sal[k] || (sal[k] = {});
      o.x = p.x; o.y = p.y; o.c = p.c; o.s = p.s;
    }
    return sal;
  }
}
