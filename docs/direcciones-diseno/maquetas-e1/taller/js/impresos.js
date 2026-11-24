// Lo pintado del tablero: el gris pizarra, la perforación, la silueta blanca de cada herramienta (con las mismas
// piezas con las que se montó en Blender, un poco engordadas, como se pintan a brocha) y, debajo, su número y su
// nombre a plantilla. El hueco libre lleva una silueta discontinua: «aquí va el siguiente».
import { PROYECTOS } from '../../../kit-e1/js/datos.js';

const PX = 128;                                   // píxeles de canvas por unidad (1 = 10 cm)
const PIZARRA = '#3b454d', BLANCO = '#eceae3';
const mono = (t) => `500 ${t}px 'DM Mono'`;
const serif = (t) => `italic 400 ${t}px 'Instrument Serif'`;
export const tam = (T) => [Math.round((T.x1 - T.x0) * PX), Math.round((T.z1 - T.z0) * PX)];

export function tablero(c, D) {
  const T = D.tablero, x = c.getContext('2d'), [W, H] = [c.width, c.height];
  const X = (v) => (v - T.x0) * PX, Z = (v) => (T.z1 - v) * PX;
  x.fillStyle = PIZARRA; x.fillRect(0, 0, W, H);
  // un poco de veta de brocha, horizontal, para que no sea un color plano
  for (let i = 0; i < 260; i++) {
    const y = Math.random() * H; x.fillStyle = `rgba(255,255,255,${0.008 + Math.random() * 0.012})`;
    x.fillRect(0, y, W, 1 + Math.random() * 2);
  }
  // la perforación: cada agujero con su sombra y un filo de luz abajo
  const p = D.agujeros * PX;
  for (let gy = p / 2; gy < H; gy += p) for (let gx = p / 2; gx < W; gx += p) {
    x.fillStyle = 'rgba(255,255,255,.07)'; x.beginPath(); x.arc(gx, gy + 1.5, 5.2, 0, 7); x.fill();
    x.fillStyle = '#161b1f'; x.beginPath(); x.arc(gx, gy, 4.6, 0, 7); x.fill();
  }
  // las siluetas
  const engorde = 0.06 * PX;
  D.orden.forEach((id, i) => {
    const [gx, gz] = D.huecos[i], h = D.herramientas[id];
    const fila = Math.floor(i / D.cols), pie = Z(T.z1 - D.hueco_z * (fila + 1)) - 16;
    x.save();
    if (!h) {
      // el hueco libre: un contorno discontinuo y el letrero
      x.strokeStyle = BLANCO; x.lineWidth = 5; x.setLineDash([22, 14]);
      x.beginPath(); x.roundRect(X(gx - 0.75), Z(gz - 0.25), 1.5 * PX, 3.4 * PX, 0.3 * PX); x.stroke();
      x.setLineDash([]); x.fillStyle = BLANCO; x.textAlign = 'center';
      x.font = serif(62); x.fillText('Aquí va', X(gx), Z(gz - 1.75)); x.fillText('el siguiente', X(gx), Z(gz - 1.75) + 64);
      x.font = mono(26); x.fillText('10 · LIBRE', X(gx), pie);
      x.restore(); return;
    }
    const [ax, az] = h.agujero, px = (v) => X(v - ax + gx), pz = (v) => Z(v - az + gz);
    x.fillStyle = BLANCO; x.strokeStyle = BLANCO; x.lineWidth = engorde * 2; x.lineJoin = 'round';
    for (const pz_ of h.piezas) {
      const [t, ...a] = pz_;
      x.beginPath();
      if (t === 'caja') { const [cx, cz, w, al, , , bis] = a; const r = Math.min(bis * PX, w * PX / 2, al * PX / 2); x.roundRect(px(cx - w / 2), pz(cz + al / 2), w * PX, al * PX, r); x.fill(); x.stroke(); }
      else if (t === 'disco') { const [cx, cz, r] = a; x.arc(px(cx), pz(cz), r * PX, 0, 7); x.fill(); x.stroke(); }
      else if (t === 'aro') { const [cx, cz, r1, r2] = a; x.lineWidth = (r2 - r1) * PX + engorde * 2; x.arc(px(cx), pz(cz), (r1 + r2) / 2 * PX, 0, 7); x.stroke(); x.lineWidth = engorde * 2; }
      else if (t === 'poli') { const [per] = a; per.forEach(([vx, vz], k) => (k ? x.lineTo(px(vx), pz(vz)) : x.moveTo(px(vx), pz(vz)))); x.closePath(); x.fill(); x.stroke(); }
    }
    // a plantilla, al pie del hueco
    const pr = PROYECTOS.find((q) => q.id === id);
    // el rótulo cabe en su columna: los nombres largos («Cálculo Exacto», «Vados de Marbella») bajan de cuerpo
    const rotulo = `${pr.n} · ${pr.nombre.toUpperCase()}`, columna = Math.abs(D.huecos[1][0] - D.huecos[0][0]) * PX - 36;
    x.textAlign = 'center'; x.fillStyle = BLANCO; x.letterSpacing = '3px';
    let cuerpo = 26; x.font = mono(cuerpo);
    while (cuerpo > 19 && x.measureText(rotulo).width > columna) { cuerpo -= 1; x.font = mono(cuerpo); x.letterSpacing = `${(3 * cuerpo / 26).toFixed(1)}px`; }
    x.fillText(rotulo, X(gx), pie, columna);
    x.restore();
  });
}
