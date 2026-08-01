// Solo cadenas de interfaz. El contenido (casos, trayectoria, competencias)
// vive en content/, para no tener que mantener texto largo por triplicado.
export const es = {
  metadata: {
    title: "Fernando Martínez · Desarrollador full stack",
    description:
      "Desarrollador full stack en Marbella. Laravel, React y PostgreSQL, con software en producción para administración pública y proyectos propios.",
    ogTitle: "Fernando Martínez · Desarrollador full stack",
    ogDescription:
      "Casos de estudio de software real: gestión municipal, plataformas de servicios e infraestructura autoalojada.",
    siteName: "Fernando Martínez",
  },

  nav: {
    home: "Inicio",
    work: "Trabajo",
    experience: "Experiencia",
    stack: "Stack",
    tools: "Laboratorio",
    contact: "Contacto",
    openMenu: "Abrir menú",
    closeMenu: "Cerrar menú",
    toggleTheme: "Cambiar entre tema claro y oscuro",
    language: "Idioma",
    skipToContent: "Saltar al contenido",
  },

  footer: {
    role: "Desarrollador full stack · Marbella, España",
    tech: "Hecho con Next.js y autoalojado en Ubuntu",
    rights: "Todos los derechos reservados",
    sections: "Secciones",
    elsewhere: "En otros sitios",
  },

  home: {
    role: "Desarrollador full stack",
    specialties: "Laravel · React · PostgreSQL",
    intro:
      "Construyo software que acaba en producción y se queda ahí: sistemas de gestión para administración pública, plataformas de servicios y la infraestructura que los sostiene. Aquí no hay capturas de proyectos de curso, hay casos contados por dentro.",
    facts: {
      role: "Puesto actual",
      location: "Ubicación",
      languages: "Idiomas",
      languagesValue: "Español nativo · Inglés B2",
      focus: "Trabajo en",
    },
    headline: "Software que llega",
    headlineAccent: "a producción",
    stats: [
      { value: "5", label: "proyectos documentados" },
      { value: "25", label: "contenedores en producción" },
      { value: "34+", label: "entidades modeladas" },
      { value: "3", label: "idiomas" },
    ],
    ctaWork: "Ver los casos",
    ctaCv: "Descargar CV",
    nowLabel: "Ahora",
    nowSince: "desde",
    workEyebrow: "Trabajo seleccionado",
    workHeading: "Proyectos contados por dentro",
    workIntro:
      "Qué problema había, qué decidí y qué quedó pendiente. Sin adornos.",
    workAll: "Ver todos los casos",
    aboutEyebrow: "Sobre mí",
    aboutHeading: "Me interesa el software que aguanta el paso del tiempo",
    about: [
      "Soy Técnico Superior en Desarrollo de Aplicaciones Web y trabajo sobre todo con Laravel, React y bases de datos relacionales. Mis prácticas fueron en el Ayuntamiento de Marbella, construyendo un sistema de gestión de expedientes que tenía que sobrevivir a los funcionarios que lo iban a usar y a los datos heredados que tenía que digerir.",
      "Lo que más me ha enseñado, sin embargo, es mantener mi propio servidor. Veinticinco contenedores en marcha, incidencias reales y la lección de que el fallo que de verdad duele no es el que revienta, sino el que sigue en pie sin hacer su trabajo.",
    ],
    stackEyebrow: "Stack",
    stackHeading: "Con lo que trabajo",
    stackAll: "Ver el stack completo",
    labEyebrow: "Laboratorio",
    labHeading: "Un laboratorio de utilidades web",
    labIntro:
      "Una colección de herramientas que uso a diario y que funcionan enteras en el navegador: nada de lo que subes sale de tu equipo.",
    labCta: "Entrar al laboratorio",
    contactHeading: "¿Hablamos?",
    contactIntro:
      "Si te encaja algo de lo que has visto, escríbeme y lo hablamos. Respondo en 24-48 horas.",
    contactCta: "Escríbeme",
  },

  work: {
    title: "Trabajo",
    intro:
      "Cinco proyectos que explican mejor lo que sé hacer que cualquier lista de tecnologías. Cada uno cuenta el problema de partida, las decisiones que tomé y lo que quedó sin resolver.",
    columns: {
      project: "Proyecto",
      client: "Cliente",
      year: "Año",
    },
    groups: {
      professional: "Trabajo profesional",
      professionalNote: "Proyectos con cliente, empresa o entrega académica.",
      personal: "Proyectos propios",
      personalNote: "Cosas que mantengo por mi cuenta, en marcha de verdad.",
    },
    read: "Leer el caso",
    backToIndex: "Todos los casos",
    nextCase: "Siguiente caso",
    meta: {
      client: "Cliente",
      period: "Periodo",
      role: "Rol",
      stack: "Stack",
    },
    repoPublic: "Ver el código en GitHub",
    repoPrivate: "Repositorio privado",
    onThisPage: "En esta página",
    figureLabel: "Figura",
  },

  experience: {
    title: "Experiencia",
    intro:
      "Trayectoria, formación y competencias. Cada bloque de competencias enlaza al caso donde puedes comprobarlo.",
    sections: {
      work: "Trayectoria profesional",
      education: "Formación",
      certifications: "Certificaciones",
      skills: "Competencias",
    },
    verifyCredential: "Ver credencial",
    references: {
      title: "Referencias",
      text: "Puedo facilitar referencias del Ayuntamiento de Marbella y del I.E.S. Salduba a quien las solicite.",
    },
    present: "Actualidad",
    relatedCase: "Caso relacionado",
    downloadCv: "Descargar CV en PDF",
  },

  stackPage: {
    title: "Stack",
    intro:
      "Las herramientas con las que trabajo de forma habitual, agrupadas por función. Están aquí porque las he usado en algo que funciona, no porque haya visto un tutorial.",
    principlesTitle: "Cómo trabajo",
    principles: [
      "Las reglas de negocio van donde no se puedan saltar: en una policy o en un scope, no en un botón oculto.",
      "Un fallo silencioso es peor que una caída. Si algo puede dejar de funcionar sin avisar, primero monto el aviso.",
      "El despliegue forma parte del producto: si soltar una versión da pereza, se sueltan menos versiones.",
      "Prefiero un esquema de datos aburrido y bien normalizado a un atajo que haya que deshacer en seis meses.",
    ],
  },

  contact: {
    title: "Contacto",
    intro:
      "Cuéntame qué necesitas y te respondo en 24-48 horas. Si prefieres escribirme directamente, ahí tienes mi correo.",
    form: {
      name: "Nombre",
      email: "Email",
      message: "Mensaje",
      namePlaceholder: "Tu nombre",
      emailPlaceholder: "tu@email.com",
      messagePlaceholder: "Cuéntame en qué estás trabajando…",
      submit: "Enviar mensaje",
      sending: "Enviando…",
      success: "Mensaje enviado",
      successDesc: "Gracias por escribir. Te respondo en 24-48 horas.",
      sendAnother: "Enviar otro mensaje",
    },
    info: {
      emailLabel: "Correo",
      locationLabel: "Ubicación",
      responseLabel: "Respuesta",
      response: "24-48 horas",
      cvLabel: "Currículum",
      cvAction: "Descargar en PDF",
    },
  },

  // Diagramas de los casos (components/case/Figure.tsx)
  figures: {
    vadosFlow: {
      steps: [
        { label: "React + Inertia", note: "el usuario actúa" },
        { label: "Middleware auth", note: "verifica la sesión" },
        { label: "Controlador + Policy", note: "valida y autoriza" },
        { label: "Eloquent + TerritorioScope", note: "filtra por zona" },
        { label: "PostgreSQL", note: "persistencia" },
      ],
      observerLabel: "Observer",
      observerText:
        "En paralelo, `VadoObserver` escribe la auditoría (usuario, DNI, equipo y diferencia `old`/`new`) sin que el controlador intervenga.",
    },
    vadosRoles: {
      caption: "Permisos de lectura y escritura por rol y zona",
      roleHeader: "Rol",
      readWrite: "lectura + escritura",
      readOnly: "solo lectura",
    },
    mfArch: {
      nodeA: { label: "Nodo A", note: "React SPA + API Laravel en contenedores" },
      nodeB: { label: "Nodo B (espejo)", note: "Misma pila, despliegue independiente" },
      vpn: {
        label: "Tailscale · red mesh sobre WireGuard",
        note: "Túnel cifrado punto a punto; el puerto de MySQL nunca sale a internet",
      },
      db: { label: "MySQL 8 · servidor del instituto", note: "Detrás del cortafuegos del centro" },
      footnote:
        "Delante de los dos nodos, Cloudflare actúa como proxy inverso y WAF con SSL/TLS en modo Strict. Portainer consulta GitHub cada cinco minutos y reconstruye los contenedores al detectar cambios.",
    },
    homelabNet: {
      paths: [
        {
          scope: "Público",
          label: "Cloudflare Tunnel",
          detail: "Dominios y sitios. Túnel saliente: el router no abre ningún puerto entrante.",
        },
        {
          scope: "Privado",
          label: "Tailscale",
          detail: "Portainer, paneles internos y SSH. Solo alcanzable desde la red mesh.",
        },
        {
          scope: "Aislado",
          label: "Red ipvlan",
          detail: "Un contenedor colocado en el segmento del segundo módem, sin NAT. Separación en capa 2.",
        },
      ],
    },
    galleryPipeline: {
      steps: [
        { label: "Subida", note: "el cliente envía el fichero" },
        { label: "Comprobación de disco", note: "espacio libre y marcador" },
        { label: "FFmpeg", note: "recompresión con hilos limitados" },
        { label: "YouTube API", note: "OAuth con refresh token" },
        { label: "Notificación", note: "push, ntfy, Discord o correo" },
      ],
      footnote:
        "Si la comprobación de disco falla, el proceso se detiene ahí: es preferible rechazar una subida a llenar el volumen y dejar la base de datos en solo lectura.",
    },
  },

  // Tools Page
  tools: {
    title: "Herramientas",
    subtitle: "Laboratorio de utilidades web",
    description: "Colección de herramientas útiles para desarrollo y tareas cotidianas. Todas funcionan 100% en tu navegador.",
    searchPlaceholder: "Buscar entre {count} herramientas...",
    recentlyUsed: "Usadas recientemente",
    searchResults: "{count} resultado(s) para",
    noResults: "No se encontraron herramientas para",
    categories: {
      image: "Imagen & Color",
      video: "Video",
      code: "Código",
      text: "Texto",
      security: "Seguridad",
      conversion: "Conversión",
      dev: "Desarrollo",
      sports: "Deportes",
    },
    list: [
      {
        title: "BG-Remover",
        description: "Elimina el fondo de cualquier imagen instantáneamente usando IA directamente en tu navegador.",
        category: "image",
      },
      {
        title: "Image Forge",
        description: "Convierte y redimensiona imágenes entre múltiples formatos (WebP, AVIF, PNG, JPG).",
        category: "image",
      },
      {
        title: "Compresor de Imágenes",
        description: "Reduce el peso de tus imágenes manteniendo la calidad para optimizar tiempos de carga.",
        category: "image",
      },
      {
        title: "Extractor de Metadatos",
        description: "Lee información EXIF de tus fotos: modelo de cámara, fecha, ubicación GPS y más.",
        category: "image",
      },
      {
        title: "Simulador de Daltonismo",
        description: "Visualiza cómo perciben tus imágenes personas con deuteranopia, protanopia, tritanopia y más.",
        category: "image",
      },
      {
        title: "Extractor de Paleta",
        description: "Extrae los colores dominantes de cualquier imagen en HEX, RGB y HSL.",
        category: "image",
      },
      {
        title: "Color Picker",
        description: "Haz clic en cualquier punto de una imagen para capturar su color exacto en HEX, RGB y HSL.",
        category: "image",
      },
      {
        title: "Generador de Gradientes",
        description: "Crea gradientes CSS lineales, radiales y cónicos visualmente. Copia el CSS al instante.",
        category: "image",
      },
      {
        title: "Favicon Generator",
        description: "Genera el pack completo de favicons (16×16 a 512×512) desde cualquier imagen.",
        category: "image",
      },
      {
        title: "Video Crunch",
        description: "Comprime vídeos y conviértelos a GIF usando la potencia de FFmpeg.wasm sin salir de la página.",
        category: "video",
      },
      {
        title: "Snippet Generator",
        description: "Transforma tu código en imágenes con estilos atractivos para compartir en redes.",
        category: "code",
      },
      {
        title: "JSON Formatter",
        description: "Valida, formatea o minifica tus estructuras JSON de forma rápida y segura.",
        category: "code",
      },
      {
        title: "SVG to Data URI",
        description: "Convierte archivos SVG en cadenas URI para usar directamente en CSS o HTML.",
        category: "code",
      },
      {
        title: "Code Beautifier",
        description: "Embellece o minifica código HTML, CSS y JavaScript instantáneamente en el navegador.",
        category: "code",
      },
      {
        title: "Contador de Palabras",
        description: "Analiza texto con estadísticas detalladas, tiempo de lectura e índice de legibilidad.",
        category: "text",
      },
      {
        title: "Comparador de Textos",
        description: "Compara dos textos lado a lado con resaltado de diferencias estilo Git diff.",
        category: "text",
      },
      {
        title: "Lorem Ipsum Generator",
        description: "Genera texto placeholder profesional en español o inglés: párrafos, palabras o listas.",
        category: "text",
      },
      {
        title: "Editor Markdown",
        description: "Escribe Markdown y visualiza el resultado en tiempo real. Exporta a .md o .html.",
        category: "text",
      },
      {
        title: "Password Generator",
        description: "Genera contraseñas seguras con configuración avanzada y medidor de entropía en tiempo real.",
        category: "security",
      },
      {
        title: "Hashing Tool",
        description: "Genera hashes criptográficos MD5, SHA-256 y SHA-512 para verificar integridad de datos.",
        category: "security",
      },
      {
        title: "Base64 Encoder/Decoder",
        description: "Codifica y decodifica texto o archivos en Base64. Fundamental para desarrollo web.",
        category: "security",
      },
      {
        title: "Text Encryptor",
        description: "Encripta mensajes con AES usando una contraseña. Perfecto para compartir información sensible.",
        category: "security",
      },
      {
        title: "JWT Decoder",
        description: "Decodifica y analiza tokens JWT. Visualiza header, payload y fecha de expiración.",
        category: "security",
      },
      {
        title: "Data Units Converter",
        description: "Convierte entre Bytes, KB, MB, GB, TB con precisión binaria (KiB) y decimal.",
        category: "conversion",
      },
      {
        title: "Unix Timestamp",
        description: "Convierte fechas normales a timestamp Unix y viceversa. Esencial para bases de datos.",
        category: "conversion",
      },
      {
        title: "CSV to JSON",
        description: "Convierte archivos CSV a JSON y viceversa. Ideal para migración de datos y APIs.",
        category: "conversion",
      },
      {
        title: "QR Code Generator",
        description: "Genera códigos QR personalizados y lee QR desde imágenes. Soporta URLs, texto y vCards.",
        category: "conversion",
      },
      {
        title: "Calculadora Aspect Ratio",
        description: "Calcula y escala dimensiones manteniendo la proporción. Ideal para imágenes y vídeos responsive.",
        category: "conversion",
      },
      {
        title: ".gitignore Generator",
        description: "Genera archivos .gitignore personalizados según tu stack tecnológico con templates actualizados.",
        category: "dev",
      },
      {
        title: "README.md Generator",
        description: "Crea READMEs profesionales para GitHub con plantillas, badges y secciones personalizables.",
        category: "dev",
      },
      {
        title: "Regex Tester",
        description: "Prueba expresiones regulares en tiempo real con resaltado de coincidencias y grupos.",
        category: "dev",
      },
      {
        title: "Cron Helper",
        description: "Construye y comprende expresiones cron en lenguaje natural. Muestra próximas ejecuciones.",
        category: "dev",
      },
      {
        title: "NBA Live Scores",
        description: "Sigue los marcadores de la NBA en tiempo real. Partidos en directo, finales y programación con auto-refresh.",
        category: "sports",
      },
    ],
  },

  // Common Labels
  common: {
    copy: "Copiar",
    copied: "¡Copiado!",
    clear: "Limpiar",
    success: "Éxito",
    error: "Error",
    loading: "Cargando...",
    status: "Estado",
    result: "Resultado",
    actions: "Acciones",
    settings: "Ajustes",
    back: "Volver",
    format: "Formato",
    size: "Tamaño",
    quality: "Calidad",
    download: "Descargar",
  },

  // Components
  components: {
    fileDropzone: {
      defaultLabel: "Arrastra y suelta tu archivo aquí, o haz clic para seleccionar",
      activeLabel: "Suelta el archivo aquí...",
      rejectLabel: "Tipo de archivo no soportado",
      maxSizeLabel: "(Tamaño máximo: {size})",
      removeFile: "Quitar archivo",
    },
  },

  // Tools Specific
  tools_content: {
    wordCounter: {
      title: "Contador de Palabras y Lectura",
      description: "Analiza tu texto con estadísticas detalladas, tiempo estimado de lectura e índice de legibilidad.",
      placeholder: "Escribe o pega tu texto aquí para analizarlo...",
      stats: {
        words: "Palabras",
        characters: "Caracteres",
        noSpaces: "Sin espacios",
        sentences: "Oraciones",
        paragraphs: "Párrafos",
        readingTime: "Lectura",
      },
      analysis: {
        title: "Análisis de Legibilidad",
        readability: "Nivel de lectura",
        wordsPerSentence: "Palabras/oración",
        charsPerWord: "Caracteres/palabra",
        levels: {
          veryEasy: "Muy fácil",
          easy: "Fácil",
          moderate: "Moderado",
          hard: "Difícil",
          veryHard: "Muy difícil",
          na: "N/A",
        },
      },
      minutes: "{count, plural, =1 {1 minuto} other {# minutos}}",
    },
    videoCrunch: {
      title: "Video Crunch",
      description: "Comprime y convierte vídeos localmente usando toda la potencia de WASM en tu navegador.",
      status: {
        loading: "Cargando Motor...",
        compressing: "Comprimiendo...",
        start: "Comprimir Vídeo",
        starting: "Iniciando compresión...",
        done: "Compresión finalizada",
        idle: "Sube un vídeo para comenzar",
        cpuWarning: "Esto puede tardar según tu CPU",
      },
      originalVideo: "Vídeo Original",
      compressionSettings: "Ajustes de Compresión",
      outputSettings: "Ajustes de Salida",
      resolution: "Resolución",
      selectResolution: "Selecciona resolución",
      compressionLevel: "Nivel de Compresión",
      formats: {
        mp4: "MP4 (Máxima Compatibilidad)",
      },
    },
  },
};

export type TranslationKeys = typeof es;
