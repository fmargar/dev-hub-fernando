// Lo impreso de la centralita: el tablero esmaltado con la placa de cada puerto, el rótulo del panel y la ficha del
// proyecto conectado (con el esquema de qué piezas intervienen, unidas por un cordón como el de la clavija).
import { PROYECTOS, PERFIL } from '../../../kit-e1/js/datos.js';
import { partir } from '../../../kit-e1/js/coleccion.js';

const PX = 170;                                   // píxeles de canvas por unidad (1 = 10 cm)
const ESMALTE = '#1d4740', ESMALTE_2 = '#173a34', CREMA = '#efe7d6', LATON = '#c9a55f', TINTA = '#1d1915', ROJO = '#8f2a22';
const mono = (t, peso = 500) => `${peso} ${t}px 'DM Mono'`;
const cursiva = (t) => `italic 400 ${t}px 'Instrument Serif'`;
const titulo = (t) => `700 ${t}px 'Caslon Cond'`;
const texto = (t, peso = 500) => `${peso} ${t}px 'Instrument Sans'`;
export const tamTablero = (T) => [Math.round((T.x1 - T.x0) * PX), Math.round((T.z1 - T.z0) * PX)];
export const TAM_CARA = [1600, 1000];

function tornillo(x, cx, cy, r = 5) {
  x.fillStyle = '#8d6f35'; x.beginPath(); x.arc(cx, cy, r, 0, 7); x.fill();
  x.strokeStyle = '#5c471f'; x.lineWidth = 1.5; x.beginPath(); x.moveTo(cx - r * 0.7, cy - r * 0.4); x.lineTo(cx + r * 0.7, cy + r * 0.4); x.stroke();
}

// El tablero: esmalte verde, un filete fino alrededor de cada puerto y, debajo, su placa de esmalte crema atornillada
// con el número, el nombre y su cifra. El décimo puerto lleva la placa en blanco.
export function tablero(c, D) {
  const T = D.tablero, x = c.getContext('2d'), [W, H] = [c.width, c.height];
  const X = (v) => (v - T.x0) * PX, Z = (v) => (T.z1 - v) * PX;
  const g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, ESMALTE); g.addColorStop(1, ESMALTE_2);
  x.fillStyle = g; x.fillRect(0, 0, W, H);
  D.orden.forEach((id, i) => {
    const [px, pz] = D.puertos[i], p = PROYECTOS.find((q) => q.id === id);
    const cx = X(px), cy = Z(pz), col = D.hx * PX;
    // el filete de la celda
    x.strokeStyle = 'rgba(239,231,214,.16)'; x.lineWidth = 2;
    x.beginPath(); x.roundRect(cx - col / 2 + 14, Z(pz + 0.95) + 12, col - 28, D.hz * PX - 24, 16); x.stroke();
    // el fondo del puerto (lo tapa el aro de latón; asoma solo el agujero)
    x.fillStyle = '#0a0b0c'; x.beginPath(); x.arc(cx, cy, 0.14 * PX, 0, 7); x.fill();
    // la placa
    const pw = col - 48, ph = 0.76 * PX, py = cy + 0.47 * PX;
    x.fillStyle = p ? CREMA : 'rgba(239,231,214,.5)'; x.beginPath(); x.roundRect(cx - pw / 2, py, pw, ph, 8); x.fill();
    x.strokeStyle = LATON; x.lineWidth = 3; x.stroke();
    tornillo(x, cx - pw / 2 + 13, py + ph / 2); tornillo(x, cx + pw / 2 - 13, py + ph / 2);
    x.textAlign = 'center'; x.textBaseline = 'alphabetic'; x.fillStyle = TINTA;
    const ancho = pw - 56;
    if (!p) {
      x.font = cursiva(38); x.fillStyle = 'rgba(29,25,21,.55)'; x.fillText('libre', cx, py + ph * 0.62);
      return;
    }
    let cuerpo = 54; x.font = titulo(cuerpo);
    while (cuerpo > 32 && x.measureText(p.nombre).width > ancho) { cuerpo -= 2; x.font = titulo(cuerpo); }
    x.fillText(p.nombre, cx, py + ph * 0.5);
    const cifra = `${p.n} · ${p.cifras[0][0]} ${p.cifras[0][1]}`.toUpperCase();
    cuerpo = 25; x.font = mono(cuerpo); x.letterSpacing = '1px';
    while (cuerpo > 15 && x.measureText(cifra).width > ancho) { cuerpo -= 1; x.font = mono(cuerpo); }
    x.fillStyle = 'rgba(29,25,21,.72)'; x.fillText(cifra, cx, py + ph * 0.84); x.letterSpacing = '0px';
  });
}

function fondoCara(x, W, H) {
  x.fillStyle = CREMA; x.fillRect(0, 0, W, H);
  x.strokeStyle = LATON; x.lineWidth = 6; x.strokeRect(26, 26, W - 52, H - 52);
  x.strokeStyle = 'rgba(29,25,21,.25)'; x.lineWidth = 2; x.strokeRect(40, 40, W - 80, H - 80);
  for (const [a, b] of [[58, 58], [W - 58, 58], [58, H - 58], [W - 58, H - 58]]) tornillo(x, a, b, 9);
}

// La cara 0 del panel: el rótulo de la centralita.
export function rotulo(c) {
  const x = c.getContext('2d'), [W, H] = [c.width, c.height];
  fondoCara(x, W, H);
  x.textAlign = 'center'; x.fillStyle = TINTA;
  x.font = mono(30); x.letterSpacing = '6px'; x.fillText('CENTRALITA FM · NUEVE LÍNEAS', W / 2, 170); x.letterSpacing = '0px';
  x.font = titulo(190); x.fillText(PERFIL.nombre, W / 2, 400);
  x.font = cursiva(68); x.fillStyle = ROJO; x.fillText(PERFIL.titular.join(' · '), W / 2, 520, W - 200);
  x.fillStyle = TINTA; x.fillRect(W / 2 - 220, 590, 440, 3);
  x.font = texto(44); x.fillStyle = 'rgba(29,25,21,.8)';
  partir(x, 'Lleva la clavija a un puerto, o púlsalo: el panel gira y pone su ficha.', W - 420).forEach((l, i) => x.fillText(l, W / 2, 690 + i * 60));
  x.font = mono(26); x.letterSpacing = '4px'; x.fillStyle = 'rgba(29,25,21,.55)'; x.fillText('UNA CLAVIJA · DIEZ PUERTOS · UNO LIBRE', W / 2, H - 90); x.letterSpacing = '0px';
}

// La cara 1: la ficha del proyecto conectado. Arriba, quién es; en medio, sus cifras; abajo, qué piezas intervienen,
// unidas por un cordón (si el proyecto no detalla sus piezas, lo que se hizo, en una línea).
export function ficha(c, p) {
  const x = c.getContext('2d'), [W, H] = [c.width, c.height];
  fondoCara(x, W, H);
  x.textAlign = 'left'; x.textBaseline = 'alphabetic';
  // la banda del proyecto
  x.fillStyle = p.color; x.fillRect(70, 70, W - 140, 150);
  x.fillStyle = p.tinta; x.font = mono(34); x.letterSpacing = '5px';
  x.fillText(`LÍNEA ${p.n}`, 110, 160);
  x.textAlign = 'right'; x.fillText(`${p.tipo} · ${p.estado}`.toUpperCase(), W - 110, 160, W - 500); x.textAlign = 'left'; x.letterSpacing = '0px';
  x.fillStyle = TINTA; let cuerpo = 200; x.font = titulo(cuerpo);
  while (cuerpo > 120 && x.measureText(p.nombre).width > W - 220) { cuerpo -= 8; x.font = titulo(cuerpo); }
  x.fillText(p.nombre, 106, 410);
  x.font = cursiva(58); x.fillStyle = ROJO;
  partir(x, p.lema, W - 220).slice(0, 2).forEach((l, i) => x.fillText(l, 110, 500 + i * 64));
  // las cifras
  const y0 = 650, n = p.cifras.length, cw = (W - 220) / Math.max(n, 2);
  p.cifras.forEach(([num, que], i) => {
    const cx = 110 + cw * i;
    if (i) { x.fillStyle = 'rgba(29,25,21,.25)'; x.fillRect(cx - 24, y0 - 86, 2, 130); }
    x.fillStyle = TINTA; x.font = titulo(112); x.fillText(num, cx, y0, cw - 50);
    x.font = mono(26); x.fillStyle = 'rgba(29,25,21,.7)'; x.letterSpacing = '2px'; x.fillText(que.toUpperCase(), cx, y0 + 42, cw - 50); x.letterSpacing = '0px';
  });
  // qué interviene: cada pieza, un borne; entre ellos, el cordón
  const yb = 860;
  x.font = mono(24); x.fillStyle = 'rgba(29,25,21,.6)'; x.letterSpacing = '4px'; x.fillText(p.stack.length ? 'QUÉ INTERVIENE' : 'QUÉ SE HIZO', 110, yb - 78); x.letterSpacing = '0px';
  if (!p.stack.length) {
    const b = p.bloques.find(([t]) => t === 'Resultado') ?? p.bloques[0];
    x.font = texto(42); x.fillStyle = TINTA; partir(x, b[1], W - 220).slice(0, 2).forEach((l, i) => x.fillText(l, 110, yb - 14 + i * 54));
    return;
  }
  const piezas = [...p.stack, 'Fernando'], bw = (W - 220 - 60 * (piezas.length - 1)) / piezas.length;
  piezas.forEach((t, i) => {
    const bx = 110 + i * (bw + 60), ultimo = i === piezas.length - 1;
    if (i) {   // el cordón, con su comba
      x.strokeStyle = ROJO; x.lineWidth = 9; x.lineCap = 'round';
      x.beginPath(); x.moveTo(bx - 60 - 6, yb); x.quadraticCurveTo(bx - 30, yb + 34, bx + 6, yb); x.stroke();
    }
    x.fillStyle = ultimo ? TINTA : '#fbf7ee'; x.beginPath(); x.roundRect(bx, yb - 44, bw, 88, 44); x.fill();
    x.strokeStyle = ultimo ? TINTA : LATON; x.lineWidth = 4; x.stroke();
    x.fillStyle = LATON; x.beginPath(); x.arc(bx + 44, yb, 15, 0, 7); x.fill();
    x.fillStyle = '#0a0b0c'; x.beginPath(); x.arc(bx + 44, yb, 6, 0, 7); x.fill();
    x.fillStyle = ultimo ? CREMA : TINTA; x.font = texto(34, 600); x.fillText(t, bx + 74, yb + 12, bw - 92);
  });
}
