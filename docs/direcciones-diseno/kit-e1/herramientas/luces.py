"""Pasa la luz horneada (los .npy lineales que deja kit.Horno) a texturas WebP para la web, y copia la escena.

  python3 luces.py <carpeta del horneado> <carpeta luz/ de la maqueta>

Lee `horno.json`: de cada textura, a qué tamaño se publica, si va sin pérdida (los degradados grandes, como la
pared, que muy ampliados enseñarían los bloques de la compresión), si se le baja el contraste y con qué otras
comparte escala (`pareja`: las variantes con y sin una pieza se mezclan en la web y no pueden saltar) y qué brillo
hace de blanco (`percentil`, 99,7 por omisión: más bajo si unos pocos puntos muy calientes oscurecen todo lo demás).

Cada textura se normaliza para aprovechar los 8 bits (en sRGB, que da más detalle en las sombras) y su escala va a
`luz.json`, para que la web recupere la luz real. Se suaviza para quitar el grano del horneado (`suave`, en píxeles: más en superficies lisas como la pared).
"""
import json
import os
import shutil
import sys

import numpy as np
from PIL import Image, ImageFilter

ENT, SAL = sys.argv[1:3]
os.makedirs(SAL, exist_ok=True)
LUM = np.array([0.2126, 0.7152, 0.0722], dtype=np.float32)
horno = json.load(open(os.path.join(ENT, 'horno.json')))
texturas = horno['texturas']


def a_srgb(x):
    return np.where(x <= 0.0031308, x * 12.92, 1.055 * np.power(np.clip(x, 0, None), 1 / 2.4) - 0.055)


datos = {n: np.load(os.path.join(ENT, n + '.npy')).astype(np.float32)[..., :3] for n in texturas}
grupos = {}
for n, t in texturas.items():
    grupos.setdefault(t.get('pareja') or n, []).append(n)
ref = {}
for g, nombres in grupos.items():
    lum = np.concatenate([(datos[n] @ LUM).ravel() for n in nombres])
    vivo = lum[lum > 1e-4]
    r = float(np.percentile(vivo, min(texturas[n].get('percentil', 99.7) for n in nombres))) if vivo.size else 1.0
    for n in nombres:
        ref[n] = r

escalas = {}
for n, t in texturas.items():
    # por encima del tope se escala el píxel entero, no cada canal: recortar solo el rojo de una luz cálida la
    # volvía amarillo verdosa (el halo de la lámpara en la pared)
    x = np.clip(datos[n] / ref[n] * 0.95, 0, None)
    x = x / np.maximum(x.max(axis=-1, keepdims=True), 1.0)
    img = Image.fromarray((a_srgb(x) * 255 + 0.5).astype(np.uint8)).filter(ImageFilter.GaussianBlur(t.get('suave', 1.2)))
    if t.get('contraste', 1.0) != 1.0:
        a = np.asarray(img).astype(np.float32); media = a.mean(axis=(0, 1))
        img = Image.fromarray(np.clip(media + (a - media) * t['contraste'] + 0.5, 0, 255).astype(np.uint8))
    if img.width != t['tam']:
        img = img.resize((t['tam'], t['tam']), Image.LANCZOS)
    ruta = os.path.join(SAL, n + '.webp')
    if t.get('sin_perdida'):
        img.save(ruta, 'WEBP', lossless=True, quality=100, method=6)
    else:
        img.save(ruta, 'WEBP', quality=90, method=6)
    escalas[n] = round(ref[n] / 0.95, 4)
    print(f'{n:14s} {img.size[0]:5d}  escala {escalas[n]:7.3f}  {os.path.getsize(ruta) // 1024:5d} KB')
json.dump(escalas, open(os.path.join(SAL, 'luz.json'), 'w'), indent=1)
shutil.copy(os.path.join(ENT, 'escena.glb'), os.path.join(SAL, 'escena.glb'))
extra = {k: v for k, v in horno.items() if k != 'texturas'}
json.dump(extra, open(os.path.join(SAL, 'escena.json'), 'w'), indent=1)
print('escena.glb', os.path.getsize(os.path.join(SAL, 'escena.glb')) // 1024, 'KB')
