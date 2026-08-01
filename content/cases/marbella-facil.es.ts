import type { CaseStudy } from "../types";

export const marbellaFacilEs: CaseStudy = {
  slug: "marbella-facil",
  order: 2,
  featured: true,
  title: "Marbella Fácil",
  tagline:
    "Plataforma de servicios turísticos y ciudadanos: reservas, gamificación y datos municipales en tiempo real.",
  client: "Proyecto intermodular de fin de ciclo (DAW)",
  period: "Oct 2025 – May 2026",
  year: "2025–26",
  role: "Full stack y DevOps, en pareja",
  summary:
    "Una plataforma que junta lo que hoy está repartido entre cinco apps distintas: directorio de comercios con reserva de mesa, estado de las playas, transporte urbano, agenda cultural y un asistente que responde preguntas sobre la ciudad. Backend Laravel con API REST, frontend React desacoplado y una infraestructura de dos nodos que fue tan trabajo como el código.",
  stack: [
    "Laravel 12",
    "React 19",
    "Vite 7",
    "MySQL 8",
    "Laravel Sanctum",
    "Stripe / Cashier",
    "Groq (Llama 3)",
    "Leaflet",
    "Docker",
    "PHPUnit",
  ],
  metrics: [
    { value: "34+", label: "entidades en el modelo de datos" },
    { value: "5", label: "módulos funcionales" },
    { value: "2", label: "nodos espejo en producción" },
    { value: ">80%", label: "cobertura en módulos críticos" },
  ],
  sections: [
    {
      id: "contexto",
      heading: "Contexto",
      body: [
        "Marbella es un destino turístico de primer nivel con la información municipal completamente atomizada. Para planificar una tarde hay que pasar por la web del Ayuntamiento, la de la empresa de autobuses, la app del tiempo, un agregador de restaurantes y las redes sociales de cada negocio.",
        "Los grandes agregadores globales cubren bien la parte comercial, pero no tienen los datos públicos locales; los portales institucionales tienen los datos pero no permiten hacer nada con ellos. Marbella Fácil se sitúa en medio: información municipal **y** capacidad de acción, con un modelo pensado para que el comercio pequeño no pague comisión por transacción.",
      ],
    },
    {
      id: "arquitectura",
      heading: "Arquitectura",
      body: [
        "A diferencia del sistema de vados, aquí sí montamos una **arquitectura desacoplada**: una API REST en Laravel 12 y una SPA en React 19 servida por Vite, comunicadas por Axios con interceptores para inyectar el token y centralizar el manejo de errores. La razón es que la plataforma tiene cuatro tipos de cliente muy distintos (visitante, usuario registrado, empresa y administrador) y la separación permitía evolucionar la interfaz sin tocar la capa de negocio.",
        "La autenticación es Laravel Sanctum con middlewares propios para el control de roles. El modelo de datos son más de 34 entidades relacionadas en MySQL 8, con claves foráneas, índices de búsqueda y tablas de auditoría.",
      ],
      figure: {
        key: "mf-arch",
        caption: "Dos nodos espejo sirven la aplicación; la base de datos es única y se alcanza por VPN.",
      },
    },
    {
      id: "modulos",
      heading: "Los módulos",
      bullets: [
        {
          term: "Reservas",
          text: "El núcleo transaccional. Cada negocio define sus tipos de reserva, sus franjas horarias y sus excepciones (cierres, horarios especiales). El usuario reserva contra la disponibilidad real y la empresa acepta o rechaza en tiempo real, con estados de pendiente a finalizada.",
        },
        {
          term: "Gamificación",
          text: "Puntos por acciones (login diario, publicar reseñas, asistir a eventos), niveles con umbrales y un catálogo de recompensas canjeables. Lo que lo cierra es la validación física: el usuario enseña un QR y el propietario lo valida desde su panel, lo que marca el canje como entregado. Todas las transacciones de puntos quedan en una tabla de historial.",
        },
        {
          term: "Ciudad inteligente",
          text: "Estado de las playas con sincronización automática contra la API de AEMET por códigos de estación, líneas y paradas de autobús urbano georreferenciadas con estimaciones de tráfico, agenda de eventos y noticias locales.",
        },
        {
          term: "Asistente con IA",
          text: "Un chat sobre Groq Cloud con Llama 3, afinado con system prompts especializados en información local. Está limitado a 20 peticiones por hora e IP mediante throttling de Laravel, porque un endpoint de IA abierto es una factura esperando a ocurrir.",
        },
        {
          term: "Reseñas e interacción",
          text: "Valoraciones con respuesta del propietario, votos de utilidad y comentarios anidados, con moderación de contenido reportado desde el panel de administración.",
        },
      ],
    },
    {
      id: "pagos",
      heading: "Dos modelos de negocio en el mismo código",
      body: [
        "La plataforma admite dos vías de explotación sin bifurcar el código. En la vía privada (SaaS), los negocios contratan un plan mediante **Stripe Checkout** integrado con Laravel Cashier, con sincronización por webhooks firmados para las altas, renovaciones y bajas.",
        "En la vía pública (B2G), la idea es que sea un Ayuntamiento quien adquiera la licencia y el directorio quede gratis para el comercio local. En esa modalidad las funciones de pago se omiten y el alta de una empresa se valida por aprobación administrativa. Diseñarlo así desde el principio evitó tener que reescribir el módulo de empresas para cada escenario.",
      ],
    },
    {
      id: "infra",
      heading: "Infraestructura y despliegue",
      body: [
        "Esta parte fue mía y es de la que más aprendí. La base de datos vivía en un servidor físico del instituto, detrás del cortafuegos de la red del centro, y la aplicación tenía que correr fuera.",
      ],
      bullets: [
        {
          term: "Dos nodos espejo",
          text: "`marbellafacil.rgardel.es` y `marbellafacil.fmargar.es`, cada uno con el stack completo en contenedores, para que la caída de uno no dejara el proyecto inaccesible.",
        },
        {
          term: "Despliegue desde el repositorio",
          text: "Nada se sube a mano. Los stacks de Portainer leen la definición desde GitHub y hacen polling cada cinco minutos: al mergear en la rama principal, los nodos se reconstruyen solos.",
        },
        {
          term: "Tailscale para llegar a la base de datos",
          text: "Una red mesh sobre WireGuard une los nodos con el servidor del instituto. Los contenedores de Laravel hablan con la IP privada de la VPN, así que el puerto de MySQL nunca se expone a internet.",
        },
        {
          term: "Cloudflare delante",
          text: "Proxy inverso y WAF, SSL/TLS en modo Strict y las IP reales de los servidores ocultas.",
        },
      ],
    },
    {
      id: "calidad",
      heading: "Pruebas",
      body: [
        "En el backend, PHPUnit con pruebas unitarias sobre la lógica que más duele si falla —el cálculo de puntos y el motor de disponibilidad de reservas— y pruebas de integración que simulan peticiones HTTP reales contra los endpoints, verificando middlewares de Sanctum y persistencia. Mantuvimos la cobertura por encima del 80% en los módulos críticos.",
        "En el frontend, ESLint con reglas de estilo estrictas. Los contratos de la API se validaron con Postman antes de integrarlos, para que el frontend no se construyera contra una estructura de respuesta que luego cambiaba.",
      ],
    },
    {
      id: "aprendizaje",
      heading: "Qué me llevo",
      body: [
        "Que la parte difícil de un proyecto con dos personas no es repartirse el código, es acordar los contratos. Validar los endpoints con Postman antes de tocar el frontend nos ahorró la mayoría de las integraciones fallidas.",
        "Y que la infraestructura es parte del producto. El polling de Portainer contra GitHub convirtió el despliegue en algo que dejamos de pensar, y eso cambió el ritmo del desarrollo más que cualquier decisión de framework.",
      ],
    },
  ],
  links: [],
  repo: {
    visibility: "public",
    href: "https://github.com/fmargarrobertogd75/proyecto-marbella-facil",
  },
};
