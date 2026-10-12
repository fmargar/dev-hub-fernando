"""Genera o-tarjetas.html (portada), o-caso.html (caso de estudio) y p-pesca.html (la pesca v2, plantilla en vivos/) desde proyectos.json y la
experiencia y habilidades de vivos/perfil.json."""
import json, pathlib
AQUI = pathlib.Path(__file__).parent
datos = {**json.loads((AQUI / "proyectos.json").read_text()), **json.loads((AQUI.parent / "vivos" / "perfil.json").read_text())}
for plantilla, salida in (("portada.html", "o-tarjetas.html"), ("caso.html", "o-caso.html"), ("../vivos/pesca2.html", "p-pesca.html")):
    f = AQUI / plantilla
    if f.exists():
        (AQUI.parent / salida).write_text(f.read_text().replace("{{DATOS}}", json.dumps(datos, ensure_ascii=False)))
        print(salida, "generado")
