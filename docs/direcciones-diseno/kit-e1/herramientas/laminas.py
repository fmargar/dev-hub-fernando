"""Pasa los renders de Blender a lo que sirve la web (con el Python del sistema: el de Blender no trae PIL).

  python3 laminas.py <carpeta de trabajo> <kit-e1/arte>

  <trabajo>/retratos/p0..p11.png  →  arte/personajes.webp  (el elenco de Adivinadle en 4 × 3, 232 × 248 cada uno)
  <trabajo>/portadas/<id>.png     →  arte/portadas/<id>.webp (864 × 1216)
  arte/diorama.webp               →  arte/portadas/adivinadle.webp (la de Adivinadle ya venía hecha)
"""
import shutil
import sys
from pathlib import Path

from PIL import Image

trabajo, arte = Path(sys.argv[1]), Path(sys.argv[2])
(arte / 'portadas').mkdir(parents=True, exist_ok=True)

CW, CH = 232, 248
hoja = Image.new('RGBA', (CW * 4, CH * 3), (0, 0, 0, 0))
for i in range(12):
    p = Image.open(trabajo / 'retratos' / f'p{i}.png').convert('RGBA').resize((CW, CH), Image.LANCZOS)
    hoja.alpha_composite(p, ((i % 4) * CW, (i // 4) * CH))
hoja.save(arte / 'personajes.webp', quality=90, method=6)
print('personajes.webp', hoja.size)

for png in sorted((trabajo / 'portadas').glob('*.png')):
    im = Image.open(png).convert('RGB')
    if im.size != (864, 1216):
        im = im.resize((864, 1216), Image.LANCZOS)
    im.save(arte / 'portadas' / f'{png.stem}.webp', quality=86, method=6)
    print(png.stem)
shutil.copy(arte / 'diorama.webp', arte / 'portadas' / 'adivinadle.webp')
