"""Pasa la luz horneada por hornear.py (ficheros .npy, lineales) a texturas WebP para la web.

  python3 luces.py <carpeta del horneado> <carpeta de salida> <e1|e2>

Cada textura se normaliza para aprovechar los 8 bits (en sRGB, que da más detalle en las sombras) y su escala
se apunta en luz.json para que la web recupere la luz real. La pareja con caja / sin caja comparte escala para
que la mezcla no salte. En e2 la luz se posteriza en tres tonos con el borde suave y las sombras un poco
lilas: el sombreado de dibujo animado sale del mismo horneado.
"""
import json
import os
import sys

import numpy as np
from PIL import Image, ImageFilter

ENT, SAL, GRADO = sys.argv[1:4]
os.makedirs(SAL, exist_ok=True)
TAMANOS = {'caja': 2048, 'vecinos': 1024, 'pared_con': 1024, 'pared_sin': 1024}           # a lo que se publica; el resto se queda como se horneó
LUM = np.array([0.2126, 0.7152, 0.0722], dtype=np.float32)


def a_srgb(x):
    return np.where(x <= 0.0031308, x * 12.92, 1.055 * np.power(np.clip(x, 0, None), 1 / 2.4) - 0.055)


def de_srgb(x):
    return np.where(x <= 0.04045, x / 12.92, np.power((x + 0.055) / 1.055, 2.4))


def suave(a, b, x):
    t = np.clip((x - a) / (b - a), 0, 1)
    return t * t * (3 - 2 * t)


def posterizar(rgb, fondo=0.56):
    """Tres tonos (sombra, medio, luz) según la luminancia, con un borde de un par de píxeles. En la pared la
    sombra es más clara: es grande y, oscura, ensucia el pastel."""
    lum = rgb @ LUM
    tono = fondo + (0.82 - fondo) * suave(0.26, 0.31, lum) + 0.18 * suave(0.62, 0.67, lum)
    lila = np.array([0.80, 0.78, 1.0], dtype=np.float32)
    mezcla = ((tono - fondo) / (1 - fondo))[..., None]
    return tono[..., None] * (lila * (1 - mezcla) + mezcla)


ficheros = sorted(f[:-4] for f in os.listdir(ENT) if f.endswith('.npy'))
datos = {n: np.load(os.path.join(ENT, n + '.npy')).astype(np.float32)[..., :3] for n in ficheros}
escalas = {}
for n, rgb in datos.items():
    pareja = n.rsplit('_', 1)[0] if n.endswith(('_con', '_sin')) else None
    juntos = [datos[f'{pareja}_con'], datos[f'{pareja}_sin']] if pareja else [rgb]
    lum = np.concatenate([(x @ LUM).ravel() for x in juntos])
    ref = float(np.percentile(lum[lum > 1e-4], 99.7)) if (lum > 1e-4).any() else 1.0
    x = np.clip(rgb / ref * 0.95, 0, 1)
    img = Image.fromarray((a_srgb(x) * 255 + 0.5).astype(np.uint8))
    img = img.filter(ImageFilter.GaussianBlur(1.2 if GRADO == 'e1' else 2.0))     # quita el grano del horneado
    escala = ref / 0.95
    if GRADO == 'e2':
        lin = de_srgb(np.asarray(img).astype(np.float32) / 255)
        img = Image.fromarray((a_srgb(np.clip(posterizar(lin, 0.7 if n.startswith('pared') else 0.56), 0, 1)) * 255 + 0.5).astype(np.uint8))
        escala = 1.0
    if GRADO == 'e1' and n.startswith('balda'):
        # la veta del nogal sale muy marcada y compite con las cajas: se suaviza el contraste hacia su tono medio
        a = np.asarray(img).astype(np.float32)
        a = a.mean(axis=(0, 1)) + (a - a.mean(axis=(0, 1))) * 0.6
        img = Image.fromarray(np.clip(a + 0.5, 0, 255).astype(np.uint8))
    tam = TAMANOS.get(n)
    if tam and img.width != tam:
        img = img.resize((tam, tam), Image.LANCZOS)
    # la pared es un degradado grande que se ve muy ampliado: con pérdida salen bloques de 16 píxeles, así que va
    # sin pérdida; el resto aguanta bien la compresión a calidad alta
    if n.startswith('pared'):
        img.save(os.path.join(SAL, n + '.webp'), 'WEBP', lossless=True, quality=100, method=6)
    else:
        img.save(os.path.join(SAL, n + '.webp'), 'WEBP', quality=92, method=6)
    escalas[n] = round(escala, 4)
    print(n, img.size, round(escala, 3), os.path.getsize(os.path.join(SAL, n + '.webp')) // 1024, 'KB')
json.dump(escalas, open(os.path.join(SAL, 'luz.json'), 'w'), indent=1)
