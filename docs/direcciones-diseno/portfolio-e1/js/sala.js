// El portfolio con expositores. Cada expositor es una escena del kit E1 (una página propia) metida en su vitrina:
// - en escritorio, la vitrina que más se ve se enciende sola (solo una a la vez) y responde al ratón;
// - al tocarla, o al elegir un trabajo en su cartela, la vitrina crece hasta ocupar la pantalla y se entra en ella;
// - en móvil y con movimiento reducido no se enciende sola: es una foto con un botón, y la escena se carga al abrirla.
// El contenido (qué trabajos hay y qué es cada uno) está siempre en la página, con o sin 3D.

const EXPOSITORES = [
  { id: 'estanteria', inicio: 'salon', grupo: 'Productos', nombre: 'La estantería',
    que: 'Lo que he publicado por mi cuenta. Se saca un juego, se lee su manual y el disco va a la consola: la tele pone la demo.',
    piezas: [['adivinadle', 'Adivinadle', 'Juegos diarios de adivinar personajes. Con demo jugable.'], ['wardux', 'Wardux', 'Noticias y guías de IA y hardware, en español.'], ['calculo', 'Cálculo Exacto', 'Calculadoras de nómina y dinero para España.']] },
  { id: 'taller', inicio: 'taller', grupo: 'Trabajos por encargo', nombre: 'El taller',
    que: 'Lo que he hecho para una empresa, un ayuntamiento y un tribunal de fin de ciclo. Cada herramienta, con su orden de trabajo.',
    piezas: [['erp', 'IA en el ERP', 'Descripciones de producto redactadas por IA dentro de Odoo.'], ['vados', 'Vados de Marbella', 'Gestión de los vados del Ayuntamiento de Marbella.'], ['marbella', 'Marbella Fácil', 'Reservas, directorio y servicios de Marbella en una sola web.']] },
  { id: 'habitable', inicio: 'maqueta', grupo: 'Sistemas propios', nombre: 'La maqueta',
    que: 'Lo que tengo montado para trabajar. Se levanta el tejado de un edificio y se ve por dentro, planta a planta.',
    piezas: [['agentes', 'Equipo de agentes', 'Varios agentes de IA trabajando en paralelo, uno por proyecto.'], ['servidor', 'Mi servidor', 'El servidor propio donde corren mis webs.'], ['vision', 'Visión en local', 'Un modelo que entiende capturas de pantalla, en mi propio equipo.']] },
];

const sala = document.querySelector('.sala'), salirB = document.querySelector('.salir'), avisos = document.querySelector('#avisos');
const seEnciendeSola = matchMedia('(hover: hover) and (min-width: 900px)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches;
const quieto = matchMedia('(prefers-reduced-motion: reduce)').matches;
// lo que sobra de cada escena cuando va dentro del portfolio: su cabecera y su titular (ya los tiene la página)
const DENTRO = '.barra, .heroe { display: none !important; }';
let dentro = null;      // el expositor en el que se ha entrado

for (const e of EXPOSITORES) {
  const s = document.createElement('article'); s.className = 'expositor'; s.id = `expositor-${e.id}`;
  s.innerHTML = `<div class="vitrina-hueco"><div class="vitrina">
      <img src="arte/${e.id}.webp" alt="" loading="lazy">
      <button type="button" class="abrir" aria-label="Entrar en ${e.nombre}"><span>Entrar</span></button>
      <span class="piloto" aria-hidden="true">Encendido · toca para entrar</span>
    </div></div>
    <div class="cartela">
      <p class="ante">${e.grupo}</p>
      <h3>${e.nombre}</h3>
      <p class="que">${e.que}</p>
      <ul>${e.piezas.map(([id, n, l]) => `<li><button type="button" data-pieza="${id}"><b>${n}</b><small>${l}</small><em aria-hidden="true">→</em></button></li>`).join('')}</ul>
      <button type="button" class="boton boton-luz" data-pieza=""><span class="boton-tapa">Entrar en ${e.nombre.toLowerCase()}</span></button>
    </div>`;
  sala.append(s);
  e.el = s; e.hueco = s.querySelector('.vitrina-hueco'); e.vitrina = s.querySelector('.vitrina'); e.marco = null; e.ratio = 0;
  s.querySelector('.abrir').addEventListener('click', () => entrar(e, '', s.querySelector('.abrir')));
  s.querySelector('.cartela').addEventListener('click', (ev) => { const b = ev.target.closest('[data-pieza]'); if (b) entrar(e, b.dataset.pieza, b); });
}

// ── Encender y apagar una vitrina ──
function encender(e, ruta = '') {
  if (e.marco) return e.lista;
  const f = document.createElement('iframe');
  f.title = `${e.nombre}: escena interactiva`; f.src = `../maquetas-e1/${e.id}/#${ruta || e.inicio}`;
  f.setAttribute('tabindex', '-1');
  e.marco = f; e.vitrina.insertBefore(f, e.vitrina.querySelector('.abrir'));
  e.lista = new Promise((hecho) => f.addEventListener('load', async () => {
    const d = f.contentDocument, w = f.contentWindow;
    if (!d) return hecho(false);                       // no es del mismo sitio: se queda la foto
    d.head.append(Object.assign(d.createElement('style'), { textContent: DENTRO }));
    w.dispatchEvent(new Event('resize'));
    w.addEventListener('pointerdown', () => { if (dentro !== e) entrar(e, '', null); }, true);
    w.addEventListener('keydown', (ev) => { if (ev.key === 'Escape' && dentro === e && w.__estado?.().ruta === e.inicio) salir(); }, true);
    for (let k = 0; k < 400 && e.marco === f && !d.querySelector('.cargando-velo')?.classList.contains('fuera'); k++) await new Promise((r) => setTimeout(r, 50));
    if (e.marco !== f) return hecho(false);
    e.vitrina.classList.add('viva'); hecho(true);
  }, { once: true }));
  return e.lista;
}
function apagar(e) {
  if (!e.marco || dentro === e) return;
  e.vitrina.classList.remove('viva'); const f = e.marco; e.marco = null; e.lista = null;
  setTimeout(() => f.remove(), 500);
}

// ── Entrar y salir: la vitrina crece desde su hueco hasta la pantalla entera (y vuelve) ──
function alHueco(e) {
  const r = e.hueco.getBoundingClientRect();
  return `translate(${r.left}px, ${r.top}px) scale(${r.width / innerWidth}, ${r.height / innerHeight})`;
}
async function entrar(e, ruta, desde) {
  if (dentro) return;
  dentro = e; e.vuelta = desde;
  for (const o of EXPOSITORES) if (o !== e) apagar(o);
  const yaEstaba = !!e.marco;
  encender(e, ruta);
  const v = e.vitrina;
  v.style.transition = 'none'; v.style.transform = alHueco(e); v.classList.add('grande');
  v.getBoundingClientRect();
  v.style.transition = quieto ? 'none' : ''; v.style.transform = 'none';
  document.body.classList.add('dentro'); salirB.hidden = false;
  avisos.textContent = `Has entrado en ${e.nombre}. Escape o el botón «Volver al portfolio» para salir.`;
  await e.lista;
  if (dentro !== e) return;
  const w = e.marco.contentWindow;
  if (yaEstaba && ruta) w.location.hash = ruta;
  e.marco.removeAttribute('tabindex'); w.focus();
}
function salir() {
  const e = dentro; if (!e) return;
  dentro = null;
  const v = e.vitrina, w = e.marco?.contentWindow;
  try { if (w?.__estado && w.__estado().ruta !== e.inicio) w.location.hash = e.inicio; } catch { /* aún cargando */ }
  e.marco?.setAttribute('tabindex', '-1');
  v.style.transform = alHueco(e);
  document.body.classList.remove('dentro'); salirB.hidden = true;
  setTimeout(() => {
    v.style.transition = 'none'; v.classList.remove('grande'); v.style.transform = '';
    v.getBoundingClientRect(); v.style.transition = '';
    if (!seEnciendeSola) { dentro = null; apagar(e); }
  }, quieto ? 0 : 520);
  (e.vuelta ?? e.el.querySelector('.cartela .boton')).focus({ preventScroll: true });
  avisos.textContent = 'De vuelta en el portfolio.';
}
salirB.addEventListener('click', salir);
addEventListener('keydown', (ev) => { if (ev.key === 'Escape' && dentro) salir(); });

// ── La que más se ve, encendida (solo una, y tras quedarse un momento) ──
if (seEnciendeSola) {
  let espera = 0;
  const mirar = new IntersectionObserver((cambios) => {
    for (const c of cambios) EXPOSITORES.find((e) => e.hueco === c.target).ratio = c.intersectionRatio;
    clearTimeout(espera);
    espera = setTimeout(() => {
      if (dentro) return;
      const mejor = EXPOSITORES.reduce((a, b) => (b.ratio > a.ratio ? b : a));
      for (const e of EXPOSITORES) if (e !== mejor || mejor.ratio < 0.55) apagar(e);
      if (mejor.ratio >= 0.55) encender(mejor);
    }, 350);
  }, { threshold: [0, 0.25, 0.55, 0.75, 1] });
  for (const e of EXPOSITORES) mirar.observe(e.hueco);
}
window.__sala = () => ({ dentro: dentro?.id ?? null, vivas: EXPOSITORES.filter((e) => e.vitrina.classList.contains('viva')).map((e) => e.id) });
