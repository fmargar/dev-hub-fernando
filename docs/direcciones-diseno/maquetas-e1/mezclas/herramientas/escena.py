"""La mesa de mezclas: un estudio de grabación con una mesa de diez canales, uno por proyecto.

  pesado.sh --cola gpu mezclas-e1 -- <python con bpy> escena.py <carpeta> [muestras] [vista|medir|malla|seguir]

Un estudio a media luz: la mesa inclinada sobre el escritorio de nogal, con sus mejillas de madera y el reposabrazos
acolchado; detrás, el monitor grande entre dos altavoces de escucha, y la pared con paneles acústicos bañada por una
tira de luz ámbar. Cada canal tiene su fader (con la tapa del color de su proyecto), su medidor, sus botones de solo
y silencio y dos mandos. La cara de la mesa (las escalas, las ranuras, los rótulos de cada canal) la pinta la web.

Lo que la web mueve o pinta va suelto: los diez faders (cada uno bajo su vacío, hijo del vacío inclinado `mesa`: se
mueven a lo largo de la ranura cambiando una sola coordenada), los botones, los medidores (una lámina por canal, sin
luz horneada: son luces) y la pantalla del monitor.
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

# ── Medidas (1 = 10 cm). X a la derecha, Y hacia la pared, Z arriba; el escritorio en z = 0 ──
ORDEN = ['adivinadle', 'wardux', 'calculo', 'agentes', 'erp', 'servidor', 'marbella', 'vados', 'vision', 'siguiente']
COLOR = {'adivinadle': '#1B2140', 'wardux': '#9E3A26', 'calculo': '#17583F', 'agentes': '#4A2F78', 'erp': '#17656A',
         'servidor': '#1C47A0', 'marbella': '#C5612A', 'vados': '#B8901C', 'vision': '#94295F', 'siguiente': '#8c8880'}
INCLINA = 13.0                                   # grados que sube la cara de la mesa hacia el fondo
PIVOTE = (0.0, -3.0, 1.0)                        # el canto delantero de la cara
X0, PASO, FONDO = -8.4, 1.4, 7.4                 # la cara: de X0 a -X0, diez canales de PASO y la sección maestra
MAESTRO = X0 + PASO * 10                         # donde empieza la sección maestra
FADER = {'y0': 1.5, 'rec': 2.8, 'dx': -0.18}     # centro de la tapa abajo, recorrido, desvío respecto al centro del canal
MED = {'dx': 0.44, 'ancho': 0.2, 'y0': 1.15, 'y1': 4.65}
BOTON = {'y': 5.3, 'dx': 0.28, 'ancho': 0.44, 'fondo': 0.4}
MANDOS = [6.1, 6.8]
MONITOR = {'x': 0.0, 'y': 7.2, 'z': 7.45, 'ancho': 9.6, 'alto': 5.4, 'marco': 0.25, 'fondo': 0.4}
SEN, COS = math.sin(R(INCLINA)), math.cos(R(INCLINA))


def centro(i):
    return X0 + PASO * (i + 0.5)


def mundo(x, y, z=0.0):
    """De las coordenadas de la cara (x, y hacia el fondo, z fuera de la cara) a las del estudio."""
    return (PIVOTE[0] + x, PIVOTE[1] + y * COS - z * SEN, PIVOTE[2] + y * SEN + z * COS)


def cuna(nombre, perfil, x0, x1, mat):
    """Polígono `perfil` [(y, z)…] extruido de x0 a x1 (el cuerpo de la mesa y sus mejillas)."""
    bm = bmesh.new()
    a = [bm.verts.new((x0, y, z)) for y, z in perfil]; b = [bm.verts.new((x1, y, z)) for y, z in perfil]
    n = len(perfil); bm.faces.new(a); bm.faces.new(b[::-1])
    for i in range(n):
        j = (i + 1) % n; bm.faces.new((a[i], b[i], b[j], a[j]))
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    me = bpy.data.meshes.new(nombre); bm.to_mesh(me); bm.free()
    o = K.objeto(nombre, me, None, mat)
    bis = o.modifiers.new('bisel', 'BEVEL'); bis.width = 0.03; bis.segments = 2; bis.limit_method = 'ANGLE'
    return o


def materiales():
    return {
        'blanco': K.material('blanco', '#ffffff', 0.55), 'chapa': K.material('chapa', '#26282d', 0.45, metal=0.5),
        'nogal': K.madera('nogal', '#4a2c1b', '#7a5236', eje='Y', vetas=5), 'mesa_m': K.madera('mesa_m', '#3a2416', '#5e3d27', eje='X', vetas=7),
        'cuero': K.material('cuero', '#1b1a1c', 0.6), 'goma': K.material('goma', '#1c1d20', 0.7),
        'mando': K.material('mando', '#2e3036', 0.4, capa=0.3), 'marca': K.material('marca', '#f1ede2', 0.5),
        'tecla': K.material('tecla', '#d9d5cb', 0.45), 'acero': K.material('acero', '#b9bec4', 0.3, metal=0.9),
        'rojo': K.material('rojo', '#b3261e', 0.4, capa=0.3), 'negro': K.material('negro', '#0b0c0e', 0.35),
        'caja': K.material('caja', '#17181b', 0.6), 'cono': K.material('cono', '#2b2d33', 0.55), 'cupula': K.material('cupula', '#0e0f11', 0.3, capa=0.5),
        'aro': K.material('aro', '#c09a55', 0.3, metal=0.85), 'pared': K.yeso('pared_m', '#34363d'),
        'fieltro_a': K.material('fieltro_a', '#2a3a4a', 0.95), 'fieltro_b': K.material('fieltro_b', '#3b4b59', 0.95), 'fieltro_c': K.material('fieltro_c', '#22303d', 0.95),
        'taza': K.material('taza', '#e8e2d4', 0.25, capa=0.4), 'papel': K.material('papel_e', '#efe9da', 0.8), 'lapiz': K.material('lapiz', '#f2c230', 0.5),
        'suelo': K.material('suelo_m', '#1c1c20', 0.8),
    }


def mesa(m):
    """La mesa: el cuerpo, las mejillas, el reposabrazos, la cara impresa y lo que lleva cada canal."""
    raiz = K.vacio('mesa', PIVOTE, giro=(R(INCLINA), 0, 0))
    atras = mundo(0, FONDO)
    cuerpo = [(-4.35, 0.0), (-4.35, 0.62), (PIVOTE[1], PIVOTE[2] - 0.03), (atras[1], atras[2] - 0.03), (atras[1] + 0.35, atras[2] - 0.03), (atras[1] + 0.35, 0.0)]
    cuna('mesa_cuerpo', cuerpo, X0, -X0, m['chapa'])
    mejilla = [(-4.55, 0.0), (-4.55, 0.8), (PIVOTE[1], PIVOTE[2] + 0.22), (atras[1] + 0.1, atras[2] + 0.26), (atras[1] + 0.55, atras[2] + 0.26), (atras[1] + 0.55, 0.0)]
    cuna('mesa_mejilla_izq', mejilla, X0 - 0.4, X0, m['nogal']); cuna('mesa_mejilla_der', mejilla, -X0, -X0 + 0.4, m['nogal'])
    # el reposabrazos acolchado, delante de la cara
    rb = K.bloque('mesa_reposabrazos', (-2 * X0, 1.42, 0.3), (0, -3.68, 0.82), m['cuero'], bisel=0.12, segmentos=3)
    rb.rotation_euler = (R(15), 0, 0)
    # el canto trasero de la cara: un perfil de chapa con las tomas
    K.bloque('mesa_metal_canto', (-2 * X0, 0.14, 0.16), (0, FONDO + 0.07, 0.06), m['acero'], padre=raiz, bisel=0.02, segmentos=2)
    # la cara, que pinta la web
    K.lamina('cara', [(X0, 0, 0), (-X0, 0, 0), (-X0, FONDO, 0), (X0, FONDO, 0)], m['blanco'], padre=raiz)
    for i, id_ in enumerate(ORDEN):
        cx = centro(i)
        # el fader: la tapa del color del proyecto, con su raya
        f = K.vacio(f'fader_{i}', (cx + FADER['dx'], FADER['y0'], 0), padre=raiz)
        tapa = K.material(f'tapa_{id_}', COLOR[id_], 0.42, capa=0.35)
        K.bloque(f'fader_{i}_tapa', (0.62, 0.96, 0.36), (0, 0, 0.2), tapa, padre=f, bisel=0.07, segmentos=2)
        K.bloque(f'fader_{i}_raya', (0.64, 0.08, 0.375), (0, 0, 0.2), m['marca'], padre=f, bisel=0)
        K.bloque(f'fader_{i}_vastago', (0.1, 0.2, 0.1), (0, 0, 0.03), m['acero'], padre=f, bisel=0)
        # el medidor: una lámina que la web enciende
        x = cx + MED['dx'] - MED['ancho'] / 2
        K.lamina(f'medidor_{i}', [(x, MED['y0'], 0.012), (x + MED['ancho'], MED['y0'], 0.012), (x + MED['ancho'], MED['y1'], 0.012), (x, MED['y1'], 0.012)], m['negro'], padre=raiz)
        # solo y silencio
        for s, dx in (('s', -BOTON['dx']), ('m', BOTON['dx'])):
            K.bloque(f'boton_{s}_{i}', (BOTON['ancho'], BOTON['fondo'], 0.16), (cx + dx, BOTON['y'], 0.07), m['tecla'], padre=raiz, bisel=0.035, segmentos=2)
        # dos mandos, con su índice
        for k, y in enumerate(MANDOS):
            K.cilindro(f'mesa_mando_{i}_{k}', 0.25, 0.34, (cx, y, 0.17), m['mando'], padre=raiz, lados=20, eje='Z', r2=0.21, bisel=0.02)
            g = R((-120, 40, 95, -60, 10, 130, -30, 70, -100, 0, 25, -75, 110, -15, 55, -130, 85, 20, -45, 0)[i * 2 + k])
            K.bloque(f'mesa_mando_{i}_{k}_i', (0.05, 0.16, 0.02), (cx + 0.12 * math.sin(g), y + 0.12 * math.cos(g), 0.345), m['marca'], padre=raiz, bisel=0).rotation_euler = (0, 0, -g)
    # la sección maestra: el fader rojo (fijo), los dos medidores de salida y el mando grande de escucha
    xm = (MAESTRO - X0) / 2 + 0.0
    xm = (MAESTRO + -X0) / 2
    K.bloque('mesa_maestro_tapa', (0.74, 1.05, 0.38), (xm - 0.35, 3.55, 0.21), m['rojo'], padre=raiz, bisel=0.07, segmentos=2)
    K.bloque('mesa_maestro_raya', (0.76, 0.08, 0.395), (xm - 0.35, 3.55, 0.21), m['marca'], padre=raiz, bisel=0)
    for k, dx in enumerate((0.55, 0.85)):
        x = xm + dx - MED['ancho'] / 2
        K.lamina(f'medidor_{10 + k}', [(x, MED['y0'], 0.012), (x + MED['ancho'], MED['y0'], 0.012), (x + MED['ancho'], MED['y1'], 0.012), (x, MED['y1'], 0.012)], m['negro'], padre=raiz)
    K.cilindro('mesa_mando_escucha', 0.52, 0.42, (xm, 6.35, 0.21), m['mando'], padre=raiz, lados=28, eje='Z', r2=0.46, bisel=0.03)
    K.cilindro('mesa_metal_escucha_aro', 0.56, 0.05, (xm, 6.35, 0.025), m['aro'], padre=raiz, lados=28, eje='Z')
    K.bloque('mesa_mando_escucha_i', (0.07, 0.3, 0.02), (xm - 0.16, 6.35 + 0.22, 0.425), m['marca'], padre=raiz, bisel=0).rotation_euler = (0, 0, R(36))
    for k, dx in enumerate((-0.75, 0.75)):
        K.bloque(f'mesa_maestro_tecla_{k}', (0.7, 0.4, 0.16), (xm + dx, 5.3, 0.07), m['tecla'], padre=raiz, bisel=0.035, segmentos=2)
    return raiz


def estudio(m):
    """El escritorio, el monitor grande, los dos altavoces de escucha, la pared y lo de encima del escritorio."""
    K.bloque('estudio_escritorio', (34, 17, 0.6), (0, 1.5, -0.3), m['mesa_m'], bisel=0.04, segmentos=2)
    K.bloque('suelo', (90, 60, 0.1), (0, -5, -8), m['suelo'], bisel=0)
    K.bloque('pared', (90, 0.3, 50), (0, 11.0, 8), m['pared'], bisel=0)
    # paneles acústicos: losas de fieltro a tresbolillo, a dos fondos
    k = 0
    for f in range(3):
        for c in range(8):
            fondo = (0.5, 0.3, 0.42)[(c + f) % 3]
            K.bloque(f'pared_panel_{k}', (3.9, fondo, 3.9), (-14.35 + 4.1 * c, 10.85 - fondo / 2, 2.6 + 4.1 * f), m[('fieltro_a', 'fieltro_b', 'fieltro_c')[(c * 2 + f) % 3]], bisel=0.05, segmentos=2)
            k += 1
    # el monitor grande, en su pie
    M = MONITOR; x, y, z = M['x'], M['y'], M['z']; A, Al, mc = M['ancho'], M['alto'], M['marco']
    K.bloque('estudio_monitor_caja', (A + 2 * mc, M['fondo'], Al + 2 * mc), (x, y + 0.02, z), m['caja'], bisel=0.06, segmentos=2)
    K.bloque('estudio_monitor_cuello', (1.2, 0.3, z), (x, y + 0.4, z / 2), m['caja'], bisel=0.04, segmentos=2)
    K.bloque('estudio_monitor_base', (4.6, 2.4, 0.16), (x, y + 0.3, 0.08), m['caja'], bisel=0.05, segmentos=2)
    yc = y - M['fondo'] / 2 + 0.01
    K.lamina('pantalla_cara', [(x - A / 2, yc, z - Al / 2), (x + A / 2, yc, z - Al / 2), (x + A / 2, yc, z + Al / 2), (x - A / 2, yc, z + Al / 2)], m['negro'])
    # los altavoces de escucha, sobre sus pies y girados hacia quien mezcla
    for s, lado in (('izq', -1), ('der', 1)):
        v = K.vacio(f'altavoz_{s}', (lado * 8.6, 7.0, 0), giro=(0, 0, R(-14 * lado)))
        K.bloque(f'estudio_altavoz_{s}_pie', (1.5, 1.5, 3.7), (0, 0.2, 1.85), m['caja'], padre=v, bisel=0.05, segmentos=2)
        K.bloque(f'estudio_altavoz_{s}_peana', (2.9, 2.5, 0.16), (0, 0.2, 3.78), m['goma'], padre=v, bisel=0.04, segmentos=2)
        K.bloque(f'estudio_altavoz_{s}_caja', (3.0, 2.6, 4.7), (0, 0.2, 6.21), m['caja'], padre=v, bisel=0.1, segmentos=2)
        yf = 0.2 - 1.3
        K.tubo(f'estudio_altavoz_{s}_aro', 0.98, 1.1, 0.1, (0, yf, 5.35), m['aro'], padre=v, lados=40)
        K.cilindro(f'estudio_altavoz_{s}_cono', 0.98, 0.06, (0, yf + 0.04, 5.35), m['cono'], padre=v, lados=40)
        K.esfera(f'estudio_altavoz_{s}_cupula', 0.36, (0, yf + 0.06, 5.35), m['cupula'], padre=v, escala=(1, 0.4, 1), segmentos=(20, 10))
        K.tubo(f'estudio_altavoz_{s}_aro_a', 0.36, 0.44, 0.08, (0, yf, 7.55), m['aro'], padre=v, lados=28)
        K.esfera(f'estudio_altavoz_{s}_agudos', 0.34, (0, yf + 0.06, 7.55), m['cupula'], padre=v, escala=(1, 0.5, 1), segmentos=(20, 10))
        K.cilindro(f'estudio_altavoz_{s}_boca', 0.24, 0.05, (0.95 * -lado, yf + 0.01, 7.7), m['negro'], padre=v, lados=20)
    # sobre el escritorio: los auriculares, una taza, el cuaderno de pistas y un lápiz
    K.toro('estudio_cascos_arco', 1.0, 0.09, (12.2, -1.6, 1.0), m['goma'], eje='Y').rotation_euler = (0, 0, R(24))
    for dx in (-1, 1):
        o = K.cilindro(f'estudio_cascos_{dx}', 0.62, 0.42, (12.2 + dx * 0.93 * math.cos(R(24)), -1.6 + dx * 0.93 * math.sin(R(24)), 0.64), m['caja'], lados=28, eje='X', bisel=0.06)
        o.rotation_euler = (0, 0, R(24))
        K.cilindro(f'estudio_cascos_{dx}_a', 0.5, 0.2, (12.2 + dx * 0.7 * math.cos(R(24)), -1.6 + dx * 0.7 * math.sin(R(24)), 0.64), m['cuero'], lados=28, eje='X', bisel=0.05).rotation_euler = (0, 0, R(24))
    K.tubo('estudio_taza', 0.3, 0.34, 0.66, (-11.6, -2.6, 0.33), m['taza'], eje='Z', lados=32)
    K.cilindro('estudio_taza_fondo', 0.31, 0.05, (-11.6, -2.6, 0.03), m['taza'], eje='Z', lados=32)
    K.toro('estudio_taza_asa', 0.17, 0.045, (-11.6 - 0.4, -2.6, 0.34), m['taza'], eje='Y')
    K.bloque('estudio_cuaderno', (2.4, 3.1, 0.14), (-12.3, 0.9, 0.07), m['papel'], bisel=0.02, segmentos=2).rotation_euler = (0, 0, R(-9))
    K.bloque('estudio_lapiz', (0.1, 1.6, 0.08), (-11.5, 1.0, 0.18), m['lapiz'], bisel=0.01, segmentos=1).rotation_euler = (0, 0, R(28))


def luces():
    # el foco de trabajo, cálido, sobre la mesa; un contraluz frío desde la izquierda y la tira ámbar que baña la pared
    K.area('techo', (0, -5.5, 14), (0, 0.5, 2), 2300, (1.0, 0.92, 0.8), 12, 5)
    K.area('contra', (-16, 4, 10), (0, 2, 3), 800, (0.62, 0.76, 1.0), 6)
    K.area('calida', (16, -3, 6), (0, 0, 2), 380, (1.0, 0.62, 0.38), 5)
    K.area('tira', (0, 9.3, 0.7), (0, 11.0, 7), 520, (1.0, 0.5, 0.26), 26, 0.5)
    K.mundo('#23262e', 0.3)


def datos():
    M = MONITOR
    return {'orden': ORDEN, 'inclina': INCLINA, 'pivote': PIVOTE, 'x0': X0, 'paso': PASO, 'fondo': FONDO, 'maestro': MAESTRO,
            'fader': FADER, 'medidor': MED, 'boton': BOTON, 'mandos': MANDOS, 'monitor': M, 'color': COLOR}


def foto(nombre, pos, mira, lente):
    K.ajustes(1440, 900, MUESTRAS)
    K.camara(pos, mira, lente)
    bpy.context.scene.render.filepath = os.path.join(DESTINO, nombre + '.png')
    bpy.ops.render.render(write_still=True)


def unir_para_la_web(todo):
    """Ya horneado, lo que no se mueve se exporta unido (una llamada de dibujo cada grupo): la mesa en lo metálico y lo
    demás; el estudio; la pared con el suelo. Cada fader, entero bajo su vacío. Sueltos: la cara, los medidores, los
    botones y la pantalla (la web los pinta o los enciende)."""
    comun = K.gris('para_la_web')
    grupos = {}
    for o in todo:
        n = o.name
        if n == 'cara' or n == 'pantalla_cara' or n.startswith(('medidor_', 'boton_')):
            continue
        f = re.match(r'^(fader_\d+)_', n)
        if f:
            a, nombre = bpy.data.objects[f.group(1)], f'{f.group(1)}_unida'
        elif n.startswith('mesa_metal_'):
            a, nombre = None, 'mesa_metal_unida'
        elif n.startswith('mesa_'):
            a, nombre = None, 'mesa_unida'
        elif n.startswith('estudio_'):
            a, nombre = None, 'estudio_unido'
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
    K.limpiar()
    m = materiales()
    mesa(m); estudio(m); luces()
    if 'vista' in RESTO:
        m['blanco'].node_tree.nodes['Principled BSDF'].inputs['Base Color'].default_value = K.srgb('#2a2c31')   # sin el canvas
        return foto('vista', (0, -30, 19), (0, 2.2, 3.4), 46)
    import time
    t0 = time.time(); reloj = lambda *x: print(f'[{time.time() - t0:7.1f} s]', *x, flush=True)  # noqa: E731
    bpy.context.view_layer.update()
    K.preparar(); reloj('preparado')
    K.ajustes(64, 64, MUESTRAS)
    horno = K.Horno(DESTINO)
    todo = K.mallas()
    nombres = lambda *pre: [o for o in todo if o.name.startswith(pre)]  # noqa: E731
    g = {'cara': nombres('cara'), 'mesa': nombres('mesa_', 'boton_'), 'faders': nombres('fader_'), 'estudio': nombres('estudio_'),
         'pared': nombres('pared', 'suelo')}
    for clave, objs in g.items():
        if clave != 'cara':
            K.desplegar(objs, 0.003 if clave in ('mesa', 'faders') else 0.005)
        else:
            lz = objs[0].data.uv_layers['luz']      # la cara: su luz, con las mismas coordenadas que su impreso
            for i, c in enumerate([(0, 0), (1, 0), (1, 1), (0, 1)]):
                lz.data[i].uv = c
        reloj('desplegado', clave, len(objs), 'piezas', sum(len(o.data.polygons) for o in objs), 'caras')
    if 'medir' in RESTO:
        import collections
        tri = lambda o: sum(len(pl.vertices) - 2 for pl in o.data.polygons)  # noqa: E731
        por_tipo = collections.Counter()
        for o in todo:
            por_tipo[re.sub(r'(_\d+)+(_[a-z])?$|_(izq|der).*$', '', o.name)] += tri(o)
        print('TRIANGULOS', sum(tri(o) for o in todo), 'MALLAS', len(todo), flush=True)
        for k, v in por_tipo.most_common(25):
            print(f'TIPO {v:7d} {k}', flush=True)
        return
    if 'malla' in RESTO:     # sin hornear: la escena con una luz gris plana, para probar la web mientras la cola está ocupada
        import numpy as np
        for n in g:
            np.save(os.path.join(DESTINO, n + '.npy'), np.full((64, 64, 4), 0.4, dtype='float16'))
            horno.texturas[n] = {'tam': 64, 'sin_perdida': False, 'contraste': 1.0, 'pareja': None, 'suave': 0, 'percentil': 99.7, 'piezas': []}
        unir_para_la_web(todo); horno.exportar(datos())
        return
    seguir = 'seguir' in RESTO

    def hornear(objs, nombre, *a, **k):
        horno.hornear_junto(objs, nombre, *a, reusar=seguir, **k); reloj('horneado', nombre)
    # la cara, sin los faders: se mueven, y su sombra horneada se quedaría abajo
    for o in g['faders']:
        o.hide_render = True
    horno.hornear(g['cara'], 'cara', 1024, color=True, suave=2.0); reloj('horneado', 'cara')
    for o in g['faders']:
        o.hide_render = False
    hornear(g['mesa'], 'mesa', 2048, color=True)
    hornear(g['faders'], 'faders', 1024, color=True)
    hornear(g['estudio'], 'estudio', 2048, color=True)
    hornear(g['pared'], 'pared', 1024, color=True, percentil=99.0)
    unir_para_la_web(todo); reloj('unido', len(K.mallas()), 'mallas')
    horno.exportar(datos()); reloj('exportado')


principal()
