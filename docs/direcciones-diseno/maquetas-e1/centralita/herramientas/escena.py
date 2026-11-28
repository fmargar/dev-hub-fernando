"""La centralita: un mueble de cerámica y latón con un puerto por proyecto y una clavija con su cordón.

  pesado.sh --cola gpu centralita-e1 -- <python con bpy> escena.py <carpeta> [muestras] [vista|medir|boceto|seguir]

Una centralita de teléfonos rehecha: el cuerpo de cerámica esmaltada, el tablero de puertos en esmalte verde con
aros de latón, y encima un panel de tres caras que gira sobre su eje (el rótulo, la ficha del proyecto conectado y
la pantalla). En la repisa de nogal descansa la clavija, con su cordón trenzado saliendo del pasacables. Cada puerto
lleva su piloto y su placa; el décimo, con la placa en blanco, espera al siguiente.

El cordón no está en la escena: lo tiende la web entre el pasacables y la cola de la clavija, en cada fotograma.
Las tres caras del panel no llevan luz horneada (giran): la web las pinta lisas, como un impreso.
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

# ── Medidas (1 = 10 cm). X a la derecha, Y hacia la pared, Z arriba; la repisa en z = 0…0,6 ──
FRENTE = -0.6                                                       # la cara del mueble
ANCHO = 13.2
TAB = {'x0': -6.0, 'x1': 6.0, 'z0': 1.0, 'z1': 5.4, 'y': FRENTE - 0.012}    # el tablero de puertos
COLS, FILAS = 5, 2
HX, HZ = (TAB['x1'] - TAB['x0']) / COLS, (TAB['z1'] - TAB['z0']) / FILAS
ORDEN = ['adivinadle', 'wardux', 'calculo', 'agentes', 'erp', 'servidor', 'marbella', 'vados', 'vision', 'siguiente']
HUECO = {'z0': 5.75, 'z1': 10.45, 'x': 3.35}                       # el hueco del panel giratorio
PANEL = {'ancho': 6.4, 'alto': 4.0, 'z': 8.1}                      # cada cara del panel
PANEL['radio'] = PANEL['alto'] / math.sqrt(3) / 2                  # del eje a cada cara
PANEL['y'] = FRENTE + 0.1 + PANEL['radio']                         # el eje
CLAVIJA = {'largo': 1.85, 'mete': 0.62, 'reposo': (0.0, -1.0, 1.07), 'pasacables': (0.0, -3.15, 0.62)}


def puerto(i):
    """Centro del aro del puerto i (x, z) y altura de su piloto."""
    c, f = i % COLS, i // COLS
    return TAB['x0'] + HX * (c + 0.5), TAB['z1'] - HZ * f - 0.95


def torno_y(nombre, perfil, mat, padre, lados=32):
    """Perfil [(r, y)…] girado alrededor del eje Y (la clavija apunta a +Y, con la punta en y = 0)."""
    bm = bmesh.new(); anillos = []
    for r, y in perfil:
        if r <= 1e-4:
            anillos.append([bm.verts.new((0, y, 0))])
        else:
            anillos.append([bm.verts.new((r * math.cos(2 * math.pi * k / lados), y, r * math.sin(2 * math.pi * k / lados))) for k in range(lados)])
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
    return K.objeto(nombre, me, padre, mat)


def giro_x(p, a):
    x, y, z = p
    return (x, y * math.cos(a) - z * math.sin(a), y * math.sin(a) + z * math.cos(a))


def materiales():
    return {
        'ceramica': K.material('ceramica', '#e6dfcf', 0.18, capa=0.6), 'esmalte': K.material('esmalte', '#ffffff', 0.3, capa=0.4),
        'laton': K.material('laton', '#c09a55', 0.28, metal=0.9), 'hueco': K.material('hueco', '#0b0c0d', 0.9),
        'oscuro': K.material('oscuro', '#1c1e20', 0.5), 'nogal': K.madera('nogal', '#3f2616', '#70482c', eje='X', vetas=5),
        'pared': K.yeso('pared_m', '#33424a'), 'suelo': K.material('suelo_m', '#2a2623', 0.8),
        'piloto': K.material('piloto', '#f2e6cf', 0.15, capa=0.8), 'rojo': K.material('rojo', '#8f2a22', 0.25, capa=0.7),
        'goma': K.material('goma', '#1b1b1d', 0.7), 'blanco': K.material('blanco', '#ffffff', 0.6),
        'negro': K.material('negro', '#0b0c0e', 0.3), 'tela': K.material('tela', '#5a4a3a', 0.9),
    }


def mueble(m):
    """El cuerpo de cerámica (con el hueco del panel), la repisa de nogal, el tablero y sus diez puertos."""
    fondo, yc = 3.6, FRENTE + 1.8
    H = HUECO
    K.bloque('mueble_cuerpo', (ANCHO, fondo, H['z0'] - 0.6), (0, yc, (H['z0'] + 0.6) / 2), m['ceramica'], bisel=0.1)
    lado = ANCHO / 2 - H['x']
    for s in (-1, 1):
        K.bloque(f'mueble_columna_{"i" if s < 0 else "d"}', (lado, fondo, H['z1'] - H['z0'] + 0.3), (s * (H['x'] + lado / 2), yc, (H['z0'] + H['z1']) / 2), m['ceramica'], bisel=0.1)
        # el pivote del panel, de latón, en cada costado del hueco
        K.cilindro(f'mueble_laton_pivote_{"i" if s < 0 else "d"}', 0.3, 0.13, (s * (H['x'] - 0.065), PANEL['y'], PANEL['z']), m['laton'], eje='X', lados=24, bisel=0.02)
    K.bloque('mueble_cornisa', (ANCHO + 0.4, fondo + 0.2, 0.6), (0, yc, H['z1'] + 0.3), m['ceramica'], bisel=0.14)
    K.bloque('mueble_hueco_fondo', (2 * H['x'] + 0.2, 0.1, H['z1'] - H['z0'] + 0.2), (0, FRENTE + fondo - 0.25, (H['z0'] + H['z1']) / 2), m['hueco'], bisel=0)
    # filetes de latón: bajo el hueco y bajo la cornisa
    K.bloque('mueble_laton_filete', (ANCHO - 0.5, 0.08, 0.1), (0, FRENTE - 0.02, H['z0'] - 0.18), m['laton'], bisel=0.02)
    K.bloque('mueble_laton_filete_alto', (ANCHO - 0.5, 0.08, 0.1), (0, FRENTE - 0.02, H['z1'] + 0.12), m['laton'], bisel=0.02)
    # la rejilla del altavoz, a la derecha del hueco, y la placa del fabricante a la izquierda
    for k in range(7):
        K.bloque(f'mueble_rejilla_{k}', (1.7, 0.08, 0.09), (H['x'] + lado / 2, FRENTE - 0.01, 7.3 + k * 0.27), m['oscuro'], bisel=0.02)
    K.bloque('mueble_laton_placa', (1.7, 0.05, 0.6), (-(H['x'] + lado / 2), FRENTE - 0.02, 9.4), m['laton'], bisel=0.03)
    # el interruptor de palanca y su piloto, bajo la placa (adorno: la centralita está encendida)
    K.cilindro('mueble_laton_palanca_base', 0.2, 0.08, (-(H['x'] + lado / 2), FRENTE - 0.04, 7.6), m['laton'], eje='Y', lados=24, bisel=0.02)
    K.cilindro('mueble_laton_palanca', 0.055, 0.5, (-(H['x'] + lado / 2), FRENTE - 0.3, 7.72), m['laton'], eje='Y', lados=16).rotation_euler = (R(-28), 0, 0)
    # el tablero: una chapa esmaltada (la web le pinta las placas) con marco de latón
    T = TAB
    K.lamina('panel_cara', [(T['x0'], T['y'], T['z0']), (T['x1'], T['y'], T['z0']), (T['x1'], T['y'], T['z1']), (T['x0'], T['y'], T['z1'])], m['blanco'])
    g = 0.1
    W, Hh = T['x1'] - T['x0'], T['z1'] - T['z0']
    for n, tam, pos in (('arriba', (W + 2 * g, 0.07, g), (0, T['y'], T['z1'] + g / 2)), ('abajo', (W + 2 * g, 0.07, g), (0, T['y'], T['z0'] - g / 2)),
                        ('izq', (g, 0.07, Hh), (T['x0'] - g / 2, T['y'], (T['z0'] + T['z1']) / 2)), ('der', (g, 0.07, Hh), (T['x1'] + g / 2, T['y'], (T['z0'] + T['z1']) / 2))):
        K.bloque(f'mueble_laton_marco_{n}', tam, pos, m['laton'], bisel=0.015)
    for i in range(COLS * FILAS):
        px, pz = puerto(i)
        K.tubo(f'mueble_laton_aro_{i}', 0.13, 0.36, 0.1, (px, FRENTE - 0.06, pz), m['laton'], eje='Y', lados=32, bisel=0.02)
        K.tubo(f'mueble_laton_cuello_{i}', 0.13, 0.2, 0.16, (px, FRENTE - 0.09, pz), m['laton'], eje='Y', lados=32, bisel=0.015)
        K.cilindro(f'mueble_fondo_puerto_{i}', 0.13, 0.02, (px, FRENTE - 0.02, pz), m['hueco'], eje='Y', lados=20)
        K.tubo(f'mueble_laton_bisel_{i}', 0.13, 0.19, 0.07, (px, FRENTE - 0.045, pz + 0.72), m['laton'], eje='Y', lados=24, bisel=0.015)
        K.esfera(f'piloto_{i}', 0.14, (px, FRENTE - 0.05, pz + 0.72), m['piloto'], escala=(1, 0.75, 1), segmentos=(16, 10))
    # la repisa de nogal, con su canto de latón, y el cuerpo de abajo
    K.bloque('mueble_repisa', (ANCHO + 2.0, 3.4, 0.6), (0, FRENTE - 1.3, 0.3), m['nogal'], bisel=0.07)
    K.bloque('mueble_laton_canto', (ANCHO + 2.04, 0.05, 0.14), (0, FRENTE - 3.0, 0.3), m['laton'], bisel=0.015)
    K.bloque('mueble_base', (ANCHO, fondo, 9.0), (0, yc, -4.5), m['ceramica'], bisel=0.1)
    # el pasacables y la cuna donde descansa la clavija
    px, py, pz = CLAVIJA['pasacables']
    K.tubo('mueble_laton_pasacables', 0.13, 0.26, 0.08, (px, py, pz), m['laton'], eje='Z', lados=24, bisel=0.02)
    K.cilindro('mueble_fondo_pasacables', 0.13, 0.02, (px, py, 0.61), m['hueco'], eje='Z', lados=20)
    rx, ry, rz = CLAVIJA['reposo']
    for dy, alto in ((-0.45, 0.2), (-1.3, 0.2)):
        K.bloque(f'mueble_laton_cuna_{abs(dy):.1f}', (0.74, 0.12, alto), (rx, ry + dy, 0.6 + alto / 2), m['laton'], bisel=0.03)
    # unos auriculares de operadora colgados del costado derecho (adorno)
    K.toro('mueble_auric_diadema', 0.75, 0.05, (ANCHO / 2 + 0.25, FRENTE - 0.35, 4.2), m['oscuro'], eje='Y')
    for s in (-1, 1):
        K.cilindro(f'mueble_auric_casco_{s}', 0.34, 0.2, (ANCHO / 2 + 0.25 + s * 0.74, FRENTE - 0.35, 4.05), m['oscuro'], eje='X', lados=24, bisel=0.04)
    K.cilindro('mueble_laton_percha', 0.05, 0.6, (ANCHO / 2 + 0.25, FRENTE - 0.1, 4.97), m['laton'], eje='Y', lados=16)
    # pared y suelo
    K.bloque('pared', (70, 0.2, 40), (0, FRENTE + fondo + 0.3, 6), m['pared'], bisel=0)
    K.bloque('suelo', (70, 40, 0.1), (0, -8, -9.05), m['suelo'], bisel=0)


def panel(m):
    """El panel de tres caras: un prisma que gira sobre un eje horizontal. Cara 0, el rótulo; 1, la ficha; 2, la
    pantalla. La cara k está girada k × 120° alrededor de X: para traerla al frente, el vacío gira −k × 120°."""
    P = PANEL; raiz = K.vacio('panel', (0, P['y'], P['z']))
    r, a2, h2 = P['radio'], P['ancho'] / 2, P['alto'] / 2
    # el cuerpo: un prisma triangular algo más pequeño que las caras, en esmalte oscuro, con cantoneras de latón
    bm = bmesh.new(); tri = []
    R_ = 2 * r - 0.02                                                # del eje a cada arista
    for x in (-a2, a2):
        tri.append([bm.verts.new(giro_x((x, 0, R_), R(30) + k * R(120))) for k in range(3)])
    bm.faces.new(tri[0]); bm.faces.new(tri[1][::-1])
    for k in range(3):
        j = (k + 1) % 3; bm.faces.new((tri[0][k], tri[1][k], tri[1][j], tri[0][j]))
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    me = bpy.data.meshes.new('panel_cuerpo'); bm.to_mesh(me); bm.free()
    K.objeto('panel_cuerpo', me, raiz, m['oscuro'])
    for k in range(3):
        # las aristas, de latón: una varilla a lo largo de cada una
        x, y, z = giro_x((0, 0, R_ - 0.03), R(30) + k * R(120))
        K.cilindro(f'panel_laton_arista_{k}', 0.07, P['ancho'], (x, y, z), m['laton'], padre=raiz, eje='X', lados=12)
        esq = [giro_x(p, k * R(120)) for p in ((-a2 + 0.06, -r - 0.012, -h2 + 0.1), (a2 - 0.06, -r - 0.012, -h2 + 0.1), (a2 - 0.06, -r - 0.012, h2 - 0.1), (-a2 + 0.06, -r - 0.012, h2 - 0.1))]
        K.lamina('pantalla_cara' if k == 2 else f'panel_cara_{k}', esq, m['negro'] if k == 2 else m['blanco'], padre=raiz)
    return raiz


def clavija(m):
    """La clavija, apuntando a la pared, con la punta en el origen de su vacío. En reposo, sobre la cuna."""
    raiz = K.vacio('clavija', CLAVIJA['reposo'])
    torno_y('clavija_laton_punta', [(0.0, 0.0), (0.06, -0.015), (0.1, -0.08), (0.1, -0.15), (0.065, -0.19), (0.065, -0.24), (0.1, -0.28), (0.1, -0.62),
                                    (0.2, -0.65), (0.21, -0.69), (0.21, -0.8), (0.17, -0.83)], m['laton'], raiz)
    torno_y('clavija_mango', [(0.17, -0.82), (0.235, -0.88), (0.27, -1.0), (0.275, -1.2), (0.26, -1.42), (0.215, -1.56), (0.2, -1.6)], m['rojo'], raiz)
    for k in range(3):
        y = -1.02 - k * 0.14
        torno_y(f'clavija_laton_anilla_{k}', [(0.268, y), (0.284, y - 0.012), (0.284, y - 0.05), (0.268, y - 0.062)], m['laton'], raiz)
    torno_y('clavija_cola', [(0.2, -1.59), (0.13, -1.64), (0.105, -1.72), (0.1, -1.85), (0.0, -1.85)], m['goma'], raiz)
    return raiz


def luces():
    K.area('clave', (-11, -14, 15), (0, 0, 5), 3400, (1.0, 0.92, 0.8), 9)
    K.area('relleno', (13, -16, 5), (0, 0, 5), 1100, (0.82, 0.9, 1.0), 12)
    K.area('cenital', (0, -4, 15), (0, -1, 3), 900, (1.0, 0.96, 0.9), 12, 2)
    K.mundo('#8a8f96', 0.22)


def datos():
    return {'tablero': TAB, 'cols': COLS, 'filas': FILAS, 'hx': HX, 'hz': HZ, 'orden': ORDEN, 'frente': FRENTE, 'ancho': ANCHO,
            'puertos': [puerto(i) for i in range(len(ORDEN))], 'panel': PANEL, 'hueco': HUECO, 'clavija': CLAVIJA}


def foto(nombre, pos, mira, lente):
    K.ajustes(*((640, 400) if 'vistazo' in RESTO else (1440, 900)), MUESTRAS)
    K.camara(pos, mira, lente)
    bpy.context.scene.render.filepath = os.path.join(DESTINO, nombre + '.png')
    bpy.ops.render.render(write_still=True)


def unir_para_la_web(todo):
    """Ya horneado, lo que se mueve junto va en una sola malla: el mueble en lo de latón y lo demás (brillan
    distinto), la clavija igual bajo su vacío, el cuerpo del panel con sus aristas, y la pared con el suelo. Sueltos
    quedan lo que la web pinta o enciende: el tablero, las caras del panel y los pilotos."""
    comun = K.gris('para_la_web')
    grupos = {}
    for o in todo:
        n = o.name
        if n in ('panel_cara', 'panel_cara_0', 'panel_cara_1', 'pantalla_cara') or n.startswith('piloto_'):
            continue
        if n.startswith('mueble_'):
            clave = (None, 'mueble_laton_unido' if n.startswith('mueble_laton_') else 'mueble_unido')
        elif n.startswith('clavija_'):
            clave = (o.parent, 'clavija_laton_unida' if n.startswith('clavija_laton_') else 'clavija_unida')
        elif n.startswith('panel_'):
            clave = (o.parent, 'panel_laton_unido' if n.startswith('panel_laton_') else 'panel_cuerpo_unido')
        elif n.startswith(('pared', 'suelo')):
            clave = (None, 'pared_unida')
        else:
            continue
        grupos.setdefault(clave, []).append(o)
    for (_, nombre), objs in grupos.items():
        for o in objs:
            o.data.materials.clear(); o.data.materials.append(comun)
        if len(objs) > 1:
            K.seleccionar(objs); bpy.ops.object.join()
        junto = bpy.context.view_layer.objects.active if len(objs) > 1 else objs[0]
        junto.name = nombre; junto.data.name = nombre
        junto.data.uv_layers.active = junto.data.uv_layers['luz']


def principal():
    m = materiales()
    mueble(m); panel(m); clavija(m); luces()
    if 'vista' in RESTO or 'vistazo' in RESTO:
        m['blanco'].node_tree.nodes['Principled BSDF'].inputs['Base Color'].default_value = K.srgb('#1f4a43')   # sin el canvas
        return foto('vista', (4, -34, 8.5), (0, 0, 5.3), 42)
    import time
    t0 = time.time(); reloj = lambda *x: print(f'[{time.time() - t0:7.1f} s]', *x, flush=True)  # noqa: E731
    K.preparar(); reloj('preparado')
    K.ajustes(64, 64, MUESTRAS)
    horno = K.Horno(DESTINO)
    todo = K.mallas()
    nombres = lambda *pre: [o for o in todo if o.name.startswith(pre)]  # noqa: E731
    caras = [o for o in todo if o.name in ('panel_cara_0', 'panel_cara_1', 'pantalla_cara')]
    g = {'mueble': [o for o in nombres('mueble_', 'piloto_') + [o for o in todo if o.name == 'panel_cara']],
         'pared': nombres('pared', 'suelo'),
         'panel': [o for o in nombres('panel_') if o not in caras and o.name != 'panel_cara'],
         'clavija': nombres('clavija_')}
    for clave, objs in g.items():
        K.desplegar(objs, 0.003 if clave == 'mueble' else 0.006)
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
    seguir = 'seguir' in RESTO
    if 'boceto' in RESTO:
        # sin hornear: láminas grises lisas, solo para probar la web (encuadres, recorrido) mientras se espera el horno
        import numpy as np
        for nombre, objs in g.items():
            np.save(os.path.join(DESTINO, nombre + '.npy'), np.full((64, 64, 4), 0.55, dtype='float16'))
            horno.texturas[nombre] = {'tam': 64, 'sin_perdida': False, 'contraste': 1.0, 'pareja': None, 'suave': 0, 'percentil': 99.7, 'piezas': [o.name for o in objs]}
        unir_para_la_web(todo); horno.exportar(datos())
        return

    def hornear(objs, nombre, *a, **k):
        horno.hornear_junto(objs, nombre, *a, reusar=seguir, **k); reloj('horneado', nombre)
    # la clavija no está en el mueble al hornearlo (viaja): su sombra sobre la cuna sería mentira en cuanto se mueve
    for o in g['clavija']:
        o.hide_render = True
    hornear(g['mueble'], 'mueble', 4096, color=True, publicar=2048)
    hornear(g['pared'], 'pared', 1024, color=True)
    # lo que se mueve (el panel gira, la clavija viaja) se hornea en el estudio, solo
    for o in bpy.context.scene.objects:
        if o.type in ('MESH', 'LIGHT'):
            o.hide_render = o not in g['panel']
    bpy.context.scene.world = K.mundo_estudio()
    hornear(g['panel'], 'panel', 512, color=True)
    for o in bpy.context.scene.objects:
        if o.type in ('MESH', 'LIGHT'):
            o.hide_render = o not in g['clavija']
    hornear(g['clavija'], 'clavija', 1024, color=True)
    for o in bpy.context.scene.objects:
        o.hide_render = False
    unir_para_la_web(todo); reloj('unido', len(K.mallas()), 'mallas')
    horno.exportar(datos()); reloj('exportado')


principal()
