"""El banco óptico: una lente grande sobre un carril de precisión y nueve muestras, una por proyecto.

  pesado.sh --cola gpu optico-e1 -- <python con bpy> escena.py <carpeta> [muestras] [vista|medir|seguir]

Un banco de laboratorio de aluminio anodizado, con su rejilla de taladros. A lo largo corre un carril con regla; detrás,
diez portamuestras en fila (nueve con su muestra y uno vacío, que espera a la siguiente). Sobre el carril, un carro con
una lente grande en un aro de latón: se desliza de muestra en muestra y lo que se ve a través de ella lo pinta la web,
ampliado. El aro se abate sobre su bisagra para apartarse. A la derecha, el visor del banco: una pantalla con su
platina, donde se deja la muestra para verla en marcha.

Lo impreso (la rejilla de la mesa, la regla del carril, las muestras) lo pinta la web con las medidas que salen de aquí.
"""
import os
import re
import sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '../../../kit-e1/herramientas'))
import kit as K  # noqa: E402
import bpy  # noqa: E402

DESTINO, MUESTRAS, RESTO = K.argumentos()
R = K.R

# ── Medidas (1 = 10 cm). X a la derecha, Y hacia la pared, Z arriba; la mesa en z = 0 ──
ORDEN = ['adivinadle', 'wardux', 'calculo', 'agentes', 'erp', 'servidor', 'marbella', 'vados', 'vision', 'siguiente']
COLOR = {'adivinadle': '#1B2140', 'wardux': '#9E3A26', 'calculo': '#17583F', 'agentes': '#4A2F78', 'erp': '#17656A',
         'servidor': '#1C47A0', 'marbella': '#C5612A', 'vados': '#B8901C', 'vision': '#94295F', 'siguiente': '#8d9196'}
PASO, X0 = 1.8, -8.1                                                    # una muestra cada 18 cm
MESA = {'x0': -16.0, 'x1': 18.0, 'y0': -5.2, 'y1': 3.8, 'paso': 0.25}   # el tablero y su rejilla de taladros
CARRIL = {'x0': -9.7, 'x1': 9.7, 'y': -2.0, 'ancho': 0.9, 'alto': 0.36}
REGLA = {'x0': -9.6, 'x1': 9.6, 'y0': -2.43, 'y1': -2.2, 'z': CARRIL['alto'] + 0.003}
MUESTRA = {'y': 0.94, 'z': 2.45, 'ancho': 1.2, 'alto': 1.6}             # la cara de la muestra, mirando al carril
LENTE = {'r': 1.2, 'aro': 1.36, 'bisagra': 1.0, 'z': 2.45}              # el cristal, el aro, la altura de la bisagra
MONITOR = {'x': 13.6, 'y': -0.6, 'z': 2.65, 'ancho': 3.8, 'alto': 2.3, 'marco': 0.16, 'fondo': 0.24}
PLATINA = {'x': MONITOR['x'] - MONITOR['ancho'] / 2 - 1.25, 'y': MONITOR['y'] - 0.1, 'z': 0.3 + MUESTRA['alto'] / 2 + 0.06}


def xs(i):
    return X0 + PASO * i


def materiales():
    return {
        'anodizado': K.material('anodizado', '#1b1d21', 0.42, metal=0.6), 'aluminio': K.material('aluminio', '#b4b9bf', 0.34, metal=0.9),
        'acero': K.material('acero', '#c2c6cb', 0.28, metal=0.95), 'laton': K.material('laton', '#c09a55', 0.3, metal=0.85),
        'negro': K.material('negro', '#0b0c0e', 0.35), 'goma': K.material('goma', '#1c1d20', 0.75),
        'cristal': K.material('cristal', '#a9c0cc', 0.06, capa=1.0), 'blanco': K.material('blanco', '#ffffff', 0.8),
        'pared': K.yeso('pared_m', '#3a4852'), 'suelo': K.material('suelo_m', '#23282d', 0.8),
        'papel': K.material('papel_e', '#f1eee4', 0.85), 'tapa': K.material('tapa', '#22303a', 0.6),
        'nogal': K.madera('nogal', '#4a2e1c', '#7a5236', eje='X', vetas=5), 'fieltro': K.material('fieltro', '#24443c', 0.95),
        'ambar': K.material('ambar', '#d9902a', 0.08, capa=1.0), 'azul': K.material('azul_f', '#2f6fb8', 0.08, capa=1.0),
        'rojo': K.material('rojo_f', '#b8382f', 0.08, capa=1.0), 'plastico': K.material('plastico', '#26282d', 0.42),
    }


def mesa(m):
    """El tablero anodizado (su rejilla la pinta la web), la pared y el suelo."""
    M = MESA; cx, cy = (M['x0'] + M['x1']) / 2, (M['y0'] + M['y1']) / 2
    K.bloque('banco_mesa', (M['x1'] - M['x0'], M['y1'] - M['y0'], 0.9), (cx, cy, -0.455), m['anodizado'], bisel=0.03)
    K.lamina('imp_mesa', [(M['x0'] + 0.05, M['y0'] + 0.05, 0.0), (M['x1'] - 0.05, M['y0'] + 0.05, 0.0),
                          (M['x1'] - 0.05, M['y1'] - 0.05, 0.0), (M['x0'] + 0.05, M['y1'] - 0.05, 0.0)], m['blanco'])
    K.bloque('banco_bastidor', (M['x1'] - M['x0'] - 1.0, M['y1'] - M['y0'] - 0.8, 1.2), (cx, cy, -1.5), m['plastico'], bisel=0.02)
    K.bloque('pared', (70, 0.2, 34), (0, M['y1'] + 0.5, 8), m['pared'], bisel=0)
    K.bloque('suelo', (70, 30, 0.1), (0, -8, -9), m['suelo'], bisel=0)


def carril(m):
    """El carril de cola de milano, con sus pies y sus topes; la regla del canto la pinta la web."""
    C = CARRIL; L = C['x1'] - C['x0']
    K.bloque('banco_carril', (L, C['ancho'], C['alto'] - 0.1), (0, C['y'], (C['alto'] - 0.1) / 2 + 0.1), m['aluminio'], bisel=0.02)
    K.bloque('banco_carril_guia', (L, C['ancho'] - 0.3, 0.1), (0, C['y'], 0.05), m['anodizado'], bisel=0)
    K.bloque('banco_carril_ranura', (L - 0.3, 0.16, 0.012), (0, C['y'] + 0.12, C['alto'] + 0.002), m['negro'], bisel=0)
    R_ = REGLA
    K.lamina('imp_regla', [(R_['x0'], R_['y0'], R_['z']), (R_['x1'], R_['y0'], R_['z']), (R_['x1'], R_['y1'], R_['z']), (R_['x0'], R_['y1'], R_['z'])], m['blanco'])
    for k, x in enumerate((C['x0'] + 0.25, C['x1'] - 0.25)):
        K.bloque(f'banco_tope_{k}', (0.3, C['ancho'] + 0.2, 0.62), (x, C['y'], 0.31), m['anodizado'], bisel=0.03)
        K.cilindro(f'banco_tope_{k}_tornillo', 0.09, 0.06, (x, C['y'], 0.64), m['acero'], eje='Z', lados=20)
    for k, x in enumerate((-7.2, -2.4, 2.4, 7.2)):
        K.cilindro(f'banco_carril_tornillo_{k}', 0.07, 0.03, (x, C['y'] - 0.22, C['alto'] + 0.012), m['acero'], eje='Z', lados=16)


def portamuestras(m):
    """Diez postes con su marco de pinza y su cristal; cada uno, con un collarín del color de su proyecto."""
    U = MUESTRA; y = U['y'] + 0.1
    for i, id_ in enumerate(ORDEN):
        x = xs(i); n = f'banco_porta_{i}'
        K.cilindro(f'{n}_pie', 0.46, 0.2, (x, y, 0.1), m['anodizado'], eje='Z', lados=28, bisel=0.03)
        K.cilindro(f'{n}_poste', 0.085, 1.32, (x, y, 0.2 + 0.66), m['acero'], eje='Z', lados=20)
        K.cilindro(f'{n}_collarin', 0.16, 0.26, (x, y, 0.62), K.material(f'color_{id_}', COLOR[id_], 0.4, capa=0.4), eje='Z', lados=24, bisel=0.02)
        K.cilindro(f'{n}_palomilla', 0.05, 0.22, (x + 0.2, y - 0.05, 0.62), m['acero'], eje='X', lados=12)
        z0, z1 = U['z'] - U['alto'] / 2 - 0.1, U['z'] + U['alto'] / 2 + 0.1
        K.bloque(f'{n}_bajo', (U['ancho'] + 0.3, 0.16, 0.12), (x, y - 0.04, z0), m['anodizado'], bisel=0.02)
        K.bloque(f'{n}_alto', (U['ancho'] + 0.3, 0.16, 0.12), (x, y - 0.04, z1), m['anodizado'], bisel=0.02)
        for s in (-1, 1):
            K.bloque(f'{n}_lado{s:+d}', (0.1, 0.16, z1 - z0), (x + s * (U['ancho'] / 2 + 0.1), y - 0.04, U['z']), m['anodizado'], bisel=0.02)
        K.bloque(f'{n}_cristal', (U['ancho'] + 0.1, 0.04, U['alto'] + 0.08), (x, y - 0.03, U['z']), m['cristal'], bisel=0)
        K.cilindro(f'{n}_pinza', 0.06, 0.1, (x, y - 0.12, z1), m['laton'], eje='Y', lados=16)
        # la muestra: una lámina por delante del cristal; su trozo de la tira impresa
        o = K.lamina(f'imp_muestra_{i}', [(x - U['ancho'] / 2, U['y'], U['z'] - U['alto'] / 2), (x + U['ancho'] / 2, U['y'], U['z'] - U['alto'] / 2),
                                          (x + U['ancho'] / 2, U['y'], U['z'] + U['alto'] / 2), (x - U['ancho'] / 2, U['y'], U['z'] + U['alto'] / 2)], m['blanco'])
        u0, u1 = i / len(ORDEN), (i + 1) / len(ORDEN)
        for k, uv in enumerate([(u0, 0), (u1, 0), (u1, 1), (u0, 1)]):
            o.data.uv_layers['UVMap'].data[k].uv = uv


def lente(m):
    """El carro con la lente. El vacío `lente` corre por el carril; `lente_cabeza` gira en la bisagra para apartar el aro."""
    L = LENTE; C = CARRIL
    raiz = K.vacio('lente', (0, C['y'], C['alto']))
    K.bloque('lente_carro', (1.3, C['ancho'] + 0.24, 0.26), (0, 0, 0.13), m['anodizado'], padre=raiz, bisel=0.04)
    for s in (-1, 1):
        K.bloque(f'lente_falda{s:+d}', (1.3, 0.1, 0.3), (0, s * (C['ancho'] / 2 + 0.07), -0.05), m['anodizado'], padre=raiz, bisel=0.02)
    K.cilindro('lente_pomo', 0.17, 0.3, (0.38, -(C['ancho'] / 2 + 0.25), 0.02), m['laton'], padre=raiz, eje='Y', lados=24, bisel=0.02)
    K.cilindro('lente_indice', 0.035, 0.3, (0, -(C['ancho'] / 2 + 0.2), -0.02), m['acero'], padre=raiz, eje='Z', lados=10)
    h = L['bisagra'] - C['alto']                                          # la bisagra, sobre el carro
    K.cilindro('lente_poste', 0.12, h - 0.26, (0, 0, 0.26 + (h - 0.26) / 2), m['acero'], padre=raiz, eje='Z', lados=24)
    K.cilindro('lente_bisagra', 0.19, 0.4, (0, 0, h), m['anodizado'], padre=raiz, eje='Y', lados=24, bisel=0.02)
    K.cilindro('lente_bisagra_eje', 0.07, 0.46, (0, 0, h), m['laton'], padre=raiz, eje='Y', lados=16)
    cabeza = K.vacio('lente_cabeza', (0, 0, h), padre=raiz)
    zc = L['z'] - L['bisagra']
    K.tubo('cabeza_aro', L['r'] + 0.035, L['aro'], 0.24, (0, 0, zc), m['anodizado'], padre=cabeza, eje='Y', lados=72)
    K.tubo('cabeza_filo', L['r'], L['r'] + 0.045, 0.3, (0, 0, zc), m['laton'], padre=cabeza, eje='Y', lados=72)
    K.cilindro('cabeza_tirador', 0.06, 0.26, (0, 0, zc + L['aro'] + 0.1), m['laton'], padre=cabeza, eje='Z', lados=16)
    K.esfera('cabeza_bola', 0.12, (0, 0, zc + L['aro'] + 0.27), m['laton'], padre=cabeza, segmentos=(20, 12))
    for a in (40, 140):
        import math
        K.cilindro(f'cabeza_tornillo_{a}', 0.045, 0.26, ((L['r'] + 0.2) * math.cos(R(a)), 0, zc + (L['r'] + 0.2) * math.sin(R(a))), m['acero'], padre=cabeza, eje='Y', lados=12)
    K.cilindro('cristal_lente', L['r'] + 0.01, 0.03, (0, 0, zc), m['cristal'], padre=cabeza, eje='Y', lados=64)
    return raiz


def fuente_y_visor(m):
    """A la izquierda, la fuente de luz del banco; a la derecha, el visor con su platina."""
    C = CARRIL; x = -12.3; z = LENTE['z']
    K.bloque('banco_fuente_pie', (1.5, 1.3, 0.24), (x, C['y'], 0.12), m['anodizado'], bisel=0.04)
    K.cilindro('banco_fuente_poste', 0.12, z - 0.9, (x, C['y'], 0.24 + (z - 0.9) / 2), m['acero'], eje='Z', lados=24)
    K.cilindro('banco_fuente_caja', 0.72, 2.0, (x, C['y'], z), m['anodizado'], eje='X', lados=40, bisel=0.05)
    for k in range(5):
        K.tubo(f'banco_fuente_aleta_{k}', 0.7, 0.84, 0.07, (x - 0.75 + 0.24 * k, C['y'], z), m['anodizado'], lados=40, eje='Z').rotation_euler = (0, R(90), 0)
    K.tubo('banco_fuente_boca', 0.5, 0.62, 0.36, (x + 1.1, C['y'], z), m['laton'], lados=40, eje='Z').rotation_euler = (0, R(90), 0)
    K.cilindro('luz_fuente', 0.5, 0.04, (x + 1.16, C['y'], z), K.material('luz_fuente', '#fff2d8', 0.5, emision='#ffe2b0', fuerza=5.0), eje='X', lados=40)
    K.cilindro('banco_fuente_cable', 0.04, 3.2, (x - 1.6, C['y'] + 1.2, 0.04), m['goma'], eje='X', lados=10).rotation_euler = (0, 0, R(-38))
    # el visor: una pantalla en su pie y, a su izquierda, la platina con dos pinzas donde se deja la muestra
    M = MONITOR; mx, my, mz = M['x'], M['y'], M['z']; A, Al, mc = M['ancho'], M['alto'], M['marco']
    K.bloque('banco_visor_base', (2.2, 1.5, 0.22), (mx, my + 0.35, 0.11), m['anodizado'], bisel=0.04)
    K.cilindro('banco_visor_poste', 0.14, mz - 0.2, (mx, my + 0.5, 0.2 + (mz - 0.2) / 2), m['acero'], eje='Z', lados=24)
    K.bloque('banco_visor_nuez', (0.6, 0.4, 0.6), (mx, my + 0.32, mz), m['anodizado'], bisel=0.05)
    K.bloque('banco_visor_caja', (A + 2 * mc, M['fondo'], Al + 2 * mc), (mx, my + 0.02, mz), m['plastico'], bisel=0.05)
    yc = my - M['fondo'] / 2 + 0.01
    K.lamina('pantalla_cara', [(mx - A / 2, yc, mz - Al / 2), (mx + A / 2, yc, mz - Al / 2), (mx + A / 2, yc, mz + Al / 2), (mx - A / 2, yc, mz + Al / 2)], m['negro'])
    P = PLATINA
    K.bloque('banco_platina', (1.9, 1.1, 0.3), (P['x'], P['y'] + 0.2, 0.15), m['anodizado'], bisel=0.04)
    K.bloque('banco_platina_respaldo', (1.5, 0.08, MUESTRA['alto'] + 0.2), (P['x'], P['y'] + 0.1, 0.3 + (MUESTRA['alto'] + 0.2) / 2), m['aluminio'], bisel=0.02)
    for s in (-1, 1):
        K.bloque(f'banco_platina_pinza{s:+d}', (0.1, 0.2, 0.5), (P['x'] + s * (MUESTRA['ancho'] / 2 + 0.07), P['y'] + 0.02, 0.55), m['laton'], bisel=0.02)
    K.cilindro('banco_visor_cable', 0.04, 1.6, (P['x'] + 1.0, P['y'] + 0.6, 0.04), m['goma'], eje='X', lados=10)


def encima(m):
    """Lo que hay en la mesa: el cuaderno, el lápiz, la caja de filtros y una llave."""
    K.bloque('banco_cuaderno', (2.6, 3.4, 0.14), (5.6, -3.4, 0.07), m['tapa'], bisel=0.03).rotation_euler = (0, 0, R(-7))
    K.bloque('banco_cuaderno_hoja', (2.4, 3.2, 0.03), (5.62, -3.38, 0.155), m['papel'], bisel=0).rotation_euler = (0, 0, R(-7))
    K.cilindro('banco_lapiz', 0.045, 1.9, (7.9, -3.7, 0.045), m['laton'], eje='X', lados=10).rotation_euler = (0, 0, R(24))
    K.bloque('banco_caja', (3.4, 1.7, 0.42), (-6.2, -3.9, 0.21), m['nogal'], bisel=0.04)
    K.bloque('banco_caja_fieltro', (3.1, 1.4, 0.02), (-6.2, -3.9, 0.425), m['fieltro'], bisel=0)
    for k, mat in enumerate(('ambar', 'azul', 'rojo')):
        K.tubo(f'banco_filtro_{k}_aro', 0.36, 0.44, 0.1, (-7.2 + k, -3.9, 0.49), m['anodizado'], lados=32, eje='Z')
        K.cilindro(f'banco_filtro_{k}', 0.37, 0.04, (-7.2 + k, -3.9, 0.49), m[mat], eje='Z', lados=32)
    K.bloque('banco_llave', (1.3, 0.09, 0.09), (-1.6, -4.2, 0.045), m['acero'], bisel=0.02).rotation_euler = (0, 0, R(16))
    K.bloque('banco_llave_codo', (0.09, 0.42, 0.09), (-2.2, -4.2, 0.045), m['acero'], bisel=0.02).rotation_euler = (0, 0, R(16))


def luces():
    # un plafón largo sobre el banco, un relleno frío desde la derecha y un foco cálido que roza las muestras
    K.area('plafon', (0, -6.5, 13), (0, -0.5, 1.5), 2600, (1.0, 0.96, 0.9), 20, 3.0)
    K.area('relleno', (16, -16, 7), (2, 0, 2), 1100, (0.82, 0.9, 1.0), 12)
    K.foco('rasante', (-13, -7, 9), (-2, 0.9, 2.4), 2600, (1.0, 0.86, 0.66), 70, 0.9, 0.5)
    K.mundo('#56616c', 0.3)


def datos():
    return {'orden': ORDEN, 'paso': PASO, 'x0': X0, 'xs': [xs(i) for i in range(len(ORDEN))], 'mesa': MESA, 'carril': CARRIL,
            'regla': REGLA, 'muestra': MUESTRA, 'lente': LENTE, 'monitor': MONITOR, 'platina': PLATINA}


def escena():
    m = materiales()
    mesa(m); carril(m); portamuestras(m); fuente_y_visor(m); encima(m); luces()
    return m, lente(m)


def foto(nombre, pos, mira, lente_mm):
    K.ajustes(1440, 900, MUESTRAS)
    K.camara(pos, mira, lente_mm)
    bpy.context.scene.render.filepath = os.path.join(DESTINO, nombre + '.png')
    bpy.ops.render.render(write_still=True)


METAL = re.compile(r'^banco_(carril$|carril_tornillo|tope_\d_tornillo|porta_\d+_(poste|palomilla|pinza|cristal)|fuente_(poste|boca)|visor_poste|platina_(respaldo|pinza)|filtro_\d$|llave|lapiz)')


def unir_para_la_web(todo):
    """Ya horneado, lo que se mueve junto va a la web en una sola malla: el banco (lo metálico aparte, que brilla
    distinto), la pared con el suelo, el carro de la lente y su cabeza. Quedan sueltas las piezas impresas, la pantalla,
    la luz de la fuente y el cristal de la lente."""
    comun = K.gris('para_la_web')
    grupos = {}
    for o in todo:
        n = o.name
        if n.startswith(('imp_', 'pantalla_cara', 'luz_fuente', 'cristal_lente')):
            continue
        if n.startswith('cabeza_'):
            nombre = 'lente_cabeza_unida'
        elif n.startswith('lente_'):
            nombre = 'lente_carro_unido'
        elif n.startswith('banco_'):
            nombre = 'banco_metal_unido' if METAL.match(n) else 'banco_unido'
        elif n.startswith(('pared', 'suelo')):
            nombre = 'pared_unida'
        else:
            continue
        grupos.setdefault(nombre, []).append(o)
    for nombre, objs in grupos.items():
        for o in objs:
            o.data.materials.clear(); o.data.materials.append(comun)
        if len(objs) > 1:
            K.seleccionar(objs); bpy.ops.object.join()
        junto = bpy.context.view_layer.objects.active if len(objs) > 1 else objs[0]
        junto.name = nombre; junto.data.name = nombre
        junto.data.uv_layers.active = junto.data.uv_layers['luz']


def principal():
    m, raiz = escena()
    if 'vista' in RESTO:
        m['blanco'].node_tree.nodes['Principled BSDF'].inputs['Base Color'].default_value = K.srgb('#c8ccd0')
        raiz.location.x = xs(2)
        return foto('vista', (0.5, -30, 8.5), (0.5, 0, 2.0), 38)
    import time
    t0 = time.time(); reloj = lambda *x: print(f'[{time.time() - t0:7.1f} s]', *x, flush=True)  # noqa: E731
    K.preparar(); reloj('preparado')
    K.ajustes(64, 64, MUESTRAS)
    horno = K.Horno(DESTINO)
    todo = K.mallas()
    nombres = lambda *pre: [o for o in todo if o.name.startswith(pre)]  # noqa: E731
    g = {'banco': nombres('banco_'), 'pared': nombres('pared', 'suelo'), 'mesa': nombres('imp_mesa', 'imp_regla'),
         'muestras': nombres('imp_muestra_'), 'lente': nombres('lente_', 'cabeza_')}
    for clave, objs in g.items():
        K.desplegar(objs, 0.003 if clave in ('banco', 'lente') else 0.006)
        reloj('desplegado', clave, len(objs), 'piezas', sum(len(o.data.polygons) for o in objs), 'caras')
    if 'medir' in RESTO:
        import collections
        tri = lambda o: sum(len(pl.vertices) - 2 for pl in o.data.polygons)  # noqa: E731
        por_tipo = collections.Counter()
        for o in todo:
            por_tipo[re.sub(r'_\d+(_|$)', r'_N\1', o.name)] += tri(o)
        print('TRIANGULOS', sum(tri(o) for o in todo), 'MALLAS', len(todo), flush=True)
        for k, v in por_tipo.most_common(25):
            print(f'TIPO {v:7d} {k}', flush=True)
        return
    if 'sinluz' in RESTO:            # solo la geometría, para probar la web antes de hornear
        unir_para_la_web(todo); horno.exportar(datos()); return
    seguir = 'seguir' in RESTO

    def hornear(objs, nombre, *a, **k):
        horno.hornear_junto(objs, nombre, *a, reusar=seguir, **k); reloj('horneado', nombre)
    # la lente corre por el carril: su sombra no puede quedar pintada en un sitio, así que el banco se hornea sin ella
    suelta = g['lente'] + nombres('cristal_lente')
    for o in suelta:
        o.hide_render = True
    hornear(g['banco'], 'banco', 4096, color=True, publicar=2048)
    hornear(g['pared'], 'pared', 1024, color=True)
    hornear(g['mesa'], 'mesa', 2048, color=True)
    hornear(g['muestras'], 'muestras', 1024, color=True)
    for o in suelta:
        o.hide_render = False
    bpy.data.objects['cristal_lente'].hide_render = True                 # el cristal no da sombra al aro
    hornear(g['lente'], 'lente', 1024, color=True)
    bpy.data.objects['cristal_lente'].hide_render = False
    unir_para_la_web(todo); reloj('unido', len(K.mallas()), 'mallas')
    horno.exportar(datos()); reloj('exportado')


principal()
