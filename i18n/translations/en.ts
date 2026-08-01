// UI strings only. Content (cases, career, skills) lives in content/, so long
// form text does not have to be maintained three times over.
export const en = {
  metadata: {
    title: "Fernando Martínez · Full stack developer",
    description:
      "Full stack developer based in Marbella, Spain. Laravel, React and PostgreSQL, with software running in production for public administration and personal projects.",
    ogTitle: "Fernando Martínez · Full stack developer",
    ogDescription:
      "Case studies of real software: municipal record management, service platforms and self-hosted infrastructure.",
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
    skipToContent: "Skip to content",
  },

  footer: {
    role: "Full stack developer · Marbella, Spain",
    tech: "Built with Next.js, self-hosted on Ubuntu",
    rights: "All rights reserved",
    sections: "Sections",
    elsewhere: "Elsewhere",
  },

  home: {
    availability: "Available for new projects",
    role: "Full stack developer",
    specialties: "Laravel · React · PostgreSQL",
    intro:
      "I build software that reaches production and stays there: record management systems for public administration, service platforms, and the infrastructure that keeps them running. No coursework screenshots here — these are projects told from the inside.",
    ctaWork: "See the case studies",
    ctaCv: "Download CV",
    nowLabel: "Now",
    nowSince: "since",
    workEyebrow: "Selected work",
    workHeading: "Projects told from the inside",
    workIntro: "What the problem was, what I decided, and what was left open. No polish.",
    workAll: "See all case studies",
    aboutEyebrow: "About",
    aboutHeading: "I care about software that holds up over time",
    about: [
      "I hold a Higher Diploma in Web Application Development and work mostly with Laravel, React and relational databases. My internship was at Marbella City Council, building a record management system that had to survive both the officers who would use it and the legacy data it had to digest.",
      "What has taught me most, though, is running my own server. Twenty-five containers in production, real incidents, and the lesson that the failure that really hurts is not the one that crashes — it is the one that stays up without doing its job.",
    ],
    stackEyebrow: "Stack",
    stackHeading: "What I work with",
    stackAll: "See the full stack",
    labEyebrow: "Lab",
    labHeading: "A lab of web utilities",
    labIntro:
      "A collection of tools I use daily that run entirely in the browser: nothing you upload ever leaves your machine.",
    labCta: "Enter the lab",
    contactHeading: "Let's talk",
    contactIntro:
      "I'm open to new opportunities and collaborations. I reply within 24-48 hours.",
    contactCta: "Get in touch",
  },

  work: {
    title: "Work",
    intro:
      "Four projects that explain what I can do better than any list of technologies. Each one covers the starting problem, the decisions I made, and what was left unresolved.",
    columns: {
      project: "Project",
      client: "Client",
      year: "Year",
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
    },
    present: "Present",
    relatedCase: "Related case study",
    downloadCv: "Download CV as PDF",
  },

  stackPage: {
    title: "Stack",
    intro:
      "The tools I work with regularly, grouped by role. They are here because I have used them on something that works, not because I watched a tutorial.",
    principlesTitle: "How I work",
    principles: [
      "Business rules go where they cannot be bypassed: in a policy or a scope, not behind a hidden button.",
      "A silent failure is worse than an outage. If something can stop working without warning, I build the warning first.",
      "Deployment is part of the product: if shipping is a chore, you ship less often.",
      "I would rather have a boring, well-normalised schema than a shortcut I have to undo in six months.",
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
    },
    info: {
      emailLabel: "Email",
      locationLabel: "Location",
      availabilityLabel: "Availability",
      availability: "Open to new opportunities",
      responseLabel: "Response time",
      response: "24-48 hours",
      cvLabel: "Résumé",
      cvAction: "Download as PDF",
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
