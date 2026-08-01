import type { CaseStudy } from "../types";

export const uniformesBahiaEs: CaseStudy = {
  slug: "uniformes-bahia",
  track: "professional",
  order: 3,
  featured: true,
  title: "Integración del canal online con el ERP",
  tagline:
    "Sincronizar un catálogo de alta cardinalidad entre la tienda online y Odoo sin que se rompa la integridad de los datos.",
  client: "Uniformes Bahía",
  period: "Jul 2026 – actualidad",
  year: "2026–",
  role: "Responsable de comercio electrónico",
  summary:
    "Mi trabajo actual. El catálogo vive en Odoo y el canal de venta online necesita reflejarlo sin desviarse: mismos productos, mismas variantes, mismos identificadores. El reto no es mover datos, es que los dos sistemas sigan contando lo mismo cuando el catálogo cambia todos los días.",
  stack: ["Odoo", "XML-RPC", "REST", "Modelado relacional", "SEO técnico"],
  metrics: [],
  sections: [
    {
      id: "contexto",
      heading: "Contexto",
      body: [
        "Un catálogo de ropa laboral es un caso de manual de **alta cardinalidad**: cada prenda se multiplica por tallas, colores y, a veces, por sector o normativa. Un producto se convierte en decenas de referencias reales, y todas tienen que existir en los dos sistemas con el mismo identificador.",
        "El ERP, Odoo, es la fuente de la verdad. El canal online tiene que ser un reflejo fiel, y el problema aparece cuando deja de serlo: una variante que existe en la tienda pero ya no en el ERP es una venta que no se puede servir.",
      ],
    },
    {
      id: "integracion",
      heading: "La integración",
      body: [
        "La sincronización se apoya en las interfaces que expone Odoo, **XML-RPC** para las operaciones sobre modelos y REST donde encaja mejor, con la premisa de que ninguna escritura puede dejar el catálogo en un estado intermedio.",
      ],
      bullets: [
        {
          term: "La integridad referencial manda",
          text: "Una variante no puede existir sin su producto padre, ni un producto quedarse sin las variantes que ya se estaban vendiendo. Las operaciones se ordenan para que esa relación nunca se rompa a mitad de una sincronización.",
        },
        {
          term: "SKUs estandarizados",
          text: "Los identificadores venían con criterios distintos según quién diera de alta el producto. Unificarlos es lo que permite casar automáticamente ambos lados: sin un identificador estable, cada sincronización es una conciliación manual.",
        },
        {
          term: "Relaciones padre-hijo explícitas",
          text: "El modelado separa el producto de sus variantes en lugar de tratar cada combinación de talla y color como un artículo suelto. Es lo que hace que el catálogo se pueda navegar y filtrar en la tienda sin duplicar fichas.",
        },
      ],
    },
    {
      id: "automatizacion",
      heading: "Automatización y capa técnica",
      body: [
        "Además de la sincronización, el canal necesita mantenerse solo: flujos de datos automatizados en lugar de cargas manuales, y trabajo de **SEO técnico** sobre metadatos y estructura de las fichas, que es lo que decide si un catálogo grande se encuentra o se queda invisible.",
      ],
    },
    {
      id: "en-curso",
      heading: "En curso",
      callout: {
        tone: "note",
        text: "Es mi puesto actual, así que este caso está abierto y crecerá conforme el proyecto avance. Los otros casos de esta web están cerrados y documentados con su memoria técnica.",
      },
    },
  ],
  links: [],
  repo: {
    visibility: "private",
    note: "Trabajo interno de la empresa; el código no es público.",
  },
};
