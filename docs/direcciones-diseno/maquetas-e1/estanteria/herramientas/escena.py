"""La estantería, rehecha: un mueble bajo de nogal en un salón, de noche, con la lámpara encendida.

  pesado.sh --cola gpu estanteria-e1 -- <python con bpy> escena.py <carpeta> [muestras]

El hueco de la izquierda guarda los nueve juegos de canto, con un sujetalibros de latón; el de la derecha, arriba, la consola («Fragua») con su ranura; abajo, un cajón. Encima, la tele y la
lámpara. Todo lo que no se mueve lleva su color dentro del horneado (la web solo pone lo impreso encima); la caja
que se saca, el manual y el disco se hornean aparte en un estudio, porque viajan.

Texturas: mueble, objetos, pared, suelo, lomos (las nueve cajas en su sitio), nicho_con y nicho_sin_0…8 (el hueco
de las cajas con todas y sin cada una: la web mezcla según salga la caja) y, de estudio, caja, manual y disco.
"""
import json
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '../../../kit-e1/herramientas'))
import kit as K  # noqa: E402
import bpy  # noqa: E402

DESTINO, MUESTRAS, RESTO = K.argumentos()
R = K.R

# ── Medidas (1 = 10 cm). El frente del mueble está en y = 0; la pared, detrás, en y = 2,5 ──
T = 0.18                                   # tablero de 18 mm
X0, X1, Z0, Z1, FONDO = -3.0, 3.0, 0.5, 3.2, 2.4
DIV = (-0.30, -0.12)                       # el tablero que separa los dos huecos
BALDA_D = 1.90                             # la balda que separa el cajón (abajo) de la consola (arriba)
PASO = K.D + 0.012
CAJAS_X = [-2.625 + i * PASO for i in range(9)]
CAJAS_Y = 0.12 + K.W / 2                   # el lomo queda 1,2 cm por dentro del frente
CAJAS_Z = Z0 + T + K.H / 2
CONSOLA = {'x': 1.35, 'ancho': 2.0, 'alto': 0.5, 'fondo': 1.7, 'y': 0.25, 'z': BALDA_D + 0.14 + 0.02}
RANURA = {'x': 1.12, 'z': CONSOLA['z'] + 0.30, 'ancho': 1.24, 'alto': 0.034}
TELE = {'x': 0.7, 'y': 1.35, 'z': Z1 + 0.34, 'ancho': 4.4, 'alto': 2.6}


def mueble(m):
    nog, nogv = m['nogal'], m['nogal_v']; b = lambda n, t, p, mat=nog, bis=0.006: K.bloque(n, t, p, mat, bisel=bis)  # noqa: E731
    cx = (X0 + X1) / 2; w = X1 - X0
    b('mueble_techo', (w, FONDO, T), (cx, FONDO / 2, Z1 - T / 2), bis=0.012)
    b('mueble_suelo', (w, FONDO, T), (cx, FONDO / 2, Z0 + T / 2), bis=0.012)
    b('mueble_izq', (T, FONDO, Z1 - Z0 - 2 * T), (X0 + T / 2, FONDO / 2, (Z0 + Z1) / 2), nogv)
    b('mueble_der', (T, FONDO, Z1 - Z0 - 2 * T), (X1 - T / 2, FONDO / 2, (Z0 + Z1) / 2), nogv)
    b('mueble_div', (DIV[1] - DIV[0], FONDO - 0.08, Z1 - Z0 - 2 * T), ((DIV[0] + DIV[1]) / 2, (FONDO - 0.08) / 2, (Z0 + Z1) / 2), nogv)
    b('mueble_trasera', (w - 0.02, 0.08, Z1 - Z0 - 0.02), (cx, FONDO - 0.04, (Z0 + Z1) / 2), bis=0.002)
    b('mueble_balda', (X1 - T - DIV[1], FONDO - 0.08, 0.14), ((X1 - T + DIV[1]) / 2, (FONDO - 0.08) / 2, BALDA_D + 0.07))
    # el cajón: un frente con una ranura de 3 mm alrededor y un tirador de latón
    zc0, zc1 = Z0 + T + 0.03, BALDA_D - 0.03
    b('cajon_frente', (X1 - T - DIV[1] - 0.06, 0.18, zc1 - zc0), ((X1 - T + DIV[1]) / 2, 0.09, (zc0 + zc1) / 2), bis=0.008)
    K.bloque('cajon_hueco', (X1 - T - DIV[1], 0.02, BALDA_D - Z0 - T), ((X1 - T + DIV[1]) / 2, 0.2, (Z0 + T + BALDA_D) / 2), m['oscuro'], bisel=0)
    K.cilindro('cajon_tirador', 0.022, 1.2, ((X1 - T + DIV[1]) / 2, -0.04, zc1 - 0.2), m['laton'], eje='X')
    for dx in (-0.6, 0.6):
        K.cilindro(f'cajon_tirador_pie{dx:+.0f}', 0.018, 0.05, ((X1 - T + DIV[1]) / 2 + dx, -0.015, zc1 - 0.2), m['laton'], eje='Y')
    # patas cónicas
    for i, (px, py) in enumerate([(X0 + 0.35, 0.35), (X1 - 0.35, 0.35), (X0 + 0.35, FONDO - 0.35), (X1 - 0.35, FONDO - 0.35)]):
        K.cilindro(f'mueble_pata_{i}', 0.09, Z0, (px, py, Z0 / 2), nogv, eje='Z', r2=0.13)


def nicho(m):
    """El forro del hueco de las cajas: cinco caras finas pegadas a los tableros (se hornea aparte, con y sin cajas)."""
    nog, nogv = m['nogal_nicho'], m['nogal_nicho_v']; x0, x1 = X0 + T, DIV[0]; z0, z1 = Z0 + T, Z1 - T; f = FONDO - 0.08; e = 0.004
    K.bloque('nicho_suelo', (x1 - x0, f, e), ((x0 + x1) / 2, f / 2, z0 + e / 2), nog, bisel=0)
    K.bloque('nicho_techo', (x1 - x0, f, e), ((x0 + x1) / 2, f / 2, z1 - e / 2), nog, bisel=0)
    K.bloque('nicho_fondo', (x1 - x0, e, z1 - z0), ((x0 + x1) / 2, f - e / 2, (z0 + z1) / 2), nogv, bisel=0)
    K.bloque('nicho_izq', (e, f, z1 - z0), (x0 + e / 2, f / 2, (z0 + z1) / 2), nogv, bisel=0)
    K.bloque('nicho_der', (e, f, z1 - z0), (x1 - e / 2, f / 2, (z0 + z1) / 2), nogv, bisel=0)


def consola(m):
    c = CONSOLA; x, y, z = c['x'], c['y'], c['z']
    K.bloque('consola_cuerpo', (c['ancho'], c['fondo'], c['alto']), (x, y + c['fondo'] / 2, z + c['alto'] / 2), m['grafito'], bisel=0.03)
    # el frente: un bisel más claro y la ranura del disco, una boca negra con labios
    K.bloque('consola_ranura', (RANURA['ancho'], 0.06, RANURA['alto']), (RANURA['x'], y + 0.01, RANURA['z']), m['negro'], bisel=0.008)
    for k, dz in (('a', 1), ('b', -1)):
        K.bloque(f'consola_labio_{k}', (RANURA['ancho'] + 0.06, 0.03, 0.02), (RANURA['x'], y - 0.008, RANURA['z'] + dz * (RANURA['alto'] / 2 + 0.012)), m['grafito2'], bisel=0.006)
    K.lamina('consola_frente', [(x - c['ancho'] / 2 + 0.04, y - 0.0015, z + 0.04), (x + c['ancho'] / 2 - 0.04, y - 0.0015, z + 0.04),
                                (x + c['ancho'] / 2 - 0.04, y - 0.0015, z + c['alto'] - 0.04), (x - c['ancho'] / 2 + 0.04, y - 0.0015, z + c['alto'] - 0.04)], m['blanco'])
    K.bloque('consola_luz', (0.16, 0.02, 0.02), (x + 0.78, y - 0.006, RANURA['z']), m['luz_led'], bisel=0.004)
    for i, (px, py) in enumerate([(x - 0.8, y + 0.2), (x + 0.8, y + 0.2), (x - 0.8, y + 1.5), (x + 0.8, y + 1.5)]):
        K.cilindro(f'consola_pie_{i}', 0.07, 0.02, (px, py, z - 0.01), m['negro'], eje='Z')


def tele(m):
    t = TELE; x, y, z = t['x'], t['y'], t['z']
    K.bloque('tele_cuerpo', (t['ancho'], 0.14, t['alto']), (x, y, z + t['alto'] / 2), m['grafito'], bisel=0.02)
    K.bloque('tele_cristal', (t['ancho'] - 0.12, 0.01, t['alto'] - 0.12), (x, y - 0.072, z + t['alto'] / 2), m['cristal'], bisel=0)
    K.bloque('tele_logo', (0.18, 0.01, 0.025), (x, y - 0.074, z + 0.03), m['grafito2'], bisel=0.003)
    K.bloque('tele_cuello', (0.5, 0.12, 0.34), (x, y + 0.1, Z1 + 0.17), m['grafito'], bisel=0.02)
    K.bloque('tele_pie', (2.0, 0.9, 0.04), (x, y + 0.05, Z1 + 0.02), m['grafito'], bisel=0.015)
    K.bloque('tele_testigo', (0.03, 0.01, 0.012), (x + t['ancho'] / 2 - 0.25, y - 0.074, z + 0.03), m['luz_led'], bisel=0)


def lampara(m):
    x, y = -2.4, 1.25
    K.cilindro('lampara_base', 0.34, 0.09, (x, y, Z1 + 0.045), m['laton'], eje='Z', r2=0.3, bisel=0.02)
    K.cilindro('lampara_vara', 0.028, 2.3, (x, y, Z1 + 1.2), m['laton'], eje='Z')
    K.cilindro('lampara_pantalla', 0.6, 0.95, (x, y, Z1 + 2.62), m['tela'], eje='Z', r2=0.42, lados=72, tapas=False)
    K.punto('bombilla', (x, y, Z1 + 2.55), 150, (1.0, 0.68, 0.38), 0.12)


def detalles(m):
    # un sujetalibros de latón tras la novena caja (la placa de pie y el pie hacia fuera); el resto del hueco, libre:
    # la figurita de conos de antes parecía hecha con primitivas
    x = CAJAS_X[-1] + K.D / 2 + 0.004
    K.bloque('sujeta_placa', (0.03, 1.2, 1.45), (x + 0.015, 0.82, Z0 + T + 0.725), m['laton'], bisel=0.008)
    K.bloque('sujeta_pie', (0.42, 1.2, 0.025), (x + 0.21, 0.82, Z0 + T + 0.0125), m['laton'], bisel=0.006)


def escena():
    K.limpiar()
    m = {
        'nogal': K.madera('nogal'), 'nogal_v': K.madera('nogal_v', eje='Z'), 'nogal_nicho': K.madera('nogal_nicho'),
        'nogal_nicho_v': K.madera('nogal_nicho_v', eje='Z'), 'yeso': K.yeso('yeso', '#a89684'),
        'suelo': K.yeso('alfombra', '#3a2f27'),
        'laton': K.material('laton', '#b08d57', 0.35), 'oscuro': K.material('oscuro', '#140f0b', 0.9),
        'grafito': K.material('grafito', '#2b2a2c', 0.5), 'grafito2': K.material('grafito2', '#3d3b3c', 0.4),
        'negro': K.material('negro', '#0b0b0c', 0.6), 'blanco': K.material('blanco', '#ffffff', 0.6),
        'cristal': K.material('cristal', '#0c0d10', 0.15), 'luz_led': K.material('led', '#ffffff', 0.5),
        'tela': K.material('tela', '#efe3cc', 0.95),
        'plastico': K.material('plastico', '#25262c', 0.4), 'lomo': K.material('lomo', '#ffffff', 0.5),
    }
    # la pantalla de la lámpara deja pasar algo de luz, como la tela
    p = m['tela'].node_tree.nodes['Principled BSDF']; p.inputs['Transmission Weight'].default_value = 0.5
    # pared y suelo grandes: ningún encuadre (tampoco el de una tableta en vertical) llega a sus bordes
    K.bloque('pared', (30, 0.1, 17), (0, 2.55, 8.25), m['yeso'], bisel=0)
    K.bloque('suelo', (30, 30, 0.1), (0, -12.5, -0.05), m['suelo'], bisel=0)
    mueble(m); nicho(m); consola(m); tele(m); lampara(m); detalles(m)
    for i, x in enumerate(CAJAS_X):
        K.caja_de_canto(f'canto_{i}', m, (x, CAJAS_Y, CAJAS_Z))
    # de noche: la última luz de una ventana fuera de cuadro a la izquierda, un relleno frío muy bajo, la lámpara
    # y una tira de luz cálida bajo el techo de cada hueco (lo que hace brillar los lomos)
    K.area('ventana', (-8.0, -5.0, 6.5), (-0.5, 1.0, 2.5), 1100, (0.92, 0.94, 1.0), 4.0)
    K.area('relleno', (7.0, -6.5, 3.0), (0, 1.0, 2.0), 220, (0.78, 0.86, 1.0), 6.0)
    K.area('tira_cajas', ((X0 + T + DIV[0]) / 2, 0.22, Z1 - T - 0.01), ((X0 + T + DIV[0]) / 2, 0.5, 0), 38, (1.0, 0.8, 0.58), DIV[0] - X0 - T - 0.1, 0.05)
    K.area('tira_consola', ((DIV[1] + X1 - T) / 2, 0.22, Z1 - T - 0.01), ((DIV[1] + X1 - T) / 2, 0.5, 0), 26, (1.0, 0.8, 0.58), X1 - T - DIV[1] - 0.1, 0.05)
    K.mundo('#3a3530', 0.08)


def estudio():
    """La caja, el manual y el disco, sueltos en el estudio (lejos de la escena, que se esconde)."""
    m = {k: K.material(k, '#ffffff', 0.5) for k in ('portada', 'dorso', 'lomo', 'disco', 'manual', 'pagina_i', 'pagina_d')}
    m.update({'plastico': K.material('plastico_e', '#25262c', 0.4), 'eje': K.material('eje', '#3a3b42', 0.4),
              'plata': K.material('plata', '#c9ccd2', 0.25), 'papel': K.material('papel', '#efe9dc', 0.8)})
    caja = K.vacio('caja', (0, -40, 5))
    tapa, disco, manual = K.caja_entera(m, caja)
    tapa.rotation_euler = (0, 0, R(-180))
    # el manual y el disco van fuera de la caja para hornearlos solos, cada uno en su sitio del estudio
    sitio = bpy.data.objects['manual_sitio']
    manual.parent = None; manual.location = (6, -40, 5); manual.rotation_euler = (0, 0, 0)
    bpy.data.objects['manual_hoja'].rotation_euler = (0, 0, R(-180))
    disco.parent = None; disco.location = (-6, -40, 5)
    return caja, manual, disco, sitio


def vista():
    """Prueba rápida antes de hornear: una foto de la escena desde donde la verá la portada."""
    escena()
    caja, manual, disco, sitio = estudio()
    caja.location = (CAJAS_X[2], CAJAS_Y, CAJAS_Z); caja.rotation_euler = (0, 0, R(90)); bpy.data.objects['tapa'].rotation_euler = (0, 0, 0)
    bpy.data.objects['canto_2_cuerpo'].hide_render = True; bpy.data.objects['canto_2_lomo'].hide_render = True
    manual.location = (CAJAS_X[2], -1.5, 2.0)
    K.ajustes(1440, 900, MUESTRAS)
    K.camara((-0.6, -16.0, 3.6), (-0.6, 1.0, 2.6), 50)
    bpy.context.scene.render.filepath = os.path.join(DESTINO, 'vista.png')
    bpy.ops.render.render(write_still=True)


def principal():
    if 'vista' in RESTO:
        return vista()
    escena()
    caja, manual, disco, sitio = estudio()
    K.preparar()
    K.ajustes(64, 64, MUESTRAS)
    horno = K.Horno(DESTINO)
    todo = K.mallas()
    nombres = lambda *pre: [o for o in todo if o.name.startswith(pre)]  # noqa: E731
    g = {
        'mueble': nombres('mueble_', 'cajon_'), 'nicho': nombres('nicho_'), 'pared': nombres('pared'), 'suelo': nombres('suelo'),
        'objetos': nombres('consola_', 'tele_', 'lampara_', 'sujeta_', 'figura'), 'lomos': nombres('canto_'),
        'caja': K.mallas(caja), 'manual': K.mallas(manual), 'disco': K.mallas(disco),
    }
    for clave, objs in g.items():
        K.desplegar(objs, 0.004 if clave in ('caja', 'manual', 'disco', 'lomos', 'objetos') else 0.008)
    estudio_objs = g['caja'] + g['manual'] + g['disco']
    for o in estudio_objs:
        o.hide_render = True
    horno.hornear(g['mueble'], 'mueble', 2048, color=True)
    horno.hornear(g['objetos'], 'objetos', 2048, color=True)
    horno.hornear(g['lomos'], 'lomos', 2048, color=True)
    horno.hornear(g['pared'], 'pared', 2048, color=True, sin_perdida=True, suave=3.2)
    horno.hornear(g['suelo'], 'suelo', 2048, color=True, publicar=1024, suave=2.4)
    horno.hornear(g['nicho'], 'nicho_con', 1024, color=True, pareja='nicho')
    for i in range(9):
        cuerpo = [o for o in g['lomos'] if o.name.startswith(f'canto_{i}_')]
        for o in cuerpo:
            o.hide_render = True
        horno.hornear(g['nicho'], f'nicho_sin_{i}', 1024, color=True, pareja='nicho')
        for o in cuerpo:
            o.hide_render = False
    # el estudio: solo lo que viaja, con la cúpula
    for o in bpy.context.scene.objects:
        if o.type in ('MESH', 'LIGHT'):
            o.hide_render = o not in estudio_objs
    bpy.context.scene.world = K.mundo_estudio()
    horno.hornear(g['caja'], 'caja', 2048, color=True)
    horno.hornear(g['manual'], 'manual', 2048, color=True)
    horno.hornear(g['disco'], 'disco', 1024, color=True)
    # se exporta todo en su sitio de la escena: la caja metida en la balda (de canto, en el hueco de la primera),
    # cerrada, con el manual y el disco dentro
    for o in bpy.context.scene.objects:
        o.hide_render = False
    caja.location = (CAJAS_X[0], CAJAS_Y, CAJAS_Z); caja.rotation_euler = (0, 0, R(90))
    bpy.data.objects['tapa'].rotation_euler = (0, 0, 0)
    bpy.data.objects['manual_hoja'].rotation_euler = (0, 0, 0)
    manual.parent = sitio; manual.location = (0, 0, 0); manual.rotation_euler = (0, 0, 0)
    disco.parent = caja; disco.location = (K.GRUESO * 0.3, K.D / 2 - K.GRUESO - 0.012, 0); disco.rotation_euler = (0, 0, 0)
    bpy.ops.wm.save_as_mainfile(filepath=os.path.join(DESTINO, 'horneado.blend'))
    horno.exportar({'cajas_x': CAJAS_X, 'cajas_y': CAJAS_Y, 'cajas_z': CAJAS_Z, 'consola': CONSOLA, 'ranura': RANURA, 'tele': TELE})


principal()
