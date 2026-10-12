# Estética del portfolio: mar + tarjetas con foil

Propuesta de dirección de arte · 12/10/2026.
Base: [decisión de rumbo](decision-rumbo-2026-10-12.md), los prototipos
[pesca](../direcciones-diseno/vivos/pesca.html) y [acuario](../direcciones-diseno/vivos/acuario.html).

Los prototipos hacen protagonista al acuario: fondo raster a pantalla completa y una criatura
por proyecto. Conservaremos la sensación de agua y los colores vivos; el contenido liderará.
Las tres alternativas comparten nombre, titular exacto «Desarrollador Full Stack · IA en producción · agentes de IA»,
CV y contacto visibles, proyectos → experiencia → habilidades → contacto y casos en `/work/<slug>`.
El foil será la única firma interactiva. El mar aportará ambiente, sin exigir acciones para leer.

## 1. Profundidad bioluminiscente — recomendada

- **Carácter:** agua azul eléctrica, espacio oscuro y pequeños organismos ilustrados. Sensación
  de estar bajo el agua, con la claridad de un portfolio de producto y sin interfaz de acuario.
- **Paleta:** agua `#083CFF`, profundidad `#061433`, tarjeta `#081B40`, texto `#FFFFFF`,
  secundario `#C6D8FF`, luz `#00E5FF`, acción `#FFD600`, destello foil `#FF2EC4`.
- **Google Fonts:** [Bricolage Grotesque](https://fonts.google.com/specimen/Bricolage+Grotesque)
  700–800 para nombre y títulos; [Manrope](https://fonts.google.com/specimen/Manrope) 400–600 para lectura y controles.
- **Escritorio:** cabecera con navegación, CV y contacto; nombre y titular a la izquierda;
  primera tarjeta real a la derecha, grande y frontal. Agua visible en los márgenes y detrás
  de esa tarjeta. Las siguientes tarjetas empiezan inmediatamente debajo, en dos columnas.
- **Móvil:** nombre, titular legible en caja normal, breve presentación y CV/contacto;
  primera tarjeta a continuación. Portada con altura de contenido; objetivo a 390 × 844:
  ver el nombre y la propuesta de valor del primer proyecto sin pasar una pantalla de peces.
- **Mar:** degradado continuo, cáusticas generativas tenues y dos o tres peces vectoriales
  de silueta clara en los márgenes. Sin etiquetas ni equivalencia con proyectos; cantidad fija.
  Nada de lecho marino fotográfico ni corales luminosos rodeando el contacto.
- **Foil:** tarjeta ancha, captura limpia y franja de texto opaca. Iridiscencia intensa en
  un marco de 2–3 mm visuales y zonas del encabezado; brillo direccional al mover el puntero,
  inclinación máxima de 3°. En reposo conserva color y textura: se reconoce también en móvil.
- **Riesgo a controlar:** exceso de neón. El fondo queda más tenue que las capturas;
  nombre, texto y botones conservan color sólido, sin halo ni degradado tipográfico.

## 2. Mar de tinta — editorial e ilustrado

- **Carácter:** composición gráfica rotunda: grandes planos de azul, cortes de ola y peces
  dibujados con contornos definidos. Más cartel contemporáneo que paisaje submarino.
- **Paleta:** papel blanco `#FFFFFF`, tinta `#071B32`, ultramar `#123BFF`, agua `#00C8E8`,
  tarjeta `#F7FAFF` como neutral, acción `#FF3B30`, destello `#D800FF`; ningún acento pastel.
- **Google Fonts:** [Archivo](https://fonts.google.com/specimen/Archivo) 700–900 para titulares;
  [Source Sans 3](https://fonts.google.com/specimen/Source+Sans+3) 400–600 para contenido.
- **Escritorio:** nombre grande sobre blanco, titular y acciones debajo. Un plano ultramar
  atraviesa el lateral derecho con dos peces recortados; una tarjeta destacada cruza su borde.
  Después, retícula de dos columnas con mucho aire y pies alineados.
- **Móvil:** columna blanca de lectura; ola azul estrecha al borde, ilustración recortada
  en la esquina y primera tarjeta directamente bajo las acciones. Texto de al menos 1rem.
- **Mar:** ilustración SVG propia, tres planos planos de agua, ondulación mínima de una línea;
  sin shader, volumen realista ni parallax. Las olas separan secciones sin desplazar contenido.
- **Foil:** lámina multicolor en borde y pequeña banda de categoría; el contraste con el
  blanco la hace destacar. Captura y bloque de lectura mantienen su apariencia real.
- **Riesgo a controlar:** parecer una marca turística. Evitar iconos de vacaciones;
  la pieza dominante será siempre una captura o un diagrama de software.

## 3. Marea óptica — material y luz abstracta

- **Carácter:** agua entendida como refracción y reflejo; composición sobria, precisa,
  con una superficie líquida azul que se transforma visualmente en lámina holográfica.
- **Paleta:** fondo `#030B18`, tarjeta `#0B2038`, texto `#FFFFFF`, secundario `#BDD0E7`,
  azul `#005BFF`, reflejo `#00F0FF`, violeta foil `#7A28FF`, acción `#B8FF00`.
- **Google Fonts:** [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk) 600–700
  para títulos y [Manrope](https://fonts.google.com/specimen/Manrope) 400–600 para lectura.
- **Escritorio:** portada horizontal: nombre, titular y acciones arriba; una tarjeta
  destacada ancha debajo, con captura a la derecha. Un reflejo atraviesa el fondo lateral,
  sin tapar la información. Proyectos restantes en dos columnas de tarjetas más compactas.
- **Móvil:** cabecera corta, presentación y tarjeta apiladas. Reflejo lateral estático;
  ninguna escena adicional entre presentación y trabajo. Acciones con texto explícito.
- **Mar:** solo color y luz; campo procedural de ondas con refracción suave, sin fauna.
  La dirección de iluminación del fondo coincide con el brillo de las tarjetas.
- **Foil:** aspecto de metal iridiscente cepillado, bandas oblicuas y microtextura;
  borde fino muy saturado, reflejo amplio sobre el marco y zona de imagen reservada alrededor
  de la captura. Bloque de texto opaco y frontal, sin movimiento tridimensional.
- **Riesgo a controlar:** quedar en un degradado genérico. Usar un patrón de ondas propio,
  una dirección de luz consistente y decisiones de espaciado repetibles, sin manchas aleatorias.

## Cómo conseguir agua integrada, sin una foto pegada

1. **Construir el agua, no retocar la foto.** En 1 y 3: base CSS + campo de luz procedural;
   en 2: formas SVG planas. Mantener una composición continua entre portada y proyectos.
2. **Cáusticas concretas:** un fragment shader sobre un rectángulo, coordenadas UV corregidas
   por proporción, dos campos de ruido desplazados lentamente y crestas afinadas con
   `smoothstep`. Es una aproximación gráfica a la luz del agua, no una simulación física.
   Aplicar máscara para concentrarla arriba y a los lados; nunca distorsionar texto ni capturas.
3. **Capas con oficio:** color de profundidad → cáusticas → dos o tres siluetas → contenido.
   Luz de la misma familia cromática en todas las capas. `pointer-events: none` en el ambiente.
   Un grano monocromo fijo al 1–2 % ayuda a unirlas; el grano solo no arregla una foto evidente.
4. **Profundidad por color:** pasar de azul eléctrico a azul profundo por sección mediante
   fondos interpolados, sin oscurecer las superficies de lectura. Evitar metros, sonar y HUD;
   el scroll sigue siendo normal y ningún bloque espera una animación para aparecer.
5. **Peces que nadan bien:** recorridos horizontales predeterminados, cabeceo ±8° y ondulación
   de cola. Para volver, salir del encuadre y reaparecer mirando al otro lado; evitar giros
   completos y cambios bruscos de espejo. Medusas verticales solo si sustituyen a un pez.
6. **Base robusta:** HTML legible sin canvas; cargar el efecto después del contenido.
   Canvas de resolución reducida, DPR limitado a 1–1,5, tope propuesto de 30 fps y pausa
   fuera de portada o con pestaña oculta. Medir en móvil antes de aumentar detalle;
   [MDN recomienda reducir el búfer cuando el coste lo exige](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices).
7. **Movimiento opcional:** con `prefers-reduced-motion`, mar y foil estáticos, sin inclinación;
   en táctil, foil estático vistoso y apertura directa con un toque. Evitar veinte brillos
   perpetuos. [La preferencia se detecta con CSS](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion).
   Verificar contraste AA en reposo y durante el brillo; el foil queda detrás de las zonas opacas.

## Tarjetas: entender primero, profundizar después

Orden visible sin hover ni reverso: **nombre + qué es → mi aportación → resultado**.
Nombre de 2–5 palabras; definición de hasta 12; aportación de hasta 15; resultado de hasta 12.
Son presupuestos editoriales para facilitar el vistazo de 3 s, no una garantía de comprensión.
Añadir captura real legible, categoría escrita, hasta tres tecnologías y «Ver caso».
La captura enseña una función reconocible, sin portátil de adorno; diagrama propio si es interno.
El caso amplía contexto, decisiones y pruebas; web o código solo cuando exista acceso publicable.

| Proyecto | Qué debe mostrar su imagen | Prueba que priorizar en el resultado |
|---|---|---|
| Adivinadle | Captura real de una partida | Funcionamiento y estado de publicación comprobado |
| Wardux | Artículo real y vista del producto | Web publicada; métricas solo si están medidas |
| Marbella Fácil | Captura real de reserva o panel, extraída de la memoria | TFG: 10 con Matrícula de Honor |
| LLM en el ERP de Odoo | Diagrama generación → revisión → aprobación | Integración en Odoo; aprobación humana antes de publicar |
| Equipo de agentes | Diagrama de roles y una entrega trazable | Cambio concreto validado; atribuir qué revisó Fernando |
| Cálculo Exacto | Captura de un cálculo y su desglose | Ejemplo contrastado de precisión; evitar «cero errores» |
| Vados de Marbella | Diagrama de roles e importación, sin datos personales | Despliegue municipal y alcance territorial documentados |
| Su servidor | Diagrama de arquitectura con datos no sensibles | Servicios operativos; cifras comprobadas y fechadas |

**Foil por tipo, nunca por nivel de importancia:** producto publicado = arcoíris;
empresa = azul/cian; precisión = verde/cian; sistema propio = violeta/fucsia;
académico = rojo/azul. Cinco familias fijas, con categoría escrita; evitar oro marrón y rarezas de juego.
Separar categoría del estado «Publicado / Interno / En desarrollo». No deducir resultados del diseño.
Ejemplo respaldado: «LLM en el ERP de Odoo · Descripciones de producto con IA»;
«Mi aportación: desarrollé el módulo y el instalador con simulación y reversión»;
«Resultado: revisión humana antes de publicar». Sin porcentajes de ahorro inventados.

**De 8 a 20:** misma ficha de datos y componente; tres proyectos destacados en portada
y enlace «Ver los 20 proyectos» al índice completo. Índice con 2–3 columnas en escritorio,
una en móvil y filtros por tipo, con «Todos» por defecto. Orden por evidencia relevante,
sin carrusel ni desplazamiento infinito. Imágenes inferiores con carga diferida;
activar seguimiento del puntero solo en la tarjeta señalada. El mar mantiene sus 2–3 peces.

## Recomendación en cinco líneas

Elegiría **Profundidad bioluminiscente**: conserva el mar y los pececitos que le gustan a Fernando.
El agua será generativa y las criaturas escasas; las tarjetas contendrán todo el trabajo.
Azul eléctrico, cian y amarillo darán energía; texto blanco sobre superficies opacas dará claridad.
La portada mostrará un proyecto real desde el principio y el foil será la única firma interactiva.
Así, añadir proyectos ampliará el portfolio sin convertirlo en un acuario cada vez más grande.
