import type { CaseStudy } from "../types";

export const calculoExactoEs: CaseStudy = {
  slug: "calculo-exacto",
  track: "personal",
  order: 6,
  featured: true,
  title: "Cálculo Exacto",
  tagline:
    "Calculadoras laborales y fiscales de España validadas contra el servicio oficial de la Agencia Tributaria, al céntimo.",
  client: "Producto propio · en preparación",
  period: "Oct 2026 – actualidad",
  year: "2026–",
  role: "Producto, arquitectura y validación",
  summary:
    "Sueldo neto, finiquito, despido, paro, pensiones, impuestos y el calendario laboral de los 8.132 municipios, siempre con la fórmula explicada y la fuente oficial al lado. Aún no está publicada. Lo que la hace interesante es cómo se demuestra que los resultados son correctos.",
  stack: ["TypeScript", "Astro", "Svelte", "Vitest", "pnpm monorepo"],
  metrics: [
    { value: "46", label: "casos contrastados con la AEAT" },
    { value: "0,00 €", label: "de diferencia admitida" },
    { value: "1.257", label: "tests automáticos en verde" },
    { value: "2", label: "erratas encontradas en una publicación oficial" },
  ],
  sections: [
    {
      id: "validacion",
      heading: "Validar resultados contra la fuente oficial",
      body: [
        "El motor de sueldo neto se contrasta con el **servicio de cálculo de retenciones de la propia AEAT**: 46 casos, uno por rama del algoritmo, y el resultado tiene que coincidir **al céntimo**. Las respuestas oficiales se guardan, así que el test corre sin red en cada cambio.",
        "El contraste cazó un fallo real en las deducciones por discapacidad, ya corregido. Y al cuadrar las escalas autonómicas aparecieron **dos erratas en una publicación oficial de Hacienda**.",
      ],
      pullQuote: "Un resultado que no se puede contrastar con la fuente no se publica.",
    },
    {
      id: "normativa",
      heading: "Cada cifra legal con su origen",
      body: [
        "Ninguna cifra legal vive fuera de un paquete propio de normativa, y cada una lleva su BOE y su fecha de vigencia. Monorepo en TypeScript con Astro y Svelte, paquetes separados para la normativa, el motor de cálculo, el calendario y las plantillas.",
      ],
    },
  ],
  links: [],
  repo: {
    visibility: "private",
    note: "El repositorio es privado y la web aún no está publicada.",
  },
};
