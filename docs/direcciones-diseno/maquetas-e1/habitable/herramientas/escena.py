"""La maqueta habitable: una maqueta de arquitecto, en la mesa del estudio, con nueve edificios (uno por proyecto).

  pesado.sh --cola gpu maqueta-e1 -- <python con bpy> escena.py <carpeta> [muestras] [vista|vista_abierta|vista_plaza]

Cartón blanco, balsa y corcho sobre un tablero de contrachapado, con la luz de la tarde entrando por una ventana
fuera de cuadro. Cuatro manzanas de ancho y tres de fondo: nueve parcelas con su edificio, una plaza en el centro
con una pantalla (ahí se ven las demos) y una parcela vacía con su silueta, «aquí va el siguiente».

Cada edificio se monta por partes apiladas (plantas y cubierta), cada parte colgada de un vacío
`ed_<id>_p<k>`: la web las separa en vertical, como una axonometría explotada. La luz de cada edificio se hornea
dos veces, junto (`ed_<id>`) y separado (`ed_<id>_ab`, misma escala): la web mezcla una con otra al abrirlo.
"""
import json
import math
import os
import re
import sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '../../../kit-e1/herramientas'))
import kit as K  # noqa: E402

_bloque = K.bloque


def _bloque_ligero(nombre, tam, pos, mat, padre=None, bisel=0.006, segmentos=3):
    """Biseles a la medida de la pieza: a este tamaño de maqueta, tres segmentos no se distinguen de dos, ni uno de
    ninguno en una silla de 7 cm. Con los tres de siempre, la maqueta tenía 121 000 triángulos, siete veces la
    estantería, y sin gráfica no llegaba a 30 fotogramas por segundo."""
    if max(tam) < 0.1:
        bisel = 0                       # sillas y piezas así: un canto redondo de 4 mm en 7 cm no se ve
    elif max(tam) < 0.35:
        segmentos = 1
    else:
        segmentos = min(segmentos, 2)
    return _bloque(nombre, tam, pos, mat, padre=padre, bisel=bisel, segmentos=segmentos)


K.bloque = _bloque_ligero
import bpy  # noqa: E402
import bmesh  # noqa: E402
from mathutils import Vector  # noqa: E402

DESTINO, MUESTRAS, RESTO = K.argumentos()
R = K.R

# ── Medidas (1 = 10 cm; la maqueta, a escala 1:200). La cara de arriba del tablero está en z = 0 ──
PAR, CALLE, COLS, FILAS = 3.0, 0.6, 4, 3
PASO = PAR + CALLE
BASE = {'ancho': COLS * PASO + CALLE, 'fondo': FILAS * PASO + CALLE, 'grueso': 0.3}
DELTA = 0.95                     # separación entre plantas en la vista explotada
ALZA_TEJADO = 0.75               # lo que sube la cubierta al abrir el edificio
MESA_Z = -BASE['grueso']         # la mesa, debajo del tablero


def centro(c, f):
    return ((c - (COLS - 1) / 2) * PASO, (f - (FILAS - 1) / 2) * PASO)


# fila 0 delante. La plaza ocupa las dos parcelas del centro de la fila 1
SITIO = {
    'marbella': (0, 0), 'adivinadle': (1, 0), 'wardux': (2, 0), 'siguiente': (3, 0),
    'calculo': (0, 1), 'erp': (3, 1),
    'vados': (0, 2), 'agentes': (1, 2), 'servidor': (2, 2), 'vision': (3, 2),
}
PLAZA = {'x': 0.0, 'y': centro(1, 1)[1], 'ancho': 2 * PAR + CALLE, 'fondo': PAR}
PANTALLA = {'x': 0.0, 'y': PLAZA['y'] + 1.05, 'z': 1.05, 'ancho': 2.6, 'alto': 1.46}
COLOR = {'adivinadle': '#1B2140', 'wardux': '#9E3A26', 'calculo': '#17583F', 'agentes': '#4A2F78', 'erp': '#17656A',
         'servidor': '#1C47A0', 'marbella': '#C5612A', 'vados': '#B8901C', 'vision': '#94295F'}


def mezclar(a, b, t):
    ca, cb = [int(a[i:i + 2], 16) for i in (1, 3, 5)], [int(b[i:i + 2], 16) for i in (1, 3, 5)]
    return '#' + ''.join(f'{round(x + (y - x) * t):02x}' for x, y in zip(ca, cb))


# ───────────────────────── piezas propias ─────────────────────────
def prisma(nombre, perfil, largo, pos, mat, padre=None, eje='X'):
    """Prisma de sección `perfil` [(u, z)…] (en el plano perpendicular a `eje`), de `largo` a lo largo del eje."""
    bm = bmesh.new()
    def v(u, z, s):
        return bm.verts.new((s, u, z) if eje == 'X' else (u, s, z))
    a = [v(u, z, -largo / 2) for u, z in perfil]; b = [v(u, z, largo / 2) for u, z in perfil]
    n = len(perfil)
    bm.faces.new(a[::-1]); bm.faces.new(b)
    for i in range(n):
        j = (i + 1) % n; bm.faces.new((a[i], a[j], b[j], b[i]))
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    me = bpy.data.meshes.new(nombre); bm.to_mesh(me); bm.free()
    o = K.objeto(nombre, me, padre, mat); o.location = pos
    return o


def lamina_uv(nombre, esquinas, uv, mat, padre=None):
    """Como K.lamina, pero con su trozo del canvas: uv = (u0, v0, u1, v1)."""
    o = K.lamina(nombre, esquinas, mat, padre)
    u0, v0, u1, v1 = uv
    for i, c in enumerate([(u0, v0), (u1, v0), (u1, v1), (u0, v1)]):
        o.data.uv_layers['UVMap'].data[i].uv = c
    return o


class Ed:
    """Un edificio: sus partes son vacíos apilados; lo de dentro de cada parte va en coordenadas de esa parte."""

    def __init__(self, id_, m):
        self.id = id_; self.m = m; self.x, self.y = centro(*SITIO[id_]); self.z = 0.04; self.partes = []   # encima de la cartulina de la parcela
        self.acento = mezclar(COLOR[id_], '#f1ede4', 0.58)
        self.mat_acento = K.material(f'acento_{id_}', self.acento, 0.7)

    def parte(self, alto):
        k = len(self.partes)
        p = K.vacio(f'ed_{self.id}_p{k}', (self.x, self.y, self.z))
        self.partes.append({'vacio': p, 'z': self.z, 'alto': alto}); self.z += alto
        return p, k

    def n(self, p, k, s):
        return f'ed_{self.id}_p{k}_{s}'


def ventanas(e, p, k, lado, ancho_muro, z0, alto, n, ancho_v, alto_v, mat, sobre=0.0, puerta=None):
    """Huecos de acetato ahumado en la cara exterior de un muro. lado: 'S' (delante), 'N', 'E', 'O'."""
    paso = ancho_muro / n
    for i in range(n):
        u = -ancho_muro / 2 + paso * (i + 0.5)
        ancho_i, alto_i, zc = ancho_v, alto_v, z0 + alto / 2 + sobre
        if puerta is not None and i == puerta:
            alto_i = alto * 0.78; zc = z0 + alto_i / 2 + 0.02; ancho_i = ancho_v * 1.1
        pos = {'S': (u, -lado_d(e, lado), zc), 'N': (u, lado_d(e, lado), zc), 'E': (lado_d(e, lado), u, zc), 'O': (-lado_d(e, lado), u, zc)}[lado]
        tam = (ancho_i, 0.012, alto_i) if lado in 'SN' else (0.012, ancho_i, alto_i)
        K.bloque(e.n(p, k, f'v{lado}{i}'), tam, pos, mat, padre=p, bisel=0)


def lado_d(e, lado):
    return e._medio[lado]


def planta(e, alto, ancho, fondo, m, muro=None, vent=(3, 2), losa=0.05, interior=None, puerta=None, grosor=0.045):
    """Una planta rectangular: losa, cuatro muros con huecos y lo de dentro."""
    p, k = e.parte(alto)
    mu = muro or m['carton']
    K.bloque(e.n(p, k, 'losa'), (ancho, fondo, losa), (0, 0, losa / 2), m['losa'], padre=p, bisel=0.004)
    h = alto - losa
    for lado, (tam, pos) in {
        'S': ((ancho, grosor, h), (0, -fondo / 2 + grosor / 2, losa + h / 2)), 'N': ((ancho, grosor, h), (0, fondo / 2 - grosor / 2, losa + h / 2)),
        'E': ((grosor, fondo - 2 * grosor, h), (ancho / 2 - grosor / 2, 0, losa + h / 2)), 'O': ((grosor, fondo - 2 * grosor, h), (-ancho / 2 + grosor / 2, 0, losa + h / 2)),
    }.items():
        K.bloque(e.n(p, k, f'muro{lado}'), tam, pos, mu, padre=p, bisel=0.003)
    e._medio = {'S': fondo / 2 + 0.004, 'N': fondo / 2 + 0.004, 'E': ancho / 2 + 0.004, 'O': ancho / 2 + 0.004}
    nx, ny = vent
    if nx:
        ventanas(e, p, k, 'S', ancho, losa, h, nx, ancho / nx * 0.55, h * 0.5, m['acetato'], puerta=puerta)
        ventanas(e, p, k, 'N', ancho, losa, h, nx, ancho / nx * 0.55, h * 0.5, m['acetato'])
    if ny:
        ventanas(e, p, k, 'E', fondo, losa, h, ny, fondo / ny * 0.55, h * 0.5, m['acetato'])
        ventanas(e, p, k, 'O', fondo, losa, h, ny, fondo / ny * 0.55, h * 0.5, m['acetato'])
    if interior:
        interior(p, k, losa, ancho - 2 * grosor, fondo - 2 * grosor, h)
    return p, k


def mesas(e, m, filas, cols, ancho, fondo, losa, tam=(0.22, 0.14, 0.09), sillas=True):
    def f(p, k, *_):
        for i in range(filas):
            for j in range(cols):
                x = -ancho / 2 + ancho * (j + 0.5) / cols; y = -fondo / 2 + fondo * (i + 0.5) / filas
                K.bloque(e.n(p, k, f'mesa{i}{j}'), tam, (x, y, losa + tam[2] / 2), m['mueble'], padre=p, bisel=0.004)
                if sillas:
                    K.bloque(e.n(p, k, f'silla{i}{j}'), (0.07, 0.07, 0.06), (x, y - tam[1] / 2 - 0.06, losa + 0.03), m['balsa'], padre=p, bisel=0.004)
    return f


def cubierta_plana(e, ancho, fondo, m, pretil=0.08, extra=None):
    p, k = e.parte(0.1 + pretil)
    K.bloque(e.n(p, k, 'losa'), (ancho, fondo, 0.06), (0, 0, 0.03), e.mat_acento, padre=p, bisel=0.004)
    g = 0.04
    for lado, (tam, pos) in {'S': ((ancho, g, pretil), (0, -fondo / 2 + g / 2, 0.06 + pretil / 2)), 'N': ((ancho, g, pretil), (0, fondo / 2 - g / 2, 0.06 + pretil / 2)),
                             'E': ((g, fondo - 2 * g, pretil), (ancho / 2 - g / 2, 0, 0.06 + pretil / 2)), 'O': ((g, fondo - 2 * g, pretil), (-ancho / 2 + g / 2, 0, 0.06 + pretil / 2))}.items():
        K.bloque(e.n(p, k, f'pretil{lado}'), tam, pos, m['carton'], padre=p, bisel=0.003)
    if extra:
        extra(p, k)
    return p, k


# ───────────────────────── los nueve edificios ─────────────────────────
def adivinadle(m):
    """Una rotonda de juegos: dos tambores con gradas dentro y una cúpula. Delante, la plaza."""
    e = Ed('adivinadle', m)
    def tambor(alto, r, gradas):
        p, k = e.parte(alto)
        K.cilindro(e.n(p, k, 'losa'), r, 0.05, (0, 0, 0.025), m['losa'], padre=p, eje='Z', lados=40)
        K.tubo(e.n(p, k, 'muro'), r - 0.05, r, alto - 0.05, (0, 0, 0.05 + (alto - 0.05) / 2), m['carton'], padre=p, lados=56, eje='Z')
        for i in range(12):                      # la cinta de huecos alrededor
            a = 2 * math.pi * i / 12
            bpy_o = K.bloque(e.n(p, k, f'v{i}'), (0.012, 0.22, (alto - 0.05) * 0.45), ((r + 0.004) * math.cos(a), (r + 0.004) * math.sin(a), 0.05 + (alto - 0.05) * 0.55), m['acetato'], padre=p, bisel=0)
            bpy_o.rotation_euler = (0, 0, a)
        for g in range(gradas):                  # gradas en anillo, mirando al centro
            K.tubo(e.n(p, k, f'grada{g}'), 0.25 + 0.16 * g, 0.36 + 0.16 * g, 0.07 * (g + 1), (0, 0, 0.05 + 0.035 * (g + 1)), m['balsa'], padre=p, lados=40, eje='Z')
        return p, k
    tambor(0.9, 1.05, 4)
    p, k = tambor(0.6, 0.85, 3)
    p, k = e.parte(0.9)
    K.esfera(e.n(p, k, 'cupula'), 0.88, (0, 0, 0), e.mat_acento, padre=p, escala=(1, 1, 0.62), segmentos=(36, 18))
    K.cilindro(e.n(p, k, 'linterna'), 0.12, 0.22, (0, 0, 0.62), m['carton'], padre=p, eje='Z')
    K.esfera(e.n(p, k, 'remate'), 0.07, (0, 0, 0.78), m['laton'], padre=p, segmentos=(12, 8))
    # la cúpula es media esfera: lo de debajo de z=0 se tapa con un disco
    K.cilindro(e.n(p, k, 'aro'), 0.9, 0.04, (0, 0, 0.02), m['carton'], padre=p, eje='Z', lados=40)
    return e


def wardux(m):
    """La redacción: una nave larga con cubierta en diente de sierra (luz del norte para escribir y revisar)."""
    e = Ed('wardux', m)
    A, F = 2.5, 1.7
    planta(e, 0.85, A, F, m, vent=(5, 3), puerta=2, interior=mesas(e, m, 3, 5, A - 0.4, F - 0.4, 0.05))
    planta(e, 0.75, A, F, m, vent=(5, 3), interior=mesas(e, m, 2, 4, A - 0.5, F - 0.6, 0.05, tam=(0.3, 0.16, 0.08)))
    p, k = e.parte(0.55)
    K.bloque(e.n(p, k, 'losa'), (A, F, 0.05), (0, 0, 0.025), m['losa'], padre=p, bisel=0.004)
    n = 4
    for i in range(n):                           # los dientes: cara vertical acristalada al norte (+Y)
        y0 = -F / 2 + F * i / n; y1 = y0 + F / n
        prisma(e.n(p, k, f'diente{i}'), [(y0, 0.05), (y1, 0.05), (y1, 0.5)], A, (0, 0, 0), e.mat_acento, padre=p, eje='X')
        K.bloque(e.n(p, k, f'luz{i}'), (A - 0.1, 0.012, 0.36), (0, y1 + 0.004, 0.27), m['acetato'], padre=p, bisel=0)
    return e


def calculo(m):
    """Tres torres como las barras de una gráfica, creciendo de izquierda a derecha."""
    e = Ed('calculo', m)
    A, F = 2.4, 1.6
    planta(e, 0.6, A, F, m, vent=(6, 3), puerta=3, interior=mesas(e, m, 2, 5, A - 0.4, F - 0.5, 0.05, tam=(0.2, 0.12, 0.08)))
    b = A / 3
    for nivel, cuales in enumerate(([0, 1, 2], [1, 2], [2])):
        p, k = e.parte(0.75)
        for c in cuales:
            x = -A / 2 + b * (c + 0.5)
            K.bloque(e.n(p, k, f'losa{c}'), (b - 0.12, F - 0.3, 0.05), (x, 0, 0.025), m['losa'], padre=p, bisel=0.003)
            for lado, dy in (('S', -(F - 0.3) / 2), ('N', (F - 0.3) / 2)):
                K.bloque(e.n(p, k, f'm{lado}{c}'), (b - 0.12, 0.04, 0.68), (x, dy - (0.02 if dy > 0 else -0.02), 0.39), m['carton'], padre=p, bisel=0.003)
                for j in range(2):
                    K.bloque(e.n(p, k, f'v{lado}{c}{j}'), (0.2, 0.012, 0.36), (x - 0.18 + 0.36 * j, dy + (0.004 if dy > 0 else -0.004), 0.42), m['acetato'], padre=p, bisel=0)
            for lado, dx in (('E', (b - 0.12) / 2), ('O', -(b - 0.12) / 2)):
                K.bloque(e.n(p, k, f'm{lado}{c}'), (0.04, F - 0.38, 0.68), (x + dx - (0.02 if dx > 0 else -0.02), 0, 0.39), m['carton'], padre=p, bisel=0.003)
            K.bloque(e.n(p, k, f'caja{c}'), (0.3, 0.3, 0.12), (x, 0, 0.11), m['mueble'], padre=p, bisel=0.004)
            if c == nivel:                       # la barra acaba aquí: su tapa, en el color del proyecto
                K.bloque(e.n(p, k, f'tapa{c}'), (b - 0.08, F - 0.26, 0.06), (x, 0, 0.76), e.mat_acento, padre=p, bisel=0.004)
    return e


def agentes(m):
    """La torre de oficinas del equipo: cuatro plantas iguales, una mesa por agente, y una antena."""
    e = Ed('agentes', m)
    A = 1.8
    planta(e, 0.8, A, A, m, vent=(4, 4), puerta=1, interior=mesas(e, m, 2, 2, A - 0.6, A - 0.6, 0.05, tam=(0.3, 0.2, 0.08)))
    for _ in range(3):
        planta(e, 0.72, A, A, m, vent=(4, 4), interior=mesas(e, m, 3, 3, A - 0.4, A - 0.4, 0.05, tam=(0.2, 0.13, 0.08)))
    def antena(p, k):
        K.cilindro(e.n(p, k, 'mastil'), 0.03, 0.9, (0.4, 0.4, 0.5), m['laton'], padre=p, eje='Z', lados=16)
        K.bloque(e.n(p, k, 'caseta'), (0.5, 0.4, 0.3), (-0.35, -0.3, 0.2), m['carton'], padre=p, bisel=0.004)
    cubierta_plana(e, A, A, m, extra=antena)
    return e


def erp(m):
    """El almacén: muelles de carga, palés dentro y cubierta a dos aguas."""
    e = Ed('erp', m)
    A, F = 2.4, 2.0
    def pales(p, k, losa, a, f, h):
        for i in range(3):
            for j in range(4):
                x = -a / 2 + a * (j + 0.5) / 4; y = -f / 2 + f * (i + 0.5) / 3
                K.bloque(e.n(p, k, f'pale{i}{j}'), (0.3, 0.26, 0.04), (x, y, losa + 0.02), m['balsa'], padre=p, bisel=0.003)
                for c in range(1 + (i + j) % 3):
                    K.bloque(e.n(p, k, f'caja{i}{j}{c}'), (0.24, 0.2, 0.12), (x, y, losa + 0.1 + 0.125 * c), m['corcho'], padre=p, bisel=0.006)
    p, k = planta(e, 1.05, A, F, m, vent=(0, 3), interior=pales)
    for i in range(3):                           # tres puertas de muelle, delante
        x = -A / 2 + A * (i + 0.5) / 3
        K.bloque(e.n(p, k, f'muelle{i}'), (0.5, 0.012, 0.6), (x, -F / 2 - 0.004, 0.36), m['acetato'], padre=p, bisel=0)
        K.bloque(e.n(p, k, f'anden{i}'), (0.6, 0.18, 0.12), (x, -F / 2 - 0.09, 0.06), m['carton'], padre=p, bisel=0.004)
    p, k = e.parte(0.62)
    prisma(e.n(p, k, 'tejado'), [(-F / 2 - 0.08, 0), (F / 2 + 0.08, 0), (0, 0.6)], A + 0.1, (0, 0, 0), e.mat_acento, padre=p, eje='X')
    return e


def servidor(m):
    """La sala de máquinas: filas de armarios dentro, ventiladores y una chimenea en la cubierta."""
    e = Ed('servidor', m)
    A, F = 2.2, 1.8
    def armarios(p, k, losa, a, f, h):
        for i in range(4):
            for j in range(6):
                x = -a / 2 + 0.2 + (a - 0.4) * j / 5; y = -f / 2 + 0.25 + (f - 0.5) * i / 3
                K.bloque(e.n(p, k, f'rack{i}{j}'), (0.2, 0.16, 0.42), (x, y, losa + 0.21), m['oscuro'], padre=p, bisel=0.004)
    planta(e, 0.85, A, F, m, muro=m['balsa'], vent=(3, 0), puerta=1, interior=armarios)
    planta(e, 0.6, A, F, m, muro=m['balsa'], vent=(5, 3), interior=mesas(e, m, 1, 3, A - 0.6, F - 0.8, 0.05, tam=(0.4, 0.2, 0.08)))
    def maquinas(p, k):
        for j in range(3):
            x = -0.6 + 0.6 * j
            K.cilindro(e.n(p, k, f'vent{j}'), 0.2, 0.12, (x, -0.35, 0.12), m['carton'], padre=p, eje='Z', lados=40)
            K.cilindro(e.n(p, k, f'helice{j}'), 0.16, 0.02, (x, -0.35, 0.185), m['oscuro'], padre=p, eje='Z', lados=40)
        K.cilindro(e.n(p, k, 'chimenea'), 0.11, 0.9, (0.75, 0.5, 0.5), m['carton'], padre=p, eje='Z', lados=32)
    cubierta_plana(e, A, F, m, extra=maquinas)
    return e


def marbella(m):
    """El hotel de la costa: plantas escalonadas en terrazas, toldos y una pérgola; palmeras en la parcela."""
    e = Ed('marbella', m)
    planta(e, 0.75, 2.5, 2.0, m, vent=(5, 4), puerta=2, interior=mesas(e, m, 2, 4, 2.0, 1.4, 0.05, tam=(0.18, 0.18, 0.07), sillas=False))
    for nivel, (a, f) in enumerate(((2.1, 1.6), (1.7, 1.2))):
        p, k = planta(e, 0.7, a, f, m, vent=(4, 3), interior=mesas(e, m, 2, 3, a - 0.5, f - 0.5, 0.05, tam=(0.2, 0.26, 0.06), sillas=False))
        for i in range(4):                       # toldos sobre los huecos de delante
            x = -a / 2 + a * (i + 0.5) / 4
            t = K.bloque(e.n(p, k, f'toldo{i}'), (a / 4 * 0.62, 0.16, 0.02), (x, -f / 2 - 0.07, 0.6), e.mat_acento, padre=p, bisel=0.002)
            t.rotation_euler = (R(-18), 0, 0)
    def pergola(p, k):
        for i in range(7):
            K.bloque(e.n(p, k, f'listón{i}'), (0.04, 1.0, 0.04), (-0.6 + 0.2 * i, 0, 0.36), m['balsa'], padre=p, bisel=0.002)
        for x in (-0.65, 0.65):
            for y in (-0.45, 0.45):
                K.cilindro(e.n(p, k, f'pilar{x}{y}'), 0.025, 0.3, (x, y, 0.2), m['balsa'], padre=p, eje='Z', lados=12)
    cubierta_plana(e, 1.7, 1.2, m, extra=pergola)
    return e


def vados(m):
    """La casa consistorial: soportales con puertas de cochera abajo, oficinas arriba y la torre del reloj."""
    e = Ed('vados', m)
    A, F = 2.5, 1.8
    p, k = planta(e, 0.85, A, F, m, vent=(0, 3), interior=mesas(e, m, 2, 4, A - 0.6, F - 0.6, 0.05, tam=(0.22, 0.14, 0.08)))
    for i in range(5):                           # las cocheras, cada una con su vado pintado delante
        x = -A / 2 + A * (i + 0.5) / 5
        K.bloque(e.n(p, k, f'cochera{i}'), (0.34, 0.012, 0.5), (x, -F / 2 - 0.004, 0.3), m['acetato'], padre=p, bisel=0)
        K.bloque(e.n(p, k, f'vado{i}'), (0.36, 0.16, 0.006), (x, -F / 2 - 0.25, 0.003 - k * 0), e.mat_acento, padre=p, bisel=0)
    for i in range(6):
        x = -A / 2 + 0.06 + (A - 0.12) * i / 5
        K.cilindro(e.n(p, k, f'pilar{i}'), 0.04, 0.8, (x, -F / 2 - 0.12, 0.45), m['carton'], padre=p, eje='Z', lados=16)
    planta(e, 0.75, A, F + 0.24, m, vent=(6, 3), interior=mesas(e, m, 2, 5, A - 0.5, F - 0.4, 0.05, tam=(0.2, 0.13, 0.08)))
    def torre(p, k):
        K.bloque(e.n(p, k, 'torre'), (0.5, 0.5, 0.9), (0, -0.2, 0.5), m['carton'], padre=p, bisel=0.004)
        K.cilindro(e.n(p, k, 'reloj'), 0.15, 0.02, (0, -0.2 - 0.26, 0.72), m['laton'], padre=p, eje='Y', lados=40)
        prisma(e.n(p, k, 'chapitel'), [(-0.3, 0), (0.3, 0), (0, 0.35)], 0.6, (0, -0.2, 0.95), e.mat_acento, padre=p, eje='X')
    cubierta_plana(e, A, F + 0.24, m, extra=torre)
    return e


def vision(m):
    """El observatorio: una base cuadrada, un tambor y la cúpula con su rendija; dentro, el telescopio."""
    e = Ed('vision', m)
    planta(e, 0.95, 2.1, 2.1, m, vent=(4, 4), puerta=1, interior=mesas(e, m, 2, 3, 1.4, 1.4, 0.05, tam=(0.24, 0.16, 0.08)))
    p, k = e.parte(0.6)
    K.cilindro(e.n(p, k, 'losa'), 0.95, 0.05, (0, 0, 0.025), m['losa'], padre=p, eje='Z', lados=40)
    K.tubo(e.n(p, k, 'muro'), 0.9, 0.95, 0.55, (0, 0, 0.325), m['carton'], padre=p, lados=56, eje='Z')
    K.cilindro(e.n(p, k, 'pie'), 0.12, 0.3, (0, 0, 0.2), m['oscuro'], padre=p, eje='Z', lados=24)
    t = K.cilindro(e.n(p, k, 'telescopio'), 0.09, 0.8, (0, 0.1, 0.48), m['carton'], padre=p, eje='Z', lados=32, r2=0.07)
    t.rotation_euler = (R(-35), 0, 0)
    p, k = e.parte(0.9)
    K.esfera(e.n(p, k, 'cupula'), 0.97, (0, 0, 0), e.mat_acento, padre=p, escala=(1, 1, 0.92), segmentos=(36, 18))
    K.bloque(e.n(p, k, 'rendija'), (0.22, 0.6, 0.012), (0, -0.62, 0.62), m['acetato'], padre=p, bisel=0).rotation_euler = (R(-50), 0, 0)
    K.cilindro(e.n(p, k, 'aro'), 0.99, 0.05, (0, 0, 0.025), m['carton'], padre=p, eje='Z', lados=40)
    return e


EDIFICIOS = [adivinadle, wardux, calculo, agentes, erp, servidor, marbella, vados, vision]


# ───────────────────────── el tablero, la plaza, la mesa ─────────────────────────
def arbol(nombre, x, y, m, alto=0.5, r=0.22):
    K.cilindro(nombre + '_tronco', 0.018, alto, (x, y, alto / 2), m['tronco'], eje='Z', lados=10)
    for i, (dx, dy, dz, s) in enumerate(((0, 0, 0, 1), (0.08, 0.05, -0.08, 0.7), (-0.07, -0.04, -0.06, 0.75))):
        K.esfera(f'{nombre}_copa{i}', r * s, (x + dx, y + dy, alto + dz), m['liquen'], escala=(1, 1, 0.9), segmentos=(12, 8))


def persona(nombre, x, y, m, giro=0):
    K.cilindro(nombre, 0.022, 0.085, (x, y, 0.045), m['figura'], eje='Z', lados=12, r2=0.017)
    K.esfera(nombre + '_cabeza', 0.016, (x, y, 0.1), m['figura'], segmentos=(8, 6))


def tablero(m):
    B = BASE
    K.bloque('base_canto', (B['ancho'], B['fondo'], B['grueso'] - 0.02), (0, 0, -B['grueso'] / 2 - 0.01), m['contrachapado'], bisel=0.01)
    K.bloque('base_cara', (B['ancho'] - 0.02, B['fondo'] - 0.02, 0.02), (0, 0, -0.01), m['calle'], bisel=0.002)
    for id_, (c, f) in SITIO.items():
        x, y = centro(c, f)
        if id_ == 'siguiente':
            # la parcela vacía: solo su silueta discontinua y un cartelito
            for lado in range(4):
                for i in range(7):
                    u = -PAR / 2 + 0.1 + (PAR - 0.2) * (i + 0.25) / 7
                    pos = [(x + u, y - PAR / 2 + 0.04), (x + u, y + PAR / 2 - 0.04), (x - PAR / 2 + 0.04, y + u), (x + PAR / 2 - 0.04, y + u)][lado]
                    tam = (0.22, 0.03, 0.012) if lado < 2 else (0.03, 0.22, 0.012)
                    K.bloque(f'base_raya_{lado}_{i}', tam, (*pos, 0.006), m['raya'], bisel=0)
            K.cilindro('base_estaca', 0.012, 0.5, (x, y - 0.3, 0.25), m['balsa'], eje='Z', lados=10)
            continue
        K.bloque(f'base_parcela_{id_}', (PAR, PAR, 0.04), (x, y, 0.02), m['parcela'], bisel=0.004)
    K.bloque('base_plaza', (PLAZA['ancho'], PLAZA['fondo'], 0.03), (PLAZA['x'], PLAZA['y'], 0.015), m['corcho'], bisel=0.004)
    # la pantalla de la plaza: dos postes, el marco y el cartel de encima
    P = PANTALLA
    for dx in (-P['ancho'] / 2 - 0.08, P['ancho'] / 2 + 0.08):
        K.bloque(f'base_poste_{dx:+.1f}', (0.1, 0.1, P['z'] + P['alto'] / 2 + 0.35), (P['x'] + dx, P['y'] + 0.02, (P['z'] + P['alto'] / 2 + 0.35) / 2), m['carton'], bisel=0.004)
    K.bloque('base_marco', (P['ancho'] + 0.12, 0.08, P['alto'] + 0.12), (P['x'], P['y'] + 0.045, P['z']), m['oscuro'], bisel=0.006)
    K.lamina('pantalla_cara', [(P['x'] - P['ancho'] / 2, P['y'], P['z'] - P['alto'] / 2), (P['x'] + P['ancho'] / 2, P['y'], P['z'] - P['alto'] / 2),
                                (P['x'] + P['ancho'] / 2, P['y'], P['z'] + P['alto'] / 2), (P['x'] - P['ancho'] / 2, P['y'], P['z'] + P['alto'] / 2)], m['negro'])
    zt = P['z'] + P['alto'] / 2 + 0.1
    K.bloque('base_marquesina', (P['ancho'] + 0.36, 0.1, 0.3), (P['x'], P['y'] + 0.03, zt + 0.16), m['carton'], bisel=0.004)
    K.lamina('marquesina_cara', [(P['x'] - P['ancho'] / 2 - 0.12, P['y'] - 0.022, zt + 0.04), (P['x'] + P['ancho'] / 2 + 0.12, P['y'] - 0.022, zt + 0.04),
                                 (P['x'] + P['ancho'] / 2 + 0.12, P['y'] - 0.022, zt + 0.28), (P['x'] - P['ancho'] / 2 - 0.12, P['y'] - 0.022, zt + 0.28)], m['blanco'])
    # bancos, árboles y gente en la plaza; árboles en las calles
    for i, x in enumerate((-2.2, -1.1, 1.1, 2.2)):
        K.bloque(f'base_banco_{i}', (0.36, 0.1, 0.05), (x, PLAZA['y'] - 0.9, 0.055), m['balsa'], bisel=0.004)
    for i, (x, y) in enumerate(((-3.0, PLAZA['y'] - 1.1), (3.0, PLAZA['y'] - 1.1), (-3.0, PLAZA['y'] + 1.1), (3.0, PLAZA['y'] + 1.1))):
        arbol(f'base_arbol_p{i}', x, y, m)
    calles = [(-5.4 - 1.8, -5.4), (5.4 + 1.8, -5.4), (-7.2, 1.8), (7.2, -1.8), (-1.8, 5.4), (1.8, 5.4), (-3.6, -2.6), (3.6, 2.6), (0, -5.4)]
    for i, (x, y) in enumerate(calles):
        arbol(f'base_arbol_c{i}', x, y, m, alto=0.42, r=0.17)
    import random
    rnd = random.Random(7)
    for i in range(16):
        persona(f'base_persona_{i}', rnd.uniform(-2.9, 2.9), PLAZA['y'] + rnd.uniform(-1.2, 0.6), m)
    for i in range(10):
        c = rnd.choice([(-1.8, None), (1.8, None), (None, -1.8), (None, 1.8)])
        x = c[0] if c[0] is not None else rnd.uniform(-7, 7); y = c[1] if c[1] is not None else rnd.uniform(-5.2, 5.2)
        persona(f'base_persona_c{i}', x + rnd.uniform(-0.15, 0.15), y + rnd.uniform(-0.15, 0.15), m)
    # los rótulos de las parcelas: tarjetitas de pie en la acera de delante, con su trozo del canvas «rotulos»
    for i, id_ in enumerate(list(SITIO)):
        c, f = SITIO[id_]; x, y = centro(c, f)
        y0, w, h = y - PAR / 2 - 0.12, 1.5, 0.28
        K.bloque(f'base_rotulo_pie_{id_}', (w + 0.04, 0.03, h + 0.04), (x, y0 + 0.02, h / 2 + 0.03), m['carton'], bisel=0.003)
        lamina_uv(f'rotulo_{id_}', [(x - w / 2, y0, 0.05), (x + w / 2, y0, 0.05), (x + w / 2, y0, 0.05 + h), (x - w / 2, y0, 0.05 + h)],
                  (0, 1 - (i + 1) / 10, 1, 1 - i / 10), m['blanco'])


def mesa(m):
    """La mesa del estudio y lo que hay encima: el escalímetro, un lápiz, un rollo de papel vegetal y el cúter."""
    K.bloque('mesa_tablero', (40, 26, 0.6), (0, 2, MESA_Z - 0.3), m['roble'], bisel=0.02)
    K.bloque('mesa_pared', (60, 0.2, 30), (0, 16, 5), m['yeso'], bisel=0)
    # la plancha de corte verde, debajo del tablero de la maqueta
    K.bloque('mesa_tapete', (BASE['ancho'] + 2.4, BASE['fondo'] + 2.0, 0.04), (0.3, 0.2, MESA_Z + 0.02), m['tapete'], bisel=0.01)
    K.bloque('mesa_suelo', (60, 40, 0.1), (0, 0, -9), m['yeso'], bisel=0)
    z = MESA_Z
    prisma('mesa_escalimetro', [(-0.09, 0), (0.09, 0), (0, 0.16)], 3.0, (-9.4, -5.6, z), m['carton'], eje='X').rotation_euler = (0, 0, R(18))
    K.cilindro('mesa_lapiz', 0.04, 1.75, (8.8, -6.3, z + 0.04), m['lapiz'], eje='X', lados=6).rotation_euler = (R(30), 0, R(-24))
    K.cono('mesa_lapiz_punta', 0.04, 0.16, (8.8 + 0.95 * math.cos(R(-24)), -6.3 + 0.95 * math.sin(R(-24)), z + 0.04), m['balsa']).rotation_euler = (0, R(90), R(-24))
    K.cilindro('mesa_rollo', 0.22, 4.0, (-10.0, 4.5, z + 0.22), m['vegetal'], eje='Y', lados=48).rotation_euler = (0, 0, R(-12))
    K.bloque('mesa_cuter', (0.9, 0.12, 0.06), (9.2, 4.6, z + 0.03), m['naranja'], bisel=0.02).rotation_euler = (0, 0, R(35))


def materiales():
    return {
        'carton': K.material('carton', '#f2efe8', 0.86), 'losa': K.material('losa', '#e4dfd4', 0.86),
        'parcela': K.material('parcela', '#ece8df', 0.9), 'calle': K.material('calle', '#c9c4b9', 0.92),
        'contrachapado': K.madera('contrachapado', '#b48c5f', '#dcc29a', eje='X', vetas=9), 'balsa': K.material('balsa', '#d9bd90', 0.75),
        'corcho': K.material('corcho', '#c7b392', 0.95), 'acetato': K.material('acetato', '#6f7a80', 0.18),
        'mueble': K.material('mueble', '#d6d0c4', 0.85), 'oscuro': K.material('oscuro_m', '#2e3036', 0.5),
        'liquen': K.material('liquen', '#8a9468', 1.0), 'tronco': K.material('tronco', '#8d7356', 0.8),
        'figura': K.material('figura', '#fbfaf6', 0.7), 'raya': K.material('raya', '#9a958a', 0.9),
        'laton': K.material('laton', '#b8955a', 0.35, metal=0.8), 'negro': K.material('negro', '#0c0d10', 0.4),
        'blanco': K.material('blanco', '#ffffff', 0.8), 'roble': K.madera('roble', '#8f7b63', '#a8957b', eje='X', vetas=6), 'tapete': K.material('tapete', '#39433f', 0.85),
        'yeso': K.yeso('yeso_m', '#e8e2d6'), 'lapiz': K.material('lapiz', '#d8a62c', 0.5), 'vegetal': K.material('vegetal', '#f4f2ea', 0.6),
        'naranja': K.material('naranja', '#e06b2c', 0.4),
    }


def luces():
    sol = bpy.data.lights.new('sol', 'SUN'); sol.energy = 6.5; sol.angle = R(1.6); sol.color = (1.0, 0.92, 0.82)
    o = bpy.data.objects.new('sol', sol); bpy.context.scene.collection.objects.link(o)
    o.rotation_euler = (Vector((0, 0, 0)) - Vector((-1.0, -0.45, 0.62))).to_track_quat('-Z', 'Y').to_euler()
    K.area('cielo', (0, -4, 18), (0, 0, 0), 1500, (0.86, 0.91, 1.0), 22, 18)
    K.area('rebote', (14, -12, 6), (0, 0, 0.5), 900, (1.0, 0.96, 0.9), 10)
    K.mundo('#c9cdd4', 0.22)


def escena():
    K.limpiar() if hasattr(K, 'limpiar') else None
    m = materiales()
    tablero(m); mesa(m); luces()
    eds = [f(m) for f in EDIFICIOS]
    return m, eds


def alzar(e, abre):
    """Las partes de un edificio según `abre` (0 junto, 1 la cubierta levantada, 2 explotado). La web hace lo mismo."""
    n = len(e.partes)
    for k, p in enumerate(e.partes):
        tejado = k == n - 1
        dz = (ALZA_TEJADO * min(abre, 1) if tejado else 0) + max(abre - 1, 0) * k * DELTA
        p['vacio'].location.z = p['z'] + dz


def datos(eds):
    return {'base': BASE, 'paso': PASO, 'par': PAR, 'delta': DELTA, 'alza_tejado': ALZA_TEJADO, 'plaza': PLAZA, 'pantalla': PANTALLA,
            'sitio': {k: {'c': c, 'f': f, 'x': centro(c, f)[0], 'y': centro(c, f)[1]} for k, (c, f) in SITIO.items()},
            'edificios': {e.id: {'x': e.x, 'y': e.y, 'alto': e.z, 'partes': [{'z': p['z'], 'alto': p['alto']} for p in e.partes]} for e in eds}}


def foto(nombre, pos, mira, lente):
    K.ajustes(1440, 900, MUESTRAS)
    K.camara(pos, mira, lente)
    bpy.context.scene.render.filepath = os.path.join(DESTINO, nombre + '.png')
    bpy.ops.render.render(write_still=True)


VIDRIO = re.compile(r'_(v[SNEO]?\d+|luz\d|muelle\d|cochera\d|rendija)$')   # el mismo que en la web: llevan brillo


def unir_para_la_web(todo):
    """Ya horneado, las piezas que se mueven juntas se exportan como una sola malla: la base entera, la mesa y, en cada
    planta de cada edificio, el cristal por un lado y lo demás por otro. Eran 946 mallas, una llamada de dibujo cada
    una, y sin gráfica cada fotograma costaba 60-90 ms. Las UV de luz viajan con cada cara, así que lo horneado vale.
    Los rótulos, la pantalla y la marquesina siguen sueltos: la web les pone su propia textura."""
    planta = re.compile(r'^ed_[a-z]+_p\d+$')

    def ancla(o):           # el vacío de su planta (o nada, para la base y la mesa)
        a = o.parent
        while a is not None and not planta.match(a.name):
            a = a.parent
        return a
    comun = K.gris('para_la_web')
    grupos = {}
    for o in todo:
        n = o.name
        if n.startswith(('base_', 'mesa_')):
            a, nombre = None, n.split('_')[0] + '_unida'
        elif n.startswith('ed_') and ancla(o) is not None:
            a = ancla(o); nombre = f'{a.name}_unida' + ('_cristal_v0' if VIDRIO.search(n) else '')
        else:
            continue
        grupos.setdefault((a, nombre), []).append(o)
    # primero, cada pieza colgada directamente de su ancla (sin moverse), para que unir no dependa de quién cuelga de quién
    for (a, _), objs in grupos.items():
        for o in objs:
            mw = o.matrix_world.copy(); o.parent = a; o.matrix_world = mw
    for (a, nombre), objs in grupos.items():
        for o in objs:
            o.data.materials.clear(); o.data.materials.append(comun)
        if len(objs) > 1:
            K.seleccionar(objs); bpy.ops.object.join()
        junto = bpy.context.view_layer.objects.active if len(objs) > 1 else objs[0]
        junto.name = nombre; junto.data.name = nombre
        junto.data.uv_layers.active = junto.data.uv_layers['luz']


def principal():
    m, eds = escena()
    if 'vista' in RESTO:
        return foto('vista', (0, -27, 19), (0, -0.6, 0.4), 42)
    if 'vista_abierta' in RESTO:
        alzar(eds[3], 2); alzar(eds[0], 1)
        return foto('vista_abierta', (-1.0, -15, 12), (-1.8, 1.8, 2.2), 45)
    if 'vista_plaza' in RESTO:
        return foto('vista_plaza', (0, PLAZA['y'] - 3.2, 0.55), (0, PANTALLA['y'], PANTALLA['z']), 28)
    import time
    t0 = time.time(); reloj = lambda *x: print(f'[{time.time() - t0:7.1f} s]', *x, flush=True)
    K.preparar(); reloj('preparado')
    K.ajustes(64, 64, MUESTRAS)
    horno = K.Horno(DESTINO)
    todo = K.mallas()
    g = {'base': [o for o in todo if o.name.startswith(('base_', 'rotulo_', 'pantalla_', 'marquesina_'))],
         'mesa': [o for o in todo if o.name.startswith('mesa_')]}
    for e in eds:
        g['ed_' + e.id] = [o for o in todo if o.name.startswith(f'ed_{e.id}_')]
    for clave, objs in g.items():
        K.desplegar(objs, 0.004 if clave.startswith('ed_') else 0.003)
        caras = sum(len(o.data.polygons) for o in objs)
        reloj('desplegado', clave, len(objs), 'piezas', caras, 'caras')
    if 'medir' in RESTO:
        import collections
        tri = lambda o: sum(len(pl.vertices) - 2 for pl in o.data.polygons)  # noqa: E731
        por_tipo = collections.Counter()
        for o in todo:
            por_tipo[re.sub(r'^ed_[a-z]+_p\d+_|^base_|\d+$|_\d+$', '', o.name)] += tri(o)
        print('TRIANGULOS', sum(tri(o) for o in todo), flush=True)
        for k, v in por_tipo.most_common(30):
            print(f'TIPO {v:7d} {k}', flush=True)
        return
    hornear = horno.hornear_junto       # unidas: pieza a pieza, la base (175 piezas a 4096) no acababa en 20 min
    def con_reloj(objs, nombre, *a, **k):
        hornear(objs, nombre, *a, **k); reloj('horneado', nombre)
    horno.hornear = con_reloj
    horno.hornear(g['base'], 'base', 4096, color=True, publicar=2048, sin_perdida=True)
    horno.hornear(g['mesa'], 'mesa', 2048, color=True, publicar=1024)
    for e in eds:
        n = 'ed_' + e.id
        horno.hornear(g[n], n, 1024, color=True, pareja=n)
        alzar(e, 2)
        horno.hornear(g[n], n + '_ab', 1024, color=True, pareja=n)
        alzar(e, 0)
    unir_para_la_web(todo); reloj('unido', len(K.mallas()), 'mallas')
    horno.exportar(datos(eds)); reloj('exportado')


principal()
