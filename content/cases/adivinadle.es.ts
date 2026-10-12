import type { CaseStudy } from "../types";

export const adivinadleEs: CaseStudy = {
  slug: "adivinadle",
  track: "personal",
  order: 4,
  featured: true,
  title: "Adivinadle",
  tagline:
    "Juegos diarios de adivinar personajes de videojuegos: un producto completo en producción, construido dirigiendo agentes de IA.",
  client: "Producto propio · adivinadle.com",
  period: "Sep 2026 – actualidad",
  year: "2026–",
  role: "Producto, arquitectura, revisión y operación",
  summary:
    "Cada día hay un personaje secreto en cada juego y todo el mundo juega el mismo reto. Lo diseñé, decidí cada pieza y lo llevé a producción dirigiendo agentes de IA (Claude Code y Codex): ellos escriben el código, yo pongo el producto, la arquitectura, la revisión y el sistema de calidad que no deja pasar nada sin pruebas.",
  cover: {
    key: "adv-portada",
    alt: "Portada de adivinadle.com: una mesa de detective con una carpeta por juego",
    caption: "Portada en producción: una carpeta por juego y el progreso del día",
  },
  stack: [
    "Laravel 13 + Octane",
    "PostgreSQL",
    "Redis",
    "Astro 7",
    "Svelte 5",
    "TypeScript",
    "OpenAPI",
    "Playwright",
    "PHPStan",
    "Docker",
    "Caddy",
  ],
  metrics: [
    { value: "9", label: "juegos con 4 modos cada uno" },
    { value: "~1.800", label: "personajes con datos curados" },
    { value: "1,5–1,7 s", label: "LCP medido en la CI" },
    { value: "0", label: "CLS: nada salta al cargar" },
  ],
  sections: [
    {
      id: "producto",
      heading: "El producto",
      body: [
        "Nueve juegos y cuatro modos: **clásico** por atributos, **símbolos**, **descripción** y **silueta**. El reto cambia a las 00:00 de España y la solución nunca sale de la API mientras está en juego: los retos se generan de forma determinista con una semilla secreta, y sin ella la web se niega a arrancar.",
        "Es una web en español pensada para el móvil, instalable como app, con aviso diario por **Web Push propio**, sin depender de un servicio externo.",
      ],
      shots: [
        {
          key: "adv-clasico",
          alt: "Modo clásico de Adivinadle con la tabla de intentos coloreada y el corcho de pistas",
          caption: "Modo clásico: cada intento dice en qué te acercas",
        },
      ],
    },
    {
      id: "arquitectura",
      heading: "Arquitectura",
      body: [
        "API en **Laravel 13 con Octane**, PostgreSQL y Redis; web en **Astro 7** renderizada en el servidor con islas de **Svelte 5**. Entre las dos hay un **contrato OpenAPI** versionado en un paquete propio, con casos de prueba del comparador que ambas partes tienen que cumplir: si la API cambia la forma de una respuesta, la CI de la web se pone en rojo.",
        "Los datos salen de importadores por juego (wikis y APIs públicas) con sincronización semanal. El cargador vigila la calidad del contenido al entrar: por ejemplo, ningún par de personajes puede compartir más de dos de sus cuatro símbolos, y ningún símbolo puede delatar el nombre.",
      ],
    },
    {
      id: "calidad",
      heading: "Calidad que no depende de acordarse",
      bullets: [
        {
          term: "CI obligatoria",
          text: "PHPStan al nivel máximo y Pest en la API; comprobación de tipos y Vitest en la web. Nada llega a producción sin pasar.",
        },
        {
          term: "e2e en móvil y escritorio",
          text: "Playwright con auditoría de accesibilidad (axe) y Lighthouse en cada cambio: LCP de 1,5 a 1,7 s y CLS 0, medidos, no estimados.",
        },
        {
          term: "Revisiones independientes",
          text: "Antes de lanzar, otro modelo revisa el producto como lo haría un jugador y como lo haría un auditor. Sus hallazgos se atienden y quedan escritos.",
        },
      ],
      pullQuote:
        "Que una IA genere el código no significa que esté listo para producción: la calidad la pone el sistema que hay alrededor.",
    },
    {
      id: "operacion",
      heading: "Producción",
      body: [
        "Autoalojado en mi servidor, detrás de Cloudflare, con copias diarias, cabeceras de seguridad, límite de peticiones y una vigilancia externa programada que comprueba que la web responde y que el reto de hoy existe.",
        "Un despliegue dejó una vez la API unos minutos sin responder porque las migraciones regeneraban imágenes antes de dejarla arrancar. El arreglo fue de raíz: las migraciones solo migran, el script prepara las imágenes con la versión nueva mientras la vieja sigue sirviendo, y un test vigila ese orden.",
      ],
      shots: [
        {
          key: "adv-movil",
          alt: "Adivinadle en un móvil: logotipo, instrucciones y las carpetas de los juegos",
          caption: "La versión móvil, que es donde se juega",
        },
      ],
    },
  ],
  links: [{ label: "adivinadle.com", href: "https://adivinadle.com", external: true }],
  repo: {
    visibility: "private",
    note: "El repositorio es privado de momento.",
  },
};
