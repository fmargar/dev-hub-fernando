import type { CaseStudy } from "../types";

export const uniformesBahiaEs: CaseStudy = {
  slug: "uniformes-bahia",
  track: "professional",
  order: 1,
  featured: true,
  title: "Un LLM dentro del ERP, con aprobación humana",
  tagline:
    "Descripciones de producto generadas con la API de OpenAI que entran como borrador y solo se publican cuando una persona las aprueba.",
  client: "Uniformes Bahía y Locura Segura",
  period: "Jul 2026 – actualidad",
  year: "2026–",
  role: "Responsable de comercio electrónico",
  summary:
    "Mi trabajo actual. Llevo el desarrollo, los datos y la IA de la tienda online sobre Odoo y PrestaShop. La pieza que mejor me define: un módulo de Odoo que pone un LLM a redactar fichas de producto sin quitarle a nadie la última palabra.",
  stack: ["Python", "Odoo", "OpenAI API", "PHP", "PrestaShop", "XML-RPC", "JSON-2", "Cloudflare"],
  metrics: [],
  sections: [
    {
      id: "llm",
      heading: "El LLM propone, una persona decide",
      body: [
        "Un catálogo grande necesita una descripción buena por producto, y escribirlas a mano no escala. El módulo toma la **ficha técnica** de cada producto y genera la descripción con la **API de OpenAI** y un prompt propio.",
        "Lo importante es lo que pasa después. La propuesta **entra como borrador**, queda registrado **quién la propone** y un responsable la **aprueba o la rechaza** antes de publicarla. Ningún texto llega a la tienda sin que una persona lo haya leído.",
      ],
      pullQuote: "Human-in-the-loop no es un adorno: es lo que permite meter un LLM en un sistema del que vive una empresa.",
    },
    {
      id: "despliegue",
      heading: "Desplegar Odoo como se despliega software",
      body: [
        "Las personalizaciones de Odoo (campos, vistas QWeb, acciones de servidor y tareas programadas) se hacían a mano en la interfaz. Escribí un **instalador en Python sobre la API JSON-2** que las despliega desde código: **idempotente**, con **simulación** previa y **reversión**. Ahora lo estamos migrando a un módulo empaquetado y versionado.",
      ],
    },
    {
      id: "incidente",
      heading: "Un incidente de producción",
      body: [
        "Unos bots recorrían todas las combinaciones de filtros del catálogo y el equipo no podía trabajar. Bloquear por user-agent no servía: se hacían pasar por navegadores normales.",
        "Los separé por **patrón de navegación** y no por user-agent, con reglas de seguridad en **Cloudflare**, sin romper el rastreo de los buscadores ni los enlaces que comparten los clientes.",
      ],
    },
    {
      id: "datos",
      heading: "Datos y catálogo",
      bullets: [
        {
          term: "Pipelines ETL",
          text: "Cargas desde CSV, Excel y XML hacia Odoo por XML-RPC y REST, con scrapers que reintentan en lugar de dejar huecos.",
        },
        {
          term: "Catálogo de alta cardinalidad",
          text: "Cada prenda se multiplica por tallas y colores. El modelado separa producto y variantes, con identificadores estandarizados para que los dos sistemas cuenten lo mismo.",
        },
        {
          term: "PrestaShop y analítica",
          text: "Desarrollo PHP sobre la tienda y medición de conversiones para saber qué funciona.",
        },
      ],
    },
  ],
  links: [],
  repo: {
    visibility: "private",
    note: "Trabajo interno de la empresa; el código no es público.",
  },
};
