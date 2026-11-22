#!/usr/bin/env python3
"""Prepara el arte de «La estantería» a partir de los PNG de arte/originales:
- carátulas (k1…k9) recortadas a la proporción de la caja, en WebP;
- un disco por proyecto: el arte de su carátula impreso sobre la cara del disco en blanco;
- la caja abierta, el librillo, la tele, la consola y la madera, recortados y al tamaño de uso.
Deja las medidas que necesita la página (pantalla de la tele, ranura de la consola…) en js/medidas.js.

Uso: python3 herramientas/arte.py   (desde la carpeta estanteria)"""
import json
from pathlib import Path
from PIL import Image
import numpy as np

RAIZ = Path(__file__).resolve().parent.parent
ORIG = RAIZ / 'arte' / 'originales'
ARTE = RAIZ / 'arte'
IDS = ['adivinadle', 'wardux', 'calculo', 'agentes', 'erp', 'servidor', 'marbella', 'vados', 'vision']
PROPORCION = 1.26  # alto / ancho de la carátula, la de una caja de juego
# dónde cae el motivo en cada carátula (altura relativa del centro del recorte del disco)
FOCO = {'adivinadle': .4, 'wardux': .45, 'calculo': .5, 'agentes': .45, 'erp': .55, 'servidor': .42, 'marbella': .5, 'vados': .55, 'vision': .45}
medidas = {}


def guardar(im, nombre, ancho, q=80):
    if im.width > ancho:
        im = im.resize((ancho, round(im.height * ancho / im.width)), Image.LANCZOS)
    im.save(ARTE / nombre, 'WEBP', quality=q, alpha_quality=88, method=6)
    return im


def recorte(im, umbral=40):
    a = np.array(im)[:, :, 3]
    ys, xs = np.where(a > umbral)
    im = im.crop((xs.min(), ys.min(), xs.max() + 1, ys.max() + 1))
    px = np.array(im)
    px[:, :, 3][px[:, :, 3] < 16] = 0
    return Image.fromarray(px)


def caratulas():
    for i, id_ in enumerate(IDS, 1):
        f = ORIG / f'k{i}.png'
        if not f.exists():
            print('falta', f.name); continue
        im = Image.open(f).convert('RGB')
        alto = round(im.width * PROPORCION)
        y0 = round((im.height - alto) * .4)
        k = im.crop((0, y0, im.width, y0 + alto))
        guardar(k, f'k/{id_}.webp', 720, 78)
        guardar(k, f'k/mini-{id_}.webp', 128, 72)


def discos():
    f = ORIG / 'disco.png'
    if not f.exists():
        print('falta disco.png'); return
    d = recorte(Image.open(f).convert('RGBA'))
    lado = min(d.size)
    d = d.resize((lado, lado), Image.LANCZOS)
    px = np.array(d).astype(float)
    c = (lado - 1) / 2
    yy, xx = np.mgrid[:lado, :lado]
    r = np.hypot(xx - c, yy - c) / (lado / 2)
    # la cara impresa empieza donde acaba el anillo translúcido del centro: medido sobre el original, el brillo
    # sube de golpe de 212 a 228 en r = 0,30 (el alfa no sirve: el anillo es casi opaco en el PNG)
    r_in = .315
    medidas['disco'] = {'interior': round(float(r_in), 3)}
    luz = (px[:, :, :3].mean(2) / 255) ** .6
    borde = np.clip((r - r_in) / .012, 0, 1) * np.clip((.985 - r) / .012, 0, 1)
    for i, id_ in enumerate(IDS, 1):
        fk = ORIG / f'k{i}.png'
        if not fk.exists():
            continue
        k = Image.open(fk).convert('RGB')
        cy = round(k.height * FOCO[id_])
        y0 = max(0, min(k.height - k.width, cy - k.width // 2))
        arte = np.array(k.crop((0, y0, k.width, y0 + k.width)).resize((lado, lado), Image.LANCZOS)).astype(float)
        out = px.copy()
        mezcla = borde[:, :, None]
        out[:, :, :3] = px[:, :, :3] * (1 - mezcla) + arte * luz[:, :, None] * mezcla
        guardar(Image.fromarray(out.round().clip(0, 255).astype('uint8')), f'd/{id_}.webp', 560, 80)


def caja():
    f = ORIG / 'caja-abierta.png'
    if not f.exists():
        print('falta caja-abierta.png'); return
    im = recorte(Image.open(f).convert('RGBA'))
    a = np.array(im)
    # el lomo: la columna más oscura cerca del centro
    gris = a[:, :, :3].mean(2)
    medio = im.width // 2
    banda = range(medio - im.width // 12, medio + im.width // 12)
    lomo = min(banda, key=lambda x: gris[im.height // 4: 3 * im.height // 4, x].mean())
    medidas['caja'] = {'lomo': round(lomo / im.width, 4), 'r': round(im.height / im.width, 4)}
    guardar(im, 'caja-abierta.webp', 1400, 80)


def suelta(nombre, ancho, q=80, clave=None):
    f = ORIG / f'{nombre}.png'
    if not f.exists():
        print('falta', f.name); return None
    im = Image.open(f).convert('RGBA')
    if np.array(im)[:, :, 3].min() < 250:
        im = recorte(im)
    medidas[clave or nombre] = {'r': round(im.height / im.width, 4)}
    return guardar(im, f'{nombre}.webp', ancho, q)


def tele():
    im = suelta('tele', 1000)
    if im is None:
        return
    a = np.array(im).astype(float)
    # la pantalla: la mayor región casi negra y opaca
    negro = (a[:, :, :3].max(2) < 28) & (a[:, :, 3] > 250)
    filas, cols = negro.mean(1), negro.mean(0)
    ys = np.where(filas > .45)[0]; xs = np.where(cols > .45)[0]
    medidas['tele'].update({'x': round(xs.min() / im.width, 4), 'y': round(ys.min() / im.height, 4),
                            'w': round((xs.max() - xs.min() + 1) / im.width, 4), 'h': round((ys.max() - ys.min() + 1) / im.height, 4)})


def madera():
    f = ORIG / 'madera.png'
    if not f.exists():
        print('falta madera.png'); return
    im = Image.open(f).convert('RGB')
    guardar(im, 'madera.webp', 1200, 70)


if __name__ == '__main__':
    caratulas(); discos(); tele(); suelta('consola', 900); madera()
    (RAIZ / 'js' / 'medidas.js').write_text(
        '// Generado por herramientas/arte.py: proporciones del arte y dónde caen la pantalla y el disco.\n'
        f'export const MEDIDAS = {json.dumps(medidas, indent=2)};\n')
    print(json.dumps(medidas))
