// La demo de Adivinadle, tal como sale en la tele al meter el disco.
// SIMULACIÓN: doce personajes inventados para esta demo. La mecánica (cada intento dice en qué
// te acercas) es la del modo clásico del juego real.

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

export function montar(hueco, { RM, alResolver, guardado }) {
  const dia = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 864e5);
  let caso = dia % 12, solucion, intentos, fin;

  const t = document.createElement('div');
  t.className = 'adv';
  t.innerHTML = `<div class="adv-barra"><span><b>Adivinadle</b> · <span class="adv-caso"></span></span><span class="adv-sim" title="Personajes y datos inventados; la mecánica es la del juego real">Simulación</span></div>
    <div class="adv-izq">
      <p class="adv-sobre"><b>Sospechosos</b><span>elige uno</span></p>
      <div class="adv-fichas" role="group" aria-label="Sospechosos">${ELENCO.map((p, i) => `<button type="button" class="ficha" data-i="${i}" style="--d:${i * 40}ms" aria-label="${p[0]}"><i style="${retrato(i)}"></i><b>${p[0]}</b></button>`).join('')}</div>
      <p class="adv-como"><b>Cómo se juega.</b> Hay un personaje secreto. Elige un sospechoso: cada casilla dice si coincide con el secreto (verde), si coincide en parte (ámbar) o si no (rojo). El año te dice si es mayor o menor. Seis intentos.</p>
    </div>
    <div class="adv-der">
      <div class="adv-cab">
        <p class="adv-titulo">¿Quién es <em>hoy</em>?</p>
        <div class="adv-misterio"><span class="mis-cara mis-a">?</span><span class="mis-cara mis-b"><i></i></span></div>
      </div>
      <div class="adv-cols" aria-hidden="true"><span>Intento</span>${COLUMNAS.map((c) => `<span>${c}</span>`).join('')}</div>
      <ol class="adv-filas"></ol>
      <div class="adv-pie">
        <p class="adv-leyenda"><span class="ley ok">✓ coincide</span><span class="ley casi">≈ en parte</span><span class="ley no">✕ no</span><span class="ley fl">↑↓ año mayor o menor</span></p>
        <div class="adv-fin" hidden><span class="adv-sello"></span><p class="adv-frase"></p><button type="button" class="boton boton-luz" data-otro><span class="boton-tapa">Otro caso</span></button></div>
      </div>
      <p class="adv-voz" aria-live="polite"></p>
    </div>`;
  const q = (s) => t.querySelector(s);
  const filas = q('.adv-filas'), voz = q('.adv-voz'), finCaja = q('.adv-fin'), misterio = q('.adv-misterio');

  function nuevoCaso() {
    solucion = ORDEN_CASOS[caso % 12]; intentos = []; fin = false;
    q('.adv-caso').textContent = `caso n.º ${dia + (caso - (dia % 12))} · modo clásico`;
    filas.innerHTML = Array.from({ length: MAX }, (_, i) => `<li class="fila-adv vacia"><span class="hueco-n">${i + 1}</span></li>`).join('');
    finCaja.hidden = true; finCaja.classList.remove('puesto'); t.classList.remove('acabado');
    misterio.classList.remove('visto');
    q('.mis-b i').style.cssText = retrato(solucion);
    for (const f of t.querySelectorAll('.ficha')) { f.classList.remove('usada', 'culpable'); f.disabled = false; }
    voz.textContent = '';
  }

  async function intentar(i, ficha) {
    if (fin || intentos.includes(i)) return;
    intentos.push(i);
    const n = intentos.length, res = comparar(i, solucion), p = ELENCO[i];
    ficha.classList.add('usada'); ficha.disabled = true;
    const li = filas.children[n - 1];
    li.className = 'fila-adv';
    li.innerHTML = `<span class="celda adv-cara"><i style="${retrato(i)}"></i><b>${p[0]}</b></span>` + res.map((c, k) =>
      `<span class="celda ${c.e}" style="--d:${k * 110 + 240}ms"><span class="celda-in"><small>${MARCA[c.e]}${c.flecha ? ` ${c.flecha}` : ''}</small>${c.v}</span></span>`).join('');
    // el retrato vuela de la ficha a su fila
    const cara = li.querySelector('.adv-cara');
    if (!RM) {
      const a = ficha.querySelector('i').getBoundingClientRect(), b = cara.querySelector('i').getBoundingClientRect();
      cara.querySelector('i').animate([{ transform: `translate(${a.left - b.left}px, ${a.top - b.top}px) scale(${a.width / b.width})` }, { transform: 'none' }], { duration: 420, easing: 'cubic-bezier(.22, 1, .36, 1)' });
    }
    requestAnimationFrame(() => li.classList.add('visto'));
    voz.textContent = `Intento ${n} de ${MAX}: ${p[0]}. ` + res.map((c, k) => `${COLUMNAS[k]}: ${c.v}, ${DICHO[c.e]}${c.flecha ? (c.flecha === '↑' ? ', el año es mayor' : ', el año es menor') : ''}`).join('. ') + '.';
    const acierto = i === solucion;
    if (acierto || n === MAX) {
      fin = true;
      await espera(RM ? 0 : 1000);
      if (!t.isConnected) return;
      misterio.classList.add('visto');
      t.querySelector(`.ficha[data-i="${solucion}"]`).classList.add('culpable');
      q('.adv-sello').textContent = acierto ? 'Resuelto' : 'Sin resolver';
      finCaja.classList.toggle('fallo', !acierto);
      q('.adv-frase').innerHTML = acierto
        ? `Era <b>${ELENCO[solucion][0]}</b>. ${n} ${n === 1 ? 'intento' : 'intentos'}.`
        : `Era <b>${ELENCO[solucion][0]}</b>.`;
      finCaja.hidden = false; t.classList.add('acabado');
      requestAnimationFrame(() => finCaja.classList.add('puesto'));
      voz.textContent += ` ${q('.adv-frase').textContent}`;
      if (acierto) alResolver?.(n);
    }
  }

  t.addEventListener('click', (e) => {
    const f = e.target.closest('.ficha');
    if (f) intentar(+f.dataset.i, f);
    else if (e.target.closest('[data-otro]')) { caso++; nuevoCaso(); t.querySelector('.ficha').focus({ preventScroll: true }); }
  });
  nuevoCaso();
  hueco.append(t);
  requestAnimationFrame(() => requestAnimationFrame(() => t.classList.add('dentro')));
  if (guardado) q('.adv-caso').textContent += ` · récord: ${guardado} ${guardado === 1 ? 'intento' : 'intentos'}`;
  return { primero: () => t.querySelector('.ficha'), quitar() { t.remove(); } };
}
