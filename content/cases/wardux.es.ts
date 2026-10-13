import type { CaseStudy } from "../types";

export const warduxEs: CaseStudy = {
  slug: "wardux",
  track: "personal",
  order: 5,
  featured: true,
  title: "Wardux",
  tagline:
    "Un medio digital de tecnología cuya redacción la hacen dos agentes de IA de proveedores distintos: uno redacta sin poder publicar y el otro revisa y publica.",
  client: "Producto propio · wardux.com",
  period: "Sep 2026 – actualidad",
  year: "2026–",
  role: "Producto, arquitectura y diseño del pipeline",
  summary:
    "Noticias, guías y análisis de IA, hardware, software y videojuegos. Lo interesante para este puesto es la redacción: un flujo de redacción con IA, funcionando cada día, en el que ningún modelo publica solo y en el que las correcciones del revisor mejoran al redactor.",
  cover: {
    key: "wdx-portada",
    alt: "Portada de wardux.com con el lema «Menos humo, más visión»",
    caption: "Portada en producción",
  },
  stack: ["Codex", "Claude", "Astro", "Laravel 13", "PostgreSQL", "Varnish", "Playwright", "systemd"],
  metrics: [
    { value: "90", label: "artículos publicados" },
    { value: "2", label: "proveedores de IA: uno redacta, otro revisa" },
    { value: "25/09", label: "en internet desde 2026" },
    { value: "≥ 95", label: "Lighthouse exigido en la CI" },
  ],
  sections: [
    {
      id: "pipeline",
      heading: "El pipeline",
      body: [
        "Cada noche, un agente (**Codex**) busca novedades, redacta, verifica los datos y deja cada pieza **«en revisión»**. No tiene permiso para publicar.",
        "Un vigía comprueba cada pocos minutos si hay piezas esperando. Cuando llevan un rato quietas (para agrupar lo que llega seguido), lanza un segundo agente de **otro proveedor (Claude)** con su manual de revisor: corrige, publica o devuelve a borrador, apunta lo que corrigió y manda un solo aviso.",
      ],
      pullQuote: "Ningún modelo publica solo: uno escribe, otro de otro proveedor revisa.",
    },
    {
      id: "fiabilidad",
      heading: "Fiabilidad",
      bullets: [
        { term: "Idempotente y con reintento", text: "Una revisión que no termina bien no se da por hecha y se reintenta; la misma pieza tal cual no se revisa dos veces." },
        { term: "Nunca a la vez", text: "La revisión no corre mientras redacta el otro agente ni mientras hay otra revisión en marcha." },
        { term: "Bucle de mejora", text: "Lo que el revisor corrige a menudo pasa al manual del redactor: el sistema aprende de sus propios errores." },
      ],
    },
    {
      id: "web",
      heading: "La web",
      body: [
        "Astro en modo servidor, Laravel 13 con Octane y PostgreSQL, caché con Varnish y purgas por etiquetas, almacén de imágenes propio compatible con S3, analítica sin cookies, staging y producción separados, y **despliegue por commit con vuelta atrás automática**. La CI pasa e2e con Playwright, enlaces rotos y Lighthouse.",
      ],
    },
  ],
  links: [{ label: "wardux.com", href: "https://wardux.com", external: true }],
  repo: {
    visibility: "private",
    note: "El repositorio es privado.",
  },
};
