// Solo cadenas de interfaz. El contenido (casos, trayectoria, competencias)
// vive en content/, para no tener que mantener texto largo por triplicado.
export const es = {
  metadata: {
    title: "Fernando Martínez · Desarrollador Full Stack · agentes de IA · integración de LLM",
    description:
      "Desarrollador full stack en Marbella que construye y pone en marcha software con un equipo de agentes de IA: un LLM con aprobación humana en el ERP de su empresa, agentes de IA en paralelo, un modelo de visión en local y productos en internet con Python, Laravel, Astro y Docker.",
    ogTitle: "Fernando Martínez · Desarrollador Full Stack · agentes de IA · integración de LLM",
    ogDescription:
      "Un LLM con aprobación humana dentro de un ERP, agentes de IA en paralelo y Adivinadle, un producto completo en internet. Proyectos contados por dentro.",
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
    search: "Buscar",
    skipToContent: "Saltar al contenido",
  },

  footer: {
    role: "Desarrollador Full Stack · Marbella, España",
    tech: "Hecho con Next.js y autoalojado en Ubuntu",
    rights: "Todos los derechos reservados",
    sections: "Secciones",
    elsewhere: "En otros sitios",
  },

  home: {
    role: "Desarrollador Full Stack",
    tags: "agentes de IA · integración de LLM",
    intro:
      "Construyo y pongo en marcha software con un equipo de agentes de IA. En mi empresa metí un LLM en el ERP con borrador y aprobación humana; por mi cuenta, con ese equipo, he puesto en internet Adivinadle, un producto completo.",
    location: "Marbella, España · disponible en remoto o presencial",
    ctaCv: "Descargar CV",
    ctaCvNote: "PDF",
    ctaAdivinadle: "Adivinadle",
    ctaEmail: "Escríbeme",
    demo: {
      caption: "Así funciona el LLM que puse en el ERP de mi empresa: la IA propone, una persona aprueba. (Ejemplo ilustrativo.)",
      file: "Ficha de producto",
      product: "Polo de alta visibilidad",
      draft: "Borrador generado por IA",
      text: "Polo de trabajo en tejido transpirable con bandas reflectantes certificadas. Pensado para jornadas largas al aire libre: seca rápido, mantiene el color y aguanta lavados industriales.",
      proposedBy: "Propuesto por",
      proposedByValue: "modelo de OpenAI",
      reviewer: "Revisa",
      reviewerValue: "responsable de catálogo",
      reject: "Rechazar",
      approve: "Aprobar y publicar",
      approved: "Aprobado por una persona",
    },
    proof: [
      { value: "LLM en el ERP", text: "con aprobación humana, en uso en mi empresa", href: "/work/uniformes-bahia" },
      { value: "Adivinadle", text: "en internet: 9 juegos, CI con e2e y Lighthouse", href: "/work/adivinadle" },
      { value: "Agentes en paralelo", text: "con relevo de contexto y coste medido", href: "/work/agentes-ia" },
      { value: "Visión en local", text: "6 de 6 pantallas y 15 de 15 clics, sin entrenar", href: "/work/vision-local" },
    ],
    workHeading: "Proyectos",
    workIntro: "Lo que he llevado a producción, contado por dentro: el problema, las decisiones y lo que aprendí.",
    workAll: "Ver todos los proyectos",
    experienceHeading: "Experiencia",
    experienceAll: "Ver la trayectoria completa",
    present: "actualidad",
    aboutHeading: "La calidad la pone el sistema que hay alrededor",
    about: [
      "Que una IA genere código no significa que esté listo para producción. Por eso todo lo que construyo con agentes pasa por diseño por escrito, tests, CI obligatoria y revisión, y lo que publica un LLM lo aprueba antes una persona.",
      "Vengo del desarrollo full stack (Técnico Superior en DAW, proyecto final con Matrícula de Honor) y administro mi propio servidor con más de cien contenedores. Eso me da algo poco habitual: sé construir con IA y también mantener lo construido funcionando.",
    ],
    stackHeading: "Habilidades",
    stackAll: "Ver todas las habilidades",
    educationHeading: "Formación e idiomas",
    education: [
      "Técnico Superior en Desarrollo de Aplicaciones Web (DAW), I.E.S. Salduba, 2024–2026. Proyecto final: 10 con Matrícula de Honor.",
      "AWS Cloud Practitioner Essentials · Cisco Cybersecurity Essentials.",
      "Español nativo · Inglés B2 (Cambridge) · carnet de conducir y coche propio.",
    ],
    contactHeading: "¿Hablamos?",
    contactIntro:
      "Si encajo en lo que buscas, escríbeme y lo hablamos. Respondo en 24-48 horas.",
    contactCta: "Escribir un mensaje",
  },

  work: {
    title: "Trabajo",
    intro:
      "Proyectos que explican mejor lo que sé hacer que cualquier lista de tecnologías. Cada uno cuenta el problema de partida, las decisiones que tomé y lo que quedó sin resolver.",
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
    liveMetrics: {
      checkedAt: "Comprobado {{time}}",
    },
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
      activity: "Actividad de código",
    },
    verifyCredential: "Ver credencial",
    references: {
      title: "Referencias",
      text: "Puedo facilitar referencias del Ayuntamiento de Marbella y del I.E.S. Salduba a quien las solicite.",
    },
    present: "Actualidad",
    relatedCase: "Caso relacionado",
    downloadCv: "Descargar CV en PDF",
    activity: {
      caption: "Últimos 12 meses en GitHub, tal y como los muestra mi perfil público.",
      totalCount: "{{count}} contribuciones en los últimos 12 meses",
      legendLess: "Menos",
      legendMore: "Más",
      tooltip: "{{count}} contribuciones el {{date}}",
      stale: "Mostrando el último dato disponible.",
    },
  },

  stackPage: {
    title: "Stack",
    intro:
      "Las herramientas con las que trabajo de forma habitual, agrupadas por función. Están aquí porque las he usado en algo que funciona, no porque haya visto un tutorial.",
    principlesTitle: "Cómo trabajo",
    principles: [
      "Un LLM propone; lo que llega a producción lo aprueba una persona o lo valida una prueba contra la fuente.",
      "Antes de entrenar o cambiar de modelo, se mide con un conjunto de prueba.",
      "Un fallo silencioso es peor que una caída. Si algo puede dejar de funcionar sin avisar, primero monto el aviso.",
      "El despliegue forma parte del producto: si soltar una versión da pereza, se sueltan menos versiones.",
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
      genericError: "No se pudo enviar el mensaje. Inténtalo de nuevo en unos minutos.",
      rateLimitError: "Demasiados intentos. Espera un poco antes de volver a escribir.",
      unavailableTitle: "El formulario no está disponible ahora mismo",
      unavailableDesc: "Escríbeme directamente y te respondo en 24-48 horas.",
      unavailableCta: "Escribir un correo",
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
          detail: "Servicios en su propio segmento de red, separados en capa 2.",
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
    list: {
      "bg-remover": {
        title: "BG-Remover",
        description: "Elimina el fondo de cualquier imagen instantáneamente usando IA directamente en tu navegador.",
      },
      "image-forge": {
        title: "Image Forge",
        description: "Convierte y redimensiona imágenes entre múltiples formatos (WebP, AVIF, PNG, JPG).",
      },
      "image-compressor": {
        title: "Compresor de Imágenes",
        description: "Reduce el peso de tus imágenes manteniendo la calidad para optimizar tiempos de carga.",
      },
      "exif-reader": {
        title: "Extractor de Metadatos",
        description: "Lee información EXIF de tus fotos: modelo de cámara, fecha, ubicación GPS y más.",
      },
      "color-blindness": {
        title: "Simulador de Daltonismo",
        description: "Visualiza cómo perciben tus imágenes personas con deuteranopia, protanopia, tritanopia y más.",
      },
      "palette-extractor": {
        title: "Extractor de Paleta",
        description: "Extrae los colores dominantes de cualquier imagen en HEX, RGB y HSL.",
      },
      "image-color-picker": {
        title: "Color Picker",
        description: "Haz clic en cualquier punto de una imagen para capturar su color exacto en HEX, RGB y HSL.",
      },
      "gradient-generator": {
        title: "Generador de Gradientes",
        description: "Crea gradientes CSS lineales, radiales y cónicos visualmente. Copia el CSS al instante.",
      },
      "favicon-generator": {
        title: "Favicon Generator",
        description: "Genera el pack completo de favicons (16×16 a 512×512) desde cualquier imagen.",
      },
      "video-crunch": {
        title: "Video Crunch",
        description: "Comprime vídeos y conviértelos a GIF usando la potencia de FFmpeg.wasm sin salir de la página.",
      },
      "snippet-generator": {
        title: "Snippet Generator",
        description: "Transforma tu código en imágenes con estilos atractivos para compartir en redes.",
      },
      "json-formatter": {
        title: "JSON Formatter",
        description: "Valida, formatea o minifica tus estructuras JSON de forma rápida y segura.",
      },
      "svg-to-datauri": {
        title: "SVG to Data URI",
        description: "Convierte archivos SVG en cadenas URI para usar directamente en CSS o HTML.",
      },
      "code-beautifier": {
        title: "Code Beautifier",
        description: "Embellece o minifica código HTML, CSS y JavaScript instantáneamente en el navegador.",
      },
      "word-counter": {
        title: "Contador de Palabras",
        description: "Analiza texto con estadísticas detalladas, tiempo de lectura e índice de legibilidad.",
      },
      "text-diff": {
        title: "Comparador de Textos",
        description: "Compara dos textos lado a lado con resaltado de diferencias estilo Git diff.",
      },
      "lorem-ipsum": {
        title: "Lorem Ipsum Generator",
        description: "Genera texto placeholder profesional en español o inglés: párrafos, palabras o listas.",
      },
      "markdown-editor": {
        title: "Editor Markdown",
        description: "Escribe Markdown y visualiza el resultado en tiempo real. Exporta a .md o .html.",
      },
      "password-generator": {
        title: "Password Generator",
        description: "Genera contraseñas seguras con configuración avanzada y medidor de entropía en tiempo real.",
      },
      "hash-generator": {
        title: "Hashing Tool",
        description: "Genera hashes criptográficos MD5, SHA-256 y SHA-512 para verificar integridad de datos.",
      },
      base64: {
        title: "Base64 Encoder/Decoder",
        description: "Codifica y decodifica texto o archivos en Base64. Fundamental para desarrollo web.",
      },
      "text-encryptor": {
        title: "Text Encryptor",
        description: "Encripta mensajes con AES usando una contraseña. Perfecto para compartir información sensible.",
      },
      "jwt-decoder": {
        title: "JWT Decoder",
        description: "Decodifica y analiza tokens JWT. Visualiza header, payload y fecha de expiración.",
      },
      "data-converter": {
        title: "Data Units Converter",
        description: "Convierte entre Bytes, KB, MB, GB, TB con precisión binaria (KiB) y decimal.",
      },
      "unix-timestamp": {
        title: "Unix Timestamp",
        description: "Convierte fechas normales a timestamp Unix y viceversa. Esencial para bases de datos.",
      },
      "csv-json": {
        title: "CSV to JSON",
        description: "Convierte archivos CSV a JSON y viceversa. Ideal para migración de datos y APIs.",
      },
      "qr-code": {
        title: "QR Code Generator",
        description: "Genera códigos QR personalizados y lee QR desde imágenes. Soporta URLs, texto y vCards.",
      },
      "aspect-ratio": {
        title: "Calculadora Aspect Ratio",
        description: "Calcula y escala dimensiones manteniendo la proporción. Ideal para imágenes y vídeos responsive.",
      },
      "gitignore-generator": {
        title: ".gitignore Generator",
        description: "Genera archivos .gitignore personalizados según tu stack tecnológico con templates actualizados.",
      },
      "readme-generator": {
        title: "README.md Generator",
        description: "Crea READMEs profesionales para GitHub con plantillas, badges y secciones personalizables.",
      },
      "regex-tester": {
        title: "Regex Tester",
        description: "Prueba expresiones regulares en tiempo real con resaltado de coincidencias y grupos.",
      },
      "cron-helper": {
        title: "Cron Helper",
        description: "Construye y comprende expresiones cron en lenguaje natural. Muestra próximas ejecuciones.",
      },
      "nba-scores": {
        title: "NBA Live Scores",
        description: "Sigue los marcadores de la NBA en tiempo real. Partidos en directo, finales y programación con auto-refresh.",
      },
    },
  },

  // Common Labels
  errors: {
    notFoundTitle: "Página no encontrada",
    notFoundDesc: "El enlace está roto o la página se ha movido. Prueba desde el inicio.",
    notFoundCta: "Volver al inicio",
    genericTitle: "Algo ha fallado",
    genericDesc: "Se ha producido un error inesperado. Puedes reintentar o volver al inicio.",
    retryCta: "Reintentar",
    homeCta: "Volver al inicio",
  },

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
