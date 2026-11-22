// Las tablas se rellenan con lo que dejó el medidor (medir/medir.mjs → medidas.json).
const NOMBRE = { a: 'A · Blender', b: 'B · three.js', c: 'C · CSS 3D', d: 'D · SVG 3D' };
const INTER = [['sacar', 'Sacar'], ['girar', 'Girar'], ['arrastrar', 'Arrastrar'], ['abrir', 'Abrir'], ['volver', 'Volver']];
const kb = (n) => (n >= 1024 ? `${(n / 1024).toFixed(1).replace('.', ',')} MB` : `${n} KB`);
try {
  const filas = await (await fetch('medidas.json')).json();
  const tabla = document.getElementById('tabla-fluidez');
  const cab = `<thead><tr><th scope="col">Técnica</th><th scope="col">Modo</th><th scope="col">Pantalla</th>${INTER.map(([, n]) => `<th scope="col">${n}</th>`).join('')}</tr></thead>`;
  const cuerpo = filas.map((f) => `<tr><th scope="row">${NOMBRE[f.tecnica]}</th><td>${f.modo === 'gpu' ? 'Con gráfica' : 'Por software'}</td><td>${f.ancho === 390 ? 'Móvil' : 'Escritorio'}</td>${INTER.map(([k]) => {
    const m = f.medidas[k]; return `<td class="n${m.presentados < 30 ? ' mal' : ''}">${Math.round(m.presentados)} <small>(${Math.round(m.peor)})</small></td>`;
  }).join('')}</tr>`).join('');
  tabla.insertAdjacentHTML('beforeend', cab + `<tbody>${cuerpo}</tbody>`);
  for (const t of ['a', 'b', 'c', 'd']) {
    const f = filas.find((x) => x.tecnica === t && x.ancho === 1440 && x.modo === 'software') ?? filas.find((x) => x.tecnica === t);
    const m = filas.find((x) => x.tecnica === t && x.ancho === 390 && x.modo === 'software');
    const tr = document.querySelector(`#tabla-coste tr[data-t="${t}"]`);
    if (!f || !tr) continue;
    tr.querySelector('[data-campo="lista"]').innerHTML = `<span class="n">${kb(f.pesoLista)}</span>`;
    tr.querySelector('[data-campo="total"]').innerHTML = `<span class="n">${kb(f.pesoTotal)}</span>${m && m.pesoTotal !== f.pesoTotal ? ` <small>(móvil ${kb(m.pesoTotal)})</small>` : ''}`;
  }
} catch (e) {
  document.getElementById('tabla-fluidez').insertAdjacentHTML('beforeend', '<tbody><tr><td>No se han podido cargar las medidas.</td></tr></tbody>');
}
