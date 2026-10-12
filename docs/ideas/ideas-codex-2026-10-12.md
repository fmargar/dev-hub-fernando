# Ideas para el portfolio de Fernando Martínez

**Encargo del 12 de octubre de 2026 · Dirección creativa y propuesta técnica**

Mi recomendación es un **club de cartas con foil y construcción de equipos**. Es la dirección que ya ha provocado una reacción clara en Fernando y tiene una ventaja decisiva: el objeto memorable puede contener el proyecto, su resultado y sus pruebas sin exigir aprender a navegar. La **ciudad habitable** tiene un techo visual mayor, pero exige resolver el espacio como interfaz desde el principio. Como alternativa completamente nueva, propongo **La Rotativa**, una imprenta interactiva que convierte proyectos y decisiones en publicaciones que el visitante puede llevarse.

Las tres pueden ser excelentes. La elección debería depender de cuál conserva su personalidad en una pantalla de 390 px y permite entender quién es Fernando antes de la primera interacción.

## 0. El contrato de la experiencia

### Qué debe entenderse al entrar

En la primera pantalla, junto al objeto visual protagonista:

> **Fernando Martínez. Desarrollo Full Stack y productos con IA.**  
> Marbella · Proyectos publicados, integración de IA en Odoo y servidor propio.  
> **Ver proyectos · Descargar CV · Contactar**

Es un borrador de copy, no una afirmación adicional sobre su experiencia. Los tres enlaces estarán visibles sin tutoriales, partidas ni movimiento. Un selector **ES / EN / DE** mantendrá el proyecto y el punto de lectura al cambiar de idioma. La personalidad debe aparecer también aquí: botones, tipografía, composición y materiales pertenecen al concepto elegido.

### Qué contiene cada proyecto

La misma estructura alimentará todas las representaciones: problema, solución, contribución de Fernando, resultado comprobable, decisiones técnicas, límites, enlace al producto y pruebas disponibles. La integración de IA debe explicar qué diseñó, qué delegó y cómo verificó el trabajo; el número de agentes por sí solo no prueba competencia.

- **Adivinadle:** producto lúdico publicado; nueve juegos según el encargo; stack, pruebas e integración continua como evidencias por documentar.
- **Wardux:** producto editorial; flujo entre redacción y revisión de proveedores diferentes, con responsabilidades y controles explicados.
- **Cálculo Exacto:** precisión; los 46 casos de la AEAT al céntimo son el dato aportado en el encargo. Antes de publicarlo en el portfolio, enlazar metodología, ejercicio fiscal y resultados reproducibles.
- **Odoo:** integración útil en el ERP; mostrar el recorrido borrador → revisión humana → publicación, con un ejemplo anonimizado y autorizado.
- **Servidor propio:** arquitectura, operación y recuperación; diagramas y evidencias saneadas, sin direcciones internas, secretos ni información de otros servicios.
- **Vados y Marbella Fácil:** experiencia anterior; distinguir trabajo profesional y TFG, contribución individual y contexto.

No inventar usuarios, ingresos, porcentajes de ahorro, cobertura ni disponibilidad. Si una prueba no puede compartirse, explicar la decisión mediante un ejemplo preparado y etiquetado como tal. El contenido excluye bots y farmeo.

### Reglas comunes que hacen viables los conceptos

1. **Documento primero.** Contenido semántico servido en HTML, con rutas enlazables para proyectos, experiencia y contacto. La experiencia gráfica lo representa y amplía; el modo de lectura contiene toda la información sin canvas ni WebGL.
2. **Acciones equivalentes.** Toda interacción por arrastre tendrá botones; teclado y foco visible recorrerán la navegación. En móvil diseñaría objetivos de 44 × 44 CSS px: es una decisión de diseño por encima del mínimo de 24 × 24 con excepciones definido en WCAG 2.2. Referencias: [tamaño mínimo](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum) y [alternativas al arrastre](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements).
3. **Movimiento controlado.** Respetar `prefers-reduced-motion`, ofrecer pausa, mantener el scroll nativo y evitar audio automático. Ningún brillo, paralaje o cambio de cámara será necesario para leer.
4. **Traducciones diseñadas.** Texto fuera de texturas; alemán probado con frases largas; formatos locales y CV revisado en los tres idiomas. El estilo no dependerá de juegos de palabras intraducibles.
5. **Carga progresiva.** Presentación, acciones y primer proyecto antes de descargar un motor gráfico. Como objetivos iniciales, HTML, CSS y JS esenciales por debajo de 250 KB comprimidos y primera imagen por debajo de 200 KB; medir y revisar esos presupuestos con un prototipo real, no prometerlos como resultados.
6. **Color con intención.** Ultramar, rojo señal, amarillo eléctrico, verde ácido, magenta y negro tinta; usar dos protagonistas por escena y reservar superficies legibles. Nada de degradado violeta por defecto ni fondos marrones. Saturación y contraste se comprueban por separado.

Las tecnologías que aparecen a continuación son propuestas de implementación, no dependencias ya incorporadas al proyecto. Se puede conservar Next.js, React y TypeScript para el contenido y añadir únicamente el motor que justifique la mecánica.

## 1. Dieciocho conceptos distintos

Estos conceptos cambian el modelo de interacción, la forma de ordenar las pruebas y el objeto que se recuerda. Las cartas y la ciudad se desarrollan aparte para no contarlas otra vez como nuevas ideas.

### 01 · La Rotativa

**Idea, en dos frases.** Una imprenta de tinta eléctrica imprime los productos que Fernando ha construido. Cada proyecto es una publicación con portada, desplegable técnico y una prueba que se puede sacar de la máquina.

**Mecánica y funciones.** Se entra viendo tres portadas legibles; elegir una activa una tirada breve y abre su caso de estudio. Tres registros —problema, construcción, verificación— superponen capas de tinta y permiten identificar qué aporta cada una; Odoo mostraría visualmente el punto donde interviene la aprobación humana. «Preparar dossier» reúne proyectos elegidos en una página imprimible con URL compartible; el CV se descarga desde una salida propia y contacto adopta la forma de un encargo con un formulario normal. Demuestra composición responsive, estado compartible, impresión y capacidad de explicar un proceso.

**Por qué se recuerda.** «El de la imprenta que te sacaba sus proyectos».

**Construcción y móvil.** HTML, SVG y CSS para rodillos, registro y papel; Web Animations API para una transición corta. En móvil la hoja sale hacia abajo y pasa a lectura vertical; no necesita una escena 3D ni esperar a que termine la tirada.

**Riesgo honesto.** Puede parecer una agencia editorial y ocultar que Fernando programa. El titular Full Stack y las pruebas técnicas deben verse en las propias portadas; la animación será interrumpible.

### 02 · La Expendedora

**Idea, en dos frases.** Una máquina expendedora gigantesca ofrece productos digitales terminados en envases gráficos propios. Al elegir uno, entrega el producto y su etiqueta de ingredientes técnicos.

**Mecánica y funciones.** Botones con nombre y resumen seleccionan Adivinadle, Wardux o Cálculo Exacto; no hace falta introducir códigos. «Sacar producto» abre una ficha con demo, resultado y desglose de responsabilidades; una pestaña de mantenimiento enseña pruebas y decisiones. El dispensador de CV y el botón «Hablar con quien la construyó» permanecen visibles. Demuestra interacción táctil, modelado de estados y separación entre producto público y documentación técnica.

**Por qué se recuerda.** «El de la máquina donde sacabas webs».

**Construcción y móvil.** CSS y SVG bastan para una fachada frontal con envases originales; React controla selección, entrega y ficha. En móvil se convierte en una columna de compartimentos grandes, con botonera fija y sin caída física simulada.

**Riesgo honesto.** Un escaparate de latas puede trivializar trabajo complejo. Cada envase necesita un resultado y una frase de valor; evitar precios, monedas y promesas de entrega de software instantánea.

### 03 · Entre Bambalinas

**Idea, en dos frases.** Un teatro mecánico presenta el producto en escena y permite levantar el telón para ver cómo se construyó. El escenario se transforma con cada proyecto y los créditos explican quién hizo qué.

**Mecánica y funciones.** «Ver función» lleva a una demo o recorrido breve; «Ver mecanismos» revela arquitectura, revisión y despliegue en un corte lateral. Los agentes aparecen como herramientas dentro del mecanismo, con decisiones y validaciones de Fernando claramente atribuidas. Un programa de mano contiene experiencia y CV; la taquilla es contacto, accesible también por su nombre convencional. Demuestra narrativa, diagramas interactivos y honestidad sobre autoría.

**Por qué se recuerda.** «El del teatro que enseñaba los mecanismos por detrás».

**Construcción y móvil.** SVG por capas y CSS; React Three Fiber solo si la profundidad añade una lectura útil. En móvil, alternancia frontal/trasera por dos botones y contenido HTML debajo, sin rotación libre.

**Riesgo honesto.** Puede presentar a Fernando como alguien que solo mueve palancas de IA. Los créditos deben concretar diseño, implementación, revisión y operación, no personajes simpáticos con títulos inflados.

### 04 · Cómic de Ingeniería

**Idea, en dos frases.** Un cómic gráfico cuenta problemas reales que Fernando convirtió en productos. El visitante puede cambiar de punto de vista entre la persona que usa el producto y quien lo construye.

**Mecánica y funciones.** Cada proyecto tiene tres viñetas: situación, decisión, resultado; una bifurcación «¿Qué se probó?» abre evidencias. Un selector cambia de vista usuario a vista técnica sin perder el capítulo, para mostrar, por ejemplo, cómo el flujo editorial de Wardux sostiene lo que se publica. CV es una ficha de autor y contacto una última viñeta con formulario. Demuestra jerarquía de información, rutas narrativas, accesibilidad e ilustración integrada en la interfaz.

**Por qué se recuerda.** «El que explicaba su trabajo como un cómic que podías cambiar».

**Construcción y móvil.** CSS Grid, SVG y HTML con bocadillos de texto real; ilustraciones originales de alto contraste. En móvil las viñetas se leen verticalmente, se elimina el texto superpuesto difícil de ampliar y cada capítulo tiene enlace directo.

**Riesgo honesto.** Una caricatura de superhéroe o humor autocomplaciente puede resultar infantil. Mejor humor de situaciones —una coma fiscal que rompe un cálculo— que Fernando salvando el mundo.

### 05 · Pinball de Pruebas

**Idea, en dos frases.** Una mesa de pinball está construida alrededor de retos de software y proyectos que los resuelven. Los impactos iluminan pruebas concretas en vez de sumar puntos abstractos de habilidad.

**Mecánica y funciones.** Las rampas «Producto», «Precisión» e «IA revisada» abren Adivinadle, Cálculo Exacto y Odoo mediante botones directos o una partida opcional. Golpear una zona muestra un dato breve y permite abrir la prueba; las mismas fichas están disponibles fuera del juego. CV y contacto están en la cabecera, no son premios. Demuestra física, gestión de input y una interfaz que mantiene acciones convencionales junto a una experiencia lúdica.

**Por qué se recuerda.** «El del pinball de sus proyectos».

**Construcción y móvil.** Phaser con física Arcade para una versión sencilla o Matter para rebotes más elaborados; casos de estudio en HTML. Móvil con dos botones grandes para flippers y modo de selección directa por defecto; motor descargado al pulsar «Jugar».

**Riesgo honesto.** La partida puede consumir toda la atención y generar frustración. Es una opción de alto riesgo como portada; encaja mejor como experiencia secundaria de una identidad ya clara.

### 06 · Mesa de Mezclas

**Idea, en dos frases.** El portfolio es una mesa de mezclas modular donde las pistas son partes de un producto. Al aislar una pista, el visitante comprende qué aporta y qué depende de ella.

**Mecánica y funciones.** Elegir un proyecto carga sus pistas: interfaz, backend, datos, evaluación y operación, según corresponda. «Solo» destaca una capa en el diagrama y enseña una decisión real; apagar una pista en una simulación preparada explica qué función se pierde. Un preset «Vista rápida» enseña resultado y contribución; CV y contacto son botones identificados junto a los controles. Demuestra modelado de dependencias y explicación de compromisos de arquitectura.

**Por qué se recuerda.** «El de la mesa de DJ donde mezclabas cómo funcionaban sus webs».

**Construcción y móvil.** HTML, SVG y controles nativos estilizados; React sincroniza pistas y diagrama. Web Audio sería un detalle opcional activado expresamente. En móvil las pistas se apilan y «Solo» se pulsa; no hay minifaders imposibles de manejar.

**Riesgo honesto.** Una animación de ondas sin relación con el proyecto se vuelve decorativa. Las dependencias deben ser específicas y la simulación estar etiquetada; no presentar cambios de sonido como rendimiento medido.

### 07 · Inmersión

**Idea, en dos frases.** Un observatorio submarino deja ver productos en superficie y decisiones de ingeniería a distintas profundidades. La profundidad significa detalle y cada nivel puede abrirse directamente.

**Mecánica y funciones.** «Superficie» ofrece resultados y demos; «Interior» muestra arquitectura; «Fondo» contiene pruebas, fallos y aprendizaje. Un selector de proyecto conserva el nivel elegido, para que un lead técnico compare decisiones sin atravesar una introducción. CV y contacto están en una baliza siempre accesible. Demuestra divulgación progresiva, navegación con estado y capacidad de dar detalle sin cargarlo sobre la primera lectura.

**Por qué se recuerda.** «El del submarino que bajaba a las tripas de los proyectos».

**Construcción y móvil.** SVG con ventanas y medidor de profundidad; PixiJS únicamente para fauna y partículas si aportan carácter. En móvil los niveles son tres pestañas legibles y el documento usa scroll normal; nada de descenso largo obligatorio ni control de vehículo.

**Riesgo honesto.** Tiene riesgo de confundirse con una web de entretenimiento o de parecer una escena oscura vacía. Usaría azules intensos, coral rojo y fauna gráfica, con el contenido ocupando el espacio principal.

### 08 · Cocina de Productos

**Idea, en dos frases.** Una cocina abierta prepara productos digitales a partir de encargos y controles de calidad. El menú muestra resultados servidos; la cocina explica el recorrido de construcción.

**Mecánica y funciones.** Cada plato es un producto y su receta distingue problema, implementación y validación. Elegir una comanda como «texto que necesita aprobación» lleva al proceso de Odoo; «resultado exacto» al caso fiscal. Un botón detiene la receta en una decisión y enseña su alternativa. El CV es la ficha del cocinero y contacto permite escribir una nueva comanda mediante un formulario explícito. Demuestra traducción de requisitos a flujo y controles verificables.

**Por qué se recuerda.** «El de la cocina donde preparaba sus proyectos».

**Construcción y móvil.** SVG, CSS y una máquina de estados sencilla; los recorridos pueden ser datos declarativos en TypeScript. En móvil se lee como comandas verticales con pasos pulsables y acceso al resultado desde el primer paso.

**Riesgo honesto.** Puede sugerir que programar es mezclar ingredientes o seguir recetas. Los casos deben incluir decisiones difíciles y límites; usar acero, azulejo azul y rojo intenso, evitando restaurante rústico y marrones.

### 09 · Tribunal del Bug

**Idea, en dos frases.** Cada proyecto presenta un problema como un caso y deja consultar las pruebas de su resolución. El visitante puede interrogar una decisión antes de emitir su propio juicio.

**Mecánica y funciones.** Se elige un caso desde un listado con resultados visibles. Las preguntas «¿Cómo lo comprobaste?», «¿Qué fallaba?» y «¿Qué cambiarías?» llevan a anexos concretos; por ejemplo, Cálculo Exacto ofrece casos límite y comparación de resultados, sin ejecutar una herramienta fiscal real. La credencial contiene CV y «Convocar una conversación» abre contacto. Demuestra pensamiento crítico, trazabilidad y capacidad de reconocer límites.

**Por qué se recuerda.** «El que llevaba los bugs a juicio y enseñaba pruebas».

**Construcción y móvil.** HTML, CSS y SVG de expedientes contemporáneos en rojo y ultramar; paneles de preguntas con URL. En móvil funciona como una conversación de preguntas predefinidas y anexos desplegables, sin chatbot.

**Riesgo honesto.** El tono puede sonar arrogante o burocrático. Fernando no será juez de otros desarrolladores; se someten sus propias decisiones a examen y también aparecen conclusiones pendientes.

### 10 · Mesa de Montaje

**Idea, en dos frases.** Una mesa de edición permite montar la historia de un producto con escenas de decisiones reales. El visitante compara versiones del mismo plano para ver qué cambió y por qué.

**Mecánica y funciones.** Cada proyecto es una secuencia de hitos con capturas, diagramas o pequeñas demos. El control antes/después alterna una interfaz o decisión documentada; «Notas del director» explica alternativas y contribución. Los créditos reúnen experiencia y CV; contacto es una invitación a la siguiente producción. Demuestra comparación visual, gestión de medios y razonamiento sobre evolución de producto.

**Por qué se recuerda.** «El de la mesa de cine donde veías el antes y después de sus webs».

**Construcción y móvil.** CSS, SVG y un estado de edición en React; imágenes optimizadas en lugar de cargar vídeos en todas las escenas. En móvil se elige hito con botones y antes/después con dos pestañas; la línea de tiempo se transforma en lista.

**Riesgo honesto.** Puede confundirse con el portfolio de un realizador. Las escenas deben mostrar software y decisiones técnicas; no reconstruir una historia ficticia ni fabricar versiones antiguas para dramatizarla.

### 11 · Equipaje de Mano

**Idea, en dos frases.** Una maleta gráfica contiene piezas que el visitante puede llevar a una conversación de selección. Cada proyecto se convierte en un objeto con etiqueta de procedencia y ficha de evidencia.

**Mecánica y funciones.** El visitante elige hasta tres proyectos y un foco —producto, backend o IA— para preparar su selección. Se genera una página compartible con los resúmenes y enlaces correspondientes, sin alterar el CV oficial ni enviar datos. El bolsillo documental descarga el CV por idioma; la etiqueta de destino abre contacto con la selección ya mencionada. Demuestra composición de contenido, serialización en URL y formularios contextualizados.

**Por qué se recuerda.** «El de la maleta donde te llevabas los proyectos para la entrevista».

**Construcción y móvil.** CSS, SVG y geometría 2D; estados deterministas en TypeScript. En móvil la maleta se abre como un organizador vertical, con botones «Añadir» y «Quitar» además del arrastre opcional.

**Riesgo honesto.** Preparar un paquete puede sentirse como trabajo añadido para el reclutador. La selección inicial ya viene lista y ver todo sigue siendo inmediato; no se piden datos ni registro para llevársela.

### 12 · Observatorio

**Idea, en dos frases.** Los proyectos aparecen como cuerpos celestes que se investigan con instrumentos distintos. Las lentes revelan producto, sistema y evidencia sobre el mismo objeto.

**Mecánica y funciones.** Un catálogo visible abre cualquier proyecto; la lente «Producto» enseña experiencia y resultado, «Sistema» dibuja dependencias y «Pruebas» localiza validaciones. Conservar la lente al cambiar de proyecto permite comparar ingeniería. CV se descarga desde «Ficha del observador» y contacto desde un enlace rotulado, junto al catálogo. Demuestra visualización de relaciones y continuidad entre modos de lectura.

**Por qué se recuerda.** «El del telescopio que radiografiaba sus proyectos».

**Construcción y móvil.** SVG para órbitas y lentes; Three.js para volúmenes solo si un prototipo demuestra su valor. En móvil una ventana central y un selector de lente sustituyen el cielo navegable; las fichas siguen siendo HTML.

**Riesgo honesto.** El espacio es una metáfora frecuente y puede acabar en partículas genéricas. La firma debe estar en instrumentos gráficos propios y en la radiografía útil, no en un fondo estrellado ni en planetas con logos.

### 13 · Telar Digital

**Idea, en dos frases.** Un telar de hilos saturados teje cada producto a partir de capacidades y decisiones. Seleccionar un hilo permite seguir la misma responsabilidad a través de varios proyectos.

**Mecánica y funciones.** La trama horizontal contiene proyectos y la vertical, responsabilidades demostrables: interfaz, datos, integración, evaluación y operación. Pulsar un cruce abre el caso y su evidencia; seleccionar un hilo muestra dónde existe experiencia y dónde no se aporta prueba. «Patrón profesional» contiene trayectoria y CV; contacto es un botón explícito para proponer una colaboración. Demuestra representación de datos muchos-a-muchos y honestidad al relacionar habilidades con trabajo real.

**Por qué se recuerda.** «El del telar que tejía los proyectos con sus habilidades».

**Construcción y móvil.** SVG generado desde datos y tarjetas HTML asociadas. En móvil se selecciona una responsabilidad y aparecen proyectos relacionados en vertical; la trama se reduce a una cabecera, sin obligar a leer una matriz minúscula.

**Riesgo honesto.** Un gráfico muy denso parece un ejercicio de visualización. Limitar los hilos, poner nombres claros y usar relaciones documentadas; no convertir cada paquete npm utilizado en una habilidad acreditada.

### 14 · Kit de Montaje

**Idea, en dos frases.** Cada proyecto viene como una maqueta de piezas encajables y una instrucción de montaje. El visitante puede ver el producto completo o inspeccionar una unión concreta que explica cómo funciona.

**Mecánica y funciones.** Las piezas representan límites de arquitectura, no archivos individuales. «Ver unión» muestra contrato API, validación o aprobación humana; «Montado» vuelve a demo y resultado. El manual incluye trayectoria y CV, y contacto permite proponer un proyecto nuevo. Demuestra diseño de contratos y modularidad; una unión puede incluir ejemplo de entrada y salida saneado.

**Por qué se recuerda.** «El que tenía sus webs como kits para montar».

**Construcción y móvil.** SVG para bastidores, piezas y conectores; CSS para elevación y ensamblado breve. En móvil cada pieza se selecciona de una lista y la unión se muestra en un diagrama de dos módulos, sin arrastre de precisión.

**Riesgo honesto.** Puede repetir el fallo del servidor desmontable si todo depende de scroll y explosiones 3D. Las vistas se activan con botones, muestran pocos módulos y no retrasan el contenido; usar diseño industrial propio, sin copiar marcas de juguetes.

### 15 · Origami de Sistemas

**Idea, en dos frases.** Un pliego de color intenso se transforma en objetos que representan productos completos. Cada pliegue visible corresponde a una decisión que el visitante puede desplegar.

**Mecánica y funciones.** La portada muestra nombre, resultado y producto; botones «Desplegar arquitectura» y «Desplegar pruebas» abren caras con contenido. Una ruta visual indica cómo varias decisiones sostienen el conjunto, y una vista plana deja leerlo todo sin animación. CV se descarga desde su propio pliego y contacto abre una nota editable. Demuestra transformaciones, estado reversible y equivalencia entre representación espacial y documental.

**Por qué se recuerda.** «El de los proyectos que se desplegaban como origami».

**Construcción y móvil.** CSS 3D y SVG con figuras de pocas caras; texto largo fuera de superficies inclinadas. Móvil con transiciones muy cortas o instantáneas y lectura frontal; no hace falta WebGL.

**Riesgo honesto.** El plegado puede esconder información o dejar letras ilegibles durante el movimiento. Los controles nombran lo que abren y la vista plana tiene idéntica jerarquía, con todo el contenido disponible desde la carga.

### 16 · Banco de Inspección

**Idea, en dos frases.** Un pequeño robot inspector recorre un banco industrial donde se comprueban productos de software. El visitante elige una inspección y ve una prueba documentada, su resultado y su alcance.

**Mecánica y funciones.** Cada proyecto presenta inspecciones aplicables: cálculo, navegación, revisión editorial o recuperación. Elegir una mueve el cabezal y abre un informe; la secuencia fiscal podría reproducir localmente ejemplos preparados de la suite, identificando versión y datos. CV es una ficha de capacidades y contacto una solicitud de trabajo, ambos fuera de la inspección. Demuestra diseño de evaluación, límites de las pruebas y presentación de resultados reproducibles.

**Por qué se recuerda.** «El del robot que inspeccionaba sus proyectos».

**Construcción y móvil.** SVG y React para banco y estados; Web Worker solo si la demo local requiere cálculo suficiente para bloquear la interfaz. Móvil con una inspección por pantalla, botones grandes y resultado como texto legible.

**Riesgo honesto.** Un check verde teatral puede aparentar garantías que no existen. Cada informe necesita fecha, alcance y resultado real; las simulaciones se rotulan y nunca acceden a producción ni a información privada.

### 17 · Muro Vivo

**Idea, en dos frases.** Un mural de serigrafía y graffiti funcional reúne productos, experiencia y contacto en una sola composición urbana. El visitante activa capas para ver el dibujo terminado o el plano que sostiene cada pieza.

**Mecánica y funciones.** Cada zona rotulada del mural abre un caso; «Ver trazado» superpone decisiones, restricciones y pruebas a su ilustración. Se puede recorrer una ruta breve de tres proyectos o ir directamente al que interesa. Un cartel del autor contiene CV y el buzón del mural contiene contacto, también presentes como enlaces textuales. Demuestra dirección visual, hotspots accesibles y un sistema gráfico que funciona en todas las rutas.

**Por qué se recuerda.** «El del mural donde cada dibujo era un proyecto de verdad».

**Construcción y móvil.** SVG modular con texto HTML y rutas normales; CSS administra capas y colores. En móvil el mural se recompone en paños verticales, conservando ilustraciones y etiquetas; no se reduce un póster de escritorio hasta volverlo ilegible.

**Riesgo honesto.** La composición puede ser impactante y difícil de entender. Hay que diseñar etiquetas desde el boceto y mostrar el caso en una superficie tranquila; evitar un collage de logos o frases vagas sobre creatividad.

### 18 · Efecto Dominó

**Idea, en dos frases.** Cada proyecto es una cadena corta que conecta una necesidad con un resultado. El visitante puede retirar una pieza de una simulación para entender por qué ese control existe.

**Mecánica y funciones.** Se elige una cadena ya montada: en Odoo, borrador → revisión → publicación; en Cálculo Exacto, entrada → reglas → redondeo → contraste. «¿Qué pasa sin esta pieza?» explica un fallo posible y enlaza cómo se previene, sin actuar sobre el servicio real. CV y contacto permanecen como acciones exteriores a la cadena. Demuestra análisis de fallos, invariantes y capacidad de justificar controles mediante consecuencias.

**Por qué se recuerda.** «El del dominó que enseñaba dónde se rompería una web».

**Construcción y móvil.** HTML, SVG y una máquina de estados determinista; la caída puede resolverse con CSS, sin motor físico. En móvil la cadena es vertical y se retira una pieza con un botón; el resultado también se expresa por escrito.

**Riesgo honesto.** Una cadena lineal puede falsear sistemas con ramificaciones y recuperaciones. Usarla para un proceso concreto, mostrando bifurcaciones necesarias; nunca presentar un espectáculo de fallos como arquitectura completa.

## 2. Llevar las cartas mucho más lejos

La dirección es **un juego de colección original sobre productos reales**, con un sistema propio de marcos, símbolos y reglas. El foil es su firma material. Los personajes y marcas de juegos no tienen que convertirse en la identidad de Fernando; las ilustraciones representarían sus productos con arte propio.

### C1 · Sobres con intención

Tres sobres visibles: **Producto**, **IA con revisión**, **Precisión y operación**. Cada uno contiene una selección conocida de proyectos; el exterior ya muestra nombres y un resultado, y «Ver contenido» permite evitar la apertura.

La apertura despliega cartas con enlaces a fichas completas. Mecánica útil: elegir un interés y recibir un recorrido breve, sin lotería, espera ni contenido bloqueado. HTML y CSS, con un foil que responde a la interacción; en móvil, pulsar abre y «Ver todas» muestra la colección completa. Riesgo: que el envoltorio eclipse las pruebas; enseñar el contenido antes de abrir lo reduce.

### C2 · Construir un equipo de tres

El visitante recibe un reto opcional, como «Producto con IA y control humano», y construye un equipo con cartas de proyectos. Seleccionar Odoo, Wardux y servidor propio activa una explicación de la combinación: integración, revisión y operación, respaldada por casos.

La regla: cada requisito necesita una evidencia asignada; dos cartas que cubren lo mismo no satisfacen automáticamente los demás. Botones y arrastre opcional permiten cambiar el equipo. El resultado es una selección compartible para una entrevista y una pregunta de contacto precompletada; el CV oficial sigue a un clic. Se implementa con reglas en TypeScript y URL serializada. Riesgo: aparentar recomendación profesional automática; debe ser una selección editorial transparente, sin puntuación de empleabilidad.

### C3 · Combate contra un problema

El rival es un reto de ingeniería, nunca otro candidato. «Texto publicado sin revisión», «Redondeo ambiguo» o «Pérdida de datos» presentan necesidades; una carta propone una acción y abre la prueba que sustenta esa respuesta.

El combate dura hasta tres turnos: identificar riesgo, aplicar control, comprobar resultado. Hay decisiones con compromisos y un debrief al final, accesible desde el inicio. Es una demo de razonamiento y evaluación, no una manera de desbloquear proyectos. Estado determinista y animación CSS; en móvil son elecciones verticales. Riesgo: vender soluciones como infalibles; el debrief incluye alcance, límites y trabajo pendiente.

### C4 · Evolución documentada

Una carta tiene etapas de prototipo, publicación y mejora, únicamente cuando existan evidencias de esas fases. Al cambiar de etapa se actualizan captura, decisión, responsabilidad y prueba; el foil puede señalar la versión seleccionada.

La función es demostrar evolución real y aprendizaje. En móvil se usan pestañas y una línea de tiempo en HTML; cada etapa enlaza un hito documentado. Riesgo: inflar mejoras menores como transformaciones heroicas; el cambio debe describirse con precisión y no inventar métricas históricas.

### C5 · Álbum de evidencias

El visitante guarda cartas para comparar proyectos y abre un álbum con dos columnas: capacidades buscadas y pruebas disponibles. Puede imprimir su selección o compartirla por URL, sin cuenta ni seguimiento obligatorio.

No hay que coleccionar todas las cartas para descargar el CV o contactar. React administra la colección y `localStorage` solo conserva una preferencia si se quiere persistencia; la URL basta para compartir. En móvil el álbum es una lista agrupada. Riesgo: el «100 % completado» induce una tarea que nadie pidió; evitarlo y explicar «Tu selección para volver después».

### C6 · Rareza con significado

La rareza describe **el tipo de evidencia**, con nombre legible y símbolo: producto publicado, proceso reproducible, integración profesional o precisión contrastada. Todas las cartas siguen disponibles; ninguna rareza califica a Fernando con números inventados.

Los bordes y el foil permiten reconocer esas categorías, y una leyenda explica por qué una carta recibe su marca. La ficha siempre enlaza la prueba o declara su disponibilidad. CSS y SVG resuelven la codificación, también en móvil y sin depender solo del color. Riesgo: una jerarquía de «legendario» puede convertir una clasificación honesta en autopromoción infantil; preferir categorías descriptivas.

### C7 · Sinergias comprobables

Al colocar dos cartas juntas aparece una relación específica: el flujo de Wardux y la integración de Odoo comparten el problema de supervisar contenido generado. El visitante ve qué patrón se reutiliza, qué cambia y cuál es la contribución de Fernando.

La utilidad es enseñar transferencia de criterio entre proyectos, no repetir una lista de tecnologías. Un grafo pequeño de relaciones declarado en datos controla las combinaciones válidas; las demás muestran «No hay una relación documentada». En móvil se eligen dos cartas con botones. Riesgo: producir frases genéricas para cada pareja; limitarlo a cuatro o cinco conexiones con sustancia, sin generación automática.

### C8 · Carta de entrevista

Cada carta puede girarse para mostrar tres preguntas concretas, por ejemplo «¿Qué ocurre si el revisor discrepa?» en Wardux. Elegir una abre una respuesta breve, sus pruebas y una pregunta todavía abierta cuando corresponda.

El visitante puede llevar esas preguntas a una conversación; contacto incorpora el proyecto y la pregunta elegidos. El reverso usa HTML y un giro opcional que se elimina con movimiento reducido. En móvil «Ver preguntas» sustituye el hover. Riesgo: respuestas ensayadas que suenan perfectas; incorporar decisiones difíciles, incertidumbre delimitada y alternativas descartadas.

### Cómo conservar el foil sin arruinar la carta

La primera versión usaría gradientes CSS y una máscara gráfica propia que responde a variables de posición, manteniendo el texto en una capa estable. Solo la carta enfocada o tocada anima el brillo; en móvil un gesto breve o un botón «Ver brillo» evita activar sensores de orientación. El foil no corre indefinidamente ni atraviesa el texto principal. Un shader WebGL sería una segunda opción si un prototipo demuestra un acabado material claramente superior.

**La combinación que elegiría:** C1 para entrar, C8 para profundizar y C2 para una interacción opcional. C6 organiza evidencias y el foil unifica el material. El combate quedaría como ampliación; no hace falta meter ocho mecánicas en la portada.

## 3. Integrar la ciudad de verdad

Una ciudad integrada empieza en el mapa de contenido: **los edificios son rutas, las plantas son niveles de detalle y los servicios urbanos son acciones del portfolio**. Dibujar una escena grande y ponerle un menú convencional encima no resuelve esa integración. La ciudad debe seguir siendo reconocible dentro de un proyecto, en contacto, en el CV y en el modo de lectura.

### U1 · La ciudad es la estructura de navegación

La plaza presenta a Fernando y ofrece tres destinos expresos: **Proyectos**, **CV**, **Contacto**. Adivinadle ocupa un salón de juegos; Wardux una redacción; Cálculo Exacto un laboratorio de precisión; Odoo una oficina de integración; la experiencia municipal un edificio cívico; el servidor, una central de infraestructura abstracta.

Cada fachada tiene nombre y una frase de resultado: ninguna necesita descubrirse por hover. Pulsar un edificio abre una ruta real como `/es/work/wardux`, sin abandonar el mundo visual. PixiJS representa la ciudad y React mantiene contenido y rutas; una alternativa en SVG permitiría una primera versión más ligera. En móvil las fachadas se ordenan alrededor de una calle vertical con anclas y botones grandes. Riesgo: exceso de edificios vacíos; empezar con cuatro proyectos principales y experiencia agrupada.

### U2 · Interiores que son casos de estudio

Entrar en un edificio cambia a un corte de su interior, no a una ficha genérica flotando sobre el mapa. Tres plantas cumplen funciones concretas: producto y resultado; decisiones y contribución; pruebas y límites. En Wardux, una sala muestra el recorrido redactar → revisar → publicar; en el laboratorio, una mesa enlaza los casos fiscales.

Cada planta contiene HTML semántico en zonas de lectura; la escenografía enmarca ese texto. React y SVG por capas bastan para muchos interiores; se carga únicamente el seleccionado. En móvil las plantas forman una secuencia vertical con etiquetas y retorno al edificio. Riesgo: texto microscópico entre muebles; la lectura ocupa la mayor superficie y los objetos solo activan anexos.

### U3 · Calles que conectan decisiones

Las conexiones entre edificios representan relaciones verificadas. Una ruta entre Odoo y Wardux se llama «Revisión de IA» y explica diferencias; otra conecta producto e infraestructura mostrando publicación y operación. El visitante puede seguir una ruta temática de dos o tres paradas o saltar a cualquier edificio.

Seleccionar la calle abre una explicación breve y los enlaces correspondientes; no se representa como una dependencia real si solo es una afinidad. Un grafo de datos produce trazado y navegación. En móvil la ruta se convierte en un itinerario vertical con «Siguiente parada» y acceso directo a todas. Riesgo: inventar conexiones para completar el dibujo; una calle decorativa no necesita fingir significado técnico.

### U4 · Servicios urbanos con funciones completas

La oficina de información contiene el CV y la trayectoria; correos abre contacto; el directorio de la plaza permite filtrar proyectos por evidencia. Todo está rotulado «CV», «Contacto» y «Proyectos», junto a la metáfora, para que nadie tenga que adivinar un edificio.

El formulario es un formulario real, el CV un PDF directo por idioma y cada dirección un enlace compartible. Los mismos controles aparecen en una franja de servicios persistente, dibujada como señalización de la ciudad. HTML y CSS mantienen funciones y accesibilidad; PixiJS solo dibuja el entorno. En móvil correos es una pantalla completa de formulario. Riesgo: alargar tres clics una descarga; el enlace de CV descarga desde la plaza sin entrar en la oficina.

### U5 · La visita guiada tiene un propósito

Un transporte opcional ofrece recorridos con nombre y contenido: «Tres productos publicados» o «Tres decisiones de ingeniería». El vehículo se mueve únicamente al cambiar de parada; en cada una se muestra resultado, responsabilidad y un enlace a la prueba.

El selector de parada también sirve para navegar sin animación; hay salida inmediata y nunca se conduce con teclado para llegar al contenido. Estados de recorrido en React y movimiento discreto en PixiJS; en móvil basta una lista de paradas con el vehículo como marcador. Riesgo: una introducción turística que consume atención; el recorrido es elegible y la primera parada ya enseña información útil.

### U6 · Día y noche cambian la lectura

Un interruptor «Producto / Operación» transforma el mismo espacio: de día destacan escaparates y experiencias; de noche se iluminan conexiones de publicación, revisión y recuperación, con anotaciones específicas. Así la segunda iluminación tiene una función profesional, además de belleza.

El texto identifica ambas vistas y sigue disponible en el modo de lectura. Dos paletas, capas y algunos sprites resuelven el cambio; no hace falta un reloj real ni iluminación dinámica de toda la escena. En móvil se alterna con un botón y desaparecen partículas. Riesgo: confundir una ciudad iluminada con disponibilidad de servicios; se indica que es una representación de arquitectura, sin supuestos estados en vivo.

### U7 · La ciudad responde al contenido

Abrir un caso acerca su barrio y hace crecer la superficie de lectura; cerrar devuelve cámara, selección y foco al mismo sitio. Al visitar contacto, el entorno se recompone alrededor de correos; en la trayectoria, las señales ordenan la experiencia temporalmente. El mapa forma parte del layout de todas las rutas.

El diseño comparte perspectivas, bordes, paleta y señalización entre ciudad y documentos. La cámara usa posiciones predefinidas; el historial del navegador funciona y el contenido mantiene enlaces directos. En móvil la recomposición es de bloques verticales, no un zoom que obliga a desplazarse en dos ejes. Riesgo: transiciones que destruyen orientación; limitar cambios, conservar un directorio persistente y restaurar scroll y foco.

### U8 · La vista accesible también pertenece a la ciudad

«Ver directorio» abre una lectura completa con señalética, fachadas simplificadas y calles convertidas en secciones. Se mantiene el lenguaje visual y el contenido entero, incluidos interiores, conexiones, CV y contacto.

Una única fuente de datos alimenta mapa y directorio; ninguna descripción importante existe solo en sprites. El canvas queda fuera de la navegación asistida cuando su contenido ya tiene equivalente HTML. PixiJS dispone de una capa de accesibilidad basada en elementos DOM superpuestos, pero usarla no sustituye diseñar y comprobar la experiencia completa. Referencia: [accesibilidad en PixiJS](https://pixijs.com/8.x/guides/components/accessibility).

En móvil el directorio puede ser la composición principal, con la ciudad expresada en fachadas y recorrido vertical. Riesgo: que sea una versión descuidada que pierde todo el encanto; debe diseñarse junto al mapa, no añadirse al final.

### Qué motor elegiría para la ciudad

| Opción | Cuándo la elegiría | Coste que hay que justificar |
|---|---|---|
| SVG + CSS + React | Edificios, interiores y movimientos discretos; primera prueba de navegación | Menos libertad para muchos sprites simultáneos, pero fácil unión con contenido HTML |
| PixiJS + React para documentos | Ciudad 2D isométrica con sprites, profundidad por capas y cámaras predefinidas | Doble representación gráfica/documental y disciplina al sincronizar foco, rutas y selección |
| Three.js / React Three Fiber | Maqueta 3D con cambios de punto de vista que ayudan a comprender edificios o sistemas | Modelos, materiales, GPU, recuperación ante fallo y lectura del contenido fuera del canvas |
| Phaser | Recorridos con objetivos, colisiones y reglas de juego que sean parte importante del concepto | Un motor de juego puede añadir complejidad innecesaria a una ciudad que solo necesita navegación |
| Godot exportado a web | Si la experiencia elegida termina siendo un juego con interiores y lógica suficientemente complejos | Integración con documentos, descarga del motor y limitaciones de la exportación web |

**Elegiría PixiJS para una ciudad 2D rica y SVG para validar primero la estructura.** Si la experiencia 3D permite reposo, React Three Fiber ofrece renderizado bajo demanda con `frameloop="demand"`; los cambios externos que deban dibujarse requieren invalidación. No lo tomaría como garantía automática de rendimiento. Referencia: [renderizado y rendimiento en React Three Fiber](https://r3f.docs.pmnd.rs/advanced/scaling-performance).

Godot no sería mi primera elección para este portfolio: su documentación de exportación web describe dependencias de WebAssembly y WebGL 2, restricciones del renderizador y particularidades móviles. Un juego auténtico puede justificarlo; una navegación espacial por sí sola no. Referencia: [exportación web de Godot](https://docs.godotengine.org/en/stable/tutorials/export/exporting_for_web.html).

### La decisión artística que evita el «trozo de imagen pegado»

**El edificio, la ficha y la navegación comparten la misma geometría visual.** Si la ciudad tiene contornos pixelados, los rótulos, los marcos del contenido y los controles respetan ese sistema, mientras el texto largo usa una fuente muy legible. La ciudad llega a los bordes del layout; no vive en una caja con fondo distinto incrustada en una landing ajena.

En móvil no se encoge una panorámica: se dibuja una calle para ese formato. Los tejados y fachadas enmarcan las secciones; entrar en un interior continúa esa calle en vertical. Arte original, alineación a una escala de píxel consistente y color vivo; el pixel art puede tener personalidad adulta mediante composición y detalles de producto, sin recurrir a marrones ni a nostalgia por sí sola.

## 4. Top 3 razonado

La comparación expresa criterio creativo, no resultados medidos de reclutamiento. «Potencial» significa lo que puede conseguir una buena ejecución; no garantiza recuerdo ni entrevistas.

| Finalista | Potencial de recuerdo | Lectura rápida | Evidencia técnica | Principal exigencia |
|---|---|---|---|---|
| 1. Club de cartas con equipos y foil | Muy alto; objeto fácil de describir | Muy buena si resultado y nombre están en el anverso | Alta con reverso de preguntas y pruebas | Arte propio y reglas útiles sin bloquear contenido |
| 2. Ciudad habitable | Muy alto; un mundo reconocible | Buena solo con plaza, rótulos y directorio inmediatos | Alta con interiores y relaciones reales | Diseñar navegación y móvil como ciudad desde el principio |
| 3. La Rotativa | Alto; gesto y objeto editorial propios | Muy buena con portadas legibles | Alta con capas de proceso y dossier | Que se reconozca al desarrollador, además del acabado gráfico |

### 1 · Club de cartas: mi recomendación para Fernando

**Por qué gana.** Hay una señal de gusto explícita: le encantaron las cartas y especialmente el foil. La dirección permite intensificar aquello que ya funciona, dando a la colección un juego propio y contenido sólido. Cada tarjeta sirve de proyecto, unidad comparativa y recuerdo; su forma sobrevive al móvil y también puede convertirse en una imagen que se comparta.

**Primeros segundos.** Nombre y perfil arriba; tres cartas grandes con productos, resultados y marcas de evidencia. CV, contacto e idioma visibles. Una carta de Odoo mostraría «IA en el ERP, con aprobación humana»; el reverso explicaría la contribución y cómo se controla el proceso.

**Para profundizar.** «Ver preguntas» abre evidencia; «Construir equipo» relaciona proyectos con una necesidad. Foil propio, marcos distintos y arte coherente: no una cuadrícula estándar con un efecto brillante añadido.

**Condición para elegirla.** Un prototipo con un proyecto real debe resultar deseable con brillo desactivado y conservar claridad al darle la vuelta. Si el foil es lo único distintivo, falta diseñar el sistema.

### 2 · Ciudad habitable: la apuesta más ambiciosa

**Por qué entra.** Fernando quiere ser «el que tenía su ciudad montada con sus cosas». Es una identidad espacial capaz de unir producto, recorrido, contacto y arquitectura en un mismo universo. Lo que falló en el intento anterior —la imagen pegada— es un problema de integración, no una condena de la idea.

**Primeros segundos.** Una plaza ocupa la composición completa; Fernando aparece identificado y cuatro destinos ya están rotulados. «Ver proyectos», «CV» y «Contacto» funcionan sin mover la cámara. Al abrir Wardux se entra en una redacción donde el contenido explica el producto y el proceso.

**Para profundizar.** Interiores con pruebas, conexiones temáticas y vista de operación. El mapa nunca obliga a conducir, saltar o esperar una visita guiada.

**Condición para elegirla.** Resolver antes una calle móvil con un interior y contacto completos. Si el móvil acaba siendo una lista genérica debajo de una miniatura del mapa, aún no hay una ciudad integrada.

### 3 · La Rotativa: mi alternativa nueva favorita

**Por qué entra.** Tiene un gesto físico claro —imprimir— y un objeto con utilidad real —un caso o dossier— sin tutorial. Puede ser graciosa, muy saturada y material con SVG y CSS, manteniendo una presentación profesional. El proceso de superponer problema, construcción y verificación encaja especialmente bien con alguien que utiliza agentes y necesita enseñar su criterio.

**Primeros segundos.** Fernando se presenta junto a tres publicaciones enormes; una lleva el titular «IA que redacta. Una persona que aprueba». Pulsar abre un caso legible y la máquina imprime brevemente su portada. El visitante con prisa descarga el CV sin tocar ningún mecanismo.

**Para profundizar.** Registro de capas, decisiones anotadas, pruebas y selección imprimible para entrevista. Todo pertenece a la misma imprenta, incluidas páginas internas y contacto.

**Condición para elegirla.** Una portada y su desplegable técnico deben mostrar desarrollo de software de forma inequívoca. Si parecen piezas de un diseñador editorial sin implementación, hay que corregir el contenido y la metáfora antes de añadir animación.

## 5. Cómo decidir con pruebas concretas

No construiría tres portfolios ni mezclaría las tres metáforas en una portada. Prepararía **un mismo caso real —Odoo o Adivinadle— en los tres finalistas**, con idéntico contenido y dos composiciones por concepto: escritorio y móvil. Cada prueba incluiría primera pantalla, apertura del caso, CV, contacto y modo de lectura; así se compara la experiencia completa y no solo una imagen atractiva.

1. **Prueba de comprensión breve.** Tras unos segundos, pedir a varias personas ajenas al proyecto que expliquen quién es Fernando, qué construye y qué producto recuerdan. Esto da observaciones cualitativas; una muestra pequeña no establece tasas de contratación.
2. **Prueba de tareas.** Encontrar un proyecto, explicar la contribución de Fernando, abrir una evidencia, descargar el CV en otro idioma y llegar a contacto. Observar confusiones y pasos sobrantes en móvil y con teclado.
3. **Prueba del recuerdo.** Después de otra actividad, preguntar cómo describirían la web a alguien: una firma como «el de las cartas» es útil si recuerdan también un proyecto y una capacidad.
4. **Prueba técnica del finalista.** Medir carga y respuesta en un móvil de prestaciones modestas, con red limitada; comprobar pausa, movimiento reducido, zoom, foco, rutas directas y lectura sin experiencia gráfica. Repetir las tareas con alemán, no solo español.

**Decisión recomendada:** empezar por las cartas con un anverso muy claro, un reverso de evidencia y foil propio; compararlas con una calle móvil integrada y una portada de La Rotativa. Elegir por personalidad reconocible más tareas completadas, y ampliar únicamente las mecánicas que ayudan a enseñar trabajo real.

---

*Documento de ideación. No incluye desarrollo, despliegue, comprobación de métricas de los productos ni generación de imágenes. Las afirmaciones sobre Fernando y sus proyectos proceden del encargo; las fuentes enlazadas respaldan únicamente los criterios técnicos citados.*
