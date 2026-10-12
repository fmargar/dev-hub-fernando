# Ideas originales para el portfolio · Claude · 12/10/2026

Escritas antes de leer las de Codex, para no contaminarnos. El criterio de Fernando: que se
recuerde por el estilo («el de las cartas», «el de la ciudad») y que cada idea **sirva para algo**.
Regla común a todas: debajo de la experiencia hay HTML normal con el contenido (CV, proyectos,
contacto), así Google, los lectores de pantalla y el reclutador con prisa lo tienen igual.

## 1. El sobre de cartas (las cartas, en serio)
- **Mecánica:** al entrar te dan un sobre. Lo rasgas (arrastrando o con un botón) y salen 5
  cartas con rareza: Adivinadle es la legendaria con foil completo, Wardux épica, etc. Las
  cartas se guardan en un **álbum** (la página de proyectos), cada una se **da la vuelta** y el
  reverso es el caso técnico: stack, decisiones, enlace a la web y al código.
- **Función de verdad: «Arma tu mazo».** El reclutador elige las 3–4 cartas que encajan con su
  puesto (backend, IA, producto...) y la web le genera **un CV en PDF a medida** que destaca
  esas. Nadie más tiene eso.
- **Se recuerda como:** «el del sobre de cartas Pokémon».
- **Cómo:** CSS 3D + un shader de foil (o el CSS que ya funciona), animación del sobre con GSAP.
  El PDF con la misma plantilla del CV maestro. En móvil, el foil reacciona al giroscopio.
- **Riesgo:** infantil si las cartas no están muy bien acabadas; por eso el texto de cada carta
  es serio y las estadísticas son reales.

## 2. La ciudad que se construye con cartas (fusión de las dos)
- **Mecánica:** empiezas con un solar vacío en isométrico y una mano de cartas. Cada carta que
  juegas **levanta su edificio** en la ciudad (Adivinadle, el local de juegos; Wardux, la torre
  de prensa; el servidor...). Con todas jugadas, la ciudad está completa y se ilumina. Entrar en
  un edificio abre su interior: el caso de estudio.
- **Función:** la ciudad es el menú. Día y noche = tema claro y oscuro. El robot del tejado es
  un asistente que contesta preguntas sobre Fernando (con su CV como fuente).
- **Se recuerda como:** «el que construías su ciudad jugando cartas».
- **Cómo:** PixiJS o Phaser con sprites isométricos de un solo estilo (generados y retocados por
  capas), todo en la misma rejilla. En móvil, la ciudad en vertical con la mano abajo, como un
  juego de móvil.
- **Riesgo:** el más caro de hacer bien; si los sprites no casan entre sí, parece un collage.

## 3. La consola y sus cartuchos
- **Mecánica:** una consola portátil en 3D (estilo Game Boy, en sus colores). Los proyectos son
  **cartuchos** con su etiqueta; los arrastras a la ranura y la pantalla de la consola enseña el
  proyecto funcionando (vídeo real o la web dentro). Botón A = abrir la web; B = ver el código.
- **Función:** el CV es un cartucho más («Fernando.cv»): al meterlo se descarga.
- **Se recuerda como:** «el de la Game Boy con cartuchos».
- **Cómo:** React Three Fiber con un modelo propio. En móvil la consola es vertical y ocupa la
  pantalla, así que encaja de forma natural.
- **Riesgo:** los modelos 3D tienen que estar muy bien; uno mediocre lo hunde.

## 4. Adivina al desarrollador (el Adivinadle de Fernando)
- **Mecánica:** la portada es un juego diario como Adivinadle, pero lo que se adivina es
  **qué proyecto de Fernando usa una tecnología**: escribes «Laravel» y las casillas se ponen en
  verde, amarillo o rojo por proyecto. Cada acierto desbloquea la ficha del proyecto.
- **Función:** enseña tu producto estrella usándolo, y de paso las tecnologías.
- **Se recuerda como:** «el que convirtió su portfolio en su propio juego».
- **Cómo:** reutiliza componentes de Adivinadle (mismo código, misma estética de despacho).
- **Riesgo:** pide esfuerzo al visitante; necesita un «Saltar al CV» muy visible.

## 5. El tablero del detective
- **Mecánica:** un corcho con los proyectos clavados como pruebas (polaroids, recortes) y
  **hilos rojos** que los unen por la tecnología que comparten. Pulsas «PostgreSQL» y se
  tensan los hilos de los proyectos que la usan; el resto se apaga.
- **Función:** es un mapa de habilidades navegable: el lead técnico ve en un vistazo dónde ha
  usado cada cosa.
- **Se recuerda como:** «el del tablero de investigación con hilos».
- **Cómo:** SVG para los hilos (física sencilla con verlet), fotos reales por capas.
- **Riesgo:** recargado si hay muchos hilos; se limita a 8–10 tecnologías.

## 6. Sala de control en directo (sirve como capa de cualquiera)
- **Mecánica:** un panel con el estado **real** de sus webs: si están arriba, último despliegue,
  puntuación de Lighthouse del último CI, artículos publicados hoy en Wardux, partidas jugadas
  hoy en Adivinadle.
- **Función:** prueba viva de que mantiene software en producción.
- **Se recuerda como:** «el que tenía sus webs en directo».
- **Cómo:** un endpoint público y saneado en su servidor (solo cifras agregadas).
- **Riesgo:** ninguna cifra puede delatar infraestructura sensible.

## 7. El mapa de metro
- **Mecánica:** líneas = tecnologías, estaciones = proyectos, transbordos = proyectos que usan
  varias. Es el menú de toda la web.
- **Se recuerda como:** «el del plano de metro».
- **Riesgo:** recurso conocido en diseño, menos en portfolios de desarrollo.

## Sobre usar un motor de juego
Godot exportado a web pesa decenas de MB y tarda en cargar: mal para un reclutador en el móvil.
Para coherencia de juego sin ese peso: **PixiJS** (2D) o **React Three Fiber** (3D), cargando la
experiencia después del contenido.

## Mi top
1. **El sobre de cartas** con «Arma tu mazo» → CV a medida. Lo que más le gustó, llevado a una
   función útil que nadie tiene.
2. **La ciudad que se construye con cartas** si se quiere el proyecto grande: une las dos ideas.
3. **El tablero del detective** como página de habilidades dentro de cualquiera de las dos.
