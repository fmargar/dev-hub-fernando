"""El panel de salidas: el vestíbulo de una terminal al atardecer, con un panel de paletas colgado del techo, el
reloj de estación y una máquina que imprime la tarjeta de embarque. Aparte, la cabina del avión: el respaldo de
delante con su pantalla (donde va la demo) y la ventanilla con el sol bajo.

  pesado.sh --cola gpu salidas-e1 -- <python con bpy> escena.py <carpeta> [muestras] [vista|vista_cabina]

Las paletas no están en Blender: las pone la web (letras de verdad, que giran). Aquí se hornea la luz que les llega
en un plano a su altura (`tablero_luz`, con coordenadas 0–1 exactas) y la web la lee por su posición.
Texturas: sala, tablero, quiosco, tablero_luz, cabina y, de estudio, tarjeta.
"""
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '../../../kit-e1/herramientas'))
import kit as K  # noqa: E402
import bpy  # noqa: E402

DESTINO, MUESTRAS, RESTO = K.argumentos()
R = K.R

# ── Medidas (1 = 10 cm). La pared del fondo está en y = 6 ──
PARED_Y = 6.0
PASO_X, PASO_Z = 0.42, 0.78                 # una paleta cada 4,2 cm; una fila cada 7,8 cm
CELDA = (0.38, 0.60)                        # la paleta: 3,8 × 6 cm (dos medias paletas de 3 cm)
COLS, FILAS = 46, 9
MARGEN, CABECERA = 0.6, 0.9
ANCHO_IN = COLS * PASO_X
TAB = {'x': 0.0, 'z': 14.0, 'y': 4.6, 'ancho': ANCHO_IN + 2 * MARGEN, 'alto': 8.6, 'fondo': 0.9}
X0 = TAB['x'] - ANCHO_IN / 2                # borde izquierdo de la primera paleta
Z_FILAS = TAB['z'] + TAB['alto'] / 2 - 0.3 - CABECERA   # arriba de la primera fila
Y_PALETAS = TAB['y'] - 0.08                  # el plano de las paletas, delante del fondo negro
LUZ = {'x0': X0 - 0.2, 'x1': X0 + ANCHO_IN + 0.2, 'z0': Z_FILAS - FILAS * PASO_Z - 0.2, 'z1': Z_FILAS + CABECERA + 0.1}
QUIOSCO = {'x': 15.2, 'y': 2.0, 'ancho': 3.4, 'fondo': 2.0, 'alto': 12.0, 'ranura_z': 7.3}
RELOJ = {'x': TAB['x'] + TAB['ancho'] / 2 - 2.2, 'y': TAB['y'] + 0.2, 'z': 20.4, 'r': 1.3}   # colgado encima del panel, a la derecha del cartel
TARJETA = {'ancho': 1.45, 'alto': 0.8, 'colilla': 0.55, 'grueso': 0.006}    # 20 × 8 cm, de cartulina, con su colilla
CAB = {'x': 100.0, 'y': 0.0}                 # la cabina, lejos del vestíbulo
PANTALLA = {'x': CAB['x'], 'y': CAB['y'] - 0.66, 'z': 9.35, 'ancho': 3.2, 'alto': 2.0}
PARED_CAB = CAB['x'] - 3.1                 # vamos en ventanilla: el fuselaje a la izquierda
VENTANA = {'x': PARED_CAB + 0.25, 'y': CAB['y'] - 4.3, 'z': 10.6, 'ancho': 2.3, 'alto': 3.3}


def sala(m):
    K.bloque('pared', (90, 0.4, 34), (0, PARED_Y + 0.2, 17), m['hormigon'], bisel=0)
    K.bloque('suelo', (90, 40, 0.2), (0, -14, -0.1), m['terrazo'], bisel=0)
    K.bloque('techo', (90, 40, 0.4), (0, -14, 30.2), m['techo'], bisel=0)
    # un zócalo de piedra y una banda de hormigón más oscura a la altura del panel: dan escala sin estorbar al texto
    K.bloque('pared_zocalo', (90, 0.3, 1.2), (0, PARED_Y - 0.15, 0.6), m['piedra'], bisel=0.01)
    for i, x in enumerate((-24.0, 24.0)):
        K.bloque(f'pared_pilar_{i}', (2.4, 1.0, 30), (x, PARED_Y - 0.5, 15), m['hormigon2'], bisel=0.02)
    # hormigón visto: juntas de encofrado cada 1,2 m × 0,6 m (dan escala y textura sin ruido)
    for k in range(1, 6):
        K.bloque(f'pared_junta_h{k}', (90, 0.06, 0.05), (0, PARED_Y - 0.01, k * 6.0), m['junta'], bisel=0)
    for k in range(-4, 4):
        K.bloque(f'pared_junta_v{k}', (0.05, 0.06, 34), (k * 12.0 + 6.0, PARED_Y - 0.01, 17), m['junta'], bisel=0)
    # el ventanal de la izquierda (fuera de cuadro): sus montantes dibujan franjas de sol en la pared y el panel
    xv = -34.0
    K.bloque('ventanal_bajo', (0.6, 46, 2.0), (xv, -17, 1.0), m['hormigon2'], bisel=0)
    K.bloque('ventanal_alto', (0.6, 46, 6.0), (xv, -17, 27.0), m['hormigon2'], bisel=0)
    K.bloque('ventanal_dintel', (0.6, 46, 0.5), (xv, -17, 13.0), m['hormigon2'], bisel=0)
    for k in range(19):
        K.bloque(f'ventanal_montante_{k}', (0.6, 0.35, 24), (xv, 6.0 - k * 2.4, 12.0), m['hormigon2'], bisel=0)


def tablero(m):
    t = TAB; x, z, y = t['x'], t['z'], t['y']; w, h, f = t['ancho'], t['alto'], t['fondo']
    # la caja: chapa grafito con un marco que sobresale y un fondo negro mate donde van las paletas
    K.bloque('tablero_caja', (w, f, h), (x, y + f / 2, z), m['grafito'], bisel=0.04)
    K.bloque('tablero_fondo', (w - 0.5, 0.02, h - 0.5), (x, y - 0.005, z), m['negro'], bisel=0)
    for k, (tam, pos) in enumerate([((w, 0.22, 0.25), (x, y - 0.11, z + h / 2 - 0.125)), ((w, 0.22, 0.25), (x, y - 0.11, z - h / 2 + 0.125)),
                                     ((0.25, 0.22, h), (x - w / 2 + 0.125, y - 0.11, z)), ((0.25, 0.22, h), (x + w / 2 - 0.125, y - 0.11, z))]):
        K.bloque(f'tablero_marco_{k}', tam, pos, m['grafito2'], bisel=0.03)
    # los carriles entre filas, finos, por delante de las paletas
    for r in range(FILAS + 1):
        zr = Z_FILAS - r * PASO_Z
        K.bloque(f'tablero_riel_{r}', (ANCHO_IN + 0.3, 0.05, 0.05), (x, Y_PALETAS - 0.05, zr), m['acero'], bisel=0.008)
    # el plano que recibe la luz de las paletas (no se ve en la web: solo da la luz)
    K.lamina('tablero_luz', [(LUZ['x0'], Y_PALETAS, LUZ['z0']), (LUZ['x1'], Y_PALETAS, LUZ['z0']),
                             (LUZ['x1'], Y_PALETAS, LUZ['z1']), (LUZ['x0'], Y_PALETAS, LUZ['z1'])], m['blanco'])
    # el rótulo de las columnas, impreso en la web sobre una franja
    zc = Z_FILAS + CABECERA / 2 + 0.05
    K.lamina('tablero_rotulos', [(X0, Y_PALETAS - 0.002, zc - 0.28), (X0 + ANCHO_IN, Y_PALETAS - 0.002, zc - 0.28),
                                 (X0 + ANCHO_IN, Y_PALETAS - 0.002, zc + 0.28), (X0, Y_PALETAS - 0.002, zc + 0.28)], m['blanco'])
    # cuelga de dos varillas; encima, la caja de luz con «Salidas», que alumbra el canto de arriba
    for k, dx in enumerate((-w / 2 + 2.5, w / 2 - 2.5)):
        K.cilindro(f'tablero_varilla_{k}', 0.06, 30 - (z + h / 2), (x + dx, y + f / 2, (30 + z + h / 2) / 2), m['acero'], eje='Z')
    zl = z + h / 2 + 1.35
    K.bloque('cartel_caja', (9.0, 0.8, 1.9), (x - w / 2 + 4.5, y + 0.4, zl), m['grafito'], bisel=0.03)
    K.lamina('cartel_cara', [(x - w / 2 + 0.15, y - 0.012, zl - 0.8), (x - w / 2 + 8.85, y - 0.012, zl - 0.8),
                             (x - w / 2 + 8.85, y - 0.012, zl + 0.8), (x - w / 2 + 0.15, y - 0.012, zl + 0.8)], m['cartel'])
    for k, dx in enumerate((1.5, 7.5)):
        K.cilindro(f'cartel_varilla_{k}', 0.05, 30 - zl - 0.95, (x - w / 2 + dx, y + 0.4, (30 + zl + 0.95) / 2), m['acero'], eje='Z')


def reloj(m):
    c = RELOJ; x, y, z, r = c['x'], c['y'], c['z'], c['r']
    K.cilindro('reloj_caja', r + 0.12, 0.45, (x, y - 0.1, z), m['grafito'], eje='Y', lados=96, bisel=0.05)
    K.anillo('reloj_cara', 0.0, r, (x, y - 0.33, z), m['esfera'], lados=96)
    K.toro('reloj_aro', r + 0.02, 0.07, (x, y - 0.34, z), m['acero'])
    for nombre, largo, ancho, dy in (('horas', r * 0.6, 0.11, -0.36), ('minutos', r * 0.88, 0.08, -0.38), ('segundos', r * 0.9, 0.025, -0.40)):
        eje = K.vacio(f'reloj_eje_{nombre}', (x, y + dy, z))
        K.bloque(f'reloj_{nombre}', (ancho, 0.012, largo), (0, 0, largo / 2 - 0.18), m['rojo' if nombre == 'segundos' else 'negro'], eje, bisel=0.003)
    K.cilindro('reloj_centro', 0.07, 0.03, (x, y - 0.415, z), m['rojo'], eje='Y')
    K.cilindro('reloj_varilla', 0.05, 30 - z - r, (x, y - 0.1, (30 + z + r) / 2), m['acero'], eje='Z')


def quiosco(m):
    q = QUIOSCO; x, y, w, f, h = q['x'], q['y'], q['ancho'], q['fondo'], q['alto']
    K.bloque('quiosco_cuerpo', (w, f, h), (x, y + f / 2, h / 2), m['carcasa'], bisel=0.12)
    K.bloque('quiosco_franja', (w + 0.02, f + 0.02, 0.7), (x, y + f / 2, h - 0.9), m['ambar'], bisel=0.04)
    # la pantalla, inclinada hacia quien llega, y la boca de la impresora debajo
    K.bloque('quiosco_marco', (2.9, 0.16, 2.3), (x, y - 0.06, 9.6), m['negro'], bisel=0.05)
    K.lamina('quiosco_pantalla', [(x - 1.3, y - 0.15, 8.6), (x + 1.3, y - 0.15, 8.6), (x + 1.3, y - 0.15, 10.6), (x - 1.3, y - 0.15, 10.6)], m['pantalla'])
    zr = q['ranura_z']
    K.bloque('quiosco_boca', (2.0, 0.5, 0.55), (x, y - 0.2, zr), m['grafito'], bisel=0.06)
    K.bloque('quiosco_ranura', (1.0, 0.08, 0.05), (x, y - 0.44, zr), m['negro'], bisel=0.01)
    K.bloque('quiosco_lector', (1.4, 0.14, 0.7), (x, y - 0.06, 5.6), m['negro'], bisel=0.04)
    K.bloque('quiosco_luz_lector', (1.0, 0.02, 0.04), (x, y - 0.135, 5.85), m['led'], bisel=0)
    K.bloque('quiosco_pie', (w + 0.4, f + 0.4, 0.2), (x, y + f / 2, 0.1), m['grafito'], bisel=0.04)


def cabina(m):
    cx, cy = CAB['x'], CAB['y']
    K.bloque('cabina_suelo', (30, 30, 0.2), (cx, cy - 6, -0.1), m['moqueta'], bisel=0)
    K.bloque('cabina_techo', (30, 30, 0.4), (cx, cy - 6, 19.5), m['panel'], bisel=0)
    K.bloque('cabina_pared', (0.4, 30, 20), (PARED_CAB - 0.2, cy - 6, 10), m['panel'], bisel=0)
    for k, y in enumerate((cy - 9.5, cy + 3.6)):                       # las otras ventanillas, con la persiana bajada
        K.bloque(f'cabina_marco_{k}', (0.3, 3.0, 4.0), (PARED_CAB + 0.13, y, 10.6), m['panel2'], bisel=0.55, segmentos=8)
        K.bloque(f'cabina_cortina_{k}', (0.05, 2.3, 3.3), (PARED_CAB + 0.04, y, 10.6), m['panel'], bisel=0.3, segmentos=6)
    for k in range(6):                                                   # la fila de luces del techo
        K.bloque(f'cabina_luz_{k}', (0.5, 2.2, 0.06), (cx + 1.0, cy - 14 + k * 4.4, 19.28), m['luzcab'], bisel=0)
    # la ventanilla: un marco de esquinas muy redondas, el cielo (impreso en la web, sale solo) y la persiana subida
    v = VENTANA
    K.bloque('cabina_marco', (0.3, v['ancho'] + 0.7, v['alto'] + 0.7), (v['x'] - 0.12, v['y'], v['z']), m['panel2'], bisel=0.55, segmentos=8)
    K.bloque('cabina_hueco', (0.2, v['ancho'] + 0.1, v['alto'] + 0.1), (v['x'] - 0.06, v['y'], v['z']), m['negro'], bisel=0.5, segmentos=8)
    K.lamina('cabina_ventana', [(v['x'] + 0.04, v['y'] - v['ancho'] / 2, v['z'] - v['alto'] / 2), (v['x'] + 0.04, v['y'] + v['ancho'] / 2, v['z'] - v['alto'] / 2),
                                (v['x'] + 0.04, v['y'] + v['ancho'] / 2, v['z'] + v['alto'] / 2), (v['x'] + 0.04, v['y'] - v['ancho'] / 2, v['z'] + v['alto'] / 2)], m['cielo'])
    K.bloque('cabina_persiana', (0.08, v['ancho'] + 0.1, 0.35), (v['x'] + 0.1, v['y'], v['z'] + v['alto'] / 2 + 0.05), m['panel'], bisel=0.03)
    # tres respaldos: el de delante (con la pantalla de la demo) y medio de cada vecino
    for k, dx in enumerate((0.0, 4.9)):
        n = f'cabina_asiento_{k}'
        K.bloque(n, (4.5, 1.3, 7.4), (cx + dx, cy, 4.5 + 3.7), m['tela'], bisel=0.45, segmentos=5)
        K.bloque(n + '_funda', (3.0, 0.06, 0.9), (cx + dx, cy - 0.66, 11.3), m['funda'], bisel=0.02)
        K.bloque(n + '_bandeja', (3.6, 0.1, 2.4), (cx + dx, cy - 0.67, 6.4), m['plastico'], bisel=0.06)
        K.bloque(n + '_pestillo', (0.5, 0.12, 0.16), (cx + dx, cy - 0.74, 7.75), m['acero'], bisel=0.02)
        K.bloque(n + '_marco', (PANTALLA['ancho'] + 0.3, 0.12, PANTALLA['alto'] + 0.3), (cx + dx, cy - 0.66, PANTALLA['z']), m['negro'], bisel=0.06)
        K.bloque(n + '_pantalla', (PANTALLA['ancho'], 0.02, PANTALLA['alto']), (cx + dx, cy - 0.73, PANTALLA['z']), m['cristal'], bisel=0)
        K.bloque(n + '_brazo', (0.6, 3.2, 0.5), (cx + dx + 2.45, cy - 2.2, 6.2), m['plastico'], bisel=0.12)
    K.bloque('cabina_mi_asiento', (4.5, 1.3, 7.4), (cx, cy - 9.6, 8.2), m['tela'], bisel=0.45, segmentos=5)


def escena():
    K.limpiar()
    m = {
        'hormigon': K.yeso('hormigon', '#9a958e'), 'hormigon2': K.yeso('hormigon2', '#7a736b'), 'piedra': K.material('piedra', '#4a4541', 0.6),
        'terrazo': K.material('terrazo', '#b9b2a6', 0.35), 'techo': K.material('techo', '#3c3a38', 0.9),
        'grafito': K.material('grafito', '#262628', 0.45), 'grafito2': K.material('grafito2', '#323236', 0.35),
        'negro': K.material('negro', '#0d0d0e', 0.7), 'blanco': K.material('blanco', '#ffffff', 0.6), 'acero': K.material('acero', '#9a9ca0', 0.3, 1.0),
        'esfera': K.material('esfera', '#f4f1ea', 0.5), 'rojo': K.material('rojo', '#c8452f', 0.4),
        'carcasa': K.material('carcasa', '#d8d4cc', 0.35, 0, 0.3), 'ambar': K.material('ambar', '#F7B500', 0.4),
        'led': K.material('led', '#ffffff', 0.5, emision='#7fd1ff', fuerza=6),
        'cartel': K.material('cartel', '#ffffff', 0.5, emision='#ffd48a', fuerza=9),
        'pantalla': K.material('pantalla', '#ffffff', 0.5, emision='#cfe3ff', fuerza=3),
        'moqueta': K.material('moqueta', '#2b2f3a', 0.95), 'panel': K.material('panel', '#e6e0d4', 0.5), 'panel2': K.material('panel2', '#d9d2c4', 0.45),
        'cielo': K.material('cielo', '#ffffff', 0.5, emision='#ffb070', fuerza=5),
        'tela': K.material('tela', '#2a3448', 0.92), 'funda': K.material('funda', '#ece6da', 0.85), 'plastico': K.material('plastico', '#3a3d45', 0.45),
        'cristal': K.material('cristal', '#0c0d10', 0.15), 'junta': K.material('junta', '#5d5853', 0.8),
        'luzcab': K.material('luzcab', '#ffffff', 0.5, emision='#fff1dc', fuerza=6),
    }
    sala(m); tablero(m); reloj(m); quiosco(m); cabina(m)
    # el vestíbulo al atardecer: el sol bajo entra por un ventanal fuera de cuadro a la izquierda y raspa la pared;
    # el techo da un relleno frío y dos bañadores de pared iluminan el panel desde arriba
    sol = bpy.data.lights.new('sol', 'SUN'); sol.energy = 5.5; sol.angle = K.R(1.2); sol.color = (1.0, 0.66, 0.40)
    o = bpy.data.objects.new('sol', sol); bpy.context.scene.collection.objects.link(o)
    o.rotation_euler = (K.Vector((1.0, 0.5, -0.30))).to_track_quat('-Z', 'Y').to_euler()
    K.area('techo_luz', (0.0, -8.0, 29.0), (0.0, -8.0, 0.0), 8500, (0.72, 0.82, 1.0), 30.0, 12.0)
    for k, dx in enumerate((-6.0, 6.0)):
        K.foco(f'bañador_{k}', (dx, -3.0, 28.0), (dx * 0.8, PARED_Y, 13.0), 7000, (0.86, 0.9, 1.0), 50, 0.8, 0.6)
    # la cabina: el sol por la ventanilla, una luz de lectura y un relleno suave
    # el sol entra solo por la ventanilla (área justo fuera, pegada al cristal) y raspa el respaldo de delante
    K.area('cabina_sol', (VENTANA['x'] - 0.9, VENTANA['y'] - 0.6, VENTANA['z'] + 0.6), (CAB['x'] + 1.0, CAB['y'], 8.0), 2600, (1.0, 0.58, 0.32), 2.2, 3.0)
    K.foco('cabina_lectura', (CAB['x'] + 1.2, CAB['y'] - 7.0, 19.0), (CAB['x'], CAB['y'], 8.5), 2600, (1.0, 0.9, 0.78), 42, 0.9, 0.3)
    K.area('cabina_relleno', (CAB['x'] + 2.0, CAB['y'] - 9.0, 17.0), (CAB['x'], CAB['y'], 8.0), 2600, (0.72, 0.8, 1.0), 10.0)
    K.mundo('#2a2a30', 0.12)


def tarjeta():
    """La tarjeta de embarque, apaisada como las de verdad (de pie, cara hacia -Y), con la colilla a la derecha: se
    arranca por el troquel (el pivote `colilla`, en la línea de puntos)."""
    t = TARJETA; w, h, c, g = t['ancho'], t['alto'], t['colilla'], t['grueso']
    m = {k: K.material(k, '#ffffff', 0.6) for k in ('tarjeta_cara', 'tarjeta_dorso', 'colilla_cara', 'colilla_dorso')}
    m['carton'] = K.material('carton', '#f2ede2', 0.7)
    x0 = -(w + c) / 2                      # el borde izquierdo; el centro de todo queda en el origen
    raiz = K.vacio('tarjeta', (0, -40, 6))
    yf, yd = -g / 2 - 0.0008, g / 2 + 0.0008
    K.bloque('tarjeta_cuerpo', (w, g, h), (x0 + w / 2, 0, 0), m['carton'], raiz, bisel=0.0015, segmentos=2)
    K.lamina('tarjeta_cara', [(x0, yf, -h / 2), (x0 + w, yf, -h / 2), (x0 + w, yf, h / 2), (x0, yf, h / 2)], m['tarjeta_cara'], raiz)
    K.lamina('tarjeta_dorso', [(x0 + w, yd, -h / 2), (x0, yd, -h / 2), (x0, yd, h / 2), (x0 + w, yd, h / 2)], m['tarjeta_dorso'], raiz)
    col = K.vacio('colilla', (x0 + w, 0, 0), raiz)
    K.bloque('colilla_cuerpo', (c - 0.004, g, h), (c / 2 + 0.002, 0, 0), m['carton'], col, bisel=0.0015, segmentos=2)
    K.lamina('colilla_cara', [(0.004, yf, -h / 2), (c, yf, -h / 2), (c, yf, h / 2), (0.004, yf, h / 2)], m['colilla_cara'], col)
    K.lamina('colilla_dorso', [(c, yd, -h / 2), (0.004, yd, -h / 2), (0.004, yd, h / 2), (c, yd, h / 2)], m['colilla_dorso'], col)
    return raiz


def vista(cual):
    escena(); tarjeta()
    K.ajustes(1440, 900, MUESTRAS)
    if cual == 'vista_cabina':
        K.camara((CAB['x'] + 0.6, CAB['y'] - 8.2, 10.6), (CAB['x'] - 0.6, CAB['y'], 9.4), 30)
    else:
        K.camara((2.0, -46.0, 11.5), (2.0, PARED_Y, 12.0), 38)
    bpy.context.scene.render.filepath = os.path.join(DESTINO, cual + '.png')
    bpy.ops.render.render(write_still=True)


def principal():
    vis = [r for r in RESTO if r.startswith('vista')]
    if vis:
        return vista(vis[0])
    escena()
    raiz = tarjeta()
    K.preparar()
    K.ajustes(64, 64, MUESTRAS)
    horno = K.Horno(DESTINO)
    todo = K.mallas()
    pre = lambda *p: [o for o in todo if o.name.startswith(p)]  # noqa: E731
    g = {
        'sala': pre('pared', 'suelo', 'techo'), 'tablero': [o for o in pre('tablero_', 'cartel_') if o.name not in ('tablero_luz',)],
        'quiosco': pre('quiosco_', 'reloj_'), 'cabina': pre('cabina_'), 'tarjeta': K.mallas(raiz),
        'luz': [bpy.data.objects['tablero_luz']],
    }
    for clave, objs in g.items():
        if clave != 'luz':          # el plano de la luz conserva sus coordenadas 0–1: la web las calcula igual
            K.desplegar(objs, 0.004 if clave in ('tarjeta', 'quiosco') else 0.006)
    for o in g['tarjeta']:
        o.hide_render = True
    horno.hornear(g['sala'], 'sala', 2048, color=True, publicar=1024)
    horno.hornear(g['tablero'], 'tablero', 2048, color=True, publicar=1024)
    horno.hornear(g['quiosco'], 'quiosco', 2048, color=True, publicar=1024)
    horno.hornear(g['luz'], 'tablero_luz', 1024, color=True, publicar=512)
    horno.hornear(g['cabina'], 'cabina', 2048, color=True, publicar=1024)
    for o in bpy.context.scene.objects:
        if o.type in ('MESH', 'LIGHT'):
            o.hide_render = o not in g['tarjeta']
    bpy.context.scene.world = K.mundo_estudio()
    horno.hornear(g['tarjeta'], 'tarjeta', 1024, color=True)
    for o in bpy.context.scene.objects:
        o.hide_render = False
    # la tarjeta se exporta dentro de la impresora (de pie, la web la coloca)
    raiz.location = (QUIOSCO['x'], QUIOSCO['y'] + 0.6, QUIOSCO['ranura_z'])
    bpy.ops.wm.save_as_mainfile(filepath=os.path.join(DESTINO, 'horneado.blend'))
    horno.exportar({
        'tablero': {**TAB, 'x0': X0, 'z_filas': Z_FILAS, 'y_paletas': Y_PALETAS, 'paso_x': PASO_X, 'paso_z': PASO_Z, 'celda': CELDA,
                    'cols': COLS, 'filas': FILAS, 'cabecera': CABECERA, 'luz': LUZ},
        'quiosco': QUIOSCO, 'reloj': RELOJ, 'tarjeta': TARJETA, 'cabina': CAB, 'pantalla': PANTALLA, 'ventana': VENTANA, 'pared_y': PARED_Y,
    })


principal()
