#!/usr/bin/env python3
"""Prepara el arte del showcase: de los PNG originales (arte/originales) saca, para cada pieza,
la imagen de mesa en WebP al doble de su tamaño de uso, la versión grande para el interior y dos
sombras ya desenfocadas (contacto y ambiente). Deja las medidas en js/medidas.js.

Uso: python3 herramientas/arte.py   (desde la carpeta showcase)"""
import json
from pathlib import Path
from PIL import Image, ImageFilter
import numpy as np

RAIZ = Path(__file__).resolve().parent.parent
ORIG = RAIZ / 'arte' / 'originales'
# pieza: (ancho de uso en la mesa a 1440, ancho de la versión grande o None)
PIEZAS = {
    'caja-tapa': (310, 1500), 'caja-base': (284, 1700), 'periodico': (215, 1100),
    'calculadora': (190, 1000), 'bandejas': (330, 1500), 'portapapeles': (165, 1000),
    'sello': (92, 420), 'tampon': (150, 640), 'servidor': (185, 1000),
    'postal': (170, 900), 'placa': (118, 700), 'lamina': (165, 900),
}
MARGEN_SOMBRA = 0.16  # sobre el lado mayor, a cada lado


def recorte(im):
    """Quita los residuos de alfa tenue del borde y recorta a la pieza."""
    a = np.array(im)[:, :, 3]
    ys, xs = np.where(a > 40)
    caja = (max(xs.min() - 3, 0), max(ys.min() - 3, 0), min(xs.max() + 4, im.width), min(ys.max() + 4, im.height))
    im = im.crop(caja)
    px = np.array(im)
    px[:, :, 3][px[:, :, 3] < 14] = 0
    return Image.fromarray(px)


def sombra(im, radio, destino):
    lado = max(im.size)
    m = int(lado * MARGEN_SOMBRA)
    lienzo = Image.new('L', (im.width + 2 * m, im.height + 2 * m), 0)
    lienzo.paste(im.getchannel('A'), (m, m))
    esc = 220 / max(lienzo.size)
    peq = lienzo.resize((max(1, round(lienzo.width * esc)), max(1, round(lienzo.height * esc))), Image.LANCZOS)
    peq = peq.filter(ImageFilter.GaussianBlur(radio * 220 / 100))
    negro = Image.new('RGBA', peq.size, (24, 32, 26, 0))
    negro.putalpha(peq)
    negro.save(destino, 'WEBP', quality=60, alpha_quality=70, method=6)


def main():
    medidas = {}
    for nombre, (uso, grande) in PIEZAS.items():
        f = ORIG / f'{nombre}.png'
        if not f.exists():
            print('falta', f.name)
            continue
        im = recorte(Image.open(f).convert('RGBA'))
        w = min(uso * 2, im.width)
        mesa = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
        mesa.save(RAIZ / 'arte' / f'{nombre}.webp', 'WEBP', quality=80, alpha_quality=90, method=6)
        if grande:
            wg = min(grande, im.width)
            im.resize((wg, round(im.height * wg / im.width)), Image.LANCZOS).save(
                RAIZ / 'arte' / 'g' / f'{nombre}.webp', 'WEBP', quality=84, alpha_quality=92, method=6)
        sombra(im, 1.6, RAIZ / 'arte' / 's' / f'{nombre}-c.webp')
        sombra(im, 5.5, RAIZ / 'arte' / 's' / f'{nombre}.webp')
        medidas[nombre] = {'w': uso, 'r': round(im.height / im.width, 4)}
        print(nombre, im.size, '->', mesa.size)
    # lámina de personajes: doce teselas iguales en una sola imagen
    f = ORIG / 'personajes.png'
    if f.exists():
        im = Image.open(f).convert('RGB')
        tw, th = im.width / 4, im.height / 3
        T = (232, 248)
        hoja = Image.new('RGB', (T[0] * 4, T[1] * 3))
        for i in range(12):
            c, r = i % 4, i // 4
            x0, y0 = c * tw + 8, r * th + 6
            lado = tw - 16
            t = im.crop((round(x0), round(y0), round(x0 + lado), round(y0 + lado * T[1] / T[0])))
            hoja.paste(t.resize(T, Image.LANCZOS), (c * T[0], r * T[1]))
        hoja.save(RAIZ / 'arte' / 'g' / 'personajes.webp', 'WEBP', quality=82, method=6)
        print('personajes', hoja.size)
    (RAIZ / 'js' / 'medidas.js').write_text(
        '// Generado por herramientas/arte.py: ancho de uso en la mesa (a 1440) y proporción alto/ancho.\n'
        f'export const MEDIDAS = {json.dumps(medidas, indent=2)};\n'
        f'export const MARGEN_SOMBRA = {MARGEN_SOMBRA};\n')


if __name__ == '__main__':
    main()
