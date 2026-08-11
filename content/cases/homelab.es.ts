import type { CaseStudy } from "../types";

export const homelabEs: CaseStudy = {
  slug: "homelab",
  track: "personal",
  order: 4,
  featured: true,
  title: "Homelab: infraestructura self-hosted",
  tagline:
    "Un servidor Ubuntu con veinticinco servicios en contenedores que llevan meses en marcha, y lo que se aprende manteniéndolos.",
  client: "Proyecto personal, en producción continua",
  period: "2025 – actualidad",
  year: "2025–",
  role: "Diseño, operación y mantenimiento",
  summary:
    "Todo lo que hay en este dominio se sirve desde una máquina que administro yo. No es un laboratorio de juguete: hay servicios con usuarios reales, incidencias a las tres de la mañana y decisiones de arquitectura que se pagan cuando se toman mal. Es donde he aprendido de verdad la parte de operaciones.",
  stack: [
    "Ubuntu Server",
    "Docker",
    "Docker Compose",
    "Portainer",
    "Nginx",
    "Cloudflare Tunnel",
    "Tailscale",
    "PostgreSQL",
    "MariaDB",
    "ntfy",
  ],
  metrics: [
    { value: "25", label: "contenedores en producción", liveKey: "containers" },
    { value: "17", label: "stacks gestionados", liveKey: "stacks" },
    { value: "0", label: "puertos de base de datos expuestos", liveKey: "dbPortsExposed" },
    { value: "2", label: "salidas a internet independientes", liveKey: "internetEgress" },
  ],
  sections: [
    {
      id: "que-hay",
      heading: "Qué corre ahí dentro",
      body: [
        "El servidor aloja mis propias aplicaciones —este portfolio, un servicio de vídeo y varios paneles de control—, un servidor de notificaciones push, una bandeja de correo unificada y varios procesos programados por cron.",
        "Todo está en contenedores y todo se gestiona con **Portainer sobre stacks de Docker Compose**, versionados en Git. Ninguna configuración vive solo en la cabeza de nadie ni en un fichero suelto del servidor.",
      ],
      figure: {
        key: "homelab-net",
        caption: "Tres caminos de entrada distintos, cada uno con su propósito: público, privado y aislado.",
      },
    },
    {
      id: "red",
      heading: "Tres redes, tres propósitos",
      bullets: [
        {
          term: "Cloudflare Tunnel para lo público",
          text: "Los dominios salen a internet por un túnel saliente. El router no abre ni un solo puerto entrante, y la IP real de la línea no aparece en ningún registro DNS.",
        },
        {
          term: "Tailscale para la administración",
          text: "Portainer, los paneles internos y el acceso SSH solo son alcanzables desde la red mesh. Nada de esto está publicado.",
        },
        {
          term: "Una red ipvlan aislada",
          text: "Uno de los procesos de automatización necesita salir por una conexión distinta a la del resto. En vez de resolverlo con reglas de enrutamiento por política —frágiles y fáciles de romper sin darse cuenta—, creé una red **ipvlan** de Docker que coloca ese contenedor directamente en el segmento de red del segundo módem, sin NAT. La separación es real, a nivel de capa 2, y no depende de que una tabla de rutas siga siendo correcta.",
        },
      ],
    },
    {
      id: "datos",
      heading: "Los datos son lo único que no se puede reconstruir",
      body: [
        "Un contenedor se vuelve a levantar en treinta segundos; una base de datos corrupta, no. De ahí salen dos reglas que aplico en todos los stacks.",
      ],
      bullets: [
        {
          term: "Ninguna base de datos escucha en la red",
          text: "PostgreSQL y MariaDB publican sus puertos en `127.0.0.1` exclusivamente. El tráfico real va por la red interna de Docker entre contenedores; el bind local existe solo para depurar desde el propio host.",
        },
        {
          term: "Aislamiento entre stacks",
          text: "Servicios que no tienen relación no comparten base de datos, aunque compartirla saliera más barato. Un stack que se venga abajo no puede llevarse por delante los datos de otro.",
        },
        {
          term: "Healthchecks en todo lo que tiene estado",
          text: "Con `depends_on: service_healthy`, para que una API no arranque contra una base de datos que todavía está inicializándose y falle de una forma que luego cuesta diagnosticar.",
        },
      ],
    },
    {
      id: "incidente",
      heading: "Una incidencia que enseña más que un tutorial",
      pullQuote:
        "El fallo peligroso no es el que revienta: es el que sigue en pie sin hacer su trabajo.",
      body: [
        "El caso más instructivo que he tenido fue un fallo **silencioso**. Dos contenedores de un cliente que consume una API de terceros aparecían como `healthy`, conectados y sin un solo error en los logs. Simplemente habían dejado de avanzar. Varios días sin completar una sola tarea.",
        "El diagnóstico llevó su tiempo precisamente porque no había nada roto que mirar. Resultó que el servicio remoto había dejado de aceptar la señal periódica que el cliente enviaba por una mutación GraphQL: la ignoraba sin devolver error. El método alternativo, un POST directo a otro endpoint, seguía funcionando y de hecho ya estaba en el código fuente, sin usar. Lo confirmé contra el repositorio original del proyecto, donde había una incidencia abierta con el mismo síntoma.",
        "Apliqué el parche editando el fichero dentro de los contenedores. Y ahí llegó la lección de verdad: **el arreglo vivía en la capa escribible del contenedor, así que se perdía en cuanto se actualizaba la imagen**. Silenciosamente, otra vez. La solución definitiva fue guardar el fichero parcheado en el host y montarlo de solo lectura desde el stack, de forma que sobreviva a cualquier recreación, y documentar en qué momento habrá que quitar ese montaje para no tapar una futura versión que ya traiga el arreglo.",
      ],
    },
    {
      id: "automatizacion",
      heading: "Automatizar la operación, no solo el servicio",
      bullets: [
        {
          term: "Notificaciones al móvil",
          text: "Un servidor ntfy propio y un script que sigue los logs de varios contenedores en paralelo, detecta los eventos que importan y me avisa. Prefiero enterarme por una notificación que revisando logs.",
        },
        {
          term: "Arranque bajo demanda",
          text: "Uno de los servicios pesados no está encendido de continuo: un proxy escucha en su puerto, detecta la primera conexión y lo levanta; otro proceso lo apaga tras un rato sin uso. Deja de consumir CPU las horas en que no lo necesita nadie, que son casi todas.",
        },
        {
          term: "Alta de configuración por script",
          text: "Añadir una cuenta a un stack de automatización es un script que pide la contraseña por consola sin guardarla, calcula el siguiente hueco libre, enseña el diff, solo aplica si confirmas, redespliega por la API de Portainer y comprueba que el contenedor arrancó.",
        },
      ],
    },
    {
      id: "aprendizaje",
      heading: "Qué me llevo",
      body: [
        "Que los fallos que de verdad cuestan dinero son los silenciosos. Un contenedor que se cae genera una alerta; uno que sigue en pie sin hacer su trabajo puede pasar días sin que nadie se entere. Desde entonces, cuando monto algo, pienso primero en cómo me voy a enterar de que ha dejado de funcionar.",
        "Y que un arreglo que no sobrevive a un despliegue no es un arreglo. Es una cuenta atrás.",
      ],
    },
  ],
  links: [],
  repo: {
    visibility: "private",
    note: "La configuración incluye credenciales y topología de red de una máquina en producción, así que el repositorio es privado.",
  },
};
