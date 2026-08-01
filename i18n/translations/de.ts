// Nur UI-Texte. Die Inhalte (Fallstudien, Werdegang, Kompetenzen) liegen in
// content/, damit längere Texte nicht dreifach gepflegt werden müssen.
export const de = {
  metadata: {
    title: "Fernando Martínez · Full-Stack-Entwickler",
    description:
      "Full-Stack-Entwickler in Marbella, Spanien. Laravel, React und PostgreSQL, mit Software im Produktivbetrieb für die öffentliche Verwaltung und eigene Projekte.",
    ogTitle: "Fernando Martínez · Full-Stack-Entwickler",
    ogDescription:
      "Fallstudien echter Software: kommunale Verwaltung, Dienstleistungsplattformen und selbst gehostete Infrastruktur.",
    siteName: "Fernando Martínez",
  },

  nav: {
    home: "Start",
    work: "Arbeiten",
    experience: "Werdegang",
    stack: "Stack",
    tools: "Labor",
    contact: "Kontakt",
    openMenu: "Menü öffnen",
    closeMenu: "Menü schließen",
    toggleTheme: "Zwischen hellem und dunklem Design wechseln",
    language: "Sprache",
    skipToContent: "Zum Inhalt springen",
  },

  footer: {
    role: "Full-Stack-Entwickler · Marbella, Spanien",
    tech: "Mit Next.js gebaut, selbst gehostet auf Ubuntu",
    rights: "Alle Rechte vorbehalten",
    sections: "Bereiche",
    elsewhere: "Anderswo",
  },

  home: {
    availability: "Verfügbar für neue Projekte",
    role: "Full-Stack-Entwickler",
    specialties: "Laravel · React · PostgreSQL",
    intro:
      "Ich baue Software, die in den Produktivbetrieb geht und dort bleibt: Verwaltungssysteme für die öffentliche Hand, Dienstleistungsplattformen und die Infrastruktur, die sie trägt. Keine Screenshots aus Kursprojekten, sondern Fallstudien von innen erzählt.",
    ctaWork: "Fallstudien ansehen",
    ctaCv: "Lebenslauf herunterladen",
    nowLabel: "Aktuell",
    nowSince: "seit",
    workEyebrow: "Ausgewählte Arbeiten",
    workHeading: "Projekte von innen erzählt",
    workIntro: "Welches Problem bestand, was ich entschieden habe und was offen blieb. Ohne Schönfärberei.",
    workAll: "Alle Fallstudien ansehen",
    aboutEyebrow: "Über mich",
    aboutHeading: "Mich interessiert Software, die Bestand hat",
    about: [
      "Ich bin staatlich geprüfter Techniker für Webanwendungsentwicklung und arbeite vor allem mit Laravel, React und relationalen Datenbanken. Mein Praktikum habe ich bei der Stadtverwaltung Marbella absolviert und dort ein Verwaltungssystem gebaut, das sowohl den Sachbearbeitern als auch den Altdaten standhalten musste.",
      "Am meisten gelernt habe ich allerdings beim Betrieb meines eigenen Servers. Fünfundzwanzig Container im Produktivbetrieb, echte Störungen und die Erkenntnis, dass der wirklich teure Fehler nicht der Absturz ist, sondern der Dienst, der weiterläuft, ohne seine Arbeit zu tun.",
    ],
    stackEyebrow: "Stack",
    stackHeading: "Womit ich arbeite",
    stackAll: "Kompletten Stack ansehen",
    labEyebrow: "Labor",
    labHeading: "Ein Labor für Web-Werkzeuge",
    labIntro:
      "Eine Sammlung von Werkzeugen, die ich täglich nutze und die vollständig im Browser laufen: Nichts, was du hochlädst, verlässt deinen Rechner.",
    labCta: "Zum Labor",
    contactHeading: "Sprechen wir?",
    contactIntro:
      "Ich bin offen für neue Aufgaben und Zusammenarbeit. Ich antworte innerhalb von 24-48 Stunden.",
    contactCta: "Schreib mir",
  },

  work: {
    title: "Arbeiten",
    intro:
      "Vier Projekte, die besser erklären, was ich kann, als jede Technologieliste. Jedes beschreibt das Ausgangsproblem, meine Entscheidungen und das, was ungelöst blieb.",
    columns: {
      project: "Projekt",
      client: "Auftraggeber",
      year: "Jahr",
    },
    read: "Fallstudie lesen",
    backToIndex: "Alle Fallstudien",
    nextCase: "Nächste Fallstudie",
    meta: {
      client: "Auftraggeber",
      period: "Zeitraum",
      role: "Rolle",
      stack: "Stack",
    },
    repoPublic: "Code auf GitHub ansehen",
    repoPrivate: "Privates Repository",
    onThisPage: "Auf dieser Seite",
    figureLabel: "Abbildung",
  },

  experience: {
    title: "Werdegang",
    intro:
      "Beruflicher Werdegang, Ausbildung und Kompetenzen. Jeder Kompetenzblock verlinkt auf die Fallstudie, in der man ihn nachprüfen kann.",
    sections: {
      work: "Beruflicher Werdegang",
      education: "Ausbildung",
      certifications: "Zertifikate",
      skills: "Kompetenzen",
    },
    present: "Heute",
    relatedCase: "Zugehörige Fallstudie",
    downloadCv: "Lebenslauf als PDF herunterladen",
  },

  stackPage: {
    title: "Stack",
    intro:
      "Die Werkzeuge, mit denen ich regelmäßig arbeite, nach Aufgabe gruppiert. Sie stehen hier, weil ich sie in etwas Funktionierendem eingesetzt habe, nicht weil ich ein Tutorial gesehen habe.",
    principlesTitle: "Wie ich arbeite",
    principles: [
      "Geschäftsregeln gehören dorthin, wo man sie nicht umgehen kann: in eine Policy oder einen Scope, nicht hinter einen versteckten Button.",
      "Ein stiller Fehler ist schlimmer als ein Ausfall. Wenn etwas unbemerkt ausfallen kann, baue ich zuerst die Benachrichtigung.",
      "Das Deployment ist Teil des Produkts: Wenn Ausliefern lästig ist, liefert man seltener aus.",
      "Mir ist ein langweiliges, sauber normalisiertes Schema lieber als eine Abkürzung, die ich in einem halben Jahr zurückbauen muss.",
    ],
  },

  contact: {
    title: "Kontakt",
    intro:
      "Schreib mir, worum es geht, und ich antworte innerhalb von 24-48 Stunden. Wenn dir eine direkte E-Mail lieber ist, findest du die Adresse gleich hier.",
    form: {
      name: "Name",
      email: "E-Mail",
      message: "Nachricht",
      namePlaceholder: "Dein Name",
      emailPlaceholder: "du@email.com",
      messagePlaceholder: "Erzähl mir, woran du arbeitest…",
      submit: "Nachricht senden",
      sending: "Wird gesendet…",
      success: "Nachricht gesendet",
      successDesc: "Danke für deine Nachricht. Ich melde mich innerhalb von 24-48 Stunden.",
      sendAnother: "Weitere Nachricht senden",
    },
    info: {
      emailLabel: "E-Mail",
      locationLabel: "Standort",
      availabilityLabel: "Verfügbarkeit",
      availability: "Offen für neue Aufgaben",
      responseLabel: "Antwortzeit",
      response: "24-48 Stunden",
      cvLabel: "Lebenslauf",
      cvAction: "Als PDF herunterladen",
    },
  },

  // Diagramme der Fallstudien (components/case/Figure.tsx)
  figures: {
    vadosFlow: {
      steps: [
        { label: "React + Inertia", note: "der Benutzer handelt" },
        { label: "Auth-Middleware", note: "prüft die Sitzung" },
        { label: "Controller + Policy", note: "validiert und autorisiert" },
        { label: "Eloquent + TerritorioScope", note: "filtert nach Bezirk" },
        { label: "PostgreSQL", note: "Persistenz" },
      ],
      observerLabel: "Observer",
      observerText:
        "Parallel dazu schreibt `VadoObserver` den Protokolleintrag (Benutzer, Ausweisnummer, Rechner und die Differenz `old`/`new`), ohne dass der Controller etwas tut.",
    },
    vadosRoles: {
      caption: "Lese- und Schreibrechte nach Rolle und Bezirk",
      roleHeader: "Rolle",
      readWrite: "lesen + schreiben",
      readOnly: "nur lesen",
    },
    mfArch: {
      nodeA: { label: "Knoten A", note: "React-SPA + Laravel-API in Containern" },
      nodeB: { label: "Knoten B (Spiegel)", note: "Gleicher Stack, unabhängiges Deployment" },
      vpn: {
        label: "Tailscale · Mesh-Netz auf WireGuard",
        note: "Verschlüsselter Punkt-zu-Punkt-Tunnel; der MySQL-Port zeigt nie ins Internet",
      },
      db: { label: "MySQL 8 · Server der Schule", note: "Hinter der Firewall des Campus" },
      footnote:
        "Vor beiden Knoten arbeitet Cloudflare als Reverse Proxy und WAF mit SSL/TLS im Strict-Modus. Portainer fragt GitHub alle fünf Minuten ab und baut die Container neu, sobald es Änderungen erkennt.",
    },
    homelabNet: {
      paths: [
        {
          scope: "Öffentlich",
          label: "Cloudflare Tunnel",
          detail: "Domains und Websites. Ausgehender Tunnel: Der Router öffnet keinen eingehenden Port.",
        },
        {
          scope: "Privat",
          label: "Tailscale",
          detail: "Portainer, interne Dashboards und SSH. Nur aus dem Mesh-Netz erreichbar.",
        },
        {
          scope: "Isoliert",
          label: "ipvlan-Netz",
          detail: "Ein Container im Segment des zweiten Modems, ohne NAT. Trennung auf Schicht 2.",
        },
      ],
    },
    galleryPipeline: {
      steps: [
        { label: "Upload", note: "der Client sendet die Datei" },
        { label: "Speicherprüfung", note: "freier Platz und Markierungsdatei" },
        { label: "FFmpeg", note: "Neukodierung mit begrenzten Threads" },
        { label: "YouTube-API", note: "OAuth mit Refresh-Token" },
        { label: "Benachrichtigung", note: "Push, ntfy, Discord oder E-Mail" },
      ],
      footnote:
        "Schlägt die Speicherprüfung fehl, endet der Vorgang dort: Einen Upload abzulehnen ist besser, als das Volume zu füllen und die Datenbank auf Nur-Lesen zu setzen.",
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
