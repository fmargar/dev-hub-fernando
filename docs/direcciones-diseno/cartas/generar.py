"""Genera i-cartas.html desde datos.json: una sola fuente para sobres, álbum, mazo y dossier.
El HTML sale completo (se lee sin JavaScript); el script solo añade foil, giro, sobres y mazo."""
import json, html, pathlib

AQUI = pathlib.Path(__file__).parent
D = json.loads((AQUI / "datos.json").read_text())
T = D["tipos"]
e = html.escape
total = len(D["cartas"])
por_id = {c["id"]: c for c in D["cartas"]}


def carta(c, extra=""):
    t = T[c["tipo"]]
    oscura = ' data-oscura' if c["id"] == "erp" else ''
    web = f'<a class="ir" href="{c["web"]}">Abrir {e(c["web"].split("//")[1].split("/")[0])} ↗</a>' if c.get("web") else '<span class="ir sin">Sistema interno: sin web pública</span>'
    preguntas = "".join(f"<dt>{e(p)}</dt><dd>{e(r)}</dd>" for p, r in c["preguntas"])
    return f'''<article class="carta" id="carta-{c["id"]}" data-id="{c["id"]}" data-tipo="{c["tipo"]}" data-foil="{t["foil"]}" style="--c:{c["color"]}"{oscura}{extra}>
  <div class="giro">
    <div class="cara frente">
      <header class="cab"><h3>{e(c["nombre"])}</h3><span class="dato"><b>{e(c["dato"])}</b>{e(c["datoTxt"])}</span></header>
      <div class="arte"><img src="cartas/arte-{c["arte"]}.webp" alt="" loading="lazy" width="504" height="378"></div>
      <p class="tipo"><span aria-hidden="true">{t["simbolo"]}</span>{e(t["nombre"])}</p>
      <p class="efecto">{e(c["efecto"])}</p>
      <footer class="pie"><span>{" · ".join(e(s) for s in c["stats"])}</span><span>{c["n"]:02d}/{total:02d}</span></footer>
      <i class="foil" aria-hidden="true"></i><i class="brillo" aria-hidden="true"></i>
    </div>
    <div class="cara dorso">
      <h4>Preguntas de entrevista</h4>
      <dl>{preguntas}</dl>
      {web}
    </div>
  </div>
</article>'''


def ranura(c):
    return f'''<li class="ranura" data-tipo="{c["tipo"]}">
  {carta(c)}
  <div class="acciones">
    <button class="girar" type="button" data-girar="{c["id"]}">Ver el reverso</button>
    <button class="al-mazo" type="button" data-mazo="{c["id"]}" aria-pressed="false">Añadir al mazo</button>
  </div>
</li>'''


def sobre(s):
    nombres = ", ".join(e(por_id[i]["nombre"]) for i in s["cartas"])
    return f'''<li class="sobre" data-sobre="{s["id"]}" style="--s:{s["color"]}">
  <div class="envoltorio">
    <span class="tira" aria-hidden="true"></span>
    <p class="marca">Sobre</p>
    <h3>{e(s["nombre"])}</h3>
    <p class="frase">{e(s["frase"])}</p>
    <p class="dentro">{len(s["cartas"])} cartas: {nombres}</p>
  </div>
  <button class="abrir" type="button" data-abrir="{s["id"]}">Abrir el sobre</button>
</li>'''


leyenda = "".join(f'<button type="button" class="filtro" data-filtro="{k}" aria-pressed="false"><span aria-hidden="true">{v["simbolo"]}</span>{e(v["nombre"])}</button>' for k, v in T.items())

plantilla = (AQUI / "plantilla.html").read_text()
salida = (plantilla
          .replace("{{SOBRES}}", "\n".join(sobre(s) for s in D["sobres"]))
          .replace("{{ALBUM}}", "\n".join(ranura(c) for c in sorted(D["cartas"], key=lambda c: c["n"])))
          .replace("{{LEYENDA}}", leyenda)
          .replace("{{DATOS}}", json.dumps({"sobres": D["sobres"], "nombres": {c["id"]: c["nombre"] for c in D["cartas"]}}, ensure_ascii=False)))
(AQUI.parent / "i-cartas.html").write_text(salida)
print("i-cartas.html generado")
