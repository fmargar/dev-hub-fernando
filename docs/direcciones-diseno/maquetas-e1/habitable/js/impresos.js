// Lo impreso de la maqueta: los rótulos de las parcelas (una tira de cartulina por edificio, todos en un canvas) y el
// cartel encima de la pantalla de la plaza. Como en una maqueta de concurso: número, nombre y qué es, a máquina.
import { PROYECTOS } from '../../../kit-e1/js/datos.js';

export const TAM = { rotulos: [1024, 1920], marquesina: [1536, 130] };
const FILA = TAM.rotulos[1] / 10;
const PAPEL = '#f7f4ec', TINTA = '#1d1915', GRIS = '#6d655b';
const caslon = (t) => `700 ${t}px 'Caslon Cond'`;
const serif = (t) => `italic 400 ${t}px 'Instrument Serif'`;
const mono = (t) => `500 ${t}px 'DM Mono'`;

function cabe(x, texto, fuente, tam, ancho, min = 20) {
  let t = tam; x.font = fuente(t);
  while (x.measureText(texto).width > ancho && t > min) { t -= 2; x.font = fuente(t); }
  return t;
}

// `orden`: los ids de las parcelas en el orden de sus tiras en el canvas (el de la escena); 'siguiente' es la vacía
export function rotulos(c, orden) {
  const x = c.getContext('2d'), W = c.width;
  x.fillStyle = PAPEL; x.fillRect(0, 0, W, c.height);
  orden.forEach((id, i) => {
    const y = i * FILA, p = PROYECTOS.find((q) => q.id === id);
    x.save(); x.translate(0, y);
    x.strokeStyle = 'rgba(29,25,21,.55)'; x.lineWidth = 3;
    if (!p) {
      x.setLineDash([18, 12]); x.strokeRect(14, 14, W - 28, FILA - 28); x.setLineDash([]);
      x.fillStyle = GRIS; x.textAlign = 'center'; x.textBaseline = 'middle';
      x.font = serif(70); x.fillText('Aquí va el siguiente', W / 2, FILA / 2 + 4);
      x.restore(); return;
    }
    x.strokeRect(14, 14, W - 28, FILA - 28);
    // la casilla del número, con el color del proyecto
    x.fillStyle = p.color; x.fillRect(14, 14, 150, FILA - 28);
    x.fillStyle = '#fff'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.font = mono(64); x.fillText(p.n, 89, FILA / 2 + 3);
    x.textAlign = 'left'; x.textBaseline = 'alphabetic'; x.fillStyle = TINTA;
    cabe(x, p.nombre, caslon, 92, W - 230); x.fillText(p.nombre, 194, 104);
    x.fillStyle = GRIS; cabe(x, p.tipo.toUpperCase(), mono, 36, W - 230); x.fillText(p.tipo.toUpperCase(), 196, 152);
    x.restore();
  });
}

// el cartel de la pantalla: qué se está viendo
export function marquesina(c, p) {
  const x = c.getContext('2d'), [W, H] = TAM.marquesina;
  x.fillStyle = '#16171a'; x.fillRect(0, 0, W, H);
  x.textBaseline = 'middle'; x.textAlign = 'center';
  const texto = p ? `EN PANTALLA · ${p.nombre.toUpperCase()} · ${p.demo ? 'DEMO' : 'TRÁILER'}` : 'LA PLAZA · ELIGE UN EDIFICIO';
  x.fillStyle = p ? '#F7B500' : '#e9e3d6';
  x.save(); x.font = mono(62); x.letterSpacing = '10px';
  cabe(x, texto, mono, 62, W - 80); x.letterSpacing = '8px'; x.fillText(texto, W / 2, H / 2 + 3); x.restore();
  // dos filas de bombillas, como un cartel de cine de maqueta
  x.fillStyle = 'rgba(255, 220, 150, .55)';
  for (let i = 0; i < 48; i++) { const cx = 20 + (W - 40) * i / 47; for (const cy of [10, H - 10]) { x.beginPath(); x.arc(cx, cy, 4, 0, 7); x.fill(); } }
}
