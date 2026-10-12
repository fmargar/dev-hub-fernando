"""Genera j-expendedora.html desde los mismos datos que las cartas (cartas/datos.json)."""
import json, html, pathlib

AQUI = pathlib.Path(__file__).parent
D = json.loads((AQUI.parent / "cartas" / "datos.json").read_text())
e = html.escape
# El orden de los envases en la hoja generada: n.º de envase por proyecto
ENVASE = {"adivinadle": 1, "wardux": 2, "marbella": 3, "erp": 4, "agentes": 5, "calculo": 6, "vados": 7, "servidor": 8}
cartas = sorted(D["cartas"], key=lambda c: ENVASE[c["id"]])

productos = "\n".join(
    f'''            <li class="producto" data-id="{c["id"]}"><button type="button" aria-label="Sacar {e(c["nombre"])}"><img src="expendedora/envase-{ENVASE[c["id"]]}.webp" alt="Envase de {e(c["nombre"])}" width="240" height="320"><span class="etq">{e(c["nombre"])}</span></button></li>'''
    for c in cartas)
teclas = "\n".join(f'            <button class="tecla" type="button" data-elegir="{c["id"]}" aria-pressed="false">{e(c["nombre"])}</button>' for c in cartas)
datos = {"cartas": {c["id"]: {**c, "tipoNombre": D["tipos"][c["tipo"]]["nombre"]} for c in cartas}}
salida = ((AQUI / "plantilla.html").read_text()
          .replace("{{PRODUCTOS}}", productos).replace("{{TECLAS}}", teclas)
          .replace("{{DATOS}}", json.dumps(datos, ensure_ascii=False)))
(AQUI.parent / "j-expendedora.html").write_text(salida)
print("j-expendedora.html generado")
