// El plató común: los mismos cuatro pasos, la misma botonera, las mismas teclas y la misma dirección
// (#balda, #portada, #dorso, #abierta) en las cuatro técnicas. Cada técnica solo sabe ir a un paso.
import { PASOS } from './datos.js';

export const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
export const estrecho = () => innerWidth < 760;

export function montarPlato({ irA, alCambiarDetalle, detallesEnVivo = true, avisoDetalle = '' }) {
  const barra = document.querySelector('.pasos');
  barra.innerHTML = PASOS.map((p, i) => `<button type="button" data-paso="${p.id}"><i>${i + 1}</i><span>${p.boton}</span></button>`).join('');
  const dice = document.querySelector('.dice');
  let actual = null;

  function poner(id, { inmediato = false, historia = true } = {}) {
    if (!PASOS.some((p) => p.id === id)) id = 'balda';
    if (id === actual) return;
    const antes = actual; actual = id;
    for (const b of barra.children) b.setAttribute('aria-current', b.dataset.paso === id ? 'step' : 'false');
    dice.textContent = PASOS.find((p) => p.id === id).dice;
    document.documentElement.dataset.paso = id;
    if (historia) history.pushState({ paso: id }, '', `#${id}`);
    irA(id, { inmediato: inmediato || RM, desde: antes });
  }
  barra.addEventListener('click', (e) => { const b = e.target.closest('[data-paso]'); if (b) poner(b.dataset.paso); });
  addEventListener('popstate', () => poner(location.hash.slice(1) || 'balda', { historia: false }));
  addEventListener('keydown', (e) => {
    if (e.target.closest('input, textarea, select')) return;
    const i = PASOS.findIndex((p) => p.id === actual);
    if (e.key === 'ArrowRight' && i < PASOS.length - 1) { e.preventDefault(); poner(PASOS[i + 1].id); }
    else if (e.key === 'ArrowLeft' && i > 0) { e.preventDefault(); poner(PASOS[i - 1].id); }
    else if (e.key === 'Escape' && i > 0) { e.preventDefault(); poner(PASOS[i - 1].id); }
  });

  // Cambiar un detalle: el título y el color de la caja
  const panel = document.querySelector('.detalle');
  if (panel) {
    const aviso = panel.querySelector('.detalle-aviso');
    if (aviso && avisoDetalle) aviso.innerHTML = avisoDetalle;
    panel.querySelectorAll('input, button[data-color]').forEach((c) => { if (!detallesEnVivo) c.disabled = true; });
    panel.addEventListener('input', (e) => { if (e.target.name === 'titulo') alCambiarDetalle?.('titulo', e.target.value.trim() || 'Adivinadle'); });
    panel.addEventListener('click', (e) => {
      const b = e.target.closest('[data-color]'); if (!b || b.disabled) return;
      panel.querySelectorAll('[data-color]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      alCambiarDetalle?.('color', b.dataset.color);
    });
  }

  const inicial = location.hash.slice(1) || 'balda';
  history.replaceState({ paso: inicial }, '', `#${inicial}`);
  poner(inicial, { inmediato: true, historia: false });
  return { poner, get actual() { return actual; } };
}

// Arrastrar para girar la caja (con el ratón o el dedo); al soltar, la técnica decide adónde vuelve.
export function arrastre(el, { alMover, alSoltar, alEmpezar }) {
  let x0 = 0, y0 = 0, id = null, movido = false;
  el.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return; id = e.pointerId; x0 = e.clientX; y0 = e.clientY; movido = false;
    el.setPointerCapture(id); alEmpezar?.();
  });
  el.addEventListener('pointermove', (e) => {
    if (e.pointerId !== id) return;
    const dx = e.clientX - x0, dy = e.clientY - y0;
    if (!movido && Math.hypot(dx, dy) < 4) return;
    movido = true; el.classList.add('arrastrando'); alMover(dx, dy);
  });
  const fin = (e) => { if (e.pointerId !== id) return; id = null; el.classList.remove('arrastrando'); if (movido) alSoltar?.(); };
  el.addEventListener('pointerup', fin); el.addEventListener('pointercancel', fin);
}
