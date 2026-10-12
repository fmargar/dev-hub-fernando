# Estado del portfolio (fmargar.es)

## Dónde estamos ahora (12/10/2026, noche)

**Producción (fmargar.es) no se toca hasta que Fernando elija diseño.** Maquetas publicadas en
http://100.93.209.52:4300/portfolio/ (capturas de todas en `/capturas/`, ideas en `/abanico/`).

**Lo que eligió Fernando (última palabra, 12/10 noche):** «prefiero los peces, arreglando el
diseño, los movimientos y el fondo». Es decir, la maqueta **N · La pesca** (`n-pesca.html`,
fuente `docs/direcciones-diseno/vivos/pesca.html`), rehecha. La **O · Tarjetas**
(`o-tarjetas.html` + `o-caso.html`, fuente `tarjetas/`) queda como base de contenido: sus
tarjetas con foil (qué es · qué hice · resultado · tecnologías · estado) son lo que debe mostrar
cada proyecto también en la versión de peces.

**Siguiente paso: hacer «P · La pesca v2»** (`docs/direcciones-diseno/vivos/pesca2.html` →
`p-pesca.html`) con lo que le molestó de la N:
1. **Fondo vivo, sin foto.** «Se nota que el fondo es una foto». Quitar `acuario-fondo.webp` y
   `acuario-lecho.webp`. Agua generativa: degradado de profundidad + cáusticas en shader (dos
   campos de ruido desplazados, crestas con `smoothstep`, máscara arriba y a los lados) + rayos
   de luz animados + partículas en suspensión con parallax + siluetas vectoriales de algas y
   corales en primer plano con vaivén. Un `Filter` de PixiJS o un canvas WebGL propio, DPR
   ≤ 1,5, 30 fps y pausa fuera de pantalla. Detalle técnico en
   `docs/ideas/estetica-mar-codex-2026-10-12.md` («Cómo conseguir agua integrada»).
2. **Movimientos.** «Hacen cosas raras, hacen 180». Recorridos horizontales; un pez nunca gira
   en pantalla: sale por un lado y vuelve a entrar por el otro ya mirando al revés. Cabeceo
   máximo ±8°, velocidad suave, nada de huir del puntero a tirones (como mucho apartarse
   despacio). Medusa: sube y baja latiendo, sin rotar. Manta: planea en diagonal amplia.
3. **Diseño y estructura de portfolio** (`docs/ideas/decision-rumbo-2026-10-12.md`): la portada
   es el mar con la presentación, el CV y el contacto a la vista; los peces son los proyectos
   destacados (4–6, no uno por proyecto: Fernando preguntó «¿si tengo más proyectos, más
   peces?»); al pescar uno sale **su tarjeta con foil de O** (no las «preguntas de
   entrevista», que no entendió) con enlace a su caso. Debajo, la rejilla de todas las
   tarjetas, experiencia, habilidades y contacto. Sin profundímetro ni HUD; la profundidad,
   solo con el color al bajar.
4. Reutilizar: criaturas con alfa en `vivos/criaturas/*.webp` (PNG en `vivos/originales/`,
   `vivos/criaturas.py`), deformación de malla de `vivos/pesca.html` (función `deformar`),
   `tarjetas/comun.css` y `tarjetas/comun.js`. Usar las skills frontend-design e impeccable;
   capturas a 390 y 1440 (servir la raíz del repo: `python3 -m http.server 8766` y
   `BASE=http://127.0.0.1:8766/docs/direcciones-diseno node docs/direcciones-diseno/cap-vivo.mjs <página> "<selector>"`).

**Espera a Fernando:** elegir diseño final; después se lleva a la web Next.js y se despliega.

## Historia de este relevo

## Qué hay desplegado

- **fmargar.es sirve `b9c43c7`** de la rama `portfolio/ai-engineer-2026-10` (el 15303ed más
  el enlace al repo público de agentes). Comprobado desde fuera.
- Titular: **«Desarrollador Full Stack · IA en producción · agentes de IA»**. Nunca «AI
  Engineer» ni «ingeniero de IA»: Fernando no ha tenido ese puesto.
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
cd ~/dev/dev-hub-fernando-legacy
nice -n 10 taskset -c 0-3 docker build -t dev-hub-fernando-portfolio:$(git rev-parse --short HEAD) .
docker run -d --name portfolio-prueba -p 127.0.0.1:3099:3000 dev-hub-fernando-portfolio:<commit>  # probar
docker rm -f portfolio-prueba
docker tag dev-hub-fernando-portfolio:latest dev-hub-fernando-portfolio:<commit-actual>-desplegada
docker tag dev-hub-fernando-portfolio:<commit> dev-hub-fernando-portfolio:latest
docker compose -p dev-hub-fernando up -d --no-build
```

Vuelta atrás: retaguear una de estas como `:latest` y repetir el último paso.
`:anterior-20261012` (portfolio de antes del 12/10), `:54a049e-desplegada`,
`:8bf3f54-desplegada`, `:15303ed`.

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
