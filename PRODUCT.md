# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Quien decide si Fernando Martínez pasa a la siguiente fase de un proceso de selección.
En la práctica son dos perfiles seguidos, casi siempre en este orden:

1. **Alguien de RRHH o de una agencia** que abre el enlace desde un CV o LinkedIn, no es
   técnico, y decide en segundos si merece la pena seguir leyendo o pasar al siguiente
   candidato. Muchas veces desde el móvil.
2. **Una persona técnica** (lead, CTO, desarrollador sénior) que llega después, con más
   tiempo, y busca evidencia de que sabe construir software de verdad y no solo seguir
   tutoriales.

No hay preferencia por sector, tamaño de empresa ni ubicación: el objetivo es el mejor
trabajo posible, venga de donde venga. Eso obliga a que la web funcione igual para una
agencia de la Costa del Sol, para un equipo de producto en remoto y para una consultora
grande.

## Product Purpose

Conseguir que contraten a Fernando. El éxito es que el visitante le escriba o lo haga
avanzar en un proceso.

No es un currículum ni un archivo de proyectos: es la prueba de que el trabajo existe.

## Positioning

Ha puesto software en producción para una administración pública y mantiene él mismo la
infraestructura que sostiene veinticinco servicios en marcha. Las dos cosas están
documentadas en memorias técnicas propias, con decisiones que se pueden defender en una
entrevista: por qué el borrado se bloquea en una policy y no en un botón, por qué el
filtro territorial es un global scope, cómo se importan ficheros IBM850 sin corromper
acentos.

Un recién titulado con proyectos de clase no puede decir eso. Es lo que un producto
vecino no podría copiar honestamente.

## Operating Context

- El visitante llega desde un CV en PDF, LinkedIn o GitHub. Casi nunca por búsqueda.
- La primera visita es corta y con frecuencia desde el móvil.
- El sitio se sirve en español, inglés y alemán; el idioma vive en la URL
  (`/`, `/en`, `/de`), no en el navegador — un enlace compartido abre siempre en
  el idioma correcto, y las 33 herramientas del laboratorio quedan fuera del
  segmento de idioma (solo existen en español).
- Está autoalojado en el servidor del propio Fernando, detrás de Cloudflare, y se
  despliega desde GitHub por Portainer.

## Capabilities and Constraints

- **Cinco casos de estudio** ya escritos y contrastados con las memorias técnicas:
  sistema de vados del Ayuntamiento de Marbella, Marbella Fácil, integración con Odoo en
  Uniformes Bahía, infraestructura autoalojada y servicio de vídeo. Separados en trabajo
  profesional y proyectos propios.
- **Treinta y tres herramientas** que funcionan enteras en el navegador, sin servidor.
  Son públicas y usables por cualquiera; su lógica no se toca.
- **Tres idiomas completos**, incluidos los cuerpos largos de los casos.
- Next.js con salida standalone en Docker. La build de producción no puede depender de
  servicios externos en tiempo de compilación.
- El formulario de contacto está **sin configurar en producción**: falta `RESEND_API_KEY`
  en el stack y devuelve 503. El correo sí es alcanzable por otras vías.

## Brand Commitments

- Nombre público: **Fernando Martínez** (completo: Fernando Máximo Martínez García).
- Dominio `fmargar.es`, GitHub `github.com/fmargar`, correo `fmargardeveloper@gmail.com`.
- **No se señala disponibilidad.** Está trabajando y no quiere indicar que busca.
- Nada de vida personal ni aficiones: se retiraron a propósito las referencias a
  servidores de juego y automatizaciones de ocio. Lo personal solo entra si se sostiene
  por su interés técnico.
- Rigor sobre marketing: no se afirma nada que la evidencia no respalde. Esta regla ya ha
  corregido el sitio dos veces (la integración con directorio activo y la certificación
  de AWS).
- **La convención de la categoría es un compromiso, no un recurso por defecto.** Tras
  cuatro mundos rechazados —todos con aire histórico, porque es lo que devuelve una
  tirada diseñada para evitar el estándar— Fernando tomó la puerta de salida: una web de
  producto moderna, jugada en serio, sin ironía ni rarezas de contrabando. El listón de
  acabado lo fijó él y es permanente: **itshover, Linear, Stripe/Resend y portfolios de
  estudio**. No se copian sus maquetas; se iguala su nivel de oficio.
  Cualquier rediseño futuro parte de aquí, no de otra tirada.

## Evidence on Hand

- **Memoria técnica del sistema de vados**, 23 secciones: modelo de datos, políticas de
  autorización, importadores, despliegue e indicadores.
- **Memoria de Marbella Fácil**, 182 páginas, con **51 imágenes embebidas y 45 utilizables**
  a resoluciones de hasta 2500 px: landing, panel de empresa, administración, reservas.
  Fernando autoriza publicarlas previa selección.
- **El servidor en marcha**: veinticinco contenedores, diecisiete stacks, dos salidas a
  internet independientes. Cifras verificables sobre la máquina real.
- **Las treinta y tres herramientas**, que funcionan en vivo y se pueden empotrar.
- **CV en PDF** publicado en `/cv/`, sin teléfono y con el usuario de GitHub corregido.
- Diagramas propios de arquitectura para los casos que no tienen capturas.

Ausencias que no se pueden inventar: no hay repositorios públicos del sistema de vados,
la infraestructura ni el servicio de vídeo; no hay métricas de resultado del trabajo en
Uniformes Bahía; no hay testimonios ni referencias publicables, solo la posibilidad de
facilitarlas a petición; no hay credenciales verificables enlazadas de las
certificaciones.

## Product Principles

1. **La prueba manda sobre la afirmación.** Enseñar el trabajo funcionando antes que
   describirlo. Cuando no hay captura, hay diagrama; cuando no hay ninguno, se dice.
2. **Lo que no se puede respaldar, no se dice.** Incluido reconocer en el propio caso lo
   que quedó fuera de alcance.
3. **Dos velocidades de lectura.** Quien pasa quince segundos debe entender qué hace y a
   qué nivel; quien pasa quince minutos debe encontrar decisiones técnicas defendibles.
4. **Lo profesional y lo personal no se mezclan.** Los proyectos propios entran por su
   interés técnico y van claramente separados.
5. **El sitio es en sí una muestra de trabajo.** Se sirve desde su propia infraestructura
   y su calidad se juzga como parte del portfolio.

## Accessibility & Inclusion

- Contraste WCAG AA como requisito permanente, comprobado token a token en cada cambio de
  paleta.
- Tamaños de fuente en unidades relativas, para que respeten la configuración del
  navegador.
- Contenido servido en el HTML, sin depender de JavaScript para leerlo.
- Los tres idiomas se mantienen a la par: cualquier texto nuevo entra en los tres.
