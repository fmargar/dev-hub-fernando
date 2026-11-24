// Lo impreso del ascensor, en canvas: el directorio del vestíbulo (fieltro negro con letras blancas de quita y pon), la
// placa del estudio, el cristal esmerilado de cada despacho con su nombre en pan de oro, el tablón de corcho de cada
// planta, los números pintados en el hueco, la esfera de planta, los botones y el certificado de la cabina, y el cartel
// de la planta en obras. Todo sale de los datos de los proyectos: cambiar uno no obliga a volver a hornear.
import { PROYECTOS } from '../../../kit-e1/js/datos.js';
import { cargarArte, partir } from '../../../kit-e1/js/coleccion.js';

export const TAM = {
  directorio: [1760, 1460], rotulo: [1600, 240], puertas: [1536, 1860], tablones: [2100, 1491], numeros: [1024, 768],
  esfera: [1024, 512], botones: [512, 384], botonera: [570, 1370], certificado: [390, 600], obras: [1160, 710],
};
const caslon = (t) => `700 ${t}px 'Caslon Cond'`;
const sans = (t, p = 400) => `${p} ${t}px 'Instrument Sans'`;
const serif = (t) => `italic 400 ${t}px 'Instrument Serif'`;
const mono = (t) => `500 ${t}px 'DM Mono'`;
const ORO = '#d9b46a', ORO_OSCURO = '#7a5a22';
export const ETIQUETA = (k) => (k === 0 ? 'V' : String(k));      // V: el vestíbulo

function cabe(x, texto, fuente, tam, ancho, min = 16) {
  let t = tam; x.font = fuente(t);
  while (x.measureText(texto).width > ancho && t > min) { t -= 2; x.font = fuente(t); }
  return t;
}
function grano(x, w, h, n, a) {             // motas finas (fieltro, papel, cristal)
  let s = 7; const r = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < n; i++) { x.fillStyle = `rgba(${r() < 0.5 ? '255,255,255' : '0,0,0'},${a * r()})`; x.fillRect(r() * w, r() * h, 1 + r() * 2, 1 + r() * 2); }
}

// ── El directorio: diez filas (las nueve plantas y la de obras); la web pone un botón encima de cada una ──
const DIR = { arriba: 250, fila: 112, izq: 90 };
export const filaDirectorio = (i) => { const y0 = DIR.arriba + i * DIR.fila; return [y0 / TAM.directorio[1], (y0 + DIR.fila) / TAM.directorio[1]]; };
export function directorio(c, encima = -1) {
  const x = c.getContext('2d'), [W, H] = TAM.directorio;
  x.fillStyle = '#141517'; x.fillRect(0, 0, W, H);
  // las ranuras del fieltro
  x.fillStyle = 'rgba(0,0,0,.55)'; for (let y = 34; y < H; y += 28) x.fillRect(0, y, W, 5);
  grano(x, W, H, 9000, 0.12);
  x.fillStyle = '#efece4'; x.textBaseline = 'alphabetic';
  x.textAlign = 'center'; x.font = mono(70); x.letterSpacing = '22px'; x.fillText('DIRECTORIO', W / 2, 140); x.letterSpacing = '0px';
  x.font = mono(30); x.fillStyle = 'rgba(239,236,228,.6)'; x.letterSpacing = '8px'; x.fillText('PLANTA · DESPACHO · QUÉ HAY', W / 2, 200); x.letterSpacing = '0px';
  const filas = [...PROYECTOS.map((p, i) => ({ k: i + 1, nombre: p.nombre.toUpperCase(), tipo: p.tipo.toUpperCase(), c: p.color })), { k: 10, nombre: 'EN OBRAS', tipo: 'AQUÍ VA EL SIGUIENTE' }];
  filas.forEach((f, i) => {
    const y = DIR.arriba + i * DIR.fila + 78;
    if (i === encima) { x.fillStyle = 'rgba(247,181,0,.16)'; x.fillRect(40, y - 72, W - 80, DIR.fila - 8); }
    x.fillStyle = i === encima ? '#F7B500' : '#efece4'; x.textAlign = 'left';
    x.font = mono(58); x.fillText(String(f.k).padStart(2, '0'), DIR.izq, y);
    x.fillText(f.nombre, DIR.izq + 150, y);
    x.textAlign = 'right'; x.fillStyle = i === encima ? '#F7B500' : 'rgba(239,236,228,.7)';
    cabe(x, f.tipo, mono, 38, 640); x.fillText(f.tipo, W - DIR.izq, y);
    // los puntos guía, como en los directorios de letras sueltas
    x.font = mono(58); const a = DIR.izq + 150 + x.measureText(f.nombre).width + 24; x.font = mono(38);
    const b = W - DIR.izq - x.measureText(f.tipo).width - 24;
    x.fillStyle = 'rgba(239,236,228,.35)'; for (let px = a; px < b; px += 22) x.fillRect(px, y - 10, 6, 6);
  });
}

export function rotulo(c) {
  const x = c.getContext('2d'), [W, H] = TAM.rotulo;
  const g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#e2c27f'); g.addColorStop(0.5, '#c9a15a'); g.addColorStop(1, '#a98443');
  x.fillStyle = g; x.fillRect(0, 0, W, H);
  x.textAlign = 'center'; x.textBaseline = 'middle';
  x.font = caslon(132); x.letterSpacing = '10px';
  x.fillStyle = 'rgba(255,240,200,.55)'; x.fillText('FERNANDO MARTÍNEZ', W / 2 + 2, H / 2 + 6);
  x.fillStyle = '#3b2a12'; x.fillText('FERNANDO MARTÍNEZ', W / 2, H / 2 + 4); x.letterSpacing = '0px';
}

// ── El cristal de cada despacho: esmerilado, con el nombre en pan de oro ──
const PUERTA = { cols: 3, w: 512, h: 620 };
export async function puertas(c) {
  const x = c.getContext('2d');
  for (let i = 0; i < PROYECTOS.length; i++) {
    const p = PROYECTOS[i], ox = (i % PUERTA.cols) * PUERTA.w, oy = Math.floor(i / PUERTA.cols) * PUERTA.h, W = PUERTA.w, H = PUERTA.h;
    x.save(); x.translate(ox, oy); x.beginPath(); x.rect(0, 0, W, H); x.clip();
    const g = x.createRadialGradient(W / 2, H * 0.55, 40, W / 2, H * 0.55, W);
    g.addColorStop(0, '#fbf3e2'); g.addColorStop(1, '#d9d1c1'); x.fillStyle = g; x.fillRect(0, 0, W, H);
    grano(x, W, H, 2500, 0.08);
    // el despacho detrás del cristal: sombras borrosas de una mesa y una lámpara del color del proyecto
    x.filter = 'blur(14px)'; x.fillStyle = `${p.color}55`; x.fillRect(70, H - 150, W - 140, 70); x.beginPath(); x.arc(W - 140, H - 230, 46, 0, 7); x.fill(); x.filter = 'none';
    x.textAlign = 'center'; x.textBaseline = 'alphabetic';
    x.fillStyle = ORO_OSCURO; x.font = mono(30); x.letterSpacing = '6px'; x.fillText(`PLANTA ${i + 1}`, W / 2 + 1, 92); x.letterSpacing = '0px';
    const t = cabe(x, p.nombre, caslon, 112, W - 70, 40), lineas = x.measureText(p.nombre).width > W - 70 ? partir(x, p.nombre, W - 70) : [p.nombre];
    lineas.forEach((l, k) => {
      const y = 230 + k * t * 0.9;
      x.fillStyle = ORO_OSCURO; x.fillText(l, W / 2 + 2, y + 3);
      const og = x.createLinearGradient(0, y - t, 0, y); og.addColorStop(0, '#f2d68e'); og.addColorStop(0.55, ORO); og.addColorStop(1, '#a8823f');
      x.fillStyle = og; x.fillText(l, W / 2, y);
    });
    x.fillStyle = ORO_OSCURO; x.font = serif(38); x.fillText(p.tipo, W / 2, 330 + (lineas.length - 1) * t * 0.9);
    x.strokeStyle = ORO; x.lineWidth = 3; x.beginPath(); x.moveTo(W / 2 - 70, 120); x.lineTo(W / 2 + 70, 120); x.stroke();
    x.restore();
  }
}

// ── El tablón de cada planta: la foto del proyecto clavada, una ficha a máquina y sus cifras en tarjetas ──
const TABLON = { cols: 3, w: 700, h: 497 };
export async function tablones(c) {
  const x = c.getContext('2d');
  const fotos = await Promise.all(PROYECTOS.map((p) => cargarArte(p.id)));
  PROYECTOS.forEach((p, i) => {
    const ox = (i % TABLON.cols) * TABLON.w, oy = Math.floor(i / TABLON.cols) * TABLON.h, W = TABLON.w, H = TABLON.h;
    x.save(); x.translate(ox, oy); x.beginPath(); x.rect(0, 0, W, H); x.clip();
    x.fillStyle = '#b98b59'; x.fillRect(0, 0, W, H); grano(x, W, H, 5000, 0.2);
    const sombra = () => { x.shadowColor = 'rgba(40,25,10,.4)'; x.shadowBlur = 10; x.shadowOffsetY = 5; };
    const chincheta = (cx, cy, col) => { x.save(); x.shadowColor = 'rgba(0,0,0,.4)'; x.shadowBlur = 4; x.shadowOffsetY = 3; x.fillStyle = col; x.beginPath(); x.arc(cx, cy, 11, 0, 7); x.fill(); x.restore(); };
    // la foto
    x.save(); x.translate(40, 44); x.rotate(-0.03); sombra(); x.fillStyle = '#f7f3ea'; x.fillRect(0, 0, 300, 360); x.shadowColor = 'transparent';
    if (fotos[i]) { const im = fotos[i], k = Math.max(276 / im.width, 290 / im.height); x.save(); x.beginPath(); x.rect(12, 12, 276, 290); x.clip(); x.drawImage(im, 12 + (276 - im.width * k) / 2, 12 + (290 - im.height * k) * 0.4, im.width * k, im.height * k); x.restore(); }
    else { x.fillStyle = p.color; x.fillRect(12, 12, 276, 290); }
    x.fillStyle = '#2a2520'; x.font = serif(28); x.textAlign = 'center'; x.fillText(p.nombre, 150, 340); x.restore();
    chincheta(190, 52, '#c0392b');
    // la ficha a máquina
    x.save(); x.translate(370, 40); x.rotate(0.02); sombra(); x.fillStyle = '#fbf8ef'; x.fillRect(0, 0, 290, 250); x.shadowColor = 'transparent';
    x.fillStyle = p.color; x.fillRect(0, 0, 290, 14);
    x.fillStyle = '#1d1915'; x.textAlign = 'left'; x.font = mono(17); x.fillText(`PLANTA ${i + 1} · ${p.estado.toUpperCase()}`.slice(0, 30), 18, 46);
    x.font = sans(21); partir(x, p.linea, 254).slice(0, 7).forEach((l, k) => x.fillText(l, 18, 82 + k * 25));
    x.restore(); chincheta(515, 50, '#2c5aa0');
    // las cifras, en tarjetas
    p.cifras.slice(0, 3).forEach(([n, t], k) => {
      x.save(); x.translate(372 + k * 104, 320); x.rotate((k - 1) * 0.04); sombra(); x.fillStyle = '#fffdf6'; x.fillRect(0, 0, 94, 120); x.shadowColor = 'transparent';
      x.fillStyle = '#1d1915'; x.textAlign = 'center'; cabe(x, String(n), caslon, 40, 84); x.fillText(String(n), 47, 54);
      x.font = mono(11); partir(x, String(t).toUpperCase(), 84).slice(0, 3).forEach((l, j) => x.fillText(l, 47, 78 + j * 13));
      x.restore(); chincheta(372 + k * 104 + 47, 330, '#e0b000');
    });
    x.restore();
  });
}

export function numeros(c) {
  const x = c.getContext('2d'), [W] = TAM.numeros, L = W / 4;
  x.fillStyle = '#7d7a74'; x.fillRect(0, 0, W, c.height);
  x.textAlign = 'center'; x.textBaseline = 'middle';
  for (let k = 0; k < 11; k++) {
    const cx = (k % 4) * L + L / 2, cy = Math.floor(k / 4) * L + L / 2;
    x.fillStyle = 'rgba(240,236,226,.88)'; x.font = caslon(k === 10 ? 170 : 210); x.fillText(ETIQUETA(k), cx, cy + 10);
  }
  grano(x, W, c.height, 6000, 0.25);
}

// ── La esfera: media luna crema con las once marcas, de V (a la izquierda) a 10 (a la derecha) ──
// la escala no llega al borde de abajo (allí la V y el 10 se cortaban): de 9° a 171°
export const anguloPlanta = (k) => 0.16 + (Math.PI - 0.32) * (1 - k / 10);       // en radianes, desde la derecha
export function esfera(c) {
  const x = c.getContext('2d'), [W, H] = TAM.esfera, cx = W / 2, cy = H, r = H;
  x.fillStyle = '#efe6d2'; x.fillRect(0, 0, W, H);
  x.strokeStyle = '#3a2c18'; x.lineWidth = 6; x.beginPath(); x.arc(cx, cy, r - 70, Math.PI, 0); x.stroke();
  x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillStyle = '#2b2116';
  for (let k = 0; k <= 10; k++) {
    const a = anguloPlanta(k), co = Math.cos(a), si = Math.sin(a);
    x.lineWidth = 6; x.beginPath(); x.moveTo(cx + co * (r - 70), cy - si * (r - 70)); x.lineTo(cx + co * (r - 104), cy - si * (r - 104)); x.stroke();
    x.font = caslon(k === 0 ? 62 : 56); x.fillText(ETIQUETA(k), cx + co * (r - 38), cy - si * (r - 38) + 3);
  }
  for (let k = 0; k < 10; k++) { const a = anguloPlanta(k + 0.5); x.lineWidth = 3; x.beginPath(); x.moveTo(cx + Math.cos(a) * (r - 70), cy - Math.sin(a) * (r - 70)); x.lineTo(cx + Math.cos(a) * (r - 88), cy - Math.sin(a) * (r - 88)); x.stroke(); }
  x.font = mono(26); x.fillStyle = 'rgba(43,33,22,.7)'; x.letterSpacing = '6px'; x.fillText('FM · 1931', cx, H - 150); x.letterSpacing = '0px';
}

// ── Los números de los botones: un atlas 4 × 3 (V, 1…10 y la campana) ──
export function botones(c) {
  const x = c.getContext('2d'), L = 128;
  for (let k = 0; k < 12; k++) {
    const ox = (k % 4) * L, oy = Math.floor(k / 4) * L;
    x.fillStyle = k === 11 ? '#8f3324' : '#efe8d8'; x.fillRect(ox, oy, L, L);
    x.fillStyle = k === 11 ? '#f6e7cf' : '#2b2116'; x.textAlign = 'center'; x.textBaseline = 'middle';
    if (k === 11) {      // la campana de alarma
      x.beginPath(); x.moveTo(ox + 38, oy + 84); x.quadraticCurveTo(ox + 42, oy + 36, ox + 64, oy + 34); x.quadraticCurveTo(ox + 86, oy + 36, ox + 90, oy + 84); x.closePath(); x.fill();
      x.beginPath(); x.arc(ox + 64, oy + 92, 8, 0, 7); x.fill();
    } else { x.font = caslon(k === 10 ? 74 : 86); x.fillText(ETIQUETA(k), ox + L / 2, oy + L / 2 + 5); }
  }
}

// ── La placa de la botonera: junto a cada botón, su planta grabada (nombre y qué es). `encendida`: la planta pedida ──
// `datos`: los de la escena (la placa y la posición de cada botón), para que cada fila caiga a la altura de su botón
export function botonera(c, datos, encendida = -1) {
  const x = c.getContext('2d'), [W, H] = TAM.botonera, B = datos.botonera, PX = W / (B.ancho - 0.3);
  const x0 = B.x - (B.ancho - 0.3) / 2, z1 = B.z + (B.alto - 0.3) / 2;
  const g = x.createLinearGradient(0, 0, W, 0); g.addColorStop(0, '#b8914c'); g.addColorStop(0.5, '#d4ae66'); g.addColorStop(1, '#b38a47');
  x.fillStyle = g; x.fillRect(0, 0, W, H);
  x.strokeStyle = 'rgba(70,48,18,.55)'; x.lineWidth = 3; x.strokeRect(14, 14, W - 28, H - 28);
  x.textBaseline = 'alphabetic'; x.textAlign = 'left';
  const filas = { 0: ['Vestíbulo', 'ENTRADA'], 10: ['En obras', 'AQUÍ VA EL SIGUIENTE'] };
  PROYECTOS.forEach((p, i) => { filas[i + 1] = [p.nombre, p.tipo.toUpperCase()]; });
  for (const b of datos.botones) {
    const cy = (z1 - b.z) * PX, tx = (b.x + 0.62 - x0) * PX, ancho = W - tx - 22;
    const [nombre, tipo] = b.planta == null ? ['Alarma', 'SOLO EN CASO DE AVERÍA'] : filas[b.planta];
    const luz = b.planta === encendida;
    // el grabado: la letra en oscuro con un filo claro debajo, como el latón rebajado y relleno de esmalte
    x.font = caslon(cabe(x, nombre, caslon, 50, ancho)); x.fillStyle = 'rgba(255,236,190,.55)'; x.fillText(nombre, tx + 1, cy + 3);
    x.fillStyle = luz ? '#7a1f0c' : '#2b1d0b'; x.fillText(nombre, tx, cy + 1);
    x.font = mono(cabe(x, tipo, mono, 19, ancho, 12)); x.fillStyle = luz ? 'rgba(122,31,12,.9)' : 'rgba(43,29,11,.72)'; x.fillText(tipo, tx + 1, cy + 30);
    if (b.planta !== 10 && b.planta != null) { x.fillStyle = 'rgba(70,48,18,.28)'; x.fillRect(tx, cy + 44, ancho, 2); }
  }
}

export function certificado(c) {
  const x = c.getContext('2d'), [W, H] = TAM.certificado;
  x.fillStyle = '#f4eedf'; x.fillRect(0, 0, W, H); grano(x, W, H, 1500, 0.08);
  x.strokeStyle = '#3a2c18'; x.lineWidth = 3; x.strokeRect(16, 16, W - 32, H - 32); x.lineWidth = 1; x.strokeRect(24, 24, W - 48, H - 48);
  x.fillStyle = '#2b2116'; x.textAlign = 'center'; x.textBaseline = 'alphabetic';
  x.font = mono(17); x.letterSpacing = '4px'; x.fillText('ASCENSOR Nº 1', W / 2, 76); x.letterSpacing = '0px';
  x.font = caslon(64); x.fillText('Carga', W / 2, 160); x.font = caslon(80); x.fillText('4 personas', W / 2, 240);
  x.font = mono(22); x.fillText('300 KG', W / 2, 286);
  x.beginPath(); x.moveTo(70, 320); x.lineTo(W - 70, 320); x.stroke();
  x.font = serif(28); x.fillText('Revisado y en servicio', W / 2, 372);
  x.font = mono(17); x.fillText('NOVIEMBRE 2026', W / 2, 410);
  // el sello del taller, en tinta azul
  x.save(); x.translate(W / 2, 500); x.rotate(-0.12); x.strokeStyle = 'rgba(40,70,150,.75)'; x.fillStyle = 'rgba(40,70,150,.75)'; x.lineWidth = 4;
  x.beginPath(); x.arc(0, 0, 54, 0, 7); x.stroke(); x.font = caslon(50); x.fillText('FM', 0, 16); x.restore();
}

export function obras(c) {
  const x = c.getContext('2d'), [W, H] = TAM.obras;
  x.fillStyle = '#f2efe6'; x.fillRect(0, 0, W, H);
  // el borde a franjas de obra
  x.save(); x.beginPath(); x.rect(0, 0, W, H); x.rect(36, 36, W - 72, H - 72); x.clip('evenodd');
  x.fillStyle = '#e6b422'; x.fillRect(0, 0, W, H); x.fillStyle = '#1d1915';
  for (let i = -H; i < W + H; i += 60) { x.beginPath(); x.moveTo(i, 0); x.lineTo(i + 30, 0); x.lineTo(i + 30 - H, H); x.lineTo(i - H, H); x.closePath(); x.fill(); }
  x.restore();
  x.fillStyle = '#1d1915'; x.textAlign = 'center'; x.textBaseline = 'alphabetic';
  x.font = mono(36); x.letterSpacing = '12px'; x.fillText('PLANTA 10', W / 2, 150); x.letterSpacing = '0px';
  x.font = caslon(150); x.fillText('En obras', W / 2, 330);
  x.font = serif(58); x.fillText('Aquí va el siguiente proyecto.', W / 2, 440);
  x.font = mono(24); x.fillStyle = '#6d655b'; x.fillText('UNA PLANTA Y UN BOTÓN MÁS', W / 2, 560);
}
