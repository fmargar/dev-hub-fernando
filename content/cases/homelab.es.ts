import type { CaseStudy } from "../types";

export const homelabEs: CaseStudy = {
  slug: "homelab",
  track: "personal",
  order: 7,
  featured: true,
  title: "Infraestructura propia y orquestador de tareas",
  tagline:
    "Un servidor Linux con más de cien contenedores que administro solo, y el orquestador que sustituyó a 28 temporizadores sueltos.",
  client: "Servidor propio, en producción continua",
  period: "2025 – actualidad",
  year: "2025–",
  role: "Diseño, operación y mantenimiento",
  summary:
    "Todo lo que construyo se sirve desde una máquina que administro yo: este portfolio, Adivinadle y los agentes de IA que trabajan en paralelo. No es un laboratorio de juguete: hay servicios con usuarios reales, incidencias de madrugada y decisiones de arquitectura que se pagan cuando se toman mal.",
  stack: [
    "Linux",
    "Docker",
    "Node.js",
    "PostgreSQL",
    "systemd",
    "Cloudflare Tunnel y Access",
    "Tailscale",
    "Vector",
    "restic",
  ],
  metrics: [
    { value: "100+", label: "contenedores en marcha", liveKey: "containers" },
    { value: "28 → 1", label: "temporizadores sustituidos por un orquestador" },
    { value: "0", label: "puertos de base de datos expuestos", liveKey: "dbPortsExposed" },
    { value: "3", label: "capas de copias, una cifrada fuera de casa" },
  ],
  sections: [
    {
      id: "orquestador",
      heading: "Un orquestador en lugar de 28 relojes",
      body: [
        "El servidor tenía trabajos programados repartidos por todas partes: crons dentro de un backend, intervalos en servicios, entradas de `crontab` y un cron dentro de un contenedor. Veintiocho relojes que no se hablaban. Al parar una pieza para hacer mantenimiento, las demás seguían actuando por su cuenta.",
        "Lo sustituí por un **orquestador propio en Node.js y PostgreSQL** con un único reloj. Cada tarea declara en un catálogo **los recursos que necesita** y solo se lanza si están libres: exclusión mutua por recursos, no por horarios. Una llave global pone todo en marcha, en pausa o en mantenimiento.",
      ],
      bullets: [
        {
          term: "Estado que sobrevive a reinicios",
          text: "Los recursos ocupados son las ejecuciones sin fecha de fin en la base de datos. Si el orquestador se reinicia no pierde el hilo ni repite nada; lo que quedó a medias se marca como interrumpido.",
        },
        {
          term: "Un recurso no se libera hasta que la tarea termina de verdad",
          text: "Al cortar una tarea colgada, la cancelación es una petición, no una garantía. Liberar su recurso antes de que muera podría poner dos procesos a la vez sobre lo mismo.",
        },
        {
          term: "Lo que se queda fuera, a propósito",
          text: "Las copias de seguridad no dependen del orquestador, y un vigía externo avisa si cae: si el orquestador se cae, nadie más podría avisar.",
        },
      ],
      pullQuote: "No estábamos apagando el coche: estábamos parando las piezas por separado.",
    },
    {
      id: "red",
      heading: "Red y acceso",
      bullets: [
        {
          term: "Cloudflare Tunnel para lo público",
          text: "Los dominios salen a internet por un túnel saliente: el router no abre ni un solo puerto entrante. Lo que es privado va además detrás de Cloudflare Access.",
        },
        {
          term: "Tailscale para la administración",
          text: "Los paneles internos y el acceso SSH solo son alcanzables desde la red privada. Nada de eso está publicado.",
        },
        {
          term: "Segmentación de capa 2",
          text: "Los servicios que deben salir por una conexión distinta van en su propia red ipvlan de Docker, separada a nivel de capa 2 en lugar de depender de reglas de enrutamiento frágiles.",
        },
      ],
    },
    {
      id: "datos",
      heading: "Los datos son lo único que no se puede reconstruir",
      bullets: [
        {
          term: "Ninguna base de datos escucha en la red",
          text: "PostgreSQL y MariaDB solo publican en `127.0.0.1`; el tráfico real va por la red interna de Docker.",
        },
        {
          term: "Copias en tres capas",
          text: "Copia local diaria, copia de lo crítico y copia cifrada fuera de casa con restic. Secretos cifrados con la clave fuera de la base de datos.",
        },
        {
          term: "Logs centralizados",
          text: "Vector copia en vivo los logs de los servicios a disco, con un año de retención: sobreviven a recrear contenedores, y una incidencia de hace días se investiga con `grep`.",
        },
      ],
    },
    {
      id: "aprendizaje",
      heading: "Qué me llevo",
      body: [
        "Que los fallos que de verdad cuestan son los silenciosos. Una vez un aviso de tarea colgada **sí saltó**, pero el centro de avisos lo rechazaba por un tipo que no aceptaba, y nadie se enteró en días. Un aviso que puede perderse en silencio no es un aviso. Desde entonces, cuando monto algo, lo primero que pienso es cómo me voy a enterar de que ha dejado de funcionar.",
        "Y que un arreglo que no sobrevive a un despliegue no es un arreglo: es una cuenta atrás. Todo vive como código, versionado en Git.",
      ],
    },
  ],
  links: [],
  repo: {
    visibility: "private",
    note: "La configuración incluye credenciales y la topología de una máquina en producción, así que el repositorio es privado.",
  },
};
