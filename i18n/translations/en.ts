// UI strings only. Content (cases, career, skills) lives in content/, so long
// form text does not have to be maintained three times over.
export const en = {
  metadata: {
    title: "Fernando Martínez · Full Stack Developer · AI agents · LLM integration",
    description:
      "Full stack developer based in Marbella, Spain, who builds and ships software with a team of AI agents: an LLM with human approval inside his company's ERP, AI agents working in parallel, a local vision model and live products built with Python, Laravel, Astro and Docker.",
    ogTitle: "Fernando Martínez · Full Stack Developer · AI agents · LLM integration",
    ogDescription:
      "An LLM with human approval inside an ERP, AI agents working in parallel and Adivinadle, a complete product on the internet. Projects told from the inside.",
    siteName: "Fernando Martínez",
  },

  nav: {
    home: "Home",
    work: "Work",
    experience: "Experience",
    stack: "Stack",
    tools: "Lab",
    contact: "Contact",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    toggleTheme: "Switch between light and dark theme",
    language: "Language",
    search: "Search",
    skipToContent: "Skip to content",
  },

  footer: {
    role: "Full Stack Developer · Marbella, Spain",
    tech: "Built with Next.js, self-hosted on Ubuntu",
    rights: "All rights reserved",
    sections: "Sections",
    elsewhere: "Elsewhere",
  },

  home: {
    role: "Full Stack Developer",
    tags: "AI agents · LLM integration",
    intro:
      "I build and ship software with a team of AI agents. At work I put an LLM inside the ERP with drafts and human approval; on my own, with that team, I launched Adivinadle, a complete product.",
    location: "Marbella, Spain · open to remote or on-site",
    ctaCv: "Download CV",
    ctaCvNote: "PDF, Spanish",
    ctaAdivinadle: "Adivinadle",
    ctaEmail: "Email me",
    demo: {
      caption: "How the LLM I put inside my company's ERP works: the AI proposes, a person approves. (Illustrative example.)",
      file: "Product sheet",
      product: "High-visibility polo shirt",
      draft: "AI-generated draft",
      text: "Work polo in breathable fabric with certified reflective bands. Made for long days outdoors: dries fast, keeps its colour and survives industrial washing.",
      proposedBy: "Proposed by",
      proposedByValue: "OpenAI model",
      reviewer: "Reviewer",
      reviewerValue: "catalogue manager",
      reject: "Reject",
      approve: "Approve and publish",
      approved: "Approved by a person",
    },
    proof: [
      { value: "LLM in the ERP", text: "with human approval, in use at my company", href: "/work/uniformes-bahia" },
      { value: "Adivinadle", text: "live: 9 games, CI with e2e and Lighthouse", href: "/work/adivinadle" },
      { value: "Parallel agents", text: "with context handover and measured cost", href: "/work/agentes-ia" },
      { value: "Local vision", text: "6 of 6 screens and 15 of 15 clicks, no training", href: "/work/vision-local" },
    ],
    workHeading: "Projects",
    workIntro: "What I have taken to production, told from the inside: the problem, the decisions and what I learned.",
    workAll: "See all projects",
    experienceHeading: "Experience",
    experienceAll: "See the full career",
    present: "present",
    aboutHeading: "Quality comes from the system around the code",
    about: [
      "AI generating code does not make it production-ready. That is why everything I build with agents goes through a written design, tests, mandatory CI and review, and anything an LLM publishes is approved by a person first.",
      "I come from full stack development (Higher Diploma in Web Application Development, final project with top honours) and I run my own server with over a hundred containers. That gives me something unusual: I can take a model to production and keep it alive there.",
    ],
    stackHeading: "Skills",
    stackAll: "See all skills",
    educationHeading: "Education and languages",
    education: [
      "Higher Diploma in Web Application Development (DAW), I.E.S. Salduba, 2024–2026. Final project: 10 with honours.",
      "AWS Cloud Practitioner Essentials · Cisco Cybersecurity Essentials.",
      "Native Spanish · English B2 (Cambridge) · driving licence and own car.",
    ],
    contactHeading: "Shall we talk?",
    contactIntro:
      "If I fit what you are looking for, write to me and let's talk. I reply within 24-48 hours.",
    contactCta: "Send a message",
  },

  work: {
    title: "Work",
    intro:
      "Projects that explain what I can do better than any list of technologies. Each one covers the starting problem, the decisions I made, and what was left unresolved.",
    groups: {
      professional: "Professional work",
      professionalNote: "Projects with a client, an employer or an academic deliverable.",
      personal: "Personal projects",
      personalNote: "Things I run myself, genuinely in production.",
    },
    read: "Read the case study",
    backToIndex: "All case studies",
    nextCase: "Next case study",
    meta: {
      client: "Client",
      period: "Period",
      role: "Role",
      stack: "Stack",
    },
    repoPublic: "View the code on GitHub",
    repoPrivate: "Private repository",
    onThisPage: "On this page",
    figureLabel: "Figure",
    liveMetrics: {
      checkedAt: "Checked {{time}}",
    },
  },

  experience: {
    title: "Experience",
    intro:
      "Career, education and skills. Each skill group links to the case study where you can check it.",
    sections: {
      work: "Career",
      education: "Education",
      certifications: "Certifications",
      skills: "Skills",
      activity: "Code activity",
    },
    verifyCredential: "View credential",
    references: {
      title: "References",
      text: "I can provide references from Marbella City Council and I.E.S. Salduba on request.",
    },
    present: "Present",
    relatedCase: "Related case study",
    downloadCv: "Download CV as PDF",
    activity: {
      caption: "Last 12 months on GitHub, the same way my public profile shows them.",
      totalCount: "{{count}} contributions in the last 12 months",
      legendLess: "Less",
      legendMore: "More",
      tooltip: "{{count}} contributions on {{date}}",
      stale: "Showing the last available snapshot.",
    },
  },

  stackPage: {
    title: "Stack",
    intro:
      "The tools I work with regularly, grouped by role. They are here because I have used them on something that works, not because I watched a tutorial.",
    principlesTitle: "How I work",
    principles: [
      "An LLM proposes; what reaches production is approved by a person or validated by a test against the source.",
      "Before training or switching models, measure with a test set.",
      "A silent failure is worse than an outage. If something can stop working without warning, I build the warning first.",
      "Deployment is part of the product: if shipping is a chore, you ship less often.",
    ],
  },

  contact: {
    title: "Contact",
    intro:
      "Tell me what you need and I'll reply within 24-48 hours. If you'd rather write directly, my address is right there.",
    form: {
      name: "Name",
      email: "Email",
      message: "Message",
      namePlaceholder: "Your name",
      emailPlaceholder: "you@email.com",
      messagePlaceholder: "Tell me what you're working on…",
      submit: "Send message",
      sending: "Sending…",
      success: "Message sent",
      successDesc: "Thanks for writing. I'll get back to you within 24-48 hours.",
      sendAnother: "Send another message",
      genericError: "Couldn't send the message. Please try again in a few minutes.",
      rateLimitError: "Too many attempts. Please wait a bit before writing again.",
      unavailableTitle: "The form isn't available right now",
      unavailableDesc: "Email me directly and I'll get back to you within 24-48 hours.",
      unavailableCta: "Write an email",
    },
    info: {
      emailLabel: "Email",
      locationLabel: "Location",
      responseLabel: "Response time",
      response: "24-48 hours",
      cvLabel: "Résumé",
      cvAction: "Download as PDF",
    },
  },

  // Case study diagrams (components/case/Figure.tsx)
  figures: {
    vadosFlow: {
      steps: [
        { label: "React + Inertia", note: "the user acts" },
        { label: "Auth middleware", note: "checks the session" },
        { label: "Controller + Policy", note: "validates and authorises" },
        { label: "Eloquent + TerritorioScope", note: "filters by district" },
        { label: "PostgreSQL", note: "persistence" },
      ],
      observerLabel: "Observer",
      observerText:
        "In parallel, `VadoObserver` writes the audit record (user, ID number, machine and the `old`/`new` diff) without the controller doing anything.",
    },
    vadosRoles: {
      caption: "Read and write permissions by role and district",
      roleHeader: "Role",
      readWrite: "read + write",
      readOnly: "read only",
    },
    mfArch: {
      nodeA: { label: "Node A", note: "React SPA + Laravel API in containers" },
      nodeB: { label: "Node B (mirror)", note: "Same stack, independent deployment" },
      vpn: {
        label: "Tailscale · WireGuard mesh network",
        note: "Encrypted point-to-point tunnel; the MySQL port never faces the internet",
      },
      db: { label: "MySQL 8 · school server", note: "Behind the campus firewall" },
      footnote:
        "In front of both nodes, Cloudflare acts as reverse proxy and WAF with SSL/TLS in Strict mode. Portainer polls GitHub every five minutes and rebuilds the containers when it detects changes.",
    },
    homelabNet: {
      paths: [
        {
          scope: "Public",
          label: "Cloudflare Tunnel",
          detail: "Domains and sites. Outbound tunnel: the router opens no inbound port.",
        },
        {
          scope: "Private",
          label: "Tailscale",
          detail: "Portainer, internal dashboards and SSH. Reachable only from the mesh network.",
        },
        {
          scope: "Isolated",
          label: "ipvlan network",
          detail: "Services on their own network segment, separated at layer 2.",
        },
      ],
    },
    galleryPipeline: {
      steps: [
        { label: "Upload", note: "the client sends the file" },
        { label: "Disk check", note: "free space and marker file" },
        { label: "FFmpeg", note: "re-encoding with capped threads" },
        { label: "YouTube API", note: "OAuth with refresh token" },
        { label: "Notification", note: "push, ntfy, Discord or email" },
      ],
      footnote:
        "If the disk check fails, the process stops right there: rejecting an upload beats filling the volume and leaving the database read-only.",
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
    list: {
      "bg-remover": {
        title: "BG-Remover",
        description: "Instantly remove the background from any image using AI directly in your browser.",
      },
      "image-forge": {
        title: "Image Forge",
        description: "Convert and resize images between multiple formats (WebP, AVIF, PNG, JPG).",
      },
      "image-compressor": {
        title: "Image Compressor",
        description: "Reduce your image file size while maintaining quality to optimize load times.",
      },
      "exif-reader": {
        title: "Metadata Extractor",
        description: "Read EXIF information from your photos: camera model, date, GPS location and more.",
      },
      "color-blindness": {
        title: "Color Blindness Simulator",
        description: "Visualize how people with deuteranopia, protanopia, tritanopia and more perceive your images.",
      },
      "palette-extractor": {
        title: "Palette Extractor",
        description: "Extract the dominant colors from any image in HEX, RGB and HSL.",
      },
      "image-color-picker": {
        title: "Color Picker",
        description: "Click any point on an image to capture its exact color in HEX, RGB and HSL.",
      },
      "gradient-generator": {
        title: "Gradient Generator",
        description: "Create linear, radial and conic CSS gradients visually. Copy the CSS instantly.",
      },
      "favicon-generator": {
        title: "Favicon Generator",
        description: "Generate the complete favicon pack (16×16 to 512×512) from any image.",
      },
      "video-crunch": {
        title: "Video Crunch",
        description: "Compress videos and convert them to GIF using FFmpeg.wasm without leaving the page.",
      },
      "snippet-generator": {
        title: "Snippet Generator",
        description: "Transform your code into attractive images to share on social media.",
      },
      "json-formatter": {
        title: "JSON Formatter",
        description: "Validate, format or minify your JSON structures quickly and safely.",
      },
      "svg-to-datauri": {
        title: "SVG to Data URI",
        description: "Convert SVG files to URI strings to use directly in CSS or HTML.",
      },
      "code-beautifier": {
        title: "Code Beautifier",
        description: "Beautify or minify HTML, CSS and JavaScript code instantly in the browser.",
      },
      "word-counter": {
        title: "Word Counter",
        description: "Analyze text with detailed statistics, reading time and readability index.",
      },
      "text-diff": {
        title: "Text Diff",
        description: "Compare two texts side by side with Git diff-style difference highlighting.",
      },
      "lorem-ipsum": {
        title: "Lorem Ipsum Generator",
        description: "Generate professional placeholder text in English or Spanish: paragraphs, words or lists.",
      },
      "markdown-editor": {
        title: "Markdown Editor",
        description: "Write Markdown and preview the result in real time. Export to .md or .html.",
      },
      "password-generator": {
        title: "Password Generator",
        description: "Generate secure passwords with advanced settings and real-time entropy meter.",
      },
      "hash-generator": {
        title: "Hashing Tool",
        description: "Generate MD5, SHA-256 and SHA-512 cryptographic hashes to verify data integrity.",
      },
      base64: {
        title: "Base64 Encoder/Decoder",
        description: "Encode and decode text or files in Base64. Essential for web development.",
      },
      "text-encryptor": {
        title: "Text Encryptor",
        description: "Encrypt messages with AES using a password. Perfect for sharing sensitive information.",
      },
      "jwt-decoder": {
        title: "JWT Decoder",
        description: "Decode and analyze JWT tokens. View header, payload and expiration date.",
      },
      "data-converter": {
        title: "Data Units Converter",
        description: "Convert between Bytes, KB, MB, GB, TB with binary (KiB) and decimal precision.",
      },
      "unix-timestamp": {
        title: "Unix Timestamp",
        description: "Convert regular dates to Unix timestamp and vice versa. Essential for databases.",
      },
      "csv-json": {
        title: "CSV to JSON",
        description: "Convert CSV files to JSON and vice versa. Ideal for data migration and APIs.",
      },
      "qr-code": {
        title: "QR Code Generator",
        description: "Generate custom QR codes and read QR from images. Supports URLs, text and vCards.",
      },
      "aspect-ratio": {
        title: "Aspect Ratio Calculator",
        description: "Calculate and scale dimensions while maintaining proportion. Ideal for responsive images and videos.",
      },
      "gitignore-generator": {
        title: ".gitignore Generator",
        description: "Generate custom .gitignore files based on your tech stack with up-to-date templates.",
      },
      "readme-generator": {
        title: "README.md Generator",
        description: "Create professional GitHub READMEs with templates, badges and customizable sections.",
      },
      "regex-tester": {
        title: "Regex Tester",
        description: "Test regular expressions in real time with match and group highlighting.",
      },
      "cron-helper": {
        title: "Cron Helper",
        description: "Build and understand cron expressions in plain language. Shows upcoming executions.",
      },
      "nba-scores": {
        title: "NBA Live Scores",
        description: "Follow NBA scores in real time. Live games, finals and schedule with auto-refresh.",
      },
    },
  },

  // Common Labels
  errors: {
    notFoundTitle: "Page not found",
    notFoundDesc: "The link is broken or the page has moved. Try starting from the home page.",
    notFoundCta: "Back to home",
    genericTitle: "Something went wrong",
    genericDesc: "An unexpected error occurred. You can retry or go back to the home page.",
    retryCta: "Retry",
    homeCta: "Back to home",
  },

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
