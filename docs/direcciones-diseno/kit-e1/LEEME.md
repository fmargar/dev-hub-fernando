# Kit E1: guía para hacer una maqueta

Cada maqueta de `maquetas-e1/<idea>/` es una escena de Blender con la luz horneada, que la web dibuja con three.js
sin calcular luces. El kit tiene lo que comparten todas. Esta guía cuenta cómo se usa y, sobre todo, qué hacer para que
el horneado acabe a tiempo y la web vaya fluida en un ordenador sin gráfica.

## Cómo se hace una maqueta

1. **`herramientas/escena.py`** (en la carpeta de la maqueta) monta la escena con las piezas del kit
   (`herramientas/kit.py`: `bloque`, `lamina`, `cilindro`, `tubo`, `esfera`, materiales, luces…). Agrupa las piezas
   por láminas de luz, las despliega (`desplegar`), las hornea (`Horno`) y exporta `escena.glb` con `luz.json`.
2. **`herramientas/luces.py <carpeta de trabajo> <maqueta>/luz`** convierte lo horneado en las imágenes de luz que
   carga la web.
3. **`js/app.js`** llama a `montarEscena(cfg)` (`js/motor.js`). `cfg.material(nombre)` dice qué lámina de luz, qué
   impreso y cuánto brillo lleva cada malla, según su nombre. El resto del kit: `muelles.js` (cada movimiento),
   `rutas.js` (cada paso con su enlace), `pantalla.js` (la demo o el tráiler), `proyectar.js` (la pantalla HTML sobre
   el 3D).
4. **Pruebas** (`medir/`): `romper.mjs` (doble clic, volver a mitad, cambiar el tamaño…), `tiempos.mjs` (cuánto tarda
   cada paso y las tareas largas, con gráfica o `MODO=software`) y `capturar.mjs`.

## El horneado: `Horno.hornear_junto`

**Úsalo siempre en las maquetas nuevas**, en lugar de `Horno.hornear`:

```python
horno.hornear_junto(objs, 'base', 4096, color=True, publicar=2048)
```

**Por qué.** Cycles hornea objeto a objeto, y cada objeto recorre la imagen entera. El tiempo crece con piezas ×
píxeles. La base de la maqueta habitable (175 piezas en una lámina de 4096) se pasó dos veces del tope de 20 minutos.

**Qué hace.** Duplica las piezas del grupo, une la copia en una sola malla y la hornea. Después la borra, y con ella
las mallas y los materiales que creó. La copia conserva un material por pieza y las UV de luz de cada una, con las
mismas posiciones, así que el resultado sirve igual que el de `hornear`. Al acabar, las piezas originales quedan como
estaban (también su visibilidad), y repetir el horneado da lo mismo.

**Con él**, la habitable tarda 5,9 minutos en total (la base, 101 s) y el taller 3,9.

`hornear` sigue igual para las maquetas ya hechas.

**Si un horneado se corta a medias** (el tope de tiempo), las láminas ya hechas están guardadas (`<nombre>.npy`).
Con `reusar=True` no se repiten y solo se hornea lo que faltaba. Las escenas lo activan con el argumento `seguir`.
Úsalo solo si la geometría no ha cambiado desde entonces: el despliegue de UV sale igual en cada pasada, pero solo con
las mismas piezas.

**Si una lámina sale a bloques en la web** (manchas cuadradas en superficies lisas), mira su `escala` en la salida
de `luces.py`. Una escala muy alta (la cabina del ascensor dio 10,8; lo normal es menos de 1) significa que unos
pocos puntos muy calientes, como un globo pegado a su luz, hacen de blanco. Todo lo demás queda entonces en uno o dos
niveles de gris, y la compresión lo enseña en bloques. Con `percentil=98.5` en `hornear`/`hornear_junto` (99,7 por
omisión) esos puntos se recortan y el resto gana precisión. No hace falta volver a hornear: se cambia el `percentil`
de esa lámina en `horno.json` y se repite `luces.py`.

## La web sin gráfica

Sin gráfica (SwiftShader, llvmpipe…) el motor pasa solo a modo ligero. Medido en la habitable, el JavaScript gasta
menos de 1 ms por fotograma: el coste es dibujar. Pesan tres cosas, y por este orden.

**1. Mallas.** Cada malla es una llamada de dibujo. Cuando la escena ya está horneada, lo que se mueve junto se une
para la web en una sola malla (una función `unir_para_la_web(todo)` en la `escena.py` de cada maqueta, justo antes de
`horno.exportar`):

- **Agrupa** por el vacío del que cuelgan (lo que se mueve, junto) y por cómo brilla (latón, cristal, luces y lo
  demás). Así `cfg.material` sigue sabiendo qué darle a cada una.
- **Deja sueltas** las piezas que la web mueve, enciende o pinta con un impreso.
- **Les pone** un material común y deja activa la UV `luz`.

La habitable pasó de 946 mallas a 67 y el taller quedó en 24.

**2. Triángulos.** Los cuentas con el modo `medir` de la escena: cuenta por tipo de pieza y no hornea. Dónde mirar:

- **Esferas pequeñas y repetidas:** pocos segmentos (`esfera(..., segmentos=(16, 10))`; la estándar son 2.200
  triángulos).
- **Cilindros:** 20–24 lados.
- **Biseles:** dos segmentos, o ninguno en las piezas diminutas.

Objetivo: por debajo de unos 60.000 triángulos.

**3. Píxeles.** Mientras algo se mueve, el motor dibuja un lienzo pequeño (160.000 píxeles) y al pararse vuelve a la
nitidez. **`cfg.pixelesEnMarcha`** cambia ese tope para una maqueta. La habitable usa 80.000, porque cada píxel suyo
cuesta el triple que en la estantería. Bájalo solo si, tras las mallas y los triángulos, sigue por debajo de 30 fps.
Las maquetas que no lo dan siguen con 160.000.

**Cómo comprobarlo:**

```
MODO=software node medir/tiempos.mjs <url> <carpeta> 1440x900 <rutas…>
```

Y, para los fotogramas mientras se mueve, el intervalo entre `requestAnimationFrame`: con una mediana de 33 ms o
menos se llega a 30 fps.

## Lo que ha fallado antes (para no repetirlo)

- **Un comentario CSS sin cerrar** al principio de la hoja se come las variables de `:root`, y los papeles salen
  transparentes. El rompedor no lo ve; las capturas sí.
- **Paneles fijos:** que acaben encima del recorrido con `bottom: calc(var(--barra) + 10px)`, no con una cifra. La
  maqueta pone `--barra` con un `ResizeObserver`.
- **El encuadre de la pantalla con la demo:** que se acorte por abajo si el recorrido (que crece con los mandos)
  taparía su borde.
- **Tableta en vertical:** la demo va a pantalla entera, pero estrecha, con la proporción de un móvil. A lo ancho
  queda casi cuadrada y no cabe.
- **Revisión en seis tamaños:** 1440, 1280, 1024, 820 en vertical, 390 y 360, con capturas de cada paso.
