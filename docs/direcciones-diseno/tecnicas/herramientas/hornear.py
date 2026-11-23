"""Técnica E: la caja modelada e iluminada en Blender, con la luz horneada en texturas para three.js.

Se ejecuta con el Python que trae `bpy`, por la cola de la gráfica:
  python hornear.py <e1|e2> <carpeta> [muestras]

Monta la misma caja que `caja.py` (mismas piezas, mismos pivotes) en una balda con siete lomos y dos cajas de
frente, y hornea con Cycles solo la LUZ de cada superficie (directa, rebotes y oclusión), sin su color:
  · caja.npy      la caja aislada en un estudio de luz que no cambia al girar en vertical (cúpula clara arriba,
                  suelo oscuro), abierta para que el interior reciba su luz; vale para todas las poses
  · vecinos.npy   los lomos y las dos cajas de frente, en su sitio de la balda
  · balda_con / balda_sin, pared_con / pared_sin, suelo_*   con la caja en la balda y sin ella: la web mezcla
                  las dos según lo lejos que esté la caja, y así su sombra de contacto se va cuando sale
En e1 («premium») la balda y la pared llevan además su color (nogal y yeso) dentro del horneado; en e2
(«estilizado») todo es solo luz y el color lo pone la web, y los cantos salen más redondeados.
El color de cada pieza y lo impreso (carátula, disco, manual) los pone la web encima: no hace falta volver a
hornear para cambiar un color, una letra o un proyecto de la balda.
"""
import json
import math
import os
import sys

import bpy
import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import caja as C  # noqa: E402

args = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else sys.argv[1:]
GRADO, DESTINO = args[0], os.path.abspath(args[1])
MUESTRAS = int(args[2]) if len(args) > 2 else 384
os.makedirs(DESTINO, exist_ok=True)
R = math.radians

# Los lomos que quedan de canto (índices de BALDA en comun/datos.js) y las dos cajas de frente
ESPINAS = [0, 2, 4, 5, 6, 7, 8]
YO = 2
EXPUESTAS = {1: -1.36, 3: 1.36}
X = {i: (k - (len(ESPINAS) - 1) / 2) * C.PASO_BALDA for k, i in enumerate(ESPINAS)}

# Cantos: en el estilizado, bastante más redondos
_bloque = C.bloque
ESCALA_BISEL = 1.0 if GRADO == 'e1' else 3.2
C.bloque = lambda n, t, p, m, padre=None, bisel=0.006: _bloque(n, t, p, m, padre, bisel * ESCALA_BISEL if bisel else 0)


def expuesta(i, x, mats):
    """Una caja de frente, apoyada en la balda con la carátula a la vista."""
    raiz = C.vacio(f'expuesta_{i}', (x, 0.42, C.H / 2))
    C.bloque(f'expuesta_{i}_cuerpo', (C.W, C.D, C.H), (0, 0, 0), mats['plastico'], raiz, 0.008)
    w2, h2, d2, e = C.W / 2, C.H / 2, C.D / 2, 0.0015
    C.lamina(f'expuesta_{i}_portada', [(-w2 + .01, -d2 - e, -h2 + .01), (w2 - .01, -d2 - e, -h2 + .01),
                                        (w2 - .01, -d2 - e, h2 - .01), (-w2 + .01, -d2 - e, h2 - .01)], mats['portada'], raiz)


def mundo_estudio():
    """Cúpula: blanca arriba, gris en el horizonte y oscura abajo. Igual desde cualquier lado en vertical."""
    w = bpy.data.worlds.new('estudio'); w.use_nodes = True; n = w.node_tree.nodes; l = w.node_tree.links
    co = n.new('ShaderNodeTexCoord'); se = n.new('ShaderNodeSeparateXYZ'); ma = n.new('ShaderNodeMapRange')
    ma.inputs['From Min'].default_value = -1; ma.inputs['From Max'].default_value = 1
    ra = n.new('ShaderNodeValToRGB'); el = ra.color_ramp.elements
    el[0].position = 0.25; el[0].color = (0.10, 0.09, 0.085, 1)
    el[1].position = 1.0; el[1].color = (1.0, 0.98, 0.95, 1)
    medio = el.new(0.55); medio.color = (0.42, 0.41, 0.40, 1)
    l.new(co.outputs['Generated'], se.inputs['Vector']); l.new(se.outputs['Z'], ma.inputs['Value'])
    l.new(ma.outputs['Result'], ra.inputs['Fac']); l.new(ra.outputs['Color'], n['Background'].inputs['Color'])
    n['Background'].inputs['Strength'].default_value = 1.6
    return w


def luces_estilizado():
    """Luz de juguete: cielo claro y un sol bajo arriba a la izquierda, con la sombra algo blanda. Un sol (y no una
    lámpara) para que la pared quede igual de iluminada en toda su anchura: al posterizar solo quedan las sombras."""
    w = bpy.data.worlds.new('claro'); w.use_nodes = True
    w.node_tree.nodes['Background'].inputs['Color'].default_value = (1, 1, 1, 1)
    w.node_tree.nodes['Background'].inputs['Strength'].default_value = 0.6
    bpy.context.scene.world = w
    d = bpy.data.lights.new('sol', 'SUN'); d.energy = 3.2; d.angle = R(7); d.color = (1.0, 0.97, 0.92)
    o = bpy.data.objects.new('sol', d); bpy.context.scene.collection.objects.link(o)
    o.rotation_euler = (C.Vector((0, 0, 0)) - C.Vector((-2.2, -4.0, 5.0))).to_track_quat('-Z', 'Y').to_euler()


def escena():
    C.limpiar()
    gris = lambda n, c='#8a8a8a', r=0.5: C.material(n, c, r)  # noqa: E731 (el albedo solo cuenta para los rebotes)
    m = {k: gris(k) for k in ('plastico', 'eje', 'plata', 'papel', 'portada', 'dorso', 'disco', 'manual')}
    m['papel'] = gris('papel', '#e8e2d6'); m['plata'] = gris('plata', '#c8ccd2', 0.2)
    for i in range(9):
        m[f'lomo_{i}'] = gris(f'lomo_{i}', '#7a7a7a')
    m['lomo_yo'] = m[f'lomo_{YO}']
    if GRADO == 'e1':
        mb, mp, ms = C.madera('nogal'), C.pared('yeso'), C.material('fondo', '#2e2925', 0.9)
    else:
        mb, mp, ms = C.material('balda', '#e99a74', 0.9), C.material('pared', '#f4d3bf', 1.0), C.material('fondo', '#f0cbb3', 1.0)
    C.bloque('balda', (4.9, 1.9, 0.12), (0, -0.05, -0.06), mb, bisel=0.01)
    C.bloque('pared', (10, 0.1, 6.5), (0, 1.0, 1.75), mp, bisel=0)      # solo lo que llega a verse: más detalle por píxel
    C.bloque('suelo_sombra', (14, 9, 0.1), (0, -3.0, -1.5), ms, bisel=0)
    for i in ESPINAS:
        if i != YO:
            C.vecino(i, m, X[i])
    for i, x in EXPUESTAS.items():
        expuesta(i, x, m)
    raiz = C.vacio('caja', (X[YO], 0, C.H / 2)); raiz.rotation_euler = (0, 0, R(90))
    tapa, disco, manual = C.caja_entera(m, raiz)
    if GRADO == 'e1':
        C.luces()
    else:
        luces_estilizado()
    return raiz, tapa


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
    """Modificadores aplicados, material propio por pieza y un segundo juego de coordenadas («luz») para el horneado."""
    todo = mallas()
    seleccionar(todo); bpy.ops.object.convert(target='MESH')
    for o in todo:
        if o.data.users > 1:
            o.data = o.data.copy()
        o.data.materials[0] = o.data.materials[0].copy()
        me = o.data
        if not me.uv_layers:
            me.uv_layers.new(name='UVMap')
        me.uv_layers.active = me.uv_layers.new(name='luz')


def desplegar(objs, margen=0.004):
    seleccionar(objs)
    bpy.ops.object.mode_set(mode='EDIT'); bpy.ops.mesh.select_all(action='SELECT')
    bpy.ops.uv.smart_project(angle_limit=R(66), island_margin=margen, scale_to_bounds=False)
    bpy.ops.uv.pack_islands(margin=margen, rotate=True)
    bpy.ops.object.mode_set(mode='OBJECT')


TAM_ENTORNO = {'balda': 2048, 'pared': 2048, 'suelo_sombra': 256}


def hornear(objs, nombre, tam, color=False):
    img = bpy.data.images.new(nombre, tam, tam, float_buffer=True)
    for o in objs:
        nt = o.data.materials[0].node_tree
        n = nt.nodes.get('horno') or nt.nodes.new('ShaderNodeTexImage'); n.name = 'horno'; n.image = img
        nt.nodes.active = n
    seleccionar(objs)
    filtro = {'DIRECT', 'INDIRECT', 'COLOR'} if color else {'DIRECT', 'INDIRECT'}
    bpy.ops.object.bake(type='DIFFUSE', pass_filter=filtro, margin=8, margin_type='EXTEND', use_clear=True)
    buf = np.empty(tam * tam * 4, dtype=np.float32); img.pixels.foreach_get(buf)
    np.save(os.path.join(DESTINO, nombre + '.npy'), buf.reshape(tam, tam, 4)[::-1].astype(np.float16))
    print('HORNEADO', nombre, tam, flush=True)


def principal():
    raiz, tapa = escena()
    preparar()
    C.ajustes(64, 64, MUESTRAS)
    esc = bpy.context.scene
    esc.render.bake.use_pass_direct = True
    piezas = mallas(raiz)
    entorno = [bpy.data.objects[n] for n in ('balda', 'pared', 'suelo_sombra')]
    vecinos = [o for o in mallas() if o.name.startswith(('vecino_', 'expuesta_'))]
    desplegar(piezas, 0.003)
    desplegar(vecinos, 0.004)
    for o in entorno:
        desplegar([o], 0.01)
    # 1. la balda con la caja en su sitio
    color = GRADO == 'e1'
    hornear(vecinos, 'vecinos', 2048)
    for o in entorno:
        hornear([o], f'{o.name}_con', TAM_ENTORNO[o.name], color)
    # 2. la balda sin la caja
    for o in piezas:
        o.hide_render = True
    for o in entorno:
        hornear([o], f'{o.name}_sin', TAM_ENTORNO[o.name], color)
    # 3. la caja sola en el estudio, abierta (el interior recibe su luz; por fuera no cambia)
    for o in bpy.context.scene.objects:
        if o.type in ('MESH', 'LIGHT'):
            o.hide_render = o not in piezas
    esc.world = mundo_estudio()
    raiz.location = (0, -30, 5); raiz.rotation_euler = (0, 0, 0); tapa.rotation_euler = (0, 0, R(-180))
    hornear(piezas, 'caja', 2048)
    # el modelo, en la balda y cerrado, con los dos juegos de coordenadas (el impreso y la luz)
    raiz.location = (X[YO], 0, C.H / 2); raiz.rotation_euler = (0, 0, R(90)); tapa.rotation_euler = (0, 0, 0)
    for o in bpy.context.scene.objects:
        o.hide_render = False
    bpy.ops.wm.save_as_mainfile(filepath=os.path.join(DESTINO, 'horneado.blend'))
    seleccionar(mallas())
    bpy.ops.export_scene.gltf(filepath=os.path.join(DESTINO, 'caja.glb'), export_format='GLB', export_apply=False,
                              export_animations=False, export_cameras=False, export_lights=False, export_materials='NONE',
                              export_texcoords=True, export_normals=True, export_yup=True, use_selection=False)
    json.dump({'espinas': ESPINAS, 'expuestas': EXPUESTAS, 'x': X}, open(os.path.join(DESTINO, 'balda.json'), 'w'))
    print('LISTO', flush=True)


principal()
