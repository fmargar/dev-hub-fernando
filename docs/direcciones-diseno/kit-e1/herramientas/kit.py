"""Kit E1: lo común para montar una maqueta en Blender y hornear su luz para three.js.

Cada maqueta tiene su `escena.py`, que importa este módulo, monta su escena con estas piezas y llama a
`hornear_todo()`. Se ejecuta con el Python que trae `bpy`, siempre por la cola de la gráfica:

  ~/infra/pesado/pesado.sh --cola gpu <nombre> -- <python con bpy> escena.py <carpeta> [muestras]

Lo que sale en la carpeta: `escena.glb` (la geometría con dos juegos de coordenadas: «UVMap» para lo impreso y
«luz» para la luz horneada), un `.npy` por textura de luz (lineal, sin color salvo donde se pide) y
`horno.json`, que dice a `luces.py` cómo pasar cada una a WebP. La web multiplica color × impreso × luz.

Unidades: 1 = 10 cm. X a la derecha, Y hacia el fondo (la cámara mira desde -Y), Z hacia arriba. En glTF
(y en three.js) eso pasa a (x, z, -y).
"""
import json
import math
import os
import sys

import bpy
import bmesh  # noqa: E402
from mathutils import Matrix, Vector

R = math.radians


# ───────────────────────── utilidades ─────────────────────────
def srgb(h):
    h = h.lstrip('#'); c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return tuple(((x + 0.055) / 1.055) ** 2.4 if x > 0.04045 else x / 12.92 for x in c) + (1.0,)


def limpiar():
    bpy.ops.wm.read_factory_settings(use_empty=True)


def material(nombre, color='#888888', rugo=0.5, metal=0.0, capa=0.0, emision=None, fuerza=0.0):
    m = bpy.data.materials.new(nombre); m.use_nodes = True
    p = m.node_tree.nodes['Principled BSDF']
    p.inputs['Base Color'].default_value = srgb(color)
    p.inputs['Roughness'].default_value = rugo
    p.inputs['Metallic'].default_value = metal
    if capa:
        p.inputs['Coat Weight'].default_value = capa
        p.inputs['Coat Roughness'].default_value = 0.05
    if emision:
        p.inputs['Emission Color'].default_value = srgb(emision)
        p.inputs['Emission Strength'].default_value = fuerza
    return m


def objeto(nombre, malla, padre=None, mat=None):
    o = bpy.data.objects.new(nombre, malla); bpy.context.scene.collection.objects.link(o)
    if mat:
        o.data.materials.append(mat)
    if padre:
        o.parent = padre
    return o


def vacio(nombre, pos=(0, 0, 0), padre=None, giro=(0, 0, 0)):
    o = bpy.data.objects.new(nombre, None); bpy.context.scene.collection.objects.link(o)
    o.location = pos; o.rotation_euler = giro
    if padre:
        o.parent = padre
    return o


def bloque(nombre, tam, pos, mat, padre=None, bisel=0.006, segmentos=3):
    """Prisma con los cantos redondeados (el bisel es un modificador; se aplica al preparar el horneado)."""
    bm = bmesh.new(); bmesh.ops.create_cube(bm, size=1.0)
    for v in bm.verts:
        v.co = Vector((v.co.x * tam[0], v.co.y * tam[1], v.co.z * tam[2]))
    me = bpy.data.meshes.new(nombre); bm.to_mesh(me); bm.free()
    o = objeto(nombre, me, padre, mat); o.location = pos       # el origen, en el centro de la pieza
    if bisel:
        b = o.modifiers.new('bisel', 'BEVEL'); b.width = bisel; b.segments = segmentos; b.limit_method = 'ANGLE'
    for pol in me.polygons:
        pol.use_smooth = True
    return o


def lamina(nombre, esquinas, mat, padre=None):
    """Plano impreso: esquinas abajo-izq, abajo-der, arriba-der, arriba-izq VISTAS por quien lo mira."""
    me = bpy.data.meshes.new(nombre)
    me.from_pydata([Vector(e) for e in esquinas], [], [(0, 1, 2, 3)])
    uv = me.uv_layers.new(name='UVMap')
    for i, c in enumerate([(0, 0), (1, 0), (1, 1), (0, 1)]):
        uv.data[i].uv = c
    return objeto(nombre, me, padre, mat)


def anillo(nombre, r1, r2, centro, mat, padre=None, lados=96, mira=-1):
    """Corona circular en el plano XZ que mira a -Y (mira=-1) o a +Y, con coordenadas planas (para impresos)."""
    bm = bmesh.new(); uvl = bm.loops.layers.uv.new('UVMap')
    fuera, dentro = [], []
    for i in range(lados):
        a = 2 * math.pi * i / lados
        fuera.append(bm.verts.new((centro[0] + r2 * math.cos(a), centro[1], centro[2] + r2 * math.sin(a))))
        dentro.append(bm.verts.new((centro[0] + r1 * math.cos(a), centro[1], centro[2] + r1 * math.sin(a))))
    for i in range(lados):
        j = (i + 1) % lados
        f = bm.faces.new((dentro[i], dentro[j], fuera[j], fuera[i]))
        for l in f.loops:
            u = (l.vert.co.x - centro[0]) / (2 * r2)
            l[uvl].uv = (0.5 + u * (-mira), 0.5 + (l.vert.co.z - centro[2]) / (2 * r2))
    me = bpy.data.meshes.new(nombre); bm.to_mesh(me); bm.free()
    o = objeto(nombre, me, padre, mat)
    for p in o.data.polygons:
        if (p.normal.y > 0) != (mira > 0):
            p.flip()
    return o


def cilindro(nombre, r, alto, centro, mat, padre=None, lados=64, eje='Y', r2=None, bisel=0.0, tapas=True):
    """Cilindro (o tronco de cono con r2) con el eje en Y, X o Z."""
    bm = bmesh.new()
    bmesh.ops.create_cone(bm, cap_ends=tapas, segments=lados, radius1=r, radius2=r if r2 is None else r2, depth=alto)
    if eje == 'Y':
        bmesh.ops.rotate(bm, verts=bm.verts, cent=(0, 0, 0), matrix=Matrix.Rotation(R(90), 3, 'X'))
    elif eje == 'X':
        bmesh.ops.rotate(bm, verts=bm.verts, cent=(0, 0, 0), matrix=Matrix.Rotation(R(90), 3, 'Y'))
    me = bpy.data.meshes.new(nombre); bm.to_mesh(me); bm.free()
    o = objeto(nombre, me, padre, mat); o.location = centro
    for p in me.polygons:
        p.use_smooth = len(p.vertices) == 4
    if bisel:
        b = o.modifiers.new('bisel', 'BEVEL'); b.width = bisel; b.segments = 3; b.limit_method = 'ANGLE'
    return o


def tubo(nombre, r1, r2, alto, centro, mat, padre=None, lados=96, eje='Y', bisel=0.0):
    """Arandela: cilindro hueco de radio interior r1 y exterior r2."""
    bm = bmesh.new()
    sal = bmesh.ops.create_circle(bm, cap_ends=False, radius=r2, segments=lados)['verts']
    ent = bmesh.ops.create_circle(bm, cap_ends=False, radius=r1, segments=lados)['verts']
    for i in range(lados):
        j = (i + 1) % lados
        bm.faces.new((ent[i], ent[j], sal[j], sal[i]))
    caras = list(bm.faces)
    ext = bmesh.ops.extrude_face_region(bm, geom=caras)
    nuevos = [g for g in ext['geom'] if isinstance(g, bmesh.types.BMVert)]
    bmesh.ops.translate(bm, verts=nuevos, vec=(0, 0, alto))
    bmesh.ops.translate(bm, verts=bm.verts, vec=(0, 0, -alto / 2))
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    if eje == 'Y':
        bmesh.ops.rotate(bm, verts=bm.verts, cent=(0, 0, 0), matrix=Matrix.Rotation(R(90), 3, 'X'))
    me = bpy.data.meshes.new(nombre); bm.to_mesh(me); bm.free()
    o = objeto(nombre, me, padre, mat); o.location = centro
    for p in me.polygons:
        p.use_smooth = False
    if bisel:
        b = o.modifiers.new('bisel', 'BEVEL'); b.width = bisel; b.segments = 2; b.limit_method = 'ANGLE'
    return o


def folleto(nombre, mats, padre=None, pos=(0, 0, 0), giro=(0, 0, 0)):
    """El manual: un taco de hojas y una portada que se abre sobre el lomo, como un libro.

    Coordenadas propias de quien lo lee: X a su derecha, Z arriba, y él mira desde -Y. La trasera está en y = 0 y
    el folleto crece hacia -Y. La portada es `<nombre>_hoja` (pivote en el lomo, x = -mw/2): girarla -180° en Z la
    abre hacia la izquierda y deja a la vista la pliego interior («izquierda» en su dorso, «derecha» en el taco).
    """
    mw, mh = MANUAL
    raiz = vacio(nombre, pos, padre, giro)
    bloque(nombre + '_hojas', (mw - 0.01, 0.016, mh - 0.01), (0.005, -0.009, 0), mats['papel'], raiz, 0.0025)
    lamina(nombre + '_derecha', [(-mw / 2 + .012, -0.0172, -mh / 2 + .01), (mw / 2 - .006, -0.0172, -mh / 2 + .01), (mw / 2 - .006, -0.0172, mh / 2 - .01), (-mw / 2 + .012, -0.0172, mh / 2 - .01)], mats['pagina_d'], raiz)
    hoja = vacio(nombre + '_hoja', (-mw / 2, -0.0175, 0), raiz)
    bloque(nombre + '_tapa', (mw, 0.0016, mh), (mw / 2, -0.0009, 0), mats['papel'], hoja, 0.0006, 2)
    lamina(nombre + '_portada', [(0.003, -0.0019, -mh / 2 + .003), (mw - .003, -0.0019, -mh / 2 + .003), (mw - .003, -0.0019, mh / 2 - .003), (0.003, -0.0019, mh / 2 - .003)], mats['manual'], hoja)
    # el dorso de la portada: visto desde +Y, su izquierda es la x grande
    lamina(nombre + '_izquierda', [(mw - .006, 0.0001, -mh / 2 + .01), (0.012, 0.0001, -mh / 2 + .01), (0.012, 0.0001, mh / 2 - .01), (mw - .006, 0.0001, mh / 2 - .01)], mats['pagina_i'], hoja)
    return raiz


def esfera(nombre, r, centro, mat, padre=None, escala=(1, 1, 1), segmentos=(48, 24)):
    """`segmentos` (alrededor, de polo a polo): para las bolas pequeñas y repetidas, pocos; cada una pesa en la web."""
    bm = bmesh.new(); bmesh.ops.create_uvsphere(bm, u_segments=segmentos[0], v_segments=segmentos[1], radius=r)
    for v in bm.verts:
        v.co = Vector((v.co.x * escala[0], v.co.y * escala[1], v.co.z * escala[2]))
    me = bpy.data.meshes.new(nombre); bm.to_mesh(me); bm.free()
    o = objeto(nombre, me, padre, mat); o.location = centro
    for p in me.polygons:
        p.use_smooth = True
    return o


def cono(nombre, r, alto, centro, mat, padre=None, lados=48):
    return cilindro(nombre, r, alto, centro, mat, padre, lados, eje='Z', r2=0.0)


def toro(nombre, r_mayor, r_menor, centro, mat, padre=None, eje='Y'):
    bpy.ops.mesh.primitive_torus_add(major_radius=r_mayor, minor_radius=r_menor, major_segments=96, minor_segments=16, location=centro)
    o = bpy.context.object; o.name = nombre
    if eje == 'Y':
        o.rotation_euler = (R(90), 0, 0)
    o.data.materials.append(mat)
    if padre:
        o.parent = padre
    for p in o.data.polygons:
        p.use_smooth = True
    return o


# ───────────────────────── materiales ─────────────────────────
def madera(nombre, oscuro='#45291a', claro='#6f4a32', eje='X', vetas=5.0, rugo=0.42):
    """Madera procedimental: anillos alrededor del eje de la pieza (las vetas corren a lo largo de la tabla en
    todas sus caras), deformados con ruido para que no salgan perfectos. `eje` es la dirección larga de la tabla."""
    m = bpy.data.materials.new(nombre); m.use_nodes = True; n = m.node_tree.nodes; l = m.node_tree.links
    p = n['Principled BSDF']; p.inputs['Roughness'].default_value = rugo
    co = n.new('ShaderNodeTexCoord'); ma = n.new('ShaderNodeMapping')
    ma.inputs['Scale'].default_value = {'X': (0.08, 1, 1), 'Y': (1, 0.08, 1), 'Z': (1, 1, 0.08)}[eje]
    on = n.new('ShaderNodeTexWave'); on.wave_type = 'RINGS'; on.rings_direction = eje
    on.inputs['Scale'].default_value = vetas; on.inputs['Distortion'].default_value = 9.0
    on.inputs['Detail'].default_value = 6; on.inputs['Detail Scale'].default_value = 0.6
    ra = n.new('ShaderNodeValToRGB'); el = ra.color_ramp.elements
    el[0].color = srgb(oscuro); el[1].color = srgb(claro); el[0].position = 0.2; el[1].position = 0.85
    ru = n.new('ShaderNodeTexNoise'); ru.inputs['Scale'].default_value = 80
    bu = n.new('ShaderNodeBump'); bu.inputs['Strength'].default_value = 0.03
    l.new(co.outputs['Object'], ma.inputs['Vector']); l.new(ma.outputs['Vector'], on.inputs['Vector'])
    l.new(on.outputs['Fac'], ra.inputs['Fac']); l.new(ra.outputs['Color'], p.inputs['Base Color'])
    l.new(ru.outputs['Fac'], bu.inputs['Height']); l.new(bu.outputs['Normal'], p.inputs['Normal'])
    return m


def yeso(nombre, color='#a3978a'):
    m = material(nombre, color, 0.92)
    n = m.node_tree.nodes; l = m.node_tree.links; p = n['Principled BSDF']
    ru = n.new('ShaderNodeTexNoise'); ru.inputs['Scale'].default_value = 25; ru.inputs['Detail'].default_value = 8
    bu = n.new('ShaderNodeBump'); bu.inputs['Strength'].default_value = 0.06
    l.new(ru.outputs['Fac'], bu.inputs['Height']); l.new(bu.outputs['Normal'], p.inputs['Normal'])
    return m


def gris(nombre, color='#8a8a8a', rugo=0.5):
    """Para lo que la web colorea: en el horneado solo cuenta para los rebotes."""
    return material(nombre, color, rugo)


# ───────────────────────── luz ─────────────────────────
def area(nombre, pos, mira, fuerza, color=(1, 1, 1), tam=2.0, tam_y=None):
    d = bpy.data.lights.new(nombre, 'AREA'); d.energy = fuerza; d.color = color; d.size = tam
    if tam_y:
        d.shape = 'RECTANGLE'; d.size_y = tam_y
    o = bpy.data.objects.new(nombre, d); bpy.context.scene.collection.objects.link(o); o.location = pos
    o.rotation_euler = (Vector(mira) - Vector(pos)).to_track_quat('-Z', 'Y').to_euler()
    return o


def foco(nombre, pos, mira, fuerza, color=(1, 1, 1), apertura=48, suave=0.9, radio=0.1):
    d = bpy.data.lights.new(nombre, 'SPOT'); d.energy = fuerza; d.spot_size = R(apertura); d.spot_blend = suave
    d.color = color; d.shadow_soft_size = radio
    o = bpy.data.objects.new(nombre, d); bpy.context.scene.collection.objects.link(o); o.location = pos
    o.rotation_euler = (Vector(mira) - Vector(pos)).to_track_quat('-Z', 'Y').to_euler()
    return o


def punto(nombre, pos, fuerza, color=(1, 1, 1), radio=0.2):
    d = bpy.data.lights.new(nombre, 'POINT'); d.energy = fuerza; d.color = color; d.shadow_soft_size = radio
    o = bpy.data.objects.new(nombre, d); bpy.context.scene.collection.objects.link(o); o.location = pos
    return o


def mundo(color='#3a3530', fuerza=0.18):
    w = bpy.data.worlds.new('mundo'); w.use_nodes = True
    w.node_tree.nodes['Background'].inputs['Color'].default_value = srgb(color)
    w.node_tree.nodes['Background'].inputs['Strength'].default_value = fuerza
    bpy.context.scene.world = w
    return w


def mundo_estudio(fuerza=1.6):
    """Cúpula: blanca arriba, gris en el horizonte y oscura abajo. Igual desde cualquier lado en vertical: la luz
    de una pieza que gira (la caja en la mano) se hornea aquí y vale para todas sus poses."""
    w = bpy.data.worlds.new('estudio'); w.use_nodes = True; n = w.node_tree.nodes; l = w.node_tree.links
    co = n.new('ShaderNodeTexCoord'); se = n.new('ShaderNodeSeparateXYZ'); ma = n.new('ShaderNodeMapRange')
    ma.inputs['From Min'].default_value = -1; ma.inputs['From Max'].default_value = 1
    ra = n.new('ShaderNodeValToRGB'); el = ra.color_ramp.elements
    el[0].position = 0.25; el[0].color = (0.10, 0.09, 0.085, 1)
    el[1].position = 1.0; el[1].color = (1.0, 0.98, 0.95, 1)
    medio = el.new(0.55); medio.color = (0.42, 0.41, 0.40, 1)
    l.new(co.outputs['Generated'], se.inputs['Vector']); l.new(se.outputs['Z'], ma.inputs['Value'])
    l.new(ma.outputs['Result'], ra.inputs['Fac']); l.new(ra.outputs['Color'], n['Background'].inputs['Color'])
    n['Background'].inputs['Strength'].default_value = fuerza
    return w


def ajustes(ancho, alto, muestras, rebotes=6):
    esc = bpy.context.scene
    esc.render.engine = 'CYCLES'
    pref = bpy.context.preferences.addons['cycles'].preferences
    for tipo in ('OPTIX', 'CUDA'):
        try:
            pref.compute_device_type = tipo; pref.get_devices()
            gpus = [d for d in pref.devices if d.type == tipo]
            if gpus:
                for d in pref.devices:
                    d.use = d.type == tipo
                esc.cycles.device = 'GPU'; print('GRAFICA', tipo, [d.name for d in gpus], flush=True); break
        except Exception as e:  # noqa: BLE001
            print('sin', tipo, e)
    esc.cycles.samples = muestras; esc.cycles.use_denoising = True
    try:
        esc.cycles.denoiser = 'OPTIX' if esc.cycles.device == 'GPU' else 'OPENIMAGEDENOISE'
    except Exception:  # noqa: BLE001
        esc.cycles.denoiser = 'OPENIMAGEDENOISE'
    esc.cycles.max_bounces = rebotes
    esc.render.resolution_x, esc.render.resolution_y, esc.render.resolution_percentage = ancho, alto, 100
    esc.render.image_settings.file_format = 'PNG'; esc.render.image_settings.color_mode = 'RGBA'
    esc.view_settings.view_transform = 'AgX'
    for look in ('AgX - Medium High Contrast', 'Medium High Contrast'):
        try:
            esc.view_settings.look = look; break
        except Exception:  # noqa: BLE001
            pass


def camara(pos, mira, lente=50):
    cd = bpy.data.cameras.new('camara'); cd.lens = lente; cd.sensor_width = 36; cd.sensor_fit = 'HORIZONTAL'
    cam = bpy.data.objects.new('camara', cd); bpy.context.scene.collection.objects.link(cam); bpy.context.scene.camera = cam
    cam.location = pos; cam.rotation_euler = (Vector(mira) - Vector(pos)).to_track_quat('-Z', 'Y').to_euler()
    return cam


# ───────────────────────── la caja de juego ─────────────────────────
W, H, D = 1.35, 1.90, 0.15          # caja moderna: 135 × 190 × 15 mm
GRUESO = 0.02
DISCO_R = 0.56                       # 0,04 de holgura con las paredes de la bandeja
MANUAL = (1.08, 1.62)


def caja_entera(mats, padre, prefijo=''):
    """Cuerpo (bandeja con el dorso y el lomo), tapa con bisagra, manual y disco. Devuelve tapa, disco y manual.

    La caja local mira con la carátula a -Y, el lomo a -X y la bisagra en (-W/2, -D/2). Abierta (tapa a -180°),
    la tapa queda a la izquierda con el manual y la bandeja a la derecha con el disco CENTRADO en su mitad: el
    eje, el aro que lo rodea y el disco comparten el centro de la bandeja, con holgura en los cuatro lados.
    """
    P = prefijo
    w2, h2, d2 = W / 2, H / 2, D / 2
    plast = mats['plastico']
    bloque(P + 'cuerpo_fondo', (W, GRUESO, H), (0, d2 - GRUESO / 2, 0), plast, padre)
    alto_pared = D - GRUESO
    yc = -d2 + alto_pared / 2
    bloque(P + 'cuerpo_lomo', (GRUESO * 1.2, alto_pared, H), (-w2 + GRUESO * 0.6, yc, 0), plast, padre)
    bloque(P + 'cuerpo_canto', (GRUESO, alto_pared, H), (w2 - GRUESO / 2, yc, 0), plast, padre)
    bloque(P + 'cuerpo_arriba', (W, alto_pared, GRUESO), (0, yc, h2 - GRUESO / 2), plast, padre)
    bloque(P + 'cuerpo_abajo', (W, alto_pared, GRUESO), (0, yc, -h2 + GRUESO / 2), plast, padre)
    e = 0.0015
    lamina(P + 'dorso', [(w2 - .012, d2 + e, -h2 + .012), (-w2 + .012, d2 + e, -h2 + .012), (-w2 + .012, d2 + e, h2 - .012), (w2 - .012, d2 + e, h2 - .012)], mats['dorso'], padre)
    lamina(P + 'lomo', [(-w2 - e, d2 - .006, -h2 + .012), (-w2 - e, -d2 + .006, -h2 + .012), (-w2 - e, -d2 + .006, h2 - .012), (-w2 - e, d2 - .006, h2 - .012)], mats['lomo'], padre)
    # bandeja del disco: todo comparte el centro de la mitad (cx, 0). De atrás adelante: el fondo (y = suelo), un
    # aro de apoyo de 6 mm, el disco (12 mm de canto entre suelo-0,018 y suelo-0,006) y el eje, que sale por el
    # agujero del disco 1,2 cm con sus dientes. Alrededor, un reborde moldeado con 2 mm de holgura sobre el disco.
    cx = GRUESO * 0.6 / 2           # el lomo es un poco más grueso: el hueco útil está un pelo a la derecha
    suelo = d2 - GRUESO             # cara interior del fondo
    tubo(P + 'apoyo', 0.16, 0.24, 0.006, (cx, suelo - 0.003, 0), plast, padre)
    tubo(P + 'reborde', DISCO_R + 0.02, DISCO_R + 0.05, 0.014, (cx, suelo - 0.007, 0), plast, padre, bisel=0.003)
    cilindro(P + 'eje', 0.068, 0.03, (cx, suelo - 0.015, 0), mats['eje'], padre, bisel=0.004)
    for k in range(6):                # dientes en la cara del eje
        a = 2 * math.pi * k / 6
        bloque(P + f'diente_{k}', (0.022, 0.008, 0.022), (cx + 0.042 * math.cos(a), suelo - 0.033, 0.042 * math.sin(a)), mats['eje'], padre, 0.002)
    disco = vacio(P + 'disco', (cx, suelo - 0.012, 0), padre)
    tubo(P + 'disco_base', 0.075, DISCO_R, 0.012, (0, 0, 0), mats['plata'], disco)
    anillo(P + 'disco_cara', 0.12, DISCO_R - 0.008, (0, -0.0062, 0), mats['disco'], disco)
    # la tapa gira sobre la bisagra
    tapa = vacio(P + 'tapa', (-w2, -d2, 0), padre)
    bloque(P + 'tapa_placa', (W, GRUESO, H), (w2, GRUESO / 2, 0), plast, tapa)
    lamina(P + 'portada', [(.012, -e, -h2 + .012), (W - .012, -e, -h2 + .012), (W - .012, -e, h2 - .012), (.012, -e, h2 - .012)], mats['portada'], tapa)
    # el manual, centrado en la tapa y girado para que «su» derecha sea la de quien mira la caja abierta; dos
    # pestañas finas lo pisan 3,5 mm por el lado de la bisagra
    mw, mh = MANUAL
    hueco = vacio(P + 'manual_sitio', (w2, GRUESO, 0), tapa, (0, 0, R(180)))
    manual = folleto(P + 'manual', mats, hueco)
    borde = w2 - mw / 2              # borde del manual del lado de la bisagra (coordenadas de la tapa)
    frente = GRUESO + 0.0195         # cara de la portada del manual (coordenadas de la tapa)
    for z in (mh / 2 - 0.24, -mh / 2 + 0.24):
        k = "a" if z > 0 else "b"
        # un poste que sale de la tapa junto al borde del manual y una uña que pisa su portada
        bloque(P + f'pestana_{k}_poste', (0.016, frente + 0.01 - GRUESO, 0.14), (borde - 0.012, (GRUESO + frente + 0.01) / 2, z), plast, tapa, 0.003)
        bloque(P + f'pestana_{k}', (0.05, 0.01, 0.14), (borde + 0.005, frente + 0.0052, z), plast, tapa, 0.003)
    return tapa, disco, manual


def caja_de_canto(nombre, mats, pos, giro_z=90):
    """Una caja cerrada de una pieza (cuerpo y lomo impreso): para las que se quedan en la balda."""
    raiz = vacio(nombre, pos); raiz.rotation_euler = (0, 0, R(giro_z))
    bloque(f'{nombre}_cuerpo', (W, D, H), (0, 0, 0), mats['plastico'], raiz, 0.008)
    lamina(f'{nombre}_lomo', [(-W / 2 - .0015, D / 2 - .006, -H / 2 + .012), (-W / 2 - .0015, -D / 2 + .006, -H / 2 + .012), (-W / 2 - .0015, -D / 2 + .006, H / 2 - .012), (-W / 2 - .0015, D / 2 - .006, H / 2 - .012)], mats['lomo'], raiz)
    return raiz


# ───────────────────────── personajes de juguete ─────────────────────────
def figura(nombre, pos, cuerpo, cabeza, extra=None, escala=1.0):
    """Un muñeco de primitivas: cuerpo redondeado, cabeza y un detalle que lo distingue. extra = (tipo, color)."""
    s = escala; x, y, z = pos
    mc = material(nombre + '_c', cuerpo, 0.42); mh = material(nombre + '_h', cabeza, 0.5)
    c = cilindro(nombre, 0.24 * s, 0.7 * s, (x, y, z + 0.35 * s), mc, eje='Z', bisel=0.08 * s)
    esfera(nombre + '_cabeza', 0.22 * s, (x, y, z + 0.92 * s), mh)
    for dx in (-0.075, 0.075):        # ojos
        esfera(nombre + f'_ojo{dx:+.2f}', 0.03 * s, (x + dx * s, y - 0.2 * s, z + 0.95 * s), material(nombre + '_ojo', '#0c0b10', 0.2))
    if not extra:
        return c
    t, col = extra[0], extra[1]
    me = material(nombre + '_e', col, 0.4, extra[2] if len(extra) > 2 else 0)
    if t == 'casco':
        cilindro(nombre + '_casco', 0.235 * s, 0.24 * s, (x, y, z + 1.0 * s), me, eje='Z', bisel=0.03 * s)
    elif t == 'antena':
        cilindro(nombre + '_ant', 0.02 * s, 0.3 * s, (x, y, z + 1.25 * s), me, eje='Z')
        esfera(nombre + '_bola', 0.06 * s, (x, y, z + 1.42 * s), me)
    elif t == 'gorro':
        cono(nombre + '_gorro', 0.3 * s, 0.6 * s, (x, y, z + 1.3 * s), me)
    elif t == 'orejas':
        for dx in (-0.12, 0.12):
            cono(nombre + f'_oreja{dx:+.2f}', 0.08 * s, 0.22 * s, (x + dx * s, y, z + 1.17 * s), me)
    elif t == 'tricornio':
        cilindro(nombre + '_ala', 0.33 * s, 0.06 * s, (x, y, z + 1.08 * s), me, eje='Z')
        cilindro(nombre + '_copa', 0.17 * s, 0.2 * s, (x, y, z + 1.18 * s), me, eje='Z')
    elif t == 'seta':
        esfera(nombre + '_seta', 0.36 * s, (x, y, z + 1.02 * s), me, escala=(1, 1, 0.55))
    elif t == 'gorra':
        cilindro(nombre + '_gorra', 0.2 * s, 0.1 * s, (x, y, z + 1.1 * s), me, eje='Z', bisel=0.02 * s)
        bloque(nombre + '_visera', (0.22 * s, 0.18 * s, 0.025 * s), (x, y - 0.26 * s, z + 1.07 * s), me, bisel=0.01 * s)
    elif t == 'pico':
        cilindro(nombre + '_pico', 0.07 * s, 0.18 * s, (x, y - 0.25 * s, z + 0.9 * s), me, eje='Y', r2=0.0)
        cono(nombre + '_cresta', 0.07 * s, 0.22 * s, (x, y, z + 1.2 * s), me)
    elif t == 'coletas':
        for dx in (-0.24, 0.24):
            esfera(nombre + f'_col{dx:+.2f}', 0.09 * s, (x + dx * s, y + 0.02 * s, z + 1.0 * s), me)
    elif t == 'corona':
        for k in range(5):
            a = R(-60 + k * 30)
            cono(nombre + f'_pico{k}', 0.05 * s, 0.2 * s, (x + 0.16 * math.sin(a) * s, y - 0.08 * s, z + 1.13 * s), me)
    elif t == 'musgo':
        for k, (dx, dz, r) in enumerate(((-0.12, 1.08, 0.12), (0.1, 1.1, 0.13), (0.0, 1.14, 0.1), (0.2, 0.98, 0.08))):
            esfera(nombre + f'_m{k}', r * s, (x + dx * s, y, z + dz * s), me)
    return c


# ───────────────────────── el horneado ─────────────────────────
def mallas(raiz=None):
    if raiz is None:
        return [o for o in bpy.context.scene.objects if o.type == 'MESH']
    return [o for o in raiz.children_recursive if o.type == 'MESH']


def seleccionar(objs):
    bpy.ops.object.select_all(action='DESELECT')
    for o in objs:
        o.select_set(True)
    bpy.context.view_layer.objects.active = objs[0]


def preparar():
    """Modificadores aplicados, material propio por pieza y un segundo juego de coordenadas («luz»)."""
    todo = mallas()
    seleccionar(todo); bpy.ops.object.convert(target='MESH')
    for o in todo:
        if o.data.users > 1:
            o.data = o.data.copy()
        if not o.data.materials:
            o.data.materials.append(gris('sin_material'))
        o.data.materials[0] = o.data.materials[0].copy()
        me = o.data
        if not me.uv_layers:
            me.uv_layers.new(name='UVMap')
        me.uv_layers.active = me.uv_layers.new(name='luz')


def desplegar(objs, margen=0.004, angulo=66):
    seleccionar(objs)
    bpy.ops.object.mode_set(mode='EDIT'); bpy.ops.mesh.select_all(action='SELECT')
    bpy.ops.uv.smart_project(angle_limit=R(angulo), island_margin=margen, scale_to_bounds=False)
    bpy.ops.uv.pack_islands(margin=margen, rotate=True)
    bpy.ops.object.mode_set(mode='OBJECT')


class Horno:
    """Lleva la cuenta de lo horneado y de cómo pasarlo a la web (horno.json)."""

    def __init__(self, destino):
        self.destino = os.path.abspath(destino); os.makedirs(self.destino, exist_ok=True)
        self.texturas = {}

    def hornear(self, objs, nombre, tam, color=False, publicar=None, sin_perdida=False, contraste=1.0, pareja=None, suave=1.2):
        """Hornea la luz (y el color si color=True) de unas piezas en un atlas cuadrado de `tam` píxeles."""
        img = bpy.data.images.new(nombre, tam, tam, float_buffer=True)
        for o in objs:
            nt = o.data.materials[0].node_tree
            n = nt.nodes.get('horno') or nt.nodes.new('ShaderNodeTexImage'); n.name = 'horno'; n.image = img
            nt.nodes.active = n
        seleccionar(objs)
        filtro = {'DIRECT', 'INDIRECT', 'COLOR'} if color else {'DIRECT', 'INDIRECT'}
        bpy.ops.object.bake(type='DIFFUSE', pass_filter=filtro, margin=8, margin_type='EXTEND', use_clear=True)
        buf = __import__('numpy').empty(tam * tam * 4, dtype='float32'); img.pixels.foreach_get(buf)
        __import__('numpy').save(os.path.join(self.destino, nombre + '.npy'), buf.reshape(tam, tam, 4)[::-1].astype('float16'))
        self.texturas[nombre] = {'tam': publicar or tam, 'sin_perdida': sin_perdida, 'contraste': contraste, 'pareja': pareja, 'suave': suave,
                                 'piezas': [o.name for o in objs]}
        print('HORNEADO', nombre, tam, len(objs), flush=True)

    def hornear_junto(self, objs, nombre, tam, color=False, publicar=None, sin_perdida=False, contraste=1.0, pareja=None, suave=1.2):
        """Como hornear(), pero sobre una copia unida de las piezas. Cycles hornea pieza a pieza y cada una recorre la
        lámina entera, así que el tiempo crece con piezas × píxeles: 175 piezas en una lámina de 4096 no acababan en
        20 min. La copia lleva las mismas UV de luz; las originales se apartan del render mientras tanto (si no, la
        copia, encima de ellas, se haría sombra a sí misma) y la copia se borra al acabar."""
        mallas_antes, materiales_antes = set(bpy.data.meshes), set(bpy.data.materials)
        seleccionar(objs)
        bpy.ops.object.duplicate()
        copias = list(bpy.context.selected_objects)
        bpy.context.view_layer.objects.active = copias[0]
        bpy.ops.object.join()
        junto = bpy.context.view_layer.objects.active
        junto.data.uv_layers.active = junto.data.uv_layers['luz']      # al unir, la activa vuelve a ser la primera (UVMap)
        apartadas = [o for o in objs if not o.hide_render]
        for o in apartadas:
            o.hide_render = True
        try:
            img = bpy.data.images.new(nombre, tam, tam, float_buffer=True)
            for m in {ranura.material for ranura in junto.material_slots if ranura.material}:
                nt = m.node_tree
                n = nt.nodes.get('horno') or nt.nodes.new('ShaderNodeTexImage'); n.name = 'horno'; n.image = img
                nt.nodes.active = n
            seleccionar([junto])
            filtro = {'DIRECT', 'INDIRECT', 'COLOR'} if color else {'DIRECT', 'INDIRECT'}
            bpy.ops.object.bake(type='DIFFUSE', pass_filter=filtro, margin=8, margin_type='EXTEND', use_clear=True)
        finally:
            for o in apartadas:
                o.hide_render = False
            bpy.data.objects.remove(junto, do_unlink=True)
            # las mallas y los materiales de las copias, fuera: así se puede hornear una y otra vez sin que se acumulen
            for me in set(bpy.data.meshes) - mallas_antes:
                bpy.data.meshes.remove(me)
            for m in set(bpy.data.materials) - materiales_antes:
                bpy.data.materials.remove(m)
        buf = __import__('numpy').empty(tam * tam * 4, dtype='float32'); img.pixels.foreach_get(buf)
        __import__('numpy').save(os.path.join(self.destino, nombre + '.npy'), buf.reshape(tam, tam, 4)[::-1].astype('float16'))
        self.texturas[nombre] = {'tam': publicar or tam, 'sin_perdida': sin_perdida, 'contraste': contraste, 'pareja': pareja, 'suave': suave,
                                 'piezas': [o.name for o in objs]}
        print('HORNEADO', nombre, tam, len(objs), 'junto', flush=True)

    def exportar(self, extra=None):
        seleccionar(mallas())
        bpy.ops.export_scene.gltf(filepath=os.path.join(self.destino, 'escena.glb'), export_format='GLB', export_apply=False,
                                  export_animations=False, export_cameras=False, export_lights=False, export_materials='NONE',
                                  export_texcoords=True, export_normals=True, export_yup=True, use_selection=False)
        json.dump({'texturas': self.texturas, **(extra or {})}, open(os.path.join(self.destino, 'horno.json'), 'w'), indent=1)
        print('LISTO', flush=True)


def argumentos():
    a = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else sys.argv[1:]
    return os.path.abspath(a[0]), int(a[1]) if len(a) > 1 else 384, a[2:]
