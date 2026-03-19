import { TranslationKeys } from './es';

export const en: TranslationKeys = {
  // Layout & Metadata
  metadata: {
    title: "Fernando Máximo | Full Stack Developer",
    description: "Full Stack Developer specialized in modern architectures, Cloud, and high-performance enterprise solutions.",
    openGraph: {
      title: "Fernando Máximo | Full Stack Developer",
      description: "Fernando Máximo's professional portfolio. Specialist in React, Next.js, Node.js, and Cloud solutions.",
      siteName: "Fernando Máximo Portfolio",
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
    copyright: "© 2026 Fernando Máximo · All rights reserved",
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
    availability: "Available for new projects",
    finalCta: {
      title: "Ready to build something incredible?",
      button: "Let's start now",
    },
    aboutMe: {
      badge: "About me",
      heading: "Driving the future with code and creativity.",
      extra: "I'm a technology enthusiast constantly pushing the limits of what's possible on the web. My focus is on creating smooth, secure and visually impactful digital experiences that solve real problems.",
      features: [
        { title: "Clean Code", description: "Scalable and maintainable architectures." },
        { title: "Performance", description: "Load optimization and user experience." },
        { title: "Full Stack", description: "I master everything from UI to infrastructure." },
      ],
    },
    experienceHighlights: {
      badge: "Journey",
      heading: "Professional",
      headingAccent: "Experience",
      cta: "Explore full history",
    },
    featuredProjects: {
      badge: "Showcase",
      heading: "Featured",
      headingAccent: "Projects",
      cta: "View all projects",
    },
    certifications: {
      badge: "Certifications",
      heading: "Validated by",
      headingAccent: "Industry Leaders",
      credential: "View credential",
    },
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
      weeks: "weeks",
    },
    calendarMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as string[],
    calendarMonthsShort: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'] as string[],
    calendarWeekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as string[],
    calendarLess: 'Less',
    calendarMore: 'More',
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
    technicalSkills: "Technical Skills",
    selfAssessment: "Self-assessment · 2026",
    certModal: {
      issuer: "Issuer",
      description: "Description",
      clickHint: "Click to view details →",
      close: "Close",
    },
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
    searchPlaceholder: "Search among {count} tools...",
    recentlyUsed: "Recently used",
    searchResults: "{count} result(s) for",
    noResults: "No tools found for",
    categories: {
      image: "Image & Color",
      video: "Video",
      code: "Code",
      text: "Text",
      security: "Security",
      conversion: "Conversion",
      dev: "Development",
      sports: "Sports",
    },
    list: [
      {
        title: "BG-Remover",
        description: "Instantly remove the background from any image using AI directly in your browser.",
        category: "image",
      },
      {
        title: "Image Forge",
        description: "Convert and resize images between multiple formats (WebP, AVIF, PNG, JPG).",
        category: "image",
      },
      {
        title: "Image Compressor",
        description: "Reduce your image file size while maintaining quality to optimize load times.",
        category: "image",
      },
      {
        title: "Metadata Extractor",
        description: "Read EXIF information from your photos: camera model, date, GPS location and more.",
        category: "image",
      },
      {
        title: "Color Blindness Simulator",
        description: "Visualize how people with deuteranopia, protanopia, tritanopia and more perceive your images.",
        category: "image",
      },
      {
        title: "Palette Extractor",
        description: "Extract the dominant colors from any image in HEX, RGB and HSL.",
        category: "image",
      },
      {
        title: "Color Picker",
        description: "Click any point on an image to capture its exact color in HEX, RGB and HSL.",
        category: "image",
      },
      {
        title: "Gradient Generator",
        description: "Create linear, radial and conic CSS gradients visually. Copy the CSS instantly.",
        category: "image",
      },
      {
        title: "Favicon Generator",
        description: "Generate the complete favicon pack (16×16 to 512×512) from any image.",
        category: "image",
      },
      {
        title: "Video Crunch",
        description: "Compress videos and convert them to GIF using FFmpeg.wasm without leaving the page.",
        category: "video",
      },
      {
        title: "Snippet Generator",
        description: "Transform your code into attractive images to share on social media.",
        category: "code",
      },
      {
        title: "JSON Formatter",
        description: "Validate, format or minify your JSON structures quickly and safely.",
        category: "code",
      },
      {
        title: "SVG to Data URI",
        description: "Convert SVG files to URI strings to use directly in CSS or HTML.",
        category: "code",
      },
      {
        title: "Code Beautifier",
        description: "Beautify or minify HTML, CSS and JavaScript code instantly in the browser.",
        category: "code",
      },
      {
        title: "Word Counter",
        description: "Analyze text with detailed statistics, reading time and readability index.",
        category: "text",
      },
      {
        title: "Text Diff",
        description: "Compare two texts side by side with Git diff-style difference highlighting.",
        category: "text",
      },
      {
        title: "Lorem Ipsum Generator",
        description: "Generate professional placeholder text in English or Spanish: paragraphs, words or lists.",
        category: "text",
      },
      {
        title: "Markdown Editor",
        description: "Write Markdown and preview the result in real time. Export to .md or .html.",
        category: "text",
      },
      {
        title: "Password Generator",
        description: "Generate secure passwords with advanced settings and real-time entropy meter.",
        category: "security",
      },
      {
        title: "Hashing Tool",
        description: "Generate MD5, SHA-256 and SHA-512 cryptographic hashes to verify data integrity.",
        category: "security",
      },
      {
        title: "Base64 Encoder/Decoder",
        description: "Encode and decode text or files in Base64. Essential for web development.",
        category: "security",
      },
      {
        title: "Text Encryptor",
        description: "Encrypt messages with AES using a password. Perfect for sharing sensitive information.",
        category: "security",
      },
      {
        title: "JWT Decoder",
        description: "Decode and analyze JWT tokens. View header, payload and expiration date.",
        category: "security",
      },
      {
        title: "Data Units Converter",
        description: "Convert between Bytes, KB, MB, GB, TB with binary (KiB) and decimal precision.",
        category: "conversion",
      },
      {
        title: "Unix Timestamp",
        description: "Convert regular dates to Unix timestamp and vice versa. Essential for databases.",
        category: "conversion",
      },
      {
        title: "CSV to JSON",
        description: "Convert CSV files to JSON and vice versa. Ideal for data migration and APIs.",
        category: "conversion",
      },
      {
        title: "QR Code Generator",
        description: "Generate custom QR codes and read QR from images. Supports URLs, text and vCards.",
        category: "conversion",
      },
      {
        title: "Aspect Ratio Calculator",
        description: "Calculate and scale dimensions while maintaining proportion. Ideal for responsive images and videos.",
        category: "conversion",
      },
      {
        title: ".gitignore Generator",
        description: "Generate custom .gitignore files based on your tech stack with up-to-date templates.",
        category: "dev",
      },
      {
        title: "README.md Generator",
        description: "Create professional GitHub READMEs with templates, badges and customizable sections.",
        category: "dev",
      },
      {
        title: "Regex Tester",
        description: "Test regular expressions in real time with match and group highlighting.",
        category: "dev",
      },
      {
        title: "Cron Helper",
        description: "Build and understand cron expressions in plain language. Shows upcoming executions.",
        category: "dev",
      },
      {
        title: "NBA Live Scores",
        description: "Follow NBA scores in real time. Live games, finals and schedule with auto-refresh.",
        category: "sports",
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
