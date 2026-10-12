"""Genera k-ciudad.html: los proyectos salen de cartas/datos.json y aquí solo se dice dónde está
cada edificio (en % de la imagen de escritorio y de la calle del móvil) y su placa de calle."""
import json, html, pathlib

AQUI = pathlib.Path(__file__).parent
D = json.loads((AQUI.parent / "cartas" / "datos.json").read_text())
e = html.escape
# id: (rótulo, posición escritorio [x %, y %], posición móvil [x %, y %] o None)
EDIFICIOS = json.loads((AQUI / "edificios.json").read_text())
PLACA = {"adivinadle": "Pza. de", "wardux": "Avda. de", "marbella": "Paseo de", "erp": "C/ del", "agentes": "Ronda del",
         "calculo": "C/ de", "vados": "Travesía de los", "servidor": "Callejón del"}
NOMBRE_PLACA = {"erp": "LLM en el ERP", "agentes": "Equipo de Agentes", "vados": "Vados", "servidor": "Servidor"}

datos = {}
for c in D["cartas"]:
    ed = EDIFICIOS.get(c["id"], {})
    datos[c["id"]] = {**{k: c[k] for k in ("nombre", "color", "efecto", "preguntas")}, "web": c.get("web"),
                      "tipoNombre": D["tipos"][c["tipo"]]["nombre"], "centro": ed.get("centro"), "centroMovil": ed.get("centroMovil")}

rotulos = []
for id_, ed in EDIFICIOS.items():
    x, y = ed["escritorio"]; m = ed.get("movil")
    estilo = f'--x:{x}%;--y:{y}%;--c:{ed["luz"]}' + (f';--mx:{m[0]}%;--my:{m[1]}%' if m else '')
    rotulos.append(f'      <button class="rotulo bloque" type="button" data-entrar="{id_}" style="{estilo}"><i></i>{e(ed["rotulo"])}</button>')

placas = "\n".join(
    f'    <li><button class="placa" type="button" data-entrar="{c["id"]}"><span class="marco"><small>{PLACA[c["id"]]}</small><b>{e(NOMBRE_PLACA.get(c["id"], c["nombre"]))}</b><em>{e(c["efecto"])}</em></span></button></li>'
    for c in sorted(D["cartas"], key=lambda c: c["n"]))

salida = ((AQUI / "plantilla.html").read_text().replace("{{ROTULOS}}", "\n".join(rotulos))
          .replace("{{PLACAS}}", placas).replace("{{DATOS}}", json.dumps(datos, ensure_ascii=False)))
(AQUI.parent / "k-ciudad.html").write_text(salida)
print("k-ciudad.html generado")
