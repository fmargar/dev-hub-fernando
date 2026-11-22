// El librillo de la caja: sale de sus pestañas, se abre y se pasan las hojas como en un manual de juego.
// Portada, qué es, qué hice yo, el resultado con sus cifras, con qué está hecho y la última página.
import { colores } from './caja.js';
import { sonar } from './sonido.js';

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const CURVA = 'cubic-bezier(.22, 1, .36, 1)';

function paginas(p) {
  const b = Object.fromEntries(p.bloques);
  const pg = [];
  pg.push({ portada: true });
  pg.push({ sobre: 'Capítulo 1', h: 'Qué <em>es</em>', html: `<p class="pg-p">${esc(b['Qué es'])}</p><p class="pg-p">${esc(p.tipo)} · ${esc(p.estado)}.</p><span class="pg-vineta" style="--px:15%;--py:85%"></span>` });
  if (b['Qué hice yo']) pg.push({ sobre: 'Capítulo 2', h: 'Qué hice <em>yo</em>', html: `<p class="pg-p">${esc(b['Qué hice yo'])}</p><p class="pg-cita">«${esc(p.lema)}»</p>` });
  pg.push({ sobre: `Capítulo ${pg.length}`, h: 'El <em>resultado</em>', html: `<p class="pg-p">${esc(b.Resultado)}</p><ul class="pg-cifras">${p.cifras.slice(0, 2).map(([n, t]) => `<li><b>${esc(n)}</b><span>${esc(t)}</span></li>`).join('')}</ul>` });
  const con = [];
  if (p.stack.length) con.push(`<div class="pg-stack">${p.stack.map((s) => `<span>${esc(s)}</span>`).join('')}</div>`);
  if (p.jugar) con.push(`<p class="pg-p"><b>Cómo se juega la demo.</b> ${esc(p.jugar)}</p>`);
  if (p.web) con.push(`<a class="pg-enlace" href="${p.web[1]}" target="_blank" rel="noopener">${esc(p.web[0])} ↗</a>`);
  if (con.length) pg.push({ sobre: `Capítulo ${pg.length}`, h: p.stack.length ? 'Con <em>qué</em>' : 'Dónde <em>verlo</em>', html: con.join('') });
  if (pg.length % 2 === 0) pg.push({ sobre: 'Notas', h: '', html: '<p class="pg-p" style="opacity:.45">Página en blanco para tus notas, como en los manuales de antes.</p>' });
  pg.push({ fin: true });
  return pg;
}

function paginaHTML(p, x, i, total) {
  if (x.portada) return `<div class="pg pg-portada"><div class="k-arte"></div><div class="pg-portada-txt"><span>Fragua · Manual de instrucciones</span><b>${esc(p.nombre)}</b></div></div>`;
  if (x.fin) return `<div class="pg pg-fin"><span class="sello">FM</span><p class="pg-h" style="font-size:9cqw">Fin del manual</p><p class="pg-p">${p.demo ? 'Mete el disco en la consola para jugar la demo.' : 'Mete el disco en la consola para ver el tráiler.'}</p><p class="pg-num" style="margin-top:8cqw;text-align:center">${i + 1} / ${total}</p></div>`;
  return `<div class="pg"><p class="pg-sobre"><span>${esc(x.sobre)}</span><span>${esc(p.nombre)}</span></p>${x.h ? `<p class="pg-h">${x.h}</p>` : ''}${x.html}<p class="pg-num">${i + 1} / ${total}</p></div>`;
}

export function abrirManual(p, { origen, RM, estrecho, alCerrar }) {
  const capa = document.getElementById('manual');
  const pg = paginas(p), hojas = pg.length / 2;
  const vw = innerWidth, vh = innerHeight;
  const pw = estrecho ? Math.min(vw - 40, (vh - 150) / 1.3) : Math.min(430, (vw - 140) / 2, (vh - 150) / 1.3);
  const ph = pw * 1.3;
  capa.style.cssText = `${colores(p)};--pw:${pw}px;--ph:${ph}px;--cm:${p.color}`;
  capa.innerHTML = `<div class="manual-velo"></div>
    <div class="libro cerrado${estrecho ? ' estrecho' : ''}"><div class="libro-mueve">${Array.from({ length: hojas }, (_, h) => `<div class="hoja" data-h="${h}" style="z-index:${hojas - h}">
      <div class="pagina">${paginaHTML(p, pg[h * 2], h * 2, pg.length)}</div><div class="pagina vuelta">${paginaHTML(p, pg[h * 2 + 1], h * 2 + 1, pg.length)}</div></div>`).join('')}</div></div>
    <div class="manual-mandos">
      <button type="button" class="boton boton-oscuro" data-m="atras"><span class="boton-tapa"><kbd>←</kbd> Atrás</span></button>
      <button type="button" class="boton" data-m="cerrar"><span class="boton-tapa">Guardar el manual <kbd>Esc</kbd></span></button>
      <button type="button" class="boton boton-luz" data-m="pasar"><span class="boton-tapa">Pasar hoja <kbd>→</kbd></span></button>
    </div><p class="manual-voz" aria-live="polite"></p>`;
  if (estrecho) {
    const l = capa.querySelector('.libro');
    l.style.cssText = 'width:var(--pw);overflow:hidden';
    l.classList.remove('cerrado');
    for (const h of capa.querySelectorAll('.hoja')) h.style.left = '0';
  }
  capa.hidden = false;
  document.documentElement.classList.add('ocupado');
  const libro = capa.querySelector('.libro'), velo = capa.querySelector('.manual-velo'), voz = capa.querySelector('.manual-voz');
  const hojaEls = [...capa.querySelectorAll('.hoja')];
  const bAtras = capa.querySelector('[data-m="atras"]'), bPasar = capa.querySelector('[data-m="pasar"]');
  let vuelta = 0, cerrando = false;

  function decir() {
    const vis = vuelta === 0 ? [pg[0]] : [pg[vuelta * 2 - 1], pg[vuelta * 2]].filter(Boolean);
    voz.textContent = vis.map((x) => (x.portada ? `Manual de ${p.nombre}` : x.fin ? 'Fin del manual' : capa.querySelector(`.hoja[data-h="${Math.floor(pg.indexOf(x) / 2)}"] .pagina${pg.indexOf(x) % 2 ? '.vuelta' : ':not(.vuelta)'}`).textContent.replace(/\s+/g, ' ').trim())).join(' · ');
    bAtras.disabled = vuelta === 0;
    bPasar.disabled = vuelta === (estrecho ? hojas * 2 - 1 : hojas);
  }

  // En el móvil se ve una página: cada hoja tiene dos caras, así que «pasar» alterna entre girar y dar la vuelta
  function pasar(dir) {
    if (cerrando) return;
    const max = estrecho ? hojas * 2 - 1 : hojas;
    const n = Math.max(0, Math.min(max, vuelta + dir));
    if (n === vuelta) return;
    vuelta = n;
    sonar.pagina();
    if (estrecho) {
      // páginas sueltas: la hoja actual se va a la izquierda y se ve la siguiente cara
      hojaEls.forEach((h, i) => {
        const pasadas = Math.floor(vuelta / 2);
        h.classList.toggle('pasada', i < pasadas || (i === pasadas && vuelta % 2 === 1));
        h.style.zIndex = i === pasadas ? hojas + 2 : (i < pasadas ? i : hojas - i);
      });
      // en el móvil la cara de atrás de la hoja en curso debe verse: se gira la hoja pero se deja a la vista
      const actual = hojaEls[Math.floor(vuelta / 2)];
      if (actual) actual.style.transform = vuelta % 2 === 1 ? 'translateX(var(--pw)) rotateY(-180deg)' : '';
      hojaEls.forEach((h, i) => { if (i !== Math.floor(vuelta / 2)) h.style.transform = ''; });
    } else {
      hojaEls.forEach((h, i) => {
        const pasada = i < vuelta;
        if (h.classList.contains('pasada') !== pasada) h.style.zIndex = hojas + 2;
        h.classList.toggle('pasada', pasada);
      });
      setTimeout(() => hojaEls.forEach((h, i) => { h.style.zIndex = i < vuelta ? i + 1 : hojas - i; }), RM ? 0 : 760);
      libro.classList.toggle('cerrado', vuelta === 0 || vuelta === hojas);
      libro.querySelector('.libro-mueve').style.transform = vuelta === hojas ? 'translateX(calc(var(--pw) / 2))' : '';
    }
    decir();
  }

  // Del librillo de la caja al centro de la pantalla
  const destino = () => {
    const r = libro.getBoundingClientRect();
    const ancho = estrecho ? r.width : r.width / 2;
    const x = estrecho ? r.left : r.left + (vuelta === 0 ? r.width / 4 : 0);
    return { x, y: r.top, w: ancho, h: r.height };
  };
  const o = origen.getBoundingClientRect(), d = destino();
  const desde = `translate(${o.left - d.x}px, ${o.top - d.y}px) scale(${o.width / d.w}, ${o.height / d.h})`;
  libro.style.transformOrigin = estrecho ? '0 0' : `${pw / 2}px 0`;
  const vuelo = libro.animate([{ transform: desde }, { transform: 'none' }], { duration: RM ? 1 : 620, easing: CURVA });
  velo.animate([{ opacity: 0 }, { opacity: 1 }], { duration: RM ? 1 : 300, fill: 'forwards' });
  origen.closest('.dentro-tapa')?.parentElement.closest('.cp')?.classList.add('libro-fuera');
  sonar.pagina();
  vuelo.finished.then(() => { capa.classList.add('puesto'); bPasar.focus({ preventScroll: true }); }).catch(() => {});
  decir();

  async function cerrar() {
    if (cerrando) return; cerrando = true;
    capa.classList.remove('puesto');
    // se cierra el libro antes de volver a su sitio
    if (vuelta) {
      vuelta = 0;
      hojaEls.forEach((h, i) => { h.classList.remove('pasada'); h.style.transform = ''; h.style.zIndex = hojas - i; });
      libro.classList.toggle('cerrado', !estrecho);
      libro.querySelector('.libro-mueve').style.transform = '';
      if (!RM) await new Promise((r) => setTimeout(r, 520));
    }
    const o2 = origen.getBoundingClientRect(), d2 = destino();
    const hacia = `translate(${o2.left - d2.x}px, ${o2.top - d2.y}px) scale(${o2.width / d2.w}, ${o2.height / d2.h})`;
    velo.animate([{ opacity: 1 }, { opacity: 0 }], { duration: RM ? 1 : 360, fill: 'forwards' });
    await libro.animate([{ transform: 'none' }, { transform: hacia }], { duration: RM ? 1 : 480, easing: 'cubic-bezier(.5, 0, .2, 1)', fill: 'forwards' }).finished.catch(() => {});
    origen.closest('.cp')?.classList.remove('libro-fuera');
    capa.hidden = true; capa.innerHTML = '';
    document.removeEventListener('keydown', teclas, true);
    alCerrar?.();
  }

  function teclas(e) {
    if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); cerrar(); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); e.stopPropagation(); pasar(1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); e.stopPropagation(); pasar(-1); }
    else if (e.key === 'Tab') {
      const f = [...capa.querySelectorAll('button:not(:disabled), a[href]')];
      const i = f.indexOf(document.activeElement);
      if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
    }
  }
  document.addEventListener('keydown', teclas, true);
  capa.addEventListener('click', (e) => {
    const m = e.target.closest('[data-m]')?.dataset.m;
    if (m === 'cerrar') cerrar();
    else if (m === 'pasar') pasar(1);
    else if (m === 'atras') pasar(-1);
    else if (e.target.closest('a')) return;
    else if (e.target.closest('.hoja')) {
      const r = libro.getBoundingClientRect();
      pasar(estrecho ? (e.clientX < r.left + r.width * .3 ? -1 : 1) : (e.clientX < r.left + r.width / 2 ? -1 : 1));
    } else if (e.target === velo) cerrar();
  });
  return { cerrar, abierto: () => !cerrando };
}
