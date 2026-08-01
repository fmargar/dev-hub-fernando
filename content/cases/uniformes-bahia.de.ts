import type { CaseStudy } from "../types";

export const uniformesBahiaDe: CaseStudy = {
  slug: "uniformes-bahia",
  track: "professional",
  order: 3,
  featured: true,
  title: "Anbindung des Onlinekanals an das ERP",
  tagline:
    "Einen Katalog mit hoher Kardinalität zwischen Onlineshop und Odoo synchronisieren, ohne die referenzielle Integrität zu verlieren.",
  client: "Uniformes Bahía",
  period: "Jul 2026 – heute",
  year: "2026–",
  role: "Leitung E-Commerce",
  summary:
    "Meine aktuelle Aufgabe. Der Katalog liegt in Odoo, und der Onlinevertrieb muss ihn exakt abbilden: dieselben Produkte, dieselben Varianten, dieselben Kennungen. Die Schwierigkeit besteht nicht darin, Daten zu bewegen, sondern darin, dass beide Systeme dasselbe erzählen, während sich der Katalog täglich ändert.",
  stack: ["Odoo", "XML-RPC", "REST", "Relationale Modellierung", "Technisches SEO"],
  metrics: [],
  sections: [
    {
      id: "contexto",
      heading: "Ausgangslage",
      body: [
        "Ein Katalog für Berufsbekleidung ist ein Musterbeispiel für **hohe Kardinalität**: Jedes Kleidungsstück vervielfacht sich über Größe, Farbe und teils über Branche oder Norm. Aus einem Produkt werden Dutzende echter Referenzen, und alle müssen in beiden Systemen unter derselben Kennung existieren.",
        "Das ERP, Odoo, ist die maßgebliche Quelle. Der Onlinekanal muss es getreu abbilden, und das Problem zeigt sich in dem Moment, in dem er das nicht mehr tut: Eine Variante, die es im Shop noch gibt, im ERP aber nicht mehr, ist eine Bestellung, die sich nicht ausliefern lässt.",
      ],
    },
    {
      id: "integracion",
      heading: "Die Anbindung",
      body: [
        "Die Synchronisation stützt sich auf die Schnittstellen, die Odoo bereitstellt — **XML-RPC** für Operationen auf Modellen und REST, wo es besser passt — unter der Prämisse, dass kein Schreibvorgang den Katalog in einem Zwischenzustand zurücklassen darf.",
      ],
      bullets: [
        {
          term: "Referenzielle Integrität hat Vorrang",
          text: "Eine Variante kann nicht ohne ihr übergeordnetes Produkt existieren, und ein Produkt darf keine Varianten verlieren, die bereits verkauft wurden. Die Operationen sind so geordnet, dass diese Beziehung mitten in einer Synchronisation nie bricht.",
        },
        {
          term: "Vereinheitlichte SKUs",
          text: "Die Kennungen folgten unterschiedlichen Konventionen, je nachdem, wer das Produkt angelegt hatte. Ihre Vereinheitlichung ist die Voraussetzung dafür, beide Seiten automatisch zusammenzuführen: Ohne stabile Kennung wird jede Synchronisation zur Handarbeit.",
        },
        {
          term: "Explizite Eltern-Kind-Beziehungen",
          text: "Das Modell trennt das Produkt von seinen Varianten, statt jede Kombination aus Größe und Farbe als eigenen Artikel zu führen. Genau das macht einen großen Katalog im Shop navigierbar und filterbar, ohne Produktseiten zu duplizieren.",
        },
      ],
    },
    {
      id: "automatizacion",
      heading: "Automatisierung und technische Ebene",
      body: [
        "Über die Synchronisation hinaus muss sich der Kanal selbst tragen: automatisierte Datenflüsse statt manueller Importe sowie **technisches SEO** an Metadaten und Aufbau der Produktseiten — davon hängt ab, ob ein großer Katalog gefunden wird oder unsichtbar bleibt.",
      ],
    },
    {
      id: "en-curso",
      heading: "Laufend",
      callout: {
        tone: "note",
        text: "Das ist meine aktuelle Aufgabe, deshalb bleibt diese Fallstudie offen und wächst mit dem Projekt. Die übrigen Fallstudien auf dieser Seite sind abgeschlossen und mit technischer Dokumentation belegt.",
      },
    },
  ],
  links: [],
  repo: {
    visibility: "private",
    note: "Interne Arbeit des Unternehmens; der Code ist nicht öffentlich.",
  },
};
