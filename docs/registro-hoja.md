# Registro de la hoja del portfolio

Lo que salió de «Dónde estamos ahora» de `ESTADO.md`, lo más reciente arriba.

## Hasta el 22/11/2026: «La pesca» (12/10 y 13/10, superado)

**Lo que eligió Fernando (última palabra, 12/10 noche):** «prefiero los peces, arreglando el
diseño, los movimientos y el fondo». Es decir, la maqueta **N · La pesca** (`n-pesca.html`,
fuente `docs/direcciones-diseno/vivos/pesca.html`), rehecha. La **O · Tarjetas**
(`o-tarjetas.html` + `o-caso.html`, fuente `tarjetas/`) queda como base de contenido: sus
tarjetas con foil (qué es · qué hice · resultado · tecnologías · estado) son lo que debe mostrar
cada proyecto también en la versión de peces.

**Hecha la «P · La pesca v2» (12/10 noche)** → http://100.93.209.52:4300/portfolio/p-pesca.html
(capturas `p-pesca-*.png` en `/capturas/`). Fuente `docs/direcciones-diseno/vivos/pesca2.html`
→ `python3 tarjetas/generar.py` (genera también O). Qué cambia respecto a la N:
1. **Fondo sin foto.** Degradado CSS de profundidad + un shader propio de luz (cáusticas con dos
   campos de celdas deformados por ruido, crestas con `smoothstep`, rayos inclinados que
   respiran, brillo de superficie y una luz suave en el puntero), con máscara arriba y a los
   lados. Va **dentro de PixiJS** (un `Mesh` con `Shader.from`, pintado en una `RenderTexture`
   reducida a 30 fps): con dos contextos WebGL el móvil perdía el del agua. Algas (cinta con
   hojas) y gorgonias generadas en SVG en dos planos (lejos, claras; cerca, oscuras en los
   bordes) con vaivén CSS; partículas en suspensión en una capa fija con parallax. Abajo del
   todo, otro lecho de algas.
2. **Movimientos.** Carriles horizontales; el espejo solo cambia fuera de pantalla (sale y vuelve
   a entrar por el mismo lado mirando al revés, a veces por otro carril); cabeceo ±8°; con el
   puntero encima frena para poder pescarla; las demás se apartan despacio en vertical. Medusa
   en su columna, sube y baja latiendo sin rotar; manta en diagonal amplia de borde a borde. En
   escritorio, dos carriles lejanos pasan por detrás del texto (se apagan y esconden el nombre).
3. **Estructura.** Portada = el mar con nombre, titular, CV y contacto; 6 criaturas = proyectos
   destacados (Adivinadle medusa, Wardux manta, IA en el ERP globo, Equipo de agentes calamar,
   Cálculo Exacto barracuda, Marbella Fácil pez ángel). Al pescar sale la **tarjeta con foil de
   O** con «Ver el caso completo» y «Seguir pescando». Debajo: rejilla de las 9 tarjetas con
   filtros, experiencia, habilidades y contacto. Sin álbum, contador ni profundímetro.
4. Capturas: `cap-vivo.mjs` ahora calienta WebGL antes (con GPU por software el primer contexto
   del navegador se pierde) y saca la página completa en otra pestaña a DPR 1. ffmpeg estático
   en `~/.local/bin/ffmpeg` (de `~/herramientas/video/.venv`, imageio-ffmpeg).

**Lo que dijo Fernando de la P (12/10 noche):** «está mejor, pero habrá que mejorarlo». Se
sigue el 13/10 a partir de las 15:00, con él probándola en su PC. Ya apuntado: **la captura de
Wardux en la tarjeta es muy fea** (quizá solo el nombre) y **la de Adivinadle queda cutre**
(Adivinadle aún está por retocar; quizá solo su logo). Preparar alternativas para las figuras de
esas tarjetas antes de la sesión.

**Espera a Fernando:** que vea la P en el móvil y el ordenador (la velocidad real solo se ve con
GPU; la grabación del servidor va a ~3 fps). Ajustes posibles: número de peces, velocidades,
intensidad de la luz. Cuando elija diseño final, se lleva a la web Next.js y se despliega.
