"""Las carátulas de la colección: un bodegón de juguete por proyecto, en el mismo lenguaje que el diorama de
Adivinadle (muñecos y piezas de primitivas, foco cenital, un contraluz de color y el fondo del color del lomo).

  pesado.sh --cola gpu portadas -- <python con bpy> portadas.py <carpeta> [muestras] [id …]

Sale `<id>.png` (864 × 1216, la proporción de la carátula). El tercio de arriba queda tranquilo: ahí va el título.
Nada de imágenes generadas: todo es editable aquí.
"""
import math
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import kit as K  # noqa: E402
import bpy  # noqa: E402

DESTINO, MUESTRAS, IDS = K.argumentos()
os.makedirs(DESTINO, exist_ok=True)
R = K.R
M = K.material
PIEL = '#f2c9a0'


def escenario(fondo, suelo, contraluz, rayas=None):
    """Pared y suelo del color del proyecto, foco cenital, relleno frío y un contraluz de color."""
    K.limpiar()
    K.ajustes(864, 1216, MUESTRAS)
    K.bloque('fondo', (14, 0.2, 9), (0, 1.4, 3.0), M('fondo', fondo, 0.75), bisel=0)
    K.bloque('suelo', (14, 7, 0.2), (0, -1.6, -0.1), M('suelo', suelo, 0.8), bisel=0)
    if rayas:
        for k in range(10):
            K.bloque(f'raya{k}', (14, 0.03, 0.014), (0, 1.29, 0.3 + k * 0.24), M(f'raya{k}', rayas, 0.6), bisel=0)
    K.foco('foco', (0, -2.6, 5.2), (0, 0.2, 0.6), 3000, (1.0, 0.9, 0.76), 60, 0.6, 0.3)
    K.area('relleno', (-4, -5, 2.5), (0, 0, 1), 420, (0.75, 0.8, 1.0), 4)
    K.area('contraluz', (0.6, 0.9, 1.8), (0.2, -0.4, 0.8), 1500, contraluz, 0.8)
    K.mundo('#000000', 0.05)
    K.camara((0.0, -7.0, 1.6), (0.0, 0, 1.25), 40)
    cam = bpy.context.scene.camera; cam.data.sensor_fit = 'VERTICAL'; cam.data.sensor_height = 36


def hoja(nombre, tam, pos, giro=(0, 0, 0), lineas=6, color='#f4efe4', tinta='#2b2b2b'):
    """Una hoja de papel con renglones de «texto» en relieve (barras finas)."""
    raiz = K.vacio(nombre, pos, giro=giro)
    K.bloque(nombre + '_papel', tam, (0, 0, 0), M(nombre + '_p', color, 0.85), raiz, 0.004)
    for k in range(lineas):
        largo = tam[0] * (0.78 if k % 3 == 2 else 0.88)
        K.bloque(f'{nombre}_l{k}', (largo, tam[1] + 0.004, 0.022), (-(tam[0] - largo) / 2 + 0.04, 0, tam[2] / 2 - 0.12 - k * 0.075), M(nombre + '_t', tinta, 0.6), raiz, 0)
    return raiz


def reloj(nombre, r, pos, color, aguja='#1b1b1b', giro=0.0):
    """Despertador de juguete: caja redonda, esfera clara, dos agujas y dos campanas."""
    x, y, z = pos
    K.cilindro(nombre, r, r * 0.5, (x, y, z), M(nombre + '_c', color, 0.35), bisel=r * 0.08)
    K.cilindro(nombre + '_esfera', r * 0.82, 0.01, (x, y - r * 0.25 - 0.004, z), M(nombre + '_e', '#f6f2e8', 0.5))
    for k, (largo, ang) in enumerate(((0.55, 30 + giro), (0.75, 150 + giro * 3))):
        piv = K.vacio(f'{nombre}_eje{k}', (x, y - r * 0.25 - 0.012, z), giro=(0, R(ang), 0))
        K.bloque(f'{nombre}_ag{k}', (r * 0.07, 0.01, r * largo * 0.8), (0, 0, r * largo * 0.4), M(nombre + '_a', aguja, 0.4), piv, 0)
    for dx in (-0.55, 0.55):
        K.esfera(f'{nombre}_cam{dx:+.1f}', r * 0.28, (x + dx * r, y, z + r * 0.92), M(nombre + '_cm', '#d9b25a', 0.3), escala=(1, 1, 0.7))
    for dx in (-0.6, 0.6):
        K.cilindro(f'{nombre}_pata{dx:+.1f}', r * 0.07, r * 0.3, (x + dx * r, y, z - r * 0.95), M(nombre + '_c', color, 0.35), eje='Z')


def wardux():
    escenario('#5a2016', '#2a0f0a', (1.0, 0.55, 0.3), '#7a3424')
    # dos robots: uno escribe en un portátil, el otro revisa el periódico con una lupa roja
    K.figura('escribe', (-1.25, -0.2, 0), '#8f97a3', '#d8dde8', ('antena', '#ffb000'))
    K.bloque('portatil_base', (0.8, 0.55, 0.05), (-1.25, -0.75, 0.33), M('alu', '#c9ccd2', 0.3), bisel=0.01)
    K.bloque('portatil_pata', (0.18, 0.18, 0.3), (-1.25, -0.72, 0.15), M('alu2', '#3a3b40', 0.4), bisel=0.01)
    pant = K.vacio('pantalla', (-1.25, -0.5, 0.36), giro=(R(-12), 0, 0))
    K.bloque('portatil_tapa', (0.8, 0.04, 0.52), (0, 0, 0.26), M('alu', '#c9ccd2', 0.3), pant, 0.01)
    K.bloque('portatil_luz', (0.72, 0.01, 0.44), (0, -0.025, 0.26), M('brillo', '#f6e7cf', 0.4, emision='#f6e7cf', fuerza=2.5), pant, 0)
    K.figura('revisa', (1.25, -0.2, 0), '#b8673a', '#e8d8c8', ('antena', '#7cff9b'))
    hoja('periodico', (0.9, 0.03, 1.15), (1.1, -0.75, 0.62), (R(-8), R(-10), R(18)), 8)
    K.toro('lupa', 0.2, 0.03, (0.85, -1.0, 0.95), M('rojo', '#e04a3a', 0.3))
    K.cilindro('lupa_mango', 0.035, 0.42, (0.72, -1.0, 0.62), M('rojo', '#e04a3a', 0.3), eje='Z')
    # en medio, la pila de periódicos con una tarjeta gráfica encima
    for k in range(4):
        hoja(f'pila{k}', (0.95, 0.7, 0.05), (0.0, -0.4, 0.03 + k * 0.055), (0, 0, R(k * 7 - 9)), 0, '#ede6d6')
    K.bloque('grafica', (0.82, 0.5, 0.1), (0.0, -0.4, 0.3), M('grafica', '#1d1e22', 0.4), bisel=0.02)
    for dx in (-0.2, 0.2):
        K.cilindro(f'ventilador{dx:+.1f}', 0.17, 0.02, (dx, -0.4, 0.36), M('vent', '#3a3c44', 0.35), eje='Z', bisel=0.005)


def calculo():
    escenario('#103e2c', '#0a2219', (0.95, 0.85, 0.45), '#1d5a40')
    # una calculadora grande, inclinada como en un atril, y montones de monedas
    c = K.vacio('calc', (-0.35, -0.2, 0.0), giro=(R(-22), 0, R(8)))
    K.bloque('calc_cuerpo', (1.3, 0.22, 1.9), (0, 0, 0.95), M('calc', '#e9d9a6', 0.45), c, 0.06)
    K.bloque('calc_visor', (1.05, 0.04, 0.38), (0, -0.115, 1.6), M('visor', '#1f2b22', 0.3), c, 0.02)
    K.bloque('calc_cifras', (0.8, 0.01, 0.14), (0.08, -0.14, 1.6), M('cifras', '#b9f5c9', 0.4, emision='#9ff2b6', fuerza=1.4), c, 0)
    for f in range(4):
        for k in range(4):
            col = '#c8452f' if (f, k) == (3, 3) else ('#17583f' if k == 3 else '#2c2a26')
            K.bloque(f'tecla{f}{k}', (0.22, 0.08, 0.2), (-0.42 + k * 0.28, -0.13, 1.15 - f * 0.28), M(f'tecla{col}', col, 0.4), c, 0.03)
    oro = M('oro', '#e2b44a', 0.25)
    for j, (x, y, n) in enumerate(((0.95, -0.7, 9), (1.35, -0.3, 13), (0.7, -1.2, 5))):
        for k in range(n):
            K.cilindro(f'moneda{j}_{k}', 0.2, 0.045, (x + 0.012 * math.sin(k * 1.7), y, 0.025 + k * 0.048), oro, eje='Z', bisel=0.008)
    hoja('nomina', (0.8, 0.02, 1.0), (-1.45, -0.6, 0.5), (R(-10), 0, R(-16)), 7)


def agentes():
    escenario('#2d1c4a', '#160d26', (0.75, 0.55, 1.0), '#43306a')
    # tres agentes, tres bandejas: hacer, revisar, terminar; los papeles pasan de una a otra
    tabla = M('tabla', '#d9c9f2', 0.5)
    K.bloque('mesa', (3.6, 1.0, 0.08), (0, -0.55, 0.42), M('mesa', '#5c4290', 0.5), bisel=0.02)
    for x in (-1.6, 1.6):
        K.bloque(f'mesa_pata{x:+.0f}', (0.08, 0.8, 0.42), (x, -0.55, 0.21), M('mesa', '#5c4290', 0.5), bisel=0.01)
    for i, (x, gorro, color) in enumerate(((-1.15, ('gorra', '#f2c230'), '#ebddfb'), (0.0, ('casco', '#c9ccd6'), '#9a7bd6'), (1.15, ('antena', '#7cff9b'), '#5f3fa0'))):
        K.figura(f'agente{i}', (x, 0.0, 0.46), color, '#e9e4f2' if i == 2 else PIEL, gorro, 0.85)
        K.bloque(f'bandeja{i}', (0.8, 0.55, 0.04), (x, -0.75, 0.48), tabla, bisel=0.01)
        for lado, (dx, dy) in enumerate(((0, 0.27), (0, -0.27))):
            K.bloque(f'bandeja{i}_b{lado}', (0.8, 0.03, 0.1), (x + dx, -0.75 + dy, 0.53), tabla, bisel=0.008)
        for k in range(3 - i if i < 2 else 5):
            K.bloque(f'papel{i}_{k}', (0.62, 0.45, 0.012), (x, -0.75, 0.51 + k * 0.016), M('papel', '#f4efe4', 0.8), bisel=0)
    # un papel en el aire, de una bandeja a la siguiente
    hoja('vuela', (0.5, 0.012, 0.36), (-0.58, -0.8, 1.05), (R(60), R(18), R(-10)), 3)


def erp():
    escenario('#0e3c3f', '#082224', (0.6, 1.0, 0.92), '#1b5a5e')
    carton = M('carton', '#c99a62', 0.75)
    for i, (x, y, z, w, h, g) in enumerate(((-1.35, -0.1, 0, 0.9, 0.7, 4), (-1.3, -0.15, 0.7, 0.75, 0.55, -6), (1.4, 0.1, 0, 0.8, 0.9, -3))):
        b = K.vacio(f'caja{i}', (x, y, z + h / 2), giro=(0, 0, R(g)))
        K.bloque(f'caja{i}_c', (w, w * 0.8, h), (0, 0, 0), carton, b, 0.015)
        K.bloque(f'caja{i}_cinta', (w + 0.005, 0.12, h + 0.005), (0, 0, 0), M('cinta', '#a87a48', 0.6), b, 0)
        K.bloque(f'caja{i}_etiqueta', (0.32, 0.01, 0.22), (0.12, -w * 0.4 - 0.006, -0.05), M('etiqueta', '#f4efe4', 0.7), b, 0)
    # la ficha que propone la IA, sobre la mesa, y el sello que pone la persona
    hoja('ficha', (1.0, 0.7, 0.02), (0.05, -0.75, 0.01), (0, 0, R(-6)), 0)
    for k in range(5):
        K.bloque(f'ficha_l{k}', (0.7 if k % 2 else 0.8, 0.05, 0.006), (0.0 + 0.04 * (k % 2), -0.55 - k * 0.09, 0.025), M('tinta', '#2b2b2b', 0.6), bisel=0)
    K.toro('marca', 0.14, 0.018, (0.28, -0.98, 0.03), M('marca', '#d23a2a', 0.5), eje='Z')
    s = K.vacio('sello', (0.35, -0.9, 0.55), giro=(R(8), R(-12), 0))
    K.bloque('sello_base', (0.42, 0.3, 0.12), (0, 0, 0), M('sello_b', '#2a2a2e', 0.4), s, 0.02)
    K.bloque('sello_goma', (0.38, 0.26, 0.03), (0, 0, -0.075), M('goma', '#d23a2a', 0.6), s, 0.008)
    K.cilindro('sello_cuello', 0.06, 0.25, (0, 0, 0.18), M('madera', '#7a4f30', 0.5), s, eje='Z')
    K.esfera('sello_puno', 0.15, (0, 0, 0.38), M('madera', '#7a4f30', 0.5), s, escala=(1, 1, 0.85))
    K.figura('persona', (0.95, -0.1, 0), '#17656a', PIEL, ('gorra', '#d8f3ef'), 0.9)
    K.figura('ia', (-0.55, 0.25, 0), '#9aa3ad', '#d8dde8', ('antena', '#7cff9b'), 0.8)


def servidor():
    escenario('#10275a', '#081431', (0.55, 0.75, 1.0), '#1a3a7a')
    # el armario del servidor con sus luces y, encima, el único reloj grande; los relojes sueltos, en el suelo
    K.bloque('armario', (1.15, 1.0, 2.0), (0.75, 0.0, 1.0), M('armario', '#1b1d24', 0.4), bisel=0.03)
    for k in range(6):
        z = 0.3 + k * 0.29
        K.bloque(f'unidad{k}', (1.0, 0.02, 0.22), (0.75, -0.505, z), M('unidad', '#2c3040', 0.35), bisel=0.008)
        for j in range(3):
            col = '#7cff9b' if (k + j) % 4 else '#ffb000'
            K.esfera(f'led{k}{j}', 0.022, (0.38 + j * 0.07, -0.52, z), M(f'led{col}', col, 0.3, emision=col, fuerza=6))
        K.bloque(f'rejilla{k}', (0.45, 0.01, 0.1), (0.95, -0.52, z), M('rejilla', '#3d4358', 0.5), bisel=0)
    reloj('grande', 0.42, (0.75, -0.1, 2.48), '#dce6ff')
    for i, (x, y, r, col, g) in enumerate(((-1.6, -0.6, 0.2, '#c8452f', 0), (-1.05, -0.95, 0.17, '#f2c230', 40), (-0.55, -0.5, 0.19, '#5fa0e8', 80),
                                            (-1.35, -0.05, 0.16, '#e9d9a6', 120), (-0.8, 0.05, 0.15, '#9a7bd6', 160), (-1.9, -1.15, 0.16, '#2e8f57', 200),
                                            (-0.25, -1.1, 0.15, '#e2782c', 240))):
        reloj(f'reloj{i}', r, (x, y, r * 1.05), col, giro=g)


def marbella():
    escenario('#7a3414', '#3a1a0a', (1.0, 0.75, 0.45))
    # sol, casitas blancas con teja, una sombrilla y una palmera
    K.esfera('sol', 0.42, (1.15, 0.9, 2.35), M('sol', '#ffd27a', 0.4, emision='#ffcf73', fuerza=3.5))
    blanco = M('cal', '#f6f1e6', 0.8); teja = M('teja', '#b9532a', 0.6); azul = M('ventana', '#2c4f7a', 0.3)
    for i, (x, y, w, h) in enumerate(((-1.4, 0.1, 0.75, 0.8), (-0.62, 0.25, 0.65, 1.1), (0.1, 0.1, 0.7, 0.7), (-1.0, -0.45, 0.6, 0.55))):
        K.bloque(f'casa{i}', (w, 0.6, h), (x, y, h / 2), blanco, bisel=0.02)
        tj = K.cilindro(f'tejado{i}', 0.36, w + 0.06, (x, y, h + 0.1), teja, eje='X', lados=3)
        tj.scale = (1, 1, 0.55)
        K.bloque(f'ventana{i}', (0.16, 0.01, 0.2), (x + 0.1, y - 0.305, h * 0.55), azul, bisel=0)
    K.cilindro('sombrilla_palo', 0.025, 1.3, (1.0, -0.7, 0.65), M('palo', '#e9e2d2', 0.5), eje='Z')
    K.cilindro('sombrilla', 0.75, 0.32, (1.0, -0.7, 1.38), M('lona', '#fff0de', 0.7), eje='Z', r2=0.04, lados=10)
    K.cilindro('sombrilla_franja', 0.76, 0.06, (1.0, -0.7, 1.25), M('franja', '#c5612a', 0.7), eje='Z', r2=0.62, lados=10)
    K.cilindro('palmera', 0.06, 1.9, (1.65, -0.2, 0.95), M('tronco', '#8a5a34', 0.7), eje='Z', r2=0.045)
    for k in range(6):
        h = K.esfera(f'hoja{k}', 0.5, (1.65 + 0.38 * math.cos(k * 1.05), -0.2 + 0.38 * math.sin(k * 1.05), 1.9), M('palma', '#3f7a3c', 0.6), escala=(1, 0.28, 0.08))
        h.rotation_euler = (0, R(-20), k * 1.05)
    K.bloque('arena', (5, 1.6, 0.04), (0.5, -0.95, 0.02), M('arena', '#e8c79a', 0.9), bisel=0)


def vados():
    escenario('#5e4708', '#2b2104', (1.0, 0.85, 0.4), '#7a5f14')
    # una cochera con su puerta enrollable, un coche de juguete y cuatro conos de colores: las cuatro zonas
    K.bloque('cochera', (1.8, 0.6, 1.5), (-0.6, 0.35, 0.75), M('muro', '#e9dfc9', 0.85), bisel=0.02)
    for k in range(9):
        K.bloque(f'lama{k}', (1.3, 0.04, 0.12), (-0.6, 0.03, 0.12 + k * 0.13), M('lama', '#b8901c', 0.45), bisel=0.01)
    K.bloque('placa', (0.4, 0.02, 0.28), (0.45, 0.03, 1.15), M('placa', '#f4efe4', 0.4), bisel=0.01)
    K.bloque('placa_franja', (0.3, 0.025, 0.05), (0.45, 0.02, 1.15), M('franja', '#2a2004', 0.4), bisel=0)
    coche = K.vacio('coche', (0.5, -0.85, 0), giro=(0, 0, R(-24)))
    K.bloque('coche_cuerpo', (1.1, 0.55, 0.28), (0, 0, 0.3), M('coche', '#c8452f', 0.3), coche, 0.08)
    K.bloque('coche_cabina', (0.6, 0.5, 0.25), (-0.05, 0, 0.55), M('coche', '#c8452f', 0.3), coche, 0.08)
    K.bloque('coche_cristal', (0.5, 0.52, 0.17), (-0.05, 0, 0.56), M('cristal', '#2c3a4a', 0.15), coche, 0.05)
    for i, (dx, dy) in enumerate(((-0.35, -0.28), (0.35, -0.28), (-0.35, 0.28), (0.35, 0.28))):
        K.cilindro(f'rueda{i}', 0.13, 0.08, (dx, dy, 0.13), M('rueda', '#141414', 0.6), coche)
    for i, (x, y, col) in enumerate(((-1.7, -0.9, '#e2782c'), (-1.25, -1.25, '#2e8f57'), (1.55, -0.4, '#3f8fd0'), (1.35, -1.25, '#9a7bd6'))):
        K.cono(f'cono{i}', 0.17, 0.5, (x, y, 0.27), M(f'cono{col}', col, 0.4))
        K.bloque(f'cono{i}_base', (0.36, 0.36, 0.04), (x, y, 0.02), M(f'cono{col}', col, 0.4), bisel=0.01)
        K.cilindro(f'cono{i}_banda', 0.105, 0.07, (x, y, 0.34), M('banda', '#f4efe4', 0.4), eje='Z', r2=0.085)


def vision():
    escenario('#4e1432', '#260818', (1.0, 0.55, 0.8), '#6a2448')
    # un ojo de juguete en su trípode mira una pantalla con seis capturas; cada una con su visto bueno
    K.bloque('monitor', (1.7, 0.08, 1.1), (0.55, 0.1, 1.25), M('marco', '#1c1c22', 0.35), bisel=0.03)
    K.bloque('monitor_pie', (0.12, 0.12, 0.65), (0.55, 0.15, 0.36), M('marco', '#1c1c22', 0.35), bisel=0.02)
    K.bloque('monitor_base', (0.6, 0.4, 0.04), (0.55, 0.1, 0.02), M('marco', '#1c1c22', 0.35), bisel=0.01)
    cols = ('#5fa0e8', '#f2c230', '#2e8f57', '#e2782c', '#9a7bd6', '#ffe3f1')
    for i, c in enumerate(cols):
        x = 0.55 - 0.52 + (i % 3) * 0.52; z = 1.47 - (i // 3) * 0.44
        K.bloque(f'captura{i}', (0.44, 0.01, 0.36), (x, 0.055, z), M(f'cap{i}', c, 0.4, emision=c, fuerza=1.2), bisel=0)
        K.bloque(f'captura{i}_barra', (0.44, 0.012, 0.06), (x, 0.052, z + 0.15), M('barra', '#f4efe4', 0.4, emision='#f4efe4', fuerza=1.5), bisel=0)
        K.esfera(f'visto{i}', 0.055, (x + 0.15, 0.045, z - 0.1), M('visto', '#7cff9b', 0.3, emision='#7cff9b', fuerza=3), escala=(1, 0.4, 1))
    for k in range(3):
        a = R(90 + k * 120)
        p = K.cilindro(f'tripode{k}', 0.025, 1.05, (-1.05 + 0.22 * math.cos(a), -0.6 + 0.22 * math.sin(a), 0.48), M('tri', '#2a2a30', 0.4), eje='Z')
        p.rotation_euler = (R(12) * math.sin(a), -R(12) * math.cos(a), 0)
    ojo = K.vacio('ojo', (-1.05, -0.6, 1.25), giro=(0, 0, R(-38)))
    K.esfera('ojo_bola', 0.42, (0, 0, 0), M('ojo', '#f6f2ec', 0.25), ojo)
    K.cilindro('ojo_iris', 0.2, 0.02, (0, -0.405, 0), M('iris', '#94295f', 0.3), ojo)
    K.cilindro('ojo_pupila', 0.1, 0.02, (0, -0.42, 0), M('pupila', '#0a0a0c', 0.1), ojo)
    K.esfera('ojo_brillo', 0.035, (0.07, -0.43, 0.08), M('brillo', '#ffffff', 0.1, emision='#ffffff', fuerza=4), ojo)


TODAS = {'wardux': wardux, 'calculo': calculo, 'agentes': agentes, 'erp': erp, 'servidor': servidor, 'marbella': marbella, 'vados': vados, 'vision': vision}
for clave in (IDS or TODAS):
    TODAS[clave]()
    bpy.context.scene.render.filepath = os.path.join(DESTINO, f'{clave}.png')
    bpy.ops.render.render(write_still=True)
    print('PORTADA', clave, flush=True)
print('LISTO', flush=True)
