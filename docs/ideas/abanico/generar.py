"""Genera el catálogo visual del abanico (index.html): 24 conceptos con imagen de referencia
y, debajo, el resto de ideas de las dos rondas en texto."""
import json, re, html, pathlib
AQUI = pathlib.Path(__file__).parent
e = html.escape
C = json.loads((AQUI / "conceptos.json").read_text())
familias = {}
for k, nombre, origen, fam, frase, _ in C:
    familias.setdefault(fam, []).append((k, nombre, origen, frase))

# Resto: las de Codex ronda 2 que no tienen imagen, y algunas de Claude
usados = {o for _, _, o, *_ in C}
resto = []
for m in re.finditer(r"^### (\d\d) · (.+?) — (.+)$", (AQUI.parent / "ideas-codex-ronda2-2026-10-12.md").read_text(), re.M):
    if not any(f"Codex {m[1]}" in u for u in usados):
        resto.append((m[2], f"Codex {m[1]}", m[3]))
resto += [("Diff de mi vida", "Claude 3", "La web es un pull request: su trayectoria como diff y un botón verde «Merge» para contactar."),
          ("Titular que se compila", "Claude 4", "Letras enormes que se construyen con el scroll, de esqueleto a letra rellena."),
          ("Tamagotchi de servidor", "Claude 12", "Una mascota que es su servidor: la cuidas con despliegues y copias, y cada acción explica algo real."),
          ("Una sola frase", "Claude 18", "Un color que cambia con la hora de Marbella y una frase enorme cuyas palabras abren proyectos.")]
anteriores = ["Cartas con foil (prototipo I)", "Ciudad habitable (prototipo K)", "Expendedora (prototipo J)", "La Rotativa", "Consola y cartuchos",
              "Tablero del detective", "Mapa de metro", "Sala de control", "Pinball de pruebas", "Mesa de mezclas", "Cómic de ingeniería",
              "Entre bambalinas", "Inmersión", "Cocina de productos", "Tribunal del bug", "Mesa de montaje", "Equipaje de mano",
              "Observatorio", "Telar digital", "Kit de montaje", "Origami de sistemas", "Banco de inspección", "Muro vivo", "Efecto dominó"]

def tarjeta(k, nombre, origen, frase):
    return (f'<article id="{k}"><a href="img/{k}.webp"><img loading="lazy" src="img/{k}.webp" alt="Referencia visual de {e(nombre)}"></a>'
            f'<div><h3>{e(nombre)}</h3><p>{e(frase)}</p><small>{e(origen)}</small></div></article>')

cuerpo = "".join(f'<section><h2>{e(f)}</h2><div class="rejilla">{"".join(tarjeta(*t) for t in ts)}</div></section>' for f, ts in familias.items())
lista = "".join(f"<li><b>{e(n)}</b> <small>{e(o)}</small><br>{e(fr)}</li>" for n, o, fr in resto)
html_ = f"""<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>El abanico · ideas para el portfolio</title>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500..800&display=swap" rel="stylesheet">
<style>
:root{{--fondo:#0b1030;--tinta:#f4f6ff;--suave:#aab3e6;--a:#ffd60a;--b:#2fd44a}}
*{{box-sizing:border-box;margin:0}} body{{background:var(--fondo);color:var(--tinta);font:16px/1.55 "Bricolage Grotesque",system-ui,sans-serif;padding:clamp(1rem,4vw,3.5rem)}}
header{{max-width:60rem}} h1{{font-size:clamp(2.4rem,7vw,5rem);line-height:.95;font-weight:800}} header p{{margin-top:1rem;color:var(--suave);font-size:1.125rem}}
h2{{margin:3.5rem 0 1.25rem;font-size:clamp(1.5rem,3vw,2.25rem);font-weight:800;color:var(--a)}}
.rejilla{{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,26rem),1fr));gap:1.5rem}}
article{{background:#151b46;border-radius:.75rem;overflow:hidden}} article img{{display:block;width:100%;aspect-ratio:16/9;object-fit:cover;background:#222}}
article div{{padding:1rem 1.125rem 1.25rem}} h3{{font-size:1.375rem;font-weight:800}} article p{{margin-top:.375rem;color:var(--suave)}}
small{{display:inline-block;margin-top:.5rem;font-size:.8125rem;color:var(--b);font-weight:700}}
ul{{columns:2 22rem;gap:2rem;padding-left:1.1rem}} li{{break-inside:avoid;margin-bottom:.875rem;color:var(--suave)}} li b{{color:var(--tinta)}}
.archivo{{color:var(--suave);max-width:60rem}}
</style>
<header><h1>El abanico</h1><p>47 ideas nuevas para el portfolio (30 de Codex y 18 mías; el menú de pausa se nos ocurrió a los dos) en diez familias, sin repetir las de la primera ronda. Las 24 más distintas llevan una imagen de referencia generada con ChatGPT: es un boceto de por dónde iría, no el diseño final. Pulsa una imagen para verla en grande.</p></header>
{cuerpo}
<section><h2>El resto de ideas nuevas, en texto</h2><ul>{lista}</ul></section>
<section><h2>Ya exploradas en la ronda 1</h2><p class="archivo">{e(" · ".join(anteriores))}.</p></section>
</html>"""
(AQUI / "index.html").write_text(html_)
print("index.html:", len(C), "con imagen,", len(resto), "en texto")
