export const es = {
  // Layout & Metadata
  metadata: {
    title: "Fernando Martínez | Full Stack Developer",
    description: "Desarrollador Full Stack especializado en arquitecturas modernas, Cloud y soluciones empresariales de alto rendimiento.",
    openGraph: {
      title: "Fernando Martínez | Full Stack Developer",
      description: "Portafolio profesional de Fernando Martínez. Especialista en React, Next.js, Node.js y soluciones Cloud.",
      siteName: "Fernando Martínez Portfolio",
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
    copyright: "© 2026 Fernando Martínez · Todos los derechos reservados",
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
  },

  // Bento Dashboard
  bento: {
    title: "Centro de Operaciones",
    activity: "Actividad de Desarrollo",
    github: {
      title: "GitHub Pulse",
      commits: "commits esta semana",
      active: "activo",
      subtitle: "Flujo de contribuciones de los últimos 5 meses",
      viewProfile: "Ver Perfil",
      analyzing: "Analizando repositorio...",
    },
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
    categories: {
      image: "Imagen",
      video: "Video",
      code: "Código",
      text: "Texto",
      security: "Seguridad",
      conversion: "Conversión",
      dev: "Desarrollo",
    },
    list: [
      {
        title: "Eliminar Fondo",
        description: "Elimina fondos de imágenes automáticamente con IA. Sin subir archivos a servidores.",
        category: "image",
      },
      {
        title: "Image Forge",
        description: "Editor de imágenes completo: redimensionar, recortar, filtros, ajustes y más.",
        category: "image",
      },
      {
        title: "Compresor de Imágenes",
        description: "Comprime JPG, PNG y WebP sin pérdida visible de calidad. Optimización inteligente.",
        category: "image",
      },
      {
        title: "Conversor de Imágenes",
        description: "Convierte entre formatos: JPG, PNG, WebP, AVIF, GIF. Procesamiento local.",
        category: "image",
      },
      {
        title: "Video Trimmer",
        description: "Recorta videos sin recodificar. Selección precisa de inicio y fin.",
        category: "video",
      },
      {
        title: "Extractor de Audio",
        description: "Extrae la pista de audio de cualquier video. Formatos MP3, WAV, AAC.",
        category: "video",
      },
      {
        title: "GIF Maker",
        description: "Crea GIFs animados desde videos. Control de FPS, resolución y bucle.",
        category: "video",
      },
      {
        title: "JSON Formatter",
        description: "Formatea y valida JSON. Resaltado de sintaxis y detección de errores.",
        category: "code",
      },
      {
        title: "Code Beautifier",
        description: "Embellece código de múltiples lenguajes: JS, HTML, CSS, Python, SQL.",
        category: "code",
      },
      {
        title: "Diff Checker",
        description: "Compara dos textos o bloques de código línea por línea.",
        category: "code",
      },
      {
        title: "Base64 Tool",
        description: "Codifica y decodifica Base64. Soporta texto e imágenes.",
        category: "conversion",
      },
      {
        title: "Hash Generator",
        description: "Genera hashes MD5, SHA-1, SHA-256. Para verificación de integridad.",
        category: "security",
      },
      {
        title: "Password Generator",
        description: "Generador de contraseñas seguras. Configurable: longitud, símbolos, números.",
        category: "security",
      },
      {
        title: "QR Code Generator",
        description: "Crea códigos QR de URLs, texto, contactos. Descarga en PNG o SVG.",
        category: "conversion",
      },
      {
        title: "Markdown Preview",
        description: "Vista previa de Markdown en tiempo real con resaltado de sintaxis.",
        category: "text",
      },
      {
        title: "Lorem Ipsum",
        description: "Generador de texto placeholder. Párrafos, palabras o bytes personalizables.",
        category: "text",
      },
      {
        title: "Color Picker",
        description: "Selector de colores con conversión entre HEX, RGB, HSL y OKLCH.",
        category: "dev",
      },
      {
        title: "URL Parser",
        description: "Parsea y descompone URLs. Extrae protocolo, dominio, parámetros y más.",
        category: "dev",
      },
      {
        title: "Regex Tester",
        description: "Prueba expresiones regulares en tiempo real. Con explicación de patrones.",
        category: "dev",
      },
      {
        title: "Timestamp Converter",
        description: "Convierte entre timestamps Unix y fechas legibles. Múltiples zonas horarias.",
        category: "conversion",
      },
      {
        title: "JWT Decoder",
        description: "Decodifica y verifica tokens JWT. Visualiza header, payload y firma.",
        category: "security",
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
