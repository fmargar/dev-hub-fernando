"""Los doce sospechosos de la ronda de Adivinadle (inventados), como muñecos de juguete renderizados en Blender.

  pesado.sh --cola gpu personajes -- <python con bpy> personajes.py <carpeta> [muestras]

Salen p0.png … p11.png, con fondo transparente, en el orden del ELENCO de js/adivinadle.js; `laminas.py` los
junta en la lámina de 4 × 3 que usa la web. Cada muñeco lleva lo que dicen sus datos: el zorro, orejas; el ave, pico y
cresta; el gólem, musgo; la sirena, corona… Mismo juguete que la figurita de la estantería y la carátula.
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import kit as K  # noqa: E402
import bpy  # noqa: E402

DESTINO, MUESTRAS, _ = K.argumentos()
os.makedirs(DESTINO, exist_ok=True)
PIEL = '#f2c9a0'
ELENCO = [  # nombre, cuerpo, cabeza, detalle
    ('Brasa', '#c8473a', PIEL, ('casco', '#c9ccd6')),
    ('Musgo', '#8d8a80', '#a29f94', ('musgo', '#5f9a3c')),
    ('Voltio', '#3f8fd0', '#d8dde8', ('antena', '#ffb000')),
    ('Nieblina', '#9fc8e8', PIEL, ('gorro', '#e6f4ff')),
    ('Ancla', '#1f3b73', PIEL, ('gorra', '#f4f1ea')),
    ('Pixela', '#f2c230', PIEL, ('coletas', '#7a4cc0')),
    ('Ráfaga', '#cfe6f5', '#f6f8fb', ('pico', '#f29a2e')),
    ('Tuerca', '#2e8f7a', PIEL, ('gorra', '#5a5f66')),
    ('Don Seta', '#efe6d4', PIEL, ('seta', '#d63b3b')),
    ('Sombra', '#2a1f3a', '#3a2f4a', ('tricornio', '#120d18')),
    ('Coral', '#f07a6a', PIEL, ('corona', '#e7b53c')),
    ('Chispa', '#e2782c', '#f19a4a', ('orejas', '#e2782c')),
]
ANCHO, ALTO = 464, 496          # el doble de lo que ocupa cada retrato en la lámina publicada (232 × 248)


def principal():
    K.limpiar()
    K.ajustes(ANCHO, ALTO, MUESTRAS)
    esc = bpy.context.scene; esc.render.film_transparent = True
    for i, (nombre, cuerpo, cabeza, extra) in enumerate(ELENCO):
        K.figura(f'p{i}', (i * 6.0, 0, 0), cuerpo, cabeza, extra)
    # luz de retrato: clave cálida arriba a la izquierda, relleno frío y un perfil por detrás que recorta
    for i in range(len(ELENCO)):
        x = i * 6.0
        K.area(f'clave{i}', (x - 2.2, -3.0, 3.2), (x, 0, 1.0), 260, (1.0, 0.93, 0.84), 1.6)
        K.area(f'relleno{i}', (x + 2.6, -2.4, 1.4), (x, 0, 1.0), 70, (0.8, 0.88, 1.0), 2.0)
        K.area(f'perfil{i}', (x + 1.2, 2.0, 2.4), (x, 0, 1.0), 160, (1.0, 0.9, 0.8), 1.0)
    K.mundo('#808080', 0.25)
    cam = K.camara((0, -6.0, 1.05), (0, 0, 0.95), 166)
    trozos = []
    for i, (nombre, *_r) in enumerate(ELENCO):
        x = i * 6.0
        cam.location = (x, -6.0, 1.05)
        cam.rotation_euler = (K.Vector((x, 0, 0.95)) - cam.location).to_track_quat('-Z', 'Y').to_euler()
        ruta = os.path.join(DESTINO, f'p{i}.png'); esc.render.filepath = ruta
        bpy.ops.render.render(write_still=True)
        trozos.append(ruta)
        print('RETRATO', nombre, flush=True)
    print('LISTO', flush=True)


principal()
