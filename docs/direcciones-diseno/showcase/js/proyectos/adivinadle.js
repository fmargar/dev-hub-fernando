// Interior de Adivinadle: la tapa sale y dentro de la caja se juega una ronda.
// SIMULACIÓN: doce personajes inventados para esta demo. La mecánica (cada intento dice en qué
// te acercas) es la del modo clásico del juego real.

const css = new Promise((ok) => {
  const l = document.createElement('link');
  l.rel = 'stylesheet'; l.href = 'css/adivinadle.css'; l.onload = l.onerror = ok;
  document.head.append(l);
});

const COLUMNAS = ['Especie', 'Elemento', 'Rol', 'Alcance', 'Año'];
// nombre, especie, elemento(s), rol, alcance, año de estreno (todo inventado)
const ELENCO = [
  ['Brasa', 'Humano', ['Fuego'], 'Guerrero', 'Cuerpo a cuerpo', 2016],
  ['Musgo', 'Gólem', ['Tierra', 'Planta'], 'Tanque', 'Cuerpo a cuerpo', 2012],
  ['Voltio', 'Robot', ['Rayo'], 'Apoyo', 'Distancia', 2019],
  ['Nieblina', 'Humano', ['Hielo'], 'Mago', 'Distancia', 2014],
  ['Ancla', 'Humano', ['Agua'], 'Tanque', 'Cuerpo a cuerpo', 2011],
  ['Pixela', 'Humano', ['Rayo'], 'Apoyo', 'Distancia', 2021],
  ['Ráfaga', 'Ave', ['Aire'], 'Tirador', 'Distancia', 2017],
  ['Tuerca', 'Humano', ['Rayo', 'Tierra'], 'Apoyo', 'Cuerpo a cuerpo', 2018],
  ['Don Seta', 'Planta', ['Planta'], 'Mago', 'Distancia', 2013],
  ['Sombra', 'Humano', ['Sombra'], 'Asesino', 'Cuerpo a cuerpo', 2015],
  ['Coral', 'Sirena', ['Agua'], 'Guerrero', 'Cuerpo a cuerpo', 2020],
  ['Chispa', 'Zorro', ['Fuego'], 'Asesino', 'Cuerpo a cuerpo', 2022],
];
const MAX = 6;
const ORDEN_CASOS = [6, 1, 10, 3, 8, 11, 0, 5, 9, 2, 7, 4];
const retrato = (i) => `background-position:${(i % 4) * 33.333}% ${Math.floor(i / 4) * 50}%`;
const espera = (ms) => new Promise((r) => setTimeout(r, ms));

// Compara un intento con la solución: 'ok' coincide, 'casi' coincide en parte, 'no' no coincide.
export function comparar(intento, solucion) {
  const a = ELENCO[intento], b = ELENCO[solucion];
  const comun = a[2].filter((e) => b[2].includes(e)).length;
  return [
    { v: a[1], e: a[1] === b[1] ? 'ok' : 'no' },
    { v: a[2].join(' · '), e: comun === a[2].length && comun === b[2].length ? 'ok' : comun ? 'casi' : 'no' },
    { v: a[3], e: a[3] === b[3] ? 'ok' : 'no' },
    { v: a[4], e: a[4] === b[4] ? 'ok' : 'no' },
    { v: a[5], e: a[5] === b[5] ? 'ok' : 'no', flecha: a[5] === b[5] ? '' : a[5] < b[5] ? '↑' : '↓' },
  ];
}
const DICHO = { ok: 'coincide', casi: 'coincide en parte', no: 'no coincide' };
const MARCA = { ok: '✓', casi: '≈', no: '✕' };

export async function montar({ pieza, RM, estrecho }) {
  await css;
  const dia = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 864e5);
  let caso = dia % 12, solucion, intentos, fin;

  const tablero = document.createElement('div');
  tablero.className = `adv${estrecho ? ' adv-suelto' : ''}`;
  tablero.innerHTML = `<div class="adv-in">
    <div class="adv-izq">
      <p class="adv-sobre"><b>Sospechosos</b><span>elige uno</span></p>
      <div class="adv-fichas" role="group" aria-label="Sospechosos">${ELENCO.map((p, i) => `<button type="button" class="ficha" data-i="${i}" style="--d:${i * 38}ms" aria-label="${p[0]}"><span class="ficha-tapa"><i style="${retrato(i)}"></i><b>${p[0]}</b></span></button>`).join('')}</div>
    </div>
    <div class="adv-der">
      <div class="adv-cab">
        <div><p class="adv-caso"></p><p class="adv-titulo">¿Quién es <em>hoy</em>?</p></div>
        <div class="adv-misterio"><span class="mis-cara mis-a">?</span><span class="mis-cara mis-b"><i></i></span></div>
      </div>
      <div class="adv-cols" aria-hidden="true"><span>Intento</span>${COLUMNAS.map((c) => `<span>${c}</span>`).join('')}</div>
      <ol class="adv-filas"></ol>
      <p class="adv-leyenda"><span class="ley ok">✓ coincide</span><span class="ley casi">≈ coincide en parte</span><span class="ley no">✕ no coincide</span><span class="ley fl">↑ ↓ el año es mayor o menor</span></p>
      <div class="adv-fin" hidden><span class="adv-sello"></span><p class="adv-frase"></p><button type="button" class="boton boton-ambar" data-otro><span class="boton-tapa">Otro caso</span></button></div>
      <p class="adv-voz" aria-live="polite"></p>
    </div>
  </div>`;
  const q = (s) => tablero.querySelector(s);
  const filas = q('.adv-filas'), voz = q('.adv-voz'), finCaja = q('.adv-fin'), misterio = q('.adv-misterio');

  function nuevoCaso() {
    solucion = ORDEN_CASOS[caso % 12]; intentos = []; fin = false;
    q('.adv-caso').textContent = `Caso n.º ${dia + (caso - (dia % 12))} · modo clásico`;
    filas.innerHTML = Array.from({ length: MAX }, (_, i) => `<li class="fila-adv vacia"><span class="hueco-n">${i + 1}</span></li>`).join('');
    finCaja.hidden = true; finCaja.classList.remove('puesto'); tablero.classList.remove('acabado');
    misterio.classList.remove('visto');
    q('.mis-b i').style.cssText = retrato(solucion);
    for (const f of tablero.querySelectorAll('.ficha')) { f.classList.remove('usada', 'culpable'); f.disabled = false; }
    voz.textContent = '';
  }

  async function intentar(i, ficha) {
    if (fin || intentos.includes(i)) return;
    intentos.push(i);
    const n = intentos.length, res = comparar(i, solucion), p = ELENCO[i];
    ficha.classList.add('usada'); ficha.disabled = true;
    const li = filas.children[n - 1];
    li.className = 'fila-adv';
    li.innerHTML = `<span class="celda cara"><i style="${retrato(i)}"></i><b>${p[0]}</b></span>` + res.map((c, k) =>
      `<span class="celda ${c.e}" style="--d:${k * 110 + 260}ms"><span class="celda-in"><small>${MARCA[c.e]}${c.flecha ? ` ${c.flecha}` : ''}</small>${c.v}</span></span>`).join('');
    // La ficha vuela de la mesa de sospechosos a su fila
    const cara = li.querySelector('.cara');
    if (!RM) {
      const a = ficha.querySelector('i').getBoundingClientRect(), b = cara.querySelector('i').getBoundingClientRect();
      cara.animate([{ transform: `translate(${a.left - b.left}px, ${a.top - b.top}px) scale(${a.width / b.width})`, opacity: 1 }, { transform: 'none', opacity: 1 }], { duration: 420, easing: 'cubic-bezier(.22, 1, .36, 1)' });
    }
    requestAnimationFrame(() => li.classList.add('visto'));
    voz.textContent = `Intento ${n} de ${MAX}: ${p[0]}. ` + res.map((c, k) => `${COLUMNAS[k]}: ${c.v}, ${DICHO[c.e]}${c.flecha ? (c.flecha === '↑' ? ', el año es mayor' : ', el año es menor') : ''}`).join('. ') + '.';
    const acierto = i === solucion;
    if (acierto || n === MAX) {
      fin = true;
      await espera(RM ? 0 : 1000);
      if (!tablero.isConnected) return;
      misterio.classList.add('visto');
      tablero.querySelector(`.ficha[data-i="${solucion}"]`).classList.add('culpable');
      q('.adv-sello').textContent = acierto ? 'Caso resuelto' : 'Sin resolver';
      finCaja.classList.toggle('fallo', !acierto);
      q('.adv-frase').innerHTML = acierto
        ? `Era <b>${ELENCO[solucion][0]}</b>. Resuelto en ${n} ${n === 1 ? 'intento' : 'intentos'}.`
        : `Era <b>${ELENCO[solucion][0]}</b>. Se acabaron los ${MAX} intentos.`;
      finCaja.hidden = false; tablero.classList.add('acabado');
      requestAnimationFrame(() => finCaja.classList.add('puesto'));
      voz.textContent += ` ${q('.adv-frase').textContent}`;
    }
  }

  tablero.addEventListener('click', (e) => {
    const f = e.target.closest('.ficha');
    if (f) intentar(+f.dataset.i, f);
    else if (e.target.closest('[data-otro]')) { caso++; nuevoCaso(); }
  });
  nuevoCaso();

  // La tapa se levanta y sale; dentro queda el tablero
  const tapa = pieza.querySelector('.pz-tapa');
  const salida = estrecho ? 'translate(118%, -30%) rotate(19deg) scale(1.05)' : 'translate(40%, -132%) rotate(15deg) scale(1.05)';
  const vuelo = tapa.animate([
    { transform: 'none', easing: 'cubic-bezier(.3, 0, .2, 1)' },
    { transform: 'translate(-1.5%, -3.5%) rotate(-2.5deg) scale(1.06)', offset: .34, easing: 'cubic-bezier(.55, 0, .7, .4)' },
    { transform: salida },
  ], { duration: RM ? 1 : 980, fill: 'forwards' });
  (estrecho ? pieza.parentElement : pieza).append(tablero);
  await espera(RM ? 0 : 430);
  tablero.classList.add('dentro');
  vuelo.finished.then(() => { if (vuelo.playbackRate > 0) tapa.style.visibility = 'hidden'; }).catch(() => {});

  return {
    // Al volver a la mesa: el tablero se va y la tapa vuelve a su sitio
    async guardar() {
      tablero.classList.remove('dentro');
      tapa.style.visibility = '';
      if (RM) { vuelo.cancel(); return; }
      vuelo.playbackRate = -2.1; vuelo.play();
      await vuelo.finished.catch(() => {});
    },
    quitar() { tablero.remove(); },
  };
}
