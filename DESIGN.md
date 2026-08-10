# Design

<!-- impeccable:design-schema 1 -->

Registrado desde el sitio ya construido, no antes de construirlo.

## La dirección

**El canon, a máxima fidelidad.** No hay mundo prestado. Este sitio es la convención
actual de una web de producto —claro por defecto, mucho aire, superficies con filete de
un píxel, un solo acento y movimiento corto— ejecutada al nivel de acabado que el
usuario fijó como listón.

Es la **puerta de salida** de Impeccable, tomada por Fernando después de cuatro mundos
rechazados. La tirada (clave `e95bc100`) devolvía sistemas históricos —archivador
metálico, teletexto, cartel de parque nacional, animación en acetato— porque está
diseñada precisamente para esquivar el estándar de la categoría. El brief pedía lo
contrario, y **el brief gana**. Con la salida tomada, la convención deja de ser pereza y
pasa a ser compromiso de marca; queda registrada como tal en `PRODUCT.md`.

**Listón de acabado**, elegido por el usuario: itshover, Linear, Stripe/Resend y
portfolios de estudio. Se iguala su oficio, no se copian sus maquetas.

Modo **Experience**: la obra lidera y la interfaz se retira.

## Color

Estrategia: **neutral cálido con un solo acento**, gastado con cuentagotas. El acento
aparece en tres sitios y solo tres —acción principal, foco y estado activo de la
navegación—; el resto del sitio es tinta sobre papel.

| Token | Claro | Oscuro | Qué es |
|---|---|---|---|
| `--bg` | `#ffffff` | `#0b0b0c` | Fondo de página |
| `--bg-subtle` | `#fafaf9` | `#101012` | Pie, cajas planas, hover de fila |
| `--surface` | `#ffffff` | `#141416` | Tarjeta elevada |
| `--surface-2` | `#f5f5f4` | `#1b1b1f` | Pastilla de tecnología, código en línea |
| `--line` / `--line-strong` | `#e7e5e4` / `#d6d3d1` | `#26262a` / `#35353b` | Filete y filete de control |
| `--fg` | `#0c0a09` | `#fafaf9` | Texto |
| `--fg-muted` | `#57534e` | `#a8a29e` | Texto secundario |
| `--fg-subtle` | `#6f6862` | `#8f8a85` | Pies de figura, metadatos |
| `--accent` | `#c53d14` | `#ff7a52` | **Bermellón.** Acción, foco, activo |
| `--accent-soft` / `--accent-line` | `#fdf1ec` / `#f2cdbf` | `#241310` / `#48231a` | Aviso y nodo destacado de diagrama |

El bermellón claro es `#c53d14` y no un naranja más vivo porque a partir de ahí el texto
del acento deja de cumplir AA sobre blanco. En oscuro sube a `#ff7a52` por el mismo
motivo, invertido.

**El oscuro está diseñado, no invertido**: los neutros se recalientan, las sombras se
endurecen y el acento cambia de luminosidad. Claro es el valor por defecto y el sistema
operativo puede imponer el suyo.

Los 21 pares de contraste están comprobados contra **WCAG AA en los dos temas**, incluido
el texto sobre el botón de acento y su estado de hover.

## Tipografía

- **Geist** — interfaz y titulares. Geométrica con muy buena escala óptica en tamaños
  pequeños, que es donde se juega la legibilidad de este sitio.
- **Geist Mono** — el **registro de expediente**: etiquetas de metadatos (`Cliente`,
  `Periodo`, `Ubicación`), valores de máquina, rutas, identificadores del sistema y
  código. Nunca en botones, enlaces ni títulos: aquí la monoespaciada no es un disfraz
  técnico, es la letra de los datos.

Escalas fluidas en `rem`, cero valores en píxeles:

| Clase | Tamaño | Uso |
|---|---|---|
| `.display-1` | `clamp(2.75rem, 6.2vw, 4.75rem)` | Titular de página |
| `.display-2` | `clamp(1.875rem, 3.6vw, 2.75rem)` | Sección |
| `.display-3` | `clamp(1.25rem, 1.9vw, 1.5rem)` | Bloque |
| `.lead` | `clamp(1.0625rem, 1.3vw, 1.1875rem)` | Bajada |
| `.body-copy` | `1.0625rem` / interlineado `1.75` | Cuerpo de caso |
| `.data` | `0.8125rem` mono, cifras tabulares | Metadatos |

Medida de lectura a 65ch (`.measure`). Interletraje negativo creciente con el tamaño,
hasta −0.038em en el titular.

## Composición

La regla que separa esto de una plantilla: **jerarquía asimétrica, no rejilla de clones**.

- El índice de trabajo saca **un caso a tarjeta ancha** con la captura a sangre por un
  lateral, y deja el resto en **filas separadas por filete**. Una sola pieza lleva imagen
  grande, así que el resto no compite.
- La home abre con titular a escala de display sobre un **campo de dos focos** muy tenues
  del acento, dos acciones con icono animado y una fila de datos separada por filete.
  **No hay franja de cifras.**
- El caso pone título y metadatos arriba, la **captura a todo el ancho del contenedor**
  justo debajo, y el cuerpo en dos columnas con índice pegajoso.
- El laboratorio sí es una retícula regular, porque un directorio de 33 utilidades
  **es** una lista de iguales. Lo que evita que parezca plantilla es que las celdas no
  llevan sombra ni marco pesado: se levantan al pasar por encima y nada más.

## Componentes

| Clase | Qué es |
|---|---|
| `.container-page` | 74rem con márgenes de 1.25→2.5rem |
| `.page-head` | Cabecera de página: título, bajada y filete inferior |
| `.hero-field` | Campo del héroe con los dos focos del acento en el fondo |
| `.surface` / `.surface-flat` / `.surface-lift` | Tarjeta elevada, caja plana y el levantamiento de 2px al pasar por encima |
| `.btn` + `.btn-primary` / `.btn-secondary` / `.btn-ghost` | Controles, radio 0.625rem |
| `.field` / `.field-label` | Campos de formulario con anillo de foco del acento |
| `.chip` | Etiqueta de tecnología: pastilla sin color |
| `.shot` / `.shot-caption` | Marco de captura y su pie |
| `.quote` | Cita destacada: tamaño y peso hacen el énfasis, filete de 1px neutro |
| `.note` / `.note-warning` | Aviso con icono animado |
| `.data` | El registro monoespaciado |
| `.glass` | Barra superior de cristal con desenfoque |
| `.action` / `.link` / `.link-quiet` | Enlace con icono, enlace subrayado y enlace apagado |

**Logos de tecnología** (`/stack`, `content/tech.ts`): monocromos en `currentColor`,
nunca a color de marca. Se pintan con `mask-image` (fondo `currentColor` recortado
por la silueta del SVG), no con `<Image>` — un SVG externo referenciado por
`<img>`/`next/image` no hereda `currentColor` de la página. Sin variantes
claro/oscuro: al heredar el color del texto no hace falta conmutar por tema. Las
tecnologías sin marca oficial reconocible (APIs REST, migraciones, CI/CD...) llevan
un glifo neutro de Lucide en vez de dejar el hueco vacío o inventar un logotipo.

## Movimiento

El movimiento es material del sistema, no adorno, y es la razón por la que el usuario
eligió **itshover**.

- **20 iconos animados de itshover** vendorizados en `icons/`, servidos por el hook
  `useHoverIcon` de `components/ui/hover-icon.tsx`. Los iconos traen su propio disparador
  al pasar por encima del glifo, que dentro de un enlace es el sitio equivocado: el hook
  cablea su handle imperativo al elemento que de verdad recibe el puntero, y el **foco de
  teclado dispara la misma animación**.
- Devuelve una tupla y no un objeto a propósito: leer `algo.ref` durante el render es lo
  que prohíbe `react-hooks/refs`.
- Levantamiento de 2px con sombra en tarjetas, transiciones de 0.16–0.22s, barra de
  progreso de lectura de 1px en el acento.
- **No hay apariciones al hacer scroll.** Se probaron y se quitaron: dejaban la obra en
  opacidad 0 esperando a un observador, que es justo lo contrario del modo Experience.
- `prefers-reduced-motion` anula todo, incluido el levantamiento.

## Lo que este sitio no usa

Decidido a propósito y verificado por el detector (**0 hallazgos**):

- **Antetítulos** sobre los titulares. Donde parece haber uno hay un dato con función:
  la vía del caso o la etiqueta de un metadato.
- **Numeración decorativa** 01/02/03 y **franjas de cifras** en el héroe.
- **Texto en degradado.** El degradado vive en el fondo del héroe y en ningún otro sitio.
- **Bordes laterales de color** de más de 1px y **sombras sin desplazamiento**.
- **Emoji** como iconos.
- **La parrilla de tarjetas iguales como recurso de composición**, salvo donde el
  contenido es realmente uniforme.

## Accesibilidad

- Contraste AA comprobado token a token en los dos temas.
- Tamaños de fuente en unidades relativas. **Cero valores en píxeles.**
- Foco visible con perfilado de 2px del acento y desplazamiento de 2px.
- Los iconos animados son decorativos y van marcados como ocultos: el texto del enlace
  ya dice lo que hace.
- El contenido viaja en el HTML del servidor; el idioma se resuelve tras hidratar sin
  desajustes.
- Las capturas llevan texto alternativo descriptivo y pie propio, traducidos.
