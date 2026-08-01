import type { CaseStudy } from "../types";

export const galleryEs: CaseStudy = {
  slug: "fmargar-gallery",
  order: 4,
  featured: false,
  title: "fmargar-gallery",
  tagline:
    "Galería privada de clips que se recomprime y se sube sola a YouTube, con guardarraíles para no llenar el disco.",
  client: "Proyecto personal",
  period: "2026",
  year: "2026",
  role: "Diseño y desarrollo completo",
  summary:
    "Una aplicación para subir, organizar y compartir clips de vídeo, con publicación automática en YouTube. Lo interesante no es el CRUD: es todo lo que hay alrededor para que un servicio que maneja ficheros grandes no se autodestruya cuando se queda sin espacio.",
  stack: [
    "Node.js",
    "Express",
    "React",
    "MariaDB",
    "JWT",
    "FFmpeg",
    "YouTube Data API",
    "Web Push (VAPID)",
    "Docker",
    "Nginx",
  ],
  metrics: [
    { value: "3", label: "servicios en contenedores con healthcheck" },
    { value: "4", label: "canales de notificación" },
    { value: "2 TB", label: "de almacenamiento dedicado" },
  ],
  sections: [
    {
      id: "contexto",
      heading: "Contexto",
      body: [
        "Quería un sitio propio donde guardar y compartir clips sin depender de servicios de terceros, pero con la comodidad de tenerlos también publicados. La aplicación son tres contenedores: una API en Node con Express, una base de datos MariaDB y un frontend React servido por Nginx.",
        "La autenticación es por JWT y el catálogo se enriquece con metadatos de juegos a través de la API de RAWG.",
      ],
    },
    {
      id: "pipeline",
      heading: "El pipeline de subida",
      body: [
        "Cuando entra un clip, la API no se limita a guardarlo: lo recomprime con FFmpeg si supera un tamaño mínimo, lo sube a YouTube mediante OAuth con refresh token y decide qué hacer con el original según la configuración.",
      ],
      figure: {
        key: "gallery-pipeline",
        caption: "Cada paso puede desactivarse por variable de entorno; los valores por defecto están duplicados en el compose a propósito.",
      },
      bullets: [
        {
          term: "Recompresión con hilos limitados",
          text: "El transcodificado usa un número fijo y bajo de hilos. El servidor comparte CPU con otros servicios, y un FFmpeg sin límite se come la máquina entera y degrada todo lo demás.",
        },
        {
          term: "Umbral mínimo",
          text: "Por debajo de cierto tamaño no se recomprime. El ahorro no compensa el coste de CPU ni la pérdida de calidad.",
        },
      ],
    },
    {
      id: "guardarrailes",
      heading: "Guardarraíles: la parte que evita los desastres",
      body: [
        "Un servicio que escribe ficheros de cientos de megas necesita saber decir que no. Estos son los frenos que le puse, y los tres vienen de un problema real.",
      ],
      bullets: [
        {
          term: "Los clips no viven en el disco del sistema",
          text: "Están en un disco dedicado de 2 TB montado con `nofail`. Antes compartían los 216 GB de la raíz con el sistema operativo y con MariaDB: si las subidas llenaban el disco, la base de datos podía quedarse en modo solo lectura. Ahora, en el peor caso, fallan las subidas y la galería sigue de pie.",
        },
        {
          term: "Un marcador que aborta el arranque",
          text: "El contenedor busca un fichero marcador que solo existe dentro del disco de datos. Si no lo encuentra —porque el disco no se montó— el `entrypoint` aborta en vez de arrancar. Sin esa comprobación, Docker crearía un directorio vacío en el punto de montaje y el servicio empezaría a escribir en el disco del sistema sin avisar. Otra vez el mismo patrón: el fallo peligroso es el que no da error.",
        },
        {
          term: "Umbrales de espacio libre",
          text: "Un mínimo por debajo del cual se rechazan las subidas y un umbral de aviso que dispara una notificación antes de llegar ahí.",
        },
      ],
    },
    {
      id: "notificaciones",
      heading: "Notificaciones",
      body: [
        "El servicio avisa por cuatro vías según el tipo de evento: **web push** con VAPID para el navegador, **ntfy** para el móvil, **webhook de Discord** y correo por SMTP. Todas son opcionales por variable de entorno, así que el servicio arranca igual en un entorno de desarrollo donde no haya ninguna configurada.",
      ],
    },
    {
      id: "aprendizaje",
      heading: "Qué me llevo",
      body: [
        "Que el trabajo de verdad en un servicio que maneja ficheros está en los caminos que no son el feliz. Subir un vídeo son veinte líneas; que subir un vídeo no pueda tumbar la base de datos son varias tardes y un incidente previo.",
        "También aprendí a duplicar los valores por defecto en el fichero de compose en lugar de dejarlos solo en el código: si una variable no se declara ahí, Portainer no la pasa al contenedor y el ajuste deja de tener efecto en silencio.",
      ],
    },
  ],
  links: [],
  repo: {
    visibility: "private",
    note: "Repositorio privado: la configuración incluye credenciales de la API de YouTube y de las notificaciones.",
  },
};
