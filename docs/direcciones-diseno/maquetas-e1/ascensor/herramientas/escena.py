"""El ascensor: un edificio de oficinas de los años treinta con una planta por proyecto y un ascensor de cabina.

  pesado.sh --cola gpu ascensor-e1 -- <python con bpy> escena.py <carpeta> [muestras] [vista|vista_planta|vista_pantalla|comprobar]

Desde dentro de la cabina (nogal, latón y una cancela de tijera) se ve el rellano de cada planta: en el vestíbulo, el
directorio del edificio con las nueve plantas; en cada planta, la puerta del despacho con el nombre del proyecto en el
cristal, un tablón con su ficha a la izquierda y una pantalla a la derecha (ahí se ven las demos). Arriba, la planta 10,
en obras: «aquí va el siguiente».

La cabina se mueve y el edificio no: la luz de la cabina se hornea sola, con su plafón; la de cada planta, con la
cabina quitada (`p<k>`, una por planta) y la del hueco entre plantas aparte (`hueco`). La cancela se hornea cerrada;
la web pliega sus barras una a una y encoge los tramos de tijera de entre medias.
"""
import math
import os
import re
import sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '../../../kit-e1/herramientas'))
import kit as K  # noqa: E402

_bloque = K.bloque


def _bloque_ligero(nombre, tam, pos, mat, padre=None, bisel=0.006, segmentos=3):
    """Biseles de dos segmentos (uno en las piezas de menos de 30 cm): a la distancia de la cabina, el tercero no se
    distingue y, sumado en once plantas, pesaba en la web sin gráfica."""
    return _bloque(nombre, tam, pos, mat, padre=padre, bisel=bisel, segmentos=1 if max(tam) < 3.0 else min(segmentos, 2))


K.bloque = _bloque_ligero
import bpy  # noqa: E402
import bmesh  # noqa: E402
from mathutils import Vector  # noqa: E402

DESTINO, MUESTRAS, RESTO = K.argumentos()
R = K.R

# ── Medidas (1 = 10 cm). El suelo del vestíbulo está en z = 0; la planta k, en z = k · PISO ──
PISO, PLANTAS = 34.0, 11                       # vestíbulo (0), nueve proyectos (1–9) y la planta en obras (10)
CAB = {'x0': -10.0, 'x1': 10.0, 'y0': -12.0, 'y1': 6.0, 'alto': 25.0}           # la cabina, por dentro
HUECO = {'x0': -8.0, 'x1': 2.5, 'alto': 21.0}          # la boca de la cabina: a la izquierda; a la derecha, la botonera
CANCELA = {'y': 5.5, 'x0': -7.8, 'x1': 2.3, 'z0': 0.3, 'z1': 20.7, 'barras': 9, 'rombos': 6, 'plegada': 0.4}
MURO = {'y0': 7.2, 'y1': 9.2, 'x0': -8.5, 'x1': 3.0, 'alto': 21.5}             # el muro del hueco y su boca en cada planta
RELLANO = {'y0': 9.2, 'y1': 49.2, 'x0': -30.0, 'x1': 30.0, 'techo': 29.0}
EJE = -2.75                                    # el centro de la boca: el rellano se ordena alrededor
PUERTA = {'x': EJE, 'ancho': 10.0, 'alto': 22.0}
TABLON = {'x': EJE - 18.0, 'z': 15.0, 'ancho': 14.0, 'alto': 10.0}
PANTALLA = {'x': EJE + 18.0, 'z': 15.5, 'ancho': 16.0, 'alto': 9.0}
ESFERA = {'x': EJE, 'z': 21.9, 'r': 2.6}       # el indicador de planta, encima de la boca
BOTONERA = {'x': 6.4, 'z': 12.2, 'ancho': 6.0, 'alto': 14.0, 'fila': 1.12}   # hace de índice: cada botón con su planta al lado
ORDEN = ['adivinadle', 'wardux', 'calculo', 'agentes', 'erp', 'servidor', 'marbella', 'vados', 'vision']
COLOR = {'adivinadle': '#1B2140', 'wardux': '#9E3A26', 'calculo': '#17583F', 'agentes': '#4A2F78', 'erp': '#17656A',
         'servidor': '#1C47A0', 'marbella': '#C5612A', 'vados': '#B8901C', 'vision': '#94295F'}
# la botonera: una columna, de arriba abajo 10, 9 … 1, V y la campana de alarma
BOTONES = [('V', 0), ('1', 1), ('2', 2), ('3', 3), ('4', 4), ('5', 5), ('6', 6), ('7', 7), ('8', 8), ('9', 9), ('10', 10), ('campana', None)]


def mezclar(a, b, t):
    ca, cb = [int(a[i:i + 2], 16) for i in (1, 3, 5)], [int(b[i:i + 2], 16) for i in (1, 3, 5)]
    return '#' + ''.join(f'{round(x + (y - x) * t):02x}' for x, y in zip(ca, cb))


def boton_xz(k):
    """Centro del botón k de BOTONES (en la cara del frente de la cabina): la planta 10 arriba, la campana abajo."""
    b = BOTONERA; fila = 10 - BOTONES[k][1] if BOTONES[k][1] is not None else 11
    return b['x'] - b['ancho'] / 2 + 0.8, b['z'] + b['alto'] / 2 - 0.75 - fila * b['fila']


# ───────────────────────── piezas propias ─────────────────────────
def baldosa(nombre, claro, oscuro, lado=4.0, rugo=0.3, capa=0.25):
    """Suelo de baldosas en damero (coordenadas del objeto: sigue a la pieza)."""
    m = K.material(nombre, claro, rugo, capa=capa); n = m.node_tree.nodes; l = m.node_tree.links
    p = n['Principled BSDF']; co = n.new('ShaderNodeTexCoord'); ch = n.new('ShaderNodeTexChecker')
    ch.inputs['Scale'].default_value = 1.0 / lado
    ch.inputs['Color1'].default_value = K.srgb(claro); ch.inputs['Color2'].default_value = K.srgb(oscuro)
    ru = n.new('ShaderNodeTexNoise'); ru.inputs['Scale'].default_value = 0.6; ru.inputs['Detail'].default_value = 6
    mx = n.new('ShaderNodeMix'); mx.data_type = 'RGBA'; mx.blend_type = 'MULTIPLY'; mx.inputs['Factor'].default_value = 0.12
    l.new(co.outputs['Object'], ch.inputs['Vector']); l.new(ch.outputs['Color'], mx.inputs['A'])
    l.new(ru.outputs['Color'], mx.inputs['B']); l.new(mx.outputs['Result'], p.inputs['Base Color'])
    return m


def varilla(bm, a, b, ancho, grueso, y):
    """Pletina recta de `a` a `b` (puntos del plano XZ), de `ancho` en el plano y `grueso` en Y."""
    a, b = Vector((a[0], 0, a[1])), Vector((b[0], 0, b[1]))
    d = (b - a).normalized(); nrm = Vector((-d.z, 0, d.x)) * ancho / 2
    vs = []
    for p in (a - nrm, b - nrm, b + nrm, a + nrm):
        for dy in (-grueso / 2, grueso / 2):
            vs.append(bm.verts.new((p.x, y + dy, p.z)))
    f = lambda *i: bm.faces.new([vs[k] for k in i])  # noqa: E731
    f(0, 2, 4, 6); f(1, 7, 5, 3); f(0, 1, 3, 2); f(2, 3, 5, 4); f(4, 5, 7, 6); f(6, 7, 1, 0)


def malla(nombre, construir, mat, padre=None, pos=(0, 0, 0)):
    bm = bmesh.new(); construir(bm)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    me = bpy.data.meshes.new(nombre); bm.to_mesh(me); bm.free()
    o = K.objeto(nombre, me, padre, mat); o.location = pos
    return o


def lamina_xz(nombre, cx, y, cz, ancho, alto, mat, padre=None, mira=-1, celda=None):
    """Lámina vertical en el plano XZ que mira a -Y (mira=-1) o a +Y. `celda` = (i, cols, filas) para un atlas."""
    x0, x1 = (cx - ancho / 2, cx + ancho / 2) if mira < 0 else (cx + ancho / 2, cx - ancho / 2)
    o = K.lamina(nombre, [(x0, y, cz - alto / 2), (x1, y, cz - alto / 2), (x1, y, cz + alto / 2), (x0, y, cz + alto / 2)], mat, padre)
    if celda:
        i, cols, filas = celda; c, f = i % cols, i // cols
        u0, u1, v1, v0 = c / cols, (c + 1) / cols, 1 - f / filas, 1 - (f + 1) / filas
        for k, uv in enumerate([(u0, v0), (u1, v0), (u1, v1), (u0, v1)]):
            o.data.uv_layers['UVMap'].data[k].uv = uv
    return o


def marco(nombre, cx, y, cz, ancho, alto, g, fondo, mat, padre=None, bisel=0.06):
    """Cuatro listones alrededor de un hueco de `ancho` × `alto` (por fuera del hueco)."""
    for n, tam, pos in (('a', (ancho + 2 * g, fondo, g), (cx, y, cz + alto / 2 + g / 2)), ('b', (ancho + 2 * g, fondo, g), (cx, y, cz - alto / 2 - g / 2)),
                        ('i', (g, fondo, alto), (cx - ancho / 2 - g / 2, y, cz)), ('d', (g, fondo, alto), (cx + ancho / 2 + g / 2, y, cz))):
        K.bloque(f'{nombre}_{n}', tam, pos, mat, padre=padre, bisel=bisel)


# ───────────────────────── los materiales ─────────────────────────
def materiales():
    m = {
        'nogal': K.madera('nogal', '#3b2216', '#6e4329', eje='Z', vetas=3.5), 'nogal_h': K.madera('nogal_h', '#3b2216', '#6e4329', eje='X', vetas=3.5),
        'laton': K.material('laton', '#c9a15a', 0.26, metal=0.9), 'laton_mate': K.material('laton_mate', '#b48f50', 0.45, metal=0.8),
        'hierro': K.material('hierro', '#1d1f22', 0.42, metal=0.6), 'hormigon': K.yeso('hormigon', '#7d7a74'),
        'techo': K.yeso('techo', '#efe9df'), 'blanco': K.material('blanco', '#f4f1ea', 0.6), 'negro': K.material('negro', '#0b0c0e', 0.4),
        'fieltro': K.material('fieltro', '#17181a', 0.95), 'corcho': K.material('corcho', '#b88a58', 0.9),
        'cristal': K.material('cristal_e', '#e8e4da', 0.35), 'globo': K.material('globo', '#fbf4e6', 0.3, emision='#fff1d6', fuerza=4.0),
        'marmol': baldosa('marmol', '#e9e2d4', '#20232a', lado=4.0), 'mar_cab': baldosa('mar_cab', '#e4dccb', '#7a2a1e', lado=2.0),
        'lona': K.material('lona', '#c8c2b5', 0.8), 'pino': K.madera('pino', '#a98455', '#d8bb8c', eje='X', vetas=4),
        'cinta': K.material('cinta_obra', '#e6b422', 0.5), 'plafon': K.material('plafon', '#fff6e6', 0.4, emision='#fff3dc', fuerza=6.0),
    }
    for id_, c in COLOR.items():
        m['pared_' + id_] = K.yeso('pared_' + id_, mezclar(c, '#efe6d6', 0.72))
        m['zocalo_' + id_] = K.material('zocalo_' + id_, mezclar(c, '#1a1712', 0.15), 0.5, capa=0.3)
        m['suelo_' + id_] = baldosa('suelo_' + id_, '#ece4d4', mezclar(c, '#1a1712', 0.1), lado=3.0)
    return m


# ───────────────────────── la cabina ─────────────────────────
def cabina(m):
    """Todo cuelga de `cabina` (la web la sube y la baja). El frente, de nogal con la boca en medio."""
    raiz = K.vacio('cabina', (0, 0, 0))
    c, h = CAB, HUECO
    W, F = c['x1'] - c['x0'], c['y1'] - c['y0']; hx = (h['x0'] + h['x1']) / 2
    K.bloque('cab_suelo', (W, F, 0.6), (0, (c['y0'] + c['y1']) / 2, -0.3), m['mar_cab'], padre=raiz, bisel=0)
    K.bloque('cab_techo', (W, F, 0.6), (0, (c['y0'] + c['y1']) / 2, c['alto'] + 0.3), m['techo'], padre=raiz, bisel=0)
    K.bloque('cab_plafon', (8.0, 6.0, 0.25), (0, -3.0, c['alto'] - 0.12), m['plafon'], padre=raiz, bisel=0.08)
    # paredes de nogal con paneles: el fondo y los costados, con su pasamanos de latón
    for lado, x in (('i', c['x0'] - 0.3), ('d', c['x1'] + 0.3)):
        K.bloque(f'cab_pared_{lado}', (0.6, F, c['alto']), (x, (c['y0'] + c['y1']) / 2, c['alto'] / 2), m['nogal'], padre=raiz, bisel=0)
        xi = c['x0'] + 0.06 if lado == 'i' else c['x1'] - 0.06
        for k, (y0, y1) in enumerate(((c['y0'] + 1.0, -3.6), (-2.6, c['y1'] - 1.2))):
            for z0, z1 in ((1.2, 8.4), (10.0, 23.4)):
                K.bloque(f'cab_panel_{lado}{k}_{int(z0)}', (0.2, y1 - y0, z1 - z0), (xi, (y0 + y1) / 2, (z0 + z1) / 2), m['nogal_h'], padre=raiz, bisel=0.08)
        xp = c['x0'] + 1.0 if lado == 'i' else c['x1'] - 1.0
        K.cilindro(f'cab_pasamanos_{lado}', 0.22, F - 3.0, (xp, (c['y0'] + c['y1']) / 2 - 0.5, 9.2), m['laton'], padre=raiz, eje='Y', lados=32)
        for y in (c['y0'] + 2.0, c['y1'] - 3.0):
            K.cilindro(f'cab_pasamanos_{lado}_s{int(y)}', 0.12, 0.9, ((xp + (c['x0'] if lado == 'i' else c['x1'])) / 2, y, 9.2), m['laton'], padre=raiz, eje='X', lados=20)
    K.bloque('cab_pared_fondo', (W + 1.2, 0.6, c['alto']), (0, c['y0'] - 0.3, c['alto'] / 2), m['nogal'], padre=raiz, bisel=0)
    # el frente: nogal a los lados de la boca y encima, con el marco de latón
    yf = c['y1'] + 0.3
    for lado, x0, x1 in (('i', c['x0'], h['x0']), ('d', h['x1'], c['x1'])):
        K.bloque(f'cab_frente_{lado}', (x1 - x0, 0.6, c['alto']), ((x0 + x1) / 2, yf, c['alto'] / 2), m['nogal'], padre=raiz, bisel=0)
    K.bloque('cab_frente_dintel', (h['x1'] - h['x0'], 0.6, c['alto'] - h['alto']), (hx, yf, (c['alto'] + h['alto']) / 2), m['nogal'], padre=raiz, bisel=0)
    g = 0.45
    for n, tam, pos in (('a', (h['x1'] - h['x0'] + 2 * g, 0.5, g), (hx, c['y1'] - 0.2, h['alto'] + g / 2)),
                        ('i', (g, 0.5, h['alto']), (h['x0'] - g / 2, c['y1'] - 0.2, h['alto'] / 2)),
                        ('d', (g, 0.5, h['alto']), (h['x1'] + g / 2, c['y1'] - 0.2, h['alto'] / 2))):
        K.bloque(f'cab_boca_{n}', tam, pos, m['laton'], padre=raiz, bisel=0.08)
    K.bloque('cab_umbral', (h['x1'] - h['x0'] + 0.6, 1.6, 0.12), (hx, c['y1'] - 0.1, 0.06), m['laton_mate'], padre=raiz, bisel=0.03)
    # la esfera de planta: media luna de latón con los números y la aguja (la aguja gira en la web)
    ez = ESFERA['z']; y_e = c['y1'] - 0.42
    malla('cab_esfera', lambda bm: media_luna(bm, ESFERA['r'] + 0.3, 0.5, y_e + 0.25), m['laton'], padre=raiz, pos=(ESFERA['x'], 0, ez))
    media_luna_lamina('esfera_cara', ESFERA['x'], ESFERA['r'], y_e - 0.02, ez, m['blanco'], raiz)
    aguja = K.vacio('aguja', (ESFERA['x'], y_e - 0.12, ez), padre=raiz)
    malla('cab_aguja', lambda bm: varilla(bm, (0, -0.3), (0, ESFERA['r'] - 0.35), 0.16, 0.06, 0), m['hierro'], padre=aguja)
    K.cilindro('cab_aguja_eje', 0.22, 0.14, (0, -0.06, 0), m['laton'], padre=aguja, eje='Y', lados=24)
    # la botonera, a la derecha de la boca, y encima de ella el certificado de la revisión
    yb = c['y1'] - 0.02
    bx, bz, bw, bh = BOTONERA['x'], BOTONERA['z'], BOTONERA['ancho'], BOTONERA['alto']
    K.bloque('cab_botonera', (bw, 0.24, bh), (bx, yb - 0.1, bz), m['laton'], padre=raiz, bisel=0.12)
    lamina_xz('botonera_cara', bx, yb - 0.23, bz, bw - 0.3, bh - 0.3, m['blanco'], raiz)
    for k, (et, _) in enumerate(BOTONES):
        x, z = boton_xz(k)
        K.tubo(f'cab_bisel_{k}', 0.36, 0.5, 0.16, (x, yb - 0.3, z), m['laton'], padre=raiz, eje='Y', lados=24)
        K.cilindro(f'boton_{k}', 0.36, 0.22, (x, yb - 0.32, z), m['blanco'] if et != 'campana' else m['zocalo_wardux'], padre=raiz, eje='Y', lados=24, bisel=0.06)
        # su número, grabado en la cara (un cuadrado que no pasa del canto redondeado: 0,42 de lado)
        lamina_xz(f'botonnum_{k}', x, yb - 0.44, z, 0.42, 0.42, m['blanco'], raiz, celda=(k, 4, 3))
    K.bloque('cab_certificado', (3.0, 0.16, 4.4), (bx, yb - 0.08, 22.1), m['laton'], padre=raiz, bisel=0.08)
    lamina_xz('certificado_cara', bx, yb - 0.17, 22.1, 2.6, 4.0, m['blanco'], raiz)
    return raiz


def media_luna(bm, r, grueso, y, lados=48):
    """Media corona de latón (el canto de la esfera): de 180° a 0°, con un borde abajo."""
    dentro = r - 0.32
    pts = [(math.cos(math.pi * i / lados), math.sin(math.pi * i / lados)) for i in range(lados + 1)]
    for (a0, b0), (a1, b1) in zip(pts, pts[1:]):
        varilla(bm, (a0 * (r + dentro) / 2, b0 * (r + dentro) / 2), (a1 * (r + dentro) / 2, b1 * (r + dentro) / 2), r - dentro, grueso, y)
    varilla(bm, (-r, -0.1), (r, -0.1), 0.34, grueso, y)


def media_luna_lamina(nombre, cx, r, y, cz, mat, padre, lados=48):
    """La cara de la esfera: un semicírculo plano que mira a -Y, con coordenadas para pintarlo (u = x, v = z)."""
    bm = bmesh.new(); uvl = bm.loops.layers.uv.new('UVMap')
    c = bm.verts.new((cx, y, cz)); borde = [bm.verts.new((cx + r * math.cos(math.pi * i / lados), y, cz + r * math.sin(math.pi * i / lados))) for i in range(lados + 1)]
    for a, b in zip(borde, borde[1:]):
        f = bm.faces.new((c, b, a))
        for lp in f.loops:
            lp[uvl].uv = (0.5 + (lp.vert.co.x - cx) / (2 * r), (lp.vert.co.z - cz) / r)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    for f in bm.faces:
        if f.normal.y > 0:
            f.normal_flip()
    me = bpy.data.meshes.new(nombre); bm.to_mesh(me); bm.free()
    return K.objeto(nombre, me, padre, mat)


def cancela(m, raiz):
    """La cancela de tijera, cerrada: barras verticales (cada una su pieza, la web las corre) y entre cada dos, un
    tramo de rombos (una pieza por tramo, la web lo encoge)."""
    cg = CANCELA; n = cg['barras']; paso = (cg['x1'] - cg['x0']) / (n - 1); alto = cg['z1'] - cg['z0']
    for i in range(n):
        x = cg['x0'] + i * paso
        K.bloque(f'cancela_b{i}', (0.32, 0.22, alto), (x, cg['y'], (cg['z0'] + cg['z1']) / 2), m['hierro'], padre=raiz, bisel=0.05)
        for z in (cg['z0'] + 0.5, cg['z1'] - 0.5):
            K.cilindro(f'cancela_b{i}_r{int(z)}', 0.2, 0.36, (x, cg['y'], z), m['laton'], padre=raiz, eje='Y', lados=20)
    rom = cg['rombos']; h = alto / rom
    for i in range(n - 1):
        x0 = cg['x0'] + i * paso
        def tramo(bm, x0=x0):
            for k in range(rom):
                z0 = cg['z0'] + k * h
                varilla(bm, (0, z0), (paso, z0 + h), 0.2, 0.08, -0.08)
                varilla(bm, (paso, z0), (0, z0 + h), 0.2, 0.08, 0.08)
        # el origen, en la barra de la izquierda del tramo: encogerlo en X lo pliega hacia ella
        malla(f'cancela_d{i}', tramo, m['hierro'], padre=raiz, pos=(x0, cg['y'], 0))
    K.bloque('cancela_riel', (cg['x1'] - cg['x0'] + 1.2, 0.5, 0.35), ((cg['x0'] + cg['x1']) / 2, cg['y'], cg['z1'] + 0.35), m['laton_mate'], padre=raiz, bisel=0.05)


# ───────────────────────── el edificio ─────────────────────────
def muro_hueco(m):
    """El muro del hueco, de hormigón, con una boca en cada planta y su número pintado encima."""
    mu = MURO; W = 26.0
    for k in range(PLANTAS):
        z = k * PISO
        K.bloque(f'hueco_{k}_i', ((W / 2 + mu['x0']), mu['y1'] - mu['y0'], PISO), ((-W / 2 + mu['x0']) / 2, (mu['y0'] + mu['y1']) / 2, z + PISO / 2), m['hormigon'], bisel=0)
        K.bloque(f'hueco_{k}_d', ((W / 2 - mu['x1']), mu['y1'] - mu['y0'], PISO), ((W / 2 + mu['x1']) / 2, (mu['y0'] + mu['y1']) / 2, z + PISO / 2), m['hormigon'], bisel=0)
        K.bloque(f'hueco_{k}_s', (mu['x1'] - mu['x0'], mu['y1'] - mu['y0'], PISO - mu['alto']), ((mu['x0'] + mu['x1']) / 2, (mu['y0'] + mu['y1']) / 2, z + (mu['alto'] + PISO) / 2), m['hormigon'], bisel=0)
        # el canto de latón de la boca, por el lado del rellano
        marco(f'hueco_{k}_marco', (mu['x0'] + mu['x1']) / 2, mu['y1'] + 0.15, z + mu['alto'] / 2, mu['x1'] - mu['x0'], mu['alto'], 0.6, 0.3, m['laton_mate'], bisel=0.06)
        lamina_xz(f'numero_{k}', EJE, mu['y0'] - 0.02, z + mu['alto'] + 4.5, 4.0, 4.0, m['blanco'], celda=(k, 4, 3))
    # el fondo del hueco (detrás de la cabina) y los costados, para que en el viaje no se vea el vacío
    alto = PLANTAS * PISO
    K.bloque('hueco_fondo', (26.0, 0.6, alto), (0, CAB['y0'] - 2.0, alto / 2), m['hormigon'], bisel=0)
    for lado, x in (('i', -13.0), ('d', 13.0)):
        K.bloque(f'hueco_lado_{lado}', (0.6, MURO['y0'] - CAB['y0'] + 2.0, alto), (x, (MURO['y0'] + CAB['y0'] - 2.0) / 2, alto / 2), m['hormigon'], bisel=0)


def rellano(k, m):
    """Planta k (1–9): suelo de baldosa, paredes del color del proyecto con zócalo, la puerta del despacho, el tablón y la
    pantalla. Todo en `p<k>_…`."""
    id_ = ORDEN[k - 1]; z = k * PISO; r = RELLANO; pre = f'p{k}'
    suelo, pared, zocalo = m['suelo_' + id_], m['pared_' + id_], m['zocalo_' + id_]
    caja(pre, z, suelo, pared, m['techo'])
    yb = r['y1']
    # zócalo con su moldura, en el fondo y los costados
    K.bloque(f'{pre}_zocalo_f', (r['x1'] - r['x0'], 0.4, 9.0), (0, yb - 0.2, z + 4.5), zocalo, bisel=0.04)
    K.bloque(f'{pre}_moldura_f', (r['x1'] - r['x0'], 0.7, 0.5), (0, yb - 0.35, z + 9.2), m['nogal_h'], bisel=0.12)
    for lado, x, s in (('i', r['x0'], 1), ('d', r['x1'], -1)):
        K.bloque(f'{pre}_zocalo_{lado}', (0.4, r['y1'] - r['y0'], 9.0), (x + s * 0.2, (r['y0'] + r['y1']) / 2, z + 4.5), zocalo, bisel=0.04)
        K.bloque(f'{pre}_moldura_{lado}', (0.7, r['y1'] - r['y0'], 0.5), (x + s * 0.35, (r['y0'] + r['y1']) / 2, z + 9.2), m['nogal_h'], bisel=0.12)
    # la puerta del despacho: nogal abajo, cristal esmerilado arriba con el nombre pintado (la web lo pinta)
    P = PUERTA; yp = yb - 0.6
    marco(f'{pre}_puerta_marco', P['x'], yp, z + P['alto'] / 2, P['ancho'], P['alto'], 0.9, 1.2, m['nogal_h'], bisel=0.1)
    K.bloque(f'{pre}_puerta_hoja', (P['ancho'], 0.5, P['alto']), (P['x'], yb - 0.25, z + P['alto'] / 2), m['nogal'], bisel=0.05)
    K.bloque(f'{pre}_puerta_peinazo', (P['ancho'] - 1.2, 0.3, 0.8), (P['x'], yb - 0.6, z + 10.2), m['nogal_h'], bisel=0.08)
    for x in (P['x'] - P['ancho'] / 4, P['x'] + P['ancho'] / 4):
        K.bloque(f'{pre}_puerta_cuarteron{int(x)}', (P['ancho'] / 2 - 1.4, 0.24, 7.6), (x, yb - 0.56, z + 5.2), m['nogal_h'], bisel=0.12)
    lamina_xz(f'puerta_{k}_cristal', P['x'], yb - 0.55, z + 16.2, P['ancho'] - 1.4, 10.4, m['cristal'], celda=(k - 1, 3, 3))
    K.cilindro(f'{pre}_pomo', 0.45, 0.9, (P['x'] + P['ancho'] / 2 - 1.2, yb - 1.0, z + 10.2), m['laton'], eje='Y', lados=32, bisel=0.15)
    K.bloque(f'{pre}_bocallave', (0.5, 0.12, 1.2), (P['x'] + P['ancho'] / 2 - 1.2, yb - 0.56, z + 8.7), m['laton'], bisel=0.05)
    # el tablón de corcho (ahí va la ficha) y la pantalla con marco de latón (ahí, la demo)
    T = TABLON
    K.bloque(f'{pre}_tablon', (T['ancho'], 0.5, T['alto']), (T['x'], yb - 0.25, z + T['z']), m['corcho'], bisel=0.03)
    marco(f'{pre}_tablon_marco', T['x'], yb - 0.4, z + T['z'], T['ancho'], T['alto'], 0.6, 0.8, m['nogal_h'], bisel=0.1)
    lamina_xz(f'tablon_{k}_cara', T['x'], yb - 0.52, z + T['z'], T['ancho'] - 0.2, T['alto'] - 0.2, m['blanco'], celda=(k - 1, 3, 3))
    S = PANTALLA
    K.bloque(f'{pre}_pantalla_caja', (S['ancho'] + 1.4, 1.2, S['alto'] + 1.4), (S['x'], yb - 0.6, z + S['z']), m['negro'], bisel=0.2)
    marco(f'{pre}_pantalla_marco', S['x'], yb - 1.25, z + S['z'], S['ancho'] + 0.2, S['alto'] + 0.2, 0.5, 0.3, m['laton'], bisel=0.08)
    lamina_xz(f'pantalla_{k}_cara', S['x'], yb - 1.22, z + S['z'], S['ancho'], S['alto'], m['negro'])
    # el plafón de globo, colgado del techo
    lampara(pre, z, m)
    # en la pared de la boca, a los lados: dos apliques de latón (dan luz al rellano visto de frente)
    for x in (EJE - 11.0, EJE + 11.0):
        K.cilindro(f'{pre}_aplique_{int(x)}', 0.7, 0.4, (x, r['y0'] + 0.2, z + 17.0), m['laton'], eje='Y', lados=32)
        K.esfera(f'{pre}_aplique_{int(x)}_globo', 0.85, (x, r['y0'] + 1.1, z + 17.0), m['globo'], escala=(1, 1, 1.25), segmentos=(20, 12))
    luces_planta(pre, z)


def caja(pre, z, suelo, pared, techo):
    r = RELLANO; W, F = r['x1'] - r['x0'], r['y1'] - r['y0']; yc = (r['y0'] + r['y1']) / 2
    K.bloque(f'{pre}_suelo', (W, F, 0.6), (0, yc, z - 0.3), suelo, bisel=0)
    K.bloque(f'{pre}_techo', (W, F + MURO['y1'] - MURO['y0'], PISO - r['techo'] - 0.6), (0, yc - 1.0, z + (r['techo'] + PISO - 0.6) / 2), techo, bisel=0)
    K.bloque(f'{pre}_fondo', (W, 0.6, r['techo']), (0, r['y1'] + 0.3, z + r['techo'] / 2), pared, bisel=0)
    for lado, x in (('i', r['x0'] - 0.3), ('d', r['x1'] + 0.3)):
        K.bloque(f'{pre}_lado_{lado}', (0.6, F, r['techo']), (x, yc, z + r['techo'] / 2), pared, bisel=0)
    # la pared de la boca, por el lado del rellano (el muro del hueco va aparte)
    for lado, x0, x1 in (('i', r['x0'], MURO['x0'] - 0.6), ('d', MURO['x1'] + 0.6, r['x1'])):
        K.bloque(f'{pre}_boca_{lado}', (x1 - x0, 0.3, r['techo']), ((x0 + x1) / 2, r['y0'] + 0.15, z + r['techo'] / 2), pared, bisel=0)
    K.bloque(f'{pre}_boca_s', (MURO['x1'] - MURO['x0'] + 1.2, 0.3, r['techo'] - MURO['alto'] - 0.6), ((MURO['x0'] + MURO['x1']) / 2, r['y0'] + 0.15, z + (r['techo'] + MURO['alto'] + 0.6) / 2), pared, bisel=0)


def lampara(pre, z, m):
    t = RELLANO['techo']; y = 26.0
    K.cilindro(f'{pre}_lampara_cable', 0.08, 3.0, (EJE, y, z + t - 1.5), m['hierro'], eje='Z', lados=12)
    K.cilindro(f'{pre}_lampara_floron', 0.8, 0.3, (EJE, y, z + t - 0.15), m['laton'], eje='Z', lados=32)
    K.esfera(f'{pre}_lampara_globo', 1.6, (EJE, y, z + t - 4.6), m['globo'], segmentos=(28, 16))
    K.tubo(f'{pre}_lampara_collar', 0.5, 0.62, 0.5, (EJE, y, z + t - 3.1), m['laton'], eje='Z', lados=32)


def luces_planta(pre, z):
    t = RELLANO['techo']
    K.punto(f'{pre}_luz_globo', (EJE, 26.0, z + t - 4.6), 2600, (1.0, 0.86, 0.68), radio=1.4)
    K.area(f'{pre}_luz_techo', (EJE, 30.0, z + t - 0.8), (EJE, 30.0, z), 5200, (1.0, 0.93, 0.84), 30, 20)
    for x in (EJE - 11.0, EJE + 11.0):
        K.punto(f'{pre}_luz_aplique{int(x)}', (x, RELLANO['y0'] + 1.6, z + 17.0), 380, (1.0, 0.82, 0.6), radio=0.8)


def vestibulo(m):
    """Planta 0: mármol en damero, nogal en las paredes, el directorio del edificio y el rótulo del estudio."""
    pre = 'p0'; z = 0.0; r = RELLANO
    caja(pre, z, m['marmol'], m['nogal_h'], m['techo'])
    yb = r['y1']
    # paneles de nogal en el fondo, con junquillos de latón
    for x in (EJE - 22.0, EJE - 12.5, EJE + 12.5, EJE + 22.0):
        K.bloque(f'{pre}_panel_{int(x)}', (8.4, 0.3, 22.0), (x, yb - 0.15, z + 13.0), m['nogal'], bisel=0.12)
    K.bloque(f'{pre}_junquillo', (r['x1'] - r['x0'], 0.3, 0.3), (0, yb - 0.3, z + 1.2), m['laton_mate'], bisel=0.05)
    # el directorio: fieltro negro con letras blancas (la web lo pinta) en un marco de nogal con cristal
    marco(f'{pre}_dir_marco', EJE, yb - 0.5, z + 14.5, 18.0, 15.0, 1.0, 1.0, m['nogal_h'], bisel=0.12)
    K.bloque(f'{pre}_dir_fondo', (18.0, 0.4, 15.0), (EJE, yb - 0.2, z + 14.5), m['fieltro'], bisel=0)
    lamina_xz('directorio_cara', EJE, yb - 0.42, z + 14.5, 17.6, 14.6, m['blanco'])
    lamina_xz('rotulo_cara', EJE, yb - 0.3, z + 25.3, 16.0, 2.4, m['blanco'])
    K.bloque(f'{pre}_rotulo_placa', (16.6, 0.2, 3.0), (EJE, yb - 0.1, z + 25.3), m['laton'], bisel=0.08)
    # un banco corrido de nogal a la izquierda y un paragüero de latón a la derecha
    K.bloque(f'{pre}_banco', (11.0, 4.2, 0.8), (-21.0, yb - 2.6, z + 4.6), m['nogal_h'], bisel=0.15)
    for x in (-25.5, -16.5):
        for y in (yb - 4.2, yb - 1.0):
            K.cilindro(f'{pre}_banco_pata{int(x)}{int(y)}', 0.32, 4.2, (x, y, z + 2.1), m['laton'], eje='Z', lados=20)
    K.tubo(f'{pre}_paraguero', 1.5, 1.7, 6.0, (21.0, yb - 2.4, z + 3.0), m['laton'], eje='Z', lados=48)
    K.cilindro(f'{pre}_paraguero_fondo', 1.6, 0.2, (21.0, yb - 2.4, z + 0.1), m['laton'], eje='Z', lados=48)
    lampara(pre, z, m)
    for x in (EJE - 11.0, EJE + 11.0):
        K.cilindro(f'{pre}_aplique_{int(x)}', 0.7, 0.4, (x, r['y0'] + 0.2, z + 17.0), m['laton'], eje='Y', lados=32)
        K.esfera(f'{pre}_aplique_{int(x)}_globo', 0.85, (x, r['y0'] + 1.1, z + 17.0), m['globo'], escala=(1, 1, 1.25), segmentos=(20, 12))
    luces_planta(pre, z)
    K.foco(f'{pre}_luz_directorio', (EJE, yb - 16.0, z + 27.0), (EJE, yb, z + 14.5), 9000, (1.0, 0.9, 0.76), apertura=40, suave=0.6, radio=1.0)


def en_obras(m):
    """Planta 10: hormigón, sin puerta todavía; una borriqueta con un tablero y el cartel de la obra."""
    k = PLANTAS - 1; pre = f'p{k}'; z = k * PISO; r = RELLANO
    caja(pre, z, m['hormigon'], m['hormigon'], m['hormigon'])
    yb = r['y1']
    K.bloque(f'{pre}_hueco_puerta', (PUERTA['ancho'], 0.2, PUERTA['alto']), (PUERTA['x'], yb - 0.05, z + PUERTA['alto'] / 2), m['negro'], bisel=0)
    marco(f'{pre}_premarco', PUERTA['x'], yb - 0.4, z + PUERTA['alto'] / 2, PUERTA['ancho'], PUERTA['alto'], 0.7, 0.8, m['pino'], bisel=0.04)
    # la borriqueta: dos caballetes y un tablero, con el cartel apoyado
    for x in (-24.0, -14.0):
        for s in (-1, 1):
            o = K.bloque(f'{pre}_caballete{int(x)}{s}', (0.5, 0.5, 8.4), (x, yb - 6.0 + s * 1.3, z + 4.0), m['pino'], bisel=0.04)
            o.rotation_euler = (R(-12 * s), 0, 0)
        K.bloque(f'{pre}_caballete{int(x)}_t', (0.6, 3.6, 0.6), (x, yb - 6.0, z + 8.1), m['pino'], bisel=0.04)
    K.bloque(f'{pre}_tablero', (13.0, 4.6, 0.4), (-19.0, yb - 6.0, z + 8.6), m['pino'], bisel=0.04)
    K.bloque(f'{pre}_cartel', (12.0, 0.3, 7.5), (PANTALLA['x'], yb - 0.4, z + 14.0), m['blanco'], bisel=0.04)
    lamina_xz('obras_cara', PANTALLA['x'], yb - 0.57, z + 14.0, 11.6, 7.1, m['blanco'])
    K.bloque(f'{pre}_lona', (8.0, 0.1, 26.0), (-24.0, yb - 1.4, z + 13.0), m['lona'], bisel=0).rotation_euler = (0, 0, R(18))
    # una lámpara de obra colgada y una cinta a franjas en la boca
    K.cilindro(f'{pre}_bombilla_cable', 0.06, 6.0, (EJE, 26.0, z + r['techo'] - 3.0), m['hierro'], eje='Z', lados=12)
    K.esfera(f'{pre}_bombilla', 0.8, (EJE, 26.0, z + r['techo'] - 6.6), m['globo'], escala=(1, 1, 1.3), segmentos=(20, 12))
    K.bloque(f'{pre}_cinta', (MURO['x1'] - MURO['x0'] - 1.0, 0.1, 0.8), (EJE + 0.25, r['y0'] + 1.6, z + 9.5), m['cinta'], bisel=0.02)
    K.punto(f'{pre}_luz_bombilla', (EJE, 26.0, z + r['techo'] - 6.6), 3600, (1.0, 0.84, 0.62), radio=0.6)
    K.area(f'{pre}_luz_techo', (EJE, 30.0, z + r['techo'] - 0.8), (EJE, 30.0, z), 1800, (0.9, 0.93, 1.0), 30, 20)


def escena():
    m = materiales()
    cab = cabina(m); cancela(m, cab)
    muro_hueco(m)
    vestibulo(m)
    for k in range(1, PLANTAS - 1):
        rellano(k, m)
    en_obras(m)
    K.mundo('#24221f', 0.05)
    return m, cab


def datos():
    cg = CANCELA
    return {'piso': PISO, 'plantas': PLANTAS, 'orden': ORDEN, 'cabina': CAB, 'boca': HUECO, 'muro': MURO, 'rellano': RELLANO,
            'puerta': PUERTA, 'tablon': TABLON, 'pantalla': PANTALLA, 'esfera': ESFERA, 'botonera': BOTONERA,
            'cancela': {**cg, 'paso': (cg['x1'] - cg['x0']) / (cg['barras'] - 1)},
            'botones': [{'et': et, 'planta': p, 'x': boton_xz(k)[0], 'z': boton_xz(k)[1]} for k, (et, p) in enumerate(BOTONES)]}


def foto(nombre, pos, mira, lente):
    K.ajustes(1440, 900, MUESTRAS)
    K.camara(pos, mira, lente)
    bpy.context.scene.render.filepath = os.path.join(DESTINO, nombre + '.png')
    bpy.ops.render.render(write_still=True)


def subir(cab, k):
    cab.location.z = k * PISO


# los mismos que en la web: el latón brilla y los globos dan luz
LATON = re.compile(r'_(boca|pasamanos|bisel|botonera|esfera|certificado|umbral|riel|aguja_eje|pomo|bocallave|aplique|floron|collar|pantalla_marco|paraguero|banco_pata|rotulo_placa|junquillo|marco_[aibd])|_unida\d*_laton$')
GLOBO = re.compile(r'_(globo|bombilla)$|_aplique_-?\d+_globo$|lampara_globo$')
SUELTAS = re.compile(r'^(cancela_|boton_|botonnum_|numero_)|_cara$|_cristal$')   # se mueven, se encienden o llevan su impreso


def unir_para_la_web(todo):
    """Ya horneado, lo que va junto se exporta como una sola malla (sin gráfica, cada malla es una llamada de dibujo):
    cada planta y su tramo de hueco, en tres (latón, globos y lo demás: brillan distinto); la cabina, igual, bajo su
    vacío (la aguja, bajo el suyo). Quedan sueltas la cancela, los botones, los números y todo lo impreso."""
    def clave(o):
        n = o.name
        if SUELTAS.search(n):
            return None
        m = re.match(r'^(p\d+|hueco_\d+|hueco|cab)_', n)
        if not m:
            return None
        return m.group(1), '_globo' if GLOBO.search(n) else '_laton' if LATON.search(n) else ''
    grupos = {}
    for o in todo:
        c = clave(o)
        if c:
            grupos.setdefault((o.parent, *c), []).append(o)
    vistos = {}
    comun = K.gris('para_la_web')
    for (padre, base, resto), objs in grupos.items():
        vistos[base, resto] = n = vistos.get((base, resto), 0) + 1
        nombre = f'{base}_unida{n if n > 1 else ""}{resto}'   # el mismo grupo bajo otro vacío (la aguja): otro nombre
        for o in objs:
            o.data.materials.clear(); o.data.materials.append(comun)
        if len(objs) > 1:
            K.seleccionar(objs); bpy.ops.object.join()
        junto = bpy.context.view_layer.objects.active if len(objs) > 1 else objs[0]
        junto.name = nombre; junto.data.name = nombre
        junto.data.uv_layers.active = junto.data.uv_layers['luz']


def principal():
    m, cab = escena()
    if 'comprobar' in RESTO:
        print('PIEZAS', len(K.mallas())); return
    if 'vista' in RESTO:          # la portada: desde el fondo de la cabina, el vestíbulo y su directorio
        return foto('vista', (0.5, -10.0, 13.5), (2.2, 6.0, 12.4), 26)
    if 'vista_planta' in RESTO:   # en la planta 3, con la cancela quitada
        subir(cab, 3)
        for o in bpy.data.objects:
            if o.name.startswith('cancela_'):
                o.hide_render = True
        return foto('vista_planta', (-1.0, -10.5, 3 * PISO + 13.0), (-1.0, 49.0, 3 * PISO + 12.0), 24)
    if 'vista_pantalla' in RESTO:
        return foto('vista_pantalla', (PANTALLA['x'] - 2.6, 33.0, 3 * PISO + 15.5), (PANTALLA['x'], 49.0, 3 * PISO + PANTALLA['z']), 35)
    import time
    t0 = time.time(); reloj = lambda *x: print(f'[{time.time() - t0:7.1f} s]', *x, flush=True)  # noqa: E731
    K.preparar(); reloj('preparado')
    K.ajustes(64, 64, MUESTRAS)
    horno = K.Horno(DESTINO)
    todo = K.mallas()
    g = {'cabina': [o for o in todo if o.name.startswith(('cab_', 'cancela_', 'boton_', 'botonnum_', 'esfera_', 'botonera_', 'certificado_'))],
         'hueco': [o for o in todo if o.name.startswith(('hueco_', 'numero_'))]}
    for k in range(PLANTAS):
        g[f'p{k}'] = [o for o in todo if o.name.startswith(f'p{k}_') or o.name.startswith((f'puerta_{k}_', f'tablon_{k}_', f'pantalla_{k}_'))]
    g['p0'] += [o for o in todo if o.name.startswith(('directorio_', 'rotulo_'))]
    g[f'p{PLANTAS - 1}'] += [o for o in todo if o.name.startswith('obras_')]
    if 'medir' in RESTO:
        import collections
        import re
        tri = lambda o: sum(len(pl.vertices) - 2 for pl in o.data.polygons)  # noqa: E731
        por_tipo = collections.Counter()
        for o in todo:
            por_tipo[re.sub(r'\d+', '#', o.name)] += tri(o)
        print('TRIANGULOS', sum(tri(o) for o in todo), 'MALLAS', len(todo), flush=True)
        for clave, objs in g.items():
            print(f'GRUPO {clave:8s} {len(objs):4d} piezas {sum(tri(o) for o in objs):7d} triángulos', flush=True)
        for k, v in por_tipo.most_common(30):
            print(f'TIPO {v:7d} {k}', flush=True)
        return
    for clave, objs in g.items():
        K.desplegar(objs, 0.003 if clave == 'cabina' else 0.004)
        reloj('desplegado', clave, len(objs), 'piezas')

    def hornear(objs, nombre, *a, **k):     # unidas: pieza a pieza, una lámina con muchas piezas no acaba
        horno.hornear_junto(objs, nombre, *a, reusar='seguir' in RESTO, **k); reloj('horneado', nombre)
    # el edificio, sin la cabina (se mueve: su sombra no puede quedar pintada en ninguna planta)
    for o in g['cabina']:
        o.hide_render = True
    hornear(g['hueco'], 'hueco', 2048, color=True, publicar=1024)
    for k in range(PLANTAS):
        hornear(g[f'p{k}'], f'p{k}', 2048, color=True, publicar=1024 if k else 2048)
    # la cabina, sola, con su plafón y una luz suave que entra por la boca
    for o in bpy.context.scene.objects:
        if o.type in ('MESH', 'LIGHT'):
            o.hide_render = o not in g['cabina']
    for o in g['cabina']:
        o.hide_render = False
    K.area('cab_luz_plafon', (0, -3.0, CAB['alto'] - 0.5), (0, -3.0, 0), 2400, (1.0, 0.92, 0.8), 8, 6)
    K.area('cab_luz_boca', (EJE, 20.0, 12.0), (EJE, 0, 10.0), 3000, (1.0, 0.95, 0.88), 12, 20)
    K.mundo('#2a2622', 0.15)
    # el globo del plafón, pegado a su luz, era el 1 % de la lámina y oscurecía todo lo demás: con el 99,7 de blanco,
    # las paredes quedaban en uno o dos niveles de gris y se veían los bloques de la compresión
    hornear(g['cabina'], 'cabina', 4096, color=True, publicar=2048, percentil=98.5)
    for o in bpy.context.scene.objects:
        o.hide_render = False
    unir_para_la_web(todo); reloj('unido', len(K.mallas()), 'mallas')
    horno.exportar(datos()); reloj('exportado')


principal()
