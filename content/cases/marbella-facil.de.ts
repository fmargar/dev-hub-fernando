import type { CaseStudy } from "../types";

export const marbellaFacilDe: CaseStudy = {
  slug: "marbella-facil",
  order: 2,
  featured: true,
  title: "Marbella Fácil",
  tagline:
    "Eine Plattform für Tourismus- und Bürgerdienste: Reservierungen, Gamification und kommunale Echtzeitdaten an einem Ort.",
  client: "Abschlussprojekt der Ausbildung (DAW)",
  period: "Okt 2025 – Mai 2026",
  year: "2025–26",
  role: "Full Stack und DevOps, im Zweierteam",
  summary:
    "Eine Plattform, die zusammenführt, was heute auf fünf getrennte Apps verteilt ist: ein Verzeichnis lokaler Betriebe mit Tischreservierung, Strandzustände, den Nahverkehr, einen Veranstaltungskalender und einen Assistenten, der Fragen zur Stadt beantwortet. Laravel-Backend mit REST-API, entkoppeltes React-Frontend und eine Infrastruktur aus zwei Knoten, die so viel Arbeit war wie der Code selbst.",
  stack: [
    "Laravel 12",
    "React 19",
    "Vite 7",
    "MySQL 8",
    "Laravel Sanctum",
    "Stripe / Cashier",
    "Groq (Llama 3)",
    "Leaflet",
    "Docker",
    "PHPUnit",
  ],
  metrics: [
    { value: "34+", label: "Entitäten im Datenmodell" },
    { value: "5", label: "funktionale Module" },
    { value: "2", label: "gespiegelte Produktivknoten" },
    { value: ">80 %", label: "Abdeckung in kritischen Modulen" },
  ],
  sections: [
    {
      id: "contexto",
      heading: "Ausgangslage",
      body: [
        "Marbella ist ein bedeutendes Reiseziel mit vollständig zersplitterten kommunalen Informationen. Wer einen Nachmittag plant, besucht die Website der Stadt, die des Busunternehmens, eine Wetter-App, einen Restaurantvergleich und die sozialen Kanäle jedes einzelnen Betriebs.",
        "Globale Vergleichsportale decken die kommerzielle Seite gut ab, haben aber keine der lokalen öffentlichen Daten; institutionelle Portale haben die Daten, lassen einen damit aber nichts anfangen. Marbella Fácil liegt dazwischen: kommunale Information **und** die Möglichkeit, daraufhin zu handeln — mit einem Modell, das kleinen Betrieben keine Provision pro Transaktion abverlangt.",
      ],
    },
    {
      id: "arquitectura",
      heading: "Architektur",
      body: [
        "Anders als beim Genehmigungssystem haben wir hier eine **entkoppelte Architektur** gebaut: eine REST-API in Laravel 12 und eine React-19-SPA, ausgeliefert von Vite, die über Axios mit Interceptors kommunizieren, welche das Token einfügen und die Fehlerbehandlung bündeln. Der Grund: Die Plattform hat vier sehr unterschiedliche Nutzertypen (Besucher, angemeldeter Nutzer, Betrieb und Administrator), und die Trennung erlaubte es, die Oberfläche weiterzuentwickeln, ohne die Geschäftslogik anzufassen.",
        "Die Authentifizierung übernimmt Laravel Sanctum mit eigener Middleware für die Rollensteuerung. Das Datenmodell umfasst über 34 verknüpfte Entitäten in MySQL 8, mit Fremdschlüsseln, Suchindizes und Protokolltabellen.",
      ],
      figure: {
        key: "mf-arch",
        caption: "Zwei gespiegelte Knoten liefern die Anwendung aus; eine einzige Datenbank wird über das VPN erreicht.",
      },
    },
    {
      id: "modulos",
      heading: "Die Module",
      bullets: [
        {
          term: "Reservierungen",
          text: "Der transaktionale Kern. Jeder Betrieb legt seine Reservierungsarten, Zeitfenster und Ausnahmen fest (Schließtage, Sonderzeiten). Nutzer reservieren gegen die tatsächliche Verfügbarkeit, der Betrieb bestätigt oder lehnt in Echtzeit ab — mit Zuständen von offen bis abgeschlossen.",
        },
        {
          term: "Gamification",
          text: "Punkte für Aktionen (tägliche Anmeldung, Bewertungen schreiben, Veranstaltungen besuchen), Stufen mit Schwellenwerten und ein Katalog einlösbarer Prämien. Geschlossen wird der Kreis durch die physische Einlösung: Der Nutzer zeigt einen QR-Code, der Inhaber bestätigt ihn in seinem Panel und markiert die Prämie als ausgegeben. Jede Punktebuchung landet in einer Historientabelle.",
        },
        {
          term: "Smart City",
          text: "Strandzustände, automatisch über die Wetter-API der AEMET nach Stationskennung abgeglichen, georeferenzierte Buslinien und Haltestellen mit Verkehrsschätzungen, ein Veranstaltungskalender und lokale Nachrichten.",
        },
        {
          term: "KI-Assistent",
          text: "Ein Chat auf Groq Cloud mit Llama 3, abgestimmt über System-Prompts mit lokalem Wissen. Er ist per Laravel-Throttling auf 20 Anfragen pro Stunde und IP begrenzt, denn ein offener KI-Endpunkt ist eine Rechnung, die nur darauf wartet, zu entstehen.",
        },
        {
          term: "Bewertungen und Interaktion",
          text: "Bewertungen mit Antwort des Inhabers, Nützlichkeitsstimmen und verschachtelten Kommentaren, samt Moderation gemeldeter Inhalte im Administrationsbereich.",
        },
      ],
    },
    {
      id: "pagos",
      heading: "Zwei Geschäftsmodelle in einer Codebasis",
      body: [
        "Die Plattform unterstützt zwei Verwertungswege, ohne den Code zu verzweigen. Auf dem privaten Weg (SaaS) buchen Betriebe einen Tarif über **Stripe Checkout** in Verbindung mit Laravel Cashier, synchronisiert über signierte Webhooks für Abschluss, Verlängerung und Kündigung.",
        "Auf dem öffentlichen Weg (B2G) erwirbt eine Stadtverwaltung die Lizenz, und das Verzeichnis bleibt für den örtlichen Handel kostenlos. In diesem Modus entfällt der Bezahlvorgang, und ein Betrieb wird administrativ freigeschaltet. Beides von Anfang an mitzudenken hat uns erspart, das Betriebsmodul für jedes Szenario neu zu schreiben.",
      ],
    },
    {
      id: "infra",
      heading: "Infrastruktur und Deployment",
      body: [
        "Dieser Teil lag bei mir, und hier habe ich am meisten gelernt. Die Datenbank lief auf einem physischen Server der Schule, hinter deren Firewall, während die Anwendung außerhalb laufen musste.",
      ],
      bullets: [
        {
          term: "Zwei gespiegelte Knoten",
          text: "Jeder mit dem vollständigen containerisierten Stack, damit der Ausfall eines Knotens das Projekt nicht offline nimmt.",
        },
        {
          term: "Deployment direkt aus dem Repository",
          text: "Nichts wird von Hand hochgeladen. Die Portainer-Stacks lesen ihre Definition aus GitHub und fragen alle fünf Minuten nach: Ein Merge in den Hauptzweig baut die Knoten selbsttätig neu.",
        },
        {
          term: "Tailscale als Weg zur Datenbank",
          text: "Ein Mesh-Netz auf WireGuard-Basis verbindet die Knoten mit dem Schulserver. Die Laravel-Container sprechen mit der privaten Adresse im VPN, sodass der MySQL-Port nie ins Internet zeigt.",
        },
        {
          term: "Cloudflare davor",
          text: "Reverse Proxy und WAF, SSL/TLS im Strict-Modus, und die echten IP-Adressen der Server bleiben verborgen.",
        },
      ],
    },
    {
      id: "calidad",
      heading: "Tests",
      body: [
        "Im Backend PHPUnit mit Unit-Tests für die Logik, die am meisten wehtut, wenn sie bricht — Punkteberechnung und die Verfügbarkeitsprüfung für Reservierungen — dazu Integrationstests, die echte HTTP-Anfragen gegen die Endpunkte schicken und dabei Sanctum-Middleware und Persistenz prüfen. In den kritischen Modulen haben wir die Abdeckung über 80 % gehalten.",
        "Im Frontend ESLint mit strengen Stilregeln. Die API-Verträge wurden vor der Integration in Postman geprüft, damit das Frontend nie gegen ein Antwortformat gebaut wurde, das sich später ändert.",
      ],
    },
    {
      id: "aprendizaje",
      heading: "Was ich mitnehme",
      body: [
        "Dass der schwierige Teil eines Projekts zu zweit nicht die Aufteilung des Codes ist, sondern die Einigung auf die Schnittstellen. Die Endpunkte in Postman zu prüfen, bevor wir das Frontend anfassten, hat uns die meisten fehlgeschlagenen Integrationen erspart.",
        "Und dass die Infrastruktur Teil des Produkts ist. Dass Portainer GitHub abfragt, hat das Deployment zu etwas gemacht, über das wir nicht mehr nachdenken mussten — und das hat den Rhythmus der Entwicklung stärker verändert als jede Framework-Entscheidung.",
      ],
    },
  ],
  links: [],
  repo: {
    visibility: "public",
    href: "https://github.com/fmargarrobertogd75/proyecto-marbella-facil",
  },
};
