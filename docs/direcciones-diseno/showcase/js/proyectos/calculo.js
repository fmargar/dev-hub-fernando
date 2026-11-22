// Interior de Cálculo Exacto: la calculadora imprime el tique de un caso contrastado.
// PRECALCULADO: las cifras de cada tique las dio el motor real del proyecto (que no va en esta maqueta)
// y el tipo de la Agencia Tributaria es el que devolvió su servicio de cálculo de retenciones.
// Aquí no se calcula nada: solo se imprime lo guardado.

const css = new Promise((ok) => {
  const l = document.createElement('link');
  l.rel = 'stylesheet'; l.href = 'css/calculo.css'; l.onload = l.onerror = ok;
  document.head.append(l);
});

const EJERCICIO = 2026, CONSULTA = '23/10/2026';
// caso, bruto anual, cotizaciones, base de retención, mínimo personal y familiar, tipo del motor, tipo de la Agencia Tributaria
const CASOS = [
  ['Sin hijos', 30000, 1950, 26050, 5550, 16.42, 16.42],
  ['Justo por encima del mínimo', 16500, 1072.5, 7132.62, 5550, 1.62, 1.62],
  ['Familia monoparental, dos hijos', 24000, 1560, 20440, 10650, 9.47, 9.47],
  ['Cuatro hijos', 35000, 2275, 30125, 21950, 7, 7],
  ['Cónyuge a cargo y un hijo', 32000, 2080, 27920, 7950, 15.72, 15.72],
  ['Discapacidad del 65 % o más', 27000, 1755, 15495, 17550, 0, 0],
  ['Residente en Ceuta', 30000, 1950, 26050, 5550, 6.56, 6.56],
  ['Pensionista de 70 años', 28000, 0, 25400, 6700, 16.11, 16.11],
  ['Un sueldo muy alto', 320000, 3978.94, 314021.06, 5550, 41.07, 41.07],
];

// Las teclas de la foto, en % de la imagen: [qué hace, leyenda, x, y, ancho, alto]
const FILA = { t: [56.2, 6.1], a: [63.9, 7.7], b: [71.9, 8], c: [80.1, 8.1], d: [88.2, 7.9] };
const COL = { i: [8.4, 12.8], 1: [25.4, 12], 2: [37.8, 12.25], 3: [50.1, 12.3] };
const tecla = (que, ley, col, fila, extra = '') => { const c = Array.isArray(col) ? col : COL[col]; return [que, ley, c[0], c[1], FILA[fila][0], FILA[fila][1], extra]; };
const TECLAS = [
  ['borrar', 'C', 9.1, 12.5, 56.2, 6.1, 'naranja'], ['', 'MC', 25.9, 11.6, 56.2, 6.1], ['', 'MR', 38.7, 11.7, 56.2, 6.1],
  ['', 'M−', 51.5, 11.7, 56.2, 6.1], ['', 'M+', 64.8, 12.1, 56.2, 6.1], ['', '÷', 78.7, 12.6, 56.2, 6.1],
  tecla('antes', '▲', 'i', 'a'), tecla('7', '7', 1, 'a'), tecla('8', '8', 2, 'a'), tecla('9', '9', 3, 'a'), tecla('', '×', [78.7, 13.1], 'a'),
  tecla('despues', '▼', 'i', 'b'), tecla('4', '4', 1, 'b'), tecla('5', '5', 2, 'b'), tecla('6', '6', 3, 'b'), tecla('', '−', [78.8, 13.1], 'b'),
  tecla('', '%', 'i', 'c'), tecla('1', '1', 1, 'c'), tecla('2', '2', 2, 'c'), tecla('3', '3', 3, 'c'),
  tecla('', '√', 'i', 'd'), tecla('', '0', 1, 'd'), tecla('', '00', 2, 'd'), tecla('', ',', 3, 'd'),
  ['', '+', 64.5, 13.3, 64.5, 31.8], ['igual', '=', 78.2, 14.1, 80.1, 16, 'naranja'],
];

const eur = (n) => { const [e, d] = Math.abs(n).toFixed(2).split('.'); return (n < 0 ? '−' : '') + e.replace(/\B(?=(\d{3})+$)/g, '.') + ',' + d; };
const pct = (n) => `${eur(n)} %`;
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const QUE = { borrar: 'Retirar los tiques', antes: 'Caso anterior', despues: 'Caso siguiente', igual: 'Calcular e imprimir el tique' };

export async function montar({ pieza, hueco, RM, estrecho }) {
  await css;
  const calc = pieza.querySelector('.pz-calculadora');
  let actual = 0, imprimiendo = false, vivo = true, n = 0;
  const impresos = new Set();

  // Teclas de verdad encima de la foto: cada una lleva su trozo de imagen y baja al pulsarla
  const teclado = document.createElement('div');
  teclado.className = 'clc-teclas';
  teclado.innerHTML = TECLAS.map(([que, ley, x, w, y, h, extra]) => {
    const caso = /^\d$/.test(que) ? CASOS[que - 1] : null;
    const nombre = caso ? `Caso ${que}: ${caso[0]}, ${eur(caso[1])} euros` : QUE[que] || `Tecla ${ley}`;
    return `<button type="button" class="tecla${extra ? ` tecla-${extra}` : ''}${que ? '' : ' tecla-muda'}" data-que="${que}" aria-label="${nombre}"${que ? '' : ' tabindex="-1"'}
      style="left:${x}%;top:${y}%;width:${w}%;height:${h}%"><span class="tecla-cap" style="background-size:${10000 / w}% ${10000 / h}%;background-position:${(x / (100 - w)) * 100}% ${(y / (100 - h)) * 100}%">${ley}</span></button>`;
  }).join('');
  const lcd = document.createElement('div');
  lcd.className = 'clc-lcd';
  lcd.innerHTML = '<small></small><b></b>';
  const [lcdCaso, lcdNum] = lcd.children;
  calc.classList.add('con-teclas');
  calc.append(lcd, teclado);
  const papel = calc.querySelector('.cal-tique');

  // Al lado: la pila de tiques y la lista de casos (lo mismo que las teclas, para leer y para el dedo)
  const lado = document.createElement('div');
  lado.className = `clc-lado${estrecho ? ' clc-suelto' : ''}`;
  lado.innerHTML = `<div class="clc-pila" aria-hidden="true"></div>
    <div class="clc-casos"><p class="clc-sobre"><b>Casos contrastados</b><span>${CASOS.length} de muestra</span></p>
      <ol>${CASOS.map((c, i) => `<li><button type="button" data-caso="${i}"><i>${i + 1}</i><span>${c[0]}</span><em>${eur(c[1]).replace(',00', '')} €</em></button></li>`).join('')}</ol>
      <p class="clc-ayuda">Elige un caso y pulsa <kbd>=</kbd>: la calculadora imprime lo que dio el motor y lo que respondió la Agencia Tributaria.</p></div>
    <p class="clc-voz" aria-live="polite"></p>`;
  hueco.append(lado);
  const pila = lado.querySelector('.clc-pila'), voz = lado.querySelector('.clc-voz');
  const filas = [...lado.querySelectorAll('[data-caso]')];
  const boton = (que) => teclado.querySelector(`[data-que="${que}"]`);

  function pulsar(b) {
    if (!b) return;
    b.classList.add('pulsada');
    setTimeout(() => b.classList.remove('pulsada'), 130);
  }
  function elegir(i, conTecla = true) {
    actual = (i + CASOS.length) % CASOS.length;
    const c = CASOS[actual];
    if (conTecla) pulsar(boton(actual + 1));
    lcdCaso.textContent = `Caso ${actual + 1} · ${c[0]}`;
    lcdNum.textContent = eur(c[1]);
    filas.forEach((f, k) => f.classList.toggle('activo', k === actual));
    boton('igual').classList.add('invita');
  }

  function tique(i) {
    const c = CASOS[i], dif = Math.abs(c[5] - c[6]);
    const t = document.createElement('article');
    t.className = 'clc-tique';
    const giro = ((n * 47) % 9) - 4, dx = ((n * 31) % 7) - 3, dy = ((n * 17) % 5);
    t.style.cssText = `--giro:${giro}deg;--dx:${dx}%;--dy:${dy}%`;
    t.innerHTML = `<div class="tq-som"><img class="sm-a" src="arte/s/tique.webp" alt=""><img class="sm-c" src="arte/s/tique-c.webp" alt=""></div>
      <div class="tq-papel"></div>
      <div class="tq-in">
        <p class="tq-marca">Cálculo Exacto</p>
        <p class="tq-sub">Retención de IRPF · ejercicio ${EJERCICIO}</p>
        <p class="tq-caso"><b>Caso ${i + 1}</b>${c[0]}</p>
        <dl>
          <div><dt>Bruto anual</dt><dd>${eur(c[1])}</dd></div>
          <div><dt>Cotizaciones</dt><dd>${eur(-c[2])}</dd></div>
          <div><dt>Base de retención</dt><dd>${eur(c[3])}</dd></div>
          <div><dt>Mínimo pers. y fam.</dt><dd>${eur(c[4])}</dd></div>
        </dl>
        <dl class="tq-res">
          <div><dt>Motor</dt><dd>${pct(c[5])}</dd></div>
          <div><dt>Agencia Tributaria</dt><dd>${pct(c[6])}</dd></div>
          <div class="tq-dif"><dt>Diferencia</dt><dd>${eur(dif)}</dd></div>
        </dl>
        <p class="tq-pie">Motor: resultado guardado. Agencia Tributaria: su servicio de cálculo, consultado el ${CONSULTA}.</p>
        <span class="tq-sello">${dif === 0 ? 'Coincide' : 'No coincide'}</span>
      </div>`;
    return t;
  }

  async function imprimir() {
    if (imprimiendo || !vivo) return;
    imprimiendo = true;
    const i = actual, c = CASOS[i];
    boton('igual').classList.remove('invita');
    pulsar(boton('igual'));
    // La pantalla baraja cifras y se queda en el tipo
    if (!RM) for (let k = 0; k < 7 && vivo; k++) { lcdNum.textContent = pct(((c[5] * (k + 3) * 7.31) % 47)); await espera(48); }
    lcdCaso.textContent = `Caso ${i + 1} · retención`;
    lcdNum.textContent = pct(c[5]);
    // El papel avanza a golpes, renglón a renglón, y la máquina tiembla
    if (!RM) {
      calc.animate([{ transform: 'translate(0, 0)' }, { transform: 'translate(.35px, .2px)' }, { transform: 'translate(-.3px, 0)' }, { transform: 'translate(.25px, -.2px)' }, { transform: 'translate(0, 0)' }], { duration: 110, iterations: 5 });
      await papel.animate([{ transform: 'translateY(-36%)' }, { transform: 'translateY(4%)' }], { duration: 540, easing: 'steps(7, end)', fill: 'forwards' }).finished.catch(() => {});
    }
    if (!vivo) return;
    const t = tique(i); n++;
    pila.append(t);
    for (const viejo of [...pila.children].slice(0, -4)) viejo.remove();
    if (!RM) {
      // El tique sale de la ranura y cae en la pila
      const a = calc.querySelector('.cal-ranura').getBoundingClientRect(), b = t.getBoundingClientRect();
      const s = a.width / b.width;
      papel.getAnimations().forEach((x) => x.cancel());
      await t.animate([
        { transform: `translate(${a.left + a.width / 2 - (b.left + b.width / 2)}px, ${a.top + (b.height * s) / 2 - (b.top + b.height / 2)}px) scale(${s})`, opacity: 0 },
        { opacity: 1, offset: .12 },
        { transform: 'translate(var(--dx), var(--dy)) rotate(var(--giro))', opacity: 1 },
      ], { duration: 620, easing: 'cubic-bezier(.22, 1, .36, 1)' }).finished.catch(() => {});
    }
    t.classList.add('puesto');
    impresos.add(i);
    filas[i].classList.add('impreso');
    voz.textContent = `Caso ${i + 1}, ${c[0]}. Bruto anual ${eur(c[1])} euros. Retención según el motor: ${pct(c[5])}. Según la Agencia Tributaria: ${pct(c[6])}. Diferencia: ${eur(Math.abs(c[5] - c[6]))}.`;
    imprimiendo = false;
  }

  function borrar() {
    pulsar(boton('borrar'));
    for (const t of pila.children) {
      t.classList.add('fuera');
      setTimeout(() => t.remove(), RM ? 0 : 420);
    }
    impresos.clear(); filas.forEach((f) => f.classList.remove('impreso'));
    lcdCaso.textContent = `Caso ${actual + 1} · ${CASOS[actual][0]}`; lcdNum.textContent = eur(CASOS[actual][1]);
    boton('igual').classList.add('invita');
  }

  function hacer(que) {
    if (/^\d$/.test(que)) elegir(que - 1);
    else if (que === 'igual') imprimir();
    else if (que === 'borrar') borrar();
    else if (que === 'antes') { pulsar(boton('antes')); elegir(actual - 1, false); }
    else if (que === 'despues') { pulsar(boton('despues')); elegir(actual + 1, false); }
  }
  teclado.addEventListener('click', (e) => { const b = e.target.closest('.tecla'); if (b) hacer(b.dataset.que); });
  lado.addEventListener('click', (e) => {
    const b = e.target.closest('[data-caso]');
    if (b) { elegir(+b.dataset.caso); imprimir(); }
  });
  const alTeclear = (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (/^[1-9]$/.test(e.key)) hacer(e.key);
    else if (e.key === '=' || (e.key === 'Enter' && !e.target.closest('button, a'))) { e.preventDefault(); hacer('igual'); }
  };
  addEventListener('keydown', alTeclear);

  elegir(0, false);
  await espera(RM ? 0 : 120);
  lado.classList.add('dentro'); calc.classList.add('encendida');
  // El primer tique sale solo: así se ve qué hace la máquina sin tocar nada
  setTimeout(() => { if (vivo && !n) imprimir(); }, RM ? 0 : 520);

  return {
    async guardar() {
      vivo = false;
      removeEventListener('keydown', alTeclear);
      lado.classList.remove('dentro'); calc.classList.remove('encendida');
      papel.getAnimations().forEach((x) => x.cancel());
      await espera(RM ? 0 : 220);
    },
    quitar() { vivo = false; removeEventListener('keydown', alTeclear); lado.remove(); lcd.remove(); teclado.remove(); calc.classList.remove('con-teclas', 'encendida'); },
  };
}
