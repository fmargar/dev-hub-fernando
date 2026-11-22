// Interior de Wardux: el periódico se abre y quien entra hace de revisor.
// SIMULACIÓN: el artículo y sus tres pegas son un ejemplo escrito para esta demo. El flujo es el real:
// una IA redacta, otra distinta comprueba los hechos en su fuente y corrige, y solo entonces se publica.

const css = new Promise((ok) => {
  const l = document.createElement('link');
  l.rel = 'stylesheet'; l.href = 'css/wardux.css'; l.onload = l.onerror = ok;
  document.head.append(l);
});

// Las tres pegas del revisor: [tipo, nota, qué hace el lápiz, texto que entra en su lugar]
const PEGAS = [
  ['Sobra', 'Frase de relleno al empezar: no cuenta nada. Se entra por el dato.', 'Tachar'],
  ['Cifra', 'La fuente no dice eso: habla de entre 8 y 10 GB. Se corrige y se enlaza.', 'Corregir', 'entre 8 y 10 GB'],
  ['Cierre', 'Cierre de adorno: no añade ningún dato. Fuera.', 'Tachar'],
];
const marca = (n, texto) => `<span class="marca" role="button" tabindex="0" data-n="${n}" aria-label="Pega ${n}: ${PEGAS[n - 1][1]}"><sup>${n}</sup>${texto}</span>`;
const ARTICULO = `
  <p>${marca(1, 'En este artículo vamos a ver todo lo que necesitas saber sobre el tema.')} La memoria de la tarjeta gráfica decide qué modelos de IA puedes abrir en tu ordenador: si el modelo no cabe, no arranca.</p>
  <p>Un modelo de lenguaje mediano, ya comprimido, ocupa ${marca(2, 'unos 12 GB')} de esa memoria. Con menos, toca elegir uno más pequeño o repartirlo con la memoria del equipo, que es bastante más lenta.</p>
  <p>La potencia importa menos de lo que parece: una tarjeta rápida con poca memoria se queda corta antes que una modesta con mucha.</p>
  <p>Antes de comprar conviene mirar tres cosas: cuánta memoria trae, cuánto consume y si cabe en la caja. ${marca(3, 'Sin duda, el futuro de la IA en casa promete ser apasionante.')}</p>`;
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const CURVA = 'cubic-bezier(.22, 1, .36, 1)';

export async function montar({ pieza, hueco, RM, estrecho }) {
  await css;
  let vivo = true, ocupado = false, publicado = false;
  const hechas = new Set();

  const w = document.createElement('div');
  w.className = `wdx${estrecho ? ' wdx-suelto' : ''}`;
  if (!estrecho) {
    const ancho = Math.min(hueco.clientWidth, (innerHeight - 150) / .647);
    w.style.width = `${ancho}px`; w.style.height = `${ancho * .647}px`;
  }
  w.innerHTML = `
    <div class="wdx-som" aria-hidden="true">${['t', 'd'].map((l) => `<div class="som-m som-${l}"><span><img class="sm-a" src="arte/s/periodico-abierto.webp" alt=""><img class="sm-c" src="arte/s/periodico-abierto-c.webp" alt=""></span></div>`).join('')}</div>
    <section class="wdx-pag wdx-der" aria-label="Mesa de revisión">
      <div class="wdx-in">
        <p class="wdx-cab"><b>Mesa de revisión</b><span>Revisa: otra IA distinta</span></p>
        <p class="wdx-guia">Tres pegas en el borrador. Toca cada una y queda corregida.</p>
        <ol class="wdx-notas">${PEGAS.map(([tipo, nota, accion], i) => `<li><button type="button" class="nota-rev" data-n="${i + 1}" style="--giro:${[-1.6, 1.2, -0.8][i]}deg">
          <span class="nota-papel"><i>${i + 1}</i><b>${tipo}</b><span>${nota}</span><em>${accion}</em></span></button></li>`).join('')}</ol>
        <div class="wdx-fin">
          <p class="wdx-regla">Si el hecho central no se sostiene, el artículo vuelve a quien lo escribió.</p>
          <p class="wdx-publicar"><button type="button" class="boton boton-naranja" data-publicar disabled><span class="boton-tapa">Publicar</span></button><span class="wdx-faltan"></span></p>
        </div>
        <span class="wdx-sello wdx-sello-pub">Publicado</span>
      </div>
    </section>
    <section class="wdx-pag wdx-izq" aria-label="El artículo">
      <div class="wdx-cara">
        <div class="wdx-in">
          <p class="wdx-cab"><b class="wdx-estado">Borrador</b><span>Escribe: una IA</span></p>
          <p class="wdx-seccion">Guía · Hardware</p>
          <h3 class="wdx-titular">Qué mirar antes de comprar una gráfica para usar IA en casa</h3>
          <p class="wdx-entradilla">La memoria manda más que la potencia.</p>
          <div class="wdx-cols">${ARTICULO}</div>
          <span class="wdx-sello wdx-sello-rev">Revisado</span>
        </div>
      </div>
      <div class="wdx-dorso" aria-hidden="true"></div>
    </section>
    <img class="wdx-lapiz" src="arte/g/lapiz-rojo.webp" alt="" aria-hidden="true">
    <p class="wdx-voz" aria-live="polite"></p>`;
  hueco.append(w);
  const q = (s) => w.querySelector(s);
  const izq = q('.wdx-izq'), lapiz = q('.wdx-lapiz'), voz = q('.wdx-voz'), pub = q('[data-publicar]'), faltan = q('.wdx-faltan');

  function cuenta() {
    const n = PEGAS.length - hechas.size;
    faltan.textContent = publicado ? '' : n ? `${n === 1 ? 'Falta 1 corrección' : `Faltan ${n} correcciones`}` : 'Revisado. Ya puede salir.';
    pub.disabled = n > 0;
    pub.classList.toggle('listo', !n && !publicado);
  }

  // El lápiz va de su sitio a la pega, la recorre y vuelve
  function reposo() { return `translate(${w.clientWidth * .575}px, ${w.clientHeight * .955}px) rotate(-82deg)`; }
  async function trazo(m) {
    if (RM || estrecho) return;
    const c = w.getBoundingClientRect(), rs = [...m.getClientRects()];
    const a = rs[0], b = rs[rs.length - 1], medio = lapiz.offsetWidth / 2;
    const en = (x, y, g) => `translate(${x - c.left - medio}px, ${y - c.top}px) rotate(${g}deg)`;
    await lapiz.animate([
      { transform: reposo(), easing: CURVA },
      { transform: en(a.left, a.top + a.height * .55, -38), offset: .42, easing: 'linear' },
      { transform: en(a.right, a.top + a.height * .55, -31), offset: rs.length > 1 ? .56 : .7, easing: 'linear' },
      ...(rs.length > 1 ? [{ transform: en(b.left, b.top + b.height * .55, -38), offset: .62, easing: 'linear' }, { transform: en(b.right, b.top + b.height * .55, -31), offset: .76, easing: CURVA }] : []),
      { transform: reposo() },
    ], { duration: rs.length > 1 ? 1250 : 980 }).finished.catch(() => {});
  }

  async function arreglar(n) {
    if (ocupado || hechas.has(n) || publicado || !vivo) return;
    ocupado = true;
    const m = q(`.marca[data-n="${n}"]`), nota = q(`.nota-rev[data-n="${n}"]`), pega = PEGAS[n - 1];
    nota.classList.add('en-curso');
    const hecho = trazo(m);
    await espera(RM || estrecho ? 0 : m.getClientRects().length > 1 ? 800 : 600);
    if (!vivo) return;
    m.classList.add('hecha'); m.removeAttribute('tabindex'); m.setAttribute('aria-disabled', 'true');
    if (pega[3]) m.insertAdjacentHTML('afterend', ` <ins class="arreglo">${pega[3]}</ins>`);
    nota.classList.remove('en-curso'); nota.classList.add('hecha'); nota.disabled = true; nota.querySelector('em').textContent = 'Hecho ✓';
    hechas.add(n);
    voz.textContent = `Pega ${n} arreglada: ${pega[1]}`;
    await hecho;
    cuenta();
    if (hechas.size === PEGAS.length) { await espera(RM ? 0 : 120); q('.wdx-sello-rev').classList.add('puesto'); voz.textContent += ' Artículo revisado: ya se puede publicar.'; }
    ocupado = false;
  }

  function publicar() {
    if (publicado || hechas.size < PEGAS.length) return;
    publicado = true;
    q('.wdx-estado').textContent = 'Publicado';
    w.classList.add('publicado');
    q('.wdx-sello-pub').classList.add('puesto');
    pub.querySelector('.boton-tapa').textContent = 'Otro borrador';
    cuenta();
    voz.textContent = 'Publicado. Así pasan por revisión los artículos de Wardux.';
  }
  function otraVez() {
    publicado = false; hechas.clear();
    w.classList.remove('publicado');
    q('.wdx-estado').textContent = 'Borrador';
    q('.wdx-cols').innerHTML = ARTICULO;
    for (const s of w.querySelectorAll('.wdx-sello')) s.classList.remove('puesto');
    w.querySelectorAll('.nota-rev').forEach((b, i) => { b.classList.remove('hecha'); b.disabled = false; b.querySelector('em').textContent = PEGAS[i][2]; });
    pub.querySelector('.boton-tapa').textContent = 'Publicar';
    cuenta();
  }

  w.addEventListener('click', (e) => {
    const m = e.target.closest('.marca, .nota-rev');
    if (m) arreglar(+m.dataset.n);
    else if (e.target.closest('[data-publicar]')) (publicado ? otraVez : publicar)();
  });
  // Nota y pasaje se señalan el uno al otro
  const pareja = (e, si) => {
    const m = e.target.closest?.('.marca, .nota-rev');
    if (m) for (const x of w.querySelectorAll(`.marca[data-n="${m.dataset.n}"], .nota-rev[data-n="${m.dataset.n}"]`)) if (x !== m) x.classList.toggle('apunta', si);
  };
  w.addEventListener('pointerover', (e) => pareja(e, true)); w.addEventListener('pointerout', (e) => pareja(e, false));
  w.addEventListener('focusin', (e) => pareja(e, true)); w.addEventListener('focusout', (e) => pareja(e, false));
  w.addEventListener('keydown', (e) => {
    const m = e.target.closest('.marca');
    if (m && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); arreglar(+m.dataset.n); }
  });
  cuenta();

  // El periódico plegado se aparta a la derecha y se abre. Corre aparte: se puede volver a la mesa a medias.
  const A = {};
  const hecha = (x) => x.finished.catch(() => {});
  async function desplegar() {
    if (estrecho) { await espera(RM ? 0 : 60); if (vivo) w.classList.add('abierto'); return; }
    lapiz.style.transform = reposo();
    if (RM) { pieza.style.opacity = 0; w.classList.add('abierto'); return; }
    // La portada de la hoja que se abre es el mismo periódico plegado: se copia y se ajusta a la página
    const cuerpo = pieza.lastElementChild, copia = cuerpo.cloneNode(true);
    copia.style.transform = `scale(${w.clientWidth / 2 / parseFloat(cuerpo.style.width)}, ${w.clientHeight / parseFloat(cuerpo.style.height)})`;
    q('.wdx-dorso').append(copia);
    const a = pieza.getBoundingClientRect(), b = q('.wdx-der').getBoundingClientRect();
    A.mover = pieza.animate([{ transform: 'none' }, { transform: `translate(${b.left + b.width / 2 - (a.left + a.width / 2)}px, ${b.top + b.height / 2 - (a.top + a.height / 2)}px) scale(${b.width / a.width}, ${b.height / a.height})` }], { duration: 520, easing: CURVA, fill: 'forwards' });
    await hecha(A.mover);
    if (!vivo) return;
    A.sale = w.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 120, fill: 'forwards' });
    await hecha(A.sale);
    A.funde = pieza.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 1, fill: 'forwards' });
    if (!vivo) return;
    A.abre = izq.animate([{ transform: 'rotateY(180deg)', easing: 'cubic-bezier(.45, 0, .2, 1)' }, { transform: 'rotateY(-7deg)', offset: .78, easing: 'ease-out' }, { transform: 'rotateY(0deg)' }], { duration: 950, fill: 'forwards' });
    w.classList.add('abriendo');
    await hecha(A.abre);
    if (vivo) w.classList.add('abierto');
  }
  const desplegado = desplegar();
  const atras = async (x, ritmo) => { if (!x) return; x.playbackRate = -ritmo; x.play(); await hecha(x); };

  return {
    // Al volver a la mesa: la hoja se cierra, el pliego se va y el periódico plegado vuelve a su sitio
    async guardar() {
      vivo = false;
      w.classList.remove('abierto', 'abriendo');
      if (estrecho || RM) { pieza.style.opacity = ''; return; }
      await atras(A.abre, 2.4);
      await atras(A.funde, 1);
      await atras(A.sale, 1);
      await atras(A.mover, 1.8);
      await desplegado;
      for (const x of Object.values(A)) x.cancel();
    },
    quitar() { vivo = false; for (const x of Object.values(A)) x.cancel(); pieza.style.opacity = ''; w.remove(); },
  };
}
