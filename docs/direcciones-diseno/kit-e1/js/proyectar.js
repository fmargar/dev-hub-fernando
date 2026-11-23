// Pegar un elemento de la página encima de un rectángulo del 3D: se le da un tamaño fijo y una matrix3d que lleva
// sus cuatro esquinas a las cuatro esquinas proyectadas, así sigue la perspectiva del marco aunque la cámara no lo
// mire de frente. Las esquinas, en píxeles y en este orden: arriba-izquierda, arriba-derecha, abajo-derecha,
// abajo-izquierda.
export function ajustar(el, [[x0, y0], [x1, y1], [x2, y2], [x3, y3]]) {
  // el tamaño base: la media de los lados, para que el texto de dentro salga con su tamaño natural
  const w = Math.max(40, Math.round((Math.hypot(x1 - x0, y1 - y0) + Math.hypot(x2 - x3, y2 - y3)) / 2));
  const h = Math.max(30, Math.round((Math.hypot(x3 - x0, y3 - y0) + Math.hypot(x2 - x1, y2 - y1)) / 2));
  // la homografía del cuadrado unidad a las cuatro esquinas
  const dx1 = x1 - x2, dx2 = x3 - x2, dy1 = y1 - y2, dy2 = y3 - y2, sx = x0 - x1 + x2 - x3, sy = y0 - y1 + y2 - y3;
  const den = dx1 * dy2 - dx2 * dy1 || 1e-9;
  const g = (sx * dy2 - dx2 * sy) / den, k = (dx1 * sy - sx * dy1) / den;
  const a = x1 - x0 + g * x1, b = x3 - x0 + k * x3, d = y1 - y0 + g * y1, e = y3 - y0 + k * y3;
  const m = [a / w, d / w, 0, g / w, b / h, e / h, 0, k / h, 0, 0, 1, 0, x0, y0, 0, 1].map((v) => +v.toFixed(6));
  // solo lo suyo: el resto del estilo en línea (p. ej. las variables de color que pone la pantalla) se respeta
  const st = el.style;
  st.setProperty('left', '0'); st.setProperty('top', '0'); st.setProperty('width', `${w}px`); st.setProperty('height', `${h}px`);
  st.setProperty('transform-origin', '0 0'); st.setProperty('transform', `matrix3d(${m.join(',')})`);
}

// quitar lo que puso `ajustar` (cuando el elemento pasa a ocupar la pantalla por CSS), sin tocar lo demás
export function desajustar(el) {
  for (const k of ['left', 'top', 'width', 'height', 'transform-origin', 'transform']) el.style.removeProperty(k);
}
