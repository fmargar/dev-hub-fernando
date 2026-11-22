"""La caja de juego en Blender, construida entera por código (sin modelos ni imágenes de fuera).

Modos (se ejecuta con el Python que trae `bpy`):
  python caja.py caratula <salida.png>            el diorama de la carátula (una foto fija)
  python caja.py prueba   <carpeta>               cinco fotogramas clave pequeños para revisar el encuadre
  python caja.py pelicula <carpeta> [ancho alto]  los 150 fotogramas del recorrido y el modelo en glTF

Las texturas impresas (carátula, contraportada, lomos, disco y manual) salen de `texturas.mjs`, que las pinta
con las mismas fuentes que la web: cambiar una letra es cambiar `comun/datos.js` y volver a lanzar los dos pasos.
Unidades: 1 = 10 cm. La caja local mira con la carátula a -Y, el lomo a -X y la bisagra en (-W/2, -D/2).
"""
import math
import os
import sys

import bpy
import bmesh  # noqa: E402 (bmesh solo existe después de importar bpy)
from mathutils import Vector

AQUI = os.path.dirname(os.path.abspath(__file__))
TEX = os.environ.get('TEXTURAS', os.path.join(AQUI, '..', '..', '..', '..', '..', 'texturas'))
W, H, D = 1.35, 1.90, 0.15          # caja de juego moderna: 135 × 190 × 15 mm
GRUESO = 0.02                        # pared de plástico
PASO_BALDA = D + 0.012               # separación entre lomos
POS_YO = 2                           # Adivinadle es el tercero de la balda
FOTOGRAMAS = 150
CLAVES = {'balda': 1, 'portada': 40, 'dorso': 75, 'portada2': 105, 'abierta': 150}


# ───────────────────────── utilidades ─────────────────────────
def srgb(h):
    h = h.lstrip('#'); c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return tuple(((x + 0.055) / 1.055) ** 2.4 if x > 0.04045 else x / 12.92 for x in c) + (1.0,)


def limpiar():
    bpy.ops.wm.read_factory_settings(use_empty=True)


def material(nombre, color='#888888', rugo=0.5, metal=0.0, capa=0.0, imagen=None, alfa=False, pelicula=0.0):
    m = bpy.data.materials.new(nombre); m.use_nodes = True
    p = m.node_tree.nodes['Principled BSDF']
    p.inputs['Base Color'].default_value = srgb(color)
    p.inputs['Roughness'].default_value = rugo
    p.inputs['Metallic'].default_value = metal
    if capa:
        p.inputs['Coat Weight'].default_value = capa
        p.inputs['Coat Roughness'].default_value = 0.04
    if pelicula and 'Thin Film Thickness' in p.inputs:
        p.inputs['Thin Film Thickness'].default_value = pelicula
        p.inputs['Thin Film IOR'].default_value = 1.45
    if imagen:
        t = m.node_tree.nodes.new('ShaderNodeTexImage')
        t.image = bpy.data.images.load(os.path.join(TEX, imagen)); t.interpolation = 'Cubic'
        m.node_tree.links.new(t.outputs['Color'], p.inputs['Base Color'])
        if alfa:
            m.node_tree.links.new(t.outputs['Alpha'], p.inputs['Alpha'])
    return m


def objeto(nombre, malla, padre=None, mat=None):
    o = bpy.data.objects.new(nombre, malla); bpy.context.scene.collection.objects.link(o)
    if mat:
        o.data.materials.append(mat)
    if padre:
        o.parent = padre
    return o


def vacio(nombre, pos=(0, 0, 0), padre=None):
    o = bpy.data.objects.new(nombre, None); bpy.context.scene.collection.objects.link(o)
    o.location = pos
    if padre:
        o.parent = padre
    return o


def bloque(nombre, tam, pos, mat, padre=None, bisel=0.006):
    """Prisma con los cantos redondeados (el bisel se aplica al exportar)."""
    bm = bmesh.new(); bmesh.ops.create_cube(bm, size=1.0)
    for v in bm.verts:
        v.co = Vector((v.co.x * tam[0] + pos[0], v.co.y * tam[1] + pos[1], v.co.z * tam[2] + pos[2]))
    me = bpy.data.meshes.new(nombre); bm.to_mesh(me); bm.free()
    o = objeto(nombre, me, padre, mat)
    if bisel:
        b = o.modifiers.new('bisel', 'BEVEL'); b.width = bisel; b.segments = 3; b.limit_method = 'ANGLE'
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


def anillo(nombre, r1, r2, centro, mat, padre=None, lados=96):
    """Corona circular que mira a -Y, con las coordenadas de textura planas (para el disco)."""
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
            l[uvl].uv = (0.5 + (l.vert.co.x - centro[0]) / (2 * r2), 0.5 + (l.vert.co.z - centro[2]) / (2 * r2))
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    me = bpy.data.meshes.new(nombre); bm.to_mesh(me); bm.free()
    o = objeto(nombre, me, padre, mat)
    # que mire a -Y (hacia fuera de la bandeja)
    if o.data.polygons[0].normal.y > 0:
        for p in o.data.polygons:
            p.flip()
    return o


def cilindro(nombre, r, alto, centro, mat, padre=None, lados=96):
    """Cilindro con el eje en Y."""
    bm = bmesh.new()
    bmesh.ops.create_cone(bm, cap_ends=True, segments=lados, radius1=r, radius2=r, depth=alto)
    bmesh.ops.rotate(bm, verts=bm.verts, cent=(0, 0, 0), matrix=__import__('mathutils').Matrix.Rotation(math.radians(90), 3, 'X'))
    bmesh.ops.translate(bm, verts=bm.verts, vec=Vector(centro))
    me = bpy.data.meshes.new(nombre); bm.to_mesh(me); bm.free()
    o = objeto(nombre, me, padre, mat)
    for p in me.polygons:
        p.use_smooth = len(p.vertices) == 4
    return o


# ───────────────────────── la caja ─────────────────────────
def caja_entera(mats, padre):
    """Cuerpo (bandeja con el dorso y el lomo), tapa con bisagra, manual y disco. Devuelve las piezas que se mueven."""
    w2, h2, d2 = W / 2, H / 2, D / 2
    plast = mats['plastico']
    # bandeja: fondo + cuatro paredes
    bloque('cuerpo_fondo', (W, GRUESO, H), (0, d2 - GRUESO / 2, 0), plast, padre)
    alto_pared = D - GRUESO
    yc = -d2 + GRUESO + alto_pared / 2 - GRUESO / 2
    bloque('cuerpo_lomo', (GRUESO * 1.2, alto_pared, H), (-w2 + GRUESO * 0.6, yc, 0), plast, padre)
    bloque('cuerpo_canto', (GRUESO, alto_pared, H), (w2 - GRUESO / 2, yc, 0), plast, padre)
    bloque('cuerpo_arriba', (W, alto_pared, GRUESO), (0, yc, h2 - GRUESO / 2), plast, padre)
    bloque('cuerpo_abajo', (W, alto_pared, GRUESO), (0, yc, -h2 + GRUESO / 2), plast, padre)
    # lo impreso por fuera: contraportada (se mira desde +Y) y lomo (se mira desde -X)
    e = 0.0015
    lamina('dorso', [(w2 - .01, d2 + e, -h2 + .01), (-w2 + .01, d2 + e, -h2 + .01), (-w2 + .01, d2 + e, h2 - .01), (w2 - .01, d2 + e, h2 - .01)], mats['dorso'], padre)
    lamina('lomo', [(-w2 - e, d2 - .004, -h2 + .01), (-w2 - e, -d2 + .004, -h2 + .01), (-w2 - e, -d2 + .004, h2 - .01), (-w2 - e, d2 - .004, h2 - .01)], mats['lomo_yo'], padre)
    # el eje del disco
    cilindro('eje', 0.06, 0.03, (0.06, d2 - GRUESO - 0.015, 0), mats['eje'], padre)
    # el disco: base plateada y la corona impresa
    disco = vacio('disco', (0.06, d2 - GRUESO - 0.036, 0), padre)
    cilindro('disco_base', 0.6, 0.012, (0, 0, 0), mats['plata'], disco)
    anillo('disco_cara', 0.115, 0.585, (0, -0.0065, 0), mats['disco'], disco)
    # la tapa gira sobre la bisagra
    tapa = vacio('tapa', (-w2, -d2, 0), padre)
    bloque('tapa_placa', (W, GRUESO, H), (w2, GRUESO / 2, 0), plast, tapa)
    lamina('portada', [(.01, -e, -h2 + .01), (W - .01, -e, -h2 + .01), (W - .01, -e, h2 - .01), (.01, -e, h2 - .01)], mats['portada'], tapa)
    for z in (h2 - 0.16, -h2 + 0.16):        # pestañas que sujetan el manual
        bloque(f'pestana_{z:+.1f}', (0.22, 0.03, 0.05), (0.2, GRUESO + 0.015, z), plast, tapa, 0.004)
    manual = vacio('manual', (w2 + 0.04, GRUESO, 0), tapa)
    bloque('manual_hojas', (1.12, 0.022, 1.66), (0, 0.011, 0), mats['papel'], manual, 0.003)
    mw, mh = 0.555, 0.825
    lamina('manual_portada', [(mw, 0.0235, -mh), (-mw, 0.0235, -mh), (-mw, 0.0235, mh), (mw, 0.0235, mh)], mats['manual'], manual)
    return tapa, disco, manual


def vecino(i, mats, x):
    """Otra caja de la balda, de canto: solo cuerpo y lomo."""
    raiz = vacio(f'vecino_{i}', (x, 0, H / 2))
    raiz.rotation_euler = (0, 0, math.radians(90))
    bloque(f'vecino_{i}_cuerpo', (W, D, H), (0, 0, 0), mats['plastico'], raiz, 0.008)
    lamina(f'vecino_{i}_lomo', [(-W / 2 - .0015, D / 2 - .004, -H / 2 + .01), (-W / 2 - .0015, -D / 2 + .004, -H / 2 + .01), (-W / 2 - .0015, -D / 2 + .004, H / 2 - .01), (-W / 2 - .0015, D / 2 - .004, H / 2 - .01)], mats[f'lomo_{i}'], raiz)


def madera(nombre):
    """Nogal procedimental: vetas con una onda distorsionada (se cambia el color en dos números)."""
    m = bpy.data.materials.new(nombre); m.use_nodes = True; n = m.node_tree.nodes; l = m.node_tree.links
    p = n['Principled BSDF']; p.inputs['Roughness'].default_value = 0.42
    co = n.new('ShaderNodeTexCoord'); ma = n.new('ShaderNodeMapping'); ma.inputs['Scale'].default_value = (0.12, 1.6, 1.6)
    on = n.new('ShaderNodeTexWave'); on.wave_type = 'BANDS'; on.bands_direction = 'X'
    on.inputs['Scale'].default_value = 2.2; on.inputs['Distortion'].default_value = 3.5; on.inputs['Detail'].default_value = 6
    ra = n.new('ShaderNodeValToRGB'); ra.color_ramp.elements[0].color = srgb('#3b2416'); ra.color_ramp.elements[1].color = srgb('#7a4f30')
    ru = n.new('ShaderNodeTexNoise'); ru.inputs['Scale'].default_value = 60
    bu = n.new('ShaderNodeBump'); bu.inputs['Strength'].default_value = 0.05
    l.new(co.outputs['Object'], ma.inputs['Vector']); l.new(ma.outputs['Vector'], on.inputs['Vector'])
    l.new(on.outputs['Fac'], ra.inputs['Fac']); l.new(ra.outputs['Color'], p.inputs['Base Color'])
    l.new(ru.outputs['Fac'], bu.inputs['Height']); l.new(bu.outputs['Normal'], p.inputs['Normal'])
    return m


def pared(nombre):
    m = material(nombre, '#a3978a', 0.92)
    n = m.node_tree.nodes; l = m.node_tree.links; p = n['Principled BSDF']
    ru = n.new('ShaderNodeTexNoise'); ru.inputs['Scale'].default_value = 25; ru.inputs['Detail'].default_value = 8
    bu = n.new('ShaderNodeBump'); bu.inputs['Strength'].default_value = 0.08
    l.new(ru.outputs['Fac'], bu.inputs['Height']); l.new(bu.outputs['Normal'], p.inputs['Normal'])
    return m


def luces():
    def area(nombre, pos, mira, fuerza, color, tam):
        d = bpy.data.lights.new(nombre, 'AREA'); d.energy = fuerza; d.color = color; d.size = tam
        o = bpy.data.objects.new(nombre, d); bpy.context.scene.collection.objects.link(o); o.location = pos
        o.rotation_euler = (Vector(mira) - Vector(pos)).to_track_quat('-Z', 'Y').to_euler()
        return o
    area('clave', (-4.5, -6.5, 5.5), (0, -1.5, 1.2), 2400, (1.0, 0.92, 0.82), 4.0)
    area('relleno', (5.5, -6.0, 2.0), (0, -1.5, 1.2), 700, (0.80, 0.88, 1.0), 5.0)
    area('recorte', (2.5, 2.5, 5.0), (0, -1.5, 1.4), 1400, (1.0, 0.85, 0.70), 2.0)
    d = bpy.data.lights.new('pared', 'SPOT'); d.energy = 900; d.spot_size = math.radians(48); d.spot_blend = 0.9; d.color = (1.0, 0.86, 0.68)
    o = bpy.data.objects.new('pared', d); bpy.context.scene.collection.objects.link(o); o.location = (-0.4, -3.0, 4.6)
    o.rotation_euler = (Vector((-0.3, 1.0, 1.4)) - o.location).to_track_quat('-Z', 'Y').to_euler()
    w = bpy.data.worlds.new('mundo'); w.use_nodes = True
    w.node_tree.nodes['Background'].inputs['Color'].default_value = srgb('#3a3530')
    w.node_tree.nodes['Background'].inputs['Strength'].default_value = 0.18
    bpy.context.scene.world = w


def ajustes(ancho, alto, muestras):
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
                esc.cycles.device = 'GPU'; print('GRAFICA', tipo, [d.name for d in gpus]); break
        except Exception as e:
            print('sin', tipo, e)
    esc.cycles.samples = muestras; esc.cycles.use_denoising = True
    try:
        esc.cycles.denoiser = 'OPTIX' if esc.cycles.device == 'GPU' else 'OPENIMAGEDENOISE'
    except Exception:
        esc.cycles.denoiser = 'OPENIMAGEDENOISE'
    esc.cycles.max_bounces = 6
    esc.render.resolution_x, esc.render.resolution_y, esc.render.resolution_percentage = ancho, alto, 100
    esc.render.image_settings.file_format = 'PNG'; esc.render.image_settings.color_mode = 'RGB'
    esc.view_settings.view_transform = 'AgX'
    for look in ('AgX - Medium High Contrast', 'Medium High Contrast'):
        try:
            esc.view_settings.look = look; break
        except Exception:
            pass
    esc.render.film_transparent = False


# ───────────────────────── la escena de la balda ─────────────────────────
def escena():
    limpiar()
    m = {
        'plastico': material('plastico', '#1b1c22', 0.28),
        'eje': material('eje', '#24252c', 0.4),
        'plata': material('plata', '#d9dde4', 0.12, 1.0, pelicula=420),
        'papel': material('papel', '#efe9dc', 0.8),
        'portada': material('portada', imagen='portada.png', rugo=0.45, capa=1.0),
        'dorso': material('dorso', imagen='dorso.png', rugo=0.45, capa=1.0),
        'manual': material('manual', imagen='manual.png', rugo=0.6),
        'disco': material('disco', imagen='disco.png', rugo=0.35, capa=0.6),
    }
    for i in range(9):
        m[f'lomo_{i}'] = material(f'lomo_{i}', imagen=f'lomo-{i}.png', rugo=0.45, capa=1.0)
    m['lomo_yo'] = m[f'lomo_{POS_YO}']
    # balda, pared y un canto de luz bajo la balda
    largo = 9 * PASO_BALDA + 1.6
    x0 = -(9 - 1) * PASO_BALDA / 2
    bloque('balda', (largo, 1.9, 0.12), (0, -0.05, -0.06), madera('nogal'), bisel=0.01)
    bloque('pared', (14, 0.1, 9), (0, 1.0, 2.0), pared('yeso'), bisel=0)
    bloque('suelo_sombra', (14, 9, 0.1), (0, -3.0, -1.5), material('fondo', '#2e2925', 0.9), bisel=0)
    for i in range(9):
        if i != POS_YO:
            vecino(i, m, x0 + i * PASO_BALDA)
    raiz = vacio('caja', (x0 + POS_YO * PASO_BALDA, 0, H / 2))
    tapa, disco, manual = caja_entera(m, raiz)
    luces()
    cd = bpy.data.cameras.new('camara'); cd.lens = 50; cd.sensor_width = 36; cd.sensor_fit = 'HORIZONTAL'
    cam = bpy.data.objects.new('camara', cd); bpy.context.scene.collection.objects.link(cam); bpy.context.scene.camera = cam
    return raiz, tapa, disco, manual, cam, x0 + POS_YO * PASO_BALDA


def mirar(cam, pos, objetivo):
    cam.location = pos
    cam.rotation_euler = (Vector(objetivo) - Vector(pos)).to_track_quat('-Z', 'Y').to_euler()


def animar(raiz, tapa, disco, manual, cam, xb):
    """El recorrido entero como una sola toma: balda → portada → dorso → portada → abierta."""
    esc = bpy.context.scene; esc.frame_start, esc.frame_end = 1, FOTOGRAMAS
    r = math.radians
    xc = 0.0          # la caja viene al centro del encuadre
    poses = [
        # fotograma, posición de la caja, giro (x, z), tapa, cámara, mira
        (1, (xb, 0.0, H / 2), (0, 90), 0, (xb + 0.15, -5.2, 1.55), (xb + 0.15, 0, 0.95)),
        (12, (xb, -0.55, H / 2 + 0.02), (0, 90), 0, (xb + 0.1, -5.6, 1.6), (xb, -0.3, 1.0)),
        (CLAVES['portada'], (xc, -2.3, 1.42), (0, 0), 0, (0, -7.6, 1.75), (0, -2.3, 1.38)),
        (CLAVES['dorso'], (xc, -2.3, 1.42), (0, -180), 0, (0, -7.6, 1.75), (0, -2.3, 1.38)),
        (CLAVES['portada2'], (xc, -2.3, 1.42), (0, -360), 0, (0, -7.6, 1.75), (0, -2.3, 1.38)),
        (138, (W / 2 - 0.06, -2.3, 1.38), (-10, -360), -180, (0, -7.9, 2.05), (0, -2.3, 1.3)),
        (CLAVES['abierta'], (W / 2 - 0.06, -2.3, 1.38), (-10, -360), -180, (0, -7.9, 2.05), (0, -2.3, 1.3)),
    ]
    for f, pos, (gx, gz), tp, cpos, cmira in poses:
        raiz.location = pos; raiz.rotation_euler = (r(gx), 0, r(gz))
        raiz.keyframe_insert('location', frame=f); raiz.keyframe_insert('rotation_euler', frame=f)
        tapa.rotation_euler = (0, 0, r(tp)); tapa.keyframe_insert('rotation_euler', frame=f)
        mirar(cam, cpos, cmira); cam.keyframe_insert('location', frame=f); cam.keyframe_insert('rotation_euler', frame=f)
    # al final, el disco se levanta de la bandeja y el manual asoma de sus pestañas
    for f, dy, dg, my in ((1, 0, 0, 0), (136, 0, 0, 0), (FOTOGRAMAS, -0.32, 9, 0.06)):
        disco.location.y = 0.15 / 2 - GRUESO - 0.036 + dy; disco.rotation_euler = (r(dg), 0, r(-dg))
        disco.keyframe_insert('location', frame=f); disco.keyframe_insert('rotation_euler', frame=f)
        manual.location.y = GRUESO + my; manual.keyframe_insert('location', frame=f)
    # curvas suaves en cada tramo (entra y sale despacio)
    for o in (raiz, tapa, disco, manual, cam):
        ad = o.animation_data
        if not ad or not ad.action:
            continue
        for fc in curvas(ad.action):
            for k in fc.keyframe_points:
                k.interpolation = 'BEZIER'; k.easing = 'AUTO'; k.handle_left_type = k.handle_right_type = 'AUTO_CLAMPED'


def curvas(accion):
    if hasattr(accion, 'fcurves') and len(accion.fcurves):
        return list(accion.fcurves)
    out = []   # Blender 5: las curvas viven en capas y canales
    for capa in getattr(accion, 'layers', []):
        for tira in capa.strips:
            for bolsa in tira.channelbags:
                out.extend(bolsa.fcurves)
    return out


# ───────────────────────── el diorama de la carátula ─────────────────────────
def figura(nombre, x, color, cabeza, extra, escala=1.0, mat_sombra=None):
    """Personaje de juguete hecho con primitivas: cuerpo, cabeza y un detalle que lo distingue."""
    mc = mat_sombra or material(nombre + '_c', color, 0.45)
    mh = mat_sombra or material(nombre + '_h', cabeza, 0.5)
    s = escala
    bpy.ops.mesh.primitive_cylinder_add(radius=0.24 * s, depth=0.7 * s, location=(x, 0, 0.35 * s))
    c = bpy.context.object; c.name = nombre; c.data.materials.append(mc)
    bev = c.modifiers.new('b', 'BEVEL'); bev.width = 0.08 * s; bev.segments = 6
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.22 * s, location=(x, 0, 0.92 * s), segments=48, ring_count=24)
    h = bpy.context.object; h.data.materials.append(mh)
    for o in (c, h):
        bpy.ops.object.select_all(action='DESELECT'); o.select_set(True); bpy.context.view_layer.objects.active = o
        bpy.ops.object.shade_smooth()
    me = mat_sombra or material(nombre + '_e', extra[1], 0.4, extra[2] if len(extra) > 2 else 0)
    t = extra[0]
    if t == 'casco':
        bpy.ops.mesh.primitive_cylinder_add(radius=0.235 * s, depth=0.24 * s, location=(x, 0, 1.0 * s))
    elif t == 'antena':
        bpy.ops.mesh.primitive_cylinder_add(radius=0.02 * s, depth=0.3 * s, location=(x, 0, 1.25 * s))
        bpy.context.object.data.materials.append(me)
        bpy.ops.mesh.primitive_uv_sphere_add(radius=0.06 * s, location=(x, 0, 1.42 * s))
    elif t == 'gorro':
        bpy.ops.mesh.primitive_cone_add(radius1=0.3 * s, depth=0.6 * s, location=(x, 0, 1.3 * s))
    elif t == 'orejas':
        for dx in (-0.12, 0.12):
            bpy.ops.mesh.primitive_cone_add(radius1=0.08 * s, depth=0.22 * s, location=(x + dx * s, 0, 1.17 * s))
            bpy.context.object.data.materials.append(me)
        return
    elif t == 'tricornio':
        bpy.ops.mesh.primitive_cylinder_add(radius=0.33 * s, depth=0.06 * s, location=(x, 0, 1.08 * s))
        bpy.context.object.data.materials.append(me)
        bpy.ops.mesh.primitive_cylinder_add(radius=0.17 * s, depth=0.2 * s, location=(x, 0, 1.18 * s))
    elif t == 'seta':
        bpy.ops.mesh.primitive_uv_sphere_add(radius=0.36 * s, location=(x, 0, 1.02 * s))
        bpy.context.object.scale = (1, 1, 0.55)
    o = bpy.context.object; o.data.materials.append(me)
    bpy.ops.object.shade_smooth()


def caratula(salida):
    limpiar()
    ajustes(864, 1216, 160)
    esc = bpy.context.scene
    # pared de rueda de reconocimiento: franjas de altura en relieve
    bloque('fondo', (12, 0.2, 8), (0, 1.2, 2.5), material('pared_rueda', '#3d2a52', 0.7), bisel=0)
    for k in range(12):
        z = 0.2 + k * 0.2
        bloque(f'raya_{k}', (12, 0.03, 0.012 if k % 5 else 0.025), (0, 1.09, z), material(f'raya{k}', '#b59ad6' if k % 5 else '#e5d3ff', 0.6), bisel=0)
    bloque('suelo', (12, 6, 0.2), (0, -1.5, -0.1), material('suelo', '#241834', 0.8), bisel=0)
    # seis sospechosos y el del medio en sombra
    gente = [
        ('caballero', -1.85, '#c8473a', '#f2c9a0', ('casco', '#c9ccd6', 0.9)),
        ('robot', -1.11, '#3f8fd0', '#d8dde8', ('antena', '#ffb000')),
        ('maga', -0.37, '#6a4cc0', '#f2c9a0', ('gorro', '#3a2a80')),
        ('sombra', 0.37, '#0b0710', '#0b0710', ('tricornio', '#0b0710')),
        ('zorro', 1.11, '#e2782c', '#f19a4a', ('orejas', '#e2782c')),
        ('seta', 1.85, '#efe6d4', '#f2c9a0', ('seta', '#d63b3b')),
    ]
    negro = material('silueta', '#050307', 0.9)
    ojo = material('ojo', '#0a0a0c', 0.15)
    for nombre, x, c, cab, ex in gente:
        figura(nombre, x, c, cab, ex, 1.0, negro if nombre == 'sombra' else None)
        if nombre != 'sombra':          # ojos: dos bolitas negras con un brillo
            for dx in (-0.075, 0.075):
                bpy.ops.mesh.primitive_uv_sphere_add(radius=0.035, location=(x + dx, -0.2, 0.95), segments=24, ring_count=12)
                bpy.context.object.data.materials.append(ojo); bpy.ops.object.shade_smooth()
    # lupa en primer plano
    oro = material('laton', '#d8a440', 0.25, 1.0)
    bpy.ops.mesh.primitive_torus_add(major_radius=0.62, minor_radius=0.06, location=(0.37, -1.25, 0.95), rotation=(math.radians(90), 0, 0))
    bpy.context.object.data.materials.append(oro); bpy.ops.object.shade_smooth()
    vidrio = bpy.data.materials.new('vidrio'); vidrio.use_nodes = True
    pv = vidrio.node_tree.nodes['Principled BSDF']; pv.inputs['Transmission Weight'].default_value = 1.0
    pv.inputs['Roughness'].default_value = 0.0; pv.inputs['IOR'].default_value = 1.5
    bpy.ops.mesh.primitive_cylinder_add(radius=0.6, depth=0.04, location=(0.37, -1.25, 0.95), rotation=(math.radians(90), 0, 0))
    bpy.context.object.data.materials.append(vidrio); bpy.ops.object.shade_smooth()
    bpy.ops.mesh.primitive_cylinder_add(radius=0.07, depth=1.0, location=(0.97, -1.25, 0.15), rotation=(0, math.radians(-40), 0))
    bpy.context.object.data.materials.append(material('mango', '#4a2a18', 0.5)); bpy.ops.object.shade_smooth()
    # luces: foco cenital sobre la fila y un contraluz ámbar para el sospechoso del medio
    def luz(nombre, tipo, pos, mira, fuerza, color, tam=1.0):
        d = bpy.data.lights.new(nombre, tipo); d.energy = fuerza; d.color = color
        if tipo == 'SPOT':
            d.spot_size = math.radians(60); d.spot_blend = 0.6
        else:
            d.size = tam
        o = bpy.data.objects.new(nombre, d); esc.collection.objects.link(o); o.location = pos
        o.rotation_euler = (Vector(mira) - Vector(pos)).to_track_quat('-Z', 'Y').to_euler()
    luz('foco', 'SPOT', (0, -2.5, 5.0), (0, 0.3, 0.6), 3200, (1.0, 0.9, 0.75))
    luz('relleno', 'AREA', (-4, -5, 2.5), (0, 0, 1), 500, (0.75, 0.8, 1.0), 4)
    luz('contraluz', 'AREA', (0.37, 0.75, 1.6), (0.37, -0.4, 0.9), 2200, (1.0, 0.62, 0.18), 0.6)
    w = bpy.data.worlds.new('m'); w.use_nodes = True; w.node_tree.nodes['Background'].inputs['Strength'].default_value = 0.05; esc.world = w
    cd = bpy.data.cameras.new('c'); cd.lens = 40; cd.sensor_fit = 'VERTICAL'; cd.sensor_height = 36
    cam = bpy.data.objects.new('c', cd); esc.collection.objects.link(cam); esc.camera = cam
    mirar(cam, (0.0, -7.0, 1.6), (0.0, 0, 1.4))
    esc.render.filepath = salida
    bpy.ops.render.render(write_still=True)


# ───────────────────────── entrada ─────────────────────────
if __name__ == '__main__':
    args = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else sys.argv[1:]
    modo = args[0]
    if modo == 'caratula':
        caratula(os.path.abspath(args[1]))
    else:
        destino = os.path.abspath(args[1]); os.makedirs(destino, exist_ok=True)
        raiz, tapa, disco, manual, cam, xb = escena()
        animar(raiz, tapa, disco, manual, cam, xb)
        esc = bpy.context.scene
        if modo == 'prueba':
            ajustes(480, 320, 32)
            for nombre, f in CLAVES.items():
                esc.frame_set(f); esc.render.filepath = os.path.join(destino, f'prueba-{nombre}.png')
                bpy.ops.render.render(write_still=True)
        elif modo == 'pelicula':
            ancho, alto = (int(args[2]), int(args[3])) if len(args) > 3 else (1200, 800)
            ajustes(ancho, alto, int(os.environ.get('MUESTRAS', 64)))
            if os.environ.get('LENTE'):      # el corte vertical para el móvil: la misma toma con un objetivo más abierto
                cam.data.lens = float(os.environ['LENTE']); cam.data.sensor_fit = 'AUTO'
            bpy.ops.wm.save_as_mainfile(filepath=os.path.join(destino, 'caja.blend'))
            # el modelo para three.js: misma geometría y la misma toma, sin materiales (los pone la web)
            bpy.ops.export_scene.gltf(filepath=os.path.join(destino, 'caja.glb'), export_format='GLB', export_apply=True,
                                      export_animations=True, export_animation_mode='SCENE', export_force_sampling=True,
                                      export_cameras=True, export_lights=False, export_materials='NONE', export_texcoords=True,
                                      export_normals=True, export_yup=True)
            esc.render.filepath = os.path.join(destino, 'f_')
            bpy.ops.render.render(animation=True)
