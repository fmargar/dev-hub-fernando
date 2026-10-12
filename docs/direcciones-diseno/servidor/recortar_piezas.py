"""Recorta las piezas de una vista explosionada con SAM 2 (una caja por pieza).
Cada píxel va a la pieza con más confianza, así las capas no se pisan y al juntarlas
en su sitio reconstruyen la imagen original."""
import json, sys
import numpy as np, torch
from PIL import Image
from sam2.sam2_image_predictor import SAM2ImagePredictor

src, out, cajas_json = sys.argv[1], sys.argv[2], sys.argv[3]
cajas = json.load(open(cajas_json))
torch.set_num_threads(6)
img = Image.open(src).convert("RGB")
arr = np.array(img)
pred = SAM2ImagePredictor.from_pretrained("facebook/sam2.1-hiera-base-plus", device="cpu")
with torch.inference_mode():
    pred.set_image(arr)
    logits = []
    for c in cajas:
        m, s, _ = pred.predict(box=np.array(c["caja"]), multimask_output=False, return_logits=True)
        logits.append(m[0]); print(c["nombre"], float(s[0]), flush=True)
L = np.stack(logits)                      # piezas x alto x ancho
dueno = L.argmax(0)
fondo = L.max(0) < 0
lum = arr.max(axis=2).astype(np.float32)
meta = []
for i, c in enumerate(cajas):
    a = ((dueno == i) & ~fondo).astype(np.float32)
    # borde suave: en las zonas casi negras manda la luminancia
    a = np.minimum(a, np.clip(lum / 10.0, 0, 1) * 0.0 + 1) * a
    ys, xs = np.where(a > 0)
    y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
    rgba = np.dstack([arr, (a * 255).astype(np.uint8)])[y0:y1, x0:x1]
    Image.fromarray(rgba, "RGBA").save(f"{out}/{i+1:02d}-{c['nombre']}.png", optimize=True)
    meta.append({"nombre": c["nombre"], "x": int(x0), "y": int(y0), "w": int(x1 - x0), "h": int(y1 - y0)})
json.dump({"ancho": arr.shape[1], "alto": arr.shape[0], "piezas": meta}, open(f"{out}/piezas.json", "w"), indent=1)
print(json.dumps(meta))
