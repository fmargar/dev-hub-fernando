---
name: Fernando Martínez — Consola de navegación estelar
description: Portfolio como nave de reconocimiento en órbita de un sistema construido; el canvas lleva la escala, el HUD lleva el contenido.
colors:
  bg: "#070912"
  bg-subtle: "#0c1020"
  surface: "#111528"
  surface-2: "#1a1f38"
  surface-hover: "#1d2340"
  line: "#232a45"
  line-strong: "#5a68a4"
  fg: "#eaf0ff"
  fg-muted: "#a8b4d4"
  fg-subtle: "#8b98bd"
  accent: "#ff7a52"
  accent-hover: "#ff9472"
  accent-fg: "#1a0803"
  nebula-cyan: "#5ee7ff"
  nebula-magenta: "#ff6bd6"
  nebula-violet: "#a98bff"
  signal-ok: "#5be6b0"
  destructive: "#ff8b7d"
typography:
  display:
    fontFamily: "Anybody, Geist, ui-sans-serif"
    fontSize: "clamp(2.75rem, 6.2vw, 4.75rem)"
    fontWeight: 700
    lineHeight: 1.02
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Anybody, Geist, ui-sans-serif"
    fontSize: "clamp(1.875rem, 3.6vw, 2.75rem)"
    fontWeight: 700
    lineHeight: 1.08
    letterSpacing: "-0.015em"
  title:
    fontFamily: "Geist, ui-sans-serif"
    fontSize: "clamp(1.25rem, 1.9vw, 1.5rem)"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.022em"
  body:
    fontFamily: "Geist, ui-sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.75
  instrument:
    fontFamily: "Geist Mono, ui-monospace"
    fontSize: "0.8125rem"
    fontWeight: 600
    letterSpacing: "0.02em"
rounded:
  control: "0.375rem"
  chip: "0.25rem"
  panel: "0.75rem"
  panel-bevel: "0.625rem"
spacing:
  block: "2rem"
  block-md: "2.75rem"
  section: "5rem"
  section-md: "7.5rem"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-fg}"
    typography: "{typography.instrument}"
    rounded: "{rounded.control}"
    padding: "0 1.15rem"
    height: "2.75rem"
  button-primary-hover:
    backgroundColor: "{colors.accent-hover}"
    textColor: "{colors.accent-fg}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.fg}"
    typography: "{typography.instrument}"
    rounded: "{rounded.control}"
  chip:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.fg-muted}"
    typography: "{typography.instrument}"
    rounded: "{rounded.chip}"
  panel:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.fg}"
    rounded: "{rounded.panel}"
---

# Design System: Consola de navegación estelar

## Overview

**Creative North Star: "La consola de reconocimiento"**

Este sitio es la consola de navegación de una nave en órbita de un sistema que Fernando construyó. Los cuerpos del sistema son el trabajo — cada caso de estudio un planeta, cada tecnología una luna — y sus cifras son las cifras reales del contenido, nunca decoración. El canvas WebGL lleva la escala y el espectáculo; el HUD en HTML lleva el contenido, siempre legible, siempre indexable, siempre alcanzable sin que el 3D tenga que cargar.

Es un redisño total, no una capa sobre el mundo anterior (una web de producto clara y minimalista). El mundo previo queda como evidencia y anti-referencia: donde antes había focos tenues de un acento sobre fondo blanco, ahora hay una nebulosa procedural sobre espacio profundo; donde antes las tarjetas se levantaban 2px al pasar el ratón, ahora los paneles tienen esquinas biseladas que dejan ver el cosmos y se iluminan en vez de desplazarse — en el espacio nada se levanta. Lo único que sobrevive del mundo anterior es el bermellón como acento de acción, y sobrevive a propósito: es la identidad conservada en medio del cambio de lenguaje.

El listón de acabado (itshover, Linear, Stripe/Resend, portfolios de estudio) sigue siendo el nivel de oficio exigido — ahora aplicado a un lenguaje visual distinto, no relajado por la ambición del 3D. Un reclutador sin GPU decente o con `prefers-reduced-motion` activado recibe un producto completo en CSS puro, no una disculpa.

**Key Characteristics:**
- Oscuro permanente: no hay modo claro que mantener ni tema del sistema que escuchar.
- Un único acento de acción (bermellón) sobre una paleta de telemetría de tres tonos (cian, magenta, violeta) que nunca significa "haz clic aquí".
- Registro tipográfico invertido: la monoespaciada es el instrumento (navegación, controles, datos), el sans es la prosa.
- El 3D nunca es el único camino: todo cuerpo clicable tiene su enlace real gemelo en el HTML.

## Colors

Estrategia: neutro frío de espacio profundo con un único acento cálido, más tres tonos de telemetría que identifican cuerpos y datos en vivo pero nunca sustituyen al acento como llamada a la acción.

### Primary
- **Bermellón** (`#ff7a52`): la única acción, el único foco, el único estado activo de navegación. Aparece en tres sitios y solo tres — igual que en el mundo anterior, es la regla que sobrevivió al rediseño completo.

### Secondary
- **Cian de telemetría** (`#5ee7ff`): datos en vivo (`.data`), corchetes de esquina de los paneles, línea de horizonte de la barra de navegación, línea de barrido del escáner sobre las capturas.
- **Magenta de ciudad** (`#ff6bd6`): luces de neón del lado nocturno del planeta Marbella Fácil, acentos secundarios puntuales.
- **Violeta de nebulosa** (`#a98bff`): color de fondo del universo, filete de las citas destacadas — la única aparición del violeta fuera de la escena 3D.

### Neutral
- **Espacio profundo** (`#070912`): fondo de página. Sesgo violeta deliberado, no negro puro — esconde el bandeado de los degradados de nebulosa.
- **Subfondo** (`#0c1020`): pie, cajas planas, hover de fila.
- **Panel** (`#111528`): toda superficie que lleva texto de cuerpo. Siempre opaca — el cristal nunca lleva prosa.
- **Panel secundario** (`#1a1f38`): pastilla de tecnología, código en línea.
- **Filete** (`#232a45`) / **Filete de control** (`#5a68a4`): borde decorativo y borde de control respectivamente; el de control pasa el SC 1.4.11 de no-texto (3,40:1 sobre panel).
- **Texto** (`#eaf0ff`) / **texto secundario** (`#a8b4d4`) / **texto sutil** (`#8b98bd`).

### Named Rules
**La regla de las tres apariciones.** El bermellón vive en acción principal, foco y estado activo — nunca en un cuarto sitio. Si un elemento necesita destacar sin ser una acción, usa telemetría (cian/magenta/violeta), no el acento.

**La regla del cristal opaco.** Toda región con texto de cuerpo se apoya en `--surface` sólida. `.glass` (cristal con desenfoque) es exclusivo del chrome de navegación — nunca lleva prosa encima, porque un panel translúcido sobre una nebulosa brillante rompe cualquier cálculo de contraste.

Los pares de texto están comprobados contra WCAG AA sobre los cuatro fondos (`--bg`, `--bg-subtle`, `--surface`, `--surface-2`): `--fg` de 17,4:1 a 14,2:1; `--fg-muted` de 9,6:1 a 7,8:1; `--accent` de 7,7:1 a 6,3:1.

## Typography

**Display Font:** Anybody (variable, autoalojada, OFL) con Geist como respaldo
**Body Font:** Geist
**Label/Mono Font:** Geist Mono

**Character:** El registro está invertido respecto al mundo anterior. Antes la monoespaciada era "el registro de expediente" (metadatos, código) y el sans llevaba todo lo demás; ahora la mono es el instrumento — navegación, botones, chips, telemetría, coordenadas — y el sans se reserva para la prosa (titulares de display aparte, que llevan su propia voz). Anybody aporta el carácter técnico-anguloso sin caer en el cliché "espacial → mono espaciada" (Orbitron, Space Grotesk, Space Mono quedaron descartadas explícitamente por ser la asociación más obvia).

### Hierarchy
- **Display** (700, `clamp(2.75rem, 6.2vw, 4.75rem)`, 1.02): titular de la home. Anybody.
- **Headline** (700, `clamp(1.875rem, 3.6vw, 2.75rem)`, 1.08): título de sección/página. Anybody.
- **Title** (600, `clamp(1.25rem, 1.9vw, 1.5rem)`, 1.2): bloque. Geist.
- **Lead** (400, `clamp(1.0625rem, 1.3vw, 1.1875rem)`, 1.62): bajada, color `--fg-muted`. Geist.
- **Body** (400, `1.0625rem`, 1.75): cuerpo de caso, medida de lectura a 65ch. Geist.
- **Instrument** (600, `0.8125rem`, tracking `0.02em`, versalitas visual vía uppercase): botones, navegación, acciones, chips. Geist Mono.
- **Data** (400, `0.8125rem`, cifras tabulares, color `--nebula-cyan`): telemetría y metadatos en vivo. Geist Mono.

### Named Rules
**La regla del registro invertido.** Si un elemento es control o dato, es mono. Si es algo que se lee, es sans. El titular de display es la única excepción con voz propia (Anybody).

## Layout

`.container-page` a 74rem con márgenes de 1.25rem a 2.5rem. Ritmo vertical por `--space-block`/`--space-section`, que crecen en el breakpoint de 768px (2rem→2.75rem, 5rem→7.5rem). `.hero-field` es un hueco transparente sin fondo propio: dentro de la home revela el canvas WebGL fijo (o el respaldo en CSS puro del nivel 0) que vive detrás de todo el sitio a `position:fixed; z-index:0`; el contenido normal (`#content`, `<footer>`) gana `position:relative; z-index:1` explícito para pintarse por delante.

**Responsive del universo:** en viewports por debajo de 767px el canvas entero se atenúa (`filter: brightness(0.45) saturate(0.7)`) porque el mismo encuadre de cámara que funciona en escritorio puede dejar un planeta entero detrás de un párrafo de lectura en una pantalla estrecha; el héroe de la home suma además un velo de degradado y un halo de `text-shadow` en el titular como red de seguridad adicional, porque los cuerpos orbitan y el peor cruce puede darse en cualquier instante.

## Elevation & Depth

No hay elevación por desplazamiento. El mundo anterior levantaba las tarjetas 2px con sombra al pasar el ratón; en el espacio nada se levanta, se ilumina: `.surface-lift:hover` enciende el color del filete (`--line` → `--line-strong`) y añade un resplandor de 1px en cian (`box-shadow` con `color-mix` sobre `--nebula-cyan`), sin transform. Las sombras (`--shadow-sm/md/lg`, negras con desplazamiento real) siguen existiendo para chrome flotante (paleta de comandos, dropdown de idioma) pero no son el vocabulario de profundidad principal del sitio.

### Named Rules
**La regla de la iluminación, no el desplazamiento.** Ningún elemento de este sitio se mueve verticalmente al recibir hover. La respuesta al puntero es siempre de color/brillo (filete, corchetes de esquina, atmósfera de un cuerpo 3D), nunca de posición.

## Shapes

Los paneles (`.surface`, `.shot`) tienen dos esquinas opuestas biseladas vía `clip-path` (corte de 0.625rem) — nunca las cuatro, que es el cliché de HUD de videojuego — con marcas de esquina en cian en las otras dos. El triángulo cortado deja ver el fondo cósmico fijo detrás, a propósito. Los controles (`.btn`, `.field`) usan un radio más cerrado (0.375rem) que antes (0.625rem): leen como botonera de consola, no como pastilla de app web. Los chips pasan de pastilla completa (`999px`) a un radio de 0.25rem con un filete izquierdo de 1px como marca de dato — nunca 2px, que el propio detector de Impeccable señala como el "side-tab" reconocible de interfaces genéricas.

## Components

### Buttons
- **Shape:** radio 0.375rem, tipografía mono en versalitas visuales (`text-transform: uppercase`), tracking `0.02em`.
- **Primary:** fondo `--accent` sólido, texto `--accent-fg`. Es la única superficie del sitio ajena al sistema de nebulosa — y por eso funciona: es la identidad conservada.
- **Secondary:** panel `--surface` con filete `--line-strong`.
- **Ghost:** transparente, texto `--fg-muted`, fondo `--surface-2` al pasar el ratón.
- **Hover / Focus:** transición de 0.16s en fondo/borde/color; foco con contorno de 2px en `--accent` y desplazamiento de 2px.

### Chips
- **Style:** fondo `--surface-2`, filete neutro de 1px más filete izquierdo de 1px en cian (o bermellón en `.chip-accent`) como marca de dato. Mono, `0.75rem`.
- **State:** `.chip-accent` invierte a fondo `--accent-soft` con texto `--accent`.

### Cards / Containers (`.surface`, `.surface-flat`)
- **Corner Style:** bisel de dos esquinas opuestas (0.625rem) + marcas de esquina cian en las otras dos.
- **Background:** `--surface` (elevado) o `--bg-subtle` (`.surface-flat`, plano — el laboratorio de herramientas usa esta variante porque una retícula de 33 iguales no necesita jerarquía de superficie).
- **Shadow Strategy:** `--shadow-sm` en reposo; en hover, resplandor cian de 1px, sin desplazamiento (ver Elevation).
- **Border:** 1px `--line` en reposo, `--line-strong` en hover.

### Inputs / Fields (`.field`)
- **Style:** fondo `--surface`, filete `--line-strong`, radio 0.375rem.
- **Focus:** contorno eliminado, filete a `--accent` + halo de `color-mix` al 16%.
- **Label:** mono, `0.75rem`, versalitas, tracking `0.04em` — registro de instrumento, no de prosa.

### Navigation
- Raíl de consola: `.glass` con fondo `--surface-glass` (mezcla de `--surface` al 88%) + `backdrop-filter: blur(16px) saturate(120%)` + línea de horizonte inferior de 1px en cian al 20%. Enlaces en mono, versalitas, tracking `0.03em`; estado activo en `--accent`.

### Escáner (`.shot` / `.shot-scanline`, componente de firma)
Marco de captura con el mismo bisel + marcas de esquina que `.surface`, más una línea de barrido de 1px en cian que cruza verticalmente al pasar el ratón (`transition: top 0.6s`) — el visor de análisis estilo No Man's Sky aplicado a las capturas reales del trabajo. Es la pieza que más distingue este sistema de un tema oscuro genérico.

## Do's and Don'ts

### Do:
- **Do** mantener el bermellón (`#ff7a52`) exclusivamente en acción principal, foco y estado activo.
- **Do** usar mono/versalitas para todo lo que sea control o dato (botones, chips, nav, `.data`), y sans para todo lo que se lea.
- **Do** dar a cada cuerpo clicable del universo 3D un enlace real (`<a>`) equivalente en el HTML — el mapa es la puerta lenta, nunca la única.
- **Do** generar la geometría 3D desde datos reales del contenido (métricas de `content/cases/`, conteos de `content/tools.ts`, stats en vivo de `/api/homelab-stats`) en vez de cifras inventadas.
- **Do** comprobar contraste AA en los cuatro fondos neutros cada vez que se toque un token de color.

### Don't:
- **Don't** usar `border-left`/`border-right` de color por encima de 1px en tarjetas, chips o avisos — es el "side-tab" que delata una interfaz genérica, y el detector de Impeccable lo señala.
- **Don't** levantar ninguna superficie con `translateY` al hacer hover; la respuesta es siempre de brillo/color.
- **Don't** poner contenido legible (`<Html>` de drei o equivalente) dentro del canvas WebGL — rompe SEO, accesibilidad y el contrato de "dos puertas".
- **Don't** añadir un cuarto uso del bermellón fuera de acción/foco/activo, ni usar cian/magenta/violeta como si fueran una llamada a la acción.
- **Don't** introducir una fuente "espacial" obvia (Orbitron, Space Grotesk, Space Mono) — el carácter técnico ya lo dan el registro invertido y la geometría de los paneles.
