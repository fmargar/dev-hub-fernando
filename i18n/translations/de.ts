import { TranslationKeys } from './es';

export const de: TranslationKeys = {
  // Layout & Metadata
  metadata: {
    title: "Fernando Máximo | Full Stack Developer",
    description: "Full Stack Developer spezialisiert auf moderne Architekturen, Cloud und leistungsstarke Unternehmenslösungen.",
    openGraph: {
      title: "Fernando Máximo | Full Stack Developer",
      description: "Professionelles Portfolio von Fernando Máximo. Spezialist für React, Next.js, Node.js und Cloud-Lösungen.",
      siteName: "Fernando Máximo Portfolio",
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
    copyright: "© 2026 Fernando Máximo · Alle Rechte vorbehalten",
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
    availability: "Verfügbar für neue Projekte",
    finalCta: {
      title: "Bereit, etwas Unglaubliches zu bauen?",
      button: "Jetzt loslegen",
    },
    aboutMe: {
      badge: "Über mich",
      heading: "Die Zukunft mit Code und Kreativität vorantreiben.",
      extra: "Ich bin ein Technologiebegeisterter, der ständig die Grenzen des im Web Möglichen auslotet. Mein Fokus liegt darauf, flüssige, sichere und visuell beeindruckende digitale Erlebnisse zu schaffen, die echte Probleme lösen.",
      features: [
        { title: "Clean Code", description: "Skalierbare und wartbare Architekturen." },
        { title: "Performance", description: "Ladeoptimierung und Benutzererfahrung." },
        { title: "Full Stack", description: "Von der UI bis zur Infrastruktur." },
      ],
    },
    experienceHighlights: {
      badge: "Werdegang",
      heading: "Berufliche",
      headingAccent: "Erfahrung",
      cta: "Vollständige Historie erkunden",
    },
    featuredProjects: {
      badge: "Showcase",
      heading: "Ausgewählte",
      headingAccent: "Projekte",
      cta: "Alle Projekte ansehen",
    },
    certifications: {
      badge: "Zertifizierungen",
      heading: "Von",
      headingAccent: "Branchenführern validiert",
      credential: "Zertifikat ansehen",
    },
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
      weeks: "Wochen",
    },
    calendarMonths: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'] as string[],
    calendarMonthsShort: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'] as string[],
    calendarWeekdays: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'] as string[],
    calendarLess: 'Weniger',
    calendarMore: 'Mehr',
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
    technicalSkills: "Technische Fähigkeiten",
    selfAssessment: "Selbstbewertung · 2026",
    certModal: {
      issuer: "Aussteller",
      description: "Beschreibung",
      clickHint: "Klicken für Details →",
      close: "Schließen",
    },
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
    searchPlaceholder: "Unter {count} Werkzeugen suchen...",
    recentlyUsed: "Zuletzt verwendet",
    searchResults: "{count} Ergebnis(se) für",
    noResults: "Keine Werkzeuge gefunden für",
    categories: {
      image: "Bild & Farbe",
      video: "Video",
      code: "Code",
      text: "Text",
      security: "Sicherheit",
      conversion: "Konvertierung",
      dev: "Entwicklung",
      sports: "Sport",
    },
    list: [
      {
        title: "BG-Remover",
        description: "Bildhintergrund sofort per KI direkt im Browser entfernen.",
        category: "image",
      },
      {
        title: "Image Forge",
        description: "Bilder zwischen Formaten konvertieren und skalieren (WebP, AVIF, PNG, JPG).",
        category: "image",
      },
      {
        title: "Bildkompressor",
        description: "Bildgröße reduzieren bei gleichbleibender Qualität für schnellere Ladezeiten.",
        category: "image",
      },
      {
        title: "Metadaten-Extraktor",
        description: "EXIF-Informationen aus Fotos lesen: Kameramodell, Datum, GPS-Standort und mehr.",
        category: "image",
      },
      {
        title: "Farbblindheits-Simulator",
        description: "Visualisieren, wie Menschen mit Deuteranopie, Protanopie, Tritanopie und mehr Bilder wahrnehmen.",
        category: "image",
      },
      {
        title: "Paletten-Extraktor",
        description: "Dominante Farben eines Bildes in HEX, RGB und HSL extrahieren.",
        category: "image",
      },
      {
        title: "Color Picker",
        description: "Klicken Sie auf einen beliebigen Punkt eines Bildes, um seine genaue Farbe zu erfassen.",
        category: "image",
      },
      {
        title: "Verlaufsgenerator",
        description: "Lineare, radiale und konische CSS-Verläufe visuell erstellen. CSS sofort kopieren.",
        category: "image",
      },
      {
        title: "Favicon Generator",
        description: "Das komplette Favicon-Paket (16×16 bis 512×512) aus einem beliebigen Bild generieren.",
        category: "image",
      },
      {
        title: "Video Crunch",
        description: "Videos komprimieren und in GIF umwandeln mit FFmpeg.wasm ohne die Seite zu verlassen.",
        category: "video",
      },
      {
        title: "Snippet Generator",
        description: "Code in attraktive Bilder für Social Media umwandeln.",
        category: "code",
      },
      {
        title: "JSON Formatter",
        description: "JSON-Strukturen schnell und sicher validieren, formatieren oder minifizieren.",
        category: "code",
      },
      {
        title: "SVG to Data URI",
        description: "SVG-Dateien in URI-Strings konvertieren für direkte Verwendung in CSS oder HTML.",
        category: "code",
      },
      {
        title: "Code Beautifier",
        description: "HTML, CSS und JavaScript-Code sofort im Browser verschönern oder minifizieren.",
        category: "code",
      },
      {
        title: "Wortanzähler",
        description: "Text mit detaillierten Statistiken, Lesezeit und Lesbarkeitsindex analysieren.",
        category: "text",
      },
      {
        title: "Textvergleich",
        description: "Zwei Texte nebeneinander mit Git-Diff-Stil-Hervorhebung vergleichen.",
        category: "text",
      },
      {
        title: "Lorem Ipsum Generator",
        description: "Professionellen Platzhaltertext auf Englisch oder Spanisch generieren.",
        category: "text",
      },
      {
        title: "Markdown-Editor",
        description: "Markdown schreiben und Ergebnis in Echtzeit vorschauen. Export als .md oder .html.",
        category: "text",
      },
      {
        title: "Password Generator",
        description: "Sichere Passwörter mit erweiterten Einstellungen und Echtzeit-Entropie-Messer generieren.",
        category: "security",
      },
      {
        title: "Hashing Tool",
        description: "MD5, SHA-256 und SHA-512 kryptographische Hashes zur Datenintegritätsprüfung generieren.",
        category: "security",
      },
      {
        title: "Base64 Encoder/Decoder",
        description: "Text oder Dateien in Base64 kodieren und dekodieren. Grundlegend für Webentwicklung.",
        category: "security",
      },
      {
        title: "Text Encryptor",
        description: "Nachrichten mit AES und einem Passwort verschlüsseln. Ideal für sensible Informationen.",
        category: "security",
      },
      {
        title: "JWT Decoder",
        description: "JWT-Tokens dekodieren und analysieren. Header, Payload und Ablaufdatum anzeigen.",
        category: "security",
      },
      {
        title: "Data Units Converter",
        description: "Zwischen Bytes, KB, MB, GB, TB mit binärer (KiB) und dezimaler Genauigkeit konvertieren.",
        category: "conversion",
      },
      {
        title: "Unix Timestamp",
        description: "Normale Daten in Unix-Timestamp und umgekehrt konvertieren. Essenziell für Datenbanken.",
        category: "conversion",
      },
      {
        title: "CSV to JSON",
        description: "CSV-Dateien in JSON konvertieren und umgekehrt. Ideal für Datenmigration und APIs.",
        category: "conversion",
      },
      {
        title: "QR Code Generator",
        description: "Benutzerdefinierte QR-Codes generieren und QR aus Bildern lesen. URLs, Text und vCards.",
        category: "conversion",
      },
      {
        title: "Seitenverhältnis-Rechner",
        description: "Abmessungen unter Beibehaltung des Verhältnisses berechnen und skalieren.",
        category: "conversion",
      },
      {
        title: ".gitignore Generator",
        description: "Benutzerdefinierte .gitignore-Dateien basierend auf dem Tech-Stack mit aktuellen Templates.",
        category: "dev",
      },
      {
        title: "README.md Generator",
        description: "Professionelle GitHub READMEs mit Vorlagen, Badges und anpassbaren Abschnitten erstellen.",
        category: "dev",
      },
      {
        title: "Regex Tester",
        description: "Reguläre Ausdrücke in Echtzeit testen mit Match- und Gruppen-Hervorhebung.",
        category: "dev",
      },
      {
        title: "Cron Helper",
        description: "Cron-Ausdrücke in einfacher Sprache erstellen und verstehen. Zeigt bevorstehende Ausführungen.",
        category: "dev",
      },
      {
        title: "NBA Live Scores",
        description: "NBA-Spielstände in Echtzeit verfolgen. Live-Spiele, Finals und Spielplan mit Auto-Refresh.",
        category: "sports",
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
