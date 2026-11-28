"""La biblioteca: una librería de nogal, de noche, y delante la mesa de lectura con su lámpara.

  pesado.sh --cola gpu biblioteca-e1 -- <python con bpy> escena.py <carpeta> [muestras] [vista|vista_mesa|medir|seguir|boceto]

En la balda del centro, nueve libros de tela, uno por proyecto, cada uno con su alto y su grueso. Se saca uno y se ve
la tapa; dado la vuelta, la contracubierta con los créditos. Abrirlo es dejarlo en la mesa: la tapa se levanta y del
pliegue sube un teatrillo de papel (un desplegable de pliegues paralelos, como los de verdad): el telón con la
pantalla, dos bastidores y una fila de libritos delante. En la pantalla sale la demo o el tráiler.

El libro que viaja es uno solo (`libro`), que la web viste con la tela y los impresos del elegido. Su tapa y cada capa
del desplegable cuelgan de un vacío en su pliegue: todos giran lo mismo, así que cada capa sigue paralela a la tapa
mientras se abre. Las pestañas de arriba siguen horizontales: la web las coloca.
"""
import math
import os
import random
import re
import sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '../../../kit-e1/herramientas'))
import kit as K  # noqa: E402
import bpy  # noqa: E402
import bmesh  # noqa: E402

DESTINO, MUESTRAS, RESTO = K.argumentos()
R = K.R

# ── Medidas (1 = 10 cm). El tablero de la mesa está en z = 0; el fondo de la librería, en y = FONDO ──
FONDO = 2.4
FRENTE = -0.6                       # el canto de las baldas
LOMOS = -0.35                       # el plano de los lomos (los libros, algo metidos)
BALDAS = [-6.0, -1.5, 3.0, 7.5, 12.0]           # la cara de arriba de cada balda; la de los proyectos es la de z = 3
Z0 = 3.0
MONTANTES = [-11.4, -3.9, 3.9, 11.4]
# el libro que viaja: H a lo largo del lomo, W del lomo al corte, T de grueso
LIBRO = {'H': 3.6, 'W': 2.6, 'T': 0.56, 'tapa': 0.05, 'ceja': 0.06}
# los nueve de la balda: color de la tela (el del proyecto), alto y grueso; van de izquierda a derecha, pegados
TELAS = ['#1B2140', '#9E3A26', '#17583F', '#4A2F78', '#17656A', '#1C47A0', '#C5612A', '#B8901C', '#94295F']
ALTOS = [3.7, 3.3, 3.55, 3.8, 3.2, 3.6, 3.4, 3.15, 3.5]
GRUESOS = [0.62, 0.5, 0.56, 0.66, 0.48, 0.6, 0.52, 0.46, 0.58]
TOMOS_X0 = -3.55
TOMOS_X = [TOMOS_X0 + sum(GRUESOS[:i]) + 0.015 * i for i in range(9)]        # la cara izquierda de cada uno
HUECO_X = TOMOS_X[-1] + GRUESOS[-1] + 0.12                                    # donde irá el siguiente
MESA = {'x0': -7.0, 'x1': 7.0, 'y0': -8.6, 'y1': -2.2, 'grueso': 0.35}
CARPETA = {'x': 0.0, 'y': -5.3, 'ancho': 6.4, 'fondo': 4.6, 'grueso': 0.035}  # el vade de cuero donde se abre el libro
PLIEGUE = {'x': 0.0, 'y': -3.95, 'z': CARPETA['grueso'] + 0.003}              # el lomo del libro abierto, en la mesa
# el desplegable: cada capa, a `d` del pliegue y de alto `h` (d + h cabe en la página: plegada no asoma)
CAPAS = [
    {'n': 'telon', 'd': 0.5, 'h': 2.0},
    {'n': 'alas', 'd': 1.25, 'h': 1.25},
    {'n': 'frente', 'd': 2.0, 'h': 0.42},
]
PANTALLA = {'ancho': 2.9, 'alto': 1.63125, 'pie': 0.2}        # 16:9, en el telón
LAMPARA = {'x': -4.7, 'y': -3.7}


def lamina_local(nombre, esquinas, mat, padre):
    return K.lamina(nombre, esquinas, mat, padre)


def torno(nombre, cx, cy, perfil, mat, padre=None, lados=32):
    bm = bmesh.new(); anillos = []
    for r, z in perfil:
        if r <= 1e-4:
            anillos.append([bm.verts.new((0, 0, z))])
        else:
            anillos.append([bm.verts.new((r * math.cos(2 * math.pi * k / lados), r * math.sin(2 * math.pi * k / lados), z)) for k in range(lados)])
    for a, b in zip(anillos, anillos[1:]):
        for k in range(lados):
            j = (k + 1) % lados
            if len(a) == 1 and len(b) == 1:
                continue
            if len(a) == 1:
                f = bm.faces.new((a[0], b[j], b[k]))
            elif len(b) == 1:
                f = bm.faces.new((a[k], a[j], b[0]))
            else:
                f = bm.faces.new((a[k], a[j], b[j], b[k]))
            f.smooth = True
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    me = bpy.data.meshes.new(nombre); bm.to_mesh(me); bm.free()
    o = K.objeto(nombre, me, padre, mat); o.location = (cx, cy, 0)
    return o


# ───────────────────────── la librería ─────────────────────────
def libreria(m):
    ancho = MONTANTES[-1] - MONTANTES[0] + 0.5; hondo = FONDO - FRENTE
    K.bloque('sala_pared', (44.0, 0.2, 40.0), (0, FONDO + 0.25, 4.0), m['pared'], bisel=0)
    K.bloque('sala_suelo', (44.0, 30.0, 0.2), (0, -8.0, -8.1), m['suelo'], bisel=0)
    K.bloque('lib_trasera', (ancho, 0.1, 30.0), (0, FONDO + 0.05, 5.0), m['nogal_o'], bisel=0)
    for k, x in enumerate(MONTANTES):
        K.bloque(f'lib_montante_{k}', (0.3, hondo, 30.0), (x, (FONDO + FRENTE) / 2, 5.0), m['nogal_v'], bisel=0.03, segmentos=2)
    for k, z in enumerate(BALDAS):
        K.bloque(f'lib_balda_{k}', (ancho, hondo - 0.04, 0.25), (0, (FONDO + FRENTE) / 2 + 0.02, z - 0.125), m['nogal'], bisel=0.03, segmentos=2)
    # el filete de latón de la balda de los proyectos y la barra de la escalera
    K.bloque('lib_filete', (MONTANTES[2] - MONTANTES[1] - 0.3, 0.03, 0.09), (0, FRENTE - 0.01, Z0 - 0.125), m['laton'], bisel=0.01, segmentos=1)
    K.cilindro('lib_barra', 0.07, ancho, (0, FRENTE - 0.45, 11.2), m['laton'], eje='X', lados=16)
    for k, x in enumerate((MONTANTES[0] + 0.15, MONTANTES[1], MONTANTES[2], MONTANTES[3] - 0.15)):
        K.bloque(f'lib_barra_pie_{k}', (0.1, 0.5, 0.1), (x, FRENTE - 0.22, 11.2), m['laton'], bisel=0.02, segmentos=1)


def adorno(m):
    """Los libros de las demás baldas: sin nombre, de telas apagadas, algunos tumbados o apoyados."""
    rnd = random.Random(11)
    telas = ['tela_verde', 'tela_granate', 'tela_azul', 'tela_ocre', 'tela_crema', 'tela_marron', 'tela_gris']
    n = 0

    def fila(x0, x1, z, lleno=0.8):
        nonlocal n
        x = x0 + 0.06
        tope = x0 + (x1 - x0) * lleno
        while x < tope:
            g = rnd.uniform(0.3, 0.72); h = rnd.uniform(2.5, 3.9); w = rnd.uniform(2.0, 2.6)
            mat = m[rnd.choice(telas)]
            o = K.bloque(f'ador_{n}', (g, w, h), (x + g / 2, LOMOS + rnd.uniform(0, 0.25) + w / 2, z + h / 2), mat, bisel=0.035, segmentos=1)
            if rnd.random() < 0.55:      # dos filetes dorados en el lomo
                for dz in (0.22, 0.34) if rnd.random() < 0.5 else (0.2, 0.8):
                    K.bloque(f'ador_{n}_f{int(dz * 100)}', (g - 0.07, 0.01, 0.04), (x + g / 2, o.location.y - w / 2 - 0.004, z + h * dz), m['oro'], bisel=0)
            x += g + 0.012; n += 1
        # el último, apoyado en los demás; y, si queda sitio, una pila tumbada
        if x1 - x > 1.2:
            g, h = 0.45, 3.2
            o = K.bloque(f'ador_{n}', (g, 2.3, h), (x + 0.42, LOMOS + 1.3, z + h / 2 - 0.05), m[rnd.choice(telas)], bisel=0.035, segmentos=1)
            o.rotation_euler = (0, R(-13), 0); n += 1
        if x1 - x > 4.0:
            zz = z
            for k in range(rnd.randint(2, 4)):
                g = rnd.uniform(0.35, 0.6); w = rnd.uniform(2.4, 2.9)
                K.bloque(f'ador_{n}', (w, 2.2, g), (x1 - 1.75 + rnd.uniform(-0.1, 0.1), LOMOS + 1.25, zz + g / 2), m[rnd.choice(telas)], bisel=0.035, segmentos=1)
                zz += g + 0.005; n += 1

    vanos = [(MONTANTES[0] + 0.15, MONTANTES[1] - 0.15), (MONTANTES[1] + 0.15, MONTANTES[2] - 0.15), (MONTANTES[2] + 0.15, MONTANTES[3] - 0.15)]
    for z in BALDAS[:-1]:
        for k, (a, b) in enumerate(vanos):
            if k == 1 and z == Z0:
                continue
            fila(a, b, z, rnd.choice((0.55, 0.7, 0.86, 0.95)))
    # en la balda de los proyectos, a la derecha: el sujetalibros de latón y un globo
    sx = HUECO_X + 0.78
    K.bloque('balda_sujeta_pie', (0.9, 1.6, 0.05), (sx + 0.45, LOMOS + 0.9, Z0 + 0.025), m['laton'], bisel=0.015, segmentos=1)
    K.bloque('balda_sujeta_ala', (0.06, 1.6, 2.2), (sx + 0.03, LOMOS + 0.9, Z0 + 1.1), m['laton'], bisel=0.02, segmentos=2)
    gx = sx + 1.15
    torno('balda_globo_pie', gx, LOMOS + 1.0, [(0.0, Z0), (0.42, Z0), (0.42, Z0 + 0.06), (0.1, Z0 + 0.14), (0.06, Z0 + 0.5), (0.0, Z0 + 0.5)], m['laton'], lados=24)
    K.esfera('balda_globo', 0.58, (gx, LOMOS + 1.0, Z0 + 1.08), m['globo'], segmentos=(28, 16))
    K.toro('balda_globo_aro', 0.64, 0.025, (gx, LOMOS + 1.0, Z0 + 1.08), m['laton'], eje='Y') if hasattr(K, 'toro') else None
    # la tarjeta del hueco: «el siguiente»
    g = K.vacio('hueco', (HUECO_X + 0.3, LOMOS + 0.5, Z0), giro=(R(-8), 0, R(-14)))
    K.bloque('balda_hueco_tarjeta', (0.9, 0.03, 1.3), (0, 0, 0.65), m['papel'], padre=g, bisel=0.005, segmentos=1)
    K.lamina('hueco_cara', [(-0.42, -0.018, 0.05), (0.42, -0.018, 0.05), (0.42, -0.018, 1.25), (-0.42, -0.018, 1.25)], m['blanco'], g)


def tomos(m):
    """Los nueve de la balda. Cada uno cuelga de un vacío en el canto de abajo del lomo (se inclina sobre él)."""
    L = LIBRO
    for i in range(9):
        g, h = GRUESOS[i], ALTOS[i]
        r = K.vacio(f'tomo_{i}', (TOMOS_X[i], LOMOS, Z0))
        tela = m[f'tela_{i}']
        K.bloque(f'tomo_{i}_tapa_a', (L['tapa'], L['W'], h), (L['tapa'] / 2, L['W'] / 2, h / 2), tela, padre=r, bisel=0.012, segmentos=1)
        K.bloque(f'tomo_{i}_tapa_b', (L['tapa'], L['W'], h), (g - L['tapa'] / 2, L['W'] / 2, h / 2), tela, padre=r, bisel=0.012, segmentos=1)
        K.bloque(f'tomo_{i}_canto', (g, 0.05, h), (g / 2, 0.025, h / 2), tela, padre=r, bisel=0.012, segmentos=1)
        K.bloque(f'tomo_{i}_hojas', (g - 2 * L['tapa'], L['W'] - L['ceja'], h - 2 * L['ceja']), (g / 2, (L['W'] - L['ceja']) / 2 + 0.03, h / 2), m['hojas'], padre=r, bisel=0)
        # el lomo impreso: se lee de abajo arriba
        K.lamina(f'lomo_{i}', [(g - 0.01, -0.003, 0.012), (g - 0.01, -0.003, h - 0.012), (0.01, -0.003, h - 0.012), (0.01, -0.003, 0.012)], m['blanco'], r)


# ───────────────────────── la mesa ─────────────────────────
def mesa(m):
    t = MESA; cx = (t['x0'] + t['x1']) / 2; w = t['x1'] - t['x0']; f = t['y1'] - t['y0']
    K.bloque('mesa_tablero', (w, f, t['grueso']), (cx, (t['y0'] + t['y1']) / 2, -t['grueso'] / 2), m['roble'], bisel=0.05, segmentos=2)
    K.bloque('mesa_faldon', (w - 0.8, 0.2, 1.1), (cx, t['y0'] + 0.5, -t['grueso'] - 0.55), m['roble'], bisel=0.03, segmentos=1)
    K.bloque('mesa_faldon_t', (w - 0.8, 0.2, 1.1), (cx, t['y1'] - 0.5, -t['grueso'] - 0.55), m['roble'], bisel=0.03, segmentos=1)
    for k, (x, y) in enumerate(((t['x0'] + 0.45, t['y0'] + 0.45), (t['x1'] - 0.45, t['y0'] + 0.45), (t['x0'] + 0.45, t['y1'] - 0.45), (t['x1'] - 0.45, t['y1'] - 0.45))):
        K.bloque(f'mesa_pata_{k}', (0.5, 0.5, 7.7), (x, y, -t['grueso'] - 3.85), m['roble_v'], bisel=0.04, segmentos=1)
    c = CARPETA
    K.bloque('mesa_vade', (c['ancho'], c['fondo'], c['grueso']), (c['x'], c['y'], c['grueso'] / 2), m['cuero'], bisel=0.015, segmentos=2)
    for k, sx in enumerate((-1, 1)):     # las cantoneras de latón del vade
        K.bloque(f'mesa_vade_canto_{k}', (0.5, c['fondo'] + 0.04, 0.02), (c['x'] + sx * (c['ancho'] / 2 - 0.25), c['y'], c['grueso'] + 0.008), m['cuero_o'], bisel=0.006, segmentos=1)
    # la lámpara: pie de latón, brazo y pantalla de cristal verde (un medio cilindro)
    lx, ly = LAMPARA['x'], LAMPARA['y']
    torno('mesa_lampara_pie', lx, ly, [(0.0, 0.0), (0.85, 0.0), (0.85, 0.07), (0.6, 0.16), (0.14, 0.24), (0.1, 0.6), (0.085, 2.35), (0.0, 2.35)], m['laton'], lados=32)
    K.cilindro('mesa_lampara_brazo', 0.06, 1.3, (lx + 0.55, ly, 2.35), m['laton'], eje='X', lados=14)
    K.esfera('mesa_lampara_codo', 0.12, (lx, ly, 2.35), m['laton'], segmentos=(14, 8))
    pant = K.cilindro('mesa_lampara_pantalla', 0.5, 2.3, (lx + 1.2, ly, 2.2), m['cristal'], eje='Y', lados=24)
    pant.scale = (1.0, 1.0, 0.72)
    # se le quita la mitad de abajo: queda la teja
    bm = bmesh.new(); bm.from_mesh(pant.data)
    bmesh.ops.delete(bm, geom=[f for f in bm.faces if f.calc_center_median().z < -0.12], context='FACES')
    bm.to_mesh(pant.data); bm.free()
    so = pant.modifiers.new('grueso', 'SOLIDIFY'); so.thickness = 0.03
    K.cilindro('mesa_lampara_tubo', 0.07, 1.9, (lx + 1.2, ly, 2.2), m['bombilla'], eje='Y', lados=12)
    K.area('luz_lampara', (lx + 1.2, ly, 2.1), (lx + 1.7, ly - 0.6, 0.0), 420, (1.0, 0.82, 0.56), 0.5, 1.8)
    # una lupa y un lápiz, a la derecha
    torno('mesa_lupa_aro', 4.6, -4.5, [(0.52, 0.02), (0.6, 0.02), (0.6, 0.1), (0.52, 0.1), (0.52, 0.02)], m['laton'], lados=32)
    K.cilindro('mesa_lupa_cristal', 0.52, 0.02, (4.6, -4.5, 0.06), m['lente'], eje='Z', lados=32)
    mg = K.cilindro('mesa_lupa_mango', 0.08, 1.3, (5.45, -5.25, 0.08), m['nogal'], eje='X', lados=14); mg.rotation_euler = (0, 0, R(-41))
    lp = K.cilindro('mesa_lapiz', 0.045, 1.8, (4.3, -6.7, 0.045), m['tela_granate'], eje='X', lados=8); lp.rotation_euler = (0, 0, R(17))


def escalera(m):
    """La escalera de la librería, apoyada en la barra de latón, a la derecha."""
    z1, y1, z0, y0 = 11.3, FRENTE - 0.5, -8.0, -4.6
    largo = math.hypot(z1 - z0, y1 - y0) + 0.8; ang = math.atan2(y1 - y0, z1 - z0)
    for k, x in enumerate((8.3, 9.7)):
        o = K.bloque(f'esc_larguero_{k}', (0.16, 0.34, largo), (x, (y0 + y1) / 2, (z0 + z1) / 2), m['roble_v'], bisel=0.03, segmentos=1)
        o.rotation_euler = (-ang, 0, 0)
    for k in range(12):
        t = (k + 0.7) / 12.6
        K.cilindro(f'esc_peldano_{k}', 0.075, 1.4, (9.0, y0 + (y1 - y0) * t, z0 + (z1 - z0) * t), m['roble'], eje='X', lados=10)


# ───────────────────────── el libro que viaja y su desplegable ─────────────────────────
def libro(m):
    """Se monta abierto en la mesa (la tapa, de pie): así se hornea su luz. La web lo cierra, lo gira y lo lleva."""
    L = LIBRO; H, W, T, tc, cj = L['H'], L['W'], L['T'], L['tapa'], L['ceja']
    tp = T / 2 - tc                                  # el grueso de cada mitad de las hojas
    hw, hh = W - cj, H - 2 * cj                      # la página
    r = K.vacio('libro', (PLIEGUE['x'], PLIEGUE['y'], PLIEGUE['z']))
    K.bloque('libro_tela_base', (H, W, tc), (0, -W / 2, tc / 2), m['tela_libro'], padre=r, bisel=0.012, segmentos=1)
    K.bloque('libro_tela_canto', (H, 0.05, T), (0, 0.025, T / 2), m['tela_libro'], padre=r, bisel=0.012, segmentos=1)
    K.bloque('libro_hojas_base', (hh, hw, tp), (0, -hw / 2, tc + tp / 2), m['hojas'], padre=r, bisel=0)
    a = hh / 2
    K.lamina('libro_dorso', [(-H / 2 + 0.01, -W + 0.01, -0.002), (-H / 2 + 0.01, -0.01, -0.002), (H / 2 - 0.01, -0.01, -0.002), (H / 2 - 0.01, -W + 0.01, -0.002)], m['blanco'], r)
    K.lamina('libro_lomo', [(-H / 2 + 0.01, 0.052, T - 0.01), (H / 2 - 0.01, 0.052, T - 0.01), (H / 2 - 0.01, 0.052, 0.01), (-H / 2 + 0.01, 0.052, 0.01)], m['blanco'], r)
    K.lamina('libro_suelo', [(-a, -hw, T / 2 + 0.002), (a, -hw, T / 2 + 0.002), (a, 0, T / 2 + 0.002), (-a, 0, T / 2 + 0.002)], m['blanco'], r)
    # la tapa: su vacío está en el pliegue; se modela cerrada (hacia -y) y el vacío la levanta
    t = K.vacio('libro_tapa', (0, 0, T / 2), padre=r, giro=(R(-90), 0, 0))
    K.bloque('libro_hojas_tapa', (hh, hw, tp), (0, -hw / 2, tp / 2), m['hojas'], padre=t, bisel=0)
    K.bloque('libro_tela_tapa', (H, W, tc), (0, -W / 2, tp + tc / 2), m['tela_libro'], padre=t, bisel=0.012, segmentos=1)
    z = tp + tc + 0.002
    K.lamina('libro_cara', [(-H / 2 + 0.01, -0.01, z), (-H / 2 + 0.01, -W + 0.01, z), (H / 2 - 0.01, -W + 0.01, z), (H / 2 - 0.01, -0.01, z)], m['blanco'], t)
    K.lamina('libro_fondo', [(-a, 0, -0.002), (a, 0, -0.002), (a, -hw, -0.002), (-a, -hw, -0.002)], m['blanco'], t)

    # el desplegable: cada capa cuelga de un vacío en su pliegue (a `d` del lomo), girado como la tapa
    def capa(k):
        c = CAPAS[k]
        return K.vacio(f'pop_{k}', (0, -c['d'], T / 2 + 0.003 * (k + 1)), padre=r, giro=(R(-90), 0, 0))

    def cara(nombre, x0, x1, s0, s1, padre, z=-0.013):
        return K.lamina(nombre, [(x0, -s0, z), (x1, -s0, z), (x1, -s1, z), (x0, -s1, z)], m['blanco'], padre)

    e = 0.02                                          # la cartulina
    p0 = capa(0); c = CAPAS[0]; P = PANTALLA
    K.bloque('pop_telon', (3.1, c['h'], e), (0, -c['h'] / 2, 0), m['cartulina'], padre=p0, bisel=0)
    cara('pop_telon_cara', -1.55, 1.55, 0, c['h'], p0)
    cara('tele_cara', -P['ancho'] / 2, P['ancho'] / 2, P['pie'], P['pie'] + P['alto'], p0, z=-0.017)
    p1 = capa(1); c = CAPAS[1]
    for n, x0, x1 in (('i', -1.72, -1.46), ('d', 1.46, 1.72)):
        K.bloque(f'pop_ala_{n}', (x1 - x0, c['h'], e), ((x0 + x1) / 2, -c['h'] / 2, 0), m['cartulina'], padre=p1, bisel=0)
        cara(f'pop_ala_{n}_cara', x0, x1, 0, c['h'], p1)
    p2 = capa(2); c = CAPAS[2]
    # la fila de libritos de delante: recortes de cartulina, cada uno de un alto
    anchos = [0.3, 0.2, 0.36, 0.24, 0.3, 0.2, 0.34, 0.26, 0.3, 0.22, 0.32]
    altos = [0.34, 0.42, 0.28, 0.38, 0.3, 0.4, 0.26, 0.36, 0.42, 0.3, 0.36]
    x = -sum(anchos) / 2 - 0.02 * 5
    for k, (w, h) in enumerate(zip(anchos, altos)):
        K.bloque(f'pop_frente_{k}', (w, h, e), (x + w / 2, -h / 2, 0), m['cartulina_c' if k % 3 == 1 else 'cartulina'], padre=p2, bisel=0)
        x += w + 0.02
    # las pestañas: tiras horizontales del canto de arriba de cada capa a la de detrás. La web las coloca al abrir
    for n, k, xs, largo, ancho in (('telon', 0, (-1.2, 1.2), CAPAS[0]['d'], 0.26), ('alas', 1, (-1.66, 1.66), CAPAS[1]['d'], 0.1),
                                   ('frente', 2, (-1.66, 1.66), CAPAS[2]['d'] - CAPAS[1]['d'], 0.1)):
        c = CAPAS[k]
        v = K.vacio(f'pest_{k}', (0, -c['d'], T / 2 + c['h'] if k < 2 else T / 2 + 0.3), padre=r)
        for j, px in enumerate(xs):
            K.bloque(f'pop_pest_{n}_{j}', (ancho, largo, 0.012), (px, largo / 2, -0.006), m['cartulina'], padre=v, bisel=0)
    return r


def materiales():
    m = {
        'nogal': K.madera('nogal', '#2c180e', '#5a3620', eje='X', vetas=4.0), 'nogal_v': K.madera('nogal_v', '#2c180e', '#5a3620', eje='Z', vetas=4.0),
        'nogal_o': K.material('nogal_o', '#1f120b', 0.7),
        'roble': K.madera('roble', '#6a4526', '#a87644', eje='X', vetas=3.0), 'roble_v': K.madera('roble_v', '#6a4526', '#a87644', eje='Z', vetas=3.0),
        'pared': K.yeso('pared', '#263129'), 'suelo': K.yeso('suelo', '#2b1f17'),
        'laton': K.material('laton', '#c9a15a', 0.28, metal=0.9), 'oro': K.material('oro', '#d8b468', 0.35, metal=0.8),
        'cuero': K.material('cuero', '#3d1917', 0.55), 'cuero_o': K.material('cuero_o', '#2a100f', 0.5),
        'cristal': K.material('cristal', '#1f6b4a', 0.15, emision='#2f9c6c', fuerza=1.6),
        'bombilla': K.material('bombilla', '#fff1d6', 0.3, emision='#ffd9a0', fuerza=14.0),
        'lente': K.material('lente', '#9db3b8', 0.08), 'globo': K.material('globo', '#b9a374', 0.5),
        'blanco': K.material('blanco', '#f4f1ea', 0.6), 'papel': K.material('papel', '#efe6d2', 0.7),
        'hojas': K.material('hojas', '#e9dfc8', 0.8), 'cartulina': K.material('cartulina', '#f3ecdc', 0.75), 'cartulina_c': K.material('cartulina_c', '#ffffff', 0.75),
        'tela_libro': K.material('tela_libro', '#ffffff', 0.85),
        'tela_verde': K.material('tela_verde', '#2f4a3a', 0.85), 'tela_granate': K.material('tela_granate', '#5e2422', 0.85),
        'tela_azul': K.material('tela_azul', '#28344e', 0.85), 'tela_ocre': K.material('tela_ocre', '#8a6a2c', 0.85),
        'tela_crema': K.material('tela_crema', '#b9aa88', 0.85), 'tela_marron': K.material('tela_marron', '#4a3324', 0.85),
        'tela_gris': K.material('tela_gris', '#555a58', 0.85),
    }
    for i, c in enumerate(TELAS):
        m[f'tela_{i}'] = K.material(f'tela_{i}', c, 0.85)
    return m


def escena():
    K.limpiar()
    m = materiales()
    libreria(m); adorno(m); tomos(m); mesa(m); escalera(m)
    r = libro(m)
    # de noche: la lámpara de la mesa, una luz cálida alta que baña la librería y un relleno frío por la derecha
    K.area('techo', (-2.0, -9.0, 15.0), (0.0, 1.0, 4.0), 2400, (1.0, 0.86, 0.68), 9.0)
    K.area('relleno', (13.0, -12.0, 6.0), (2.0, 0.0, 3.0), 520, (0.74, 0.84, 1.0), 8.0)
    K.area('mesa_alta', (1.0, -7.5, 9.0), (0.0, -4.6, 0.5), 520, (1.0, 0.9, 0.78), 5.0)
    K.mundo('#221d1a', 0.1)
    return m, r


SUELTAS = re.compile(r'^(lomo_\d|hueco_cara|tele_cara|libro_\w+|pop_\w+|mesa_lampara_(tubo|pantalla))$')


def en_la_web(n):
    if n.startswith('tomo_'):
        return 'tomos', 4
    if n.startswith(('mesa_', 'esc_')):
        return 'mesa', 30 if re.search(r'lampara|lupa_aro', n) else 6
    if re.search(r'filete|barra|sujeta|globo_pie|globo_aro|_f\d+$', n):
        return 'sala', 30
    return 'sala', 4


def unir_para_la_web(todo):
    """Ya horneado, lo que se mueve junto y brilla igual se exporta como una sola malla: `<lámina>_unida[n][_b<brillo>]`."""
    grupos = {}
    for o in todo:
        if not SUELTAS.match(o.name):
            grupos.setdefault((o.parent, *en_la_web(o.name)), []).append(o)
    vistos = {}
    comun = K.gris('para_la_web')
    for (padre, luz, brillo), objs in grupos.items():
        vistos[luz, brillo] = n = vistos.get((luz, brillo), 0) + 1
        nombre = f'{luz}_unida{n if n > 1 else ""}_b{brillo}'
        for o in objs:
            o.data.materials.clear(); o.data.materials.append(comun)
        if len(objs) > 1:
            K.seleccionar(objs); bpy.ops.object.join()
        junto = bpy.context.view_layer.objects.active if len(objs) > 1 else objs[0]
        junto.name = nombre; junto.data.name = nombre
        junto.data.uv_layers.active = junto.data.uv_layers['luz']


def principal():
    m, raiz = escena()
    if 'vista' in RESTO or 'vista_mesa' in RESTO:
        K.ajustes(1440, 900, MUESTRAS)
        if 'vista_mesa' in RESTO:
            K.camara((0.5, -17.0, 6.0), (0.0, -4.4, 1.3), 50)
        else:
            K.camara((0.0, -34.0, 9.5), (0.0, 0.0, 4.2), 40)
        bpy.context.scene.render.filepath = os.path.join(DESTINO, ('vista_mesa' if 'vista_mesa' in RESTO else 'vista') + '.png')
        bpy.ops.render.render(write_still=True)
        return
    import time
    t0 = time.time(); reloj = lambda *x: print(f'[{time.time() - t0:7.1f} s]', *x, flush=True)  # noqa: E731
    K.preparar(); reloj('preparado')
    K.ajustes(64, 64, MUESTRAS)
    horno = K.Horno(DESTINO)
    todo = K.mallas()
    nombres = lambda *pre: [o for o in todo if o.name.startswith(pre)]  # noqa: E731
    pop = [o for o in todo if o.name.startswith(('pop_', 'tele_cara')) or o.name in ('libro_suelo', 'libro_fondo')]
    viaja = [o for o in nombres('libro_') if o not in pop]
    g = {'sala': nombres('sala_', 'lib_', 'ador_', 'balda_', 'hueco_'), 'tomos': nombres('tomo_', 'lomo_'), 'mesa': nombres('mesa_', 'esc_'), 'pop': pop, 'libro': viaja}
    if 'medir' in RESTO:
        import collections
        tri = lambda o: sum(len(pl.vertices) - 2 for pl in o.data.polygons)  # noqa: E731
        por_tipo = collections.Counter()
        for o in todo:
            por_tipo[re.sub(r'\d+', '#', o.name)] += tri(o)
        print('TRIANGULOS', sum(tri(o) for o in todo), 'MALLAS', len(todo), 'SIN GRUPO', [o.name for o in todo if not any(o in v for v in g.values())], flush=True)
        for clave, objs in g.items():
            print(f'GRUPO {clave:8s} {len(objs):4d} piezas {sum(tri(o) for o in objs):7d} triángulos', flush=True)
        for k, v in por_tipo.most_common(24):
            print(f'TIPO {v:7d} {k}', flush=True)
        return
    for clave, objs in g.items():
        K.desplegar(objs, 0.004 if clave in ('pop', 'libro', 'tomos') else 0.006)
        reloj('desplegado', clave, len(objs), 'piezas')

    def hornear(objs, nombre, tam, *a, **k):
        if 'boceto' in RESTO:       # sin hornear: una lámina gris, para probar la web mientras la cola está ocupada
            import numpy as np
            np.save(os.path.join(horno.destino, nombre + '.npy'), np.full((64, 64, 4), 0.5, dtype='float16'))
            horno.texturas[nombre] = {'tam': 64, 'sin_perdida': False, 'contraste': 1.0, 'pareja': k.get('pareja'), 'suave': 0, 'percentil': 99.7, 'piezas': []}
            return
        horno.hornear_junto(objs, nombre, tam, *a, reusar='seguir' in RESTO, **k); reloj('horneado', nombre)
    del_libro = pop + viaja
    # 1. la sala, los nueve y la mesa, sin el libro abierto
    for o in del_libro:
        o.hide_render = True
    hornear(g['sala'], 'sala', 4096, color=True, publicar=2048)
    hornear(g['tomos'], 'tomos', 2048, color=True, publicar=1024)
    hornear(g['mesa'], 'mesa', 2048, color=True, publicar=1024, pareja='mesa')
    # 2. con el libro abierto en la mesa: su desplegable (con las sombras de unas capas en otras) y la mesa con su sombra
    for o in del_libro:
        o.hide_render = False
    hornear(g['pop'], 'pop', 2048, color=True, publicar=1024, percentil=99.9)
    hornear(g['mesa'], 'mesa_libro', 2048, color=True, publicar=1024, pareja='mesa')
    # 3. lo que viaja (las tapas, el canto y las hojas), en el estudio: su luz vale para la balda, la mano y la mesa
    raiz.location = (0, -80, 5)
    for o in bpy.context.scene.objects:
        if o.type in ('MESH', 'LIGHT'):
            o.hide_render = o not in del_libro
    bpy.context.scene.world = K.mundo_estudio()
    hornear(g['libro'], 'libro', 1024, color=True)
    for o in bpy.context.scene.objects:
        o.hide_render = False
    raiz.location = (PLIEGUE['x'], PLIEGUE['y'], PLIEGUE['z'])
    unir_para_la_web(todo); reloj('unido', len(K.mallas()), 'mallas')
    horno.exportar({'libro': LIBRO, 'pliegue': PLIEGUE, 'capas': CAPAS, 'pantalla': PANTALLA, 'z0': Z0, 'lomos': LOMOS, 'altos': ALTOS, 'gruesos': GRUESOS,
                    'tomos_x': TOMOS_X, 'hueco_x': HUECO_X, 'mesa': MESA}); reloj('exportado')


principal()
