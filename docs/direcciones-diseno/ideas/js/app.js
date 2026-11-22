// Abanico de ideas: tarjetas, filtros con recolocación animada y ficha a pantalla completa.
// Solo se animan transform y opacity; nada corre en bucle.
import { IDEAS, ELEGIDAS } from './ideas.js';

const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const CURVA = 'cubic-bezier(.22, 1, .36, 1)';
const $ = (s, r = document) => r.querySelector(s);
const coma = (n) => String(n).replace('.', ',');
const PORQUE = {
  estanteria: '<b>La idea de partida, y con motivo:</b> es la única que todo el mundo sabe usar sin instrucciones, y cada capa (lomo, contraportada, manual, demo) es un nivel de lectura distinto.',
  tramoya: '<b>La que mejor cuenta el trabajo:</b> delante, el producto terminado; detrás, los agentes, el servidor y las pruebas que lo sostienen. Cálida y escénica: nada que ver con una balda.',
  salidas: '<b>La más clara y la más ligera:</b> texto de verdad que se escribe solo, perfecta en el móvil (un panel es una lista) y con un movimiento que se recuerda. Fría y tipográfica: el contrapunto de las otras dos.',
};

$('#cuantas').textContent = IDEAS.length;
// Abanico de la cabecera: cinco ideas de mundos distintos
const abanico = $('#abanico');
abanico.innerHTML = ['herramientas', 'tramoya', 'estanteria', 'salidas', 'maqueta']
  .map((id, i) => `<img src="arte/${id}.webp" alt="" style="--i:${i};--g:${(i - 2) * 9}deg">`).join('');
requestAnimationFrame(() => requestAnimationFrame(() => abanico.classList.add('abierto')));

function tarjeta(idea, grande = false) {
  const li = document.createElement('li');
  li.className = `tarjeta${grande ? ' grande' : ''}`;
  li.dataset.id = idea.id;
  li.innerHTML = `<button type="button" aria-label="${idea.nombre}: ver la idea entera">
    <div class="t-img"><img src="arte/${idea.id}.webp" alt="" width="720" height="480" loading="${grande ? 'eager' : 'lazy'}" decoding="async"><span class="t-nota">${coma(idea.nota)}<small>nota</small></span></div>
    <div class="t-pie"><span class="t-nombre">${idea.nombre}</span><span class="t-autor" data-a="${idea.autor}">${idea.autor}</span>
    <span class="t-frase">${idea.frase}</span>
    ${grande ? `<span class="t-porque">${PORQUE[idea.id]}</span>` : `<span class="t-mundo">${idea.mundo}</span>`}</div>
  </button>`;
  const img = li.querySelector('img');
  if (img.complete) img.classList.add('cargada'); else img.onload = () => img.classList.add('cargada');
  return li;
}

const elegidas = $('#elegidas'), rejilla = $('#rejilla');
ELEGIDAS.forEach((id, i) => { const t = tarjeta(IDEAS.find((x) => x.id === id), true); t.style.setProperty('--d', `${i * 90}ms`); elegidas.append(t); });
const tarjetas = IDEAS.map((idea) => tarjeta(idea));

// Aparecen al entrar en pantalla, en cascada corta
const vistas = new IntersectionObserver((es) => {
  let k = 0;
  for (const e of es) if (e.isIntersecting) { e.target.style.setProperty('--d', `${(k++ % 6) * 60}ms`); e.target.classList.add('vista'); vistas.unobserve(e.target); }
}, { rootMargin: '0px 0px -8% 0px' });

// ── Filtro y orden, con FLIP: cada tarjeta viaja de su sitio viejo al nuevo ──
let autor = '', orden = 'nota';
const MUNDOS = [...new Set(IDEAS.map((i) => i.mundo))];
function colocar(animar) {
  const antes = new Map(tarjetas.map((t) => [t, t.getBoundingClientRect()]));
  const lista = [...IDEAS].sort((a, b) => orden === 'nota'
    ? b.nota - a.nota || (b.codex ?? 0) - (a.codex ?? 0)
    : MUNDOS.indexOf(a.mundo) - MUNDOS.indexOf(b.mundo) || b.nota - a.nota);
  for (const idea of lista) {
    const t = tarjetas[IDEAS.indexOf(idea)];
    t.classList.toggle('fuera', !!autor && idea.autor !== autor);
    rejilla.append(t);
  }
  if (!animar || RM) return;
  for (const t of tarjetas) {
    if (t.classList.contains('fuera') || !t.classList.contains('vista')) continue;
    const a = antes.get(t), b = t.getBoundingClientRect();
    if (!a.width) { t.animate([{ opacity: 0, transform: 'scale(.94)' }, { opacity: 1, transform: 'none' }], { duration: 420, easing: CURVA }); continue; }
    const dx = a.left - b.left, dy = a.top - b.top;
    if (Math.abs(dx) + Math.abs(dy) > 1) t.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'none' }], { duration: 640, easing: CURVA });
  }
}
colocar(false);
for (const t of [...elegidas.children, ...tarjetas]) vistas.observe(t);
for (const b of document.querySelectorAll('[data-autor], [data-orden]')) {
  b.addEventListener('click', () => {
    const clave = 'autor' in b.dataset ? 'autor' : 'orden';
    for (const o of b.parentElement.children) o.setAttribute('aria-pressed', String(o === b));
    if (clave === 'autor') autor = b.dataset.autor; else orden = b.dataset.orden;
    colocar(true);
  });
}

// ── Ficha ──
const ficha = $('#ficha'), fImg = $('#f-img');
let actual = null, origen = null;
const visibles = () => IDEAS.filter((i) => !autor || i.autor === autor);

function rellenar(idea) {
  actual = idea;
  fImg.src = `arte/g/${idea.id}.webp`;
  $('#f-autor').textContent = `Propuesta de ${idea.autor}`; $('#f-autor').dataset.a = idea.autor;
  $('#f-mundo').textContent = idea.mundo;
  $('#f-nombre').textContent = idea.nombre;
  $('#f-frase').textContent = idea.frase;
  $('#f-datos').innerHTML = [
    ['Los primeros diez segundos', idea.diez], ['Cómo se recorre', idea.recorrido], ['Al abrir un proyecto', idea.abrir],
    ['Un proyecto nuevo', idea.nuevo], ['Lo bueno', idea.bueno], ['El riesgo', idea.riesgo],
  ].map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('');
  $('#f-nota').innerHTML = `<b>${coma(idea.nota)}</b><span>nota de diseño${idea.codex != null ? `<br>Codex le pone ${coma(idea.codex)}` : ''}</span>`;
  const v = visibles(); $('#f-pos').textContent = `${v.indexOf(idea) + 1} / ${v.length}`;
  $('.ficha-texto').scrollTop = 0; $('.ficha-in').scrollTop = 0;
}

// Vuelo de la imagen entre la tarjeta y la ficha (una copia que solo cambia de transform)
function volar(desde, hasta, src, alVolver) {
  if (RM || !desde || !hasta || !desde.width) return Promise.resolve();
  const v = document.createElement('div'); v.className = 'vuelo';
  v.innerHTML = `<img src="${src}" alt="">`;
  Object.assign(v.style, { left: `${hasta.left}px`, top: `${hasta.top}px`, width: `${hasta.width}px`, height: `${hasta.height}px` });
  document.body.append(v);
  const sx = desde.width / hasta.width, sy = desde.height / hasta.height;
  const a = v.animate([
    { transform: `translate(${desde.left - hasta.left}px, ${desde.top - hasta.top}px) scale(${sx}, ${sy})`, borderRadius: '12px' },
    { transform: 'none', borderRadius: alVolver ? '12px' : '0px' },
  ], { duration: alVolver ? 480 : 620, easing: CURVA, fill: 'forwards' });
  return a.finished.then(() => v.remove(), () => v.remove());
}

async function abrir(id, desdeTarjeta) {
  const idea = IDEAS.find((i) => i.id === id); if (!idea) return;
  rellenar(idea);
  if (!ficha.open) {
    ficha.showModal();
    document.documentElement.style.overflow = 'hidden';
    origen = desdeTarjeta;
    const img = desdeTarjeta?.querySelector('.t-img');
    fImg.style.opacity = '0';
    requestAnimationFrame(() => ficha.classList.add('abierta'));
    await volar(img?.getBoundingClientRect(), $('.ficha-img').getBoundingClientRect(), `arte/${idea.id}.webp`);
    fImg.style.opacity = '';
  }
}

async function cerrar() {
  if (!ficha.open) return;
  const t = [...document.querySelectorAll(`.tarjeta[data-id="${actual.id}"]`)].find((x) => !x.classList.contains('fuera'));
  const destino = t?.querySelector('.t-img');
  const r = destino?.getBoundingClientRect();
  const enPantalla = r && r.bottom > 0 && r.top < innerHeight;
  const desde = $('.ficha-img').getBoundingClientRect();
  ficha.classList.remove('abierta');
  if (enPantalla) { fImg.style.opacity = '0'; await volar(desde, r, `arte/${actual.id}.webp`, true); }
  else await new Promise((ok) => setTimeout(ok, RM ? 0 : 280));
  fImg.style.opacity = '';
  ficha.close();
  document.documentElement.style.overflow = '';
  (t?.querySelector('button') ?? origen?.querySelector('button'))?.focus({ preventScroll: true });
}

function mover(paso) {
  const v = visibles(); const i = v.indexOf(actual);
  const sig = v[(i + paso + v.length) % v.length];
  history.replaceState(history.state, '', `#idea/${sig.id}`);
  const img = $('.ficha-img img');
  if (!RM) img.animate([{ opacity: .2, transform: `translateX(${paso * 24}px)` }, { opacity: 1, transform: 'none' }], { duration: 420, easing: CURVA });
  rellenar(sig);
}

// La dirección manda: #idea/<id> abre la ficha; el botón atrás la cierra
function segunDireccion(desdeTarjeta) {
  const m = location.hash.match(/^#idea\/([\w-]+)/);
  if (m) abrir(m[1], desdeTarjeta); else cerrar();
}
document.addEventListener('click', (e) => {
  const b = e.target.closest('.tarjeta > button'); if (!b) return;
  const li = b.parentElement;
  history.pushState({ ficha: true }, '', `#idea/${li.dataset.id}`);
  segunDireccion(li);
});
addEventListener('popstate', () => segunDireccion());
// Cerrar: si la ficha la abrió un clic, se deshace ese paso del historial; si se entró directo, se limpia la dirección
const salir = () => {
  if (history.state?.ficha) history.back();
  else { history.replaceState(null, '', location.pathname + location.search); cerrar(); }
};
ficha.addEventListener('cancel', (e) => { e.preventDefault(); salir(); });
ficha.addEventListener('click', (e) => {
  if (e.target === ficha || e.target.closest('[data-cerrar]')) salir();
  const ir = e.target.closest('[data-ir]'); if (ir) mover(+ir.dataset.ir);
});
ficha.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') mover(1);
  else if (e.key === 'ArrowLeft') mover(-1);
});
// Deslizar en el móvil para pasar de idea
let x0 = null;
ficha.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
ficha.addEventListener('touchend', (e) => {
  if (x0 == null) return; const dx = e.changedTouches[0].clientX - x0; x0 = null;
  if (Math.abs(dx) > 70 && e.target.closest('.ficha-img')) mover(dx < 0 ? 1 : -1);
});
if (location.hash.startsWith('#idea/')) segunDireccion();
