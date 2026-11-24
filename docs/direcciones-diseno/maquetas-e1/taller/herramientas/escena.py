"""El tablero del taller: un panel perforado con la silueta pintada de cada herramienta, una por proyecto.

  pesado.sh --cola gpu taller-e1 -- <python con bpy> escena.py <carpeta> [muestras] [vista]

Una pared de taller con luz de mañana. El tablero, perforado y pintado de gris pizarra, lleva nueve herramientas
inventadas colgadas de sus ganchos; detrás de cada una, su silueta en blanco (lo que hay en los talleres ordenados
para ver qué falta). Debajo, el banco de roble con un tornillo que sujeta un monitor pequeño: ahí se «prueba» cada
herramienta y sale su demo.

Las herramientas se hacen con piezas de perfil (cajas, discos, aros y polígonos extruidos) que también se exportan:
la web pinta las siluetas en el tablero con las mismas medidas. El tablero va en diez losetas (una por hueco), cada
una con su luz con herramienta y sin ella (misma escala): la web mezcla la de cada hueco cuando se descuelga la suya.
"""
import math
import os
import re
import sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '../../../kit-e1/herramientas'))
import kit as K  # noqa: E402
import bpy  # noqa: E402
import bmesh  # noqa: E402
from mathutils import Vector  # noqa: E402

DESTINO, MUESTRAS, RESTO = K.argumentos()
R = K.R

# ── Medidas (1 = 10 cm). X a la derecha, Y hacia la pared, Z arriba; el banco en z = 0 ──
TAB = {'x0': -8.0, 'x1': 8.0, 'z0': 1.5, 'z1': 10.7, 'y': -0.3}      # la cara del tablero
COLS, FILAS = 5, 2
HUECO_X = (TAB['x1'] - TAB['x0']) / COLS
HUECO_Z = (TAB['z1'] - TAB['z0']) / FILAS
AGUJEROS = 0.3                                                         # paso de la perforación
GANCHO_Y = 0.62                                                        # lo que sale el gancho del tablero
ORDEN = ['adivinadle', 'wardux', 'calculo', 'agentes', 'erp', 'servidor', 'marbella', 'vados', 'vision', 'siguiente']
COLOR = {'adivinadle': '#1B2140', 'wardux': '#9E3A26', 'calculo': '#17583F', 'agentes': '#4A2F78', 'erp': '#17656A',
         'servidor': '#1C47A0', 'marbella': '#C5612A', 'vados': '#B8901C', 'vision': '#94295F'}
MONITOR = {'x': 11.2, 'y': -3.4, 'z': 2.45, 'ancho': 3.0, 'alto': 1.8, 'marco': 0.16, 'fondo': 0.22}


def hueco(i):
    """Centro x y altura del gancho del hueco i (fila de arriba: 0–4)."""
    c, f = i % COLS, i // COLS
    return TAB['x0'] + HUECO_X * (c + 0.5), TAB['z1'] - HUECO_Z * f - 0.55


# ───────────────────────── las herramientas, por piezas de perfil ─────────────────────────
# ('caja', cx, cz, ancho, alto, fondo, mat, bisel[, y]) · ('disco', cx, cz, r, fondo, mat[, y]) ·
# ('aro', cx, cz, r1, r2, fondo, mat[, y]) · ('poli', [(x, z)…], fondo, mat[, y]) ·
# ('torno', cx, [(r, z)…], mat[, y]): un perfil girado alrededor del eje vertical x = cx, como sale un mango del torno
# (de arriba abajo; r = 0 cierra en punta). Lo redondo de verdad (mangos, cañas, cabezas) va al torno, no en cajas:
# en cajas parecía hecho con bloques. `y` adelanta la pieza (negativo).
# Cada herramienta cuelga de su agujero: `agujero` es dónde va el gancho (en sus coordenadas).
def anillo(z, r, alto=0.06):
    """Una banda de goma alrededor de un mango (perfil de torno)."""
    return [(r - 0.012, z), (r, z - 0.012), (r, z - alto + 0.012), (r - 0.012, z - alto)]


H = {
    'adivinadle': {'nombre': 'lupa', 'agujero': (0, -0.06), 'piezas': [
        ('aro', 0, -0.06, 0.05, 0.09, 0.04, 'laton'),
        ('torno', 0, [(0.0, -0.12), (0.09, -0.135), (0.15, -0.2), (0.185, -0.4), (0.2, -0.85), (0.19, -1.35), (0.165, -1.7), (0.16, -1.78)], 'color'),
        ('torno', 0, [(0.165, -1.76), (0.165, -1.92), (0.13, -1.97), (0.085, -2.0), (0.085, -2.1)], 'laton'),
        ('aro', 0, -2.82, 0.6, 0.74, 0.2, 'laton'), ('disco', 0, -2.82, 0.6, 0.05, 'cristal'),
    ]},
    'wardux': {'nombre': 'soldador', 'agujero': (0, -0.15), 'piezas': [
        ('aro', 0, -0.15, 0.09, 0.15, 0.08, 'goma'),
        ('torno', 0, [(0.05, -0.26), (0.07, -0.32), (0.085, -0.5), (0.12, -0.62), (0.13, -0.68)], 'goma'),
        ('torno', 0, [(0.13, -0.66), (0.19, -0.74), (0.215, -0.95), (0.225, -1.25), (0.21, -1.7), (0.19, -1.86), (0.2, -1.9)], 'color'),
        ('torno', 0, anillo(-1.3, 0.232), 'goma'),
        ('torno', 0, anillo(-1.44, 0.229), 'goma'), ('torno', 0, anillo(-1.58, 0.223), 'goma'),
        ('torno', 0, [(0.21, -1.9), (0.225, -1.94), (0.225, -2.0), (0.12, -2.04), (0.06, -2.06)], 'acero'),
        ('torno', 0, [(0.05, -2.05), (0.05, -3.3), (0.042, -3.34)], 'acero'),
        ('torno', 0, [(0.046, -3.33), (0.046, -3.4), (0.012, -3.64), (0.0, -3.67)], 'laton'),
    ]},
    'calculo': {'nombre': 'calibre', 'agujero': (0.15, -0.35), 'piezas': [
        ('caja', 0.15, -1.95, 0.32, 3.6, 0.08, 'acero', 0.01), ('disco', 0.15, -0.35, 0.07, 0.12, 'hueco'),
        ('caja', -0.33, -3.58, 0.66, 0.3, 0.08, 'acero', 0.01), ('poli', [(-0.66, -3.73), (-0.66, -3.43), (-0.98, -3.68)], 0.08, 'acero'),
        ('caja', 0.17, -2.55, 0.52, 0.72, 0.16, 'color', 0.04), ('caja', -0.3, -3.06, 0.6, 0.24, 0.1, 'acero', 0.01),
        ('poli', [(-0.6, -3.18), (-0.6, -2.94), (-0.88, -3.13)], 0.1, 'acero'),
        ('disco', 0.5, -2.75, 0.11, 0.1, 'laton'), ('caja', 0.17, -2.48, 0.3, 0.16, 0.02, 'cristal', 0, -0.09),
    ]},
    'agentes': {'nombre': 'destornillador de revólver', 'agujero': (0, -0.5), 'piezas': [
        ('disco', 0, -0.5, 0.42, 0.32, 'color'), ('disco', 0, -0.5, 0.08, 0.4, 'hueco'),
        *[('disco', 0.28 * math.cos(a), -0.5 + 0.28 * math.sin(a), 0.065, 0.1, 'acero', -0.18) for a in [i * math.pi / 3 + 0.5 for i in range(6)]],
        ('torno', 0, [(0.12, -0.88), (0.2, -0.95), (0.245, -1.15), (0.255, -1.6), (0.235, -2.05), (0.19, -2.25), (0.15, -2.3)], 'color'),
        ('torno', 0, anillo(-1.36, 0.262), 'goma'), ('torno', 0, anillo(-1.6, 0.264), 'goma'), ('torno', 0, anillo(-1.84, 0.255), 'goma'),
        ('torno', 0, [(0.15, -2.28), (0.15, -2.42), (0.11, -2.48), (0.06, -2.5)], 'acero'),
        ('torno', 0, [(0.05, -2.48), (0.05, -3.5)], 'acero'),
        ('poli', [(-0.08, -3.5), (0.08, -3.5), (0.04, -3.66), (-0.04, -3.66)], 0.04, 'acero'),
    ]},
    'erp': {'nombre': 'etiquetadora', 'agujero': (0, -0.15), 'piezas': [
        ('aro', 0, -0.15, 0.1, 0.16, 0.06, 'goma'), ('caja', 0, -1.45, 1.25, 2.2, 0.44, 'color', 0.18),
        ('caja', 0, -0.93, 0.9, 0.44, 0.03, 'pantalla', 0.01, -0.23),
        *[('caja', -0.36 + 0.24 * c, -1.42 - 0.22 * f, 0.18, 0.14, 0.04, 'tecla', 0.02, -0.23) for f in range(4) for c in range(4)],
        ('caja', -0.82, -0.62, 0.5, 0.17, 0.02, 'papel', 0.0),
    ]},
    'servidor': {'nombre': 'llave inglesa', 'agujero': (0, -0.45), 'piezas': [
        ('caja', 0, -1.5, 0.36, 2.6, 0.14, 'acero', 0.06), ('disco', 0, -0.45, 0.08, 0.2, 'hueco'),
        ('caja', 0, -1.4, 0.42, 1.3, 0.2, 'color', 0.08),
        ('poli', [(-0.42, -2.7), (0.42, -2.7), (0.55, -3.05), (0.5, -3.72), (0.2, -3.72), (0.2, -3.22), (-0.2, -3.22), (-0.2, -3.72), (-0.5, -3.72), (-0.55, -3.05)], 0.16, 'acero'),
        ('caja', 0, -2.92, 0.32, 0.12, 0.24, 'laton', 0.02),
    ]},
    'marbella': {'nombre': 'flexómetro', 'agujero': (0, -0.18), 'piezas': [
        ('aro', 0, -0.18, 0.1, 0.16, 0.06, 'acero'), ('caja', 0, -0.98, 1.3, 1.3, 0.56, 'color', 0.32),
        ('disco', 0, -0.98, 0.3, 0.04, 'acero', -0.29), ('caja', 0.02, -0.33, 0.3, 0.1, 0.24, 'goma', 0.03),
        ('caja', -0.35, -2.13, 0.3, 1.04, 0.03, 'cinta', 0.0), ('caja', -0.35, -2.66, 0.36, 0.06, 0.12, 'laton', 0.01),
    ]},
    'vados': {'nombre': 'candado', 'agujero': (0, -0.1), 'piezas': [
        ('aro', 0, -0.4, 0.3, 0.42, 0.12, 'acero'), ('caja', 0, -1.32, 1.15, 1.05, 0.5, 'color', 0.1),
        ('disco', 0, -1.22, 0.09, 0.02, 'hueco', -0.26), ('caja', 0, -1.38, 0.07, 0.22, 0.02, 'hueco', 0, -0.26),
        ('caja', 0, -1.67, 0.8, 0.16, 0.02, 'laton', 0.0, -0.26),
    ]},
    'vision': {'nombre': 'linterna', 'agujero': (0, -0.15), 'piezas': [
        ('aro', 0, -0.15, 0.09, 0.15, 0.05, 'goma'),
        ('torno', 0, [(0.0, -0.25), (0.1, -0.26), (0.17, -0.3), (0.2, -0.38), (0.2, -0.6), (0.19, -0.62)], 'goma'),
        ('torno', 0, [(0.205, -0.6), (0.215, -0.64), (0.215, -2.3), (0.22, -2.36)], 'color'),
        ('caja', 0, -1.15, 0.12, 0.2, 0.06, 'goma', 0.025, -0.21),
        ('torno', 0, [(0.22, -2.34), (0.25, -2.42), (0.35, -2.85), (0.37, -2.95), (0.37, -3.16), (0.35, -3.2)], 'acero'),
        ('torno', 0, [(0.33, -3.202), (0.33, -3.214), (0.0, -3.228)], 'cristal'),
    ]},
}


def prisma(nombre, perfil, fondo, pos, mat, padre=None):
    """Polígono `perfil` [(x, z)…] extruido `fondo` a lo largo de Y."""
    bm = bmesh.new()
    a = [bm.verts.new((x, -fondo / 2, z)) for x, z in perfil]; b = [bm.verts.new((x, fondo / 2, z)) for x, z in perfil]
    n = len(perfil); bm.faces.new(a); bm.faces.new(b[::-1])
    for i in range(n):
        j = (i + 1) % n; bm.faces.new((a[i], b[i], b[j], a[j]))
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    me = bpy.data.meshes.new(nombre); bm.to_mesh(me); bm.free()
    o = K.objeto(nombre, me, padre, mat); o.location = pos
    return o


def torno(nombre, cx, perfil, y, mat, padre, lados=48):
    """Perfil [(r, z)…] girado alrededor del eje vertical x = cx; los costados suaves y las tapas planas."""
    bm = bmesh.new(); anillos = []
    for r, z in perfil:
        if r <= 1e-4:
            anillos.append([bm.verts.new((cx, 0, z))])
        else:
            anillos.append([bm.verts.new((cx + r * math.cos(2 * math.pi * k / lados), r * math.sin(2 * math.pi * k / lados), z)) for k in range(lados)])
    lados_ = []
    for a, b in zip(anillos, anillos[1:]):
        for k in range(lados):
            j = (k + 1) % lados
            if len(a) == 1 and len(b) == 1:
                continue
            if len(a) == 1:
                lados_.append(bm.faces.new((a[0], b[j], b[k])))
            elif len(b) == 1:
                lados_.append(bm.faces.new((a[k], a[j], b[0])))
            else:
                lados_.append(bm.faces.new((a[k], a[j], b[j], b[k])))
    tapas = [bm.faces.new(an) for an in (anillos[0], anillos[-1][::-1]) if len(an) > 1]
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    for f in lados_:
        f.smooth = True
    for f in tapas:
        f.smooth = False
    me = bpy.data.meshes.new(nombre); bm.to_mesh(me); bm.free()
    o = K.objeto(nombre, me, padre, mat); o.location = (0, y, 0)
    return o


def silueta_torno(cx, perfil):
    """El contorno de una pieza de torno vista de frente (para pintar su silueta en la web)."""
    return [(cx + r, z) for r, z in perfil] + [(cx - r, z) for r, z in reversed(perfil)]


def herramienta(id_, m):
    """Monta una herramienta colgada de su gancho. El vacío está en el gancho: girarlo la balancea."""
    h = H[id_]; i = ORDEN.index(id_); gx, gz = hueco(i); ax, az = h['agujero']
    raiz = K.vacio(f'herr_{id_}', (gx, TAB['y'] - GANCHO_Y / 2 - 0.12, gz))
    mats = {**m, 'color': K.material(f'color_{id_}', COLOR[id_], 0.45, capa=0.3)}
    fondo_max = 0
    for k, p in enumerate(h['piezas']):
        t, n = p[0], f'herr_{id_}_{k}'
        if t == 'caja':
            cx, cz, w, al, fo, mat, bis = p[1:8]; y = p[8] if len(p) > 8 else 0
            K.bloque(n, (w, fo, al), (cx - ax, y, cz - az), mats[mat], padre=raiz, bisel=min(bis, w / 2.2, al / 2.2, fo / 2.2) if bis else 0)
        elif t == 'disco':
            cx, cz, r, fo, mat = p[1:6]; y = p[6] if len(p) > 6 else 0
            K.cilindro(n, r, fo, (cx - ax, y, cz - az), mats[mat], padre=raiz, eje='Y', lados=48, bisel=min(0.02, r / 3))
        elif t == 'aro':
            cx, cz, r1, r2, fo, mat = p[1:7]; y = p[7] if len(p) > 7 else 0
            K.tubo(n, r1, r2, fo, (cx - ax, y, cz - az), mats[mat], padre=raiz, eje='Y', lados=64)
        elif t == 'poli':
            per, fo, mat = p[1:4]; y = p[4] if len(p) > 4 else 0
            prisma(n, [(x - ax, z - az) for x, z in per], fo, (0, y, 0), mats[mat], padre=raiz)
        elif t == 'torno':
            cx, per, mat = p[1:4]; y = p[4] if len(p) > 4 else 0
            torno(n, cx - ax, [(r, z - az) for r, z in per], y, mats[mat], raiz)
        fondo_max = max(fondo_max, p[5] if t == 'caja' else 0)
    return raiz


# ───────────────────────── el taller ─────────────────────────
def materiales():
    return {
        'acero': K.material('acero', '#b9bec4', 0.32, metal=0.9), 'laton': K.material('laton', '#c09a55', 0.3, metal=0.85),
        'goma': K.material('goma', '#222326', 0.7), 'hueco': K.material('hueco', '#0d0e10', 0.9),
        'cristal': K.material('cristal', '#9fb6c4', 0.08, capa=1.0), 'pantalla': K.material('pantalla_e', '#25362c', 0.3),
        'tecla': K.material('tecla', '#e9e4da', 0.5), 'papel': K.material('papel_e', '#f6f3ea', 0.8), 'cinta': K.material('cinta', '#f2c230', 0.5),
        'blanco': K.material('blanco', '#ffffff', 0.85), 'pared': K.yeso('pared_m', '#dcd5c8'),
        'roble': K.madera('roble', '#8a6440', '#c49a6a', eje='X', vetas=6), 'pino': K.madera('pino', '#b48c5c', '#dcbf92', eje='Z', vetas=4),
        'hierro': K.material('hierro', '#3d5a4c', 0.45, metal=0.3), 'negro': K.material('negro', '#0b0c0e', 0.35),
        'plastico': K.material('plastico', '#2a2c31', 0.42), 'taza': K.material('taza', '#e8e2d4', 0.25, capa=0.4),
        'caja_r': K.material('caja_r', '#c6452f', 0.5), 'gancho': K.material('gancho', '#a8adb3', 0.35, metal=0.9),
    }


def tablero(m):
    """El panel perforado en diez losetas (una por hueco), el marco de pino, los ganchos y la pared."""
    T = TAB
    K.bloque('pared', (60, 0.2, 30), (0, 0.1, 8), m['pared'], bisel=0)
    K.bloque('taller_tablero_fondo', (T['x1'] - T['x0'], 0.12, T['z1'] - T['z0']), (0, T['y'] + 0.07, (T['z0'] + T['z1']) / 2), m['plastico'], bisel=0)
    W, Hh = T['x1'] - T['x0'], T['z1'] - T['z0']
    for i in range(COLS * FILAS):
        c, f = i % COLS, i // COLS
        x0, x1 = T['x0'] + HUECO_X * c, T['x0'] + HUECO_X * (c + 1)
        z1, z0 = T['z1'] - HUECO_Z * f, T['z1'] - HUECO_Z * (f + 1)
        o = K.lamina(f'tablero_{i}', [(x0, T['y'], z0), (x1, T['y'], z0), (x1, T['y'], z1), (x0, T['y'], z1)], m['blanco'])
        u0, u1 = (x0 - T['x0']) / W, (x1 - T['x0']) / W
        v0, v1 = (z0 - T['z0']) / Hh, (z1 - T['z0']) / Hh
        for k, uv in enumerate([(u0, v0), (u1, v0), (u1, v1), (u0, v1)]):
            o.data.uv_layers['UVMap'].data[k].uv = uv
    # el marco: listones de pino
    g = 0.34
    for n, tam, pos in (('arriba', (W + 2 * g, 0.3, g), (0, T['y'] + 0.02, T['z1'] + g / 2)), ('abajo', (W + 2 * g, 0.3, g), (0, T['y'] + 0.02, T['z0'] - g / 2)),
                        ('izq', (g, 0.3, Hh), (T['x0'] - g / 2, T['y'] + 0.02, (T['z0'] + T['z1']) / 2)), ('der', (g, 0.3, Hh), (T['x1'] + g / 2, T['y'] + 0.02, (T['z0'] + T['z1']) / 2))):
        K.bloque(f'taller_marco_{n}', tam, pos, m['pino'], bisel=0.02)
    # los ganchos: una varilla que sale del tablero y sube en la punta
    for i, id_ in enumerate(ORDEN):
        gx, gz = hueco(i); ax, az = H[id_]['agujero'] if id_ in H else (0, 0)
        y0 = T['y']
        K.cilindro(f'taller_gancho_{i}', 0.045, GANCHO_Y, (gx, y0 - GANCHO_Y / 2, gz + 0.06), m['gancho'], eje='Y', lados=20)
        K.cilindro(f'taller_gancho_{i}_punta', 0.045, 0.2, (gx, y0 - GANCHO_Y + 0.02, gz + 0.14), m['gancho'], eje='Z', lados=20)
        K.cilindro(f'taller_gancho_{i}_base', 0.09, 0.05, (gx, y0 - 0.02, gz + 0.06), m['gancho'], eje='Y', lados=24)


def banco(m):
    """El banco de roble, el tornillo con el monitor de pruebas y lo que hay encima."""
    K.bloque('taller_banco', (30, 7.2, 0.8), (1.5, -3.3, -0.4), m['roble'], bisel=0.03)
    K.bloque('taller_banco_canto', (30, 0.3, 2.0), (1.5, -6.75, -1.4), m['roble'], bisel=0.02)
    K.bloque('suelo', (60, 30, 0.1), (0, -8, -9), m['pared'], bisel=0)
    # el tornillo de banco, verde de taller, con las mordazas apretando el pie del monitor
    M = MONITOR; x, y = M['x'], M['y']
    K.bloque('taller_tornillo_base', (1.5, 1.7, 0.3), (x, y + 0.1, 0.15), m['hierro'], bisel=0.05)
    K.bloque('taller_tornillo_cuerpo', (1.0, 1.4, 0.75), (x, y + 0.3, 0.65), m['hierro'], bisel=0.06)
    for s, dy in (('fija', 0.34), ('movil', -0.34)):
        K.bloque(f'taller_tornillo_{s}', (1.8, 0.24, 0.6), (x, y + dy, 1.25), m['hierro'], bisel=0.04)
        K.bloque(f'taller_tornillo_{s}_chapa', (1.7, 0.04, 0.4), (x, y + dy - (0.14 if dy > 0 else -0.14), 1.3), m['acero'], bisel=0.005)
    K.cilindro('taller_tornillo_husillo', 0.07, 1.6, (x, y - 1.0, 0.85), m['acero'], eje='Y', lados=20)
    K.cilindro('taller_tornillo_palanca', 0.04, 1.4, (x, y - 1.8, 0.85), m['acero'], eje='X', lados=16)
    for dx in (-0.72, 0.72):
        K.esfera(f'taller_tornillo_bola{dx:+.0f}', 0.07, (x + dx, y - 1.8, 0.85), m['acero'])
    # el monitor de pruebas: un panel pequeño con su marco, cogido por el pie
    zc = M['z']; A, Al, mc = M['ancho'], M['alto'], M['marco']
    K.bloque('taller_monitor_pie', (0.8, 0.16, 0.9), (x, y, 1.3), m['plastico'], bisel=0.03)
    K.bloque('taller_monitor_caja', (A + 2 * mc, M['fondo'], Al + 2 * mc), (x, y + 0.02, zc), m['plastico'], bisel=0.05)
    K.lamina('pantalla_cara', [(x - A / 2, y - M['fondo'] / 2 + 0.01, zc - Al / 2), (x + A / 2, y - M['fondo'] / 2 + 0.01, zc - Al / 2),
                               (x + A / 2, y - M['fondo'] / 2 + 0.01, zc + Al / 2), (x - A / 2, y - M['fondo'] / 2 + 0.01, zc + Al / 2)], m['negro'])
    K.cilindro('taller_monitor_cable', 0.03, 2.2, (x + 1.2, y + 0.4, 0.3), m['goma'], eje='X', lados=12).rotation_euler = (0, 0, R(30))
    # lo de encima del banco: una taza, una caja de tornillos y un lápiz de carpintero
    K.tubo('taller_taza', 0.28, 0.32, 0.62, (-6.2, -2.0, 0.31), m['taza'], eje='Z', lados=48)
    K.cilindro('taller_taza_fondo', 0.29, 0.05, (-6.2, -2.0, 0.03), m['taza'], eje='Z', lados=48)
    K.toro('taller_taza_asa', 0.16, 0.04, (-6.2 + 0.38, -2.0, 0.32), m['taza'], eje='Y')
    K.bloque('taller_cajita', (1.6, 1.0, 0.45), (-3.2, -1.4, 0.225), m['caja_r'], bisel=0.03)
    K.bloque('taller_cajita_tapa', (1.64, 1.04, 0.08), (-3.2, -1.4, 0.49), m['caja_r'], bisel=0.02)
    K.bloque('taller_lapiz', (1.5, 0.12, 0.06), (2.0, -4.6, 0.03), m['cinta'], bisel=0.01).rotation_euler = (0, 0, R(-14))
    K.bloque('taller_listones', (3.4, 0.5, 0.25), (-11.0, -2.0, 0.125), m['pino'], bisel=0.02)
    K.bloque('taller_listones_2', (3.0, 0.45, 0.22), (-10.8, -2.1, 0.36), m['pino'], bisel=0.02).rotation_euler = (0, 0, R(4))


def luces():
    # la ventana, a la izquierda: sol de mañana rasante sobre el tablero
    sol = bpy.data.lights.new('sol', 'SUN'); sol.energy = 3.2; sol.angle = R(3.0); sol.color = (1.0, 0.9, 0.76)
    o = bpy.data.objects.new('sol', sol); bpy.context.scene.collection.objects.link(o)
    o.rotation_euler = (Vector((0, 0, 0)) - Vector((-1.0, -0.9, 0.7))).to_track_quat('-Z', 'Y').to_euler()
    # el tubo del techo, delante del tablero, y un relleno frío desde la puerta
    K.area('tubo', (0, -5.5, 14), (0, -1, 6), 1800, (1.0, 0.97, 0.92), 14, 1.2)
    K.area('relleno', (10, -18, 6), (0, 0, 5), 900, (0.85, 0.9, 1.0), 12)
    K.mundo('#b9bcc2', 0.25)


def datos():
    return {'tablero': TAB, 'cols': COLS, 'filas': FILAS, 'hueco_x': HUECO_X, 'hueco_z': HUECO_Z, 'agujeros': AGUJEROS, 'orden': ORDEN,
            'huecos': [hueco(i) for i in range(len(ORDEN))], 'monitor': MONITOR,
            'herramientas': {k: {'agujero': v['agujero'], 'nombre': v['nombre'],
                                 # la web pinta las siluetas con caja, disco, aro y poli: el torno va como su contorno
                                 'piezas': [('poli', silueta_torno(p[1], p[2]), 0.1, p[3]) if p[0] == 'torno' else p for p in v['piezas']]}
                             for k, v in H.items()}}


def escena():
    m = materiales()
    tablero(m); banco(m); luces()
    herr = {id_: herramienta(id_, m) for id_ in H}
    return m, herr


def foto(nombre, pos, mira, lente):
    K.ajustes(1440, 900, MUESTRAS)
    K.camara(pos, mira, lente)
    bpy.context.scene.render.filepath = os.path.join(DESTINO, nombre + '.png')
    bpy.ops.render.render(write_still=True)


METAL = re.compile(r'^taller_(gancho|tornillo_(husillo|palanca|bola|fija_chapa|movil_chapa))')   # el mismo que en la web


def unir_para_la_web(todo):
    """Ya horneado, lo que se mueve junto se exporta como una sola malla (una llamada de dibujo cada una): cada
    herramienta entera bajo su vacío; el taller, en lo metálico y lo demás (llevan brillo distinto); el tablero sin
    sus losetas (cada loseta tiene su material en la web) y la pared con el suelo. Las UV de luz viajan con cada cara."""
    def raiz(o):
        a = o
        while a.parent is not None and a.parent.name.startswith('herr_'):
            a = a.parent
        return a if a is not o else None
    comun = K.gris('para_la_web')
    grupos = {}
    for o in todo:
        n = o.name
        if re.match(r'^tablero_\d+$', n) or n == 'pantalla_cara':
            continue
        if n.startswith('herr_') and raiz(o) is not None:
            a = raiz(o); nombre = f'{a.name}_unida'
        elif n.startswith('tablero_'):
            a, nombre = None, 'tablero_unido'
        elif n.startswith('taller_'):
            a, nombre = None, 'taller_gancho_unido' if METAL.match(n) else 'taller_unido'
        elif n.startswith(('pared', 'suelo')):
            a, nombre = None, 'pared_unida'
        else:
            continue
        grupos.setdefault((a, nombre), []).append(o)
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
    m, herr = escena()
    if 'vista' in RESTO:
        m['blanco'].node_tree.nodes['Principled BSDF'].inputs['Base Color'].default_value = K.srgb('#3c464e')   # sin el canvas
        return foto('vista', (1.2, -30, 7.4), (1.2, 0, 5.6), 40)
    import time
    t0 = time.time(); reloj = lambda *x: print(f'[{time.time() - t0:7.1f} s]', *x, flush=True)  # noqa: E731
    K.preparar(); reloj('preparado')
    K.ajustes(64, 64, MUESTRAS)
    horno = K.Horno(DESTINO)
    todo = K.mallas()
    nombres = lambda *pre: [o for o in todo if o.name.startswith(pre)]  # noqa: E731
    g = {'tablero': nombres('tablero_'), 'taller': nombres('taller_'), 'pared': nombres('pared', 'suelo'),
         'herramientas': nombres('herr_')}
    for clave, objs in g.items():
        K.desplegar(objs, 0.003 if clave in ('herramientas', 'taller') else 0.006)
        reloj('desplegado', clave, len(objs), 'piezas', sum(len(o.data.polygons) for o in objs), 'caras')
    if 'medir' in RESTO:
        import collections
        tri = lambda o: sum(len(pl.vertices) - 2 for pl in o.data.polygons)  # noqa: E731
        por_tipo = collections.Counter()
        for o in todo:
            por_tipo[re.sub(r'\d+$|_\d+$', '', o.name)] += tri(o)
        print('TRIANGULOS', sum(tri(o) for o in todo), 'MALLAS', len(todo), flush=True)
        for k, v in por_tipo.most_common(25):
            print(f'TIPO {v:7d} {k}', flush=True)
        return

    def hornear(objs, nombre, *a, **k):     # unidas: pieza a pieza, una lámina de 4096 con muchas piezas no acaba
        horno.hornear_junto(objs, nombre, *a, **k); reloj('horneado', nombre)
    hornear(g['taller'], 'taller', 4096, color=True, publicar=2048)
    hornear(g['pared'], 'pared', 1024, color=True)
    hornear(g['tablero'], 'tablero_con', 2048, color=True, pareja='tablero')
    for o in g['herramientas']:
        o.hide_render = True
    hornear(g['tablero'], 'tablero_sin', 2048, color=True, pareja='tablero')
    # las herramientas viajan: se hornean en el estudio, solas
    for o in bpy.context.scene.objects:
        if o.type in ('MESH', 'LIGHT'):
            o.hide_render = o not in g['herramientas']
    bpy.context.scene.world = K.mundo_estudio()
    hornear(g['herramientas'], 'herramientas', 2048, color=True)
    for o in bpy.context.scene.objects:
        o.hide_render = False
    unir_para_la_web(todo); reloj('unido', len(K.mallas()), 'mallas')
    horno.exportar(datos()); reloj('exportado')


principal()
