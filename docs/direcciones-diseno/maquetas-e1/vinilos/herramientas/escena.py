"""El cajón de discos: el mostrador de una tienda de discos, de tarde, con un cajón de nogal lleno de vinilos.

  pesado.sh --cola gpu vinilos-e1 -- <python con bpy> escena.py <carpeta> [muestras] [vista|vista_toca|comprobar]

En el cajón, nueve discos de pie, uno por proyecto: se hojean como en una tienda (los de delante caen hacia ti y el
que buscas queda a la vista). Se saca uno y su funda enseña la portada; dada la vuelta, la contraportada con los
créditos. Pincharlo es llevarlo al tocadiscos de la derecha: la funda va al atril de «sonando», el disco al plato y
en la tele de la pared, la de los videoclips de la tienda, sale su demo o su tráiler.

Las fundas y el disco viajan: se hornean aparte, en un estudio, y la web los coloca. El cajón se hornea con las nueve
fundas dentro, en reposo (dan la sombra de dentro). El brazo del tocadiscos gira en la web: va en su propio vacío.
"""
import math
import os
import re
import sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '../../../kit-e1/herramientas'))
import kit as K  # noqa: E402
import bpy  # noqa: E402
import bmesh  # noqa: E402

DESTINO, MUESTRAS, RESTO = K.argumentos()
R = K.R

# ── Medidas (1 = 10 cm). La tapa del mostrador está en z = 0; la pared, detrás, en y = PARED ──
PARED = 3.6
MOSTRADOR = {'x0': -9.0, 'x1': 10.2, 'y0': -4.4, 'y1': 3.5, 'alto': 9.0}
# el cajón: por dentro, 3,5 de ancho y 4,2 de largo; el frente bajo, para que los discos caigan apoyados en él
CAJON = {'x': -3.6, 'y': -0.6, 'ancho': 3.5, 'largo': 4.2, 'g': 0.18, 'frente': 1.0, 'fondo': 2.3}
FUNDA = {'lado': 3.15, 'grueso': 0.035}
BASE = CAJON['g'] + 0.01                                   # donde apoyan las fundas (la cara de arriba del suelo del cajón)
PASO_F = 0.34
FUNDAS_Y = [CAJON['y'] - 1.55 + i * PASO_F for i in range(9)]   # el pie de cada funda (gira sobre él)
# los ángulos (grados; + hacia atrás): la que se mira, las de detrás y las caídas (apoyadas en el frente del cajón)
INCLINA = {'mirada': 14.0, 'detras': 10.0, 'caida': -27.5}   # la primera caída se apoya en el frente; las demás, cada una en la anterior
TOCA = {'x': 3.0, 'y': 0.4, 'ancho': 5.4, 'fondo': 3.8, 'alto': 0.6}
PLATO = {'x': TOCA['x'] - 0.2, 'y': TOCA['y'], 'r': 1.62, 'z': 0.86}       # z: la cara de arriba del plato
DISCO = {'r': 1.5, 'agujero': 0.045, 'grueso': 0.02}
BRAZO = {'x': TOCA['x'] + 2.05, 'y': TOCA['y'] + 1.25, 'z': 1.12, 'largo': 2.5, 'sonando': -28.5}
TELE = {'x': 2.6, 'y': PARED - 0.45, 'z': 6.4, 'ancho': 6.8, 'alto': 3.825}        # la pantalla (16:9); la caja, alrededor
ATRIL = {'x': 8.1, 'y': PARED - 0.85, 'inclina': 12.0}    # la funda que suena, de pie a la derecha del tocadiscos, apoyada en la pared


# ───────────────────────── ayudas ─────────────────────────
def lamina_xz(nombre, cx, y, cz, ancho, alto, mat, padre=None, mira=-1):
    """Lámina vertical en el plano XZ que mira a -Y (mira=-1) o a +Y; la imagen, derecha para quien la mira."""
    x0, x1 = (cx - ancho / 2, cx + ancho / 2) if mira < 0 else (cx + ancho / 2, cx - ancho / 2)
    return K.lamina(nombre, [(x0, y, cz - alto / 2), (x1, y, cz - alto / 2), (x1, y, cz + alto / 2), (x0, y, cz + alto / 2)], mat, padre)


def torno(nombre, cx, cy, perfil, mat, padre=None, lados=64):
    """Perfil [(r, z)…] girado alrededor del eje vertical que pasa por (cx, cy); costados suaves y tapas planas."""
    bm = bmesh.new(); anillos = []
    for r, z in perfil:
        if r <= 1e-4:
            anillos.append([bm.verts.new((0, 0, z))])
        else:
            anillos.append([bm.verts.new((r * math.cos(2 * math.pi * k / lados), r * math.sin(2 * math.pi * k / lados), z)) for k in range(lados)])
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
    o = K.objeto(nombre, me, padre, mat); o.location = (cx, cy, 0)
    return o


def prisma_x(nombre, perfil, x0, x1, mat, padre=None, bisel=0.02):
    """Pieza de perfil [(y, z)…] (un polígono convexo, en orden) extruida a lo largo de X, de x0 a x1."""
    bm = bmesh.new()
    a = [bm.verts.new((x0, y, z)) for y, z in perfil]; b = [bm.verts.new((x1, y, z)) for y, z in perfil]
    bm.faces.new(a); bm.faces.new(b[::-1])
    n = len(perfil)
    for k in range(n):
        j = (k + 1) % n
        bm.faces.new((a[k], b[k], b[j], a[j]))
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    me = bpy.data.meshes.new(nombre); bm.to_mesh(me); bm.free()
    o = K.objeto(nombre, me, padre, mat)
    if bisel:
        m = o.modifiers.new('bisel', 'BEVEL'); m.width = bisel; m.segments = 3; m.limit_method = 'ANGLE'
    for p in me.polygons:
        p.use_smooth = True
    return o


# ───────────────────────── la tienda ─────────────────────────
def tienda(m):
    mo = MOSTRADOR; cx = (mo['x0'] + mo['x1']) / 2; w = mo['x1'] - mo['x0']; f = mo['y1'] - mo['y0']
    # la tapa entra en el zócalo: su bisel de atrás, al aire, era una raya negra discontinua a lo largo de la pared
    K.bloque('tienda_mostrador_tapa', (w, PARED - mo['y0'], 0.4), (cx, (mo['y0'] + PARED) / 2, -0.2), m['nogal'], bisel=0.06)
    K.bloque('tienda_mostrador_frente', (w - 0.4, 0.3, mo['alto'] - 0.4), (cx, mo['y0'] + 0.5, -0.4 - (mo['alto'] - 0.4) / 2), m['nogal_v'], bisel=0.03)
    # el frente, en paneles: listones verticales con su sombra, como un mostrador de tienda antigua
    for k in range(13):
        x = mo['x0'] + 0.9 + k * (w - 1.8) / 12
        K.bloque(f'tienda_liston_{k}', (0.12, 0.08, mo['alto'] - 1.6), (x, mo['y0'] + 0.31, -0.4 - (mo['alto'] - 0.4) / 2), m['nogal_v'], bisel=0.03)
    K.bloque('tienda_canto', (w + 0.1, 0.16, 0.12), (cx, mo['y0'] + 0.02, -0.02), m['laton'], bisel=0.04)
    # la pared: verde oscuro de tienda, con un zócalo de nogal y una moldura
    K.bloque('tienda_pared', (40.0, 0.2, 30.0), (0, PARED + 0.1, 6.0), m['pared'], bisel=0)
    K.bloque('tienda_suelo', (40.0, 30.0, 0.2), (0, -6.0, -mo['alto'] - 0.1), m['suelo'], bisel=0)
    K.bloque('tienda_zocalo', (40.0, 0.12, 3.2), (0, PARED - 0.06, 1.6), m['nogal'], bisel=0.02)
    K.bloque('tienda_moldura', (40.0, 0.22, 0.18), (0, PARED - 0.11, 3.25), m['nogal'], bisel=0.05)
    # la balda de los expositores, a la izquierda, con tres discos de cara (de decoración: sin nombres)
    K.bloque('tienda_balda', (7.4, 1.0, 0.2), (-5.7, PARED - 0.5, 5.2), m['nogal'], bisel=0.04)
    K.bloque('tienda_balda_listo', (7.4, 0.08, 0.32), (-5.7, PARED - 0.98, 5.36), m['nogal'], bisel=0.02)
    for k, x in enumerate((-8.2, -5.7, -3.2)):
        piv = (x, PARED - 0.55 - k * 0.09, 5.3)   # cada uno un poco por delante del anterior: en el mismo plano, se pisaban a dientes
        g = K.vacio(f'tienda_expo_{k}', piv, giro=(R(-9), 0, 0))
        K.bloque(f'tienda_expo_{k}_cuerpo', (FUNDA['lado'], FUNDA['grueso'], FUNDA['lado']), (0, 0, FUNDA['lado'] / 2), m['funda'], padre=g, bisel=0.008)
        # la lámina, a 8 mm de su funda: a 2 mm, vistas desde lejos, las dos caras se peleaban (trama negra)
        lamina_xz(f'expositor_{k}', 0, -FUNDA['grueso'] / 2 - 0.008, FUNDA['lado'] / 2, FUNDA['lado'] - 0.02, FUNDA['lado'] - 0.02, m['blanco'], g)
    # el rótulo de la tienda, pintado en una tabla
    K.bloque('tienda_rotulo_tabla', (7.0, 0.16, 1.5), (-5.7, PARED - 0.08, 9.9), m['nogal'], bisel=0.05)
    lamina_xz('rotulo_cara', -5.7, PARED - 0.17, 9.9, 6.6, 1.2, m['blanco'])
    # la lámpara de latón sobre el cajón
    lx, ly, lz = CAJON['x'], CAJON['y'] - 0.2, 8.6
    K.cilindro('tienda_lampara_cable', 0.035, 8.0, (lx, ly, lz + 4.4), m['negro'], eje='Z', lados=12)
    torno('tienda_lampara_pantalla', lx, ly, [(0.18, lz + 0.42), (0.34, lz + 0.38), (0.62, lz + 0.18), (1.05, lz - 0.28), (1.32, lz - 0.62), (1.34, lz - 0.66),
                                              (1.30, lz - 0.66), (1.0, lz - 0.32), (0.58, lz + 0.12), (0.3, lz + 0.32), (0.16, lz + 0.36)], m['laton'])
    K.esfera('tienda_lampara_bombilla', 0.3, (lx, ly, lz - 0.3), m['bombilla'])
    K.punto('luz_lampara', (lx, ly, lz - 0.72), 260, (1.0, 0.76, 0.48), 0.25)


# ───────────────────────── el cajón ─────────────────────────
def cajon(m):
    c = CAJON; g = c['g']; x0, x1 = c['x'] - c['ancho'] / 2, c['x'] + c['ancho'] / 2
    y0, y1 = c['y'] - c['largo'] / 2, c['y'] + c['largo'] / 2
    K.bloque('cajon_suelo', (c['ancho'] + 2 * g, c['largo'] + 2 * g, g), (c['x'], c['y'], g / 2), m['nogal'], bisel=0.02)
    K.bloque('cajon_frente', (c['ancho'] + 2 * g, g, c['frente'] + g), (c['x'], y0 - g / 2, (c['frente'] + g) / 2), m['nogal'], bisel=0.03)
    K.bloque('cajon_trasera', (c['ancho'] + 2 * g, g, c['fondo'] + g), (c['x'], y1 + g / 2, (c['fondo'] + g) / 2), m['nogal'], bisel=0.03)
    # los costados: bajan en diagonal del fondo al frente
    perfil = [(y0 - g, 0), (y1 + g, 0), (y1 + g, c['fondo'] + g), (y0 - g, c['frente'] + g)]
    prisma_x('cajon_lado_i', perfil, x0 - g, x0, m['nogal_v'], bisel=0.03)
    prisma_x('cajon_lado_d', perfil, x1, x1 + g, m['nogal_v'], bisel=0.03)
    # un asidero de latón en cada costado y la placa del frente
    for n, x in (('i', x0 - g - 0.05), ('d', x1 + g + 0.05)):
        K.cilindro(f'cajon_asa_{n}', 0.05, 1.4, (x, c['y'] + 0.9, 1.25), m['laton'], eje='Y', lados=20)
    K.bloque('cajon_placa', (1.2, 0.03, 0.42), (c['x'], y0 - g - 0.015, 0.62), m['laton'], bisel=0.015)
    lamina_xz('placa_cara', c['x'], y0 - g - 0.032, 0.62, 1.08, 0.32, m['blanco'])


def fundas(m):
    """Las nueve fundas, de pie en el cajón. Cada una cuelga de un vacío en su pie (gira sobre él)."""
    raices = []
    for i, y in enumerate(FUNDAS_Y):
        a = INCLINA['mirada'] if i == 0 else INCLINA['detras']
        r = K.vacio(f'funda_{i}', (CAJON['x'], y, BASE), giro=(R(-a), 0, 0))
        L, e = FUNDA['lado'], FUNDA['grueso']
        K.bloque(f'funda_{i}_cuerpo', (L, e, L), (0, 0, L / 2), m['funda'], padre=r, bisel=0.008)
        lamina_xz(f'funda_{i}_cara', 0, -e / 2 - 0.002, L / 2, L - 0.016, L - 0.016, m['blanco'], r)
        lamina_xz(f'funda_{i}_dorso', 0, e / 2 + 0.002, L / 2, L - 0.016, L - 0.016, m['blanco'], r, mira=1)
        raices.append(r)
    return raices


def disco(m):
    """El vinilo: de canto, en el plano XZ (las caras miran a -Y y a +Y), con el centro en el origen del vacío."""
    d = K.vacio('disco', (0, 0, 0))
    K.tubo('disco_cuerpo', DISCO['agujero'], DISCO['r'], DISCO['grueso'], (0, 0, 0), m['vinilo'], padre=d, lados=128)
    K.anillo('disco_cara', DISCO['agujero'], DISCO['r'] - 0.004, (0, -DISCO['grueso'] / 2 - 0.0015, 0), m['blanco'], d, lados=128, mira=-1)
    K.anillo('disco_dorso', DISCO['agujero'], DISCO['r'] - 0.004, (0, DISCO['grueso'] / 2 + 0.0015, 0), m['blanco'], d, lados=128, mira=1)
    return d


# ───────────────────────── el tocadiscos y la tele ─────────────────────────
def tocadiscos(m):
    t = TOCA; p = PLATO
    K.bloque('toca_caja', (t['ancho'], t['fondo'], t['alto']), (t['x'], t['y'], t['alto'] / 2), m['nogal'], bisel=0.08)
    K.bloque('toca_placa', (t['ancho'] - 0.3, t['fondo'] - 0.3, 0.03), (t['x'], t['y'], t['alto'] + 0.015), m['aluminio'], bisel=0.01)
    # el plato, de torno: un aro brillante con su goma; el eje asoma por el agujero del disco
    z0 = t['alto'] + 0.03
    torno('toca_plato', p['x'], p['y'], [(0.0, z0), (p['r'] - 0.12, z0), (p['r'], z0 + 0.05), (p['r'], p['z'] - 0.05),
                                         (p['r'] - 0.03, p['z'] - 0.02), (p['r'] - 0.08, p['z'] - 0.02), (p['r'] - 0.08, p['z']), (0.0, p['z'])], m['aluminio_b'], lados=96)
    torno('toca_eje', p['x'], p['y'], [(0.0, p['z']), (0.03, p['z']), (0.03, p['z'] + 0.1), (0.02, p['z'] + 0.12), (0.0, p['z'] + 0.12)], m['acero'], lados=24)
    # el brazo: base de torno, el contrapeso detrás y el tubo con la cápsula; todo cuelga del vacío `brazo`
    b = BRAZO
    torno('toca_brazo_base', b['x'], b['y'], [(0.0, t['alto']), (0.36, t['alto']), (0.36, t['alto'] + 0.12), (0.24, t['alto'] + 0.16),
                                              (0.12, b['z'] - 0.1), (0.0, b['z'] - 0.1)], m['aluminio_b'], lados=48)
    brazo = K.vacio('brazo', (b['x'], b['y'], b['z']))
    K.cilindro('toca_brazo_pivote', 0.13, 0.22, (0, 0, 0), m['acero'], padre=brazo, eje='X', lados=32)
    K.cilindro('toca_brazo_tubo', 0.045, b['largo'] + 0.15, (0, -(b['largo'] + 0.15) / 2 + 0.35, 0), m['acero'], padre=brazo, eje='Y', lados=24)
    K.cilindro('toca_brazo_peso', 0.2, 0.42, (0, 0.5, 0), m['negro_b'], padre=brazo, eje='Y', lados=40, bisel=0.02)
    K.bloque('toca_brazo_cabeza', (0.34, 0.5, 0.06), (0, -b['largo'] + 0.05, -0.05), m['acero'], padre=brazo, bisel=0.015)
    K.bloque('toca_brazo_capsula', (0.2, 0.3, 0.14), (0, -b['largo'] + 0.08, -0.15), m['rojo'], padre=brazo, bisel=0.02)
    K.bloque('toca_brazo_dedo', (0.04, 0.24, 0.03), (0.2, -b['largo'] + 0.05, -0.04), m['acero'], padre=brazo, bisel=0.008)
    # el reposabrazos, donde descansa la cápsula
    torno('toca_reposo', b['x'], b['y'] - b['largo'] + 0.15, [(0.0, t['alto']), (0.07, t['alto']), (0.05, b['z'] - 0.24), (0.0, b['z'] - 0.24)], m['acero'], lados=24)
    # los mandos: el de la velocidad y el de marcha, de latón
    for n, dy, r in (('velocidad', 0.45, 0.24), ('marcha', 1.15, 0.2)):
        torno(f'toca_mando_{n}', t['x'] - t['ancho'] / 2 + 0.4, t['y'] - t['fondo'] / 2 + dy, [(0.0, t['alto'] + 0.03), (r, t['alto'] + 0.03), (r, t['alto'] + 0.16),
                                                                          (r - 0.03, t['alto'] + 0.19), (0.0, t['alto'] + 0.19)], m['laton'], lados=40)


def atril(m):
    """Donde se deja la funda del disco que suena: un listón de latón en el mostrador, contra la pared."""
    a = ATRIL; dy = FUNDA['grueso'] / 2 + 0.06
    K.bloque('tienda_atril_liston', (3.5, 0.12, 0.16), (a['x'], a['y'] - dy, 0.08), m['laton'], bisel=0.03)
    K.bloque('tienda_atril_cartel', (1.5, 0.05, 0.5), (a['x'] - 2.65, a['y'] - 0.3, 0.25), m['nogal'], bisel=0.015)
    lamina_xz('atril_cara', a['x'] - 2.65, a['y'] - 0.33, 0.25, 1.38, 0.4, m['blanco'])


def tele(m):
    t = TELE; w, h = t['ancho'] + 1.0, t['alto'] + 1.0
    K.bloque('tele_caja', (w, 0.8, h), (t['x'], t['y'], t['z']), m['nogal'], bisel=0.12)
    K.bloque('tele_marco', (t['ancho'] + 0.24, 0.06, t['alto'] + 0.24), (t['x'], t['y'] - 0.41, t['z']), m['negro_b'], bisel=0.04)
    lamina_xz('tele_cara', t['x'], t['y'] - 0.445, t['z'], t['ancho'], t['alto'], m['negro'])
    # la repisa de la pared que la sostiene y su testigo
    K.bloque('tele_repisa', (w - 0.6, 1.1, 0.16), (t['x'], PARED - 0.55, t['z'] - h / 2 - 0.08), m['nogal'], bisel=0.03)
    for dx in (-w / 2 + 0.8, w / 2 - 0.8):
        prisma_x(f'tele_escuadra_{int(dx * 10)}', [(PARED, t['z'] - h / 2 - 0.16), (PARED - 0.95, t['z'] - h / 2 - 0.16), (PARED, t['z'] - h / 2 - 1.1)],
                 t['x'] + dx - 0.07, t['x'] + dx + 0.07, m['laton'], bisel=0.01)
    K.bloque('tele_testigo', (0.12, 0.02, 0.05), (t['x'] + w / 2 - 0.5, t['y'] - 0.41, t['z'] - h / 2 + 0.25), m['led'], bisel=0.006)


def materiales():
    m = {
        'nogal': K.madera('nogal', '#3e2416', '#74482b', eje='X', vetas=4.0), 'nogal_v': K.madera('nogal_v', '#3e2416', '#74482b', eje='Z', vetas=4.0),
        'pared': K.yeso('pared', '#2f3b33'), 'suelo': K.yeso('suelo', '#3a2c22'),
        'laton': K.material('laton', '#c9a15a', 0.28, metal=0.9), 'acero': K.material('acero', '#c7c9cc', 0.22, metal=0.95),
        'aluminio': K.material('aluminio', '#8f9296', 0.38, metal=0.85), 'aluminio_b': K.material('aluminio_b', '#b9bcc0', 0.2, metal=0.95),
        'negro': K.material('negro', '#0b0b0c', 0.45), 'negro_b': K.material('negro_b', '#151517', 0.3),
        'blanco': K.material('blanco', '#f4f1ea', 0.6), 'funda': K.material('funda', '#e9e3d6', 0.7),
        'vinilo': K.material('vinilo', '#0d0d0f', 0.25), 'rojo': K.material('rojo', '#a3261c', 0.4),
        'led': K.material('led', '#ff9a3c', 0.4, emision='#ff9a3c', fuerza=4.0),
        'bombilla': K.material('bombilla', '#fff1d6', 0.3, emision='#ffd9a0', fuerza=12.0),
    }
    return m


def escena():
    K.limpiar()
    m = materiales()
    tienda(m); cajon(m); tocadiscos(m); tele(m); atril(m)
    raices = fundas(m)
    d = disco(m)
    # de tarde: la luz de un escaparate fuera de cuadro a la izquierda, un relleno frío y la lámpara
    K.area('escaparate', (-14.0, -9.0, 9.0), (-2.0, 1.0, 1.0), 2600, (1.0, 0.86, 0.68), 7.0)
    K.area('relleno', (12.0, -10.0, 6.0), (2.0, 1.0, 2.0), 520, (0.78, 0.86, 1.0), 8.0)
    K.area('techo', (0.0, -1.0, 14.0), (0.0, 0.0, 0.0), 900, (1.0, 0.92, 0.82), 14.0, 8.0)
    K.mundo('#2a2622', 0.12)
    return m, raices, d


# lo que la web pinta con su impreso o enciende: queda suelto (el resto, unido; ver `material` en js/app.js)
SUELTAS = re.compile(r'^(funda_\d+_(cara|dorso)|disco_cara|disco_dorso|tele_cara|expositor_\d|rotulo_cara|atril_cara|placa_cara|tienda_lampara_bombilla)$')


def en_la_web(n):
    """La lámina y el brillo que `material` da en la web a cada pieza (sin impreso)."""
    if n.startswith('funda_'):
        return 'funda', None
    if n.startswith('disco_'):
        return 'disco', 40
    if n.startswith('tienda_'):
        return 'tienda', 30 if re.search(r'laton|lampara_pantalla|canto|atril_liston|escuadra', n) else 5
    if n.startswith('cajon_'):
        return 'cajon', 30 if re.search(r'asa|placa', n) else 5
    if n.startswith('toca_'):
        return 'toca', 45 if re.search(r'plato|brazo|eje|reposo|mando|placa', n) else 6
    if n.startswith('tele_'):
        return 'tele', 30 if re.search(r'marco|escuadra', n) else 6
    return 'tienda', None


def unir_para_la_web(todo):
    """Ya horneado, lo que se mueve junto y brilla igual se exporta como una sola malla (sin gráfica, cada malla es
    una llamada de dibujo): se agrupa por el vacío del que cuelga (cada funda, el disco, el brazo) y por lámina y
    brillo. El nombre lo lleva: `<lámina>_unida[n][_b<brillo>]`, que la web lee en `material`."""
    grupos = {}
    for o in todo:
        if not SUELTAS.match(o.name):
            grupos.setdefault((o.parent, *en_la_web(o.name)), []).append(o)
    vistos = {}
    comun = K.gris('para_la_web')
    for (padre, luz, brillo), objs in grupos.items():
        vistos[luz, brillo] = n = vistos.get((luz, brillo), 0) + 1
        nombre = f'{luz}_unida{n if n > 1 else ""}' + (f'_b{brillo}' if brillo is not None else '')
        for o in objs:
            o.data.materials.clear(); o.data.materials.append(comun)
        if len(objs) > 1:
            K.seleccionar(objs); bpy.ops.object.join()
        junto = bpy.context.view_layer.objects.active if len(objs) > 1 else objs[0]
        junto.name = nombre; junto.data.name = nombre
        junto.data.uv_layers.active = junto.data.uv_layers['luz']


def principal():
    m, raices, d = escena()
    if 'comprobar' in RESTO:
        print('PIEZAS', len(K.mallas())); return
    if 'vista' in RESTO or 'vista_toca' in RESTO:
        d.location = (PLATO['x'], PLATO['y'], PLATO['z'] + DISCO['grueso'] / 2); d.rotation_euler = (R(-90), 0, 0)
        bpy.data.objects['brazo'].rotation_euler = (0, 0, R(BRAZO['sonando']))
        K.ajustes(1440, 900, MUESTRAS)
        if 'vista_toca' in RESTO:
            K.camara((3.5, -12.0, 9.0), (2.8, 1.0, 4.0), 40)
        else:
            K.camara((-1.0, -21.0, 12.0), (-0.6, 0.5, 2.6), 38)
        bpy.context.scene.render.filepath = os.path.join(DESTINO, ('vista_toca' if 'vista_toca' in RESTO else 'vista') + '.png')
        bpy.ops.render.render(write_still=True)
        return
    import time
    t0 = time.time(); reloj = lambda *x: print(f'[{time.time() - t0:7.1f} s]', *x, flush=True)  # noqa: E731
    K.preparar(); reloj('preparado')
    K.ajustes(64, 64, MUESTRAS)
    horno = K.Horno(DESTINO)
    todo = K.mallas()
    nombres = lambda *pre: [o for o in todo if o.name.startswith(pre)]  # noqa: E731
    g = {'tienda': nombres('tienda_', 'expositor_', 'rotulo_', 'atril_'), 'cajon': nombres('cajon_', 'placa_'), 'toca': nombres('toca_'), 'tele': nombres('tele_'),
         'fundas': nombres('funda_'), 'disco': nombres('disco_')}
    if 'medir' in RESTO:
        import collections
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
        K.desplegar(objs, 0.004 if clave in ('fundas', 'disco', 'toca') else 0.006)
        reloj('desplegado', clave, len(objs), 'piezas')

    def hornear(objs, nombre, *a, **k):     # unidas: pieza a pieza, una lámina con muchas piezas no acaba
        horno.hornear_junto(objs, nombre, *a, reusar='seguir' in RESTO, **k); reloj('horneado', nombre)
    # 1. el disco y las fundas, fuera de la escena: se hornean aparte (viajan) con la luz del estudio
    d.location = (0, -60, 5)
    for o in g['disco']:
        o.hide_render = False
    estudio = g['fundas'] + g['disco']
    for o in estudio:
        o.hide_render = True
    hornear(g['tienda'], 'tienda', 2048, color=True)
    hornear(g['cajon'], 'cajon', 1024, color=True)
    hornear(g['toca'], 'toca', 1024, color=True)
    hornear(g['tele'], 'tele', 1024, color=True)
    # 2. el estudio: las nueve fundas en fila, de pie y separadas (no se hacen sombra), y el disco aparte
    for i, r in enumerate(raices):
        r.location = (-20 + i * 5.0, -60, 0); r.rotation_euler = (0, 0, 0)
    for o in bpy.context.scene.objects:
        if o.type in ('MESH', 'LIGHT'):
            o.hide_render = o not in estudio
    bpy.context.scene.world = K.mundo_estudio()
    hornear(g['fundas'], 'fundas', 2048, color=True)
    hornear(g['disco'], 'disco', 1024, color=True)
    for o in bpy.context.scene.objects:
        o.hide_render = False
    # se exporta en reposo: las fundas en el cajón, el disco escondido dentro de la primera
    for i, r in enumerate(raices):
        r.location = (CAJON['x'], FUNDAS_Y[i], BASE); r.rotation_euler = (R(-(INCLINA['mirada'] if i == 0 else INCLINA['detras'])), 0, 0)
    d.location = (0, -60, 5)
    unir_para_la_web(todo); reloj('unido', len(K.mallas()), 'mallas')
    horno.exportar({'cajon': CAJON, 'funda': FUNDA, 'base': BASE, 'fundas_y': FUNDAS_Y, 'inclina': INCLINA, 'toca': TOCA, 'plato': PLATO,
                    'disco': DISCO, 'brazo': BRAZO, 'tele': TELE, 'atril': ATRIL, 'pared': PARED}); reloj('exportado')


principal()
