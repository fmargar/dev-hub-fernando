# Portfolio de Fernando Martínez · 30 direcciones nuevas · Ronda 2

12 de octubre de 2026. Leídos el encargo inicial, la ronda 1 de Codex y las ideas de Claude. Esta ronda abre diez familias con tres conceptos cada una; las propuestas anteriores solo reaparecen en la comparación final.

**Mi recomendación actual: Letras con masa + Margen de autor.** La primera aporta una firma visual propia; la segunda convierte cada afirmación en algo comprobable. Para una apuesta más física, probaría Membrana táctil. Para poner los agentes en primer plano, Proponer no es ejecutar.

## Condiciones que comparten las 30

- Primera pantalla: **Fernando Martínez**, Marbella y el titular exacto **«Desarrollador Full Stack · IA en producción · agentes de IA»**. Proyectos, CV, Contacto y ES / EN / DE visibles; sin introducción obligatoria.
- Proyectos de referencia: Adivinadle, Wardux, Cálculo Exacto, integración Odoo, servidor propio, vados municipales y Marbella Fácil. El encargo aporta sus hechos; este documento no verifica sus métricas ni añade resultados inventados. Cada caso separará problema, contribución de Fernando, decisiones y evidencia.
- HTML con rutas propias para todo el contenido; teclado, foco visible, scroll nativo, pausa y movimiento reducido. Arrastrar, girar o jugar tiene alternativa por botones. En móvil se recompone la interfaz y se prueban las traducciones largas.
- Color intenso con superficies legibles: azul eléctrico, amarillo, verde ácido, naranja o magenta en combinaciones deliberadas. Sin pasteles, marrones, rojo dominante, emojis, degradados morados ni tarjetas luminosas. El material de Membrana es goma, no foil.
- **Peso:** estimación del total transferido comprimido para portada + experiencia inicial, incluyendo HTML, CSS, JS, fuentes y recursos iniciales; excluye PDF, vídeos y casos cargados después. `Base / completa` distingue lectura inicial y descarga acumulada al activar gráficos o juego. No son mediciones del repositorio ni garantías de rendimiento; la GPU se evalúa aparte.
- **Puntuación:** O = originalidad, C = claridad para reclutamiento, M = viabilidad móvil; 1 baja, 5 alta. Son juicios de diseño, considerando las alternativas descritas, no datos de contratación. Un 5 de originalidad no significa que nadie haya usado antes esa técnica.
- **Prompts:** cada uno tiene dos frases en inglés y describe una captura de escritorio 16:9. En todos se aplica el titular exacto anterior, además de las restricciones de color y navegación; las imágenes serían moodboards, no pruebas de funcionamiento. No se han generado imágenes.

## 1. Interfaz como mundo

### 01 · FM / Buscar — El portfolio es un lanzador de acciones que ya muestra respuestas antes de escribir.

- **Primera pantalla:** escritorio: campo enorme «¿Qué quieres comprobar?» y resultados reales; móvil: tres consultas pulsables y el primer proyecto, junto al perfil.
- **Mecánica:** elegir «IA con revisión», «Producto publicado» o buscar filtra casos por evidencias; cada resultado abre su ruta. CV y contacto son acciones siempre visibles, también dentro del lanzador.
- **«El de…»:** el buscador que respondía con proyectos suyos.
- **Técnica:** Next.js, React, índice JSON local, búsqueda por términos y sinónimos en TypeScript; **300–500 KB**, sin LLM.
- **Riesgo:** parece un buscador vacío si exige escribir; los resultados iniciales deben tener nombre, contribución y prueba.
- **Puntuación:** O **3/5** · C **5/5** · M **5/5**.
- **Prompt visual:** Create a realistic 16:9 desktop portfolio screenshot for Fernando Martínez built around an oversized search launcher on electric blue and white. Show populated project results, three plain-language query suggestions, a readable professional headline and persistent CV, contact and language controls.

### 02 · API para humanos — Una app de peticiones y respuestas presenta trabajo profesional en lenguaje corriente.

- **Primera pantalla:** escritorio: «Petición: necesito IA supervisada» y «Respuesta: Odoo + Wardux» en dos columnas; móvil: petición y respuesta apiladas, sin código obligatorio.
- **Mecánica:** seleccionar una necesidad genera una respuesta editorial fija con proyectos y pruebas; «Ver contrato técnico» explica alcance y límites. «Obtener CV» descarga y «Abrir conversación» lleva a contacto.
- **«El de…»:** la API que se entendía sin programar.
- **Técnica:** React, formularios HTML y respuestas declarativas en JSON; CSS Grid y transiciones nativas; **300–480 KB**.
- **Riesgo:** demasiada jerga convierte la interfaz en documentación para ingenieros; verbos normales primero, sintaxis HTTP opcional.
- **Puntuación:** O **4/5** · C **4/5** · M **5/5**.
- **Prompt visual:** Design a real 16:9 desktop portfolio screenshot for Fernando Martínez as a human-readable request-and-response application, with white panels and vivid orange labels. Display a plain-language request about supervised AI and a response containing Odoo and Wardux, with visible project, CV and contact navigation.

### 03 · Menú de partida — La web adopta la elegancia de un menú de videojuego contemporáneo, con trabajo real como contenido.

- **Primera pantalla:** escritorio: nombre y menú «Proyectos / Trayectoria / CV / Contacto» sobre azul intenso; móvil: selección grande con resumen de Adivinadle ya abierto.
- **Mecánica:** flechas, teclado o toque cambian de proyecto y actualizan una descripción frontal; abrir muestra el caso completo. CV y contacto son destinos directos; no hay partida ni niveles bloqueados.
- **«El de…»:** el menú de videojuego que era su currículum.
- **Técnica:** React, CSS, Web Animations API, navegación por rutas; sonido opcional tras activarlo; **330–550 KB** sin audio.
- **Riesgo:** puede parecer fan art; identidad original, sin personajes prestados, cartuchos, consola ni estadísticas ficticias.
- **Puntuación:** O **3/5** · C **4/5** · M **5/5**.
- **Prompt visual:** Create a realistic 16:9 desktop portfolio screenshot for Fernando Martínez using the crisp menu language of a contemporary game, without showing a console or game characters. Use cobalt blue, acid green selection marks and oversized project names, with an immediately readable role and explicit CV and contact destinations.

## 2. Tipografía y movimiento

### 04 · Letras con masa — Los nombres de los proyectos son letras elásticas que ceden espacio al contenido seleccionado.

- **Primera pantalla:** escritorio: ADIVINADLE, WARDUX y ODOO en grandes bandas azul, blanco y amarillo; móvil: nombres verticales, un resultado por banda y titular fijo.
- **Mecánica:** pulsar un nombre ensancha su franja y ajusta la anchura tipográfica de las vecinas; aparece el caso en texto estable. CV y contacto usan el mismo gesto tipográfico, con enlaces directos.
- **«El de…»:** las letras que se estiraban para enseñarte sus webs.
- **Técnica:** React, CSS Grid, fuente variable WOFF2 con eje de anchura, Web Animations API; **320–520 KB**; lectura estática con movimiento reducido.
- **Riesgo:** deformar el titular o mover el texto mientras se lee; solo se anima el nombre corto al abrir o cerrar.
- **Puntuación:** O **4/5** · C **5/5** · M **5/5**.
- **Prompt visual:** Create a real 16:9 desktop portfolio screenshot for Fernando Martínez with giant elastic project typography occupying interlocking horizontal bands. Use electric blue, white and sharp yellow, one expanded readable project section, compact CV and contact links, and no illustrations.

### 05 · Relevo verbal — Una frase cambia de verbo al recorrer la web y cada verbo aterriza en un proyecto concreto.

- **Primera pantalla:** escritorio: «Diseño. Construyo. Compruebo.» con una palabra protagonista y una prueba debajo; móvil: la primera frase completa y enlace al caso, sin esperar al scroll.
- **Mecánica:** el scroll normal entrega el protagonismo a «Integro», «Reviso» o «Mantengo», vinculados a Odoo, Wardux y servidor; pulsar salta al caso. CV y contacto permanecen en cabecera y cierre.
- **«El de…»:** los verbos gigantes que acababan en pruebas.
- **Técnica:** HTML, CSS sticky e IntersectionObserver para activar transiciones discretas; fuente variable y React mínimo; **280–450 KB**.
- **Riesgo:** convertirse en eslóganes vacíos; cada verbo lleva una contribución atribuida y evidencia, sin párrafos que vuelan.
- **Puntuación:** O **3/5** · C **5/5** · M **5/5**.
- **Prompt visual:** Make a realistic 16:9 desktop website screenshot for Fernando Martínez where an enormous typographic verb anchors a clean editorial composition. Use white, black and saturated orange, with a concrete Odoo evidence excerpt, readable profile text and always-visible CV and contact links.

### 06 · La página negocia — La maquetación redistribuye su espacio cuando el visitante pide más detalle de una frase.

- **Primera pantalla:** escritorio: cuatro columnas tipográficas de anchuras distintas con nombres y resultados; móvil: cuatro bloques legibles y «Ampliar este caso».
- **Mecánica:** ampliar una columna reserva espacio al caso y convierte las otras en índices rotulados; cerrar restaura posición y foco. CV y contacto tienen columnas propias, siempre accesibles como enlaces.
- **«El de…»:** la página que hacía sitio a lo que te interesaba.
- **Técnica:** React, CSS Grid y animación de tamaños con límites de layout; scroll nativo; **300–500 KB**.
- **Riesgo:** saltos de lectura y foco perdido; abrir cerca del botón, conservar anclas y usar cambio instantáneo en móvil si conviene.
- **Puntuación:** O **4/5** · C **4/5** · M **4/5**.
- **Prompt visual:** Create a realistic 16:9 desktop portfolio screenshot for Fernando Martínez with an asymmetric typographic grid that reallocates space to a selected project. Show one wide white reading column and narrow electric green and blue index columns, keeping the professional headline, CV and contact easy to locate.

## 3. 3D, física y WebGL

### 07 · Campo magnético — Los nombres flotan como piezas magnéticas y se alinean al elegir una capacidad demostrada.

- **Primera pantalla:** escritorio: cinco nombres tridimensionales suspendidos, con resultados en HTML; móvil: composición frontal quieta y botones «Producto / IA / Datos».
- **Mecánica:** elegir capacidad atrae únicamente los proyectos pertinentes a una línea legible; tocar abre el caso. CV y contacto son anclajes textuales fijos, fuera del movimiento.
- **«El de…»:** los proyectos que se atraían como imanes.
- **Técnica:** Three.js, geometrías de texto precalculadas, fuerzas amortiguadas propias y raycasting; **base 300–450 KB / completa 1–1,7 MB**.
- **Riesgo:** relacionar todo con todo y producir una sopa flotante; relaciones documentadas, posiciones finales estables y lista equivalente.
- **Puntuación:** O **4/5** · C **3/5** · M **3/5**.
- **Prompt visual:** Create a realistic 16:9 desktop portfolio screenshot for Fernando Martínez featuring suspended matte 3D project lettering attracted into a precise horizontal alignment. Use acid green and charcoal objects against white, with stable HTML labels, a selected AI filter and clearly visible CV and contact links.

### 08 · Membrana táctil — Cada proyecto vive sobre una superficie de goma que se hunde al tocarla y recupera su forma.

- **Primera pantalla:** escritorio: tres superficies continuas azul, naranja y verde con nombres y recortes de producto; móvil: una franja frontal con lectura completa, sin hover.
- **Mecánica:** presionar produce una depresión local; soltar abre el caso en una superficie plana del mismo color. CV y contacto están en bordes rotulados, pulsables sin deformación.
- **«El de…»:** la web de goma que podías hundir.
- **Técnica:** Three.js, malla subdividida, shader de desplazamiento y máscara local; sin simulación de tela completa; **base 300–450 KB / completa 1,2–2 MB**.
- **Riesgo:** el shader puede marear o gastar batería; texto fuera del canvas, render en reposo detenido y versión CSS estática.
- **Puntuación:** O **5/5** · C **4/5** · M **3/5**.
- **Prompt visual:** Create a real 16:9 desktop portfolio screenshot for Fernando Martínez built from continuous matte rubber surfaces in electric blue, vivid orange and green. Show a shallow tactile indentation beside a clearly named project and real interface crop, with flat readable profile text and unobstructed CV and contact navigation.

### 09 · Materia mutable — Un único sólido cambia de forma y material según el producto seleccionado.

- **Primera pantalla:** escritorio: escultura compacta naranja junto a «Cálculo Exacto» y su resultado aportado; móvil: escultura pequeña sobre una ficha completa y selector textual.
- **Mecánica:** elegir proyecto transforma el sólido mediante formas diseñadas: precisión facetada, edición estratificada, juego perforado; abrir lee el caso. CV y contacto son enlaces de la composición, sin controlar la cámara.
- **«El de…»:** la escultura que cambiaba para cada proyecto.
- **Técnica:** Three.js, Blender, mallas con topología compatible y morph targets, materiales simples; **base 300–450 KB / completa 1,4–2,5 MB**.
- **Riesgo:** arte abstracto sin información; cada forma necesita una justificación breve, y el caso debe resultar claro sin verla.
- **Puntuación:** O **4/5** · C **4/5** · M **4/5**.
- **Prompt visual:** Render a realistic 16:9 desktop portfolio screenshot for Fernando Martínez with one sculptural orange solid morphing between carefully designed geometric forms. Keep the object beside a crisp Cálculo Exacto project summary on white, with strong blue typography and straightforward CV, contact and language controls.

## 4. Generativo / arte con datos

### 10 · Relieve de trabajo — Un paisaje de curvas de nivel nace de la actividad agregada y aprobada de los proyectos.

- **Primera pantalla:** escritorio: relieve ultramar y verde ácido con Adivinadle y Wardux rotulados; móvil: corte vertical del relieve y leyenda junto al primer caso.
- **Mecánica:** seleccionar una zona abre el proyecto y explica qué intervalo genera sus alturas; fecha y leyenda distinguen actividad de calidad. CV y contacto figuran en la leyenda de navegación.
- **«El de…»:** las montañas hechas con el trabajo de sus repositorios.
- **Técnica:** agregación local de commits por semana, JSON saneado y SVG de contornos precalculados; **380–650 KB**; sin consultar repos privados desde el navegador.
- **Riesgo:** pocos commits no significan poco trabajo; no usar altura como ranking de talento ni mostrar autores, mensajes o rutas.
- **Puntuación:** O **4/5** · C **3/5** · M **4/5**.
- **Prompt visual:** Create a realistic 16:9 desktop portfolio screenshot for Fernando Martínez with vivid topographic contour fields generated from approved weekly project activity. Use ultramarine and acid green, explicit project labels and a small data legend, while keeping the role, CV and contact readable above the terrain.

### 11 · Jardín de pruebas — Plantas geométricas crecen a partir de suites documentadas, con flores que representan grupos de verificaciones.

- **Primera pantalla:** escritorio: tres plantas gráficas verdes, azules y magenta con nombres; móvil: una planta y su leyenda «Cálculo Exacto: 46 casos, según el encargo».
- **Mecánica:** pulsar una flor abre el grupo de pruebas y su alcance; elegir planta abre el caso. CV y contacto son etiquetas claras al pie; se ve el informe también sin el jardín.
- **«El de…»:** las plantas que crecían con sus pruebas.
- **Técnica:** JSON aprobado de informes CI, gramática de ramificación en TypeScript y SVG generado al construir; **350–600 KB**.
- **Riesgo:** flores bonitas sugieren cobertura total; agrupar por tipo, señalar fecha y límites, y mostrar ausencia de evidencia sin esconderla.
- **Puntuación:** O **5/5** · C **4/5** · M **5/5**.
- **Prompt visual:** Create a real 16:9 desktop portfolio screenshot for Fernando Martínez showing three sharply geometric digital plants derived from documented test groups. Use saturated green, blue and magenta on white, visible project names and a concise evidence legend, with clear CV and contact navigation and no cute characters.

### 12 · Huella de versiones — Cada producto obtiene una huella gráfica única a partir de sus fechas de publicación aprobadas.

- **Primera pantalla:** escritorio: huellas de líneas concéntricas asimétricas, nombre y última fecha verificada; móvil: una huella grande y listado de proyectos debajo.
- **Mecánica:** tocar un tramo identifica una versión y enlaza su cambio documentado; pulsar el nombre abre el caso. CV y contacto quedan junto a la firma de Fernando.
- **«El de…»:** las huellas dactilares hechas con versiones de sus webs.
- **Técnica:** JSON de publicaciones saneadas, funciones deterministas y SVG; detalle por botones, no precisión sobre líneas; **330–560 KB**.
- **Riesgo:** confundir el dibujo con identidad biométrica o esconder la cronología; explicar la codificación y ofrecer lista textual con fechas.
- **Puntuación:** O **4/5** · C **4/5** · M **4/5**.
- **Prompt visual:** Design a realistic 16:9 desktop portfolio screenshot for Fernando Martínez with bold asymmetric fingerprint-like line patterns generated from software release dates. Use black, electric orange and blue, place each pattern beside a named project and dated release note, and retain prominent CV and contact links.

## 5. Juego de verdad

### 13 · Un céntimo de margen — Un puzle numérico de 40 segundos convierte la precisión en una experiencia jugable.

- **Primera pantalla:** escritorio: operación ficticia, objetivo y «Jugar / Ver proyectos»; móvil: tablero grande de botones, ejemplo resuelto y perfil visible.
- **Mecánica:** mover la posición de redondeo para alcanzar un total bajo reglas explícitas; semillas distintas permiten repetir. Al resolver o salir aparecen Cálculo Exacto y otros casos; CV y contacto nunca se bloquean.
- **«El de…»:** el juego donde un céntimo cambiaba todo.
- **Técnica:** React, enteros en céntimos, generador determinista de retos y animación CSS; **350–580 KB**; sin motor.
- **Riesgo:** resultar un examen o parecer asesoría fiscal; operaciones de juguete etiquetadas, ayuda inmediata y explicación disponible desde el inicio.
- **Puntuación:** O **4/5** · C **3/5** · M **5/5**.
- **Prompt visual:** Create a realistic 16:9 desktop portfolio screenshot for Fernando Martínez around a short number puzzle with a one-cent target and large tactile numeric controls. Use white, electric green and blue, explain the fictional arithmetic rules in one line, and show Cálculo Exacto, skip-to-projects, CV and contact links.

### 14 · Caza del dato — Un microjuego de lectura consiste en encontrar afirmaciones que no están respaldadas por las fuentes visibles.

- **Primera pantalla:** escritorio: párrafo breve con dos fuentes y «Encuentra el dato sin prueba»; móvil: tres frases grandes y fuentes expandibles, junto al titular.
- **Mecánica:** marcar una frase consume una de tres oportunidades; cada acierto explica la discrepancia y enlaza el caso Wardux u Odoo. Variantes preparadas permiten repetir; directorio, CV y contacto quedan visibles.
- **«El de…»:** el juego de cazar los datos que una IA se inventaba.
- **Técnica:** React, banco multilingüe de ejemplos ficticios, reglas locales y feedback CSS; **350–650 KB** según textos iniciales.
- **Riesgo:** exigir demasiada lectura; rondas de tres frases, dificultad inicial mínima y ejemplos que no atribuyan invenciones a personas reales.
- **Puntuación:** O **4/5** · C **3/5** · M **4/5**.
- **Prompt visual:** Create a real 16:9 desktop portfolio screenshot for Fernando Martínez featuring a compact fact-checking game with three short statements and two visible source excerpts. Use vivid yellow selection marks and cobalt typography on white, clearly connect the activity to Wardux and Odoo, and keep projects, CV and contact accessible.

### 15 · Dos a la vez — Dos cursores autónomos intentan escribir en el mismo espacio y el jugador evita sus colisiones.

- **Primera pantalla:** escritorio: rejilla mínima con dos cursores verde y azul y una meta común; móvil: tablero cuadrado, «Pausar / Paso / Ver solución» y presentación.
- **Mecánica:** colocar un permiso de entrada y turnar su uso durante 30 segundos; mapas y velocidades varían. El final explica exclusión mutua y enlaza servidor y agentes; todos los casos, CV y contacto siguen abiertos.
- **«El de…»:** el juego de impedir que dos agentes se pisaran.
- **Técnica:** Canvas 2D, bucle fijo en TypeScript y controles HTML; **360–600 KB**, sin conexión a servicios reales.
- **Riesgo:** simplificar demasiado la coordinación; debrief con lo que demuestra el modelo y lo que no representa de la infraestructura real.
- **Puntuación:** O **5/5** · C **3/5** · M **4/5**.
- **Prompt visual:** Create a realistic 16:9 desktop portfolio screenshot for Fernando Martínez with a minimal concurrency puzzle showing two blue and green cursors sharing a small square grid. Include one large permission control, a short objective, a server project link and visible CV and contact navigation on a bright white interface.

## 6. Objeto físico / táctil

### 16 · Cremallera — Una cremallera vertical separa dos superficies de color y abre espacio a cada caso.

- **Primera pantalla:** escritorio: dientes grandes azul y amarillo, proyecto y resumen ya visibles; móvil: tirador ancho y ficha frontal, sin contenido encerrado.
- **Mecánica:** tirar o pulsar «Abrir caso» separa lateralmente la superficie y amplía la lectura; cerrar conserva posición. CV y contacto usan pestañas exteriores rotuladas, sin exigir abrir nada.
- **«El de…»:** la cremallera que abría los proyectos.
- **Técnica:** SVG, CSS clip-path, Pointer Events y React; **360–600 KB**, sin física ni tejidos fotográficos.
- **Riesgo:** gesto ornamental y poca relación con software; el caso debe ocupar la abertura y mantener el mismo diseño en todas las rutas.
- **Puntuación:** O **5/5** · C **4/5** · M **5/5**.
- **Prompt visual:** Create a real 16:9 desktop portfolio screenshot for Fernando Martínez structured around one oversized vertical zipper between saturated blue and yellow surfaces. Show the zipper partially open around a readable software case study, with visible project labels and explicit CV and contact tabs, avoiding clothing-store imagery.

### 17 · Flexómetro — Una cinta métrica extraíble ordena la trayectoria por hitos, sin convertir años en puntuaciones de habilidad.

- **Primera pantalla:** escritorio: cinta azul desplegada con «TFG / Ayuntamiento / Odoo / Productos propios»; móvil: tramo vertical con hitos y fechas verificables.
- **Mecánica:** extraer con gesto o botones recorre hitos; tocar uno abre proyectos y contribución de esa etapa. CV es la trayectoria descargable y contacto está en el extremo fijo de navegación.
- **«El de…»:** la cinta métrica con su recorrido profesional.
- **Técnica:** SVG, React y scroll nativo con anclas; posición limitada y sin rebobinado obligatorio; **350–600 KB**.
- **Riesgo:** sugerir una carrera lineal o experiencia mayor que la real; fechas exactas, etapas paralelas y sin centímetros equivalentes a talento.
- **Puntuación:** O **4/5** · C **4/5** · M **5/5**.
- **Prompt visual:** Design a realistic 16:9 desktop portfolio screenshot for Fernando Martínez using an oversized blue measuring tape as a professional timeline on white. Label real career stages with readable dates and project names, retain the full professional headline and clear CV and contact links, and avoid literal skill measurements.

### 18 · Rueda índice — Un disco de consulta gira hasta alinear un proyecto con una ventana de lectura frontal.

- **Primera pantalla:** escritorio: disco verde ácido con cinco sectores rotulados y Odoo abierto a su lado; móvil: semicírculo superior y ficha debajo.
- **Mecánica:** girar por pasos, usar flechas o elegir un nombre cambia de caso; la ventana contiene contenido HTML y enlaces. CV y contacto están en el eje rotulado y la cabecera.
- **«El de…»:** la rueda que girabas para consultar sus proyectos.
- **Técnica:** SVG, CSS rotate y React; sectores fijos, navegación por rutas y sin arrastre de precisión; **340–550 KB**.
- **Riesgo:** parece un selector circular común si el disco no tiene diseño propio; debe funcionar como índice completo, sin aguja aleatoria ni premios.
- **Puntuación:** O **3/5** · C **4/5** · M **4/5**.
- **Prompt visual:** Create a realistic 16:9 desktop portfolio screenshot for Fernando Martínez with a large acid-green rotary reference wheel bearing five clearly labelled project sectors. Align Odoo with a spacious white reading window and show precise blue typography, fixed CV and contact controls, and no mixer, roulette or printing-machine imagery.

## 7. Conversación e IA

### 19 · Proponer no es ejecutar — La interfaz de agentes muestra una propuesta, su fuente y el permiso que permite aplicarla.

- **Primera pantalla:** escritorio: «Propuesta / Evidencia / Decisión de Fernando» con un ejemplo Odoo; móvil: tres pasos compactos y caso visible, sin burbujas de chat.
- **Mecánica:** cambiar un requisito en una demo ficticia modifica la propuesta; aprobar o rechazar muestra el desenlace preparado. Los proyectos son ejemplos seleccionables; CV y contacto tienen enlaces normales.
- **«El de…»:** los agentes que tenían que pedir permiso antes de actuar.
- **Técnica:** React, máquina de estados TypeScript y escenarios locales revisados; **350–600 KB**; primera versión sin llamadas a modelos.
- **Riesgo:** aparentar que el ejemplo es una sesión real; rotular «demostración preparada» y explicar por separado el flujo profesional documentado.
- **Puntuación:** O **5/5** · C **4/5** · M **5/5**.
- **Prompt visual:** Create a real 16:9 desktop portfolio screenshot for Fernando Martínez as a compact agent approval interface, with proposal, evidence and human decision clearly separated. Use electric blue and lime accents on white, show an Odoo example with readable approve and reject controls, and retain project, CV and contact navigation without chat bubbles.

### 20 · Dos voces, una decisión — El portfolio presenta una revisión discrepante y deja visible el criterio con el que Fernando la resuelve.

- **Primera pantalla:** escritorio: dos notas breves incompatibles y una resolución central firmada; móvil: desacuerdo en tres líneas y decisión debajo, junto al perfil.
- **Mecánica:** elegir Wardux u otro caso con revisión documentada abre objeciones, fuentes y resolución; el visitante puede comparar alternativas. CV y contacto quedan junto a la atribución humana; sin conversación libre.
- **«El de…»:** los dos agentes que discrepaban y él decidía.
- **Técnica:** HTML, React y SVG de marcas de revisión; extractos autorizados o reconstrucciones etiquetadas; **350–620 KB**.
- **Riesgo:** inventar discusiones para dramatizar o vender consenso como verdad; distinguir archivo, reconstrucción y asunto todavía no resuelto.
- **Puntuación:** O **4/5** · C **4/5** · M **5/5**.
- **Prompt visual:** Design a realistic 16:9 desktop portfolio screenshot for Fernando Martínez showing two concise conflicting review notes and one clearly attributed human resolution. Use saturated orange and blue annotation marks on white, include a Wardux case selector and source links, and keep CV and contact prominent without a chatbot layout.

### 21 · Texto con interruptores — Un documento generado cambia mediante restricciones visibles y conserva la procedencia de cada afirmación.

- **Primera pantalla:** escritorio: ficha ficticia de producto y tres controles «Tono / Longitud / Datos permitidos»; móvil: texto corto, restricciones pulsables y vínculo al caso Odoo.
- **Mecánica:** alternar restricciones cambia frases de salidas preparadas y resalta su origen; «Revisión humana» muestra correcciones. Un índice abre los demás proyectos; CV y contacto permanecen fuera de la demo.
- **«El de…»:** el texto de IA que podías regular y rastrear.
- **Técnica:** React, segmentos de texto con IDs y variantes JSON verificadas; **380–700 KB**; sin LLM requerido, posibles salidas reales autorizadas después.
- **Riesgo:** una demo demasiado limpia oculta los fallos; incluir una salida rechazada y declarar qué partes son simuladas.
- **Puntuación:** O **4/5** · C **4/5** · M **5/5**.
- **Prompt visual:** Create a realistic 16:9 desktop portfolio screenshot for Fernando Martínez centred on a generated product description with three visible constraint switches and sentence-level provenance marks. Use clean white typography areas with electric green and blue controls, an Odoo project link and persistent CV and contact navigation, with no chat input.

## 8. Humor y meta

### 22 · Error 200 — Una falsa página de error anuncia que, afortunadamente, has encontrado un desarrollador con proyectos que abrir.

- **Primera pantalla:** escritorio: «200 · Desarrollador encontrado», nombre, titular y tres proyectos; móvil: la misma broma en dos líneas y un caso visible.
- **Mecánica:** «Inspeccionar resultado» abre casos con hechos y evidencias; CV y contacto son «Descargar CV» y «Contactar», sin bromas que oculten su función. La respuesta HTTP real es correcta.
- **«El de…»:** el error que decía que habías encontrado al desarrollador.
- **Técnica:** Next.js, HTML y CSS tipográfico, sin consola falsa; **280–450 KB**.
- **Riesgo:** algún reclutador interpreta fallo real; incluir «Portfolio de Fernando Martínez» y contenido útil desde el primer vistazo, sin alertas.
- **Puntuación:** O **4/5** · C **4/5** · M **5/5**.
- **Prompt visual:** Create a real 16:9 desktop portfolio screenshot for Fernando Martínez with the witty headline “200 — Desarrollador encontrado” in huge blue type on white. Make the page unmistakably functional with his professional role, three named project summaries and large direct CV and contact links, avoiding browser warning graphics.

### 23 · Oferta invertida — Fernando se presenta como una oferta de trabajo redactada desde lo que él aporta al equipo.

- **Primera pantalla:** escritorio: «Se ofrece desarrollador» y campos «Aporta / Ha construido / Busca conversar»; móvil: rol, aportación y Adivinadle en una columna.
- **Mecánica:** «Aporta» enlaza capacidades con casos; «Experiencia demostrable» abre proyectos y responsabilidades. CV se adjunta como documento y «Hablemos del puesto» abre contacto, sin postulación automática.
- **«El de…»:** la oferta de trabajo que se ofrecía a sí misma.
- **Técnica:** Next.js, HTML, CSS editorial y acordeones nativos; **300–480 KB**.
- **Riesgo:** sonar desesperado o presumido; tono sobrio, nada de promesas salariales ni exigencias inventadas sobre disponibilidad.
- **Puntuación:** O **4/5** · C **5/5** · M **5/5**.
- **Prompt visual:** Create a realistic 16:9 desktop portfolio screenshot for Fernando Martínez formatted as a reversed job listing titled “Se ofrece desarrollador”. Use bold black typography, electric blue section rules and small orange accents, with evidence-based project links and clearly labelled CV attachment and contact actions.

### 24 · Sin lorem ipsum — La portada parece un wireframe, pero todos sus supuestos rellenos son trabajo real y verificable.

- **Primera pantalla:** escritorio: «Aquí iría una promesa. Aquí hay Odoo.» junto a una captura real; móvil: broma breve y resultado, con nombre y titular.
- **Mecánica:** cada anotación del diseño enlaza un caso terminado; «Aquí va el CV» descarga el documento y «Aquí hablamos» abre contacto también rotulado convencionalmente. Las páginas internas conservan anotaciones útiles.
- **«El de…»:** el wireframe que ya estaba lleno de proyectos reales.
- **Técnica:** HTML, CSS, SVG de cotas y capturas AVIF; **380–700 KB**.
- **Riesgo:** parecer inacabado; composición final cuidada, imágenes nítidas y ninguna funcionalidad pendiente disfrazada de chiste.
- **Puntuación:** O **4/5** · C **4/5** · M **5/5**.
- **Prompt visual:** Create a real 16:9 desktop portfolio screenshot for Fernando Martínez styled as an impeccably finished annotated wireframe with actual software content replacing every placeholder. Use black rules, white space and sharp yellow annotations, include a real-looking Odoo interface crop, and make CV and contact controls fully explicit.

## 9. Editorial y sobrio, pero memorable

### 25 · Margen de autor — Una columna lateral identifica qué decidió Fernando y qué prueba respalda cada afirmación del caso.

- **Primera pantalla:** escritorio: gran título, caso Odoo y margen azul «Mi decisión / Mi implementación / Cómo se verifica»; móvil: anotaciones inmediatamente después de cada párrafo.
- **Mecánica:** pulsar una marca abre evidencia o límite, sin abandonar la lectura; índice textual para todos los proyectos. CV y contacto están en la firma de autor y la cabecera.
- **«El de…»:** el margen que explicaba qué había hecho él.
- **Técnica:** Next.js, Markdown estructurado, IDs de evidencia, CSS Grid y enlaces con anclas; **320–550 KB**.
- **Riesgo:** margen saturado o actitud defensiva sobre agentes; anotar decisiones relevantes, atribuir con naturalidad y limitar marcas por párrafo.
- **Puntuación:** O **4/5** · C **5/5** · M **5/5**.
- **Prompt visual:** Create a realistic 16:9 desktop portfolio screenshot for Fernando Martínez as an elegant white editorial page with a vivid blue author-notes margin. Show a concise Odoo case with aligned notes for personal decisions and evidence, generous black typography and immediate CV and contact links, without decorative cards.

### 26 · Índice gigante — La portada entera es una tabla de contenidos que ya cuenta el resultado de cada proyecto.

- **Primera pantalla:** escritorio: cinco filas enormes «01 Adivinadle — juegos diarios», «02 Wardux — edición y revisión»; móvil: tres filas visibles con resultado y titular arriba.
- **Mecánica:** seleccionar fila abre capítulo con ruta propia; el índice permanece compacto dentro de cada caso. CV y contacto son entradas finales rotuladas y enlaces de cabecera.
- **«El de…»:** el índice enorme donde entendías todo antes de entrar.
- **Técnica:** HTML, CSS Grid, tipografía WOFF2 y transiciones opcionales de selección; **290–480 KB**.
- **Riesgo:** convertirse en una lista genérica; proporciones propias, ritmo entre filas y títulos escritos con resultados concretos.
- **Puntuación:** O **3/5** · C **5/5** · M **5/5**.
- **Prompt visual:** Create a real 16:9 desktop portfolio screenshot for Fernando Martínez consisting of an oversized, highly designed table of contents with project names and short outcomes. Use white, black and one electric orange column, strong typographic rhythm and obvious CV, contact and language entries, with no illustrations or card grid.

### 27 · Solo un número — Una cifra comprobable ocupa la portada y obliga al resto del caso a explicar exactamente qué significa.

- **Primera pantalla:** escritorio: «46» azul monumental y «casos de referencia contrastados al céntimo»; móvil: número, alcance y enlace al caso Cálculo Exacto, junto al perfil.
- **Mecánica:** «Qué mide / Cómo se comprobó / Qué no demuestra» abre apartados del caso; un índice lleva a otros proyectos. CV y contacto visibles, sin descargar informe para descubrir al autor.
- **«El de…»:** el 46 gigante que venía con su explicación.
- **Técnica:** Next.js, CSS tipográfico y enlaces a evidencias aprobadas; **280–470 KB**; sin contador animado.
- **Riesgo:** cifra sin respaldo o portfolio reducido a fiscalidad; publicar solo tras verificar metodología y ejercicio, y mostrar dos proyectos más en portada.
- **Puntuación:** O **3/5** · C **5/5** · M **5/5**.
- **Prompt visual:** Create a realistic 16:9 desktop portfolio screenshot for Fernando Martínez dominated by a monumental blue “46” on white with a precise, readable explanation underneath. Include methodology and limitations links, two additional named software projects and explicit CV and contact navigation, with no animated counter styling.

## 10. Comodines

### 28 · La URL es la firma — Una dirección web descomunal hace visible que cada proyecto tiene un lugar propio al que volver.

- **Primera pantalla:** escritorio: «fernando / proyectos / adivinadle» como dirección editorial azul, con resultado debajo; móvil: ruta dividida en líneas pulsables y primer caso.
- **Mecánica:** cada segmento navega de verdad y el historial conserva el recorrido; copiar comparte la URL del caso. CV y contacto son rutas claras con botones explícitos de descargar y escribir.
- **«El de…»:** la dirección gigante que era su menú.
- **Técnica:** rutas Next.js, breadcrumbs HTML, Clipboard API con alternativa manual y CSS; **300–500 KB**; dominio definitivo pendiente, no se inventa uno contratado.
- **Riesgo:** demasiadas barras y sintaxis para no técnicos; segmentos comprensibles y nombres de producto completos, sin fingir una barra de navegador.
- **Puntuación:** O **4/5** · C **4/5** · M **5/5**.
- **Prompt visual:** Create a real 16:9 desktop portfolio screenshot for Fernando Martínez where a huge readable website path acts as the main navigation and visual signature. Show separate clickable project-name segments in electric blue, a concise Adivinadle summary on white and straightforward CV and contact links, without browser chrome or terminal styling.

### 29 · La web que cabe — El visitante cambia el ancho de una demo y ve cómo el mismo producto sigue siendo utilizable.

- **Primera pantalla:** escritorio: demo responsive de Adivinadle y controles «390 / 768 / 1440»; móvil: demo a su ancho natural y selector «Vista estrecha / Amplia», junto al perfil.
- **Mecánica:** cambiar ancho recomponer la demo permite usar una interacción representativa; seleccionar proyecto carga otra. «Ver caso» explica decisiones; CV y contacto quedan fuera del marco de prueba.
- **«El de…»:** el portfolio donde estrechabas sus webs y seguían funcionando.
- **Técnica:** React, componentes de demo aislados, CSS container queries e iframe local solo si hace falta aislar estilos; **base 350–550 KB / con una demo 650 KB–1,2 MB**.
- **Riesgo:** encoger capturas no demuestra responsive; usar una demo funcional autorizada y rotular cualquier reproducción parcial del producto.
- **Puntuación:** O **4/5** · C **5/5** · M **4/5**.
- **Prompt visual:** Create a realistic 16:9 desktop portfolio screenshot for Fernando Martínez with one working-looking Adivinadle demo inside a resizable viewport and three large width presets. Use white, vivid orange measurement guides and blue typography, present the developer role clearly and keep case-study, CV and contact actions outside the demo frame.

### 30 · El portfolio que se queda — Toda la selección profesional puede guardarse para leerla después sin conexión.

- **Primera pantalla:** escritorio: «Puedes llevártelo sin internet», tres casos y «Guardar para después»; móvil: misma lectura y descarga opcional, sin banner de instalación invasivo.
- **Mecánica:** guardar almacena casos aprobados y CV elegido, con progreso y fecha de versión; los proyectos funcionan offline. Contacto permite copiar el correo y aclara cuándo hará falta red para enviar.
- **«El de…»:** el portfolio que podías llevarte entero sin conexión.
- **Técnica:** Next.js estático, service worker, Cache Storage y manifiesto opcional; **base 350–600 KB / paquete offline 1,5–3 MB**, incluyendo CV seleccionado.
- **Riesgo:** documento obsoleto, caché borrada o envío imposible; versión visible, actualización comprobable, estado de descarga y copia directa del correo.
- **Puntuación:** O **4/5** · C **5/5** · M **5/5**.
- **Prompt visual:** Create a real 16:9 desktop portfolio screenshot for Fernando Martínez designed as a portable offline reading edition with a prominent “Guardar para después” action. Use white, saturated green and crisp black typography, show three concrete project summaries and a dated edition label, and keep CV and contact directly accessible without an installation pop-up.

## Referencias premiadas recientes: qué aprender, sin copiar

Consulta web realizada el 12/10/2026. Selección de cinco portfolios de desarrolladores o diseñadores que también desarrollan, con reconocimientos de 2025; no presento una nominación como un premio. Revisados los registros oficiales y el contenido accesible de las páginas. No he medido su rendimiento ni recorrido sus animaciones en un navegador gráfico: las enseñanzas son interpretación creativa de las descripciones y estructura disponibles, no auditorías de usabilidad.

| Portfolio y URL | Reconocimiento comprobado | Qué aprender para Fernando |
|---|---|---|
| [Henri Heymans ’25](https://henriheymans.com/) | Site of the Day y Developer Award, 25/02/2025, en el [registro de Awwwards](https://www.awwwards.com/websites/%23C7C5AF/?page=5). | Su presentación identifica al desarrollador y separa biografía, trabajos, galería y contacto. Aprendizaje: una voz gráfica puede apoyarse en destinos claros; Fernando debe añadir resultados y contribución antes de cualquier entrada ceremonial. |
| [Merouane Bali](https://merodev.net/) | Best Innovation Site en los [premios anuales CSSDA 2025](https://www.cssdesignawards.com/blog/2025-website-of-the-year-winners/430/); la [ficha oficial](https://www.cssdesignawards.com/woty2025/sites/merouane-bali-portfolio/) describe un portfolio 3D y WebGL. | La inmersión puede ser el sistema de presentación completo. Aprendizaje: un material o geometría coherente es más valioso que sumar efectos; para Fernando, exigir que la lectura móvil conserve esa identidad. |
| [Bruno Simon · versión 2025](https://bruno-simon.com/) | [Website of the Month, diciembre de 2025, CSSDA](https://www.cssdesignawards.com/wotm/brunos-portfolio/48599/) y Best Portfolio Site en sus [premios anuales 2025](https://www.cssdesignawards.com/blog/2025-website-of-the-year-winners/430/). FWA también documenta la nueva versión en su [selección de ganadores](https://thefwa.com/FWA25/RobFWA.html). | La experiencia 3D tiene una identidad que cabe en una frase. Aprendizaje: definir una acción memorable antes de elegir motor; no copiar su mundo ni introducir conducción como peaje para leer un caso. |
| [Eliot Besson · Portfolio 2025](https://www.eliotbesson.com/) | [Website of the Day, 10/08/2025, CSSDA](https://www.cssdesignawards.com/sites/eliot-besson-portfolio-2025/47572/); ficha etiquetada como animated, grid y minimal. | Minimalismo y movimiento pueden convivir. Aprendizaje: concentrar el esfuerzo en ritmo, proporciones y una transición reconocible; una portada sin ilustraciones también puede tener carácter. |
| [Ivor J. · Designer + Developer](https://www.ivorjian.com/) | [Special Kudos, 12/07/2025, CSSDA](https://www.cssdesignawards.com/sites/ivor-j-designer-developer/47762/), no Website of the Day. | El contenido diferencia trabajos de diseño, desarrollo y ambas contribuciones, y separa proyectos de estudios visuales. Aprendizaje: atribuir con esa precisión el trabajo de Fernando y distinguir demos experimentales de productos publicados. |

La lección conjunta es una inferencia: **las referencias útiles tienen una decisión de identidad reconocible y una estructura que la sostiene**. Un premio visual no garantiza que un reclutador encuentre el CV, ni acredita rendimiento en móvil.

### Apoyo técnico de las propuestas

Las tecnologías son decisiones propuestas, no librerías instaladas por este encargo. El repositorio ya usa Next.js, React y TypeScript; conservaría esa base y aislaría las experiencias pesadas. Fuentes técnicas consultadas: [fuentes variables y ejes CSS](https://developer.mozilla.org/en-US/docs/Web/CSS/font-variation-settings), [Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API), [geometrías, materiales e interacción en Three.js](https://threejs.org/docs/) y [service workers para recursos offline](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API). La disponibilidad de ejes depende de la fuente elegida; la edición offline exige gestionar versiones y caché.

## Top 8 de todo el abanico

He comparado las 30 nuevas con las 18 anteriores de Codex, sus ampliaciones de cartas y ciudad, las siete de Claude y los descartes del encargo. **Este orden pondera recuerdo, gusto declarado, lectura inmediata y adaptación móvil**, no la media matemática de O/C/M. Los descartes explícitos quedan fuera; cartas y ciudad permanecen como referencias comparables porque Fernando pidió no cerrar el abanico.

| Puesto | Concepto | Procedencia | Por qué lo escogería |
|---|---|---|---|
| 1 | **Letras con masa · 04** | Nueva, tipografía | Da personalidad a toda la página, no requiere ilustraciones ni motor y conserva nombres y resultados en móvil. |
| 2 | **Membrana táctil · 08** | Nueva, WebGL | Tiene un gesto físico propio y colores intensos; es el mejor candidato nuevo para una reacción visual fuerte si el material se ejecuta bien. |
| 3 | **Margen de autor · 25** | Nueva, editorial | Resuelve la pregunta decisiva sobre los agentes: qué aportó Fernando y cómo se comprueba, con una firma gráfica sobria. |
| 4 | **Proponer no es ejecutar · 19** | Nueva, IA | Enseña el control humano como comportamiento del portfolio y lo relaciona directamente con Odoo sin convertirse en chat. |
| 5 | **Cremallera · 16** | Nueva, objeto | Un gesto fácil de describir, viable sin 3D y táctil en móvil; necesita una dirección gráfica adulta y continua. |
| 6 | **Cartas con foil y reverso de entrevista** | Codex ronda 1 C8 + Claude 1 | Sigue siendo la señal de gusto más clara de Fernando y sirve para profundizar; baja de prioridad porque ya se prototipó y se quiere explorar más. |
| 7 | **Jardín de pruebas · 11** | Nueva, datos | Une una firma gráfica agradable con evidencias concretas, funciona en SVG y evita que la IA se quede en una afirmación genérica. |
| 8 | **Ciudad habitable integrada** | Codex ronda 1 U1–U8 + Claude 2 | Conserva el mayor potencial de mundo completo; queda octava por la exigencia de orientación y móvil y porque Fernando ya la ha visto. |

**Fuera del top, pero con una razón para probarlos:** Índice gigante para máxima claridad; Oferta invertida para humor inmediato; Dos a la vez para un juego auténtico. La Rotativa y las demás metáforas anteriores no desaparecen del archivo: esta comparación prioriza abrir posibilidades nuevas, y evita el rojo saturado, el producto oscuro y el servidor desmontable ya descartados.

## Qué dos combinaría si solo hubiera una web

**Letras con masa + Margen de autor.** Una sola identidad tipográfica y editorial: letras anchas, ultramar, blanco y amarillo puntual. El margen forma parte de las mismas bandas que se expanden; no se añade un segundo mundo ni una sección con estética ajena.

1. **Entrada:** Fernando, titular fijo, tres nombres de producto con una frase de resultado, CV y contacto. Adivinadle tiene espacio suficiente para entenderse sin tocar nada; el movimiento comienza al seleccionar un nombre.
2. **Caso:** la banda se ensancha y abre lectura frontal. El margen señala «Diseñé», «Implementé», «Delegué», «Revisé» únicamente donde exista documentación; cada marca enlaza una prueba o declara su límite.
3. **Móvil:** bandas verticales; expansión breve sin desplazar el encabezado fuera de la vista. Las notas aparecen debajo del párrafo al que pertenecen y el texto nunca se deforma; movimiento reducido elimina la transición.
4. **CV y contacto:** pertenecen a la misma composición tipográfica y funcionan con enlaces normales. ES / EN / DE conserva ruta y caso; la tipografía se ajusta con alemán real, no con traducciones recortadas.

El resultado se recordaría como **«el de las letras que se estiraban y te enseñaban qué había hecho él»**. Para el reclutador basta con leer; para el lead técnico, la profundidad está exactamente donde surge la pregunta. Antes de construirlo completo, validaría una portada a 1440 px y otra a 390 px con el mismo caso Odoo, su margen, CV y contacto; comprobaría comprensión en tres segundos y lectura sin movimiento. No hace falta mezclar ocho mecánicas para conseguir una firma propia.

*Entrega de ideación: únicamente este documento. Sin desarrollo, generación de imágenes, cambios de producción ni publicación de datos de los proyectos.*
