"""Genera l-acuario.html y m-jardin.html: los proyectos salen de cartas/datos.json y la
experiencia y las habilidades de perfil.json; cada plantilla solo pone la escena."""
import json, pathlib
AQUI = pathlib.Path(__file__).parent
D = json.loads((AQUI.parent / "cartas" / "datos.json").read_text())
P = json.loads((AQUI / "perfil.json").read_text())
proyectos = [{**{k: c[k] for k in ("id", "nombre", "color", "efecto", "stats", "preguntas", "dato", "datoTxt")},
              "web": c.get("web"), "n": c["n"], "tipo": D["tipos"][c["tipo"]]["nombre"],
              "foil": D["tipos"][c["tipo"]]["foil"], "simbolo": D["tipos"][c["tipo"]]["simbolo"]} for c in sorted(D["cartas"], key=lambda c: c["n"])]
datos = json.dumps({"proyectos": proyectos, **P}, ensure_ascii=False)
for plantilla, salida in (("acuario.html", "l-acuario.html"), ("jardin.html", "m-jardin.html"), ("pesca.html", "n-pesca.html")):
    f = AQUI / plantilla
    if f.exists():
        (AQUI.parent / salida).write_text(f.read_text().replace("{{DATOS}}", datos))
        print(salida, "generado")
