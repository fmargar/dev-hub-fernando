"""Prepara las criaturas pintadas por ChatGPT: recorta el negro sobrante alrededor (con margen
para que la deformación no se salga) y las pasa a WebP a un tamaño razonable."""
import pathlib, sys
from PIL import Image
AQUI = pathlib.Path(__file__).parent
origen = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else AQUI / "originales" / "criaturas")
salida = AQUI / "criaturas"; salida.mkdir(exist_ok=True)
for f in sorted(origen.glob("*.png")):
    im = Image.open(f).convert("RGB")
    mascara = im.convert("L").point(lambda v: 255 if v > 18 else 0)
    x0, y0, x1, y1 = mascara.getbbox()
    m = int(max(x1 - x0, y1 - y0) * .06)
    im = im.crop((max(0, x0 - m), max(0, y0 - m), min(im.width, x1 + m), min(im.height, y1 + m)))
    im.thumbnail((720, 720))
    # El negro pasa a ser transparencia: la opacidad de cada píxel es su canal más brillante y el
    # color se «despremultiplica» para que, al componer sobre el agua, brille como luz sumada.
    import numpy as np
    a = np.asarray(im).astype(np.float32) / 255
    alfa = a.max(axis=2, keepdims=True)
    color = np.where(alfa > 0, a / np.maximum(alfa, 1e-4), 0)
    rgba = np.concatenate([color, alfa], axis=2)
    Image.fromarray((rgba * 255).round().astype(np.uint8), "RGBA").save(salida / (f.stem + ".webp"), "WEBP", quality=88)
    print(f.stem, im.size)
