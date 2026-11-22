# Estado del portfolio (fmargar.es)

## Dónde estamos ahora (22/11/2026)

**RUMBO VIGENTE (Fernando, 26/10 y repetido el 22/11): el portfolio va al estilo del Showcase, NO de los
peces.** 22/11/2026: «No, yo no dije lo de los peces, eso fue al principio, ya luego cambiamos. Luego dije
que me gustaría enfocar más parecido mi portfolio a lo que es el showcase que preparé para Accenture. […]
unas vías, así que se iban moviendo unos puntitos, súper visual todo. Dije, esto está gracioso, pero se
podría hacer mucho más. […] yo no quiero el pez, me da igual. […] quería algo más parecido a lo que era mi
showcase, pero mejorado con estas estéticas nuevas y profesionales, súper pulidas, botones interactivos».
El listón de acabado: `~/dev/diseno/docs/REFERENCIA-WEBS-CURRADAS.md`. Detalle de la idea del 26/10, más
abajo («Idea de Fernando (26/10/2026)»). **Lo de «La pesca» (12/10) está superado**; su
historia, en `docs/registro-hoja.md`. El 22/11 la Jefatura 32 encargó una maqueta de prueba con este rumbo.

**Producción (fmargar.es) no se toca hasta que Fernando elija diseño.** Maquetas publicadas en
http://100.93.209.52:4300/portfolio/ (capturas de todas en `/capturas/`, ideas en `/abanico/`).

**Hecha la maqueta de prueba «El plano en relieve» (22/11).** http://100.93.209.52:4300/portfolio/currada/ ·
en el visor, con el Showcase al lado: https://visor.fmargar.es/#portfolio-plano-en-relieve. Fuente
`docs/direcciones-diseno/currada/` (HTML, CSS y JS propios, sin dependencias ni CDN); se publica con
`rsync -a --delete currada/ /mnt/datos/simulaciones/salida/portfolio/currada/`. Capturas `currada-*.png` en
`/capturas/`.

- **La idea:** el plano de metro del Showcase, en relieve y conducible. Seis líneas = seis proyectos; cada una
  lleva un tren de tres coches que se agarra, se arrastra y se lanza por su vía; se para en las paradas (qué
  es · qué hice yo · resultado) y, al llegar al final de la línea, el proyecto sale de la estación: la ficha
  se abre desde ese punto. Debajo, la misma información en una lista para leer de corrido, y el contacto.
- **Cómo está hecha:** `js/datos.js` (textos y trazado, horizontal y vertical), `js/via.js` (la vía por
  longitud de arco), `js/tren.js` (física: enganches con muelle, mano, imán de parada, topes con rebote,
  piloto con frenada), `js/pintor.js` (WebGL2 propio: relieve, sombras y coches, repintando solo lo que
  cambia) y `js/app.js` (puntero, teclado, fichas, rutas `#/linea/<id>`). Sin WebGL2 cae a un plano SVG.
  Con «reducir movimiento» el tren aparece en la parada y no hay animaciones.
- **Comprobado** (Playwright, 1440×900 y 390×844, mirando las capturas): arrastrar, soltar, llegar a parada,
  abrir y cerrar ficha, teclado entero (1–6, flechas, Enter, Esc, Tab dentro de la ficha), táctil (arrastrar
  el tren no mueve la página), redimensionar, movimiento reducido, consola sin errores; la física, aparte en
  Node. **Sin comprobar:** la fluidez real y la transición de la ficha en movimiento (sin gráfica, el
  navegador sin cabeza va a pocos fotogramas y a cámara lenta).
- **Datos provisionales:** las imágenes de Wardux y Adivinadle son las portadas que ya había
  (`public/media/`); el CV se sirve desde la propia maqueta.

**Espera a Fernando:** que la pruebe en su ordenador y en el móvil y diga si la portada va por aquí.
Si dice que sí: llevarla a la web Next.js, tema de noche, capturas nuevas de cada proyecto y decidir si las
fichas enlazan las demos del Showcase.

**Coordinación con el chat de carrera (13/10):** CV, LinkedIn y candidaturas los lleva ese chat
(session_01L1PCMAnNnP3CqBPPWkHQBg, estado en `~/docs/CARRERA.md`). Lo que el portfolio cuente de
Fernando tiene que cuadrar con CARRERA.md y el CV maestro. Fijado por CARRERA.md §2 (cambiado
por Fernando el 13/10 a las 15:38): **titular** «Desarrollador Full Stack · agentes de IA ·
integración de LLM» (igual en CV, LinkedIn, web, `<title>` y Open Graph) y, debajo, la **frase**
«Construyo y pongo en marcha software con un equipo de agentes de IA». Prohibidos «IA en
producción» como etiqueta y «llevar la IA a producción» en prosa. Aplicado en la P y en la web. Si cambia, avisa carrera y se cambia en los tres sitios a la vez.

## Historia de este relevo

## Qué hay desplegado

- **fmargar.es sirve `27b8595`** de la rama `portfolio/ai-engineer-2026-10` (13/10: titular
  nuevo en textos, `<title>`, Open Graph, manifest, habilidades, Wardux y «Sobre mí», y el CV web nuevo).
  Comprobado desde fuera.
- Titular (desde el 13/10, orden de Fernando): **«Desarrollador Full Stack · agentes de IA ·
  integración de LLM»**. Prohibido «IA en producción» como etiqueta y «llevar la IA a producción»
  en prosa. Nunca «AI Engineer» ni «ingeniero de IA»: Fernando no ha tenido ese puesto.
- 9 fichas en `/work/<slug>`: adivinadle, wardux, calculo-exacto (sin enlace: aún no está
  publicada), agentes-ia (enlaza `github.com/fmargar/equipo-de-agentes`, público),
  vision-local, homelab, uniformes-bahia, sistema-vados-marbella, marbella-facil (solo la web,
  nunca el repo). Español sin prefijo e inglés en `/en`; el alemán se retiró (`/de` → `/en`).
- Secciones de la portada con ids estables: `#proyectos`, `#experiencia`, `#habilidades`,
  `#contacto`. El README del perfil de GitHub enlaza a estas URL: no cambiarlas.
- CV: `public/cv/fernando-martinez-cv.pdf` = `~/docs/CV_Fernando_Maximo_Martinez_Garcia_web.pdf`
  (versión web **sin teléfono**). Si el CV cambia, copiar esa ruta y redesplegar.
- Formulario de contacto: `lib/contact-delivery.ts`. Guarda cada mensaje en
  `~/servicios/portfolio/mensajes/contacto.jsonl` y avisa al móvil por avisos-api (emisor
  `portfolio`). Resend solo si algún día hay clave. Probado de verdad dos veces (avisos #1045 y #1046).
- API pública con límites (`lib/api-guard.ts`, con tests): contact, remove-bg y nba.

## Prohibido en el portfolio

Microsoft Rewards, farmeo, cuentas o bots de Rewards (el orquestador se describe genérico);
los vídeos de TikTok/YouTube y su canal; IPs de Tailscale, puertos o cualquier dato de la red
interna; el repo de Marbella Fácil; enlazar repos privados (Adivinadle, Cálculo Exacto). Wardux
**sí** se puede nombrar desde el 12/10.

## Cómo se despliega (ya no es el stack 3 de Portainer)

Producción es un docker compose del clon `~/dev/dev-hub-fernando-legacy`, proyecto
`dev-hub-fernando`. El `.env` de ese directorio (600, fuera de git) lleva `AVISOS_URL` y
`AVISOS_CLAVE`.

```bash
cd ~/dev/dev-hub-fernando-legacy && scripts/desplegar.sh   # commit limpio; construye, prueba, despliega y poda
```

`scripts/desplegar.sh` construye con límites de CPU, prueba en 127.0.0.1:3099, guarda la de
producción como `:vuelta-atras`, levanta el compose, comprueba fmargar.es y **borra todas las
imágenes del portfolio salvo producción y vuelta atrás** (el SSD está al 96 %). Volver atrás:
`docker tag dev-hub-fernando-portfolio:vuelta-atras dev-hub-fernando-portfolio:latest && docker compose -p dev-hub-fernando up -d --no-build`.
Hoy (13/10): producción `:27b8595`, vuelta atrás = 3904acf (ya con el titular nuevo). Las
antiguas (`anterior-20261012`, b9c43c7…) se borraron; se rehacen desde git si hiciera falta.

No usar `docker compose` en `~/dev/dev-hub-fernando`: es otro proyecto, el contenedor
`mi-portfolio-dev` (3070), con el rediseño espacial viejo de `master`.

## Pendiente

1. **Diseño:** Fernando dijo que el actual (cobalto) parece «genérico hecho con IA». Hay dos
   direcciones en `docs/direcciones-diseno/`, publicadas con capturas en
   http://100.93.209.52:4300/portfolio/ (`/mnt/datos/simulaciones/salida/portfolio/`):
   - **A · Sala de control:** grafito con rejilla, el panel de los agentes como pieza única,
     cuatro colores muy distintos (azul, rojo, verde, amarillo), Bricolage Grotesque y el CV
     en amarillo.
   - **B · Cartel:** rojo saturado con trama de semitono, nombre gigante en Archivo ancho,
     banda negra con el titular y sombra dorada, capturas de Adivinadle y Wardux por capas, y
     «La IA propone. Una persona decide.» con la tarjeta de aprobación.
   - **C · Mezcla (12/10, la pidió Fernando: «B más chulo, A más clean, el rojo cansa»):** base
     grafito con rejilla de A; de B, el nombre gigante en Archivo ancho, la banda roja del titular
     con sombra dorada y las capturas por capas, pero el rojo solo en una losa detrás de ellas.
     Debajo, «La IA propone. Una persona decide.» con el panel de agentes de A.
     Fernando: «queda raro». Crítica con impeccable: dos mundos pegados (cartel impreso sobre
     panel técnico), cuatro inclinaciones distintas, sombras duras de disfraz, pegatina.
   - **D · Escaparate (12/10, la propuesta vigente):** un solo mundo, web de producto oscura al
     listón de PRODUCT.md (Linear, Stripe). Nombre en Archivo ancho a 6rem centrado, las tres
     capturas (Wardux, Adivinadle y Adivinadle en el móvil) en un único plano inclinado con la
     luz de los cuatro colores detrás, y debajo «Lo que tengo en producción»: tarjetas por
     proyecto, cada una con su color y su captura saliendo por abajo (Adivinadle ancha, Wardux,
     Equipo de agentes con el tablero, LLM en el ERP con el flujo de aprobación).
     Fernando: «no está mal pero queda raro»; quiere interactividad al hacer scroll.
   - **E · Servidor por capas (12/10, la vigente):** D con el héroe cambiado. A la derecha, el
     servidor cerrado se abre pieza a pieza con el scroll (GSAP ScrollTrigger, sección fijada
     260 % de pantalla) y cada pieza lleva una etiqueta verdadera de la infraestructura
     (Cloudflare, vigilancia, agentes, Docker, PostgreSQL, copias, despliegue, Ubuntu; nada
     del farmeo). Imagen de ChatGPT (`codex exec`, generación de imágenes) recortada en 8 capas
     con SAM 2 (`servidor/recortar_piezas.py` + `cajas.json`; entorno en
     `~/herramientas/segmentar/.venv`): cada píxel va a la pieza con más confianza, así que
     abierto reconstruye la imagen original exacta. Titular nuevo: «Desarrollador Full Stack.
     Construyo y pongo en marcha software con un equipo de agentes de IA» (Fernando: «IA a
     producción» asusta, suena a enchufarle una IA a su sistema).
     Siguiente opción si la quiere más cinematográfica: Higgsfield (de pago: vídeo con
     Seedance → fotogramas → scroll). Lo decide Fernando por el dinero.
     Fernando: «funciona muy mal», se aparca el scroll. Quiere diseños «mucho más guays».
   - **Ronda del 12/10 tarde** (impeccable `concept-seed`, clave 046653b4; se descartan los
     mundos «de época» que ya rechazó): **F · Cartas** (cada proyecto, una carta coleccionable
     con lámina holográfica que sigue al puntero; mano en abanico en la portada), **G · Ciudad**
     (manzana en pixel art isométrico generada con ChatGPT, `ciudad/ciudad.webp`; cada edificio
     es un proyecto con su ficha al pasar: local de juegos = Adivinadle, torre de prensa =
     Wardux, robot del tejado = agentes, centro de datos = servidor, fábrica con la mano del
     visto bueno = LLM en el ERP) y **H · Cartel profundo** (la B con rojo #c9231a y texto
     crema, para que no deslumbre). Esperando a que Fernando elija.
   - **Ronda del 12/10 noche:** **I · Cartas v2** (sobres por tema, foil por tipo de prueba,
     reverso de entrevista), **J · Expendedora** (cada proyecto, un producto con su etiqueta
     técnica) y **K · Ciudad habitable** (la web entera es la ciudad: valla con la
     presentación, rótulos que hacen zoom y abren el edificio por plantas, callejero de placas
     de azulejo, botón de noche con la misma escena iluminada y, en el móvil, una calle vertical
     propia con la presentación arriba). Fuentes de K: `ciudad/edificios.json` (posiciones en %
     de escritorio y móvil) + `plantilla.html` → `python3 ciudad/generar.py`. Originales PNG en
     `ciudad/originales/` (fuera de git).
   - **El abanico (12/10 noche):** Fernando pidió ver muchas más opciones, no solo cartas y
     ciudad. Ronda 2 de ideas: 30 de Codex (`docs/ideas/ideas-codex-ronda2-2026-10-12.md`) y 18
     de Claude (`ideas-claude-ronda2-…`) en diez familias. Las 24 más distintas tienen imagen de
     referencia (ChatGPT) en el catálogo `docs/ideas/abanico/` (`python3 generar.py`),
     publicado en http://100.93.209.52:4300/portfolio/abanico/. Esperando a que elija cuáles
     prototipar de verdad.
   - **L · Acuario y M · Jardín (12/10 noche, las dos que eligió Fernando del abanico):**
     `l-acuario.html` (los proyectos son criaturas de neón dibujadas en canvas que nadan,
     huyen del puntero y se «pescan» para abrir su ficha; al bajar se bucea: especies, trayecto,
     bancos de habilidades y el contacto en el fondo, con profundímetro) y `m-jardin.html`
     (cada proyecto es una planta de cristal que crece al entrar: una hoja por cada pieza con
     la que está hecho y una flor por cada pregunta de verificación; al pasar se lee cada hoja;
     vivero, estaciones, semillero e invernadero). Fuente: `vivos/acuario.html`,
     `vivos/jardin.html` y `vivos/perfil.json` → `python3 vivos/generar.py`. Fondos pintados por
     ChatGPT (`vivos/*.webp`; PNG en `vivos/originales/`, fuera de git). Capturas: `node
     cap-vivo.mjs l-acuario` / `node cap-vivo.mjs m-jardin .planta`. Fernando no quiere que la
     web gire solo en torno a la IA: debe decirse, pero sin ser el eje.
   - **N · La pesca (12/10 noche, la propuesta vigente):** Fernando, indeciso entre acuario,
     jardín y cartas («los peces de la referencia eran mucho más chulos»; «el foil quedaba
     espectacular»). Se juntan sus dos favoritos: el acuario como mundo y, al pescar una
     criatura, sale su carta con foil (reverso de entrevista) y se guarda en el álbum (contador
     fijo, `localStorage`); debajo, el álbum con las 8 cartas para quien no juegue. Criaturas
     pintadas por ChatGPT (`vivos/criaturas/`, el negro pasado a transparencia con
     `vivos/criaturas.py`) y animadas con PixiJS v8 (`vivos/pixi.min.mjs`, local): una malla
     por criatura que se deforma según su especie (pez, anguila, calamar, globo, medusa, manta).
     El lienzo va dentro de la portada, no fijo: así no da saltos al hacer scroll (fallo que
     sí tienen L y M). Capturas: servir la carpeta (`python3 -m http.server 8765`) y
     `BASE=http://127.0.0.1:8765 node cap-vivo.mjs n-pesca .criatura`.
   - **O · Tarjetas (12/10 noche, la vigente tras `docs/ideas/decision-rumbo-2026-10-12.md`):**
     Fernando aceptó volver a un portfolio de verdad con una sola firma, el foil; el mar sobra.
     `o-tarjetas.html` (portada: nombre en Anybody ancho, mano de tres tarjetas que se reparte
     al cargar, rejilla de 9 tarjetas filtrable por tipo, experiencia, habilidades, contacto) y
     `o-caso.html` (caso de Adivinadle con su tarjeta fija a la izquierda). Cada tarjeta: qué es,
     qué hice, resultado, tecnologías y estado; captura real o, si es interno, un diagrama SVG de
     cómo funciona (sin datos inventados). Foil saturado por tipo. Fuente en `tarjetas/`
     (`proyectos.json`, `comun.css`, `comun.js`, `portada.html`, `caso.html` →
     `python3 tarjetas/generar.py`). Capturas: servir la raíz del repo y
     `BASE=http://127.0.0.1:8766/docs/direcciones-diseno node cap-vivo.mjs o-tarjetas ".mano .tarjeta"`.
     Estética propuesta por Codex en `docs/ideas/estetica-mar-codex-2026-10-12.md` (las tres eran
     marinas; se tomaron sus reglas de tarjeta y de escalado).

   Regenerar las capturas: `cd docs/direcciones-diseno && node cap.mjs [nombre…]` (y `node cap-scroll.mjs e-servidor 0 1 2.6` para fotos a distintas alturas del scroll). Publicar en :4300 cambiando `../../public/media/` por `media/` (Playwright de
   `~/dev/ms-rewards-bot-propio/node_modules`). Cuando elija, llevar la dirección a toda la
   web (`app/globals.css`, `components/home/HomeView.tsx`, fuentes en `lib/fonts.ts`), sacar
   capturas a 390 y 1440 de portada, una ficha y /experience, y desplegar. El contenido y la
   accesibilidad no pueden empeorar.
2. **Escaneo con claude-security del portfolio:** no se lanzó, porque el plugin exige que
   Fernando confirme con sus palabras que acepta el tiempo y los tokens. Hay una sesión de
   Seguridad dedicada (session_01Nkjgb3yM8FrVXSFv94csnT).
3. `master` sigue teniendo el rediseño espacial. Cuando el diseño quede cerrado, decidir si
   `master` pasa a ser esta rama (merge `-s ours` para conservar la historia).
4. Laboratorio de herramientas (`/tools`): sin tocar; sigue en el menú.

## Idea de Fernando (26/10/2026): rework del portfolio al estilo del Showcase
Le encantó el Showcase de la entrevista de Accenture (`~/dev/showcase-entrevista`, `showcase.fmargar.es`): portada como plano de metro, una línea por sistema, cada uno con su demo y su etiqueta honesta (Simulación / Reconstrucción / En vivo / Esquema), textos sencillos sin código. Quiere el portfolio **muy enfocado a ese funcionamiento**. Sin fecha (un finde o una tarde). Ojo al reutilizarlo: nada de la granja ni del farmeo en lo público; nunca «AI Engineer» de título ni «IA en producción». Decide él el diseño antes de desplegar.
