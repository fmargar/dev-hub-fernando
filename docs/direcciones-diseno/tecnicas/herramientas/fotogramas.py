"""Pasa los fotogramas PNG de Blender a WebP para la web (técnica A).
Uso: python3 fotogramas.py <carpeta de PNG> <carpeta de salida> [calidad]"""
import sys
from pathlib import Path

from PIL import Image

origen, destino = Path(sys.argv[1]), Path(sys.argv[2])
calidad = int(sys.argv[3]) if len(sys.argv) > 3 else 74
destino.mkdir(parents=True, exist_ok=True)
total = 0
for png in sorted(origen.glob('f_*.png')):
    salida = destino / (png.stem + '.webp')
    Image.open(png).convert('RGB').save(salida, 'WEBP', quality=calidad, method=6)
    total += salida.stat().st_size
print(f'{len(list(destino.glob("*.webp")))} fotogramas, {total / 1024:.0f} KB en total')
