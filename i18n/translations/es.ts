export const es = {
  // Layout & Metadata
  metadata: {
    title: "Fernando Martínez | Full Stack Developer",
    description: "Desarrollador Full Stack especializado en arquitecturas modernas, Cloud y soluciones empresariales de alto rendimiento.",
    openGraph: {
      title: "Fernando Máximo | Full Stack Developer",
      description: "Portafolio profesional de Fernando Máximo. Especialista en React, Next.js, Node.js y soluciones Cloud.",
      siteName: "Fernando Máximo Portfolio",
    },
  },

  // Navbar
  navbar: {
    links: {
      showcase: "Showcase",
      stack: "Stack",
      experience: "Experiencia",
      tools: "Herramientas",
      contact: "Contacto",
    },
    mobileMenu: "Tema y perfil",
    bb8Tooltip: "¡Pulsa para invocar a BB-8!",
  },

  // Footer
  footer: {
    links: {
      projects: "Proyectos",
      stack: "Stack",
      experience: "Experiencia",
      lab: "Laboratorio",
      contact: "Contacto",
    },
    role: "Full Stack Developer · DAW · Marbella, ES",
    tech: "Hecho en Next.js · self-hosted Ubuntu",
    copyright: "© 2026 Fernando Máximo · Todos los derechos reservados",
  },

  // Homepage
  home: {
    badges: {
      role: "Full Stack Developer (DAW)",
      location: "Marbella, ES",
      cert1: "English B2 · Cambridge",
      cert2: "AWS Certified",
    },
    subtitle: "Portfolio · 2026 · Marbella",
    typewriter: [
      "Arquitecturas modernas.",
      "Interfaces de alto impacto.",
      "Soluciones Cloud escalables.",
      "Full Stack con visión.",
      "Código que genera valor.",
    ],
    description: "Técnico Superior en Desarrollo de Aplicaciones Web por IES Salduba. Especializado en React, Next.js, Node.js y Cloud.",
    cta: {
      projects: "Ver Proyectos",
      contact: "Contacto",
    },
    scroll: "Descubre más",
    availability: "Disponible para nuevos proyectos",
    finalCta: {
      title: "¿Listo para construir algo increíble?",
      button: "Empecemos ahora",
    },
    aboutMe: {
      badge: "Sobre mí",
      heading: "Impulsando el futuro con código y creatividad.",
      extra: "Soy un apasionado de la tecnología que busca constantemente superar los límites de lo que es posible en la web. Mi enfoque se centra en crear experiencias digitales fluidas, seguras y visualmente impactantes que resuelvan problemas reales.",
      features: [
        { title: "Clean Code", description: "Arquitecturas escalables y mantenibles." },
        { title: "Performance", description: "Optimización de carga y experiencia de usuario." },
        { title: "Full Stack", description: "Domino desde la UI hasta la infraestructura." },
      ],
    },
    experienceHighlights: {
      badge: "Trayectoria",
      heading: "Experiencia",
      headingAccent: "Profesional",
      cta: "Explorar historial completo",
    },
    featuredProjects: {
      badge: "Showcase",
      heading: "Proyectos",
      headingAccent: "Destacados",
      cta: "Ver todos los proyectos",
    },
    certifications: {
      badge: "Certificaciones",
      heading: "Validados por",
      headingAccent: "Líderes de la Industria",
      credential: "Ver credencial",
    },
  },

  // Bento Dashboard
  bento: {
    title: "Centro de Operaciones",
    activity: "Actividad de Desarrollo",
    github: {
      title: "GitHub Pulse",
      commits: "commits esta semana",
      active: "activo",
      subtitle: "Flujo reciente de contribuciones",
      viewProfile: "Ver Perfil",
      analyzing: "Analizando repositorio...",
      weeks: "semanas",
    },
    calendarMonths: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'] as string[],
    calendarMonthsShort: ['E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'] as string[],
    calendarWeekdays: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'] as string[],
    calendarLess: 'Menos',
    calendarMore: 'Más',
    terminal: {
      title: "Terminal",
      logs: [
        "Iniciando servidor de desarrollo...",
        "Next.js compilado correctamente",
        "Servidor disponible en puerto 3000",
        "Base de datos conectada OK",
        "Sistema de autenticación activo",
      ],
    },
    project: {
      focus: "Proyecto en Desarrollo",
      name: "Marbella Fácil",
      description: "Plataforma de información sobre gestiones, trámites y servicios en Marbella. React + TypeScript + Maps API.",
      viewArchitecture: "Ver Arquitectura",
    },
    techEngine: {
      title: "Motor de Desarrollo",
      subtitle: "Ecosistema principal de producción",
    },
  },

  // Projects Page
  projects: {
    title: "Proyectos Destacados",
    badge: "Showcase · Fernando Máximo",
    description: "Una selección de mis trabajos más recientes — desde plataformas empresariales hasta herramientas de laboratorio personal.",
    cta: "Ver todos mis repositorios",
    buttons: {
      github: "GitHub",
      demo: "Demo",
      private: "Repositorio privado",
      privateLabel: "Privado",
    },
    meta: [
      { label: "Plataforma SaaS" },
      { label: "App Empresarial" },
      { label: "Portfolio & Lab" },
    ],
    list: [
      {
        title: "Marbella Fácil",
        description: "Plataforma SaaS integral orientada al turismo inteligente. Backend robusto en Laravel 10 con arquitectura SPA mediante React e Inertia.js. Incluye gestión dinámica de suscripciones, sistema transaccional de reservas en tiempo real y monitorización meteorológica.",
        tech: ["Laravel 10", "React", "Inertia.js", "MySQL", "SaaS"],
      },
      {
        title: "Sistema de Vados",
        description: "Solución empresarial para la gestión de vados del Ayuntamiento de Marbella. Lógica de negocio compleja, sistemas de auditoría, despliegue en Intranet e integración con Directorio Activo (LDAP).",
        tech: ["PHP", "PostgreSQL", "LDAP", "Intranet"],
      },
      {
        title: "Dev-Hub Fernando",
        description: "Mi portafolio personal y laboratorio de herramientas IA/WA. Procesamiento de archivos local mediante FFmpeg.wasm, diseño premium con Framer Motion y arquitectura orientada al despliegue en servidor propio.",
        tech: ["Next.js 15", "React", "FFmpeg.wasm", "Docker"],
      },
    ],
  },

  // Stack Page
  stack: {
    title: "Stack Tecnológico",
    badge: "Ecosistema · Fernando Máximo",
    techs: "techs",
    description: "Un ecosistema de herramientas cuidadosamente seleccionadas para construir software robusto, escalable y seguro.",
    categories: {
      backend: "Backend & Core",
      frontend: "Frontend & UI",
      infra: "Infrastructure & DevOps",
      database: "Databases",
    },
    principles: {
      title: "Principios",
      list: [
        "Arquitectura limpia y escalable",
        "Code quality y testing",
        "Performance y optimización",
        "Seguridad y best practices",
      ],
    },
  },

  // Experience Page
  experience: {
    title: "Experiencia",
    badge: "Trayectoria · Fernando Máximo",
    description: "Mi trayectoria profesional y formación académica, centrada en el desarrollo de software de alto impacto y la mejora continua.",
    sections: {
      history: "Historial Profesional",
      certifications: "Certificaciones",
      skills: "Competencias",
    },
    current: "Actualidad",
    technicalSkills: "Habilidades Técnicas",
    selfAssessment: "Autoevaluación técnica · 2026",
    certModal: {
      issuer: "Emisor",
      description: "Descripción",
      clickHint: "Clic para ver detalles →",
      close: "Cerrar",
    },
    timeline: [
      {
        id: "4",
        role: "Desarrollador Backend & BBDD",
        company: "Ayuntamiento de Marbella",
        start_date: "2026-03-01",
        end_date: null,
        description: "Migración y unificación de bases de datos de Marbella y San Pedro desde archivos CSV a una arquitectura relacional sólida en PostgreSQL. Desarrollo de una aplicación web CRUD integral para la gestión de vados, implementando sistemas de auditoría, despliegue en la Intranet municipal e integración con Directorio Activo (LDAP) para garantizar acceso seguro.",
        current: true,
      },
      {
        id: "1",
        role: "Desarrollador Web (Prácticas)",
        company: "ASISA",
        start_date: "2025-01-01",
        end_date: "2025-06-30",
        description: "Gestión técnica de portales corporativos. Optimización de rendimiento mediante la configuración de módulos y refactorización de código. Colaboración en el diseño UI/UX para asegurar interfaces responsivas y accesibles en entornos empresariales de alta demanda.",
        current: false,
      },
      {
        id: "3",
        role: "Grado Superior DAW",
        company: "I.E.S. Salduba",
        start_date: "2024-09-15",
        end_date: null,
        description: "Formación técnica en desarrollo Full Stack. Especialización en Java (Spring Boot), PHP (Laravel), Bases de Datos (MySQL) y control de versiones colaborativo con Git/GitHub.",
        current: true,
      },
      {
        id: "2",
        role: "Vendedor Técnico",
        company: "Alcampo",
        start_date: "2024-06-01",
        end_date: "2024-09-01",
        description: "Asesoramiento hardware y soluciones tecnológicas. Resolución de incidencias técnicas bajo presión y gestión avanzada de stock e inventario.",
        current: false,
      },
    ],

    certifications: [
      {
        id: "c1",
        title: "English B2 (First Certificate)",
        issuer: "Cambridge Assessment English",
        date: "2022",
        description: "Competencia intermedia-alta certificada, capaz de comunicarse con fluidez en entornos profesionales y técnicos."
      },
      {
        id: "c2",
        title: "AWS Cloud Practitioner",
        issuer: "Amazon Web Services (AWS)",
        date: "2025",
        description: "Fundamentos de la nube, servicios principales, seguridad y modelos de precios de AWS."
      },
      {
        id: "c3",
        title: "Cybersecurity Essentials",
        issuer: "Cisco Networking Academy",
        date: "2025",
        description: "Principios de protección de datos, mitigación de amenazas y seguridad en redes corporativas."
      }
    ],

    softSkills: [
      "Resolución de problemas",
      "Comunicación técnica",
      "Adaptabilidad tecnológica",
      "Trabajo en equipo",
      "Liderazgo técnico",
    ],

  },

  // Contact Page
  contact: {
    title: "Contacto",
    subtitle: "¿Tienes un proyecto en mente?",
    description: "Estoy disponible para nuevos proyectos y colaboraciones. Envíame un mensaje y hablemos.",
    form: {
      name: "Nombre",
      email: "Email",
      message: "Mensaje",
      namePlaceholder: "Tu nombre",
      emailPlaceholder: "tu@email.com",
      messagePlaceholder: "Cuéntame sobre tu proyecto...",
      submit: "Enviar Propuesta",
      success: "¡Transmisión Exitosa!",
      successDesc: "Tu mensaje ha sido recibido. Te responderé pronto.",
      sendAnother: "Enviar otro mensaje",
    },
    info: {
      location: "Marbella, España",
      availability: "Disponible para proyectos freelance",
      response: "Respondo en 24-48h",
      directEmail: "Email Directo",
      locationLabel: "Ubicación",
      availabilityLabel: "Disponibilidad",
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
