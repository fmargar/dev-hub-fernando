// Lo pintado de la mesa: la cara de aluminio anodizado con sus ranuras, escalas y serigrafía, la cinta de rotular de
// cada canal (el nombre del proyecto, escrito a mano como en cualquier estudio) y los medidores de leds.
// La cara se repinta solo cuando cambia algo (qué canal está abierto, los solos y los silencios); los medidores,
// cada uno en su lienzo diminuto, mientras bailan.
import { PROYECTOS } from '../../../kit-e1/js/datos.js';

const PX = 128;                                   // píxeles de canvas por unidad (1 = 10 cm)
const mono = (t) => `500 ${t}px 'DM Mono'`;
const serif = (t) => `italic 400 ${t}px 'Instrument Serif'`;
const titulo = (t) => `700 ${t}px 'Caslon Cond'`;
export const tam = (D) => [Math.round(-2 * D.x0 * PX), Math.round(D.fondo * PX)];
export const TAM_MEDIDOR = [16, 96];
const ESCALA = [['10', 1], ['5', 0.86], ['0', 0.72], ['5', 0.58], ['10', 0.44], ['20', 0.3], ['40', 0.16], ['∞', 0]];

// estado: { abierto: índice o -1, apagado: (i) => bool, solo: (i) => bool, mudo: (i) => bool }
// Lo fijo (el aluminio, las escalas, la serigrafía) se pinta una sola vez en un lienzo aparte; cada repintado lo copia
// y pone encima lo que cambia (las cintas, las letras de solo y silencio y los velos): sin gráfica, repintarlo todo
// paraba la página más de 100 ms en cada cambio de canal.
let fijo = null;
export function cara(c, D, estado) {
  const x = c.getContext('2d'), W = c.width, H = c.height;
  if (!fijo) { fijo = document.createElement('canvas'); fijo.width = W; fijo.height = H; pinta(fijo.getContext('2d'), W, H, D, null); }
  x.drawImage(fijo, 0, 0);
  pinta(x, W, H, D, estado);
}
function pinta(x, W, H, D, estado) {
  const base = !estado;
  const X = (v) => (v - D.x0) * PX, Y = (v) => (D.fondo - v) * PX;
  x.save();
  if (base) {
  x.fillStyle = '#2a2c31'; x.fillRect(0, 0, W, H);
  // el cepillado del aluminio: rayas finas a lo ancho (siempre las mismas: el repintado no puede parpadear)
  let s = 7;
  const azar = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  for (let i = 0; i < 420; i++) { x.fillStyle = `rgba(255,255,255,${0.006 + azar() * 0.014})`; x.fillRect(0, azar() * H, W, 1 + azar() * 1.5); }
  // la sección maestra, un tono más clara
  x.fillStyle = 'rgba(255,255,255,.035)'; x.fillRect(X(D.maestro), 0, W - X(D.maestro), H);
  }
  const F = D.fader, M = D.medidor, B = D.boton;
  D.orden.forEach((id, i) => {
    const cx = D.x0 + D.paso * (i + 0.5), p = PROYECTOS.find((q) => q.id === id), abierto = !base && estado.abierto === i, apagado = !base && estado.apagado(i);
    if (base) {
    // el filete entre canales
    x.fillStyle = 'rgba(0,0,0,.45)'; x.fillRect(X(cx + D.paso / 2) - 1.5, 0, 3, H);
    x.fillStyle = 'rgba(255,255,255,.06)'; x.fillRect(X(cx + D.paso / 2) + 1.5, 0, 1, H);
    // el número del canal, arriba
    x.textAlign = 'center'; x.fillStyle = '#c9c4b8'; x.font = mono(26); x.letterSpacing = '2px';
    x.fillText(String(i + 1).padStart(2, '0'), X(cx), Y(D.fondo) + 40);
    // los aros de los mandos: una escala de puntos alrededor
    D.mandos.forEach((my, k) => {
      for (let a = -135; a <= 135; a += 27) {
        const r = 0.36 * PX, g = (a - 90) * Math.PI / 180;
        x.fillStyle = a === 0 ? '#e9e4d8' : '#8d8a82'; x.beginPath(); x.arc(X(cx) + r * Math.cos(g), Y(my) + r * Math.sin(g), a === 0 ? 3 : 2, 0, 7); x.fill();
      }
      x.font = mono(13); x.fillStyle = '#9d998f'; x.letterSpacing = '1.5px';
      x.fillText(k ? 'GANANCIA' : 'PANORAMA', X(cx), Y(my) + 0.36 * PX + 19);
    });
    }
    if (!base) {
    // solo y silencio: su letra, encima de cada botón
    x.font = mono(14); x.letterSpacing = '1.5px';
    x.fillStyle = estado.solo(i) ? '#f7c948' : '#9d998f'; x.fillText('SOLO', X(cx - B.dx), Y(B.y + B.fondo / 2) - 9);
    x.textAlign = 'center'; x.fillStyle = estado.mudo(i) ? '#ff7a6b' : '#9d998f'; x.fillText('SIL.', X(cx + B.dx), Y(B.y + B.fondo / 2) - 9);
    }
    if (base) {
    // la ranura del fader, con su escala
    const fx = X(cx + F.dx), y0 = Y(F.y0), y1 = Y(F.y0 + F.rec);
    x.fillStyle = '#08090a'; x.beginPath(); x.roundRect(fx - 6, y1 - 34, 12, y0 - y1 + 68, 6); x.fill();
    x.fillStyle = 'rgba(255,255,255,.1)'; x.fillRect(fx + 6, y1 - 30, 1, y0 - y1 + 60);
    x.font = mono(12); x.textAlign = 'right'; x.letterSpacing = '0px';
    for (const [t, v] of ESCALA) {
      const y = y0 + (y1 - y0) * v;
      x.fillStyle = t === '0' ? '#e9e4d8' : '#8d8a82'; x.fillRect(fx - 46, y - 1, 12, t === '0' ? 3 : 2);
      x.fillText(t, fx - 50, y + 4);
    }
    // el hueco del medidor
    x.fillStyle = '#060707'; x.beginPath(); x.roundRect(X(cx + M.dx - M.ancho / 2) - 5, Y(M.y1) - 5, M.ancho * PX + 10, (M.y1 - M.y0) * PX + 10, 4); x.fill();
    }
    if (base) return;
    // la cinta de rotular: crema, escrita a mano; abierta, se enciende con el color del proyecto
    const tx = X(cx - D.paso / 2) + 9, ty = Y(0.92), tw = D.paso * PX - 18, th = 0.78 * PX;
    x.textAlign = 'center';
    if (!p) {
      x.strokeStyle = '#8d8a82'; x.lineWidth = 2; x.setLineDash([9, 7]); x.strokeRect(tx + 1, ty + 1, tw - 2, th - 2); x.setLineDash([]);
      x.fillStyle = '#a9a59b'; x.font = serif(34); x.fillText('libre', X(cx), ty + 46);
      x.font = mono(13); x.letterSpacing = '1.5px'; x.fillText('EL SIGUIENTE', X(cx), ty + 76);
    } else {
      x.fillStyle = abierto ? p.color : '#ece6d6'; x.fillRect(tx, ty, tw, th);
      if (abierto) { x.fillStyle = 'rgba(255,255,255,.14)'; x.fillRect(tx, ty, tw, 5); }
      else { x.fillStyle = p.color; x.fillRect(tx, ty, tw, 9); }
      x.fillStyle = abierto ? '#ffffff' : '#1d1915';
      let cuerpo = 40; const corto = p.nombre.replace(' de Marbella', '').replace('Equipo de agentes', 'Agentes').replace('IA en el ERP', 'IA · ERP');
      x.font = serif(cuerpo);
      while (cuerpo > 22 && x.measureText(corto).width > tw - 16) { cuerpo -= 1; x.font = serif(cuerpo); }
      x.fillText(corto, X(cx), ty + 54);
      x.font = mono(14); x.letterSpacing = '1.5px'; x.fillStyle = abierto ? 'rgba(255,255,255,.8)' : '#6d655b';
      x.fillText(`CANAL ${p.n}`, X(cx), ty + 82);
    }
    // lo que no suena (en silencio, o fuera del solo), y los demás cuando hay un canal abierto: a oscuras
    const velo = apagado ? 0.62 : estado.abierto >= 0 && !abierto ? 0.34 : 0;
    if (velo) { x.fillStyle = `rgba(10,11,13,${velo})`; x.fillRect(X(cx - D.paso / 2), 0, D.paso * PX, H); }
  });
  if (!base) { x.restore(); return; }
  // la sección maestra: la marca (inventada), el fader de salida y el mando de escucha
  const xm = (D.maestro - D.x0) / 2, cm = X(xm);
  x.textAlign = 'center'; x.fillStyle = '#e9e4d8'; x.font = titulo(54); x.letterSpacing = '1px'; x.fillText('SONORA', cm, Y(D.fondo) + 64);
  x.font = mono(14); x.letterSpacing = '3px'; x.fillStyle = '#9d998f'; x.fillText('FM · DIEZ CANALES', cm, Y(D.fondo) + 90);
  x.fillText('ESCUCHA', cm, Y(6.35) + 0.56 * PX + 32);
  for (let a = -135; a <= 135; a += 22.5) {
    const r = 0.72 * PX, g = (a - 90) * Math.PI / 180;
    x.fillStyle = '#8d8a82'; x.beginPath(); x.arc(cm + r * Math.cos(g), Y(6.35) + r * Math.sin(g), 2.5, 0, 7); x.fill();
  }
  const fx = X(xm - 0.35), y0 = Y(F.y0), y1 = Y(F.y0 + F.rec);
  x.fillStyle = '#08090a'; x.beginPath(); x.roundRect(fx - 7, y1 - 34, 14, y0 - y1 + 68, 7); x.fill();
  x.font = mono(12); x.textAlign = 'right'; x.letterSpacing = '0px';
  for (const [t, v] of ESCALA) { const y = y0 + (y1 - y0) * v; x.fillStyle = t === '0' ? '#e9e4d8' : '#8d8a82'; x.fillRect(fx - 52, y - 1, 12, 2); x.fillText(t, fx - 56, y + 4); }
  for (const dx of [0.55, 0.85]) { x.fillStyle = '#060707'; x.beginPath(); x.roundRect(X(xm + dx - M.ancho / 2) - 5, Y(M.y1) - 5, M.ancho * PX + 10, (M.y1 - M.y0) * PX + 10, 4); x.fill(); }
  x.textAlign = 'center'; x.font = mono(14); x.letterSpacing = '3px'; x.fillStyle = '#9d998f';
  x.fillText('SALIDA', cm + 0.2 * PX, Y(M.y0) + 34); x.fillText('I   D', X(xm + 0.7), Y(M.y1) - 14);
  x.fillStyle = '#c9c4b8'; x.fillText('MAESTRO', cm, Y(0.5));
  x.restore();
}

// Un medidor de 16 leds: verdes, tres ámbar y dos rojos. `nivel` y `pico` de 0 a 1.
const LEDS = 16;
export function medidor(c, nivel, pico = 0) {
  const x = c.getContext('2d'), W = c.width, H = c.height, alto = H / LEDS, n = Math.round(nivel * LEDS), np = Math.round(pico * LEDS);
  x.fillStyle = '#050606'; x.fillRect(0, 0, W, H);
  for (let k = 0; k < LEDS; k++) {
    const on = k < n || (np > n && k === np - 1);
    const col = k >= 14 ? (on ? '#ff4a3a' : '#1c0a08') : k >= 11 ? (on ? '#ffc23a' : '#1b1506') : (on ? '#49e07a' : '#08170d');
    x.fillStyle = col; x.fillRect(1, H - (k + 1) * alto + 1, W - 2, alto - 2);
  }
}
