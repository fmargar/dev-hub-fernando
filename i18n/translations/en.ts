import { TranslationKeys } from './es';

export const en: TranslationKeys = {
  // Layout & Metadata
  metadata: {
    title: "Fernando Martínez | Full Stack Developer",
    description: "Full Stack Developer specialized in modern architectures, Cloud, and high-performance enterprise solutions.",
    openGraph: {
      title: "Fernando Martínez | Full Stack Developer",
      description: "Fernando Martínez's professional portfolio. Specialist in React, Next.js, Node.js, and Cloud solutions.",
      siteName: "Fernando Martínez Portfolio",
    },
  },

  // Navbar
  navbar: {
    links: {
      showcase: "Showcase",
      stack: "Stack",
      experience: "Experience",
      tools: "Tools",
      contact: "Contact",
    },
    mobileMenu: "Theme and profile",
    bb8Tooltip: "Click to summon BB-8!",
  },

  // Footer
  footer: {
    links: {
      projects: "Projects",
      stack: "Stack",
      experience: "Experience",
      lab: "Lab",
      contact: "Contact",
    },
    role: "Full Stack Developer · DAW · Marbella, ES",
    tech: "Built with Next.js · self-hosted Ubuntu",
    copyright: "© 2026 Fernando Martínez · All rights reserved",
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
      "Modern architectures.",
      "High-impact interfaces.",
      "Scalable Cloud solutions.",
      "Full Stack with vision.",
      "Code that creates value.",
    ],
    description: "Higher Technician in Web Application Development from IES Salduba. Specialized in React, Next.js, Node.js, and Cloud.",
    cta: {
      projects: "View Projects",
      contact: "Contact",
    },
    scroll: "Discover more",
  },

  // Bento Dashboard
  bento: {
    title: "Operations Center",
    activity: "Development Activity",
    github: {
      title: "GitHub Pulse",
      commits: "commits this week",
      active: "active",
      subtitle: "Recent contribution flow",
      viewProfile: "View Profile",
      analyzing: "Analyzing repository...",
    },
    terminal: {
      title: "Terminal",
      logs: [
        "Starting development server...",
        "Next.js compiled successfully",
        "Server running on port 3000",
        "Database connected OK",
        "Authentication system active",
      ],
    },
    project: {
      focus: "Current Project",
      name: "Marbella Fácil",
      description: "Information platform about procedures, processes and services in Marbella. React + TypeScript + Maps API.",
      viewArchitecture: "View Architecture",
    },
    techEngine: {
      title: "Development Engine",
      subtitle: "Main production ecosystem",
    },
  },

  // Projects Page
  projects: {
    title: "Featured Projects",
    badge: "Showcase · Fernando Máximo",
    description: "A selection of my most recent work — from enterprise platforms to personal lab tools.",
    cta: "View all my repositories",
    buttons: {
      github: "GitHub",
      demo: "Demo",
      private: "Private repository",
      privateLabel: "Private",
    },
    meta: [
      { label: "SaaS Platform" },
      { label: "Enterprise App" },
      { label: "Portfolio & Lab" },
    ],
    list: [
      {
        title: "Marbella Fácil",
        description: "Comprehensive SaaS platform focused on smart tourism. Robust Laravel 10 backend with SPA architecture via React and Inertia.js. Includes dynamic subscription management, real-time reservation system and weather monitoring.",
        tech: ["Laravel 10", "React", "Inertia.js", "MySQL", "SaaS"],
      },
      {
        title: "Sistema de Vados",
        description: "Enterprise solution for managing vehicle access permits at Marbella City Council. Complex business logic, audit systems, Intranet deployment and Active Directory (LDAP) integration for secure access.",
        tech: ["PHP", "PostgreSQL", "LDAP", "Intranet"],
      },
      {
        title: "Dev-Hub Fernando",
        description: "My personal portfolio and AI/WA tools lab. Local file processing via FFmpeg.wasm, premium design with Framer Motion, and architecture oriented towards self-hosted server deployment.",
        tech: ["Next.js 15", "React", "FFmpeg.wasm", "Docker"],
      },
    ],
  },

  // Stack Page
  stack: {
    title: "Tech Stack",
    badge: "Ecosystem · Fernando Máximo",
    techs: "techs",
    description: "An ecosystem of carefully selected tools to build robust, scalable and secure software.",
    categories: {
      backend: "Backend & Core",
      frontend: "Frontend & UI",
      infra: "Infrastructure & DevOps",
      database: "Databases",
    },
    principles: {
      title: "Principles",
      list: [
        "Clean and scalable architecture",
        "Code quality and testing",
        "Performance and optimization",
        "Security and best practices",
      ],
    },
  },

  // Experience Page
  experience: {
    title: "Experience",
    badge: "Journey · Fernando Máximo",
    description: "My professional career and academic background, focused on high-impact software development and continuous improvement.",
    sections: {
      history: "Professional History",
      certifications: "Certifications",
      skills: "Skills",
    },
    current: "Present",
    timeline: [
      {
        id: "4",
        role: "Backend & DB Developer",
        company: "Marbella City Council",
        start_date: "2026-03-01",
        end_date: null,
        description: "Migration and unification of Marbella and San Pedro databases from CSV files to a solid relational architecture in PostgreSQL. Development of a comprehensive CRUD web application for permit management, implementing auditing systems, deployment in the municipal Intranet and integration with Active Directory (LDAP) to ensure secure access.",
        current: true,
      },
      {
        id: "1",
        role: "Web Developer (Internship)",
        company: "ASISA",
        start_date: "2025-01-01",
        end_date: "2025-06-30",
        description: "Technical management of corporate portals. Performance optimization through module configuration and code refactoring. Collaboration in UI/UX design to ensure responsive and accessible interfaces in high-demand business environments.",
        current: false,
      },
      {
        id: "3",
        role: "Higher Degree in Web Development",
        company: "I.E.S. Salduba",
        start_date: "2024-09-15",
        end_date: null,
        description: "Technical training in Full Stack development. Specialization in Java (Spring Boot), PHP (Laravel), Databases (MySQL) and collaborative version control with Git/GitHub.",
        current: true,
      },
      {
        id: "2",
        role: "Technical Salesperson",
        company: "Alcampo",
        start_date: "2024-06-01",
        end_date: "2024-09-01",
        description: "Technical hardware consulting and solutions. Resolving technical issues under pressure and advanced stock and inventory management.",
        current: false,
      },
    ],
    certifications: [
      {
        id: "c1",
        title: "English B2 (First Certificate)",
        issuer: "Cambridge Assessment English",
        date: "2022",
        description: "Certified upper-intermediate competence, capable of communicating fluently in professional and technical environments."
      },
      {
        id: "c2",
        title: "AWS Cloud Practitioner",
        issuer: "Amazon Web Services (AWS)",
        date: "2025",
        description: "Cloud fundamentals, core services, security and AWS pricing models."
      },
      {
        id: "c3",
        title: "Cybersecurity Essentials",
        issuer: "Cisco Networking Academy",
        date: "2025",
        description: "Principles of data protection, threat mitigation and corporate network security."
      }
    ],
    softSkills: [
      "Problem solving",
      "Technical communication",
      "Technological adaptability",
      "Teamwork",
      "Technical leadership",
    ],
  },

  // Contact Page
  contact: {
    title: "Contact",
    subtitle: "Have a project in mind?",
    description: "I'm available for new projects and collaborations. Send me a message and let's talk.",
    form: {
      name: "Name",
      email: "Email",
      message: "Message",
      namePlaceholder: "Your name",
      emailPlaceholder: "your@email.com",
      messagePlaceholder: "Tell me about your project...",
      submit: "Send Proposal",
      success: "Transmission Successful!",
      successDesc: "Your message has been received. I'll respond soon.",
      sendAnother: "Send another message",
    },
    info: {
      location: "Marbella, Spain",
      availability: "Available for freelance projects",
      response: "Response in 24-48h",
      directEmail: "Direct Email",
      locationLabel: "Location",
      availabilityLabel: "Availability",
    },
  },

  // Tools Page
  tools: {
    title: "Tools",
    subtitle: "Web utilities lab",
    description: "Collection of useful tools for development and daily tasks. All work 100% in your browser.",
    categories: {
      image: "Image",
      video: "Video",
      code: "Code",
      text: "Text",
      security: "Security",
      conversion: "Conversion",
      dev: "Development",
    },
    list: [
      {
        title: "Background Remover",
        description: "Automatically remove image backgrounds with AI. No file uploads to servers.",
        category: "image",
      },
      {
        title: "Image Forge",
        description: "Complete image editor: resize, crop, filters, adjustments and more.",
        category: "image",
      },
      {
        title: "Image Compressor",
        description: "Compress JPG, PNG and WebP without visible quality loss. Smart optimization.",
        category: "image",
      },
      {
        title: "Image Converter",
        description: "Convert between formats: JPG, PNG, WebP, AVIF, GIF. Local processing.",
        category: "image",
      },
      {
        title: "Video Trimmer",
        description: "Trim videos without re-encoding. Precise start and end selection.",
        category: "video",
      },
      {
        title: "Audio Extractor",
        description: "Extract audio track from any video. MP3, WAV, AAC formats.",
        category: "video",
      },
      {
        title: "GIF Maker",
        description: "Create animated GIFs from videos. FPS, resolution and loop control.",
        category: "video",
      },
      {
        title: "JSON Formatter",
        description: "Format and validate JSON. Syntax highlighting and error detection.",
        category: "code",
      },
      {
        title: "Code Beautifier",
        description: "Beautify code in multiple languages: JS, HTML, CSS, Python, SQL.",
        category: "code",
      },
      {
        title: "Diff Checker",
        description: "Compare two texts or code blocks line by line.",
        category: "code",
      },
      {
        title: "Base64 Tool",
        description: "Encode and decode Base64. Supports text and images.",
        category: "conversion",
      },
      {
        title: "Hash Generator",
        description: "Generate MD5, SHA-1, SHA-256 hashes. For integrity verification.",
        category: "security",
      },
      {
        title: "Password Generator",
        description: "Secure password generator. Configurable: length, symbols, numbers.",
        category: "security",
      },
      {
        title: "QR Code Generator",
        description: "Create QR codes for URLs, text, contacts. Download as PNG or SVG.",
        category: "conversion",
      },
      {
        title: "Markdown Preview",
        description: "Real-time Markdown preview with syntax highlighting.",
        category: "text",
      },
      {
        title: "Lorem Ipsum",
        description: "Placeholder text generator. Customizable paragraphs, words or bytes.",
        category: "text",
      },
      {
        title: "Color Picker",
        description: "Color selector with conversion between HEX, RGB, HSL and OKLCH.",
        category: "dev",
      },
      {
        title: "URL Parser",
        description: "Parse and break down URLs. Extract protocol, domain, parameters and more.",
        category: "dev",
      },
      {
        title: "Regex Tester",
        description: "Test regular expressions in real-time. With pattern explanation.",
        category: "dev",
      },
      {
        title: "Timestamp Converter",
        description: "Convert between Unix timestamps and readable dates. Multiple time zones.",
        category: "conversion",
      },
      {
        title: "JWT Decoder",
        description: "Decode and verify JWT tokens. Visualize header, payload and signature.",
        category: "security",
      },
    ],
  },
  // Common Labels
  common: {
    copy: "Copy",
    copied: "Copied!",
    clear: "Clear",
    success: "Success",
    error: "Error",
    loading: "Loading...",
    status: "Status",
    result: "Result",
    actions: "Actions",
    settings: "Settings",
    back: "Back",
    format: "Format",
    size: "Size",
    quality: "Quality",
    download: "Download",
  },

  // Components
  components: {
    fileDropzone: {
      defaultLabel: "Drag & drop your file here, or click to select",
      activeLabel: "Drop the file here...",
      rejectLabel: "Unsupported file type",
      maxSizeLabel: "(Max size: {size})",
      removeFile: "Remove file",
    },
  },

  // Tools Specific
  tools_content: {
    wordCounter: {
      title: "Word & Reading Counter",
      description: "Analyze your text with detailed statistics, estimated reading time, and readability index.",
      placeholder: "Type or paste your text here to analyze...",
      stats: {
        words: "Words",
        characters: "Characters",
        noSpaces: "No spaces",
        sentences: "Sentences",
        paragraphs: "Paragraphs",
        readingTime: "Reading",
      },
      analysis: {
        title: "Readability Analysis",
        readability: "Reading level",
        wordsPerSentence: "Words/sentence",
        charsPerWord: "Chars/word",
        levels: {
          veryEasy: "Very easy",
          easy: "Easy",
          moderate: "Moderate",
          hard: "Hard",
          veryHard: "Very hard",
          na: "N/A",
        },
      },
      minutes: "{count, plural, =1 {1 minute} other {# minutes}}",
    },
    videoCrunch: {
      title: "Video Crunch",
      description: "Compress and convert videos locally using the full power of WASM in your browser.",
      status: {
        loading: "Loading Engine...",
        compressing: "Compressing...",
        start: "Compress Video",
        starting: "Starting compression...",
        done: "Compression finished",
        idle: "Upload a video to start",
        cpuWarning: "This may take a while depending on your CPU",
      },
      originalVideo: "Original Video",
      compressionSettings: "Compression Settings",
      outputSettings: "Output Settings",
      resolution: "Resolution",
      selectResolution: "Select resolution",
      compressionLevel: "Compression Level",
      formats: {
        mp4: "MP4 (Max Compatibility)",
      },
    }
  },
};
