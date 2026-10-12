// Tarjeta de proyecto, foil que sigue al puntero y los diagramas de los proyectos internos.
export const QUIETO = matchMedia('(prefers-reduced-motion: reduce)').matches;
const ACENTO = { producto: '#ffd23b', empresa: '#59e0ff', precision: '#3bff9a', sistema: '#ff6ef0', academico: '#ff5a7a' };
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

// Diagramas en SVG para lo que no tiene una pantalla pública: cómo funciona, no una ilustración
function caja(x, y, w, h, txt, c, relleno = false) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="7" fill="${relleno ? c : 'none'}" stroke="${c}" stroke-width="2"/>` +
    `<text x="${x + w / 2}" y="${y + h / 2 + 4.5}" text-anchor="middle" font-size="12.5" font-weight="700" fill="${relleno ? '#060d3d' : '#f5f7ff'}">${txt}</text>`;
}
const flecha = (x1, y1, x2, y2, c) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="2" marker-end="url(#pf)"/>`;
export function diagrama(id, tipo) {
  const a = ACENTO[tipo], p = '#f5f7ff', n = '#aab6ea';
  const def = `<defs><marker id="pf" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" fill="${n}"/></marker></defs>`;
  const D = {
    erp: () => caja(14, 30, 120, 38, 'Ficha técnica', n) + flecha(134, 49, 182, 49, n) + caja(186, 30, 120, 38, 'La IA redacta', p) +
      flecha(246, 68, 246, 104, n) + caja(176, 108, 140, 40, 'Una persona aprueba', a, true) + flecha(176, 128, 132, 128, n) +
      caja(14, 108, 116, 40, 'Publicada', p) + `<text x="160" y="182" text-anchor="middle" font-size="11.5" fill="${n}">Sin aprobación no se publica nada</text>`,
    calculo: () => `<text x="20" y="34" font-size="12" font-weight="700" fill="${n}">Caso</text><text x="150" y="34" font-size="12" font-weight="700" fill="${n}">Frente a la AEAT</text>` +
      ['01', '02', '03'].map((c, i) => `<text x="20" y="${64 + i * 30}" font-size="12.5" fill="${p}">Caso ${c}</text><rect x="150" y="${53 + i * 30}" width="110" height="14" rx="3" fill="none" stroke="${n}"/><text x="205" y="${64 + i * 30}" text-anchor="middle" font-size="11" fill="${p}">coincide</text><text x="290" y="${64 + i * 30}" font-size="13" fill="${a}">✓</text>`).join('') +
      `<text x="20" y="${64 + 3 * 30 - 6}" font-size="12.5" fill="${n}">…</text><line x1="20" y1="148" x2="300" y2="148" stroke="${n}" stroke-dasharray="3 4"/><text x="20" y="176" font-size="14" font-weight="800" fill="${a}">46 de 46 casos, 0,00 € de diferencia</text>`,
    vados: () => [0, 1, 2, 3].map(i => caja(16 + i * 74, 22, 64, 34, `Zona ${i + 1}`, p)).join('') +
      [0, 1, 2, 3].map(i => flecha(48 + i * 74, 56, 160, 96, n)).join('') + caja(96, 98, 128, 38, 'Un solo sistema', a, true) +
      caja(16, 150, 104, 30, 'Formato antiguo 1', n) + caja(200, 150, 104, 30, 'Formato antiguo 2', n) + flecha(120, 158, 130, 136, n) + flecha(200, 158, 190, 136, n),
    agentes: () => caja(100, 18, 120, 38, 'Supervisor', a, true) + `<text x="160" y="74" text-anchor="middle" font-size="11" fill="${n}">revisa cada hora</text>` +
      ['Adivinadle', 'Wardux', 'Cálculo', 'Portfolio'].map((t, i) => flecha(160, 56, 46 + i * 76, 112, n) + caja(8 + i * 76, 114, 72, 34, t, p)).join('') +
      `<text x="160" y="180" text-anchor="middle" font-size="11.5" fill="${n}">Un agente por proyecto; yo decido y reviso</text>`,
    servidor: () => [['Cloudflare', a, true], ['Webs en contenedores Docker', p], ['PostgreSQL', p], ['Copias en 3 capas, una cifrada fuera', n]]
      .map(([t, c, r], i) => caja(30, 16 + i * 42, 260, 34, t, c, r)).join(''),
    vision: () => `<rect x="24" y="18" width="180" height="150" rx="8" fill="none" stroke="${n}" stroke-width="2"/>` +
      `<rect x="38" y="34" width="150" height="22" rx="4" fill="none" stroke="${a}" stroke-width="2"/><rect x="38" y="66" width="70" height="86" rx="4" fill="none" stroke="${a}" stroke-width="2"/><rect x="118" y="66" width="70" height="40" rx="4" fill="none" stroke="${a}" stroke-width="2"/>` +
      flecha(206, 94, 232, 94, n) + `<text x="268" y="86" text-anchor="middle" font-size="30" font-weight="800" fill="${a}">6/6</text><text x="268" y="106" text-anchor="middle" font-size="11" fill="${n}">pantallas</text><text x="268" y="122" text-anchor="middle" font-size="11" fill="${n}">2,7 GB</text>`,
  };
  return `<svg viewBox="0 0 320 200" role="img" aria-label="Esquema de cómo funciona" font-family="Hanken Grotesk, sans-serif" style="background:#060d3d">${def}${D[id]()}</svg>`;
}

export function tarjeta(p, tipos, { href = `o-caso.html#${p.id}`, carga = 'lazy', accion = 'Ver el caso' } = {}) {
  const fig = p.imagen ? `<img src="${p.imagen}" alt="Captura de ${esc(p.nombre)}" loading="${carga}">` : diagrama(p.diagrama, p.tipo);
  return `<a class="tarjeta" href="${href}" data-tipo="${p.tipo}" data-id="${p.id}">
    <div class="lamina">
      <header><h3>${esc(p.nombre)}</h3><span class="estado" data-estado="${p.estado}">${p.estado}</span></header>
      <div class="figura">${fig}</div>
      <p class="tipo">${tipos[p.tipo].nombre}</p>
      <div class="texto"><p class="que">${esc(p.que)}</p><dl><dt>Qué hice</dt><dd>${esc(p.papel)}</dd><dt>Resultado</dt><dd>${esc(p.resultado)}</dd></dl></div>
      <footer><span>${p.stack.join(', ')}</span><b>${accion}</b></footer>
    </div><i class="brillo" aria-hidden="true"></i></a>`;
}

// El foil y una inclinación leve siguen al puntero (solo con ratón; en táctil la lámina va sola)
export function vivir(t, inclina = 7) {
  t.addEventListener('pointermove', e => {
    if (QUIETO || e.pointerType !== 'mouse') return;
    const r = t.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    t.style.setProperty('--mx', `${x * 100}%`); t.style.setProperty('--my', `${y * 100}%`);
    t.style.setProperty('--ry', `${(x - .5) * inclina}deg`); t.style.setProperty('--rx', `${(.5 - y) * inclina * .8}deg`);
  });
  t.addEventListener('pointerleave', () => { t.style.setProperty('--rx', '0deg'); t.style.setProperty('--ry', '0deg'); });
}
