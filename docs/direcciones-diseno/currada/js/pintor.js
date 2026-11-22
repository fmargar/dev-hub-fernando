// El plano en relieve, en WebGL2 a pelo. Dos pasadas:
//   1. Horno (solo al cambiar de tamaño): para cada píxel, la distancia a la vía más cercana y de qué
//      línea es, guardadas en una textura. Los cruces se resuelven aquí (la línea de más arriba manda).
//   2. Fotograma: con esa distancia se levanta la vía (perfil, normal, sombra) y encima van las
//      paradas y los coches, que son pocos y se calculan al vuelo. Todo se ilumina con la misma luz,
//      así que la sombra de un tren cae sobre la vía, sobre el tablero y sobre el rótulo impreso.
// No hay bucle propio: quien lo usa llama a pintar() cuando algo ha cambiado.

const MAX_COCHES = 20, MAX_PARADAS = 24;

const VERT = `#version 300 es
void main() { vec2 p = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2); gl_Position = vec4(p * 2. - 1., 0., 1.); }`;

const HORNO = `#version 300 es
precision highp float;
uniform sampler2D uTramos; uniform int uN; uniform vec2 uPx; uniform float uDpr, uK;
out vec4 o;
void main() {
  vec2 p = vec2(gl_FragCoord.x, uPx.y - gl_FragCoord.y) / uDpr;
  float dCerca = 1e9, idCerca = 0., dArriba = 1e9, idArriba = -1.;
  float R = 6.5 * uK + 1.;
  for (int i = 0; i < uN; i++) {
    vec4 s = texelFetch(uTramos, ivec2(i, 0), 0);
    float id = texelFetch(uTramos, ivec2(i, 1), 0).r;
    vec2 pa = p - s.xy, ba = s.zw - s.xy;
    float d = length(pa - ba * clamp(dot(pa, ba) / dot(ba, ba), 0., 1.));
    if (d < dCerca) { dCerca = d; idCerca = id; }
    if (d < R && id >= idArriba) { if (id > idArriba) dArriba = d; else dArriba = min(dArriba, d); idArriba = id; }
  }
  float d = idArriba >= 0. ? dArriba : dCerca, id = idArriba >= 0. ? idArriba : idCerca;
  float n = floor(clamp(d, 0., 63.99) * 1024.);
  o = vec4(floor(n / 256.) / 255., mod(n, 256.) / 255., id / 255., 1.);
}`;

const FOTOGRAMA = `#version 300 es
precision highp float;
uniform sampler2D uVia, uTinta;
uniform vec2 uPx, uRes, uOrigen; uniform float uDpr, uK;
uniform vec3 uColor[6]; uniform vec3 uPapel, uTintaCol; uniform vec3 uLuz;
uniform int uNC; uniform vec4 uCoche[${MAX_COCHES}]; uniform vec4 uCocheB[${MAX_COCHES}];
uniform int uNE; uniform vec4 uEst[${MAX_PARADAS}]; uniform vec4 uEstB[${MAX_PARADAS}];
out vec4 o;

vec2 leer(vec2 fc) {
  vec4 v = texelFetch(uVia, clamp(ivec2(fc), ivec2(0), ivec2(uPx) - 1), 0);
  return vec2((v.r * 65280. + v.g * 255.) / 1024., v.b * 255.);
}
float azar(vec2 p) { p = fract(p * vec2(.1031, .1030)); p += dot(p, p.yx + 33.33); return fract((p.x + p.y) * p.x); }
float ruido(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(azar(i), azar(i + vec2(1, 0)), f.x), mix(azar(i + vec2(0, 1)), azar(i + vec2(1, 1)), f.x), f.y); }

// Distancia con signo a una caja de esquinas redondas, y hacia dónde crece.
float caja(vec2 q, vec2 b, float r, out vec2 g) {
  vec2 w = abs(q) - b + r, s = sign(q);
  float fuera = max(w.x, w.y);
  if (fuera > 0.) { vec2 m = max(w, 0.); float l = length(m); g = s * m / max(l, 1e-4); return l - r; }
  g = w.x > w.y ? vec2(s.x, 0.) : vec2(0., s.y);
  return fuera - r;
}

void main() {
  vec2 fc = gl_FragCoord.xy;
  vec2 p = vec2(fc.x, uPx.y - fc.y) / uDpr;
  float k = uK, px = 1. / uDpr;
  vec2 Lu = normalize(uLuz.xy); float tanE = uLuz.z / length(uLuz.xy);
  vec2 aTex = vec2(uDpr, -uDpr);                       // de px de página a téxeles del horno

  // — tablero: papel con grano, una retícula de puntos impresa y el rótulo en tinta
  vec3 alb = uPapel * (1. + (ruido(p * .9) - .5) * .035 + (ruido(p * vec2(.035, .22)) - .5) * .03);
  vec2 ret = (p - uOrigen) / (20. * k);
  float punto = 1. - smoothstep(.9 * k, .9 * k + px, length((fract(ret) - .5) * 20. * k));
  alb *= 1. - punto * .085;
  float tinta = texture(uTinta, p / uRes).a;
  alb = mix(alb, uTintaCol * (1. + (ruido(p * 1.7) - .5) * .12), tinta * .95);

  vec3 n = vec3(0., 0., 1.);
  float brillo = 0., dureza = 1., sombra = 0., ao = 1.;
  vec3 emite = vec3(0.);

  // — vía
  vec2 v0 = leer(fc);
  float d = v0.x; vec3 cLinea = uColor[int(v0.y + .5)];
  float R = 6.5 * k, Hv = 3. * k;
  float enVia = clamp((R - d) * uDpr + .5, 0., 1.);
  if (enVia > 0.) {
    vec2 gd = vec2(leer(fc + vec2(1., 0.)).x - leer(fc - vec2(1., 0.)).x, leer(fc - vec2(0., 1.)).x - leer(fc + vec2(0., 1.)).x);
    gd = gd / max(length(gd), 1e-4);
    float t = d / R, u = clamp((t - .46) / .54, 0., 1.), hh = sqrt(1. - u * u);
    float cae = Hv * u / max(hh, .16) / (.54 * R);
    vec3 nv = normalize(vec3(gd * cae, 1.));
    float ranura = 1. - smoothstep(.8 * k, 1.7 * k, d);
    vec3 cv = cLinea * mix(1., .34, ranura) * mix(1., .84, smoothstep(.72, 1., t));
    alb = mix(alb, cv, enVia); n = normalize(mix(n, nv, enVia));
    brillo = .5 * enVia * (1. - ranura); dureza = 46.;
  }
  // la sombra y el asiento de la vía sobre el tablero
  float dS = leer(fc + Lu * (Hv / tanE + .8 * k) * aTex).x;
  sombra = max(sombra, (1. - smoothstep(R - 1.6 * k, R + 1.6 * k, dS)) * (1. - enVia) * .8);
  ao *= 1. - .13 * exp(-max(d - R, 0.) / (4.5 * k)) * (1. - enVia);

  // — paradas
  float Hs = 4.6 * k;
  for (int i = 0; i < uNE; i++) {
    vec4 e = uEst[i], eb = uEstB[i];
    vec2 dp = p - e.xy; float ro = length(dp);
    float r = e.z * (1. + .16 * e.w);
    if (ro > r + 34. * k) continue;
    vec3 cl = uColor[int(eb.x + .5)];
    float enEst = clamp((r - ro) * uDpr + .5, 0., 1.);
    // onda al pasar un tren y halo al estar parado en ella (tinta sobre el papel, no luz)
    float onda = eb.z > 0. ? (1. - eb.z) * (1. - smoothstep(0., 2.4 * k, abs(ro - r - eb.z * 26. * k))) : 0.;
    float halo = e.w * .5 * exp(-max(ro - r, 0.) / (6. * k));
    float tinte = clamp(max(onda * .9, halo), 0., 1.) * (1. - enEst);
    alb = mix(alb, cl, tinte);
    sombra = max(sombra, (1. - smoothstep(-1.4 * k, 1.6 * k, length(dp + Lu * (Hs / tanE)) - r)) * (1. - enEst) * .8);
    ao *= 1. - .16 * exp(-max(ro - r, 0.) / (4. * k)) * (1. - enEst);
    if (enEst > 0.) {
      float x = ro / r;
      vec3 blanco = vec3(.985, .975, .95);
      vec3 ce;
      if (eb.y < .5) ce = mix(blanco, mix(uTintaCol, cl, e.w), smoothstep(.56, .56 + px / r, x));           // parada: tapa blanca, aro de tinta
      else if (eb.y < 1.5) ce = cl;                                                                          // cabecera: la insignia de la línea
      else ce = mix(mix(blanco, cl, e.w), cl, smoothstep(.5, .5 + px / r, x));                               // final: aro del color de la línea
      vec3 ne = normalize(vec3(dp / r * 1.05, sqrt(max(1. - x * x, 0.)) + .42));
      alb = mix(alb, ce, enEst); n = normalize(mix(n, ne, enEst));
      brillo = mix(brillo, .62, enEst); dureza = mix(dureza, 64., enEst);
    }
  }

  // — coches
  vec2 b = vec2(17., 10.5) * k; float rc = 6.2 * k, Hc = 11. * k, bisel = 6. * k;
  for (int i = 0; i < uNC; i++) {
    vec4 c = uCoche[i], cb = uCocheB[i];
    vec2 dp = p - c.xy;
    if (dot(dp, dp) > 4400. * k * k) continue;
    vec2 eje = c.zw, lado = vec2(-c.w, c.z);
    vec2 q = vec2(dot(dp, eje), dot(dp, lado)), g;
    float sd = caja(q, b, rc, g);
    float alza = 1. + .55 * cb.w;                                  // agarrado, el tren se despega un poco del tablero
    vec2 Lq = vec2(dot(Lu, eje), dot(Lu, lado)) * (Hc * alza / tanE);
    vec2 gs; float sdS = min(caja(q + Lq, b, rc, gs), caja(q + Lq * .5, b, rc, gs));
    float enCoche = clamp(-sd * uDpr + .5, 0., 1.);
    sombra = max(sombra, (1. - smoothstep(-2.6 * k, 3.4 * k * alza, sdS)) * (1. - enCoche));
    ao *= 1. - .24 * exp(-max(sd, 0.) / (4.2 * k)) * (1. - enCoche);
    if (enCoche > 0.) {
      vec3 cl = uColor[int(cb.x + .5)];
      float prof = max(-sd, 0.), u = clamp(prof / bisel, 0., 1.), hh = sqrt(1. - (1. - u) * (1. - u));
      float cae = Hc * (1. - u) / max(hh, .14) / bisel;
      vec3 nc = normalize(vec3((eje * g.x + lado * g.y) * cae, 1.));
      // carrocería de esmalte marfil con el techo del color de su línea: se lee sobre cualquier vía
      vec3 cc = vec3(.975, .96, .925) * (1. + .03 * cb.w);
      vec2 gt; float techo = caja(q, b - vec2(6.2, 4.9) * k, 2.6 * k, gt);
      cc = mix(cc, cl, 1. - smoothstep(-.5 * k, .5 * k, techo));
      cc *= 1. - .2 * (1. - smoothstep(0., 1.1 * k, abs(techo)));
      for (int j = 0; j < 2; j++) {
        float sg = j == 0 ? 1. : -1., faro = j == 0 ? cb.y : cb.z;
        float f = 1. - smoothstep(1.5 * k, 1.5 * k + px, length(vec2(q.x - sg * (b.x - 3.1 * k), abs(q.y) - 5.6 * k)));
        vec3 cf = faro > 0. ? vec3(1., .74, .12) : vec3(.96, .13, .12);
        cc = mix(cc, mix(cc * .8, cf, clamp(abs(faro), 0., 1.)), f * step(.02, abs(faro)));
        emite += cf * f * clamp(abs(faro), 0., 1.) * .28 * enCoche;
      }
      alb = mix(alb, cc, enCoche); n = normalize(mix(n, nc, enCoche));
      brillo = mix(brillo, .78, enCoche); dureza = mix(dureza, 84., enCoche);
      sombra *= 1. - enCoche; ao = mix(ao, 1., enCoche);
    }
  }

  // — luz: una sola, desde arriba a la izquierda. El papel plano y sin sombra queda exactamente de su color.
  vec3 L = normalize(uLuz), Hm = normalize(L + vec3(0., 0., 1.));
  float amb = .5, dif = .62;
  float ndl = max(dot(n, L), 0.);
  vec3 col = alb * (amb + dif * ndl * (1. - sombra * .86)) / (amb + dif * L.z) * ao;
  col += brillo * pow(max(dot(n, Hm), 0.), dureza) * (1. - sombra * .7);
  col += emite;
  o = vec4(col, 1.);
}`;

export function crearPintor(lienzo) {
  let gl, horno, foto, texVia, texTramos, texTinta, fbo, vao, cfg = null, tinta = null, perdido = false;

  function programa(fuenteFrag) {
    const p = gl.createProgram();
    for (const [tipo, src] of [[gl.VERTEX_SHADER, VERT], [gl.FRAGMENT_SHADER, fuenteFrag]]) {
      const s = gl.createShader(tipo); gl.shaderSource(s, src); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error('Sombreador: ' + gl.getShaderInfoLog(s));
      gl.attachShader(p, s);
    }
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error('Programa: ' + gl.getProgramInfoLog(p));
    const u = {}; const n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < n; i++) { const nombre = gl.getActiveUniform(p, i).name.replace('[0]', ''); u[nombre] = gl.getUniformLocation(p, nombre); }
    return { p, u };
  }

  function textura(filtro) {
    const t = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filtro); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filtro);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return t;
  }

  function iniciar() {
    // se conserva el dibujo entre fotogramas para poder repintar solo el trozo que ha cambiado
    gl = lienzo.getContext('webgl2', { antialias: false, alpha: false, preserveDrawingBuffer: true, powerPreference: 'high-performance' });
    if (!gl) return false;
    horno = programa(HORNO); foto = programa(FOTOGRAMA);
    texVia = textura(gl.NEAREST); texTramos = textura(gl.NEAREST); texTinta = textura(gl.LINEAR);
    gl.bindTexture(gl.TEXTURE_2D, texTinta);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(4));
    fbo = gl.createFramebuffer(); vao = gl.createVertexArray();
    return true;
  }

  /** Tamaño, escala y vías: rehace el horno. `lineas`: [{ tramos: [[ax,ay,bx,by]…] en px de página }] en orden de pintado. */
  function configurar(nuevo) {
    cfg = nuevo;
    if (!gl || perdido) return;
    const { ancho, alto, dpr, k, lineas } = cfg;
    lienzo.width = Math.round(ancho * dpr); lienzo.height = Math.round(alto * dpr);
    const W = lienzo.width, Hh = lienzo.height;

    const todos = lineas.flatMap((l, id) => l.tramos.map((t) => [...t, id]));
    const datos = new Float32Array(todos.length * 4 * 2);
    todos.forEach((t, i) => { datos.set(t.slice(0, 4), i * 4); datos[todos.length * 4 + i * 4] = t[4]; });
    gl.bindTexture(gl.TEXTURE_2D, texTramos);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA32F, todos.length, 2, 0, gl.RGBA, gl.FLOAT, datos);

    gl.bindTexture(gl.TEXTURE_2D, texVia);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, W, Hh, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texVia, 0);
    gl.disable(gl.SCISSOR_TEST);
    gl.viewport(0, 0, W, Hh); gl.useProgram(horno.p); gl.bindVertexArray(vao);
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, texTramos);
    gl.uniform1i(horno.u.uTramos, 0); gl.uniform1i(horno.u.uN, todos.length);
    gl.uniform2f(horno.u.uPx, W, Hh); gl.uniform1f(horno.u.uDpr, dpr); gl.uniform1f(horno.u.uK, k);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }

  /** El rótulo impreso en el tablero: un lienzo 2D con el texto en blanco sobre transparente. */
  function rotular(lienzo2d) {
    tinta = lienzo2d;
    if (!gl || perdido) return;
    gl.bindTexture(gl.TEXTURE_2D, texTinta);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, lienzo2d);
  }

  const bufC = new Float32Array(MAX_COCHES * 4), bufCB = new Float32Array(MAX_COCHES * 4);
  const bufE = new Float32Array(MAX_PARADAS * 4), bufEB = new Float32Array(MAX_PARADAS * 4);

  /** `zona`: [x0, y0, x1, y1] en px de página para repintar solo ese rectángulo; sin ella, todo.
   *  escena: { coches: [{x,y,c,s,linea,faroDelante,faroDetras,agarre}], paradas: [{x,y,r,activa,linea,tipo,onda}], luz: [x,y,z], colores, papel, tinta } */
  function pintar(escena, zona) {
    if (!gl || perdido || !cfg) return;
    const { ancho, alto, dpr, k } = cfg, u = foto.u;
    gl.viewport(0, 0, lienzo.width, lienzo.height); gl.useProgram(foto.p); gl.bindVertexArray(vao);
    if (zona) {
      const x0 = Math.max(0, Math.floor(zona[0] * dpr)), y0 = Math.max(0, Math.floor(zona[1] * dpr));
      const x1 = Math.min(lienzo.width, Math.ceil(zona[2] * dpr)), y1 = Math.min(lienzo.height, Math.ceil(zona[3] * dpr));
      if (x1 <= x0 || y1 <= y0) return;
      gl.enable(gl.SCISSOR_TEST); gl.scissor(x0, lienzo.height - y1, x1 - x0, y1 - y0);
    } else gl.disable(gl.SCISSOR_TEST);
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, texVia); gl.uniform1i(u.uVia, 0);
    gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, texTinta); gl.uniform1i(u.uTinta, 1);
    gl.uniform2f(u.uPx, lienzo.width, lienzo.height); gl.uniform2f(u.uRes, ancho, alto);
    gl.uniform2f(u.uOrigen, cfg.ox, cfg.oy); gl.uniform1f(u.uDpr, dpr); gl.uniform1f(u.uK, k);
    gl.uniform3fv(u.uColor, escena.colores); gl.uniform3fv(u.uPapel, escena.papel); gl.uniform3fv(u.uTintaCol, escena.tinta);
    gl.uniform3fv(u.uLuz, escena.luz);
    const nc = Math.min(escena.coches.length, MAX_COCHES);
    for (let i = 0; i < nc; i++) {
      const c = escena.coches[i];
      bufC.set([c.x, c.y, c.c, c.s], i * 4); bufCB.set([c.linea, c.faroDelante, c.faroDetras, c.agarre], i * 4);
    }
    gl.uniform1i(u.uNC, nc); gl.uniform4fv(u.uCoche, bufC); gl.uniform4fv(u.uCocheB, bufCB);
    const ne = Math.min(escena.paradas.length, MAX_PARADAS);
    for (let i = 0; i < ne; i++) {
      const e = escena.paradas[i];
      bufE.set([e.x, e.y, e.r, e.activa], i * 4); bufEB.set([e.linea, e.tipo, e.onda, 0], i * 4);
    }
    gl.uniform1i(u.uNE, ne); gl.uniform4fv(u.uEst, bufE); gl.uniform4fv(u.uEstB, bufEB);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  lienzo.addEventListener('webglcontextlost', (e) => { e.preventDefault(); perdido = true; });
  lienzo.addEventListener('webglcontextrestored', () => {
    perdido = false; iniciar();
    if (cfg) configurar(cfg);
    if (tinta) rotular(tinta);
    lienzo.dispatchEvent(new CustomEvent('pintor:repintar'));
  });

  let ok = false;
  try { ok = iniciar(); } catch (e) { console.error(e); ok = false; }
  return ok ? { configurar, rotular, pintar } : null;
}
