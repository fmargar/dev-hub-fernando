// Lo impreso del banco óptico: la rejilla de taladros del tablero, la regla grabada en el canto del carril, la tira
// con las diez muestras (cada portamuestras enseña su trozo) y la tira ampliada, que es lo que se ve a través de la
// lente: la misma muestra, mucho más de cerca, con su nombre.
import { PROYECTOS } from '../../../kit-e1/js/datos.js';
import { cargarArte, partir } from '../../../kit-e1/js/coleccion.js';

const mono = (t) => `500 ${t}px 'DM Mono'`;
const caslon = (t) => `700 ${t}px 'Caslon Cond'`;
const serif = (t) => `italic 400 ${t}px 'Instrument Serif'`;
const PAPEL = '#f3efe4', TINTA = '#1d1915';
const N = 10;

export const TAM = { mesa: [3264, 864], regla: [3072, 40], muestras: [N * 300, 400], lupa: [N * 400, 400] };

// ── El tablero: aluminio anodizado en negro, cepillado a lo largo, con un taladro roscado cada 25 mm ──
export function mesa(c, D) {
  const x = c.getContext('2d'), [W, H] = [c.width, c.height], M = D.mesa;
  x.fillStyle = '#3b3f46'; x.fillRect(0, 0, W, H);
  for (let i = 0; i < 520; i++) {
    const y = Math.random() * H, w = W * (0.2 + Math.random() * 0.8);
    x.fillStyle = `rgba(255,255,255,${0.006 + Math.random() * 0.012})`; x.fillRect(Math.random() * (W - w), y, w, 1 + Math.random());
  }
  const px = W / (M.x1 - M.x0 - 0.1), paso = M.paso * px * 2;            // un taladro cada 5 cm: a esta escala, cada 2,5 se empasta
  for (let gy = paso / 2; gy < H; gy += paso) for (let gx = paso / 2; gx < W; gx += paso) {
    x.fillStyle = 'rgba(255,255,255,.10)'; x.beginPath(); x.arc(gx, gy + 1.4, 5.4, 0, 7); x.fill();
    x.fillStyle = '#0a0b0d'; x.beginPath(); x.arc(gx, gy, 4.8, 0, 7); x.fill();
    x.fillStyle = 'rgba(255,255,255,.05)'; x.beginPath(); x.arc(gx, gy, 2.2, 0, 7); x.fill();
  }
}

// ── La regla del carril: una raya por centímetro y, frente a cada portamuestras, su número ──
export function regla(c, D) {
  const x = c.getContext('2d'), [W, H] = [c.width, c.height], R = D.regla, px = W / (R.x1 - R.x0);
  x.fillStyle = '#c9cdd2'; x.fillRect(0, 0, W, H);
  x.fillStyle = '#16181b';
  const cero = D.xs[0];
  for (let k = -12; k <= 190; k++) {
    const gx = (cero + k * 0.1 - R.x0) * px; if (gx < 6 || gx > W - 6) continue;
    const largo = k % 10 === 0 ? 20 : k % 5 === 0 ? 14 : 8;
    x.fillRect(Math.round(gx) - 1, 0, 2, largo);
  }
  x.font = mono(17); x.textAlign = 'center'; x.textBaseline = 'alphabetic'; x.letterSpacing = '1px';
  D.xs.forEach((v, i) => { const p = PROYECTOS[i]; x.fillText(p ? `${p.n} · ${p.nombre.toUpperCase()}` : '10 · LIBRE', (v - R.x0) * px, H - 4); });
}

function cubrir(x, img, dx, dy, dw, dh, fx = 0.5, fy = 0.6) {
  const k = Math.max(dw / img.width, dh / img.height), sw = dw / k, sh = dh / k;
  x.drawImage(img, (img.width - sw) * fx, (img.height - sh) * fy, sw, sh, dx, dy, dw, dh);
}

// ── Las muestras: una preparación por proyecto, con su etiqueta de laboratorio arriba y la muestra en su ventana ──
export async function muestras(c, alPintar) {
  const x = c.getContext('2d'), w = 300, H = 400;
  const una = (i, img) => {
    const p = PROYECTOS[i], x0 = i * w;
    x.save(); x.beginPath(); x.rect(x0, 0, w, H); x.clip(); x.translate(x0, 0);
    x.fillStyle = PAPEL; x.fillRect(0, 0, w, H);
    if (!p) {
      // el portamuestras libre: una preparación sin muestra
      x.strokeStyle = '#8d9196'; x.lineWidth = 4; x.setLineDash([16, 11]); x.beginPath(); x.arc(w / 2, 232, 104, 0, 7); x.stroke(); x.setLineDash([]);
      x.fillStyle = '#6d7277'; x.textAlign = 'center'; x.font = serif(40); x.fillText('Aquí va', w / 2, 224); x.fillText('la siguiente', w / 2, 264);
      x.font = mono(20); x.letterSpacing = '2px'; x.fillText('10 · LIBRE', w / 2, 62);
      x.restore(); return;
    }
    x.fillStyle = p.color; x.fillRect(0, 0, w, 96);
    x.fillStyle = p.tinta; x.textAlign = 'left'; x.font = mono(20); x.letterSpacing = '2px'; x.fillText(`MUESTRA ${p.n}`, 20, 34);
    let t = 50; x.letterSpacing = '0px'; x.font = caslon(t);
    while (x.measureText(p.nombre).width > w - 40 && t > 28) { t -= 2; x.font = caslon(t); }
    x.fillText(p.nombre, 20, 80);
    // la ventana redonda de la preparación
    x.save(); x.beginPath(); x.arc(w / 2, 240, 112, 0, 7); x.clip();
    x.fillStyle = p.color; x.fillRect(0, 120, w, 240);
    if (img) cubrir(x, img, w / 2 - 112, 128, 224, 224);
    x.restore();
    x.strokeStyle = TINTA; x.lineWidth = 3; x.beginPath(); x.arc(w / 2, 240, 112, 0, 7); x.stroke();
    x.fillStyle = '#6d655b'; x.font = mono(15); x.letterSpacing = '1.5px'; x.textAlign = 'center';
    x.fillText(p.tipo.toUpperCase(), w / 2, H - 14, w - 24);
    x.restore();
  };
  for (let i = 0; i < N; i++) una(i, null);
  alPintar();
  // las imágenes llegan después: cada muestra se repinta con la suya
  await Promise.all(PROYECTOS.map(async (p, i) => { const img = await cargarArte(p.id); if (img) { una(i, img); alPintar(); } }));
}

// ── Lo que se ve por la lente: la muestra ampliada, llenando el campo, con el nombre grande ──
export async function lupa(c, alPintar) {
  const x = c.getContext('2d'), w = 400, H = 400;
  const una = (i, img) => {
    const p = PROYECTOS[i], x0 = i * w;
    x.save(); x.beginPath(); x.rect(x0, 0, w, H); x.clip(); x.translate(x0, 0);
    if (!p) {
      x.fillStyle = '#dfe3e6'; x.fillRect(0, 0, w, H);
      x.strokeStyle = '#9aa0a6'; x.lineWidth = 2;
      for (let k = 1; k < 8; k++) { x.beginPath(); x.moveTo(k * 50, 0); x.lineTo(k * 50, H); x.moveTo(0, k * 50); x.lineTo(w, k * 50); x.stroke(); }
      x.fillStyle = '#4d5359'; x.textAlign = 'center'; x.font = serif(46); x.fillText('Aquí va', w / 2, 190); x.fillText('la siguiente', w / 2, 240);
      x.restore(); return;
    }
    x.fillStyle = p.color; x.fillRect(0, 0, w, H);
    if (img) cubrir(x, img, 0, 0, w, H, 0.5, 0.62);
    const g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, `${p.color}f2`); g.addColorStop(0.42, `${p.color}99`); g.addColorStop(0.7, `${p.color}00`);
    x.fillStyle = g; x.fillRect(0, 0, w, H);
    x.textAlign = 'center'; x.fillStyle = p.tinta; x.shadowColor = 'rgba(0,0,0,.45)'; x.shadowBlur = 12; x.shadowOffsetY = 2;
    x.font = mono(17); x.letterSpacing = '2px'; x.fillText(`${p.n} · ${p.tipo.toUpperCase()}`, w / 2, 92, w - 120);
    let t = 78; x.letterSpacing = '0px'; x.font = caslon(t);
    while (x.measureText(p.nombre).width > w - 110 && t > 34) { t -= 2; x.font = caslon(t); }
    x.fillText(p.nombre, w / 2, 100 + t * 0.9);
    x.fillStyle = '#fff'; x.font = serif(25);
    partir(x, p.linea, w - 130).slice(0, 2).forEach((l, k) => x.fillText(l, w / 2, 100 + t * 0.9 + 34 + k * 28));
    x.restore();
  };
  for (let i = 0; i < N; i++) una(i, null);
  alPintar();
  await Promise.all(PROYECTOS.map(async (p, i) => { const img = await cargarArte(p.id); if (img) { una(i, img); alPintar(); } }));
}
