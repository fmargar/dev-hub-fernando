// Una vía: polilínea octolineal con las esquinas redondeadas, remuestreada a paso fijo para poder
// preguntar «¿dónde está el punto a s píxeles del principio?» sin buscar.

const PASO = 2; // px de diseño entre muestras

export function construirVia(vertices, { radio = 30, cerrada = false } = {}) {
  const n = vertices.length;
  const tramos = []; // segmentos rectos y arcos ya troceados, para hornear la distancia
  const pts = [];
  const mete = (x, y) => {
    const u = pts[pts.length - 1];
    if (!u || Math.hypot(u[0] - x, u[1] - y) > 1e-6) pts.push([x, y]);
  };

  const esquina = (i) => {
    const b = vertices[i];
    const esExtremo = !cerrada && (i === 0 || i === n - 1);
    if (esExtremo) return { entra: b, sale: b, arco: null };
    const a = vertices[(i - 1 + n) % n], c = vertices[(i + 1) % n];
    const u = unidad(b[0] - a[0], b[1] - a[1]), v = unidad(c[0] - b[0], c[1] - b[1]);
    const cruz = u[0] * v[1] - u[1] * v[0];
    const giro = Math.atan2(cruz, u[0] * v[0] + u[1] * v[1]);
    if (Math.abs(giro) < 1e-3) return { entra: b, sale: b, arco: null };
    const corta = Math.min(Math.hypot(b[0] - a[0], b[1] - a[1]), Math.hypot(c[0] - b[0], c[1] - b[1])) * 0.5;
    const t = Math.min(radio * Math.tan(Math.abs(giro) / 2), corta);
    const r = t / Math.tan(Math.abs(giro) / 2);
    const lado = Math.sign(giro);
    const entra = [b[0] - u[0] * t, b[1] - u[1] * t];
    const sale = [b[0] + v[0] * t, b[1] + v[1] * t];
    const centro = [entra[0] - u[1] * r * lado, entra[1] + u[0] * r * lado];
    return { entra, sale, arco: { centro, r, desde: Math.atan2(entra[1] - centro[1], entra[0] - centro[0]), giro } };
  };

  const esquinas = vertices.map((_, i) => esquina(i));
  const total = cerrada ? n : n - 1;
  mete(...esquinas[0].sale);
  for (let i = 0; i < total; i++) {
    const sig = esquinas[(i + 1) % n];
    mete(...sig.entra);
    if (sig.arco) {
      const { centro, r, desde, giro } = sig.arco;
      // cuerdas de √r px: la flecha queda en una octava de píxel y el horno tiene pocos tramos que mirar
      const trozos = Math.max(3, Math.ceil((Math.abs(giro) * r) / Math.max(3, Math.sqrt(r))));
      for (let k = 1; k <= trozos; k++) {
        const a = desde + (giro * k) / trozos;
        mete(centro[0] + Math.cos(a) * r, centro[1] + Math.sin(a) * r);
      }
    }
  }
  for (let i = 0; i + 1 < pts.length; i++) tramos.push([pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1]]);

  // Remuestreo a paso fijo
  const acum = [0];
  for (let i = 1; i < pts.length; i++) acum.push(acum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const largo = acum[acum.length - 1];
  const m = Math.max(2, Math.round(largo / PASO) + 1);
  const ds = largo / (m - 1);
  const X = new Float32Array(m), Y = new Float32Array(m);
  let j = 0;
  for (let i = 0; i < m; i++) {
    const s = Math.min(i * ds, largo);
    while (j < acum.length - 2 && acum[j + 1] < s) j++;
    const f = (s - acum[j]) / Math.max(acum[j + 1] - acum[j], 1e-9);
    X[i] = pts[j][0] + (pts[j + 1][0] - pts[j][0]) * f;
    Y[i] = pts[j][1] + (pts[j + 1][1] - pts[j][1]) * f;
  }

  const envuelve = (s) => (cerrada ? ((s % largo) + largo) % largo : Math.max(0, Math.min(largo, s)));

  /** Punto y tangente a s píxeles del inicio. */
  function en(s, sal = {}) {
    const f = envuelve(s) / ds;
    const i = Math.min(Math.floor(f), m - 2), t = f - i;
    sal.x = X[i] + (X[i + 1] - X[i]) * t;
    sal.y = Y[i] + (Y[i + 1] - Y[i]) * t;
    // tangente suavizada con las muestras vecinas: los coches no dan saltos de ángulo al entrar en curva
    const a = Math.max(i - 2, 0), b = Math.min(i + 3, m - 1);
    const dx = X[b] - X[a], dy = Y[b] - Y[a], l = Math.hypot(dx, dy) || 1;
    sal.c = dx / l; sal.s = dy / l;
    return sal;
  }

  /** El s del punto de la vía más cercano a (x, y), buscando solo a `ventana` px de `sCentro`
   *  (así un tren no salta a otro tramo de su línea que pase cerca). Devuelve s sin envolver. */
  function proyectar(x, y, sCentro = largo / 2, ventana = largo) {
    const i0 = Math.floor((sCentro - ventana) / ds), i1 = Math.ceil((sCentro + ventana) / ds);
    let mejor = Infinity, sMejor = sCentro;
    for (let i = i0; i < i1; i++) {
      let a = i, b = i + 1;
      if (cerrada) { a = ((a % (m - 1)) + (m - 1)) % (m - 1); b = a + 1; } else if (a < 0 || b > m - 1) continue;
      const ax = X[a], ay = Y[a], bx = X[b] - ax, by = Y[b] - ay;
      const t = Math.max(0, Math.min(1, ((x - ax) * bx + (y - ay) * by) / (bx * bx + by * by || 1)));
      const d = (x - ax - bx * t) ** 2 + (y - ay - by * t) ** 2;
      if (d < mejor) { mejor = d; sMejor = (i + t) * ds; }
    }
    return { s: sMejor, d: Math.sqrt(mejor) };
  }

  return { largo, cerrada, tramos, en, proyectar, envuelve };
}

function unidad(x, y) { const l = Math.hypot(x, y) || 1; return [x / l, y / l]; }
