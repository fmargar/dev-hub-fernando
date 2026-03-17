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
      subtitle: "Contribution flow for the last 5 months",
      viewProfile: "View Profile",
      analyzing: "Analyzing repository...",
    },
    terminal: {
      title: "Terminal · System Logs",
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
    cta: "View all my repositories",
    buttons: {
      github: "GitHub",
      demo: "Demo",
      private: "Private repository",
      privateLabel: "Private",
    },
    list: [
      {
        title: "Marbella Fácil",
        description: "💻 Comprehensive web platform for information on procedures, processes and services in Marbella. Includes interactive maps, advanced search and news section. React + TypeScript + Google Maps API.",
        tech: ["React", "TypeScript", "TailwindCSS", "Google Maps", "Vite"],
      },
      {
        title: "SecureNet Dashboard",
        description: "🔐 Administration panel for secure network management. Real-time monitoring system with traffic analysis, anomaly detection and access control. Next.js + Node.js + PostgreSQL.",
        tech: ["Next.js", "Node.js", "PostgreSQL", "Docker", "Redis"],
      },
      {
        title: "FluxCommerce",
        description: "🛒 Modular e-commerce with headless architecture. Payment gateway, inventory management, analytics panel and notification system. Clean and scalable architecture.",
        tech: ["React", "Express", "MongoDB", "Stripe", "AWS"],
      },
    ],
  },

  // Stack Page
  stack: {
    title: "Tech Stack",
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
    sections: {
      history: "Professional History",
      certifications: "Certifications",
      skills: "Skills",
    },
    current: "Present",
    timeline: [
      {
        role: "Full Stack Developer",
        company: "Freelance · Remote",
        period: "2024 - Present",
        description: "Development of modern web applications with React, Next.js and Node.js. Specialization in serverless architectures and AWS Cloud solutions.",
      },
      {
        role: "Frontend Developer",
        company: "TechStart Solutions",
        period: "2023 - 2024",
        description: "Implementation of complex user interfaces with React and TypeScript. Performance optimization and user experience in SaaS applications.",
      },
      {
        role: "Junior Developer",
        company: "Digital Innovators",
        period: "2022 - 2023",
        description: "Fullstack web features development. Collaboration on e-commerce projects and business management platforms.",
      },
      {
        role: "Development Internship",
        company: "IES Salduba · FCT Project",
        period: "2022",
        description: "Web application development during DAW training. Projects with MERN and LAMP stacks.",
      },
    ],
    certifications: [
      {
        title: "AWS Certified Cloud Practitioner",
        issuer: "Amazon Web Services",
        date: "2024",
        description: "Cloud Computing fundamentals, AWS core services and cloud architectures.",
      },
      {
        title: "Cambridge First Certificate (B2)",
        issuer: "Cambridge English",
        date: "2023",
        description: "Official upper-intermediate English certification (CEFR B2).",
      },
      {
        title: "Higher Technician in Web App Development",
        issuer: "IES Salduba",
        date: "2022",
        description: "Web Application Development. Complete training in fullstack development, databases and deployment.",
      },
    ],
    softSkills: [
      "Problem solving",
      "Teamwork",
      "Effective communication",
      "Continuous learning",
      "Time management",
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
    },
    info: {
      location: "Marbella, Spain",
      availability: "Available for freelance projects",
      response: "Response in 24-48h",
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
