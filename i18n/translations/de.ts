import { TranslationKeys } from './es';

export const de: TranslationKeys = {
  // Layout & Metadata
  metadata: {
    title: "Fernando Martínez | Full Stack Developer",
    description: "Full Stack Developer spezialisiert auf moderne Architekturen, Cloud und leistungsstarke Unternehmenslösungen.",
    openGraph: {
      title: "Fernando Martínez | Full Stack Developer",
      description: "Professionelles Portfolio von Fernando Martínez. Spezialist für React, Next.js, Node.js und Cloud-Lösungen.",
      siteName: "Fernando Martínez Portfolio",
    },
  },

  // Navbar
  navbar: {
    links: {
      showcase: "Showcase",
      stack: "Stack",
      experience: "Erfahrung",
      tools: "Werkzeuge",
      contact: "Kontakt",
    },
    mobileMenu: "Theme und Profil",
    bb8Tooltip: "Klicken, um BB-8 zu beschwören!",
  },

  // Footer
  footer: {
    links: {
      projects: "Projekte",
      stack: "Stack",
      experience: "Erfahrung",
      lab: "Labor",
      contact: "Kontakt",
    },
    role: "Full Stack Developer · DAW · Marbella, ES",
    tech: "Erstellt mit Next.js · self-hosted Ubuntu",
    copyright: "© 2026 Fernando Martínez · Alle Rechte vorbehalten",
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
      "Moderne Architekturen.",
      "Wirkungsvolle Interfaces.",
      "Skalierbare Cloud-Lösungen.",
      "Full Stack mit Vision.",
      "Code der Mehrwert schafft.",
    ],
    description: "Höherer Techniker für Webanwendungsentwicklung vom IES Salduba. Spezialisiert auf React, Next.js, Node.js und Cloud.",
    cta: {
      projects: "Projekte ansehen",
      contact: "Kontakt",
    },
    scroll: "Mehr entdecken",
  },

  // Bento Dashboard
  bento: {
    title: "Operations-Center",
    activity: "Entwicklungsaktivität",
    github: {
      title: "GitHub Pulse",
      commits: "Commits diese Woche",
      active: "aktiv",
      subtitle: "Aktueller Beitragsverlauf",
      viewProfile: "Profil ansehen",
      analyzing: "Repository wird analysiert...",
    },
    terminal: {
      title: "Terminal",
      logs: [
        "Entwicklungsserver wird gestartet...",
        "Next.js erfolgreich kompiliert",
        "Server läuft auf Port 3000",
        "Datenbank verbunden OK",
        "Authentifizierungssystem aktiv",
      ],
    },
    project: {
      focus: "Aktuelles Projekt",
      name: "Marbella Fácil",
      description: "Informationsplattform über Verfahren, Prozesse und Dienstleistungen in Marbella. React + TypeScript + Maps API.",
      viewArchitecture: "Architektur ansehen",
    },
    techEngine: {
      title: "Entwicklungsmotor",
      subtitle: "Hauptproduktionsökosystem",
    },
  },

  // Projects Page
  projects: {
    title: "Ausgewählte Projekte",
    badge: "Showcase · Fernando Máximo",
    description: "Eine Auswahl meiner neuesten Arbeiten — von Unternehmensplattformen bis hin zu persönlichen Lab-Tools.",
    cta: "Alle Repositories ansehen",
    buttons: {
      github: "GitHub",
      demo: "Demo",
      private: "Privates Repository",
      privateLabel: "Privat",
    },
    meta: [
      { label: "SaaS-Plattform" },
      { label: "Enterprise-App" },
      { label: "Portfolio & Lab" },
    ],
    list: [
      {
        title: "Marbella Fácil",
        description: "Umfassende SaaS-Plattform für intelligenten Tourismus. Robustes Laravel 10-Backend mit SPA-Architektur über React und Inertia.js. Dynamisches Abonnementmanagement, Echtzeit-Reservierungssystem und Wetterüberwachung.",
        tech: ["Laravel 10", "React", "Inertia.js", "MySQL", "SaaS"],
      },
      {
        title: "Sistema de Vados",
        description: "Unternehmenslösung für die Verwaltung von Fahrzeugzugangsgenehmigungen der Stadtverwaltung Marbella. Komplexe Geschäftslogik, Auditsysteme, Intranet-Bereitstellung und Active Directory (LDAP)-Integration.",
        tech: ["PHP", "PostgreSQL", "LDAP", "Intranet"],
      },
      {
        title: "Dev-Hub Fernando",
        description: "Mein persönliches Portfolio und KI/WA-Tools-Labor. Lokale Dateiverarbeitung über FFmpeg.wasm, Premium-Design mit Framer Motion und Architektur für selbst gehostete Server-Bereitstellung.",
        tech: ["Next.js 15", "React", "FFmpeg.wasm", "Docker"],
      },
    ],
  },

  // Stack Page
  stack: {
    title: "Tech Stack",
    badge: "Ökosystem · Fernando Máximo",
    techs: "Techs",
    description: "Ein Ökosystem sorgfältig ausgewählter Werkzeuge zur Entwicklung robuster, skalierbarer und sicherer Software.",
    categories: {
      backend: "Backend & Core",
      frontend: "Frontend & UI",
      infra: "Infrastructure & DevOps",
      database: "Databases",
    },
    principles: {
      title: "Prinzipien",
      list: [
        "Saubere und skalierbare Architektur",
        "Code-Qualität und Testing",
        "Performance und Optimierung",
        "Sicherheit und Best Practices",
      ],
    },
  },

  // Experience Page
  experience: {
    title: "Erfahrung",
    badge: "Werdegang · Fernando Máximo",
    description: "Mein beruflicher Werdegang und mein akademischer Hintergrund, konzentriert auf die Entwicklung von Software mit hoher Wirkung und kontinuierliche Verbesserung.",
    sections: {
      history: "Beruflicher Werdegang",
      certifications: "Zertifizierungen",
      skills: "Kompetenzen",
    },
    current: "Heute",
    timeline: [
      {
        id: "4",
        role: "Backend- & Datenbankentwickler",
        company: "Stadtverwaltung Marbella",
        start_date: "2026-03-01",
        end_date: null,
        description: "Migration und Vereinheitlichung der Datenbanken von Marbella und San Pedro aus CSV-Dateien in eine solide relationale Architektur in PostgreSQL. Entwicklung einer umfassenden CRUD-Webanwendung für die Verwaltung von Genehmigungen, Implementierung von Auditsystemen, Bereitstellung im städtischen Intranet und Integration mit Active Directory (LDAP) zur Gewährleistung des sicheren Zugriffs.",
        current: true,
      },
      {
        id: "1",
        role: "Webentwickler (Praktikum)",
        company: "ASISA",
        start_date: "2025-01-01",
        end_date: "2025-06-30",
        description: "Technische Verwaltung von Unternehmensportalen. Leistungsoptimierung durch Modulkonfiguration und Code-Refactorisierung. Mitarbeit am UI/UX-Design zur Gewährleistung reaktionsschneller und barrierefreier Schnittstellen in anspruchsvollen Geschäftsumgebungen.",
        current: false,
      },
      {
        id: "3",
        role: "Höherer Abschluss in Webentwicklung",
        company: "I.E.S. Salduba",
        start_date: "2024-09-15",
        end_date: null,
        description: "Technische Ausbildung in der Full-Stack-Entwicklung. Spezialisierung auf Java (Spring Boot), PHP (Laravel), Datenbanken (MySQL) und kollaborative Versionskontrolle mit Git/GitHub.",
        current: true,
      },
      {
        id: "2",
        role: "Technischer Verkäufer",
        company: "Alcampo",
        start_date: "2024-06-01",
        end_date: "2024-09-01",
        description: "Technische Hardware-Beratung und Lösungen. Lösung technischer Probleme unter Druck und fortgeschrittene Lager- und Bestandsverwaltung.",
        current: false,
      },
    ],
    certifications: [
      {
        id: "c1",
        title: "English B2 (First Certificate)",
        issuer: "Cambridge Assessment English",
        date: "2022",
        description: "Zertifizierte Kompetenz auf mittlerem bis fortgeschrittenem Niveau, fähig zur fließenden Kommunikation in beruflichen und technischen Umgebungen."
      },
      {
        id: "c2",
        title: "AWS Cloud Practitioner",
        issuer: "Amazon Web Services (AWS)",
        date: "2025",
        description: "Cloud-Grundlagen, Kerndienste, Sicherheit und AWS-Preismodelle."
      },
      {
        id: "c3",
        title: "Cybersecurity Essentials",
        issuer: "Cisco Networking Academy",
        date: "2025",
        description: "Prinzipien des Datenschutzes, der Bedrohungsminderung und der Sicherheit in Unternehmensnetzwerken."
      }
    ],
    softSkills: [
      "Problemlösung",
      "Technische Kommunikation",
      "Technologische Anpassungsfähigkeit",
      "Teamarbeit",
      "Technische Führung",
    ],
  },

  // Contact Page
  contact: {
    title: "Kontakt",
    subtitle: "Haben Sie ein Projekt im Sinn?",
    description: "Ich bin verfügbar für neue Projekte und Kooperationen. Senden Sie mir eine Nachricht und lassen Sie uns sprechen.",
    form: {
      name: "Name",
      email: "E-Mail",
      message: "Nachricht",
      namePlaceholder: "Ihr Name",
      emailPlaceholder: "ihre@email.de",
      messagePlaceholder: "Erzählen Sie mir von Ihrem Projekt...",
      submit: "Vorschlag senden",
      success: "Übertragung erfolgreich!",
      successDesc: "Ihre Nachricht wurde empfangen. Ich werde bald antworten.",
      sendAnother: "Weitere Nachricht senden",
    },
    info: {
      location: "Marbella, Spanien",
      availability: "Verfügbar für Freelance-Projekte",
      response: "Antwort in 24-48h",
      directEmail: "Direkte E-Mail",
      locationLabel: "Standort",
      availabilityLabel: "Verfügbarkeit",
    },
  },

  // Tools Page
  tools: {
    title: "Werkzeuge",
    subtitle: "Web-Utilities-Labor",
    description: "Sammlung nützlicher Tools für Entwicklung und alltägliche Aufgaben. Alle funktionieren zu 100% in Ihrem Browser.",
    categories: {
      image: "Bild",
      video: "Video",
      code: "Code",
      text: "Text",
      security: "Sicherheit",
      conversion: "Konvertierung",
      dev: "Entwicklung",
    },
    list: [
      {
        title: "Hintergrundentferner",
        description: "Automatisches Entfernen von Bildhintergründen mit KI. Kein Datei-Upload auf Server.",
        category: "image",
      },
      {
        title: "Image Forge",
        description: "Vollständiger Bildeditor: Größe ändern, zuschneiden, Filter, Anpassungen und mehr.",
        category: "image",
      },
      {
        title: "Bildkompressor",
        description: "JPG, PNG und WebP komprimieren ohne sichtbaren Qualitätsverlust. Intelligente Optimierung.",
        category: "image",
      },
      {
        title: "Bildkonverter",
        description: "Zwischen Formaten konvertieren: JPG, PNG, WebP, AVIF, GIF. Lokale Verarbeitung.",
        category: "image",
      },
      {
        title: "Video-Trimmer",
        description: "Videos ohne Neucodierung zuschneiden. Präzise Start- und Endauswahl.",
        category: "video",
      },
      {
        title: "Audio-Extraktor",
        description: "Audiospur aus jedem Video extrahieren. MP3-, WAV-, AAC-Formate.",
        category: "video",
      },
      {
        title: "GIF-Maker",
        description: "Animierte GIFs aus Videos erstellen. FPS-, Auflösungs- und Schleifensteuerung.",
        category: "video",
      },
      {
        title: "JSON-Formatierer",
        description: "JSON formatieren und validieren. Syntax-Hervorhebung und Fehlererkennung.",
        category: "code",
      },
      {
        title: "Code Beautifier",
        description: "Code in mehreren Sprachen verschönern: JS, HTML, CSS, Python, SQL.",
        category: "code",
      },
      {
        title: "Diff-Checker",
        description: "Zwei Texte oder Code-Blöcke Zeile für Zeile vergleichen.",
        category: "code",
      },
      {
        title: "Base64-Tool",
        description: "Base64 codieren und decodieren. Unterstützt Text und Bilder.",
        category: "conversion",
      },
      {
        title: "Hash-Generator",
        description: "MD5-, SHA-1-, SHA-256-Hashes generieren. Für Integritätsprüfung.",
        category: "security",
      },
      {
        title: "Passwort-Generator",
        description: "Sicherer Passwort-Generator. Konfigurierbar: Länge, Symbole, Zahlen.",
        category: "security",
      },
      {
        title: "QR-Code-Generator",
        description: "QR-Codes für URLs, Text, Kontakte erstellen. Download als PNG oder SVG.",
        category: "conversion",
      },
      {
        title: "Markdown-Vorschau",
        description: "Echtzeit-Markdown-Vorschau mit Syntax-Hervorhebung.",
        category: "text",
      },
      {
        title: "Lorem Ipsum",
        description: "Platzhaltertext-Generator. Anpassbare Absätze, Wörter oder Bytes.",
        category: "text",
      },
      {
        title: "Farbwähler",
        description: "Farbauswahl mit Konvertierung zwischen HEX, RGB, HSL und OKLCH.",
        category: "dev",
      },
      {
        title: "URL-Parser",
        description: "URLs parsen und aufschlüsseln. Protokoll, Domain, Parameter und mehr extrahieren.",
        category: "dev",
      },
      {
        title: "Regex-Tester",
        description: "Reguläre Ausdrücke in Echtzeit testen. Mit Mustererklärung.",
        category: "dev",
      },
      {
        title: "Zeitstempel-Konverter",
        description: "Zwischen Unix-Zeitstempeln und lesbaren Daten konvertieren. Mehrere Zeitzonen.",
        category: "conversion",
      },
      {
        title: "JWT-Decoder",
        description: "JWT-Tokens decodieren und verifizieren. Header, Payload und Signatur visualisieren.",
        category: "security",
      },
    ],
  },
  // Common Labels
  common: {
    copy: "Kopieren",
    copied: "Kopiert!",
    clear: "Löschen",
    success: "Erfolg",
    error: "Fehler",
    loading: "Ladevorgang...",
    status: "Status",
    result: "Ergebnis",
    actions: "Aktionen",
    settings: "Einstellungen",
    back: "Zurück",
    format: "Format",
    size: "Größe",
    quality: "Qualität",
    download: "Herunterladen",
  },

  // Components
  components: {
    fileDropzone: {
      defaultLabel: "Datei hierher ziehen oder zum Auswählen klicken",
      activeLabel: "Datei hier ablegen...",
      rejectLabel: "Dateityp wird nicht unterstützt",
      maxSizeLabel: "(Maximale Größe: {size})",
      removeFile: "Datei entfernen",
    },
  },

  // Tools Specific
  tools_content: {
    wordCounter: {
      title: "Wort- & Lesezähler",
      description: "Analysieren Sie Ihren Text mit detaillierten Statistiken, geschätzter Lesezeit und Lesbarkeitsindex.",
      placeholder: "Geben Sie Ihren Text hier ein oder fügen Sie ihn ein, um ihn zu analysieren...",
      stats: {
        words: "Wörter",
        characters: "Zeichen",
        noSpaces: "Ohne Leerzeichen",
        sentences: "Sätze",
        paragraphs: "Absätze",
        readingTime: "Lesezeit",
      },
      analysis: {
        title: "Lesbarkeitsanalyse",
        readability: "Lesestufe",
        wordsPerSentence: "Wörter/Satz",
        charsPerWord: "Zeichen/Wort",
        levels: {
          veryEasy: "Sehr einfach",
          easy: "Einfach",
          moderate: "Moderat",
          hard: "Schwierig",
          veryHard: "Sehr schwierig",
          na: "N/V",
        },
      },
      minutes: "{count, plural, =1 {1 Minute} other {# Minuten}}",
    },
    videoCrunch: {
      title: "Video Crunch",
      description: "Komprimieren und konvertieren Sie Videos lokal mit der vollen Leistung von WASM in Ihrem Browser.",
      status: {
        loading: "Motor wird geladen...",
        compressing: "Wird komprimiert...",
        start: "Video komprimieren",
        starting: "Komprimierung wird gestartet...",
        done: "Komprimierung beendet",
        idle: "Laden Sie ein Video hoch, um zu beginnen",
        cpuWarning: "Dies kann je nach CPU eine Weile dauern",
      },
      originalVideo: "Originalvideo",
      compressionSettings: "Komprimierungseinstellungen",
      outputSettings: "Ausgabeeinstellungen",
      resolution: "Auflösung",
      selectResolution: "Auflösung wählen",
      compressionLevel: "Komprimierungsstufe",
      formats: {
        mp4: "MP4 (Maximale Kompatibilität)",
      },
    }
  },
};
