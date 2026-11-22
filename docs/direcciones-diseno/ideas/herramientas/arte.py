#!/usr/bin/env python3
"""Pasa las imágenes de concepto (PNG 1536×1024) a WebP: tarjeta de 720 px y ficha de 1536 px.
Uso: python3 herramientas/arte.py <carpeta con los PNG>   (desde la carpeta ideas)"""
import sys
from pathlib import Path
from PIL import Image

RAIZ = Path(__file__).resolve().parent.parent
for f in sorted(Path(sys.argv[1]).glob('*.png')):
    im = Image.open(f).convert('RGB')
    im.resize((720, round(im.height * 720 / im.width)), Image.LANCZOS).save(RAIZ / 'arte' / f'{f.stem}.webp', 'WEBP', quality=78, method=6)
    im.save(RAIZ / 'arte' / 'g' / f'{f.stem}.webp', 'WEBP', quality=80, method=6)
    print(f.stem)
