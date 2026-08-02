# Design

<!-- impeccable:design-schema 1 -->

Registrado desde el mundo ya construido, no antes de construirlo.

## El mundo

**El archivo.** El sitio es un archivador metálico de oficina del que se sacan
expedientes. Hay dos materiales y solo dos: la **chapa** del mueble y la **ficha**
de cartulina. Todo lo demás es herraje: pestañas de separador, tirador, placa de
cajón, tampón de goma y la varilla que atraviesa la ficha.

Sale de lo que hace Fernando: convertir expedientes dispersos en algo consultable,
en sistemas donde un registro no se borra nunca. La numeración de las fichas no es
decorativa, es la referencia por la que se localiza un expediente.

Dirección asignada por `concept-seed`, clave `076aca04`, candidato 7 de la lista
ordenada por resonancia. Modo **Experience**.

## Color

Estrategia: **restringida sobre dos superficies**. Ningún color decorativo; cada
tono nombra un material.

| Token | Valor | Qué es |
|---|---|---|
| `--steel` | `#2b3330` | Chapa del archivador. Fondo por defecto |
| `--steel-dark` | `#1e2422` | Fondo del cajón; pie de página |
| `--steel-edge` | `#465350` | Canto iluminado del frente |
| `--card` | `#efe7d6` | La ficha. El único material claro |
| `--card-head` | `#e7dec9` | Cabecera de la ficha |
| `--card-edge` / `--card-rule` | `#d6cab1` / `#ded4be` | Canto y pautado |
| `--ink` | `#23201a` | Tinta sobre ficha |
| `--ink-soft` | `#5a5449` | Tinta secundaria |
| `--on-steel` | `#e8e4d8` | Texto sobre chapa |
| `--on-steel-soft` | `#a8b2ac` | Texto secundario sobre chapa |
| `--brass` | `#c9a44c` | Latón: tirador y acción principal |
| `--stamp` | `#9b2a1f` | Tinta de tampón. Solo cuando dice algo cierto |
| `--tab` | `#456055` | Cartulina de las pestañas |

**Regla:** ninguna pieza mezcla los dos papeles. Un botón sobre la chapa usa
`--on-steel`; el mismo botón dentro de una ficha usa `--ink`.

`.light` no es un tema alternativo: es **la ficha sobre la mesa**, el cajón
vaciado sobre el tablero. Mismo mundo, otro momento.

Contrastes verificados contra WCAG AA en ambos estados, incluido el texto sobre
el botón de latón.

## Tipografía

- **Archivo Narrow** — etiquetas de cajón y titulares. Condensada, como las
  cartulinas de un archivador.
- **Courier Prime** — todo lo mecanografiado: referencias de expediente,
  metadatos, etiquetas de stack, pies de figura. Aquí la monoespaciada **no es un
  disfraz técnico**: es la letra con la que se escribieron las fichas.

Escalas: `.display-1` hasta 4.5rem, `.display-2`, `.display-3`. Cuerpo a 1rem con
interlineado 1.72 y medida de 68ch. Interletraje mínimo −0.03em.

## Componentes

| Clase | Qué es |
|---|---|
| `.tab-strip` / `.tab` | Pestañas de separador. **Son la navegación**, no una barra de menú |
| `.drawer-front` | Frente del cajón: franja con `.drawer-pull` y `.drawer-plate` |
| `.file` | La ficha: fondo claro, canto, sombra con desplazamiento y desenfoque |
| `.file-head` / `.file-ref` | Cabecera con la referencia de expediente |
| `.file-hole` | El agujero de la varilla |
| `.stamp` | Tampón de goma. Se gana cuando afirma algo real del expediente |
| `.divider-card` | Cartulina separadora que rotula un bloque |
| `.marginal` | Anotación al margen: reglas arriba y abajo, sin barra de color |
| `.note` | Diligencia añadida al expediente |
| `.plate` | Fotografía pegada sobre la ficha, con su reborde |
| `.typed` / `.typed-on-steel` | Texto mecanografiado, según el material de apoyo |

## Lo que este mundo no usa

Decidido a propósito, verificado por el detector (**0 hallazgos**):

- **Antetítulos** sobre los titulares. Lo que parece uno es una etiqueta de cajón
  o una cartulina separadora, que son objetos del mundo con función propia.
- **Numeración decorativa** 01/02/03. Las fichas llevan referencia de expediente,
  que identifica el registro.
- **Texto en degradado**, franjas de cifras tipo escaparate, bordes laterales de
  color por encima de 1px y parrillas de tarjetas iguales.
- **Sombras sin desplazamiento**. Toda sombra tiene offset y desenfoque.
- **Emoji o glifos** como iconos.

## Movimiento

Casi ninguno, y siempre corto: la flecha de «leer el caso» avanza al pasar por
encima y la ficha destacada se levanta un poco. `prefers-reduced-motion` lo anula
todo. Un archivo no se anima; se abre.

## Accesibilidad

- Contraste AA comprobado token a token en los dos estados.
- Tamaños de fuente en unidades relativas. Cero valores en píxeles.
- Foco visible con perfilado de latón a 2px.
- El contenido viaja en el HTML del servidor; el idioma se resuelve tras hidratar
  sin desajustes.
- Las capturas llevan texto alternativo descriptivo y pie propio, traducidos.
