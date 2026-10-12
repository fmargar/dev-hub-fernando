# Decisión de rumbo del diseño · 12/10/2026 (noche)

## Qué dijo Fernando
Tras ver la pesca (N): las criaturas «hacen cosas raras» (giran 180°), el fondo se nota que es
una foto, las «preguntas de entrevista» no se entienden, y la duda de fondo: «¿si mañana tengo
más proyectos, metemos más peces?», «estamos perdiendo la esencia de un portfolio».

## Lo que se ha comprobado
- Lo que mira quien contrata: qué has construido, cuál fue tu papel y qué resultado tuvo, en un
  vistazo; luego el código y el caso. Las florituras no puntúan solas
  ([hiration](https://www.hiration.com/blog/build-portfolio-for-job-search/),
  [scale.jobs](https://scale.jobs/blog/portfolio-content-for-tech-jobs-what-recruiters-want)).
- Los portfolios-juego famosos (Bruno Simon, Merouane Bali) son de especialistas en 3D/WebGL:
  el juego **es** su trabajo. Para un full stack, el trabajo son los productos.
- Los que se recuerdan sin ser un juego (Brittany Chiang, Josh Comeau, Eliot Besson) tienen una
  estructura normal y **una firma**: un color, una tipografía, una interacción reconocible.
- El efecto holográfico de cartas Pokémon en CSS es conocido (simeydotme/pokemon-cards-css);
  como firma de las tarjetas de proyecto en un portfolio no lo hemos visto.

## Decisión
Fernando tiene razón: el mundo-juego (ciudad, acuario, pesca) se come el portfolio y no escala.
Se vuelve a **un portfolio de verdad con una sola firma**:
1. Estructura clásica: presentación con CV y contacto a la vista; proyectos; experiencia;
   habilidades; contacto. Cada proyecto lleva a su caso de estudio (`/work/<slug>`, ya existe).
2. **La firma: las tarjetas de proyecto con foil**, lo que más le ha gustado desde el principio.
   Una tarjeta por proyecto con la captura real del producto (o su ilustración si es interno);
   el foil dice el tipo (producto publicado, empresa, precisión, sistema propio, académico).
   Un proyecto nuevo es una tarjeta más: escala sola.
3. Fuera: sobres, mazo, pescar, reverso de entrevista. En su lugar, en cada tarjeta y en el caso:
   **qué es · qué hice yo · con qué · resultado**.
4. El acuario, el jardín y el abanico se quedan publicados como archivo de ideas.
