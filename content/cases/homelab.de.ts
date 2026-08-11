import type { CaseStudy } from "../types";

export const homelabDe: CaseStudy = {
  slug: "homelab",
  track: "personal",
  order: 4,
  featured: true,
  title: "Homelab: selbst gehostete Infrastruktur",
  tagline:
    "Ein Ubuntu-Server mit fünfundzwanzig containerisierten Diensten, die seit Monaten laufen — und was man beim Betreiben lernt.",
  client: "Privatprojekt, dauerhaft im Produktivbetrieb",
  period: "2025 – heute",
  year: "2025–",
  role: "Entwurf, Betrieb und Wartung",
  summary:
    "Alles auf dieser Domain läuft auf einer Maschine, die ich selbst administriere. Kein Spielzeuglabor: Es gibt Dienste mit echten Nutzern, Störungen um drei Uhr nachts und Architekturentscheidungen, die einen etwas kosten, wenn man sie falsch trifft. Hier habe ich die Betriebsseite wirklich gelernt.",
  stack: [
    "Ubuntu Server",
    "Docker",
    "Docker Compose",
    "Portainer",
    "Nginx",
    "Cloudflare Tunnel",
    "Tailscale",
    "PostgreSQL",
    "MariaDB",
    "ntfy",
  ],
  metrics: [
    { value: "25", label: "Container im Produktivbetrieb", liveKey: "containers" },
    { value: "17", label: "verwaltete Stacks", liveKey: "stacks" },
    { value: "0", label: "offengelegte Datenbank-Ports", liveKey: "dbPortsExposed" },
    { value: "2", label: "unabhängige Internetzugänge", liveKey: "internetEgress" },
  ],
  sections: [
    {
      id: "que-hay",
      heading: "Was darauf läuft",
      body: [
        "Der Server beherbergt meine eigenen Anwendungen — dieses Portfolio, einen Videodienst und mehrere Dashboards —, einen Push-Benachrichtigungsserver, ein zusammengeführtes Mailpostfach und mehrere per Cron geplante Prozesse.",
        "Alles ist containerisiert und wird über **Portainer auf Docker-Compose-Stacks** verwaltet, versioniert in Git. Keine Konfiguration existiert nur im Kopf einer Person oder in einer losen Datei auf dem Server.",
      ],
      figure: {
        key: "homelab-net",
        caption: "Drei getrennte Zugangswege, jeder mit eigenem Zweck: öffentlich, privat und isoliert.",
      },
    },
    {
      id: "red",
      heading: "Drei Netze, drei Zwecke",
      bullets: [
        {
          term: "Cloudflare Tunnel für alles Öffentliche",
          text: "Die Domains erreichen das Internet über einen ausgehenden Tunnel. Der Router öffnet keinen eingehenden Port, und die echte IP des Anschlusses taucht in keinem DNS-Eintrag auf.",
        },
        {
          term: "Tailscale für die Administration",
          text: "Portainer, interne Dashboards und SSH sind nur aus dem Mesh-Netz erreichbar. Nichts davon ist veröffentlicht.",
        },
        {
          term: "Ein isoliertes ipvlan-Netz",
          text: "Eine Automatisierung muss über einen anderen Anschluss hinaus als der Rest. Statt das über Policy Routing zu lösen — fragil und leicht unbemerkt kaputtzumachen — habe ich ein Docker-**ipvlan**-Netz angelegt, das diesen Container direkt in das Netzsegment des zweiten Modems setzt, ohne NAT. Die Trennung ist echt, auf Schicht 2, und hängt nicht davon ab, dass eine Routing-Tabelle korrekt bleibt.",
        },
      ],
    },
    {
      id: "datos",
      heading: "Daten sind das Einzige, was sich nicht neu bauen lässt",
      body: [
        "Ein Container ist in dreißig Sekunden wieder da; eine beschädigte Datenbank nicht. Daraus folgen zwei Regeln, die ich auf jeden Stack anwende.",
      ],
      bullets: [
        {
          term: "Keine Datenbank lauscht im Netz",
          text: "PostgreSQL und MariaDB veröffentlichen ihre Ports ausschließlich auf `127.0.0.1`. Der eigentliche Verkehr läuft über das interne Docker-Netz zwischen den Containern; die lokale Bindung existiert nur zur Fehlersuche vom Host aus.",
        },
        {
          term: "Trennung zwischen Stacks",
          text: "Dienste ohne Bezug zueinander teilen sich keine Datenbank, auch wenn das billiger wäre. Ein Stack, der umkippt, kann die Daten eines anderen nicht mitreißen.",
        },
        {
          term: "Healthchecks für alles mit Zustand",
          text: "Mit `depends_on: service_healthy`, damit eine API nie gegen eine Datenbank startet, die noch initialisiert, und dann auf eine Art scheitert, die sich später schwer nachvollziehen lässt.",
        },
      ],
    },
    {
      id: "incidente",
      heading: "Eine Störung, die mehr beigebracht hat als jedes Tutorial",
      pullQuote:
        "Der gefährliche Fehler ist nicht der, der abstürzt, sondern der, der weiterläuft, ohne seine Arbeit zu tun.",
      body: [
        "Der lehrreichste Fehler, den ich hatte, war ein **stiller**. Zwei Container mit einem Client gegen eine fremde API galten als `healthy`, waren verbunden und zeigten keinen einzigen Fehler im Log. Sie kamen einfach nicht mehr voran. Tagelang ohne eine einzige abgeschlossene Aufgabe.",
        "Die Diagnose dauerte gerade deshalb, weil es nichts Kaputtes zu sehen gab. Es stellte sich heraus, dass der entfernte Dienst das regelmäßige Signal, das der Client über eine GraphQL-Mutation schickte, nicht mehr annahm: Er ignorierte es, ohne einen Fehler zurückzugeben. Der alternative Weg, ein direktes POST an einen anderen Endpunkt, funktionierte weiterhin und lag sogar bereits ungenutzt im Quellcode. Bestätigt habe ich es im Ursprungsprojekt, wo ein offenes Ticket dasselbe Symptom beschrieb.",
        "Ich habe den Fix eingespielt, indem ich die Datei in den Containern bearbeitet habe. Und da kam die eigentliche Lektion: **Der Fix lag in der beschreibbaren Schicht des Containers und verschwand, sobald das Image aktualisiert wurde.** Wieder stillschweigend. Die dauerhafte Lösung war, die gepatchte Datei auf dem Host zu halten und sie aus dem Stack schreibgeschützt einzuhängen, damit sie jede Neuerstellung überlebt — und zu dokumentieren, wann dieser Mount wieder entfernt werden muss, damit er keine künftige Version verdeckt, die den Fix schon enthält.",
      ],
    },
    {
      id: "automatizacion",
      heading: "Den Betrieb automatisieren, nicht nur die Dienste",
      bullets: [
        {
          term: "Push-Benachrichtigungen",
          text: "Ein selbst gehosteter ntfy-Server und ein Skript, das die Logs mehrerer Container parallel verfolgt, die relevanten Ereignisse erkennt und mich benachrichtigt. Ich erfahre es lieber aus einer Meldung als beim Log-Lesen.",
        },
        {
          term: "Start auf Abruf",
          text: "Einer der schwereren Dienste läuft nicht durchgehend: Ein Proxy lauscht auf seinem Port, erkennt die erste Verbindung und startet ihn; ein anderer Prozess fährt ihn nach einer Weile ohne Nutzung wieder herunter. So verbraucht er in den Stunden, in denen ihn niemand braucht — also fast immer — keine CPU.",
        },
        {
          term: "Konfigurationsänderungen per Skript",
          text: "Ein Konto zu einem Automatisierungs-Stack hinzuzufügen ist ein Skript, das das Passwort auf der Konsole abfragt, ohne es zu speichern, den nächsten freien Platz sucht, den Diff zeigt, nur nach Bestätigung anwendet, über die Portainer-API neu ausrollt und prüft, ob der Container hochgekommen ist.",
        },
      ],
    },
    {
      id: "aprendizaje",
      heading: "Was ich mitnehme",
      body: [
        "Dass die Fehler, die wirklich teuer werden, die stillen sind. Ein Container, der abstürzt, löst einen Alarm aus; einer, der läuft, ohne seine Arbeit zu tun, kann tagelang unbemerkt bleiben. Seitdem überlege ich beim Bauen zuerst, woran ich merken werde, dass etwas nicht mehr funktioniert.",
        "Und dass ein Fix, der ein Deployment nicht übersteht, kein Fix ist. Er ist ein Countdown.",
      ],
    },
  ],
  links: [],
  repo: {
    visibility: "private",
    note: "Die Konfiguration enthält Zugangsdaten und die Netztopologie einer produktiven Maschine, deshalb ist das Repository privat.",
  },
};
